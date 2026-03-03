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
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">NODE_TRACKER :: BEHAVIORAL_SUBSYSTEM</span>
          </div>
          <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Habits</h1>
              <p className="mt-1 font-mono text-xs tracking-widest text-zinc-400">
                Build identity-driven routines � Monitor streak integrity
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 border border-orange-800 bg-orange-950/30 px-4 py-2 font-mono text-xs tracking-widest text-orange-500 transition hover:border-orange-600 hover:bg-orange-950/60"
            >
              <Plus className="h-3.5 w-3.5" /> INIT_NODE
            </button>
          </div>
          <div className="grid grid-cols-2 gap-px border-t border-zinc-900 sm:grid-cols-4">
            <NodeMetric label="ACTIVE_NODES" value={String(activeCount)} />
            <NodeMetric label="TOTAL_NODES" value={String(totalCount)} />
            <NodeMetric label="PEAK_UPTIME" value={`${highestStreak}D`} />
            <NodeMetric label="ID_LINKED" value={String(withIdentityCount)} />
          </div>
        </div>

        {/* -- TABS -- */}
        <div className="mb-4 flex gap-px border border-zinc-900">
          {(['active', 'all'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 border-b-2 px-4 py-2.5 font-mono text-xs tracking-widest transition ${
                tab === t
                  ? 'border-orange-600 bg-orange-950/20 text-orange-500'
                  : 'border-transparent bg-zinc-950 text-zinc-400 hover:text-zinc-300'
              }`}
            >
              {t === 'active' ? `ACTIVE_NODES [${activeCount}]` : `ALL_NODES [${totalCount}]`}
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
              <Plus className="mr-1 inline h-3 w-3" /> INIT_NODE
            </button>
          </div>
        ) : (
          <div className="space-y-px">
            {displayHabitItems.map((habit) => (
              <div
                key={habit._id}
                className="group border border-zinc-900 bg-zinc-950 p-4 transition hover:border-zinc-700 hover:bg-zinc-900"
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
                      <p className="font-mono text-base font-bold text-orange-500">UPTIME_{habit.streakCurrent}D</p>
                      <p className="font-mono text-xs text-zinc-400">PEAK_{habit.streakLongest}D</p>
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
              <span className="font-mono text-xs tracking-widest text-orange-500">INIT_NODE :: CREATE_BEHAVIORAL_ROUTINE</span>
              <button onClick={() => setShowCreate(false)} className="text-zinc-400 transition hover:text-zinc-300">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="max-h-[80vh] overflow-y-auto p-5 space-y-4">
              <div>
                <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">NODE_TITLE *</label>
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
                  <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">NODE_TYPE</label>
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
                  {creating ? 'INITIALIZING...' : '[DEPLOY_NODE]'}
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
  return (
    <div className="bg-zinc-950 px-4 py-3 transition hover:bg-zinc-900">
          <p className="font-mono text-xs tracking-widest text-zinc-400">{label}</p>
      <p className="mt-0.5 font-mono text-lg font-bold text-zinc-100">{value}</p>
    </div>
  );
}
