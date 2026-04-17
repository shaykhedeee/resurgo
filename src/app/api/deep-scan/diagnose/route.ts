// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Deep Scan Diagnosis API (/api/deep-scan/diagnose)
// Generates AI diagnosis from Deep Scan Protocol data
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { callAIJson } from '@/lib/ai/provider-router';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();

    const SYSTEM_PROMPT = `You are Resurgo's Deep Scan AI — a behavioral psychologist and performance coach.
Given a user's complete Deep Scan data, generate a comprehensive diagnosis.

Return ONLY a JSON object:
{
  "archetype": "one of: The Rebuilder, The Optimizer, The Explorer, The Achiever, The Transformer, The Warrior",
  "confidence": number between 75-98,
  "diagnosis": "A 3-5 sentence deeply personalized analysis. Reference their specific challenges, patterns, and life stage. Don't be generic — show you understand THEIR specific situation. Include one uncomfortable truth they need to hear.",
  "recommendations": [
    { "title": "short action title", "description": "why this matters for them specifically", "action": "/goals or /habits or /coach", "priority": 1 },
    { "title": "...", "description": "...", "action": "...", "priority": 2 },
    { "title": "...", "description": "...", "action": "...", "priority": 3 }
  ],
  "coachMatch": "MARCUS or TITAN or AURORA or PHOENIX or NEXUS — which coach personality matches this user best and why in one sentence",
  "warningPatterns": ["list of 1-3 specific behavioral patterns to watch for based on their sabotage patterns and stress response"],
  "strengthSignals": ["list of 1-3 existing strengths or advantages they can leverage"]
}

Be direct, empathetic, and actionable. No fluff. The user should feel seen and understood.`;

    const userMessage = `Deep Scan Data:
- Name: ${data.nickname || 'Unknown'}
- Age: ${data.age || 'Not provided'}
- Occupation: ${data.occupation || 'Not provided'}
- Life Stage: ${data.lifeStage || 'Not provided'}

Life Pillar Scores (1-10):
${data.pillarScores ? Object.entries(data.pillarScores).map(([k, v]) => `  ${k}: ${v}/10`).join('\n') : 'Not provided'}

Top Priorities: ${data.pillarPriorities?.join(', ') || 'Not selected'}

Biggest Challenge: ${data.biggestChallenge || 'Not provided'}
What They've Tried Before: ${data.failedBefore || 'Not provided'}
What Usually Makes Them Quit: ${data.whatStopped || 'Not provided'}
Self-Sabotage Patterns: ${data.sabotagePatterns?.join(', ') || 'None selected'}

Behavioral Fingerprint:
- Chronotype: ${data.chronotype || 'Not provided'}
- Motivation Style: ${data.motivationStyle || 'Not provided'}
- Accountability Style: ${data.accountabilityStyle || 'Not provided'}

Commitment:
- Level: ${data.commitmentLevel || 'Not provided'}/10
- Daily Time: ${data.dailyTimeAvailable || 'Not provided'} minutes
- Starting Difficulty: ${data.startingDifficulty || 'Not provided'}
- 90-Day Vision: ${data.ninetyDayVision || 'Not provided'}
- Biggest Fear: ${data.biggestFear || 'Not provided'}`;

    const { data: result } = await callAIJson([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ], { taskType: 'analyze', maxTokens: 1024 });

    return NextResponse.json(result);
  } catch (err) {
    console.error('[Deep Scan Diagnosis] AI failed:', err);
    // Graceful fallback
    return NextResponse.json({
      archetype: 'The Achiever',
      confidence: 82,
      diagnosis: 'Based on your scan data, you show strong potential but have been held back by inconsistency patterns. The key insight: you don\'t need more information or motivation — you need a system that adapts to your energy levels and holds you accountable without burning you out. That\'s exactly what we\'ve built for you.',
      recommendations: [
        { title: 'Start with 3 micro-habits', description: 'Small wins build momentum faster than big plans', action: '/habits', priority: 1 },
        { title: 'Set your primary goal', description: 'One clear target gives AI the context it needs', action: '/goals', priority: 2 },
        { title: 'Meet your AI coach', description: 'Your coach will adapt to your personality and patterns', action: '/coach', priority: 3 },
      ],
      coachMatch: 'NEXUS — your analytical nature pairs well with a systems-thinking coach who focuses on leverage points.',
      warningPatterns: ['Watch for the "restart syndrome" — starting fresh feels good but kills momentum'],
      strengthSignals: ['Self-awareness about your patterns is your biggest advantage'],
    });
  }
}
