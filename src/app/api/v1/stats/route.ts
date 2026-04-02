import { NextRequest, NextResponse } from 'next/server';
import { resolveApiKey } from '../_lib/auth';

export async function GET(req: NextRequest) {
  const authResult = await resolveApiKey(req.headers.get('authorization'));
  if (!authResult) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  return NextResponse.json({
    stats: {
      message: 'Connect via Convex client SDK to get real-time stats.',
      docs: 'https://resurgo.life/docs#stats',
    },
  });
}
