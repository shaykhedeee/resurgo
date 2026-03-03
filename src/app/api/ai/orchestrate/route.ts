// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — AI Orchestration API (/api/ai/orchestrate)
// Multi-provider prompt decomposition endpoint
//
// POST: Submit a complex prompt → decomposed, parallelized, synthesized
// Supports both auto-decomposition and pre-defined patterns
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { orchestrate, orchestrateWithPattern, ORCHESTRATION_PATTERNS } from '@/lib/ai/orchestrator';
import type { SubTask, OrchestrationOptions } from '@/lib/ai/orchestrator';

export const maxDuration = 60; // Allow up to 60s for multi-provider orchestration

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      prompt,
      pattern,
      patternArgs,
      systemContext,
      maxSubTasks,
      manualSubTasks,
      includeMetadata,
    } = body as {
      prompt?: string;
      pattern?: keyof typeof ORCHESTRATION_PATTERNS;
      patternArgs?: string[];
      systemContext?: string;
      maxSubTasks?: number;
      manualSubTasks?: SubTask[];
      includeMetadata?: boolean;
    };

    // Validate input
    if (!prompt && !pattern) {
      return NextResponse.json(
        { error: 'Either "prompt" or "pattern" is required' },
        { status: 400 }
      );
    }

    let result;

    if (pattern && patternArgs) {
      // Use pre-defined orchestration pattern
      if (!(pattern in ORCHESTRATION_PATTERNS)) {
        return NextResponse.json(
          { error: `Unknown pattern: ${pattern}. Available: ${Object.keys(ORCHESTRATION_PATTERNS).join(', ')}` },
          { status: 400 }
        );
      }
      result = await orchestrateWithPattern(pattern, patternArgs, {
        systemContext,
      });
    } else {
      // Auto-decompose the prompt
      const options: OrchestrationOptions = {
        systemContext,
        maxSubTasks: maxSubTasks ?? 6,
        manualSubTasks,
        includeMetadata,
      };
      result = await orchestrate(prompt!, options);
    }

    // Build response
    const response: Record<string, unknown> = {
      response: result.finalResponse,
      stats: {
        totalDurationMs: result.totalDurationMs,
        providersUsed: result.providersUsed,
        totalTokens: result.totalTokens,
        subTaskCount: result.subTasks.length,
        decompositionMethod: result.decompositionMethod,
      },
    };

    if (includeMetadata) {
      response.subTasks = result.subTasks.map((st) => ({
        id: st.id,
        title: st.title,
        type: st.type,
        provider: st.provider,
        model: st.model,
        durationMs: st.durationMs,
        tokensUsed: st.tokensUsed,
        error: st.error,
        content: st.content,
      }));
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error('[Orchestrate API] Error:', err);
    return NextResponse.json(
      { error: 'Orchestration failed', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

// GET: Returns available patterns and provider status
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    patterns: Object.keys(ORCHESTRATION_PATTERNS),
    description: {
      lifeCoaching: 'Behavioral analysis + emotional support + action plan',
      goalBreakdown: 'Goal extraction + milestone planning + motivation strategy',
      weeklyReview: 'Performance analysis + pattern recognition + wins celebration + next week strategy',
      deepScanDiagnosis: 'Psychological profile + strength mapping + protocol design + welcome message',
    },
  });
}
