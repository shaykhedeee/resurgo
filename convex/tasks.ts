// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Tasks Engine (Convex)
// TickTick-style task management with goal/milestone linking & Eisenhower matrix
// ═══════════════════════════════════════════════════════════════════════════════

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

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

// Shared task document validator
const taskDocValidator = v.object({
  _id: v.id('tasks'),
  _creationTime: v.number(),
  userId: v.id('users'),
  listId: v.optional(v.id('taskLists')),
  goalId: v.optional(v.id('goals')),
  milestoneId: v.optional(v.id('milestones')),
  parentTaskId: v.optional(v.id('tasks')),
  title: v.string(),
  description: v.optional(v.string()),
  notes: v.optional(v.string()),
  priority: v.union(
    v.literal('low'),
    v.literal('medium'),
    v.literal('high'),
    v.literal('urgent')
  ),
  status: v.union(v.literal('todo'), v.literal('in_progress'), v.literal('done')),
  dueDate: v.optional(v.string()),
  dueTime: v.optional(v.string()),
  scheduledDate: v.optional(v.string()),
  estimatedMinutes: v.optional(v.number()),
  actualMinutes: v.optional(v.number()),
  eisenhowerQuadrant: v.optional(v.union(
    v.literal('urgent_important'),
    v.literal('important'),
    v.literal('urgent'),
    v.literal('neither')
  )),
  energyRequired: v.optional(v.union(
    v.literal('low'),
    v.literal('medium'),
    v.literal('high')
  )),
  tags: v.optional(v.array(v.string())),
  subtasks: v.optional(
    v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        completed: v.boolean(),
      })
    )
  ),
  isRecurring: v.optional(v.boolean()),
  recurrenceRule: v.optional(v.object({
    frequency: v.union(
      v.literal('daily'),
      v.literal('weekly'),
      v.literal('monthly')
    ),
    interval: v.number(),
    daysOfWeek: v.optional(v.array(v.number())),
  })),
  source: v.optional(v.union(
    v.literal('manual'),
    v.literal('ai_generated'),
    v.literal('recurring'),
    v.literal('decomposition'),
    v.literal('imported'),
    v.literal('telegram')
  )),
  xpValue: v.optional(v.number()),
  context: v.optional(v.array(v.string())),
  isPinned: v.optional(v.boolean()),
  completedAt: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

// ─────────────────────────────────────────────────────────────────────────────
// CREATE TASK (enhanced with goal linking & Eisenhower)
// ─────────────────────────────────────────────────────────────────────────────
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    notes: v.optional(v.string()),
    priority: v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high'),
      v.literal('urgent')
    ),
    dueDate: v.optional(v.string()),
    dueTime: v.optional(v.string()),
    scheduledDate: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    listId: v.optional(v.id('taskLists')),
    goalId: v.optional(v.id('goals')),
    milestoneId: v.optional(v.id('milestones')),
    parentTaskId: v.optional(v.id('tasks')),
    eisenhowerQuadrant: v.optional(v.union(
      v.literal('urgent_important'),
      v.literal('important'),
      v.literal('urgent'),
      v.literal('neither')
    )),
    energyRequired: v.optional(v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high')
    )),
    isRecurring: v.optional(v.boolean()),
    recurrenceRule: v.optional(v.object({
      frequency: v.union(
        v.literal('daily'),
        v.literal('weekly'),
        v.literal('monthly')
      ),
      interval: v.number(),
      daysOfWeek: v.optional(v.array(v.number())),
    })),
    source: v.optional(v.union(
      v.literal('manual'),
      v.literal('ai_generated'),
      v.literal('recurring'),
      v.literal('decomposition'),
      v.literal('imported'),
      v.literal('telegram')
    )),
    xpValue: v.optional(v.number()),
    context: v.optional(v.array(v.string())),
    isPinned: v.optional(v.boolean()),
  },
  returns: v.id('tasks'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Calculate XP value based on priority if not provided
    const xpValue = args.xpValue ?? (
      args.priority === 'urgent' ? 20 :
      args.priority === 'high' ? 15 :
      args.priority === 'medium' ? 10 : 5
    );

    return await ctx.db.insert('tasks', {
      userId: user._id,
      listId: args.listId,
      goalId: args.goalId,
      milestoneId: args.milestoneId,
      parentTaskId: args.parentTaskId,
      title: args.title,
      description: args.description,
      notes: args.notes,
      priority: args.priority,
      status: 'todo',
      dueDate: args.dueDate,
      dueTime: args.dueTime,
      scheduledDate: args.scheduledDate,
      estimatedMinutes: args.estimatedMinutes,
      tags: args.tags,
      subtasks: [],
      eisenhowerQuadrant: args.eisenhowerQuadrant,
      energyRequired: args.energyRequired,
      isRecurring: args.isRecurring,
      recurrenceRule: args.recurrenceRule,
      source: args.source ?? 'manual',
      xpValue,
      context: args.context,
      isPinned: args.isPinned,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST TASKS (with optional filters)
// ─────────────────────────────────────────────────────────────────────────────
export const list = query({
  args: {
    status: v.optional(v.union(v.literal('todo'), v.literal('in_progress'), v.literal('done'))),
  },
  returns: v.array(taskDocValidator),
  handler: async (ctx, { status }) => {
    const user = await getAuthUser(ctx);

    if (status) {
      return await ctx.db
        .query('tasks')
        .withIndex('by_userId_status', (q: any) =>
          q.eq('userId', user._id).eq('status', status)
        )
        .collect();
    }

    return await ctx.db
      .query('tasks')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST TASKS BY GOAL
// ─────────────────────────────────────────────────────────────────────────────
export const listByGoal = query({
  args: { goalId: v.id('goals') },
  returns: v.array(taskDocValidator),
  handler: async (ctx, { goalId }) => {
    const user = await getAuthUser(ctx);
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
    return tasks.filter((t: any) => t.goalId === goalId);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST TASKS BY SCHEDULED DATE (for daily planning)
// ─────────────────────────────────────────────────────────────────────────────
export const listByDate = query({
  args: { date: v.string() },
  returns: v.array(taskDocValidator),
  handler: async (ctx, { date }) => {
    const user = await getAuthUser(ctx);
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
    return tasks.filter((t: any) =>
      t.scheduledDate === date || t.dueDate === date
    );
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST PINNED TASKS
// ─────────────────────────────────────────────────────────────────────────────
export const listPinned = query({
  args: {},
  returns: v.array(taskDocValidator),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_userId_status', (q: any) =>
        q.eq('userId', user._id).eq('status', 'todo')
      )
      .collect();
    return tasks.filter((t: any) => t.isPinned === true);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE TASK COMPLETE
// ─────────────────────────────────────────────────────────────────────────────
export const toggleComplete = mutation({
  args: { taskId: v.id('tasks') },
  returns: v.object({
    status: v.string(),
  }),
  handler: async (ctx, { taskId }) => {
    const user = await getAuthUser(ctx);
    const task = await ctx.db.get(taskId);
    if (!task || task.userId !== user._id) throw new Error('Task not found');

    const newStatus = task.status === 'done' ? 'todo' : 'done';

    await ctx.db.patch(taskId, {
      status: newStatus,
      completedAt: newStatus === 'done' ? Date.now() : undefined,
      updatedAt: Date.now(),
    });

    // Award XP for completion via gamification engine
    if (newStatus === 'done') {
      const gamification = await ctx.db
        .query('gamification')
        .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
        .unique();

      if (gamification) {
        const xpGain = task.xpValue ??
          (task.priority === 'urgent' ? 25 : task.priority === 'high' ? 15 : task.priority === 'medium' ? 10 : 5);
        const newXP = gamification.totalXP + xpGain;
        const newLevel = calculateLevel(newXP);
        const newCoins = (gamification.coins ?? 0) + Math.ceil(xpGain * 0.1);
        await ctx.db.patch(gamification._id, {
          totalXP: newXP,
          level: newLevel,
          coins: newCoins,
          totalTasksCompleted: (gamification.totalTasksCompleted ?? 0) + 1,
          updatedAt: Date.now(),
        });

        // Log XP history
        await ctx.db.insert('xpHistory', {
          userId: user._id,
          amount: xpGain,
          source: 'task_complete',
          description: `Completed: ${task.title}`,
          createdAt: Date.now(),
        });
      }
    }

    return { status: newStatus };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE TASK (enhanced with all new fields)
// ─────────────────────────────────────────────────────────────────────────────
export const update = mutation({
  args: {
    taskId: v.id('tasks'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    notes: v.optional(v.string()),
    priority: v.optional(
      v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('urgent'))
    ),
    status: v.optional(v.union(v.literal('todo'), v.literal('in_progress'), v.literal('done'))),
    dueDate: v.optional(v.string()),
    dueTime: v.optional(v.string()),
    scheduledDate: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    actualMinutes: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    subtasks: v.optional(
      v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          completed: v.boolean(),
        })
      )
    ),
    goalId: v.optional(v.id('goals')),
    milestoneId: v.optional(v.id('milestones')),
    parentTaskId: v.optional(v.id('tasks')),
    eisenhowerQuadrant: v.optional(v.union(
      v.literal('urgent_important'),
      v.literal('important'),
      v.literal('urgent'),
      v.literal('neither')
    )),
    energyRequired: v.optional(v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high')
    )),
    context: v.optional(v.array(v.string())),
    isPinned: v.optional(v.boolean()),
    xpValue: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, { taskId, ...updates }) => {
    const user = await getAuthUser(ctx);
    const task = await ctx.db.get(taskId);
    if (!task || task.userId !== user._id) throw new Error('Task not found');

    await ctx.db.patch(taskId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE TASK
// ─────────────────────────────────────────────────────────────────────────────
export const remove = mutation({
  args: { taskId: v.id('tasks') },
  returns: v.null(),
  handler: async (ctx, { taskId }) => {
    const user = await getAuthUser(ctx);
    const task = await ctx.db.get(taskId);
    if (!task || task.userId !== user._id) throw new Error('Task not found');

    await ctx.db.delete(taskId);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// TASK LISTS (CRUD)
// ─────────────────────────────────────────────────────────────────────────────
export const createList = mutation({
  args: {
    name: v.string(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  returns: v.id('taskLists'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await ctx.db.insert('taskLists', {
      userId: user._id,
      name: args.name,
      color: args.color,
      icon: args.icon,
      createdAt: Date.now(),
    });
  },
});

export const getLists = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('taskLists'),
      _creationTime: v.number(),
      userId: v.id('users'),
      name: v.string(),
      color: v.optional(v.string()),
      icon: v.optional(v.string()),
      order: v.optional(v.number()),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('taskLists')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// BULK CREATE TASKS (from AI decomposition or templates)
// ─────────────────────────────────────────────────────────────────────────────
export const bulkCreate = mutation({
  args: {
    tasks: v.array(v.object({
      title: v.string(),
      description: v.optional(v.string()),
      priority: v.union(
        v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('urgent')
      ),
      dueDate: v.optional(v.string()),
      scheduledDate: v.optional(v.string()),
      estimatedMinutes: v.optional(v.number()),
      goalId: v.optional(v.id('goals')),
      milestoneId: v.optional(v.id('milestones')),
      eisenhowerQuadrant: v.optional(v.union(
        v.literal('urgent_important'), v.literal('important'),
        v.literal('urgent'), v.literal('neither')
      )),
      energyRequired: v.optional(v.union(
        v.literal('low'), v.literal('medium'), v.literal('high')
      )),
      tags: v.optional(v.array(v.string())),
      xpValue: v.optional(v.number()),
    })),
  },
  returns: v.array(v.id('tasks')),
  handler: async (ctx, { tasks }) => {
    const user = await getAuthUser(ctx);
    const ids = [];
    const now = Date.now();

    for (const task of tasks) {
      const id = await ctx.db.insert('tasks', {
        userId: user._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: 'todo',
        dueDate: task.dueDate,
        scheduledDate: task.scheduledDate,
        estimatedMinutes: task.estimatedMinutes,
        goalId: task.goalId,
        milestoneId: task.milestoneId,
        eisenhowerQuadrant: task.eisenhowerQuadrant,
        energyRequired: task.energyRequired,
        tags: task.tags,
        subtasks: [],
        source: 'ai_generated',
        xpValue: task.xpValue ?? 10,
        createdAt: now,
        updatedAt: now,
      });
      ids.push(id);
    }

    return ids;
  },
});

// ───────────────────────────────────────────────────────────────────────────
// CREATE TASK FROM AI COACH (Living System)
// ───────────────────────────────────────────────────────────────────────────
export const createFromAI = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('urgent')),
    dueDate: v.optional(v.string()),
    energyRequired: v.optional(v.union(v.literal('low'), v.literal('medium'), v.literal('high'))),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.id('tasks'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const xpValue = args.priority === 'urgent' ? 20 : args.priority === 'high' ? 15 : args.priority === 'medium' ? 10 : 5;
    return await ctx.db.insert('tasks', {
      userId: user._id,
      title: args.title,
      description: args.description,
      priority: args.priority,
      status: 'todo',
      dueDate: args.dueDate,
      energyRequired: args.energyRequired,
      tags: args.tags,
      subtasks: [],
      source: 'ai_generated',
      xpValue,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// ───────────────────────────────────────────────────────────────────────────
// UPDATE TASK BY TITLE MATCH (Living System)
// ───────────────────────────────────────────────────────────────────────────
export const updateByTitle = mutation({
  args: {
    titleMatch: v.string(),
    priority: v.optional(v.union(v.literal('low'), v.literal('medium'), v.literal('high'), v.literal('urgent'))),
    dueDate: v.optional(v.string()),
    completed: v.optional(v.boolean()),
  },
  returns: v.union(v.id('tasks'), v.null()),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .filter((q: any) => q.eq(q.field('status'), 'todo'))
      .collect();

    // Fuzzy match: find task whose title contains the search string (case-insensitive)
    const needle = args.titleMatch.toLowerCase();
    const match = tasks.find((t: any) =>
      t.title.toLowerCase().includes(needle) || needle.includes(t.title.toLowerCase().slice(0, 10))
    );
    if (!match) return null;

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.priority !== undefined) patch.priority = args.priority;
    if (args.dueDate !== undefined) patch.dueDate = args.dueDate;
    if (args.completed !== undefined) patch.status = args.completed ? 'completed' : 'todo';

    await ctx.db.patch(match._id, patch);
    return match._id;
  },
});
