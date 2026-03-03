// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — AI Greetings Backend
// First Contact briefing after onboarding completion
// ═══════════════════════════════════════════════════════════════════════════════

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// ─────────────────────────────────────────────────────────────────────────────
// Query: Get greeting for current user
// ─────────────────────────────────────────────────────────────────────────────
export const getGreeting = query({
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
      .query('aiGreetings')
      .withIndex('by_userId', (q) => q.eq('userId', user._id))
      .order('desc')
      .first();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Mutation: Save AI greeting
// ─────────────────────────────────────────────────────────────────────────────
export const saveGreeting = mutation({
  args: {
    greeting: v.string(),
    systemPlan: v.optional(v.string()),
    recommendations: v.optional(v.array(v.object({
      title: v.string(),
      description: v.string(),
      action: v.string(),
      priority: v.number(),
    }))),
  },
  returns: v.id('aiGreetings'),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    return await ctx.db.insert('aiGreetings', {
      userId: user._id,
      greeting: args.greeting,
      systemPlan: args.systemPlan,
      recommendations: args.recommendations,
      viewed: false,
      createdAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Mutation: Mark greeting as viewed
// ─────────────────────────────────────────────────────────────────────────────
export const markViewed = mutation({
  args: { greetingId: v.id('aiGreetings') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    await ctx.db.patch(args.greetingId, {
      viewed: true,
      viewedAt: Date.now(),
    });

    return null;
  },
});
