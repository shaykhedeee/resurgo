// ═══════════════════════════════════════════════════════════════════════════════
// PIXEL ICON SYSTEM
// 16×16 pixel-art icons on a grid — replaces smooth SVG Lucide icons
// Usage: <PixelIcon name="dashboard" size={20} className="text-orange-400" />
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { cn } from '@/lib/utils';

export type PixelIconName =
  | 'dashboard' | 'goals' | 'tasks' | 'habits' | 'focus'
  | 'analytics' | 'calendar' | 'wellness' | 'budget' | 'business'
  | 'plan' | 'vision' | 'coach' | 'integrations' | 'refer'
  | 'settings' | 'arrow-up' | 'arrow-right' | 'arrow-left' | 'arrow-down'
  | 'check' | 'x' | 'star' | 'heart' | 'fire'
  | 'trophy' | 'zap' | 'menu' | 'chevron-left' | 'chevron-right'
  | 'message' | 'bell' | 'home' | 'timer' | 'sparkles'
  | 'terminal' | 'robot' | 'grid' | 'loop' | 'sun' | 'moon';

interface PixelIconProps {
  name: PixelIconName;
  size?: number;
  className?: string;
}

// Each icon is defined as an array of [x, y, w, h] rects on a 16×16 grid
// Colors use "currentColor" so they inherit from text color classes
const ICON_PATHS: Record<PixelIconName, number[][]> = {
  // Dashboard — 4-panel grid 
  dashboard: [
    [2,2,5,5], [9,2,5,5], [2,9,5,5], [9,9,5,5],
  ],
  // Goals — target/bullseye
  goals: [
    [6,1,4,1], [4,2,2,1], [10,2,2,1], [3,3,1,2], [12,3,1,2],
    [2,5,1,2], [13,5,1,2], [6,5,4,1], [5,6,2,1], [9,6,2,1],
    [7,7,2,2], // center pixel
    [2,9,1,2], [13,9,1,2], [3,11,1,2], [12,11,1,2],
    [4,13,2,1], [10,13,2,1], [6,14,4,1],
  ],
  // Tasks — checklist
  tasks: [
    [2,2,2,2], [6,2,8,2], // check + line 1
    [2,6,2,2], [6,6,8,2], // check + line 2
    [2,10,2,2], [6,10,8,2], // check + line 3
  ],
  // Habits — repeating bars/streak
  habits: [
    [2,3,3,10], [6,5,3,8], [10,2,3,11],
  ],
  // Focus — timer/clock
  focus: [
    [6,1,4,1], [4,2,2,1], [10,2,2,1], [3,3,1,1], [12,3,1,1],
    [2,4,1,8], [13,4,1,8], [3,12,1,1], [12,12,1,1],
    [4,13,2,1], [10,13,2,1], [6,14,4,1],
    [7,4,2,4], [7,7,4,2], // hands
  ],
  // Analytics — bar chart
  analytics: [
    [2,10,3,4], [6,6,3,8], [10,3,3,11],
  ],
  // Calendar — grid with header
  calendar: [
    [2,1,12,3], // header
    [2,5,3,3], [6,5,3,3], [10,5,3,3],
    [2,9,3,3], [6,9,3,3], [10,9,3,3],
    [2,13,12,1],
  ],
  // Wellness — heart
  wellness: [
    [3,4,3,2], [10,4,3,2], [2,6,5,2], [9,6,5,2],
    [3,8,10,2], [4,10,8,2], [5,12,6,2], [7,14,2,1],
  ],
  // Budget — coin/dollar
  budget: [
    [6,1,4,1], [4,2,2,1], [10,2,2,1], [3,3,1,10], [12,3,1,10],
    [4,13,2,1], [10,13,2,1], [6,14,4,1],
    [7,4,2,1], [6,5,4,2], [9,7,2,2], [6,9,4,2], [5,7,2,2],
    [7,11,2,1],
  ],
  // Business — briefcase
  business: [
    [5,2,6,2], [3,4,10,2], [2,6,12,6], [2,12,12,2],
    [6,7,4,2], // handle clasp
  ],
  // Plan — clipboard/document
  plan: [
    [5,1,6,2], [3,3,10,11], [5,5,6,1], [5,7,6,1], [5,9,4,1], [5,11,6,1],
  ],
  // Vision — eye
  vision: [
    [6,4,4,1], [4,5,2,1], [10,5,2,1], [3,6,1,2], [12,6,1,2],
    [4,8,2,1], [10,8,2,1], [2,6,1,2], [13,6,1,2],
    [6,9,4,1], [7,6,2,2], // pupil
  ],
  // Coach — speech bubble
  coach: [
    [3,2,10,2], [2,4,12,6], [3,10,8,2], [4,12,2,2],
  ],
  // Integrations — puzzle/plug
  integrations: [
    [6,2,4,2], [4,4,8,3], [3,7,10,3],
    [4,10,8,3], [6,13,4,2],
  ],
  // Refer — people/gift
  refer: [
    [5,2,2,2], [10,2,2,2], // heads
    [4,4,4,2], [9,4,4,2], // bodies
    [3,6,5,3], [8,6,5,3],
    [4,10,8,4], // shared base
  ],
  // Settings — gear
  settings: [
    [7,1,2,2], [7,13,2,2], [1,7,2,2], [13,7,2,2],
    [3,3,2,2], [11,3,2,2], [3,11,2,2], [11,11,2,2],
    [5,5,6,6], [7,7,2,2], // center hole
  ],
  // Arrows
  'arrow-up': [
    [7,2,2,2], [5,4,2,2], [9,4,2,2], [3,6,2,2], [11,6,2,2],
    [7,6,2,8],
  ],
  'arrow-right': [
    [12,7,2,2], [10,5,2,2], [10,9,2,2], [8,3,2,2], [8,11,2,2],
    [2,7,8,2],
  ],
  'arrow-left': [
    [2,7,2,2], [4,5,2,2], [4,9,2,2], [6,3,2,2], [6,11,2,2],
    [6,7,8,2],
  ],
  'arrow-down': [
    [7,12,2,2], [5,10,2,2], [9,10,2,2], [3,8,2,2], [11,8,2,2],
    [7,2,2,8],
  ],
  // Check mark
  check: [
    [11,3,2,2], [9,5,2,2], [7,7,2,2], [5,9,2,2], [3,7,2,2],
  ],
  // X / Close
  x: [
    [3,3,2,2], [11,3,2,2], [5,5,2,2], [9,5,2,2], [7,7,2,2],
    [5,9,2,2], [9,9,2,2], [3,11,2,2], [11,11,2,2],
  ],
  // Star
  star: [
    [7,1,2,3], [5,4,6,2], [3,6,10,2], [5,8,6,2],
    [4,10,3,2], [9,10,3,2], [3,12,2,2], [11,12,2,2],
  ],
  // Heart
  heart: [
    [3,4,3,2], [10,4,3,2], [2,6,5,2], [9,6,5,2],
    [3,8,10,2], [4,10,8,2], [5,12,6,1], [7,13,2,1],
  ],
  // Fire
  fire: [
    [8,1,2,2], [7,3,4,2], [6,5,5,2], [5,7,6,2],
    [5,9,6,2], [6,11,4,2], [7,13,2,2],
  ],
  // Trophy
  trophy: [
    [4,1,8,2], [5,3,6,4], [2,2,2,4], [12,2,2,4],
    [6,7,4,2], [7,9,2,2], [5,11,6,2], [4,13,8,2],
  ],
  // Zap / Lightning
  zap: [
    [8,1,3,2], [7,3,3,2], [5,5,5,2], [7,7,3,2], [6,9,3,2], [5,11,3,2],
  ],
  // Menu / Hamburger
  menu: [
    [2,3,12,2], [2,7,12,2], [2,11,12,2],
  ],
  // Chevron left
  'chevron-left': [
    [9,3,2,2], [7,5,2,2], [5,7,2,2], [7,9,2,2], [9,11,2,2],
  ],
  // Chevron right
  'chevron-right': [
    [5,3,2,2], [7,5,2,2], [9,7,2,2], [7,9,2,2], [5,11,2,2],
  ],
  // Message / Chat
  message: [
    [2,3,12,2], [2,5,12,6], [3,11,8,2], [4,13,2,2],
  ],
  // Bell
  bell: [
    [7,1,2,2], [5,3,6,2], [4,5,8,4], [3,9,10,2],
    [2,11,12,2], [6,13,4,2],
  ],
  // Home
  home: [
    [7,1,2,2], [5,3,2,2], [9,3,2,2], [3,5,2,2], [11,5,2,2],
    [2,7,12,2], [3,9,10,4], [3,13,4,1], [9,13,4,1],
    [7,10,2,4],
  ],
  // Timer
  timer: [
    [6,0,4,2], [5,2,6,1], // top knob
    [6,3,4,1], [4,4,2,1], [10,4,2,1], [3,5,1,1], [12,5,1,1],
    [2,6,1,4], [13,6,1,4], [3,10,1,1], [12,10,1,1],
    [4,11,2,1], [10,11,2,1], [6,12,4,1],
    [7,5,2,3], [7,7,4,2], // hands
  ],
  // Sparkles
  sparkles: [
    [3,2,2,2], [11,2,2,2], [7,4,2,2], [2,7,2,2], [12,7,2,2],
    [5,9,2,2], [9,9,2,2], [7,12,2,2],
  ],
  terminal: [
    [2,3,12,10], [4,5,8,1], [4,7,3,1], [8,7,4,1], [4,9,6,1], [4,11,4,1],
    [5,14,6,1],
  ],
  robot: [
    [4,3,8,2], [3,5,10,7], [5,7,2,2], [9,7,2,2], [6,10,4,1], [2,13,3,2], [11,13,3,2],
  ],
  grid: [
    [2,2,4,4], [7,2,3,4], [11,2,3,4],
    [2,7,4,3], [7,7,3,3], [11,7,3,3],
    [2,11,4,3], [7,11,3,3], [11,11,3,3],
  ],
  loop: [
    [5,2,6,2], [3,4,2,6], [11,4,2,6], [5,10,6,2], [2,8,3,2], [11,8,3,2],
  ],
  sun: [
    [7,1,2,2], [7,13,2,2], [1,7,2,2], [13,7,2,2], [3,3,2,2], [11,3,2,2], [3,11,2,2], [11,11,2,2], [5,5,6,6],
  ],
  moon: [
    [8,2,3,2], [6,4,4,2], [5,6,4,2], [5,8,4,2], [6,10,4,2], [8,12,3,2], [10,4,2,8],
  ],
};

export function PixelIcon({ name, size = 16, className }: PixelIconProps) {
  const paths = ICON_PATHS[name];
  if (!paths) return null;

  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={cn("inline-block shrink-0", className)}
      fill="currentColor"
      style={{ imageRendering: 'pixelated' }}
    >
      {paths.map((rect, i) => (
        <rect key={i} x={rect[0]} y={rect[1]} width={rect[2]} height={rect[3]} />
      ))}
    </svg>
  );
}

// Mapping from nav item labels to pixel icon names
export const NAV_ICON_MAP: Record<string, PixelIconName> = {
  'Dashboard': 'dashboard',
  'Goals': 'goals',
  'Tasks': 'tasks',
  'Habits': 'habits',
  'Focus': 'focus',
  'Focus Timer': 'timer',
  'Analytics': 'analytics',
  'Calendar': 'calendar',
  'Wellness': 'wellness',
  'Fitness': 'fire',
  'Food': 'heart',
  'Health': 'wellness',
  'Budget': 'budget',
  'Business': 'business',
  'Plan Builder': 'plan',
  'Vision Board': 'vision',
  'AI Coach': 'coach',
  'Orchestrator': 'coach',
  'Integrations': 'integrations',
  'Refer & Earn': 'refer',
  'Settings': 'settings',
  'Wishlist': 'star',
};
