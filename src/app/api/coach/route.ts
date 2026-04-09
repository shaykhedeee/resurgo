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
// Rate Limiting (per-user, sliding window)
// ─────────────────────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_FREE = 10;       // Free users: 10 messages per minute
const RATE_LIMIT_PREMIUM = 40;    // Paid users: 40 messages per minute
const RATE_LIMIT_WINDOW = 60_000; // 1 minute

function checkCoachRateLimit(userId: string, isPaid: boolean): boolean {
  const limit = isPaid ? RATE_LIMIT_PREMIUM : RATE_LIMIT_FREE;
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

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
    const [user, tasks, habits, goals, moodEntries, sleepLogs, dailyCheckIns] = await Promise.all([
      convex.query(api.users.current, {}),
      convex.query(api.tasks.list, { status: 'todo' }).catch(() => []),
      convex.query(api.habits.listActive, {}).catch(() => []),
      convex.query(api.goals.listActive, {}).catch(() => []),
      convex.query(api.wellness.recentMoods, {}).catch(() => []),
      convex.query(api.wellness.recentSleep, {}).catch(() => []),
      convex.query(api.dailyCheckIns.getToday, {}).catch(() => null),
    ]);
    // Compute recent mood average from last 7 entries
    const moods = moodEntries as unknown as Array<{ score?: number }>;
    const moodScores = Array.isArray(moods) ? moods.filter(m => m?.score).map(m => m.score!) : [];
    const recentMoodAvg = moodScores.length > 0 ? moodScores.reduce((a, b) => a + b, 0) / moodScores.length : undefined;

    // Latest sleep data
    const sleeps = sleepLogs as unknown as Array<{ durationMinutes?: number; quality?: number }>;
    const lastSleep = Array.isArray(sleeps) && sleeps.length > 0 ? sleeps[0] : null;
    const recentSleepHours = lastSleep?.durationMinutes ? Math.round(lastSleep.durationMinutes / 60 * 10) / 10 : undefined;
    const recentSleepQuality = lastSleep?.quality;

    // Today's energy from daily check-in
    const checkIn = dailyCheckIns as unknown as { morningEnergy?: number } | null;
    const recentEnergy = checkIn?.morningEnergy;

    const taskList = tasks as unknown as Array<{ title?: string; priority?: string }>;
    const pendingTaskTitles = Array.isArray(taskList)
      ? taskList.slice(0, 10).map((t) => `${t.title ?? 'Untitled'}${t.priority && t.priority !== 'medium' ? ` [${t.priority}]` : ''}`)
      : [];

    // §3.3: Identify habits with low 7-day completion rate for coaching adjustment suggestions
    type HabitRecord = { title?: string; completionRate7Day?: number };
    const habitList = habits as unknown as HabitRecord[];
    const lowCompletionHabits = Array.isArray(habitList)
      ? habitList
          .filter((h) => typeof h.completionRate7Day === 'number' && h.completionRate7Day < 50)
          .map((h) => `${h.title ?? 'Habit'} (${Math.round(h.completionRate7Day!)}% 7d)`)
      : [];

    return {
      user,
      activeTasks: (tasks as unknown[]).length,
      activeHabits: (habits as unknown[]).length,
      activeGoals: (goals as unknown[]).length,
      pendingTaskTitles,
      lowCompletionHabits,
      recentMoodAvg,
      recentSleepHours,
      recentSleepQuality,
      recentEnergy,
    };
  } catch {
    return { user: null, activeTasks: 0, activeHabits: 0, activeGoals: 0, pendingTaskTitles: [], lowCompletionHabits: [] };
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

  if (message.length > 4000) {
    return NextResponse.json({ error: 'message too long (max 4000 chars)' }, { status: 400 });
  }

  // ── Rate limit (per-user, tier-aware) ─────────────────────────────────────
  {
    // Quick plan check from Convex to determine tier
    convex.setAuth(clerkToken);
    const planUser = await convex.query(api.users.current, {}).catch(() => null) as { plan?: string } | null;
    const isPaid = planUser?.plan === 'pro' || planUser?.plan === 'lifetime';
    if (!checkCoachRateLimit(userId, isPaid)) {
      return NextResponse.json(
        { error: isPaid ? 'Slow down — max 40 messages per minute.' : 'Free tier limit: 10 messages per minute. Upgrade for more.' },
        { status: 429 }
      );
    }
  }

  // ── Safety: distress / crisis detection ──────────────────────────────────
  const DISTRESS_PATTERNS = [
    /\bkill\s*(my)?self\b/i,
    /\bwant\s+to\s+die\b/i,
    /\bend\s+(it|my\s+life)\b/i,
    /\bsuicid(e|al)\b/i,
    /\bno\s+reason\s+to\s+(live|go\s+on)\b/i,
    /\bgive\s+up\s+on\s+(life|living)\b/i,
    /\bcan'?t\s+(go\s+on|take\s+it\s+anymore)\b/i,
    /\bharm\s+(my)?self\b/i,
  ];
  const isDistress = DISTRESS_PATTERNS.some((re) => re.test(message));
  if (isDistress) {
    return NextResponse.json({
      message:
        "I hear that you're going through something really difficult right now, and I want you to know that matters.\n\n" +
        "Please reach out to a trained crisis counselor who can give you the real support you deserve:\n\n" +
        "🇺🇸 **988 Suicide & Crisis Lifeline** — call or text **988** (US)\n" +
        "🌐 **Crisis Text Line** — text HOME to **741741**\n" +
        "🌍 **International:** findahelpline.com\n\n" +
        "You don't have to face this alone. I'm here to help you build a better life — but right now, a real human who specializes in crisis support can help you most.\n\n" +
        "Are you safe right now?",
      actionResults: [],
      pendingSuggestions: [],
      memoryUpdated: false,
    });
  }
  const [clerkUser, { user: convexUser, activeTasks, activeHabits, activeGoals, pendingTaskTitles, lowCompletionHabits, recentMoodAvg, recentSleepHours, recentSleepQuality, recentEnergy }, psychProfile] = await Promise.all([
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

  // ── Build message array (sanitized) ────────────────────────────────────────
  const ALLOWED_HISTORY_ROLES = new Set(['user', 'assistant']);
  const sanitizedHistory = (Array.isArray(conversationHistory) ? conversationHistory : [])
    .slice(-20)
    .filter((m): m is { role: 'user' | 'assistant'; content: string } =>
      typeof m === 'object' && m !== null &&
      typeof m.content === 'string' && m.content.length <= 4000 &&
      ALLOWED_HISTORY_ROLES.has(m.role)
    )
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content.slice(0, 4000) }));

  // ── Build system prompt ───────────────────────────────────────────────────
  const adaptiveInstructions = buildAdaptiveCoachingInstructions(psychProfile) + archetypeInstructions;
  const todayDate = new Date().toISOString().slice(0, 10);

  const systemPrompt = buildCoachingSystemPrompt({
    todayDate,
    userName,
    activeTasks,
    activeHabits,
    activeGoals,
    pendingTaskTitles: pendingTaskTitles ?? [],
    lowCompletionHabits: lowCompletionHabits ?? [],
    currentStreak: (convexUser as unknown as Record<string, unknown>)?.currentStreak as number ?? 0,
    recentMoodAvg,
    recentSleepHours,
    recentSleepQuality,
    recentEnergy,
    summaryMemory,
    adaptiveInstructions,
    isNewConversation: sanitizedHistory.length === 0,
  });

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
    // All AI providers exhausted — return a pre-written fallback instead of a 503
    // so the user still gets a useful nudge rather than a blank error screen.
    const COACH_FALLBACKS = [
      `I'm having a moment of connection trouble — but you're here and that counts. While I recharge: check off one habit, close one open todo, or spend 10 minutes on your top goal. Small moves compound. I'll be back fully in a moment.`,
      `Looks like my signal is weak right now. You don't need me to know the next right action — pick the smallest task on your list and just start. That momentum is real whether I'm watching or not. Try again in a few seconds.`,
      `Temporarily unreachable on my end, but your progress doesn't pause. Open your habits tab, mark what you've already done today, then set one focus timer for your highest-priority task. Back soon!`,
      `Connection hiccup! Here's a thought to carry you: consistency beats intensity every time. Do the one tiny thing you've been putting off — even 5 minutes counts. Check back in a moment and I'll be ready to dive deeper.`,
    ];
    const hourSeed = new Date().getHours() % COACH_FALLBACKS.length;
    coachResponse = {
      message: COACH_FALLBACKS[hourSeed],
      actions: [],
      requiresConfirmation: [],
    };
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
