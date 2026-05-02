// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Custom Dashboard Layouts
// Drag-and-drop widgets, custom columns, responsive breakpoints, saved profiles
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// WIDGET TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type DashboardWidgetType = 
  | 'today-focus' | 'quick-add' | 'task-list' | 'habit-tracker' | 'goal-progress'
  | 'calendar' | 'achievements' | 'motivation-quote' | 'productivity-chart'
  | 'weather' | 'energy-level' | 'notes' | 'partner-sync' | 'brain-dump'
  | 'focus-timer' | 'welcome' | 'next-milestone' | 'streak-display' | 'custom-stats';

export interface DashboardWidget {
  id: string;
  type: DashboardWidgetType;
  title: string;
  description?: string;
  icon?: string;
  settings: Record<string, unknown>;
  position: {
    row: number;
    column: number;
    width: 'sm' | 'md' | 'lg' | 'full'; // 1, 2, 3, 4 columns
    height: number; // In grid units, default 1
  };
  isVisible: boolean;
  isLocked?: boolean;
  refreshInterval?: number; // seconds
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  widgets: DashboardWidget[];
  columns: number; // 1-4 columns
  gap: 'compact' | 'normal' | 'spacious'; // spacing between widgets
  theme: 'light' | 'dark' | 'auto';
  createdAt: Date;
  updatedAt: Date;
  appliedOn?: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// PRESET LAYOUTS
// ─────────────────────────────────────────────────────────────────────────────

export const PRESET_LAYOUTS: Record<string, Omit<DashboardLayout, 'id' | 'createdAt' | 'updatedAt' | 'appliedOn'>> = {
  'minimal': {
    name: 'Minimal Focus',
    description: 'Distraction-free: just today\'s focus and quick add',
    isDefault: false,
    widgets: [
      {
        id: 'w-welcome',
        type: 'welcome',
        title: 'Welcome',
        position: { row: 1, column: 1, width: 'full', height: 1 },
        isVisible: true,
        settings: { showTime: true, showDate: true },
      },
      {
        id: 'w-quick-add',
        type: 'quick-add',
        title: 'Quick Add',
        position: { row: 2, column: 1, width: 'full', height: 1 },
        isVisible: true,
        settings: { focus: true },
      },
      {
        id: 'w-today-focus',
        type: 'today-focus',
        title: 'Today\'s Focus',
        position: { row: 3, column: 1, width: 'full', height: 2 },
        isVisible: true,
        settings: { limit: 5, showEstimates: true },
      },
    ],
    columns: 1,
    gap: 'normal',
    theme: 'auto',
  },

  'power-user': {
    name: 'Power User',
    description: 'Everything you need: tasks, habits, goals, calendar, stats',
    isDefault: false,
    widgets: [
      {
        id: 'w-welcome',
        type: 'welcome',
        title: 'Dashboard',
        position: { row: 1, column: 1, width: 'full', height: 1 },
        isVisible: true,
        settings: { showTime: true },
      },
      {
        id: 'w-quick-add',
        type: 'quick-add',
        title: 'Quick Add',
        position: { row: 2, column: 1, width: 'md', height: 1 },
        isVisible: true,
        settings: {},
      },
      {
        id: 'w-achievements',
        type: 'achievements',
        title: 'Achievements',
        position: { row: 2, column: 3, width: 'md', height: 1 },
        isVisible: true,
        settings: { showRecent: true, limit: 3 },
      },
      {
        id: 'w-today-focus',
        type: 'today-focus',
        title: 'Today\'s Tasks',
        position: { row: 3, column: 1, width: 'md', height: 2 },
        isVisible: true,
        settings: { limit: 8, sortBy: 'priority' },
      },
      {
        id: 'w-habit-tracker',
        type: 'habit-tracker',
        title: 'Habits',
        position: { row: 3, column: 3, width: 'md', height: 2 },
        isVisible: true,
        settings: { showStreak: true, limit: 6 },
      },
      {
        id: 'w-goal-progress',
        type: 'goal-progress',
        title: 'Goals',
        position: { row: 5, column: 1, width: 'lg', height: 2 },
        isVisible: true,
        settings: { showMilestones: true, showProgress: true },
      },
      {
        id: 'w-productivity-chart',
        type: 'productivity-chart',
        title: 'Weekly Stats',
        position: { row: 5, column: 3, width: 'md', height: 2 },
        isVisible: true,
        settings: { timeframe: 'week', showComparison: true },
      },
    ],
    columns: 4,
    gap: 'normal',
    theme: 'auto',
  },

  'daily-standup': {
    name: 'Daily Standup',
    description: 'Perfect for morning/evening: focus, habits, reflection, next steps',
    isDefault: false,
    widgets: [
      {
        id: 'w-welcome',
        type: 'welcome',
        title: 'Good Morning!',
        position: { row: 1, column: 1, width: 'full', height: 1 },
        isVisible: true,
        settings: { greeting: 'morning', showDate: true },
      },
      {
        id: 'w-energy-level',
        type: 'energy-level',
        title: 'How\'s your energy?',
        position: { row: 2, column: 1, width: 'md', height: 1 },
        isVisible: true,
        settings: { interactive: true },
      },
      {
        id: 'w-focus-timer',
        type: 'focus-timer',
        title: 'Focus Timer',
        position: { row: 2, column: 3, width: 'md', height: 1 },
        isVisible: true,
        settings: { defaultDuration: 25 },
      },
      {
        id: 'w-today-focus',
        type: 'today-focus',
        title: 'Top Priorities',
        position: { row: 3, column: 1, width: 'full', height: 2 },
        isVisible: true,
        settings: { limit: 5, showTime: true },
      },
      {
        id: 'w-habit-tracker',
        type: 'habit-tracker',
        title: 'Daily Habits',
        position: { row: 5, column: 1, width: 'md', height: 1 },
        isVisible: true,
        settings: { filterToDaily: true },
      },
      {
        id: 'w-notes',
        type: 'notes',
        title: 'Today\'s Notes',
        position: { row: 5, column: 3, width: 'md', height: 1 },
        isVisible: true,
        settings: { limit: 100 },
      },
    ],
    columns: 4,
    gap: 'spacious',
    theme: 'auto',
  },

  'coach-view': {
    name: 'Coach\'s View',
    description: 'AI coach perspective: progress, patterns, recommendations',
    isDefault: false,
    widgets: [
      {
        id: 'w-welcome',
        type: 'welcome',
        title: 'Coach Dashboard',
        position: { row: 1, column: 1, width: 'full', height: 1 },
        isVisible: true,
        settings: { role: 'coach' },
      },
      {
        id: 'w-goal-progress',
        type: 'goal-progress',
        title: 'Goal Tracking',
        position: { row: 2, column: 1, width: 'lg', height: 2 },
        isVisible: true,
        settings: { detailed: true, showRecommendations: true },
      },
      {
        id: 'w-productivity-chart',
        type: 'productivity-chart',
        title: 'Productivity Trends',
        position: { row: 2, column: 3, width: 'md', height: 2 },
        isVisible: true,
        settings: { timeframe: 'month', analyzePatterns: true },
      },
      {
        id: 'w-next-milestone',
        type: 'next-milestone',
        title: 'Next Milestone',
        position: { row: 4, column: 1, width: 'md', height: 1 },
        isVisible: true,
        settings: { highlight: true },
      },
      {
        id: 'w-partner-sync',
        type: 'partner-sync',
        title: 'Partner Check-in',
        position: { row: 4, column: 3, width: 'md', height: 1 },
        isVisible: true,
        settings: { showStatus: true },
      },
    ],
    columns: 4,
    gap: 'normal',
    theme: 'auto',
  },

  'goal-sprint': {
    name: 'Goal Sprint',
    description: 'Dedicated to one big goal: milestones, tasks, tracking',
    isDefault: false,
    widgets: [
      {
        id: 'w-welcome',
        title: 'Goal Sprint',
        type: 'welcome',
        position: { row: 1, column: 1, width: 'full', height: 1 },
        isVisible: true,
        settings: { mode: 'sprint' },
      },
      {
        id: 'w-next-milestone',
        type: 'next-milestone',
        title: 'Current Sprint Goal',
        position: { row: 2, column: 1, width: 'full', height: 1 },
        isVisible: true,
        settings: { highlight: true, showProgress: true },
      },
      {
        id: 'w-task-list',
        type: 'task-list',
        title: 'Sprint Tasks',
        position: { row: 3, column: 1, width: 'full', height: 3 },
        isVisible: true,
        settings: { filterToCurrentGoal: true, showDependencies: true },
      },
      {
        id: 'w-productivity-chart',
        type: 'productivity-chart',
        title: 'Sprint Velocity',
        position: { row: 6, column: 1, width: 'full', height: 1 },
        isVisible: true,
        settings: { sprintMode: true },
      },
    ],
    columns: 1,
    gap: 'normal',
    theme: 'auto',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIVE BREAKPOINTS
// ─────────────────────────────────────────────────────────────────────────────

export interface ResponsiveBreakpoint {
  name: 'mobile' | 'tablet' | 'desktop' | 'wide';
  minWidth: number;
  maxColumns: number;
  defaultGap: 'compact' | 'normal' | 'spacious';
}

export const RESPONSIVE_BREAKPOINTS: ResponsiveBreakpoint[] = [
  { name: 'mobile', minWidth: 0, maxColumns: 1, defaultGap: 'compact' },
  { name: 'tablet', minWidth: 768, maxColumns: 2, defaultGap: 'normal' },
  { name: 'desktop', minWidth: 1024, maxColumns: 3, defaultGap: 'normal' },
  { name: 'wide', minWidth: 1440, maxColumns: 4, defaultGap: 'spacious' },
];

// ─────────────────────────────────────────────────────────────────────────────
// WIDGET REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

export interface WidgetDefinition {
  type: DashboardWidgetType;
  name: string;
  description: string;
  icon: string;
  minWidth: 'sm' | 'md' | 'lg' | 'full';
  minHeight: number;
  category: 'productivity' | 'tracking' | 'motivation' | 'planning' | 'analysis' | 'custom';
  isBeta?: boolean;
  settings?: Array<{
    key: string;
    label: string;
    type: 'boolean' | 'number' | 'select' | 'text';
    default: unknown;
    options?: Array<{ label: string; value: unknown }>;
  }>;
}

export const WIDGET_REGISTRY: Record<DashboardWidgetType, WidgetDefinition> = {
  'today-focus': {
    type: 'today-focus',
    name: 'Today\'s Focus',
    description: 'Display today\'s priority tasks',
    icon: '🎯',
    minWidth: 'md',
    minHeight: 2,
    category: 'productivity',
    settings: [
      { key: 'limit', label: 'Max tasks shown', type: 'number', default: 5 },
      { key: 'sortBy', label: 'Sort by', type: 'select', default: 'priority', options: [
        { label: 'Priority', value: 'priority' },
        { label: 'Due date', value: 'dueDate' },
        { label: 'Time estimate', value: 'estimate' },
      ]},
      { key: 'showEstimates', label: 'Show time estimates', type: 'boolean', default: true },
    ],
  },

  'quick-add': {
    type: 'quick-add',
    name: 'Quick Add',
    description: 'Quickly add tasks, habits, goals',
    icon: '➕',
    minWidth: 'md',
    minHeight: 1,
    category: 'productivity',
    settings: [
      { key: 'focus', label: 'Focus mode', type: 'boolean', default: false },
      { key: 'defaultCategory', label: 'Default category', type: 'select', default: 'PERSONAL' },
    ],
  },

  'task-list': {
    type: 'task-list',
    name: 'Task List',
    description: 'Full task list with filters',
    icon: '✓',
    minWidth: 'md',
    minHeight: 2,
    category: 'tracking',
    settings: [
      { key: 'filter', label: 'Filter', type: 'select', default: 'active' },
      { key: 'limit', label: 'Tasks per page', type: 'number', default: 20 },
    ],
  },

  'habit-tracker': {
    type: 'habit-tracker',
    name: 'Habit Tracker',
    description: 'Track daily habits and streaks',
    icon: '💪',
    minWidth: 'md',
    minHeight: 2,
    category: 'tracking',
    settings: [
      { key: 'showStreak', label: 'Show streaks', type: 'boolean', default: true },
      { key: 'limit', label: 'Habits shown', type: 'number', default: 6 },
    ],
  },

  'goal-progress': {
    type: 'goal-progress',
    name: 'Goal Progress',
    description: 'View all goals with progress bars',
    icon: '🏆',
    minWidth: 'lg',
    minHeight: 2,
    category: 'tracking',
    settings: [
      { key: 'showMilestones', label: 'Show milestones', type: 'boolean', default: true },
      { key: 'showProgress', label: 'Show progress bar', type: 'boolean', default: true },
    ],
  },

  'calendar': {
    type: 'calendar',
    name: 'Calendar',
    description: 'Monthly calendar view',
    icon: '📅',
    minWidth: 'md',
    minHeight: 2,
    category: 'planning',
  },

  'achievements': {
    type: 'achievements',
    name: 'Achievements',
    description: 'Recent unlocked badges',
    icon: '🏅',
    minWidth: 'md',
    minHeight: 2,
    category: 'motivation',
    settings: [
      { key: 'showRecent', label: 'Show recent only', type: 'boolean', default: true },
      { key: 'limit', label: 'Achievements shown', type: 'number', default: 3 },
    ],
  },

  'motivation-quote': {
    type: 'motivation-quote',
    name: 'Daily Motivation',
    description: 'Inspiring quote of the day',
    icon: '✨',
    minWidth: 'sm',
    minHeight: 1,
    category: 'motivation',
  },

  'productivity-chart': {
    type: 'productivity-chart',
    name: 'Productivity Chart',
    description: 'Weekly/monthly productivity trends',
    icon: '📊',
    minWidth: 'md',
    minHeight: 2,
    category: 'analysis',
    settings: [
      { key: 'timeframe', label: 'Timeframe', type: 'select', default: 'week', options: [
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
      ]},
    ],
  },

  'weather': {
    type: 'weather',
    name: 'Weather',
    description: 'Current weather and forecast',
    icon: '⛅',
    minWidth: 'sm',
    minHeight: 1,
    category: 'custom',
  },

  'energy-level': {
    type: 'energy-level',
    name: 'Energy Level',
    description: 'Track and display your energy level',
    icon: '⚡',
    minWidth: 'sm',
    minHeight: 1,
    category: 'tracking',
    settings: [
      { key: 'interactive', label: 'Interactive', type: 'boolean', default: true },
    ],
  },

  'notes': {
    type: 'notes',
    name: 'Quick Notes',
    description: 'Take and display quick notes',
    icon: '📝',
    minWidth: 'md',
    minHeight: 2,
    category: 'productivity',
  },

  'partner-sync': {
    type: 'partner-sync',
    name: 'Partner Sync',
    description: 'Check in with accountability partner',
    icon: '🤝',
    minWidth: 'md',
    minHeight: 1,
    category: 'custom',
  },

  'brain-dump': {
    type: 'brain-dump',
    name: 'Brain Dump',
    description: 'Quick brain dump entry',
    icon: '🧘',
    minWidth: 'md',
    minHeight: 1,
    category: 'productivity',
  },

  'focus-timer': {
    type: 'focus-timer',
    name: 'Focus Timer',
    description: 'Pomodoro-style timer',
    icon: '⏱️',
    minWidth: 'sm',
    minHeight: 1,
    category: 'productivity',
  },

  'welcome': {
    type: 'welcome',
    name: 'Welcome',
    description: 'Welcome banner',
    icon: '👋',
    minWidth: 'full',
    minHeight: 1,
    category: 'custom',
  },

  'next-milestone': {
    type: 'next-milestone',
    name: 'Next Milestone',
    description: 'Your next big milestone',
    icon: '🎯',
    minWidth: 'md',
    minHeight: 1,
    category: 'motivation',
  },

  'streak-display': {
    type: 'streak-display',
    name: 'Streak Display',
    description: 'Highlight current streak',
    icon: '🔥',
    minWidth: 'sm',
    minHeight: 1,
    category: 'tracking',
  },

  'custom-stats': {
    type: 'custom-stats',
    name: 'Custom Stats',
    description: 'Define your own metrics',
    icon: '📈',
    minWidth: 'md',
    minHeight: 1,
    category: 'analysis',
    isBeta: true,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT PERSISTENCE
// ─────────────────────────────────────────────────────────────────────────────

export interface LayoutProfile {
  id: string;
  userId: string;
  layouts: DashboardLayout[];
  activeLayoutId: string;
  createdAt: Date;
  updatedAt: Date;
}
