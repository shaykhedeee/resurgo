// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Terminal Demo API Route (/api/terminal-demo)
// Quick AI diagnostic for landing page — no auth, rate-limited by IP
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { callAIJson } from '@/lib/ai/provider-router';

// Simple in-memory rate limit (per IP, 10 requests per 5 min)
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 5 * 60 * 1000;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';

  if (!checkRate(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try again in a few minutes.' }, { status: 429 });
  }

  try {
    const { goal } = await req.json();
    if (!goal || typeof goal !== 'string' || goal.length > 500) {
      return NextResponse.json({ error: 'Invalid goal input.' }, { status: 400 });
    }

    const SYSTEM_PROMPT = `You are Resurgo's goal diagnostic AI. Given a user's goal, provide a quick diagnostic scan result.

Return ONLY a JSON object with these exact fields:
{
  "archetype": "one of: The Rebuilder, The Optimizer, The Explorer, The Achiever, The Transformer, The Warrior",
  "archetypeEmoji": "a single emoji matching the archetype",
  "diagnosis": "2-3 sentence personalized analysis of their goal — what challenges they might face, what makes this goal achievable, and what psychological pattern this aligns with. Be specific, not generic.",
  "topPillar": "the primary life pillar this goal targets (Health, Career, Finance, Relationships, Mindset, Creativity)",
  "difficulty": "recommended starting difficulty: Gentle Start, Moderate Push, or Intense Sprint",
  "firstStep": "one very specific, actionable first step they could take TODAY (not generic advice)",
  "confidence": a number between 72 and 96 representing AI confidence percentage
}

Be concise but insightful. Make the user feel understood and motivated. The diagnosis should feel like the AI deeply understands their situation.`;

    const { data } = await callAIJson<{
      archetype: string;
      archetypeEmoji: string;
      diagnosis: string;
      topPillar: string;
      difficulty: string;
      firstStep: string;
      confidence: number;
    }>([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `My goal: ${goal}` },
    ], { taskType: 'quick', maxTokens: 512 });

    return NextResponse.json(data);
  } catch (err) {
    console.error('[Terminal Demo] AI scan failed:', err);
    return NextResponse.json({
      archetype: 'The Achiever',
      archetypeEmoji: '🎯',
      diagnosis: 'Your goal shows strong intentionality. The key challenge will be sustainable momentum — most people start strong but fade by week 3. Resurgo\'s adaptive system is designed to catch that exact pattern and intervene.',
      topPillar: 'Personal Growth',
      difficulty: 'Moderate Push',
      firstStep: 'Write down the 3 biggest obstacles between you and this goal, then rank them by what you can control.',
      confidence: 84,
    });
  }
}
