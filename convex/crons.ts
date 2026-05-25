// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Convex Cron Jobs
// Morning digest, reminder delivery, weekly reports via Telegram + FCM push
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

// ── Lead outreach drip (unconverted leads): daily at 10:00 UTC ────────────────
crons.cron(
  'lead-outreach-email-automation',
  '0 10 * * *',
  internal.emailAutomation.processLeadOutreach
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

// ── Weekly Intelligence Reports (Sunday 20:00 UTC) ───────────────────────────
// Generates personalized AI performance reports for all active users
// Delivered in-app and via Telegram if linked
crons.cron(
  'weekly-intelligence-reports',
  '0 20 * * 0',
  internal.weeklyIntelligence.runWeeklyIntelligenceForAllUsers
);

// ── Streak Recovery Advisor (daily 8AM UTC) ──────────────────────────────────
crons.cron(
  'streak-recovery-advisor',
  '0 8 * * *',
  (internal as any).scheduledTasks.runStreakRecoveryAdvisor
);

// ── Monthly Goal Progress Review (1st of month 6AM UTC) ──────────────────────
crons.cron(
  'monthly-goal-review',
  '0 6 1 * *',
  (internal as any).scheduledTasks.runMonthlyGoalProgressReview
);

// ── AI Memory Extraction (every 6 hours) ─────────────────────────────────────
crons.cron(
  'ai-memory-extraction',
  '0 */6 * * *',
  (internal as any).scheduledTasks.runAIMemoryExtraction
);

// ── Pro Trial Nudge (daily 11AM UTC) ─────────────────────────────────────────
crons.cron(
  'pro-trial-nudge',
  '0 11 * * *',
  (internal as any).scheduledTasks.runProTrialNudge
);

// ── Referral Campaign Trigger (weekly Wednesday 2PM UTC) ─────────────────────
crons.cron(
  'referral-campaign-trigger',
  '0 14 * * 3',
  (internal as any).scheduledTasks.runReferralCampaignTrigger
);

// ── Reactivation Smart Campaign (daily 1PM UTC) ──────────────────────────────
crons.cron(
  'reactivation-smart-campaign',
  '0 13 * * *',
  (internal as any).scheduledTasks.runReactivationCampaign
);

// ── System Health Check (every 30 minutes) ───────────────────────────────────
crons.cron(
  'system-health-check',
  '*/30 * * * *',
  (internal as any).scheduledTasks.runSystemHealthCheck
);

// ── SEO Sitemap Ping (daily midnight UTC) ────────────────────────────────────
crons.cron(
  'seo-sitemap-ping',
  '0 0 * * *',
  (internal as any).scheduledTasks.runSitemapPing
);

// ── Daily Blog Generation (daily 2AM UTC) ─────────────────────────────────────
crons.cron(
  'daily-blog-generation',
  '0 2 * * *',
  (internal as any).scheduledTasks.runDailyBlogGeneration
);

// ── Social Media Post Scheduler (daily 12PM UTC) ──────────────────────────────
crons.cron(
  'social-media-post-scheduler',
  '0 12 * * *',
  (internal as any).scheduledTasks.runSocialPostingSchedule
);

// ── Weekly Analytics Telemetry Audit (weekly Sunday 11:55 PM UTC) ─────────────
crons.cron(
  'weekly-analytics-telemetry-audit',
  '55 23 * * 0',
  (internal as any).scheduledTasks.runWeeklyAnalyticsReview
);

export default crons;

