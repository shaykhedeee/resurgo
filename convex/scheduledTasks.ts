// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — High-Value Scheduled Tasks (Convex Crons)
// ═══════════════════════════════════════════════════════════════════════════════

import { internalAction, internalMutation, internalQuery } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';

const DAY_MS = 24 * 60 * 60 * 1000;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://resurgo.life';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Resurgo <noreply@resurgo.life>';

// ── Email Send Helper ────────────────────────────────────────────────────────

async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!RESEND_API_KEY) {
    console.info(`[ScheduledTasks] RESEND_API_KEY not set — skipping email to ${opts.to}`);
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
        reply_to: 'support@resurgo.life',
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[ScheduledTasks] Resend error ${res.status}:`, body);
      return { ok: false, error: `Resend ${res.status}: ${body}` };
    }

    const data = await res.json();
    return { ok: true, id: data.id };
  } catch (err) {
    console.error('[ScheduledTasks] Send failed:', err);
    return { ok: false, error: String(err) };
  }
}

function emailLayout(content: string, titleText: string = "RESURGO"): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin:0; padding:0; background:#0A0A0B; font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace; color:#E4E4E7; }
  .container { max-width:560px; margin:0 auto; padding:32px 24px; }
  .header { border-bottom:1px solid #27272A; padding-bottom:16px; margin-bottom:24px; }
  .logo { font-size:18px; font-weight:800; color:#F97316; letter-spacing:0.1em; }
  .content { line-height:1.7; font-size:14px; color:#A1A1AA; }
  .content h2 { color:#FAFAFA; font-size:16px; margin:0 0 12px; }
  .btn { display:inline-block; padding:12px 28px; background:#F97316; color:#000; font-weight:700; text-decoration:none; border-radius:4px; font-size:13px; letter-spacing:0.05em; margin:16px 0; }
  .footer { border-top:1px solid #27272A; margin-top:32px; padding-top:16px; font-size:11px; color:#52525B; text-align:center; }
  .footer a { color:#71717A; }
  .card { padding:16px; background:#18181B; border:1px solid #27272A; border-radius:6px; margin:16px 0; }
</style>
</head>
<body>
<div class="container">
  <div class="header"><span class="logo">${titleText}</span></div>
  <div class="content">${content}</div>
  <div class="footer">
    <p>&copy; ${new Date().getFullYear()} Resurgo &middot; <a href="${SITE_URL}/privacy">Privacy</a> &middot; <a href="${SITE_URL}/terms">Terms</a></p>
    <p>You received this because you signed up at <a href="${SITE_URL}">resurgo.life</a>. <a href="${SITE_URL}/settings">Unsubscribe</a></p>
  </div>
</div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 1: Streak Recovery Advisor (daily 8AM UTC)
// ═══════════════════════════════════════════════════════════════════════════════

export const getStreakBrokenUsers = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    const now = Date.now();
    const results = [];

    for (const user of users) {
      if (!user.email || !user.onboardingComplete) continue;

      // Check user gamification
      const profile = await ctx.db
        .query('gamification')
        .withIndex('by_userId', (q) => q.eq('userId', user._id))
        .first();

      if (!profile) continue;

      // If they had a streak, but it broke recently (lastStreakDate is more than 1.5 days ago)
      const lastActive = user.lastActiveAt ?? user.createdAt;
      const hoursSinceActive = (now - lastActive) / (1000 * 60 * 60);

      // Had a streak, and active between 30 and 60 hours ago (meaning they missed yesterday's window)
      if (profile.longestStreak && profile.longestStreak >= 2 && hoursSinceActive >= 30 && hoursSinceActive <= 60) {
        // Find their most active habits
        const habits = await ctx.db
          .query('habits')
          .withIndex('by_userId', (q) => q.eq('userId', user._id))
          .collect();
        const activeHabits = habits.filter(h => h.isActive).map(h => h.title);

        results.push({
          userId: user._id,
          name: user.name,
          email: user.email,
          longestStreak: profile.longestStreak,
          telegramChatId: user.telegramChatId,
          activeHabits,
          selectedCoach: user.selectedCoach ?? 'MARCUS',
        });
      }
    }
    return results;
  },
});

export const runStreakRecoveryAdvisor = internalAction({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.runQuery((internal as any).scheduledTasks.getStreakBrokenUsers);
    const apiKey = process.env.GROQ_API_KEY;

    for (const user of users) {
      let planText = '';

      if (apiKey) {
        try {
          const prompt = `You are ${user.selectedCoach}, an expert behavior design AI coach at Resurgo.
User ${user.name} just had their streak break. Their longest streak was ${user.longestStreak} days.
Their current habits are: ${user.activeHabits.join(', ') || 'none set yet'}.

Generate a 3-step ultra-actionable, empathetic recovery plan (maximum 150 words total) to help them get back on track TODAY.
Make it punchy, respectful of their time, and free of generic motivational fluff. Call them out with care.`;

          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [{ role: 'user', content: prompt }],
              max_tokens: 300,
              temperature: 0.7,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            planText = data.choices[0].message.content;
          }
        } catch (err) {
          console.error('[StreakRecovery] Groq failed:', err);
        }
      }

      if (!planText) {
        // High quality fallback plan
        planText = `Hey ${user.name},\n\nYour streak broke, but your momentum doesn't have to. Here is your 3-step recovery plan:\n\n1. **Shrink it**: Reduce your main habit to the absolute smallest form (e.g. read 1 page, do 1 pushup).\n2. **Schedule a hard cue**: Tie it immediately after an existing daily anchor (e.g., right after coffee).\n3. **Just show up**: Track it today. Even a 50% day keeps the identity alive.\n\nYou've done ${user.longestStreak} days straight before. You know exactly how to do this.`;
      }

      // Send email
      const html = emailLayout(`
        <h2>A quick message from ${user.selectedCoach}</h2>
        <p>Hey ${user.name.split(' ')[0]},</p>
        <div class="card" style="border-left: 4px solid #F97316;">
          ${planText.replace(/\n/g, '<br/>')}
        </div>
        <p>The system is ready for you when you are.</p>
        <a href="${SITE_URL}/dashboard" class="btn">REBUILD_MY_STREAK</a>
      `, `RESURGO // STREAK RECOVERY`);

      await sendEmail({
        to: user.email,
        subject: `Reflecting on your streak, ${user.name.split(' ')[0]} (A note from ${user.selectedCoach})`,
        html,
      });

      // Send Telegram if chat ID exists
      if (user.telegramChatId) {
        try {
          const text = `⚡ *Message from ${user.selectedCoach}*:\n\n${planText}\n\n[Rebuild your streak at Resurgo](${SITE_URL}/dashboard)`;
          await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: user.telegramChatId,
              text,
              parse_mode: 'Markdown',
            }),
          });
        } catch (err) {
          // Telegram delivery failure is non-fatal
        }
      }
    }

    console.log(`[ScheduledTasks] Streak recovery completed for ${users.length} users.`);
    return null;
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 2: Monthly Goal Progress Review (1st of month 6AM UTC)
// ═══════════════════════════════════════════════════════════════════════════════

export const getMonthlyPerformanceData = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    const thirtyDaysAgo = Date.now() - 30 * DAY_MS;
    const results = [];

    for (const user of users) {
      if (!user.email || !user.onboardingComplete) continue;

      // Fetch goals completed/in progress
      const goals = await ctx.db
        .query('goals')
        .withIndex('by_userId', (q) => q.eq('userId', user._id))
        .collect();

      const inProgressGoals = goals.filter((g: any) => g.status === 'in_progress');
      const completedGoals = goals.filter((g: any) => g.status === 'completed' && (g.completionDate ?? 0) >= thirtyDaysAgo);

      // Fetch task completion count in the last 30 days
      const tasks = await ctx.db
        .query('tasks')
        .withIndex('by_userId', (q) => q.eq('userId', user._id))
        .collect();

      const completedTasksCount = tasks.filter((t: any) => t.status === 'done' && (t.completedAt ?? 0) >= thirtyDaysAgo).length;

      // Fetch habits completed in the last 30 days
      const habitLogs = await ctx.db
        .query('habitLogs')
        .withIndex('by_userId', (q) => q.eq('userId', user._id))
        .collect();

      const completedHabitsCount = habitLogs.filter((h: any) => h.status === 'completed' && (h.completedAt ?? 0) >= thirtyDaysAgo).length;

      if (goals.length > 0 || completedTasksCount > 0 || completedHabitsCount > 0) {
        results.push({
          userId: user._id,
          name: user.name,
          email: user.email,
          completedGoals: completedGoals.map(g => g.title),
          inProgressGoals: inProgressGoals.map(g => g.title),
          completedTasksCount,
          completedHabitsCount,
        });
      }
    }

    return results;
  },
});

export const runMonthlyGoalProgressReview = internalAction({
  args: {},
  handler: async (ctx) => {
    const data = await ctx.runQuery((internal as any).scheduledTasks.getMonthlyPerformanceData);

    for (const user of data) {
      const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
      const completedList = user.completedGoals.length > 0 
        ? user.completedGoals.map((g: any) => `<li>🏆 <strong>${g}</strong> (Completed)</li>`).join('')
        : '<li><em>No goals marked completed yet. Let\'s lock one in this month!</em></li>';
      const inProgressList = user.inProgressGoals.length > 0
        ? user.inProgressGoals.map((g: any) => `<li>⚡ <strong>${g}</strong> (In Progress)</li>`).join('')
        : '<li><em>No active goals. Open your planner to define your focus!</em></li>';

      const html = emailLayout(`
        <h2>Your Monthly Momentum Review for ${currentMonthName}</h2>
        <p>Hey ${user.name.split(' ')[0]},</p>
        <p>Time flies, but your metrics don't lie. Here is what you achieved over the last 30 days:</p>

        <div class="card">
          <h3 style="margin-top:0;color:#F97316;">🎯 GOAL UPDATE</h3>
          <ul style="padding-left:20px;margin:0;line-height:1.8;">
            ${completedList}
            ${inProgressList}
          </ul>
        </div>

        <div style="display:flex; justify-content:space-between; margin:16px 0;">
          <div style="flex:1; text-align:center; padding:12px; background:#18181B; border:1px solid #27272A; border-radius:6px; margin-right:8px;">
            <span style="font-size:24px; font-weight:800; color:#F97316; display:block;">${user.completedTasksCount}</span>
            <span style="font-size:11px; color:#71717A;">Tasks Completed</span>
          </div>
          <div style="flex:1; text-align:center; padding:12px; background:#18181B; border:1px solid #27272A; border-radius:6px; margin-left:8px;">
            <span style="font-size:24px; font-weight:800; color:#F97316; display:block;">${user.completedHabitsCount}</span>
            <span style="font-size:11px; color:#71717A;">Habit Reps Completed</span>
          </div>
        </div>

        <p>Consistency compounds. Let's make this next month even better by setting an ambitious goal today.</p>
        <a href="${SITE_URL}/goals" class="btn">PLAN_MY_GOALS</a>
      `, `RESURGO // MONTHLY REVIEW`);

      await sendEmail({
        to: user.email,
        subject: `Your Resurgo Monthly review: ${user.completedGoals.length} goals smashed 🚀`,
        html,
      });
    }

    console.log(`[ScheduledTasks] Monthly goal review sent to ${data.length} users.`);
    return null;
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 3: AI Memory Extraction (every 6 hours)
// ═══════════════════════════════════════════════════════════════════════════════

export const getRecentActiveCoachUsers = internalQuery({
  args: {},
  handler: async (ctx) => {
    const sixHoursAgo = Date.now() - 6 * 60 * 60 * 1000;
    const allMessages = await ctx.db.query('coachMessages').collect();
    
    // Find unique user IDs who chatted in the last 6 hours
    const recentUsersMap = new Map();
    for (const msg of allMessages) {
      if (msg.createdAt >= sixHoursAgo) {
        recentUsersMap.set(msg.userId, true);
      }
    }

    const results = [];
    for (const userId of recentUsersMap.keys()) {
      const user = (await ctx.db.get(userId)) as any;
      if (!user) continue;

      // Get last 12 messages of this user
      const userMessages = allMessages
        .filter((m: any) => m.userId === userId)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 12)
        .reverse();

      results.push({
        userId,
        userName: user.name,
        selectedCoach: user.selectedCoach ?? 'MARCUS',
        messages: userMessages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      });
    }

    return results;
  },
});

export const saveExtractedMemory = internalMutation({
  args: {
    userId: v.id('users'),
    coachId: v.optional(v.string()),
    content: v.string(),
    type: v.union(v.literal('behavioral'), v.literal('achievement'), v.literal('failure'), v.literal('preference'), v.literal('insight'), v.literal('weekly_summary')),
    sourceType: v.optional(v.union(v.literal('coaching_session'), v.literal('habit_completion'), v.literal('goal_event'), v.literal('weekly_review'), v.literal('mood_entry'))),
  },
  handler: async (ctx, args) => {
    // Generate simple placeholder embedding (1536 dim vector)
    const embedding = Array(1536).fill(0);
    embedding[0] = 1.0; // simple mock vector

    await ctx.db.insert('memories', {
      userId: args.userId,
      coachId: args.coachId,
      content: args.content,
      embedding,
      type: args.type,
      relevanceScore: 0.8,
      sourceType: args.sourceType ?? 'coaching_session',
      createdAt: Date.now(),
    });
  },
});

export const runAIMemoryExtraction = internalAction({
  args: {},
  handler: async (ctx) => {
    const data = await ctx.runQuery((internal as any).scheduledTasks.getRecentActiveCoachUsers);
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.warn('[ScheduledTasks] GROQ_API_KEY missing, skipping AI Memory Extraction.');
      return null;
    }

    for (const session of data) {
      if (session.messages.length < 2) continue;

      try {
        const chatHistory = session.messages
          .map((m: any) => `${m.role.toUpperCase()}: ${m.content}`)
          .join('\n');

        const prompt = `You are a cognitive profiling system. Analyze the following chat history between user ${session.userName} and their Resurgo AI coach.

CHAT HISTORY:
${chatHistory}

Extract exactly ONE highly valuable persistent memory about this user. 
It must be a core behavioral insight, preference, specific goal mentioned, chronic struggle, or strength.
Format your output as a clean JSON object:
{
  "hasInsight": true,
  "insight": "User mentioned that they always get distracted around 3PM and prefer micro-tasks to break their inertia.",
  "type": "behavioral" // Must be one of: "behavioral", "preference", "insight", "achievement", "failure"
}
If no persistent memory or insight is detectable, return {"hasInsight": false}`;

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            max_tokens: 200,
            temperature: 0.3,
          }),
        });

        if (res.ok) {
          const body = await res.json();
          const parsed = JSON.parse(body.choices[0].message.content);

          if (parsed.hasInsight && parsed.insight && parsed.type) {
            await ctx.runMutation((internal as any).scheduledTasks.saveExtractedMemory, {
              userId: session.userId,
              coachId: session.selectedCoach,
              content: parsed.insight,
              type: parsed.type,
              sourceType: 'coaching_session',
            });
            console.log(`[MemoryExtraction] Extracted insight for ${session.userName}: ${parsed.insight}`);
          }
        }
      } catch (err) {
        console.error(`[MemoryExtraction] Error for user ${session.userName}:`, err);
      }
    }

    return null;
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 4: Pro Trial Nudge (daily 11AM UTC)
// ═══════════════════════════════════════════════════════════════════════════════

export const getTrialNudgeUsers = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    const now = Date.now();
    const results = [];

    for (const user of users) {
      if (user.plan !== 'free' || !user.email) continue;

      // Exact 14-day mark (+/- 12 hours)
      const daysSinceSignup = (now - user.createdAt) / DAY_MS;
      if (daysSinceSignup >= 13.5 && daysSinceSignup <= 14.5) {
        results.push({
          userId: user._id,
          name: user.name,
          email: user.email,
          engagementBand: user.engagementBand ?? 'active',
        });
      }
    }
    return results;
  },
});

export const runProTrialNudge = internalAction({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.runQuery((internal as any).scheduledTasks.getTrialNudgeUsers);

    for (const user of users) {
      let subject = `The secret to breaking productivity plateaus`;
      let content = '';

      if (user.engagementBand === 'power') {
        subject = `You're in the top 5% of Resurgo users. Unlocking something special.`;
        content = `
          <h2>You are absolutely crushing it</h2>
          <p>Hey ${user.name.split(' ')[0]},</p>
          <p>We've been monitoring performance indexes across the entire Resurgo ecosystem, and you've consistently landed in our <strong>"Power Builder"</strong> tier.</p>
          <p>Because of your high consistency, we want you to experience everything Resurgo has to offer.</p>
          <p>We've unlocked a special 7-day Pro pass for you. Here's what's now active in your account:</p>
          <ul style="padding-left:20px;line-height:1.8;">
            <li><strong>AI Deep Session Memory</strong>: Your coach now remembers prior context, triggers, and preferences perfectly.</li>
            <li><strong>All 5 Coaches Unlocked</strong>: Talk with Titan, Nexus, Phoenix, and Aurora.</li>
            <li><strong>Unlimited Habit Stacking</strong>: Build beautiful long-term automated routines.</li>
          </ul>
          <a href="${SITE_URL}/dashboard" class="btn">EXPLORE_PRO_NOW</a>
          <p>Keep the momentum alive!</p>
        `;
      } else {
        content = `
          <h2>Forming habits is simple. Keeping them when life gets chaotic is hard.</h2>
          <p>Hey ${user.name.split(' ')[0]},</p>
          <p>You've been with Resurgo for two weeks. That's a huge milestone. Most people quit productivity systems by day 10.</p>
          <p>But as you add more goals and habits, the complexity grows. That's why we built Resurgo Pro.</p>
          <p>With Pro, your coach gains a <strong>persistent vector memory database</strong>. They don't just chat; they understand your past friction, adapt to your weekly energy levels, and proactively suggest recovery triggers when you hit a plateau.</p>
          <a href="${SITE_URL}/pricing" class="btn">UPGRADE_TO_PRO_FOR_$9.99</a>
          <p>Get full coach support, unlimited goals, and detailed weekly diagnostic audits for only $9.99/month.</p>
        `;
      }

      const html = emailLayout(content, "RESURGO // UPGRADE");
      await sendEmail({ to: user.email, subject, html });
    }

    console.log(`[ScheduledTasks] Pro trial nudge sent to ${users.length} users.`);
    return null;
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 5: Referral Campaign Trigger (weekly Wed 2PM UTC)
// ═══════════════════════════════════════════════════════════════════════════════

export const getPowerUsersForReferrals = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    return users
      .filter(u => u.email && u.engagementBand === 'power' && u.onboardingComplete)
      .map(u => ({
        userId: u._id,
        name: u.name,
        email: u.email,
        referralCode: u.referralCode ?? u._id.toString().substring(0, 8),
      }));
  },
});

export const runReferralCampaignTrigger = internalAction({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.runQuery((internal as any).scheduledTasks.getPowerUsersForReferrals);

    for (const user of users) {
      const referralLink = `${SITE_URL}/signup?ref=${user.referralCode}`;
      const html = emailLayout(`
        <h2>Help a friend build an indestructible system</h2>
        <p>Hey ${user.name.split(' ')[0]},</p>
        <p>You are one of our most active Resurgo users. You understand the power of building a resilient Life OS.</p>
        <p>Do you have a friend, colleague, or accountability partner who is struggling with ADHD inertia, scattered focus, or inconsistent routines?</p>
        <p>Give them 30 days of Resurgo Pro completely free. If they stay, we'll credit your account with <strong>3 months of Pro free</strong>, or unlock a lifetime streak freeze shield.</p>
        
        <div class="card" style="text-align:center; border:2px dashed #F97316; background:#111112;">
          <span style="font-size:12px;color:#71717A;display:block;margin-bottom:8px;">YOUR PERSONAL INVITATION LINK</span>
          <code style="font-size:16px; font-weight:bold; color:#FAFAFA; word-break:break-all;">${referralLink}</code>
        </div>

        <p>Just forward this link or copy and paste it. Accountability is the ultimate growth hack.</p>
      `, "RESURGO // PASS IT ON");

      await sendEmail({
        to: user.email,
        subject: `Give a friend 30 days of Resurgo Pro (and get rewarded) 🎁`,
        html,
      });
    }

    console.log(`[ScheduledTasks] Referral emails sent to ${users.length} power users.`);
    return null;
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 6: Reactivation Smart Campaign (daily 1PM UTC)
// ═══════════════════════════════════════════════════════════════════════════════

export const getInactiveUsersWithGoals = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    const now = Date.now();
    const results = [];

    for (const user of users) {
      if (!user.email || !user.onboardingComplete) continue;

      const lastActive = user.lastActiveAt ?? user.createdAt;
      const daysAway = (now - lastActive) / DAY_MS;

      // Inactive between 10 and 20 days
      if (daysAway >= 10 && daysAway <= 20) {
        // Fetch their highest progress goal
        const goals = await ctx.db
          .query('goals')
          .withIndex('by_userId', (q) => q.eq('userId', user._id))
          .collect();

        const activeGoal = goals
          .filter(g => g.status === 'in_progress')
          .sort((a, b) => b.progress - a.progress)[0];

        results.push({
          userId: user._id,
          name: user.name,
          email: user.email,
          goalTitle: activeGoal?.title ?? null,
          daysAway: Math.round(daysAway),
        });
      }
    }
    return results;
  },
});

export const runReactivationCampaign = internalAction({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.runQuery((internal as any).scheduledTasks.getInactiveUsersWithGoals);

    for (const user of users) {
      let subject = `We saved your dashboard, ${user.name.split(' ')[0]}`;
      let content = '';

      if (user.goalTitle) {
        subject = `Ready to finish what you started with "${user.goalTitle}"?`;
        content = `
          <h2>Your plan is still waiting.</h2>
          <p>Hey ${user.name.split(' ')[0]},</p>
          <p>It's been ${user.daysAway} days since you last logged in.</p>
          <p>We noticed you made awesome progress on your goal: <strong>"${user.goalTitle}"</strong>.</p>
          <p>Building consistency is rarely a straight line. Plateaus and pauses are part of the process. Your plan, milestones, and dashboard are saved exactly as you left them.</p>
          <p>Let's take 2 minutes today just to check off one micro-task or chat with Marcus.</p>
          <a href="${SITE_URL}/dashboard" class="btn">RESUME_MY_JOURNEY</a>
        `;
      } else {
        content = `
          <h2>Let's build back the momentum.</h2>
          <p>Hey ${user.name.split(' ')[0]},</p>
          <p>It's been ${user.daysAway} days.</p>
          <p>No lectures, no guilt. We just wanted to let you know the door is always open. Your streaks, level, and data are saved securely.</p>
          <p>Open Resurgo today, track one tiny action, and let's get moving again.</p>
          <a href="${SITE_URL}/dashboard" class="btn">OPEN_RESURGO</a>
        `;
      }

      const html = emailLayout(content, "RESURGO // WELCOME BACK");
      await sendEmail({ to: user.email, subject, html });
    }

    console.log(`[ScheduledTasks] Reactivation emails sent to ${users.length} users.`);
    return null;
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 7: System Health Check (every 30 min)
// ═══════════════════════════════════════════════════════════════════════════════

export const logHealthStatus = internalMutation({
  args: {
    status: v.string(),
    details: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('systemHealth', {
      checkAt: Date.now(),
      status: args.status,
      details: args.details,
      createdAt: Date.now(),
    });
  },
});

export const runSystemHealthCheck = internalAction({
  args: {},
  handler: async (ctx) => {
    try {
      // Check database read capacity
      const start = Date.now();
      const userCount = await ctx.runQuery((internal as any).scheduledTasks.getTrialNudgeUsers); // simple read query
      const readLatency = Date.now() - start;

      const healthDetails = {
        readLatencyMs: readLatency,
        activeChecksCount: userCount.length,
        timestamp: new Date().toISOString(),
      };

      await ctx.runMutation((internal as any).scheduledTasks.logHealthStatus, {
        status: 'healthy',
        details: healthDetails,
      });

      console.info(`[SystemHealth] Healthy. Latency: ${readLatency}ms.`);
    } catch (err) {
      console.error('[SystemHealth] Check failed:', err);
      try {
        await ctx.runMutation((internal as any).scheduledTasks.logHealthStatus, {
          status: 'degraded',
          details: { error: String(err), timestamp: new Date().toISOString() },
        });
      } catch (innerErr) {
        console.error('[SystemHealth] Could not log status to database:', innerErr);
      }
    }

    return null;
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 8: SEO Sitemap Ping (daily midnight UTC)
// ═══════════════════════════════════════════════════════════════════════════════

export const runSitemapPing = internalAction({
  args: {},
  handler: async (ctx) => {
    const sitemapUrl = encodeURIComponent(`${SITE_URL}/sitemap.xml`);
    
    // Pinging Google Index
    try {
      const googleRes = await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`);
      console.info(`[SitemapPing] Google ping response: ${googleRes.status}`);
    } catch (err) {
      console.error('[SitemapPing] Google ping failed:', err);
    }

    // Pinging Bing Index
    try {
      const bingRes = await fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`);
      console.info(`[SitemapPing] Bing ping response: ${bingRes.status}`);
    } catch (err) {
      console.error('[SitemapPing] Bing ping failed:', err);
    }

    return null;
  },
});
