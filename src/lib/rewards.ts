// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Reward System
// Heartwarming messages, badges, and meaningful recognition
// Focus on genuine self-satisfaction, not fake dopamine
// ═══════════════════════════════════════════════════════════════════════════════

import { playSound } from './sounds';

// ─────────────────────────────────────────────────────────────────────────────────
// HEARTWARMING MESSAGES
// ─────────────────────────────────────────────────────────────────────────────────

// Task completion messages - genuine and encouraging
export const taskCompletionMessages = [
  "You showed up. That's what matters.",
  "Another step forward on your journey.",
  "Small wins lead to big transformations.",
  "You're building the life you want, one task at a time.",
  "Progress isn't always visible, but it's always happening.",
  "Your future self will thank you for this moment.",
  "This is exactly how dreams become reality.",
  "You chose growth today. Be proud of that.",
  "Every expert was once a beginner. Keep going.",
  "You're not just checking boxes—you're becoming someone new.",
];

// Streak messages - meaningful acknowledgment
export const streakMessages: Record<number, string> = {
  3: "3 days of showing up. You're building something real.",
  7: "One full week. The habit is taking root.",
  14: "Two weeks strong. This is becoming who you are.",
  21: "21 days—the beginning of a real habit. You've proven you can do this.",
  30: "A full month! You've changed. Do you feel it?",
  60: "60 days. Most people quit after a week. You're in the top 1%.",
  90: "90 days. This isn't a streak anymore—it's just who you are now.",
  180: "Half a year of dedication. You should be genuinely proud.",
  365: "One year. 365 days of choosing yourself. This is extraordinary.",
};

// Level up messages
export const levelUpMessages: Record<number, string> = {
  2: "Level 2 unlocked. You're off to a great start!",
  5: "Level 5. You're building real momentum now.",
  10: "Level 10! Double digits. The dedication is showing.",
  15: "Level 15. Halfway to mastery vibes.",
  20: "Level 20. You're becoming unstoppable.",
  25: "Level 25! Quarter-century of growth.",
  50: "Level 50. Elite dedication. Respect.",
  75: "Level 75. True commitment personified.",
  100: "Level 100. Legendary status achieved.",
};

// Morning motivation messages
export const morningMessages = [
  "Good morning! Today is full of possibility.",
  "A new day, a new opportunity to become who you want to be.",
  "Rise and shine! Your goals are waiting.",
  "Today's effort is tomorrow's reward.",
  "Make today count. You've got this.",
];

// Evening reflection messages
export const eveningMessages = [
  "Great work today! Rest well, you've earned it.",
  "Another day of growth in the books. Be proud.",
  "Sleep well knowing you moved closer to your dreams.",
  "You showed up today. That's what winners do.",
  "Tomorrow is another chance to be amazing.",
];

// ─────────────────────────────────────────────────────────────────────────────────
// BADGE SYSTEM
// ─────────────────────────────────────────────────────────────────────────────────

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'streak' | 'achievement' | 'milestone' | 'special';
  unlockedAt?: Date;
}

export const BADGES: Badge[] = [
  // Streak Badges
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first task',
    icon: 'FS',
    rarity: 'common',
    category: 'achievement',
  },
  {
    id: 'hat-trick',
    name: 'Hat Trick',
    description: '3-day streak',
    icon: 'HT',
    rarity: 'common',
    category: 'streak',
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: '7-day streak',
    icon: 'WW',
    rarity: 'uncommon',
    category: 'streak',
  },
  {
    id: 'fortnight-force',
    name: 'Fortnight Force',
    description: '14-day streak',
    icon: 'FF',
    rarity: 'uncommon',
    category: 'streak',
  },
  {
    id: 'habit-former',
    name: 'Habit Former',
    description: '21-day streak - the habit threshold',
    icon: 'HF',
    rarity: 'rare',
    category: 'streak',
  },
  {
    id: 'monthly-master',
    name: 'Monthly Master',
    description: '30-day streak',
    icon: 'MM',
    rarity: 'rare',
    category: 'streak',
  },
  {
    id: 'iron-will',
    name: 'Iron Will',
    description: '60-day streak',
    icon: 'IW',
    rarity: 'epic',
    category: 'streak',
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: '100-day streak',
    icon: 'C',
    rarity: 'epic',
    category: 'streak',
  },
  {
    id: 'year-legend',
    name: 'Year Legend',
    description: '365-day streak',
    icon: 'YL',
    rarity: 'legendary',
    category: 'streak',
  },

  // Achievement Badges
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete a task before 7 AM',
    icon: 'EB',
    rarity: 'common',
    category: 'achievement',
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete a task after 10 PM',
    icon: 'NO',
    rarity: 'common',
    category: 'achievement',
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete all daily tasks',
    icon: 'P',
    rarity: 'uncommon',
    category: 'achievement',
  },
  {
    id: 'multitasker',
    name: 'Multitasker',
    description: 'Complete 10 tasks in one day',
    icon: 'MT',
    rarity: 'rare',
    category: 'achievement',
  },
  {
    id: 'habit-collector',
    name: 'Habit Collector',
    description: 'Track 5 different habits',
    icon: 'HC',
    rarity: 'uncommon',
    category: 'achievement',
  },
  {
    id: 'goal-setter',
    name: 'Goal Setter',
    description: 'Set your first major goal',
    icon: 'GS',
    rarity: 'common',
    category: 'milestone',
  },
  {
    id: 'goal-achiever',
    name: 'Goal Achiever',
    description: 'Complete a major goal',
    icon: 'GA',
    rarity: 'epic',
    category: 'milestone',
  },

  // Special Badges
  {
    id: 'comeback-kid',
    name: 'Comeback Kid',
    description: 'Return after a break and complete a task',
    icon: 'CK',
    rarity: 'uncommon',
    category: 'special',
  },
  {
    id: 'weekend-warrior',
    name: 'Weekend Warrior',
    description: 'Complete tasks on both Saturday and Sunday',
    icon: 'WE',
    rarity: 'common',
    category: 'special',
  },
  {
    id: 'zen-master',
    name: 'Zen Master',
    description: 'Complete a focus session without interruption',
    icon: 'ZM',
    rarity: 'rare',
    category: 'special',
  },
];

// Get badge by ID
export function getBadge(id: string): Badge | undefined {
  return BADGES.find(b => b.id === id);
}

// Get badges by category
export function getBadgesByCategory(category: Badge['category']): Badge[] {
  return BADGES.filter(b => b.category === category);
}

// Get rarity color
export function getRarityColor(rarity: Badge['rarity']): string {
  switch (rarity) {
    case 'common': return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    case 'uncommon': return 'text-green-400 border-green-400/30 bg-green-400/10';
    case 'rare': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    case 'epic': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
    case 'legendary': return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// REWARD FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────

// Get a random completion message
export function getRandomCompletionMessage(): string {
  const index = Math.floor(Math.random() * taskCompletionMessages.length);
  return taskCompletionMessages[index];
}

// Get streak message if applicable
export function getStreakMessage(streak: number): string | null {
  // Check for exact matches first
  if (streakMessages[streak]) {
    return streakMessages[streak];
  }
  return null;
}

// Get level up message if applicable
export function getLevelUpMessage(level: number): string | null {
  if (levelUpMessages[level]) {
    return levelUpMessages[level];
  }
  // Generic level up message for non-special levels
  return `Level ${level} achieved! Keep climbing!`;
}

// Get time-appropriate greeting
export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return morningMessages[Math.floor(Math.random() * morningMessages.length)];
  } else if (hour < 17) {
    return "Good afternoon! How's your progress going?";
  } else {
    return eveningMessages[Math.floor(Math.random() * eveningMessages.length)];
  }
}

// Play reward sound based on type
export function playRewardSound(type: 'task' | 'habit' | 'streak' | 'level' | 'achievement' | 'goal'): void {
  switch (type) {
    case 'task':
      playSound('taskComplete');
      break;
    case 'habit':
      playSound('habitComplete');
      break;
    case 'streak':
      playSound('streakMilestone');
      break;
    case 'level':
      playSound('levelUp');
      break;
    case 'achievement':
      playSound('achievement');
      break;
    case 'goal':
      playSound('goalComplete');
      break;
  }
}

// Check and return newly earned badges based on user stats
export function checkNewBadges(
  stats: {
    totalTasksCompleted: number;
    currentStreak: number;
    longestStreak: number;
    level: number;
    goalsCompleted: number;
    habitsTracked: number;
  },
  existingBadges: string[]
): Badge[] {
  const newBadges: Badge[] = [];
  
  // First task
  if (stats.totalTasksCompleted >= 1 && !existingBadges.includes('first-steps')) {
    newBadges.push(getBadge('first-steps')!);
  }
  
  // Streak badges
  const streakBadges = [
    { streak: 3, id: 'hat-trick' },
    { streak: 7, id: 'week-warrior' },
    { streak: 14, id: 'fortnight-force' },
    { streak: 21, id: 'habit-former' },
    { streak: 30, id: 'monthly-master' },
    { streak: 60, id: 'iron-will' },
    { streak: 100, id: 'centurion' },
    { streak: 365, id: 'year-legend' },
  ];
  
  for (const { streak, id } of streakBadges) {
    if (stats.currentStreak >= streak && !existingBadges.includes(id)) {
      newBadges.push(getBadge(id)!);
    }
  }
  
  // Goal setter badge
  if (stats.goalsCompleted >= 1 && !existingBadges.includes('goal-achiever')) {
    newBadges.push(getBadge('goal-achiever')!);
  }
  
  // Habit collector badge
  if (stats.habitsTracked >= 5 && !existingBadges.includes('habit-collector')) {
    newBadges.push(getBadge('habit-collector')!);
  }
  
  return newBadges;
}
