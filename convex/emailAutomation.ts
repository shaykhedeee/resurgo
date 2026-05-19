// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Email Lifecycle Automation
// Drip sequences, engagement nudges, streak alerts, win-back campaigns
// Runs via daily cron — checks each user's lifecycle stage & sends appropriate email
// ═══════════════════════════════════════════════════════════════════════════════

import { internalAction, internalMutation, internalQuery } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';

// ── Constants ────────────────────────────────────────────────────────────────

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Resurgo <noreply@resurgo.life>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://resurgo.life';

const DAY_MS = 24 * 60 * 60 * 1000;

// ── Email send helper (action-safe) ──────────────────────────────────────────

async function sendResendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!RESEND_API_KEY) {
    console.info(`[EmailAutomation] RESEND_API_KEY not set — skipping email to ${opts.to}`);
    return { ok: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
        reply_to: 'support@resurgo.life',
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[EmailAutomation] Resend error ${res.status}:`, body);
      return { ok: false, error: `Resend ${res.status}: ${body}` };
    }

    const data = await res.json();
    return { ok: true, id: data.id };
  } catch (err) {
    console.error('[EmailAutomation] Send failed:', err);
    return { ok: false, error: String(err) };
  }
}

// ── HTML template ────────────────────────────────────────────────────────────

function emailTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin:0; padding:0; background:#0A0A0B; font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace; color:#E4E4E7; }
  .container { max-width:560px; margin:0 auto; padding:32px 24px; }
  .header { border-bottom:1px solid #27272A; padding-bottom:16px; margin-bottom:24px; }
  .logo { font-size:18px; font-weight:800; color:#F97316; letter-spacing:0.1em; }
  .content { line-height:1.7; font-size:14px; color:#A1A1AA; }
  .content h2 { color:#FAFAFA; font-size:16px; margin:0 0 8px; }
  .btn { display:inline-block; padding:12px 28px; background:#F97316; color:#000; font-weight:700; text-decoration:none; border-radius:4px; font-size:13px; letter-spacing:0.05em; margin:16px 0; }
  .footer { border-top:1px solid #27272A; margin-top:32px; padding-top:16px; font-size:11px; color:#52525B; text-align:center; }
  .footer a { color:#71717A; }
  .stat { display:inline-block; text-align:center; padding:12px 16px; margin:4px; background:#18181B; border:1px solid #27272A; border-radius:6px; }
  .stat-value { font-size:20px; font-weight:800; color:#F97316; display:block; }
  .stat-label { font-size:11px; color:#71717A; margin-top:4px; }
</style></head>
<body><div class="container">
  <div class="header"><span class="logo">RESURGO</span></div>
  <div class="content">${content}</div>
  <div class="footer">
    <p>&copy; ${new Date().getFullYear()} Resurgo &middot; <a href="${SITE_URL}/privacy">Privacy</a> &middot; <a href="${SITE_URL}/terms">Terms</a></p>
    <p>You received this because you signed up at <a href="${SITE_URL}">resurgo.life</a>. <a href="${SITE_URL}/settings">Unsubscribe</a></p>
  </div>
</div></body></html>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE EMAIL TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

function welcomeEmail(name: string): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `Your system is ready. Here's your first job.`,
    html: emailTemplate(`
      <h2>Your system is ready</h2>
      <p>Hey ${firstName},</p>
      <p>You signed up. Good.</p>
      <p>Here's the only thing that matters right now: add one habit.</p>
      <p>Not three. Not a goal. One habit you want to build starting today.</p>
      <p>That's it. Takes 30 seconds.</p>
      <a href="${SITE_URL}/habits" class="btn">ADD_MY_FIRST_HABIT</a>
      <p>Everything else — the AI coaches, the goal planning, the weekly reviews — unlocks from there.</p>
      <p>See you tomorrow,<br/>[Founder name]</p>
      <p style="margin-top:16px; font-size:12px; color:#71717A;">P.S. — If you want to go deeper today, open Marcus and type: "Help me plan my next 30 days."</p>
    `),
    text: `Hey ${firstName},\n\nYou signed up. Good.\n\nHere's the only thing that matters right now: add one habit.\n\nNot three. Not a goal. One habit you want to build starting today.\n\nThat's it. Takes 30 seconds.\n\n[ADD_MY_FIRST_HABIT → ${SITE_URL}/habits]\n\nEverything else — the AI coaches, the goal planning, the weekly reviews — unlocks from there.\n\nSee you tomorrow,\n[Founder name]\n\nP.S. — If you want to go deeper today, open Marcus and type: "Help me plan my next 30 days."`,
  };
}

function day2TipsEmail(name: string): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `Why habits die on day 10 (and what stops it)`,
    html: emailTemplate(`
      <h2>Why habits die on day 10 (and what stops it)</h2>
      <p>${firstName},</p>
      <p>80% of new habits are abandoned within 2 weeks. Not because people are lazy. Because the system fails, not the person.</p>
      <p>Research is clear: habits stick when:</p>
      <ol style="padding-left:20px; margin:16px 0;">
        <li style="margin-bottom:12px;"><strong style="color:#F97316;">Specific cue (time + place) ✓</strong></li>
        <li style="margin-bottom:12px;"><strong style="color:#F97316;">Immediate reward ✓</strong></li>
        <li style="margin-bottom:12px;"><strong style="color:#F97316;">System that adjusts when life breaks the pattern ✓</strong></li>
      </ol>
      <p>Resurgo handles #2 and #3 automatically.</p>
      <p>Try this: open Marcus and say "Help me set a cue for your main habit."</p>
      <a href="${SITE_URL}/coach" class="btn">OPEN_MARCUS</a>
      <p style="margin-top:16px;">You're on day 2. Most quit on day 10. You're not most people.</p>
      <p>[Founder name]</p>
    `),
    text: `${firstName},\n\n80% of new habits are abandoned within 2 weeks. Not because people are lazy. Because the system fails, not the person.\n\nResearch is clear: habits stick when:\n1) Specific cue (time + place)\n2) Immediate reward\n3) System that adjusts when life breaks the pattern\n\nResurgo handles #2 and #3 automatically.\n\nTry this: open Marcus and say "Help me set a cue for your main habit."\n\n[OPEN_MARCUS → ${SITE_URL}/coach]\n\nYou're on day 2. Most quit on day 10. You're not most people.\n\n[Founder name]`,
  };
}

function day5GoalEmail(name: string): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `Habits without goals are just routines`,
    html: emailTemplate(`
      <h2>Habits without goals are just routines</h2>
      <p>${firstName},</p>
      <p>You've been tracking habits. That's execution.</p>
      <p>But execution without direction is just motion.</p>
      <p>Your next step: set a 30-day goal in Resurgo.</p>
      <p>Type it in plain English. The AI breaks it into milestones + daily tasks in 90 seconds.</p>
      <p><em>Example:</em> "Get promoted this quarter" → 4 milestones + 12 weekly targets + daily habits.</p>
      <a href="${SITE_URL}/goals" class="btn">SET_MY_GOAL</a>
      <p style="margin-top:16px;">Five minutes. Then you have a full operating plan for the next month.</p>
      <p>[Founder name]</p>
    `),
    text: `${firstName},\n\nYou've been tracking habits. That's execution.\n\nBut execution without direction is just motion.\n\nYour next step: set a 30-day goal in Resurgo.\n\nType it in plain English. The AI breaks it into milestones + daily tasks in 90 seconds.\n\nExample: "Get promoted this quarter" → 4 milestones + 12 weekly targets + daily habits.\n\n[SET_MY_GOAL → ${SITE_URL}/goals]\n\nFive minutes. Then you have a full operating plan for the next month.\n\n[Founder name]`,
  };
}

function day7StreakEmail(name: string, streak: number, habitsCompleted: number): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `You've been at it for 7 days. Here's what that means.`,
    html: emailTemplate(`
      <h2>You've been at it for 7 days. Here's what that means.</h2>
      <p>${firstName},</p>
      <p>Seven days in. You're already in the top 30% of people who sign up for productivity apps.</p>
      <p>The drop-off: 40% never return. 30% quit by day 7.</p>
      <p>You're still here.</p>
      <p>Here's what Week 2 unlocks: pattern recognition. Your coach will start seeing trends in what works for you.</p>
      <div style="text-align:center; margin:20px 0;">
        <div class="stat"><span class="stat-value">${streak}</span><span class="stat-label">Day Streak</span></div>
        <div class="stat"><span class="stat-value">${habitsCompleted}</span><span class="stat-label">Habits Done</span></div>
      </div>
      <a href="${SITE_URL}/dashboard/weekly-review" class="btn">VIEW_MY_WEEK_1_STATS</a>
      <p style="margin-top:16px;">What's the hardest habit to keep? Reply to this email — I read every response.</p>
      <p>[Founder name]</p>
    `),
    text: `${firstName},\n\nSeven days in. You're already in the top 30% of people who sign up for productivity apps.\n\nThe drop-off: 40% never return. 30% quit by day 7.\n\nYou're still here.\n\nHere's what Week 2 unlocks: pattern recognition. Your coach will start seeing trends in what works for you.\n\n${streak}-day streak, ${habitsCompleted} habits completed.\n\n[VIEW_MY_WEEK_1_STATS → ${SITE_URL}/dashboard/weekly-review]\n\nWhat's the hardest habit to keep? Reply to this email — I read every response.\n\n[Founder name]`,
  };
}

function day14CheckinEmail(name: string, level: number, totalXp: number): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `There's a feature you haven't unlocked yet`,
    html: emailTemplate(`
      <h2>There's a feature you haven't unlocked yet</h2>
      <p>${firstName},</p>
      <p>Two weeks in.</p>
      <p>Pro users unlock session memory — your AI coach remembers every conversation, pattern, and goal. Free tier resets context each session.</p>
      <p>After two weeks of data, your Pro coach KNOWS your tendencies. Adjusts automatically.</p>
      <p>Not a hard sell. Just want you to know it exists.</p>
      <a href="${SITE_URL}/pricing" class="btn">SEE_WHAT_PRO_UNLOCKS</a>
      <p style="margin-top:16px;">Still free to use everything you have.</p>
      <p>[Founder name]</p>
    `),
    text: `${firstName},\n\nTwo weeks in.\n\nPro users unlock session memory — your AI coach remembers every conversation, pattern, and goal. Free tier resets context each session.\n\nAfter two weeks of data, your Pro coach KNOWS your tendencies. Adjusts automatically.\n\nNot a hard sell. Just want you to know it exists.\n\n[SEE_WHAT_PRO_UNLOCKS → ${SITE_URL}/pricing]\n\nStill free to use everything you have.\n\n[Founder name]`,
  };
}

function day21HabitEmail(name: string): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `21 days. What's changed?`,
    html: emailTemplate(`
      <h2>21 days — The Tipping Point</h2>
      <p>${firstName},</p>
      <p>21 days is significant.</p>
      <p>Research shows: average habit formation = 66 days, but first 21 creates the neural groove. You've cleared the hardest part.</p>
      <p>What's your biggest win so far?</p>
      <p>Reply to this email. I read every one.</p>
      <p style="margin-top:16px;">And if you want to connect with others: <a href="${SITE_URL}/community" style="color:#F97316;">Join our Discord</a></p>
      <p>[Founder name]</p>
    `),
    text: `${firstName},\n\n21 days is significant.\n\nResearch shows: average habit formation = 66 days, but first 21 creates the neural groove. You've cleared the hardest part.\n\nWhat's your biggest win so far?\n\nReply to this email. I read every one.\n\n[Founder name]`,
  };
}

function day30ReviewEmail(name: string, stats: { streak: number; habits: number; goals: number; level: number }): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `30 days. Your data speaks.`,
    html: emailTemplate(`
      <h2>30 days. Your data speaks.</h2>
      <p>${firstName},</p>
      <p>One month in. Check your dashboard:</p>
      <div style="text-align:center; margin:20px 0;">
        <div class="stat"><span class="stat-value">${stats.habits}</span><span class="stat-label">Total habits tracked</span></div>
        <div class="stat"><span class="stat-value">${stats.streak}</span><span class="stat-label">Longest streak</span></div>
        <div class="stat"><span class="stat-value">${stats.goals}</span><span class="stat-label">Goals completed</span></div>
      </div>
      <p>That's REAL. That's YOURS.</p>
      <p>Here's what Pro unlocks:</p>
      <ul style="padding-left:20px; margin:16px 0;">
        <li><strong style="color:#F97316;">Full coach session memory</strong></li>
        <li><strong style="color:#F97316;">Unlimited goals + habits</strong></li>
        <li><strong style="color:#F97316;">Weekly AI review (pattern + optimization)</strong></li>
        <li><strong style="color:#F97316;">All 5 coaches (Aurora, Phoenix, Nexus)</strong></li>
        <li><strong style="color:#F97316;">Vision Board Studio</strong></li>
      </ul>
      <a href="${SITE_URL}/pricing?promo=MONTH1" class="btn">UNLOCK_PRO_30%_OFF</a>
      <p style="margin-top:8px; font-size:13px; color:#A1A1AA;">For 72 hours only: 30% off first Pro month. Code: MONTH1</p>
      <p style="font-size:12px; color:#71717A;">Free plan doesn't expire. The discount does.</p>
      <p>[Founder name]</p>
    `),
    text: `${firstName},\n\nOne month in. Check your dashboard:\n\n→ Total habits tracked: ${stats.habits}\n→ Longest streak: ${stats.streak}\n→ Goals completed: ${stats.goals}\n\nThat's REAL. That's YOURS.\n\nWhat Pro unlocks:\n→ Full coach session memory\n→ Unlimited goals + habits\n→ Weekly AI review (pattern + optimization)\n→ All 5 coaches (Aurora, Phoenix, Nexus)\n→ Vision Board Studio\n\n[UNLOCK_PRO_30%_OFF → ${SITE_URL}/pricing?promo=MONTH1]\n\nCode: MONTH1\nFree plan doesn't expire. The discount does.\n\n[Founder name]`,
  };
}

function streakAtRiskEmail(name: string, streak: number): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `⚠️ ${firstName}, your ${streak}-day streak is at risk`,
    html: emailTemplate(`
      <h2>Your streak needs you</h2>
      <p>You have a <strong style="color:#F97316;">${streak}-day streak</strong> — don't let it break.</p>
      <p>Even completing one small habit counts. It takes less than 60 seconds.</p>
      <a href="${SITE_URL}/dashboard" class="btn">CHECK IN NOW →</a>
      <p style="font-size:12px; color:#71717A; margin-top:24px;">You can adjust notification settings in <a href="${SITE_URL}/settings" style="color:#F97316;">Settings</a>.</p>
    `),
    text: `Your ${streak}-day streak is at risk! Just one habit to keep it alive: ${SITE_URL}/dashboard`,
  };
}

function earlyNudgeEmail(name: string): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `${firstName}, a quick nudge from your coach 👋`,
    html: emailTemplate(`
      <h2>Just checking in</h2>
      <p>Hey ${firstName} — it's been a couple of days since you last opened Resurgo. That's totally fine. Life happens.</p>
      <p>One tiny action is all it takes to get momentum going again:</p>
      <ul style="padding-left:20px;">
        <li>Check off <strong>one habit</strong> for today</li>
        <li>Or just open the dashboard — your progress is waiting</li>
      </ul>
      <a href="${SITE_URL}/dashboard" class="btn">OPEN DASHBOARD →</a>
      <p style="font-size:12px; color:#71717A; margin-top:24px;">Small actions compound. See you inside.</p>
    `),
    text: `Hey ${firstName}, just checking in — it's been a couple days. One habit is all it takes. ${SITE_URL}/dashboard`,
  };
}

function deepWinBackEmail(name: string, daysAway: number): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `${firstName}, your future self is waiting ⏳`,
    html: emailTemplate(`
      <h2>${daysAway} days away — but your goals aren't going anywhere</h2>
      <p>${firstName}, it's been ${daysAway} days. We're not here to guilt-trip you — we're here because we know what's possible when you show up for yourself.</p>
      <p>Here's the thing: <strong style="color:#FAFAFA;">your data is fully intact.</strong> Every habit log, XP point, and goal you set is right where you left it.</p>
      <p>One decision can change the next 30 days:</p>
      <a href="${SITE_URL}/dashboard" class="btn">START AGAIN RIGHT NOW →</a>
      <p style="margin-top:16px; font-size:13px; color:#A1A1AA;">Or if Resurgo isn't working for you, we'd love to know why — hit reply and tell us honestly.</p>
      <p style="font-size:12px; color:#71717A; margin-top:24px;">No judgment. Just momentum. 🚀</p>
    `),
    text: `${firstName}, ${daysAway} days away — but your goals and progress are still here. One decision changes everything: ${SITE_URL}/dashboard`,
  };
}

function lastChanceWinBackEmail(name: string, daysAway: number): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `${firstName}, one last thing before we stop reaching out`,
    html: emailTemplate(`
      <h2>It's been ${daysAway} days</h2>
      <p>${firstName}, we respect your time — this is our last check-in.</p>
      <p>In the time you've been away, nothing has changed inside Resurgo:</p>
      <ul style="padding-left:20px; color:#A1A1AA;">
        <li>Your habits, goals, and XP are untouched</li>
        <li>Your coach memory is intact</li>
        <li>Your streak data is saved — ready to rebuild</li>
      </ul>
      <p>If you want to come back, one tap is all it takes. If not, we genuinely wish you well — and the door is always open.</p>
      <a href="${SITE_URL}/dashboard" class="btn">COME BACK →</a>
      <p style="margin-top:16px; font-size:13px; color:#A1A1AA;">If you'd rather not hear from us again, <a href="${SITE_URL}/settings" style="color:#A1A1AA;">update your email preferences here</a>.</p>
      <p style="font-size:12px; color:#71717A; margin-top:24px;">No pressure. Just an open door.</p>
    `),
    text: `${firstName}, it's been ${daysAway} days. Your progress is saved. Come back anytime: ${SITE_URL}/dashboard — This is our last check-in. Unsubscribe: ${SITE_URL}/settings`,
  };
}

function winBackEmail(name: string, daysAway: number): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `${firstName}, we saved your progress 💾`,
    html: emailTemplate(`
      <h2>Your goals are waiting</h2>
      <p>It's been ${daysAway} days since your last check-in. That's okay — everyone needs a break sometimes.</p>
      <p>The good news: <strong style="color:#FAFAFA;">all your progress is saved</strong>. Your habits, goals, XP, and streaks are exactly where you left them.</p>
      <p>Getting back on track is simple:</p>
      <ol style="padding-left:20px;">
        <li>Open your dashboard</li>
        <li>Complete just <strong>one</strong> habit</li>
        <li>That's it. You're back.</li>
      </ol>
      <a href="${SITE_URL}/dashboard" class="btn">PICK UP WHERE YOU LEFT OFF →</a>
      <p style="font-size:12px; color:#71717A; margin-top:24px;">No judgment. No guilt. Just progress. 🚀</p>
    `),
    text: `Hey ${firstName}, it's been ${daysAway} days. Your progress is saved — just one habit to get back on track: ${SITE_URL}/dashboard`,
  };
}

function completionCelebrationEmail(name: string, streak: number): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  const messages: Record<number, string> = {
    7:   'Seven days in a row. Most people never make it this far. The compound effect is working.',
    14:  'Two weeks straight. What started as a decision is now a pattern your brain defaults to.',
    21:  'Twenty-one consecutive days. Neuroscience calls this a formed habit. You call it Tuesday.',
    30:  'One full month without missing a day. That is not motivation — that is discipline.',
    60:  'Sixty days. The streak that started as a goal is now part of who you are.',
    100: 'One hundred days. This is what commitment looks like. You built something most people only talk about.',
  };
  const bodyLine = messages[streak] ?? `That is ${streak} days in a row. The compound effect is working.`;
  return {
    subject: `${firstName} — ${streak} days straight`,
    html: emailTemplate(`
      <h2>STREAK_MILESTONE :: ${streak} DAYS</h2>
      <p>${bodyLine}</p>
      <div style="text-align:center; margin:24px 0;">
        <div class="stat"><span class="stat-value">${streak}</span><span class="stat-label">Days in a Row</span></div>
      </div>
      <p>Log today to keep it going. Momentum belongs to the consistent.</p>
      <a href="${SITE_URL}/dashboard" class="btn">CONTINUE THE STREAK →</a>
    `),
    text: `${firstName} — ${streak} days straight.\n\n${bodyLine}\n\nKeep it going: ${SITE_URL}/dashboard`,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUERIES & MUTATIONS (internal)
// ═══════════════════════════════════════════════════════════════════════════════

/** Check if a specific email type has already been sent to a user */
export const hasEmailBeenSent = internalQuery({
  args: { userId: v.id('users'), emailType: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('emailLogs')
      .withIndex('by_userId_emailType', (q: any) =>
        q.eq('userId', args.userId).eq('emailType', args.emailType)
      )
      .first();
    return existing !== null;
  },
});

/** Log an email that was sent */
export const logEmail = internalMutation({
  args: {
    userId: v.id('users'),
    emailType: v.string(),
    success: v.boolean(),
    resendId: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert('emailLogs', {
      userId: args.userId,
      emailType: args.emailType,
      sentAt: Date.now(),
      success: args.success,
      resendId: args.resendId,
      error: args.error,
    });
    return null;
  },
});

/** Get all users with basic stats for lifecycle processing */
export const getUsersForLifecycleEmails = internalQuery({
  args: {},
  returns: v.array(v.object({
    _id: v.id('users'),
    email: v.string(),
    name: v.string(),
    plan: v.string(),
    createdAt: v.number(),
    lastActiveAt: v.optional(v.number()),
    onboardingComplete: v.boolean(),
    streakFreezeCount: v.number(),
  })),
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    return users.map((u) => ({
      _id: u._id,
      email: u.email,
      name: u.name,
      plan: u.plan,
      createdAt: u.createdAt,
      lastActiveAt: u.lastActiveAt,
      onboardingComplete: u.onboardingComplete,
      streakFreezeCount: u.streakFreezeCount,
    }));
  },
});

/** Get user stats for personalized emails */
export const getUserStats = internalQuery({
  args: { userId: v.id('users') },
  returns: v.object({
    currentStreak: v.number(),
    habitsCompleted: v.number(),
    goalsCount: v.number(),
    level: v.number(),
    totalXp: v.number(),
  }),
  handler: async (ctx, args) => {
    // Get gamification profile for level/XP/streak
    const profile = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', args.userId))
      .first();

    // Count completed habit logs
    const habitLogs = await ctx.db
      .query('habitLogs')
      .withIndex('by_userId', (q: any) => q.eq('userId', args.userId))
      .collect();
    const completedHabits = habitLogs.filter((l) => l.status === 'completed').length;

    // Count goals
    const goals = await ctx.db
      .query('goals')
      .withIndex('by_userId', (q: any) => q.eq('userId', args.userId))
      .collect();

    return {
      currentStreak: profile?.currentStreak ?? 0,
      habitsCompleted: completedHabits,
      goalsCount: goals.length,
      level: profile?.level ?? 1,
      totalXp: profile?.totalXP ?? 0,
    };
  },
});

const internalEmailAutomation = (internal as any).emailAutomation;

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN LIFECYCLE ACTION — Called daily by cron
// ═══════════════════════════════════════════════════════════════════════════════

export const processLifecycleEmails = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const users = await ctx.runQuery(internalEmailAutomation.getUsersForLifecycleEmails, {});
    const now = Date.now();
    let sent = 0;
    let skipped = 0;

    for (const user of users) {
      if (!user.email || !user.onboardingComplete) {
        skipped++;
        continue;
      }

      const daysSinceSignup = Math.floor((now - user.createdAt) / DAY_MS);
      const daysSinceActive = user.lastActiveAt
        ? Math.floor((now - user.lastActiveAt) / DAY_MS)
        : daysSinceSignup;

      // ── Day 2: Education email ──
      if (daysSinceSignup >= 2 && daysSinceSignup < 4) {
        const alreadySent = await ctx.runQuery(internalEmailAutomation.hasEmailBeenSent, {
          userId: user._id,
          emailType: 'day2_tips',
        });
        if (!alreadySent) {
          const email = day2TipsEmail(user.name);
          const result = await sendResendEmail({ to: user.email, ...email });
          await ctx.runMutation(internalEmailAutomation.logEmail, {
            userId: user._id,
            emailType: 'day2_tips',
            success: result.ok,
            resendId: result.id,
            error: result.error,
          });
          if (result.ok) sent++;
          continue;
        }
      }

      // ── Day 5: Goal planning email ──
      if (daysSinceSignup >= 5 && daysSinceSignup < 7) {
        const alreadySent = await ctx.runQuery(internalEmailAutomation.hasEmailBeenSent, {
          userId: user._id,
          emailType: 'day5_goal',
        });
        if (!alreadySent) {
          const email = day5GoalEmail(user.name);
          const result = await sendResendEmail({ to: user.email, ...email });
          await ctx.runMutation(internalEmailAutomation.logEmail, {
            userId: user._id,
            emailType: 'day5_goal',
            success: result.ok,
            resendId: result.id,
            error: result.error,
          });
          if (result.ok) sent++;
          continue;
        }
      }

      // ── Day 7: Social proof email ──
      if (daysSinceSignup >= 7 && daysSinceSignup < 9) {
        const alreadySent = await ctx.runQuery(internalEmailAutomation.hasEmailBeenSent, {
          userId: user._id,
          emailType: 'day7_streak',
        });
        if (!alreadySent) {
          const stats = await ctx.runQuery(internalEmailAutomation.getUserStats, {
            userId: user._id,
          });
          const email = day7StreakEmail(user.name, stats.currentStreak, stats.habitsCompleted);
          const result = await sendResendEmail({ to: user.email, ...email });
          await ctx.runMutation(internalEmailAutomation.logEmail, {
            userId: user._id,
            emailType: 'day7_streak',
            success: result.ok,
            resendId: result.id,
            error: result.error,
          });
          if (result.ok) sent++;
          continue;
        }
      }

      // ── Day 14: Premium reveal ──
      if (daysSinceSignup >= 14 && daysSinceSignup < 16) {
        const alreadySent = await ctx.runQuery(internalEmailAutomation.hasEmailBeenSent, {
          userId: user._id,
          emailType: 'day14_checkin',
        });
        if (!alreadySent) {
          const stats = await ctx.runQuery(internalEmailAutomation.getUserStats, {
            userId: user._id,
          });
          const email = day14CheckinEmail(user.name, stats.level, stats.totalXp);
          const result = await sendResendEmail({ to: user.email, ...email });
          await ctx.runMutation(internalEmailAutomation.logEmail, {
            userId: user._id,
            emailType: 'day14_checkin',
            success: result.ok,
            resendId: result.id,
            error: result.error,
          });
          if (result.ok) sent++;
          continue;
        }
      }

      // ── Day 21: Community check-in ──
      if (daysSinceSignup >= 21 && daysSinceSignup < 23) {
        const alreadySent = await ctx.runQuery(internalEmailAutomation.hasEmailBeenSent, {
          userId: user._id,
          emailType: 'day21_habit',
        });
        if (!alreadySent) {
          const email = day21HabitEmail(user.name);
          const result = await sendResendEmail({ to: user.email, ...email });
          await ctx.runMutation(internalEmailAutomation.logEmail, {
            userId: user._id,
            emailType: 'day21_habit',
            success: result.ok,
            resendId: result.id,
            error: result.error,
          });
          if (result.ok) sent++;
          continue;
        }
      }

      // ── Day 30: Data-driven conversion ──
      if (daysSinceSignup >= 30 && daysSinceSignup < 33) {
        const alreadySent = await ctx.runQuery(internalEmailAutomation.hasEmailBeenSent, {
          userId: user._id,
          emailType: 'day30_review',
        });
        if (!alreadySent) {
          const stats = await ctx.runQuery(internalEmailAutomation.getUserStats, {
            userId: user._id,
          });
          const email = day30ReviewEmail(user.name, {
            streak: stats.currentStreak,
            habits: stats.habitsCompleted,
            goals: stats.goalsCount,
            level: stats.level,
          });
          const result = await sendResendEmail({ to: user.email, ...email });
          await ctx.runMutation(internalEmailAutomation.logEmail, {
            userId: user._id,
            emailType: 'day30_review',
            success: result.ok,
            resendId: result.id,
            error: result.error,
          });
           if (result.ok) sent++;
           continue; // max 1 email per user per run
         }
       }

      // ── Win-back day 3: Absent 3 days (early gentle nudge) ──
      if (daysSinceActive >= 3 && daysSinceActive < 5) {
        const alreadySent = await ctx.runQuery(internalEmailAutomation.hasEmailBeenSent, {
          userId: user._id,
          emailType: 'win_back_3d',
        });
        if (!alreadySent) {
          const email = earlyNudgeEmail(user.name);
          const result = await sendResendEmail({ to: user.email, ...email });
          await ctx.runMutation(internalEmailAutomation.logEmail, {
            userId: user._id,
            emailType: 'win_back_3d',
            success: result.ok,
            resendId: result.id,
            error: result.error,
          });
          if (result.ok) sent++;
          continue;
        }
      }

      // ── Streak at risk: Active user who missed yesterday ──
      if (daysSinceActive === 1) {
        const stats = await ctx.runQuery(internalEmailAutomation.getUserStats, {
          userId: user._id,
        });
        if (stats.currentStreak >= 3) {
          // Only send streak-at-risk if they have a meaningful streak
          // Check that we haven't sent one in the last 3 days
          const recentRisk = await ctx.runQuery(internalEmailAutomation.hasEmailBeenSent, {
            userId: user._id,
            emailType: `streak_at_risk_${Math.floor(now / (3 * DAY_MS))}`,
          });
          if (!recentRisk) {
            const email = streakAtRiskEmail(user.name, stats.currentStreak);
            const result = await sendResendEmail({ to: user.email, ...email });
            await ctx.runMutation(internalEmailAutomation.logEmail, {
              userId: user._id,
              emailType: `streak_at_risk_${Math.floor(now / (3 * DAY_MS))}`,
              success: result.ok,
              resendId: result.id,
              error: result.error,
            });
            if (result.ok) sent++;
            continue;
          }
        }
      }

      // ── Completion celebration: Active user who just hit a streak milestone ──
      if (daysSinceActive === 0) {
        const stats = await ctx.runQuery(internalEmailAutomation.getUserStats, {
          userId: user._id,
        });
        const milestones = [7, 14, 21, 30, 60, 100];
        const hitMilestone = milestones.find((m) => stats.currentStreak === m);
        if (hitMilestone !== undefined) {
          const celebKey = `streak_celebration_${hitMilestone}`;
          const alreadySent = await ctx.runQuery(internalEmailAutomation.hasEmailBeenSent, {
            userId: user._id,
            emailType: celebKey,
          });
          if (!alreadySent) {
            const email = completionCelebrationEmail(user.name, hitMilestone);
            const result = await sendResendEmail({ to: user.email, ...email });
            await ctx.runMutation(internalEmailAutomation.logEmail, {
              userId: user._id,
              emailType: celebKey,
              success: result.ok,
              resendId: result.id,
              error: result.error,
            });
            if (result.ok) sent++;
            continue;
          }
        }
      }

      // ── Win-back: Inactive for 7–9 days ──
      if (daysSinceActive >= 7 && daysSinceActive < 10) {
        const alreadySent = await ctx.runQuery(internalEmailAutomation.hasEmailBeenSent, {
          userId: user._id,
          emailType: 'win_back',
        });
        if (!alreadySent) {
          const email = winBackEmail(user.name, daysSinceActive);
          const result = await sendResendEmail({ to: user.email, ...email });
          await ctx.runMutation(internalEmailAutomation.logEmail, {
            userId: user._id,
            emailType: 'win_back',
            success: result.ok,
            resendId: result.id,
            error: result.error,
          });
          if (result.ok) sent++;
          continue;
        }
      }

      // ── Win-back day 14: Inactive 14+ days (stronger re-engagement) ──
      if (daysSinceActive >= 14 && daysSinceActive < 17) {
        const alreadySent = await ctx.runQuery(internalEmailAutomation.hasEmailBeenSent, {
          userId: user._id,
          emailType: 'win_back_14d',
        });
        if (!alreadySent) {
          const email = deepWinBackEmail(user.name, daysSinceActive);
          const result = await sendResendEmail({ to: user.email, ...email });
          await ctx.runMutation(internalEmailAutomation.logEmail, {
            userId: user._id,
            emailType: 'win_back_14d',
            success: result.ok,
            resendId: result.id,
            error: result.error,
          });
          if (result.ok) sent++;
          continue;
        }
      }

      // ── Win-back day 30: Last-chance re-engagement (final outreach) ──
      if (daysSinceActive >= 28 && daysSinceActive < 33) {
        const alreadySent = await ctx.runQuery(internalEmailAutomation.hasEmailBeenSent, {
          userId: user._id,
          emailType: 'win_back_30d',
        });
        if (!alreadySent) {
          const email = lastChanceWinBackEmail(user.name, daysSinceActive);
          const result = await sendResendEmail({ to: user.email, ...email });
          await ctx.runMutation(internalEmailAutomation.logEmail, {
            userId: user._id,
            emailType: 'win_back_30d',
            success: result.ok,
            resendId: result.id,
            error: result.error,
          });
          if (result.ok) sent++;
          continue;
        }
      }
    }

    console.log(`[EmailAutomation] Processed ${users.length} users — sent: ${sent}, skipped: ${skipped}`);
    return null;
  },
});

function leadDay0Email(email: string): EmailContent {
  const name = email.split('@')[0] || 'there';
  return {
    subject: `Welcome to Resurgo — here's your founder execution starter`,
    html: emailTemplate(`
      <h2>Founder System Activated</h2>
      <p>Hey ${name},</p>
      <p>You’re in. Here’s the fastest path to value:</p>
      <ol style="padding-left:20px;">
        <li>Set one weekly founder goal</li>
        <li>Add one daily execution habit</li>
        <li>Run one 25-minute focus sprint</li>
      </ol>
      <a href="${SITE_URL}/sign-up" class="btn">START IN UNDER 10 MINUTES →</a>
      <p>Reply with your biggest execution bottleneck — we read every response.</p>
    `),
    text: `Welcome to Resurgo.\n\nStart in under 10 minutes:\n1) Set one weekly founder goal\n2) Add one daily habit\n3) Run one 25-minute focus sprint\n\nStart: ${SITE_URL}/sign-up`,
  };
}

function leadDay3Email(email: string): EmailContent {
  const name = email.split('@')[0] || 'there';
  return {
    subject: `${name}, still planning too much?`,
    html: emailTemplate(`
      <h2>Planning Is Not Shipping</h2>
      <p>Most founders lose momentum in planning loops.</p>
      <p>Resurgo’s quick loop:</p>
      <ul style="padding-left:20px;">
        <li>Brain dump → AI prioritization</li>
        <li>One daily must-ship task</li>
        <li>Weekly review that adjusts next week</li>
      </ul>
      <a href="${SITE_URL}/indie-hackers" class="btn">SEE THE FOUNDER WORKFLOW →</a>
    `),
    text: `Planning is not shipping.\nUse this loop: brain dump -> prioritize -> one daily must-ship task -> weekly review.\n${SITE_URL}/indie-hackers`,
  };
}

function leadDay7Email(): EmailContent {
  return {
    subject: `Case-study: how founders use Resurgo to ship weekly`,
    html: emailTemplate(`
      <h2>One Weekly Shipping System</h2>
      <p>Founders who win with Resurgo follow one rule: one clear weekly outcome, then daily execution constraints.</p>
      <p>If you want to run this setup, start free and copy the workflow directly.</p>
      <a href="${SITE_URL}/compare" class="btn">COMPARE + START FREE →</a>
    `),
    text: `Founders who win with Resurgo use one weekly outcome + daily execution constraints.\nCompare and start free: ${SITE_URL}/compare`,
  };
}

export const hasLeadEmailBeenSent = internalQuery({
  args: { leadId: v.id('leads'), emailType: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('leadEmailLogs')
      .withIndex('by_leadId_emailType', (q: any) =>
        q.eq('leadId', args.leadId).eq('emailType', args.emailType)
      )
      .first();
    return existing !== null;
  },
});

export const logLeadEmail = internalMutation({
  args: {
    leadId: v.id('leads'),
    email: v.string(),
    emailType: v.string(),
    success: v.boolean(),
    resendId: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert('leadEmailLogs', {
      leadId: args.leadId,
      email: args.email,
      emailType: args.emailType,
      sentAt: Date.now(),
      success: args.success,
      resendId: args.resendId,
      error: args.error,
    });
    return null;
  },
});

export const getUnconvertedLeadsForOutreach = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('leads'),
      email: v.string(),
      capturedAt: v.number(),
      convertedToUser: v.boolean(),
    }),
  ),
  handler: async (ctx) => {
    const leads = await ctx.db.query('leads').collect();
    return leads
      .filter((lead) => !lead.convertedToUser)
      .map((lead) => ({
        _id: lead._id,
        email: lead.email,
        capturedAt: lead.capturedAt,
        convertedToUser: lead.convertedToUser,
      }));
  },
});

export const getUserIdByEmail = internalQuery({
  args: { email: v.string() },
  returns: v.union(v.id('users'), v.null()),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q: any) => q.eq('email', args.email))
      .first();
    return user?._id ?? null;
  },
});

export const markLeadConverted = internalMutation({
  args: { leadId: v.id('leads') },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.leadId, {
      convertedToUser: true,
      convertedAt: Date.now(),
    });
    return null;
  },
});

export const processLeadOutreach = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const leads = await ctx.runQuery(internalEmailAutomation.getUnconvertedLeadsForOutreach, {});
    const now = Date.now();

    for (const lead of leads) {
      const existingUserId = await ctx.runQuery(internalEmailAutomation.getUserIdByEmail, {
        email: lead.email,
      });
      if (existingUserId) {
        await ctx.runMutation(internalEmailAutomation.markLeadConverted, { leadId: lead._id });
        continue;
      }

      const daysSinceCapture = Math.floor((now - lead.capturedAt) / DAY_MS);
      const type =
        daysSinceCapture < 2 ? 'lead_day0' :
        daysSinceCapture >= 3 && daysSinceCapture < 5 ? 'lead_day3' :
        daysSinceCapture >= 7 && daysSinceCapture < 10 ? 'lead_day7' :
        null;

      if (!type) continue;

      const alreadySent = await ctx.runQuery(internalEmailAutomation.hasLeadEmailBeenSent, {
        leadId: lead._id,
        emailType: type,
      });
      if (alreadySent) continue;

      const content =
        type === 'lead_day0' ? leadDay0Email(lead.email) :
        type === 'lead_day3' ? leadDay3Email(lead.email) :
        leadDay7Email();

      const result = await sendResendEmail({ to: lead.email, ...content });
      await ctx.runMutation(internalEmailAutomation.logLeadEmail, {
        leadId: lead._id,
        email: lead.email,
        emailType: type,
        success: result.ok,
        resendId: result.id,
        error: result.error,
      });
    }

    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// SEND WELCOME EMAIL — Triggered on new user creation via ctx.scheduler
// ─────────────────────────────────────────────────────────────────────────────

export const sendWelcomeEmail = internalAction({
  args: {
    userId: v.id('users'),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Dedup: don't send if already sent (in case of double-trigger)
    const alreadySent = await ctx.runQuery(internalEmailAutomation.hasEmailBeenSent, {
      userId: args.userId,
      emailType: 'day0_welcome',
    });
    if (alreadySent) return null;

    const emailContent = welcomeEmail(args.name);
    const result = await sendResendEmail({ to: args.email, ...emailContent });

    await ctx.runMutation(internalEmailAutomation.logEmail, {
      userId: args.userId,
      emailType: 'day0_welcome',
      success: result.ok,
      resendId: result.id,
      error: result.error,
    });

    if (result.ok) {
      console.log(`[EmailAutomation] Welcome email sent to ${args.email}`);
    } else {
      console.error(`[EmailAutomation] Welcome email failed for ${args.email}: ${result.error}`);
    }

    return null;
  },
});
