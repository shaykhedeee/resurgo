// WidgetRegistry — central registry for all dashboard widgets
// Allows widgets to register themselves and consumers to query by id/category

import type { ComponentType } from 'react';
import XPLeaderboardWidget from '@/components/widgets/XPLeaderboardWidget';
import StreakHeatmapWidget from '@/components/widgets/StreakHeatmapWidget';
import QuickTaskWidget from '@/components/widgets/QuickTaskWidget';
import GoalProgressWidget from '@/components/widgets/GoalProgressWidget';
import HabitStreakWidget from '@/components/widgets/HabitStreakWidget';
import SynergyScoreWidget from '@/components/widgets/SynergyScoreWidget';

// ── Backward-compatible types from existing implementation ──
export interface LayoutEntry {
  id: string;
  visible: boolean;
  order: number;
}

export interface DashboardWidgetDefinition {
  id: string;
  label: string;
  section: 'home' | 'body' | 'mind' | 'progress' | 'utility';
  defaultVisible: boolean;
  defaultOrder: number;
}

// ── Widget Registration interface ──
export interface WidgetRegistration<Props = Record<string, unknown>> {
  id: string;
  title: string;
  description: string;
  component: ComponentType<Props>;
  category: 'productivity' | 'analytics' | 'gamification' | 'insights' | 'system';
  tag?: string;
  defaultOrder: number;
  defaultRow: number;
  minPlan: 'free' | 'pro' | 'lifetime';
  isBeta?: boolean;
  props?: Props;
}

export class WidgetRegistry {
  private widgets: Map<string, WidgetRegistration> = new Map();

  register<Props extends Record<string, unknown>>(reg: WidgetRegistration<Props>): void {
    if (reg.id === '') throw new Error('Widget id must not be empty string');
    this.widgets.set(reg.id, reg as WidgetRegistration);
  }

  unregister(id: string): void {
    this.widgets.delete(id);
  }

  get(id: string): WidgetRegistration | undefined {
    return this.widgets.get(id);
  }

  getAll(): WidgetRegistration[] {
    return [...this.widgets.values()].sort((a, b) => a.defaultOrder - b.defaultOrder);
  }

  getAllByPlan(plan: string): WidgetRegistration[] {
    const order: Record<string, number> = { free: 0, pro: 1, lifetime: 2 };
    const level = order[plan] ?? 0;
    return this.getAll().filter(w => order[w.minPlan] <= level);
  }

  getAllByCategory(category: WidgetRegistration['category']): WidgetRegistration[] {
    return this.getAll().filter(w => w.category === category);
  }
}

// ── Singleton instance ──
export const widgetRegistry = new WidgetRegistry();

// ── Backward-compatible WIDGET_REGISTRY ──
export const WIDGET_REGISTRY: DashboardWidgetDefinition[] = [
  { id: 'synergy-score', label: 'Life OS Pulse', section: 'home', defaultVisible: true, defaultOrder: 0 },
  { id: 'quick-actions', label: 'Quick Actions', section: 'home', defaultVisible: true, defaultOrder: 1 },
  { id: 'quick-task', label: 'Quick Task', section: 'home', defaultVisible: true, defaultOrder: 2 },
  { id: 'focus-timer', label: 'Focus Timer', section: 'home', defaultVisible: true, defaultOrder: 3 },
  { id: 'habit-streak', label: 'Habit Streak', section: 'home', defaultVisible: true, defaultOrder: 4 },
  { id: 'goal-progress', label: 'Goal Progress', section: 'home', defaultVisible: true, defaultOrder: 5 },
  { id: 'ai-coach', label: 'AI Coach', section: 'home', defaultVisible: true, defaultOrder: 6 },
  { id: 'water-tracker', label: 'Water Tracker', section: 'body', defaultVisible: true, defaultOrder: 6 },
  { id: 'calorie-tracker', label: 'Calorie Tracker', section: 'body', defaultVisible: true, defaultOrder: 7 },
  { id: 'sleep', label: 'Sleep Tracker', section: 'body', defaultVisible: true, defaultOrder: 8 },
  { id: 'quick-journal', label: 'Quick Journal', section: 'mind', defaultVisible: true, defaultOrder: 9 },
  { id: 'quick-note', label: 'Quick Note', section: 'utility', defaultVisible: true, defaultOrder: 10 },
  { id: 'digital-clock', label: 'Digital Clock', section: 'utility', defaultVisible: false, defaultOrder: 11 },
  { id: 'activity-feed', label: 'Activity Feed', section: 'progress', defaultVisible: false, defaultOrder: 12 },
  { id: 'streak-heatmap', label: 'Streak Heatmap', section: 'progress', defaultVisible: false, defaultOrder: 13 },
  { id: 'vision-board', label: 'Vision Board', section: 'progress', defaultVisible: false, defaultOrder: 14 },
  { id: 'xp-status', label: 'XP Status', section: 'progress', defaultVisible: false, defaultOrder: 15 },
  { id: 'xp-leaderboard', label: 'XP Leaderboard', section: 'progress', defaultVisible: false, defaultOrder: 16 },
  { id: 'product-hunt', label: 'Product Hunt', section: 'utility', defaultVisible: false, defaultOrder: 17 },
];

export const WIDGET_MAP = new Map(WIDGET_REGISTRY.map((widget) => [widget.id, widget]));

// ── Backward-compatible functions ──
export function resolveLayout(savedLayout: LayoutEntry[] | null): LayoutEntry[] {
  const savedById = new Map((savedLayout ?? []).map((entry) => [entry.id, entry]));

  return WIDGET_REGISTRY
    .map((widget) => {
      const saved = savedById.get(widget.id);
      return {
        id: widget.id,
        visible: saved?.visible ?? widget.defaultVisible,
        order: saved?.order ?? widget.defaultOrder,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function getWidgetDefinition(id: string): DashboardWidgetDefinition | undefined {
  return WIDGET_MAP.get(id);
}

// ── Register real widgets ──
widgetRegistry.register({
  id: 'xp-leaderboard',
  title: 'XP Leaderboard',
  description: 'View rankings and compete with others',
  component: XPLeaderboardWidget,
  category: 'gamification',
  defaultOrder: 1,
  defaultRow: 1,
  minPlan: 'free',
  isBeta: false,
});

widgetRegistry.register({
  id: 'streak-heatmap',
  title: 'Streak Heatmap',
  description: 'Visualize your consistency over time',
  component: StreakHeatmapWidget,
  category: 'analytics',
  defaultOrder: 2,
  defaultRow: 1,
  minPlan: 'free',
  isBeta: false,
});

widgetRegistry.register({
  id: 'quick-task',
  title: 'Quick Task',
  description: 'Rapid task entry for daily productivity',
  component: QuickTaskWidget,
  category: 'productivity',
  defaultOrder: 3,
  defaultRow: 1,
  minPlan: 'free',
  isBeta: false,
});

widgetRegistry.register({
  id: 'goal-progress',
  title: 'Goal Progress',
  description: 'Track your objectives and milestones',
  component: GoalProgressWidget,
  category: 'productivity',
  defaultOrder: 4,
  defaultRow: 1,
  minPlan: 'free',
  isBeta: false,
});

widgetRegistry.register({
  id: 'habit-streak',
  title: 'Habit Streak',
  description: 'Maintain your daily habit chains',
  component: HabitStreakWidget,
  category: 'gamification',
  defaultOrder: 1,
  defaultRow: 2,
  minPlan: 'free',
  isBeta: false,
});

widgetRegistry.register({
  id: 'synergy-score',
  title: 'Life OS Pulse',
  description: 'A unified score aggregating wellness, tasks, habits, and budgets.',
  component: SynergyScoreWidget,
  category: 'insights',
  defaultOrder: 0,
  defaultRow: 1,
  minPlan: 'free',
  isBeta: false,
});