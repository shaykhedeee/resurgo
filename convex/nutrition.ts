// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Nutrition & Hydration Tracker (Convex)
// Daily calorie, macro, water and steps logging
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

const mealValidator = v.object({
  name: v.string(),
  calories: v.number(),
  protein: v.optional(v.number()),
  carbs: v.optional(v.number()),
  fat: v.optional(v.number()),
  time: v.optional(v.string()),
});

// ── Add a meal to today's log ──────────────────────────────────────────────────

export const logMeal = mutation({
  args: {
    date: v.string(),  // YYYY-MM-DD
    meal: mealValidator,
    calorieGoal: v.optional(v.number()),
  },
  returns: v.id('nutritionLogs'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const now = Date.now();

    const existing = await ctx.db
      .query('nutritionLogs')
      .withIndex('by_userId_date', (q: any) =>
        q.eq('userId', user._id).eq('date', args.date)
      )
      .unique();

    if (existing) {
      const meals = [...existing.meals, args.meal];
      const totals = meals.reduce(
        (acc: any, m: any) => ({
          calories: acc.calories + (m.calories ?? 0),
          protein: acc.protein + (m.protein ?? 0),
          carbs: acc.carbs + (m.carbs ?? 0),
          fat: acc.fat + (m.fat ?? 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
      await ctx.db.patch(existing._id, {
        meals,
        totalCalories: totals.calories,
        totalProtein: totals.protein,
        totalCarbs: totals.carbs,
        totalFat: totals.fat,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert('nutritionLogs', {
      userId: user._id,
      date: args.date,
      meals: [args.meal],
      totalCalories: args.meal.calories,
      totalProtein: args.meal.protein ?? 0,
      totalCarbs: args.meal.carbs ?? 0,
      totalFat: args.meal.fat ?? 0,
      calorieGoal: args.calorieGoal,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateWaterAndSteps = mutation({
  args: {
    date: v.string(),
    waterMl: v.optional(v.number()),
    steps: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const now = Date.now();

    const existing = await ctx.db
      .query('nutritionLogs')
      .withIndex('by_userId_date', (q: any) =>
        q.eq('userId', user._id).eq('date', args.date)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...(args.waterMl !== undefined && { waterMl: args.waterMl }),
        ...(args.steps !== undefined && { steps: args.steps }),
        updatedAt: now,
      });
    } else {
      await ctx.db.insert('nutritionLogs', {
        userId: user._id,
        date: args.date,
        meals: [],
        totalCalories: 0,
        waterMl: args.waterMl,
        steps: args.steps,
        createdAt: now,
        updatedAt: now,
      });
    }
    return null;
  },
});

export const getNutritionLog = query({
  args: { date: v.string() },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, { date }) => {
    const user = await getAuthUser(ctx);
    return await ctx.db
      .query('nutritionLogs')
      .withIndex('by_userId_date', (q: any) =>
        q.eq('userId', user._id).eq('date', date)
      )
      .unique() ?? null;
  },
});

export const listNutritionLogs = query({
  args: { days: v.optional(v.number()) },
  returns: v.array(v.any()),
  handler: async (ctx, { days }) => {
    const user = await getAuthUser(ctx);
    const logs = await ctx.db
      .query('nutritionLogs')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();
    return days ? logs.slice(0, days) : logs;
  },
});

export const deleteMeal = mutation({
  args: { date: v.string(), mealIndex: v.number() },
  returns: v.null(),
  handler: async (ctx, { date, mealIndex }) => {
    const user = await getAuthUser(ctx);
    const log = await ctx.db
      .query('nutritionLogs')
      .withIndex('by_userId_date', (q: any) =>
        q.eq('userId', user._id).eq('date', date)
      )
      .unique();
    if (!log) return null;
    const meals = log.meals.filter((_: any, i: number) => i !== mealIndex);
    const totals = meals.reduce(
      (acc: any, m: any) => ({
        calories: acc.calories + (m.calories ?? 0),
        protein: acc.protein + (m.protein ?? 0),
        carbs: acc.carbs + (m.carbs ?? 0),
        fat: acc.fat + (m.fat ?? 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    await ctx.db.patch(log._id, {
      meals,
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const updateWaterAndStepsServer = mutation({
  args: {
    userId: v.id('users'),
    date: v.string(),
    waterMl: v.optional(v.number()),
    steps: v.optional(v.number()),
    secret: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (args.secret !== "resurgo_fitness_sync_secret_2026") {
      throw new Error('Unauthorized server mutation');
    }
    const now = Date.now();
    const existing = await ctx.db
      .query('nutritionLogs')
      .withIndex('by_userId_date', (q: any) =>
        q.eq('userId', args.userId).eq('date', args.date)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...(args.waterMl !== undefined && { waterMl: args.waterMl }),
        ...(args.steps !== undefined && { steps: args.steps }),
        updatedAt: now,
      });
    } else {
      await ctx.db.insert('nutritionLogs', {
        userId: args.userId,
        date: args.date,
        meals: [],
        totalCalories: 0,
        waterMl: args.waterMl,
        steps: args.steps,
        createdAt: now,
        updatedAt: now,
      });
    }
    return null;
  },
});
