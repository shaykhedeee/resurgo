// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/vision-board/generate
// Generates + stores a personalised vision board for the authenticated user.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

import { generateVisionBoardConfig, type GoalSummary } from '@/lib/ai/vision-board/generator';
import { generateBoardImages } from '@/lib/ai/vision-board/image-service';
import type { PsychologicalProfile } from '@/lib/ai/psychology/profile-schema';
import type { UserArchetype } from '@/lib/ai/onboarding/archetypes';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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
};

const STYLE_SUFFIX: Record<VisionStylePreset, string> = {
  'pinterest-bold': 'pinterest-style collage aesthetic, bold composition, high contrast, dynamic framing, premium lifestyle editorial',
  'clean-minimal': 'minimalist composition, soft natural light, clean negative space, calm premium aesthetic',
  'luxury-editorial': 'luxury editorial photography style, polished premium textures, elegant composition, magazine-grade visuals',
  'cinematic-dream': 'cinematic dreamlike look, dramatic lighting, shallow depth of field, emotionally rich scene',
};

export async function POST(req: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = (await req.json().catch(() => ({}))) as {
    mode?: VisionGenerationMode;
    stylePreset?: VisionStylePreset;
    customImages?: string[];
  };

  const mode: VisionGenerationMode = payload.mode === 'hybrid' ? 'hybrid' : 'ai';
  const stylePreset: VisionStylePreset = payload.stylePreset ?? 'pinterest-bold';
  const customImages = Array.isArray(payload.customImages)
    ? payload.customImages
        .filter((img) => typeof img === 'string' && img.startsWith('data:image/'))
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
  // If no goals yet, create placeholder goals so the board still generates
  const goalsForBoard = goals.length > 0
    ? goals
    : [{ title: 'Define my life vision', category: 'PERSONAL', progress: 0 }];

  const config = await generateVisionBoardConfig({
    userId,
    userName,
    goals: goalsForBoard,
    archetype,
    psychProfile,
  });

  if (!config) {
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
    await convex.mutation(api.visionBoards.save, {
      config: JSON.stringify(boardWithImages),
      version: boardWithImages.version,
    });
  } catch (err) {
    console.error('[VisionBoard] Failed to save board:', err);
    // Still return the generated board even if save fails
  }

  return NextResponse.json({ success: true, board: boardWithImages });
}
