// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — User Sync & Management (Convex)
// Syncs Clerk users to Convex DB, manages plan status
// ═══════════════════════════════════════════════════════════════════════════════

import { mutation, query, internalMutation, internalQuery } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import { Id } from './_generated/dataModel';

// ─────────────────────────────────────────────────────────────────────────────
// STORE USER — Called after Clerk sign-in to upsert user record
// ─────────────────────────────────────────────────────────────────────────────
export const store = mutation({
  args: {},
  returns: v.id('users'),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const clerkId = identity.subject;

    // Check if user already exists
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .unique();

    if (existing) {
      // Update name/email/image if changed
      await ctx.db.patch(existing._id, {
        name: identity.name ?? existing.name,
        email: identity.email ?? existing.email,
        imageUrl: identity.pictureUrl ?? existing.imageUrl,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    // Create new user
    const userId = await ctx.db.insert('users', {
      clerkId,
      email: identity.email ?? '',
      name: identity.name ?? 'User',
      imageUrl: identity.pictureUrl,
      plan: 'free',
      onboardingComplete: false,
      streakFreezeCount: 1, // Start with 1 free freeze
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Initialize gamification profile
    await ctx.db.insert('gamification', {
      userId,
      totalXP: 0,
      level: 1,
      achievements: [],
      badges: [],
      updatedAt: Date.now(),
    });

    return userId;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET CURRENT USER
// ─────────────────────────────────────────────────────────────────────────────
export const current = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id('users'),
      _creationTime: v.number(),
      clerkId: v.string(),
      email: v.string(),
      name: v.string(),
      imageUrl: v.optional(v.string()),
      plan: v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime')),
      timezone: v.optional(v.string()),
      theme: v.optional(v.union(v.literal('light'), v.literal('dark'), v.literal('system'))),
      onboardingComplete: v.boolean(),
      streakFreezeCount: v.number(),
      // Onboarding preferences
      focusAreas: v.optional(v.array(v.string())),
      selectedHabitTemplates: v.optional(v.array(v.string())),
      preferredTime: v.optional(v.string()),
      primaryGoal: v.optional(v.string()),
      primaryGoalReason: v.optional(v.string()),
      primaryGoalDeadline: v.optional(v.string()),
      // Vision & Life Design
      lifeWheelScores: v.optional(v.object({
        health: v.number(),
        career: v.number(),
        finance: v.number(),
        learning: v.number(),
        relationships: v.number(),
        creativity: v.number(),
        mindfulness: v.number(),
        personal_growth: v.number(),
      })),
      coreValues: v.optional(v.array(v.string())),
      lifeVision: v.optional(v.string()),
      visionBoard: v.optional(v.array(v.object({
        id: v.string(),
        imageUrl: v.string(),
        caption: v.optional(v.string()),
        domain: v.optional(v.string()),
      }))),
      // Schedule preferences
      wakeTime: v.optional(v.string()),
      sleepTime: v.optional(v.string()),
      peakProductivityTime: v.optional(v.string()),
      workSchedule: v.optional(v.object({
        startTime: v.string(),
        endTime: v.string(),
        lunchStart: v.optional(v.string()),
        lunchEnd: v.optional(v.string()),
        workDays: v.array(v.number()),
      })),
      // Notification preferences
      notificationPrefs: v.optional(v.object({
        morningMotivation: v.boolean(),
        middayCheckin: v.boolean(),
        eveningWinddown: v.boolean(),
        taskReminders: v.boolean(),
        hydrationReminders: v.boolean(),
        focusSessionReminders: v.boolean(),
        sleepReminders: v.boolean(),
        weeklyReviewReminders: v.boolean(),
        quietHoursEnabled: v.boolean(),
        quietHoursStart: v.string(),
        quietHoursEnd: v.string(),
        reminderStyle: v.union(
          v.literal('gentle'),
          v.literal('supportive'),
          v.literal('persistent'),
          v.literal('minimal')
        ),
        coachingFrequency: v.union(
          v.literal('daily'),
          v.literal('weekly'),
          v.literal('struggling_only'),
          v.literal('manual')
        ),
      })),
      // Coach personality
      coachPersonality: v.optional(v.union(
        v.literal('supportive'),
        v.literal('challenging'),
        v.literal('analytical'),
        v.literal('humorous')
      )),
      // Recovery state
      lastActiveAt: v.optional(v.number()),
      recoveryStatus: v.optional(v.union(
        v.literal('active'),
        v.literal('at_risk'),
        v.literal('inactive'),
        v.literal('recovering')
      )),
      // Billing concurrency guard (new fields)
      planVersion: v.optional(v.number()),
      planUpdatedAt: v.optional(v.number()),
      lastBillingEventId: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE USER PROFILE
// ─────────────────────────────────────────────────────────────────────────────
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    timezone: v.optional(v.string()),
    theme: v.optional(v.union(v.literal('light'), v.literal('dark'), v.literal('system'))),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE ONBOARDING (enhanced with life design data)
// ─────────────────────────────────────────────────────────────────────────────
export const completeOnboarding = mutation({
  args: {
    focusAreas: v.optional(v.array(v.string())),
    selectedHabitTemplates: v.optional(v.array(v.string())),
    preferredTime: v.optional(v.string()),
    primaryGoal: v.optional(v.string()),
    primaryGoalReason: v.optional(v.string()),
    primaryGoalDeadline: v.optional(v.string()),
    timezone: v.optional(v.string()),
    coachPersonality: v.optional(v.union(
      v.literal('supportive'),
      v.literal('challenging'),
      v.literal('analytical'),
      v.literal('humorous')
    )),
    coachPersona: v.optional(v.string()),
    // Legacy fields still accepted
    lifeWheelScores: v.optional(v.object({
      health: v.number(),
      career: v.number(),
      finance: v.number(),
      learning: v.number(),
      relationships: v.number(),
      creativity: v.number(),
      mindfulness: v.number(),
      personal_growth: v.number(),
    })),
    coreValues: v.optional(v.array(v.string())),
    lifeVision: v.optional(v.string()),
    wakeTime: v.optional(v.string()),
    sleepTime: v.optional(v.string()),
    peakProductivityTime: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    const updates: Record<string, unknown> = {
      onboardingComplete: true,
      updatedAt: Date.now(),
    };

    // New onboarding fields
    if (args.focusAreas) updates.focusAreas = args.focusAreas;
    if (args.selectedHabitTemplates) updates.selectedHabitTemplates = args.selectedHabitTemplates;
    if (args.preferredTime) updates.preferredTime = args.preferredTime;
    if (args.primaryGoal) updates.primaryGoal = args.primaryGoal;
    if (args.primaryGoalReason) updates.primaryGoalReason = args.primaryGoalReason;
    if (args.primaryGoalDeadline) updates.primaryGoalDeadline = args.primaryGoalDeadline;
    if (args.timezone) updates.timezone = args.timezone;
    if (args.coachPersonality) updates.coachPersonality = args.coachPersonality;
    if (args.coachPersona) updates.coachPersona = args.coachPersona;
    
    // Legacy fields
    if (args.lifeWheelScores) updates.lifeWheelScores = args.lifeWheelScores;
    if (args.coreValues) updates.coreValues = args.coreValues;
    if (args.lifeVision) updates.lifeVision = args.lifeVision;
    if (args.wakeTime) updates.wakeTime = args.wakeTime;
    if (args.sleepTime) updates.sleepTime = args.sleepTime;
    if (args.peakProductivityTime) updates.peakProductivityTime = args.peakProductivityTime;

    await ctx.db.patch(user._id, updates);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE LIFE WHEEL (Module 1 — Vision & Life Design)
// ─────────────────────────────────────────────────────────────────────────────
export const updateLifeWheel = mutation({
  args: {
    scores: v.object({
      health: v.number(),
      career: v.number(),
      finance: v.number(),
      learning: v.number(),
      relationships: v.number(),
      creativity: v.number(),
      mindfulness: v.number(),
      personal_growth: v.number(),
    }),
  },
  returns: v.null(),
  handler: async (ctx, { scores }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      lifeWheelScores: scores,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE CORE VALUES
// ─────────────────────────────────────────────────────────────────────────────
export const updateCoreValues = mutation({
  args: { values: v.array(v.string()) },
  returns: v.null(),
  handler: async (ctx, { values }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      coreValues: values,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE LIFE VISION
// ─────────────────────────────────────────────────────────────────────────────
export const updateLifeVision = mutation({
  args: { vision: v.string() },
  returns: v.null(),
  handler: async (ctx, { vision }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      lifeVision: vision,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE SCHEDULE PREFERENCES
// ─────────────────────────────────────────────────────────────────────────────
export const updateSchedule = mutation({
  args: {
    wakeTime: v.optional(v.string()),
    sleepTime: v.optional(v.string()),
    peakProductivityTime: v.optional(v.string()),
    workSchedule: v.optional(v.object({
      startTime: v.string(),
      endTime: v.string(),
      lunchStart: v.optional(v.string()),
      lunchEnd: v.optional(v.string()),
      workDays: v.array(v.number()),
    })),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE NOTIFICATION PREFERENCES
// ─────────────────────────────────────────────────────────────────────────────
export const updateNotificationPrefs = mutation({
  args: {
    prefs: v.object({
      morningMotivation: v.boolean(),
      middayCheckin: v.boolean(),
      eveningWinddown: v.boolean(),
      taskReminders: v.boolean(),
      hydrationReminders: v.boolean(),
      focusSessionReminders: v.boolean(),
      sleepReminders: v.boolean(),
      weeklyReviewReminders: v.boolean(),
      quietHoursEnabled: v.boolean(),
      quietHoursStart: v.string(),
      quietHoursEnd: v.string(),
      reminderStyle: v.union(
        v.literal('gentle'),
        v.literal('supportive'),
        v.literal('persistent'),
        v.literal('minimal')
      ),
      coachingFrequency: v.union(
        v.literal('daily'),
        v.literal('weekly'),
        v.literal('struggling_only'),
        v.literal('manual')
      ),
    }),
  },
  returns: v.null(),
  handler: async (ctx, { prefs }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      notificationPrefs: prefs,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE PLAN FROM WEBHOOK — Secure public mutation for server webhooks
// ─────────────────────────────────────────────────────────────────────────────
export const updatePlanFromWebhook = mutation({
  args: {
    clerkId: v.string(),
    plan: v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime')),
    eventId: v.string(),
    eventType: v.string(),
    webhookSecret: v.string(),
    // Optional: unix-ms timestamp from the webhook for stale-event detection
    webhookTimestampMs: v.optional(v.number()),
  },
  returns: v.object({
    applied: v.boolean(),
    reason: v.string(),
  }),
  handler: async (ctx, { clerkId, plan, eventId, eventType, webhookSecret, webhookTimestampMs }) => {
    const logBillingEvent = async (args: {
      userId?: Id<'users'>;
      status: 'received' | 'applied' | 'ignored' | 'failed';
      reason?: string;
      details?: unknown;
    }) => {
      await ctx.db.insert('billingEvents', {
        userId: args.userId,
        clerkId,
        eventId,
        eventType,
        source: 'webhook',
        status: args.status,
        plan,
        reason: args.reason,
        details: args.details,
        createdAt: Date.now(),
      });
    };

    const expected = process.env.BILLING_WEBHOOK_SYNC_SECRET;
    if (!expected) {
      await logBillingEvent({
        status: 'failed',
        reason: 'sync_secret_missing',
      });
      throw new Error('BILLING_WEBHOOK_SYNC_SECRET is not configured');
    }

    // Constant-time comparison that works in Convex's V8 runtime (no Node.js Buffer/crypto)
    if (expected.length !== webhookSecret.length) {
      await logBillingEvent({
        status: 'failed',
        reason: 'sync_secret_length_mismatch',
      });
      throw new Error('Unauthorized webhook plan update');
    }
    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) {
      mismatch |= expected.charCodeAt(i) ^ webhookSecret.charCodeAt(i);
    }
    if (mismatch !== 0) {
      await logBillingEvent({
        status: 'failed',
        reason: 'sync_secret_mismatch',
      });
      throw new Error('Unauthorized webhook plan update');
    }

    await logBillingEvent({
      status: 'received',
      reason: 'accepted_for_processing',
    });

    // Durable idempotency: if this webhook event has already been processed,
    // return success without re-applying mutations.
    const existingEvent = await ctx.db
      .query('billingWebhookEvents')
      .withIndex('by_eventId', (q) => q.eq('eventId', eventId))
      .unique();

    if (existingEvent) {
      await logBillingEvent({
        status: 'ignored',
        reason: 'duplicate_event',
      });
      return {
        applied: false,
        reason: 'duplicate_event',
      };
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .unique();

    // Webhook may arrive before first signed-in sync; no-op safely.
    if (!user) {
      console.warn(`[users.updatePlanFromWebhook] User not found for clerkId=${clerkId}`);

      await ctx.db.insert('billingWebhookEvents', {
        eventId,
        eventType,
        clerkId,
        plan,
        status: 'ignored',
        reason: 'user_not_found',
        processedAt: Date.now(),
      });

      await logBillingEvent({
        status: 'ignored',
        reason: 'user_not_found',
      });

      return {
        applied: false,
        reason: 'user_not_found',
      };
    }

    const prevPlan = user.plan;
    const now = Date.now();

    // ── Stale-event guard ────────────────────────────────────────────────────
    // If the incoming webhook is older than the last plan update we already
    // applied, skip it to prevent out-of-order delivery from overwriting a
    // newer plan state (e.g. upgrade webhook arrives after a later downgrade).
    if (
      webhookTimestampMs !== undefined &&
      typeof user.planUpdatedAt === 'number' &&
      webhookTimestampMs < user.planUpdatedAt
    ) {
      console.warn(
        `[users.updatePlanFromWebhook] Stale event ${eventId} (ts=${webhookTimestampMs}) ` +
        `< planUpdatedAt=${user.planUpdatedAt} — ignoring`
      );

      await ctx.db.insert('billingWebhookEvents', {
        eventId,
        eventType,
        clerkId,
        plan,
        status: 'ignored',
        reason: 'stale_event',
        processedAt: now,
      });

      await logBillingEvent({
        userId: user._id,
        status: 'ignored',
        reason: 'stale_event',
        details: { webhookTimestampMs, planUpdatedAt: user.planUpdatedAt },
      });

      return { applied: false, reason: 'stale_event' };
    }

    await ctx.db.patch(user._id, {
      plan,
      planVersion: (user.planVersion ?? 0) + 1,
      planUpdatedAt: now,
      lastBillingEventId: eventId,
      updatedAt: now,
    });

    // ── Downgrade preservation: archive excess habits/goals on free downgrade ──
    const isDowngrade = prevPlan !== 'free' && plan === 'free';
    const isUpgrade = prevPlan === 'free' && plan !== 'free';

    if (isDowngrade) {
      try {
        const archivedHabitsCount = await ctx.runMutation((internal as any).habits.archiveExcessOnDowngradeInternal, { newPlan: 'free' });
        const archivedGoalsCount = await ctx.runMutation((internal as any).goals.archiveExcessOnDowngradeInternal, { newPlan: 'free' });
        console.log(`[Downgrade] Archived ${archivedHabitsCount ?? 0} habits and ${archivedGoalsCount ?? 0} goals for ${clerkId}`);
      } catch (err) {
        console.error('[Downgrade] Failed to archive excess items via internal helpers', err instanceof Error ? err.message : String(err));
      }
    }

    if (isUpgrade) {
      try {
        const restoredHabits = await ctx.runMutation((internal as any).habits.restoreArchivedOnUpgradeInternal, { newPlan: plan });
        const restoredGoals = await ctx.runMutation((internal as any).goals.restoreArchivedOnUpgradeInternal, { newPlan: plan });
        console.log(`[Upgrade] Restored ${restoredHabits ?? 0} habits and ${restoredGoals ?? 0} goals for ${clerkId}`);
      } catch (err) {
        console.error('[Upgrade] Failed to restore archived items via internal helpers', err instanceof Error ? err.message : String(err));
      }
    }

    await ctx.db.insert('billingWebhookEvents', {
      eventId,
      eventType,
      clerkId,
      plan,
      status: 'applied',
      reason: 'ok',
      processedAt: Date.now(),
    });

    await logBillingEvent({
      userId: user._id,
      status: 'applied',
      reason: 'ok',
    });

    return {
      applied: true,
      reason: 'ok',
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// BILLING AUDIT LOG — Public mutation for webhook/audit instrumentation
// ─────────────────────────────────────────────────────────────────────────────
export const logBillingEvent = mutation({
  args: {
    userId: v.optional(v.id('users')),
    clerkId: v.string(),
    eventId: v.string(),
    eventType: v.string(),
    source: v.union(v.literal('webhook'), v.literal('system'), v.literal('manual')),
    status: v.union(
      v.literal('received'),
      v.literal('applied'),
      v.literal('ignored'),
      v.literal('failed')
    ),
    plan: v.optional(v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime'))),
    reason: v.optional(v.string()),
    details: v.optional(v.any()),
    webhookSecret: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const expected = process.env.BILLING_WEBHOOK_SYNC_SECRET;
    if (!expected) {
      throw new Error('BILLING_WEBHOOK_SYNC_SECRET is not configured');
    }

    if (expected.length !== args.webhookSecret.length) {
      throw new Error('Unauthorized billing audit write');
    }

    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) {
      mismatch |= expected.charCodeAt(i) ^ args.webhookSecret.charCodeAt(i);
    }

    if (mismatch !== 0) {
      throw new Error('Unauthorized billing audit write');
    }

    await ctx.db.insert('billingEvents', {
      userId: args.userId,
      clerkId: args.clerkId,
      eventId: args.eventId,
      eventType: args.eventType,
      source: args.source,
      status: args.status,
      plan: args.plan,
      reason: args.reason,
      details: args.details,
      createdAt: Date.now(),
    });

    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// BILLING AUDIT LOG — Clerk-facing support query
// ─────────────────────────────────────────────────────────────────────────────
export const getBillingEventsByClerkId = query({
  args: {
    clerkId: v.string(),
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id('billingEvents'),
      _creationTime: v.number(),
      userId: v.optional(v.id('users')),
      clerkId: v.string(),
      eventId: v.string(),
      eventType: v.string(),
      source: v.union(v.literal('webhook'), v.literal('system'), v.literal('manual')),
      status: v.union(
        v.literal('received'),
        v.literal('applied'),
        v.literal('ignored'),
        v.literal('failed')
      ),
      plan: v.optional(v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime'))),
      reason: v.optional(v.string()),
      details: v.optional(v.any()),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, { clerkId, limit }) => {
    const cappedLimit = Math.min(Math.max(limit ?? 50, 1), 200);
    return await ctx.db
      .query('billingEvents')
      .withIndex('by_clerkId_and_createdAt', (q) => q.eq('clerkId', clerkId))
      .order('desc')
      .take(cappedLimit);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE PLAN — Called by billing webhooks
// ─────────────────────────────────────────────────────────────────────────────
export const updatePlan = internalMutation({
  args: {
    clerkId: v.string(),
    plan: v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime')),
  },
  returns: v.null(),
  handler: async (ctx, { clerkId, plan }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .unique();
    if (!user) throw new Error(`User not found for clerkId: ${clerkId}`);

    await ctx.db.patch(user._id, {
      plan,
      updatedAt: Date.now(),
    });
  },
});

// ───────────────────────────────────────────────────────────────────────────
// SET EMERGENCY MODE (AI-triggered from Living System)
// ───────────────────────────────────────────────────────────────────────────
export const setEmergencyMode = mutation({
  args: {
    active: v.boolean(),
    reason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, { active, reason }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      emergencyMode: active,
      emergencyModeReason: active ? (reason ?? 'AI-detected overwhelm') : undefined,
      emergencyModeActivatedAt: active ? Date.now() : undefined,
      updatedAt: Date.now(),
    });
  },
});

// ───────────────────────────────────────────────────────────────────────────
// UPDATE AI SUMMARY MEMORY (rolling memory patch from coach sessions)
// ───────────────────────────────────────────────────────────────────────────
export const updateSummaryMemory = mutation({
  args: { patch: v.string() },
  returns: v.null(),
  handler: async (ctx, { patch }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      summaryMemory: patch.slice(0, 200), // cap at 200 chars
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 25 — Onboarding Archetype
// ─────────────────────────────────────────────────────────────────────────────
export const setArchetype = mutation({
  args: {
    archetype: v.string(),
    confidence: v.number(),
    secondaryArchetype: v.union(v.string(), v.null()),
    onboardingData: v.string(), // JSON-serialised OnboardingData
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      archetype: args.archetype,
      archetypeConfidence: args.confidence,
      secondaryArchetype: args.secondaryArchetype ?? undefined,
      onboardingData: args.onboardingData,
      onboardingComplete: true,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 26 — Dodo Payments Internal Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Internal query used by convex/dodo.ts identify function */
export const getByClerkIdInternal = internalQuery({
  args: { clerkId: v.string() },
  returns: v.union(
    v.object({
      _id: v.id('users'),
      clerkId: v.string(),
      email: v.string(),
      dodoCustomerId: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .unique();
    if (!user) return null;
    return {
      _id: user._id,
      clerkId: user.clerkId,
      email: user.email,
      dodoCustomerId: user.dodoCustomerId,
    };
  },
});

/** Internal mutation: stores dodoCustomerId on the user record after first checkout */
export const storeDodoCustomerId = internalMutation({
  args: {
    clerkId: v.string(),
    dodoCustomerId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { clerkId, dodoCustomerId }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .unique();
    if (!user) {
      console.warn(`[storeDodoCustomerId] User not found for clerkId=${clerkId}`);
      return null;
    }
    // Only store if not already set (idempotent)
    if (!user.dodoCustomerId) {
      await ctx.db.patch(user._id, {
        dodoCustomerId,
        updatedAt: Date.now(),
      });
    }
    return null;
  },
});

/** Internal query: look up user by email (fallback for webhooks without metadata) */
export const getByEmailInternal = internalQuery({
  args: { email: v.string() },
  returns: v.union(
    v.object({
      _id: v.id('users'),
      clerkId: v.string(),
      email: v.string(),
      plan: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .unique();
    if (!user) return null;
    return {
      _id: user._id,
      clerkId: user.clerkId,
      email: user.email,
      plan: user.plan,
    };
  },
});

/** Internal query: look up user by dodoCustomerId */
export const getByDodoCustomerIdInternal = internalQuery({
  args: { dodoCustomerId: v.string() },
  returns: v.union(
    v.object({
      _id: v.id('users'),
      clerkId: v.string(),
      email: v.string(),
      plan: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, { dodoCustomerId }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_dodoCustomerId', (q) => q.eq('dodoCustomerId', dodoCustomerId))
      .first();
    if (!user) return null;
    return {
      _id: user._id,
      clerkId: user.clerkId,
      email: user.email,
      plan: user.plan,
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Section 27 — Internal Plan Update (for Convex HTTP webhook handler)
// No secret check — caller (http.ts) handles Dodo signature verification.
// ─────────────────────────────────────────────────────────────────────────────

export const updatePlanFromWebhookInternal = internalMutation({
  args: {
    clerkId: v.string(),
    plan: v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime')),
    eventId: v.string(),
    eventType: v.string(),
  },
  returns: v.object({
    applied: v.boolean(),
    reason: v.string(),
  }),
  handler: async (ctx, { clerkId, plan, eventId, eventType }) => {
    // Idempotency: check if this event was already processed
    const existingEvent = await ctx.db
      .query('billingWebhookEvents')
      .withIndex('by_eventId', (q) => q.eq('eventId', eventId))
      .unique();

    if (existingEvent) {
      return { applied: false, reason: 'duplicate_event' };
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .unique();

    if (!user) {
      console.warn(`[updatePlanFromWebhookInternal] User not found for clerkId=${clerkId}`);
      await ctx.db.insert('billingWebhookEvents', {
        eventId,
        eventType,
        clerkId,
        plan,
        status: 'ignored',
        reason: 'user_not_found',
        processedAt: Date.now(),
      });
      return { applied: false, reason: 'user_not_found' };
    }

    const prevPlan = user.plan;
    const now = Date.now();

    await ctx.db.patch(user._id, {
      plan,
      planVersion: (user.planVersion ?? 0) + 1,
      planUpdatedAt: now,
      lastBillingEventId: eventId,
      updatedAt: now,
    });

    // Downgrade/upgrade hooks
    const isDowngrade = prevPlan !== 'free' && plan === 'free';
    const isUpgrade = prevPlan === 'free' && plan !== 'free';

    if (isDowngrade) {
      try {
        await ctx.runMutation((internal as any).habits.archiveExcessOnDowngradeInternal, { newPlan: 'free' });
        await ctx.runMutation((internal as any).goals.archiveExcessOnDowngradeInternal, { newPlan: 'free' });
      } catch (err) {
        console.error('[Downgrade] Failed to archive excess items', err instanceof Error ? err.message : String(err));
      }
    }

    if (isUpgrade) {
      try {
        await ctx.runMutation((internal as any).habits.restoreArchivedOnUpgradeInternal, { newPlan: plan });
        await ctx.runMutation((internal as any).goals.restoreArchivedOnUpgradeInternal, { newPlan: plan });
      } catch (err) {
        console.error('[Upgrade] Failed to restore archived items', err instanceof Error ? err.message : String(err));
      }
    }

    await ctx.db.insert('billingWebhookEvents', {
      eventId,
      eventType,
      clerkId,
      plan,
      status: 'applied',
      reason: 'ok',
      processedAt: Date.now(),
    });

    await ctx.db.insert('billingEvents', {
      userId: user._id,
      clerkId,
      eventId,
      eventType,
      source: 'webhook',
      status: 'applied',
      plan,
      reason: 'ok',
      createdAt: Date.now(),
    });

    console.log(`[updatePlanFromWebhookInternal] ${clerkId}: ${prevPlan} → ${plan} (event=${eventId})`);

    return { applied: true, reason: 'ok' };
  },
});

