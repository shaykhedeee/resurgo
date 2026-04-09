// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Wellness (Convex)
// Mood tracking, journal entries
// ═══════════════════════════════════════════════════════════════════════════════

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

async function getAuthUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Not authenticated');

  const user = await ctx.db
    .query('users')
    .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
    .unique();
  if (!user) throw new Error('User not found');
  return user;
}

// ─────────────────────────────────────────────────────────────────────────────
// LOG MOOD
// ─────────────────────────────────────────────────────────────────────────────
export const logMood = mutation({
  args: {
    date: v.string(),
    score: v.number(),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.id('moodEntries'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Check for existing entry on same date
    const existing = await ctx.db
      .query('moodEntries')
      .withIndex('by_userId_date', (q: any) =>
        q.eq('userId', user._id).eq('date', args.date)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        score: args.score,
        notes: args.notes,
        tags: args.tags,
      });
      return existing._id;
    }

    return await ctx.db.insert('moodEntries', {
      userId: user._id,
      date: args.date,
      score: args.score,
      notes: args.notes,
      tags: args.tags,
      createdAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET MOOD HISTORY
// ─────────────────────────────────────────────────────────────────────────────
export const getMoodHistory = query({
  args: { days: v.optional(v.number()) },
  returns: v.array(
    v.object({
      _id: v.id('moodEntries'),
      _creationTime: v.number(),
      userId: v.id('users'),
      date: v.string(),
      score: v.number(),
      notes: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, { days }) => {
    const user = await getAuthUser(ctx);

    const entries = await ctx.db
      .query('moodEntries')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    if (days) {
      return entries.slice(0, days);
    }
    return entries;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// CREATE JOURNAL ENTRY
// ─────────────────────────────────────────────────────────────────────────────
export const createJournalEntry = mutation({
  args: {
    date: v.string(),
    content: v.string(),
    habitLogId: v.optional(v.id('habitLogs')),
    type: v.optional(v.union(
      v.literal('reflection'),
      v.literal('gratitude'),
      v.literal('goal_note'),
      v.literal('freeform')
    )),
    goalId: v.optional(v.id('goals')),
  },
  returns: v.id('journal'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await ctx.db.insert('journal', {
      userId: user._id,
      date: args.date,
      content: args.content,
      habitLogId: args.habitLogId,
      type: args.type ?? 'freeform',
      goalId: args.goalId,
      createdAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET JOURNAL ENTRIES
// ─────────────────────────────────────────────────────────────────────────────
export const getJournalEntries = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(
    v.object({
      _id: v.id('journal'),
      _creationTime: v.number(),
      userId: v.id('users'),
      habitLogId: v.optional(v.id('habitLogs')),
      date: v.string(),
      content: v.string(),
      type: v.optional(v.union(
        v.literal('reflection'),
        v.literal('gratitude'),
        v.literal('goal_note'),
        v.literal('freeform')
      )),
      goalId: v.optional(v.id('goals')),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, { limit }) => {
    const user = await getAuthUser(ctx);

    const entries = await ctx.db
      .query('journal')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    return limit ? entries.slice(0, limit) : entries;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// RECENT MOODS (for coach context — last 7 entries)
// ─────────────────────────────────────────────────────────────────────────────
export const recentMoods = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('moodEntries'),
      _creationTime: v.number(),
      userId: v.id('users'),
      date: v.string(),
      score: v.number(),
      notes: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    return await ctx.db
      .query('moodEntries')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .take(7);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// RECENT SLEEP (for coach context — last 3 entries)
// ─────────────────────────────────────────────────────────────────────────────
export const recentSleep = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    return await ctx.db
      .query('sleepLogs')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .take(3);
  },
});

// ───────────────────────────────────────────────────────────────────────────
// LOG MOOD FROM AI COACH (alias for logMood — Living System)
// ───────────────────────────────────────────────────────────────────────────
export const logMoodFromAI = mutation({
  args: {
    score: v.number(),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    date: v.optional(v.string()),
  },
  returns: v.id('moodEntries'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const today = args.date ?? new Date().toISOString().slice(0, 10);

    // Upsert: update existing entry for today
    const existing = await ctx.db
      .query('moodEntries')
      .withIndex('by_userId_date', (q: any) => q.eq('userId', user._id).eq('date', today))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        score: args.score,
        notes: args.notes,
        tags: args.tags,
      });
      return existing._id;
    }

    return await ctx.db.insert('moodEntries', {
      userId: user._id,
      date: today,
      score: args.score,
      notes: args.notes,
      tags: args.tags,
      createdAt: Date.now(),
    });
  },
});
