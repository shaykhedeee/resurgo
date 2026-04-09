// ═══════════════════════════════════════════════════════════════════════════════
// Resurgo — Weekly Review AI Summary Generator
// Generates narrative summaries from weekly stats via AI cascade
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
import { callAIJson } from '@/lib/ai/provider-router';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface WeeklyReview {
  _id: string;
  userId: string;
  weekStartDate: string;
  weekEndDate: string;
  tasksCompleted: number;
  tasksTotal: number;
  habitsCompletionRate: number;
  focusTotalMinutes: number;
  streakDays: number;
  xpEarned: number;
  goalsProgressed?: Array<{ title: string; progressChange: number }>;
  aiSummary?: string;
}

interface AISummaryResponse {
  summary: string;
  highlights: string[];
  areasToImprove: string[];
  nextWeekFocus: string;
}

export async function POST(req: NextRequest) {
  try {
    const { getToken } = await auth();
    const token = await getToken({ template: 'convex' });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { weekStartDate } = body as { weekStartDate?: string };
    if (!weekStartDate || typeof weekStartDate !== 'string') {
      return NextResponse.json({ error: 'weekStartDate is required' }, { status: 400 });
    }

    // Fetch the weekly review from Convex
    convex.setAuth(token);
    const review = await convex.query(api.weeklyReviews.getByWeek, { weekStartDate }) as WeeklyReview | null;
    if (!review) {
      return NextResponse.json({ error: 'Weekly review not found. Generate it first.' }, { status: 404 });
    }

    // Skip if already has an AI summary
    if (review.aiSummary) {
      return NextResponse.json({
        summary: review.aiSummary,
        alreadyGenerated: true,
      });
    }

    // Build prompt with weekly stats
    const taskRate = review.tasksTotal > 0
      ? Math.round((review.tasksCompleted / review.tasksTotal) * 100)
      : 0;

    const goalsSection = review.goalsProgressed?.length
      ? review.goalsProgressed.map(g => `- ${g.title}: ${g.progressChange}% progress`).join('\n')
      : 'No active goals this week.';

    const systemPrompt = `You are Resurgo's AI life coach writing a weekly review summary for the user.
Be encouraging but honest. Use 2nd person ("you"). Keep it concise (3-5 paragraphs).

Respond in strict JSON:
{
  "summary": "narrative summary of their week",
  "highlights": ["achievement 1", "achievement 2", ...],
  "areasToImprove": ["suggestion 1", "suggestion 2", ...],
  "nextWeekFocus": "ONE specific, actionable focus for next week (1 sentence)"
}

Rules:
- Highlights: 2-4 specific wins from the data
- Areas to improve: 2-3 actionable, forward-looking suggestions
- nextWeekFocus: a single concrete action (e.g. "Hit your morning check-in before 8am every day")
- Summary: weave stats into a motivating narrative, don't just list numbers
- If task completion is low, frame it constructively
- If streak days are high (5+), celebrate consistency`;

    const userPrompt = `Here are my stats for the week of ${review.weekStartDate} to ${review.weekEndDate}:

Tasks: ${review.tasksCompleted}/${review.tasksTotal} completed (${taskRate}%)
Habit completion rate: ${review.habitsCompletionRate}%
Focus time: ${review.focusTotalMinutes} minutes
Active days (streak): ${review.streakDays}/7
XP earned: ${review.xpEarned}

Goals progress:
${goalsSection}

Please write my weekly summary.`;

    const { data } = await callAIJson<AISummaryResponse>(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { taskType: 'json', maxTokens: 800, temperature: 0.7 }
    );

    // Store the summary in Convex
    await convex.mutation(api.weeklyReviews.storeAISummary, {
      reviewId: review._id as Parameters<typeof convex.mutation<typeof api.weeklyReviews.storeAISummary>>[1]['reviewId'],
      aiSummary: data.summary,
      highlights: data.highlights,
      areasToImprove: data.areasToImprove,
      nextWeekFocus: data.nextWeekFocus,
    });

    return NextResponse.json({
      summary: data.summary,
      highlights: data.highlights,
      areasToImprove: data.areasToImprove,
    });
  } catch (err) {
    console.error('[Weekly Review] Summary generation failed:', err);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
