// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Weekly Intelligence Cron
// Generates personalized AI performance reports every Sunday night at 8PM UTC.
// Each report includes behavioral insights, win of the week, improvement areas,
// and a personalized coach message. Delivered in-app + via Telegram.
// ═══════════════════════════════════════════════════════════════════════════════

import { internalAction, internalMutation, internalQuery } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';

// ─── Query: Get all active users for weekly report ───────────────────────────
export const getActiveUsersForWeeklyReport = internalQuery({
  args: {},
  handler: async (ctx) => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const users = await ctx.db.query('users').collect();
    // Only generate reports for users active in the last 14 days
    const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
    return users.filter(
      (u) => u.lastActiveAt && u.lastActiveAt > twoWeeksAgo
    );
  },
});

// ─── Query: Get user's week metrics ──────────────────────────────────────────
export const getUserWeekMetrics = internalQuery({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1);
    monday.setHours(0, 0, 0, 0);
    const weekStart = monday.toISOString().split('T')[0];

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const weekEnd = sunday.toISOString().split('T')[0];

    // Get daily plans for the week
    const dailyPlans = await ctx.db
      .query('dailyPlans')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect();
    const weekPlans = dailyPlans.filter(
      (p) => p.date >= weekStart && p.date <= weekEnd
    );

    // Aggregate task completion
    const tasksCompleted = weekPlans.reduce((sum, p) => sum + (p.tasksCompletedCount ?? 0), 0);
    const tasksTotal = weekPlans.reduce((sum, p) => sum + (p.tasksTotalCount ?? 0), 0);
    const taskCompletionRate = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

    // Aggregate habit completion
    const habitsCompleted = weekPlans.reduce((sum, p) => sum + (p.habitsCompletedCount ?? 0), 0);
    const habitsTotal = weekPlans.reduce((sum, p) => sum + (p.habitsTotalCount ?? 0), 0);
    const habitCompletionRate = habitsTotal > 0 ? Math.round((habitsCompleted / habitsTotal) * 100) : 0;

    // Aggregate focus minutes
    const focusMinutes = weekPlans.reduce((sum, p) => sum + (p.focusMinutes ?? 0), 0);

    // Get mood entries
    const moodEntries = await ctx.db
      .query('moodEntries')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect();
    const weekMoods = moodEntries.filter((m) => m.date >= weekStart && m.date <= weekEnd);
    const moodAverage =
      weekMoods.length > 0
        ? Math.round((weekMoods.reduce((sum, m) => sum + m.score, 0) / weekMoods.length) * 10) / 10
        : undefined;

    // Get gamification streak
    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .unique();
    const streakStatus =
      gamification?.currentStreak
        ? `${gamification.currentStreak}-day streak`
        : 'No active streak';

    // Get user's selected coach
    const user = await ctx.db.get(userId);
    const selectedCoach = user?.selectedCoach ?? 'MARCUS';

    return {
      weekStart,
      weekEnd,
      taskCompletionRate,
      habitCompletionRate,
      focusMinutes,
      moodAverage,
      streakStatus,
      tasksCompleted,
      habitsCompleted,
      selectedCoach,
      userName: user?.name ?? 'there',
      telegramChatId: user?.telegramChatId,
    };
  },
});

// ─── Action: Generate AI weekly intelligence for one user ─────────────────────
export const generateWeeklyIntelligenceForUser = internalAction({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    const metrics = await ctx.runQuery(internal.weeklyIntelligence.getUserWeekMetrics, { userId });

    // Don't generate if no real data this week
    if (metrics.taskCompletionRate === 0 && metrics.habitCompletionRate === 0) {
      return null;
    }

    const prompt = `You are ${metrics.selectedCoach}, an AI life coach at Resurgo. Generate a weekly performance intelligence report for ${metrics.userName}.

PERFORMANCE DATA:
- Task completion rate: ${metrics.taskCompletionRate}%
- Habit completion rate: ${metrics.habitCompletionRate}%
- Focus time: ${metrics.focusMinutes} minutes
- Average mood: ${metrics.moodAverage !== undefined ? `${metrics.moodAverage}/10` : 'not tracked'}
- Streak: ${metrics.streakStatus}
- Tasks completed: ${metrics.tasksCompleted}
- Habits completed: ${metrics.habitsCompleted}

Generate a JSON response with these exact fields:
{
  "topInsight": "One powerful behavioral pattern you noticed (1-2 sentences, specific and non-generic)",
  "winOfTheWeek": "Their biggest win, stated specifically and enthusiastically (1 sentence)",
  "areaToImprove": "One actionable, specific improvement area for next week (1 sentence)",
  "nextWeekFocus": "One clear priority recommendation for next week (1 sentence)",
  "personalizedMessage": "A brief, genuine, coach-voice message (2-3 sentences) using their name ${metrics.userName}",
  "patternFlags": ["array", "of", "detected", "patterns"] // e.g. "weekendSlumper", "morningPeakPerformer", "habitConsistencyLow"
}

Be specific, warm, and direct. Avoid generic platitudes. Reference their actual numbers.`;

    let response: {
      topInsight: string;
      winOfTheWeek: string;
      areaToImprove: string;
      nextWeekFocus: string;
      personalizedMessage: string;
      patternFlags?: string[];
    };

    try {
      // Use free Groq for weekly reports (fast + free)
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) throw new Error('No Groq API key');

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
          max_tokens: 600,
          temperature: 0.7,
        }),
      });

      if (!res.ok) throw new Error(`Groq error: ${res.status}`);
      const data = await res.json() as { choices: Array<{ message: { content: string } }> };
      response = JSON.parse(data.choices[0].message.content) as typeof response;
    } catch {
      // Fallback: generate a basic response without AI
      response = {
        topInsight: `This week you completed ${metrics.taskCompletionRate}% of your tasks and ${metrics.habitCompletionRate}% of your habits.`,
        winOfTheWeek: `You logged ${metrics.focusMinutes} minutes of focused work this week.`,
        areaToImprove: 'Try to increase habit consistency next week by setting a specific time for each habit.',
        nextWeekFocus: 'Focus on one goal that matters most to you.',
        personalizedMessage: `${metrics.userName}, you showed up this week. That's what matters. Keep building on this foundation.`,
        patternFlags: [],
      };
    }

    // Save to weeklyIntelligence table
    await ctx.runMutation(internal.weeklyIntelligence.saveWeeklyIntelligence, {
      userId,
      weekStartDate: metrics.weekStart,
      weekEndDate: metrics.weekEnd,
      habitCompletionRate: metrics.habitCompletionRate,
      taskCompletionRate: metrics.taskCompletionRate,
      focusMinutes: metrics.focusMinutes,
      moodAverage: metrics.moodAverage,
      streakStatus: metrics.streakStatus,
      topInsight: response.topInsight,
      winOfTheWeek: response.winOfTheWeek,
      areaToImprove: response.areaToImprove,
      nextWeekFocus: response.nextWeekFocus,
      personalizedMessage: response.personalizedMessage,
      patternFlags: response.patternFlags,
    });

    // Send Telegram message if user has Telegram linked
    if (metrics.telegramChatId) {
      const telegramMessage = `📊 *Your Week in Review, ${metrics.userName}*\n\n` +
        `🏆 *Win of the week:* ${response.winOfTheWeek}\n\n` +
        `💡 *Key insight:* ${response.topInsight}\n\n` +
        `🎯 *Next week focus:* ${response.nextWeekFocus}\n\n` +
        `${response.personalizedMessage}\n\n` +
        `_View your full report at resurgo.life/dashboard/analytics_`;

      try {
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: metrics.telegramChatId,
            text: telegramMessage,
            parse_mode: 'Markdown',
          }),
        });
      } catch {
        // Telegram delivery failure is non-fatal
      }
    }

    return response;
  },
});

// ─── Mutation: Save generated weekly intelligence report ──────────────────────
export const saveWeeklyIntelligence = internalMutation({
  args: {
    userId: v.id('users'),
    weekStartDate: v.string(),
    weekEndDate: v.string(),
    habitCompletionRate: v.number(),
    taskCompletionRate: v.number(),
    focusMinutes: v.number(),
    moodAverage: v.optional(v.number()),
    streakStatus: v.string(),
    topInsight: v.string(),
    winOfTheWeek: v.string(),
    areaToImprove: v.string(),
    nextWeekFocus: v.string(),
    personalizedMessage: v.string(),
    patternFlags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Upsert: replace existing report for this week if it exists
    const existing = await ctx.db
      .query('weeklyIntelligence')
      .withIndex('by_userId_weekStart', (q) =>
        q.eq('userId', args.userId).eq('weekStartDate', args.weekStartDate)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
      });
    } else {
      await ctx.db.insert('weeklyIntelligence', {
        ...args,
        createdAt: Date.now(),
      });
    }
  },
});

// ─── Action: Run weekly intelligence for all active users ─────────────────────
export const runWeeklyIntelligenceForAllUsers = internalAction({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.runQuery(internal.weeklyIntelligence.getActiveUsersForWeeklyReport, {});

    // Process users in batches of 5 to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      await Promise.allSettled(
        batch.map((user) =>
          ctx.runAction(internal.weeklyIntelligence.generateWeeklyIntelligenceForUser, {
            userId: user._id,
          })
        )
      );
      // Small delay between batches
      if (i + batchSize < users.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log(`[WeeklyIntelligence] Generated reports for ${users.length} active users`);
  },
});

// ─── NOTE: Cron registration is in convex/crons.ts ──────────────────────────
// The weekly intelligence cron fires every Sunday at 20:00 UTC and calls
// runWeeklyIntelligenceForAllUsers above.

