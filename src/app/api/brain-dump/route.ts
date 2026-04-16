// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Brain Dump API Route (/api/brain-dump)
// Receives raw text, parses via AI into structured tasks, habits, emotions
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';
import { parseBrainDump } from '@/lib/ai/brain-dump/parser';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  // ── Auth ──
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Parse body ──
  let body: { text: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.text || typeof body.text !== 'string' || body.text.trim().length < 3) {
    return NextResponse.json({ error: 'Missing or too-short "text" field' }, { status: 400 });
  }

  if (body.text.length > 10000) {
    return NextResponse.json({ error: 'Text too long (max 10,000 characters)' }, { status: 400 });
  }

  // ── Get user context from Convex ──
  let userName = 'User';
  let existingTaskCount = 0;
  let goalTitles: { title: string }[] = [];

  try {
    const token = await getToken({ template: 'convex' });
    if (token) {
      convex.setAuth(token);
      const user = await convex.query(api.users.current, {});
      userName = user?.name ?? userName;

      // Count open tasks
      const tasks = await convex.query(api.tasks.list, {});
      if (Array.isArray(tasks)) {
        existingTaskCount = tasks.filter(
          (t: { status?: string }) => t.status !== 'completed' && t.status !== 'cancelled'
        ).length;
      }

      // Get active goals
      const goals = await convex.query(api.goals.listActive, {});
      if (Array.isArray(goals)) {
        goalTitles = goals
          .map((g: { title: string }) => ({ title: g.title }));
      }
    }
  } catch (err) {
    console.warn('[BrainDump] Failed to load user context, continuing with defaults:', err);
  }

  // ── Parse brain dump ──
  const result = await parseBrainDump({
    rawText: body.text,
    userContext: {
      name: userName,
      existingTaskCount,
      goals: goalTitles,
    },
  });

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
        attempts: result.attempts,
        latencyMs: result.totalLatencyMs,
      },
      { status: 422 }
    );
  }

  // ── Get user ref for Convex ──
  let currentUserData: Awaited<ReturnType<typeof currentUser>> | null = null;
  try {
    currentUserData = await currentUser();
  } catch {
    // non-critical
  }

  return NextResponse.json({
    success: true,
    data: result.data,
    provider: result.provider,
    attempts: result.attempts,
    latencyMs: result.totalLatencyMs,
    userName: currentUserData?.firstName ?? userName,
  });
}
