// ═══════════════════════════════════════════════════════════════════════════════
// Resurgo — AI Life Coach API Route (/api/coach)
// The Living System: authenticated AI chat → structured actions → Convex mutations
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

import { callAIJson } from '@/lib/ai/provider-router';
import { buildCoachingSystemPrompt } from '@/lib/ai/actions/action-prompt';
import { AICoachResponseSchema, type AICoachResponse } from '@/lib/ai/actions/schema';
import { executeActions, type ActionResult } from '@/lib/ai/actions/executor';
import { updatePsychProfile } from '@/lib/ai/psychology/profile-builder';
import { buildAdaptiveCoachingInstructions } from '@/lib/ai/psychology/adaptive-prompt';
import type { PsychologicalProfile } from '@/lib/ai/psychology/profile-schema';
import { getArchetypeConfig } from '@/lib/ai/onboarding/archetypes';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface CoachRequest {
  message: string;
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
  confirmActions?: number[]; // action indices user confirmed from previous `suggest`
}

interface CoachResponse {
  message: string;
  actionResults: ActionResult[];
  pendingSuggestions: ActionResult[];
  memoryUpdated: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
async function getUserContext(clerkToken: string) {
  convex.setAuth(clerkToken);
  try {
    const [user, tasks, habits, goals] = await Promise.all([
      convex.query(api.users.current, {}),
      convex.query(api.tasks.list, { status: 'todo' }).catch(() => []),
      convex.query(api.habits.listActive, {}).catch(() => []),
      convex.query(api.goals.listActive, {}).catch(() => []),
    ]);
    return {
      user,
      activeTasks: (tasks as unknown[]).length,
      activeHabits: (habits as unknown[]).length,
      activeGoals: (goals as unknown[]).length,
    };
  } catch {
    return { user: null, activeTasks: 0, activeHabits: 0, activeGoals: 0 };
  }
}

async function loadPsychProfile(clerkToken: string): Promise<PsychologicalProfile | null> {
  convex.setAuth(clerkToken);
  try {
    const raw = await convex.query((api as unknown as Record<string, Record<string, unknown>>).psychology.getProfile as Parameters<typeof convex.query>[0], {});
    if (!raw) return null;
    return JSON.parse(raw.profileData) as PsychologicalProfile;
  } catch {
    return null;
  }
}

async function savePsychProfile(
  clerkToken: string,
  profile: PsychologicalProfile
): Promise<void> {
  convex.setAuth(clerkToken);
  try {
    await convex.mutation((api as unknown as Record<string, Record<string, unknown>>).psychology.upsertProfile as Parameters<typeof convex.mutation>[0], {
      profileData: JSON.stringify(profile),
    });
  } catch (err) {
    console.warn('[Coach] Failed to save psych profile:', err);
  }
}

async function updateUserMemory(
  clerkToken: string,
  memoryPatch: string
): Promise<void> {
  convex.setAuth(clerkToken);
  try {
    await convex.mutation(api.users.updateSummaryMemory, { patch: memoryPatch });
  } catch {
    // best effort
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/coach
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse<CoachResponse | { error: string }>> {
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
  let body: CoachRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { message, conversationHistory = [], confirmActions = [] } = body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  if (message.length > 2000) {
    return NextResponse.json({ error: 'message too long (max 2000 chars)' }, { status: 400 });
  }

  // ── Load context in parallel ──────────────────────────────────────────────
  const [clerkUser, { user: convexUser, activeTasks, activeHabits, activeGoals }, psychProfile] = await Promise.all([
    currentUser().catch(() => null),
    getUserContext(clerkToken),
    loadPsychProfile(clerkToken),
  ]);

  const userName = clerkUser?.firstName ?? 'friend';
  const convexUserRecord = convexUser as unknown as Record<string, unknown>;
  const summaryMemory = (convexUserRecord?.summaryMemory as string) ?? '';

  // ── Archetype context ─────────────────────────────────────────────────────
  const userArchetype = (convexUserRecord?.archetype as string) ?? null;
  const archetypeConfig = userArchetype ? getArchetypeConfig(userArchetype) : null;
  const archetypeInstructions = archetypeConfig
    ? `\n\nUSER ARCHETYPE: ${archetypeConfig.label} (${archetypeConfig.emoji})\n` +
      `Description: ${archetypeConfig.description}\n` +
      `Coaching tone: ${archetypeConfig.coaching.defaultTone}\n` +
      `Motivational approach: ${archetypeConfig.coaching.motivationalApproach}\n` +
      `Check-in frequency preference: ${archetypeConfig.coaching.checkInFrequency}\n` +
      `Adapt all responses to suit this archetype.`
    : '';

  // ── Build system prompt ───────────────────────────────────────────────────
  const adaptiveInstructions = buildAdaptiveCoachingInstructions(psychProfile) + archetypeInstructions;
  const todayDate = new Date().toISOString().slice(0, 10);

  const systemPrompt = buildCoachingSystemPrompt({
    todayDate,
    userName,
    activeTasks,
    activeHabits,
    activeGoals,
    currentStreak: (convexUser as unknown as Record<string, unknown>)?.currentStreak as number ?? 0,
    recentMoodAvg: undefined,
    summaryMemory,
    adaptiveInstructions,
  });

  // ── Build message array (sanitized) ────────────────────────────────────────
  const ALLOWED_HISTORY_ROLES = new Set(['user', 'assistant']);
  const sanitizedHistory = (Array.isArray(conversationHistory) ? conversationHistory : [])
    .slice(-10)
    .filter((m): m is { role: 'user' | 'assistant'; content: string } =>
      typeof m === 'object' && m !== null &&
      typeof m.content === 'string' && m.content.length <= 4000 &&
      ALLOWED_HISTORY_ROLES.has(m.role)
    )
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content.slice(0, 4000) }));

  const validConfirmActions = (Array.isArray(confirmActions) ? confirmActions : [])
    .filter((a): a is number => typeof a === 'number' && Number.isFinite(a));

  const messages: { role: 'user' | 'assistant' | 'system'; content: string }[] = [
    { role: 'system', content: systemPrompt },
    ...sanitizedHistory,
    { role: 'user', content: message },
  ];

  // ── Call AI ───────────────────────────────────────────────────────────────
  let coachResponse: AICoachResponse;
  try {
    const { data: rawResult } = await callAIJson<AICoachResponse>(messages, {
      taskType: 'coaching',
      temperature: 0.7,
      maxTokens: 1200,
    });

    const parsed = AICoachResponseSchema.safeParse(rawResult);
    if (!parsed.success) {
      // Fallback: treat raw as plain text message
      coachResponse = {
        message: typeof rawResult === 'string' ? rawResult : ((rawResult as Record<string, unknown>)?.message as string) ?? 'I had trouble generating a response. Please try again.',
        actions: [],
        requiresConfirmation: [],
      };
    } else {
      coachResponse = parsed.data;
    }
  } catch (err) {
    console.error('[Coach] AI call failed:', err);
    return NextResponse.json({ error: 'AI provider unreachable' }, { status: 503 });
  }

  // ── Execute actions (skip those needing confirmation) ─────────────────────
  const confirmSet = new Set(coachResponse.requiresConfirmation ?? []);
  // Also execute any previously-confirmed suggestions from this request
  for (const idx of validConfirmActions) confirmSet.delete(idx);

  const actionResults = await executeActions(clerkToken, coachResponse, confirmSet)
    .catch((err) => {
      console.error('[Coach] executeActions error:', err);
      return [] as ActionResult[];
    });

  const pendingSuggestions = actionResults.filter((r) => r.requiresConfirmation);

  // ── Update rolling memory (best effort, background) ───────────────────────
  let memoryUpdated = false;
  if (coachResponse.memoryPatch) {
    updateUserMemory(clerkToken, coachResponse.memoryPatch).then(() => {
      memoryUpdated = true;
    }).catch(() => {});
  }

  // ── Update psych profile every 3rd interaction (background) ───────────────
  const interactionCount = (psychProfile?.interactionCount ?? 0) + 1;
  if (interactionCount % 3 === 0) {
    const conversationSnippet = [
      ...conversationHistory.slice(-4).map((m) => `${m.role}: ${m.content}`),
      `user: ${message}`,
      `assistant: ${coachResponse.message}`,
    ].join('\n');

    updatePsychProfile({
      conversationSnippet,
      currentProfile: psychProfile,
      interactionCount,
    }).then((updatedProfile) => {
      if (updatedProfile) {
        savePsychProfile(clerkToken, updatedProfile);
      }
    }).catch(() => {});
  }

  // ── Respond ───────────────────────────────────────────────────────────────
  return NextResponse.json({
    message: coachResponse.message,
    actionResults: actionResults.filter((r) => !r.requiresConfirmation),
    pendingSuggestions,
    memoryUpdated,
  });
}
