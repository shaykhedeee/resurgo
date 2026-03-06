'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Dashboard Command Center (Today View)
// Full-featured: check-ins, AI briefing, habits, tasks, goals, XP, streaks
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { useStoreUser } from '@/hooks/useStoreUser';
import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { MorningCheckIn } from '@/components/MorningCheckIn';
import { EveningDebrief } from '@/components/EveningDebrief';
import AdaptiveDifficultyWidget from '@/components/AdaptiveDifficultyWidget';
import WeatherWidget from '@/components/WeatherWidget';
import DailyQuote from '@/components/DailyQuote';
import FocusTimerWidget from '@/components/widgets/FocusTimerWidget';
import HabitStreakWidget from '@/components/widgets/HabitStreakWidget';
import QuickJournalWidget from '@/components/widgets/QuickJournalWidget';
import GoalProgressWidget from '@/components/widgets/GoalProgressWidget';
import AICoachWidget from '@/components/widgets/AICoachWidget';
import CalorieTrackerWidget from '@/components/widgets/CalorieTrackerWidget';
import DigitalClockWidget from '@/components/widgets/DigitalClockWidget';
import QuickTaskWidget from '@/components/widgets/QuickTaskWidget';
import QuickNoteWidget from '@/components/widgets/QuickNoteWidget';
import SleepWidget from '@/components/widgets/SleepWidget';
import QuickActionsWidget from '@/components/widgets/QuickActionsWidget';
import VisionBoardWidget from '@/components/widgets/VisionBoardWidget';
import MobileDashboard from '@/components/MobileDashboard';
import {
  Target,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  Zap,
  Brain,
  Sun,
  Moon,
  Flame,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Droplets,
  Trophy,
  Star,
  TrendingUp,
  Award,
} from 'lucide-react';

type HabitView = {
  _id: string;
  title: string;
  category: string;
  streakCurrent: number;
};

type TaskView = {
  _id: string;
  title: string;
  priority: string;
  dueDate?: string;
  xpValue?: number;
};

type GoalView = {
  _id: string;
  title: string;
  progress?: number;
  category: string;
  targetDate?: string;
};

export default function DashboardPage() {
  const { user } = useStoreUser();
  const habits = useQuery(api.habits.listActive);
  const goals = useQuery(api.goals.listActive);
  const tasks = useQuery(api.tasks.list, { status: 'todo' });
  const todayCheckIn = useQuery(api.dailyCheckIns.getToday);
  const recentCheckIns = useQuery(api.dailyCheckIns.getRecent, { days: 7 });
  const gamificationProfile = useQuery(api.gamification.getProfile);
  const xpHistory = useQuery(api.gamification.getXPHistory, { limit: 10 });
  const todayNutrition = useQuery(api.nutrition.getNutritionLog, { date: new Date().toISOString().split('T')[0] });
  const toggleHabit = useMutation(api.habits.toggleComplete);
  const toggleTask = useMutation(api.tasks.toggleComplete);
  const updateWater = useMutation(api.nutrition.updateWaterAndSteps);

  const [togglingHabit, setTogglingHabit] = useState<string | null>(null);
  const [togglingTask, setTogglingTask] = useState<string | null>(null);
  const [showMorningCheckIn, setShowMorningCheckIn] = useState(false);
  const [showEveningDebrief, setShowEveningDebrief] = useState(false);
  const [checkInJustCompleted, setCheckInJustCompleted] = useState(false);
  const [debriefJustCompleted, setDebriefJustCompleted] = useState(false);
  const [waterLoading, setWaterLoading] = useState(false);

  // Water tracking
  const currentWater = (todayNutrition as any)?.waterMl ?? 0;
  const waterGoal = 2500; // ml
  const waterPercent = Math.min(100, Math.round((currentWater / waterGoal) * 100));

  const handleAddWater = useCallback(async (ml: number) => {
    setWaterLoading(true);
    try {
      await updateWater({
        date: new Date().toISOString().split('T')[0],
        waterMl: currentWater + ml,
      });
    } catch (e) {
      console.error('Failed to log water:', e);
    }
    setWaterLoading(false);
  }, [updateWater, currentWater]);

  // Determine time of day
  const now = useMemo(() => new Date(), []);
  const hour = now.getHours();
  const isEvening = hour >= 18;
  const isMorning = hour < 12;

  // Check-in status
  const morningDone = !!todayCheckIn?.morningCompletedAt || checkInJustCompleted;
  const eveningDone = !!todayCheckIn?.eveningCompletedAt || debriefJustCompleted;

  // Streak calculation from recent check-ins  
  const checkInStreak = useMemo(() => {
    if (!recentCheckIns || recentCheckIns.length === 0) return 0;
    let streak = 0;
    const sorted = [...recentCheckIns].sort((a: any, b: any) => b.date.localeCompare(a.date));
    const todayStr = new Date().toISOString().split('T')[0];
    for (const ci of sorted) {
      const ciAny = ci as any;
      const d = ciAny.date;
      const expected = new Date();
      expected.setDate(expected.getDate() - streak);
      const expectedStr = expected.toISOString().split('T')[0];
      if (d === expectedStr || (streak === 0 && d === todayStr)) {
        if (ciAny.morningCompletedAt || ciAny.eveningCompletedAt) streak++;
        else break;
      } else {
        break;
      }
    }
    return streak;
  }, [recentCheckIns]);

  if (!user) return null;

  const today = new Date();

  const totalHabits = habits?.length ?? 0;
  const activeHabits: HabitView[] = (habits ?? []) as HabitView[];
  const openTasks: TaskView[] = (tasks ?? []) as TaskView[];
  const activeGoals: GoalView[] = (goals ?? []) as GoalView[];
  const avgGoalProgress =
    activeGoals.length > 0
      ? Math.round(activeGoals.reduce((sum, goal) => sum + (goal.progress ?? 0), 0) / activeGoals.length)
      : 0;

  // Best streak from habits
  const bestStreak = activeHabits.reduce((max, h) => Math.max(max, h.streakCurrent ?? 0), 0);

  // Emotional state derived from today's check-in (mirrors convex/coachAI.ts deriveEmotionalState)
  const _mood = todayCheckIn?.morningMood;
  const _energy = todayCheckIn?.morningEnergy;
  const _sleep = (todayCheckIn as any)?.sleepQuality;
  const dashboardEmotionalState: string =
    (_energy !== undefined && _mood !== undefined && _energy >= 4 && _mood >= 4)
      ? 'energized and focused'
      : ((_energy !== undefined && _energy <= 2) || (_sleep !== undefined && _sleep <= 2))
      ? 'depleted — protect capacity'
      : (_mood !== undefined && _mood <= 2)
      ? 'anxious — needs grounding'
      : (_mood === undefined && _energy === undefined)
      ? 'no check-in yet'
      : 'steady — moderate capacity';

  // Time-appropriate greeting
  const greeting = isMorning
    ? `Good morning, ${user.name?.split(' ')[0] ?? 'there'}`
    : isEvening
      ? `Good evening, ${user.name?.split(' ')[0] ?? 'there'}`
      : `Hey, ${user.name?.split(' ')[0] ?? 'there'}`;

  const handleToggleHabit = async (habitId: string) => {
    setTogglingHabit(habitId);
    try {
      await toggleHabit({ habitId: habitId as Id<"habits">, date: today.toISOString().split('T')[0] });
    } catch (e) {
      console.error('Failed to toggle habit:', e);
    }
    setTogglingHabit(null);
  };

  const handleToggleTask = async (taskId: string) => {
    setTogglingTask(taskId);
    try {
      await toggleTask({ taskId: taskId as Id<"tasks"> });
    } catch (e) {
      console.error('Failed to toggle task:', e);
    }
    setTogglingTask(null);
  };

  return (
    <>
      {/* ── Mobile: full native-like tabbed dashboard ── */}
      <div className="block md:hidden">
        <MobileDashboard />
      </div>

      {/* ── Desktop: original full dashboard ── */}
      <div className="hidden md:block">
      <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-4 md:px-6 md:py-6">

      {/* -- HEADER -- */}
      <div className="mb-6 border border-zinc-900 bg-zinc-950 shadow-[0_0_0_1px_rgba(39,39,42,0.25)]">
        <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-orange-600" />
          <span className="font-pixel text-[0.6rem] tracking-widest text-orange-500">COMMAND_CENTER</span>
          <span className="ml-auto font-terminal text-xs tracking-widest text-zinc-400">
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-terminal text-3xl font-bold tracking-tight text-zinc-100 md:text-4xl">
              {greeting}
            </h1>
            <div className="mt-2 flex items-center gap-3">
              <p className="font-terminal text-sm text-zinc-300">
                {totalHabits > 0 ? `${totalHabits} habits • ${openTasks.length} tasks • ${activeGoals.length} goals` : "Let's set up your system."}
              </p>
              {checkInStreak > 0 && (
                <span className="flex items-center gap-1 border border-amber-900 bg-amber-950/30 px-2 py-0.5">
                  <Flame className="h-3 w-3 text-amber-500" />
                  <span className="font-pixel text-[0.35rem] tracking-widest text-amber-400">{checkInStreak}D STREAK</span>
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/coach" className="flex items-center gap-1.5 border border-orange-800 bg-orange-950/30 px-4 py-2 font-terminal text-xs text-orange-400 transition hover:bg-orange-950/50">
              <MessageSquare className="h-3 w-3" /> AI Coach
            </Link>
            {[['Goals', '/goals'], ['Habits', '/habits'], ['Tasks', '/tasks']].map(([label, href]) => (
              <Link key={label} href={href} className="border border-zinc-800 bg-zinc-900 px-4 py-2 font-terminal text-xs text-zinc-200 transition hover:border-orange-700 hover:text-orange-400">
                {label}
              </Link>
            ))}
          </div>
        </div>

        {!user.onboardingComplete && (
          <div className="mx-5 mb-4 flex items-center gap-2 border border-orange-900 bg-orange-950/30 px-3 py-2">
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            <span className="font-terminal text-sm text-orange-400">
              Setup incomplete —{' '}
              <a href="/deep-scan" className="underline hover:text-orange-300">Complete Deep Scan</a>
              {' or '}
              <a href="/onboarding" className="underline hover:text-orange-300">Onboarding</a>
            </span>
          </div>
        )}
      </div>

      {/* -- DAILY CHECK-IN PROMPT -- */}
      {isMorning && !morningDone && !showMorningCheckIn && (
        <button
          onClick={() => setShowMorningCheckIn(true)}
          className="mb-6 flex w-full items-center gap-3 border border-amber-900/60 bg-amber-950/20 px-5 py-4 text-left transition hover:border-amber-700 hover:bg-amber-950/30"
        >
          <Sun className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="font-terminal text-sm font-bold text-amber-400">Start your morning check-in</p>
            <p className="font-terminal text-xs text-zinc-500">Log mood, energy, and get your AI-powered morning briefing</p>
          </div>
          <span className="font-pixel text-[0.35rem] tracking-widest text-amber-500">START &gt;</span>
        </button>
      )}

      {showMorningCheckIn && !morningDone && (
        <div className="mb-6">
          <MorningCheckIn
            userName={user.name?.split(' ')[0]}
            onComplete={() => {
              setCheckInJustCompleted(true);
              setShowMorningCheckIn(false);
            }}
          />
        </div>
      )}

      {isEvening && !eveningDone && !showEveningDebrief && (
        <button
          onClick={() => setShowEveningDebrief(true)}
          className="mb-6 flex w-full items-center gap-3 border border-violet-900/60 bg-violet-950/20 px-5 py-4 text-left transition hover:border-violet-700 hover:bg-violet-950/30"
        >
          <Moon className="h-5 w-5 text-violet-500 shrink-0" />
          <div className="flex-1">
            <p className="font-terminal text-sm font-bold text-violet-400">Time for your evening debrief</p>
            <p className="font-terminal text-xs text-zinc-500">Reflect on wins, log gratitude, and plan tomorrow</p>
          </div>
          <span className="font-pixel text-[0.35rem] tracking-widest text-violet-500">START &gt;</span>
        </button>
      )}

      {showEveningDebrief && !eveningDone && (
        <div className="mb-6">
          <EveningDebrief
            userName={user.name?.split(' ')[0]}
            tasksCompleted={(todayCheckIn as any)?.tasksCompleted}
            habitsCompleted={(todayCheckIn as any)?.habitsCompleted}
            onComplete={() => {
              setDebriefJustCompleted(true);
              setShowEveningDebrief(false);
            }}
          />
        </div>
      )}

      {/* -- STATS -- */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-6 lg:gap-4">
        <TermStatCard label="Habits" value={totalHabits} />
        <TermStatCard label="Goals" value={activeGoals.length} />
        <TermStatCard label="Tasks" value={openTasks.length} />
        <TermStatCard label="Progress" value={`${avgGoalProgress}%`} />
        <TermStatCard label="Best Streak" value={bestStreak > 0 ? `${bestStreak}d` : '—'} icon={<Flame className="h-3 w-3 text-amber-500" />} />
        <TermStatCard label="Level" value={gamificationProfile ? `${gamificationProfile.level}` : '1'} icon={<Star className="h-3 w-3 text-yellow-500" />} highlight />
      </div>

      {/* -- XP / LEVEL / WATER ROW -- */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {/* XP & Level Widget */}
        <div className="border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
            <Trophy className="h-3.5 w-3.5 text-yellow-500" />
            <span className="font-pixel text-[0.6rem] tracking-widest text-yellow-500">XP_STATUS</span>
            <span className="ml-auto font-terminal text-xs text-zinc-400">
              {gamificationProfile?.coins ?? 0} <span className="text-yellow-600">coins</span>
            </span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-terminal text-3xl font-bold text-zinc-100">{gamificationProfile?.totalXP ?? 0}</p>
                <p className="font-terminal text-xs text-zinc-500">total XP earned</p>
              </div>
              <div className="text-right">
                <p className="font-pixel text-[0.55rem] tracking-widest text-orange-400">
                  LVL {gamificationProfile?.level ?? 1}
                </p>
                <p className="font-terminal text-sm text-zinc-300">{gamificationProfile?.levelName ?? 'Seedling'}</p>
              </div>
            </div>
            {/* XP Progress Bar */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-terminal text-xs text-zinc-500">Progress to next level</span>
                <span className="font-terminal text-xs text-orange-400">{gamificationProfile?.xpProgress ?? 0}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-orange-700 to-orange-500 transition-all duration-700"
                  style={{ width: `${gamificationProfile?.xpProgress ?? 0}%` }}
                />
              </div>
              <p className="mt-1 font-terminal text-xs text-zinc-600">
                Next: Lvl {(gamificationProfile?.level ?? 1) + 1} at {gamificationProfile?.xpToNextLevel ?? 100} XP
              </p>
            </div>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-900">
              <div className="text-center">
                <p className="font-terminal text-lg font-bold text-zinc-100">{gamificationProfile?.totalTasksCompleted ?? 0}</p>
                <p className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">TASKS</p>
              </div>
              <div className="text-center">
                <p className="font-terminal text-lg font-bold text-zinc-100">{gamificationProfile?.totalHabitsCompleted ?? 0}</p>
                <p className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">HABITS</p>
              </div>
              <div className="text-center">
                <p className="font-terminal text-lg font-bold text-zinc-100">{gamificationProfile?.totalFocusMinutes ?? 0}m</p>
                <p className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">FOCUS</p>
              </div>
            </div>
            {/* Achievements preview */}
            {(gamificationProfile?.achievements?.length ?? 0) > 0 && (
              <div className="flex items-center gap-1 pt-2 border-t border-zinc-900">
                <Award className="h-3 w-3 text-zinc-500" />
                <span className="font-terminal text-xs text-zinc-400">
                  {gamificationProfile!.achievements.length} achievement{gamificationProfile!.achievements.length !== 1 ? 's' : ''} unlocked
                </span>
                <div className="ml-auto flex -space-x-1">
                  {gamificationProfile!.achievements.slice(0, 5).map((a) => (
                    <span key={a.id} title={a.name} className="text-sm">{a.icon}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Water Tracking Widget */}
        <div className="border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
            <Droplets className="h-3.5 w-3.5 text-cyan-500" />
            <span className="font-pixel text-[0.6rem] tracking-widest text-cyan-500">HYDRATION</span>
            <span className="ml-auto font-terminal text-xs text-zinc-400">{currentWater}ml / {waterGoal}ml</span>
          </div>
          <div className="p-4 space-y-3">
            {/* Water visual */}
            <div className="flex items-end justify-between">
              <div className="relative h-24 w-14 border border-cyan-900/50 bg-zinc-900 overflow-hidden">
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-700 to-cyan-500/60 transition-all duration-700"
                  style={{ height: `${waterPercent}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-pixel text-[0.55rem] tracking-widest text-white drop-shadow-md">{waterPercent}%</span>
                </div>
              </div>
              <div className="flex-1 ml-4 space-y-2">
                <p className="font-terminal text-2xl font-bold text-zinc-100">{currentWater}<span className="text-sm text-zinc-500">ml</span></p>
                <p className="font-terminal text-xs text-zinc-500">
                  {waterPercent >= 100 ? '✓ Goal reached!' : `${waterGoal - currentWater}ml remaining`}
                </p>
              </div>
            </div>
            {/* Quick-add buttons */}
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: '150ml', ml: 150, icon: '🥛' },
                { label: '250ml', ml: 250, icon: '🥤' },
                { label: '500ml', ml: 500, icon: '🍶' },
                { label: '750ml', ml: 750, icon: '💧' },
              ].map((opt) => (
                <button
                  key={opt.ml}
                  onClick={() => handleAddWater(opt.ml)}
                  disabled={waterLoading}
                  className="flex flex-col items-center gap-0.5 border border-zinc-800 bg-zinc-900 px-2 py-2 font-terminal text-xs text-cyan-400 transition hover:border-cyan-700 hover:bg-cyan-950/20 disabled:opacity-50"
                >
                  <span className="text-sm">{opt.icon}</span>
                  <span className="font-pixel text-[0.35rem] tracking-widest">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed Widget */}
        <div className="border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-pixel text-[0.6rem] tracking-widest text-emerald-500">ACTIVITY_FEED</span>
          </div>
          <div className="p-2 max-h-[300px] overflow-y-auto">
            {!xpHistory || xpHistory.length === 0 ? (
              <div className="p-4 text-center">
                <p className="font-terminal text-sm text-zinc-400">No activity yet</p>
                <p className="font-terminal text-xs text-zinc-600 mt-1">Complete tasks and habits to see your XP feed</p>
              </div>
            ) : (
              <div className="space-y-px">
                {xpHistory.map((event) => (
                  <div key={event._id} className="flex items-center gap-2 px-3 py-2 border border-transparent hover:border-zinc-800 hover:bg-zinc-900 transition">
                    <span className={`shrink-0 font-terminal text-sm font-bold ${event.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {event.amount > 0 ? '+' : ''}{event.amount}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-terminal text-xs text-zinc-300">{event.description}</p>
                      <p className="font-terminal text-xs text-zinc-600">{formatTimeAgo(event.createdAt)}</p>
                    </div>
                    <XPSourceIcon source={event.source} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* -- FOCUS / STREAKS / AI COACH ROW -- */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <FocusTimerWidget />
        <HabitStreakWidget />
        <AICoachWidget />
      </div>

      {/* -- JOURNAL / GOAL PROGRESS / CALORIE ROW -- */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <QuickJournalWidget />
        <GoalProgressWidget />
        <CalorieTrackerWidget />
      </div>

      {/* -- CLOCK / QUICK-TASK / QUICK-NOTE ROW -- */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <DigitalClockWidget />
        <QuickTaskWidget />
        <QuickNoteWidget />
      </div>

      {/* -- SLEEP / QUICK-ACTIONS / VISION-BOARD ROW -- */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <SleepWidget />
        <QuickActionsWidget />
        <VisionBoardWidget />
      </div>

      {/* -- WEATHER WIDGET -- */}
      <div className="mb-6">
        <WeatherWidget />
      </div>

      {/* -- DAILY QUOTE -- */}
      <div className="mb-6">
        <DailyQuote />
      </div>

      {/* -- AI Morning Briefing (if done) -- */}
      {morningDone && todayCheckIn?.morningAiBriefing && (
        <MorningBriefingCard briefing={todayCheckIn.morningAiBriefing as string} mood={todayCheckIn.morningMood as number} energy={todayCheckIn.morningEnergy as number} />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* -- HABITS PANEL -- */}
        <section className="border border-zinc-900 bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              <span className="font-terminal text-sm font-bold text-zinc-100">Habits — Today</span>
            </div>
            <Link href="/habits" className="font-pixel text-[0.35rem] tracking-widest text-zinc-400 transition hover:text-orange-500">
              [VIEW_ALL]
            </Link>
          </div>

          {!activeHabits.length ? (
            <TermEmptyState label="No habits yet" sub="Start tracking a habit to build your streak." href="/habits" action="Add your first habit" />
          ) : (
            <div className="space-y-px p-1">
              {activeHabits.slice(0, 5).map((habit) => (
                <button
                  key={habit._id}
                  onClick={() => handleToggleHabit(habit._id)}
                  disabled={togglingHabit === habit._id}
                  className="flex w-full items-center gap-3 border border-transparent px-3 py-2.5 text-left transition hover:border-zinc-800 hover:bg-zinc-900 disabled:opacity-50"
                >
                  <Circle className="h-4 w-4 shrink-0 text-zinc-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-terminal text-sm text-zinc-200">{habit.title}</p>
                    <p className="font-terminal text-xs text-zinc-500">
                      {habit.category} · {habit.streakCurrent}d streak
                    </p>
                  </div>
                  <span className={`rounded px-2 py-0.5 font-terminal text-xs ${habit.streakCurrent > 0 ? 'bg-orange-950/50 text-orange-400' : 'bg-zinc-900 text-zinc-500'}`}>
                    {habit.streakCurrent > 0 ? '🔥 Active' : 'Idle'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* -- TASK QUEUE PANEL -- */}
        <section className="border border-zinc-900 bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-zinc-500" />
              <span className="font-terminal text-sm font-bold text-zinc-100">Task Queue</span>
            </div>
            <Link href="/tasks" className="font-pixel text-[0.35rem] tracking-widest text-zinc-400 transition hover:text-orange-500">
              [VIEW_ALL]
            </Link>
          </div>

          {!openTasks.length ? (
            <TermEmptyState label="No tasks pending" sub="Your queue is clear. Add something to work on." href="/tasks" action="Add a task" />
          ) : (
            <div className="space-y-px p-1">
              {openTasks.slice(0, 5).map((task) => (
                <button
                  key={task._id}
                  onClick={() => handleToggleTask(task._id)}
                  disabled={togglingTask === task._id}
                  className="flex w-full items-center gap-3 border border-transparent px-3 py-2.5 text-left transition hover:border-zinc-800 hover:bg-zinc-900 disabled:opacity-50"
                >
                  <Circle className="h-4 w-4 shrink-0 text-zinc-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-terminal text-sm text-zinc-200">{task.title}</p>
                    <div className="flex items-center gap-2">
                      <TermPriorityChip priority={task.priority} />
                      {task.dueDate && <span className="font-terminal text-xs text-zinc-500">Due {task.dueDate}</span>}
                    </div>
                  </div>
                  {task.xpValue && (
                    <span className="font-terminal text-xs text-orange-500">
                      <Zap className="inline h-3.5 w-3.5" /> {task.xpValue}xp
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* -- GOALS PANEL -- */}
        <section className="border border-zinc-900 bg-zinc-950 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-zinc-500" />
              <span className="font-terminal text-sm font-bold text-zinc-100">Goals</span>
            </div>
            <Link href="/goals" className="font-pixel text-[0.35rem] tracking-widest text-zinc-400 transition hover:text-orange-500">
              [VIEW_ALL]
            </Link>
          </div>

          {!activeGoals.length ? (
            <TermEmptyState label="No goals set" sub="Define a goal to drive your daily habits." href="/goals" action="Create your first goal" />
          ) : (
            <div className="grid gap-px p-1 md:grid-cols-2">
              {activeGoals.map((goal) => (
                <Link
                  key={goal._id}
                  href={`/goals/${goal._id}`}
                  className="border border-transparent p-3 transition hover:border-zinc-800 hover:bg-zinc-900"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-terminal text-sm text-zinc-200">{goal.title}</p>
                    <span className="shrink-0 font-terminal text-sm font-bold text-orange-400">{goal.progress ?? 0}%</span>
                  </div>
                  <div className="mt-2 h-px w-full bg-zinc-900">
                    <div
                      className="h-px bg-orange-600 transition-all duration-500"
                      style={{ width: `${goal.progress ?? 0}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between font-terminal text-xs text-zinc-500">
                    <span>{goal.category}</span>
                    {goal.targetDate && <span>Target: {goal.targetDate}</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* -- AI COMMS BRIEF -- */}
        <section className="border border-zinc-900 bg-zinc-950 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
            <Brain className="h-3.5 w-3.5 text-zinc-500" />
            <span className="font-terminal text-sm font-bold text-zinc-100">AI Insight</span>
            <span className="ml-auto border border-green-900 bg-green-950/30 px-2 py-0.5 font-pixel text-[0.55rem] tracking-widest text-green-600">LIVE</span>
          </div>
          <div className="p-4">
            {morningDone ? (
              <div className="space-y-3">
                <p className="font-terminal text-sm leading-relaxed text-zinc-300">
                  State:{' '}
                  <span className="font-bold text-zinc-100">{dashboardEmotionalState}</span>
                  {' '}&mdash; {activeHabits.length} habits tracked, {activeGoals.length} goals active.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="font-pixel text-[0.45rem] tracking-widest text-zinc-500">ENERGY</span>
                    <div className="mt-1 font-mono text-sm tracking-widest text-emerald-400">
                      {'\u2593'.repeat(Math.max(0, Math.min(5, _energy ?? 0)))}
                      {'\u2591'.repeat(Math.max(0, 5 - Math.min(5, _energy ?? 0)))}
                      <span className="ml-2 font-terminal text-xs text-zinc-500">{_energy ?? 0}/5</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-pixel text-[0.45rem] tracking-widest text-zinc-500">MOOD</span>
                    <div className="mt-1 font-mono text-sm tracking-widest text-cyan-400">
                      {'\u2593'.repeat(Math.max(0, Math.min(5, _mood ?? 0)))}
                      {'\u2591'.repeat(Math.max(0, 5 - Math.min(5, _mood ?? 0)))}
                      <span className="ml-2 font-terminal text-xs text-zinc-500">{_mood ?? 0}/5</span>
                    </div>
                  </div>
                </div>
                {(todayCheckIn as any)?.topThreePriorities?.length > 0 && (
                  <div>
                    <span className="font-pixel text-[0.45rem] tracking-widest text-zinc-500">TODAY&apos;S PRIORITIES</span>
                    <ol className="mt-1 space-y-0.5">
                      {((todayCheckIn as any).topThreePriorities as string[]).map((p, i) => (
                        <li key={i} className="font-terminal text-xs text-zinc-300">
                          <span className="text-zinc-600">{i + 1}.</span> {p}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-terminal text-sm leading-relaxed text-zinc-400">
                  Complete your morning check-in to unlock AI personalization.
                </p>
                <p className="font-terminal text-xs text-zinc-600">
                  Mood + energy data powers every coach response and your daily plan.
                </p>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {!morningDone && isMorning && (
                <span className="rounded border border-amber-900 bg-amber-950/20 px-3 py-1.5 font-terminal text-xs text-amber-400">
                  ☀ Morning check-in pending
                </span>
              )}
              {isEvening && !eveningDone && (
                <span className="rounded border border-violet-900 bg-violet-950/20 px-3 py-1.5 font-terminal text-xs text-violet-400">
                  🌙 Evening debrief pending
                </span>
              )}
              {openTasks.length > 3 && (
                <span className="rounded border border-orange-900 bg-orange-950/20 px-3 py-1.5 font-terminal text-xs text-orange-400">
                  {openTasks.length} tasks pending — clear the queue
                </span>
              )}
              {bestStreak >= 7 && (
                <span className="rounded border border-emerald-900 bg-emerald-950/20 px-3 py-1.5 font-terminal text-xs text-emerald-400">
                  🔥 {bestStreak} day streak — keep it alive!
                </span>
              )}
            </div>
          </div>
        </section>

        {/* -- ADAPTIVE DIFFICULTY -- */}
        <section className="lg:col-span-2">
          <AdaptiveDifficultyWidget />
        </section>

        {/* -- QUICK ACTIONS -- */}
        <section className="border border-zinc-900 bg-zinc-950 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
            <Zap className="h-3.5 w-3.5 text-orange-500" />
            <span className="font-terminal text-sm font-bold text-zinc-100">Quick Actions</span>
          </div>
          <div className="grid grid-cols-2 gap-px p-1 md:grid-cols-4">
            {[
              { label: 'AI Coach', href: '/coach', icon: MessageSquare, color: 'text-cyan-400' },
              { label: 'Deep Scan', href: '/deep-scan', icon: Brain, color: 'text-amber-400' },
              { label: 'Orchestrator', href: '/orchestrator', icon: Sparkles, color: 'text-violet-400' },
              { label: 'Focus Session', href: '/focus', icon: Target, color: 'text-emerald-400' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 border border-transparent p-4 transition hover:border-zinc-800 hover:bg-zinc-900"
              >
                <action.icon className={`h-5 w-5 ${action.color}`} />
                <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-400">{action.label.toUpperCase()}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile FAB — desktop/tablet only (mobile uses MobileDashboard) */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Link
          href="/tasks"
          className="flex h-12 w-12 items-center justify-center border border-orange-600 bg-orange-600 text-black transition hover:bg-orange-500"
          aria-label="Add task"
        >
          <Plus className="h-5 w-5" />
        </Link>
      </div>
    </div>
      </div>{/* /hidden md:block */}
    </>
  );
}

// ── Morning Briefing Card ──
function MorningBriefingCard({ briefing, mood, energy }: { briefing: string; mood: number; energy: number }) {
  const [expanded, setExpanded] = useState(true);
  const moodEmojis = ['', '😔', '😐', '😊', '🙂', '🔥'];
  const energyBars = ['', '▁', '▂', '▄', '▆', '█'];

  return (
    <div className="mb-6 border border-amber-900/40 bg-amber-950/10">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between border-b border-amber-900/30 px-4 py-2.5 text-left"
      >
        <div className="flex items-center gap-2">
          <Sun className="h-3.5 w-3.5 text-amber-500" />
          <span className="font-pixel text-[0.6rem] tracking-widest text-amber-400">AI_MORNING_BRIEFING</span>
          <span className="ml-2 text-sm">{moodEmojis[mood] ?? ''}</span>
          <span className="font-terminal text-sm text-orange-400">{energyBars[energy] ?? ''}</span>
        </div>
        {expanded ? <ChevronUp className="h-3.5 w-3.5 text-zinc-500" /> : <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />}
      </button>
      {expanded && (
        <div className="p-4">
          <p className="font-terminal text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">{briefing}</p>
        </div>
      )}
    </div>
  );
}

// ── Stat Card ──
function TermStatCard({ label, value, highlight, icon }: { label: string; value: string | number; highlight?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="border border-zinc-900 bg-zinc-950 px-4 py-4 transition hover:border-zinc-700 hover:bg-zinc-900">
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="font-terminal text-xs text-zinc-400">{label}</p>
      </div>
      <p className={`mt-1.5 font-terminal text-2xl font-bold ${highlight ? 'text-orange-400' : 'text-zinc-100'}`}>{value}</p>
    </div>
  );
}

function TermPriorityChip({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    urgent: 'bg-red-950/50 text-red-400',
    high: 'bg-orange-950/50 text-orange-400',
    medium: 'bg-yellow-950/50 text-yellow-500',
    low: 'bg-zinc-900 text-zinc-500',
  };
  return (
    <span className={`rounded px-2 py-0.5 font-terminal text-xs ${map[priority] ?? map.low}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

function TermEmptyState({ label, sub, href, action }: { label: string; sub: string; href: string; action: string }) {
  return (
    <div className="border border-dashed border-zinc-800 m-4 p-8 text-center">
      <p className="font-terminal text-sm font-medium text-zinc-200">{label}</p>
      <p className="mt-1.5 font-terminal text-xs text-zinc-400">{sub}</p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1.5 rounded border border-zinc-700 bg-zinc-900 px-4 py-2 font-terminal text-sm text-zinc-300 transition hover:border-orange-600 hover:text-orange-400"
      >
        <Plus className="h-4 w-4" /> {action}
      </Link>
    </div>
  );
}

// ── Time formatting ──
function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

// ── XP Source Icon ──
function XPSourceIcon({ source }: { source: string }) {
  const map: Record<string, { icon: string; color: string }> = {
    task_complete: { icon: '✓', color: 'text-emerald-500' },
    habit_complete: { icon: '⚡', color: 'text-orange-500' },
    goal_complete: { icon: '🎯', color: 'text-cyan-500' },
    milestone_complete: { icon: '🏁', color: 'text-violet-500' },
    focus_session: { icon: '🧠', color: 'text-amber-500' },
    streak_bonus: { icon: '🔥', color: 'text-red-500' },
    achievement: { icon: '🏆', color: 'text-yellow-500' },
    daily_login: { icon: '📅', color: 'text-blue-500' },
    weekly_review: { icon: '📊', color: 'text-pink-500' },
    perfect_day: { icon: '⭐', color: 'text-yellow-400' },
    comeback: { icon: '💪', color: 'text-green-500' },
  };
  const info = map[source] ?? { icon: '•', color: 'text-zinc-500' };
  return <span className={`text-sm ${info.color}`} title={source}>{info.icon}</span>;
}
