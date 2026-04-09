// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — useProgressiveDisclosure
// Determines which dashboard features to show based on user lifecycle state.
// Prevents overwhelming new users while ensuring power users see everything.
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useMemo, useRef } from 'react';
import { analytics } from '@/lib/analytics';

export type DisclosureTier =
  | 'newcomer'   // Day 1-3, no habits/goals yet — show core only
  | 'explorer'   // Day 4-14 or first habit/goal created — show most things
  | 'builder';   // 15+ days, streak ≥ 7, or multiple habits — show everything

export interface ProgressiveDisclosureState {
  tier: DisclosureTier;
  /** IDs of widgets to show by default for this tier (only used on fresh accounts) */
  defaultVisibleWidgets: Set<string>;
  /** True when user is brand new (day 1-3, no track record) */
  isNewcomer: boolean;
  /** Friendly onboarding hint copy for the current tier */
  hintText: string | null;
}

interface DisclosureInput {
  /** User's account creation timestamp (ms) */
  createdAt?: number;
  /** Current streak (days) */
  currentStreak?: number;
  /** Number of active habits */
  habitCount: number;
  /** Number of active goals */
  goalCount: number;
  /** Number of tasks */
  taskCount: number;
  /** Has the user ever customised their layout? */
  hasCustomLayout: boolean;
}

// Widgets always visible to newcomers — the essential core
const NEWCOMER_WIDGETS = new Set([
  'focus-timer',
  'habit-streak',
  'ai-coach',
  'quick-task',
  'goal-progress',
  'digital-clock',
  'xp-status',
]);

// Added in explorer tier
const EXPLORER_ADDITIONS = new Set([
  'quick-journal',
  'calorie-tracker',
  'water-tracker',
  'quick-note',
  'sleep',
  'activity-feed',
]);

// Everything visible at builder tier
const BUILDER_ADDITIONS = new Set([
  'quick-actions',
  'vision-board',
  'streak-heatmap',
  'xp-leaderboard',
]);

export function useProgressiveDisclosure(input: DisclosureInput): ProgressiveDisclosureState {
  const prevTierRef = useRef<DisclosureTier | null>(null);

  const state = useMemo(() => {
    const {
      createdAt,
      currentStreak = 0,
      habitCount,
      goalCount,
      taskCount,
      hasCustomLayout: _hasCustomLayout,
    } = input;

    const daysSinceJoin = createdAt
      ? Math.floor((Date.now() - createdAt) / 86_400_000)
      : 0;

    // Determine tier
    let tier: DisclosureTier;
    if (
      daysSinceJoin <= 3 &&
      habitCount === 0 &&
      goalCount === 0 &&
      taskCount <= 1 &&
      currentStreak <= 1
    ) {
      tier = 'newcomer';
    } else if (
      daysSinceJoin <= 14 &&
      habitCount <= 2 &&
      goalCount <= 1 &&
      currentStreak < 7
    ) {
      tier = 'explorer';
    } else {
      tier = 'builder';
    }

    // Build visible set (only meaningful when !hasCustomLayout)
    const defaultVisibleWidgets = new Set(NEWCOMER_WIDGETS);
    if (tier === 'explorer' || tier === 'builder') {
      for (const id of EXPLORER_ADDITIONS) defaultVisibleWidgets.add(id);
    }
    if (tier === 'builder') {
      for (const id of BUILDER_ADDITIONS) defaultVisibleWidgets.add(id);
    }

    const hintText =
      tier === 'newcomer'
        ? 'Start with one habit and one goal — you can unlock more widgets as you build momentum.'
        : tier === 'explorer'
          ? 'You\'re building momentum! More dashboard widgets are now available.'
          : null;

    return {
      tier,
      defaultVisibleWidgets,
      isNewcomer: tier === 'newcomer',
      hintText,
    };
  }, [input]);

  useEffect(() => {
    const prev = prevTierRef.current;
    const curr = state.tier;
    if (prev !== null && prev !== curr) {
      analytics.featureUnlocked(curr, state.defaultVisibleWidgets.size);
    }
    prevTierRef.current = curr;
  }, [state.tier, state.defaultVisibleWidgets.size]);

  return state;
}
