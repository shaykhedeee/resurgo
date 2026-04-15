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
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? '';
  const clerkPk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
  const clerkIssuerDomain = process.env.CLERK_JWT_ISSUER_DOMAIN ?? process.env.CLERK_FRONTEND_API_URL ?? '';

  const hasConvex = !!convexUrl;
  const hasClerk = !!clerkPk;
  const hasClerkIssuer = !!clerkIssuerDomain;
  const isPlaceholderClerkKey = /REPLACE_ME|YOUR_|PLACEHOLDER/i.test(clerkPk);
  const hasValidClerkKey = hasClerk && clerkPk.startsWith('pk_') && !isPlaceholderClerkKey;
  const hasValidConvexUrl = /^https:\/\/.+\.convex\.cloud$/i.test(convexUrl);
  const authMode = clerkPk.startsWith('pk_live_') ? 'live' : clerkPk.startsWith('pk_test_') ? 'test' : 'unknown';
  const issuerLooksProd = clerkIssuerDomain.includes('clerk.resurgo.life') || clerkIssuerDomain.includes('.clerk.accounts.com');
  const issuerLooksDev = clerkIssuerDomain.includes('.clerk.accounts.dev');
  const keyIssuerMismatch =
    (authMode === 'live' && issuerLooksDev) ||
    (authMode === 'test' && issuerLooksProd);
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
  const isCriticalReady = hasValidConvexUrl && hasValidClerkKey && hasClerkIssuer && !keyIssuerMismatch;
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
        convex: hasValidConvexUrl ? 'configured' : hasConvex ? 'invalid_format' : 'missing',
        clerk: hasValidClerkKey ? 'configured' : hasClerk ? 'invalid_or_placeholder' : 'missing',
        clerk_jwt_issuer: hasClerkIssuer ? 'configured' : 'missing',
        auth_mode: authMode,
        key_issuer_mismatch: keyIssuerMismatch,
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
