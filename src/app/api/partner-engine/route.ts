// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Partner Engine API Route  POST /api/partner-engine
//
// Full flow:
//   1. Auth  →  2. Load context  →  3. Build system prompt
//   4. runPartnerEngineWithRetry  →  5. applyPartnerActions (Convex)
//   6. Return assistantMessage + changesFeed + signals
//
// The "partner feel": every message can create tasks, update goals,
// schedule nudges, update the moodboard — all through validated mutations.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

import { callAI } from '@/lib/ai/provider-router';
import type { LLMCall } from '@/lib/partner-engine/parser';
import { runPartnerEngineWithRetry } from '@/lib/partner-engine/parser';
import { buildPartnerEngineSystemPrompt } from '@/lib/partner-engine/systemPrompt';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ─── Request / Response types ─────────────────────────────────────────────────

interface PartnerEngineRequest {
  message: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

interface ChangeFeedEntry {
  type: string;
  label: string;
  entityId?: string;
  status: 'applied' | 'skipped' | 'failed';
  reason?: string;
}

interface PartnerEngineResponse {
  assistantMessage: string;
  changesFeed: ChangeFeedEntry[];
  memoryPatch: string;
  signals?: Record<string, unknown>;
  meta: {
    attempts: number;
    provider?: string;
    model?: string;
    actionsApplied: number;
    actionsSkipped: number;
    actionsFailed: number;
  };
}

// ─── LLM adapter: wraps callAI into the LLMCall interface ────────────────────
//
// The parser expects:  (args) => Promise<{ text, provider?, model?, latencyMs? }>
// callAI expects:      (messages[], options) => Promise<{ content, provider, model }>

function buildLLMAdapter(): LLMCall {
  return async ({ system, user, temperature, maxTokens, jsonMode }) => {
    const t0 = Date.now();
    const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ];
    const result = await callAI(messages, {
      taskType: 'json',
      temperature,
      maxTokens,
      requireJson: jsonMode ?? true,
    });
    return {
      text: result.content,
      provider: result.provider,
      model: result.model,
      latencyMs: Date.now() - t0,
    };
  };
}

// ─── Context loaders ──────────────────────────────────────────────────────────

async function loadPartnerContext(clerkToken: string): Promise<{
  topTasks: Array<{ id: string; title: string; dueDate?: string | null; priority?: string }>;
  activeGoals: Array<{ id: string; title: string }>;
  moodboardId: string | null;
  segment: string | null;
  memorySummary: string;
  timezone: string;
  tone: string;
  reminderIntensity: string;
}> {
  convex.setAuth(clerkToken);
  try {
    const raw = await convex.query((api as any).partnerEngine.getPartnerContext, {});
    return JSON.parse(raw);
  } catch {
    return {
      topTasks: [],
      activeGoals: [],
      moodboardId: null,
      segment: null,
      memorySummary: '',
      timezone: 'UTC',
      tone: 'balanced',
      reminderIntensity: 'normal',
    };
  }
}

async function applyActionsToConvex(
  clerkToken: string,
  actions: unknown[]
): Promise<ChangeFeedEntry[]> {
  if (actions.length === 0) return [];
  convex.setAuth(clerkToken);
  try {
    const resultJson = await convex.mutation(
      (api as any).partnerEngine.applyPartnerActions,
      { actionsJson: JSON.stringify(actions) }
    );
    const results = JSON.parse(resultJson) as Array<{
      clientRef: string;
      type: string;
      status: 'applied' | 'skipped' | 'failed';
      reason?: string;
      entityId?: string;
      label?: string;
    }>;
    return results.map((r) => ({
      type: r.type,
      label: r.label ?? r.type,
      entityId: r.entityId,
      status: r.status,
      reason: r.reason,
    }));
  } catch (err) {
    console.error('[PartnerEngine] applyPartnerActions failed:', err);
    return actions.map((a: any) => ({
      type: a?.type ?? 'unknown',
      label: `Failed to apply ${a?.type ?? 'action'}`,
      status: 'failed',
      reason: (err instanceof Error) ? err.message : 'Convex error',
    }));
  }
}

// ─── Build structured logger for runPartnerEngineWithRetry ───────────────────

function makeLogger() {
  return (evt: Record<string, unknown>) => {
    const { event, ...rest } = evt;
    if ((event as string)?.includes('failed')) {
      console.warn('[PartnerEngine]', event, rest);
    } else {
      console.log('[PartnerEngine]', event, rest);
    }
  };
}

// ─── POST /api/partner-engine ─────────────────────────────────────────────────

export async function POST(
  req: NextRequest
): Promise<NextResponse<PartnerEngineResponse | { error: string }>> {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let clerkToken: string;
  try {
    const token = await getToken({ template: 'convex' });
    if (!token) throw new Error('No token');
    clerkToken = token;
  } catch {
    return NextResponse.json({ error: 'Could not obtain auth token' }, { status: 401 });
  }

  // ── Parse request ─────────────────────────────────────────────────────────
  let body: PartnerEngineRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { message, conversationHistory = [] } = body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }
  if (message.length > 3000) {
    return NextResponse.json({ error: 'message too long (max 3000 chars)' }, { status: 400 });
  }

  // ── Parallel context load ─────────────────────────────────────────────────
  const [clerkUser, ctx] = await Promise.all([
    currentUser().catch(() => null),
    loadPartnerContext(clerkToken),
  ]);

  const userName = clerkUser?.firstName ?? undefined;
  const todayISO = new Date().toISOString().slice(0, 10);

  // ── Build system prompt ───────────────────────────────────────────────────
  const systemPrompt = buildPartnerEngineSystemPrompt({
    todayISO,
    userName,
    timezone: ctx.timezone,
    memorySummary: ctx.memorySummary,
    segment: ctx.segment ?? undefined,
    tone: ctx.tone,
    reminderIntensity: ctx.reminderIntensity,
    topTasks: ctx.topTasks,
    activeGoals: ctx.activeGoals,
    moodboardId: ctx.moodboardId,
  });

  // ── Build user message with conversation history injected ─────────────────
  const historyBlock = conversationHistory
    .slice(-6) // last 3 turns (6 messages) for context
    .map((m) => `${m.role === 'user' ? 'User' : 'Partner'}: ${m.content}`)
    .join('\n');

  const userMessage = historyBlock
    ? `${historyBlock}\nUser: ${message}`
    : message;

  // ── Call the partner engine (with repair/retry) ───────────────────────────
  const llm = buildLLMAdapter();
  const engineResult = await runPartnerEngineWithRetry({
    llm,
    systemPrompt,
    userMessage,
    logger: makeLogger(),
    maxAttempts: 3,
  });

  if (!engineResult.ok) {
    // Graceful degradation: return the safe error message from the parser
    return NextResponse.json({
      assistantMessage: engineResult.message,
      changesFeed: [],
      memoryPatch: '',
      meta: {
        attempts: engineResult.meta.attempts,
        actionsApplied: 0,
        actionsSkipped: 0,
        actionsFailed: 0,
      },
    });
  }

  const { data, meta } = engineResult;

  // ── Apply actions to Convex ───────────────────────────────────────────────
  const changesFeed = await applyActionsToConvex(clerkToken, data.actions);

  // ── Update memory (best effort, background) ───────────────────────────────
  if (data.memoryPatch && data.memoryPatch.trim()) {
    convex.setAuth(clerkToken);
    convex
      .mutation(api.users.updateSummaryMemory, { patch: data.memoryPatch })
      .catch(() => {});
  }

  // ── Aggregate stats ───────────────────────────────────────────────────────
  const actionsApplied = changesFeed.filter((e) => e.status === 'applied').length;
  const actionsSkipped = changesFeed.filter((e) => e.status === 'skipped').length;
  const actionsFailed  = changesFeed.filter((e) => e.status === 'failed').length;

  // ── Respond ───────────────────────────────────────────────────────────────
  return NextResponse.json({
    assistantMessage: data.assistantMessage,
    changesFeed,
    memoryPatch: data.memoryPatch,
    signals: data.signals as Record<string, unknown> | undefined,
    meta: {
      attempts: meta.attempts,
      provider: meta.provider,
      model: meta.model,
      actionsApplied,
      actionsSkipped,
      actionsFailed,
    },
  });
}
