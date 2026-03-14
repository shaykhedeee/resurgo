// ─────────────────────────────────────────────────────────────────────────────
// RESURGO — Wishlist mutations & queries
// ─────────────────────────────────────────────────────────────────────────────

import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: { includesBought: v.optional(v.boolean()) },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();
    if (!user) return [];

    const q = ctx.db.query('wishlistItems').withIndex('by_userId', (q) => q.eq('userId', user._id));
    const items = await q.collect();
    if (args.includesBought === false) {
      return items.filter((i) => !i.bought);
    }
    return items.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    url: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  returns: v.id('wishlistItems'),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .first();
    if (!user) throw new Error('User not found');

    return await ctx.db.insert('wishlistItems', {
      userId: user._id,
      name: args.name,
      price: args.price,
      currency: args.currency ?? 'USD',
      priority: args.priority,
      url: args.url,
      notes: args.notes,
      bought: false,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('wishlistItems'),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    priority: v.optional(v.union(v.literal('low'), v.literal('medium'), v.literal('high'))),
    url: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
    return null;
  },
});

export const toggleBought = mutation({
  args: { id: v.id('wishlistItems') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error('Item not found');
    await ctx.db.patch(args.id, { bought: !item.bought, updatedAt: Date.now() });
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id('wishlistItems') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    await ctx.db.delete(args.id);
    return null;
  },
});
