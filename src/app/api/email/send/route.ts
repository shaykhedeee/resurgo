// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Email Send API
// Internal API for triggering transactional emails.
// POST /api/email/send
// Body: { type: 'welcome' | 'streak-summary' | 'streak-at-risk', to, name, data? }
//
// Protected: requires valid Clerk auth OR internal secret.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { sendWelcomeEmail, sendStreakSummary, sendStreakAtRisk } from '@/lib/email';

const INTERNAL_SECRET = process.env.EMAIL_INTERNAL_SECRET;

export async function POST(req: NextRequest) {
  // Auth: either Clerk session OR internal secret header
  const internalKey = req.headers.get('x-internal-secret');
  const isInternalCall = INTERNAL_SECRET && internalKey === INTERNAL_SECRET;

  if (!isInternalCall) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const body = await req.json();
    const { type, to, name, data } = body;

    if (!type || !to) {
      return NextResponse.json({ error: 'Missing type or to' }, { status: 400 });
    }

    let result;
    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(to, name || 'there');
        break;
      case 'streak-summary':
        result = await sendStreakSummary(to, name || 'there', data || {});
        break;
      case 'streak-at-risk':
        result = await sendStreakAtRisk(to, name || 'there', data?.streak || 0);
        break;
      default:
        return NextResponse.json({ error: `Unknown email type: ${type}` }, { status: 400 });
    }

    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (err) {
    console.error('[Email API] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
