// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Morning Briefing AI Generator
// Personalized morning briefing based on mood, energy, sleep, and priorities
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { callAI } from '@/lib/ai/provider-router';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { mood, energy, sleep, intention, priorities, userName } = await req.json();

    const moodLabels = ['', 'Drained', 'Low', 'Neutral', 'Good', 'Fired Up'];
    const energyLabels = ['', 'Empty', 'Low', 'Mid', 'High', 'Peak'];
    const sleepLabels = ['', 'Terrible', 'Poor', 'Ok', 'Good', 'Great'];

    const prompt = `You are RESURGO, an elite AI life coach system. Generate a personalized morning briefing for ${userName || 'the user'}.

CONTEXT:
- Mood: ${moodLabels[mood] || 'Unknown'} (${mood}/5)
- Energy: ${energyLabels[energy] || 'Unknown'} (${energy}/5)
- Sleep: ${sleepLabels[sleep] || 'Unknown'} (${sleep}/5)
${intention ? `- Intention: "${intention}"` : ''}
${priorities?.length ? `- Top priorities: ${priorities.join(', ')}` : ''}

ENERGY ADJUSTMENT RULES (apply these strictly based on energy score):
- Energy 1-2 (Empty/Low): Scale the day back. Recovery mode. Suggest focusing ONLY on 1-2 non-negotiable habits — the ones that take under 5 minutes. Recommend the single most critical task and deprioritize everything else. No new commitments today. Be direct about this.
- Energy 3 (Mid): Balanced day. Suggest 3-4 habits, tackle medium-priority work in the morning when focus is highest, take a real break at midday.
- Energy 4-5 (High/Peak): Stretch day. Front-load the hardest, most cognitively demanding task first. Run the full habit stack. Ideal day for deep work sprints, difficult decisions, or creative output.

INSTRUCTIONS:
Generate a punchy, actionable morning briefing (3-5 paragraphs, ~150 words). Include:
1. A brief energy/mood-calibrated greeting (acknowledge their state honestly — no false positivity)
2. Apply the ENERGY ADJUSTMENT RULES above — explicitly say how many habits to attempt and what kind of work is realistic today
3. If priorities given, order them by what makes sense given their current energy level
4. One specific micro-action to start the day with momentum (must match energy level — no "crush it" language for energy ≤ 2)
5. A closing that matches their energy level honestly

Tone: Direct, supportive, slightly tactical. Like a smart friend who's also a performance coach.
Do NOT use emojis. Keep it terminal-style clean.`;

    const result = await callAI(
      [{ role: 'system', content: 'You are RESURGO, an elite AI life coach.' }, { role: 'user', content: prompt }],
      { taskType: 'coaching', maxTokens: 400, temperature: 0.7 }
    );

    return NextResponse.json({ briefing: result.content });
  } catch (error) {
    console.error('Morning briefing error:', error);
    return NextResponse.json(
      { briefing: 'Focus on your top priority today. Small wins build momentum. Start with 25 minutes of deep work.' },
      { status: 200 }
    );
  }
}
