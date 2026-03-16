// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Meta Marketing API: Insights/Reporting Route
// GET: fetch ad performance insights
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getInsights, getAccountInsightsSummary } from '@/lib/marketing/meta-api';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'shaykhede2005@gmail.com').split(',').map(e => e.trim());

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!email || !ADMIN_EMAILS.includes(email)) {
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const datePreset = searchParams.get('date_preset') || 'last_7d';
    const level = (searchParams.get('level') as 'campaign' | 'adset' | 'ad') || undefined;
    const objectId = searchParams.get('object_id') || undefined;
    const since = searchParams.get('since') || undefined;
    const until = searchParams.get('until') || undefined;
    const summary = searchParams.get('summary') === 'true';

    // Quick summary endpoint
    if (summary) {
      const insight = await getAccountInsightsSummary(datePreset);
      return NextResponse.json({ summary: insight });
    }

    // Detailed insights
    const time_range = since && until ? { since, until } : undefined;
    const insights = await getInsights({
      objectId,
      level,
      date_preset: time_range ? undefined : datePreset,
      time_range,
    });

    return NextResponse.json({ insights: insights.data, paging: insights.paging });
  } catch (error) {
    console.error('[Meta Insights GET]', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
