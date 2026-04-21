// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Budget & Finance Tracker (Convex)
// Personal finance engine: transactions, categories, financial goals
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

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────

export const addTransaction = mutation({
  args: {
    type: v.union(v.literal('income'), v.literal('expense')),
    amount: v.number(),
    currency: v.optional(v.string()),
    category: v.string(),
    subCategory: v.optional(v.string()),
    description: v.string(),
    date: v.string(),
    isRecurring: v.optional(v.boolean()),
    recurringPeriod: v.optional(v.union(
      v.literal('daily'),
      v.literal('weekly'),
      v.literal('monthly'),
      v.literal('yearly'),
    )),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.id('transactions'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    return await ctx.db.insert('transactions', {
      userId: user._id,
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const deleteTransaction = mutation({
  args: { transactionId: v.id('transactions') },
  returns: v.null(),
  handler: async (ctx, { transactionId }) => {
    const user = await getAuthUser(ctx);
    const tx = await ctx.db.get(transactionId);
    if (!tx || tx.userId !== user._id) throw new Error('Not found');
    await ctx.db.delete(transactionId);
    return null;
  },
});

export const listTransactions = query({
  args: {
    month: v.optional(v.string()),   // YYYY-MM
    type: v.optional(v.union(v.literal('income'), v.literal('expense'))),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.any()),
  handler: async (ctx, { month, type, limit }) => {
    const user = await getAuthUser(ctx);
    let txs = await ctx.db
      .query('transactions')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    if (month) txs = txs.filter((t: any) => t.date.startsWith(month));
    if (type) txs = txs.filter((t: any) => t.type === type);
    return limit ? txs.slice(0, limit) : txs;
  },
});

export const getMonthSummary = query({
  args: { month: v.string() },  // YYYY-MM
  returns: v.object({
    totalIncome: v.number(),
    totalExpenses: v.number(),
    net: v.number(),
    byCategory: v.array(v.object({
      category: v.string(),
      amount: v.number(),
      count: v.number(),
    })),
  }),
  handler: async (ctx, { month }) => {
    const user = await getAuthUser(ctx);
    const txs: any[] = await ctx.db
      .query('transactions')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();

    const monthTxs = txs.filter((t: any) => t.date.startsWith(month));
    const totalIncome = monthTxs
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    const totalExpenses = monthTxs
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const catMap = new Map<string, { amount: number; count: number }>();
    for (const t of monthTxs.filter((t: any) => t.type === 'expense')) {
      const cur = catMap.get(t.category) ?? { amount: 0, count: 0 };
      catMap.set(t.category, { amount: cur.amount + t.amount, count: cur.count + 1 });
    }

    return {
      totalIncome,
      totalExpenses,
      net: totalIncome - totalExpenses,
      byCategory: Array.from(catMap.entries()).map(([category, data]) => ({
        category,
        ...data,
      })).sort((a, b) => b.amount - a.amount),
    };
  },
});

// ─── BUDGET CATEGORIES ────────────────────────────────────────────────────────

export const upsertBudgetCategory = mutation({
  args: {
    id: v.optional(v.id('budgetCategories')),
    name: v.string(),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    monthlyBudget: v.number(),
    type: v.union(
      v.literal('essential'),
      v.literal('discretionary'),
      v.literal('savings'),
      v.literal('investment'),
    ),
  },
  returns: v.id('budgetCategories'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    if (args.id) {
      const existing = await ctx.db.get(args.id);
      if (!existing || existing.userId !== user._id) throw new Error('Not found');
      const { id, ...rest } = args;
      await ctx.db.patch(args.id, rest);
      return args.id;
    }
    const { id: _id, ...rest } = args;
    return await ctx.db.insert('budgetCategories', {
      userId: user._id,
      ...rest,
      createdAt: Date.now(),
    });
  },
});

export const listBudgetCategories = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    return await ctx.db
      .query('budgetCategories')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
  },
});

// ─── FINANCIAL GOALS ──────────────────────────────────────────────────────────

export const createFinancialGoal = mutation({
  args: {
    title: v.string(),
    targetAmount: v.number(),
    currentAmount: v.optional(v.number()),
    currency: v.optional(v.string()),
    deadline: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  returns: v.id('financialGoals'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const now = Date.now();
    return await ctx.db.insert('financialGoals', {
      userId: user._id,
      title: args.title,
      targetAmount: args.targetAmount,
      currentAmount: args.currentAmount ?? 0,
      currency: args.currency,
      deadline: args.deadline,
      icon: args.icon,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateFinancialGoal = mutation({
  args: {
    goalId: v.id('financialGoals'),
    currentAmount: v.optional(v.number()),
    status: v.optional(v.union(
      v.literal('active'),
      v.literal('completed'),
      v.literal('paused'),
    )),
    title: v.optional(v.string()),
    targetAmount: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, { goalId, ...updates }) => {
    const user = await getAuthUser(ctx);
    const goal = await ctx.db.get(goalId);
    if (!goal || goal.userId !== user._id) throw new Error('Not found');
    await ctx.db.patch(goalId, { ...updates, updatedAt: Date.now() });
    return null;
  },
});

export const listFinancialGoals = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    return await ctx.db
      .query('financialGoals')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LOG EXPENSE FROM AI COACH (Living System)
// ─────────────────────────────────────────────────────────────────────────────
export const logExpenseFromAI = mutation({
  args: {
    amount: v.number(),
    currency: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    date: v.optional(v.string()),
  },
  returns: v.id('transactions'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    return await ctx.db.insert('transactions', {
      userId: user._id,
      type: 'expense',
      amount: args.amount,
      currency: args.currency ?? 'USD',
      category: args.category ?? 'general',
      description: args.description ?? 'AI-logged expense',
      date: args.date ?? new Date().toISOString().slice(0, 10),
      createdAt: Date.now(),
    });
  },
});

// ─── BUDGET PROFILE (AI-powered wizard data) ────────────────────────────────

export const saveBudgetProfile = mutation({
  args: {
    lifeStage: v.string(),
    householdType: v.string(),
    incomeAmount: v.number(),
    incomeFrequency: v.string(),
    currency: v.string(),
    budgetGoal: v.string(),
    dietaryPreference: v.string(),
    cooksAtHome: v.string(),
    hasTransportCosts: v.boolean(),
    fixedCommitments: v.optional(v.array(v.object({ name: v.string(), amount: v.number() }))),
    duration: v.string(),
    location: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const existing = await ctx.db
      .query('budgetProfiles')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: Date.now() });
    } else {
      await ctx.db.insert('budgetProfiles', {
        userId: user._id,
        ...args,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      });
    }
    return null;
  },
});

export const getBudgetProfile = query({
  args: {},
  returns: v.union(v.any(), v.null()),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    return await ctx.db
      .query('budgetProfiles')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();
  },
});

export const saveBudgetPlan = mutation({
  args: {
    planJson: v.string(),
    currency: v.string(),
    totalBudget: v.number(),
    month: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const existing = await ctx.db
      .query('budgetPlans')
      .withIndex('by_userId_month', (q: any) => q.eq('userId', user._id).eq('month', args.month))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { planJson: args.planJson, currency: args.currency, totalBudget: args.totalBudget, updatedAt: Date.now() });
    } else {
      await ctx.db.insert('budgetPlans', {
        userId: user._id,
        planJson: args.planJson,
        currency: args.currency,
        totalBudget: args.totalBudget,
        month: args.month,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
    return null;
  },
});

export const getBudgetPlan = query({
  args: { month: v.string() },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, { month }) => {
    const user = await getAuthUser(ctx);
    return await ctx.db
      .query('budgetPlans')
      .withIndex('by_userId_month', (q: any) => q.eq('userId', user._id).eq('month', month))
      .unique();
  },
});
