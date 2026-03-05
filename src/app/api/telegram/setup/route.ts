// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Telegram Webhook Auto-Setup
// POST /api/telegram/setup
// Automatically registers the webhook URL with Telegram Bot API.
//
// Protected by TELEGRAM_SETUP_SECRET header (or BILLING_WEBHOOK_SYNC_SECRET).
// Run this once after deployment to connect your bot.
//
// Usage (curl):
//   curl -X POST https://resurgo.life/api/telegram/setup \
//     -H "x-setup-secret: YOUR_SETUP_SECRET" \
//     -H "Content-Type: application/json"
//
// Or visit GET /api/telegram/setup to see current webhook info.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN       = process.env.TELEGRAM_BOT_TOKEN ?? '';
const WEBHOOK_SECRET  = process.env.TELEGRAM_WEBHOOK_SECRET ?? '';
const APP_URL         = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://resurgo.life';
// Reuse billing sync secret as setup guard (or set TELEGRAM_SETUP_SECRET)
const SETUP_SECRET    = process.env.TELEGRAM_SETUP_SECRET ?? process.env.BILLING_WEBHOOK_SYNC_SECRET ?? '';

// ─────────────────────────────────────────────────────────────────────────────
// POST — Register webhook with Telegram
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Guard: verify setup secret
  const incoming = req.headers.get('x-setup-secret') ?? req.headers.get('authorization')?.replace('Bearer ', '');
  if (SETUP_SECRET && incoming !== SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized — provide x-setup-secret header' }, { status: 401 });
  }

  if (!BOT_TOKEN) {
    return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not configured' }, { status: 500 });
  }

  const webhookUrl = `${APP_URL}/api/telegram/webhook`;

  // Build Telegram setWebhook URL
  const tgUrl = new URL(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`);
  tgUrl.searchParams.set('url', webhookUrl);
  tgUrl.searchParams.set('allowed_updates', JSON.stringify(['message', 'callback_query', 'inline_query']));
  tgUrl.searchParams.set('drop_pending_updates', 'true');
  if (WEBHOOK_SECRET) {
    tgUrl.searchParams.set('secret_token', WEBHOOK_SECRET);
  }

  try {
    const res = await fetch(tgUrl.toString(), { method: 'POST' });
    const data = (await res.json()) as { ok: boolean; description?: string; result?: unknown };

    if (!data.ok) {
      return NextResponse.json(
        { error: `Telegram API error: ${data.description ?? 'Unknown error'}`, telegram: data },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      webhookRegistered: webhookUrl,
      secretTokenSet: !!WEBHOOK_SECRET,
      telegram: data,
      message: `✅ Webhook successfully registered at ${webhookUrl}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to call Telegram API: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET — Fetch current webhook info from Telegram
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const incoming = req.headers.get('x-setup-secret') ?? '';
  // Allow public read (safe — no secrets exposed) if no secret is required,
  // or validate if SETUP_SECRET is configured.
  if (SETUP_SECRET && incoming && incoming !== SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!BOT_TOKEN) {
    return NextResponse.json({
      configured: false,
      message: 'TELEGRAM_BOT_TOKEN not set — add it to your environment variables.',
      webhookUrl: `${APP_URL}/api/telegram/webhook`,
      setupCommand: `curl -X POST ${APP_URL}/api/telegram/setup -H "x-setup-secret: YOUR_SECRET"`,
    });
  }

  const expectedWebhook = `${APP_URL}/api/telegram/webhook`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
    const data = (await res.json()) as {
      ok: boolean;
      result?: { url?: string; has_custom_certificate?: boolean; pending_update_count?: number; last_error_message?: string; last_error_date?: number };
    };

    const currentUrl = data.result?.url ?? '';
    const isRegistered = currentUrl === expectedWebhook;

    return NextResponse.json({
      configured: true,
      webhookRegistered: isRegistered,
      currentWebhookUrl: currentUrl || '(none)',
      expectedWebhookUrl: expectedWebhook,
      pendingUpdates: data.result?.pending_update_count ?? 0,
      lastError: data.result?.last_error_message ?? null,
      secretTokenSet: !!WEBHOOK_SECRET,
      telegram: data,
      ...(isRegistered
        ? { status: '✅ Webhook is correctly registered' }
        : {
            status: '⚠️ Webhook not registered or points to wrong URL',
            fix: `Run: curl -X POST ${APP_URL}/api/telegram/setup -H "x-setup-secret: YOUR_SECRET"`,
          }),
    });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to fetch webhook info: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
  }
}
