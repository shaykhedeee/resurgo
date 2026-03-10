import { mutation, internalMutation, query } from './_generated/server';
import { v } from 'convex/values';
import { checkAndCreateGoal } from './lib/transactions';
import { checkAndCreateHabit } from './lib/transactions';

// ─────────────────────────────────────────────────────────────────────────────
// ARCHIVE EXCESS GOALS ON DOWNGRADE
// ─────────────────────────────────────────────────────────────────────────────
export const archiveExcessOnDowngrade = mutation({
  args: { newPlan: v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime')) },
  returns: v.number(),
  handler: async (ctx, { newPlan }) => {
    const user = await getAuthUser(ctx);
    const limit = PLAN_LIMITS[newPlan].maxGoals;
    const activeGoals = await ctx.db
      .query('goals')
      .withIndex('by_userId_status', (q) => q.eq('userId', user._id).eq('status', 'in_progress'))
      .collect();
    if (activeGoals.length <= limit) return 0;
    // Sort by creation time, keep the most recent 'limit' goals active
    const toArchive = activeGoals
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(limit);
    for (const goal of toArchive) {
      await ctx.db.patch(goal._id, { status: 'paused', archivedByDowngrade: true, updatedAt: Date.now() });
    }
    return toArchive.length;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// RESTORE ARCHIVED GOALS ON UPGRADE
// ─────────────────────────────────────────────────────────────────────────────
export const restoreArchivedOnUpgrade = mutation({
  args: { newPlan: v.union(v.literal('pro'), v.literal('lifetime')) },
  returns: v.number(),
  handler: async (ctx, { newPlan }) => {
    const user = await getAuthUser(ctx);
    const limit = PLAN_LIMITS[newPlan].maxGoals;
    const archivedGoals = await ctx.db
      .query('goals')
      .withIndex('by_userId_archivedByDowngrade', (q) => q.eq('userId', user._id).eq('archivedByDowngrade', true))
      .collect();
    // Fetch the current active goal count once, then track it locally to avoid
    // an N+1 query pattern (one DB read per loop iteration).
    const currentlyActiveGoals = await ctx.db
      .query('goals')
      .withIndex('by_userId_status', (q) => q.eq('userId', user._id).eq('status', 'in_progress'))
      .collect();
    let activeGoalCount = currentlyActiveGoals.length;
    let restored = 0;
    for (const goal of archivedGoals) {
      if (activeGoalCount >= limit) break;
      await ctx.db.patch(goal._id, { status: 'in_progress', archivedByDowngrade: false, updatedAt: Date.now() });
      activeGoalCount++;
      restored++;
    }
    return restored;
  },
});

// Internal helper mutations (internal-only) so other Convex functions can reuse
// the centralized archive/restore behavior.
export const archiveExcessOnDowngradeInternal = internalMutation({
  args: { newPlan: v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime')) },
  returns: v.number(),
  handler: async (ctx, { newPlan }) => {
    const user = await getAuthUser(ctx);
    const limit = PLAN_LIMITS[newPlan].maxGoals;
    const activeGoals = await ctx.db
      .query('goals')
      .withIndex('by_userId_status', (q) => q.eq('userId', user._id).eq('status', 'in_progress'))
      .collect();
    if (activeGoals.length <= limit) return 0;
    const toArchive = activeGoals.sort((a, b) => b.createdAt - a.createdAt).slice(limit);
    for (const goal of toArchive) {
      await ctx.db.patch(goal._id, { status: 'paused', archivedByDowngrade: true, updatedAt: Date.now() });
    }
    return toArchive.length;
  },
});

export const restoreArchivedOnUpgradeInternal = internalMutation({
  args: { newPlan: v.union(v.literal('pro'), v.literal('lifetime')) },
  returns: v.number(),
  handler: async (ctx, { newPlan }) => {
    const user = await getAuthUser(ctx);
    const limit = PLAN_LIMITS[newPlan].maxGoals;
    const archivedGoals = await ctx.db
      .query('goals')
      .withIndex('by_userId_archivedByDowngrade', (q) => q.eq('userId', user._id).eq('archivedByDowngrade', true))
      .collect();
    // Fetch the current active goal count once, then track it locally to avoid
    // an N+1 query pattern (one DB read per loop iteration).
    const currentlyActiveGoals = await ctx.db
      .query('goals')
      .withIndex('by_userId_status', (q) => q.eq('userId', user._id).eq('status', 'in_progress'))
      .collect();
    let activeGoalCount = currentlyActiveGoals.length;
    let restored = 0;
    for (const goal of archivedGoals) {
      if (activeGoalCount >= limit) break;
      await ctx.db.patch(goal._id, { status: 'in_progress', archivedByDowngrade: false, updatedAt: Date.now() });
      activeGoalCount++;
      restored++;
    }
    return restored;
  },
});
// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Goals Engine (Convex)
// Hierarchical goals with AI decomposition support
// ═══════════════════════════════════════════════════════════════════════════════

// mutation/query/v already imported above

const PLAN_LIMITS = {
  free: { maxGoals: 3 },
  pro: { maxGoals: Infinity },
  lifetime: { maxGoals: Infinity },
} as const;

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
// CREATE GOAL (enhanced with decomposition fields)
// ─────────────────────────────────────────────────────────────────────────────
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    targetDate: v.optional(v.string()),
    startDate: v.optional(v.string()),
    identityLabel: v.optional(v.string()),
    goalType: v.optional(v.union(
      v.literal('achievement'), v.literal('transformation'), v.literal('skill'),
      v.literal('project'), v.literal('quantitative'), v.literal('maintenance'),
      v.literal('elimination'), v.literal('relationship')
    )),
    lifeDomain: v.optional(v.union(
      v.literal('health'), v.literal('career'), v.literal('finance'),
      v.literal('learning'), v.literal('relationships'), v.literal('creativity'),
      v.literal('mindfulness'), v.literal('personal_growth')
    )),
    deadlineType: v.optional(v.union(v.literal('fixed'), v.literal('flexible'), v.literal('ongoing'))),
    whyImportant: v.optional(v.string()),
    successCriteria: v.optional(v.array(v.string())),
    difficultyLevel: v.optional(v.number()),
    estimatedHours: v.optional(v.number()),
    targetValue: v.optional(v.number()),
    unit: v.optional(v.string()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    parentGoalId: v.optional(v.id('goals')),
    visionConnection: v.optional(v.string()),
  },
  returns: v.id('goals'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    return await checkAndCreateGoal(ctx, user._id, {
      title: args.title,
      description: args.description,
      category: args.category,
      targetDate: args.targetDate,
      startDate: args.startDate,
      identityLabel: args.identityLabel,
      goalType: args.goalType,
      lifeDomain: args.lifeDomain,
      deadlineType: args.deadlineType,
      whyImportant: args.whyImportant,
      successCriteria: args.successCriteria,
      difficultyLevel: args.difficultyLevel ?? 1,
      estimatedHours: args.estimatedHours,
      targetValue: args.targetValue,
      unit: args.unit,
      color: args.color,
      icon: args.icon,
      tags: args.tags,
      parentGoalId: args.parentGoalId,
      visionConnection: args.visionConnection,
    });
  },
});

// Shared goal document return validator
const goalDocValidator = v.object({
  _id: v.id('goals'),
  _creationTime: v.number(),
  userId: v.id('users'),
  title: v.string(),
  description: v.optional(v.string()),
  category: v.string(),
  status: v.union(
    v.literal('in_progress'),
    v.literal('completed'),
    v.literal('paused'),
    v.literal('abandoned'),
    v.literal('draft')
  ),
  progress: v.number(),
  targetDate: v.optional(v.string()),
  startDate: v.optional(v.string()),
  completionDate: v.optional(v.number()),
  identityLabel: v.optional(v.string()),
  aiPlan: v.optional(v.any()),
  goalType: v.optional(v.union(
    v.literal('achievement'), v.literal('transformation'), v.literal('skill'),
    v.literal('project'), v.literal('quantitative'), v.literal('maintenance'),
    v.literal('elimination'), v.literal('relationship')
  )),
  lifeDomain: v.optional(v.union(
    v.literal('health'), v.literal('career'), v.literal('finance'),
    v.literal('learning'), v.literal('relationships'), v.literal('creativity'),
    v.literal('mindfulness'), v.literal('personal_growth')
  )),
  deadlineType: v.optional(v.union(v.literal('fixed'), v.literal('flexible'), v.literal('ongoing'))),
  progressType: v.optional(v.union(v.literal('percentage'), v.literal('milestones'), v.literal('numeric_target'))),
  targetValue: v.optional(v.number()),
  currentValue: v.optional(v.number()),
  unit: v.optional(v.string()),
  decompositionStatus: v.optional(v.union(v.literal('pending'), v.literal('in_progress'), v.literal('completed'))),
  aiConfidenceScore: v.optional(v.number()),
  whyImportant: v.optional(v.string()),
  successCriteria: v.optional(v.array(v.string())),
  rewards: v.optional(v.array(v.string())),
  difficultyLevel: v.optional(v.number()),
  estimatedHours: v.optional(v.number()),
  parentGoalId: v.optional(v.id('goals')),
  tags: v.optional(v.array(v.string())),
  color: v.optional(v.string()),
  icon: v.optional(v.string()),
  visionConnection: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
  // Downgrade preservation
  archivedByDowngrade: v.optional(v.boolean()),
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST ACTIVE GOALS
// ─────────────────────────────────────────────────────────────────────────────
export const listActive = query({
  args: {},
  returns: v.array(goalDocValidator),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('goals')
      .withIndex('by_userId_status', (q: any) =>
        q.eq('userId', user._id).eq('status', 'in_progress')
      )
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST ALL GOALS
// ─────────────────────────────────────────────────────────────────────────────
export const listAll = query({
  args: {},
  returns: v.array(goalDocValidator),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('goals')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE GOAL
// ─────────────────────────────────────────────────────────────────────────────
export const update = mutation({
  args: {
    goalId: v.id('goals'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal('in_progress'),
        v.literal('completed'),
        v.literal('paused'),
        v.literal('abandoned'),
        v.literal('draft')
      )
    ),
    progress: v.optional(v.number()),
    targetDate: v.optional(v.string()),
    startDate: v.optional(v.string()),
    identityLabel: v.optional(v.string()),
    aiPlan: v.optional(v.any()),
    goalType: v.optional(v.union(
      v.literal('achievement'), v.literal('transformation'), v.literal('skill'),
      v.literal('project'), v.literal('quantitative'), v.literal('maintenance'),
      v.literal('elimination'), v.literal('relationship')
    )),
    lifeDomain: v.optional(v.union(
      v.literal('health'), v.literal('career'), v.literal('finance'),
      v.literal('learning'), v.literal('relationships'), v.literal('creativity'),
      v.literal('mindfulness'), v.literal('personal_growth')
    )),
    deadlineType: v.optional(v.union(v.literal('fixed'), v.literal('flexible'), v.literal('ongoing'))),
    progressType: v.optional(v.union(v.literal('percentage'), v.literal('milestones'), v.literal('numeric_target'))),
    targetValue: v.optional(v.number()),
    currentValue: v.optional(v.number()),
    unit: v.optional(v.string()),
    whyImportant: v.optional(v.string()),
    successCriteria: v.optional(v.array(v.string())),
    rewards: v.optional(v.array(v.string())),
    difficultyLevel: v.optional(v.number()),
    estimatedHours: v.optional(v.number()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    visionConnection: v.optional(v.string()),
    decompositionStatus: v.optional(v.union(v.literal('pending'), v.literal('in_progress'), v.literal('completed'))),
    aiConfidenceScore: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, { goalId, ...updates }) => {
    const user = await getAuthUser(ctx);
    const goal = await ctx.db.get(goalId);
    if (!goal || goal.userId !== user._id) throw new Error('Goal not found');

    const patchData: any = { ...updates, updatedAt: Date.now() };

    // Auto-set completionDate when goal is completed
    if (updates.status === 'completed' && goal.status !== 'completed') {
      patchData.completionDate = Date.now();
    }

    await ctx.db.patch(goalId, patchData);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE GOAL
// ─────────────────────────────────────────────────────────────────────────────
export const remove = mutation({
  args: { goalId: v.id('goals') },
  returns: v.null(),
  handler: async (ctx, { goalId }) => {
    const user = await getAuthUser(ctx);
    const goal = await ctx.db.get(goalId);
    if (!goal || goal.userId !== user._id) throw new Error('Goal not found');

    await ctx.db.delete(goalId);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// STORE AI DECOMPOSITION
// ─────────────────────────────────────────────────────────────────────────────
export const storeAIPlan = mutation({
  args: {
    goalId: v.id('goals'),
    aiPlan: v.any(),
    aiConfidenceScore: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, { goalId, aiPlan, aiConfidenceScore }) => {
    const user = await getAuthUser(ctx);
    const goal = await ctx.db.get(goalId);
    if (!goal || goal.userId !== user._id) throw new Error('Goal not found');

    await ctx.db.patch(goalId, {
      aiPlan,
      aiConfidenceScore,
      decompositionStatus: 'completed',
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET SINGLE GOAL (with full details)
// ─────────────────────────────────────────────────────────────────────────────
export const getById = query({
  args: { goalId: v.id('goals') },
  returns: v.union(goalDocValidator, v.null()),
  handler: async (ctx, { goalId }) => {
    const user = await getAuthUser(ctx);
    const goal = await ctx.db.get(goalId);
    if (!goal || goal.userId !== user._id) return null;
    return goal;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST GOALS BY DOMAIN
// ─────────────────────────────────────────────────────────────────────────────
export const listByDomain = query({
  args: {
    lifeDomain: v.union(
      v.literal('health'), v.literal('career'), v.literal('finance'),
      v.literal('learning'), v.literal('relationships'), v.literal('creativity'),
      v.literal('mindfulness'), v.literal('personal_growth')
    ),
  },
  returns: v.array(goalDocValidator),
  handler: async (ctx, { lifeDomain }) => {
    const user = await getAuthUser(ctx);
    const allGoals = await ctx.db
      .query('goals')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
    return allGoals.filter((g: any) => g.lifeDomain === lifeDomain);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE GOAL PROGRESS (numeric/quantitative goals)
// ─────────────────────────────────────────────────────────────────────────────
export const updateProgress = mutation({
  args: {
    goalId: v.id('goals'),
    currentValue: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, { goalId, currentValue }) => {
    const user = await getAuthUser(ctx);
    const goal = await ctx.db.get(goalId);
    if (!goal || goal.userId !== user._id) throw new Error('Goal not found');

    const patchData: any = { currentValue, updatedAt: Date.now() };

    // Auto-calculate percentage progress for numeric goals
    if (goal.targetValue && goal.targetValue > 0) {
      patchData.progress = Math.min(100, Math.round((currentValue / goal.targetValue) * 100));
    }

    // Auto-complete when target reached
    if (goal.targetValue && currentValue >= goal.targetValue && goal.status === 'in_progress') {
      patchData.status = 'completed';
      patchData.completionDate = Date.now();
    }

    await ctx.db.patch(goalId, patchData);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST GOALS ARCHIVED BY DOWNGRADE
// ─────────────────────────────────────────────────────────────────────────────
export const listArchivedByDowngrade = query({
  args: {},
  returns: v.array(goalDocValidator),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    return await ctx.db
      .query('goals')
      .withIndex('by_userId_archivedByDowngrade', (q: any) =>
        q.eq('userId', user._id).eq('archivedByDowngrade', true)
      )
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// COUNT GOALS ARCHIVED BY DOWNGRADE
// ─────────────────────────────────────────────────────────────────────────────
export const getArchivedDowngradeCount = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    const archived = await ctx.db
      .query('goals')
      .withIndex('by_userId_archivedByDowngrade', (q: any) =>
        q.eq('userId', user._id).eq('archivedByDowngrade', true)
      )
      .collect();
    return archived.length;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVATE PLAN — Creates goal + milestones + tasks from AI plan JSON
// This is the core "Plan Builder" activator. Takes a generated plan and
// materialises it into the user's dashboard as real, actionable items.
// ─────────────────────────────────────────────────────────────────────────────
export const activatePlan = mutation({
  args: {
    goalTitle: v.string(),
    goalDescription: v.optional(v.string()),
    category: v.optional(v.string()),
    totalDuration: v.optional(v.string()),
    phases: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
        estimatedDays: v.number(),
        phase: v.string(),
        subTasks: v.array(v.string()),
      })
    ),
    // Optional: also create habits related to this plan
    habits: v.optional(v.array(
      v.object({
        title: v.string(),
        description: v.optional(v.string()),
        category: v.optional(v.string()),
        frequency: v.optional(v.union(
          v.literal('daily'), v.literal('weekdays'), v.literal('weekends'),
          v.literal('3x_week'), v.literal('weekly'), v.literal('custom'),
        )),
        timeOfDay: v.optional(v.union(
          v.literal('morning'), v.literal('afternoon'),
          v.literal('evening'), v.literal('anytime'),
        )),
        estimatedMinutes: v.optional(v.number()),
      })
    )),
  },
  returns: v.object({
    goalId: v.id('goals'),
    milestoneIds: v.array(v.id('milestones')),
    taskIds: v.array(v.id('tasks')),
    habitIds: v.array(v.id('habits')),
  }),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const now = Date.now();

    // 1. Create the main goal
    const goalId = await checkAndCreateGoal(ctx, user._id, {
      title: args.goalTitle,
      description: args.goalDescription || `AI-generated plan: ${args.totalDuration || 'flexible timeline'}`,
      category: args.category || 'personal_growth',
      targetDate: args.totalDuration ? estimateTargetDate(args.totalDuration) : undefined,
      startDate: new Date().toISOString().split('T')[0],
      goalType: 'project',
      deadlineType: 'flexible',
      decompositionStatus: 'completed',
      progressType: 'milestones',
      difficultyLevel: Math.min(10, Math.max(1, args.phases.length)),
      estimatedHours: args.phases.reduce((sum, p) => sum + p.estimatedDays * 2, 0),
      tags: ['plan-builder', 'ai-generated'],
      aiPlan: {
        totalDuration: args.totalDuration,
        phases: args.phases,
        activatedAt: now,
      },
    });

    // 2. Create milestones from phases
    const milestoneIds: any[] = [];
    let dayOffset = 0;

    for (let i = 0; i < args.phases.length; i++) {
      const phase = args.phases[i];
      const targetDate = new Date(now + (dayOffset + phase.estimatedDays) * 86400000)
        .toISOString().split('T')[0];

      const milestoneId = await ctx.db.insert('milestones', {
        userId: user._id,
        goalId,
        title: `${phase.phase}: ${phase.title}`,
        description: phase.description,
        sequenceOrder: i + 1,
        targetDate,
        status: i === 0 ? 'in_progress' : 'not_started',
        progressPercentage: 0,
        completionCriteria: phase.subTasks,
        tags: ['plan-builder'],
        createdAt: now,
        updatedAt: now,
      });

      milestoneIds.push(milestoneId);
      dayOffset += phase.estimatedDays;
    }

    // 3. Create tasks from each phase's sub-tasks
    const taskIds: any[] = [];
    dayOffset = 0;

    for (let i = 0; i < args.phases.length; i++) {
      const phase = args.phases[i];
      const daysPerTask = Math.max(1, Math.floor(phase.estimatedDays / phase.subTasks.length));

      for (let j = 0; j < phase.subTasks.length; j++) {
        const taskDueDate = new Date(now + (dayOffset + (j + 1) * daysPerTask) * 86400000)
          .toISOString().split('T')[0];

        // First task of first phase is scheduled for today
        const scheduledDate = (i === 0 && j === 0)
          ? new Date().toISOString().split('T')[0]
          : taskDueDate;

        const priority = i === 0 ? 'high' : (i === 1 ? 'medium' : 'low');

        const taskId = await ctx.db.insert('tasks', {
          userId: user._id,
          goalId,
          milestoneId: milestoneIds[i],
          title: phase.subTasks[j],
          description: `Part of ${phase.phase}: ${phase.title}`,
          priority,
          status: 'todo',
          dueDate: taskDueDate,
          scheduledDate,
          estimatedMinutes: Math.round((phase.estimatedDays * 120) / phase.subTasks.length),
          tags: ['plan-builder', phase.phase.toLowerCase().replace(/\s+/g, '-')],
          subtasks: [],
          source: 'ai_generated',
          xpValue: priority === 'high' ? 15 : (priority === 'medium' ? 10 : 5),
          createdAt: now,
          updatedAt: now,
        });

        taskIds.push(taskId);
      }

      dayOffset += phase.estimatedDays;
    }

    // 4. Create habits if provided
    const habitIds: any[] = [];
    if (args.habits && args.habits.length > 0) {
      for (const habit of args.habits) {
        try {
          const habitId = await checkAndCreateHabit(ctx, user._id, {
            title: habit.title,
            description: habit.description || `Supporting habit for: ${args.goalTitle}`,
            category: habit.category || args.category || 'productivity',
            frequency: habit.frequency || 'daily',
            timeOfDay: habit.timeOfDay || 'morning',
            estimatedMinutes: habit.estimatedMinutes || 15,
            goalId,
            habitType: 'yes_no',
          });
          habitIds.push(habitId);
        } catch {
          // Skip if plan limit reached — don't fail the whole activation
        }
      }
    }

    return { goalId, milestoneIds, taskIds, habitIds };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// AUTO-GENERATE DASHBOARD ITEMS FROM ONBOARDING
// Creates smart tasks + habits based on the user's onboarding answers
// ─────────────────────────────────────────────────────────────────────────────
export const autoGenerateFromOnboarding = mutation({
  args: {
    goalTitle: v.string(),
    goalReason: v.optional(v.string()),
    goalDeadline: v.optional(v.string()),
    focusAreas: v.optional(v.array(v.string())),
    preferredTime: v.optional(v.string()),
  },
  returns: v.object({
    goalId: v.id('goals'),
    taskIds: v.array(v.id('tasks')),
    milestoneIds: v.array(v.id('milestones')),
  }),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const now = Date.now();

    // Map deadline to target date
    const deadlineMap: Record<string, number> = {
      '1m': 30, '3m': 90, '6m': 180, '1y': 365,
    };
    const daysUntilDeadline = deadlineMap[args.goalDeadline || '6m'] || 180;
    const targetDate = new Date(now + daysUntilDeadline * 86400000).toISOString().split('T')[0];

    // Determine category from focus areas
    const focusToCategoryMap: Record<string, string> = {
      'habits': 'personal_growth',
      'goals': 'personal_growth',
      'health': 'health',
      'productivity': 'career',
      'learning': 'learning',
      'wellness': 'mindfulness',
    };
    const category = args.focusAreas?.[0]
      ? (focusToCategoryMap[args.focusAreas[0]] || 'personal_growth')
      : 'personal_growth';

    // 1. Create the primary goal
    const goalId = await checkAndCreateGoal(ctx, user._id, {
      title: args.goalTitle,
      description: args.goalReason || undefined,
      category,
      targetDate,
      startDate: new Date().toISOString().split('T')[0],
      deadlineType: args.goalDeadline === 'ongoing' ? 'ongoing' : 'flexible',
      whyImportant: args.goalReason || undefined,
      goalType: 'achievement',
      decompositionStatus: 'completed',
      progressType: 'milestones',
      tags: ['onboarding', 'auto-generated'],
    });

    // 2. Generate smart milestones based on the goal
    const milestoneTemplates = generateSmartMilestones(
      args.goalTitle,
      daysUntilDeadline,
      args.focusAreas || [],
    );

    const milestoneIds: any[] = [];
    for (let i = 0; i < milestoneTemplates.length; i++) {
      const ms = milestoneTemplates[i];
      const msTargetDate = new Date(now + ms.dayOffset * 86400000).toISOString().split('T')[0];

      const milestoneId = await ctx.db.insert('milestones', {
        userId: user._id,
        goalId,
        title: ms.title,
        description: ms.description,
        sequenceOrder: i + 1,
        targetDate: msTargetDate,
        status: i === 0 ? 'in_progress' : 'not_started',
        progressPercentage: 0,
        completionCriteria: ms.criteria,
        tags: ['onboarding'],
        createdAt: now,
        updatedAt: now,
      });
      milestoneIds.push(milestoneId);
    }

    // 3. Generate starter tasks for week 1
    const starterTasks = generateStarterTasks(args.goalTitle, args.focusAreas || [], args.preferredTime);
    const taskIds: any[] = [];

    for (let i = 0; i < starterTasks.length; i++) {
      const task = starterTasks[i];
      const taskDate = new Date(now + task.dayOffset * 86400000).toISOString().split('T')[0];

      const taskId = await ctx.db.insert('tasks', {
        userId: user._id,
        goalId,
        milestoneId: milestoneIds[0] || undefined,
        title: task.title,
        description: task.description,
        priority: task.priority as 'high' | 'medium' | 'low',
        status: 'todo',
        dueDate: taskDate,
        scheduledDate: taskDate,
        estimatedMinutes: task.estimatedMinutes,
        tags: ['onboarding', 'starter'],
        subtasks: [],
        source: 'ai_generated',
        xpValue: task.priority === 'high' ? 15 : 10,
        createdAt: now,
        updatedAt: now,
      });
      taskIds.push(taskId);
    }

    return { goalId, taskIds, milestoneIds };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Estimate target date from "X weeks/months" string
// ─────────────────────────────────────────────────────────────────────────────
function estimateTargetDate(duration: string): string {
  const now = Date.now();
  const lower = duration.toLowerCase();
  const numMatch = lower.match(/(\d+)/);
  const num = numMatch ? parseInt(numMatch[1]) : 8;

  let days = 56; // default ~8 weeks
  if (lower.includes('week')) days = num * 7;
  else if (lower.includes('month')) days = num * 30;
  else if (lower.includes('year')) days = num * 365;
  else if (lower.includes('day')) days = num;

  return new Date(now + days * 86400000).toISOString().split('T')[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Generate smart milestones from goal text + deadline
// ─────────────────────────────────────────────────────────────────────────────
function generateSmartMilestones(
  goalTitle: string,
  totalDays: number,
  focusAreas: string[],
): Array<{ title: string; description: string; dayOffset: number; criteria: string[] }> {
  const goal = goalTitle.toLowerCase();
  const quarterDays = Math.round(totalDays / 4);

  // Fitness-related goals
  if (goal.includes('fit') || goal.includes('weight') || goal.includes('gym') || goal.includes('run') || goal.includes('exercise') || focusAreas.includes('health')) {
    return [
      { title: 'Foundation — Build the Routine', description: 'Establish a consistent exercise schedule and basic nutrition plan', dayOffset: quarterDays, criteria: ['Exercise 3+ times per week', 'Track meals for 1 full week', 'Set baseline measurements'] },
      { title: 'Momentum — Increase Intensity', description: 'Ramp up workouts and dial in nutrition', dayOffset: quarterDays * 2, criteria: ['Increase workout frequency or intensity', 'Hit protein targets consistently', 'Complete 2 weeks without missing'] },
      { title: 'Breakthrough — Push Limits', description: 'Challenge yourself with harder goals', dayOffset: quarterDays * 3, criteria: ['Set a personal record', 'Try a new workout type', 'Meal prep for a full week'] },
      { title: 'Transformation — Lock In Results', description: 'Solidify habits and measure progress', dayOffset: totalDays, criteria: ['Compare before/after measurements', 'Build a sustainable routine', 'Celebrate your progress'] },
    ];
  }

  // Business/career goals
  if (goal.includes('business') || goal.includes('launch') || goal.includes('startup') || goal.includes('saas') || goal.includes('career') || goal.includes('job') || focusAreas.includes('productivity')) {
    return [
      { title: 'Research & Validation', description: 'Validate the idea and understand the market', dayOffset: quarterDays, criteria: ['Research 5+ competitors', 'Talk to 3+ potential users', 'Define your unique value prop'] },
      { title: 'Build & Create', description: 'Create the minimum viable version', dayOffset: quarterDays * 2, criteria: ['Build MVP or first draft', 'Get 3+ pieces of feedback', 'Iterate on core feature'] },
      { title: 'Launch & Distribute', description: 'Put it out into the world', dayOffset: quarterDays * 3, criteria: ['Launch publicly', 'Share on 3+ channels', 'Get first users/customers'] },
      { title: 'Grow & Optimize', description: 'Learn from data and scale', dayOffset: totalDays, criteria: ['Analyze metrics', 'Fix top 3 issues', 'Plan next growth sprint'] },
    ];
  }

  // Learning goals
  if (goal.includes('learn') || goal.includes('read') || goal.includes('study') || goal.includes('language') || goal.includes('book') || focusAreas.includes('learning')) {
    return [
      { title: 'Foundations', description: 'Build baseline knowledge and set up a study system', dayOffset: quarterDays, criteria: ['Complete introductory material', 'Set up note-taking system', 'Study 5+ days in first 2 weeks'] },
      { title: 'Deep Practice', description: 'Move from consuming to applying', dayOffset: quarterDays * 2, criteria: ['Complete a practice project', 'Teach a concept to someone', 'Identify knowledge gaps'] },
      { title: 'Advanced Application', description: 'Tackle harder material and build real skills', dayOffset: quarterDays * 3, criteria: ['Complete an advanced project', 'Contribute to a community', 'Get feedback on your work'] },
      { title: 'Mastery & Sharing', description: 'Solidify learning by teaching and creating', dayOffset: totalDays, criteria: ['Create a portfolio piece', 'Help someone else learn', 'Plan your next learning goal'] },
    ];
  }

  // Financial goals
  if (goal.includes('save') || goal.includes('money') || goal.includes('invest') || goal.includes('budget') || goal.includes('finance') || focusAreas.includes('goals')) {
    return [
      { title: 'Financial Clarity', description: 'Understand your current financial position', dayOffset: quarterDays, criteria: ['Track all expenses for 2 weeks', 'Calculate net worth', 'Set specific savings target'] },
      { title: 'System Setup', description: 'Build automated systems for saving/investing', dayOffset: quarterDays * 2, criteria: ['Set up automatic transfers', 'Open investment account if needed', 'Create monthly budget'] },
      { title: 'Accelerate', description: 'Find ways to increase income or reduce spending', dayOffset: quarterDays * 3, criteria: ['Eliminate 2+ unnecessary expenses', 'Explore 1 new income source', 'Review and optimize investments'] },
      { title: 'Secure & Grow', description: 'Lock in financial habits for the long term', dayOffset: totalDays, criteria: ['Build 1-month emergency fund', 'Automate all bills', 'Plan next financial goal'] },
    ];
  }

  // Generic goal (catch-all)
  return [
    { title: 'Clarify & Plan', description: `Define what success looks like for: ${goalTitle}`, dayOffset: quarterDays, criteria: ['Write down specific success criteria', 'Identify 3 potential obstacles', 'Find 1 mentor or resource'] },
    { title: 'Build Momentum', description: 'Take consistent daily action toward your goal', dayOffset: quarterDays * 2, criteria: ['Complete first major milestone', 'Track progress daily for 2 weeks', 'Adjust strategy based on results'] },
    { title: 'Push Through Resistance', description: 'Overcome the plateau and keep going', dayOffset: quarterDays * 3, criteria: ['Identify and address biggest blocker', 'Get feedback from someone you trust', 'Recommit to daily action'] },
    { title: 'Achieve & Reflect', description: 'Cross the finish line and plan what comes next', dayOffset: totalDays, criteria: ['Evaluate results vs original goal', 'Document lessons learned', 'Set your next goal'] },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Generate starter tasks for week 1
// ─────────────────────────────────────────────────────────────────────────────
function generateStarterTasks(
  goalTitle: string,
  focusAreas: string[],
  _preferredTime?: string,
): Array<{ title: string; description: string; priority: string; dayOffset: number; estimatedMinutes: number }> {
  const goal = goalTitle.toLowerCase();
  const tasks: Array<{ title: string; description: string; priority: string; dayOffset: number; estimatedMinutes: number }> = [];

  // Universal: first task is always "Define your success criteria"
  tasks.push({
    title: `Define exactly what "${goalTitle}" looks like when done`,
    description: 'Write down 3 specific, measurable criteria that mean you\'ve achieved this goal. Be precise — "I want to feel better" is vague, "I can run 5K in 30 minutes" is clear.',
    priority: 'high',
    dayOffset: 0, // Today
    estimatedMinutes: 15,
  });

  // Goal-specific starter tasks
  if (goal.includes('fit') || goal.includes('weight') || goal.includes('gym') || goal.includes('run') || goal.includes('exercise') || focusAreas.includes('health')) {
    tasks.push(
      { title: 'Take "before" measurements & photos', description: 'Weigh yourself, measure waist/chest/arms, take a front & side photo. You\'ll thank yourself later.', priority: 'high', dayOffset: 0, estimatedMinutes: 10 },
      { title: 'Plan your first 3 workouts this week', description: 'Decide exactly what exercises you\'ll do and when. Put them in your calendar like appointments.', priority: 'high', dayOffset: 0, estimatedMinutes: 20 },
      { title: 'Complete your first workout', description: 'Just show up and move. Intensity doesn\'t matter on day 1 — consistency does.', priority: 'high', dayOffset: 1, estimatedMinutes: 45 },
      { title: 'Prep healthy meals for tomorrow', description: 'Cook or plan meals for tomorrow. Remove the "what should I eat?" decision fatigue.', priority: 'medium', dayOffset: 1, estimatedMinutes: 30 },
      { title: 'Track everything you eat today', description: 'Log your meals in the nutrition tracker. No judgement — just awareness.', priority: 'medium', dayOffset: 2, estimatedMinutes: 10 },
      { title: 'Second workout of the week', description: 'Follow through on your plan. You\'re building the identity of someone who exercises regularly.', priority: 'high', dayOffset: 3, estimatedMinutes: 45 },
      { title: 'Review week 1 & plan week 2', description: 'What worked? What didn\'t? Adjust your plan for next week.', priority: 'medium', dayOffset: 6, estimatedMinutes: 15 },
    );
  } else if (goal.includes('business') || goal.includes('launch') || goal.includes('startup') || goal.includes('saas') || goal.includes('job') || focusAreas.includes('productivity')) {
    tasks.push(
      { title: 'Write down your business idea in one sentence', description: 'Can you explain it to a 10-year-old? If not, simplify. Clarity is power.', priority: 'high', dayOffset: 0, estimatedMinutes: 15 },
      { title: 'Research 3 competitors doing something similar', description: 'Study their pricing, messaging, and reviews. What gaps do they leave?', priority: 'high', dayOffset: 1, estimatedMinutes: 45 },
      { title: 'List your first 10 potential customers by name', description: 'Real people or companies. Not "everyone" — specific names you could contact.', priority: 'high', dayOffset: 2, estimatedMinutes: 20 },
      { title: 'Talk to 1 potential customer today', description: 'Ask them about their problem, NOT your solution. Listen more than you talk.', priority: 'high', dayOffset: 3, estimatedMinutes: 30 },
      { title: 'Define your MVP — absolute minimum to launch', description: 'What\'s the smallest thing you can build that delivers value? Strip everything else.', priority: 'medium', dayOffset: 4, estimatedMinutes: 30 },
      { title: 'Set up your workspace and tools', description: 'Get your dev environment, Notion/Trello, domain, and accounts ready. Remove friction.', priority: 'medium', dayOffset: 5, estimatedMinutes: 60 },
      { title: 'Write and ship your first piece of content', description: 'Blog post, tweet thread, or short video about the problem you\'re solving.', priority: 'medium', dayOffset: 6, estimatedMinutes: 45 },
    );
  } else if (goal.includes('learn') || goal.includes('read') || goal.includes('study') || goal.includes('language') || goal.includes('book') || focusAreas.includes('learning')) {
    tasks.push(
      { title: 'Find the best beginner resource for your topic', description: 'Research courses, books, or tutorials. Pick ONE to start with — don\'t collect, consume.', priority: 'high', dayOffset: 0, estimatedMinutes: 20 },
      { title: 'Complete the first lesson or chapter', description: 'Take notes as you go. Write down 3 key takeaways.', priority: 'high', dayOffset: 1, estimatedMinutes: 30 },
      { title: 'Set up a note-taking system', description: 'Create a dedicated notebook, Notion page, or folder. Structure it for easy retrieval later.', priority: 'medium', dayOffset: 1, estimatedMinutes: 15 },
      { title: 'Study session #2', description: 'Continue your course/book. The compound effect of daily practice is extraordinary.', priority: 'high', dayOffset: 2, estimatedMinutes: 30 },
      { title: 'Try to apply what you learned', description: 'Build something small, solve a problem, or explain a concept to someone.', priority: 'medium', dayOffset: 3, estimatedMinutes: 30 },
      { title: 'Join a community of learners', description: 'Find a subreddit, Discord, or study group for your topic. Learning accelerates with peers.', priority: 'low', dayOffset: 4, estimatedMinutes: 15 },
      { title: 'Week 1 review: What stuck & what didn\'t?', description: 'Review your notes. Summarise the 5 most important things you learned this week.', priority: 'medium', dayOffset: 6, estimatedMinutes: 20 },
    );
  } else {
    // Generic tasks
    tasks.push(
      { title: 'Write down 3 obstacles that could stop you', description: 'Be honest about what might derail you. Then write a "if X happens, I will Y" plan for each.', priority: 'high', dayOffset: 0, estimatedMinutes: 15 },
      { title: 'Find someone who has achieved this goal', description: 'Research their journey. What can you learn from their approach?', priority: 'medium', dayOffset: 1, estimatedMinutes: 20 },
      { title: 'Take your first real action step', description: 'Not planning, not researching — DOING. Even 15 minutes of real action beats hours of planning.', priority: 'high', dayOffset: 1, estimatedMinutes: 30 },
      { title: 'Set up a daily check-in reminder', description: 'Use Resurgo\'s reminder system. Consistency beats intensity every time.', priority: 'medium', dayOffset: 2, estimatedMinutes: 5 },
      { title: 'Tell someone about your goal', description: 'Accountability is powerful. Share your goal with someone you respect.', priority: 'medium', dayOffset: 3, estimatedMinutes: 10 },
      { title: 'Review your first week of progress', description: 'What worked? What\'s harder than expected? Adjust your approach.', priority: 'medium', dayOffset: 6, estimatedMinutes: 15 },
    );
  }

  return tasks;
}
