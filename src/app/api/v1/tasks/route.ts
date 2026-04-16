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
  const statusParam = searchParams.get('status') ?? 'todo';
  const allowedStatuses = ['todo', 'done', 'in_progress', 'all'] as const;
  if (!(allowedStatuses as readonly string[]).includes(statusParam)) {
    return NextResponse.json({ error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` }, { status: 400 });
  }
  const status = statusParam === 'all' ? undefined : (statusParam as 'todo' | 'done' | 'in_progress');

  const tasks = await convexClient.query(api.restApi.listTasks, { userId: auth.ownerId, status }).catch(() => []);
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

  const validPriorities = ['high', 'medium', 'low', 'urgent'] as const;
  const validEnergy = ['high', 'medium', 'low'] as const;
  const priorityVal = typeof priority === 'string' && (validPriorities as readonly string[]).includes(priority)
    ? priority as typeof validPriorities[number]
    : 'medium';
  const energyVal = typeof energyRequired === 'string' && (validEnergy as readonly string[]).includes(energyRequired)
    ? energyRequired as typeof validEnergy[number]
    : undefined;

  const result = await convexClient.mutation(api.restApi.createTask, {
    userId: auth.ownerId,
    title: title.trim(),
    priority: priorityVal,
    dueDate: typeof dueDate === 'string' ? dueDate : undefined,
    energyRequired: energyVal,
    tags: Array.isArray(tags) ? (tags as string[]) : undefined,
  });

  return NextResponse.json(result, { status: 201 });
}
