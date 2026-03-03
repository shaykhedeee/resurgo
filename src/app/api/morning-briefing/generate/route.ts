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

INSTRUCTIONS:
Generate a punchy, actionable morning briefing (3-5 paragraphs, ~150 words). Include:
1. A brief energy/mood-calibrated greeting (acknowledge their state honestly)
2. Based on their energy/sleep, suggest how to structure the day (deep work timing, break cadence)
3. If priorities given, prioritize and suggest order of attack
4. One specific micro-action to start the day with momentum
5. A motivating closer that matches their energy level (don't be overly cheerful if they're low)

Tone: Direct, supportive, slightly tactical. Like a smart friend who's also a performance coach.
Do NOT use emojis. Keep it terminal-style clean.`;

    const briefing = await callAI(prompt, {
      taskType: 'coaching',
      maxTokens: 400,
      temperature: 0.7,
    });

    return NextResponse.json({ briefing });
  } catch (error) {
    console.error('Morning briefing error:', error);
    return NextResponse.json(
      { briefing: 'Focus on your top priority today. Small wins build momentum. Start with 25 minutes of deep work.' },
      { status: 200 }
    );
  }
}
