// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Convex: Meta Marketing Functions
// Campaign sync, conversion event logging, and marketing analytics queries
// ═══════════════════════════════════════════════════════════════════════════════

import { internalMutation, query } from './_generated/server';
import { v } from 'convex/values';

// ─────────────────────────────────────────────────────────────────────────────
// CAMPAIGN SYNC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Upsert a Meta campaign record (called by sync API route)
 */
export const upsertCampaign = internalMutation({
  args: {
    metaCampaignId: v.string(),
    name: v.string(),
    status: v.string(),
    objective: v.string(),
    dailyBudget: v.optional(v.string()),
    lifetimeBudget: v.optional(v.string()),
    startTime: v.optional(v.string()),
    stopTime: v.optional(v.string()),
    impressions: v.optional(v.number()),
    clicks: v.optional(v.number()),
    spend: v.optional(v.number()),
    cpc: v.optional(v.number()),
    ctr: v.optional(v.number()),
    conversions: v.optional(v.number()),
    costPerConversion: v.optional(v.number()),
    reach: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('metaCampaigns')
      .withIndex('by_metaCampaignId', (q) => q.eq('metaCampaignId', args.metaCampaignId))
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        status: args.status,
        objective: args.objective,
        dailyBudget: args.dailyBudget,
        lifetimeBudget: args.lifetimeBudget,
        startTime: args.startTime,
        stopTime: args.stopTime,
        impressions: args.impressions,
        clicks: args.clicks,
        spend: args.spend,
        cpc: args.cpc,
        ctr: args.ctr,
        conversions: args.conversions,
        costPerConversion: args.costPerConversion,
        reach: args.reach,
        lastSyncedAt: now,
      });
    } else {
      await ctx.db.insert('metaCampaigns', {
        ...args,
        lastSyncedAt: now,
        createdAt: now,
      });
    }
    return null;
  },
});

/**
 * List all synced Meta campaigns
 */
export const listCampaigns = query({
  args: {
    status: v.optional(v.string()),
  },
  returns: v.array(v.object({
    _id: v.id('metaCampaigns'),
    _creationTime: v.number(),
    metaCampaignId: v.string(),
    name: v.string(),
    status: v.string(),
    objective: v.string(),
    dailyBudget: v.optional(v.string()),
    lifetimeBudget: v.optional(v.string()),
    startTime: v.optional(v.string()),
    stopTime: v.optional(v.string()),
    impressions: v.optional(v.number()),
    clicks: v.optional(v.number()),
    spend: v.optional(v.number()),
    cpc: v.optional(v.number()),
    ctr: v.optional(v.number()),
    conversions: v.optional(v.number()),
    costPerConversion: v.optional(v.number()),
    reach: v.optional(v.number()),
    lastSyncedAt: v.number(),
    createdAt: v.number(),
  })),
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query('metaCampaigns')
        .withIndex('by_status', (q) => q.eq('status', args.status!))
        .collect();
    }
    return await ctx.db.query('metaCampaigns').collect();
  },
});

/**
 * Get campaign summary stats (total spend, impressions, etc.)
 */
export const getCampaignSummary = query({
  args: {},
  returns: v.object({
    totalCampaigns: v.number(),
    activeCampaigns: v.number(),
    totalSpend: v.number(),
    totalImpressions: v.number(),
    totalClicks: v.number(),
    totalConversions: v.number(),
    totalReach: v.number(),
    avgCpc: v.number(),
    avgCtr: v.number(),
  }),
  handler: async (ctx) => {
    const campaigns = await ctx.db.query('metaCampaigns').collect();

    let totalSpend = 0;
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalConversions = 0;
    let totalReach = 0;
    let activeCampaigns = 0;

    for (const c of campaigns) {
      if (c.status === 'ACTIVE') activeCampaigns++;
      totalSpend += c.spend || 0;
      totalImpressions += c.impressions || 0;
      totalClicks += c.clicks || 0;
      totalConversions += c.conversions || 0;
      totalReach += c.reach || 0;
    }

    return {
      totalCampaigns: campaigns.length,
      activeCampaigns,
      totalSpend: Math.round(totalSpend * 100) / 100,
      totalImpressions,
      totalClicks,
      totalConversions,
      totalReach,
      avgCpc: totalClicks > 0 ? Math.round((totalSpend / totalClicks) * 100) / 100 : 0,
      avgCtr: totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0,
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSION EVENT LOGGING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Log a conversion event sent to Meta CAPI
 */
export const logConversionEvent = internalMutation({
  args: {
    eventName: v.string(),
    eventId: v.string(),
    userId: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    customData: v.optional(v.any()),
    sentToMeta: v.boolean(),
    metaResponse: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert('metaConversionEvents', {
      ...args,
      createdAt: Date.now(),
    });
    return null;
  },
});

/**
 * List recent conversion events
 */
export const listConversionEvents = query({
  args: {
    limit: v.optional(v.number()),
    eventName: v.optional(v.string()),
  },
  returns: v.array(v.object({
    _id: v.id('metaConversionEvents'),
    _creationTime: v.number(),
    eventName: v.string(),
    eventId: v.string(),
    userId: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    customData: v.optional(v.any()),
    sentToMeta: v.boolean(),
    metaResponse: v.optional(v.string()),
    createdAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    if (args.eventName) {
      return await ctx.db
        .query('metaConversionEvents')
        .withIndex('by_eventName', (q) => q.eq('eventName', args.eventName!))
        .order('desc')
        .take(limit);
    }

    return await ctx.db
      .query('metaConversionEvents')
      .order('desc')
      .take(limit);
  },
});

/**
 * Get conversion event counts by type (for dashboard)
 */
export const getConversionSummary = query({
  args: {
    sinceDaysAgo: v.optional(v.number()),
  },
  returns: v.array(v.object({
    eventName: v.string(),
    count: v.number(),
  })),
  handler: async (ctx, args) => {
    const since = Date.now() - ((args.sinceDaysAgo || 30) * 24 * 60 * 60 * 1000);

    const events = await ctx.db
      .query('metaConversionEvents')
      .withIndex('by_createdAt', (q) => q.gte('createdAt', since))
      .collect();

    const counts: Record<string, number> = {};
    for (const e of events) {
      counts[e.eventName] = (counts[e.eventName] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([eventName, count]) => ({ eventName, count }))
      .sort((a, b) => b.count - a.count);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// MARKETING METRICS — from marketing events table
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get marketing event counts for the dashboard (aggregated by event type)
 */
export const getMarketingMetrics = query({
  args: {
    sinceDaysAgo: v.optional(v.number()),
  },
  returns: v.object({
    totalEvents: v.number(),
    signupAssists: v.number(),
    pricingClicks: v.number(),
    ctaClicks: v.number(),
    pageViews: v.number(),
    leads: v.number(),
    recentEvents: v.array(v.object({
      _id: v.id('marketingEvents'),
      _creationTime: v.number(),
      event: v.string(),
      path: v.union(v.string(), v.null()),
      properties: v.optional(v.any()),
      createdAt: v.number(),
      sessionId: v.optional(v.string()),
    })),
  }),
  handler: async (ctx, args) => {
    const since = Date.now() - ((args.sinceDaysAgo || 30) * 24 * 60 * 60 * 1000);

    const events = await ctx.db
      .query('marketingEvents')
      .withIndex('by_createdAt', (q) => q.gte('createdAt', since))
      .collect();

    let signupAssists = 0;
    let pricingClicks = 0;
    let ctaClicks = 0;
    let pageViews = 0;
    let leads = 0;

    for (const e of events) {
      switch (e.event) {
        case 'signup_assist':
        case 'content_signup_assist':
          signupAssists++;
          break;
        case 'pricing_click':
        case 'content_pricing_click':
          pricingClicks++;
          break;
        case 'cta_click':
        case 'content_cta_click':
          ctaClicks++;
          break;
        case 'page_view':
          pageViews++;
          break;
        case 'lead':
        case 'email_capture':
          leads++;
          break;
      }
    }

    const recentEvents = events.slice(-20).reverse();

    return {
      totalEvents: events.length,
      signupAssists,
      pricingClicks,
      ctaClicks,
      pageViews,
      leads,
      recentEvents,
    };
  },
});
