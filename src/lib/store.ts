// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Global State Store (Zustand)
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { completionFeedback } from '@/lib/sounds';
import {
  User,
  UltimateGoal,
  Habit,
  HabitEntry,
  CalendarSettings,
  GamificationProfile,
  ToastNotification,
  ModalState,
  LEVELS,
  XP_REWARDS,
  AICoachMessage,
  HabitCategory,
  HabitFrequency,
  DailyTask,
  IdentityArchetype,
  IdentityEvidence,
  HabitStack,
  TimedTask,
  PomodoroSession,
  Task,
  TaskList,
  SubTask,
  TaskPriority,
  PLAN_LIMITS,
  UnifiedTask,
  GoalCategory,
  RewardToken,
  // Mental Health & Wellness Types
  MoodEntry,
  GratitudeEntry,
  GentleModeSettings,
  DEFAULT_GENTLE_MODE,
  UserProfile,
} from '@/types';
import { getDaysInMonth, format, startOfMonth, getDay, addDays, addWeeks, addMonths, addYears } from 'date-fns';

const STREAK_MILESTONES = [7, 14, 21, 30, 60, 90, 100, 180, 365];

// ─────────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the next occurrence date for a recurring task
 */
function calculateNextOccurrence(task: Task): string | null {
  const currentDueDate = task.dueDate ? new Date(task.dueDate) : new Date();
  let nextDate: Date;

  switch (task.repeat) {
    case 'daily':
      nextDate = addDays(currentDueDate, task.repeatConfig?.interval || 1);
      break;
    case 'weekly':
      // If specific days are configured, find the next one
      if (task.repeatConfig?.days && task.repeatConfig.days.length > 0) {
        const today = new Date();
        const currentDay = today.getDay();
        const sortedDays = [...task.repeatConfig.days].sort((a, b) => a - b);
        
        // Find the next day after today
        let nextDay = sortedDays.find(d => d > currentDay);
        if (nextDay === undefined) {
          // Wrap to next week
          nextDay = sortedDays[0];
          nextDate = addDays(today, 7 - currentDay + nextDay);
        } else {
          nextDate = addDays(today, nextDay - currentDay);
        }
      } else {
        nextDate = addWeeks(currentDueDate, task.repeatConfig?.interval || 1);
      }
      break;
    case 'monthly':
      nextDate = addMonths(currentDueDate, task.repeatConfig?.interval || 1);
      break;
    case 'yearly':
      nextDate = addYears(currentDueDate, task.repeatConfig?.interval || 1);
      break;
    case 'custom':
      // For custom, just use the interval as days
      nextDate = addDays(currentDueDate, task.repeatConfig?.interval || 1);
      break;
    default:
      return null;
  }

  return nextDate.toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────────
// STORE INTERFACE
// ─────────────────────────────────────────────────────────────────────────────────

interface NewHabitInput {
  name: string;
  description?: string;
  icon: string;
  color: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  customDays?: number[];
  targetCompletions: number;
  linkedGoalId?: string;
  isActive: boolean;
}

interface ResurgoStore {
  // User & Profile
  user: User;
  hasCompletedOnboarding: boolean;
  
  // Calendar
  calendar: CalendarSettings;
  setCalendar: (year: number, month: number) => void;
  
  // Goals
  goals: UltimateGoal[];
  addGoal: (goal: UltimateGoal) => void;
  updateGoal: (goalId: string, updates: Partial<UltimateGoal>) => void;
  deleteGoal: (goalId: string) => void;
  
  // Tasks (from goals)
  completeTask: (goalId: string, milestoneId: string, objectiveId: string, taskId: string) => void;
  getTodaysTasks: () => { task: DailyTask; goalId: string; milestoneId: string; objectiveId: string; goalTitle: string }[];
  
  // Habits
  habits: Habit[];
  habitEntries: HabitEntry[];
  addHabit: (habit: NewHabitInput) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;
  toggleHabitEntry: (habitId: string, date: string) => void;
  getHabitEntry: (habitId: string, date: string) => HabitEntry | undefined;
  getHabitStats: (habitId: string) => { completed: number; total: number; percentage: number };
  
  // Gamification
  addXP: (amount: number, reason: string) => void;
  unlockAchievement: (achievementId: string) => void;
  useStreakFreeze: () => boolean;
  
  // AI Coach
  coachMessages: AICoachMessage[];
  addCoachMessage: (message: Omit<AICoachMessage, 'id' | 'createdAt' | 'read'>) => void;
  markMessageRead: (messageId: string) => void;
  
  // UI State
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  dismissToast: (id: string) => void;
  streakCelebrationPending: boolean;
  clearStreakCelebration: () => void;
  modal: ModalState;
  setModal: (modal: ModalState) => void;
  
  // Analytics helpers
  getDailyStats: (date: string) => { completed: number; total: number; percentage: number };
  getWeeklyStats: (weekNumber: number) => { completed: number; total: number; percentage: number };
  getMonthlyStats: () => { completed: number; total: number; percentage: number; topHabits: Array<{ id: string; name: string; icon: string; color: string; completed: number; goal: number; percentage: number }>; worstHabits: Array<{ id: string; name: string; icon: string; color: string; completed: number; goal: number; percentage: number }> };
  
  // Identity System (Atomic Habits)
  identities: IdentityArchetype[];
  addIdentity: (identity: IdentityArchetype) => void;
  updateIdentity: (identityId: string, updates: Partial<IdentityArchetype>) => void;
  removeIdentity: (identityId: string) => void;
  addIdentityEvidence: (identityId: string, habitId: string, description: string) => void;
  
  // Habit Stacking
  habitStacks: HabitStack[];
  addHabitStack: (stack: HabitStack) => void;
  updateHabitStack: (stackId: string, updates: Partial<HabitStack>) => void;
  deleteHabitStack: (stackId: string) => void;
  
  // Timed Tasks
  timedTasks: TimedTask[];
  addTimedTask: (task: TimedTask) => void;
  updateTimedTask: (taskId: string, updates: Partial<TimedTask>) => void;
  deleteTimedTask: (taskId: string) => void;
  
  // Checklist Tasks (TickTick-style)
  tasks: Task[];
  taskLists: TaskList[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTask: (taskId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  addTaskList: (name: string, icon?: string, color?: string) => void;
  deleteTaskList: (listId: string) => void;
  
  // Unified Tasks (combines habits, goals, manual tasks)
  getUnifiedTodayTasks: () => UnifiedTask[];
  getAllUnifiedTasks: () => UnifiedTask[];
  completeUnifiedTask: (taskId: string) => void;
  skipUnifiedTask: (taskId: string) => void;
  
  // Reward Tokens
  rewardTokens: RewardToken[];
  addRewardToken: (token: RewardToken) => void;
  useRewardToken: (tokenId: string) => void;
  
  // Pomodoro Sessions
  pomodoroSessions: PomodoroSession[];
  addPomodoroSession: (session: PomodoroSession) => void;
  
  // ─── MENTAL HEALTH & WELLNESS FEATURES ─────────────────────────────────────
  
  // Mood Tracking
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  getTodaysMood: () => MoodEntry | undefined;
  getMoodTrend: () => 'improving' | 'stable' | 'declining';
  
  // Gratitude Journal
  gratitudeEntries: GratitudeEntry[];
  addGratitudeEntry: (entry: Omit<GratitudeEntry, 'id'>) => void;
  
  // Gentle Mode Settings
  gentleModeSettings: GentleModeSettings;
  updateGentleModeSettings: (settings: Partial<GentleModeSettings>) => void;
  
  // Wellness Stats
  wellnessStats: {
    totalBreathingSessions: number;
    totalMindfulMinutes: number;
    longestMoodStreak: number;
    currentMoodStreak: number;
  };
  updateWellnessStats: (type: 'breathing' | 'mindful', minutes?: number) => void;
  
  // Streak Freeze System (Enhanced)
  streakFreezeCount: number;
  useStreakFreezeEnhanced: () => boolean;
  earnStreakFreeze: () => void;
  
  // Focus Statistics
  focusStats: {
    totalFocusMinutes: number;
    totalSessionsCompleted: number;
    bestFocusDay: string;
    currentFocusStreak: number;
  };
  updateFocusStats: (minutes: number) => void;
  
  // Initialize
  initializeUser: (name: string) => void;
  completeOnboarding: () => void;
  updateUserProfile: (profile: UserProfile) => void;
  updateNotificationSettings: (updates: Partial<User['preferences']['notifications']>) => void;
  
  // Plan Management
  upgradePlan: (plan: 'pro' | 'lifetime') => void;
  getPlanLimits: () => typeof PLAN_LIMITS[keyof typeof PLAN_LIMITS];
  
  // Logout & Reset
  logout: () => void;
  resetStore: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// DEFAULT VALUES
// ─────────────────────────────────────────────────────────────────────────────────

const defaultGamification: GamificationProfile = {
  xp: 0,
  level: 1,
  title: 'Beginner',
  nextLevelXp: 100,
  totalXP: 0,
  achievements: [],
  unlockedBadges: [],
  streakFreezes: 1,
  weeklyStreak: 0,
  monthlyStreak: 0,
};

const defaultUser: User = {
  id: 'default',
  email: '',
  name: 'Explorer',
  createdAt: new Date(),
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  plan: 'free',
  preferences: {
    weekStartsOn: 1,
    theme: 'dark',
    notifications: {
      enabled: true,
      morningReminder: '07:00',
      eveningReminder: '21:00',
      streakAtRisk: true,
      achievements: true,
      weeklyReport: true,
      quietHoursEnabled: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '06:00',
      intelligenceLevel: 'balanced',
      personalizationMode: 'auto',
    },
    dailyResetTime: '00:00',
    motivationalQuotes: true,
  },
  stats: {
    totalHabitsCompleted: 0,
    totalGoalsAchieved: 0,
    longestStreak: 0,
    currentStreak: 0,
    totalDaysActive: 0,
    joinedDate: new Date(),
  },
  gamification: { ...defaultGamification },
  onboardingCompleted: false,
  onboardingStep: 0,
};

const getDefaultCalendar = (): CalendarSettings => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const daysInMonth = getDaysInMonth(now);
  const firstDay = getDay(startOfMonth(now));
  
  return {
    year,
    month,
    daysInMonth,
    firstDayOfWeek: firstDay,
    weekNumbers: Array.from({ length: Math.ceil((daysInMonth + firstDay) / 7) }, (_, i) => i + 1),
  };
};

const defaultHabits: Habit[] = [];
// Users will create their own habits based on their goals during onboarding

// ─────────────────────────────────────────────────────────────────────────────────
// STORE IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────────

export const useResurgoStore = create<ResurgoStore>()(
  persist(
    (set, get) => ({
      // ─── User & Profile ───────────────────────────────────────────────────────
      user: defaultUser,
      hasCompletedOnboarding: false,
      
      initializeUser: (name: string) => {
        const user: User = {
          id: `user-${Date.now()}`,
          email: '',
          name,
          createdAt: new Date(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          plan: 'free',
          preferences: {
            weekStartsOn: 1,
            theme: 'dark',
            notifications: {
              enabled: true,
              morningReminder: '07:00',
              eveningReminder: '21:00',
              streakAtRisk: true,
              achievements: true,
              weeklyReport: true,
              quietHoursEnabled: true,
              quietHoursStart: '22:00',
              quietHoursEnd: '06:00',
              intelligenceLevel: 'balanced',
              personalizationMode: 'auto',
            },
            dailyResetTime: '00:00',
            motivationalQuotes: true,
          },
          stats: {
            totalHabitsCompleted: 0,
            totalGoalsAchieved: 0,
            longestStreak: 0,
            currentStreak: 0,
            totalDaysActive: 0,
            joinedDate: new Date(),
          },
          gamification: { ...defaultGamification },
          onboardingCompleted: false,
          onboardingStep: 0,
        };
        set({ user, habits: defaultHabits.map(h => ({ ...h, userId: user.id })) });
      },
      
      updateUserProfile: (profile: UserProfile) => {
        set((state) => ({
          user: {
            ...state.user,
            profile,
          },
        }));
      },
      
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      updateNotificationSettings: (updates) => {
        set((state) => ({
          user: {
            ...state.user,
            preferences: {
              ...state.user.preferences,
              notifications: {
                ...state.user.preferences.notifications,
                ...updates,
              },
            },
          },
        }));
      },
      
      // ─── Plan Management ──────────────────────────────────────────────────────
      upgradePlan: (plan: 'pro' | 'lifetime') => {
        const { addToast } = get();
        set((state) => ({
          user: {
            ...state.user,
            plan,
            planExpiresAt: plan === 'pro' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : undefined,
          },
        }));
        addToast({
          type: 'success',
          title: 'Welcome to Pro',
          message: `You've unlocked all premium features. Enjoy!`,
          duration: 5000,
        });
      },
      
      getPlanLimits: () => {
        const { user } = get();
        return PLAN_LIMITS[user.plan];
      },
      
      // ─── Logout & Reset ───────────────────────────────────────────────────────
      logout: () => {
        // Clear localStorage
        localStorage.removeItem('resurgo-user');
        localStorage.removeItem('resurgo-storage');
        // Reset store to defaults
        set({
          user: defaultUser,
          hasCompletedOnboarding: false,
          habits: [],
          habitEntries: [],
          goals: [],
          coachMessages: [],
          identities: [],
          habitStacks: [],
          timedTasks: [],
          pomodoroSessions: [],
          tasks: [],
          taskLists: [{ id: 'inbox', name: 'Inbox', icon: 'IN', sortOrder: 0, isDefault: true }],
          focusStats: {
            totalFocusMinutes: 0,
            totalSessionsCompleted: 0,
            bestFocusDay: '',
            currentFocusStreak: 0,
          },
        });
      },
      
      resetStore: () => {
        localStorage.removeItem('resurgo-storage');
        set({
          user: defaultUser,
          hasCompletedOnboarding: false,
          habits: [],
          habitEntries: [],
          goals: [],
          coachMessages: [],
          identities: [],
          habitStacks: [],
          timedTasks: [],
          pomodoroSessions: [],
          tasks: [],
          taskLists: [{ id: 'inbox', name: 'Inbox', icon: 'IN', sortOrder: 0, isDefault: true }],
        });
      },
      
      // ─── Calendar ─────────────────────────────────────────────────────────────
      calendar: getDefaultCalendar(),
      
      setCalendar: (year: number, month: number) => {
        const date = new Date(year, month - 1, 1);
        const daysInMonth = getDaysInMonth(date);
        const firstDay = getDay(date);
        
        set({
          calendar: {
            year,
            month,
            daysInMonth,
            firstDayOfWeek: firstDay,
            weekNumbers: Array.from({ length: Math.ceil((daysInMonth + firstDay) / 7) }, (_, i) => i + 1),
          },
        });
      },
      
      // ─── Goals ────────────────────────────────────────────────────────────────
      goals: [],
      
      addGoal: (goal) => {
        const { user, goals, addToast } = get();
        const limits = PLAN_LIMITS[user.plan];
        
        // Check plan limits
        if (goals.length >= limits.maxGoals) {
          addToast({
            type: 'warning',
            title: 'Goal Limit Reached',
            message: `Free plan allows ${limits.maxGoals} goal${limits.maxGoals === 1 ? '' : 's'}. Upgrade to Pro for unlimited goals!`,
            duration: 5000,
          });
          return;
        }
        
        set((state) => ({ goals: [...state.goals, goal] }));
      },
      
      updateGoal: (goalId, updates) => set((state) => ({
        goals: state.goals.map((g) => (g.id === goalId ? { ...g, ...updates } : g)),
      })),
      
      deleteGoal: (goalId) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== goalId),
      })),
      
      // ─── Tasks (from Goals) ───────────────────────────────────────────────────
      getTodaysTasks: () => {
        const state = get();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        
        const tasks: { task: DailyTask; goalId: string; milestoneId: string; objectiveId: string; goalTitle: string }[] = [];
        
        state.goals.forEach((goal) => {
          if (goal.status !== 'in_progress') return;
          
          goal.milestones.forEach((milestone) => {
            milestone.weeklyObjectives.forEach((objective) => {
              objective.dailyTasks.forEach((task) => {
                const taskDate = new Date(task.scheduledDate);
                taskDate.setHours(0, 0, 0, 0);
                
                // Include tasks from today and recent past (up to 3 days) that aren't completed
                const daysDiff = Math.floor((today.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));
                if (daysDiff >= 0 && daysDiff <= 3 && task.status !== 'completed') {
                  tasks.push({
                    task,
                    goalId: goal.id,
                    milestoneId: milestone.id,
                    objectiveId: objective.id,
                    goalTitle: goal.title,
                  });
                }
              });
            });
          });
        });
        
        // Sort by priority and date
        const priorityOrder: Record<DailyTask['priority'], number> = { critical: 0, high: 1, medium: 2, low: 3 };
        return tasks.sort((a, b) => {
          const priorityA = priorityOrder[a.task.priority as DailyTask['priority']];
          const priorityB = priorityOrder[b.task.priority as DailyTask['priority']];
          return priorityA - priorityB;
        });
      },
      
      completeTask: (goalId, milestoneId, objectiveId, taskId) => set((state) => {
        const updatedGoals = state.goals.map((goal) => {
          if (goal.id !== goalId) return goal;
          
          let taskXP = 0;
          
          const updatedMilestones = goal.milestones.map((milestone) => {
            if (milestone.id !== milestoneId) return milestone;
            
            const updatedObjectives = milestone.weeklyObjectives.map((objective) => {
              if (objective.id !== objectiveId) return objective;
              
              const updatedTasks = objective.dailyTasks.map((task) => {
                if (task.id !== taskId) return task;
                taskXP = task.xpReward || 15;
                return { ...task, status: 'completed' as const, completedAt: new Date() };
              });
              
              // Calculate objective progress
              const completedTasks = updatedTasks.filter((t) => t.status === 'completed').length;
              const totalTasks = updatedTasks.length;
              const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
              
              return { ...objective, dailyTasks: updatedTasks, progressPercentage };
            });
            
            // Calculate milestone progress
            const totalProgress = updatedObjectives.reduce((sum, o) => sum + o.progressPercentage, 0);
            const avgProgress = updatedObjectives.length > 0 ? Math.round(totalProgress / updatedObjectives.length) : 0;
            
            return { 
              ...milestone, 
              weeklyObjectives: updatedObjectives, 
              progressPercentage: avgProgress,
              progress: avgProgress,
              status: avgProgress === 100 ? 'completed' as const : milestone.status
            };
          });
          
          // Calculate goal progress
          const totalMilestoneProgress = updatedMilestones.reduce((sum, m) => sum + m.progressPercentage, 0);
          const avgGoalProgress = updatedMilestones.length > 0 ? Math.round(totalMilestoneProgress / updatedMilestones.length) : 0;
          
          // Add XP
          if (taskXP > 0) {
            setTimeout(() => {
              get().addXP(taskXP, 'Task completed');
              get().addToast({
                type: 'success',
                title: 'Task completed',
                message: `Great work! You earned ${taskXP} XP`,
                xpGained: taskXP,
              });
              completionFeedback('taskComplete');
            }, 0);
          }
          
          return { 
            ...goal, 
            milestones: updatedMilestones, 
            progressPercentage: avgGoalProgress,
            progress: avgGoalProgress,
            status: avgGoalProgress === 100 ? 'completed' as const : goal.status
          };
        });
        
        return { goals: updatedGoals };
      }),
      
      // ─── Habits ───────────────────────────────────────────────────────────────
      habits: [],
      habitEntries: [],
      
      addHabit: (input: NewHabitInput) => {
        const { user, habits, addToast } = get();
        const limits = PLAN_LIMITS[user.plan];
        const activeHabits = habits.filter(h => !h.archived);
        
        // Check plan limits
        if (activeHabits.length >= limits.maxHabits) {
          addToast({
            type: 'warning',
            title: 'Habit Limit Reached',
            message: `Free plan allows ${limits.maxHabits} habits. Upgrade to Pro for unlimited habits!`,
            duration: 5000,
          });
          return;
        }
        
        set((state) => {
          const newHabit: Habit = {
            id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId: state.user.id,
            name: input.name,
            description: input.description,
            icon: input.icon,
            color: input.color,
            category: input.category,
            frequency: input.frequency,
            customDays: input.customDays,
            monthlyGoal: 25,
            currentStreak: 0,
            longestStreak: 0,
            completedToday: false,
            isActive: input.isActive,
            linkedGoalId: input.linkedGoalId,
            createdAt: new Date(),
            archived: false,
            order: state.habits.length + 1,
          };
          return { habits: [...state.habits, newHabit] };
        });
      },
      
      updateHabit: (habitId, updates) => set((state) => ({
        habits: state.habits.map((h) => (h.id === habitId ? { ...h, ...updates } : h)),
      })),
      
      deleteHabit: (habitId) => set((state) => ({
        habits: state.habits.filter((h) => h.id !== habitId),
        habitEntries: state.habitEntries.filter((e) => e.habitId !== habitId),
      })),
      
      toggleHabitEntry: (habitId, date) => {
        const { habitEntries, addXP, addToast } = get();
        const existingEntry = habitEntries.find(
          (e) => e.habitId === habitId && e.date === date
        );
        
        if (existingEntry) {
          // Toggle off
          set({
            habitEntries: habitEntries.map((e) =>
              e.id === existingEntry.id ? { ...e, completed: !e.completed, completedAt: e.completed ? undefined : new Date() } : e
            ),
          });
          
          if (existingEntry.completed) {
            // Was completed, now uncompleted - subtract XP
            set((state) => ({
              user: {
                ...state.user,
                gamification: {
                  ...state.user.gamification,
                  xp: Math.max(0, state.user.gamification.xp - XP_REWARDS.HABIT_COMPLETED),
                  totalXP: Math.max(0, state.user.gamification.totalXP - XP_REWARDS.HABIT_COMPLETED),
                },
              },
            }));
          } else {
            // Was not completed, now completed - add XP + feedback
            addXP(XP_REWARDS.HABIT_COMPLETED, 'Habit completed');
            completionFeedback('habitComplete');
          }
        } else {
          // Create new entry (completed)
          const newEntry: HabitEntry = {
            id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            habitId,
            date,
            completed: true,
            completedAt: new Date(),
          };
          
          set({ habitEntries: [...habitEntries, newEntry] });
          addXP(XP_REWARDS.HABIT_COMPLETED, 'Habit completed');
          completionFeedback('habitComplete');
          
          // Check if all habits for today are complete
          const todayEntries = [...habitEntries, newEntry].filter(
            (e) => e.date === date && e.completed
          );
          const { habits } = get();
          if (todayEntries.length === habits.filter(h => !h.archived && h.isActive).length) {
            addXP(XP_REWARDS.DAILY_ALL_HABITS, 'All habits completed!');
            addToast({
              type: 'success',
              title: 'Perfect day',
              message: 'You completed all habits today!',
              xpGained: XP_REWARDS.DAILY_ALL_HABITS,
            });
            
            // Update streak — all habits done today counts as a streak day
            const prevStreak = get().user.stats.currentStreak;
            const newStreak = prevStreak + 1;
            const newLongest = Math.max(newStreak, get().user.stats.longestStreak);
            set((state) => ({
              user: {
                ...state.user,
                stats: {
                  ...state.user.stats,
                  currentStreak: newStreak,
                  longestStreak: newLongest,
                  totalDaysActive: state.user.stats.totalDaysActive + 1,
                  totalHabitsCompleted: state.user.stats.totalHabitsCompleted + 1,
                },
              },
            }));
            
            // Trigger streak milestone celebration + bonus XP
            if (STREAK_MILESTONES.includes(newStreak)) {
              const bonusXP = newStreak >= 30 ? XP_REWARDS.STREAK_MONTH : XP_REWARDS.STREAK_WEEK;
              addXP(bonusXP, `${newStreak}-day streak milestone!`);
              set({ streakCelebrationPending: true });
            }
          }
        }
      },
      
      getHabitEntry: (habitId, date) => {
        return get().habitEntries.find((e) => e.habitId === habitId && e.date === date);
      },
      
      getHabitStats: (habitId) => {
        const { habitEntries, calendar } = get();
        const monthStart = `${calendar.year}-${String(calendar.month).padStart(2, '0')}-01`;
        const monthEnd = `${calendar.year}-${String(calendar.month).padStart(2, '0')}-${calendar.daysInMonth}`;
        
        const entries = habitEntries.filter(
          (e) => e.habitId === habitId && e.date >= monthStart && e.date <= monthEnd && e.completed
        );
        
        const habit = get().habits.find((h) => h.id === habitId);
        const total = habit?.monthlyGoal || calendar.daysInMonth;
        const completed = entries.length;
        
        return {
          completed,
          total,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      },
      
      // ─── Gamification ─────────────────────────────────────────────────────────
      
      addXP: (amount, _reason) => {
        const { user, addToast } = get();
        const newXp = user.gamification.xp + amount;
        const newTotalXP = user.gamification.totalXP + amount;
        
        // Check for level up
        let newLevel = user.gamification.level;
        let newTitle = user.gamification.title;
        let newNextLevelXp = user.gamification.nextLevelXp;
        
        for (const levelInfo of LEVELS) {
          if (newTotalXP >= levelInfo.xpRequired) {
            newLevel = levelInfo.level;
            newTitle = levelInfo.name;
            const nextLevelInfo = LEVELS.find(l => l.level === newLevel + 1);
            newNextLevelXp = nextLevelInfo?.xpRequired || levelInfo.xpRequired;
          }
        }
        
        const leveledUp = newLevel > user.gamification.level;
        
        set({
          user: {
            ...user,
            gamification: {
              ...user.gamification,
              xp: newXp,
              totalXP: newTotalXP,
              level: newLevel,
              title: newTitle,
              nextLevelXp: newNextLevelXp,
            },
          },
        });
        
        if (leveledUp) {
          addToast({
            type: 'success',
            title: `Level Up: ${newLevel}`,
            message: `You are now a ${newTitle}!`,
            xpGained: amount,
          });
        }
      },
      
      unlockAchievement: (achievementId) => {
        set((state) => ({
          user: {
            ...state.user,
            gamification: {
              ...state.user.gamification,
              achievements: state.user.gamification.achievements.map((a) =>
                a.id === achievementId ? { ...a, unlockedAt: new Date(), progress: 100 } : a
              ),
            },
          },
        }));
      },
      
      useStreakFreeze: () => {
        const { user } = get();
        if (user.gamification.streakFreezes > 0) {
          set({
            user: {
              ...user,
              gamification: {
                ...user.gamification,
                streakFreezes: user.gamification.streakFreezes - 1,
              },
            },
          });
          return true;
        }
        return false;
      },
      
      // ─── AI Coach ─────────────────────────────────────────────────────────────
      coachMessages: [],
      
      addCoachMessage: (message) => {
        const newMessage: AICoachMessage = {
          ...message,
          id: `coach-${Date.now()}`,
          createdAt: new Date(),
          read: false,
        };
        set((state) => ({ coachMessages: [newMessage, ...state.coachMessages] }));
      },
      
      markMessageRead: (messageId) => {
        set((state) => ({
          coachMessages: state.coachMessages.map((m) =>
            m.id === messageId ? { ...m, read: true } : m
          ),
        }));
      },
      
      // ─── UI State ─────────────────────────────────────────────────────────────
      toasts: [],
      
      addToast: (toast) => {
        const id = `toast-${Date.now()}`;
        set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
        
        // Auto-remove after duration
        setTimeout(() => {
          get().dismissToast(id);
        }, toast.duration || 4000);
      },
      
      dismissToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      },
      
      streakCelebrationPending: false,
      clearStreakCelebration: () => set({ streakCelebrationPending: false }),
      
      modal: { isOpen: false, type: null },
      
      setModal: (modal) => set({ modal }),
      
      // ─── Identity System (Atomic Habits) ──────────────────────────────────────
      identities: [],
      
      addIdentity: (identity) => {
        set((state) => ({
          identities: [...state.identities, identity],
        }));
      },
      
      updateIdentity: (identityId, updates) => {
        set((state) => ({
          identities: state.identities.map((i) =>
            i.id === identityId ? { ...i, ...updates } : i
          ),
        }));
      },
      
      removeIdentity: (identityId) => {
        set((state) => ({
          identities: state.identities.filter((i) => i.id !== identityId),
        }));
      },
      
      addIdentityEvidence: (identityId, habitId, description) => {
        set((state) => ({
          identities: state.identities.map((identity) => {
            if (identity.id !== identityId) return identity;
            const newEvidence: IdentityEvidence = {
              id: `evidence-${Date.now()}`,
              archetypeId: identityId,
              habitId,
              date: new Date().toISOString(),
              note: description,
            };
            return {
              ...identity,
              evidence: [...identity.evidence, newEvidence],
              evidenceCount: identity.evidenceCount + 1,
            };
          }),
        }));
      },
      
      // ─── Habit Stacking ───────────────────────────────────────────────────────
      habitStacks: [],
      
      addHabitStack: (stack) => {
        const { user, habitStacks, addToast } = get();
        const limits = PLAN_LIMITS[user.plan];
        
        // Check if habit stacking is available
        if (!limits.hasHabitStacking) {
          addToast({
            type: 'warning',
            title: 'Pro Feature',
            message: 'Habit Stacking is a Pro feature. Upgrade to unlock!',
            duration: 5000,
          });
          return;
        }
        
        // Check stack limits
        if (habitStacks.length >= limits.maxStacks) {
          addToast({
            type: 'warning',
            title: 'Stack Limit Reached',
            message: `Your plan allows ${limits.maxStacks} habit stacks. Upgrade for more!`,
            duration: 5000,
          });
          return;
        }
        
        set((state) => ({
          habitStacks: [...state.habitStacks, stack],
        }));
      },
      
      updateHabitStack: (stackId, updates) => {
        set((state) => ({
          habitStacks: state.habitStacks.map((s) =>
            s.id === stackId ? { ...s, ...updates } : s
          ),
        }));
      },
      
      deleteHabitStack: (stackId) => {
        set((state) => ({
          habitStacks: state.habitStacks.filter((s) => s.id !== stackId),
        }));
      },
      
      // ─── Timed Tasks ──────────────────────────────────────────────────────────
      timedTasks: [],
      
      addTimedTask: (task) => {
        set((state) => ({
          timedTasks: [...state.timedTasks, task],
        }));
      },
      
      updateTimedTask: (taskId, updates) => {
        set((state) => ({
          timedTasks: state.timedTasks.map((t) =>
            t.id === taskId ? { ...t, ...updates } : t
          ),
        }));
      },
      
      deleteTimedTask: (taskId) => {
        set((state) => ({
          timedTasks: state.timedTasks.filter((t) => t.id !== taskId),
        }));
      },
      
      // ─── Checklist Tasks (TickTick-style) ─────────────────────────────────────
      tasks: [],
      taskLists: [
        { id: 'inbox', name: 'Inbox', icon: 'IN', sortOrder: 0, isDefault: true },
      ],
      
      addTask: (taskInput) => {
        const now = new Date().toISOString();
        const newTask: Task = {
          ...taskInput,
          id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },
      
      updateTask: (taskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },
      
      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        }));
      },
      
      toggleTask: (taskId) => {
        const { tasks, addXP, addTask } = get();
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;
        
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        const updates: Partial<Task> = {
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, ...updates } : t
          ),
        }));
        
        // Award XP when completing
        if (newStatus === 'completed' && task.xpReward > 0) {
          addXP(task.xpReward, `Completed task: ${task.title}`);
        }
        
        // Handle recurring tasks - create next occurrence
        if (newStatus === 'completed' && task.repeat !== 'none') {
          const nextDueDate = calculateNextOccurrence(task);
          if (nextDueDate) {
            // Check if end date has passed
            if (task.repeatConfig?.endDate && new Date(nextDueDate) > new Date(task.repeatConfig.endDate)) {
              return; // Don't create more occurrences past end date
            }
            
            // Create the next occurrence
            const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, completedAt: _completedAt, status: _status, ...taskWithoutMeta } = task;
            addTask({
              ...taskWithoutMeta,
              status: 'pending',
              dueDate: nextDueDate,
              completedAt: undefined,
            });
          }
        }
      },
      
      toggleSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              subtasks: t.subtasks.map((st) =>
                st.id === subtaskId
                  ? { ...st, completed: !st.completed, completedAt: !st.completed ? new Date().toISOString() : undefined }
                  : st
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
      
      addSubtask: (taskId, title) => {
        const newSubtask: SubTask = {
          id: `subtask_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
          title,
          completed: false,
        };
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: [...t.subtasks, newSubtask], updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },
      
      deleteSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: t.subtasks.filter((st) => st.id !== subtaskId), updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },
      
      addTaskList: (name, icon, color) => {
        const { taskLists } = get();
        const newList: TaskList = {
          id: `list_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
          name,
          icon,
          color,
          sortOrder: taskLists.length,
        };
        set((state) => ({
          taskLists: [...state.taskLists, newList],
        }));
      },
      
      deleteTaskList: (listId) => {
        // Move tasks from deleted list to inbox
        set((state) => ({
          taskLists: state.taskLists.filter((l) => l.id !== listId && !l.isDefault),
          tasks: state.tasks.map((t) =>
            t.list === listId ? { ...t, list: 'inbox' } : t
          ),
        }));
      },
      
      // ─── Pomodoro Sessions ────────────────────────────────────────────────────
      pomodoroSessions: [],
      
      addPomodoroSession: (session) => {
        set((state) => ({
          pomodoroSessions: [...state.pomodoroSessions, session],
        }));
      },
      
      // ─── Focus Statistics ─────────────────────────────────────────────────────
      focusStats: {
        totalFocusMinutes: 0,
        totalSessionsCompleted: 0,
        bestFocusDay: '',
        currentFocusStreak: 0,
      },
      
      updateFocusStats: (minutes) => {
        set((state) => ({
          focusStats: {
            ...state.focusStats,
            totalFocusMinutes: state.focusStats.totalFocusMinutes + minutes,
            totalSessionsCompleted: state.focusStats.totalSessionsCompleted + 1,
          },
        }));
      },
      
      // ─── Unified Tasks ────────────────────────────────────────────────────────
      getUnifiedTodayTasks: () => {
        try {
          const state = get();
          const today = format(new Date(), 'yyyy-MM-dd');
          const unifiedTasks: UnifiedTask[] = [];
          
          // Safety: ensure arrays exist (for older localStorage data)
          const habits = state.habits || [];
          const habitEntries = state.habitEntries || [];
          const goals = state.goals || [];
          const tasks = state.tasks || [];
          
          // 1. Add habit-based tasks (recurring daily tasks from habits)
          habits
            .filter((h) => h && h.isActive && !h.archived)
            .forEach((habit) => {
            const entry = habitEntries.find(
              (e) => e.habitId === habit.id && e.date === today
            );
            
            unifiedTasks.push({
              id: `habit-${habit.id}-${today}`,
              title: habit.name,
              description: habit.description,
              source: 'habit',
              sourceId: habit.id,
              sourceMetadata: { habitName: habit.name },
              date: today,
              status: entry?.completed ? 'completed' : 'pending',
              completedAt: entry?.completedAt ? (typeof entry.completedAt === 'string' ? entry.completedAt : entry.completedAt.toISOString()) : undefined,
              isRecurring: true,
              recurrence: {
                frequency: habit.frequency,
                customDays: habit.customDays,
              },
              priority: 'medium',
              category: (habit.category === 'learning' ? 'education' : habit.category === 'social' ? 'relationships' : habit.category === 'self_care' ? 'health' : habit.category === 'general' ? 'custom' : habit.category) as GoalCategory,
              xpReward: XP_REWARDS.HABIT_COMPLETED,
              icon: habit.icon,
              color: habit.color,
              isQuickWin: true,
              createdAt: typeof habit.createdAt === 'string' ? habit.createdAt : habit.createdAt.toISOString(),
              updatedAt: new Date().toISOString(),
            });
          });
        
        // 2. Add goal-based tasks (daily tasks from active goals)
        goals
          .filter((g) => g.status === 'in_progress')
          .forEach((goal) => {
            goal.milestones.forEach((milestone) => {
              milestone.weeklyObjectives.forEach((objective) => {
                objective.dailyTasks
                  .filter((task) => {
                    const taskDate = format(new Date(task.scheduledDate), 'yyyy-MM-dd');
                    const daysDiff = Math.floor(
                      (new Date(today).getTime() - new Date(taskDate).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    // Include today's tasks and recent overdue (up to 3 days)
                    return daysDiff >= 0 && daysDiff <= 3;
                  })
                  .forEach((task) => {
                    unifiedTasks.push({
                      id: `goal-${task.id}`,
                      title: task.title,
                      description: task.description,
                      source: 'goal',
                      sourceId: goal.id,
                      sourceMetadata: {
                        goalTitle: goal.title,
                        milestoneTitle: milestone.title,
                        objectiveTitle: objective.title,
                      },
                      date: format(new Date(task.scheduledDate), 'yyyy-MM-dd'),
                      estimatedMinutes: task.estimatedMinutes,
                      status: task.status === 'completed' ? 'completed' : 'pending',
                      completedAt: task.completedAt ? (typeof task.completedAt === 'string' ? task.completedAt : task.completedAt.toISOString()) : undefined,
                      isRecurring: false,
                      priority: task.priority as TaskPriority,
                      category: goal.category,
                      xpReward: task.xpReward || 15,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    });
                  });
              });
            });
          });
        
        // 3. Add manual tasks due today
        tasks
          .filter((t) => {
            if (t.status === 'cancelled') return false;
            if (!t.dueDate) return t.list === 'inbox'; // Show inbox tasks
            return t.dueDate === today || (t.status !== 'completed' && t.dueDate < today);
          })
          .forEach((task) => {
            unifiedTasks.push({
              id: `manual-${task.id}`,
              title: task.title,
              description: task.description,
              source: 'manual',
              sourceId: task.id,
              date: task.dueDate || today,
              time: task.dueTime,
              estimatedMinutes: task.estimatedMinutes,
              status: task.status === 'completed' ? 'completed' : 'pending',
              completedAt: task.completedAt,
              isRecurring: task.repeat !== 'none',
              recurrence: task.repeat !== 'none' ? {
                frequency: task.repeat as 'daily' | 'weekly' | 'weekdays' | 'weekends' | 'custom',
                customDays: task.repeatConfig?.days,
              } : undefined,
              priority: task.priority,
              tags: task.tags,
              xpReward: task.xpReward || 10,
              linkedIdentityId: task.linkedHabitId ? state.identities.find(
                i => i.linkedHabits.includes(task.linkedHabitId!)
              )?.id : undefined,
              createdAt: task.createdAt,
              updatedAt: task.updatedAt,
            });
          });
        
          // Sort by: pending first, then by priority
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3, none: 4 };
          return unifiedTasks.sort((a, b) => {
            // Completed tasks go to bottom
            if (a.status === 'completed' && b.status !== 'completed') return 1;
            if (a.status !== 'completed' && b.status === 'completed') return -1;
            // Then sort by priority
            return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
          });
        } catch (error) {
          console.error('Error in getUnifiedTodayTasks:', error);
          return []; // Return empty array on error to prevent crashes
        }
      },
      
      // Get ALL unified tasks without date filtering (for All Tasks view)
      getAllUnifiedTasks: () => {
        try {
          const state = get();
          const today = format(new Date(), 'yyyy-MM-dd');
          const unifiedTasks: UnifiedTask[] = [];
          
          // Safety: ensure arrays exist
          const habits = state.habits || [];
          const habitEntries = state.habitEntries || [];
          const goals = state.goals || [];
          const tasks = state.tasks || [];
          
          // 1. Add habit-based tasks (today only for habits since they're recurring)
          habits
            .filter((h) => h && h.isActive && !h.archived)
            .forEach((habit) => {
              const entry = habitEntries.find(
                (e) => e.habitId === habit.id && e.date === today
              );
              
              unifiedTasks.push({
                id: `habit-${habit.id}-${today}`,
                title: habit.name,
                description: habit.description,
                source: 'habit',
                sourceId: habit.id,
                sourceMetadata: { habitName: habit.name },
                date: today,
                scheduledDate: today,
                status: entry?.completed ? 'completed' : 'pending',
                completed: entry?.completed || false,
                completedAt: entry?.completedAt ? (typeof entry.completedAt === 'string' ? entry.completedAt : entry.completedAt.toISOString()) : undefined,
                isRecurring: true,
                recurrence: {
                  frequency: habit.frequency,
                  customDays: habit.customDays,
                },
                priority: 'medium',
                category: (habit.category === 'learning' ? 'education' : habit.category === 'social' ? 'relationships' : habit.category === 'self_care' ? 'health' : habit.category === 'general' ? 'custom' : habit.category) as GoalCategory,
                xpReward: XP_REWARDS.HABIT_COMPLETED,
                icon: habit.icon,
                color: habit.color,
                isQuickWin: true,
                createdAt: typeof habit.createdAt === 'string' ? habit.createdAt : habit.createdAt.toISOString(),
                updatedAt: new Date().toISOString(),
              });
            });
          
          // 2. Add ALL goal-based tasks (not just today's)
          goals
            .filter((g) => g.status === 'in_progress')
            .forEach((goal) => {
              goal.milestones.forEach((milestone) => {
                milestone.weeklyObjectives.forEach((objective) => {
                  objective.dailyTasks.forEach((task) => {
                    unifiedTasks.push({
                      id: `goal-${task.id}`,
                      title: task.title,
                      description: task.description,
                      source: 'goal',
                      sourceId: goal.id,
                      sourceMetadata: {
                        goalTitle: goal.title,
                        milestoneTitle: milestone.title,
                        objectiveTitle: objective.title,
                      },
                      goalTitle: goal.title,
                      milestoneTitle: milestone.title,
                      date: format(new Date(task.scheduledDate), 'yyyy-MM-dd'),
                      scheduledDate: format(new Date(task.scheduledDate), 'yyyy-MM-dd'),
                      estimatedMinutes: task.estimatedMinutes,
                      status: task.status === 'completed' ? 'completed' : 'pending',
                      completed: task.status === 'completed',
                      completedAt: task.completedAt ? (typeof task.completedAt === 'string' ? task.completedAt : task.completedAt.toISOString()) : undefined,
                      isRecurring: false,
                      priority: task.priority as TaskPriority,
                      category: goal.category,
                      xpReward: task.xpReward || 15,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    });
                  });
                });
              });
            });
          
          // 3. Add ALL manual tasks
          tasks
            .filter((t) => t.status !== 'cancelled')
            .forEach((task) => {
              unifiedTasks.push({
                id: `manual-${task.id}`,
                title: task.title,
                description: task.description,
                source: 'manual',
                sourceId: task.id,
                date: task.dueDate || today,
                scheduledDate: task.dueDate || undefined,
                time: task.dueTime,
                estimatedMinutes: task.estimatedMinutes,
                status: task.status === 'completed' ? 'completed' : 'pending',
                completed: task.status === 'completed',
                completedAt: task.completedAt,
                isRecurring: task.repeat !== 'none',
                recurrence: task.repeat !== 'none' ? {
                  frequency: task.repeat as 'daily' | 'weekly' | 'weekdays' | 'weekends' | 'custom',
                  customDays: task.repeatConfig?.days,
                } : undefined,
                priority: task.priority,
                tags: task.tags,
                xpReward: task.xpReward || 10,
                linkedIdentityId: task.linkedHabitId ? state.identities.find(
                  i => i.linkedHabits.includes(task.linkedHabitId!)
                )?.id : undefined,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
              });
            });
          
          // Sort by: scheduled date, then by priority
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3, none: 4 };
          return unifiedTasks.sort((a, b) => {
            // Completed tasks go to bottom
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            // Then sort by date
            const dateA = a.scheduledDate ? new Date(a.scheduledDate).getTime() : Infinity;
            const dateB = b.scheduledDate ? new Date(b.scheduledDate).getTime() : Infinity;
            if (dateA !== dateB) return dateA - dateB;
            // Then sort by priority
            return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
          });
        } catch (error) {
          console.error('Error in getAllUnifiedTasks:', error);
          return [];
        }
      },
      
      completeUnifiedTask: (taskId) => {
        const { toggleHabitEntry, completeTask, toggleTask, goals } = get();
        const today = format(new Date(), 'yyyy-MM-dd');
        
        if (taskId.startsWith('habit-')) {
          const habitId = taskId.replace('habit-', '').replace(`-${today}`, '');
          toggleHabitEntry(habitId, today);
        } else if (taskId.startsWith('goal-')) {
          const realTaskId = taskId.replace('goal-', '');
          // Find the task in goals
          for (const goal of goals) {
            for (const milestone of goal.milestones) {
              for (const objective of milestone.weeklyObjectives) {
                const task = objective.dailyTasks.find((t) => t.id === realTaskId);
                if (task) {
                  completeTask(goal.id, milestone.id, objective.id, task.id);
                  return;
                }
              }
            }
          }
        } else if (taskId.startsWith('manual-')) {
          const realTaskId = taskId.replace('manual-', '');
          toggleTask(realTaskId);
        }
      },
      
      skipUnifiedTask: (taskId) => {
        const { updateTask } = get();
        
        if (taskId.startsWith('goal-')) {
          const realTaskId = taskId.replace('goal-', '');
          // Mark as skipped in goals
          set((state) => ({
            goals: state.goals.map((goal) => ({
              ...goal,
              milestones: goal.milestones.map((milestone) => ({
                ...milestone,
                weeklyObjectives: milestone.weeklyObjectives.map((objective) => ({
                  ...objective,
                  dailyTasks: objective.dailyTasks.map((task) =>
                    task.id === realTaskId ? { ...task, status: 'skipped' as const } : task
                  ),
                })),
              })),
            })),
          }));
        } else if (taskId.startsWith('manual-')) {
          const realTaskId = taskId.replace('manual-', '');
          updateTask(realTaskId, { status: 'cancelled' });
        }
      },
      
      // ─── Reward Tokens ────────────────────────────────────────────────────────
      rewardTokens: [],
      
      addRewardToken: (token) => {
        set((state) => ({
          rewardTokens: [...state.rewardTokens, token],
        }));
        get().addToast({
          type: 'achievement',
          title: `${token.name} Earned`,
          message: token.description,
        });
      },
      
      useRewardToken: (tokenId) => {
        set((state) => ({
          rewardTokens: state.rewardTokens.map((t) =>
            t.id === tokenId ? { ...t, isUsed: true, usedAt: new Date() } : t
          ),
        }));
        get().addToast({
          type: 'success',
          title: 'Reward Used',
          message: 'Enjoy your well-deserved reward!',
        });
      },
      
      // ─── MENTAL HEALTH & WELLNESS FEATURES ────────────────────────────────────
      
      // Mood Tracking
      moodEntries: [],
      
      addMoodEntry: (entry) => {
        const id = `mood-${Date.now()}`;
        set((state) => {
          // Check if there's already an entry for today and update it
          const existingIndex = state.moodEntries.findIndex(m => m.date === entry.date);
          if (existingIndex >= 0) {
            const updated = [...state.moodEntries];
            updated[existingIndex] = { ...entry, id: state.moodEntries[existingIndex].id };
            return { moodEntries: updated };
          }
          return { moodEntries: [{ ...entry, id }, ...state.moodEntries] };
        });
        
        // Add XP for mood logging
        get().addXP(5, 'Logged daily mood');
        
        // Check if this creates a mood tracking streak
        const moodEntries = get().moodEntries;
        if (moodEntries.length >= 7) {
          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
          });
          const streak = last7Days.every(date => moodEntries.some(m => m.date === date));
          if (streak) {
            get().addToast({
              type: 'achievement',
              title: '7-Day Mood Streak',
              message: 'You\'ve tracked your mood for a week straight!',
            });
            get().addXP(50, '7-day mood tracking streak');
          }
        }
      },
      
      getTodaysMood: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().moodEntries.find(m => m.date === today);
      },
      
      getMoodTrend: () => {
        const entries = get().moodEntries.slice(0, 7);
        if (entries.length < 2) return 'stable';
        
        const recentAvg = entries.slice(0, 3).reduce((sum, m) => sum + m.mood, 0) / Math.min(entries.length, 3);
        const olderAvg = entries.slice(3, 7).reduce((sum, m) => sum + m.mood, 0) / Math.min(entries.length - 3, 4);
        
        if (olderAvg === 0) return 'stable';
        
        const diff = recentAvg - olderAvg;
        if (diff > 0.3) return 'improving';
        if (diff < -0.3) return 'declining';
        return 'stable';
      },
      
      // Gratitude Journal
      gratitudeEntries: [],
      
      addGratitudeEntry: (entry) => {
        const id = `gratitude-${Date.now()}`;
        set((state) => {
          // Check if there's already an entry for today and update it
          const existingIndex = state.gratitudeEntries.findIndex(g => g.date === entry.date);
          if (existingIndex >= 0) {
            const updated = [...state.gratitudeEntries];
            updated[existingIndex] = { ...entry, id: state.gratitudeEntries[existingIndex].id };
            return { gratitudeEntries: updated };
          }
          return { gratitudeEntries: [{ ...entry, id }, ...state.gratitudeEntries] };
        });
        
        // Add XP for gratitude practice
        get().addXP(10, 'Gratitude practice');
        get().addToast({
          type: 'success',
          title: 'Gratitude Logged',
          message: 'Taking time to appreciate the good things matters!',
        });
      },
      
      // Gentle Mode Settings
      gentleModeSettings: DEFAULT_GENTLE_MODE,
      
      updateGentleModeSettings: (settings) => {
        set((state) => ({
          gentleModeSettings: { ...state.gentleModeSettings, ...settings },
        }));
      },
      
      // Wellness Stats
      wellnessStats: {
        totalBreathingSessions: 0,
        totalMindfulMinutes: 0,
        longestMoodStreak: 0,
        currentMoodStreak: 0,
      },
      
      updateWellnessStats: (type, minutes = 0) => {
        set((state) => ({
          wellnessStats: {
            ...state.wellnessStats,
            totalBreathingSessions: type === 'breathing' 
              ? state.wellnessStats.totalBreathingSessions + 1 
              : state.wellnessStats.totalBreathingSessions,
            totalMindfulMinutes: state.wellnessStats.totalMindfulMinutes + minutes,
          },
        }));
      },
      
      // Enhanced Streak Freeze System
      streakFreezeCount: 3, // Start with 3 free freezes
      
      useStreakFreezeEnhanced: () => {
        const { streakFreezeCount, gentleModeSettings } = get();
        
        if (streakFreezeCount > 0) {
          set((state) => ({ streakFreezeCount: state.streakFreezeCount - 1 }));
          get().addToast({
            type: 'info',
            title: 'Streak Freeze Used',
            message: gentleModeSettings.softerLanguage 
              ? 'Life happens! Your progress is protected.'
              : `${streakFreezeCount - 1} freezes remaining.`,
          });
          return true;
        }
        return false;
      },
      
      earnStreakFreeze: () => {
        set((state) => ({ 
          streakFreezeCount: Math.min(state.streakFreezeCount + 1, 5) // Max 5 freezes
        }));
        get().addToast({
          type: 'achievement',
          title: 'Streak Freeze Earned',
          message: 'Great consistency! You earned a streak freeze.',
        });
      },
      
      // ─── Analytics Helpers ────────────────────────────────────────────────────
      getDailyStats: (date) => {
        const { habits, habitEntries } = get();
        const activeHabits = habits.filter((h) => !h.archived);
        const dayEntries = habitEntries.filter((e) => e.date === date && e.completed);
        
        return {
          completed: dayEntries.length,
          total: activeHabits.length,
          percentage: activeHabits.length > 0 ? Math.round((dayEntries.length / activeHabits.length) * 100) : 0,
        };
      },
      
      getWeeklyStats: (weekNumber) => {
        const { calendar, habits, habitEntries } = get();
        const activeHabits = habits.filter((h) => !h.archived);
        
        // Calculate week date range
        const startDay = (weekNumber - 1) * 7 + 1 - calendar.firstDayOfWeek;
        const dates: string[] = [];
        
        for (let i = 0; i < 7; i++) {
          const day = startDay + i;
          if (day >= 1 && day <= calendar.daysInMonth) {
            dates.push(
              `${calendar.year}-${String(calendar.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            );
          }
        }
        
        const weekEntries = habitEntries.filter(
          (e) => dates.includes(e.date) && e.completed
        );
        
        const total = activeHabits.length * dates.length;
        
        return {
          completed: weekEntries.length,
          total,
          percentage: total > 0 ? Math.round((weekEntries.length / total) * 100) : 0,
        };
      },
      
      getMonthlyStats: () => {
        const { calendar, habits, habitEntries } = get();
        const activeHabits = habits.filter((h) => !h.archived);
        const monthStart = `${calendar.year}-${String(calendar.month).padStart(2, '0')}-01`;
        const monthEnd = `${calendar.year}-${String(calendar.month).padStart(2, '0')}-${calendar.daysInMonth}`;
        
        const monthEntries = habitEntries.filter(
          (e) => e.date >= monthStart && e.date <= monthEnd && e.completed
        );
        
        // Calculate per-habit stats
        const habitStats = activeHabits.map((habit) => {
          const habitMonthEntries = monthEntries.filter((e) => e.habitId === habit.id);
          const percentage = habit.monthlyGoal > 0 
            ? Math.round((habitMonthEntries.length / habit.monthlyGoal) * 100)
            : 0;
          
          return {
            id: habit.id,
            name: habit.name,
            icon: habit.icon,
            color: habit.color,
            completed: habitMonthEntries.length,
            goal: habit.monthlyGoal,
            percentage,
          };
        });
        
        const sortedByPerformance = [...habitStats].sort((a, b) => b.percentage - a.percentage);
        
        // Total possible = sum of all goals
        const totalGoals = activeHabits.reduce((sum, h) => sum + h.monthlyGoal, 0);
        
        return {
          completed: monthEntries.length,
          total: totalGoals,
          percentage: totalGoals > 0 ? Math.round((monthEntries.length / totalGoals) * 100) : 0,
          topHabits: sortedByPerformance.slice(0, 5),
          worstHabits: sortedByPerformance.slice(-3).reverse(),
        };
      },
    }),
    {
      name: 'resurgo-storage',
      partialize: (state) => ({
        user: state.user,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        calendar: state.calendar,
        goals: state.goals,
        habits: state.habits,
        habitEntries: state.habitEntries,
        coachMessages: state.coachMessages,
        identities: state.identities,
        habitStacks: state.habitStacks,
        timedTasks: state.timedTasks,
        pomodoroSessions: state.pomodoroSessions,
        focusStats: state.focusStats,
        tasks: state.tasks,
        taskLists: state.taskLists,
        rewardTokens: state.rewardTokens,
        // Mental Health & Wellness Data
        moodEntries: state.moodEntries,
        gratitudeEntries: state.gratitudeEntries,
        gentleModeSettings: state.gentleModeSettings,
        wellnessStats: state.wellnessStats,
        streakFreezeCount: state.streakFreezeCount,
      }),
      // Merge function to handle missing fields from old localStorage data
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<typeof currentState>;
        return {
          ...currentState,
          ...persisted,
          // Ensure new fields have defaults if missing from persisted state
          tasks: persisted?.tasks ?? [],
          taskLists: persisted?.taskLists ?? [
            { id: 'inbox', name: 'Inbox', icon: 'IN', sortOrder: 0, isDefault: true },
          ],
          rewardTokens: persisted?.rewardTokens ?? [],
          // Mental Health & Wellness defaults
          moodEntries: persisted?.moodEntries ?? [],
          gratitudeEntries: persisted?.gratitudeEntries ?? [],
          gentleModeSettings: persisted?.gentleModeSettings ?? DEFAULT_GENTLE_MODE,
          wellnessStats: persisted?.wellnessStats ?? {
            totalBreathingSessions: 0,
            totalMindfulMinutes: 0,
            longestMoodStreak: 0,
            currentMoodStreak: 0,
          },
          streakFreezeCount: persisted?.streakFreezeCount ?? 3,
        };
      },
    }
  )
);

// Backward compatibility alias — all existing components import useAscendStore
export const useAscendStore = useResurgoStore;
