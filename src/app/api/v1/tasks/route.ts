// ═══════════════════════════════════════════════════════════════════════════════
// GET  /api/v1/tasks  — list open tasks
// POST /api/v1/tasks  — create a task
// Authorization: Bearer rsg_<key>
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { resolveApiKey, convexClient } from '../_lib/auth';
import { api } from '../../../../../convex/_generated/api';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await resolveApiKey(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = (searchParams.get('status') as 'todo' | 'done' | 'all') ?? 'todo';

  const tasks = await convexClient.query(api.tasks.list, { status }).catch(() => []);
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await resolveApiKey(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { title, priority, dueDate, energyRequired, tags } = body as Record<string, unknown>;

  if (typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }

  const id = await convexClient.mutation(api.tasks.create, {
    title: title.trim(),
    priority: (priority as string) ?? 'medium',
    dueDate: (dueDate as string) ?? undefined,
    energyRequired: (energyRequired as string) ?? undefined,
    tags: Array.isArray(tags) ? (tags as string[]) : undefined,
  });

  return NextResponse.json({ id }, { status: 201 });
}
