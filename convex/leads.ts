import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const leadDoc = v.object({
  _id: v.id('leads'),
  _creationTime: v.number(),
  email: v.string(),
  source: v.string(),
  offer: v.union(v.string(), v.null()),
  variant: v.union(v.string(), v.null()),
  referrer: v.union(v.string(), v.null()),
  userAgent: v.union(v.string(), v.null()),
  utmSource: v.union(v.string(), v.null()),
  utmMedium: v.union(v.string(), v.null()),
  utmCampaign: v.union(v.string(), v.null()),
  utmTerm: v.union(v.string(), v.null()),
  utmContent: v.union(v.string(), v.null()),
  capturedAt: v.number(),
  convertedToUser: v.boolean(),
  convertedAt: v.optional(v.number()),
});

export const capture = mutation({
  args: {
    email: v.string(),
    source: v.string(),
    offer: v.union(v.string(), v.null()),
    variant: v.union(v.string(), v.null()),
    referrer: v.union(v.string(), v.null()),
    userAgent: v.union(v.string(), v.null()),
    utmSource: v.union(v.string(), v.null()),
    utmMedium: v.union(v.string(), v.null()),
    utmCampaign: v.union(v.string(), v.null()),
    utmTerm: v.union(v.string(), v.null()),
    utmContent: v.union(v.string(), v.null()),
    capturedAt: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.trim().toLowerCase();

    const existing = await ctx.db
      .query('leads')
      .withIndex('by_email', (q) => q.eq('email', normalizedEmail))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        source: args.source,
        offer: args.offer,
        variant: args.variant,
        referrer: args.referrer,
        userAgent: args.userAgent,
        utmSource: args.utmSource,
        utmMedium: args.utmMedium,
        utmCampaign: args.utmCampaign,
        utmTerm: args.utmTerm,
        utmContent: args.utmContent,
        capturedAt: args.capturedAt,
      });
      return null;
    }

    await ctx.db.insert('leads', {
      email: normalizedEmail,
      source: args.source,
      offer: args.offer,
      variant: args.variant,
      referrer: args.referrer,
      userAgent: args.userAgent,
      utmSource: args.utmSource,
      utmMedium: args.utmMedium,
      utmCampaign: args.utmCampaign,
      utmTerm: args.utmTerm,
      utmContent: args.utmContent,
      capturedAt: args.capturedAt,
      convertedToUser: false,
    });

    return null;
  },
});

export const listRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(leadDoc),
  handler: async (ctx, args) => {
    const cappedLimit = Math.max(1, Math.min(args.limit ?? 20, 100));
    const leads = await ctx.db.query('leads').collect();
    return leads
      .sort((a, b) => b.capturedAt - a.capturedAt)
      .slice(0, cappedLimit);
  },
});