// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Convex Cron Jobs
// Morning digest & reminder delivery via Telegram + FCM push
// ═══════════════════════════════════════════════════════════════════════════════

import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

// ── Morning digest (Telegram): every day at 07:00 UTC ─────────────────────────
crons.cron(
  'telegram-morning-digest',
  '0 7 * * *',
  internal.telegramActions.sendMorningDigests
);

// ── Morning digest (FCM Push): every day at 07:00 UTC ─────────────────────────
crons.cron(
  'push-morning-digest',
  '0 7 * * *',
  internal.pushNotifications.sendMorningDigestsPush
);

// ── Reminder delivery (Telegram): check every 5 minutes ──────────────────────
crons.interval(
  'deliver-reminders-telegram',
  { minutes: 5 },
  internal.telegramActions.deliverDueReminders
);

// ── Reminder delivery (FCM Push): check every 5 minutes ──────────────────────
crons.interval(
  'deliver-reminders-push',
  { minutes: 5 },
  internal.pushNotifications.deliverDueRemindersPush
);

// ── Lifecycle email automation: every day at 09:00 UTC ────────────────────────
crons.cron(
  'lifecycle-email-automation',
  '0 9 * * *',
  internal.emailAutomation.processLifecycleEmails
);

// ── Local-time nudges (hourly fan-out; action checks user local time) ─────────
crons.cron(
  'push-morning-nudge-local-time',
  '0 * * * *',
  internal.pushNotifications.sendMorningNudgesLocalTimePush
);

crons.cron(
  'push-evening-prompt-local-time',
  '0 * * * *',
  internal.pushNotifications.sendEveningPromptsLocalTimePush
);

// ── Weekly AI summary generation (Sunday 18:00 UTC) ──────────────────────────
crons.cron(
  'weekly-ai-summary-generation',
  '0 18 * * 0',
  internal.insights.generateWeeklySummariesForActiveUsers
);

// ── Weekly Customer Engagement Score recompute (Sunday 19:00 UTC) ────────────
crons.cron(
  'weekly-engagement-score-recompute',
  '0 19 * * 0',
  internal.users.recomputeAllEngagementScores
);

export default crons;
