import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const logEvent = mutation({
  args: {
    event: v.string(),
    path: v.union(v.string(), v.null()),
    properties: v.optional(v.any()),
    sessionId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert('marketingEvents', {
      event: args.event,
      path: args.path,
      properties: args.properties,
      sessionId: args.sessionId,
      createdAt: Date.now(),
    });
    return null;
  },
});

export const getLiveStats = query({
  args: {},
  returns: v.object({
    totalUsers: v.number(),
    tasksCompleted: v.number(),
    brainDumpsProcessed: v.number(),
  }),
  handler: async (ctx) => {
    const [users, tasks, coachMessages] = await Promise.all([
      ctx.db.query('users').collect(),
      ctx.db.query('tasks').collect(),
      ctx.db.query('coachMessages').collect(),
    ]);

    const totalUsers = users.length;
    const tasksCompleted = tasks.filter((task) => task.status === 'done').length;
    const brainDumpsProcessed = coachMessages.filter(
      (message) => message.role === 'user' && message.content.length > 120
    ).length;

    return {
      totalUsers,
      tasksCompleted,
      brainDumpsProcessed,
    };
  },
});