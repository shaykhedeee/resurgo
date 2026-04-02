// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/vision-board/suggest-prompt
// Generates a specific, cinematic image-prompt suggestion for a given life domain,
// grounded in the user's overarching vision and board style choices.
//
// Body: { domain, domainLabel, overarchingVision, boardType, mood, stylePreset }
// Returns: { suggestion: string }
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { callAI } from '@/lib/ai/provider-router';

// Per-user rate limit: 30 suggestions per 10 minutes (generous — it's a quick task)
const SUGGEST_LIMIT = 30;
const SUGGEST_WINDOW_MS = 10 * 60 * 1000;
const suggestRateMap = new Map<string, { count: number; windowStart: number }>();

function checkSuggestRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = suggestRateMap.get(userId);
  if (!entry || now - entry.windowStart > SUGGEST_WINDOW_MS) {
    suggestRateMap.set(userId, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= SUGGEST_LIMIT) return false;
  entry.count++;
  return true;
}

const STYLE_DESCRIPTOR: Record<string, string> = {
  'pinterest-bold': 'bold Pinterest-style collage aesthetic, high contrast, vibrant lifestyle photography',
  'clean-minimal': 'clean minimalist aesthetic, soft natural light, airy white space',
  'luxury-editorial': 'luxury editorial photography, polished premium magazine style',
  'cinematic-dream': 'cinematic dreamlike look, dramatic moody lighting, film-grade visuals',
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!checkSuggestRateLimit(userId)) {
    return NextResponse.json({ error: 'Too many suggestions. Please wait a few minutes.' }, { status: 429 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    domain?: string;
    domainLabel?: string;
    overarchingVision?: string;
    boardType?: string;
    mood?: string;
    stylePreset?: string;
  };

  // Validate inputs
  const domain = (body.domain ?? '').slice(0, 50).replace(/[^A-Z_a-z]/g, '');
  const domainLabel = (body.domainLabel ?? domain).slice(0, 80);
  const overarchingVision = (body.overarchingVision ?? '').slice(0, 600);
  const boardType = (body.boardType ?? 'manifesting').slice(0, 30);
  const mood = (body.mood ?? 'Ambitious & Bold').slice(0, 60);
  const stylePreset = (body.stylePreset ?? 'pinterest-bold').slice(0, 40);

  if (!domain || !overarchingVision.trim()) {
    return NextResponse.json({ error: 'domain and overarchingVision are required' }, { status: 400 });
  }

  const styleDesc = STYLE_DESCRIPTOR[stylePreset] ?? STYLE_DESCRIPTOR['pinterest-bold'];

  const systemPrompt = `You are a vision board prompt engineer for RESURGO, a premium life transformation app.
Your job is to write vivid, specific, aspirational image descriptions for AI image generation.
Each description should be 2-3 sentences, present-tense, first-person, visually concrete and emotionally charged.
Focus on: specific scenes, environments, objects, people, feelings — things a camera could capture.
Avoid: abstract concepts, metaphors, vague words like "success" or "happiness" without visual anchors.
Style: ${styleDesc}
Mood: ${mood}
Board type: ${boardType} (${boardType === 'manifesting' ? 'show the goal as already achieved' : boardType === 'gratitude' ? 'celebrate what already exists, warm and abundant' : 'aspirational future vision'})`;

  const userPrompt = `Life domain: ${domainLabel}
User's overarching life vision: "${overarchingVision}"

Write a vivid, specific image-prompt description for the "${domainLabel}" domain panel on this vision board.
Make it personal to their vision. Be concrete — describe the exact scene an AI image generator should create.
Return only the description text (no quotes, no labels, no explanation).`;

  try {
    const result = await callAI(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      { taskType: 'quick', maxTokens: 200, temperature: 0.85 }
    );

    const suggestion = result.content.trim().replace(/^["']|["']$/g, '');

    return NextResponse.json({ suggestion });
  } catch (err) {
    console.error('[SuggestPrompt] AI error:', err);
    return NextResponse.json({ error: 'AI suggestion failed. Please try again.' }, { status: 500 });
  }
}
