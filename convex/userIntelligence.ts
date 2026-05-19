// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — User Intelligence Model (UIM)
// Unified user state query — every AI interaction references UIM
// every feature mutation propagates to UIM
// ═══════════════════════════════════════════════════════════════════════════════

import { v } from 'convex/values';
import { query } from './_generated/server';

/**
 * Unified User Intelligence Model (UIM)
 * Aggregates all user data into a single comprehensive state object
 * serving as the central nervous system of the Resurgo platform.
 *
 * @returns UserIntelligence object with aggregated metrics or null if unauthenticated
 */
export const getCurrent = query({
  args: {},
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    const userId = userIdentity?.userId ?? null;
    if (!userId) return null;

    // Fetch user profile
    const user = await ctx.db.query("users")
      .filter(q => q.eq("_id", userId))
      .first();

    // Fetch goals data
    const goals = await ctx.db.query("goals")
      .filter(q => q.eq("userId", userId))
      .collect();

    // Fetch habits data
    const habits = await ctx.db.query("habits")
      .filter(q => q.eq("userId", userId))
      .collect();

    // Fetch daily plan
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyPlan = await ctx.db.query("dailyPlans")
      .filter(q => q.eq("userId", userId))
      .filter(q => q.eq("date", today.toISOString().split('T')[0]))
      .first();

    // Fetch mood entries
    const moodEntries = await ctx.db.query("moodEntries")
      .filter(q => q.eq("userId", userId))
      .collect();

    // Fetch focus sessions
    const focusSessions = await ctx.db.query("focusSessions")
      .filter(q => q.eq("userId", userId))
      .collect();

    // Fetch gamification data
    const gamification = await ctx.db.query("gamification")
      .filter(q => q.eq("userId", userId))
      .first();

    // Fetch deep scan data
    const deepScans = await ctx.db.query("deepScans")
      .filter(q => q.eq("userId", userId))
      .collect();

    // Fetch AI greetings data
    const aiGreetings = await ctx.db.query("aiGreetings")
      .filter(q => q.eq("userId", userId))
      .collect();

    // Calculate derived metrics
    const activeGoals = goals.filter(g => g.status === 'in_progress');
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    // Mood trend calculation
    const recentMoods = moodEntries
      .filter((m: { createdAt: number }) => m.createdAt >= sevenDaysAgo)
      .sort((a, b) => b.createdAt - a.createdAt);

    const moodTrend = recentMoods.length >= 2
      ? recentMoods[0].score - recentMoods[recentMoods.length - 1].score
      : 0;

    // Focus session calculations
    const todaySessions = focusSessions.filter((s: any) => {
      const sessionDate = new Date(s.completedAt);
      return sessionDate.toDateString() === today.toDateString();
    });

    const weeklySessions = focusSessions.filter((s: any) => s.completedAt >= sevenDaysAgo);

    const todayMinutes = todaySessions.reduce((acc: number, s: any) => acc + (s.actualDuration ?? 0), 0);
    const weeklyMinutes = weeklySessions.reduce((acc: number, s: any) => acc + (s.actualDuration ?? 0), 0);
    const avgSessionLength = weeklySessions.length
      ? weeklyMinutes / weeklySessions.length
      : 0;

    // Habit completion rate
    const activeHabits = habits.filter(h => h.isActive);
    const avgCompletionRate = activeHabits.length
      ? activeHabits.reduce((acc: number, h: any) => acc + (h.completionRate7Day ?? 0), 0) / activeHabits.length
      : 0;

    // Consistency metrics
    const uniqueActiveDays = new Set(
      moodEntries.map((m: { createdAt: number }) => new Date(m.createdAt).toDateString())
    ).size;

    // Count this week's active days
    const thisWeekUniqueDays = new Set(
      recentMoods.map((m: { createdAt: number }) => new Date(m.createdAt).toDateString())
    ).size;

    const weeklyRate = (thisWeekUniqueDays / 7) * 100;

    // Onboarding completion
    const lastDeepScan = deepScans.sort((a, b) => b.createdAt - a.createdAt)[0] || null;

    // AI greeting status
    const latestGreeting = aiGreetings.sort((a, b) => b.createdAt - a.createdAt)[0] || null;

    // Primary goal (highest priority active goal)
    const primaryGoal = activeGoals.sort((a: { progress: number }, b: { progress: number }) => b.progress - a.progress)[0] || null;

    return {
      profile: {
        name: user?.name ?? null,
        email: user?.email ?? null,
        plan: user?.plan ?? 'free',
        archetype: user?.archetype ?? null,
        timezone: user?.timezone ?? null,
        focusAreas: user?.focusAreas ?? [],
        onboardingComplete: user?.onboardingComplete ?? false,
      },
      goals: {
        activeCount: activeGoals.length,
        totalCount: goals.length,
        avgProgress: activeGoals.length
          ? activeGoals.reduce((acc: number, g: any) => acc + g.progress, 0) / activeGoals.length
          : 0,
        nearestDeadline: activeGoals
          .filter((g: any) => g.targetDate)
          .sort((a: any, b: any) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())[0]?.targetDate ?? null,
        primaryGoal: primaryGoal ? {
          id: primaryGoal._id,
          title: primaryGoal.title,
          progress: primaryGoal.progress,
          deadline: primaryGoal.targetDate,
        } : null,
      },
      habits: {
        activeCount: activeHabits.length,
        totalCount: habits.length,
        avgCompletionRate,
        currentStreak: activeHabits.length ? Math.max(...activeHabits.map((h: { streakCurrent: number }) => h.streakCurrent)) : 0,
        longestStreak: activeHabits.length ? Math.max(...activeHabits.map((h: { streakLongest: number }) => h.streakLongest)) : 0,
      },
      focus: {
        todayMinutes,
        weeklyMinutes,
        todaySessions: todaySessions.length,
        avgSessionLength,
      },
      mood: {
        todayScore: moodEntries[0]?.score ?? null,
        weekAvg: recentMoods.length
          ? recentMoods.reduce((acc: number, m: { score: number }) => acc + m.score, 0) / recentMoods.length
          : null,
        trend: moodTrend > 5 ? 'improving' : moodTrend < -5 ? 'declining' : 'stable',
      },
      burnout: {
        atRisk: false, // Will be calculated by getBurnoutAssessment
        riskFactors: [],
        score: 50,
      },
      engagement: {
        score: gamification?.totalXP ?? user?.engagementScore ?? 0,
        band: 'bronze', // Will be calculated by getEngagementBand
        xp: gamification?.currentLevelXP ?? 0,
        level: gamification?.level ?? 1,
        tier: gamification?.tier ?? 'bronze',
      },
      consistency: {
        daysActive: uniqueActiveDays,
        weeklyRate,
        bestWeek: 0,
      },
      onboarding: {
        complete: user?.onboardingComplete ?? false,
        archetype: lastDeepScan?.archetype ?? null,
        archetypeConfidence: lastDeepScan?.archetypeConfidence ?? 0,
        lastScanDate: lastDeepScan?.createdAt ?? null,
      },
      dailyPlan: {
        exists: !!dailyPlan,
        completionRatio: (dailyPlan?.tasksCompletedCount ?? 0) > 0 && (dailyPlan?.tasksTotalCount ?? 0) > 0 ? (dailyPlan!.tasksCompletedCount ?? 0) / (dailyPlan!.tasksTotalCount ?? 1) : 0,
        topPriority: dailyPlan?.topPriorities?.[0] ?? null,
      },
    };
  },
});

/**
 * Burnout Assessment
 * Analyzes user patterns to detect burnout risk based on mood, habits,
 * focus sessions, and engagement metrics over time.
 *
 * @returns Burnout assessment with risk level and recommendations
 */
export const getBurnoutAssessment = query({
  args: {},
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    const userId = userIdentity?.userId ?? null;
    if (!userId) return null;

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Fetch mood data
    const moodEntries = await ctx.db.query("moodEntries")
      .filter(q => q.eq("userId", userId))
      .collect();

    // Fetch habits
    const habits = await ctx.db.query("habits")
      .filter(q => q.eq("userId", userId))
      .collect();

    // Fetch focus sessions
    const focusSessions = await ctx.db.query("focusSessions")
      .filter(q => q.eq("userId", userId))
      .collect();

    // Fetch sleep data
    const sleepData = await ctx.db.query("sleepLogs")
      .filter(q => q.eq("userId", userId))
      .collect();

    // Fetch user for engagement baseline
    const user = await ctx.db.query("users")
      .filter(q => q.eq("_id", userId))
      .first();

    // Calculate factors
    const factors: string[] = [];
    let score = 0;

    // Factor 1: Mood decline
    const recentMoods = moodEntries
      .filter((m: { createdAt: number }) => m.createdAt >= sevenDaysAgo)
      .sort((a: { createdAt: number }, b: { createdAt: number }) => b.createdAt - a.createdAt);

    if (recentMoods.length >= 2) {
      const moodDiff = recentMoods[0].score - recentMoods[recentMoods.length - 1].score;
      if (moodDiff < -3) {
        factors.push('Mood declining over past 7 days');
        score += 25;
      }
    }

    // Factor 2: Habit completion drop
    const recentHabits = habits.filter((h: any) => (h.lastCompletedAt ?? 0) >= sevenDaysAgo);
    const olderHabits = habits.filter((h: any) =>
      (h.lastCompletedAt ?? 0) >= thirtyDaysAgo && (h.lastCompletedAt ?? 0) < sevenDaysAgo
    );

    if (recentHabits.length < olderHabits.length) {
      factors.push('Habit completion rate decreased');
      score += 20;
    }

    // Factor 3: Focus session decline
    const recentFocus = focusSessions.filter((s: any) => s.completedAt >= sevenDaysAgo);
    const olderFocus = focusSessions.filter((s: any) =>
      s.completedAt >= thirtyDaysAgo && s.completedAt < sevenDaysAgo
    );

    const recentMinutes = recentFocus.reduce((acc: number, s: any) => acc + (s.actualDuration ?? s.duration ?? 0), 0);
    const olderMinutes = olderFocus.reduce((acc: number, s: any) => acc + (s.actualDuration ?? s.duration ?? 0), 0);

    if (recentMinutes < olderMinutes * 0.5) {
      factors.push('Focus session time significantly reduced');
      score += 20;
    }

    // Factor 4: Sleep disruption
    const recentSleep = sleepData.filter((s: any) => s.createdAt >= sevenDaysAgo);
    const avgSleep = recentSleep.length
      ? recentSleep.reduce((acc: number, s: any) => acc + (s.durationMinutes ? s.durationMinutes / 60 : 8), 0) / recentSleep.length
      : 8;

    if (avgSleep < 6) {
      factors.push('Sleep duration below recommended threshold');
      score += 15;
    }

    // Factor 5: Engagement drop
    const currentEngagement = user?.engagementScore ?? 50;
    if (currentEngagement < 30) {
      factors.push('Low engagement score');
      score += 20;
    }

    // Factor 6: Session frequency decline
    if (olderFocus.length > 0 && recentFocus.length < olderFocus.length * 0.5) {
      factors.push('Session frequency significantly decreased');
      score += 10;
    }

    const atRisk = score >= 50;
    const riskLevel = score >= 75 ? 'HIGH' : score >= 50 ? 'MODERATE' : 'LOW';

    let recommendation = '';
    if (atRisk) {
      if (riskLevel === 'HIGH') {
        recommendation = 'Consider taking a scheduled break. Reduce daily goals by 50% for one week, focus on core habits only, and prioritize sleep hygiene. Your progress plateau is temporary — rest now to recover.';
      } else {
        recommendation = 'Schedule a recovery day this week. Reduce goal intensity, ensure at least 7 hours of sleep, and maintain your 3 most important habits. Consider a focus session time audit to eliminate burnout triggers.';
      }
    } else if (score >= 25) {
      recommendation = 'You show early signs of fatigue. Consider implementing a rest day, review your habit stack for sustainability, and ensure proper recovery between focus sessions.';
    } else {
      recommendation = 'Your current pace appears sustainable. Continue monitoring mood trends and maintain consistent habits.';
    }

    return {
      atRisk,
      score,
      factors,
      recommendation,
    };
  },
});

/**
 * Engagement Band Calculation
 * Determines user engagement tier based on activity metrics.
 *
 * @returns Engagement band with supporting metrics
 */
export const getEngagementBand = query({
  args: {},
  handler: async (ctx, args) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    const userId = userIdentity?.userId ?? null;
    if (!userId) return null;

    // Fetch recent activity
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    const focusSessions = await ctx.db.query("focusSessions")
      .filter(q => q.eq("userId", userId))
      .collect();

    const moodEntries = await ctx.db.query("moodEntries")
      .filter(q => q.eq("userId", userId))
      .collect();

    const habits = await ctx.db.query("habits")
      .filter(q => q.eq("userId", userId))
      .collect();

    const user = await ctx.db.query("users")
      .filter(q => q.eq("_id", userId))
      .first();

    // Calculate metrics
    const weeklyFocusMinutes = focusSessions
      .filter((s: any) => s.completedAt >= sevenDaysAgo)
      .reduce((acc: number, s: any) => acc + (s.actualDuration ?? s.duration ?? 0), 0);

    const weeklyLoggedMoods = moodEntries.filter((m: { createdAt: number }) => m.createdAt >= sevenDaysAgo).length;
    const activeHabits = habits.filter(h => h.isActive).length;
    const engagementScore = user?.engagementScore ?? 0;

    // Band calculation
    const weeklyActiveDays = new Set(
      moodEntries
        .filter((m: { createdAt: number }) => m.createdAt >= sevenDaysAgo)
        .map((m: { createdAt: number }) => new Date(m.createdAt).toDateString())
    ).size;

    let band: 'dormant' | 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';

    if (weeklyActiveDays === 0 || engagementScore < 10) {
      band = 'dormant';
    } else if (engagementScore >= 90 && weeklyFocusMinutes >= 300 && activeHabits >= 5) {
      band = 'platinum';
    } else if (engagementScore >= 70 && weeklyFocusMinutes >= 180 && activeHabits >= 4) {
      band = 'gold';
    } else if (engagementScore >= 40 && weeklyFocusMinutes >= 60 && activeHabits >= 3) {
      band = 'silver';
    } else {
      band = 'bronze';
    }

    return {
      band,
      score: engagementScore,
      metrics: {
        weeklyFocusMinutes,
        weeklyLoggedMoods,
        activeHabits,
        weeklyActiveDays,
      },
    };
  },
});

// Type definitions for export
export type UserIntelligence = {
  profile: {
    name: string | null;
    email: string | null;
    plan: string;
    archetype: string | null;
    timezone: string | null;
    focusAreas: string[];
    onboardingComplete: boolean;
  };
  goals: {
    activeCount: number;
    totalCount: number;
    avgProgress: number;
    nearestDeadline: number | null;
    primaryGoal: {
      id: string;
      title: string;
      progress: number;
      deadline: number | null;
    } | null;
  };
  habits: {
    activeCount: number;
    totalCount: number;
    avgCompletionRate: number;
    currentStreak: number;
    longestStreak: number;
  };
  focus: {
    todayMinutes: number;
    weeklyMinutes: number;
    todaySessions: number;
    avgSessionLength: number;
  };
  mood: {
    todayScore: number | null;
    weekAvg: number | null;
    trend: 'improving' | 'declining' | 'stable';
  };
  burnout: {
    atRisk: boolean;
    riskFactors: string[];
    score: number;
  };
  engagement: {
    score: number;
    band: string;
    xp: number;
    level: number;
    tier: string;
  };
  consistency: {
    daysActive: number;
    weeklyRate: number;
    bestWeek: number;
  };
  onboarding: {
    complete: boolean;
    archetype: string | null;
    archetypeConfidence: number;
    lastScanDate: number | null;
  };
  dailyPlan: {
    exists: boolean;
    completionRatio: number;
    topPriority: string | null;
  };
};

export type BurnoutAssessment = {
  atRisk: boolean;
  score: number;
  factors: string[];
  recommendation: string;
};

export type EngagementBand = {
  band: 'dormant' | 'bronze' | 'silver' | 'gold' | 'platinum';
  score: number;
  metrics: {
    weeklyFocusMinutes: number;
    weeklyLoggedMoods: number;
    activeHabits: number;
    weeklyActiveDays: number;
  };
};
