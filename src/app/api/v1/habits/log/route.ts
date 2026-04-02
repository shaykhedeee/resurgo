import { NextRequest, NextResponse } from 'next/server';
import { resolveApiKey } from '../../_lib/auth';

export async function POST(req: NextRequest) {
  const authResult = await resolveApiKey(req.headers.get('authorization'));
  if (!authResult) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { habitId, date, completed } = body;

  if (!habitId) {
    return NextResponse.json({ error: 'habitId is required.' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: 'Use Convex client SDK for real-time habit logging.',
    receivedPayload: { habitId, date: date || new Date().toISOString().split('T')[0], completed: completed ?? true },
  });
}
