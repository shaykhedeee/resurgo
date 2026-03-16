'use client';

// -----------------------------------------------------------------------------
// Resurgo - Goals Command Center
// -----------------------------------------------------------------------------

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Clock, X } from 'lucide-react';
import { PixelArt } from '@/components/PixelArt';
import { PixelIcon } from '@/components/PixelIcon';

const LIFE_DOMAINS = [
  'health', 'career', 'finance', 'learning',
  'relationships', 'creativity', 'mindfulness', 'personal_growth',
] as const;

const GOAL_TYPES = [
  'achievement', 'transformation', 'skill', 'project',
  'quantitative', 'maintenance', 'elimination', 'relationship',
] as const;

const DOMAIN_COLORS: Record<string, string> = {
  health: 'border-zinc-800 text-zinc-500',
  career: 'border-zinc-800 text-zinc-500',
  finance: 'border-zinc-800 text-zinc-500',
  learning: 'border-zinc-800 text-zinc-500',
  relationships: 'border-zinc-800 text-zinc-500',
  creativity: 'border-zinc-800 text-zinc-500',
  mindfulness: 'border-zinc-800 text-zinc-500',
  personal_growth: 'border-orange-900 text-orange-700',
};

type GoalItem = {
  _id: string;
  title: string;
  description?: string;
  status: string;
  progress?: number;
  lifeDomain?: string;
  category?: string;
  goalType?: string;
  targetDate?: string;
};

export default function GoalsPage() {
  const goals = useQuery(api.goals.listAll);
  const createGoal = useMutation(api.goals.create);
  const [showCreate, setShowCreate] = useState(false);
  const [filterDomain, setFilterDomain] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('personal_growth');
  const [goalType, setGoalType] = useState<typeof GOAL_TYPES[number]>('achievement');
  const [targetDate, setTargetDate] = useState('');
  const [whyImportant, setWhyImportant] = useState('');

  const allGoals = (goals ?? []) as Array<GoalItem>;
  const filteredGoals = allGoals.filter((g) =>
    !filterDomain || g.lifeDomain === filterDomain || g.category === filterDomain
  );
  const activeGoals = filteredGoals.filter((g) => g.status === 'in_progress');
  const completedGoals = filteredGoals.filter((g) => g.status === 'completed');
  const nextGoal = activeGoals[0];

  const domainBreakdown = LIFE_DOMAINS.map((d) => ({
    domain: d,
    count: allGoals.filter((g) => g.lifeDomain === d || g.category === d).length,
  })).filter((x) => x.count > 0);

  const avgProgress =
    activeGoals.length > 0
      ? Math.round(activeGoals.reduce((sum, g) => sum + (g.progress ?? 0), 0) / activeGoals.length)
      : 0;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      await createGoal({
        title: title.trim(),
        description: description || undefined,
        category,
        goalType,
        lifeDomain: category as typeof LIFE_DOMAINS[number],
        targetDate: targetDate || undefined,
        whyImportant: whyImportant || undefined,
      });
      setTitle('');
      setDescription('');
      setTargetDate('');
      setWhyImportant('');
      setShowCreate(false);
    } catch (err) {
      console.error('Failed to create goal:', err);
    }
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-6xl">

        {/* -- GOALS HEADER -- */}
        <div className="surface-panel mb-6 overflow-hidden">
          <div className="surface-header">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="surface-kicker-accent">Goals</span>
          </div>
          <div className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1.45fr)_320px]">
            <div>
              <div className="flex items-center gap-2">
                <PixelIcon name="goals" size={14} className="text-orange-400" />
                <p className="surface-kicker">Strategic planning</p>
              </div>
              <h1 className="surface-title mt-2">Goals</h1>
              <p className="surface-subtitle mt-2 max-w-2xl">Define what matters, keep progress visible, and reduce the odds of drifting into busywork with impressive typography.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="surface-chip">{activeGoals.length} active</span>
                <span className="surface-chip">{completedGoals.length} completed</span>
                <span className="surface-chip">{avgProgress}% average progress</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => setShowCreate(true)}
                  className="action-tile text-orange-300 hover:text-orange-200"
                >
                  <PixelIcon name="sparkles" size={14} className="text-orange-400" />
                  <span className="font-terminal text-sm">Define objective</span>
                </button>
              </div>
            </div>
            <div className="surface-panel-muted p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="surface-kicker-accent">Priority objective</p>
                  <p className="mt-2 font-terminal text-lg font-semibold text-zinc-100">{nextGoal?.title ?? 'Create the first goal that changes your week'}</p>
                  <p className="mt-2 font-terminal text-sm text-zinc-400">{nextGoal ? `${nextGoal.progress ?? 0}% complete${nextGoal.targetDate ? ` • target ${formatDate(nextGoal.targetDate)}` : ''}` : 'One clear objective beats twelve noble vibes.'}</p>
                </div>
                <PixelArt variant="goals" className="h-20 w-20" title="Goals pixel art" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px border-t border-zinc-900 sm:grid-cols-4">
            <ObjMetric label="ACTIVE" value={String(activeGoals.length)} />
            <ObjMetric label="COMPLETED" value={String(completedGoals.length)} />
            <ObjMetric label="AVG_INTEGRITY" value={`${avgProgress}%`} />
            <ObjMetric label="DOMAINS" value={String(domainBreakdown.length)} />
          </div>
        </div>

        {/* -- DOMAIN FILTERS -- */}
        <div className="surface-panel-muted mb-4 flex flex-wrap gap-2 p-2">
          <button
            onClick={() => setFilterDomain(null)}
            className={`border px-3 py-1.5 font-mono text-xs tracking-widest transition ${
              !filterDomain ? 'border-orange-800 bg-orange-950/20 text-orange-500' : 'border-zinc-900 bg-transparent text-zinc-400 hover:text-zinc-300'
            }`}
          >
            ALL [{allGoals.length}]
          </button>
          {LIFE_DOMAINS.map((domain) => {
            const count = allGoals.filter((g) => g.lifeDomain === domain || g.category === domain).length;
            if (count === 0) return null;
            return (
              <button
                key={domain}
                onClick={() => setFilterDomain(filterDomain === domain ? null : domain)}
                className={`border px-3 py-1.5 font-mono text-xs tracking-widest transition ${
                  filterDomain === domain ? 'border-orange-800 bg-orange-950/20 text-orange-500' : 'border-zinc-900 bg-transparent text-zinc-400 hover:text-zinc-300'
                }`}
              >
                {domain.replace('_', '_').toUpperCase()} [{count}]
              </button>
            );
          })}
        </div>

        {/* -- EMPTY STATE -- */}
        {allGoals.length === 0 && (
          <div className="border border-dashed border-zinc-800 py-16 text-center">
            <p className="font-mono text-xs tracking-widest text-zinc-400">No goals defined yet</p>
            <p className="mt-2 font-mono text-xs text-zinc-400">Define a core objective to drive your habits and tasks.</p>
            <button onClick={() => setShowCreate(true)} className="mt-4 inline-flex items-center gap-1 border border-zinc-800 bg-zinc-900 px-4 py-2 font-mono text-xs tracking-widest text-zinc-500 transition hover:border-orange-900 hover:text-orange-500">
              <Plus className="h-3 w-3" /> DEFINE_OBJECTIVE
            </button>
          </div>
        )}

        {/* -- ACTIVE OBJECTIVES -- */}
        {activeGoals.length > 0 && (
          <section className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-orange-600" />
              <span className="font-mono text-xs tracking-widest text-orange-500">ACTIVE_OBJECTIVES [{activeGoals.length}]</span>
            </div>
            <div className="grid gap-px md:grid-cols-2">
              {activeGoals.map((goal) => (
                <GoalCard key={goal._id} goal={goal} />
              ))}
            </div>
          </section>
        )}

        {/* -- COMPLETED OBJECTIVES -- */}
        {completedGoals.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-zinc-600" />
              <span className="font-mono text-xs tracking-widest text-zinc-400">COMPLETED_OBJECTIVES [{completedGoals.length}]</span>
            </div>
            <div className="grid gap-px md:grid-cols-2">
              {completedGoals.map((goal) => (
                <GoalCard key={goal._id} goal={goal} />
              ))}
            </div>
          </section>
        )}

      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-3">
              <span className="font-mono text-xs tracking-widest text-orange-500">DEFINE_OBJECTIVE :: STRATEGIC_GOAL_MATRIX</span>
              <button onClick={() => setShowCreate(false)} className="text-zinc-400 transition hover:text-zinc-300">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="max-h-[80vh] overflow-y-auto p-5 space-y-4">
              <div className="surface-panel-muted p-3">
                <p className="surface-kicker-accent">Goal guidance</p>
                <p className="mt-2 font-terminal text-sm text-zinc-300">Write a goal you can review weekly and act on daily. Grandiosity is optional; clarity is not.</p>
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">OBJECTIVE_TITLE *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Run a marathon, Learn Spanish..." className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" required autoFocus />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">DESCRIPTION</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does success look like?" rows={2} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">LIFE_DOMAIN</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none">
                    {LIFE_DOMAINS.map((d) => <option key={d} value={d}>{d.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">OBJECTIVE_TYPE</label>
                  <select value={goalType} onChange={(e) => setGoalType(e.target.value as typeof GOAL_TYPES[number])} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none">
                    {GOAL_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">TARGET_DATE</label>
                <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">WHY_IMPORTANT</label>
                <textarea value={whyImportant} onChange={(e) => setWhyImportant(e.target.value)} placeholder="Your motivation will anchor execution..." rows={2} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
              </div>
              <div className="flex gap-px pt-1">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 border border-zinc-800 bg-zinc-900 py-3 font-mono text-sm tracking-widest text-zinc-500 transition hover:text-zinc-300 min-h-[48px]">[CANCEL]</button>
                <button type="submit" disabled={creating || !title.trim()} className="flex-1 border border-orange-800 bg-orange-950/40 py-3 font-mono text-sm tracking-widest text-orange-500 transition hover:bg-orange-950/70 disabled:opacity-40 min-h-[48px]">
                  {creating ? 'DEFINING...' : '[DEPLOY_OBJECTIVE]'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ObjMetric({ label, value }: { label: string; value: string }) {
  const iconMap: Record<string, Parameters<typeof PixelIcon>[0]['name']> = {
    ACTIVE: 'goals',
    COMPLETED: 'check',
    AVG_INTEGRITY: 'analytics',
    DOMAINS: 'grid',
  };
  return (
    <div className="metric-tile">
      <div className="flex items-center gap-2">
        <PixelIcon name={iconMap[label] ?? 'goals'} size={13} className="text-zinc-500" />
        <p className="metric-label">{label}</p>
      </div>
      <p className="mt-0.5 font-mono text-lg font-bold text-zinc-100">{value}</p>
    </div>
  );
}

function formatDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function GoalCard({ goal }: { goal: GoalItem }) {
  const domainKey = goal.lifeDomain || goal.category || 'personal_growth';
  const chipClass = DOMAIN_COLORS[domainKey] ?? DOMAIN_COLORS.personal_growth;
  const progress = goal.progress ?? 0;
  const isComplete = goal.status === 'completed';

  return (
    <Link
      href={`/goals/${goal._id}`}
      className="surface-panel flex flex-col p-4 transition hover:border-zinc-700 hover:bg-zinc-900"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={`truncate font-mono text-sm ${isComplete ? 'text-zinc-400 line-through' : 'text-zinc-200'}`}>
            {goal.title.toUpperCase()}
          </p>
          {goal.description && (
            <p className="mt-1 line-clamp-1 font-mono text-xs text-zinc-400">{goal.description}</p>
          )}
        </div>
        <span className={`shrink-0 font-mono text-base font-bold ${isComplete ? 'text-zinc-500' : 'text-orange-500'}`}>
          {progress}%
        </span>
      </div>
      <div className="mb-3 h-px w-full bg-zinc-900">
        <div className="h-px bg-orange-600 transition-all duration-700" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`border px-2 py-0.5 font-mono text-xs tracking-widest ${chipClass}`}>
          {domainKey.replace('_', '_').toUpperCase()}
        </span>
        {goal.goalType && (
          <span className="border border-zinc-800 px-2 py-0.5 font-mono text-xs tracking-widest text-zinc-400">
            {goal.goalType.replace('_', '_').toUpperCase()}
          </span>
        )}
        {goal.targetDate && (
          <span className="ml-auto flex items-center gap-1 font-mono text-xs text-zinc-400">
            <Clock className="h-3 w-3" /> {formatDate(goal.targetDate)}
          </span>
        )}
      </div>
    </Link>
  );
}
