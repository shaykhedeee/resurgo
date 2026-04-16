// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/v1/habits — list active habits
// Authorization: Bearer rsg_<key>
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { resolveApiKey, convexClient } from '../_lib/auth';
import { api } from '../../../../../convex/_generated/api';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await resolveApiKey(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const habits = await convexClient.query(api.restApi.listHabits, { userId: auth.ownerId }).catch(() => []);
  return NextResponse.json({ habits });
}
