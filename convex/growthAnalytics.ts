import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const growthEventNameValidator = v.union(
  v.literal('vision_board_viewed'),
  v.literal('vision_board_generate_clicked'),
  v.literal('vision_board_generation_success'),
  v.literal('vision_board_generation_failed'),
  v.literal('vision_board_pro_gate_hit'),
  v.literal('upgrade_clicked')
);

type GrowthEventName =
  | 'vision_board_viewed'
  | 'vision_board_generate_clicked'
  | 'vision_board_generation_success'
  | 'vision_board_generation_failed'
  | 'vision_board_pro_gate_hit'
  | 'upgrade_clicked';

type GrowthCounters = Record<GrowthEventName, number>;

function verifySyncSecret(providedSecret: string) {
  const expected = process.env.BILLING_WEBHOOK_SYNC_SECRET;
  if (!expected) {
    throw new Error('BILLING_WEBHOOK_SYNC_SECRET is not configured');
  }

  if (expected.length !== providedSecret.length) {
    throw new Error('Unauthorized growth analytics write');
  }

  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ providedSecret.charCodeAt(i);
  }

  if (mismatch !== 0) {
    throw new Error('Unauthorized growth analytics write');
  }
}

function summarizeGrowthEvents(
  events: Array<{
    eventName: GrowthEventName;
  }>
) {
  const counters: GrowthCounters = {
    vision_board_viewed: 0,
    vision_board_generate_clicked: 0,
    vision_board_generation_success: 0,
    vision_board_generation_failed: 0,
    vision_board_pro_gate_hit: 0,
    upgrade_clicked: 0,
  };

  for (const event of events) {
    counters[event.eventName] += 1;
  }

  const viewToGenerateRate =
    counters.vision_board_viewed > 0
      ? Math.round((counters.vision_board_generate_clicked / counters.vision_board_viewed) * 10000) / 100
      : 0;

  const generateSuccessRate =
    counters.vision_board_generate_clicked > 0
      ? Math.round((counters.vision_board_generation_success / counters.vision_board_generate_clicked) * 10000) / 100
      : 0;

  const gateToUpgradeRate =
    counters.vision_board_pro_gate_hit > 0
      ? Math.round((counters.upgrade_clicked / counters.vision_board_pro_gate_hit) * 10000) / 100
      : 0;

  return {
    counters,
    viewToGenerateRate,
    generateSuccessRate,
    gateToUpgradeRate,
  };
}

export const logGrowthEvent = mutation({
  args: {
    clerkId: v.string(),
    eventName: growthEventNameValidator,
    source: v.union(v.literal('client'), v.literal('api'), v.literal('system')),
    page: v.optional(v.string()),
    conversationId: v.optional(v.string()),
    details: v.optional(v.any()),
    syncSecret: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    verifySyncSecret(args.syncSecret);

    await ctx.db.insert('growthEvents', {
      clerkId: args.clerkId,
      eventName: args.eventName,
      source: args.source,
      page: args.page,
      conversationId: args.conversationId,
      details: args.details,
      createdAt: Date.now(),
    });

    return null;
  },
});

export const getMyGrowthCounters = query({
  args: {
    days: v.optional(v.number()),
  },
  returns: v.object({
    counters: v.object({
      vision_board_viewed: v.number(),
      vision_board_generate_clicked: v.number(),
      vision_board_generation_success: v.number(),
      vision_board_generation_failed: v.number(),
      vision_board_pro_gate_hit: v.number(),
      upgrade_clicked: v.number(),
    }),
    viewToGenerateRate: v.number(),
    generateSuccessRate: v.number(),
    gateToUpgradeRate: v.number(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return summarizeGrowthEvents([]);
    }

    const windowDays = Math.min(Math.max(args.days ?? 30, 1), 365);
    const since = Date.now() - windowDays * 24 * 60 * 60 * 1000;

    const events = await ctx.db
      .query('growthEvents')
      .withIndex('by_clerkId_and_createdAt', (q) => q.eq('clerkId', identity.subject).gte('createdAt', since))
      .collect();

    return summarizeGrowthEvents(events as Array<{ eventName: GrowthEventName }>);
  },
});
