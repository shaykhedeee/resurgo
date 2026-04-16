import { NextRequest, NextResponse } from 'next/server';
import { resolveApiKey, convexClient } from '../_lib/auth';
import { api } from '../../../../../convex/_generated/api';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await resolveApiKey(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const stats = await convexClient.query(api.restApi.dashboardStats, { userId: auth.ownerId }).catch(() => null);
  if (!stats) {
    return NextResponse.json({ error: 'Failed to retrieve stats' }, { status: 500 });
  }
  return NextResponse.json({ stats });
}
