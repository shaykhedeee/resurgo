// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Memories (Convex)
// Manages vector-indexed persistent memory store for user coaching personalization
// ═══════════════════════════════════════════════════════════════════════════════

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const addMemory = mutation({
  args: {
    content: v.string(),
    type: v.union(
      v.literal('behavioral'),
      v.literal('achievement'),
      v.literal('failure'),
      v.literal('preference'),
      v.literal('insight'),
      v.literal('weekly_summary')
    ),
    sourceType: v.optional(
      v.union(
        v.literal('coaching_session'),
        v.literal('habit_completion'),
        v.literal('goal_event'),
        v.literal('weekly_review'),
        v.literal('mood_entry')
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    const embedding = Array(1536).fill(0);
    embedding[0] = 1.0; // simple mock vector placeholder for vector index integrity

    await ctx.db.insert('memories', {
      userId: user._id,
      content: args.content,
      embedding,
      type: args.type,
      relevanceScore: 0.8,
      sourceType: args.sourceType ?? 'coaching_session',
      createdAt: Date.now(),
    });
  },
});

export const getMemories = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) return [];

    return await ctx.db
      .query('memories')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .order('desc')
      .collect();
  },
});
