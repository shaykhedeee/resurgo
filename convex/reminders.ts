// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Reminders
// Scheduled reminders from Telegram /remind command and the app
// ═══════════════════════════════════════════════════════════════════════════════

import { mutation, query, internalMutation, internalQuery } from './_generated/server';
import { v } from 'convex/values';

// ─────────────────────────────────────────────────────────────────────────────
// createReminder — Schedule a reminder from bot or app
// ─────────────────────────────────────────────────────────────────────────────
export const createReminder = mutation({
  args: {
    userId: v.id('users'),
    text: v.string(),
    remindAt: v.number(),
    source: v.union(v.literal('telegram'), v.literal('app')),
    telegramChatId: v.optional(v.string()),
  },
  returns: v.id('reminders'),
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('reminders', {
      userId: args.userId,
      text: args.text,
      remindAt: args.remindAt,
      status: 'pending',
      source: args.source,
      telegramChatId: args.telegramChatId,
      createdAt: Date.now(),
    });
    return id;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// getPendingReminders — Called by the cron to find due reminders
// ─────────────────────────────────────────────────────────────────────────────
export const getPendingReminders = internalQuery({
  args: { beforeTimestamp: v.number() },
  returns: v.array(v.object({
    _id: v.id('reminders'),
    userId: v.id('users'),
    text: v.string(),
    remindAt: v.number(),
    source: v.union(v.literal('telegram'), v.literal('app')),
    telegramChatId: v.optional(v.string()),
    createdAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const reminders = await ctx.db
      .query('reminders')
      .withIndex('by_status_remindAt', (q) =>
        q.eq('status', 'pending').lte('remindAt', args.beforeTimestamp)
      )
      .collect();
    return reminders.map((r) => ({
      _id: r._id,
      userId: r.userId,
      text: r.text,
      remindAt: r.remindAt,
      source: r.source,
      telegramChatId: r.telegramChatId,
      createdAt: r.createdAt,
    }));
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// markReminderSent — Mark a reminder as sent after delivery
// ─────────────────────────────────────────────────────────────────────────────
export const markReminderSent = internalMutation({
  args: { reminderId: v.id('reminders') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reminderId, { status: 'sent' });
    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// listUserReminders — List upcoming reminders for a user (from settings/app)
// ─────────────────────────────────────────────────────────────────────────────
export const listUserReminders = query({
  args: { userId: v.id('users') },
  returns: v.array(v.object({
    _id: v.id('reminders'),
    text: v.string(),
    remindAt: v.number(),
    status: v.union(v.literal('pending'), v.literal('sent'), v.literal('dismissed')),
    source: v.union(v.literal('telegram'), v.literal('app')),
  })),
  handler: async (ctx, args) => {
    const reminders = await ctx.db
      .query('reminders')
      .withIndex('by_userId_status', (q) => q.eq('userId', args.userId).eq('status', 'pending'))
      .order('asc')
      .take(20);
    return reminders.map((r) => ({
      _id: r._id,
      text: r.text,
      remindAt: r.remindAt,
      status: r.status,
      source: r.source,
    }));
  },
});
