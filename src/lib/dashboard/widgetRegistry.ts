// ═══════════════════════════════════════════════════════════════════════════════
// Widget Registry — single source of truth for all dashboard widgets
// ═══════════════════════════════════════════════════════════════════════════════

export interface WidgetDef {
  /** Unique stable key — must not change after release */
  id: string;
  /** Human-readable label shown in the customise panel */
  label: string;
  /** Lucide icon name (imported on-demand in UI) */
  icon: string;
  /** Default column span (1 = 1/3 on desktop) */
  colSpan?: 1 | 2 | 3;
  /** Section heading this widget belongs to */
  section: 'core' | 'capture' | 'utility' | 'context';
  /** Default visibility & order (lower = higher on page) */
  defaultOrder: number;
  defaultVisible: boolean;
}

/**
 * Authoritative list of every widget available on the dashboard.
 * Order here determines the default order when the user has never customised.
 */
export const WIDGET_REGISTRY: WidgetDef[] = [
  // ── Core (Execution Core) ──
  { id: 'focus-timer',    label: 'Focus Timer',       icon: 'Timer',        section: 'core',    defaultOrder: 0,  defaultVisible: true },
  { id: 'habit-streak',   label: 'Habit Streaks',     icon: 'Flame',        section: 'core',    defaultOrder: 1,  defaultVisible: true },
  { id: 'ai-coach',       label: 'AI Coach',          icon: 'MessageSquare',section: 'core',    defaultOrder: 2,  defaultVisible: true },

  // ── Capture & Reflection ──
  { id: 'quick-journal',  label: 'Quick Journal',     icon: 'BookOpen',     section: 'capture', defaultOrder: 3,  defaultVisible: true },
  { id: 'goal-progress',  label: 'Goal Progress',     icon: 'Target',       section: 'capture', defaultOrder: 4,  defaultVisible: true },
  { id: 'calorie-tracker',label: 'Calorie Tracker',   icon: 'Apple',        section: 'capture', defaultOrder: 5,  defaultVisible: true },

  // ── Utility ──
  { id: 'digital-clock',  label: 'Digital Clock',     icon: 'Clock',        section: 'utility', defaultOrder: 6,  defaultVisible: true },
  { id: 'quick-task',     label: 'Quick Task',        icon: 'CheckSquare',  section: 'utility', defaultOrder: 7,  defaultVisible: true },
  { id: 'quick-note',     label: 'Quick Note',        icon: 'StickyNote',   section: 'utility', defaultOrder: 8,  defaultVisible: true },

  // ── Status & Tracking ──
  { id: 'water-tracker',  label: 'Hydration',         icon: 'Droplets',     section: 'core',    defaultOrder: 6,  defaultVisible: true },
  { id: 'xp-status',      label: 'XP & Level',        icon: 'Trophy',       section: 'core',    defaultOrder: 7,  defaultVisible: true },
  { id: 'activity-feed',  label: 'Activity Feed',     icon: 'TrendingUp',   section: 'core',    defaultOrder: 8,  defaultVisible: true },
  { id: 'streak-heatmap', label: 'Streak Heatmap',    icon: 'CalendarDays', section: 'core',    defaultOrder: 9,  defaultVisible: true },

  // ── Context & Support ──
  { id: 'sleep',          label: 'Sleep Tracker',     icon: 'Moon',         section: 'context', defaultOrder: 10, defaultVisible: true },
  { id: 'quick-actions',  label: 'Quick Actions',     icon: 'Zap',          section: 'context', defaultOrder: 11, defaultVisible: true },
  { id: 'vision-board',   label: 'Vision Board',      icon: 'Image',        section: 'context', defaultOrder: 12, defaultVisible: true },
  { id: 'xp-leaderboard', label: 'XP Leaderboard',    icon: 'Trophy',       section: 'core',    defaultOrder: 13, defaultVisible: false },
];

/** Map of widget id → WidgetDef for O(1) lookups */
export const WIDGET_MAP = new Map(WIDGET_REGISTRY.map((w) => [w.id, w]));

export type LayoutEntry = { id: string; visible: boolean; order: number };

/**
 * Merge persisted layout with the registry so new widgets are always included
 * and removed widgets are dropped.
 */
export function resolveLayout(persisted: LayoutEntry[] | null | undefined): LayoutEntry[] {
  if (!persisted || persisted.length === 0) {
    return WIDGET_REGISTRY.map((w) => ({
      id: w.id,
      visible: w.defaultVisible,
      order: w.defaultOrder,
    }));
  }

  const persistedMap = new Map(persisted.map((e) => [e.id, e]));
  const merged: LayoutEntry[] = [];

  for (const def of WIDGET_REGISTRY) {
    const saved = persistedMap.get(def.id);
    merged.push(saved ?? { id: def.id, visible: def.defaultVisible, order: def.defaultOrder });
  }

  return merged.sort((a, b) => a.order - b.order);
}
