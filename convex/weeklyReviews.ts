// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Weekly Reviews Engine (Convex)
// Auto-generated summaries & user reflections — Module 7
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

const weeklyReviewDoc = v.object({
  _id: v.id('weeklyReviews'),
  _creationTime: v.number(),
  userId: v.id('users'),
  weekStartDate: v.string(),
  weekEndDate: v.string(),
  tasksCompleted: v.number(),
  tasksTotal: v.number(),
  habitsCompletionRate: v.number(),
  focusTotalMinutes: v.number(),
  streakDays: v.number(),
  xpEarned: v.number(),
  goalsProgressed: v.optional(v.array(v.object({
    goalId: v.id('goals'),
    title: v.string(),
    progressChange: v.number(),
  }))),
  highlights: v.optional(v.array(v.string())),
  areasToImprove: v.optional(v.array(v.string())),
  aiSummary: v.optional(v.string()),
  nextWeekFocus: v.optional(v.string()),
  userReflection: v.optional(v.string()),
  nextWeekGoals: v.optional(v.array(v.string())),
  overallRating: v.optional(v.number()),
  reviewed: v.boolean(),
  createdAt: v.number(),
});

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE WEEKLY REVIEW (auto-populate from data)
// ─────────────────────────────────────────────────────────────────────────────
export const generate = mutation({
  args: {
    weekStartDate: v.string(),
    weekEndDate: v.string(),
  },
  returns: v.id('weeklyReviews'),
  handler: async (ctx, { weekStartDate, weekEndDate }) => {
    const user = await getAuthUser(ctx);

    // Check for existing review
    const existing = await ctx.db
      .query('weeklyReviews')
      .withIndex('by_userId_week', (q: any) =>
        q.eq('userId', user._id).eq('weekStartDate', weekStartDate)
      )
      .unique();

    if (existing) return existing._id;

    // Gather stats: tasks
    const allTasks = await ctx.db
      .query('tasks')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();

    const weekTasks = allTasks.filter(
      (t) => t.createdAt >= new Date(weekStartDate).getTime() &&
        t.createdAt <= new Date(weekEndDate).getTime() + 86400000
    );
    const completedTasks = weekTasks.filter((t) => t.status === 'done');

    // Gather stats: habits
    const habitLogs = await ctx.db
      .query('habitLogs')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();

    const weekHabitLogs = habitLogs.filter(
      (l) => l.date >= weekStartDate && l.date <= weekEndDate
    );
    const completedHabitLogs = weekHabitLogs.filter((l) => l.status === 'completed');
    const habitsCompletionRate = weekHabitLogs.length > 0
      ? Math.round((completedHabitLogs.length / weekHabitLogs.length) * 100)
      : 0;

    // Gather stats: focus sessions
    const focusSessions = await ctx.db
      .query('focusSessions')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();

    const weekSessions = focusSessions.filter(
      (s) => s.completedAt >= new Date(weekStartDate).getTime() &&
        s.completedAt <= new Date(weekEndDate).getTime() + 86400000
    );
    const focusTotalMinutes = weekSessions.reduce((sum, s) => sum + (s.actualDuration ?? s.duration), 0);

    // Gather stats: XP
    const xpEvents = await ctx.db
      .query('xpHistory')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();

    const weekXP = xpEvents
      .filter((e) => e.createdAt >= new Date(weekStartDate).getTime() &&
        e.createdAt <= new Date(weekEndDate).getTime() + 86400000)
      .reduce((sum, e) => sum + e.amount, 0);

    // Gather stats: goals progress
    const goals = await ctx.db
      .query('goals')
      .withIndex('by_userId_status', (q: any) =>
        q.eq('userId', user._id).eq('status', 'in_progress')
      )
      .collect();

    const goalsProgressed = goals.map((g) => ({
      goalId: g._id,
      title: g.title,
      progressChange: g.progress, // snapshot of current progress
    }));

    // Calculate streak days this week
    const datesInWeek = [];
    const start = new Date(weekStartDate);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      datesInWeek.push(d.toISOString().split('T')[0]);
    }

    const dailyPlans = await ctx.db
      .query('dailyPlans')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();

    const activeDays = datesInWeek.filter((date) =>
      dailyPlans.some((p) => p.date === date) ||
      weekHabitLogs.some((l) => l.date === date) ||
      weekTasks.some((t) => t.completedAt && new Date(t.completedAt).toISOString().split('T')[0] === date)
    );

    return await ctx.db.insert('weeklyReviews', {
      userId: user._id,
      weekStartDate,
      weekEndDate,
      tasksCompleted: completedTasks.length,
      tasksTotal: weekTasks.length,
      habitsCompletionRate,
      focusTotalMinutes,
      streakDays: activeDays.length,
      xpEarned: weekXP,
      goalsProgressed,
      reviewed: false,
      createdAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET WEEKLY REVIEW
// ─────────────────────────────────────────────────────────────────────────────
export const getByWeek = query({
  args: { weekStartDate: v.string() },
  returns: v.union(weeklyReviewDoc, v.null()),
  handler: async (ctx, { weekStartDate }) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('weeklyReviews')
      .withIndex('by_userId_week', (q: any) =>
        q.eq('userId', user._id).eq('weekStartDate', weekStartDate)
      )
      .unique();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// SUBMIT USER REFLECTION
// ─────────────────────────────────────────────────────────────────────────────
export const submitReflection = mutation({
  args: {
    reviewId: v.id('weeklyReviews'),
    userReflection: v.optional(v.string()),
    nextWeekGoals: v.optional(v.array(v.string())),
    overallRating: v.optional(v.number()),
    highlights: v.optional(v.array(v.string())),
    areasToImprove: v.optional(v.array(v.string())),
  },
  returns: v.null(),
  handler: async (ctx, { reviewId, ...fields }) => {
    const user = await getAuthUser(ctx);
    const review = await ctx.db.get(reviewId);
    if (!review || review.userId !== user._id) throw new Error('Review not found');

    await ctx.db.patch(reviewId, {
      ...fields,
      reviewed: true,
    });

    // Award XP for completing weekly review
    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();

    if (gamification) {
      const xpGain = 30;
      await ctx.db.patch(gamification._id, {
        totalXP: gamification.totalXP + xpGain,
        updatedAt: Date.now(),
      });

      await ctx.db.insert('xpHistory', {
        userId: user._id,
        amount: xpGain,
        source: 'weekly_review',
        description: 'Completed weekly review',
        createdAt: Date.now(),
      });
    }

    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// STORE AI SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
export const storeAISummary = mutation({
  args: {
    reviewId: v.id('weeklyReviews'),
    aiSummary: v.string(),
    highlights: v.optional(v.array(v.string())),
    areasToImprove: v.optional(v.array(v.string())),
    nextWeekFocus: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, { reviewId, ...fields }) => {
    const user = await getAuthUser(ctx);
    const review = await ctx.db.get(reviewId);
    if (!review || review.userId !== user._id) throw new Error('Review not found');

    await ctx.db.patch(reviewId, fields);
    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST ALL REVIEWS
// ─────────────────────────────────────────────────────────────────────────────
export const listAll = query({
  args: {},
  returns: v.array(weeklyReviewDoc),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('weeklyReviews')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();
  },
});
