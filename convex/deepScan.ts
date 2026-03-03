// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Deep Scan Protocol Backend
// 5-stage onboarding with AI diagnosis + system generation
// ═══════════════════════════════════════════════════════════════════════════════

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// ─────────────────────────────────────────────────────────────────────────────
// Query: Get current deep scan for user
// ─────────────────────────────────────────────────────────────────────────────
export const getCurrent = query({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) return null;

    return await ctx.db
      .query('deepScans')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .order('desc')
      .first();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Mutation: Start a new deep scan
// ─────────────────────────────────────────────────────────────────────────────
export const startScan = mutation({
  args: {},
  returns: v.id('deepScans'),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    // Check if there's already a scan in progress
    const existing = await ctx.db
      .query('deepScans')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .order('desc')
      .first();

    if (existing && !existing.completedAt) {
      return existing._id;
    }

    const now = Date.now();
    return await ctx.db.insert('deepScans', {
      userId: user._id,
      completedStages: [],
      currentStage: 1,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Mutation: Save Stage 1 — Identity Scan
// ─────────────────────────────────────────────────────────────────────────────
export const saveStage1 = mutation({
  args: {
    scanId: v.id('deepScans'),
    nickname: v.string(),
    age: v.optional(v.number()),
    occupation: v.optional(v.string()),
    lifeStage: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const scan = await ctx.db.get(args.scanId);
    if (!scan) throw new Error('Scan not found');

    const completedStages = scan.completedStages.includes(1)
      ? scan.completedStages
      : [...scan.completedStages, 1];

    await ctx.db.patch(args.scanId, {
      nickname: args.nickname,
      age: args.age,
      occupation: args.occupation,
      lifeStage: args.lifeStage,
      completedStages: completedStages,
      currentStage: 2,
      updatedAt: Date.now(),
    });
    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Mutation: Save Stage 2 — Life Pillar Assessment
// ─────────────────────────────────────────────────────────────────────────────
export const saveStage2 = mutation({
  args: {
    scanId: v.id('deepScans'),
    pillarScores: v.object({
      health: v.number(),
      career: v.number(),
      finance: v.number(),
      relationships: v.number(),
      mindset: v.number(),
      creativity: v.number(),
      fun: v.number(),
      environment: v.number(),
    }),
    pillarPriorities: v.array(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const scan = await ctx.db.get(args.scanId);
    if (!scan) throw new Error('Scan not found');

    const completedStages = scan.completedStages.includes(2)
      ? scan.completedStages
      : [...scan.completedStages, 2];

    await ctx.db.patch(args.scanId, {
      pillarScores: args.pillarScores,
      pillarPriorities: args.pillarPriorities,
      completedStages: completedStages,
      currentStage: 3,
      updatedAt: Date.now(),
    });
    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Mutation: Save Stage 3 — Root Cause Analysis
// ─────────────────────────────────────────────────────────────────────────────
export const saveStage3 = mutation({
  args: {
    scanId: v.id('deepScans'),
    biggestChallenge: v.string(),
    failedBefore: v.optional(v.string()),
    whatStopped: v.optional(v.string()),
    sabotagePatterns: v.optional(v.array(v.string())),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const scan = await ctx.db.get(args.scanId);
    if (!scan) throw new Error('Scan not found');

    const completedStages = scan.completedStages.includes(3)
      ? scan.completedStages
      : [...scan.completedStages, 3];

    await ctx.db.patch(args.scanId, {
      biggestChallenge: args.biggestChallenge,
      failedBefore: args.failedBefore,
      whatStopped: args.whatStopped,
      sabotagePatterns: args.sabotagePatterns,
      completedStages: completedStages,
      currentStage: 4,
      updatedAt: Date.now(),
    });
    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Mutation: Save Stage 4 — Behavioral Fingerprint
// ─────────────────────────────────────────────────────────────────────────────
export const saveStage4 = mutation({
  args: {
    scanId: v.id('deepScans'),
    chronotype: v.optional(v.string()),
    energyPattern: v.optional(v.string()),
    motivationStyle: v.optional(v.string()),
    accountabilityStyle: v.optional(v.string()),
    stressResponse: v.optional(v.string()),
    decisionStyle: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const scan = await ctx.db.get(args.scanId);
    if (!scan) throw new Error('Scan not found');

    const completedStages = scan.completedStages.includes(4)
      ? scan.completedStages
      : [...scan.completedStages, 4];

    await ctx.db.patch(args.scanId, {
      chronotype: args.chronotype,
      energyPattern: args.energyPattern,
      motivationStyle: args.motivationStyle,
      accountabilityStyle: args.accountabilityStyle,
      stressResponse: args.stressResponse,
      decisionStyle: args.decisionStyle,
      completedStages: completedStages,
      currentStage: 5,
      updatedAt: Date.now(),
    });
    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Mutation: Save Stage 5 — Commitment Calibration
// ─────────────────────────────────────────────────────────────────────────────
export const saveStage5 = mutation({
  args: {
    scanId: v.id('deepScans'),
    commitmentLevel: v.optional(v.number()),
    dailyTimeAvailable: v.optional(v.number()),
    biggestFear: v.optional(v.string()),
    ninetyDayVision: v.optional(v.string()),
    startingDifficulty: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const scan = await ctx.db.get(args.scanId);
    if (!scan) throw new Error('Scan not found');

    const completedStages = scan.completedStages.includes(5)
      ? scan.completedStages
      : [...scan.completedStages, 5];

    await ctx.db.patch(args.scanId, {
      commitmentLevel: args.commitmentLevel,
      dailyTimeAvailable: args.dailyTimeAvailable,
      biggestFear: args.biggestFear,
      ninetyDayVision: args.ninetyDayVision,
      startingDifficulty: args.startingDifficulty,
      completedStages: completedStages,
      currentStage: 5,
      updatedAt: Date.now(),
    });
    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Mutation: Complete scan with AI diagnosis
// ─────────────────────────────────────────────────────────────────────────────
export const completeScan = mutation({
  args: {
    scanId: v.id('deepScans'),
    aiDiagnosis: v.optional(v.string()),
    aiRecommendations: v.optional(v.string()),
    archetype: v.optional(v.string()),
    archetypeConfidence: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const scan = await ctx.db.get(args.scanId);
    if (!scan) throw new Error('Scan not found');

    await ctx.db.patch(args.scanId, {
      aiDiagnosis: args.aiDiagnosis,
      aiRecommendations: args.aiRecommendations,
      archetype: args.archetype,
      archetypeConfidence: args.archetypeConfidence,
      completedAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Also update user archetype & mark onboarding complete
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, {
        onboardingComplete: true,
        archetype: args.archetype,
        archetypeConfidence: args.archetypeConfidence,
        onboardingData: JSON.stringify({
          scanId: args.scanId,
          completedAt: Date.now(),
          stages: scan.completedStages,
        }),
        updatedAt: Date.now(),
      });
    }

    return null;
  },
});
