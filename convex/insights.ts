// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — AI Insights Engine (Convex)
// 8 insight types with confidence scoring, feedback & interaction tracking
// ═══════════════════════════════════════════════════════════════════════════════

import { internalMutation, mutation, query } from './_generated/server';
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

const insightTypeValidator = v.union(
  v.literal('coaching'),
  v.literal('pattern'),
  v.literal('suggestion'),
  v.literal('weekly_summary'),
  v.literal('correlation'),
  v.literal('prediction'),
  v.literal('celebration'),
  v.literal('prescription')
);

// Shared insight document validator
const insightDocValidator = v.object({
  _id: v.id('insights'),
  _creationTime: v.number(),
  userId: v.id('users'),
  type: insightTypeValidator,
  content: v.string(),
  title: v.optional(v.string()),
  confidenceScore: v.optional(v.number()),
  metadata: v.optional(v.any()),
  viewed: v.optional(v.boolean()),
  viewedAt: v.optional(v.number()),
  dismissed: v.optional(v.boolean()),
  actionTaken: v.optional(v.boolean()),
  feedback: v.optional(v.number()),
  expiresAt: v.number(),
  createdAt: v.number(),
});

// ─────────────────────────────────────────────────────────────────────────────
// STORE INSIGHT (enhanced with title, confidence, etc.)
// ─────────────────────────────────────────────────────────────────────────────
export const store = mutation({
  args: {
    type: insightTypeValidator,
    content: v.string(),
    title: v.optional(v.string()),
    confidenceScore: v.optional(v.number()),
    metadata: v.optional(v.any()),
    expiresAt: v.optional(v.number()),
  },
  returns: v.id('insights'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await ctx.db.insert('insights', {
      userId: user._id,
      type: args.type,
      content: args.content,
      title: args.title,
      confidenceScore: args.confidenceScore,
      metadata: args.metadata,
      viewed: false,
      dismissed: false,
      actionTaken: false,
      expiresAt: args.expiresAt ?? Date.now() + 7 * 24 * 60 * 60 * 1000,
      createdAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET LATEST INSIGHT BY TYPE
// ─────────────────────────────────────────────────────────────────────────────
export const getLatest = query({
  args: { type: insightTypeValidator },
  returns: v.union(insightDocValidator, v.null()),
  handler: async (ctx, { type }) => {
    const user = await getAuthUser(ctx);

    const insights = await ctx.db
      .query('insights')
      .withIndex('by_userId_type', (q: any) =>
        q.eq('userId', user._id).eq('type', type)
      )
      .order('desc')
      .take(1);

    const insight = insights[0];
    if (!insight) return null;

    // Check expiry
    if (insight.expiresAt && insight.expiresAt < Date.now()) return null;

    return insight;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST RECENT INSIGHTS (with optional type filter)
// ─────────────────────────────────────────────────────────────────────────────
export const listRecent = query({
  args: {
    limit: v.optional(v.number()),
    type: v.optional(insightTypeValidator),
    includeExpired: v.optional(v.boolean()),
  },
  returns: v.array(insightDocValidator),
  handler: async (ctx, { limit, type, includeExpired }) => {
    const user = await getAuthUser(ctx);

    let insights;
    if (type) {
      insights = await ctx.db
        .query('insights')
        .withIndex('by_userId_type', (q: any) =>
          q.eq('userId', user._id).eq('type', type)
        )
        .order('desc')
        .collect();
    } else {
      insights = await ctx.db
        .query('insights')
        .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
        .order('desc')
        .collect();
    }

    // Filter expired unless requested
    const valid = includeExpired
      ? insights
      : insights.filter((i) => !i.expiresAt || i.expiresAt >= Date.now());

    return limit ? valid.slice(0, limit) : valid;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// MARK INSIGHT AS VIEWED
// ─────────────────────────────────────────────────────────────────────────────
export const markViewed = mutation({
  args: { insightId: v.id('insights') },
  returns: v.null(),
  handler: async (ctx, { insightId }) => {
    const user = await getAuthUser(ctx);
    const insight = await ctx.db.get(insightId);
    if (!insight || insight.userId !== user._id) throw new Error('Insight not found');

    await ctx.db.patch(insightId, {
      viewed: true,
      viewedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// DISMISS INSIGHT
// ─────────────────────────────────────────────────────────────────────────────
export const dismiss = mutation({
  args: { insightId: v.id('insights') },
  returns: v.null(),
  handler: async (ctx, { insightId }) => {
    const user = await getAuthUser(ctx);
    const insight = await ctx.db.get(insightId);
    if (!insight || insight.userId !== user._id) throw new Error('Insight not found');

    await ctx.db.patch(insightId, {
      dismissed: true,
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDE FEEDBACK ON INSIGHT (1-5 rating)
// ─────────────────────────────────────────────────────────────────────────────
export const provideFeedback = mutation({
  args: {
    insightId: v.id('insights'),
    feedback: v.number(),
    actionTaken: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, { insightId, feedback, actionTaken }) => {
    const user = await getAuthUser(ctx);
    const insight = await ctx.db.get(insightId);
    if (!insight || insight.userId !== user._id) throw new Error('Insight not found');

    await ctx.db.patch(insightId, {
      feedback: Math.min(5, Math.max(1, feedback)),
      actionTaken: actionTaken ?? insight.actionTaken,
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET UNREAD INSIGHTS COUNT
// ─────────────────────────────────────────────────────────────────────────────
export const getUnreadCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    const insights = await ctx.db
      .query('insights')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();

    return insights.filter(
      (i: any) => !i.viewed && !i.dismissed && (!i.expiresAt || i.expiresAt >= Date.now())
    ).length;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE EXPIRED INSIGHTS (cleanup)
// ─────────────────────────────────────────────────────────────────────────────
export const cleanupExpired = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    const insights = await ctx.db
      .query('insights')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();

    const expired = insights.filter(
      (i) => i.expiresAt && i.expiresAt < Date.now()
    );

    for (const insight of expired) {
      await ctx.db.delete(insight._id);
    }

    return expired.length;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// generateWeeklySummariesForActiveUsers — Internal cron entrypoint
// Creates one weekly_summary insight per active user (if missing for week)
// ─────────────────────────────────────────────────────────────────────────────
export const generateWeeklySummariesForActiveUsers = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const now = Date.now();
    const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;

    // Determine previous full week (Monday → Sunday)
    const currentDate = new Date();
    const currentDay = (currentDate.getUTCDay() + 6) % 7; // Monday=0 ... Sunday=6
    const thisWeekMonday = new Date(Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate() - currentDay,
      0,
      0,
      0,
      0
    ));
    const prevWeekStart = new Date(thisWeekMonday.getTime() - 7 * 24 * 60 * 60 * 1000);
    const prevWeekEnd = new Date(thisWeekMonday.getTime() - 1);

    const weekStartDate = prevWeekStart.toISOString().slice(0, 10);
    const weekEndDate = prevWeekEnd.toISOString().slice(0, 10);
    const weekStartMs = prevWeekStart.getTime();
    const weekEndMs = prevWeekEnd.getTime();

    const users = await ctx.db.query('users').collect();
    let generated = 0;

    for (const user of users) {
      if (user.lastActiveAt && user.lastActiveAt < fourteenDaysAgo) continue;

      const existing = await ctx.db
        .query('insights')
        .withIndex('by_userId_type', (q) => q.eq('userId', user._id).eq('type', 'weekly_summary'))
        .collect();

      const alreadyGenerated = existing.some((insight) => {
        const metadata = insight.metadata as { weekStartDate?: string } | undefined;
        return metadata?.weekStartDate === weekStartDate;
      });
      if (alreadyGenerated) continue;

      const tasks = await ctx.db
        .query('tasks')
        .withIndex('by_userId', (q) => q.eq('userId', user._id))
        .collect();
      const completedTasks = tasks.filter(
        (task) => task.status === 'done' && !!task.completedAt && task.completedAt >= weekStartMs && task.completedAt <= weekEndMs
      ).length;

      const habitLogs = await ctx.db
        .query('habitLogs')
        .withIndex('by_userId', (q) => q.eq('userId', user._id))
        .collect();
      const weekHabitLogs = habitLogs.filter((log) => log.date >= weekStartDate && log.date <= weekEndDate);
      const completedHabitLogs = weekHabitLogs.filter((log) => log.status === 'completed').length;
      const habitCompletionRate = weekHabitLogs.length > 0
        ? Math.round((completedHabitLogs / weekHabitLogs.length) * 100)
        : 0;

      const focusSessions = await ctx.db
        .query('focusSessions')
        .withIndex('by_userId', (q) => q.eq('userId', user._id))
        .collect();
      const focusMinutes = focusSessions
        .filter((session) => session.completedAt >= weekStartMs && session.completedAt <= weekEndMs)
        .reduce((sum, session) => sum + (session.actualDuration ?? session.duration), 0);

      const xpHistory = await ctx.db
        .query('xpHistory')
        .withIndex('by_userId', (q) => q.eq('userId', user._id))
        .collect();
      const xpEarned = xpHistory
        .filter((event) => event.createdAt >= weekStartMs && event.createdAt <= weekEndMs)
        .reduce((sum, event) => sum + event.amount, 0);

      const summary = `Week recap (${weekStartDate} → ${weekEndDate}): ${completedTasks} tasks completed, ${habitCompletionRate}% habit completion, ${focusMinutes} focus minutes, ${xpEarned} XP earned.`;

      await ctx.db.insert('insights', {
        userId: user._id,
        type: 'weekly_summary',
        title: 'Your Weekly AI Summary',
        content: summary,
        confidenceScore: 0.92,
        metadata: {
          weekStartDate,
          weekEndDate,
          completedTasks,
          habitCompletionRate,
          focusMinutes,
          xpEarned,
        },
        viewed: false,
        dismissed: false,
        actionTaken: false,
        expiresAt: now + 14 * 24 * 60 * 60 * 1000,
        createdAt: now,
      });

      generated += 1;
    }

    return generated;
  },
});
