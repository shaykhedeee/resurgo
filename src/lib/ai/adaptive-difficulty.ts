// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Adaptive Difficulty Engine
// Analyzes user performance and dynamically adjusts challenge level
// Prevents burnout (too much) and boredom (too little)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Types ───────────────────────────────────────────────────────────────────

export type DifficultyZone = 'recovery' | 'comfort' | 'growth' | 'stretch' | 'overload';

export interface PerformanceSnapshot {
  // Task metrics
  tasksCompleted7d: number;
  tasksCreated7d: number;
  taskCompletionRate: number;  // 0-1
  avgTasksPerDay: number;
  // Habit metrics
  habitCompletionRate7d: number;  // 0-1
  habitCompletionRate30d: number; // 0-1
  currentStreak: number;
  longestStreak: number;
  activeHabitCount: number;
  // Energy & mood (from daily check-ins)
  avgMood7d: number;       // 1-5
  avgEnergy7d: number;     // 1-5
  moodTrend: 'rising' | 'stable' | 'declining';
  energyTrend: 'rising' | 'stable' | 'declining';
  // Engagement signals
  checkInStreak: number;
  daysActive7d: number;
  lastActiveAt: number | null;
  // Goal progress
  activeGoalCount: number;
  goalsCompletedAllTime: number;
  avgGoalProgress: number;  // 0-100
}

export interface DifficultyAssessment {
  zone: DifficultyZone;
  score: number;  // 0-100 where 50 = optimal growth zone
  label: string;
  color: string;
  recommendations: DifficultyRecommendation[];
  insights: string[];
  adjustments: DifficultyAdjustments;
}

export interface DifficultyRecommendation {
  type: 'increase' | 'decrease' | 'maintain' | 'alert';
  area: 'tasks' | 'habits' | 'goals' | 'rest' | 'engagement';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface DifficultyAdjustments {
  suggestedDailyTasks: { min: number; max: number };
  suggestedHabitCount: { min: number; max: number };
  suggestedFocusMinutes: number;
  taskPriorityBias: 'low' | 'medium' | 'high';  // What energy tasks to suggest
  restDayRecommended: boolean;
  streakProtectionActive: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ZONE_CONFIG: Record<DifficultyZone, { label: string; color: string; scoreRange: [number, number] }> = {
  recovery:  { label: 'RECOVERY',  color: '#8b5cf6', scoreRange: [0, 15] },
  comfort:   { label: 'COMFORT',   color: '#3b82f6', scoreRange: [15, 35] },
  growth:    { label: 'GROWTH',    color: '#22c55e', scoreRange: [35, 65] },
  stretch:   { label: 'STRETCH',   color: '#f59e0b', scoreRange: [65, 85] },
  overload:  { label: 'OVERLOAD',  color: '#ef4444', scoreRange: [85, 100] },
};

// Ideal ranges for each metric (used for scoring)
const _IDEAL = {
  taskCompletionRate: { min: 0.6, optimal: 0.8, max: 1.0 },
  habitCompletionRate: { min: 0.5, optimal: 0.75, max: 1.0 },
  avgTasksPerDay: { min: 2, optimal: 5, max: 10 },
  avgMood: { min: 2.5, optimal: 3.5, max: 5 },
  avgEnergy: { min: 2.5, optimal: 3.5, max: 5 },
  activeHabits: { min: 2, optimal: 5, max: 10 },
  daysActive: { min: 3, optimal: 5, max: 7 },
};

// ─── Core Engine ─────────────────────────────────────────────────────────────

export function assessDifficulty(snapshot: PerformanceSnapshot): DifficultyAssessment {
  const score = calculateDifficultyScore(snapshot);
  const zone = getZone(score);
  const config = ZONE_CONFIG[zone];
  const recommendations = generateRecommendations(snapshot, zone, score);
  const insights = generateInsights(snapshot, zone);
  const adjustments = calculateAdjustments(snapshot, zone, score);

  return {
    zone,
    score: Math.round(score),
    label: config.label,
    color: config.color,
    recommendations,
    insights,
    adjustments,
  };
}

/**
 * Calculate a 0-100 difficulty score based on multiple performance dimensions.
 * 50 = perfect growth zone. Below 50 = under-challenged. Above 50 = over-challenged.
 */
function calculateDifficultyScore(s: PerformanceSnapshot): number {
  const weights = {
    completion: 0.25,   // Task + habit completion rates
    volume: 0.15,       // How much the user is taking on
    wellbeing: 0.20,    // Mood + energy trends
    consistency: 0.20,  // Streaks and check-in regularity
    engagement: 0.20,   // Days active, goal progress
  };

  // 1. Completion dimension (high completion = low difficulty felt)
  const taskCompScore = normalizeToGrowth(s.taskCompletionRate, 0.5, 0.8, 1.0);
  const habitCompScore = normalizeToGrowth(s.habitCompletionRate7d, 0.4, 0.75, 1.0);
  const completionDim = (taskCompScore + habitCompScore) / 2;

  // 2. Volume dimension (more items = higher difficulty)
  const volumeScore = normalizeToGrowth(
    s.avgTasksPerDay + s.activeHabitCount * 0.3,
    1, 5, 15
  );

  // 3. Wellbeing dimension (low mood/energy = too much difficulty)
  const moodScore = normalizeToGrowth(s.avgMood7d, 1.5, 3.5, 5);
  const energyScore = normalizeToGrowth(s.avgEnergy7d, 1.5, 3.5, 5);
  const trendPenalty =
    (s.moodTrend === 'declining' ? 10 : 0) +
    (s.energyTrend === 'declining' ? 10 : 0);
  const wellbeingDim = Math.max(0, Math.min(100, ((moodScore + energyScore) / 2) - trendPenalty));

  // 4. Consistency dimension (high consistency = well-managed difficulty)
  const streakScore = Math.min(100, (s.currentStreak / Math.max(s.longestStreak, 7)) * 70 + (s.checkInStreak > 3 ? 20 : 0) + (s.daysActive7d >= 5 ? 10 : 0));
  const consistencyDim = streakScore;

  // 5. Engagement dimension
  const activeDaysScore = (s.daysActive7d / 7) * 60;
  const goalProgressScore = s.activeGoalCount > 0 ? (s.avgGoalProgress / 100) * 40 : 20;
  const engagementDim = Math.min(100, activeDaysScore + goalProgressScore);

  // Weighted composite (invert some: high completion = less difficulty needed)
  const rawScore =
    (100 - completionDim) * weights.completion +  // Inverted: perfect completion means lower challenge needed
    volumeScore * weights.volume +
    (100 - wellbeingDim) * weights.wellbeing +  // Inverted: good wellbeing = lower difficulty needed
    (100 - consistencyDim) * weights.consistency +  // Inverted
    (100 - engagementDim) * weights.engagement;

  return clamp(rawScore, 0, 100);
}

/**
 * Normalize a value to a 0-100 growth score.
 * Below min → 0, at optimal → 50, at/above max → 100
 */
function normalizeToGrowth(value: number, min: number, optimal: number, max: number): number {
  if (value <= min) return 0;
  if (value <= optimal) return ((value - min) / (optimal - min)) * 50;
  if (value <= max) return 50 + ((value - optimal) / (max - optimal)) * 50;
  return 100;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function getZone(score: number): DifficultyZone {
  for (const [zone, config] of Object.entries(ZONE_CONFIG)) {
    if (score >= config.scoreRange[0] && score < config.scoreRange[1]) {
      return zone as DifficultyZone;
    }
  }
  return 'overload';
}

// ─── Recommendations ─────────────────────────────────────────────────────────

function generateRecommendations(s: PerformanceSnapshot, zone: DifficultyZone, score: number): DifficultyRecommendation[] {
  const recs: DifficultyRecommendation[] = [];

  // Recovery zone — user is struggling
  if (zone === 'recovery') {
    recs.push({
      type: 'decrease',
      area: 'tasks',
      title: 'Reduce daily tasks',
      description: 'Focus on just 1-2 must-do tasks today. Quality over quantity.',
      priority: 'high',
    });
    if (s.avgEnergy7d < 2.5 || s.avgMood7d < 2.5) {
      recs.push({
        type: 'alert',
        area: 'rest',
        title: 'Rest day recommended',
        description: 'Your energy and mood are low. Consider taking a lighter day to recharge.',
        priority: 'high',
      });
    }
    if (s.activeHabitCount > 3) {
      recs.push({
        type: 'decrease',
        area: 'habits',
        title: 'Simplify habits',
        description: `You have ${s.activeHabitCount} active habits. Pause all but your top 2-3 keystone habits.`,
        priority: 'medium',
      });
    }
  }

  // Comfort zone — user can handle more
  if (zone === 'comfort') {
    if (s.taskCompletionRate > 0.9) {
      recs.push({
        type: 'increase',
        area: 'tasks',
        title: 'Add a stretch task',
        description: 'You\'re crushing your tasks. Add one challenging task outside your comfort zone.',
        priority: 'medium',
      });
    }
    if (s.habitCompletionRate7d > 0.85 && s.activeHabitCount < 7) {
      recs.push({
        type: 'increase',
        area: 'habits',
        title: 'Stack a new habit',
        description: 'Your habit consistency is strong. Consider adding one more keystone habit.',
        priority: 'low',
      });
    }
    if (s.activeGoalCount < 2) {
      recs.push({
        type: 'increase',
        area: 'goals',
        title: 'Set a new goal',
        description: 'You have room for a new goal. What\'s the next meaningful target?',
        priority: 'medium',
      });
    }
  }

  // Growth zone — optimal, maintain
  if (zone === 'growth') {
    recs.push({
      type: 'maintain',
      area: 'tasks',
      title: 'Stay the course',
      description: 'You\'re in the optimal growth zone. Keep your current pace.',
      priority: 'low',
    });
    if (s.moodTrend === 'declining') {
      recs.push({
        type: 'alert',
        area: 'rest',
        title: 'Watch your mood',
        description: 'Your mood is trending down. Schedule something enjoyable today.',
        priority: 'medium',
      });
    }
  }

  // Stretch zone — pushing hard, monitor closely
  if (zone === 'stretch') {
    if (s.taskCompletionRate < 0.6) {
      recs.push({
        type: 'decrease',
        area: 'tasks',
        title: 'Reduce task load',
        description: `Only ${Math.round(s.taskCompletionRate * 100)}% task completion. Drop non-essential tasks.`,
        priority: 'high',
      });
    }
    if (s.energyTrend === 'declining') {
      recs.push({
        type: 'alert',
        area: 'rest',
        title: 'Energy declining',
        description: 'Your energy is dropping. Build in recovery time before burnout hits.',
        priority: 'high',
      });
    }
    recs.push({
      type: 'maintain',
      area: 'engagement',
      title: 'High challenge mode',
      description: 'You\'re pushing yourself hard. This is sustainable short-term — monitor how you feel.',
      priority: 'medium',
    });
  }

  // Overload zone — danger
  if (zone === 'overload') {
    recs.push({
      type: 'decrease',
      area: 'tasks',
      title: 'Emergency: reduce load',
      description: 'You\'re in overload territory. Cut your task list to the top 2 priorities only.',
      priority: 'high',
    });
    recs.push({
      type: 'alert',
      area: 'rest',
      title: 'Rest day strongly recommended',
      description: 'Take a rest day. Your performance data shows signs of burnout approaching.',
      priority: 'high',
    });
    if (s.activeHabitCount > 3) {
      recs.push({
        type: 'decrease',
        area: 'habits',
        title: 'Pause non-essential habits',
        description: 'Keep only your 2 most important habits. Pause the rest until you recover.',
        priority: 'high',
      });
    }
  }

  // Cross-zone recommendations based on specific signals
  if (s.checkInStreak === 0 && s.daysActive7d < 3) {
    recs.push({
      type: 'alert',
      area: 'engagement',
      title: 'Re-engagement needed',
      description: 'You haven\'t checked in recently. Start small — just log how you\'re feeling.',
      priority: 'high',
    });
  }

  if (score > 50 && s.currentStreak > 14) {
    recs.push({
      type: 'maintain',
      area: 'habits',
      title: 'Protect your streak',
      description: `${s.currentStreak}-day streak! Enable streak protection to save it on tough days.`,
      priority: 'medium',
    });
  }

  return recs;
}

// ─── Insights ────────────────────────────────────────────────────────────────

function generateInsights(s: PerformanceSnapshot, zone: DifficultyZone): string[] {
  const insights: string[] = [];

  // Zone-level insight
  switch (zone) {
    case 'recovery':
      insights.push('Your system needs recovery. Smart strategy: do less, but do it well.');
      break;
    case 'comfort':
      insights.push('You\'re handling your load well. Growth happens just outside comfort.');
      break;
    case 'growth':
      insights.push('You\'re in the sweet spot — challenged but not overwhelmed. This is where transformation happens.');
      break;
    case 'stretch':
      insights.push('You\'re pushing your limits. This is powerful short-term but watch for fatigue signals.');
      break;
    case 'overload':
      insights.push('Red zone detected. Your system is taking on more than it can sustain. Immediate simplification needed.');
      break;
  }

  // Specific data insights
  if (s.taskCompletionRate >= 0.9 && s.habitCompletionRate7d >= 0.9) {
    insights.push('Near-perfect execution! You might be setting targets too easy — consider raising the bar.');
  }

  if (s.moodTrend === 'rising' && s.energyTrend === 'rising') {
    insights.push('Both mood and energy are trending up — excellent sign. You can safely take on more.');
  }

  if (s.moodTrend === 'declining' && s.energyTrend === 'declining') {
    insights.push('Both mood and energy are declining — early burnout indicator. Prioritize rest and recovery.');
  }

  if (s.currentStreak > s.longestStreak * 0.8 && s.currentStreak > 7) {
    insights.push(`You're approaching your all-time best streak (${s.longestStreak} days). Keep going!`);
  }

  if (s.habitCompletionRate30d > 0 && s.habitCompletionRate7d > s.habitCompletionRate30d + 0.15) {
    insights.push('Your recent habit consistency is significantly better than your monthly average. Momentum is building!');
  }

  if (s.habitCompletionRate30d > 0 && s.habitCompletionRate7d < s.habitCompletionRate30d - 0.15) {
    insights.push('Habit consistency dropped this week compared to your monthly average. Small dip or trend to watch?');
  }

  if (s.activeGoalCount > 5) {
    insights.push(`${s.activeGoalCount} active goals is a lot. Consider focusing on your top 3 for faster progress.`);
  }

  if (s.goalsCompletedAllTime === 0 && s.activeGoalCount > 0) {
    insights.push('You haven\'t completed a goal yet. Break your closest goal into smaller milestones for quicker wins.');
  }

  return insights.slice(0, 4); // Cap at 4 insights
}

// ─── Adjustments ─────────────────────────────────────────────────────────────

function calculateAdjustments(s: PerformanceSnapshot, zone: DifficultyZone, _score: number): DifficultyAdjustments {
  let suggestedDailyTasks: { min: number; max: number };
  let suggestedHabitCount: { min: number; max: number };
  let suggestedFocusMinutes: number;
  let taskPriorityBias: 'low' | 'medium' | 'high';
  let restDayRecommended = false;
  let streakProtectionActive = false;

  switch (zone) {
    case 'recovery':
      suggestedDailyTasks = { min: 1, max: 3 };
      suggestedHabitCount = { min: 1, max: 3 };
      suggestedFocusMinutes = 15;
      taskPriorityBias = 'low';
      restDayRecommended = s.avgEnergy7d < 2.5;
      streakProtectionActive = true;
      break;
    case 'comfort':
      suggestedDailyTasks = { min: 3, max: 5 };
      suggestedHabitCount = { min: 3, max: 5 };
      suggestedFocusMinutes = 25;
      taskPriorityBias = 'medium';
      break;
    case 'growth':
      suggestedDailyTasks = { min: 4, max: 7 };
      suggestedHabitCount = { min: 4, max: 7 };
      suggestedFocusMinutes = 45;
      taskPriorityBias = 'medium';
      break;
    case 'stretch':
      suggestedDailyTasks = { min: 5, max: 8 };
      suggestedHabitCount = { min: 5, max: 8 };
      suggestedFocusMinutes = 60;
      taskPriorityBias = 'high';
      streakProtectionActive = s.currentStreak > 7;
      break;
    case 'overload':
      suggestedDailyTasks = { min: 1, max: 2 };
      suggestedHabitCount = { min: 1, max: 2 };
      suggestedFocusMinutes = 15;
      taskPriorityBias = 'low';
      restDayRecommended = true;
      streakProtectionActive = true;
      break;
  }

  // Fine-tune based on energy
  if (s.avgEnergy7d < 2) {
    suggestedDailyTasks = { min: 1, max: Math.max(2, suggestedDailyTasks.min) };
    suggestedFocusMinutes = Math.min(suggestedFocusMinutes, 15);
    restDayRecommended = true;
  }

  return {
    suggestedDailyTasks,
    suggestedHabitCount,
    suggestedFocusMinutes,
    taskPriorityBias,
    restDayRecommended,
    streakProtectionActive,
  };
}

// ─── Helper: Build snapshot from raw query data ──────────────────────────────

export interface RawUserData {
  tasks: Array<{ status: string; completedAt?: number | null; createdAt: number }>;
  habits: Array<{ isActive: boolean; streakCurrent: number; streakLongest: number; completionRate7Day?: number | null; completionRate30Day?: number | null }>;
  checkIns: Array<{ date: string; morningMood?: number | null; morningEnergy?: number | null; eveningMood?: number | null; eveningEnergy?: number | null }>;
  goals: Array<{ status: string; progress: number }>;
  user: { lastActiveAt?: number | null };
}

export function buildSnapshot(raw: RawUserData): PerformanceSnapshot {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  // Tasks
  const recentTasks = raw.tasks.filter(t => t.createdAt > sevenDaysAgo);
  const completedRecent = recentTasks.filter(t => t.status === 'done');
  const taskCompletionRate = recentTasks.length > 0 ? completedRecent.length / recentTasks.length : 0.5;
  const avgTasksPerDay = completedRecent.length / 7;

  // Habits
  const activeHabits = raw.habits.filter(h => h.isActive);
  const habitComp7d = activeHabits.length > 0
    ? activeHabits.reduce((sum, h) => sum + (h.completionRate7Day ?? 0), 0) / activeHabits.length
    : 0.5;
  const habitComp30d = activeHabits.length > 0
    ? activeHabits.reduce((sum, h) => sum + (h.completionRate30Day ?? 0), 0) / activeHabits.length
    : 0.5;
  const currentStreak = Math.max(...activeHabits.map(h => h.streakCurrent), 0);
  const longestStreak = Math.max(...activeHabits.map(h => h.streakLongest), 0);

  // Check-ins (mood & energy)
  const recentCheckIns = raw.checkIns.slice(0, 7);
  const moods = recentCheckIns
    .map(c => c.morningMood ?? c.eveningMood)
    .filter((m): m is number => m != null);
  const energies = recentCheckIns
    .map(c => c.morningEnergy ?? c.eveningEnergy)
    .filter((e): e is number => e != null);

  const avgMood7d = moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : 3;
  const avgEnergy7d = energies.length > 0 ? energies.reduce((a, b) => a + b, 0) / energies.length : 3;

  // Trends (compare first half vs second half of check-ins)
  const moodTrend = calculateTrend(moods);
  const energyTrend = calculateTrend(energies);

  // Check-in streak
  let checkInStreak = 0;
  const sortedCheckIns = [...raw.checkIns].sort((a, b) => b.date.localeCompare(a.date));
  const today = new Date().toISOString().split('T')[0];
  for (const ci of sortedCheckIns) {
    const expected = new Date(Date.now() - checkInStreak * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    if (ci.date === expected || ci.date === today) {
      checkInStreak++;
    } else {
      break;
    }
  }

  // Days active
  const activeDays = new Set(recentCheckIns.map(c => c.date));
  const daysActive7d = activeDays.size;

  // Goals
  const activeGoals = raw.goals.filter(g => g.status === 'in_progress' || g.status === 'draft');
  const completedGoals = raw.goals.filter(g => g.status === 'completed');
  const avgGoalProgress = activeGoals.length > 0
    ? activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length
    : 0;

  return {
    tasksCompleted7d: completedRecent.length,
    tasksCreated7d: recentTasks.length,
    taskCompletionRate,
    avgTasksPerDay,
    habitCompletionRate7d: habitComp7d,
    habitCompletionRate30d: habitComp30d,
    currentStreak,
    longestStreak,
    activeHabitCount: activeHabits.length,
    avgMood7d,
    avgEnergy7d,
    moodTrend,
    energyTrend,
    checkInStreak,
    daysActive7d,
    lastActiveAt: raw.user.lastActiveAt ?? null,
    activeGoalCount: activeGoals.length,
    goalsCompletedAllTime: completedGoals.length,
    avgGoalProgress,
  };
}

function calculateTrend(values: number[]): 'rising' | 'stable' | 'declining' {
  if (values.length < 3) return 'stable';
  const mid = Math.floor(values.length / 2);
  const firstHalf = values.slice(0, mid);
  const secondHalf = values.slice(mid);
  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const diff = avgSecond - avgFirst;
  if (diff > 0.3) return 'rising';
  if (diff < -0.3) return 'declining';
  return 'stable';
}

// ─── Zone Display Helpers ────────────────────────────────────────────────────

export function getZoneEmoji(zone: DifficultyZone): string {
  switch (zone) {
    case 'recovery': return '💜';
    case 'comfort': return '🔵';
    case 'growth': return '🟢';
    case 'stretch': return '🟡';
    case 'overload': return '🔴';
  }
}

export function getZoneDescription(zone: DifficultyZone): string {
  switch (zone) {
    case 'recovery': return 'Take it easy. Focus on the bare minimum and recharge.';
    case 'comfort': return 'You can handle more. Consider adding a challenge.';
    case 'growth': return 'Perfect balance of challenge and capability. Stay here.';
    case 'stretch': return 'Pushing hard. Sustainable short-term but watch for fatigue.';
    case 'overload': return 'Too much. Immediate simplification needed to prevent burnout.';
  }
}
