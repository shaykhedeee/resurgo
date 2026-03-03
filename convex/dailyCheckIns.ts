// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Daily Check-in Backend
// Morning briefings + Evening debriefs backed by AI
// ═══════════════════════════════════════════════════════════════════════════════

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// ─────────────────────────────────────────────────────────────────────────────
// Query: Get today's check-in
// ─────────────────────────────────────────────────────────────────────────────
export const getToday = query({
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

    const today = new Date().toISOString().split('T')[0];

    return await ctx.db
      .query('dailyCheckIns')
      .withIndex('by_userId_date', (q) => q.eq('userId', user._id).eq('date', today))
      .unique();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Query: Get recent check-ins (last 7 days)
// ─────────────────────────────────────────────────────────────────────────────
export const getRecent = query({
  args: { days: v.optional(v.number()) },
  returns: v.any(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) return [];

    const daysBack = args.days ?? 7;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysBack);
    const cutoffDate = cutoff.toISOString().split('T')[0];

    const all = await ctx.db
      .query('dailyCheckIns')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    return all.filter((c) => c.date >= cutoffDate);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Mutation: Save morning check-in
// ─────────────────────────────────────────────────────────────────────────────
export const saveMorning = mutation({
  args: {
    mood: v.number(),
    energy: v.number(),
    sleepQuality: v.number(),
    intention: v.optional(v.string()),
    topThreePriorities: v.optional(v.array(v.string())),
    aiBriefing: v.optional(v.string()),
  },
  returns: v.id('dailyCheckIns'),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    const today = new Date().toISOString().split('T')[0];
    const now = Date.now();

    // Check if today's check-in already exists
    const existing = await ctx.db
      .query('dailyCheckIns')
      .withIndex('by_userId_date', (q) => q.eq('userId', user._id).eq('date', today))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        morningMood: args.mood,
        morningEnergy: args.energy,
        sleepQuality: args.sleepQuality,
        morningIntention: args.intention,
        topThreePriorities: args.topThreePriorities,
        morningAiBriefing: args.aiBriefing,
        morningCompletedAt: now,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert('dailyCheckIns', {
      userId: user._id,
      date: today,
      morningMood: args.mood,
      morningEnergy: args.energy,
      sleepQuality: args.sleepQuality,
      morningIntention: args.intention,
      topThreePriorities: args.topThreePriorities,
      morningAiBriefing: args.aiBriefing,
      morningCompletedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Mutation: Save evening check-in
// ─────────────────────────────────────────────────────────────────────────────
export const saveEvening = mutation({
  args: {
    mood: v.number(),
    energy: v.number(),
    dayRating: v.number(),
    biggestWin: v.optional(v.string()),
    biggestChallenge: v.optional(v.string()),
    gratitude: v.optional(v.array(v.string())),
    tomorrowFocus: v.optional(v.string()),
    aiReflection: v.optional(v.string()),
  },
  returns: v.id('dailyCheckIns'),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    const today = new Date().toISOString().split('T')[0];
    const now = Date.now();

    // Check if today's check-in already exists
    const existing = await ctx.db
      .query('dailyCheckIns')
      .withIndex('by_userId_date', (q) => q.eq('userId', user._id).eq('date', today))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        eveningMood: args.mood,
        eveningEnergy: args.energy,
        dayRating: args.dayRating,
        biggestWin: args.biggestWin,
        biggestChallenge: args.biggestChallenge,
        gratitude: args.gratitude,
        tomorrowFocus: args.tomorrowFocus,
        eveningAiReflection: args.aiReflection,
        eveningCompletedAt: now,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert('dailyCheckIns', {
      userId: user._id,
      date: today,
      eveningMood: args.mood,
      eveningEnergy: args.energy,
      dayRating: args.dayRating,
      biggestWin: args.biggestWin,
      biggestChallenge: args.biggestChallenge,
      gratitude: args.gratitude,
      tomorrowFocus: args.tomorrowFocus,
      eveningAiReflection: args.aiReflection,
      eveningCompletedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Mutation: Update auto-populated stats
// ─────────────────────────────────────────────────────────────────────────────
export const updateStats = mutation({
  args: {
    date: v.string(),
    tasksCompleted: v.optional(v.number()),
    habitsCompleted: v.optional(v.number()),
    focusMinutes: v.optional(v.number()),
    xpEarned: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    const existing = await ctx.db
      .query('dailyCheckIns')
      .withIndex('by_userId_date', (q) => q.eq('userId', user._id).eq('date', args.date))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        tasksCompleted: args.tasksCompleted,
        habitsCompleted: args.habitsCompleted,
        focusMinutes: args.focusMinutes,
        xpEarned: args.xpEarned,
        updatedAt: Date.now(),
      });
    }

    return null;
  },
});
