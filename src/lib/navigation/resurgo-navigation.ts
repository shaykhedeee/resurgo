import type { PixelIconName } from '@/components/PixelIcon';

export interface ResurgoNavItem {
  href: string;
  label: string;
  iconName: PixelIconName;
  keywords: string[];
}

export interface ResurgoNavSection {
  label: string;
  collapsible: boolean;
  defaultOpen: boolean;
  items: ResurgoNavItem[];
}

export const RESURGO_NAV_SECTIONS: ResurgoNavSection[] = [
  {
    label: 'Command',
    collapsible: false,
    defaultOpen: true,
    items: [
      { href: '/tasks', label: 'Tasks', iconName: 'tasks', keywords: ['todo', 'queue', 'quick task', 'list'] },
      { href: '/dashboard', label: 'Dashboard', iconName: 'home', keywords: ['today', 'plan', 'quick add', 'dashboard'] },
      { href: '/habits', label: 'Habits', iconName: 'habits', keywords: ['streaks', 'routine', 'minimum version'] },
      { href: '/goals', label: 'Goals', iconName: 'goals', keywords: ['milestones', 'vision board', 'targets'] },
    ],
  },
  {
    label: 'Tools & AI',
    collapsible: true,
    defaultOpen: true,
    items: [
      { href: '/focus', label: 'Focus Session', iconName: 'focus', keywords: ['pomodoro', 'deep work', 'timer'] },
      { href: '/calendar', label: 'Calendar', iconName: 'calendar', keywords: ['daily', 'weekly', 'focus sessions'] },
      { href: '/coach', label: 'AI Coach', iconName: 'coach', keywords: ['chat', 'plan builder', 'bots'] },
      { href: '/orchestrator', label: 'Orchestrator', iconName: 'terminal', keywords: ['ai', 'agents', 'sprint'] },
      { href: '/orchestrator?tab=obsidian', label: 'Mind Graph', iconName: 'goals', keywords: ['mind', 'graph', 'linked', 'obsidian'] },
      { href: '/orchestrator?tab=jira', label: 'Sprint Board', iconName: 'tasks', keywords: ['board', 'sprint', 'developer', 'scrum'] },
    ],
  },
  {
    label: 'Life Domains',
    collapsible: true,
    defaultOpen: false,
    items: [
      { href: '/fitness', label: 'Fitness', iconName: 'kettlebell', keywords: ['workouts', 'strength', 'cardio', 'steps'] },
      { href: '/food', label: 'Nutrition', iconName: 'meal-planner', keywords: ['meals', 'macros', 'calories', 'water', 'food'] },
      { href: '/budget', label: 'Budget', iconName: 'budget', keywords: ['finance', 'expenses', 'income', 'money'] },
      { href: '/wishlist', label: 'Wishlist', iconName: 'star', keywords: ['shopping', 'gifts', 'wants'] },
    ],
  },
  {
    label: 'Intelligence',
    collapsible: true,
    defaultOpen: false,
    items: [
      { href: '/analytics', label: 'Life Analytics', iconName: 'analytics', keywords: ['weekly review', 'streaks', 'insights', 'charts'] },
      { href: '/wellness', label: 'Wellbeing Log', iconName: 'wellness', keywords: ['mood', 'journal', 'gratitude', 'meditation'] },
    ],
  },
  {
    label: 'System',
    collapsible: true,
    defaultOpen: false,
    items: [
      { href: '/settings', label: 'Settings', iconName: 'settings', keywords: ['profile', 'preferences'] },
      { href: '/integrations', label: 'Integrations', iconName: 'integrations', keywords: ['connect', 'sync'] },
      { href: '/referrals', label: 'Refer & Earn', iconName: 'refer', keywords: ['invite', 'share'] },
    ],
  },
];

export const RESURGO_AI_MENU_ITEMS: ResurgoNavItem[] = [
  { href: '/coach', label: 'Chat', iconName: 'coach', keywords: ['ai coach'] },
  { href: '/plan-builder', label: 'Plan', iconName: 'plan', keywords: ['architect', 'builder'] },
  { href: '/vision-board', label: 'Vision', iconName: 'vision', keywords: ['goals', 'images'] },
];

export const RESURGO_PRIMARY_MOBILE_NAV: ResurgoNavItem[] = [
  { href: '/dashboard', label: 'Home', iconName: 'home', keywords: ['today'] },
  { href: '/goals', label: 'Goals', iconName: 'goals', keywords: ['milestones'] },
  { href: '/food', label: 'Food', iconName: 'meal-planner', keywords: ['meals', 'water'] },
  { href: '/fitness', label: 'Fitness', iconName: 'kettlebell', keywords: ['workout'] },
];

export const RESURGO_ALL_NAV_ITEMS = RESURGO_NAV_SECTIONS.flatMap((section) => section.items);
