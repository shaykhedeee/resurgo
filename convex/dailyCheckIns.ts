// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Daily Check-in Backend
// Morning briefings + Evening debriefs backed by AI
// ═══════════════════════════════════════════════════════════════════════════════

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Simple level calculator (matches gamification.ts)
function calculateLevel(xp: number): number {
  if (xp < 100) return 1;
  if (xp < 300) return 2;
  if (xp < 600) return 3;
  if (xp < 1000) return 4;
  if (xp < 1500) return 5;
  if (xp < 2200) return 6;
  if (xp < 3000) return 7;
  if (xp < 4000) return 8;
  if (xp < 5500) return 9;
  if (xp < 7500) return 10;
  if (xp < 10000) return 11;
  if (xp < 13000) return 12;
  if (xp < 17000) return 13;
  if (xp < 22000) return 14;
  if (xp < 28000) return 15;
  return 16;
}

// Check-in streak milestones → XP reward
const CHECK_IN_MILESTONES: Record<number, number> = {
  3: 25,
  7: 50,
  14: 75,
  21: 100,
  30: 150,
  60: 250,
  100: 500,
};

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

    const id = await ctx.db.insert('dailyCheckIns', {
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

    // ── Compute check-in streak and award milestone XP ──
    const recentCheckIns = await ctx.db
      .query('dailyCheckIns')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .order('desc')
      .take(100);

    let streak = 0;
    for (let i = 0; i < recentCheckIns.length; i++) {
      const expected = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      if (recentCheckIns[i].date === expected) {
        streak++;
      } else {
        break;
      }
    }

    const milestoneXP = CHECK_IN_MILESTONES[streak];
    if (milestoneXP) {
      const gamification = await ctx.db
        .query('gamification')
        .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
        .unique();

      if (gamification) {
        // Apply daily XP cap
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayXPEntries = await ctx.db
          .query('xpHistory')
          .withIndex('by_userId_createdAt', (q: any) =>
            q.eq('userId', user._id).gte('createdAt', todayStart.getTime())
          )
          .collect();
        const xpEarnedToday = todayXPEntries.reduce((s, e) => s + e.amount, 0);
        const effective = Math.min(milestoneXP, 500 - xpEarnedToday);

        if (effective > 0) {
          const newXP = gamification.totalXP + effective;
          await ctx.db.patch(gamification._id, {
            totalXP: newXP,
            level: calculateLevel(newXP),
            coins: (gamification.coins ?? 0) + Math.ceil(effective * 0.1),
            updatedAt: now,
          });
          await ctx.db.insert('xpHistory', {
            userId: user._id,
            amount: effective,
            source: 'streak_bonus',
            description: `${streak}-day check-in streak milestone!`,
            createdAt: now,
          });
        }
      }
    }

    return id;
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
