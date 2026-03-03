'use client';

import { useEffect, useState, useMemo } from 'react';
import { differenceInDays, format } from 'date-fns';
import {
  X,
  Target,
  Calendar,
  Flame,
  ChevronRight,
  Sparkles,
  Rocket,
  Settings2,
  Trophy,
  CheckCircle2,
  Clock,
  Star,
} from 'lucide-react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------------

interface DemoPlanGeneratorProps {
  onStartDay1: () => void;
  onViewFullPlan: () => void;
  onClose: () => void;
}

// ---------------------------------------------------------------------------------
// CONFETTI BURST
// ---------------------------------------------------------------------------------

function ConfettiBurst() {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; color: string; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    const colors = ['#f97316', '#facc15', '#a855f7', '#3b82f6', '#22c55e', '#ec4899'];
    const generated = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.6,
      size: Math.random() * 8 + 4,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[110] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-bounce-in rounded-full opacity-0"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: '1.2s',
            animationFillMode: 'forwards',
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------------
// CATEGORY ICONS & COLORS
// ---------------------------------------------------------------------------------

const CATEGORY_MAP: Record<string, { emoji: string; label: string }> = {
  health: { emoji: 'HL', label: 'Health' },
  fitness: { emoji: 'FT', label: 'Fitness' },
  mindfulness: { emoji: 'MD', label: 'Mindfulness' },
  productivity: { emoji: 'PD', label: 'Productivity' },
  learning: { emoji: 'LN', label: 'Learning' },
  creativity: { emoji: 'CV', label: 'Creativity' },
  social: { emoji: 'SC', label: 'Social' },
  finance: { emoji: 'FN', label: 'Finance' },
  self_care: { emoji: 'SF', label: 'Self-Care' },
  career: { emoji: 'CR', label: 'Career' },
  general: { emoji: 'GN', label: 'General' },
  custom: { emoji: 'CU', label: 'Custom' },
};

// ---------------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------------

export function DemoPlanGenerator({
  onStartDay1,
  onViewFullPlan,
  onClose,
}: DemoPlanGeneratorProps) {
  const { goals, habits, user } = useAscendStore();
  const [showConfetti, setShowConfetti] = useState(false);

  const goal = goals[0] ?? null;

  // Linked habits for this goal
  const linkedHabits = useMemo(
    () => (goal ? habits.filter((h) => h.linkedGoalId === goal.id) : []),
    [goal, habits],
  );

  // Days remaining
  const daysLeft = useMemo(() => {
    if (!goal?.targetDate) return null;
    const target = typeof goal.targetDate === 'string' ? new Date(goal.targetDate) : goal.targetDate;
    return differenceInDays(target, new Date());
  }, [goal?.targetDate]);

  // Formatted target date
  const formattedDate = useMemo(() => {
    if (!goal?.targetDate) return '';
    const target = typeof goal.targetDate === 'string' ? new Date(goal.targetDate) : goal.targetDate;
    return format(target, 'MMMM d, yyyy');
  }, [goal?.targetDate]);

  // Sorted milestones
  const milestones = useMemo(
    () => (goal?.milestones ? [...goal.milestones].sort((a, b) => a.order - b.order) : []),
    [goal?.milestones],
  );

  // Fire confetti if celebration message exists
  useEffect(() => {
    if (goal?.celebrationMessage) {
      const timer = setTimeout(() => setShowConfetti(true), 400);
      return () => clearTimeout(timer);
    }
  }, [goal?.celebrationMessage]);

  // --- No-Goal State -----------------------------------------------------------

  if (!goal) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div
          className={cn(
            'relative mx-4 w-full max-w-md rounded-2xl border p-8 text-center shadow-2xl animate-fade-in',
            'border-[var(--border)] bg-[var(--surface)]',
          )}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-themed-muted transition-colors hover:bg-white/10 hover:text-themed"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ascend-500/20">
              <Target className="h-8 w-8 text-ascend-500" />
            </div>
          </div>

          <h2 className="mb-2 text-xl font-bold text-themed">
            Ready to Begin Your Journey?
          </h2>
          <p className="mb-6 text-sm text-themed-secondary">
            Create your first goal and Resurgo will generate a personalized,
            AI-powered plan tailored just for you.
          </p>

          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl bg-ascend-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-ascend-600 hover:shadow-ascend-500/25"
          >
            <Sparkles size={16} />
            Create Your First Goal
          </button>
        </div>
      </div>
    );
  }

  // --- Main Plan Preview --------------------------------------------------------

  const categoryInfo = CATEGORY_MAP[goal.category] ?? CATEGORY_MAP.general;

  return (
    <>
      {showConfetti && <ConfettiBurst />}

      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div
          className={cn(
            'relative mx-4 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl animate-fade-in',
            'border-[var(--border)] bg-[var(--surface)]',
          )}
        >
          {/* -- Close Button ----------------------------------------------- */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-themed-muted transition-colors hover:bg-white/10 hover:text-themed"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* -- Scrollable Content ----------------------------------------- */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gold-400/10 px-3 py-1 text-xs font-medium text-gold-400">
                <Star size={12} />
                AI-Powered Plan
              </div>

              <h1 className="mb-1 text-2xl font-bold text-themed sm:text-3xl">
                Your Resurgo Journey Begins!
              </h1>

              {user?.name && (
                <p className="text-sm text-themed-muted">
                  Crafted for{' '}
                  <span className="font-medium text-ascend-500">
                    {user.name}
                  </span>
                  {user.gamification?.level != null && (
                    <span className="ml-1 text-themed-muted">
                      · Level {user.gamification.level}
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Goal Card */}
            <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <div className="mb-3 flex items-start gap-3">
                <span className="text-2xl">{categoryInfo.emoji}</span>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-themed">
                    {goal.title}
                  </h2>
                  {goal.description && (
                    <p className="mt-0.5 text-sm text-themed-secondary line-clamp-2">
                      {goal.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Deadline & Countdown */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-themed-muted">
                <span className="inline-flex items-center gap-1">
                  <Calendar size={13} />
                  {formattedDate}
                </span>

                {daysLeft !== null && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium',
                      daysLeft > 30
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : daysLeft > 7
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-red-500/10 text-red-400',
                    )}
                  >
                    <Clock size={12} />
                    {daysLeft > 0
                      ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`
                      : daysLeft === 0
                        ? 'Due today!'
                        : 'Past due'}
                  </span>
                )}
              </div>
            </div>

            {/* Celebration Message */}
            {goal.celebrationMessage && (
              <div className="mb-6 rounded-xl border border-gold-400/20 bg-gold-400/5 px-4 py-3 text-center">
                <Trophy className="mx-auto mb-1.5 h-5 w-5 text-gold-400" />
                <p className="text-sm font-medium text-gold-400">
                  {goal.celebrationMessage}
                </p>
              </div>
            )}

            {/* -- Milestone Timeline --------------------------------------- */}
            {milestones.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-themed-muted">
                  <Rocket size={14} className="text-ascend-500" />
                  Your Personalized Plan
                </h3>

                <div className="relative space-y-0">
                  {milestones.map((ms, idx) => {
                    const isLast = idx === milestones.length - 1;
                    const msDate =
                      typeof ms.targetDate === 'string'
                        ? new Date(ms.targetDate)
                        : ms.targetDate;
                    const completed = ms.status === 'completed';

                    return (
                      <div key={ms.id} className="relative flex gap-4 pb-6 last:pb-0">
                        {/* Vertical Line */}
                        {!isLast && (
                          <div className="absolute left-[15px] top-8 h-[calc(100%-12px)] w-px bg-[var(--border)]" />
                        )}

                        {/* Step Circle */}
                        <div className="relative z-10 flex-shrink-0">
                          <div
                            className={cn(
                              'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors',
                              completed
                                ? 'bg-emerald-500 text-white'
                                : idx === 0
                                  ? 'bg-ascend-500 text-white shadow-lg shadow-ascend-500/30'
                                  : 'border border-[var(--border)] bg-[var(--background)] text-themed-muted',
                            )}
                          >
                            {completed ? (
                              <CheckCircle2 size={16} />
                            ) : (
                              idx + 1
                            )}
                          </div>
                        </div>

                        {/* Milestone Content */}
                        <div className="flex-1 pt-0.5">
                          <h4 className="text-sm font-semibold text-themed">
                            {ms.title}
                          </h4>
                          {ms.description && (
                            <p className="mt-0.5 text-xs text-themed-secondary line-clamp-2">
                              {ms.description}
                            </p>
                          )}

                          {/* Milestone date */}
                          {msDate && (
                            <span className="mt-1 inline-flex items-center gap-1 text-xs text-themed-muted">
                              <Calendar size={10} />
                              {format(msDate, 'MMM d, yyyy')}
                            </span>
                          )}

                          {/* Weekly Objectives Preview */}
                          {ms.weeklyObjectives && ms.weeklyObjectives.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {ms.weeklyObjectives.slice(0, 3).map((wo) => (
                                <div
                                  key={wo.id}
                                  className="flex items-center gap-2 rounded-lg bg-[var(--background)] px-2.5 py-1.5 text-xs text-themed-secondary"
                                >
                                  <ChevronRight
                                    size={12}
                                    className="flex-shrink-0 text-ascend-500"
                                  />
                                  <span className="line-clamp-1">
                                    {wo.title}
                                  </span>
                                  {wo.dailyTasks && wo.dailyTasks.length > 0 && (
                                    <span className="ml-auto flex-shrink-0 text-xs text-themed-muted">
                                      {wo.dailyTasks.length} task
                                      {wo.dailyTasks.length !== 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                              ))}
                              {ms.weeklyObjectives.length > 3 && (
                                <p className="pl-2.5 text-xs text-themed-muted">
                                  +{ms.weeklyObjectives.length - 3} more week
                                  {ms.weeklyObjectives.length - 3 !== 1
                                    ? 's'
                                    : ''}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* -- Linked Habits -------------------------------------------- */}
            {linkedHabits.length > 0 && (
              <div className="mb-2">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-themed-muted">
                  <Flame size={14} className="text-ascend-500" />
                  Supporting Habits
                </h3>

                <div className="grid gap-2 sm:grid-cols-2">
                  {linkedHabits.map((habit) => {
                    const hCat =
                      CATEGORY_MAP[habit.category] ?? CATEGORY_MAP.general;
                    return (
                      <div
                        key={habit.id}
                        className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5"
                      >
                        <span className="text-base">{hCat.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-themed">
                            {habit.name}
                          </p>
                          <p className="text-xs text-themed-muted">
                            {hCat.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* -- Action Buttons ---------------------------------------------- */}
          <div className="border-t border-[var(--border)] bg-[var(--background)] px-6 py-4 sm:px-8">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={onViewFullPlan}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-transparent px-5 py-2.5 text-sm font-medium text-themed-secondary transition-colors hover:bg-white/5 hover:text-themed"
              >
                <Target size={15} />
                View Full Plan
              </button>

              <div className="flex gap-2.5">
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-transparent px-5 py-2.5 text-sm font-medium text-themed-secondary transition-colors hover:bg-white/5 hover:text-themed"
                >
                  <Settings2 size={15} />
                  Customize
                </button>

                <button
                  onClick={onStartDay1}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-ascend-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ascend-500/25 transition-all hover:bg-ascend-600 hover:shadow-ascend-500/40"
                >
                  <Rocket size={15} />
                  Start Day 1
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
