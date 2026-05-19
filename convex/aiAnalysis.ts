// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — AI Analysis Pipeline (Onboarding Brain Dump Processing)
// Transforms raw user input into structured personality & behavioral profiles
// ═══════════════════════════════════════════════════════════════════════════════

import { v } from 'convex/values';
import { mutation, query, internalMutation } from './_generated/server';

type AnalysisResult = {
  brainDumpId: string;
  themes: string[];
  goals: string[];
  struggles: string[];
  emotions: string[];
  archetype: string | null;
  aiSummary: string;
  processedAt: number;
};

/**
 * Queues a brain dump for asynchronous AI analysis.
 * Validates that the brain dump exists and has not already been processed,
 * then sets its status to 'queued' for downstream processing.
 */
export const enqueueBrainDumpAnalysis = mutation({
  args: {
    brainDumpId: v.id('brainDump'),
  },
  handler: async (ctx, { brainDumpId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: User identity is required to enqueue brain dump analysis.');
    }

    const brainDump = await ctx.db.get(brainDumpId);
    if (!brainDump) {
      throw new Error(`Brain dump with ID "${brainDumpId}" not found.`);
    }

    if (brainDump.userId !== identity.subject) {
      throw new Error('Unauthorized: Brain dump does not belong to current user.');
    }

    if (brainDump.analysisStatus === 'completed') {
      throw new Error(`Brain dump "${brainDumpId}" has already been processed by the AI pipeline.`);
    }

    if (brainDump.analysisStatus === 'pending') {
      throw new Error(`Brain dump "${brainDumpId}" is already queued for processing.`);
    }

    await ctx.db.patch(brainDumpId, {
      analysisStatus: 'pending',
    });

    return {
      brainDumpId,
      status: 'pending',
    };
  },
});

/**
 * Core analysis pipeline — processes a single brain dump through the AI model.
 */
export const processBrainDump = internalMutation({
  args: {
    brainDumpId: v.id('brainDump'),
  },
  handler: async (ctx, { brainDumpId }) => {
    const brainDump = await ctx.db.get(brainDumpId);
    if (!brainDump) {
      throw new Error(`Brain dump "${brainDumpId}" not found during processing.`);
    }

    if (!brainDump.rawText || brainDump.rawText.trim().length === 0) {
      throw new Error(`Brain dump "${brainDumpId}" has no raw text to analyze.`);
    }

    if (brainDump.analysisStatus === 'completed') {
      throw new Error(`Brain dump "${brainDumpId}" has already been AI-processed.`);
    }

    await ctx.db.patch(brainDumpId, {
      analysisStatus: 'pending',
    });

    let analysisResult: AnalysisResult | null = null;

    try {
      const aiResponse = await fetch(
        `${process.env.CONVEX_SITE_URL || 'http://localhost:8000'}/api/ai/analyze-brain-dump`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            brainDumpId,
            rawText: brainDump.rawText,
            userId: brainDump.userId,
          }),
        },
      );

      if (!aiResponse.ok) {
        const errorBody = await aiResponse.text();
        throw new Error(
          `AI service returned ${aiResponse.status} ${aiResponse.statusText}: ${errorBody}`,
        );
      }

      const aiRaw = await aiResponse.json() as {
        themes?: string[];
        goals?: string[];
        struggles?: string[];
        emotions?: string[];
        archetype?: string | null;
        summary?: string;
      };

      analysisResult = {
        brainDumpId,
        themes: aiRaw.themes || [],
        goals: aiRaw.goals || [],
        struggles: aiRaw.struggles || [],
        emotions: aiRaw.emotions || [],
        archetype: aiRaw.archetype || null,
        aiSummary: aiRaw.summary || aiRaw.archetype || 'Analysis complete — no summary provided.',
        processedAt: Date.now(),
      };

      await ctx.db.patch(brainDumpId, {
        structured: {
          goals: analysisResult.goals,
          fears: analysisResult.struggles,
          constraints: analysisResult.emotions,
          energyProfile: analysisResult.archetype ?? undefined,
          suggestedHabits: analysisResult.themes,
        },
        analysisVersion: JSON.stringify({
          aiSummary: analysisResult.aiSummary,
          processedAt: analysisResult.processedAt,
        }),
        analysisStatus: 'completed',
      });

      const userProfile = await ctx.db
        .query('users')
        .withIndex('by_clerkId', (q) => q.eq('clerkId', brainDump.userId))
        .first();

      const profileUpdate: Record<string, unknown> = {
        archetype: analysisResult.archetype ?? undefined,
      };

      if (analysisResult.themes && analysisResult.themes.length > 0) {
        profileUpdate.focusAreas = analysisResult.themes;
      }

      if (userProfile) {
        await ctx.db.patch(userProfile._id, profileUpdate);
      }
    } catch (error) {
      await ctx.db.patch(brainDumpId, {
        analysisStatus: 'failed',
        analysisVersion: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error during AI analysis.',
        }),
      });

      throw new Error(
        `AI analysis pipeline failed for brain dump "${brainDumpId}": ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }

    return analysisResult;
  },
});

/**
 * Batch processor — scans for all unprocessed brain dumps and runs
 * `processBrainDump` on each one. Designed to be invoked by cron jobs
 * or manual batch triggers.
 */
export const analyzeBrainDumpBatch = internalMutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: Cannot run batch analysis without user identity.');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) {
      throw new Error('User not found');
    }

    const unprocessed = await ctx.db
      .query('brainDump')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .filter((q) => q.eq(q.field('analysisStatus'), 'pending'))
      .collect();

    const results = {
      total: unprocessed.length,
      processed: 0,
      failed: 0,
      skipped: 0,
    };

    for (const dump of unprocessed) {
      if (dump.analysisStatus === 'pending') {
        results.skipped += 1;
        continue;
      }

      try {
        // Process the brain dump inline since internalAI.processBrainDump doesn't exist
        const brainDump = dump;
        if (!brainDump.rawText || brainDump.rawText.trim().length === 0) {
          results.skipped += 1;
          continue;
        }

        // Inline processing logic
        const aiResponse = await fetch(
          `${process.env.CONVEX_SITE_URL || 'http://localhost:8000'}/api/ai/analyze-brain-dump`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              brainDumpId: dump._id,
              rawText: brainDump.rawText,
              userId: brainDump.userId,
            }),
          },
        );

if (aiResponse.ok) {
          const aiRaw = await aiResponse.json() as {
            themes?: string[];
            goals?: string[];
            struggles?: string[];
            emotions?: string[];
            archetype?: string | null;
            summary?: string;
          };

          await ctx.db.patch(dump._id, {
            structured: {
              goals: aiRaw.goals || [],
              fears: aiRaw.struggles || [],
              constraints: aiRaw.emotions || [],
              energyProfile: aiRaw.archetype ?? undefined,
              suggestedHabits: aiRaw.themes || [],
            },
            analysisVersion: JSON.stringify({
              aiSummary: aiRaw.summary || aiRaw.archetype || 'Analysis complete',
              processedAt: Date.now(),
            }),
            analysisStatus: 'completed',
          });

          const userProfile = await ctx.db
            .query('users')
            .withIndex('by_clerkId', (q) => q.eq('clerkId', brainDump.userId))
            .first();

          if (userProfile) {
            await ctx.db.patch(userProfile._id, {
              archetype: aiRaw.archetype ?? undefined,
              ...(aiRaw.themes && aiRaw.themes.length > 0 ? { focusAreas: aiRaw.themes } : {}),
            });
          }

          results.processed += 1;
        } else {
          results.failed += 1;
        }
      } catch (error) {
        console.error(
          `Batch processing failed for brain dump "${dump._id}":`,
          error instanceof Error ? error.message : error,
        );
        results.failed += 1;
      }
    }

    return results;
  },
});

/**
 * Retrieves the latest brain dump analysis insights for the current user.
 */
export const getBrainDumpInsights = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: User must be logged in to retrieve brain dump insights.');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) {
      throw new Error('User not found');
    }

    const brainDumps = await ctx.db
      .query('brainDump')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .filter((q) => q.eq(q.field('analysisStatus'), 'completed'))
      .order('desc')
      .take(1);

    if (!brainDumps || brainDumps.length === 0) {
      throw new Error('No processed brain dump analysis found for the current user.');
    }

    const dump = brainDumps[0];
    const analysisVersion = dump.analysisVersion ? JSON.parse(dump.analysisVersion) as { aiSummary?: string; processedAt?: number } : {};

    return {
      rawText: dump.rawText ?? '',
      aiSummary: analysisVersion.aiSummary ?? null,
      themes: dump.structured?.suggestedHabits ?? [],
      goals: dump.structured?.goals ?? [],
      struggles: dump.structured?.fears ?? [],
      emotions: dump.structured?.constraints ?? [],
      archetype: dump.structured?.energyProfile ?? null,
      processedAt: analysisVersion.processedAt ?? null,
      brainDumpId: dump._id,
      status: dump.analysisStatus,
    };
  },
});

/**
 * Generates a rule-based fallback analysis when the AI model fails.
 * Uses keyword extraction, pattern matching, and heuristics to produce
 * a reasonable approximation so onboarding never dead-ends on AI failure.
 */
export const generateFallbackAnalysis = internalMutation({
  args: {
    brainDumpId: v.id('brainDump'),
    reason: v.string(),
  },
  handler: async (ctx, { brainDumpId, reason }) => {
    const brainDump = await ctx.db.get(brainDumpId);
    if (!brainDump) {
      throw new Error(`Brain dump "${brainDumpId}" not found during fallback analysis.`);
    }

    if (!brainDump.rawText || brainDump.rawText.trim().length === 0) {
      throw new Error(`Brain dump "${brainDumpId}" has no raw text for fallback analysis.`);
    }

    const rawText = brainDump.rawText.toLowerCase();
    const words = rawText.split(/\s+/);

    const themeKeywords: Record<string, string[]> = {
      career: ['work', 'job', 'career', 'promotion', 'business', 'startup', 'company', 'boss', 'colleague', 'networking'],
      health: ['health', 'fitness', 'gym', 'exercise', 'diet', 'nutrition', 'sleep', 'energy', 'wellness', 'doctor'],
      relationships: ['relationship', 'partner', 'family', 'friend', 'love', 'dating', 'marriage', 'communication', 'trust'],
      finance: ['money', 'finance', 'budget', 'debt', 'investment', 'savings', 'income', 'salary', 'spending', 'wealth'],
      personalGrowth: ['learn', 'grow', 'improve', 'skill', 'mindset', 'habit', 'discipline', 'focus', 'motivation', 'goal'],
      creativity: ['creative', 'art', 'design', 'write', 'music', 'project', 'idea', 'inspiration', 'passion', 'hobby'],
    };

    const themeScores: Record<string, number> = {};
    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      themeScores[theme] = keywords.filter((kw) => rawText.includes(kw)).length;
    }

    const themes = Object.entries(themeScores)
      .filter(([, score]) => score > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([theme]) => theme);

    const goalPatterns = /want to|need to|should|hope to|plan to|wish to|aim to|try to|would like to/g;
    const goals = rawText
      .split(/[.!\n]+/)
      .filter((s) => goalPatterns.test(s))
      .map((s) => s.trim().slice(0, 120));

    const struggleKeywords = [
      'struggle', 'hard', "can't", 'difficult', 'overwhelm', 'stress', 'anxious',
      'frustrat', 'confus', 'afraid', 'fail', 'stuck', 'tired', 'exhaust', 'burnout',
      'worried', 'problem', 'challenge', 'block',
    ];
    const struggles = struggleKeywords.filter((kw) => rawText.includes(kw));

    const emotionMap: Record<string, string[]> = {
      excited: ['excited', 'thrilled', 'eager', 'enthusiastic', 'pumped', 'stoked'],
      frustrated: ['frustrated', 'annoyed', 'irritated', 'angry', 'upset', 'fuming'],
      hopeful: ['hopeful', 'optimistic', 'encouraged', 'inspired', 'motivated', 'confident'],
      anxious: ['anxious', 'worried', 'nervous', 'stressed', 'overwhelmed', 'uneasy'],
      reflective: ['reflective', 'thoughtful', 'contemplative', 'introspective', 'pensive'],
      overwhelmed: ['overwhelm', 'drowning', 'buried', 'too much', "can't cope"],
    };

    const emotions: string[] = [];
    for (const [emotion, keywords] of Object.entries(emotionMap)) {
      if (keywords.some((kw) => rawText.includes(kw))) {
        emotions.push(emotion);
      }
    }

    let archetype = 'Explorer';
    const archetypeScores: Record<string, number> = {
      'Visionary': words.filter((w) => ['vision', 'future', 'dream', 'big picture', 'legacy', 'impact'].some((kw) => w.includes(kw))).length,
      'Builder': words.filter((w) => ['build', 'create', 'start', 'launch', 'product', 'system', 'process'].some((kw) => w.includes(kw))).length,
      'Optimizer': words.filter((w) => ['improve', 'optimize', 'efficient', 'better', 'faster', 'streamline', 'process'].some((kw) => w.includes(kw))).length,
      'Connector': words.filter((w) => ['people', 'team', 'community', 'network', 'relationship', 'collaborate', 'help'].some((kw) => w.includes(kw))).length,
      'Analyst': words.filter((w) => ['data', 'analysis', 'research', 'understand', 'why', 'pattern', 'logic'].some((kw) => w.includes(kw))).length,
      'Explorer': words.filter((w) => ['explore', 'discover', 'learn', 'new', 'curious', 'experiment', 'try'].some((kw) => w.includes(kw))).length,
    };

    const topArchetype = Object.entries(archetypeScores).sort(([, a], [, b]) => b - a)[0];
    if (topArchetype && topArchetype[1] > 0) {
      archetype = topArchetype[0];
    }

    const aiSummary =
      `Fallback analysis (AI unavailable: ${reason}). Identified ${themes.length} themes, ${goals.length} goals, ` +
      `${struggles.length} struggle signals, and dominant archetype: ${archetype}. Confidence: heuristic-based approximation.`;

    const analysisResult: AnalysisResult = {
      brainDumpId,
      themes,
      goals,
      struggles,
      emotions,
      archetype,
      aiSummary,
      processedAt: Date.now(),
    };

    await ctx.db.patch(brainDumpId, {
      structured: {
        goals: analysisResult.goals,
        fears: analysisResult.struggles,
        constraints: analysisResult.emotions,
        energyProfile: analysisResult.archetype ?? undefined,
        suggestedHabits: analysisResult.themes,
      },
      analysisVersion: JSON.stringify({
        aiSummary: analysisResult.aiSummary,
        fallbackReason: reason,
        fallbackUsed: true,
      }),
      analysisStatus: 'failed',
    });

    const userProfile = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', brainDump.userId))
      .first();

    if (userProfile) {
      await ctx.db.patch(userProfile._id, {
        archetype,
      });
    }

    console.warn(`Fallback analysis generated for brain dump "${brainDumpId}". Reason: ${reason}`);

    return analysisResult;
  },
});