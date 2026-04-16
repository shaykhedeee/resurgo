// ═══════════════════════════════════════════════════════════════════════════
// Resurgo REST API v1 — Convex Backend Functions
//
// These are PUBLIC queries/mutations designed to be called by the Next.js
// API v1 routes AFTER the API key has been validated. The userId comes
// from the API key lookup (api.apiKeys.validateByHash).
//
// Security model: trust is established at the Next.js API layer via API key.
// The userId is an opaque Convex ID — callers must know it to access data.
// ═══════════════════════════════════════════════════════════════════════════

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { Id } from './_generated/dataModel';

// ─────────────────────────────────────────────────────────────────────────────
// TASKS
// ─────────────────────────────────────────────────────────────────────────────

export const listTasks = query({
  args: {
    userId: v.string(),
    status: v.optional(v.union(
      v.literal('todo'),
      v.literal('done'),
      v.literal('in_progress'),
    )),
  },
  handler: async (ctx, { userId, status }) => {
    const uid = userId as Id<'users'>;
    const q = ctx.db.query('tasks').withIndex('by_userId_status', (qb) =>
      status ? qb.eq('userId', uid).eq('status', status) : qb.eq('userId', uid)
    );
    const tasks = await q.order('desc').take(100);
    return tasks.map((t) => ({
      id: t._id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
      tags: t.tags ?? [],
      createdAt: t.createdAt,
    }));
  },
});

export const createTask = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    priority: v.optional(v.union(
      v.literal('urgent'), v.literal('high'), v.literal('medium'), v.literal('low')
    )),
    dueDate: v.optional(v.string()),
    energyRequired: v.optional(v.union(v.literal('high'), v.literal('medium'), v.literal('low'))),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { userId, title, priority, dueDate, energyRequired, tags }) => {
    const uid = userId as Id<'users'>;
    const now = Date.now();
    const id = await ctx.db.insert('tasks', {
      userId: uid,
      title,
      status: 'todo',
      priority: priority ?? 'medium',
      dueDate,
      energyRequired,
      tags,
      createdAt: now,
      updatedAt: now,
    });
    return { id };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// HABITS
// ─────────────────────────────────────────────────────────────────────────────

export const listHabits = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const uid = userId as Id<'users'>;
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId_active', (q) => q.eq('userId', uid).eq('isActive', true))
      .order('asc')
      .take(50);
    return habits.map((h) => ({
      id: h._id,
      title: h.title,
      category: h.category,
      frequency: h.frequency,
      streakCurrent: h.streakCurrent,
      streakLongest: h.streakLongest,
      totalCompletions: h.totalCompletions ?? 0,
    }));
  },
});

export const logHabitCompletion = mutation({
  args: {
    userId: v.string(),
    habitId: v.string(),
    date: v.string(), // YYYY-MM-DD
    completed: v.optional(v.boolean()),
    mood: v.optional(v.number()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { userId, habitId, date, completed = true, mood, note }) => {
    const uid = userId as Id<'users'>;
    const hid = habitId as Id<'habits'>;

    const habit = await ctx.db.get(hid);
    if (!habit || habit.userId !== uid) {
      throw new Error('Habit not found or access denied');
    }

    // Check for existing log
    const existing = await ctx.db
      .query('habitLogs')
      .withIndex('by_habitId_date', (q) => q.eq('habitId', hid).eq('date', date))
      .unique();

    if (existing) {
      if (!completed) {
        await ctx.db.delete(existing._id);
        const newStreak = Math.max(0, habit.streakCurrent - 1);
        await ctx.db.patch(hid, { streakCurrent: newStreak, updatedAt: Date.now() });
        return { action: 'uncompleted', streak: newStreak };
      }
      // Already logged — update mood/note
      await ctx.db.patch(existing._id as Id<'habitLogs'>, { mood, note });
      return { action: 'updated', streak: habit.streakCurrent };
    }

    if (!completed) {
      return { action: 'noop', streak: habit.streakCurrent };
    }

    // Insert new log
    await ctx.db.insert('habitLogs', {
      habitId: hid,
      userId: uid,
      date,
      status: 'completed',
      mood,
      note,
      loggedVia: 'manual',
      completedAt: Date.now(),
    });

    const newStreak = habit.streakCurrent + 1;
    const newLongest = Math.max(habit.streakLongest, newStreak);
    await ctx.db.patch(hid, {
      streakCurrent: newStreak,
      streakLongest: newLongest,
      totalCompletions: (habit.totalCompletions ?? 0) + 1,
      lastCompletedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { action: 'completed', streak: newStreak };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GOALS
// ─────────────────────────────────────────────────────────────────────────────

export const listGoals = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const uid = userId as Id<'users'>;
    const goals = await ctx.db
      .query('goals')
      .withIndex('by_userId_status', (q) => q.eq('userId', uid).eq('status', 'in_progress'))
      .order('desc')
      .take(50);
    return goals.map((g) => ({
      id: g._id,
      title: g.title,
      category: g.category,
      status: g.status,
      targetDate: g.targetDate,
      progress: g.progress ?? 0,
      lifeDomain: g.lifeDomain,
      createdAt: g.createdAt,
    }));
  },
});

export const createGoal = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    targetDate: v.optional(v.string()),
    lifeDomain: v.optional(v.union(
      v.literal('health'), v.literal('career'), v.literal('finance'),
      v.literal('learning'), v.literal('relationships'), v.literal('creativity'),
      v.literal('mindfulness'), v.literal('personal_growth')
    )),
    whyImportant: v.optional(v.string()),
  },
  handler: async (ctx, { userId, title, category, description, targetDate, lifeDomain, whyImportant }) => {
    const uid = userId as Id<'users'>;
    const now = Date.now();
    const id = await ctx.db.insert('goals', {
      userId: uid,
      title,
      category,
      description,
      targetDate,
      lifeDomain,
      whyImportant,
      status: 'in_progress',
      progress: 0,
      createdAt: now,
      updatedAt: now,
    });
    return { id };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────────────────────────────────────────

export const dashboardStats = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const uid = userId as Id<'users'>;

    const [activeTasks, completedToday, activeHabits, activeGoals] = await Promise.all([
      ctx.db.query('tasks').withIndex('by_userId_status', (q) => q.eq('userId', uid).eq('status', 'todo')).take(200),
      ctx.db.query('tasks').withIndex('by_userId_status', (q) => q.eq('userId', uid).eq('status', 'done')).take(200),
      ctx.db.query('habits').withIndex('by_userId_active', (q) => q.eq('userId', uid).eq('isActive', true)).take(50),
      ctx.db.query('goals').withIndex('by_userId_status', (q) => q.eq('userId', uid).eq('status', 'in_progress')).take(50),
    ]);

    const today = new Date().toISOString().split('T')[0];
    const todayCompleted = completedToday.filter((t) => t.updatedAt >= new Date(today).getTime());

    const bestStreak = activeHabits.reduce((max, h) => Math.max(max, h.streakCurrent), 0);
    const avgProgress = activeGoals.length > 0
      ? Math.round(activeGoals.reduce((sum, g) => sum + (g.progress ?? 0), 0) / activeGoals.length)
      : 0;

    return {
      tasks: {
        active: activeTasks.length,
        completedToday: todayCompleted.length,
      },
      habits: {
        active: activeHabits.length,
        bestCurrentStreak: bestStreak,
      },
      goals: {
        active: activeGoals.length,
        averageProgress: avgProgress,
      },
      generatedAt: new Date().toISOString(),
    };
  },
});
