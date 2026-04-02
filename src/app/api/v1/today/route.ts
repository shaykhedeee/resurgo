// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/v1/today
// Returns the authenticated user's tasks, habits, and goals for today.
// Authorization: Bearer rsg_<key>
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { resolveApiKey, convexClient } from '../_lib/auth';
import { api } from '../../../../../convex/_generated/api';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await resolveApiKey(req.headers.get('authorization'));
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date().toISOString().split('T')[0];

  const [tasks, habits, goals] = await Promise.all([
    convexClient.query(api.tasks.list, { status: 'todo' }).catch(() => []),
    convexClient.query(api.habits.listActive, {}).catch(() => []),
    convexClient.query(api.goals.listActive, {}).catch(() => []),
  ]);

  return NextResponse.json({
    date: today,
    tasks,
    habits,
    goals,
  });
}
