// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/vision-board/generate
// Generates + stores a personalised vision board for the authenticated user.
// ═══════════════════════════════════════════════════════════════════════════════

// Extend Vercel serverless timeout — image generation can take 60-120s for full boards
export const maxDuration = 300;

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

import { generateVisionBoardConfig, type GoalSummary, type WizardPromptData } from '@/lib/ai/vision-board/generator';
import { generateBoardImages } from '@/lib/ai/vision-board/image-service';
import type { PsychologicalProfile } from '@/lib/ai/psychology/profile-schema';
import type { UserArchetype } from '@/lib/ai/onboarding/archetypes';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const ANALYTICS_SYNC_SECRET = process.env.BILLING_WEBHOOK_SYNC_SECRET;

// Per-user rate limit: max 3 board generations per 10 minutes
const VISION_RATE_LIMIT = 3;
const VISION_RATE_WINDOW_MS = 10 * 60 * 1000;
const visionRateMap = new Map<string, { count: number; windowStart: number }>();

function checkVisionRateLimit(userId: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = visionRateMap.get(userId);
  if (!entry || now - entry.windowStart > VISION_RATE_WINDOW_MS) {
    visionRateMap.set(userId, { count: 1, windowStart: now });
    return { allowed: true, retryAfterMs: 0 };
  }
  if (entry.count >= VISION_RATE_LIMIT) {
    const retryAfterMs = VISION_RATE_WINDOW_MS - (now - entry.windowStart);
    return { allowed: false, retryAfterMs };
  }
  entry.count++;
  return { allowed: true, retryAfterMs: 0 };
}

type VisionGenerationMode = 'ai' | 'hybrid';
type VisionStylePreset = 'pinterest-bold' | 'clean-minimal' | 'luxury-editorial' | 'cinematic-dream';

type GoalRecord = {
  title?: string;
  category?: string;
  progress?: number;
  description?: string;
};

type CurrentUserRecord = {
  name?: string;
  plan?: 'free' | 'pro' | 'lifetime' | string;
  archetype?: UserArchetype;
};

type PsychologyRecord = {
  profileData?: string;
};

type ApiShape = {
  goals: {
    list?: unknown;
    getActiveGoals?: unknown;
  };
  growthAnalytics?: {
    logGrowthEvent?: unknown;
  };
};

type GrowthEventName =
  | 'vision_board_generate_clicked'
  | 'vision_board_generation_success'
  | 'vision_board_generation_failed'
  | 'vision_board_pro_gate_hit';

const STYLE_SUFFIX: Record<VisionStylePreset, string> = {
  'pinterest-bold': 'pinterest-style collage aesthetic, bold composition, high contrast, dynamic framing, premium lifestyle editorial',
  'clean-minimal': 'minimalist composition, soft natural light, clean negative space, calm premium aesthetic',
  'luxury-editorial': 'luxury editorial photography style, polished premium textures, elegant composition, magazine-grade visuals',
  'cinematic-dream': 'cinematic dreamlike look, dramatic lighting, shallow depth of field, emotionally rich scene',
};

// Map wizard boardType values → Convex schema enum values
const WIZARD_BOARD_TYPE_MAP: Record<string, 'goals' | 'lifestyle' | 'yearly' | 'domain' | 'gratitude' | 'custom'> = {
  manifesting: 'goals',
  vision: 'lifestyle',
  yearly: 'yearly',
  gratitude: 'gratitude',
  custom: 'custom',
  domain: 'domain',
  goals: 'goals',
  lifestyle: 'lifestyle',
};

function toConvexBoardType(raw: string | undefined): 'goals' | 'lifestyle' | 'yearly' | 'domain' | 'gratitude' | 'custom' {
  return WIZARD_BOARD_TYPE_MAP[raw ?? ''] ?? 'goals';
}

async function logGrowthEvent(
  eventName: GrowthEventName,
  clerkId: string,
  source: 'api' | 'system',
  details?: Record<string, unknown>
) {
  if (!ANALYTICS_SYNC_SECRET) return;

  try {
    const apiRef = (api as unknown as ApiShape).growthAnalytics?.logGrowthEvent;
    if (!apiRef) return;

    const invokeMutation = convex.mutation as unknown as (
      functionReference: unknown,
      mutationArgs: Record<string, unknown>
    ) => Promise<unknown>;

    await invokeMutation(apiRef, {
      clerkId,
      eventName,
      source,
      page: '/vision-board',
      details,
      syncSecret: ANALYTICS_SYNC_SECRET,
    });
  } catch (error) {
    console.warn('[GrowthTelemetry] Vision board event logging failed', {
      eventName,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function POST(req: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Per-user rate limit: max 3 generations per 10 minutes
  const { allowed, retryAfterMs } = checkVisionRateLimit(userId);
  if (!allowed) {
    const retryAfterSec = Math.ceil(retryAfterMs / 1000);
    return NextResponse.json(
      { error: `Too many generation requests. Please wait ${retryAfterSec}s before trying again.`, code: 'RATE_LIMITED' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
    );
  }

  const payload = (await req.json().catch(() => ({}))) as {
    mode?: VisionGenerationMode;
    stylePreset?: VisionStylePreset;
    customImages?: string[];
    promptData?: WizardPromptData;
    boardType?: 'manifesting' | 'gratitude' | 'yearly' | 'vision' | 'custom';
  };

  const mode: VisionGenerationMode = payload.mode === 'hybrid' ? 'hybrid' : 'ai';
  // If wizard provided a style preset, it takes priority over direct payload stylePreset
  const stylePreset: VisionStylePreset = (payload.promptData?.stylePreset ?? payload.stylePreset) ?? 'pinterest-bold';
  const wizardData: WizardPromptData | null = payload.promptData ?? null;
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB per image
  const customImages = Array.isArray(payload.customImages)
    ? payload.customImages
        .filter((img) => typeof img === 'string' && img.startsWith('data:image/') && img.length <= MAX_IMAGE_SIZE)
        .slice(0, 6)
    : [];

  let token: string;
  try {
    const t = await getToken({ template: 'convex' });
    if (!t) throw new Error('no token');
    token = t;
  } catch {
    return NextResponse.json({ error: 'Could not obtain auth token' }, { status: 401 });
  }

  convex.setAuth(token);

  const typedApi = api as unknown as ApiShape;
  const goalsRef = (typedApi.goals.list ?? typedApi.goals.getActiveGoals) as never;

  // ── 1. Load user + goals in parallel ──────────────────────────────────────
  const [convexUser, rawGoals] = await Promise.all([
    convex.query(api.users.current, {}).catch(() => null),
    convex.query(goalsRef, {}).catch(() => [] as unknown[]),
  ]);

  if (!convexUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const userRecord = convexUser as CurrentUserRecord;
  const userPlan = userRecord.plan ?? 'free';
  if (userPlan === 'free') {
    await logGrowthEvent('vision_board_pro_gate_hit', userId, 'api', {
      mode,
      stylePreset,
      customImagesCount: customImages.length,
    });

    return NextResponse.json(
      {
        error: 'Vision Board Studio is a Pro feature. Upgrade to Pro or Lifetime to unlock premium generation.',
        code: 'VISION_BOARD_PRO_REQUIRED',
      },
      { status: 403 }
    );
  }

  const goals: GoalSummary[] = (Array.isArray(rawGoals) ? rawGoals : [])
    .map((g) => {
      const goal = g as GoalRecord;
      return {
        title: goal.title ?? '',
        category: goal.category ?? 'PERSONAL',
        progress: goal.progress ?? 0,
        description: goal.description,
      };
    })
    .filter((g) => g.title.length > 0)
    .slice(0, 6);

  // ── 2. Load psychology profile ─────────────────────────────────────────────
  let psychProfile: PsychologicalProfile | null = null;
  try {
    const doc = await convex.query(api.psychology.getProfile, {}) as PsychologyRecord | null;
    if (doc?.profileData) psychProfile = JSON.parse(doc.profileData);
  } catch { /* profile not required */ }

  // ── 3. Get archetype ───────────────────────────────────────────────────────
  const archetype = userRecord.archetype ?? null;
  const userName = userRecord.name?.split(' ')[0] ?? 'friend';

  // ── 4. Generate board config ───────────────────────────────────────────────
  // If wizard data present, its domains drive the panels — goals are supplemental
  // If no goals and no wizard data, still attempt with a placeholder goal
  const goalsForBoard = goals.length > 0
    ? goals
    : wizardData
    ? [] // wizard data will provide all panel content
    : [{ title: 'Define my life vision', category: 'PERSONAL', progress: 0 }];

  // ── Pull habit / goal completion metrics for momentum context ────────────
  let habitCompletionRate: number | undefined;
  let streakDays: number | undefined;
  let goalCompletionRate: number | undefined;
  try {
    const habitsListRef = (api as unknown as { habits?: { list?: unknown } }).habits?.list;
    const habitsRaw: unknown = habitsListRef
      ? await convex.query(habitsListRef as never, {}).catch(() => null)
      : null;
    const goalsMeta = goals;
    if (Array.isArray(habitsRaw) && habitsRaw.length > 0) {
      const completions = (habitsRaw as { completionRate?: number }[])
        .map((h) => h.completionRate ?? 0)
        .filter((r) => typeof r === 'number');
      if (completions.length > 0) {
        habitCompletionRate = Math.round(completions.reduce((a, b) => a + b, 0) / completions.length);
      }
      const streaks = (habitsRaw as { currentStreak?: number }[])
        .map((h) => h.currentStreak ?? 0);
      streakDays = Math.max(0, ...streaks);
    }
    if (goalsMeta.length > 0) {
      goalCompletionRate = Math.round(
        goalsMeta.reduce((sum, g) => sum + (g.progress ?? 0), 0) / goalsMeta.length
      );
    }
  } catch { /* metrics are supplemental — never block generation */ }

  const config = await generateVisionBoardConfig({
    userId,
    userName,
    goals: goalsForBoard,
    archetype,
    psychProfile,
    wizardData,
    habitCompletionRate,
    streakDays,
    goalCompletionRate,
  });

  if (!config) {
    await logGrowthEvent('vision_board_generation_failed', userId, 'system', {
      stage: 'config_generation',
      mode,
      stylePreset,
      customImagesCount: customImages.length,
    });
    return NextResponse.json({ error: 'Board config generation failed' }, { status: 500 });
  }

  // ── 5. Generate images for each panel (style-aware) ──────────────────────
  const styleSuffix = STYLE_SUFFIX[stylePreset] ?? STYLE_SUFFIX['pinterest-bold'];
  const styledPanels = config.panels.map((panel) => ({
    ...panel,
    imagePrompt: `${panel.imagePrompt}, ${styleSuffix}`,
  }));

  const images = await generateBoardImages(styledPanels);

  const boardWithImages = {
    ...config,
    panels: styledPanels.map((panel, index) => ({
      ...panel,
      imageData:
        mode === 'hybrid' && customImages.length > 0
          ? customImages[index % customImages.length] ?? images.get(panel.id) ?? null
          : images.get(panel.id) ?? null,
    })),
    generationMode: mode,
    stylePreset,
    imageSourceCount: customImages.length,
  };

  // ── 6. Save to Convex ──────────────────────────────────────────────────────
  try {
    await logGrowthEvent('vision_board_generate_clicked', userId, 'api', {
      mode,
      stylePreset,
      customImagesCount: customImages.length,
    });

    await convex.mutation(api.visionBoards.save, {
      config: JSON.stringify(boardWithImages),
      version: boardWithImages.version,
      boardType: toConvexBoardType(wizardData?.boardType ?? payload.boardType),
      title: boardWithImages.title,
    });
  } catch (err) {
    console.error('[VisionBoard] Failed to save board:', err);
    await logGrowthEvent('vision_board_generation_failed', userId, 'system', {
      stage: 'save',
      mode,
      stylePreset,
      customImagesCount: customImages.length,
      message: err instanceof Error ? err.message : String(err),
    });
    // Still return the generated board even if save fails
  }

  await logGrowthEvent('vision_board_generation_success', userId, 'api', {
    mode,
    stylePreset,
    customImagesCount: customImages.length,
    panelCount: boardWithImages.panels.length,
  });

  return NextResponse.json({ success: true, board: boardWithImages });
}
