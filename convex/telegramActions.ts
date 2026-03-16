// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Telegram Internal Actions
// Called by cron jobs to deliver morning digests and reminders
// ═══════════════════════════════════════════════════════════════════════════════

import { internalAction } from './_generated/server';
import { api, internal } from './_generated/api';
import { v } from 'convex/values';

const TELEGRAM_FOOTER = '\n\n📊 Organized by RESURGO.life — AI life management';

// ─── Telegram Bot API helper ──────────────────────────────────────────────────
async function sendTelegramMessage(
  token: string,
  chatId: string,
  text: string,
  parseMode: 'MarkdownV2' | 'HTML' | undefined = 'HTML'
): Promise<void> {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode }),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// sendMorningDigests — Runs every day at 07:00 UTC via cron
// Sends today's plan to all users with Telegram linked
// ─────────────────────────────────────────────────────────────────────────────
export const sendMorningDigests = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.warn('[telegramActions] TELEGRAM_BOT_TOKEN not set — skipping digest');
      return null;
    }

    const users = await ctx.runQuery(api.telegram.getUsersWithTelegram, {});

    for (const user of users) {
      try {
        const summary = await ctx.runQuery(api.telegram.getUserSummary, { userId: user._id });

        const taskLines = summary.topTasks.length > 0
          ? summary.topTasks.map((t, i) => `${i + 1}. ${t.title}`).join('\n')
          : 'No pending tasks — clean slate! 🎯';

        const habitLines = summary.habitsToday.length > 0
          ? summary.habitsToday.map((h) => `${h.completedToday ? '✅' : '⬜'} ${h.title}`).join('\n')
          : 'No habits set yet';

        const goalLines = summary.activeGoals.length > 0
          ? summary.activeGoals.map((g) => `• ${g.title} — ${g.progress}%`).join('\n')
          : 'No active goals';

        const message = [
          `☀️ <b>Good morning, ${user.name.split(' ')[0]}!</b>`,
          '',
          '📋 <b>Top Tasks</b>',
          taskLines,
          '',
          '🔥 <b>Habits Today</b>',
          habitLines,
          '',
          '🎯 <b>Active Goals</b>',
          goalLines,
          '',
          '<i>Use /digest for a fresh snapshot anytime • /help for all commands</i>',
        ].join('\n') + TELEGRAM_FOOTER;

        await sendTelegramMessage(token, user.telegramChatId, message, 'HTML');
      } catch (err) {
        console.error(`[telegramActions] Failed to send digest to ${user.telegramChatId}:`, err);
      }
    }

    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// deliverDueReminders — Runs every 5 minutes via cron
// Fires reminders that have reached their scheduled time
// ─────────────────────────────────────────────────────────────────────────────
export const deliverDueReminders = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return null;

    const now = Date.now();
    const dueReminders = await ctx.runQuery(internal.reminders.getPendingReminders, {
      beforeTimestamp: now,
    });

    for (const reminder of dueReminders) {
      try {
        if (reminder.telegramChatId) {
          const text = `⏰ <b>Reminder</b>\n\n${reminder.text}${TELEGRAM_FOOTER}`;
          await sendTelegramMessage(token, reminder.telegramChatId, text, 'HTML');
        }
        await ctx.runMutation(internal.reminders.markReminderSent, { reminderId: reminder._id });
      } catch (err) {
        console.error(`[telegramActions] Failed to deliver reminder ${reminder._id}:`, err);
      }
    }

    return null;
  },
});
