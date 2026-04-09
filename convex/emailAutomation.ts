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
    subject: `${firstName}, your execution system is live`,
    html: emailTemplate(`
      <h2>SYSTEM_BOOT :: Welcome, ${firstName}</h2>
      <p>Your Resurgo account is active. You now have a personal AI execution layer built around your goals, habits, and daily decisions.</p>
      <p style="margin:16px 0;">Here is how to get your first win in the next 10 minutes:</p>
      <ol style="padding-left:20px; margin:16px 0;">
        <li style="margin-bottom:8px;"><strong>Set your first goal</strong> — Go to Goals, type one thing you want to achieve, and let AI decompose it into milestones and daily tasks.</li>
        <li style="margin-bottom:8px;"><strong>Add 2 daily habits</strong> — Start with habits you already do (morning coffee, end-of-day review). Track them for 3 days straight and a streak begins.</li>
        <li style="margin-bottom:8px;"><strong>Talk to your coach</strong> — Open the Coach tab and tell Marcus or Titan what you are working on. They will build a plan from your actual data.</li>
      </ol>
      <p><strong>Your plan access:</strong></p>
      <ul style="padding-left:20px; margin:8px 0;">
        <li>3 active goals</li>
        <li>5 habit check-ins per day</li>
        <li>10 AI messages per day</li>
        <li>2 coaches: Marcus (Stoic Strategist) + Titan (Physical Performance)</li>
      </ul>
      <p style="margin:16px 0;">When you are ready to remove all limits, Pro starts at $4.99/month — or $49.99 once, forever.</p>
      <a href="${SITE_URL}/goals" class="btn">OPEN_COMMAND_CENTER</a>
      <p style="margin-top:16px; font-size:12px; color:#52525B;">If you have any questions, reply to this email or message us at support@resurgo.life</p>
    `),
    text: `Welcome to Resurgo, ${firstName}.\n\nYour execution system is live. In the next 10 minutes:\n1. Set your first goal (AI will decompose it for you)\n2. Add 2 daily habits\n3. Talk to your coach — tell Marcus or Titan what you are working on\n\nFree plan: 3 goals, 5 habits/day, 10 AI messages/day, 2 coaches (Marcus + Titan).\nPro: $4.99/month or $49.99 lifetime.\n\nGet started: ${SITE_URL}/goals\n\nQuestions? Reply here or email support@resurgo.life`,
  };
}

function day3TipsEmail(name: string): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `${firstName}, 3 quick wins for your first week 🎯`,
    html: emailTemplate(`
      <h2>Your first 3 days — nice work showing up!</h2>
      <p>Most people quit before Day 3. You didn't. Here are 3 things that'll 10× your results this week:</p>
      <ol style="padding-left:20px; margin:16px 0;">
        <li style="margin-bottom:12px;"><strong style="color:#F97316;">Stack your habits</strong> — Attach a new habit to something you already do. "After I pour my coffee, I'll write 3 priorities."</li>
        <li style="margin-bottom:12px;"><strong style="color:#F97316;">Use the 2-minute rule</strong> — If a habit takes less than 2 minutes, do it now. Start embarrassingly small.</li>
        <li style="margin-bottom:12px;"><strong style="color:#F97316;">Talk to your AI Coach</strong> — Ask for a personalized plan. The AI gets smarter the more you use it.</li>
      </ol>
      <a href="${SITE_URL}/dashboard" class="btn">OPEN DASHBOARD →</a>
      <p style="margin-top:16px;">Remember: consistency > intensity. One small win today compounds into transformation.</p>
    `),
    text: `Hey ${firstName}! 3 days in — here are your quick wins: 1) Stack habits onto existing routines, 2) Use the 2-minute rule, 3) Talk to your AI Coach. ${SITE_URL}/dashboard`,
  };
}

function day7StreakEmail(name: string, streak: number, habitsCompleted: number): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `🔥 One week down, ${firstName}! Here's your scorecard`,
    html: emailTemplate(`
      <h2>Week 1 Complete!</h2>
      <p>You've been showing up for <strong>7 days</strong>. That puts you in the top 20% of users who actually stick with it.</p>
      <div style="text-align:center; margin:20px 0;">
        <div class="stat"><span class="stat-value">${streak}</span><span class="stat-label">Day Streak</span></div>
        <div class="stat"><span class="stat-value">${habitsCompleted}</span><span class="stat-label">Habits Done</span></div>
      </div>
      <p><strong style="color:#FAFAFA;">Pro tip for Week 2:</strong> Set a "Weekly Review" every Sunday. Reflect on what worked, adjust what didn't. The review is where real growth happens.</p>
      <a href="${SITE_URL}/dashboard/weekly-review" class="btn">START WEEKLY REVIEW →</a>
    `),
    text: `Week 1 done! ${streak}-day streak, ${habitsCompleted} habits completed. Pro tip: Set a Sunday weekly review. ${SITE_URL}/dashboard/weekly-review`,
  };
}

function day14CheckinEmail(name: string, level: number, totalXp: number): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `${firstName}, you're building real momentum 📈`,
    html: emailTemplate(`
      <h2>Two Weeks of Growth</h2>
      <p>14 days. That's when habits start becoming automatic. Your brain is literally rewiring right now.</p>
      <div style="text-align:center; margin:20px 0;">
        <div class="stat"><span class="stat-value">LVL ${level}</span><span class="stat-label">Current Level</span></div>
        <div class="stat"><span class="stat-value">${totalXp}</span><span class="stat-label">Total XP</span></div>
      </div>
      <p><strong style="color:#FAFAFA;">Unlock more:</strong></p>
      <ul style="padding-left:20px;">
        <li>Try a <strong>Focus Session</strong> — Pomodoro-style deep work blocks</li>
        <li>Set a <strong>Milestone</strong> for your biggest goal</li>
        <li>Explore the <strong>Insights</strong> tab to see your patterns</li>
      </ul>
      <a href="${SITE_URL}/dashboard" class="btn">CONTINUE YOUR JOURNEY →</a>
    `),
    text: `2 weeks of growth! Level ${level}, ${totalXp} XP. Try Focus Sessions and Milestones to level up faster. ${SITE_URL}/dashboard`,
  };
}

function day21HabitEmail(name: string): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `${firstName}, the 21-day mark — your habits are becoming automatic 🧠`,
    html: emailTemplate(`
      <h2>21 Days — The Tipping Point</h2>
      <p>Research shows it takes 21-66 days for a behavior to become automatic. You're in the zone.</p>
      <p>Now is the perfect time to:</p>
      <ul style="padding-left:20px;">
        <li><strong style="color:#F97316;">Level up a habit</strong> — Increase difficulty or duration slightly</li>
        <li><strong style="color:#F97316;">Add a new habit</strong> — Your foundation is solid enough to expand</li>
        <li><strong style="color:#F97316;">Set a 90-day goal</strong> — Think bigger. Your discipline can handle it.</li>
      </ul>
      <a href="${SITE_URL}/dashboard/goals" class="btn">SET A NEW GOAL →</a>
      <p style="margin-top:16px; font-size:12px; color:#71717A;">You're building something most people only talk about. Keep going.</p>
    `),
    text: `21 days — your habits are becoming automatic! Level up a habit, add a new one, or set a 90-day goal. ${SITE_URL}/dashboard/goals`,
  };
}

function day30ReviewEmail(name: string, stats: { streak: number; habits: number; goals: number; level: number }): EmailContent {
  const firstName = name.split(' ')[0] || 'there';
  return {
    subject: `🏆 ${firstName}, your 30-day transformation report`,
    html: emailTemplate(`
      <h2>30-Day Milestone Achieved!</h2>
      <p>One month ago, you made a decision. Today, you have <em>proof</em> it was the right one.</p>
      <div style="text-align:center; margin:20px 0;">
        <div class="stat"><span class="stat-value">${stats.streak}</span><span class="stat-label">Best Streak</span></div>
        <div class="stat"><span class="stat-value">${stats.habits}</span><span class="stat-label">Habits Done</span></div>
        <div class="stat"><span class="stat-value">${stats.goals}</span><span class="stat-label">Goals Set</span></div>
        <div class="stat"><span class="stat-value">LVL ${stats.level}</span><span class="stat-label">Level</span></div>
      </div>
      <p><strong style="color:#FAFAFA;">What's next?</strong></p>
      <p>Consider upgrading to <strong style="color:#F97316;">Resurgo Pro</strong> to unlock unlimited AI coaching, advanced analytics, and priority features.</p>
      <a href="${SITE_URL}/pricing" class="btn">EXPLORE PRO →</a>
      <p style="margin-top:8px;"><a href="${SITE_URL}/dashboard" style="color:#F97316; font-size:13px;">Or continue crushing it on Free →</a></p>
    `),
    text: `30-day milestone! Streak: ${stats.streak}, Habits: ${stats.habits}, Goals: ${stats.goals}, Level: ${stats.level}. Explore Pro: ${SITE_URL}/pricing`,
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

      // ── Day 3: Quick tips email ──
      if (daysSinceSignup >= 3 && daysSinceSignup < 5) {
        const alreadySent = await ctx.runQuery(internalEmailAutomation.hasEmailBeenSent, {
          userId: user._id,
          emailType: 'day3_tips',
        });
        if (!alreadySent) {
          const email = day3TipsEmail(user.name);
          const result = await sendResendEmail({ to: user.email, ...email });
          await ctx.runMutation(internalEmailAutomation.logEmail, {
            userId: user._id,
            emailType: 'day3_tips',
            success: result.ok,
            resendId: result.id,
            error: result.error,
          });
          if (result.ok) sent++;
          continue; // max 1 email per user per run
        }
      }

      // ── Day 7: Streak celebration ──
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

      // ── Day 14: Feature discovery ──
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

      // ── Day 21: Habit consolidation ──
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

      // ── Day 30: Milestone + upsell ──
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
          continue;
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
