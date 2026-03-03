// -------------------------------------------------------------------------------
// RESURGO - Weekly Review System
// Structured weekly check-in for reflection, planning, and goal adjustment
// -------------------------------------------------------------------------------

'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  Calendar,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Target,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Sparkles,
  BookOpen,
  Trophy,
  X,
  ArrowRight,
  BarChart3,
  Zap,
  Brain,
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

// ---------------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------------

interface WeeklyReviewProps {
  isOpen: boolean;
  onClose: () => void;
}

type ReviewStep = 'overview' | 'wins' | 'challenges' | 'habits' | 'goals' | 'plan' | 'summary';

interface WeeklyStats {
  totalTasksCompleted: number;
  totalTasksPlanned: number;
  habitsCompletionRate: number;
  bestStreak: number;
  bestHabit: string;
  worstHabit: string;
  focusMinutes: number;
  moodAverage: number;
  daysActive: number;
}

interface ReviewData {
  biggestWin: string;
  gratitude: string;
  biggestChallenge: string;
  lessonLearned: string;
  nextWeekFocus: string;
  nextWeekGoal: string;
  energyLevel: number;
  satisfactionLevel: number;
}

const REVIEW_STEPS: { id: ReviewStep; title: string; icon: React.ElementType }[] = [
  { id: 'overview', title: 'Week Overview', icon: BarChart3 },
  { id: 'wins', title: 'Celebrations', icon: Trophy },
  { id: 'challenges', title: 'Challenges', icon: Brain },
  { id: 'habits', title: 'Habit Review', icon: Flame },
  { id: 'goals', title: 'Goal Progress', icon: Target },
  { id: 'plan', title: 'Next Week', icon: Zap },
  { id: 'summary', title: 'Summary', icon: Star },
];

// ---------------------------------------------------------------------------------
// WEEKLY REVIEW COMPONENT
// ---------------------------------------------------------------------------------

export function WeeklyReview({ isOpen, onClose }: WeeklyReviewProps) {
  const {
    habits,
    habitEntries,
    goals,
    user: _user,
    getDailyStats,
    addToast,
    addXP,
  } = useAscendStore();

  const [currentStep, setCurrentStep] = useState<ReviewStep>('overview');
  const [reviewData, setReviewData] = useState<ReviewData>({
    biggestWin: '',
    gratitude: '',
    biggestChallenge: '',
    lessonLearned: '',
    nextWeekFocus: '',
    nextWeekGoal: '',
    energyLevel: 3,
    satisfactionLevel: 3,
  });

  // Calculate the past week date range
  const weekRange = useMemo(() => {
    const now = new Date();
    const start = subDays(startOfWeek(now, { weekStartsOn: 1 }), 7);
    const end = subDays(endOfWeek(now, { weekStartsOn: 1 }), 7);
    return { start, end };
  }, []);

  const weekDays = useMemo(() => {
    return eachDayOfInterval({ start: weekRange.start, end: weekRange.end });
  }, [weekRange]);

  // Calculate weekly stats
  const weeklyStats = useMemo((): WeeklyStats => {
    const activeHabits = habits.filter(h => h.isActive);
    let totalCompleted = 0;
    let totalPlanned = 0;
    let daysActive = 0;
    const habitCompletions: Record<string, number> = {};

    weekDays.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const stats = getDailyStats(dateStr);
      totalCompleted += stats.completed;
      totalPlanned += stats.total;
      if (stats.completed > 0) daysActive++;

      // Track per-habit completions
      const dayEntries = habitEntries.filter(e => e.date === dateStr && e.completed);
      dayEntries.forEach(entry => {
        habitCompletions[entry.habitId] = (habitCompletions[entry.habitId] || 0) + 1;
      });
    });

    // Find best and worst habits
    let bestHabitId = '';
    let worstHabitId = '';
    let maxCompletions = -1;
    let minCompletions = Infinity;

    activeHabits.forEach(h => {
      const completions = habitCompletions[h.id] || 0;
      if (completions > maxCompletions) {
        maxCompletions = completions;
        bestHabitId = h.id;
      }
      if (completions < minCompletions) {
        minCompletions = completions;
        worstHabitId = h.id;
      }
    });

    const bestHabit = habits.find(h => h.id === bestHabitId)?.name || 'None';
    const worstHabit = habits.find(h => h.id === worstHabitId)?.name || 'None';

    // Best streak
    const bestStreak = Math.max(
      ...activeHabits.map(h => h.currentStreak || 0),
      0
    );

    const completionRate = totalPlanned > 0
      ? Math.round((totalCompleted / totalPlanned) * 100)
      : 0;

    return {
      totalTasksCompleted: totalCompleted,
      totalTasksPlanned: totalPlanned,
      habitsCompletionRate: completionRate,
      bestStreak,
      bestHabit,
      worstHabit,
      focusMinutes: 0,
      moodAverage: 0,
      daysActive,
    };
  }, [weekDays, habits, habitEntries, getDailyStats]);

  // Per-habit weekly breakdown
  const habitBreakdown = useMemo(() => {
    const activeHabits = habits.filter(h => h.isActive);
    return activeHabits.map(habit => {
      const completions = weekDays.filter(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        return habitEntries.some(e => e.habitId === habit.id && e.date === dateStr && e.completed);
      }).length;

      return {
        id: habit.id,
        name: habit.name,
        completions,
        total: 7,
        rate: Math.round((completions / 7) * 100),
        streak: habit.currentStreak || 0,
        trend: completions >= 5 ? 'up' : completions >= 3 ? 'stable' : 'down',
      };
    }).sort((a, b) => b.rate - a.rate);
  }, [habits, habitEntries, weekDays]);

  const currentStepIndex = REVIEW_STEPS.findIndex(s => s.id === currentStep);

  const goNext = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < REVIEW_STEPS.length) {
      setCurrentStep(REVIEW_STEPS[nextIndex].id);
    }
  }, [currentStepIndex]);

  const goBack = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(REVIEW_STEPS[prevIndex].id);
    }
  }, [currentStepIndex]);

  const handleComplete = useCallback(() => {
    addXP(75, 'Weekly review completed');
    addToast({ type: 'success', title: 'Weekly Review Complete!', message: 'Great reflection! +75 XP earned' });
    onClose();
    setCurrentStep('overview');
  }, [addXP, addToast, onClose]);

  if (!isOpen) return null;

  // -------------------------------------------------------------------------
  // STEP RENDERERS
  // -------------------------------------------------------------------------

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-themed">
          Week of {format(weekRange.start, 'MMM d')} - {format(weekRange.end, 'MMM d')}
        </h3>
        <p className="text-sm text-themed-muted mt-1">
          Let&apos;s reflect on your progress this week
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={CheckCircle2}
          label="Tasks Done"
          value={weeklyStats.totalTasksCompleted.toString()}
          subtitle={`of ${weeklyStats.totalTasksPlanned} planned`}
          color="text-green-400"
        />
        <StatCard
          icon={Flame}
          label="Completion Rate"
          value={`${weeklyStats.habitsCompletionRate}%`}
          subtitle="habit consistency"
          color="text-orange-400"
        />
        <StatCard
          icon={Calendar}
          label="Days Active"
          value={`${weeklyStats.daysActive}/7`}
          subtitle="days you showed up"
          color="text-blue-400"
        />
        <StatCard
          icon={Trophy}
          label="Best Streak"
          value={weeklyStats.bestStreak.toString()}
          subtitle="days consecutive"
          color="text-amber-400"
        />
      </div>

      {/* Weekly Heatmap */}
      <div className="glass-card p-4 rounded-xl">
        <h4 className="text-sm font-semibold text-themed mb-3">Daily Activity</h4>
        <div className="flex gap-2 justify-between">
          {weekDays.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const stats = getDailyStats(dateStr);
            const rate = stats.total > 0 ? stats.completed / stats.total : 0;
            return (
              <div key={dateStr} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-colors",
                    rate >= 0.8 ? "bg-green-500/30 text-green-300" :
                    rate >= 0.5 ? "bg-amber-500/30 text-amber-300" :
                    rate > 0 ? "bg-red-500/20 text-red-300" :
                    "bg-white/5 text-themed-muted"
                  )}
                >
                  {stats.completed}
                </div>
                <span className="text-xs text-themed-muted">
                  {format(day, 'EEE')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderWins = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-2" />
        <h3 className="text-xl font-bold text-themed">Celebrate Your Wins</h3>
        <p className="text-sm text-themed-muted mt-1">
          Acknowledging progress builds momentum
        </p>
      </div>

      {/* Auto-detected wins */}
      <div className="space-y-2">
        {weeklyStats.habitsCompletionRate >= 80 && (
          <WinCard text="Completed 80%+ of your habits this week!" />
        )}
        {weeklyStats.daysActive >= 6 && (
          <WinCard text="Active 6+ days this week. Incredible consistency!" />
        )}
        {weeklyStats.bestStreak >= 7 && (
          <WinCard text={`Maintained a ${weeklyStats.bestStreak}-day streak!`} />
        )}
        {weeklyStats.totalTasksCompleted >= 20 && (
          <WinCard text={`Completed ${weeklyStats.totalTasksCompleted} tasks. Productive week!`} />
        )}
        {habitBreakdown.some(h => h.rate === 100) && (
          <WinCard text={`Perfect week on: ${habitBreakdown.filter(h => h.rate === 100).map(h => h.name).join(', ')}`} />
        )}
      </div>

      {/* User reflection */}
      <div className="space-y-4">
        <div>
          <label htmlFor="biggest-win" className="block text-sm font-medium text-themed mb-2">
            What was your biggest win this week?
          </label>
          <textarea
            id="biggest-win"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-themed placeholder:text-themed-muted text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ascend-500/50"
            rows={3}
            placeholder="I finally managed to..."
            value={reviewData.biggestWin}
            onChange={(e) => setReviewData(prev => ({ ...prev, biggestWin: e.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="gratitude" className="block text-sm font-medium text-themed mb-2">
            What are you grateful for?
          </label>
          <textarea
            id="gratitude"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-themed placeholder:text-themed-muted text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ascend-500/50"
            rows={2}
            placeholder="I'm grateful for..."
            value={reviewData.gratitude}
            onChange={(e) => setReviewData(prev => ({ ...prev, gratitude: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Brain className="w-10 h-10 text-purple-400 mx-auto mb-2" />
        <h3 className="text-xl font-bold text-themed">Reflect on Challenges</h3>
        <p className="text-sm text-themed-muted mt-1">
          Understanding obstacles helps overcome them
        </p>
      </div>

      {/* Auto-detected challenges */}
      <div className="space-y-2">
        {weeklyStats.habitsCompletionRate < 50 && (
          <ChallengeCard text="Completion rate was below 50% this week" suggestion="Try reducing the number of habits to focus on fewer things" />
        )}
        {habitBreakdown.some(h => h.rate <= 15) && (
          <ChallengeCard
            text={`Struggled with: ${habitBreakdown.filter(h => h.rate <= 15).map(h => h.name).join(', ')}`}
            suggestion="Consider adjusting the difficulty or timing of these habits"
          />
        )}
        {weeklyStats.daysActive < 4 && (
          <ChallengeCard text={`Only active ${weeklyStats.daysActive} days this week`} suggestion="Start with just showing up, even for 2 minutes" />
        )}
      </div>

      {/* User reflection */}
      <div className="space-y-4">
        <div>
          <label htmlFor="biggest-challenge" className="block text-sm font-medium text-themed mb-2">
            What was your biggest challenge?
          </label>
          <textarea
            id="biggest-challenge"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-themed placeholder:text-themed-muted text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ascend-500/50"
            rows={3}
            placeholder="The hardest part was..."
            value={reviewData.biggestChallenge}
            onChange={(e) => setReviewData(prev => ({ ...prev, biggestChallenge: e.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="lesson-learned" className="block text-sm font-medium text-themed mb-2">
            What lesson did you learn?
          </label>
          <textarea
            id="lesson-learned"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-themed placeholder:text-themed-muted text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ascend-500/50"
            rows={2}
            placeholder="I learned that..."
            value={reviewData.lessonLearned}
            onChange={(e) => setReviewData(prev => ({ ...prev, lessonLearned: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );

  const renderHabits = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Flame className="w-10 h-10 text-orange-400 mx-auto mb-2" />
        <h3 className="text-xl font-bold text-themed">Habit Performance</h3>
        <p className="text-sm text-themed-muted mt-1">
          How each habit performed this week
        </p>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
        {habitBreakdown.map(habit => (
          <div key={habit.id} className="glass-card p-3 rounded-xl flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
              habit.rate >= 80 ? "bg-green-500/20" :
              habit.rate >= 50 ? "bg-amber-500/20" :
              "bg-red-500/20"
            )}>
              {habit.trend === 'up' ? (
                <TrendingUp className={cn("w-5 h-5", habit.rate >= 80 ? "text-green-400" : "text-amber-400")} />
              ) : habit.trend === 'stable' ? (
                <Minus className="w-5 h-5 text-amber-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium text-themed truncate">{habit.name}</p>
              <p className="text-xs text-themed-muted">
                {habit.completions}/{habit.total} days | Streak: {habit.streak}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className={cn(
                "text-sm font-bold",
                habit.rate >= 80 ? "text-green-400" :
                habit.rate >= 50 ? "text-amber-400" :
                "text-red-400"
              )}>
                {habit.rate}%
              </div>
            </div>
          </div>
        ))}
        {habitBreakdown.length === 0 && (
          <div className="text-center py-8 text-themed-muted text-sm">
            No active habits to review
          </div>
        )}
      </div>
    </div>
  );

  const renderGoals = () => {
    const activeGoals = goals.filter(g => g.status === 'in_progress' || g.status === 'not_started');
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Target className="w-10 h-10 text-ascend-400 mx-auto mb-2" />
          <h3 className="text-xl font-bold text-themed">Goal Progress</h3>
          <p className="text-sm text-themed-muted mt-1">
            How your goals are tracking
          </p>
        </div>

        <div className="space-y-3">
          {activeGoals.map(goal => {
            const progress = goal.progress || 0;
            return (
              <div key={goal.id} className="glass-card p-4 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-themed">{goal.title}</h4>
                    <p className="text-xs text-themed-muted mt-0.5">{goal.category}</p>
                  </div>
                  <span className={cn(
                    "text-sm font-bold",
                    progress >= 75 ? "text-green-400" :
                    progress >= 40 ? "text-amber-400" :
                    "text-themed-muted"
                  )}>
                    {progress}%
                  </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      progress >= 75 ? "bg-green-500" :
                      progress >= 40 ? "bg-amber-500" :
                      "bg-ascend-500"
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {goal.milestones && goal.milestones.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {goal.milestones.map((m, i) => (
                      <span
                        key={i}
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          m.status === 'completed' ? "bg-green-500/20 text-green-300" :
                          m.status === 'in_progress' ? "bg-amber-500/20 text-amber-300" :
                          "bg-white/5 text-themed-muted"
                        )}
                      >
                        {m.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {activeGoals.length === 0 && (
            <div className="text-center py-8 text-themed-muted text-sm">
              No active goals. Set a goal to start tracking progress!
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPlan = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Zap className="w-10 h-10 text-amber-400 mx-auto mb-2" />
        <h3 className="text-xl font-bold text-themed">Plan Next Week</h3>
        <p className="text-sm text-themed-muted mt-1">
          Set your intention for the week ahead
        </p>
      </div>

      {/* Energy & Satisfaction scales */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-themed mb-2">
            Energy Level
          </label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                onClick={() => setReviewData(prev => ({ ...prev, energyLevel: level }))}
                className={cn(
                  "w-9 h-9 rounded-lg text-sm font-bold transition-all",
                  reviewData.energyLevel >= level
                    ? "bg-ascend-500 text-white"
                    : "bg-white/5 text-themed-muted hover:bg-white/10"
                )}
                aria-label={`Energy level ${level} of 5`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-themed mb-2">
            Satisfaction
          </label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                onClick={() => setReviewData(prev => ({ ...prev, satisfactionLevel: level }))}
                className={cn(
                  "w-9 h-9 rounded-lg text-sm font-bold transition-all",
                  reviewData.satisfactionLevel >= level
                    ? "bg-amber-500 text-white"
                    : "bg-white/5 text-themed-muted hover:bg-white/10"
                )}
                aria-label={`Satisfaction level ${level} of 5`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Planning prompts */}
      <div className="space-y-4">
        <div>
          <label htmlFor="next-week-focus" className="block text-sm font-medium text-themed mb-2">
            What will you focus on next week?
          </label>
          <textarea
            id="next-week-focus"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-themed placeholder:text-themed-muted text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ascend-500/50"
            rows={2}
            placeholder="My main focus will be..."
            value={reviewData.nextWeekFocus}
            onChange={(e) => setReviewData(prev => ({ ...prev, nextWeekFocus: e.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="next-week-goal" className="block text-sm font-medium text-themed mb-2">
            One goal for next week
          </label>
          <textarea
            id="next-week-goal"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-themed placeholder:text-themed-muted text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ascend-500/50"
            rows={2}
            placeholder="By the end of next week, I want to..."
            value={reviewData.nextWeekGoal}
            onChange={(e) => setReviewData(prev => ({ ...prev, nextWeekGoal: e.target.value }))}
          />
        </div>
      </div>

      {/* AI suggestions based on data */}
      <div className="glass-card p-4 rounded-xl border border-ascend-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-ascend-400" />
          <span className="text-sm font-semibold text-ascend-400">AI Suggestions</span>
        </div>
        <ul className="space-y-2 text-sm text-themed-muted">
          {weeklyStats.habitsCompletionRate < 60 && (
            <li className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 mt-1 text-ascend-400 flex-shrink-0" />
              Try reducing your active habits to 3-4 key ones to build consistency
            </li>
          )}
          {habitBreakdown.some(h => h.rate <= 15) && (
            <li className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 mt-1 text-ascend-400 flex-shrink-0" />
              Consider replacing or modifying habits with very low completion rates
            </li>
          )}
          {weeklyStats.bestStreak >= 7 && (
            <li className="flex items-start gap-2">
              <ArrowRight className="w-3 h-3 mt-1 text-ascend-400 flex-shrink-0" />
              Great streak! Consider increasing the difficulty slightly for more growth
            </li>
          )}
          <li className="flex items-start gap-2">
            <ArrowRight className="w-3 h-3 mt-1 text-ascend-400 flex-shrink-0" />
            {weeklyStats.habitsCompletionRate >= 80
              ? "You&apos;re crushing it! Keep this momentum going next week."
              : "Focus on consistency over intensity. Show up every day, even for 2 minutes."}
          </li>
        </ul>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ascend-500 to-amber-500 flex items-center justify-center mx-auto mb-3">
          <Star className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-themed">Review Complete!</h3>
        <p className="text-sm text-themed-muted mt-1">
          Here&apos;s your weekly snapshot
        </p>
      </div>

      {/* Summary card */}
      <div className="glass-card p-5 rounded-xl space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-ascend-400">{weeklyStats.habitsCompletionRate}%</p>
            <p className="text-xs text-themed-muted">Completion</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-400">{weeklyStats.daysActive}/7</p>
            <p className="text-xs text-themed-muted">Active Days</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">{weeklyStats.totalTasksCompleted}</p>
            <p className="text-xs text-themed-muted">Tasks Done</p>
          </div>
        </div>

        {reviewData.biggestWin && (
          <div className="pt-3 border-t border-white/5">
            <p className="text-xs font-medium text-amber-400 mb-1">Biggest Win</p>
            <p className="text-sm text-themed">{reviewData.biggestWin}</p>
          </div>
        )}
        {reviewData.nextWeekFocus && (
          <div className="pt-3 border-t border-white/5">
            <p className="text-xs font-medium text-ascend-400 mb-1">Next Week Focus</p>
            <p className="text-sm text-themed">{reviewData.nextWeekFocus}</p>
          </div>
        )}
      </div>

      {/* Reward */}
      <div className="text-center py-2">
        <p className="text-sm text-themed-muted">
          You earned <span className="text-amber-400 font-bold">+75 XP</span> for completing your weekly review!
        </p>
      </div>
    </div>
  );

  // Step content renderer
  const renderStep = () => {
    switch (currentStep) {
      case 'overview': return renderOverview();
      case 'wins': return renderWins();
      case 'challenges': return renderChallenges();
      case 'habits': return renderHabits();
      case 'goals': return renderGoals();
      case 'plan': return renderPlan();
      case 'summary': return renderSummary();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Weekly Review"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] bg-[#1a1a1f] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-ascend-400" />
            <span className="font-semibold text-themed">Weekly Review</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="Close weekly review"
          >
            <X className="w-4 h-4 text-themed-muted" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 py-3 px-4">
          {REVIEW_STEPS.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentStepIndex
                  ? "w-6 bg-ascend-500"
                  : index < currentStepIndex
                  ? "bg-ascend-500/40"
                  : "bg-white/10"
              )}
              aria-label={`Go to ${step.title}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-5 scrollbar-thin">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/5">
          <button
            onClick={goBack}
            disabled={currentStepIndex === 0}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              currentStepIndex === 0
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-white/10 text-themed-muted"
            )}
            aria-label="Go to previous step"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep === 'summary' ? (
            <button
              onClick={handleComplete}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-ascend-500 to-amber-500 text-white hover:opacity-90 transition-all"
              aria-label="Complete weekly review"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Review
            </button>
          ) : (
            <button
              onClick={goNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-ascend-500 text-white hover:bg-ascend-600 transition-all"
              aria-label="Go to next step"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------------
// SUB-COMPONENTS
// ---------------------------------------------------------------------------------

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div className="glass-card p-3 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("w-4 h-4", color)} />
        <span className="text-xs text-themed-muted">{label}</span>
      </div>
      <p className="text-xl font-bold text-themed">{value}</p>
      <p className="text-xs text-themed-muted mt-0.5">{subtitle}</p>
    </div>
  );
}

function WinCard({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
      <p className="text-sm text-green-300">{text}</p>
    </div>
  );
}

function ChallengeCard({ text, suggestion }: { text: string; suggestion: string }) {
  return (
    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1.5">
      <p className="text-sm text-amber-300">{text}</p>
      <p className="text-xs text-amber-400/70 flex items-start gap-1.5">
        <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
        {suggestion}
      </p>
    </div>
  );
}

export default WeeklyReview;
