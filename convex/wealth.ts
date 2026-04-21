// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Wealth Management (Net Worth, Debts, Savings Goals, AI Tips)
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

// ─── NET WORTH — Assets ───────────────────────────────────────────────────────

export const addAsset = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal('savings'), v.literal('property'), v.literal('investment'), v.literal('crypto'), v.literal('vehicle'), v.literal('other')),
    value: v.number(),
    currency: v.optional(v.string()),
  },
  returns: v.id('assets'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    return await ctx.db.insert('assets', { userId: user._id, ...args, createdAt: Date.now() });
  },
});

export const updateAsset = mutation({
  args: { assetId: v.id('assets'), value: v.optional(v.number()), name: v.optional(v.string()) },
  returns: v.null(),
  handler: async (ctx, { assetId, ...updates }) => {
    const user = await getAuthUser(ctx);
    const asset = await ctx.db.get(assetId);
    if (!asset || asset.userId !== user._id) throw new Error('Not found');
    await ctx.db.patch(assetId, updates);
    return null;
  },
});

export const deleteAsset = mutation({
  args: { assetId: v.id('assets') },
  returns: v.null(),
  handler: async (ctx, { assetId }) => {
    const user = await getAuthUser(ctx);
    const asset = await ctx.db.get(assetId);
    if (!asset || asset.userId !== user._id) throw new Error('Not found');
    await ctx.db.delete(assetId);
    return null;
  },
});

export const listAssets = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    return await ctx.db.query('assets').withIndex('by_userId', (q: any) => q.eq('userId', user._id)).collect();
  },
});

// ─── NET WORTH — Liabilities ──────────────────────────────────────────────────

export const addLiability = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal('loan'), v.literal('credit_card'), v.literal('overdraft'), v.literal('mortgage'), v.literal('other')),
    balance: v.number(),
    interestRate: v.optional(v.number()),
    minimumPayment: v.optional(v.number()),
    currency: v.optional(v.string()),
  },
  returns: v.id('liabilities'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    return await ctx.db.insert('liabilities', { userId: user._id, ...args, createdAt: Date.now() });
  },
});

export const updateLiability = mutation({
  args: { liabilityId: v.id('liabilities'), balance: v.optional(v.number()), name: v.optional(v.string()) },
  returns: v.null(),
  handler: async (ctx, { liabilityId, ...updates }) => {
    const user = await getAuthUser(ctx);
    const item = await ctx.db.get(liabilityId);
    if (!item || item.userId !== user._id) throw new Error('Not found');
    await ctx.db.patch(liabilityId, updates);
    return null;
  },
});

export const deleteLiability = mutation({
  args: { liabilityId: v.id('liabilities') },
  returns: v.null(),
  handler: async (ctx, { liabilityId }) => {
    const user = await getAuthUser(ctx);
    const item = await ctx.db.get(liabilityId);
    if (!item || item.userId !== user._id) throw new Error('Not found');
    await ctx.db.delete(liabilityId);
    return null;
  },
});

export const listLiabilities = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    return await ctx.db.query('liabilities').withIndex('by_userId', (q: any) => q.eq('userId', user._id)).collect();
  },
});

// ─── NET WORTH SNAPSHOT (monthly record) ──────────────────────────────────────

export const recordNetWorthSnapshot = mutation({
  args: { netWorth: v.number(), totalAssets: v.number(), totalLiabilities: v.number(), month: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const existing = await ctx.db.query('netWorthSnapshots')
      .withIndex('by_userId_month', (q: any) => q.eq('userId', user._id).eq('month', args.month))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { netWorth: args.netWorth, totalAssets: args.totalAssets, totalLiabilities: args.totalLiabilities });
    } else {
      await ctx.db.insert('netWorthSnapshots', { userId: user._id, ...args, recordedAt: Date.now() });
    }
    return null;
  },
});

export const listNetWorthHistory = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    return await ctx.db.query('netWorthSnapshots')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('asc')
      .collect();
  },
});
