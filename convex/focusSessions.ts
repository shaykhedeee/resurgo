// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Focus Sessions Engine (Convex)
// Multi-method focus tracking: Pomodoro, Deep Work, Flowtime, Time Box
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

const focusTypeValidator = v.union(
  v.literal('pomodoro'),
  v.literal('deep_work'),
  v.literal('flowtime'),
  v.literal('time_box'),
  v.literal('custom')
);

const completionStatusValidator = v.union(
  v.literal('completed'),
  v.literal('abandoned'),
  v.literal('interrupted')
);

// Shared session document validator
const sessionDocValidator = v.object({
  _id: v.id('focusSessions'),
  _creationTime: v.number(),
  userId: v.id('users'),
  taskId: v.optional(v.id('tasks')),
  habitId: v.optional(v.id('habits')),
  duration: v.number(),
  actualDuration: v.optional(v.number()),
  completedAt: v.number(),
  type: focusTypeValidator,
  completionStatus: v.optional(completionStatusValidator),
  focusScore: v.optional(v.number()),
  productivityRating: v.optional(v.number()),
  distractionCount: v.optional(v.number()),
  distractions: v.optional(v.array(v.object({
    timestamp: v.number(),
    description: v.optional(v.string()),
    duration: v.optional(v.number()),
  }))),
  breaksTaken: v.optional(v.number()),
  notes: v.optional(v.string()),
  ambientSound: v.optional(v.string()),
});

// ─────────────────────────────────────────────────────────────────────────────
// START SESSION (enhanced with all focus methods)
// ─────────────────────────────────────────────────────────────────────────────
export const start = mutation({
  args: {
    type: focusTypeValidator,
    durationMinutes: v.number(),
    habitId: v.optional(v.id('habits')),
    taskId: v.optional(v.id('tasks')),
    ambientSound: v.optional(v.string()),
  },
  returns: v.id('focusSessions'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await ctx.db.insert('focusSessions', {
      userId: user._id,
      type: args.type,
      duration: args.durationMinutes,
      habitId: args.habitId,
      taskId: args.taskId,
      ambientSound: args.ambientSound,
      completedAt: 0, // Placeholder — overwritten by complete() or cancel()
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE SESSION (enhanced with focus quality metrics)
// ─────────────────────────────────────────────────────────────────────────────
export const complete = mutation({
  args: {
    sessionId: v.id('focusSessions'),
    actualMinutes: v.optional(v.number()),
    focusScore: v.optional(v.number()),
    productivityRating: v.optional(v.number()),
    distractionCount: v.optional(v.number()),
    distractions: v.optional(v.array(v.object({
      timestamp: v.number(),
      description: v.optional(v.string()),
      duration: v.optional(v.number()),
    }))),
    breaksTaken: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  returns: v.object({
    xpGain: v.number(),
  }),
  handler: async (ctx, { sessionId, actualMinutes, ...metrics }) => {
    const user = await getAuthUser(ctx);
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== user._id) throw new Error('Session not found');

    const actualDuration = actualMinutes ?? session.duration;

    // Calculate focus score if not provided
    const focusScore = metrics.focusScore ??
      Math.max(0, 100 - (metrics.distractionCount ?? 0) * 10);

    await ctx.db.patch(sessionId, {
      actualDuration,
      completedAt: Date.now(),
      completionStatus: 'completed',
      focusScore,
      productivityRating: metrics.productivityRating,
      distractionCount: metrics.distractionCount,
      distractions: metrics.distractions,
      breaksTaken: metrics.breaksTaken,
      notes: metrics.notes,
    });

    // Calculate XP: base + focus quality bonus
    const baseXP = Math.round(actualDuration * 0.5) + 5;
    const qualityBonus = focusScore >= 90 ? 10 : focusScore >= 70 ? 5 : 0;
    const xpGain = baseXP + qualityBonus;

    // Award XP
    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();

    if (gamification) {
      const newXP = gamification.totalXP + xpGain;
      await ctx.db.patch(gamification._id, {
        totalXP: newXP,
        currentLevelXP: (gamification.currentLevelXP ?? 0) + xpGain,
        level: Math.floor(newXP / 100) + 1,
        updatedAt: Date.now(),
      });

      // Log XP history
      await ctx.db.insert('xpHistory', {
        userId: user._id,
        amount: xpGain,
        source: 'focus_session',
        description: `${session.type} session: ${actualDuration} min (score: ${focusScore})`,
        createdAt: Date.now(),
      });
    }

    return { xpGain };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// CANCEL SESSION
// ─────────────────────────────────────────────────────────────────────────────
export const cancel = mutation({
  args: {
    sessionId: v.id('focusSessions'),
    actualMinutes: v.optional(v.number()),
    reason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, { sessionId, actualMinutes, reason }) => {
    const user = await getAuthUser(ctx);
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== user._id) throw new Error('Session not found');

    await ctx.db.patch(sessionId, {
      actualDuration: actualMinutes ?? 0,
      completedAt: Date.now(),
      completionStatus: 'abandoned',
      notes: reason,
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LOG DISTRACTION (during active session)
// ─────────────────────────────────────────────────────────────────────────────
export const logDistraction = mutation({
  args: {
    sessionId: v.id('focusSessions'),
    description: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, { sessionId, description, duration }) => {
    const user = await getAuthUser(ctx);
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== user._id) throw new Error('Session not found');

    const existing = session.distractions ?? [];
    const newDistraction = { timestamp: Date.now(), description, duration };

    await ctx.db.patch(sessionId, {
      distractions: [...existing, newDistraction],
      distractionCount: (session.distractionCount ?? 0) + 1,
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET TODAY'S SESSIONS
// ─────────────────────────────────────────────────────────────────────────────
export const today = query({
  args: {},
  returns: v.array(sessionDocValidator),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const sessions = await ctx.db
      .query('focusSessions')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    return sessions.filter((s) => s.completedAt >= startOfDay.getTime());
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET FOCUS STATS (enhanced with quality metrics)
// ─────────────────────────────────────────────────────────────────────────────
export const getStats = query({
  args: { days: v.optional(v.number()) },
  returns: v.object({
    totalMinutes: v.number(),
    totalSessions: v.number(),
    avgMinutes: v.number(),
    totalHours: v.number(),
    avgFocusScore: v.number(),
    totalDistractions: v.number(),
    bestStreak: v.number(),
    byType: v.object({
      pomodoro: v.number(),
      deep_work: v.number(),
      flowtime: v.number(),
      time_box: v.number(),
      custom: v.number(),
    }),
  }),
  handler: async (ctx, { days }) => {
    const user = await getAuthUser(ctx);

    const sessions = await ctx.db
      .query('focusSessions')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();

    const cutoff = days ? Date.now() - days * 24 * 60 * 60 * 1000 : 0;
    const filtered = sessions.filter((s) => s.completedAt >= cutoff);

    const totalMinutes = filtered.reduce((sum, s) =>
      sum + (s.actualDuration ?? s.duration), 0);
    const totalSessions = filtered.length;
    const avgMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

    // Focus quality stats
    const scored = filtered.filter((s: any) => s.focusScore != null);
    const avgFocusScore = scored.length > 0
      ? Math.round(scored.reduce((sum: number, s: any) => sum + s.focusScore, 0) / scored.length)
      : 0;
    const totalDistractions = filtered.reduce((sum, s: any) =>
      sum + (s.distractionCount ?? 0), 0);

    // Sessions by type
    const byType = { pomodoro: 0, deep_work: 0, flowtime: 0, time_box: 0, custom: 0 };
    for (const s of filtered) {
      if (s.type in byType) {
        byType[s.type as keyof typeof byType]++;
      }
    }

    // Best consecutive days streak
    const uniqueDays = new Set(filtered.map((s) =>
      new Date(s.completedAt).toISOString().split('T')[0]
    ));
    const sortedDays: string[] = [];
    uniqueDays.forEach((d) => sortedDays.push(d));
    sortedDays.sort();
    let bestStreak = 0;
    let currentStreak = 0;
    for (let i = 0; i < sortedDays.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        const prev = new Date(sortedDays[i - 1]);
        const curr = new Date(sortedDays[i]);
        const diff = (curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000);
        currentStreak = diff === 1 ? currentStreak + 1 : 1;
      }
      bestStreak = Math.max(bestStreak, currentStreak);
    }

    return {
      totalMinutes,
      totalSessions,
      avgMinutes,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      avgFocusScore,
      totalDistractions,
      bestStreak,
      byType,
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET SESSION BY ID
// ─────────────────────────────────────────────────────────────────────────────
export const getById = query({
  args: { sessionId: v.id('focusSessions') },
  returns: v.union(sessionDocValidator, v.null()),
  handler: async (ctx, { sessionId }) => {
    const user = await getAuthUser(ctx);
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== user._id) return null;
    return session;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// BODY DOUBLING — Count of users actively focusing right now
// Active = completedAt === 0 (in-progress placeholder) + started within 4 hrs
// ─────────────────────────────────────────────────────────────────────────────
export const getActiveFocusCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const cutoff = Date.now() - 4 * 60 * 60 * 1000; // 4 hours ago

    const activeSessions = await ctx.db
      .query('focusSessions')
      .filter((q: any) =>
        q.and(
          q.eq(q.field('completedAt'), 0),
          q.gte(q.field('_creationTime'), cutoff)
        )
      )
      .collect();

    return activeSessions.length;
  },
});
