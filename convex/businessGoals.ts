import { v } from 'convex/values';
import { mutation, query, action } from './_generated/server';
import { api } from './_generated/api';

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function requireUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Unauthenticated');
  const user = await ctx.db
    .query('users')
    .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
    .first();
  if (!user) throw new Error('User not found');
  return user;
}

// ─── Queries ─────────────────────────────────────────────────────────────────
// ─── Businesses Queries & Mutations ──────────────────────────────────────────
export const listBusinesses = query({
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    return ctx.db
      .query('businesses')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect()
      .then((items) => items.sort((a, b) => b.createdAt - a.createdAt));
  },
});

export const createBusiness = mutation({
  args: {
    name: v.string(),
    website: v.optional(v.string()),
    description: v.optional(v.string()),
    webnessUrl: v.optional(v.string()),
    webnessKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const now = Date.now();
    return ctx.db.insert('businesses', {
      userId: user._id,
      name: args.name,
      website: args.website,
      description: args.description,
      webnessUrl: args.webnessUrl,
      webnessKey: args.webnessKey,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateBusiness = mutation({
  args: {
    id: v.id('businesses'),
    name: v.optional(v.string()),
    website: v.optional(v.string()),
    description: v.optional(v.string()),
    webnessUrl: v.optional(v.string()),
    webnessKey: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const user = await requireUser(ctx);
    const biz = await ctx.db.get(id);
    if (!biz || biz.userId !== user._id) throw new Error('Access denied');
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
  },
});

export const deleteBusiness = mutation({
  args: { id: v.id('businesses') },
  handler: async (ctx, { id }) => {
    const user = await requireUser(ctx);
    const biz = await ctx.db.get(id);
    if (!biz || biz.userId !== user._id) throw new Error('Access denied');
    
    // Cascading delete: delete goals associated with this business
    const goals = await ctx.db
      .query('businessGoals')
      .withIndex('by_businessId', (q: any) => q.eq('businessId', id))
      .collect();
    
    for (const goal of goals) {
      await ctx.db.delete(goal._id);
    }

    await ctx.db.delete(id);
  },
});

// ─── Queries ─────────────────────────────────────────────────────────────────
export const listBusinessGoals = query({
  args: {
    status: v.optional(v.string()),
    businessId: v.optional(v.id('businesses')),
  },
  handler: async (ctx, { status, businessId }) => {
    const user = await requireUser(ctx);
    let all: any[];
    if (businessId) {
      all = await ctx.db
        .query('businessGoals')
        .withIndex('by_businessId', (q: any) => q.eq('businessId', businessId))
        .collect();
      // Ensure users only see their own goals
      all = all.filter((g) => g.userId === user._id);
    } else {
      all = await ctx.db
        .query('businessGoals')
        .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
        .collect();
    }
    if (status) return all.filter((g: any) => g.status === status);
    return all.sort((a: any, b: any) => b.createdAt - a.createdAt);
  },
});

export const getBusinessGoal = query({
  args: { id: v.id('businessGoals') },
  handler: async (ctx, { id }) => {
    const user = await requireUser(ctx);
    const goal = await ctx.db.get(id);
    if (!goal || goal.userId !== user._id) return null;
    return goal;
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────
export const createBusinessGoal = mutation({
  args: {
    title: v.string(),
    type: v.union(
      v.literal('revenue'), v.literal('clients'), v.literal('launch'),
      v.literal('growth'), v.literal('product'), v.literal('marketing'), v.literal('operations'),
    ),
    description: v.optional(v.string()),
    businessId: v.optional(v.id('businesses')),
    businessName: v.optional(v.string()),
    target: v.optional(v.number()),
    current: v.optional(v.number()),
    unit: v.optional(v.string()),
    deadline: v.optional(v.string()),
    priority: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const now = Date.now();
    return ctx.db.insert('businessGoals', {
      userId: user._id,
      ...args,
      status: 'active',
      milestones: [],
      aiTasks: [],
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateBusinessGoal = mutation({
  args: {
    id: v.id('businessGoals'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    current: v.optional(v.number()),
    target: v.optional(v.number()),
    status: v.optional(v.union(v.literal('active'), v.literal('completed'), v.literal('paused'))),
    milestones: v.optional(v.array(v.object({ title: v.string(), done: v.boolean(), dueDate: v.optional(v.string()) }))),
    aiTasks: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { id, ...updates }) => {
    const user = await requireUser(ctx);
    const goal = await ctx.db.get(id);
    if (!goal || goal.userId !== user._id) throw new Error('Access denied');
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
  },
});

export const deleteBusinessGoal = mutation({
  args: { id: v.id('businessGoals') },
  handler: async (ctx, { id }) => {
    const user = await requireUser(ctx);
    const goal = await ctx.db.get(id);
    if (!goal || goal.userId !== user._id) throw new Error('Access denied');
    await ctx.db.delete(id);
  },
});

export const toggleMilestone = mutation({
  args: { id: v.id('businessGoals'), milestoneIndex: v.number() },
  handler: async (ctx, { id, milestoneIndex }) => {
    const user = await requireUser(ctx);
    const goal = await ctx.db.get(id);
    if (!goal || goal.userId !== user._id) throw new Error('Access denied');
    const milestones = [...(goal.milestones ?? [])];
    if (!milestones[milestoneIndex]) throw new Error('Milestone not found');
    milestones[milestoneIndex] = { ...milestones[milestoneIndex], done: !milestones[milestoneIndex].done };
    await ctx.db.patch(id, { milestones, updatedAt: Date.now() });
  },
});

// ─── AI Task Generation ────────────────────────────────────────────────────────
export const generateBusinessTasks = action({
  args: { goalId: v.id('businessGoals') },
  handler: async (ctx, { goalId }): Promise<string[]> => {
    const goal: any = await ctx.runQuery(api.businessGoals.getBusinessGoal, { id: goalId });
    if (!goal) throw new Error('Goal not found');

    const prompt = `You are TITAN, a sharp business strategy AI. Generate 7 specific, actionable business tasks for this goal.

Goal: "${goal.title}"
Type: ${goal.type}
Business: ${goal.businessName ?? 'Not specified'}
Target: ${goal.target ? `${goal.target} ${goal.unit ?? ''}` : 'Not set'}
Deadline: ${goal.deadline ?? 'Not set'}
${goal.description ? `Description: ${goal.description}` : ''}

Return ONLY a JSON array of 7 task strings. Each task must be:
- Specific (not generic)
- Actionable (starts with a verb)
- Measurable where possible
- Unique to this exact goal type and stage

Example format: ["Task 1...", "Task 2...", ...]`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });
      if (!response.ok) throw new Error('Groq API failed');
      const data: any = await response.json();
      const text: string = data.choices?.[0]?.message?.content ?? '[]';
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        const tasks: string[] = JSON.parse(match[0]);
        await ctx.runMutation(api.businessGoals.updateBusinessGoal, { id: goalId, aiTasks: tasks });
        return tasks;
      }
    } catch (_) {
      // Fallback
    }

    // Local fallback tasks
    const fallbacks: Record<string, string[]> = {
      revenue: [
        'Identify top 3 revenue-generating products/services',
        'Create a pricing page A/B test',
        'Set up automated billing and invoicing',
        'Reach out to 5 potential clients this week',
        'Analyze current customer LTV and CAC',
        'Build a revenue forecast spreadsheet',
        'Create an upsell funnel for existing customers',
      ],
      launch: [
        'Write the landing page copy and value proposition',
        'Set up payment processing (Stripe)',
        'Create 3 onboarding email templates',
        'Build a beta tester waitlist of 50 people',
        'Define your MVP feature set (max 5 features)',
        'Set up analytics (PostHog or Plausible)',
        'Schedule Product Hunt launch date',
      ],
    };
    const tasks: string[] = fallbacks[goal.type] ?? fallbacks.revenue;
    await ctx.runMutation(api.businessGoals.updateBusinessGoal, { id: goalId, aiTasks: tasks });
    return tasks;
  },
});
