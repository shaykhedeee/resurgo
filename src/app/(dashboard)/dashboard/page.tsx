'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Dashboard Command Center (Today View)
// Full-featured: check-ins, AI briefing, habits, tasks, goals, XP, streaks
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { useStoreUser } from '@/hooks/useStoreUser';
import { useState, useMemo, useCallback, useEffect, Component, ReactNode } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { resolveLayout, WIDGET_REGISTRY, type LayoutEntry } from '@/lib/dashboard/widgetRegistry';
import { useProgressiveDisclosure } from '@/hooks/useProgressiveDisclosure';
import { PixelIcon } from '@/components/PixelIcon';
import { PixelArt } from '@/components/PixelArt';
import { UpsellPrompt } from '@/components/UpsellPrompt';
import { analytics } from '@/lib/analytics';

// Dynamic imports for heavy / conditional components
const MorningCheckIn = dynamic(() => import('@/components/MorningCheckIn').then(m => ({ default: m.MorningCheckIn })), { ssr: false });
const EveningDebrief = dynamic(() => import('@/components/EveningDebrief').then(m => ({ default: m.EveningDebrief })), { ssr: false });
const AdaptiveDifficultyWidget = dynamic(() => import('@/components/AdaptiveDifficultyWidget'), { ssr: false });
const WeatherWidget = dynamic(() => import('@/components/WeatherWidget'), { ssr: false });
const OpenSenseMapWidget = dynamic(() => import('@/components/OpenSenseMapWidget'), { ssr: false });
const DailyQuote = dynamic(() => import('@/components/DailyQuote'), { ssr: false });
const WidgetGrid = dynamic(() => import('@/components/dashboard/WidgetGrid'), { ssr: false });
const WidgetPanel = dynamic(() => import('@/components/dashboard/WidgetPanel'), { ssr: false });
const DiscoverMorePanel = dynamic(() => import('@/components/dashboard/DiscoverMorePanel').then(m => ({ default: m.DiscoverMorePanel })), { ssr: false });
const MobileDashboard = dynamic(() => import('@/components/MobileDashboard'), { ssr: false });
const QuickAddPalette = dynamic(() => import('@/components/QuickAddPalette'), { ssr: false });
const Tutorial = dynamic(() => import('@/components/Tutorial').then(m => ({ default: m.Tutorial })), { ssr: false });
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
  Star,
  Settings,
  LayoutGrid,
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

// Streak flame tier helper — escalating visuals at milestone thresholds
function streakBadge(days: number): { emoji: string; color: string; label?: string } {
  if (days >= 100) return { emoji: '💎', color: 'text-cyan-400', label: '100d+' };
  if (days >= 66) return { emoji: '🏆', color: 'text-yellow-400', label: '66d — habit locked' };
  if (days >= 30) return { emoji: '🔥', color: 'text-orange-400', label: '30d+' };
  if (days >= 21) return { emoji: '🔥', color: 'text-amber-500', label: '21d+' };
  if (days >= 7) return { emoji: '🔥', color: 'text-amber-600', label: '7d+' };
  if (days > 0) return { emoji: '🔥', color: 'text-zinc-500' };
  return { emoji: '', color: 'text-zinc-700' };
}

class WidgetErrorBoundary extends Component<
  { name: string; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { name: string; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(`[DashboardWidget:${this.props.name}]`, error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="rounded border border-red-900/50 bg-red-950/20 p-4">
        <p className="font-pixel text-[0.45rem] tracking-widest text-red-400">WIDGET_RECOVERY_MODE</p>
        <p className="mt-2 font-terminal text-sm text-zinc-200">
          {this.props.name} is temporarily unavailable. The rest of your dashboard is still active.
        </p>
      </div>
    );
  }
}

function SafeWidget({ name, children }: { name: string; children: ReactNode }) {
  return <WidgetErrorBoundary name={name}>{children}</WidgetErrorBoundary>;
}

export default function DashboardPage() {
  const { user } = useStoreUser();
  const habits = useQuery(api.habits.listActive);
  const goals = useQuery(api.goals.listActive);
  const tasks = useQuery(api.tasks.list, { status: 'todo' });
  const todayCheckIn = useQuery(api.dailyCheckIns.getToday);
  const recentCheckIns = useQuery(api.dailyCheckIns.getRecent, { days: 7 });
  const gamificationProfile = useQuery(api.gamification.getProfile);
  const toggleHabit = useMutation(api.habits.toggleComplete);
  const toggleTask = useMutation(api.tasks.toggleComplete);
  const aiGreeting = useQuery(api.aiGreetings.getGreeting);
  const markGreetingViewed = useMutation(api.aiGreetings.markViewed);

  const createTask = useMutation(api.tasks.create);

  const [togglingHabit, setTogglingHabit] = useState<string | null>(null);
  const [togglingTask, setTogglingTask] = useState<string | null>(null);
  const [xpFlash, setXpFlash] = useState<{ xp: number; visible: boolean }>({ xp: 0, visible: false });
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [quickAddSaving, setQuickAddSaving] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [showMorningCheckIn, setShowMorningCheckIn] = useState(false);
  const [showEveningDebrief, setShowEveningDebrief] = useState(false);
  const [checkInJustCompleted, setCheckInJustCompleted] = useState(false);
  const [debriefJustCompleted, setDebriefJustCompleted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [greetingDismissed, setGreetingDismissed] = useState(false);
  const [streakUpsellDismissed, setStreakUpsellDismissed] = useState(false);

  // ── Dashboard customisation state ──
  const [editMode, setEditMode] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [armoryOpen, setArmoryOpen] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const savedLayout = useQuery(api.users.getDashboardLayout);
  const saveLayoutMutation = useMutation(api.users.saveDashboardLayout);
  const layout = useMemo(() => resolveLayout(savedLayout ?? null), [savedLayout]);

  // ── Progressive disclosure: tier-based defaults for fresh accounts ──
  const disclosure = useProgressiveDisclosure({
    createdAt: (user as unknown as { _creationTime?: number })?._creationTime,
    currentStreak: (gamificationProfile as unknown as { currentStreak?: number })?.currentStreak ?? 0,
    habitCount: (habits ?? []).length,
    goalCount: (goals ?? []).length,
    taskCount: (tasks ?? []).length,
    hasCustomLayout: savedLayout !== null && savedLayout !== undefined,
  });
  // Apply tier filter only for newcomers who haven't yet touched their layout
  const displayLayout = useMemo(() => {
    if (savedLayout !== null && savedLayout !== undefined) return layout;
    if (disclosure.tier !== 'newcomer') return layout;
    return layout.map((e) => ({ ...e, visible: disclosure.defaultVisibleWidgets.has(e.id) }));
  }, [layout, savedLayout, disclosure.tier, disclosure.defaultVisibleWidgets]);

  const [hintDismissed, setHintDismissed] = useState(false);

  const handleReorder = useCallback(
    (newLayout: LayoutEntry[]) => {
      void saveLayoutMutation({ layout: newLayout });
    },
    [saveLayoutMutation],
  );

  const handleHideWidget = useCallback(
    (id: string) => {
      const next = layout.map((e) => (e.id === id ? { ...e, visible: false } : e));
      void saveLayoutMutation({ layout: next });
    },
    [layout, saveLayoutMutation],
  );

  const handleToggleWidget = useCallback(
    (id: string) => {
      const next = layout.map((e) => (e.id === id ? { ...e, visible: !e.visible } : e));
      void saveLayoutMutation({ layout: next });
    },
    [layout, saveLayoutMutation],
  );

  const handleResetLayout = useCallback(() => {
    const defaults = WIDGET_REGISTRY.map((w) => ({
      id: w.id,
      visible: w.defaultVisible,
      order: w.defaultOrder,
    }));
    void saveLayoutMutation({ layout: defaults });
  }, [saveLayoutMutation]);



  // Determine time of day
  const now = useMemo(() => new Date(), []);
  const hour = now.getHours();
  const isEvening = hour >= 18;
  const isMorning = hour < 12;
  const isAfternoonNudge = hour >= 17 && hour < 20; // 5-8pm "don't break the chain"

  // Check-in status
  const morningDone = !!todayCheckIn?.morningCompletedAt || checkInJustCompleted;
  const eveningDone = !!todayCheckIn?.eveningCompletedAt || debriefJustCompleted;

  // Streak calculation from recent check-ins  
  const checkInStreak = useMemo(() => {
    if (!recentCheckIns || recentCheckIns.length === 0) return 0;
    let streak = 0;
    const sorted = [...recentCheckIns].sort((a, b) => b.date.localeCompare(a.date));
    const todayStr = new Date().toISOString().split('T')[0];
    for (const ci of sorted) {
      const d = ci.date;
      const expected = new Date();
      expected.setDate(expected.getDate() - streak);
      const expectedStr = expected.toISOString().split('T')[0];
      if (d === expectedStr || (streak === 0 && d === todayStr)) {
        if (ci.morningCompletedAt || ci.eveningCompletedAt) streak++;
        else break;
      } else {
        break;
      }
    }
    return streak;
  }, [recentCheckIns]);

  useEffect(() => {
    try {
      if (!localStorage.getItem('resurgo-tutorial-completed')) {
        setShowTutorial(true);
      }
    } catch (error) {
      console.warn('[Dashboard] Tutorial storage unavailable:', error);
      setShowTutorial(true);
    }
  }, []);

  // Fire streak milestone analytics once per session per milestone threshold
  useEffect(() => {
    if (!habits || habits.length === 0) return;
    const best = (habits as HabitView[]).reduce((max, h) => Math.max(max, h.streakCurrent ?? 0), 0);
    const MILESTONES = [7, 21, 30, 66, 100];
    const hit = MILESTONES.find(m => best >= m);
    if (hit) {
      try {
        const key = `resurgo_streak_milestone_${hit}`;
        if (!sessionStorage.getItem(key)) {
          analytics.streakMilestone(hit);
          sessionStorage.setItem(key, '1');
        }
      } catch (error) {
        console.warn('[Dashboard] Session storage unavailable:', error);
        analytics.streakMilestone(hit);
      }
    }
  }, [habits]);

  // ⌘K / Ctrl+K — handled by the layout's GlobalSearch; Quick Add Palette opened via button only

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
  const isPro = user?.plan === 'pro' || user?.plan === 'lifetime';

  // Emotional state derived from today's check-in (mirrors convex/coachAI.ts deriveEmotionalState)
  const _mood = todayCheckIn?.morningMood;
  const _energy = todayCheckIn?.morningEnergy;
  const _sleep = todayCheckIn?.sleepQuality;
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
  const nextTask = openTasks[0];
  const nextHabit = activeHabits[0];

  const handleToggleHabit = async (habitId: string) => {
    setTogglingHabit(habitId);
    try {
      await toggleHabit({ habitId: habitId as Id<"habits">, date: today.toISOString().split('T')[0] });
      // XP visual flash for habit completion
      setXpFlash({ xp: 10, visible: true });
      setTimeout(() => setXpFlash({ xp: 0, visible: false }), 2200);
      // Haptic feedback (mobile)
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([20, 30, 50]);
      }
    } catch (e) {
      console.error('Failed to toggle habit:', e);
    }
    setTogglingHabit(null);
  };

  const handleToggleTask = async (taskId: string) => {
    setTogglingTask(taskId);
    try {
      await toggleTask({ taskId: taskId as Id<"tasks"> });
      // Find the completed task's XP value
      const task = openTasks.find((t) => t._id === taskId);
      const xp = task?.xpValue ?? 25;
      // XP visual flash
      setXpFlash({ xp, visible: true });
      setTimeout(() => setXpFlash({ xp: 0, visible: false }), 2200);
      // Haptic feedback (mobile)
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([30, 40, 80]);
      }
      // Audio feedback — short synth beep via Web Audio API
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } catch {
        // Audio not available — silently skip
      }
    } catch (e) {
      console.error('Failed to toggle task:', e);
    }
    setTogglingTask(null);
  };

  const handleQuickAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = quickAddTitle.trim();
    if (!title) return;
    setQuickAddSaving(true);
    try {
      await createTask({ title, priority: 'medium' });
      setQuickAddTitle('');
      setQuickAddOpen(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
    setQuickAddSaving(false);
  };

  return (
    <>
      {/* XP level-up flash overlay */}
      {xpFlash.visible && (
        <div className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center">
          <div className="animate-bounce border-2 border-orange-500 bg-black/80 px-8 py-4 text-center shadow-lg shadow-orange-900/50">
            <p className="font-pixel text-[0.55rem] tracking-widest text-orange-400 mb-1">
              {xpFlash.xp >= 20 ? 'TASK COMPLETE' : 'HABIT LOGGED'}
            </p>
            <p className="font-pixel text-2xl text-orange-500">+{xpFlash.xp} XP</p>
          </div>
        </div>
      )}
      {/* ── Mobile: full native-like tabbed dashboard ── */}
      <div className="block md:hidden">
        <SafeWidget name="Mobile Dashboard">
          <MobileDashboard />
        </SafeWidget>
      </div>

      {/* ── Desktop: original full dashboard ── */}
      <div className="hidden md:block">
      <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-4 md:px-6 md:py-6">

      {/* -- AI Welcome Banner -- */}
      {aiGreeting && !aiGreeting.viewed && !greetingDismissed && (
        <div className="mb-4 flex items-center justify-between border border-orange-800 bg-orange-950/20 px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-orange-500" />
            <p className="font-terminal text-sm text-orange-300">
              ⚡ We&apos;ve analysed your goals, habits and data — your AI has set up your dashboard.{' '}
              <Link href="/first-contact" className="underline hover:text-orange-200">View full briefing →</Link>
            </p>
          </div>
          <button
            onClick={async () => { setGreetingDismissed(true); await markGreetingViewed({ greetingId: aiGreeting._id }); }}
            className="ml-4 shrink-0 font-terminal text-xs text-zinc-500 hover:text-zinc-300"
          >
            ✕
          </button>
        </div>
      )}

      {/* -- HEADER -- */}
      <div className="surface-panel mb-6 overflow-hidden">
        <div className="surface-header">
          <span className="h-2 w-2 animate-pulse rounded-full bg-orange-600" />
          <span className="surface-kicker-accent">Today workspace</span>
          <span className="ml-auto font-terminal text-xs tracking-widest text-zinc-400">
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(360px,0.9fr)]">
          <div>
            <p className="surface-kicker">Command center</p>
            <h1 className="surface-title mt-2 text-3xl md:text-4xl">
              {greeting}
            </h1>
            <p className="surface-subtitle mt-3 max-w-2xl">
              {totalHabits > 0
                ? `Your workspace is organized around ${openTasks.length} active tasks, ${totalHabits} habits, and ${activeGoals.length} goals. Start with the smallest move that keeps momentum alive.`
                : "Let's set up your system with a simple first move."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="surface-chip">{totalHabits} habits</span>
              <span className="surface-chip">{openTasks.length} open tasks</span>
              <span className="surface-chip">{activeGoals.length} goals</span>
              {checkInStreak > 0 && (
                <span className="surface-chip-accent">
                  <Flame className="h-3 w-3" /> {checkInStreak} day streak
                </span>
              )}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/coach" className="action-tile text-orange-300 hover:text-orange-200">
                <MessageSquare className="h-4 w-4" />
                <span className="font-terminal text-sm">Open AI Coach</span>
              </Link>
              {[['Goals', '/goals'], ['Habits', '/habits'], ['Tasks', '/tasks']].map(([label, href]) => (
                <Link key={label} href={href} className="action-tile text-zinc-300 hover:text-zinc-100">
                  <span className="font-terminal text-sm">{label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="surface-panel-muted p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="surface-kicker-accent">Today focus</p>
                <p className="mt-2 font-terminal text-sm text-zinc-400">Smallest useful move, clearly framed.</p>
              </div>
              <PixelArt variant="terminal" className="h-20 w-20 text-orange-400" title="Dashboard terminal artwork" />
            </div>
            <div className="mt-4 space-y-4">
              <div className="border border-zinc-900 bg-black/40 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <PixelIcon name="tasks" size={14} className="text-orange-400" />
                  <p className="surface-kicker">Next task</p>
                </div>

                <p className="mt-1 font-terminal text-lg font-semibold text-zinc-100">{nextTask?.title ?? 'Capture one meaningful task'}</p>
                <p className="mt-1 font-terminal text-sm text-zinc-400">
                  {nextTask ? `Priority: ${nextTask.priority}${nextTask.dueDate ? ` • due ${nextTask.dueDate}` : ''}` : 'Keep the queue small and obvious.'}
                </p>
              </div>
              <div className="border border-zinc-900 bg-black/40 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <PixelIcon name="habits" size={14} className="text-emerald-400" />
                  <p className="surface-kicker">Stability habit</p>
                </div>
                <p className="mt-1 font-terminal text-lg font-semibold text-zinc-100">{nextHabit?.title ?? 'Choose one repeatable habit'}</p>
                <p className="mt-1 font-terminal text-sm text-zinc-400">
                  {nextHabit ? `${nextHabit.streakCurrent} day streak in ${nextHabit.category}.` : 'Consistency beats intensity here.'}
                </p>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* -- EMERGENCY MODE BANNER -- */}
      {emergencyMode && (
        <div className="mb-6 border border-red-900 bg-red-950/30 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-pixel text-[0.55rem] tracking-widest text-red-400 mb-1">EMERGENCY MODE — SIMPLIFIED VIEW</p>
              <p className="font-terminal text-sm text-zinc-300">
                You only need to do <strong className="text-red-300">one thing</strong> right now.
                Everything else can wait. Take a breath.
              </p>
            </div>
            <button
              onClick={() => setEmergencyMode(false)}
              className="shrink-0 border border-zinc-700 px-3 py-1.5 font-pixel text-[0.5rem] tracking-widest text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200"
            >
              SNAP OUT
            </button>
          </div>
        </div>
      )}

      {/* -- QUICK ADD STRIP -- */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {/* Command palette trigger – primary CTA */}
        <button
          onClick={() => setPaletteOpen(true)}
          className="flex items-center gap-2 border border-orange-700 bg-orange-600 px-4 py-2 font-terminal text-xs font-bold text-black transition hover:bg-orange-500"
        >
          <Plus className="h-3.5 w-3.5" />
          Quick Add
          <kbd className="ml-1 hidden rounded border border-orange-800 bg-orange-700/80 px-1 py-0.5 font-terminal text-[0.6rem] text-orange-200 md:inline">⌘K</kbd>
        </button>

        {/* Inline task quick-add (kept for speed) */}
        {/* Simplify Today / Emergency Mode toggle */}
        {!quickAddOpen && (
          <button
            onClick={() => setEmergencyMode((v) => !v)}
            className={`flex items-center gap-1.5 border px-3 py-2 font-pixel text-[0.5rem] tracking-widest transition ${
              emergencyMode
                ? 'border-red-800 bg-red-950/40 text-red-400 hover:border-red-600'
                : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-red-900 hover:text-red-500'
            }`}
          >
            {emergencyMode ? 'EXIT SIMPLIFY' : 'SIMPLIFY TODAY'}
          </button>
        )}

        {quickAddOpen ? (
          <form onSubmit={handleQuickAddTask} className="flex flex-1 items-center gap-2">
            <input
              autoFocus
              type="text"
              value={quickAddTitle}
              onChange={(e) => setQuickAddTitle(e.target.value)}
              placeholder="Task title..."
              className="flex-1 border border-orange-800 bg-black px-3 py-2 font-terminal text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-orange-600"
            />
            <button
              type="submit"
              disabled={quickAddSaving || !quickAddTitle.trim()}
              className="border border-orange-700 bg-orange-950/60 px-4 py-2 font-terminal text-xs text-orange-400 transition hover:bg-orange-950 disabled:opacity-50"
            >
              {quickAddSaving ? '...' : 'ADD'}
            </button>
            <button
              type="button"
              onClick={() => { setQuickAddOpen(false); setQuickAddTitle(''); }}
              className="border border-zinc-700 px-3 py-2 font-terminal text-xs text-zinc-400 transition hover:text-zinc-200"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            onClick={() => setQuickAddOpen(true)}
            className="flex items-center gap-1.5 border border-orange-900 bg-orange-950/30 px-3 py-2 font-terminal text-xs text-orange-400 transition hover:border-orange-700 hover:bg-orange-950/60"
          >
            <Plus className="h-3 w-3" /> Task
          </button>
        )}
      </div>

      {/* Quick Add Command Palette */}
      <SafeWidget name="Quick Add Palette">
        <QuickAddPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      </SafeWidget>

      {/* -- YOUR FOCUS: #1 priority task banner -- */}
      {openTasks.length > 0 && (
        <div className="mb-6 border-2 border-orange-800 bg-gradient-to-r from-orange-950/30 via-black to-orange-950/20 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="font-pixel text-[0.5rem] tracking-widest text-orange-500 mb-1">YOUR_FOCUS — #1 PRIORITY</p>
              <p className="font-terminal text-lg font-bold text-zinc-100 truncate">{openTasks[0].title}</p>
              {openTasks[0].dueDate && (
                <p className="mt-1 font-terminal text-xs text-zinc-500">Due {openTasks[0].dueDate}</p>
              )}
            </div>
            <button
              onClick={() => handleToggleTask(openTasks[0]._id)}
              disabled={togglingTask === openTasks[0]._id}
              className="shrink-0 flex items-center gap-2 border-2 border-orange-600 bg-orange-600 px-5 py-2.5 font-pixel text-[0.55rem] tracking-widest text-black transition hover:bg-orange-500 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              COMPLETE
            </button>
          </div>
        </div>
      )}

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
          <SafeWidget name="Morning Check-In">
            <MorningCheckIn
              userName={user.name?.split(' ')[0]}
              todayHabits={activeHabits.slice(0, 5).map(h => h.title)}
              topTasks={openTasks.slice(0, 3).map(t => t.title)}
              onComplete={() => {
                setCheckInJustCompleted(true);
                setShowMorningCheckIn(false);
              }}
            />
          </SafeWidget>
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
          <SafeWidget name="Evening Debrief">
            <EveningDebrief
              userName={user.name?.split(' ')[0]}
              tasksCompleted={todayCheckIn?.tasksCompleted}
              habitsCompleted={todayCheckIn?.habitsCompleted}
              onComplete={() => {
                setDebriefJustCompleted(true);
                setShowEveningDebrief(false);
              }}
            />
          </SafeWidget>
        </div>
      )}

      {/* -- TODAY FOCUS: Top 3 Tasks + 3 Habits + Coach Prompt (always visible) -- */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {/* Top 3 Tasks */}
        <div className="border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-pixel text-[0.55rem] tracking-widest text-orange-500">TODAY&apos;S TOP 3 TASKS</p>
            <Link href="/tasks" className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 hover:text-orange-400">+ALL</Link>
          </div>
          <div className="space-y-2">
            {openTasks.slice(0, emergencyMode ? 1 : 3).map((task, i) => (
              <button
                key={task._id}
                onClick={() => handleToggleTask(task._id)}
                disabled={togglingTask === task._id}
                className="flex w-full items-start gap-2 text-left group disabled:opacity-50"
              >
                <span className="font-pixel text-[0.5rem] text-zinc-600 mt-1 shrink-0">{i + 1}.</span>
                <p className="font-terminal text-sm text-zinc-200 group-hover:text-orange-300 transition leading-tight">{task.title}</p>
              </button>
            ))}
            {!openTasks.length && (
              <div className="text-center py-2">
                <p className="font-terminal text-xs text-zinc-600 mb-2">No tasks yet</p>
                <button
                  onClick={() => setPaletteOpen(true)}
                  className="inline-flex items-center gap-1.5 border border-orange-800 bg-orange-950/30 px-3 py-1.5 font-pixel text-[0.45rem] tracking-widest text-orange-400 transition hover:bg-orange-950/60"
                >
                  <Plus className="h-3 w-3" /> ADD YOUR FIRST TASK
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Top 3 Habits */}
        <div className="border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-pixel text-[0.55rem] tracking-widest text-orange-500">TODAY&apos;S TOP 3 HABITS</p>
            <Link href="/habits" className="font-pixel text-[0.4rem] tracking-widest text-zinc-500 hover:text-orange-400">+ALL</Link>
          </div>
          <div className="space-y-2">
            {activeHabits.slice(0, emergencyMode ? 1 : 3).map((habit) => (
              <button
                key={habit._id}
                onClick={() => handleToggleHabit(habit._id)}
                disabled={togglingHabit === habit._id}
                className="flex w-full items-center gap-2 text-left group disabled:opacity-50"
              >
                <Circle className="h-3.5 w-3.5 shrink-0 text-zinc-600 group-hover:text-orange-400 transition" />
                <div className="min-w-0">
                  <p className="font-terminal text-sm text-zinc-200 group-hover:text-orange-300 transition truncate">{habit.title}</p>
                  {habit.streakCurrent > 0 && (
                    <p className={`font-terminal text-xs ${streakBadge(habit.streakCurrent).color}`}>
                      {streakBadge(habit.streakCurrent).emoji} {habit.streakCurrent}d
                      {streakBadge(habit.streakCurrent).label && <span className="ml-1 text-[0.6rem] opacity-70">{streakBadge(habit.streakCurrent).label}</span>}
                    </p>
                  )}
                </div>
              </button>
            ))}
            {!activeHabits.length && (
              <div className="text-center py-2">
                <p className="font-terminal text-xs text-zinc-600 mb-2">No habits yet</p>
                <Link
                  href="/habits"
                  className="inline-flex items-center gap-1.5 border border-emerald-800 bg-emerald-950/30 px-3 py-1.5 font-pixel text-[0.45rem] tracking-widest text-emerald-400 transition hover:bg-emerald-950/60"
                >
                  <Plus className="h-3 w-3" /> START A HABIT
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Coach Prompt */}
        <Link
          href="/coach"
          className="flex flex-col justify-between border border-orange-900/60 bg-orange-950/10 p-4 hover:border-orange-700 hover:bg-orange-950/20 transition group"
        >
          <div>
            <p className="font-pixel text-[0.55rem] tracking-widest text-orange-500 mb-3">AI COACH PROMPT</p>
            <p className="font-terminal text-sm text-zinc-300 leading-relaxed group-hover:text-zinc-100 transition">
              {emergencyMode
                ? "I'm overwhelmed. Help me pick just one thing to do right now."
                : openTasks[0]
                ? `How do I break down: &ldquo;${openTasks[0].title.slice(0, 60)}${openTasks[0].title.length > 60 ? '...' : ''}&rdquo;?`
                : 'What should I focus on today to move my biggest goal forward?'}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <MessageSquare className="h-3.5 w-3.5 text-orange-500" />
            <span className="font-pixel text-[0.5rem] tracking-widest text-orange-500">ASK YOUR COACH &rsaquo;</span>
          </div>
        </Link>
      </div>

      {/* -- ARMORY TOGGLE -- */}
      <button
        onClick={() => setArmoryOpen((v) => !v)}
        className="mb-6 flex w-full items-center justify-center gap-3 border border-zinc-800 bg-zinc-950 px-4 py-3 font-pixel text-[0.6rem] tracking-widest text-zinc-400 transition hover:border-orange-800 hover:text-orange-400"
      >
        {armoryOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        {armoryOpen ? 'COLLAPSE ARMORY' : 'OPEN ARMORY — FULL DASHBOARD'}
        {armoryOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {armoryOpen && <>

      {/* -- STATS -- */}
      <div data-tutorial="progress" className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-6 lg:gap-4">
        <TermStatCard label="Habits" value={totalHabits} />
        <TermStatCard label="Goals" value={activeGoals.length} />
        <TermStatCard label="Tasks" value={openTasks.length} />
        <TermStatCard label="Progress" value={`${avgGoalProgress}%`} />
        <TermStatCard label="Best Streak" value={bestStreak > 0 ? `${bestStreak}d` : '—'} icon={<span className="text-sm">{bestStreak > 0 ? streakBadge(bestStreak).emoji : '🔥'}</span>} />
        <TermStatCard label="Level" value={gamificationProfile ? `${gamificationProfile.level}` : '1'} icon={<Star className="h-3 w-3 text-yellow-500" />} highlight />
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <PixelIcon name="terminal" size={14} className="text-orange-400" />
            <p className="surface-kicker">Your widgets</p>
          </div>
          <p className="font-terminal text-sm text-zinc-400">Drag to reorder, toggle visibility in the panel.</p>
        </div>
        <div className="flex items-center gap-2">
          {editMode && (
            <button
              onClick={() => setPanelOpen(true)}
              className="flex items-center gap-1.5 rounded border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-terminal text-xs text-zinc-300 hover:border-orange-600 hover:text-orange-400 transition"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Widgets</span>
            </button>
          )}
          <button
            onClick={() => setEditMode((v) => !v)}
            className={`flex items-center gap-1.5 rounded border px-3 py-1.5 font-terminal text-xs transition ${
              editMode
                ? 'border-orange-600 bg-orange-600 text-black hover:bg-orange-500'
                : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-orange-600 hover:text-orange-400'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            <span>{editMode ? 'Done' : 'Customise'}</span>
          </button>
        </div>
      </div>

      {/* -- NEWCOMER HINT -- */}
      {disclosure.hintText && !savedLayout && !hintDismissed && (
        <div className="mb-4 flex items-center justify-between border border-orange-800/50 bg-orange-950/20 px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-orange-400" />
            <p className="font-terminal text-sm text-orange-300">{disclosure.hintText}</p>
          </div>
          <button
            onClick={() => setHintDismissed(true)}
            className="ml-4 shrink-0 font-terminal text-xs text-zinc-500 hover:text-zinc-300"
          >
            dismiss
          </button>
        </div>
      )}

      {/* -- CUSTOMISABLE WIDGET GRID -- */}
      <div className="mb-6">
        <SafeWidget name="Widget Grid">
          <WidgetGrid
            layout={displayLayout}
            editMode={editMode}
            onReorder={handleReorder}
            onHide={handleHideWidget}
          />
        </SafeWidget>
      </div>

      {/* -- DISCOVER MORE (locked features for newcomers/explorers) -- */}
      {disclosure.tier !== 'builder' && (
        <SafeWidget name="Discover More">
          <DiscoverMorePanel tier={disclosure.tier} />
        </SafeWidget>
      )}

      {/* Widget customisation panel */}
      <SafeWidget name="Widget Panel">
        <WidgetPanel
          open={panelOpen}
          layout={layout}
          onToggle={handleToggleWidget}
          onReset={handleResetLayout}
          onClose={() => setPanelOpen(false)}
        />
      </SafeWidget>

      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <PixelIcon name="grid" size={14} className="text-violet-400" />
            <p className="surface-kicker">Context and support</p>
          </div>
          <p className="font-terminal text-sm text-zinc-400">Signals that help you pace the day instead of just filling it.</p>
        </div>
      </div>

      {/* -- WEATHER WIDGET -- */}
      <div className="mb-6">
        <SafeWidget name="Weather Widget">
          <WeatherWidget />
        </SafeWidget>
      </div>

      {/* -- ENVIRONMENT MAP (OpenSenseMap + location) -- */}
      <div className="mb-6">
        <SafeWidget name="OpenSenseMap Widget">
          <OpenSenseMapWidget />
        </SafeWidget>
      </div>

      {/* -- DAILY QUOTE -- */}
      <div className="mb-6">
        <SafeWidget name="Daily Quote">
          <DailyQuote />
        </SafeWidget>
      </div>

      {/* -- AI Morning Briefing (if done) -- */}
      {morningDone && todayCheckIn?.morningAiBriefing && (
        <MorningBriefingCard briefing={todayCheckIn.morningAiBriefing as string} mood={todayCheckIn.morningMood as number} energy={todayCheckIn.morningEnergy as number} />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* -- HABITS PANEL -- */}
        <section data-tutorial="habits" className="border border-zinc-900 bg-zinc-950">
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
                    {habit.streakCurrent > 0 ? `${streakBadge(habit.streakCurrent).emoji} ${habit.streakCurrent}d` : 'Idle'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* -- TASK QUEUE PANEL -- */}
        <section data-tutorial="tasks" className="border border-zinc-900 bg-zinc-950">
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
        <section data-tutorial="goal-card" className="border border-zinc-900 bg-zinc-950 lg:col-span-2">
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
                {Array.isArray(todayCheckIn?.topThreePriorities) && todayCheckIn.topThreePriorities.length > 0 && (
                  <div>
                    <span className="font-pixel text-[0.45rem] tracking-widest text-zinc-500">TODAY&apos;S PRIORITIES</span>
                    <ol className="mt-1 space-y-0.5">
                      {(todayCheckIn?.topThreePriorities as string[]).map((p, i) => (
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
              {isAfternoonNudge && bestStreak > 0 && activeHabits.length > 0 && (
                <span className="rounded border border-orange-900 bg-orange-950/20 px-3 py-1.5 font-terminal text-xs text-orange-400 animate-pulse">
                  ⛓ Don&apos;t break the chain — {bestStreak}d at stake!
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

          {/* Streak milestone upsell for free users with 7+ day streak */}
          {bestStreak >= 7 && !isPro && !streakUpsellDismissed && (
            <div className="mt-2">
              <UpsellPrompt
                trigger="streak_milestone"
                variant="banner"
                onDismiss={() => setStreakUpsellDismissed(true)}
              />
            </div>
          )}
        </section>

        {/* -- ADAPTIVE DIFFICULTY -- */}
        <section className="lg:col-span-2">
          <SafeWidget name="Adaptive Difficulty">
            <AdaptiveDifficultyWidget />
          </SafeWidget>
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

    </>}

    </div>
      </div>{/* /hidden md:block */}
      {showTutorial && (
        <SafeWidget name="Tutorial">
          <Tutorial
            onComplete={() => setShowTutorial(false)}
            onSkip={() => setShowTutorial(false)}
          />
        </SafeWidget>
      )}
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
  const pixelMap: Record<string, Parameters<typeof PixelIcon>[0]['name']> = {
    Habits: 'habits',
    Goals: 'goals',
    Tasks: 'tasks',
    Progress: 'analytics',
    'Best Streak': 'fire',
    Level: 'star',
  };
  return (
    <div className="metric-tile">
      <div className="flex items-center gap-1.5">
        <PixelIcon name={pixelMap[label] ?? 'dashboard'} size={13} className={highlight ? 'text-orange-400' : 'text-zinc-500'} />
        {icon}
        <p className="metric-label">{label}</p>
      </div>
      <p className={`metric-value ${highlight ? 'text-orange-400' : 'text-zinc-100'}`}>{value}</p>
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

