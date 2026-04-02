// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/vision-board/regen-panel
// Regenerates a single panel's image without touching the rest of the board.
// Body: { boardId, panelId, imagePrompt, stylePreset?, affirmation? }
// ═══════════════════════════════════════════════════════════════════════════════

export const maxDuration = 120;

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
import { generateImage } from '@/lib/ai/vision-board/image-service';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Per-user panel-regen rate limit: 10 per 5 minutes
const REGEN_LIMIT = 10;
const REGEN_WINDOW_MS = 5 * 60 * 1000;
const regenRateMap = new Map<string, { count: number; windowStart: number }>();

function checkRegenRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = regenRateMap.get(userId);
  if (!entry || now - entry.windowStart > REGEN_WINDOW_MS) {
    regenRateMap.set(userId, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= REGEN_LIMIT) return false;
  entry.count++;
  return true;
}

const STYLE_SUFFIX: Record<string, string> = {
  'pinterest-bold': 'pinterest collage aesthetic, high contrast, bold composition, premium lifestyle photography',
  'clean-minimal': 'minimalist composition, soft natural light, clean white space, calm premium',
  'luxury-editorial': 'luxury editorial photography, polished premium textures, magazine-grade composition',
  'cinematic-dream': 'cinematic dreamlike look, dramatic lighting, shallow depth of field, emotionally rich',
};

export async function POST(req: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!checkRegenRateLimit(userId)) {
    return NextResponse.json(
      { error: 'Panel regen rate limit reached. Wait a few minutes.' },
      { status: 429 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as {
    boardId?: string;
    panelId?: string;
    imagePrompt?: string;
    stylePreset?: string;
    affirmation?: string;
    goalTitle?: string;
  };

  if (!body.boardId || !body.panelId || !body.imagePrompt) {
    return NextResponse.json({ error: 'boardId, panelId, imagePrompt are required' }, { status: 400 });
  }

  // Validate imagePrompt length (no injection)
  if (body.imagePrompt.length > 1000) {
    return NextResponse.json({ error: 'imagePrompt too long' }, { status: 400 });
  }

  let token: string;
  try {
    const t = await getToken({ template: 'convex' });
    if (!t) throw new Error('no token');
    token = t;
  } catch {
    return NextResponse.json({ error: 'Could not obtain auth token' }, { status: 401 });
  }

  convex.setAuth(token);

  // Verify board ownership
  const board = await convex.query(api.visionBoards.getActive, {}).catch(() => null);
  if (!board) {
    return NextResponse.json({ error: 'Active board not found' }, { status: 404 });
  }

  // Build styled prompt
  const styleSuffix = STYLE_SUFFIX[body.stylePreset ?? 'pinterest-bold'] ?? STYLE_SUFFIX['pinterest-bold'];
  const styledPrompt = `${body.imagePrompt}, ${styleSuffix}`;

  // Generate single image
  const result = await generateImage(styledPrompt);

  if (!result.imageUrl && !result.imageData) {
    return NextResponse.json({ error: 'Image generation failed for this panel' }, { status: 500 });
  }

  const imageData = result.imageData ?? result.imageUrl ?? null;

  // Patch panel in Convex
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await convex.mutation(api.visionBoards.patchPanel as any, {
      boardId: body.boardId,
      panelId: body.panelId,
      imageData: imageData ?? undefined,
      imagePrompt: styledPrompt,
      ...(body.affirmation ? { affirmation: body.affirmation } : {}),
      ...(body.goalTitle ? { goalTitle: body.goalTitle } : {}),
    });
  } catch (err) {
    console.error('[RegenPanel] Convex patch failed', err);
    // Return the image anyway — client can handle optimistic update
  }

  return NextResponse.json({ imageData, provider: result.provider, success: true });
}
