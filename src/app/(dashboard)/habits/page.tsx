'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Habits Tracker Page
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { useState } from 'react';
import {
  Plus,
  Check,
  X,
  SkipForward,
} from 'lucide-react';
import { PixelArt } from '@/components/PixelArt';
import { PixelIcon } from '@/components/PixelIcon';

const FREQUENCIES = ['daily', 'weekdays', 'weekends', '3x_week', 'weekly', 'custom'] as const;
const TIMES_OF_DAY = ['morning', 'afternoon', 'evening', 'anytime'] as const;
const CATEGORIES = ['health', 'fitness', 'learning', 'mindfulness', 'productivity', 'social', 'creativity', 'other'] as const;
const HABIT_TYPES = ['yes_no', 'quantity', 'duration', 'negative', 'range', 'checklist'] as const;

type HabitStatsItem = {
  streakCurrent?: number;
  identityLabel?: string;
};

type HabitDisplayItem = HabitStatsItem & {
  _id: string;
  title: string;
  habitType?: string;
  category: string;
  frequency: string;
  streakLongest?: number;
  totalCompletions?: number;
  targetValue?: number;
  targetUnit?: string;
};

export default function HabitsPage() {
  const habits = useQuery(api.habits.listActive);
  const allHabits = useQuery(api.habits.listAll);
  const toggleComplete = useMutation(api.habits.toggleComplete);
  const skipHabit = useMutation(api.habits.skip);
  const createHabit = useMutation(api.habits.create);

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [tab, setTab] = useState<'active' | 'all'>('active');

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('health');
  const [frequency, setFrequency] = useState<typeof FREQUENCIES[number]>('daily');
  const [timeOfDay, setTimeOfDay] = useState<typeof TIMES_OF_DAY[number]>('morning');
  const [habitType, setHabitType] = useState<typeof HABIT_TYPES[number]>('yes_no');
  const [targetValue, setTargetValue] = useState('');
  const [targetUnit, setTargetUnit] = useState('');
  const [identityLabel, setIdentityLabel] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const displayHabits = tab === 'active' ? habits : allHabits;
  const allHabitItems = (allHabits ?? []) as Array<HabitStatsItem>;
  const displayHabitItems = (displayHabits ?? []) as Array<HabitDisplayItem>;
  const activeCount = habits?.length ?? 0;
  const totalCount = allHabits?.length ?? 0;
  const highestStreak = Math.max(0, ...allHabitItems.map((habit) => habit.streakCurrent || 0));
  const withIdentityCount = allHabitItems.filter((habit) => Boolean(habit.identityLabel)).length;
  const featuredHabit = displayHabitItems[0];

  const handleToggle = async (habitId: string) => {
    setToggling(habitId);
    try {
      await toggleComplete({ habitId: habitId as Id<"habits">, date: today });
    } catch (e) {
      console.error('Failed to toggle:', e);
    }
    setToggling(null);
  };

  const handleSkip = async (habitId: string) => {
    try {
      await skipHabit({ habitId: habitId as Id<"habits">, date: today });
    } catch (e) {
      console.error('Failed to skip:', e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      await createHabit({
        title: title.trim(),
        description: description || undefined,
        category,
        frequency,
        timeOfDay,
        habitType,
        targetValue: targetValue ? parseInt(targetValue) : undefined,
        targetUnit: targetUnit || undefined,
        identityLabel: identityLabel || undefined,
      });
      setTitle('');
      setDescription('');
      setIdentityLabel('');
      setTargetValue('');
      setTargetUnit('');
      setShowCreate(false);
    } catch (e) {
      console.error('Failed to create habit:', e);
    }
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-6xl">

        {/* -- NODE TRACKER HEADER -- */}
        <div className="surface-panel mb-6 overflow-hidden">
          <div className="surface-header">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="surface-kicker-accent">Habit system</span>
          </div>
          <div className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1.45fr)_320px]">
            <div>
              <div className="flex items-center gap-2">
                <PixelIcon name="loop" size={14} className="text-emerald-400" />
                <p className="surface-kicker">Behavioral subsystem</p>
              </div>
              <h1 className="surface-title mt-2">Habits</h1>
              <p className="surface-subtitle mt-2 max-w-2xl">Build identity-driven routines, keep the streak logic visible, and make every repeat feel like a satisfying little machine click.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="surface-chip">{activeCount} active rituals</span>
                <span className="surface-chip">{highestStreak} day peak</span>
                <span className="surface-chip">{withIdentityCount} identity linked</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => setShowCreate(true)}
                  className="action-tile text-orange-300 hover:text-orange-200"
                >
                  <PixelIcon name="sparkles" size={14} className="text-orange-400" />
                  <span className="font-terminal text-sm">Start ritual</span>
                </button>
              </div>
            </div>
            <div className="surface-panel-muted p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="surface-kicker-accent">Spotlight</p>
                  <p className="mt-2 font-terminal text-lg font-semibold text-zinc-100">{featuredHabit?.title ?? 'Create the habit you want to become known for'}</p>
                  <p className="mt-2 font-terminal text-sm text-zinc-400">{featuredHabit ? `${featuredHabit.streakCurrent ?? 0} day streak • ${featuredHabit.frequency.replace('_', ' ')}` : 'Small loops build the system faster than heroic bursts.'}</p>
                </div>
                <PixelArt variant="habits" className="h-20 w-20" title="Habits pixel art" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px border-t border-zinc-900 sm:grid-cols-4">
            <NodeMetric label="ACTIVE_RITUALS" value={String(activeCount)} />
            <NodeMetric label="TOTAL_RITUALS" value={String(totalCount)} />
            <NodeMetric label="BEST_STREAK" value={`${highestStreak}D`} />
            <NodeMetric label="ID_LINKED" value={String(withIdentityCount)} />
          </div>
        </div>

        {/* -- TABS -- */}
        <div className="surface-panel-muted mb-4 flex gap-px overflow-hidden p-1">
          {(['active', 'all'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 border-b-2 px-4 py-2.5 font-mono text-xs tracking-widest transition ${
                tab === t
                  ? 'border-orange-600 bg-orange-950/20 text-orange-500'
                  : 'border-transparent bg-transparent text-zinc-400 hover:text-zinc-300'
              }`}
            >
              {t === 'active' ? `ACTIVE_RITUALS [${activeCount}]` : `ALL_RITUALS [${totalCount}]`}
            </button>
          ))}
        </div>

        {/* -- NODE LIST -- */}
        {!displayHabits || displayHabits.length === 0 ? (
          <div className="border border-dashed border-zinc-800 py-16 text-center">
            <p className="font-mono text-xs tracking-widest text-zinc-400">No habits yet</p>
            <p className="mt-2 font-mono text-xs text-zinc-400">Create your first habit to start building streaks.</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-4 border border-zinc-800 bg-zinc-900 px-4 py-2 font-mono text-xs tracking-widest text-zinc-500 transition hover:border-orange-900 hover:text-orange-500"
            >
              <Plus className="mr-1 inline h-3 w-3" /> NEW_RITUAL
            </button>
          </div>
        ) : (
          <div className="space-y-px">
            {displayHabitItems.map((habit) => (
              <div
                key={habit._id}
                className="group surface-panel p-4 transition hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggle(habit._id)}
                    disabled={toggling === habit._id}
                    className="flex h-11 w-11 shrink-0 items-center justify-center border border-zinc-800 text-zinc-400 transition hover:border-orange-600 hover:text-orange-500 disabled:opacity-50"
                  >
                    {toggling === habit._id ? (
                      <div className="h-4 w-4 animate-spin border border-orange-600 border-t-transparent" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-mono text-sm text-zinc-200">{habit.title.toUpperCase()}</p>
                      {habit.habitType && habit.habitType !== 'yes_no' && (
                        <span className="border border-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-400">
                          {habit.habitType.replace('_', '/').toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 font-mono text-xs text-zinc-400">
                      <span>{habit.category.toUpperCase()}</span>
                      <span>::</span>
                      <span>{habit.frequency.replace('_', '_').toUpperCase()}</span>
                      {habit.identityLabel && (
                        <span className="text-orange-700">IDENTITY_{habit.identityLabel.toUpperCase().replace(/ /g, '_')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-mono text-base font-bold text-orange-500">STREAK_{habit.streakCurrent}D</p>
                      <p className="font-mono text-xs text-zinc-400">BEST_{habit.streakLongest}D</p>
                    </div>
                    <button
                      onClick={() => handleSkip(habit._id)}
                      className="flex h-10 w-10 items-center justify-center border border-transparent font-mono text-xs text-zinc-400 transition hover:border-zinc-800 hover:text-zinc-400"
                      title="Skip today"
                    >
                      <SkipForward className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {habit.targetValue && habit.targetValue > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-px bg-zinc-900">
                      <div
                        className="h-px bg-orange-600"
                        style={{ width: `${Math.min(100, ((habit.totalCompletions || 0) / habit.targetValue) * 100)}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-zinc-400">
                      {habit.totalCompletions || 0}/{habit.targetValue}{habit.targetUnit ? `_${habit.targetUnit.toUpperCase()}` : ''}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-3">
              <span className="font-mono text-xs tracking-widest text-orange-500">NEW_RITUAL :: CREATE_BEHAVIORAL_ROUTINE</span>
              <button onClick={() => setShowCreate(false)} className="text-zinc-400 transition hover:text-zinc-300">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="max-h-[80vh] overflow-y-auto p-5 space-y-4">
              <div className="surface-panel-muted p-3">
                <p className="surface-kicker-accent">Habit guidance</p>
                <p className="mt-2 font-terminal text-sm text-zinc-300">Name the behavior so it is easy to repeat tomorrow. Dramatic reinventions can wait outside.</p>
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">RITUAL_NAME *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Meditate, Read, Exercise..."
                  className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none"
                  required autoFocus
                />
              </div>

              <div>
                <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">IDENTITY_LABEL</label>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-zinc-400">I_AM::</span>
                  <input
                    value={identityLabel}
                    onChange={(e) => setIdentityLabel(e.target.value)}
                    placeholder="a_reader, a_healthy_person"
                    className="flex-1 border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">CATEGORY</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value as typeof CATEGORIES[number])} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">FREQUENCY</label>
                  <select value={frequency} onChange={(e) => setFrequency(e.target.value as typeof FREQUENCIES[number])} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none">
                    {FREQUENCIES.map((f) => <option key={f} value={f}>{f.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">TIME_WINDOW</label>
                  <select value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value as typeof TIMES_OF_DAY[number])} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none">
                    {TIMES_OF_DAY.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">RITUAL_TYPE</label>
                  <select value={habitType} onChange={(e) => setHabitType(e.target.value as typeof HABIT_TYPES[number])} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none">
                    {HABIT_TYPES.map((h) => <option key={h} value={h}>{h.replace('_', '/')}</option>)}
                  </select>
                </div>
              </div>

              {habitType !== 'yes_no' && habitType !== 'negative' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">TARGET_VALUE</label>
                    <input type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="30" className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">TARGET_UNIT</label>
                    <input value={targetUnit} onChange={(e) => setTargetUnit(e.target.value)} placeholder="minutes, reps" className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">DESCRIPTION</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Why is this node important?" rows={2} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
              </div>

              <div className="flex gap-px pt-1">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 border border-zinc-800 bg-zinc-900 py-2.5 font-mono text-xs tracking-widest text-zinc-500 transition hover:text-zinc-300">
                  [CANCEL]
                </button>
                <button type="submit" disabled={creating || !title.trim()} className="flex-1 border border-orange-800 bg-orange-950/40 py-2.5 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/70 disabled:opacity-40">
                  {creating ? 'CREATING...' : '[LAUNCH_RITUAL]'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function NodeMetric({ label, value }: { label: string; value: string }) {
  const iconMap: Record<string, Parameters<typeof PixelIcon>[0]['name']> = {
    ACTIVE_RITUALS: 'habits',
    TOTAL_RITUALS: 'grid',
    BEST_STREAK: 'fire',
    ID_LINKED: 'loop',
  };
  return (
    <div className="metric-tile">
      <div className="flex items-center gap-2">
        <PixelIcon name={iconMap[label] ?? 'habits'} size={13} className="text-zinc-500" />
        <p className="metric-label">{label}</p>
      </div>
      <p className="mt-0.5 font-mono text-lg font-bold text-zinc-100">{value}</p>
    </div>
  );
}
