'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — usePlanGating Hook
// Check user's plan and gate features accordingly
// ═══════════════════════════════════════════════════════════════════════════════

import { useStoreUser } from './useStoreUser';

// Feature flags by plan
const FEATURES = {
  free: {
    maxHabits: 10,
    maxGoals: 3,
    aiInsights: true,
    advancedAnalytics: false,
    habitStacking: false,
    deepOnboarding: false,
    calendarView: true,
    focusTimer: true,
    moodTracking: true,
    identitySystem: false,
    customThemes: false,
    dataExport: false,
    prioritySupport: false,
    visionBoardStudio: false,
  },
  pro: {
    maxHabits: Infinity,
    maxGoals: Infinity,
    aiInsights: true,
    advancedAnalytics: true,
    habitStacking: true,
    deepOnboarding: true,
    calendarView: true,
    focusTimer: true,
    moodTracking: true,
    identitySystem: true,
    customThemes: true,
    dataExport: true,
    prioritySupport: true,
    visionBoardStudio: true,
  },
  lifetime: {
    maxHabits: Infinity,
    maxGoals: Infinity,
    aiInsights: true,
    advancedAnalytics: true,
    habitStacking: true,
    deepOnboarding: true,
    calendarView: true,
    focusTimer: true,
    moodTracking: true,
    identitySystem: true,
    customThemes: true,
    dataExport: true,
    prioritySupport: true,
    visionBoardStudio: true,
  },
} as const;

export type Plan = keyof typeof FEATURES;
export type Feature = keyof (typeof FEATURES)['free'];

export function usePlanGating() {
  const { user, isLoading } = useStoreUser();

  const plan: Plan = (user?.plan as Plan) ?? 'free';
  const features = FEATURES[plan];

  function canUse(feature: Feature): boolean {
    return !!features[feature];
  }

  function getLimit(feature: 'maxHabits' | 'maxGoals'): number {
    return features[feature] as number;
  }

  function isPro(): boolean {
    return plan === 'pro' || plan === 'lifetime';
  }

  return {
    plan,
    features,
    canUse,
    getLimit,
    isPro,
    isLoading,
  };
}
