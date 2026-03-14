// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Health Check Endpoint
// GET /api/health
//
// Returns system status, version, and env-var readiness checks.
// Used by launch monitoring, uptime services, and CI smoke tests.
// No auth required — never exposes secret values, only boolean flags.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';

const APP_VERSION = '1.4.0';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const timestamp = new Date().toISOString();
  const env = process.env.NODE_ENV ?? 'unknown';
  const region = process.env.VERCEL_REGION ?? process.env.VERCEL_ENV ?? 'local';

  // ── Readiness checks (boolean only — never leak secret values) ─────────────
  const hasConvex = !!process.env.NEXT_PUBLIC_CONVEX_URL;
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasGroq = !!process.env.GROQ_API_KEY;
  const hasGA = !!(
    process.env.NEXT_PUBLIC_GA_ID &&
    process.env.NEXT_PUBLIC_GA_ID !== 'G-XXXXXXXXXX'
  );
  const hasMetaPixel = !!(
    process.env.NEXT_PUBLIC_META_PIXEL_ID &&
    process.env.NEXT_PUBLIC_META_PIXEL_ID !== 'REPLACE_ME_WITH_PIXEL_ID'
  );
  const hasDodoWebhookSecret = !!process.env.DODO_WEBHOOK_SECRET;
  const hasDodoApiKey = !!process.env.DODO_API_KEY;
  const hasBillingSync = !!process.env.BILLING_WEBHOOK_SYNC_SECRET;

  // ── Derive overall status ─────────────────────────────────────────────────
  // CRITICAL: app cannot function without Convex + Clerk
  const isCriticalReady = hasConvex && hasClerk;
  // BILLING: paid features won't work without Dodo config
  const isBillingReady = hasDodoWebhookSecret && hasDodoApiKey && hasBillingSync;
  // AI: coaching features degraded without Groq
  const isAIReady = hasGroq;

  const overallStatus: 'ok' | 'degraded' | 'error' = isCriticalReady
    ? isBillingReady && isAIReady
      ? 'ok'
      : 'degraded'
    : 'error';

  return NextResponse.json(
    {
      status: overallStatus,
      service: 'resurgo',
      version: APP_VERSION,
      timestamp,
      env,
      region,
      checks: {
        // Critical infrastructure
        convex: hasConvex ? 'configured' : 'missing',
        clerk: hasClerk ? 'configured' : 'missing',
        // AI services
        groq: hasGroq ? 'configured' : 'not_set',
        // Analytics (non-critical — app works without them)
        analytics: {
          ga4: hasGA ? 'configured' : 'not_set',
          meta_pixel: hasMetaPixel ? 'configured' : 'not_set',
        },
        // Billing
        billing: {
          dodo_webhook: hasDodoWebhookSecret ? 'configured' : 'not_set',
          dodo_api: hasDodoApiKey ? 'configured' : 'not_set',
          billing_sync: hasBillingSync ? 'configured' : 'not_set',
          ready: isBillingReady,
        },
      },
    },
    {
      status: overallStatus === 'error' ? 503 : 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Resurgo-Version': APP_VERSION,
      },
    }
  );
}
