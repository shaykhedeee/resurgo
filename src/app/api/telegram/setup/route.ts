// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Telegram Bot Setup Utilities
// GET  /api/telegram/setup?action=register  → registers webhook with Telegram
// GET  /api/telegram/setup?action=status    → checks bot + webhook status
// GET  /api/telegram/setup?action=setmenu   → sets bot command menu
// GET  /api/telegram/setup?action=test      → sends a test message
// Admin-only: pass ?secret=ADMIN_SECRET
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://resurgo.life';
const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

const BOT_COMMANDS = [
  { command: 'start',     description: 'Connect your Resurgo account' },
  { command: 'status',    description: 'Your daily progress summary' },
  { command: 'habits',    description: 'Check habit streaks' },
  { command: 'goals',     description: 'View active goals' },
  { command: 'task',      description: 'Quick add a task' },
  { command: 'checkin',   description: 'Log your daily check-in' },
  { command: 'remind',    description: 'Set a reminder' },
  { command: 'coach',     description: 'Chat with your MARCUS coach' },
  { command: 'help',      description: 'Show all commands' },
];

async function tgCall(method: string, body?: Record<string, unknown>) {
  const res = await fetch(`${TG_API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'status';
  const secret = searchParams.get('secret');

  // Require admin secret for mutating actions
  const isAdmin = !ADMIN_SECRET || secret === ADMIN_SECRET;

  if (!BOT_TOKEN) {
    return NextResponse.json({
      error: 'TELEGRAM_BOT_TOKEN not set',
      setup: [
        '1. Message @BotFather on Telegram',
        '2. Send /newbot and follow instructions',
        '3. Copy the bot token',
        '4. Add to Vercel: TELEGRAM_BOT_TOKEN=your_token',
        '5. Also set TELEGRAM_WEBHOOK_SECRET=any_random_string',
        `6. Call: ${SITE_URL}/api/telegram/setup?action=register&secret=ADMIN_SECRET`,
      ],
    }, { status: 503 });
  }

  if (action === 'status') {
    if (!isAdmin) return NextResponse.json({ error: 'Admin secret required' }, { status: 401 });
    const [botInfo, webhookInfo] = await Promise.all([
      tgCall('getMe'),
      tgCall('getWebhookInfo'),
    ]);
    return NextResponse.json({
      bot: botInfo,
      webhook: webhookInfo,
      expectedWebhookUrl: `${SITE_URL}/api/telegram/webhook`,
      webhookRegistered: webhookInfo?.result?.url?.includes('/api/telegram/webhook'),
    });
  }

  if (action === 'register') {
    if (!isAdmin) return NextResponse.json({ error: 'Admin secret required' }, { status: 401 });
    const webhookUrl = `${SITE_URL}/api/telegram/webhook`;
    const result = await tgCall('setWebhook', {
      url: webhookUrl,
      secret_token: WEBHOOK_SECRET,
      allowed_updates: ['message', 'callback_query'],
    });
    return NextResponse.json({
      success: result.ok,
      webhookUrl,
      telegram: result,
      next: 'Now call /api/telegram/setup?action=setmenu to configure commands',
    });
  }

  if (action === 'setmenu') {
    if (!isAdmin) return NextResponse.json({ error: 'Admin secret required' }, { status: 401 });
    const result = await tgCall('setMyCommands', { commands: BOT_COMMANDS });
    return NextResponse.json({
      success: result.ok,
      commands: BOT_COMMANDS,
      telegram: result,
    });
  }

  if (action === 'test') {
    const chatId = searchParams.get('chat_id');
    if (!chatId) return NextResponse.json({ error: 'Provide ?chat_id=YOUR_TELEGRAM_ID' }, { status: 400 });
    const result = await tgCall('sendMessage', {
      chat_id: chatId,
      text: `🔥 <b>RESURGO BOT ONLINE</b>\n\nWebhook is live at: ${SITE_URL}/api/telegram/webhook\n\nSend /start to connect your account.`,
      parse_mode: 'HTML',
    });
    return NextResponse.json({ success: result.ok, telegram: result });
  }

  return NextResponse.json({
    actions: ['status', 'register (admin)', 'setmenu (admin)', 'test (needs ?chat_id)'],
    usage: `${SITE_URL}/api/telegram/setup?action=STATUS_OR_ACTION&secret=ADMIN_SECRET`,
  });
}
