// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — First Contact API (/api/first-contact/generate)
// Generates a personalized AI greeting using the orchestrator
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { orchestrate } from '@/lib/ai/orchestrator';
import { ORCHESTRATION_PATTERNS } from '@/lib/ai/orchestrator';

export const maxDuration = 45;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { scanData } = await req.json();
    if (!scanData) {
      return NextResponse.json({ error: 'scanData is required' }, { status: 400 });
    }

    const scanSummary = [
      `Name: ${scanData.nickname || 'User'}`,
      `Age: ${scanData.age || 'Unknown'}`,
      `Occupation: ${scanData.occupation || 'Not provided'}`,
      `Life Stage: ${scanData.lifeStage || 'Not provided'}`,
      scanData.pillarScores
        ? `Life Pillars: ${Object.entries(scanData.pillarScores).map(([k, v]) => `${k}:${v}`).join(', ')}`
        : '',
      scanData.pillarPriorities
        ? `Top Priorities: ${scanData.pillarPriorities.join(', ')}`
        : '',
      `Challenge: ${scanData.biggestChallenge || 'Not shared'}`,
      `Failed Before: ${scanData.failedBefore || 'Not shared'}`,
      `What Stopped Them: ${scanData.whatStopped || 'Not shared'}`,
      scanData.sabotagePatterns?.length
        ? `Sabotage Patterns: ${scanData.sabotagePatterns.join(', ')}`
        : '',
      `Chronotype: ${scanData.chronotype || 'Unknown'}`,
      `Motivation: ${scanData.motivationStyle || 'Unknown'}`,
      `Accountability: ${scanData.accountabilityStyle || 'Unknown'}`,
      `Commitment: ${scanData.commitmentLevel || '?'}/10`,
      `Daily Time: ${scanData.dailyTimeAvailable || '?'} min`,
      `Difficulty: ${scanData.startingDifficulty || 'moderate'}`,
      `90-Day Vision: ${scanData.ninetyDayVision || 'Not shared'}`,
      `Biggest Fear: ${scanData.biggestFear || 'Not shared'}`,
      `Archetype: ${scanData.archetype || 'Unknown'}`,
      `AI Diagnosis: ${scanData.aiDiagnosis || 'Not generated'}`,
    ].filter(Boolean).join('\n');

    // Use the orchestrator deep scan diagnosis pattern
    const subTasks = ORCHESTRATION_PATTERNS.deepScanDiagnosis(scanSummary);

    const result = await orchestrate(
      `Generate a comprehensive First Contact briefing for a new user based on their Deep Scan data.`,
      {
        systemContext: `You are Resurgo — an intelligent life co-pilot. This is the user's very first experience after completing their Deep Scan. Make it count. Be personal, be real, be inspiring.`,
        manualSubTasks: subTasks,
        synthesisMaxTokens: 2048,
        synthesisTemperature: 0.7,
      }
    );

    // Extract individual sub-task results for structured display
    const psychProfile = result.subTasks.find((t) => t.id === 'psych_analysis')?.content ?? '';
    const strengths = result.subTasks.find((t) => t.id === 'strengths')?.content ?? '';
    const protocol = result.subTasks.find((t) => t.id === 'plan')?.content ?? '';
    const greeting = result.subTasks.find((t) => t.id === 'greeting')?.content ?? '';

    return NextResponse.json({
      greeting: greeting || result.finalResponse.slice(0, 300),
      fullBriefing: result.finalResponse,
      sections: {
        psychProfile,
        strengths,
        protocol,
        greeting,
      },
      stats: {
        providersUsed: result.providersUsed,
        totalDurationMs: result.totalDurationMs,
        totalTokens: result.totalTokens,
      },
    });
  } catch (err) {
    console.error('[First Contact] Generation failed:', err);
    return NextResponse.json({
      greeting: "Welcome to Resurgo. Your Deep Scan is complete and your system is calibrated. Let's build something extraordinary together.",
      fullBriefing: "Your personalized protocol is ready. Head to your dashboard to start taking action.",
      sections: {
        psychProfile: '',
        strengths: 'Your willingness to start this process is itself a strength signal.',
        protocol: 'Start with one small habit today. Consistency beats intensity.',
        greeting: "Welcome to Resurgo. Your journey starts now.",
      },
      stats: { providersUsed: [], totalDurationMs: 0, totalTokens: 0 },
    });
  }
}
