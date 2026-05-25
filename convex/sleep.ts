// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Sleep Tracker (Convex)
// Sleep quality, duration, and pattern analytics
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

export const logSleep = mutation({
  args: {
    date: v.string(),               // YYYY-MM-DD (night starting date)
    bedtime: v.optional(v.string()),
    wakeTime: v.optional(v.string()),
    durationMinutes: v.optional(v.number()),
    quality: v.optional(v.number()),  // 1-5
    notes: v.optional(v.string()),
  },
  returns: v.id('sleepLogs'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const now = Date.now();

    const existing = await ctx.db
      .query('sleepLogs')
      .withIndex('by_userId_date', (q: any) =>
        q.eq('userId', user._id).eq('date', args.date)
      )
      .unique();

    // Auto-compute duration from bedtime + wakeTime if not provided
    let duration = args.durationMinutes;
    if (!duration && args.bedtime && args.wakeTime) {
      const [bh, bm] = args.bedtime.split(':').map(Number);
      const [wh, wm] = args.wakeTime.split(':').map(Number);
      let bedMinutes = bh * 60 + bm;
      const wakeMinutes = wh * 60 + wm;
      if (wakeMinutes < bedMinutes) { bedMinutes -= 24 * 60; } // crossed midnight
      duration = wakeMinutes - bedMinutes;
    }

    if (existing) {
      await ctx.db.patch(existing._id, {
        bedtime: args.bedtime ?? existing.bedtime,
        wakeTime: args.wakeTime ?? existing.wakeTime,
        durationMinutes: duration ?? existing.durationMinutes,
        quality: args.quality ?? existing.quality,
        notes: args.notes ?? existing.notes,
      });
      return existing._id;
    }

    return await ctx.db.insert('sleepLogs', {
      userId: user._id,
      date: args.date,
      bedtime: args.bedtime,
      wakeTime: args.wakeTime,
      durationMinutes: duration,
      quality: args.quality,
      notes: args.notes,
      createdAt: now,
    });
  },
});

export const getSleepLog = query({
  args: { date: v.string() },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, { date }) => {
    const user = await getAuthUser(ctx);
    return await ctx.db
      .query('sleepLogs')
      .withIndex('by_userId_date', (q: any) =>
        q.eq('userId', user._id).eq('date', date)
      )
      .unique() ?? null;
  },
});

export const listSleepLogs = query({
  args: { days: v.optional(v.number()) },
  returns: v.array(v.any()),
  handler: async (ctx, { days }) => {
    const user = await getAuthUser(ctx);
    const logs = await ctx.db
      .query('sleepLogs')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();
    return days ? logs.slice(0, days) : logs;
  },
});

export const deleteSleepLog = mutation({
  args: { logId: v.id('sleepLogs') },
  returns: v.null(),
  handler: async (ctx, { logId }) => {
    const user = await getAuthUser(ctx);
    const log = await ctx.db.get(logId);
    if (!log || log.userId !== user._id) throw new Error('Not found');
    await ctx.db.delete(logId);
    return null;
  },
});

export const getSleepStats = query({
  args: { days: v.optional(v.number()) },
  returns: v.object({
    avgDurationMinutes: v.number(),
    avgQuality: v.number(),
    totalLogs: v.number(),
    bestQualityDate: v.optional(v.string()),
    longestSleepDate: v.optional(v.string()),
  }),
  handler: async (ctx, { days }) => {
    const user = await getAuthUser(ctx);
    let logs: any[] = await ctx.db
      .query('sleepLogs')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    if (days) logs = logs.slice(0, days);
    if (logs.length === 0) {
      return { avgDurationMinutes: 0, avgQuality: 0, totalLogs: 0 };
    }

    const withDuration = logs.filter((l: any) => l.durationMinutes);
    const withQuality = logs.filter((l: any) => l.quality);

    const avgDurationMinutes = withDuration.length
      ? Math.round(withDuration.reduce((s: number, l: any) => s + l.durationMinutes, 0) / withDuration.length)
      : 0;
    const avgQuality = withQuality.length
      ? Math.round((withQuality.reduce((s: number, l: any) => s + l.quality, 0) / withQuality.length) * 10) / 10
      : 0;

    const best = [...withQuality].sort((a: any, b: any) => b.quality - a.quality)[0];
    const longest = [...withDuration].sort((a: any, b: any) => b.durationMinutes - a.durationMinutes)[0];

    return {
      avgDurationMinutes,
      avgQuality,
      totalLogs: logs.length,
      bestQualityDate: best?.date,
      longestSleepDate: longest?.date,
    };
  },
});

export const logSleepServer = mutation({
  args: {
    userId: v.id('users'),
    date: v.string(),
    bedtime: v.optional(v.string()),
    wakeTime: v.optional(v.string()),
    durationMinutes: v.optional(v.number()),
    quality: v.optional(v.number()),
    notes: v.optional(v.string()),
    secret: v.string(),
  },
  returns: v.id('sleepLogs'),
  handler: async (ctx, args) => {
    if (args.secret !== "resurgo_fitness_sync_secret_2026") {
      throw new Error('Unauthorized server mutation');
    }
    const now = Date.now();

    const existing = await ctx.db
      .query('sleepLogs')
      .withIndex('by_userId_date', (q: any) =>
        q.eq('userId', args.userId).eq('date', args.date)
      )
      .unique();

    let duration = args.durationMinutes;
    if (!duration && args.bedtime && args.wakeTime) {
      const [bh, bm] = args.bedtime.split(':').map(Number);
      const [wh, wm] = args.wakeTime.split(':').map(Number);
      let bedMinutes = bh * 60 + bm;
      const wakeMinutes = wh * 60 + wm;
      if (wakeMinutes < bedMinutes) { bedMinutes -= 24 * 60; }
      duration = wakeMinutes - bedMinutes;
    }

    if (existing) {
      await ctx.db.patch(existing._id, {
        bedtime: args.bedtime ?? existing.bedtime,
        wakeTime: args.wakeTime ?? existing.wakeTime,
        durationMinutes: duration ?? existing.durationMinutes,
        quality: args.quality ?? existing.quality,
        notes: args.notes ?? existing.notes,
      });
      return existing._id;
    }

    return await ctx.db.insert('sleepLogs', {
      userId: args.userId,
      date: args.date,
      bedtime: args.bedtime,
      wakeTime: args.wakeTime,
      durationMinutes: duration,
      quality: args.quality,
      notes: args.notes,
      createdAt: now,
    });
  },
});
