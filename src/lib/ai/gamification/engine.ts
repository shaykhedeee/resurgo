// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Gamification & Motivation Engine
// Points, streaks, achievements, badges, leaderboards, daily challenges
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// ACHIEVEMENT BADGES
// ─────────────────────────────────────────────────────────────────────────────

export type AchievementBadge = 
  | 'first-task' | 'first-goal' | 'week-warrior' | 'focus-master' | 'habit-hero'
  | 'streak-7' | 'streak-30' | 'streak-100' | 'morning-person' | 'night-owl'
  | 'goal-crusher' | 'momentum-builder' | 'consistency-king' | 'early-adopter'
  | 'social-butterfly' | 'partner-finder' | 'coach-approved' | 'wellness-warrior'
  | 'productivity-legend' | 'vision-board-artist' | 'brain-dump-champion';

export interface Achievement {
  id: AchievementBadge;
  name: string;
  description: string;
  icon: string; // emoji or icon name
  pointsReward: number;
  unlockedAt?: Date;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  trigger: 'manual' | 'automatic';
}

export const ACHIEVEMENTS: Record<AchievementBadge, Omit<Achievement, 'unlockedAt'>> = {
  'first-task': {
    id: 'first-task',
    name: 'Getting Started',
    description: 'Create your first task',
    icon: '🚀',
    pointsReward: 10,
    rarity: 'common',
    trigger: 'automatic',
  },
  'first-goal': {
    id: 'first-goal',
    name: 'Goal Setter',
    description: 'Define your first goal',
    icon: '🎯',
    pointsReward: 25,
    rarity: 'common',
    trigger: 'automatic',
  },
  'week-warrior': {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Complete 10 tasks in a single week',
    icon: '⚔️',
    pointsReward: 50,
    rarity: 'uncommon',
    trigger: 'automatic',
  },
  'focus-master': {
    id: 'focus-master',
    name: 'Focus Master',
    description: 'Complete 5 consecutive focus sessions without interruption',
    icon: '🧠',
    pointsReward: 75,
    rarity: 'uncommon',
    trigger: 'automatic',
  },
  'habit-hero': {
    id: 'habit-hero',
    name: 'Habit Hero',
    description: 'Build your first habit to 7-day streak',
    icon: '💪',
    pointsReward: 40,
    rarity: 'uncommon',
    trigger: 'automatic',
  },
  'streak-7': {
    id: 'streak-7',
    name: '7-Day Streak',
    description: 'Maintain a 7-day streak on any habit',
    icon: '🔥',
    pointsReward: 35,
    rarity: 'uncommon',
    trigger: 'automatic',
  },
  'streak-30': {
    id: 'streak-30',
    name: '30-Day Master',
    description: 'Achieve a 30-day streak (the golden standard)',
    icon: '👑',
    pointsReward: 150,
    rarity: 'rare',
    trigger: 'automatic',
  },
  'streak-100': {
    id: 'streak-100',
    name: 'Unstoppable',
    description: '100-day streak — pure dedication',
    icon: '⭐',
    pointsReward: 500,
    rarity: 'legendary',
    trigger: 'automatic',
  },
  'morning-person': {
    id: 'morning-person',
    name: 'Early Bird',
    description: 'Complete 5 tasks before 9 AM',
    icon: '🌅',
    pointsReward: 30,
    rarity: 'uncommon',
    trigger: 'automatic',
  },
  'night-owl': {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete 5 tasks after 9 PM',
    icon: '🌙',
    pointsReward: 30,
    rarity: 'uncommon',
    trigger: 'automatic',
  },
  'goal-crusher': {
    id: 'goal-crusher',
    name: 'Goal Crusher',
    description: 'Complete 5 goals successfully',
    icon: '🏆',
    pointsReward: 200,
    rarity: 'rare',
    trigger: 'automatic',
  },
  'momentum-builder': {
    id: 'momentum-builder',
    name: 'Momentum Builder',
    description: 'Complete 3 tasks before noon',
    icon: '📈',
    pointsReward: 25,
    rarity: 'common',
    trigger: 'automatic',
  },
  'consistency-king': {
    id: 'consistency-king',
    name: 'Consistency King',
    description: 'Maintain 3 habits simultaneously for 14 days',
    icon: '👑',
    pointsReward: 100,
    rarity: 'rare',
    trigger: 'automatic',
  },
  'early-adopter': {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'Sign up in the first 1000 users',
    icon: '🎖️',
    pointsReward: 10,
    rarity: 'uncommon',
    trigger: 'manual',
  },
  'social-butterfly': {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Share your progress 5 times',
    icon: '🦋',
    pointsReward: 40,
    rarity: 'uncommon',
    trigger: 'automatic',
  },
  'partner-finder': {
    id: 'partner-finder',
    name: 'Partner Finder',
    description: 'Find an accountability partner',
    icon: '🤝',
    pointsReward: 60,
    rarity: 'rare',
    trigger: 'automatic',
  },
  'coach-approved': {
    id: 'coach-approved',
    name: 'Coach Approved',
    description: 'Get AI coach feedback on 3 weekly reviews',
    icon: '✨',
    pointsReward: 75,
    rarity: 'rare',
    trigger: 'automatic',
  },
  'wellness-warrior': {
    id: 'wellness-warrior',
    name: 'Wellness Warrior',
    description: 'Complete fitness + nutrition + sleep goals for a full week',
    icon: '💚',
    pointsReward: 100,
    rarity: 'rare',
    trigger: 'automatic',
  },
  'productivity-legend': {
    id: 'productivity-legend',
    name: 'Productivity Legend',
    description: 'Unlock 10 achievements',
    icon: '🚀',
    pointsReward: 250,
    rarity: 'epic',
    trigger: 'automatic',
  },
  'vision-board-artist': {
    id: 'vision-board-artist',
    name: 'Vision Board Artist',
    description: 'Create and customize a vision board with 10+ images',
    icon: '🎨',
    pointsReward: 80,
    rarity: 'rare',
    trigger: 'automatic',
  },
  'brain-dump-champion': {
    id: 'brain-dump-champion',
    name: 'Brain Dump Champion',
    description: 'Process 10 brain dumps (clear your mind)',
    icon: '🧘',
    pointsReward: 50,
    rarity: 'uncommon',
    trigger: 'automatic',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// POINTS SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

export interface PointsBreakdown {
  taskCompletion: number;
  difficultyBonus: number;
  speedBonus: number;
  streakMultiplier: number;
  consistencyBonus: number;
  total: number;
}

export function calculatePoints(
  taskData: {
    estimatedMinutes?: number | null;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    isStreakRelated?: boolean;
    timeToComplete?: number; // actual minutes
    daysSinceLastTask?: number;
  }
): PointsBreakdown {
  // Base points by priority
  const basePriorityPoints: Record<string, number> = {
    CRITICAL: 50,
    HIGH: 30,
    MEDIUM: 15,
    LOW: 5,
  };

  const taskCompletion = basePriorityPoints[taskData.priority] || 10;

  // Difficulty bonus (if estimated > 30 min, reward more)
  const estimatedMinutes = taskData.estimatedMinutes || 30;
  const difficultyBonus = Math.floor(estimatedMinutes / 30) * 10;

  // Speed bonus (completed faster than estimated)
  const speedBonus = taskData.timeToComplete && estimatedMinutes > 0
    ? Math.max(0, Math.floor((1 - (taskData.timeToComplete / estimatedMinutes)) * 20))
    : 0;

  // Streak multiplier (habits/related tasks)
  const streakMultiplier = taskData.isStreakRelated ? 1.5 : 1.0;

  // Consistency bonus (tasks completed regularly)
  const daysSinceLastTask = taskData.daysSinceLastTask ?? 7;
  const consistencyBonus = daysSinceLastTask <= 1 ? 5 : (daysSinceLastTask <= 3 ? 3 : 0);

  const total = Math.floor((taskCompletion + difficultyBonus + speedBonus + consistencyBonus) * streakMultiplier);

  return {
    taskCompletion,
    difficultyBonus,
    speedBonus,
    streakMultiplier,
    consistencyBonus,
    total,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DAILY CHALLENGES
// ─────────────────────────────────────────────────────────────────────────────

export type DailyChallengeType = 
  | 'complete-3-tasks' | 'morning-momentum' | 'focus-session' | 'habit-complete'
  | 'health-day' | 'reflection' | 'goal-review' | 'brain-dump' | 'partner-sync';

export interface DailyChallenge {
  id: string;
  type: DailyChallengeType;
  name: string;
  description: string;
  pointsReward: number;
  progress: number;
  target: number;
  completed: boolean;
  icon: string;
  deadline?: Date;
}

export const DAILY_CHALLENGES: Record<DailyChallengeType, Omit<DailyChallenge, 'id' | 'progress' | 'completed' | 'deadline'>> = {
  'complete-3-tasks': {
    type: 'complete-3-tasks',
    name: '3-Task Tuesday',
    description: 'Complete 3 tasks today',
    pointsReward: 30,
    target: 3,
    icon: '✅',
  },
  'morning-momentum': {
    type: 'morning-momentum',
    name: 'Morning Momentum',
    description: 'Complete your first task before 10 AM',
    pointsReward: 20,
    target: 1,
    icon: '🌅',
  },
  'focus-session': {
    type: 'focus-session',
    name: 'Deep Focus',
    description: 'Complete 25-minute focus session (or equivalent)',
    pointsReward: 25,
    target: 1,
    icon: '🎯',
  },
  'habit-complete': {
    type: 'habit-complete',
    name: 'Habit Today',
    description: 'Check in on any habit',
    pointsReward: 15,
    target: 1,
    icon: '💪',
  },
  'health-day': {
    type: 'health-day',
    name: 'Wellness Day',
    description: 'Complete fitness + nutrition + sleep tasks',
    pointsReward: 40,
    target: 3,
    icon: '💚',
  },
  'reflection': {
    type: 'reflection',
    name: 'Reflect',
    description: 'Write evening reflection (5+ minutes)',
    pointsReward: 20,
    target: 1,
    icon: '📝',
  },
  'goal-review': {
    type: 'goal-review',
    name: 'Goal Review',
    description: 'Review progress on 1 goal',
    pointsReward: 25,
    target: 1,
    icon: '🎯',
  },
  'brain-dump': {
    type: 'brain-dump',
    name: 'Brain Dump',
    description: 'Clear your mind with a brain dump (2+ min)',
    pointsReward: 20,
    target: 1,
    icon: '🧘',
  },
  'partner-sync': {
    type: 'partner-sync',
    name: 'Partner Sync',
    description: 'Check in with accountability partner',
    pointsReward: 30,
    target: 1,
    icon: '🤝',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// LEADERBOARD & RANKS
// ─────────────────────────────────────────────────────────────────────────────

export type UserRank = 'Rookie' | 'Climber' | 'Achiever' | 'Master' | 'Legend' | 'Immortal';

export interface UserGamificationStats {
  totalPoints: number;
  rank: UserRank;
  achievementsUnlocked: number;
  currentStreak: number;
  longestStreak: number;
  tasksCompleted: number;
  goalsCompleted: number;
  leaderboardPosition?: number;
  nextMilestone: { threshold: number; rank: UserRank; pointsToGo: number };
}

export function calculateRank(points: number): UserRank {
  if (points >= 10000) return 'Immortal';
  if (points >= 5000) return 'Legend';
  if (points >= 2000) return 'Master';
  if (points >= 500) return 'Achiever';
  if (points >= 100) return 'Climber';
  return 'Rookie';
}

export function getNextMilestone(points: number): { threshold: number; rank: UserRank; pointsToGo: number } {
  const milestones = [
    { threshold: 100, rank: 'Climber' as const },
    { threshold: 500, rank: 'Achiever' as const },
    { threshold: 2000, rank: 'Master' as const },
    { threshold: 5000, rank: 'Legend' as const },
    { threshold: 10000, rank: 'Immortal' as const },
  ];

  for (const milestone of milestones) {
    if (points < milestone.threshold) {
      return {
        threshold: milestone.threshold,
        rank: milestone.rank,
        pointsToGo: milestone.threshold - points,
      };
    }
  }

  return { threshold: 10000, rank: 'Immortal', pointsToGo: 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// STREAK CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: Date | null;
  inDanger: boolean; // streak will break tomorrow if no action
}

export function calculateStreak(
  completionDates: Date[],
  today: Date = new Date()
): StreakData {
  if (completionDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      inDanger: false,
    };
  }

  const sortedDates = completionDates
    .map(d => new Date(d).toDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Find current streak
  let currentStreak = 0;
  const uniqueDates = Array.from(new Set(sortedDates));
  
  for (let i = 0; i < uniqueDates.length; i++) {
    const date = new Date(uniqueDates[i]);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (date.toDateString() === expectedDate.toDateString()) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Find longest streak
  let longestStreak = 1;
  let tempStreak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = new Date(uniqueDates[i - 1]);
    const previousDate = new Date(uniqueDates[i]);
    
    const dayDiff = Math.floor((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
    if (dayDiff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  // Check if streak is in danger (last completion was yesterday)
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const inDanger = currentStreak > 0 && new Date(uniqueDates[0]).toDateString() === yesterday.toDateString();

  return {
    currentStreak,
    longestStreak,
    lastCompletedDate: uniqueDates.length > 0 ? new Date(uniqueDates[0]) : null,
    inDanger,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// REWARD TIERS
// ─────────────────────────────────────────────────────────────────────────────

export interface RewardTier {
  name: string;
  description: string;
  pointsNeeded: number;
  benefits: string[];
  unlockedAt?: Date;
}

export const REWARD_TIERS: Record<string, RewardTier> = {
  'tier-1': {
    name: 'Starter',
    description: 'You\'re just getting started!',
    pointsNeeded: 0,
    benefits: ['Access to all core features', 'Daily challenges', 'Basic leaderboard'],
  },
  'tier-2': {
    name: 'Rising Star',
    description: '100 points earned',
    pointsNeeded: 100,
    benefits: ['All Tier 1 benefits', 'Custom dashboard widgets', 'Advanced analytics'],
  },
  'tier-3': {
    name: 'Power User',
    description: '500 points earned',
    pointsNeeded: 500,
    benefits: ['All Tier 2 benefits', 'Priority support', 'API access', 'Team features'],
  },
  'tier-4': {
    name: 'Pro Elite',
    description: '2000 points earned',
    pointsNeeded: 2000,
    benefits: ['All Tier 3 benefits', 'Custom integrations', 'White-label options', 'Coaching'],
  },
  'tier-5': {
    name: 'Legend',
    description: '5000+ points earned',
    pointsNeeded: 5000,
    benefits: ['All Tier 4 benefits', 'Exclusive community', 'Speaking opportunities', 'Beta features'],
  },
};
