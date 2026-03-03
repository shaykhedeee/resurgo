// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Evening Reflection AI Generator
// Personalized end-of-day reflection based on wins, challenges, gratitude
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
    const {
      dayRating,
      mood,
      energy,
      biggestWin,
      biggestChallenge,
      gratitude,
      tomorrowFocus,
      tasksCompleted,
      habitsCompleted,
      userName,
    } = await req.json();

    const ratingLabels = ['', 'Lost', 'Struggled', 'Decent', 'Productive', 'Crushed it'];
    const moodLabels = ['', 'Rough', 'Meh', 'OK', 'Good', 'Great'];

    const prompt = `You are RESURGO, an elite AI life coach system. Generate a personalized evening reflection for ${userName || 'the user'}.

TODAY'S DATA:
- Day Rating: ${ratingLabels[dayRating] || 'Unknown'} (${dayRating}/5)
- Evening Mood: ${moodLabels[mood] || 'Unknown'} (${mood}/5)
- Energy Level: ${energy}/5
${biggestWin ? `- Biggest Win: "${biggestWin}"` : '- No win logged'}
${biggestChallenge ? `- Biggest Challenge: "${biggestChallenge}"` : ''}
${gratitude?.length ? `- Gratitude: ${gratitude.join('; ')}` : ''}
${tomorrowFocus ? `- Tomorrow Focus: "${tomorrowFocus}"` : ''}
${tasksCompleted !== undefined ? `- Tasks Completed: ${tasksCompleted}` : ''}
${habitsCompleted !== undefined ? `- Habits Completed: ${habitsCompleted}` : ''}

INSTRUCTIONS:
Generate a thoughtful evening reflection (3-4 paragraphs, ~120 words). Include:
1. Acknowledge the day honestly — validate wins OR normalize struggles
2. Extract one key pattern or learning from today
3. If they had a challenge, reframe it as growth data (not failure)
4. Connect today to tomorrow — bridge their momentum or recovery plan
5. End with a single calming/grounding thought for the night

Tone: Warm but real. Reflective, not preachy. Like a wise mentor at the end of a long day.
If they crushed it, celebrate genuinely. If they struggled, be compassionate but forward-looking.
Do NOT use emojis. Keep it terminal-style clean.`;

    const reflection = await callAI(prompt, {
      taskType: 'coaching',
      maxTokens: 350,
      temperature: 0.7,
    });

    return NextResponse.json({ reflection });
  } catch (error) {
    console.error('Evening reflection error:', error);
    return NextResponse.json(
      { reflection: 'Every day you show up is a win. Rest well — tomorrow is another chance to grow.' },
      { status: 200 }
    );
  }
}
