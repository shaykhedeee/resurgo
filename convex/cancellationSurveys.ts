// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Cancellation Survey (Convex)
// Stores churn survey responses for product insights
// Offers annual discount retention for price-sensitive churning users
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

// ── Reasons that qualify for a retention discount offer ──
const PRICE_REASONS = ['too_expensive', 'price', 'cost', 'not_worth_it', 'budget'];

export const submit = mutation({
  args: {
    reason: v.string(),
    otherReason: v.optional(v.string()),
    feedback: v.optional(v.string()),
    wouldReturn: v.optional(v.boolean()),
  },
  returns: v.object({
    showRetentionOffer: v.boolean(),
    offerType: v.optional(v.string()),
    offerMessage: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    await ctx.db.insert('cancellationSurveys', {
      userId: user._id,
      reason: args.reason,
      otherReason: args.otherReason,
      feedback: args.feedback,
      wouldReturn: args.wouldReturn,
      createdAt: Date.now(),
    });

    // Offer annual plan discount if user cancels due to price
    const isPriceReason = PRICE_REASONS.includes(args.reason.toLowerCase());
    const currentPlan = user.subscriptionTier ?? 'free';
    const isMonthly = currentPlan === 'pro' || currentPlan === 'pro_monthly';

    if (isPriceReason && isMonthly) {
      return {
        showRetentionOffer: true,
        offerType: 'annual_discount',
        offerMessage: 'Switch to annual billing and save 50%. That is $29.99/year instead of $4.99/month ($59.88/year).',
      };
    }

    return { showRetentionOffer: false };
  },
});

export const getRecentSurveys = query({
  args: {},
  returns: v.array(v.object({
    reason: v.string(),
    otherReason: v.optional(v.string()),
    feedback: v.optional(v.string()),
    wouldReturn: v.optional(v.boolean()),
    createdAt: v.number(),
  })),
  handler: async (ctx) => {
    const surveys = await ctx.db
      .query('cancellationSurveys')
      .order('desc')
      .take(50);

    return surveys.map((s: any) => ({
      reason: s.reason,
      otherReason: s.otherReason,
      feedback: s.feedback,
      wouldReturn: s.wouldReturn,
      createdAt: s.createdAt,
    }));
  },
});
