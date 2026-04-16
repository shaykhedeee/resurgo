import { NextRequest, NextResponse } from 'next/server';
import { resolveApiKey, convexClient } from '../../_lib/auth';
import { api } from '../../../../../../convex/_generated/api';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await resolveApiKey(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { habitId, date, completed, mood, note } = body;

  if (typeof habitId !== 'string' || !habitId) {
    return NextResponse.json({ error: 'habitId is required' }, { status: 400 });
  }

  const today = new Date().toISOString().split('T')[0];
  const dateStr = typeof date === 'string' ? date : today;

  try {
    const result = await convexClient.mutation(api.restApi.logHabitCompletion, {
      userId: auth.ownerId,
      habitId,
      date: dateStr,
      completed: completed !== false,
      mood: typeof mood === 'number' ? mood : undefined,
      note: typeof note === 'string' ? note : undefined,
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to log habit';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
