// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Gamification Engine (Convex)
// XP, levels, achievements, coins, power-ups — Part 4 of plan
// ═══════════════════════════════════════════════════════════════════════════════

import { query, mutation, internalMutation } from './_generated/server';
import { v } from 'convex/values';

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL SYSTEM — 10 tiers from Seedling to Transcendent
// ═══════════════════════════════════════════════════════════════════════════════
const LEVEL_THRESHOLDS = [
  { level: 1, xpRequired: 0, name: 'Seedling', tier: 'beginner' },
  { level: 2, xpRequired: 100, name: 'Sprout', tier: 'beginner' },
  { level: 3, xpRequired: 250, name: 'Sapling', tier: 'beginner' },
  { level: 4, xpRequired: 500, name: 'Growing', tier: 'explorer' },
  { level: 5, xpRequired: 800, name: 'Blooming', tier: 'explorer' },
  { level: 6, xpRequired: 1200, name: 'Flourishing', tier: 'explorer' },
  { level: 7, xpRequired: 1800, name: 'Thriving', tier: 'achiever' },
  { level: 8, xpRequired: 2500, name: 'Mighty Oak', tier: 'achiever' },
  { level: 9, xpRequired: 3500, name: 'Ancient Tree', tier: 'achiever' },
  { level: 10, xpRequired: 5000, name: 'Forest Guardian', tier: 'master' },
  { level: 11, xpRequired: 7000, name: 'Mountain Sage', tier: 'master' },
  { level: 12, xpRequired: 10000, name: 'Summit Walker', tier: 'master' },
  { level: 13, xpRequired: 15000, name: 'Sky Dancer', tier: 'legend' },
  { level: 14, xpRequired: 20000, name: 'Star Weaver', tier: 'legend' },
  { level: 15, xpRequired: 30000, name: 'Constellation', tier: 'legend' },
  { level: 16, xpRequired: 50000, name: 'Transcendent', tier: 'legend' },
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// XP EARNING RATES — Per plan document Part 4
// ═══════════════════════════════════════════════════════════════════════════════
export const XP_RATES = {
  task_complete_low: 5,
  task_complete_medium: 10,
  task_complete_high: 15,
  task_complete_urgent: 25,
  task_with_subtasks_bonus: 5,
  habit_complete: 10,
  habit_streak_7_bonus: 5,
  habit_streak_30_bonus: 10,
  habit_streak_100_bonus: 25,
  milestone_complete: 50,
  goal_complete: 200,
  focus_per_minute: 0.5,
  focus_completion_bonus: 5,
  focus_no_distractions_bonus: 10,
  daily_login: 5,
  morning_intention: 10,
  evening_reflection: 15,
  weekly_review: 30,
  perfect_day: 25,
  comeback: 100,
  first_goal: 50,
  first_habit: 25,
  level_up: 10,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ACHIEVEMENT CATALOG — 50+ achievements across 8 categories
// ═══════════════════════════════════════════════════════════════════════════════
export const ACHIEVEMENT_CATALOG = [
  // Getting Started
  { id: 'first_step', name: 'First Step', description: 'Complete your first task', icon: '👣', category: 'getting_started', rarity: 'common', xpReward: 10, coinReward: 5 },
  { id: 'goal_setter', name: 'Goal Setter', description: 'Create your first goal', icon: '🎯', category: 'getting_started', rarity: 'common', xpReward: 25, coinReward: 10 },
  { id: 'habit_builder', name: 'Habit Builder', description: 'Create your first habit', icon: '🧱', category: 'getting_started', rarity: 'common', xpReward: 25, coinReward: 10 },
  { id: 'self_aware', name: 'Self Aware', description: 'Complete the Life Wheel assessment', icon: '🔮', category: 'getting_started', rarity: 'common', xpReward: 20, coinReward: 10 },
  { id: 'vision_crafter', name: 'Vision Crafter', description: 'Write your life vision', icon: '✨', category: 'getting_started', rarity: 'common', xpReward: 30, coinReward: 15 },
  // Consistency
  { id: 'streak_3', name: 'Three-peat', description: '3-day streak on any habit', icon: '🔥', category: 'consistency', rarity: 'common', xpReward: 15, coinReward: 5 },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day streak', icon: '⚡', category: 'consistency', rarity: 'common', xpReward: 30, coinReward: 10 },
  { id: 'streak_14', name: 'Fortnight Force', description: '14-day streak', icon: '💪', category: 'consistency', rarity: 'rare', xpReward: 50, coinReward: 20 },
  { id: 'streak_30', name: 'Monthly Master', description: '30-day streak', icon: '🏆', category: 'consistency', rarity: 'rare', xpReward: 100, coinReward: 50 },
  { id: 'streak_60', name: 'Iron Will', description: '60-day streak', icon: '🛡️', category: 'consistency', rarity: 'epic', xpReward: 200, coinReward: 100 },
  { id: 'streak_100', name: 'Centurion', description: '100-day streak', icon: '👑', category: 'consistency', rarity: 'epic', xpReward: 500, coinReward: 250 },
  { id: 'streak_365', name: 'Year of Transformation', description: '365-day streak', icon: '🌟', category: 'consistency', rarity: 'legendary', xpReward: 2000, coinReward: 1000 },
  // Productivity
  { id: 'task_10', name: 'Getting Things Done', description: 'Complete 10 tasks', icon: '✅', category: 'productivity', rarity: 'common', xpReward: 20, coinReward: 10 },
  { id: 'task_50', name: 'Productive Machine', description: 'Complete 50 tasks', icon: '⚙️', category: 'productivity', rarity: 'rare', xpReward: 50, coinReward: 25 },
  { id: 'task_100', name: 'Century Club', description: 'Complete 100 tasks', icon: '💯', category: 'productivity', rarity: 'rare', xpReward: 100, coinReward: 50 },
  { id: 'task_500', name: 'Task Titan', description: 'Complete 500 tasks', icon: '🏛️', category: 'productivity', rarity: 'epic', xpReward: 250, coinReward: 125 },
  { id: 'perfect_day', name: 'Perfect Day', description: 'Complete all tasks and habits in a day', icon: '⭐', category: 'productivity', rarity: 'rare', xpReward: 50, coinReward: 25 },
  { id: 'perfect_week', name: 'Perfect Week', description: '7 perfect days in a row', icon: '🌈', category: 'productivity', rarity: 'epic', xpReward: 200, coinReward: 100 },
  // Focus
  { id: 'focus_1h', name: 'Hour of Power', description: 'Complete 1 hour of focused work', icon: '⏱️', category: 'focus', rarity: 'common', xpReward: 15, coinReward: 5 },
  { id: 'focus_10h', name: 'Deep Diver', description: 'Accumulate 10 hours of focus', icon: '🤿', category: 'focus', rarity: 'rare', xpReward: 50, coinReward: 25 },
  { id: 'focus_50h', name: 'Focus Master', description: 'Accumulate 50 hours of focus', icon: '🧘', category: 'focus', rarity: 'epic', xpReward: 150, coinReward: 75 },
  { id: 'focus_100h', name: 'Laser Focus', description: 'Accumulate 100 hours of focus', icon: '🔬', category: 'focus', rarity: 'epic', xpReward: 300, coinReward: 150 },
  { id: 'zero_distractions', name: 'In The Zone', description: 'Complete a focus session with 0 distractions', icon: '🎯', category: 'focus', rarity: 'rare', xpReward: 30, coinReward: 15 },
  // Growth
  { id: 'goal_complete_1', name: 'Dream Achiever', description: 'Complete your first goal', icon: '🏅', category: 'growth', rarity: 'rare', xpReward: 200, coinReward: 100 },
  { id: 'goal_complete_5', name: 'Goal Crusher', description: 'Complete 5 goals', icon: '💎', category: 'growth', rarity: 'epic', xpReward: 500, coinReward: 250 },
  { id: 'goal_complete_10', name: 'Life Architect', description: 'Complete 10 goals', icon: '🏗️', category: 'growth', rarity: 'legendary', xpReward: 1000, coinReward: 500 },
  { id: 'all_domains', name: 'Well Rounded', description: 'Have goals in all 8 life domains', icon: '🌍', category: 'growth', rarity: 'epic', xpReward: 200, coinReward: 100 },
  { id: 'milestone_10', name: 'Milestone Maverick', description: 'Complete 10 milestones', icon: '🗻', category: 'growth', rarity: 'rare', xpReward: 100, coinReward: 50 },
  // Wellness
  { id: 'mood_tracker', name: 'Mood Mapper', description: 'Log mood for 7 days straight', icon: '😊', category: 'wellness', rarity: 'common', xpReward: 20, coinReward: 10 },
  { id: 'journal_10', name: 'Thoughtful Writer', description: 'Write 10 journal entries', icon: '📝', category: 'wellness', rarity: 'rare', xpReward: 50, coinReward: 25 },
  { id: 'gratitude_30', name: 'Gratitude Guru', description: '30 days of gratitude practice', icon: '🙏', category: 'wellness', rarity: 'epic', xpReward: 150, coinReward: 75 },
  { id: 'breathing_master', name: 'Calm Mind', description: 'Complete 20 breathing exercises', icon: '🌬️', category: 'wellness', rarity: 'rare', xpReward: 50, coinReward: 25 },
  // Recovery
  { id: 'comeback_kid', name: 'Comeback Kid', description: 'Complete your first recovery protocol', icon: '🔄', category: 'recovery', rarity: 'rare', xpReward: 100, coinReward: 50 },
  { id: 'resilient', name: 'Resilient', description: 'Complete 3 recovery protocols', icon: '🏋️', category: 'recovery', rarity: 'epic', xpReward: 250, coinReward: 125 },
  { id: 'anti_fragile', name: 'Anti-Fragile', description: 'Recover and exceed previous best streak', icon: '🦅', category: 'recovery', rarity: 'legendary', xpReward: 500, coinReward: 250 },
  { id: 'never_give_up', name: 'Never Give Up', description: 'Return after 30+ days away', icon: '❤️‍🔥', category: 'recovery', rarity: 'epic', xpReward: 200, coinReward: 100 },
  // Engagement
  { id: 'weekly_reviewer', name: 'Self Reflector', description: 'Complete 4 weekly reviews', icon: '📊', category: 'engagement', rarity: 'rare', xpReward: 50, coinReward: 25 },
  { id: 'template_creator', name: 'Template Creator', description: 'Create and share a goal template', icon: '📋', category: 'engagement', rarity: 'rare', xpReward: 75, coinReward: 35 },
  { id: 'early_bird', name: 'Early Bird', description: 'Complete morning intention before 7 AM', icon: '🐦', category: 'engagement', rarity: 'common', xpReward: 15, coinReward: 5 },
  { id: 'night_owl', name: 'Night Owl', description: 'Complete evening reflection after 9 PM', icon: '🦉', category: 'engagement', rarity: 'common', xpReward: 15, coinReward: 5 },
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// POWER-UPS
// ═══════════════════════════════════════════════════════════════════════════════
export const POWER_UP_CATALOG = [
  { id: 'streak_shield', name: 'Streak Shield', description: 'Protect your streak for one missed day', cost: 50, type: 'streak_protection' },
  { id: 'xp_boost_2x', name: '2x XP Boost', description: 'Double XP for 24 hours', cost: 100, type: 'xp_multiplier' },
  { id: 'insight_boost', name: 'Priority Insight', description: 'Get an immediate AI coaching session', cost: 75, type: 'ai_boost' },
  { id: 'theme_unlock', name: 'Theme Unlock', description: 'Unlock a premium UI theme', cost: 200, type: 'cosmetic' },
  { id: 'focus_ambience', name: 'Focus Ambience', description: 'Unlock ambient soundscape for focus', cost: 150, type: 'cosmetic' },
  { id: 'celebration', name: 'Celebration Effect', description: 'Premium celebration animation', cost: 50, type: 'cosmetic' },
] as const;

function calculateLevel(xp: number) {
  let level = 1;
  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold.xpRequired) {
      level = threshold.level;
    } else {
      break;
    }
  }
  return level;
}

function getLevelInfo(level: number) {
  const found = LEVEL_THRESHOLDS.find((t) => t.level === level);
  return found ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

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

// ─────────────────────────────────────────────────────────────────────────────
// GET PROFILE (enhanced)
// ─────────────────────────────────────────────────────────────────────────────
export const getProfile = query({
  args: {},
  returns: v.object({
    totalXP: v.number(),
    level: v.number(),
    levelName: v.string(),
    tier: v.string(),
    coins: v.number(),
    achievements: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        description: v.string(),
        icon: v.string(),
        unlockedAt: v.number(),
        category: v.optional(v.string()),
        rarity: v.optional(v.union(
          v.literal('common'),
          v.literal('rare'),
          v.literal('epic'),
          v.literal('legendary')
        )),
        xpReward: v.optional(v.number()),
        coinReward: v.optional(v.number()),
      })
    ),
    badges: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        icon: v.string(),
      })
    ),
    powerUps: v.array(v.object({
      id: v.string(),
      name: v.string(),
      type: v.string(),
      quantity: v.number(),
    })),
    xpToNextLevel: v.number(),
    xpProgress: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    totalTasksCompleted: v.number(),
    totalHabitsCompleted: v.number(),
    totalGoalsCompleted: v.number(),
    totalFocusMinutes: v.number(),
  }),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();

    if (!gamification) {
      return {
        totalXP: 0,
        level: 1,
        levelName: 'Seedling',
        tier: 'beginner',
        coins: 0,
        achievements: [],
        badges: [],
        powerUps: [],
        xpToNextLevel: 100,
        xpProgress: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalTasksCompleted: 0,
        totalHabitsCompleted: 0,
        totalGoalsCompleted: 0,
        totalFocusMinutes: 0,
      };
    }

    const level = calculateLevel(gamification.totalXP);
    const levelInfo = getLevelInfo(level);
    const nextLevelInfo = getLevelInfo(level + 1);

    const xpIntoLevel = gamification.totalXP - levelInfo.xpRequired;
    const xpForNextLevel = nextLevelInfo.xpRequired - levelInfo.xpRequired;

    return {
      totalXP: gamification.totalXP,
      level,
      levelName: levelInfo.name,
      tier: levelInfo.tier,
      coins: gamification.coins ?? 0,
      achievements: gamification.achievements,
      badges: gamification.badges ?? [],
      powerUps: gamification.powerUps ?? [],
      xpToNextLevel: nextLevelInfo.xpRequired,
      xpProgress: xpForNextLevel > 0 ? Math.round((xpIntoLevel / xpForNextLevel) * 100) : 100,
      currentStreak: gamification.currentStreak ?? 0,
      longestStreak: gamification.longestStreak ?? 0,
      totalTasksCompleted: gamification.totalTasksCompleted ?? 0,
      totalHabitsCompleted: gamification.totalHabitsCompleted ?? 0,
      totalGoalsCompleted: gamification.totalGoalsCompleted ?? 0,
      totalFocusMinutes: gamification.totalFocusMinutes ?? 0,
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// AWARD XP (internal — called by other systems)
// ─────────────────────────────────────────────────────────────────────────────
export const awardXP = internalMutation({
  args: {
    userId: v.id('users'),
    amount: v.number(),
    reason: v.string(),
    source: v.optional(v.union(
      v.literal('task_complete'),
      v.literal('habit_complete'),
      v.literal('goal_complete'),
      v.literal('milestone_complete'),
      v.literal('focus_session'),
      v.literal('streak_bonus'),
      v.literal('achievement'),
      v.literal('daily_login'),
      v.literal('weekly_review'),
      v.literal('perfect_day'),
      v.literal('comeback'),
      v.literal('other')
    )),
  },
  returns: v.null(),
  handler: async (ctx, { userId, amount, reason, source }) => {
    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', userId))
      .unique();

    if (!gamification) return null;

    // ── Daily XP cap (500 XP/day) to prevent gaming ──
    const DAILY_XP_CAP = 500;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEntries = await ctx.db
      .query('xpHistory')
      .withIndex('by_userId_createdAt', (q: any) =>
        q.eq('userId', userId).gte('createdAt', todayStart.getTime())
      )
      .collect();
    const xpEarnedToday = todayEntries.reduce((sum, e) => sum + e.amount, 0);
    const effectiveAmount = Math.min(amount, DAILY_XP_CAP - xpEarnedToday);
    if (effectiveAmount <= 0) return null;

    const newXP = gamification.totalXP + effectiveAmount;
    const newLevel = calculateLevel(newXP);
    const oldLevel = gamification.level;

    const updates: any = {
      totalXP: newXP,
      level: newLevel,
      updatedAt: Date.now(),
    };

    // Auto-award coins (10% of XP)
    updates.coins = (gamification.coins ?? 0) + Math.ceil(effectiveAmount * 0.1);

    // Check for level-up
    if (newLevel > oldLevel) {
      const levelInfo = getLevelInfo(newLevel);
      const achievements = [...gamification.achievements];
      achievements.push({
        id: `level_${newLevel}_${Date.now()}`,
        name: `Reached ${levelInfo.name}`,
        description: `Leveled up to Level ${newLevel}!`,
        icon: '🎉',
        unlockedAt: Date.now(),
        category: 'growth',
        rarity: (newLevel >= 13 ? 'legendary' : newLevel >= 10 ? 'epic' : newLevel >= 7 ? 'rare' : 'common') as 'common' | 'rare' | 'epic' | 'legendary',
        xpReward: 10,
        coinReward: 10,
      });
      updates.achievements = achievements;
      updates.coins += 10;
      updates.tier = levelInfo.tier;
    }

    await ctx.db.patch(gamification._id, updates);

    // Log XP history (only the effective amount)
    await ctx.db.insert('xpHistory', {
      userId,
      amount: effectiveAmount,
      source: source ?? 'other',
      description: reason,
      createdAt: Date.now(),
    });

    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UNLOCK ACHIEVEMENT
// ─────────────────────────────────────────────────────────────────────────────
export const unlockAchievement = mutation({
  args: {
    achievementId: v.string(),
  },
  returns: v.union(
    v.object({
      unlocked: v.boolean(),
      achievement: v.optional(v.object({
        id: v.string(),
        name: v.string(),
        description: v.string(),
        icon: v.string(),
        xpReward: v.number(),
        coinReward: v.number(),
      })),
    }),
    v.null()
  ),
  handler: async (ctx, { achievementId }) => {
    const user = await getAuthUser(ctx);

    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();

    if (!gamification) return null;

    if (gamification.achievements.some((a) => a.id === achievementId)) {
      return { unlocked: false };
    }

    const catalogEntry = ACHIEVEMENT_CATALOG.find((a) => a.id === achievementId);
    if (!catalogEntry) return { unlocked: false };

    const achievements = [...gamification.achievements];
    achievements.push({
      id: catalogEntry.id,
      name: catalogEntry.name,
      description: catalogEntry.description,
      icon: catalogEntry.icon,
      unlockedAt: Date.now(),
      category: catalogEntry.category,
      rarity: catalogEntry.rarity as 'common' | 'rare' | 'epic' | 'legendary',
      xpReward: catalogEntry.xpReward,
      coinReward: catalogEntry.coinReward,
    });

    await ctx.db.patch(gamification._id, {
      achievements,
      totalXP: gamification.totalXP + catalogEntry.xpReward,
      coins: (gamification.coins ?? 0) + catalogEntry.coinReward,
      updatedAt: Date.now(),
    });

    return {
      unlocked: true,
      achievement: {
        id: catalogEntry.id,
        name: catalogEntry.name,
        description: catalogEntry.description,
        icon: catalogEntry.icon,
        xpReward: catalogEntry.xpReward,
        coinReward: catalogEntry.coinReward,
      },
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// PURCHASE POWER-UP
// ─────────────────────────────────────────────────────────────────────────────
export const purchasePowerUp = mutation({
  args: { powerUpId: v.string() },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, { powerUpId }) => {
    const user = await getAuthUser(ctx);

    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();

    if (!gamification) return { success: false, message: 'Profile not found' };

    const powerUp = POWER_UP_CATALOG.find((p) => p.id === powerUpId);
    if (!powerUp) return { success: false, message: 'Power-up not found' };

    const currentCoins = gamification.coins ?? 0;
    if (currentCoins < powerUp.cost) {
      return { success: false, message: `Not enough coins. Need ${powerUp.cost}, have ${currentCoins}.` };
    }

    const existingPowerUps = gamification.powerUps ?? [];
    const existingIdx = existingPowerUps.findIndex((p) => p.id === powerUpId);

    let updatedPowerUps;
    if (existingIdx >= 0) {
      updatedPowerUps = [...existingPowerUps];
      updatedPowerUps[existingIdx] = {
        ...updatedPowerUps[existingIdx],
        quantity: updatedPowerUps[existingIdx].quantity + 1,
      };
    } else {
      updatedPowerUps = [
        ...existingPowerUps,
        { id: powerUp.id, name: powerUp.name, type: powerUp.type, quantity: 1 },
      ];
    }

    await ctx.db.patch(gamification._id, {
      coins: currentCoins - powerUp.cost,
      powerUps: updatedPowerUps,
      updatedAt: Date.now(),
    });

    return { success: true, message: `Purchased ${powerUp.name}!` };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// USE POWER-UP
// ─────────────────────────────────────────────────────────────────────────────
export const usePowerUp = mutation({
  args: { powerUpId: v.string() },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, { powerUpId }) => {
    const user = await getAuthUser(ctx);

    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();

    if (!gamification) return { success: false, message: 'Profile not found' };

    const existingPowerUps = gamification.powerUps ?? [];
    const idx = existingPowerUps.findIndex((p) => p.id === powerUpId);

    if (idx < 0 || existingPowerUps[idx].quantity <= 0) {
      return { success: false, message: 'No power-ups available' };
    }

    const updatedPowerUps = [...existingPowerUps];
    updatedPowerUps[idx] = {
      ...updatedPowerUps[idx],
      quantity: updatedPowerUps[idx].quantity - 1,
    };

    await ctx.db.patch(gamification._id, {
      powerUps: updatedPowerUps.filter((p) => p.quantity > 0),
      updatedAt: Date.now(),
    });

    return { success: true, message: `Used ${existingPowerUps[idx].name}!` };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE STREAK
// ─────────────────────────────────────────────────────────────────────────────
export const updateStreak = mutation({
  args: { date: v.string() },
  returns: v.object({
    currentStreak: v.number(),
    isNewDay: v.boolean(),
  }),
  handler: async (ctx, { date }) => {
    const user = await getAuthUser(ctx);

    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();

    if (!gamification) return { currentStreak: 0, isNewDay: false };

    const lastDate = gamification.lastStreakDate;
    if (lastDate === date) return { currentStreak: gamification.currentStreak ?? 0, isNewDay: false };

    const lastTimestamp = lastDate ? new Date(lastDate).getTime() : 0;
    const currentTimestamp = new Date(date).getTime();
    const dayDiff = Math.round((currentTimestamp - lastTimestamp) / (1000 * 60 * 60 * 24));

    let newStreak: number;
    if (dayDiff === 1) {
      newStreak = (gamification.currentStreak ?? 0) + 1;
    } else if (dayDiff === 0) {
      newStreak = gamification.currentStreak ?? 0;
    } else {
      newStreak = 1;
    }

    const newLongest = Math.max(gamification.longestStreak ?? 0, newStreak);

    await ctx.db.patch(gamification._id, {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastStreakDate: date,
      totalXP: gamification.totalXP + XP_RATES.daily_login,
      updatedAt: Date.now(),
    });

    await ctx.db.insert('xpHistory', {
      userId: user._id,
      amount: XP_RATES.daily_login,
      source: 'daily_login',
      description: 'Daily login bonus',
      createdAt: Date.now(),
    });

    return { currentStreak: newStreak, isNewDay: true };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET XP HISTORY
// ─────────────────────────────────────────────────────────────────────────────
export const getXPHistory = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(v.object({
    _id: v.id('xpHistory'),
    _creationTime: v.number(),
    userId: v.id('users'),
    amount: v.number(),
    source: v.union(
      v.literal('task_complete'),
      v.literal('habit_complete'),
      v.literal('goal_complete'),
      v.literal('milestone_complete'),
      v.literal('focus_session'),
      v.literal('streak_bonus'),
      v.literal('achievement'),
      v.literal('daily_login'),
      v.literal('weekly_review'),
      v.literal('perfect_day'),
      v.literal('comeback'),
      v.literal('other')
    ),
    description: v.string(),
    createdAt: v.number(),
  })),
  handler: async (ctx, { limit }) => {
    const user = await getAuthUser(ctx);

    const events = await ctx.db
      .query('xpHistory')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    return limit ? events.slice(0, limit) : events;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET ACHIEVEMENT PROGRESS
// ─────────────────────────────────────────────────────────────────────────────
export const getAchievementProgress = query({
  args: {},
  returns: v.array(v.object({
    id: v.string(),
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    category: v.string(),
    rarity: v.string(),
    xpReward: v.number(),
    coinReward: v.number(),
    unlocked: v.boolean(),
    unlockedAt: v.optional(v.number()),
  })),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();

    const unlockedIds = new Set(gamification?.achievements.map((a) => a.id) ?? []);
    const unlockedMap = new Map(
      gamification?.achievements.map((a) => [a.id, a.unlockedAt]) ?? []
    );

    return ACHIEVEMENT_CATALOG.map((ach) => ({
      id: ach.id,
      name: ach.name,
      description: ach.description,
      icon: ach.icon,
      category: ach.category,
      rarity: ach.rarity,
      xpReward: ach.xpReward,
      coinReward: ach.coinReward,
      unlocked: unlockedIds.has(ach.id),
      unlockedAt: unlockedMap.get(ach.id),
    }));
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET POWER-UP SHOP
// ─────────────────────────────────────────────────────────────────────────────
export const getPowerUpShop = query({
  args: {},
  returns: v.object({
    coins: v.number(),
    catalog: v.array(v.object({
      id: v.string(),
      name: v.string(),
      description: v.string(),
      cost: v.number(),
      type: v.string(),
      owned: v.number(),
    })),
  }),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();

    const ownedPowerUps = gamification?.powerUps ?? [];
    const ownedMap = new Map(ownedPowerUps.map((p) => [p.id, p.quantity]));

    return {
      coins: gamification?.coins ?? 0,
      catalog: POWER_UP_CATALOG.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        cost: p.cost,
        type: p.type,
        owned: ownedMap.get(p.id) ?? 0,
      })),
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// XP LEADERBOARD — Top 20 users by XP + calling user's rank
// ─────────────────────────────────────────────────────────────────────────────
export const getLeaderboard = query({
  args: {},
  returns: v.object({
    entries: v.array(v.object({
      rank: v.number(),
      userId: v.id('users'),
      name: v.string(),
      imageUrl: v.optional(v.string()),
      level: v.number(),
      levelName: v.string(),
      tier: v.string(),
      totalXP: v.number(),
      currentStreak: v.number(),
      isCurrentUser: v.boolean(),
    })),
    myRank: v.optional(v.number()),
    myXP: v.optional(v.number()),
  }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const currentUser = identity
      ? await ctx.db
          .query('users')
          .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
          .unique()
      : null;

    // Collect all gamification records (max 1000 at this scale)
    const allRecords = await ctx.db.query('gamification').collect();

    // Sort by totalXP descending, then streak, then recency
    allRecords.sort((a, b) => {
      const xpDelta = (b.totalXP ?? 0) - (a.totalXP ?? 0);
      if (xpDelta !== 0) return xpDelta;

      const streakDelta = (b.currentStreak ?? 0) - (a.currentStreak ?? 0);
      if (streakDelta !== 0) return streakDelta;

      return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
    });

    // Load user details for top 20
    const top20 = allRecords.slice(0, 20);
    const entries = await Promise.all(
      top20.map(async (rec, idx) => {
        const user = await ctx.db.get(rec.userId);
        const levelInfo = LEVEL_THRESHOLDS.find((t) => t.level === (rec.level ?? 1))
          ?? LEVEL_THRESHOLDS[0];
        return {
          rank: idx + 1,
          userId: rec.userId,
          name: user?.name ?? 'Resurgo User',
          imageUrl: user?.imageUrl,
          level: rec.level ?? 1,
          levelName: levelInfo.name,
          tier: rec.tier ?? levelInfo.tier,
          totalXP: rec.totalXP ?? 0,
          currentStreak: rec.currentStreak ?? 0,
          isCurrentUser: currentUser ? rec.userId === currentUser._id : false,
        };
      })
    );

    // Find calling user's rank if not in top 20
    let myRank: number | undefined;
    let myXP: number | undefined;
    if (currentUser) {
      const myIdx = allRecords.findIndex((r) => r.userId === currentUser._id);
      if (myIdx >= 0) {
        myRank = myIdx + 1;
        myXP = allRecords[myIdx].totalXP ?? 0;
      }
    }

    return { entries, myRank, myXP };
  },
});
