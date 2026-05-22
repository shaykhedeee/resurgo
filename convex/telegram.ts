// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Telegram Integration Functions
// Handles OTP auth flow, account linking, context, and queries for bot commands
// ═══════════════════════════════════════════════════════════════════════════════

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// ─── Helper: generate 6-char alphanumeric OTP ────────────────────────────────
function generateOtp(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// createOtp — Called by webhook when a NEW user sends /start
// Returns the OTP token so the webhook can embed it in the auth link
// ─────────────────────────────────────────────────────────────────────────────
export const createOtp = mutation({
  args: {
    telegramChatId: v.string(),
    telegramUsername: v.optional(v.string()),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    const token = generateOtp();
    const now = Date.now();
    const expiresAt = now + 15 * 60 * 1000; // 15 minutes

    // Delete any existing OTP for this chat ID to prevent spam
    const existing = await ctx.db
      .query('telegramOtps')
      .filter((q) => q.eq(q.field('telegramChatId'), args.telegramChatId))
      .collect();
    for (const otp of existing) {
      await ctx.db.delete(otp._id);
    }

    await ctx.db.insert('telegramOtps', {
      clerkId: '', // placeholder — OTPs are looked up by token, not clerkId
      token,
      telegramChatId: args.telegramChatId,
      telegramUsername: args.telegramUsername,
      used: false,
      expiresAt,
      createdAt: now,
    });

    return token;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// linkAccount — Called by /link-telegram page after user clicks auth link
// Associates the Telegram chat ID with the authenticated Clerk user
// ─────────────────────────────────────────────────────────────────────────────
export const linkAccount = mutation({
  args: {
    clerkId: v.string(),
    token: v.string(),
  },
  returns: v.union(
    v.object({ success: v.literal(true), telegramChatId: v.string() }),
    v.object({ success: v.literal(false), error: v.string() })
  ),
  handler: async (ctx, args) => {
    const now = Date.now();

    // Find the OTP
    const otp = await ctx.db
      .query('telegramOtps')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (!otp) {
      return { success: false as const, error: 'Invalid or expired link. Please send /start again in Telegram.' };
    }
    if (otp.used) {
      return { success: false as const, error: 'This link has already been used. Please send /start again.' };
    }
    if (otp.expiresAt < now) {
      await ctx.db.delete(otp._id);
      return { success: false as const, error: 'Link expired. Please send /start again in Telegram.' };
    }

    // Find the user by clerkId
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (!user) {
      return { success: false as const, error: 'Account not found. Please ensure you are logged into Resurgo.' };
    }

    // Check if another user already has this chat ID
    const existing = await ctx.db
      .query('users')
      .withIndex('by_telegramChatId', (q) => q.eq('telegramChatId', otp.telegramChatId))
      .first();
    if (existing && existing._id !== user._id) {
      return { success: false as const, error: 'This Telegram account is already linked to another Resurgo account.' };
    }

    // Link the account
    await ctx.db.patch(user._id, {
      telegramChatId: otp.telegramChatId,
      telegramLinked: true,
      updatedAt: now,
    });

    // Mark OTP as used
    await ctx.db.patch(otp._id, { used: true, clerkId: args.clerkId });

    return { success: true as const, telegramChatId: otp.telegramChatId };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// getUserByTelegramChatId — Look up a Resurgo user from Telegram chat ID
// Used by webhook to authenticate all incoming commands
// ─────────────────────────────────────────────────────────────────────────────
export const getUserByTelegramChatId = query({
  args: { telegramChatId: v.string() },
  returns: v.union(
    v.object({
      _id: v.id('users'),
      clerkId: v.string(),
      name: v.string(),
      email: v.string(),
      plan: v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime')),
      telegramChatId: v.optional(v.string()),
      telegramLinked: v.optional(v.boolean()),
      preferredTime: v.optional(v.string()),
      timezone: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_telegramChatId', (q) => q.eq('telegramChatId', args.telegramChatId))
      .first();
    if (!user) return null;
    return {
      _id: user._id,
      clerkId: user.clerkId,
      name: user.name,
      email: user.email,
      plan: user.plan,
      telegramChatId: user.telegramChatId,
      telegramLinked: user.telegramLinked,
      preferredTime: user.preferredTime,
      timezone: user.timezone,
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// getOrCreateContext — Retrieve or initialise a user's Telegram message context
// ─────────────────────────────────────────────────────────────────────────────
export const getOrCreateContext = mutation({
  args: { userId: v.id('users'), telegramChatId: v.string() },
  returns: v.array(v.object({
    role: v.union(v.literal('user'), v.literal('assistant')),
    content: v.string(),
    timestamp: v.number(),
  })),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('telegramContext')
      .withIndex('by_telegramChatId', (q) => q.eq('telegramChatId', args.telegramChatId))
      .first();
    if (existing) return existing.messages;

    await ctx.db.insert('telegramContext', {
      userId: args.userId,
      telegramChatId: args.telegramChatId,
      messages: [],
      updatedAt: Date.now(),
    });
    return [];
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// appendToContext — Add a message to context, trimming to last 10
// ─────────────────────────────────────────────────────────────────────────────
export const appendToContext = mutation({
  args: {
    telegramChatId: v.string(),
    role: v.union(v.literal('user'), v.literal('assistant')),
    content: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query('telegramContext')
      .withIndex('by_telegramChatId', (q) => q.eq('telegramChatId', args.telegramChatId))
      .first();

    const newMessage = { role: args.role, content: args.content, timestamp: now };
    const messages = existing
      ? [...existing.messages, newMessage].slice(-10)
      : [newMessage];

    if (existing) {
      await ctx.db.patch(existing._id, { messages, updatedAt: now });
    }
    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// getUserSummary — Returns a compact data snapshot for bot commands like /digest
// ─────────────────────────────────────────────────────────────────────────────
export const getUserSummary = query({
  args: { userId: v.id('users') },
  returns: v.object({
    topTasks: v.array(v.object({ _id: v.id('tasks'), title: v.string(), priority: v.optional(v.string()) })),
    habitsToday: v.array(v.object({ _id: v.id('habits'), title: v.string(), completedToday: v.boolean() })),
    activeGoals: v.array(v.object({ _id: v.id('goals'), title: v.string(), progress: v.number() })),
  }),
  handler: async (ctx, args) => {
    const todayStr = new Date().toISOString().slice(0, 10);

    // Top 5 incomplete tasks
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_userId_status', (q) => q.eq('userId', args.userId).eq('status', 'todo'))
      .order('desc')
      .take(5);

    // Active habits
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId_active', (q) => q.eq('userId', args.userId).eq('isActive', true))
      .take(10);

    // Check which habits have a completed log today
    const todayLogs = await ctx.db
      .query('habitLogs')
      .withIndex('by_userId_date', (q) => q.eq('userId', args.userId).eq('date', todayStr))
      .filter((q) => q.eq(q.field('status'), 'completed'))
      .collect();
    const loggedToday = new Set(todayLogs.map((l) => l.habitId.toString()));

    // Active goals
    const goals = await ctx.db
      .query('goals')
      .withIndex('by_userId_status', (q) => q.eq('userId', args.userId).eq('status', 'in_progress'))
      .take(5);

    return {
      topTasks: tasks.map((t) => ({ _id: t._id, title: t.title, priority: t.priority })),
      habitsToday: habits.map((h) => ({ _id: h._id, title: h.title, completedToday: loggedToday.has(h._id.toString()) })),
      activeGoals: goals.map((g) => ({ _id: g._id, title: g.title, progress: g.progress })),
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// createTaskFromTelegram — Creates a task from a Telegram /task command
// ─────────────────────────────────────────────────────────────────────────────
export const createTaskFromTelegram = mutation({
  args: {
    userId: v.id('users'),
    title: v.string(),
  },
  returns: v.id('tasks'),
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert('tasks', {
      userId: args.userId,
      title: args.title,
      status: 'todo',
      priority: 'medium',
      source: 'telegram',
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// getUsersWithTelegram — Internal query for morning digest cron
// Returns users who have Telegram linked and have a preferredTime set
// ─────────────────────────────────────────────────────────────────────────────
export const getUsersWithTelegram = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id('users'),
    telegramChatId: v.string(),
    name: v.string(),
    preferredTime: v.optional(v.string()),
    timezone: v.optional(v.string()),
  })),
  handler: async (ctx) => {
    const users = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('telegramLinked'), true))
      .collect();
    return users
      .filter((u) => u.telegramChatId)
      .map((u) => ({
        _id: u._id,
        telegramChatId: u.telegramChatId!,
        name: u.name,
        preferredTime: u.preferredTime,
        timezone: u.timezone,
      }));
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// unlinkTelegram — Unlinks Telegram from a user account (from Settings page)
// ─────────────────────────────────────────────────────────────────────────────
export const unlinkTelegram = mutation({
  args: { clerkId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (!user) return null;
    await ctx.db.patch(user._id, {
      telegramChatId: undefined,
      telegramLinked: false,
      updatedAt: Date.now(),
    });
    return null;
  },
});

// Simple level calculator for gamification
function calculateLevel(xp: number): number {
  if (xp < 100) return 1;
  if (xp < 300) return 2;
  if (xp < 600) return 3;
  if (xp < 1000) return 4;
  if (xp < 1500) return 5;
  if (xp < 2200) return 6;
  if (xp < 3000) return 7;
  if (xp < 4000) return 8;
  if (xp < 5500) return 9;
  if (xp < 7500) return 10;
  if (xp < 10000) return 11;
  if (xp < 13000) return 12;
  if (xp < 17000) return 13;
  if (xp < 22000) return 14;
  if (xp < 28000) return 15;
  return 16;
}

// ─────────────────────────────────────────────────────────────────────────────
// logHabitFromTelegram — Check/toggle a habit case-insensitively via bot
// ─────────────────────────────────────────────────────────────────────────────
export const logHabitFromTelegram = mutation({
  args: {
    userId: v.id('users'),
    habitSearchText: v.string(),
    date: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    habitTitle: v.optional(v.string()),
    action: v.optional(v.string()),
    streak: v.optional(v.number()),
    xpChange: v.optional(v.number()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // 1. Get active habits
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId_active', (q) => q.eq('userId', args.userId).eq('isActive', true))
      .collect();

    // 2. Filter by search text
    const search = args.habitSearchText.toLowerCase().trim();
    const matches = habits.filter((h) => h.title.toLowerCase().includes(search));

    if (matches.length === 0) {
      return { success: false, error: 'No active habits matched your search text.' };
    }
    if (matches.length > 1) {
      return {
        success: false,
        error: `Multiple active habits matched:\n${matches.map((m) => `• ${m.title}`).join('\n')}\n\nSpecify a more unique name!`,
      };
    }

    const habit = matches[0];
    const habitId = habit._id;

    // Check if already logged on this date
    const existing = await ctx.db
      .query('habitLogs')
      .withIndex('by_habitId_date', (q) => q.eq('habitId', habitId).eq('date', args.date))
      .unique();

    let action = 'completed';
    let xpChange = 10;
    let newStreak = habit.streakCurrent + 1;

    if (existing) {
      if (existing.status === 'completed') {
        // Toggle off — remove the log
        await ctx.db.delete(existing._id);

        // Decrement streak
        newStreak = Math.max(0, habit.streakCurrent - 1);
        await ctx.db.patch(habitId, {
          streakCurrent: newStreak,
          updatedAt: Date.now(),
        });

        // Deduct XP
        const gamification = await ctx.db
          .query('gamification')
          .withIndex('by_userId', (q) => q.eq('userId', args.userId))
          .unique();
        if (gamification) {
          const newXP = Math.max(0, gamification.totalXP - 10);
          await ctx.db.patch(gamification._id, {
            totalXP: newXP,
            level: calculateLevel(newXP),
            totalHabitsCompleted: Math.max(0, (gamification.totalHabitsCompleted ?? 0) - 1),
            updatedAt: Date.now(),
          });
        }
        return {
          success: true,
          habitTitle: habit.title,
          action: 'uncompleted',
          streak: newStreak,
          xpChange: -10,
        };
      } else {
        // Was skipped/failed -> complete it
        await ctx.db.patch(existing._id, {
          status: 'completed',
          loggedVia: 'manual',
          completedAt: Date.now(),
        });
      }
    } else {
      // Create new log
      await ctx.db.insert('habitLogs', {
        habitId,
        userId: args.userId,
        date: args.date,
        status: 'completed',
        loggedVia: 'manual',
        completedAt: Date.now(),
      });
    }

    // Update streak + stats
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
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();

    if (gamification) {
      xpChange = 10 + (newStreak >= 7 ? 5 : 0) + (newStreak >= 30 ? 10 : 0) + (newStreak >= 100 ? 25 : 0);
      const newXP = gamification.totalXP + xpChange;
      const newLevel = calculateLevel(newXP);
      const newCoins = (gamification.coins ?? 0) + Math.ceil(xpChange * 0.1);

      await ctx.db.patch(gamification._id, {
        totalXP: newXP,
        level: newLevel,
        coins: newCoins,
        totalHabitsCompleted: (gamification.totalHabitsCompleted ?? 0) + 1,
        updatedAt: Date.now(),
      });

      // Log XP history
      await ctx.db.insert('xpHistory', {
        userId: args.userId,
        amount: xpChange,
        source: 'habit_complete',
        description: `Habit: ${habit.title} (${newStreak}d streak)`,
        createdAt: Date.now(),
      });
    }

    return {
      success: true,
      habitTitle: habit.title,
      action: 'completed',
      streak: newStreak,
      xpChange,
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// logWaterFromTelegram — Record daily water consumption
// ─────────────────────────────────────────────────────────────────────────────
export const logWaterFromTelegram = mutation({
  args: {
    userId: v.id('users'),
    glasses: v.number(),
    date: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    totalGlasses: v.number(),
    totalMl: v.number(),
  }),
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query('nutritionLogs')
      .withIndex('by_userId_date', (q) => q.eq('userId', args.userId).eq('date', args.date))
      .unique();

    let newMl = args.glasses * 250;
    if (existing) {
      newMl = (existing.waterMl ?? 0) + (args.glasses * 250);
      await ctx.db.patch(existing._id, {
        waterMl: newMl,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert('nutritionLogs', {
        userId: args.userId,
        date: args.date,
        meals: [],
        totalCalories: 0,
        waterMl: newMl,
        createdAt: now,
        updatedAt: now,
      });
    }

    return {
      success: true,
      totalMl: newMl,
      totalGlasses: Math.round(newMl / 250),
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// logExpenseFromTelegram — Save budget transaction instantly
// ─────────────────────────────────────────────────────────────────────────────
export const logExpenseFromTelegram = mutation({
  args: {
    userId: v.id('users'),
    amount: v.number(),
    category: v.string(),
    description: v.string(),
    date: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    amount: v.number(),
    category: v.string(),
    description: v.string(),
  }),
  handler: async (ctx, args) => {
    await ctx.db.insert('transactions', {
      userId: args.userId,
      type: 'expense',
      amount: args.amount,
      currency: 'USD',
      category: args.category,
      description: args.description,
      date: args.date,
      createdAt: Date.now(),
    });

    return {
      success: true,
      amount: args.amount,
      category: args.category,
      description: args.description,
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// logMoodFromTelegram — Log daily mood score and notes
// ─────────────────────────────────────────────────────────────────────────────
export const logMoodFromTelegram = mutation({
  args: {
    userId: v.id('users'),
    score: v.number(),
    notes: v.optional(v.string()),
    date: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    score: v.number(),
    notes: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    await ctx.db.insert('moodEntries', {
      userId: args.userId,
      date: args.date,
      score: args.score,
      notes: args.notes,
      createdAt: Date.now(),
    });

    return {
      success: true,
      score: args.score,
      notes: args.notes,
    };
  },
});

