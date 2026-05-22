import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const saveIntegration = mutation({
  args: {
    userId: v.id('users'),
    provider: v.union(v.literal('google'), v.literal('notion')),
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    scopes: v.array(v.string()),
    settings: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('userIntegrations')
      .withIndex('by_userId_provider', (q) =>
        q.eq('userId', args.userId).eq('provider', args.provider)
      )
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        accessToken: args.accessToken,
        refreshToken: args.refreshToken ?? existing.refreshToken,
        expiresAt: args.expiresAt ?? existing.expiresAt,
        scopes: args.scopes,
        settings: args.settings ?? existing.settings,
        updatedAt: now,
      });
      return existing._id;
    } else {
      const id = await ctx.db.insert('userIntegrations', {
        userId: args.userId,
        provider: args.provider,
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        expiresAt: args.expiresAt,
        scopes: args.scopes,
        settings: args.settings,
        createdAt: now,
        updatedAt: now,
      });
      return id;
    }
  },
});

export const getIntegration = query({
  args: {
    userId: v.id('users'),
    provider: v.union(v.literal('google'), v.literal('notion')),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('userIntegrations')
      .withIndex('by_userId_provider', (q) =>
        q.eq('userId', args.userId).eq('provider', args.provider)
      )
      .unique();
  },
});
