// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Admin Metrics API
// GET /api/admin/metrics
//
// Returns activation + retention metrics from Convex.
// Protected by Authorization: Bearer <BILLING_WEBHOOK_SYNC_SECRET>
// Server-side only — never called from the client.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ── Rate-limit for auth failures (brute-force protection) ────────────────
const AUTH_FAIL_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_AUTH_FAILURES = 5;
const authFailures = new Map<string, { count: number; blockedUntil: number }>();

function getIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function isAuthBlocked(ip: string): boolean {
  const entry = authFailures.get(ip);
  if (!entry) return false;
  if (Date.now() > entry.blockedUntil) {
    authFailures.delete(ip);
    return false;
  }
  return entry.count >= MAX_AUTH_FAILURES;
}

function recordAuthFailure(ip: string): void {
  const entry = authFailures.get(ip);
  if (!entry || Date.now() > entry.blockedUntil) {
    authFailures.set(ip, { count: 1, blockedUntil: Date.now() + AUTH_FAIL_WINDOW_MS });
  } else {
    entry.count += 1;
  }
  console.warn(`[admin/metrics] Auth failure from ${ip} (attempt ${authFailures.get(ip)?.count})`);
}

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // ── Brute-force protection ─────────────────────────────────────────────
  const ip = getIp(req);
  if (isAuthBlocked(ip)) {
    return NextResponse.json({ error: 'Too many failed attempts' }, { status: 429 });
  }

  // ── Auth ───────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    recordAuthFailure(ip);
    return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
  }

  const expected = process.env.BILLING_WEBHOOK_SYNC_SECRET ?? '';
  if (!expected) {
    console.error('[admin/metrics] BILLING_WEBHOOK_SYNC_SECRET not configured');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  // Constant-time comparison against the secret
  if (expected.length !== token.length) {
    recordAuthFailure(ip);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  if (mismatch !== 0) {
    recordAuthFailure(ip);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // ── Query Convex ───────────────────────────────────────────────────────────
  try {
    const metrics = await convex.query(api.users.getActivationMetrics, {
      adminSecret: token,
    });

    return NextResponse.json(
      {
        ok: true,
        metrics,
        // Human-readable summary for quick monitoring alerts
        summary: {
          users: metrics.total_users,
          onboarding_rate: `${metrics.onboarding_completion_rate}%`,
          pro_rate: `${metrics.pro_conversion_rate}%`,
          d1_retention: `${metrics.d1_retention_rate}%`,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('[admin/metrics] Convex query failed:', err);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 502 }
    );
  }
}
