import { mutation, internalMutation, query } from './_generated/server';
import { v } from 'convex/values';
import { checkAndCreateHabit } from './lib/transactions';

// ── Level Thresholds (shared with gamification.ts) ──
const LEVEL_THRESHOLDS = [
  { level: 1, xpRequired: 0 }, { level: 2, xpRequired: 100 },
  { level: 3, xpRequired: 250 }, { level: 4, xpRequired: 500 },
  { level: 5, xpRequired: 800 }, { level: 6, xpRequired: 1200 },
  { level: 7, xpRequired: 1800 }, { level: 8, xpRequired: 2500 },
  { level: 9, xpRequired: 3500 }, { level: 10, xpRequired: 5000 },
  { level: 11, xpRequired: 7000 }, { level: 12, xpRequired: 10000 },
  { level: 13, xpRequired: 15000 }, { level: 14, xpRequired: 20000 },
  { level: 15, xpRequired: 30000 }, { level: 16, xpRequired: 50000 },
] as const;

function calculateLevel(xp: number): number {
  let level = 1;
  for (const t of LEVEL_THRESHOLDS) {
    if (xp >= t.xpRequired) level = t.level;
    else break;
  }
  return level;
}

// ─────────────────────────────────────────────────────────────────────────────
// ARCHIVE EXCESS HABITS ON DOWNGRADE
// ─────────────────────────────────────────────────────────────────────────────
export const archiveExcessOnDowngrade = mutation({
  args: { newPlan: v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime')) },
  returns: v.number(),
  handler: async (ctx, { newPlan }) => {
    const user = await getAuthUser(ctx);
    const limit = PLAN_LIMITS[newPlan].maxHabits;
    const activeHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId_active', (q) => q.eq('userId', user._id).eq('isActive', true))
      .collect();
    if (activeHabits.length <= limit) return 0;
    // Sort by creation time, keep the most recent 'limit' habits active
    const toArchive = activeHabits
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(limit);
    for (const habit of toArchive) {
      await ctx.db.patch(habit._id, { isActive: false, archivedByDowngrade: true, updatedAt: Date.now() });
    }
    return toArchive.length;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// RESTORE ARCHIVED HABITS ON UPGRADE
// ─────────────────────────────────────────────────────────────────────────────
export const restoreArchivedOnUpgrade = mutation({
  args: { newPlan: v.union(v.literal('pro'), v.literal('lifetime')) },
  returns: v.number(),
  handler: async (ctx, { newPlan }) => {
    const user = await getAuthUser(ctx);
    const limit = PLAN_LIMITS[newPlan].maxHabits;
    const archived = await ctx.db
      .query('habits')
      .withIndex('by_userId_archivedByDowngrade', (q) => q.eq('userId', user._id).eq('archivedByDowngrade', true))
      .collect();
    let restored = 0;
    for (const habit of archived) {
      // Only restore up to the new plan's limit
      const activeCount = await ctx.db
        .query('habits')
        .withIndex('by_userId_active', (q) => q.eq('userId', user._id).eq('isActive', true))
        .collect();
      if (activeCount.length < limit) {
        await ctx.db.patch(habit._id, { isActive: true, archivedByDowngrade: false, updatedAt: Date.now() });
        restored++;
      } else {
        break;
      }
    }
    return restored;
  },
});

// Internal versions so other Convex functions can reuse the logic without
// exposing these helpers to the public client API.
export const archiveExcessOnDowngradeInternal = internalMutation({
  args: { newPlan: v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime')) },
  returns: v.number(),
  handler: async (ctx, { newPlan }) => {
    const user = await getAuthUser(ctx);
    const limit = PLAN_LIMITS[newPlan].maxHabits;
    const activeHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId_active', (q) => q.eq('userId', user._id).eq('isActive', true))
      .collect();
    if (activeHabits.length <= limit) return 0;
    const toArchive = activeHabits.sort((a, b) => b.createdAt - a.createdAt).slice(limit);
    for (const habit of toArchive) {
      await ctx.db.patch(habit._id, { isActive: false, archivedByDowngrade: true, updatedAt: Date.now() });
    }
    return toArchive.length;
  },
});

export const restoreArchivedOnUpgradeInternal = internalMutation({
  args: { newPlan: v.union(v.literal('pro'), v.literal('lifetime')) },
  returns: v.number(),
  handler: async (ctx, { newPlan }) => {
    const user = await getAuthUser(ctx);
    const limit = PLAN_LIMITS[newPlan].maxHabits;
    const archived = await ctx.db
      .query('habits')
      .withIndex('by_userId_archivedByDowngrade', (q) => q.eq('userId', user._id).eq('archivedByDowngrade', true))
      .collect();
    let restored = 0;
    for (const habit of archived) {
      const activeCount = await ctx.db
        .query('habits')
        .withIndex('by_userId_active', (q) => q.eq('userId', user._id).eq('isActive', true))
        .collect();
      if (activeCount.length < limit) {
        await ctx.db.patch(habit._id, { isActive: true, archivedByDowngrade: false, updatedAt: Date.now() });
        restored++;
      } else {
        break;
      }
    }
    return restored;
  },
});
// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Habits Engine (Convex)
// Create, track, complete habits with streak management & plan enforcement
// ═══════════════════════════════════════════════════════════════════════════════

// mutation/query/v already imported above

// Reusable habit document validator
const habitDoc = v.object({
  _id: v.id('habits'),
  _creationTime: v.number(),
  userId: v.id('users'),
  goalId: v.optional(v.id('goals')),
  title: v.string(),
  description: v.optional(v.string()),
  category: v.string(),
  frequency: v.union(
    v.literal('daily'),
    v.literal('weekdays'),
    v.literal('weekends'),
    v.literal('3x_week'),
    v.literal('weekly'),
    v.literal('custom')
  ),
  customDays: v.optional(v.array(v.number())),
  timeOfDay: v.union(
    v.literal('morning'),
    v.literal('afternoon'),
    v.literal('evening'),
    v.literal('anytime')
  ),
  identityLabel: v.optional(v.string()),
  isActive: v.boolean(),
  streakCurrent: v.number(),
  streakLongest: v.number(),
  color: v.optional(v.string()),
  icon: v.optional(v.string()),
  estimatedMinutes: v.optional(v.number()),
  order: v.optional(v.number()),
  // Enhanced habit type system
  habitType: v.optional(v.union(
    v.literal('yes_no'),
    v.literal('quantity'),
    v.literal('duration'),
    v.literal('negative'),
    v.literal('range'),
    v.literal('checklist')
  )),
  targetValue: v.optional(v.number()),
  targetUnit: v.optional(v.string()),
  checklistItems: v.optional(v.array(v.string())),
  // Habit stacking cue
  cueType: v.optional(v.union(
    v.literal('time'),
    v.literal('location'),
    v.literal('action'),
    v.literal('emotion'),
    v.literal('none')
  )),
  cueDescription: v.optional(v.string()),
  afterHabitId: v.optional(v.id('habits')),
  // Progression system
  difficultyLevel: v.optional(v.number()),
  autoProgressionEnabled: v.optional(v.boolean()),
  progressionIntervalDays: v.optional(v.number()),
  progressionIncreaseAmount: v.optional(v.number()),
  // Stats
  totalCompletions: v.optional(v.number()),
  completionRate7Day: v.optional(v.number()),
  completionRate30Day: v.optional(v.number()),
  lastCompletedAt: v.optional(v.number()),
  // Motivation
  whyImportant: v.optional(v.string()),
  immediateReward: v.optional(v.string()),
  // Specific time
  specificTime: v.optional(v.string()),
  reminderEnabled: v.optional(v.boolean()),
  createdAt: v.number(),
  updatedAt: v.number(),
  // Downgrade preservation
  archivedByDowngrade: v.optional(v.boolean()),
});

const habitLogDoc = v.object({
  _id: v.id('habitLogs'),
  _creationTime: v.number(),
  habitId: v.id('habits'),
  userId: v.id('users'),
  date: v.string(),
  status: v.union(
    v.literal('completed'),
    v.literal('skipped'),
    v.literal('failed')
  ),
  mood: v.optional(v.number()),
  note: v.optional(v.string()),
  completedAt: v.optional(v.number()),
  // Enhanced tracking
  value: v.optional(v.number()),
  energyLevel: v.optional(v.union(
    v.literal('high'),
    v.literal('medium'),
    v.literal('low')
  )),
  difficulty: v.optional(v.union(
    v.literal('easy'),
    v.literal('medium'),
    v.literal('hard')
  )),
  loggedVia: v.optional(v.union(
    v.literal('manual'),
    v.literal('auto'),
    v.literal('reminder')
  )),
});

// Plan limits
const PLAN_LIMITS = {
  free: { maxHabits: 10 },
  pro: { maxHabits: Infinity },
  lifetime: { maxHabits: Infinity },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Helper: get authenticated user
// ─────────────────────────────────────────────────────────────────────────────
async function getAuthUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Not authenticated');

  const user = await ctx.db
    .query('users')
    .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
    .unique();
  if (!user) throw new Error('User not found — complete signup first');
  return user;
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE HABIT
// ─────────────────────────────────────────────────────────────────────────────
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    frequency: v.union(
      v.literal('daily'),
      v.literal('weekdays'),
      v.literal('weekends'),
      v.literal('3x_week'),
      v.literal('weekly'),
      v.literal('custom')
    ),
    customDays: v.optional(v.array(v.number())),
    timeOfDay: v.union(
      v.literal('morning'),
      v.literal('afternoon'),
      v.literal('evening'),
      v.literal('anytime')
    ),
    identityLabel: v.optional(v.string()),
    goalId: v.optional(v.id('goals')),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    // Enhanced fields
    habitType: v.optional(v.union(
      v.literal('yes_no'),
      v.literal('quantity'),
      v.literal('duration'),
      v.literal('negative'),
      v.literal('range'),
      v.literal('checklist')
    )),
    targetValue: v.optional(v.number()),
    targetUnit: v.optional(v.string()),
    checklistItems: v.optional(v.array(v.string())),
    cueType: v.optional(v.union(
      v.literal('time'),
      v.literal('location'),
      v.literal('action'),
      v.literal('emotion'),
      v.literal('none')
    )),
    cueDescription: v.optional(v.string()),
    afterHabitId: v.optional(v.id('habits')),
    difficultyLevel: v.optional(v.number()),
    autoProgressionEnabled: v.optional(v.boolean()),
    progressionIntervalDays: v.optional(v.number()),
    progressionIncreaseAmount: v.optional(v.number()),
    whyImportant: v.optional(v.string()),
    immediateReward: v.optional(v.string()),
    specificTime: v.optional(v.string()),
    reminderEnabled: v.optional(v.boolean()),
  },
  returns: v.id('habits'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await checkAndCreateHabit(ctx, user._id, {
      goalId: args.goalId,
      title: args.title,
      description: args.description,
      category: args.category,
      frequency: args.frequency,
      customDays: args.customDays,
      timeOfDay: args.timeOfDay,
      identityLabel: args.identityLabel,
      color: args.color,
      icon: args.icon,
      estimatedMinutes: args.estimatedMinutes,
      order: undefined,
      habitType: args.habitType ?? 'yes_no',
      targetValue: args.targetValue,
      targetUnit: args.targetUnit,
      checklistItems: args.checklistItems,
      cueType: args.cueType,
      cueDescription: args.cueDescription,
      afterHabitId: args.afterHabitId,
      difficultyLevel: args.difficultyLevel ?? 1,
      autoProgressionEnabled: args.autoProgressionEnabled,
      progressionIntervalDays: args.progressionIntervalDays,
      progressionIncreaseAmount: args.progressionIncreaseAmount,
      whyImportant: args.whyImportant,
      immediateReward: args.immediateReward,
      specificTime: args.specificTime,
      reminderEnabled: args.reminderEnabled,
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST ACTIVE HABITS
// ─────────────────────────────────────────────────────────────────────────────
export const listActive = query({
  args: {},
  returns: v.array(habitDoc),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('habits')
      .withIndex('by_userId_active', (q: any) =>
        q.eq('userId', user._id).eq('isActive', true)
      )
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST ALL HABITS (including archived)
// ─────────────────────────────────────────────────────────────────────────────
export const listAll = query({
  args: {},
  returns: v.array(habitDoc),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('habits')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE HABIT COMPLETION
// ─────────────────────────────────────────────────────────────────────────────
export const toggleComplete = mutation({
  args: {
    habitId: v.id('habits'),
    date: v.string(), // YYYY-MM-DD
    mood: v.optional(v.number()),
    note: v.optional(v.string()),
    value: v.optional(v.number()),
    energyLevel: v.optional(v.union(
      v.literal('high'), v.literal('medium'), v.literal('low')
    )),
    difficulty: v.optional(v.union(
      v.literal('easy'), v.literal('medium'), v.literal('hard')
    )),
  },
  returns: v.object({
    action: v.string(),
    xpChange: v.number(),
    streak: v.optional(v.number()),
  }),
  handler: async (ctx, { habitId, date, mood, note, value, energyLevel, difficulty }) => {
    const user = await getAuthUser(ctx);
    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== user._id) throw new Error('Habit not found');

    // Check if already logged today
    const existing = await ctx.db
      .query('habitLogs')
      .withIndex('by_habitId_date', (q: any) =>
        q.eq('habitId', habitId).eq('date', date)
      )
      .unique();

    if (existing) {
      // Toggle off — remove the log
      if (existing.status === 'completed') {
        await ctx.db.delete(existing._id);

        // Decrement streak
        const newStreak = Math.max(0, habit.streakCurrent - 1);
        await ctx.db.patch(habitId, {
          streakCurrent: newStreak,
          updatedAt: Date.now(),
        });

        // Actually deduct XP from gamification profile
        const gamification = await ctx.db
          .query('gamification')
          .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
          .unique();
        if (gamification) {
          const newXP = Math.max(0, gamification.totalXP - 10);
          const newLevel = calculateLevel(newXP);
          await ctx.db.patch(gamification._id, {
            totalXP: newXP,
            level: newLevel,
            totalHabitsCompleted: Math.max(0, (gamification.totalHabitsCompleted ?? 0) - 1),
            updatedAt: Date.now(),
          });
        }

        return { action: 'uncompleted', xpChange: -10 };
      }
      // Was skipped/failed → mark completed
      await ctx.db.patch(existing._id, {
        status: 'completed',
        mood,
        note,
        value,
        energyLevel,
        difficulty,
        loggedVia: 'manual',
        completedAt: Date.now(),
      });
    } else {
      // Create new log
      await ctx.db.insert('habitLogs', {
        habitId,
        userId: user._id,
        date,
        status: 'completed',
        mood,
        note,
        value,
        energyLevel,
        difficulty,
        loggedVia: 'manual',
        completedAt: Date.now(),
      });
    }

    // Update streak + stats
    const newStreak = habit.streakCurrent + 1;
    const newLongest = Math.max(habit.streakLongest, newStreak);
    const newTotalCompletions = (habit.totalCompletions ?? 0) + 1;
    await ctx.db.patch(habitId, {
      streakCurrent: newStreak,
      streakLongest: newLongest,
      totalCompletions: newTotalCompletions,
      lastCompletedAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Award XP via gamification
    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();

    if (gamification) {
      const xpGain = 10 + (newStreak >= 7 ? 5 : 0) + (newStreak >= 30 ? 10 : 0) + (newStreak >= 100 ? 25 : 0);
      const newXP = gamification.totalXP + xpGain;
      const newLevel = calculateLevel(newXP);
      const newCoins = (gamification.coins ?? 0) + Math.ceil(xpGain * 0.1);

      await ctx.db.patch(gamification._id, {
        totalXP: newXP,
        level: newLevel,
        coins: newCoins,
        totalHabitsCompleted: (gamification.totalHabitsCompleted ?? 0) + 1,
        updatedAt: Date.now(),
      });

      // Log XP history
      await ctx.db.insert('xpHistory', {
        userId: user._id,
        amount: xpGain,
        source: 'habit_complete',
        description: `Habit: ${habit.title} (${newStreak}d streak)`,
        createdAt: Date.now(),
      });

      return { action: 'completed', xpChange: xpGain, streak: newStreak };
    }

    return { action: 'completed', xpChange: 10, streak: newStreak };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// SKIP HABIT
// ─────────────────────────────────────────────────────────────────────────────
export const skip = mutation({
  args: {
    habitId: v.id('habits'),
    date: v.string(),
  },
  returns: v.object({
    action: v.string(),
  }),
  handler: async (ctx, { habitId, date }) => {
    const user = await getAuthUser(ctx);
    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== user._id) throw new Error('Habit not found');

    const existing = await ctx.db
      .query('habitLogs')
      .withIndex('by_habitId_date', (q: any) =>
        q.eq('habitId', habitId).eq('date', date)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { status: 'skipped' });
    } else {
      await ctx.db.insert('habitLogs', {
        habitId,
        userId: user._id,
        date,
        status: 'skipped',
      });
    }

    // "Never Miss Twice" — streak preserved on skip, broken on consecutive skip
    return { action: 'skipped' };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE HABIT
// ─────────────────────────────────────────────────────────────────────────────
export const update = mutation({
  args: {
    habitId: v.id('habits'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    frequency: v.optional(
      v.union(
        v.literal('daily'),
        v.literal('weekdays'),
        v.literal('weekends'),
        v.literal('3x_week'),
        v.literal('weekly'),
        v.literal('custom')
      )
    ),
    timeOfDay: v.optional(
      v.union(
        v.literal('morning'),
        v.literal('afternoon'),
        v.literal('evening'),
        v.literal('anytime')
      )
    ),
    identityLabel: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    // Enhanced fields
    habitType: v.optional(v.union(
      v.literal('yes_no'),
      v.literal('quantity'),
      v.literal('duration'),
      v.literal('negative'),
      v.literal('range'),
      v.literal('checklist')
    )),
    targetValue: v.optional(v.number()),
    targetUnit: v.optional(v.string()),
    checklistItems: v.optional(v.array(v.string())),
    cueType: v.optional(v.union(
      v.literal('time'),
      v.literal('location'),
      v.literal('action'),
      v.literal('emotion'),
      v.literal('none')
    )),
    cueDescription: v.optional(v.string()),
    afterHabitId: v.optional(v.id('habits')),
    difficultyLevel: v.optional(v.number()),
    autoProgressionEnabled: v.optional(v.boolean()),
    progressionIntervalDays: v.optional(v.number()),
    progressionIncreaseAmount: v.optional(v.number()),
    whyImportant: v.optional(v.string()),
    immediateReward: v.optional(v.string()),
    specificTime: v.optional(v.string()),
    reminderEnabled: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, { habitId, ...updates }) => {
    const user = await getAuthUser(ctx);
    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== user._id) throw new Error('Habit not found');

    await ctx.db.patch(habitId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE HABIT
// ─────────────────────────────────────────────────────────────────────────────
export const remove = mutation({
  args: { habitId: v.id('habits') },
  returns: v.null(),
  handler: async (ctx, { habitId }) => {
    const user = await getAuthUser(ctx);
    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== user._id) throw new Error('Habit not found');

    // Delete associated logs
    const logs = await ctx.db
      .query('habitLogs')
      .withIndex('by_habitId', (q: any) => q.eq('habitId', habitId))
      .collect();

    for (const log of logs) {
      await ctx.db.delete(log._id);
    }

    await ctx.db.delete(habitId);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET LOGS FOR DATE RANGE
// ─────────────────────────────────────────────────────────────────────────────
export const getLogsForDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  returns: v.array(habitLogDoc),
  handler: async (ctx, { startDate, endDate }) => {
    const user = await getAuthUser(ctx);

    const allLogs = await ctx.db
      .query('habitLogs')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();

    return allLogs.filter((log) => log.date >= startDate && log.date <= endDate);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET HABIT STATS
// ─────────────────────────────────────────────────────────────────────────────
export const getStats = query({
  args: { habitId: v.id('habits') },
  returns: v.object({
    totalLogs: v.number(),
    completed: v.number(),
    completionRate: v.number(),
    streakCurrent: v.number(),
    streakLongest: v.number(),
    bestDay: v.string(),
    worstDay: v.string(),
  }),
  handler: async (ctx, { habitId }) => {
    const user = await getAuthUser(ctx);
    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== user._id) throw new Error('Habit not found');

    const logs = await ctx.db
      .query('habitLogs')
      .withIndex('by_habitId', (q: any) => q.eq('habitId', habitId))
      .collect();

    const completed = logs.filter((l) => l.status === 'completed').length;
    const total = logs.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Best/worst day analysis
    const dayCount: Record<string, { completed: number; total: number }> = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (const log of logs) {
      const day = dayNames[new Date(log.date).getDay()];
      if (!dayCount[day]) dayCount[day] = { completed: 0, total: 0 };
      dayCount[day].total++;
      if (log.status === 'completed') dayCount[day].completed++;
    }

    let bestDay = '';
    let worstDay = '';
    let bestRate = -1;
    let worstRate = 101;

    for (const [day, data] of Object.entries(dayCount)) {
      const rate = data.total > 0 ? (data.completed / data.total) * 100 : 0;
      if (rate > bestRate) {
        bestRate = rate;
        bestDay = day;
      }
      if (rate < worstRate) {
        worstRate = rate;
        worstDay = day;
      }
    }

    return {
      totalLogs: total,
      completed,
      completionRate,
      streakCurrent: habit.streakCurrent,
      streakLongest: habit.streakLongest,
      bestDay,
      worstDay,
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST HABITS ARCHIVED BY DOWNGRADE
// ─────────────────────────────────────────────────────────────────────────────
export const listArchivedByDowngrade = query({
  args: {},
  returns: v.array(habitDoc),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    return await ctx.db
      .query('habits')
      .withIndex('by_userId_archivedByDowngrade', (q: any) =>
        q.eq('userId', user._id).eq('archivedByDowngrade', true)
      )
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// COUNT HABITS ARCHIVED BY DOWNGRADE
// ─────────────────────────────────────────────────────────────────────────────
export const getArchivedDowngradeCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    const archived = await ctx.db
      .query('habits')
      .withIndex('by_userId_archivedByDowngrade', (q: any) =>
        q.eq('userId', user._id).eq('archivedByDowngrade', true)
      )
      .collect();
    return archived.length;
  },
});

// ───────────────────────────────────────────────────────────────────────────
// CREATE HABIT FROM AI COACH (Living System)
// ───────────────────────────────────────────────────────────────────────────
export const createFromAI = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    frequency: v.union(
      v.literal('daily'), v.literal('weekdays'), v.literal('weekends'),
      v.literal('3x_week'), v.literal('weekly')
    ),
    timeOfDay: v.union(v.literal('morning'), v.literal('afternoon'), v.literal('evening'), v.literal('anytime')),
    category: v.optional(v.string()),
    identityLabel: v.optional(v.string()),
    cueDescription: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
  },
  returns: v.id('habits'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    return await checkAndCreateHabit(ctx, user._id, {
      title: args.title,
      description: args.description,
      category: args.category ?? 'personal_growth',
      frequency: args.frequency,
      timeOfDay: args.timeOfDay,
      identityLabel: args.identityLabel,
      cueDescription: args.cueDescription,
      estimatedMinutes: args.estimatedMinutes,
      habitType: 'yes_no',
      difficultyLevel: 1,
    });
  },
});
