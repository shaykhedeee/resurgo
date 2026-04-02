// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/v1/goals — list active goals
// Authorization: Bearer rsg_<key>
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { resolveApiKey, convexClient } from '../_lib/auth';
import { api } from '../../../../../convex/_generated/api';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await resolveApiKey(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const goals = await convexClient.query(api.goals.listActive, {}).catch(() => []);
  return NextResponse.json({ goals });
}
