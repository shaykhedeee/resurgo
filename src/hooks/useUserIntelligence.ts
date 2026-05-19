'use client';

// ════════════════════════════════════════════════════════════════════════════════
// RESURGO — useUserIntelligence Hook
// Wraps existing Convex queries into a unified User Intelligence Model (UIM)
// ════════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export interface UserIntelligence {
  profile: {
    name: string;
    email: string;
    plan: string;
    archetype?: string;
    timezone?: string;
    focusAreas?: string[];
    primaryGoal?: string;
    onboardingComplete: boolean;
  };
  goals: {
    activeCount: number;
    totalCount: number;
    avgProgress: number;
    completionRate: number;
    primaryGoal?: string;
    nearestDeadline?: string;
  };
  habits: {
    activeCount: number;
    avgCompletionRate: number;
    currentStreak: number;
    longestStreak: number;
    todayCompleted: number;
  };
  focus: {
    todayMinutes: number;
    weeklyMinutes: number;
    todaySessions: number;
    avgSessionLength: number;
  };
  burnout: {
    atRisk: boolean;
    riskFactors: string[];
    score: number;
    recommendation: string;
  };
  engagement: {
    score: number;
    band: string;
    xp: number;
    level: number;
    tier: string;
    xpToNextLevel: number;
  };
  onboarding: {
    complete: boolean;
    archetype?: string;
    archetypeConfidence?: number;
    lastScanDate?: string;
  };
  dailyPlan: {
    exists: boolean;
    tasksCompleted: number;
    tasksTotal: number;
    completionRatio: number;
    topPriority?: string;
  };
}

export function useUserIntelligence(): {
  uim: UserIntelligence | null;
  isLoading: boolean;
  error: Error | null;
} {
  const userResult = useQuery(api.users.current);
  const activeHabitsResult = useQuery(api.habits.listActive);
  const activeGoalsResult = useQuery(api.goals.listActive);
  const dailyPlanResult = useQuery(api.dailyPlans.listRecent, {});
  const gamificationResult = useQuery(api.gamification.getProfile, {});

  const isLoading =
    userResult === undefined ||
    activeHabitsResult === undefined ||
    activeGoalsResult === undefined ||
    dailyPlanResult === undefined ||
    gamificationResult === undefined;

  if (isLoading) {
    return { uim: null, isLoading: true, error: null };
  }

  const user = userResult ?? undefined;
  const habits = activeHabitsResult ?? [];
  const goals = activeGoalsResult ?? [];
  const gami = gamificationResult ?? undefined;
  const todayPlan = dailyPlanResult && dailyPlanResult.length > 0 ? dailyPlanResult[0] : undefined;

  const activeCount = habits.filter((h) => h.isActive).length;
  const avgCompletionRate = activeCount > 0
    ? habits.reduce((sum, h) => sum + (h.completionRate7Day ?? 0), 0) / activeCount
    : 0;

  const inProgress = goals.filter((g) => g.status === 'in_progress');
  const completed = goals.filter((g) => g.status === 'completed');
  const completionRate = goals.length > 0 ? (completed.length / goals.length) * 100 : 0;
  const avgProgress = goals.length > 0
    ? goals.reduce((sum, g) => sum + (g.progress ?? 0), 0) / goals.length
    : 0;

  const withDeadlines = goals
    .filter((g) => g.targetDate && g.status !== 'completed')
    .sort((a, b) => (a.targetDate ?? '').localeCompare(b.targetDate ?? ''));

  const tasksCompleted = todayPlan?.tasksCompletedCount ?? 0;
  const tasksTotal = todayPlan?.tasksTotalCount ?? 0;
  const completionRatio = tasksTotal > 0 ? tasksCompleted / tasksTotal : 0;

  const riskFactors: string[] = [];
  if (avgCompletionRate < 0.4 && activeCount > 0) {
    riskFactors.push('Low habit completion rate');
  }
  if (goals.length > 0 && inProgress.length === 0 && completed.length === 0) {
    riskFactors.push('No active goals');
  }
  if (user?.engagementBand === 'at_risk' || user?.engagementBand === 'churning') {
    riskFactors.push('Declining engagement');
  }

  const uim: UserIntelligence = {
    profile: {
      name: user?.name ?? 'User',
      email: user?.email ?? '',
      plan: user?.plan ?? 'free',
      archetype: user?.archetype,
      timezone: user?.timezone,
      focusAreas: user?.focusAreas,
      primaryGoal: user?.primaryGoal,
      onboardingComplete: user?.onboardingComplete ?? false,
    },
    goals: {
      activeCount: inProgress.length,
      totalCount: goals.length,
      avgProgress,
      completionRate,
      primaryGoal: user?.primaryGoal,
      nearestDeadline: withDeadlines[0]?.targetDate,
    },
    habits: {
      activeCount,
      avgCompletionRate,
      currentStreak: gami?.currentStreak ?? 0,
      longestStreak: gami?.longestStreak ?? 0,
      todayCompleted: todayPlan?.habitsCompletedCount ?? 0,
    },
    focus: {
      todayMinutes: todayPlan?.focusMinutes ?? 0,
      weeklyMinutes: 0,
      todaySessions: 0,
      avgSessionLength: 0,
    },
    burnout: {
      atRisk: riskFactors.length >= 2,
      riskFactors,
      score: riskFactors.length >= 2 ? 0.7 : riskFactors.length === 1 ? 0.4 : 0.1,
      recommendation: riskFactors.length >= 2
        ? 'Take a rest day, reduce workload, focus on recovery'
        : 'Maintain current pace',
    },
    engagement: {
      score: user?.engagementScore ?? gami?.totalXP ?? 0,
      band: user?.engagementBand ?? 'active',
      xp: gami?.totalXP ?? 0,
      level: gami?.level ?? 1,
      tier: gami?.tier ?? 'beginner',
      xpToNextLevel: gami?.xpToNextLevel ?? 100,
    },
    onboarding: {
      complete: user?.onboardingComplete ?? false,
      archetype: user?.archetype,
      archetypeConfidence: user?.archetypeConfidence ?? 0,
      lastScanDate: undefined,
    },
    dailyPlan: {
      exists: !!todayPlan,
      tasksCompleted,
      tasksTotal,
      completionRatio,
      topPriority: todayPlan?.topPriorities?.[0],
    },
  };

  return { uim, isLoading: false, error: null };
}