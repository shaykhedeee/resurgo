// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - AI-Powered Life Transformation System
// Core Type Definitions
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// PLAN TYPES (must be before User)
// ─────────────────────────────────────────────────────────────────────────────────

export type UserPlan = 'free' | 'pro' | 'lifetime';

// ─────────────────────────────────────────────────────────────────────────────────
// USER & PROFILE
// ─────────────────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  timezone: string;
  preferences: UserPreferences;
  stats: UserStats;
  gamification: GamificationProfile;
  plan: UserPlan;
  planExpiresAt?: Date;
  // Comprehensive personalization profile (from premium onboarding)
  profile?: UserProfile;
  onboardingCompleted: boolean;
  onboardingStep: number;
}

export interface UserPreferences {
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  dailyResetTime: string; // "00:00" format
  motivationalQuotes: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  morningReminder: string; // "07:00"
  eveningReminder: string; // "21:00"
  streakAtRisk: boolean;
  achievements: boolean;
  weeklyReport: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "06:00"
  intelligenceLevel: 'gentle' | 'balanced' | 'coaching';
  personalizationMode: 'auto' | 'work' | 'university' | 'general';
}

export interface UserStats {
  totalHabitsCompleted: number;
  totalGoalsAchieved: number;
  longestStreak: number;
  currentStreak: number;
  totalDaysActive: number;
  joinedDate: Date;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE USER PROFILE (Personalization Engine)
// ─────────────────────────────────────────────────────────────────────────────────

export type UserSex = 'male' | 'female' | 'other' | 'prefer-not-to-say';
export type AgeGroup = '13-17' | '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type DifficultyPreference = 'easy' | 'moderate' | 'challenging' | 'intense';
export type MotivationStyle = 'accountability' | 'rewards' | 'streaks' | 'competition' | 'self-improvement';
export type TimeBlock = 'early-morning' | 'morning' | 'afternoon' | 'evening' | 'night';

export interface UserProfile {
  // Demographics
  age: number;
  ageGroup: AgeGroup;
  sex: UserSex;
  
  // Schedule & Lifestyle
  wakeUpTime: string; // "06:00" format
  sleepTime: string; // "22:00" format
  workSchedule: 'standard' | 'shift' | 'flexible' | 'student' | 'retired' | 'stay-at-home';
  preferredTimeBlocks: TimeBlock[]; // When they prefer to work on goals
  
  // Goal Configuration
  ultimateGoal: UltimateGoalProfile;
  supportingGoals: SupportingGoal[];
  
  // Habit Transformation
  badHabitsToLeave: BadHabit[];
  goodHabitsToDevelop: GoodHabitGoal[];
  
  // Capacity & Preferences
  availableHoursPerDay: number; // 0.5, 1, 2, 3, etc.
  skillLevel: SkillLevel;
  difficultyPreference: DifficultyPreference;
  motivationStyle: MotivationStyle;
  
  // Context & Constraints
  constraints: string[]; // "Limited mobility", "Busy schedule", etc.
  resources: string[]; // "Gym membership", "Home office", etc.
  
  // Experience & History
  hasTriedBefore: boolean;
  previousChallenges: string; // What didn't work before
  biggestMotivation: string; // Their "why"
  
  // AI Coach
  coachPersona?: string; // e.g. 'tony-robbins', 'mel-robbins'

  // Tracking
  profileCompleteness: number; // 0-100%
  createdAt: string;
  updatedAt: string;
}

export interface UltimateGoalProfile {
  statement: string; // "I want to become a fit, confident person who runs marathons"
  category: GoalCategory;
  targetDate: string; // ISO date
  whyItMatters: string; // Deep motivation
  successLooksLike: string; // Specific outcome description
  identityStatement: string; // "I am a person who..."
}

export interface SupportingGoal {
  id: string;
  title: string;
  category: GoalCategory;
  description: string;
  targetDate: string;
  priority: 1 | 2 | 3; // 1 = highest priority
  linkedToUltimate: string; // How it connects to ultimate goal
}

export interface BadHabit {
  id: string;
  name: string;
  category: 'health' | 'productivity' | 'finance' | 'relationships' | 'mindset' | 'other';
  frequency: 'daily' | 'multiple-times-daily' | 'weekly' | 'occasionally';
  triggerSituation: string; // "When I'm stressed", "After work", etc.
  replacementStrategy?: string; // What to do instead
  eliminationTarget: 'complete' | 'reduce-50' | 'reduce-75' | 'situational';
  currentStreak: number; // Days without the habit
}

export interface GoodHabitGoal {
  id: string;
  name: string;
  category: GoalCategory;
  frequency: 'daily' | 'weekdays' | 'weekends' | 'weekly' | '3x-week';
  preferredTime: TimeBlock;
  specificTime?: string; // "06:30" if they want exact time
  duration: number; // minutes
  linkedGoalId?: string; // Links to supporting goal
  whyImportant: string;
  startSmall: string; // "2-minute version" of the habit
}

// ─────────────────────────────────────────────────────────────────────────────────
// PERSONALIZED SCHEDULING TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface DailySchedule {
  date: string;
  wakeTime: string;
  sleepTime: string;
  timeBlocks: ScheduledTimeBlock[];
  totalProductiveMinutes: number;
  totalXPAvailable: number;
}

export interface ScheduledTimeBlock {
  id: string;
  startTime: string; // "06:30"
  endTime: string; // "07:00"
  type: 'habit' | 'task' | 'goal-work' | 'break' | 'reward';
  title: string;
  description: string;
  linkedItemId?: string; // habitId, taskId, etc.
  xpReward: number;
  isCompleted: boolean;
  isSkipped: boolean;
  consequence?: string; // What they miss if skipped
  motivation?: string; // Why this matters
}

export interface WeeklyMilestone {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  title: string; // "Week 3: Building Momentum"
  theme: string; // Focus theme for the week
  goals: string[]; // Specific outcomes for the week
  reward: WeeklyReward;
  reflectionPrompts: string[];
  achievementUnlock?: string; // Badge/achievement unlocked
  celebrationMessage: string; // "You completed Week 3!"
}

export interface WeeklyReward {
  type: 'rest-day' | 'treat' | 'activity' | 'purchase' | 'experience';
  title: string; // "Treat yourself to your favorite meal"
  description: string;
  earnedAt?: string; // When they earned it
  claimedAt?: string; // When they used it
}

export interface MissedTaskConsequence {
  taskId: string;
  taskTitle: string;
  scheduledFor: string;
  consequence: string; // "You missed building the reading habit - your goal is now 1 day behind"
  impactLevel: 'minor' | 'moderate' | 'significant';
  recoveryAction: string; // "Complete 2 sessions tomorrow to catch up"
  progressImpact: number; // -2% to goal progress
}

// ─────────────────────────────────────────────────────────────────────────────────
// GAMIFICATION SYSTEM
// ─────────────────────────────────────────────────────────────────────────────────

export interface GamificationProfile {
  xp: number;
  totalXP: number;
  level: number;
  title: string;
  nextLevelXp: number;
  achievements: Achievement[];
  unlockedBadges: Badge[];
  streakFreezes: number; // Available streak protection
  weeklyStreak: number;
  monthlyStreak: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  xpReward: number;
  unlockedAt?: Date;
  progress: number; // 0-100
  requirement: number;
}

export type AchievementCategory = 
  | 'streaks' 
  | 'habits' 
  | 'goals' 
  | 'consistency' 
  | 'milestones' 
  | 'social' 
  | 'special';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}

export interface LevelInfo {
  level: number;
  name: string;
  title?: string;
  xpRequired: number;
  minXp?: number;
  maxXp?: number;
  color: string;
  perks: string[];
}

// XP reward amounts
export const XP_REWARDS = {
  HABIT_COMPLETED: 10,
  DAILY_ALL_HABITS: 50,
  STREAK_DAY: 5,
  STREAK_WEEK: 100,
  STREAK_MONTH: 500,
  GOAL_MILESTONE: 200,
  GOAL_COMPLETED: 1000,
  ACHIEVEMENT_UNLOCKED: 150,
  WEEKLY_REVIEW: 75,
  FIRST_HABIT: 25,
} as const;

// Level thresholds and titles
export const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Beginner', xpRequired: 0, color: '#9CA3AF', perks: [] },
  { level: 2, name: 'Starter', xpRequired: 100, color: '#6B7280', perks: ['Unlock custom habit icons'] },
  { level: 3, name: 'Apprentice', xpRequired: 250, color: '#22C55E', perks: ['Unlock streak freezes'] },
  { level: 4, name: 'Committed', xpRequired: 500, color: '#16A34A', perks: ['Unlock weekly challenges'] },
  { level: 5, name: 'Dedicated', xpRequired: 800, color: '#14B8A6', perks: ['Unlock AI coaching'] },
  { level: 6, name: 'Focused', xpRequired: 1200, color: '#0D9488', perks: ['Unlock custom themes'] },
  { level: 7, name: 'Disciplined', xpRequired: 1700, color: '#3B82F6', perks: ['Unlock guild creation'] },
  { level: 8, name: 'Achiever', xpRequired: 2300, color: '#2563EB', perks: ['Unlock advanced analytics'] },
  { level: 9, name: 'Champion', xpRequired: 3000, color: '#7C3AED', perks: ['Unlock lifetime badges'] },
  { level: 10, name: 'Master', xpRequired: 4000, color: '#6D28D9', perks: ['Unlock mentor mode'] },
  { level: 11, name: 'Expert', xpRequired: 5500, color: '#F59E0B', perks: ['Unlock exclusive challenges'] },
  { level: 12, name: 'Virtuoso', xpRequired: 7500, color: '#D97706', perks: ['Unlock beta features'] },
  { level: 13, name: 'Legend', xpRequired: 10000, color: '#EF4444', perks: ['Unlock legendary badges'] },
  { level: 14, name: 'Titan', xpRequired: 15000, color: '#DC2626', perks: ['Unlock custom animations'] },
  { level: 15, name: 'Ascended', xpRequired: 22000, color: '#FBBF24', perks: ['Unlock everything', 'Eternal glory'] },
];

// ─────────────────────────────────────────────────────────────────────────────────
// GOALS (Hierarchical AI-Powered System)
// ─────────────────────────────────────────────────────────────────────────────────

export interface UltimateGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: GoalCategory;
  targetDate: Date;
  createdAt: Date;
  status: GoalStatus;
  milestones: Milestone[];
  aiGenerated: boolean;
  progressPercentage: number;
  progress: number; // Alias for progressPercentage
  celebrationMessage?: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description: string;
  targetDate: Date;
  status: GoalStatus;
  weeklyObjectives: WeeklyObjective[];
  progressPercentage: number;
  progress: number; // Alias for progressPercentage
  order: number;
}

export interface WeeklyObjective {
  id: string;
  milestoneId: string;
  title: string;
  description: string;
  weekNumber: number; // Week 1, 2, 3...
  startDate: Date;
  endDate: Date;
  status: GoalStatus;
  dailyTasks: DailyTask[];
  progressPercentage: number;
}

export interface DailyTask {
  id: string;
  objectiveId: string;
  title: string;
  description?: string;
  scheduledDate: Date;
  estimatedMinutes: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: TaskStatus;
  completedAt?: Date;
  xpReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  linkedHabitId?: string; // Optional link to a recurring habit
}

export type GoalCategory = 
  | 'health' 
  | 'fitness' 
  | 'career' 
  | 'education' 
  | 'finance' 
  | 'relationships' 
  | 'creativity' 
  | 'mindfulness' 
  | 'productivity' 
  | 'custom';

export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'paused' | 'abandoned';
export type TaskStatus = 'pending' | 'completed' | 'skipped' | 'rescheduled';

// ─────────────────────────────────────────────────────────────────────────────────
// HABITS (Daily Tracking System)
// ─────────────────────────────────────────────────────────────────────────────────

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  customDays?: number[]; // For custom frequency
  monthlyGoal: number; // Target days per month
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  isActive: boolean;
  createdAt: Date;
  archived: boolean;
  order: number;
  linkedGoalId?: string; // If this habit supports a larger goal
}

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom';

export type HabitCategory = 
  | 'health' 
  | 'fitness' 
  | 'mindfulness' 
  | 'productivity' 
  | 'learning' 
  | 'creativity' 
  | 'social' 
  | 'finance' 
  | 'self_care' 
  | 'general'
  | 'custom';

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  completedAt?: Date;
  note?: string;
  mood?: 1 | 2 | 3 | 4 | 5; // Optional mood rating
}

export interface HabitStats {
  habitId: string;
  totalCompleted: number;
  completionRate: number; // 0-100
  currentStreak: number;
  longestStreak: number;
  bestDay: string; // e.g., "Monday"
  worstDay: string;
  weeklyAverage: number;
  monthlyTrend: 'improving' | 'stable' | 'declining';
}

// ─────────────────────────────────────────────────────────────────────────────────
// CALENDAR & DATE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────────

export interface CalendarSettings {
  year: number;
  month: number; // 1-12
  daysInMonth: number;
  firstDayOfWeek: number; // 0-6
  weekNumbers: number[];
}

export interface DayData {
  date: string; // YYYY-MM-DD
  dayOfMonth: number;
  dayOfWeek: number;
  isToday: boolean;
  isWeekend: boolean;
  habitEntries: HabitEntry[];
  tasks: DailyTask[];
  mood?: number;
  notes?: string;
  totalHabitsCompleted: number;
  totalHabitsScheduled: number;
  completionPercentage: number;
}

export interface WeekData {
  weekNumber: number;
  startDate: string;
  endDate: string;
  days: DayData[];
  totalCompleted: number;
  totalScheduled: number;
  completionPercentage: number;
}

export interface MonthData {
  year: number;
  month: number;
  weeks: WeekData[];
  totalCompleted: number;
  totalScheduled: number;
  completionPercentage: number;
  topHabits: { habitId: string; name: string; rate: number }[];
  strugglingHabits: { habitId: string; name: string; rate: number }[];
}

// ─────────────────────────────────────────────────────────────────────────────────
// AI COACHING SYSTEM
// ─────────────────────────────────────────────────────────────────────────────────

export interface AICoachMessage {
  id: string;
  userId: string;
  type: CoachMessageType;
  title: string;
  message: string;
  actionItems?: string[];
  createdAt: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export type CoachMessageType = 
  | 'motivation' 
  | 'insight' 
  | 'warning' 
  | 'celebration' 
  | 'recommendation' 
  | 'recovery_plan' 
  | 'weekly_review' 
  | 'goal_check_in';

export interface AIGoalDecompositionRequest {
  ultimateGoal: string;
  targetDate: Date;
  category: GoalCategory;
  currentSkillLevel: 'beginner' | 'intermediate' | 'advanced';
  availableHoursPerDay: number;
  preferredDifficulty: 'easy' | 'moderate' | 'challenging';
  constraints?: string;
  // Enhanced user context
  userAge?: number;
  busynessLevel?: 'light' | 'moderate' | 'busy' | 'very_busy';
  typicalDailyTasks?: string[];
  preferredWorkTimes?: ('morning' | 'afternoon' | 'evening' | 'night')[];
  motivation?: 'self_improvement' | 'external_goal' | 'accountability' | 'curiosity';
}

export interface AIGoalDecompositionResponse {
  goalId: string;
  summary: string;
  milestones: Milestone[];
  estimatedSuccessRate: number;
  keyRisks: string[];
  motivationalMessage: string;
  suggestedHabits: Partial<Habit>[];
  identityStatement?: string;
  microTaskPreview?: { task: string; day: string; xp: number }[];
  // Enhanced time estimates
  estimatedTotalHours?: number;
  estimatedWeeksToComplete?: number;
  recommendedDailyMinutes?: number;
  researchBasedDuration?: {
    typical: string;
    fastest: string;
    comfortable: string;
    source?: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// ANALYTICS & INSIGHTS
// ─────────────────────────────────────────────────────────────────────────────────

export interface DailyConsistencyData {
  date: string;
  day: number;
  completed: number;
  total: number;
  percentage: number;
}

export interface WeeklyBreakdownData {
  week: string;
  weekNumber: number;
  completed: number;
  total: number;
  percentage: number;
}

export interface HabitRankingData {
  habitId: string;
  name: string;
  icon: string;
  color: string;
  completionRate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface OverallStats {
  totalHabits: number;
  totalCompleted: number;
  totalScheduled: number;
  overallCompletionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalXpEarned: number;
  level: number;
  goalsCompleted: number;
  goalsInProgress: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// UI STATE & COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────────

export interface ModalState {
  isOpen: boolean;
  type: 'goal' | 'habit' | 'achievement' | 'level_up' | 'settings' | 'coach' | null;
  data?: unknown;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement' | 'level_up';
  title: string;
  message?: string;
  duration?: number;
  xpGained?: number;
}

export interface ConfettiConfig {
  particleCount: number;
  spread: number;
  origin: { x: number; y: number };
  colors: string[];
}

// ─────────────────────────────────────────────────────────────────────────────────
// TIME-BASED TASKS (Timed Task System)
// ─────────────────────────────────────────────────────────────────────────────────

export interface TimedTask {
  id: string;
  title: string;
  description?: string;
  scheduledTime: string; // "09:00" format
  estimatedMinutes: number;
  timeLimit: number; // Maximum minutes allowed
  actualMinutes?: number; // Time actually taken
  status: TimedTaskStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: HabitCategory;
  linkedHabitId?: string;
  linkedGoalId?: string;
  date: string; // YYYY-MM-DD
  startedAt?: Date;
  completedAt?: Date;
  xpReward: number;
  bonusXp: number; // Extra XP for fast completion
  penaltyApplied: boolean; // True if exceeded time limit
}

export type TimedTaskStatus = 
  | 'scheduled' 
  | 'in_progress' 
  | 'completed_fast' 
  | 'completed_ontime' 
  | 'completed_late' 
  | 'missed' 
  | 'skipped';

export interface TaskTimer {
  taskId: string;
  isRunning: boolean;
  startTime: Date;
  elapsedSeconds: number;
  timeLimit: number;
  isOvertime: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// ATOMIC HABITS: IDENTITY SYSTEM
// ─────────────────────────────────────────────────────────────────────────────────

export interface IdentityArchetype {
  id: string;
  name: string; // "Athlete", "Scholar", "Creator"
  statement: string; // "I am someone who..."
  description: string;
  icon: string;
  color: string;
  linkedHabits: string[]; // Habit IDs
  evidenceCount: number;
  evidence: IdentityEvidence[]; // Array of evidence entries
  level: IdentityLevel;
  unlockedAt?: Date;
  isActive: boolean;
}

export type IdentityLevel = 'emerging' | 'forming' | 'established' | 'core';

export interface IdentityEvidence {
  id: string;
  archetypeId: string;
  habitId: string;
  date: string;
  note?: string;
}

export const IDENTITY_ARCHETYPES: IdentityArchetype[] = [
  { id: 'athlete', name: 'Athlete', statement: 'I am someone who moves my body every day', description: 'Physical fitness and sports', icon: 'AT', color: '#EF4444', linkedHabits: [], evidenceCount: 0, evidence: [], level: 'emerging', isActive: false },
  { id: 'scholar', name: 'Scholar', statement: 'I am someone who learns something new every day', description: 'Continuous learning and growth', icon: 'SC', color: '#3B82F6', linkedHabits: [], evidenceCount: 0, evidence: [], level: 'emerging', isActive: false },
  { id: 'creator', name: 'Creator', statement: 'I am someone who creates and builds', description: 'Creative expression and making', icon: 'CR', color: '#8B5CF6', linkedHabits: [], evidenceCount: 0, evidence: [], level: 'emerging', isActive: false },
  { id: 'mindful', name: 'Mindful Being', statement: 'I am someone who practices presence', description: 'Meditation and mindfulness', icon: 'MD', color: '#14B8A6', linkedHabits: [], evidenceCount: 0, evidence: [], level: 'emerging', isActive: false },
  { id: 'healthy', name: 'Healthy Person', statement: 'I am someone who nourishes my body', description: 'Nutrition and wellness', icon: 'HL', color: '#22C55E', linkedHabits: [], evidenceCount: 0, evidence: [], level: 'emerging', isActive: false },
  { id: 'leader', name: 'Leader', statement: 'I am someone who takes initiative', description: 'Leadership and responsibility', icon: 'LD', color: '#F59E0B', linkedHabits: [], evidenceCount: 0, evidence: [], level: 'emerging', isActive: false },
  { id: 'writer', name: 'Writer', statement: 'I am someone who writes regularly', description: 'Writing and journaling', icon: 'WR', color: '#EC4899', linkedHabits: [], evidenceCount: 0, evidence: [], level: 'emerging', isActive: false },
  { id: 'growth', name: 'Growth Mindset', statement: 'I am someone who embraces challenges', description: 'Personal development', icon: 'GR', color: '#10B981', linkedHabits: [], evidenceCount: 0, evidence: [], level: 'emerging', isActive: false },
  { id: 'wealth', name: 'Wealth Builder', statement: 'I am someone who builds financial freedom', description: 'Finance and investing', icon: 'WB', color: '#FBBF24', linkedHabits: [], evidenceCount: 0, evidence: [], level: 'emerging', isActive: false },
];

export const IDENTITY_THRESHOLDS = {
  emerging: { min: 0, max: 10, label: 'Emerging' },
  forming: { min: 10, max: 50, label: 'Forming' },
  established: { min: 50, max: 150, label: 'Established' },
  core: { min: 150, max: Infinity, label: 'Core Identity' },
};

// ─────────────────────────────────────────────────────────────────────────────────
// ATOMIC HABITS: IMPLEMENTATION INTENTIONS
// ─────────────────────────────────────────────────────────────────────────────────

export interface ImplementationIntention {
  id: string;
  habitId: string;
  behavior: string;
  time: string; // "07:00"
  location: string; // "Bedroom", "Office", "Gym"
  fullStatement: string; // "I will [BEHAVIOR] at [TIME] in [LOCATION]"
  cueType: 'time' | 'location' | 'preceding_habit';
  precedingHabitId?: string; // For habit stacking
}

// ─────────────────────────────────────────────────────────────────────────────────
// ATOMIC HABITS: HABIT STACKING
// ─────────────────────────────────────────────────────────────────────────────────

export interface HabitStack {
  id: string;
  name: string; // "Morning Power Stack"
  habits: StackedHabit[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  triggerCue: string; // "After I wake up..."
  totalDuration: number; // minutes
  currentStreak: number;
  isActive: boolean;
  createdAt: Date;
}

export interface StackedHabit {
  habitId: string;
  order: number;
  duration: number; // minutes
  transitionCue: string; // "After I finish this, I will..."
}

// ─────────────────────────────────────────────────────────────────────────────────
// ATOMIC HABITS: TWO-MINUTE RULE
// ─────────────────────────────────────────────────────────────────────────────────

export interface TwoMinuteVersion {
  habitId: string;
  fullHabit: string; // "Run for 30 minutes"
  twoMinuteVersion: string; // "Put on running shoes"
  currentLevel: TwoMinuteLevel;
  graduated: boolean;
}

export type TwoMinuteLevel = 1 | 2 | 3 | 4; // Progression levels

export const TWO_MINUTE_PROGRESSIONS = {
  1: { weeks: '1-2', description: '2 minutes (just show up)' },
  2: { weeks: '3-4', description: '5 minutes (starter)' },
  3: { weeks: '5-6', description: '15 minutes (building)' },
  4: { weeks: '7+', description: 'Full habit (mastered)' },
};

// ─────────────────────────────────────────────────────────────────────────────────
// ATOMIC HABITS: TEMPTATION BUNDLING
// ─────────────────────────────────────────────────────────────────────────────────

export interface TemptationBundle {
  id: string;
  needHabitId: string; // The habit you need to do
  wantActivity: string; // The thing you want to do
  statement: string; // "Only [WANT] after [NEED]"
  isActive: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// PROGRESS BAR TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface ProgressData {
  current: number;
  target: number;
  percentage: number;
  label?: string;
  color?: string;
  showMilestones?: boolean;
  milestones?: ProgressMilestone[];
}

export interface ProgressMilestone {
  value: number;
  label: string;
  reached: boolean;
  icon?: string;
}

export interface CompoundGrowthData {
  day: number;
  improvement: number; // Multiplier (e.g., 1.5 = 50% better)
  totalAtoms: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// POMODORO TIMER
// ─────────────────────────────────────────────────────────────────────────────────

export interface PomodoroSession {
  id: string;
  taskId?: string;
  habitId?: string;
  type: 'work' | 'short_break' | 'long_break';
  duration: number; // minutes
  startedAt?: Date;
  completedAt?: Date;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'cancelled';
  xpReward: number;
}

export interface PomodoroSettings {
  workDuration: number; // 25 minutes default
  shortBreakDuration: number; // 5 minutes default
  longBreakDuration: number; // 15 minutes default
  sessionsBeforeLongBreak: number; // 4 default
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// DAILY SCHEDULE / ROUTINE
// ─────────────────────────────────────────────────────────────────────────────────

export interface DailyRoutine {
  id: string;
  name: string; // "Morning Routine", "Evening Wind-down"
  type: 'morning' | 'afternoon' | 'evening' | 'custom';
  startTime: string; // "06:00"
  tasks: RoutineTask[];
  isActive: boolean;
  completionStreak: number;
}

export interface RoutineTask {
  id: string;
  title: string;
  duration: number; // minutes
  order: number;
  linkedHabitId?: string;
  icon?: string;
  isOptional: boolean;
  status: 'pending' | 'completed' | 'skipped';
}

// ─────────────────────────────────────────────────────────────────────────────────
// ENHANCED HABIT TYPE (Extended)
// ─────────────────────────────────────────────────────────────────────────────────

export interface EnhancedHabit extends Habit {
  implementationIntention?: ImplementationIntention;
  twoMinuteVersion?: TwoMinuteVersion;
  linkedIdentityId?: string;
  stackId?: string;
  stackOrder?: number;
  temptationBundle?: TemptationBundle;
  targetMinutes?: number; // For timed habits
  actualMinutes?: number;
  progressType: 'binary' | 'count' | 'duration' | 'percentage';
  targetCount?: number; // e.g., "Drink 8 glasses of water"
  currentCount?: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// TASKS (TickTick-Style Checklist System)
// ─────────────────────────────────────────────────────────────────────────────────

export type TaskPriority = 'none' | 'low' | 'medium' | 'high' | 'urgent';
export type ChecklistTaskStatus = 'pending' | 'completed' | 'cancelled';
export type TaskRepeat = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: ChecklistTaskStatus;
  dueDate?: string; // ISO date string
  dueTime?: string; // "HH:mm" format
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  list: string; // 'inbox' | custom list id
  subtasks: SubTask[];
  isStarred: boolean;
  repeat: TaskRepeat;
  repeatConfig?: {
    interval: number;
    days?: number[]; // For weekly: 0-6 (Sun-Sat)
    endDate?: string;
  };
  reminderTime?: string;
  notes?: string;
  xpReward: number;
  linkedGoalId?: string;
  linkedHabitId?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
}

export interface TaskList {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  isDefault?: boolean;
}

// Smart list types for filtering
export type SmartListType = 
  | 'inbox' 
  | 'today' 
  | 'tomorrow' 
  | 'week' 
  | 'starred' 
  | 'all' 
  | 'completed';

// ─────────────────────────────────────────────────────────────────────────────────
// PLAN LIMITS
// ─────────────────────────────────────────────────────────────────────────────────

export interface PlanLimits {
  maxHabits: number;
  maxGoals: number;
  maxStacks: number;
  historyDays: number;
  hasAI: boolean;
  hasAdvancedAnalytics: boolean;
  hasDataExport: boolean;
  hasPomodoro: boolean;
  hasIdentitySystem: boolean;
  hasHabitStacking: boolean;
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  free: {
    maxHabits: 10,
    maxGoals: 3,
    maxStacks: 0,
    historyDays: 7,
    hasAI: true,
    hasAdvancedAnalytics: false,
    hasDataExport: false,
    hasPomodoro: true,
    hasIdentitySystem: false,
    hasHabitStacking: false,
  },
  pro: {
    maxHabits: Infinity,
    maxGoals: Infinity,
    maxStacks: 10,
    historyDays: 365,
    hasAI: true,
    hasAdvancedAnalytics: true,
    hasDataExport: true,
    hasPomodoro: true,
    hasIdentitySystem: true,
    hasHabitStacking: true,
  },
  lifetime: {
    maxHabits: Infinity,
    maxGoals: Infinity,
    maxStacks: Infinity,
    historyDays: Infinity,
    hasAI: true,
    hasAdvancedAnalytics: true,
    hasDataExport: true,
    hasPomodoro: true,
    hasIdentitySystem: true,
    hasHabitStacking: true,
  },
};

// ─────────────────────────────────────────────────────────────────────────────────
// UNIFIED TASK SYSTEM (All tasks in one place)
// ─────────────────────────────────────────────────────────────────────────────────

export type UnifiedTaskSource = 'habit' | 'goal' | 'manual' | 'ai-suggested';
export type UnifiedTaskStatus = 'pending' | 'completed' | 'skipped' | 'missed';

export interface UnifiedTask {
  id: string;
  title: string;
  description?: string;
  
  // Source tracking
  source: UnifiedTaskSource;
  sourceId?: string; // habitId, goalId, or manual
  sourceMetadata?: {
    habitName?: string;
    goalTitle?: string;
    milestoneTitle?: string;
    objectiveTitle?: string;
  };
  
  // Quick access properties (from sourceMetadata)
  goalTitle?: string;
  milestoneTitle?: string;
  
  // Scheduling
  date: string; // YYYY-MM-DD
  scheduledDate?: string; // YYYY-MM-DD (same as date, for filtering)
  time?: string; // HH:mm (optional specific time)
  estimatedMinutes?: number;
  
  // Status
  status: UnifiedTaskStatus;
  completed?: boolean; // Quick access for filtering
  completedAt?: string;
  
  // Recurrence (for habit-based tasks)
  isRecurring: boolean;
  recurrence?: {
    frequency: 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom';
    customDays?: number[]; // 0-6 for Sun-Sat
  };
  
  // Priority & categorization
  priority: TaskPriority;
  category?: GoalCategory;
  tags?: string[];
  
  // Gamification
  xpReward: number;
  streakBonus?: boolean;
  
  // UI helpers
  icon?: string;
  color?: string;
  isQuickWin?: boolean; // 2-minute tasks
  
  // Identity connection (Atomic Habits)
  linkedIdentityId?: string;
  identityStatement?: string; // "I am someone who..."
  
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// IDEAL SELF / TRANSFORMATION SYSTEM
// ─────────────────────────────────────────────────────────────────────────────────

export interface IdealSelf {
  id: string;
  statement: string; // "In 6 months, I want to be someone who..."
  description: string;
  targetDate: Date;
  identities: string[]; // Selected identity archetype IDs
  goals: string[]; // Related goal IDs
  habits: string[]; // Related habit IDs
  progressPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransformationJourney {
  id: string;
  userId: string;
  idealSelf: IdealSelf;
  currentPhase: 'awareness' | 'planning' | 'action' | 'maintenance' | 'mastery';
  weekNumber: number;
  totalWeeks: number;
  milestones: TransformationMilestone[];
  weeklyReflections: WeeklyReflection[];
}

export interface TransformationMilestone {
  id: string;
  week: number;
  title: string;
  description: string;
  identityFocus: string; // Which identity this builds
  completed: boolean;
  completedAt?: Date;
}

export interface WeeklyReflection {
  id: string;
  weekNumber: number;
  date: string;
  wins: string[];
  challenges: string[];
  insights: string;
  nextWeekFocus: string;
  mood: 1 | 2 | 3 | 4 | 5;
}

// ─────────────────────────────────────────────────────────────────────────────────
// REWARDS SYSTEM (Enhanced)
// ─────────────────────────────────────────────────────────────────────────────────

export interface RewardToken {
  id: string;
  type: 'cheat_day' | 'rest_day' | 'streak_shield' | 'xp_boost' | 'custom';
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  usedAt?: Date;
  expiresAt?: Date;
  isUsed: boolean;
}

export interface RewardMilestone {
  streakDays: number;
  reward: RewardToken;
  description: string;
}

export const REWARD_MILESTONES: RewardMilestone[] = [
  {
    streakDays: 7,
    reward: {
      id: 'cheat-7',
      type: 'cheat_day',
      name: 'Earned Break',
      description: 'Take a guilt-free day off. You\'ve earned it!',
      icon: 'BR',
      earnedAt: new Date(),
      isUsed: false,
    },
    description: '7-day streak: Earn a Cheat Day token',
  },
  {
    streakDays: 14,
    reward: {
      id: 'shield-14',
      type: 'streak_shield',
      name: 'Streak Shield',
      description: 'Protect your streak if you miss a day',
      icon: 'SH',
      earnedAt: new Date(),
      isUsed: false,
    },
    description: '14-day streak: Earn a Streak Shield',
  },
  {
    streakDays: 21,
    reward: {
      id: 'boost-21',
      type: 'xp_boost',
      name: '2x XP Day',
      description: 'Double XP for all tasks completed today',
      icon: 'XP',
      earnedAt: new Date(),
      isUsed: false,
    },
    description: '21-day streak: Earn a 2x XP Boost',
  },
  {
    streakDays: 30,
    reward: {
      id: 'rest-30',
      type: 'rest_day',
      name: 'Wellness Day',
      description: 'AI suggests a recovery-focused day with lighter tasks',
      icon: 'WL',
      earnedAt: new Date(),
      isUsed: false,
    },
    description: '30-day streak: Earn a Wellness Day',
  },
];

// XP Bonuses for consistency
export const STREAK_XP_BONUSES = {
  3: 25,   // 3-day streak bonus
  7: 100,  // 1-week streak bonus
  14: 250, // 2-week streak bonus
  21: 500, // 3-week streak bonus
  30: 1000, // 1-month streak bonus
  60: 2500, // 2-month streak bonus
  90: 5000, // 3-month streak bonus
};

// ─────────────────────────────────────────────────────────────────────────────────
// MENTAL HEALTH & WELLNESS SUPPORT SYSTEM
// Features designed for ADHD, anxiety, depression support
// ─────────────────────────────────────────────────────────────────────────────────

export type MoodLevel = 1 | 2 | 3 | 4 | 5;
export type EnergyLevel = 1 | 2 | 3 | 4 | 5;
export type AnxietyLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  date: string; // ISO date
  timestamp: string; // ISO datetime
  mood: MoodLevel;
  energy?: EnergyLevel;
  anxiety?: AnxietyLevel;
  notes?: string;
  factors?: MoodFactor[];
  sleepQuality?: 1 | 2 | 3 | 4 | 5;
  sleepHours?: number;
}

export type MoodFactor = 
  | 'exercise' 
  | 'good_sleep' 
  | 'poor_sleep'
  | 'social_time'
  | 'alone_time'
  | 'work_stress'
  | 'accomplished'
  | 'nature'
  | 'meditation'
  | 'caffeine'
  | 'alcohol'
  | 'screen_time'
  | 'creative'
  | 'learning'
  | 'helping_others';

export const MOOD_EMOJIS: Record<MoodLevel, { emoji: string; label: string; color: string }> = {
  1: { emoji: 'L1', label: 'Struggling', color: '#EF4444' },
  2: { emoji: 'L2', label: 'Low', color: '#F97316' },
  3: { emoji: 'L3', label: 'Okay', color: '#EAB308' },
  4: { emoji: 'L4', label: 'Good', color: '#22C55E' },
  5: { emoji: 'L5', label: 'Great', color: '#10B981' },
};

export const ENERGY_LABELS: Record<EnergyLevel, string> = {
  1: 'Exhausted',
  2: 'Low Energy',
  3: 'Moderate',
  4: 'Energized',
  5: 'High Energy',
};

export const MOOD_FACTORS_INFO: Record<MoodFactor, { icon: string; label: string; category: 'positive' | 'negative' | 'neutral' }> = {
  exercise: { icon: 'EX', label: 'Exercise', category: 'positive' },
  good_sleep: { icon: 'SL', label: 'Good Sleep', category: 'positive' },
  poor_sleep: { icon: 'PS', label: 'Poor Sleep', category: 'negative' },
  social_time: { icon: 'SO', label: 'Social Time', category: 'positive' },
  alone_time: { icon: 'AL', label: 'Alone Time', category: 'neutral' },
  work_stress: { icon: 'WS', label: 'Work Stress', category: 'negative' },
  accomplished: { icon: 'OK', label: 'Accomplished', category: 'positive' },
  nature: { icon: 'NT', label: 'Time in Nature', category: 'positive' },
  meditation: { icon: 'MD', label: 'Meditation', category: 'positive' },
  caffeine: { icon: 'CF', label: 'Caffeine', category: 'neutral' },
  alcohol: { icon: 'ALC', label: 'Alcohol', category: 'negative' },
  screen_time: { icon: 'SC', label: 'Screen Time', category: 'neutral' },
  creative: { icon: 'CR', label: 'Creative Activity', category: 'positive' },
  learning: { icon: 'LR', label: 'Learning', category: 'positive' },
  helping_others: { icon: 'HP', label: 'Helped Others', category: 'positive' },
};

// ─────────────────────────────────────────────────────────────────────────────────
// BREATHING EXERCISES
// ─────────────────────────────────────────────────────────────────────────────────

export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  icon: string;
  inhale: number; // seconds
  hold1?: number; // seconds (hold after inhale)
  exhale: number; // seconds
  hold2?: number; // seconds (hold after exhale)
  cycles: number; // recommended cycles
  benefits: string[];
  forConditions: ('anxiety' | 'stress' | 'focus' | 'sleep' | 'panic' | 'general')[];
}

export const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Used by Navy SEALs for stress relief. Equal parts inhale, hold, exhale, hold.',
    icon: 'BX',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    cycles: 4,
    benefits: ['Reduces stress', 'Improves focus', 'Calms nervous system'],
    forConditions: ['anxiety', 'stress', 'focus'],
  },
  {
    id: '478',
    name: '4-7-8 Calming',
    description: 'Dr. Andrew Weil\'s relaxation technique. Activates parasympathetic nervous system.',
    icon: '478',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    cycles: 4,
    benefits: ['Deep relaxation', 'Helps with sleep', 'Reduces anxiety'],
    forConditions: ['anxiety', 'sleep', 'panic'],
  },
  {
    id: 'simple',
    name: 'Simple Deep Breaths',
    description: 'Just breathe. Simple and effective for quick calming.',
    icon: 'BR',
    inhale: 4,
    exhale: 6,
    cycles: 6,
    benefits: ['Quick stress relief', 'Easy to remember', 'Can do anywhere'],
    forConditions: ['general', 'stress'],
  },
  {
    id: 'energizing',
    name: 'Energizing Breath',
    description: 'Quick breaths to boost energy and alertness.',
    icon: 'EN',
    inhale: 2,
    exhale: 2,
    cycles: 10,
    benefits: ['Increases alertness', 'Boosts energy', 'Wakes up the mind'],
    forConditions: ['focus'],
  },
  {
    id: 'calming',
    name: 'Extended Exhale',
    description: 'Longer exhale activates relaxation response. Great for anxiety.',
    icon: 'CL',
    inhale: 4,
    exhale: 8,
    cycles: 5,
    benefits: ['Activates vagus nerve', 'Deep calming', 'Reduces heart rate'],
    forConditions: ['anxiety', 'panic', 'stress'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// GENTLE MODE & ADHD SUPPORT
// ─────────────────────────────────────────────────────────────────────────────────

export interface GentleModeSettings {
  enabled: boolean;
  flexibleStreaks: boolean; // Allow 5/7 days to count as streak
  streakGracePeriod: number; // Hours before streak breaks (default: 36)
  reducedNotifications: boolean;
  softerLanguage: boolean; // Use encouraging instead of urgent language
  hideIncompleteCount: boolean; // Don't show "X tasks incomplete"
  autoAdjustOnLowMood: boolean; // Reduce tasks when mood is low
  showOnlyTopPriorities: boolean; // On low energy, show only top 3 tasks
  celebrateSmallWins: boolean;
  selfCompassionPrompts: boolean;
}

export const DEFAULT_GENTLE_MODE: GentleModeSettings = {
  enabled: false,
  flexibleStreaks: true,
  streakGracePeriod: 36,
  reducedNotifications: true,
  softerLanguage: true,
  hideIncompleteCount: true,
  autoAdjustOnLowMood: true,
  showOnlyTopPriorities: false,
  celebrateSmallWins: true,
  selfCompassionPrompts: true,
};

export type TaskSize = 'tiny' | 'small' | 'medium' | 'focus' | 'deep';

export const TASK_SIZES: Record<TaskSize, { label: string; icon: string; minutes: string; description: string }> = {
  tiny: { label: 'Tiny', icon: 'T', minutes: '2-5 min', description: 'Just get started, no pressure' },
  small: { label: 'Small', icon: 'S', minutes: '5-15 min', description: 'Quick win, manageable chunk' },
  medium: { label: 'Medium', icon: 'M', minutes: '15-30 min', description: 'Solid work session' },
  focus: { label: 'Focus', icon: 'F', minutes: '30-60 min', description: 'Deep work, one Pomodoro+' },
  deep: { label: 'Deep Work', icon: 'D', minutes: '60+ min', description: 'Extended concentration' },
};

// ─────────────────────────────────────────────────────────────────────────────────
// WALL OF AWFUL - ADHD Emotional Barrier Support
// ─────────────────────────────────────────────────────────────────────────────────

export type TaskBarrier = 
  | 'boring'
  | 'too_big'
  | 'dont_know_start'
  | 'perfectionism'
  | 'avoiding_feelings'
  | 'low_energy'
  | 'overwhelmed'
  | 'fear_of_failure'
  | 'unclear'
  | 'other';

export const TASK_BARRIERS: Record<TaskBarrier, { label: string; icon: string; suggestion: string }> = {
  boring: { 
    label: "It's boring", 
    icon: 'SL', 
    suggestion: "Try pairing it with something enjoyable (music, podcast, treat after)." 
  },
  too_big: { 
    label: "It feels too big", 
    icon: 'BG', 
    suggestion: "Let's break it into tiny steps. What's the smallest first action?" 
  },
  dont_know_start: { 
    label: "I don't know where to start", 
    icon: 'ST', 
    suggestion: "Just do anything for 2 minutes. Starting is the hardest part." 
  },
  perfectionism: { 
    label: "It won't be perfect", 
    icon: 'PF', 
    suggestion: "Done is better than perfect. You can improve it later." 
  },
  avoiding_feelings: { 
    label: "I'm avoiding something", 
    icon: 'AV', 
    suggestion: "What feeling comes up when you think about this? It's okay to feel it." 
  },
  low_energy: { 
    label: "I don't have the energy", 
    icon: 'EN', 
    suggestion: "Can we shrink this to a 2-minute version? Or save it for a better time?" 
  },
  overwhelmed: { 
    label: "I'm overwhelmed", 
    icon: 'OV', 
    suggestion: "Take 3 deep breaths first. Then pick just ONE tiny thing." 
  },
  fear_of_failure: { 
    label: "I'm afraid I'll fail", 
    icon: 'FF', 
    suggestion: "What if 'trying' is the success? You're already winning by caring." 
  },
  unclear: { 
    label: "It's not clear what to do", 
    icon: 'UN', 
    suggestion: "Let's clarify: What specific action would move this forward?" 
  },
  other: { 
    label: "Something else", 
    icon: 'OT', 
    suggestion: "That's okay. Be gentle with yourself. What would help right now?" 
  },
};

// ─────────────────────────────────────────────────────────────────────────────────
// GRATITUDE & SELF-COMPASSION
// ─────────────────────────────────────────────────────────────────────────────────

export interface GratitudeEntry {
  id: string;
  date: string;
  entries: string[]; // Up to 3 things
  timestamp: string;
}

export interface DailyReflection {
  id: string;
  date: string;
  morningIntention?: string;
  eveningWin?: string;
  gratitude?: string[];
  tomorrowFocus?: string;
}

export const SELF_COMPASSION_PROMPTS = {
  afterMissedTask: [
    "Everyone struggles sometimes. This is part of being human.",
    "What would you say to a friend who missed this task?",
    "One day doesn't define your journey. You're still here, and that matters.",
    "Missing a task doesn't erase all your progress. Be kind to yourself.",
  ],
  afterStreakBreak: [
    "Streaks are tools, not chains. Your worth isn't tied to a number.",
    "Life happens. What matters is that you came back.",
    "A broken streak is just a fresh start in disguise.",
    "You haven't failed. You're learning what works for you.",
  ],
  returnAfterAbsence: [
    "Welcome back! We're genuinely glad you're here.",
    "Every return is a victory. You chose to try again.",
    "No judgment here. Let's start wherever you're comfortable.",
    "You're back, and that takes courage. Let's go at your pace.",
  ],
  dailyEncouragement: [
    "Every small step adds up. You're making progress.",
    "You're doing better than you think. Really.",
    "Today doesn't have to be perfect. Just do what you can.",
    "Your effort matters, even when results take time.",
  ],
  lowMoodDay: [
    "It's okay to have hard days. Be extra gentle with yourself today.",
    "On tough days, just existing is enough. You don't have to be productive.",
    "What's one tiny thing that might help you feel 1% better?",
    "You're allowed to rest. Taking care of yourself IS productive.",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────
// CRISIS RESOURCES
// ─────────────────────────────────────────────────────────────────────────────────

export interface CrisisResource {
  name: string;
  description: string;
  contact: string;
  type: 'call' | 'text' | 'chat' | 'website';
  country?: string;
  available: string;
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: '988 Suicide & Crisis Lifeline',
    description: 'Free, confidential support for people in distress',
    contact: '988',
    type: 'call',
    country: 'US',
    available: '24/7',
  },
  {
    name: 'Crisis Text Line',
    description: 'Text HOME to connect with a crisis counselor',
    contact: 'Text HOME to 741741',
    type: 'text',
    country: 'US',
    available: '24/7',
  },
  {
    name: 'SAMHSA National Helpline',
    description: 'Treatment referral service for mental health and substance use',
    contact: '1-800-662-4357',
    type: 'call',
    country: 'US',
    available: '24/7',
  },
  {
    name: 'International Association for Suicide Prevention',
    description: 'Directory of crisis centers worldwide',
    contact: 'https://www.iasp.info/resources/Crisis_Centres/',
    type: 'website',
    available: 'Varies by location',
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// WELLNESS INSIGHTS
// ─────────────────────────────────────────────────────────────────────────────────

export interface WellnessInsight {
  id: string;
  type: 'correlation' | 'pattern' | 'achievement' | 'suggestion';
  title: string;
  description: string;
  data?: Record<string, number | string>;
  createdAt: string;
}

export interface WellnessStats {
  averageMood: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  bestDay: string; // Day of week
  topPositiveFactors: MoodFactor[];
  topNegativeFactors: MoodFactor[];
  moodHabitCorrelations: { habitName: string; correlation: number }[];
  totalBreathingSessions: number;
  totalMindfulMinutes: number;
  currentMoodStreak: number; // Days of mood >= 3
}

// ─────────────────────────────────────────────────────────────────────────────────
// TEMPLATE LIBRARY TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export type TemplateType = 'habit' | 'goal';
export type TemplateCategory = 
  | 'health' 
  | 'fitness' 
  | 'productivity' 
  | 'learning' 
  | 'mindfulness' 
  | 'social' 
  | 'finance' 
  | 'creative' 
  | 'career' 
  | 'sleep'
  | 'nutrition'
  | 'relationships'
  | 'personal-growth';

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  frequency: HabitFrequency;
  icon: string;
  color: string;
  xpReward: number;
  targetDays?: number[]; // 0-6 for specific days
  targetCompletions?: number;
  duration?: number; // minutes, for timed habits
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  scientificBasis?: string; // Why this habit works
  tips?: string[];
  popular?: boolean;
  isBuiltIn: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  icon: string;
  timeframe: string; // "3 months", "6 months", "1 year"
  timeframeDays: number; // Actual days for calculation
  suggestedHabits: string[]; // References to habit template IDs
  suggestedMilestones?: GoalMilestoneTemplate[];
  targetOutcome?: string;
  successMetrics?: string[];
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  tags?: string[];
  popular?: boolean;
  isBuiltIn: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GoalMilestoneTemplate {
  title: string;
  description: string;
  weekNumber: number; // Week 1, 2, 3, etc.
  objectives: string[];
}

export interface CustomTemplate {
  id: string;
  type: TemplateType;
  name: string;
  description: string;
  category: TemplateCategory;
  icon: string;
  color?: string;
  sourceId?: string; // Original habit/goal ID if created from existing
  data: HabitTemplateData | GoalTemplateData;
  tags: string[];
  usageCount: number;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HabitTemplateData {
  frequency: HabitFrequency;
  xpReward: number;
  targetDays?: number[];
  targetCompletions: number;
  duration?: number;
  tips?: string[];
}

export interface GoalTemplateData {
  timeframe: string;
  timeframeDays: number;
  suggestedHabits: string[];
  milestones?: GoalMilestoneTemplate[];
  targetOutcome?: string;
}

export interface TemplateExport {
  version: string;
  exportedAt: string;
  type: 'habit' | 'goal' | 'bundle';
  templates: (HabitTemplate | GoalTemplate | CustomTemplate)[];
  metadata: {
    exportedBy?: string;
    totalTemplates: number;
    categories: TemplateCategory[];
  };
}

export interface TemplateBundle {
  id: string;
  name: string;
  description: string;
  icon: string;
  habitTemplates: HabitTemplate[];
  goalTemplates: GoalTemplate[];
  tags: string[];
  author?: string;
  downloadCount?: number;
  rating?: number;
  createdAt: string;
}

