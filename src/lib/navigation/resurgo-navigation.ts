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
    label: 'Home',
    collapsible: false,
    defaultOpen: true,
    items: [
      { href: '/dashboard', label: 'Home', iconName: 'home', keywords: ['today', 'plan', 'quick add', 'dashboard'] },
    ],
  },
  {
    label: 'Plan',
    collapsible: true,
    defaultOpen: true,
    items: [
      { href: '/goals', label: 'Goals', iconName: 'goals', keywords: ['milestones', 'vision board', 'targets'] },
      { href: '/calendar', label: 'Calendar', iconName: 'calendar', keywords: ['daily', 'weekly', 'focus sessions'] },
      { href: '/coach', label: 'AI Coach', iconName: 'coach', keywords: ['chat', 'plan builder', 'bots'] },
    ],
  },
  {
    label: 'Body',
    collapsible: true,
    defaultOpen: true,
    items: [
      { href: '/fitness', label: 'Fitness', iconName: 'fire', keywords: ['workouts', 'strength', 'cardio', 'steps'] },
      { href: '/food', label: 'Food', iconName: 'heart', keywords: ['meals', 'macros', 'calories', 'water'] },
      { href: '/health', label: 'Health', iconName: 'wellness', keywords: ['sleep', 'energy', 'supplements', 'recovery'] },
    ],
  },
  {
    label: 'Mind',
    collapsible: true,
    defaultOpen: true,
    items: [
      { href: '/wellness', label: 'Wellness', iconName: 'wellness', keywords: ['mood', 'journal', 'gratitude', 'meditation'] },
      { href: '/analytics', label: 'Analytics', iconName: 'analytics', keywords: ['weekly review', 'streaks', 'insights', 'charts'] },
    ],
  },
  {
    label: 'Tools',
    collapsible: true,
    defaultOpen: false,
    items: [
      { href: '/tasks', label: 'Tasks', iconName: 'tasks', keywords: ['todo', 'queue', 'quick task'] },
      { href: '/habits', label: 'Habits', iconName: 'habits', keywords: ['streaks', 'routine', 'minimum version'] },
      { href: '/focus', label: 'Focus', iconName: 'focus', keywords: ['pomodoro', 'deep work', 'timer'] },
      { href: '/brain-dump', label: 'Brain Dump', iconName: 'sparkles', keywords: ['capture', 'triage', 'ideas'] },
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
  { href: '/food', label: 'Food', iconName: 'heart', keywords: ['meals', 'water'] },
  { href: '/fitness', label: 'Fitness', iconName: 'fire', keywords: ['workout'] },
];

export const RESURGO_ALL_NAV_ITEMS = RESURGO_NAV_SECTIONS.flatMap((section) => section.items);
