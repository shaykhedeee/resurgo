'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Dashboard Home (Today View)
// Main authenticated view: habits, tasks, goals overview, quick actions
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { useStoreUser } from '@/hooks/useStoreUser';
import { useState } from 'react';
import Link from 'next/link';
import {
  Target,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  Zap,
  Brain,
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
  const toggleHabit = useMutation(api.habits.toggleComplete);
  const toggleTask = useMutation(api.tasks.toggleComplete);

  const [togglingHabit, setTogglingHabit] = useState<string | null>(null);
  const [togglingTask, setTogglingTask] = useState<string | null>(null);

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
    <div className="mx-auto min-h-screen w-full max-w-6xl p-4 md:p-6">

      {/* -- HEADER -- */}
      <div className="mb-6 border border-zinc-900 bg-zinc-950">
        <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-orange-600" />
          <span className="font-mono text-xs tracking-widest text-orange-600">TODAY</span>
          <span className="ml-auto font-mono text-xs tracking-widest text-zinc-400">
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-100 md:text-4xl">
              Hey, {user.name?.split(' ')[0] ?? 'there'} 👋
            </h1>
            <p className="mt-1.5 font-mono text-sm text-zinc-400">
              {totalHabits > 0 ? `You have ${totalHabits} habits tracked today.` : "Let's set up your first habit."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[['Goals', '/goals'], ['Habits', '/habits'], ['Tasks', '/tasks']].map(([label, href]) => (
              <Link key={label} href={href} className="border border-zinc-800 bg-zinc-900 px-4 py-2 font-mono text-xs text-zinc-300 transition hover:border-orange-700 hover:text-orange-400">
                {label}
              </Link>
            ))}
          </div>
        </div>

        {!user.onboardingComplete && (
          <div className="mx-5 mb-4 flex items-center gap-2 border border-orange-900 bg-orange-950/30 px-3 py-2">
            <Sparkles className="h-3.5 w-3.5 text-orange-500" />
            <span className="font-mono text-sm text-orange-400">
            Setup incomplete —{' '}
            <a href="/onboarding" className="underline hover:text-orange-300">Complete onboarding</a>
          </span>
          </div>
        )}
      </div>

      {/* -- STATS -- */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <TermStatCard label="Habits" value={totalHabits} />
        <TermStatCard label="Goals" value={activeGoals.length} />
        <TermStatCard label="Tasks" value={openTasks.length} />
        <TermStatCard label="Progress" value={`${avgGoalProgress}%`} />
        <TermStatCard label="Plan" value={user.plan === 'free' ? 'FREE' : user.plan === 'lifetime' ? 'LIFETIME' : 'PRO'} highlight />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* -- NODE UPTIME PANEL -- */}
        <section className="border border-zinc-900 bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              <span className="font-mono text-sm font-bold text-zinc-200">Habits — Today</span>
            </div>
            <Link href="/habits" className="font-mono text-[10px] tracking-widest text-zinc-400 transition hover:text-orange-500">
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
                    <p className="truncate font-mono text-sm text-zinc-200">{habit.title}</p>
                    <p className="font-mono text-xs text-zinc-500">
                      {habit.category} · {habit.streakCurrent}d streak
                    </p>
                  </div>
                  <span className={`rounded px-2 py-0.5 font-mono text-xs ${habit.streakCurrent > 0 ? 'bg-orange-950/50 text-orange-400' : 'bg-zinc-900 text-zinc-500'}`}>
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
              <span className="font-mono text-sm font-bold text-zinc-200">Task Queue</span>
            </div>
            <Link href="/tasks" className="font-mono text-[10px] tracking-widest text-zinc-400 transition hover:text-orange-500">
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
                    <p className="truncate font-mono text-sm text-zinc-200">{task.title}</p>
                    <div className="flex items-center gap-2">
                      <TermPriorityChip priority={task.priority} />
                      {task.dueDate && <span className="font-mono text-xs text-zinc-500">Due {task.dueDate}</span>}
                    </div>
                  </div>
                  {task.xpValue && (
                    <span className="font-mono text-xs text-orange-500">
                      <Zap className="inline h-3.5 w-3.5" /> {task.xpValue}xp
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* -- CORE OBJECTIVES PANEL -- */}
        <section className="border border-zinc-900 bg-zinc-950 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-zinc-500" />
              <span className="font-mono text-sm font-bold text-zinc-200">Goals</span>
            </div>
            <Link href="/goals" className="font-mono text-[10px] tracking-widest text-zinc-400 transition hover:text-orange-500">
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
                    <p className="truncate font-mono text-sm text-zinc-200">{goal.title}</p>
                    <span className="shrink-0 font-mono text-sm font-bold text-orange-400">{goal.progress ?? 0}%</span>
                  </div>
                  <div className="mt-2 h-px w-full bg-zinc-900">
                    <div
                      className="h-px bg-orange-600 transition-all duration-500"
                      style={{ width: `${goal.progress ?? 0}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between font-mono text-xs text-zinc-500">
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
            <span className="font-mono text-sm font-bold text-zinc-200">AI Insight</span>
            <span className="ml-auto border border-green-900 bg-green-950/30 px-2 py-0.5 font-mono text-[9px] tracking-widest text-green-600">LIVE</span>
          </div>
          <div className="p-4">
            <p className="font-mono text-sm leading-relaxed text-zinc-400">
              You&apos;re tracking{' '}
              <span className="text-zinc-200 font-bold">{activeHabits.length} habits</span> and working toward{' '}
              <span className="text-zinc-200 font-bold">{activeGoals.length} goals</span>.
              Complete your most important tasks before noon to protect your streak and keep momentum going.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-400">
                💡 Try 2 deep work blocks
              </span>
              <span className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-xs text-zinc-400">
                ⏰ Best focus window: morning
              </span>
              {openTasks.length > 3 && (
                <span className="rounded border border-orange-900 bg-orange-950/20 px-3 py-1.5 font-mono text-xs text-orange-400">
                  ⚠ {openTasks.length} tasks pending — clear the queue
                </span>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Mobile FAB */}
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
  );
}

function TermStatCard({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="border border-zinc-900 bg-zinc-950 px-4 py-4 transition hover:border-zinc-700 hover:bg-zinc-900">
      <p className="font-mono text-xs text-zinc-500">{label}</p>
      <p className={`mt-1.5 font-mono text-2xl font-bold ${highlight ? 'text-orange-400' : 'text-zinc-100'}`}>{value}</p>
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
    <span className={`rounded px-2 py-0.5 font-mono text-xs ${map[priority] ?? map.low}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

function TermEmptyState({ label, sub, href, action }: { label: string; sub: string; href: string; action: string }) {
  return (
    <div className="border border-dashed border-zinc-800 m-4 p-8 text-center">
      <p className="font-mono text-sm font-medium text-zinc-300">{label}</p>
      <p className="mt-1.5 font-mono text-xs text-zinc-500">{sub}</p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1.5 rounded border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-sm text-zinc-300 transition hover:border-orange-600 hover:text-orange-400"
      >
        <Plus className="h-4 w-4" /> {action}
      </Link>
    </div>
  );
}
