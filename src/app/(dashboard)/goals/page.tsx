'use client';

// -----------------------------------------------------------------------------
// Resurgo � Goals Command Center
// -----------------------------------------------------------------------------

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Clock, X } from 'lucide-react';

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

        {/* -- CORE OBJECTIVES HEADER -- */}
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">CORE_OBJECTIVES :: STRATEGIC_PLANNING</span>
          </div>
          <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Goals</h1>
              <p className="mt-1 font-mono text-xs tracking-widest text-zinc-400">Define what matters � Track your progress toward each goal</p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 border border-orange-800 bg-orange-950/30 px-4 py-2 font-mono text-xs tracking-widest text-orange-500 transition hover:border-orange-600 hover:bg-orange-950/60"
            >
              <Plus className="h-3.5 w-3.5" /> DEFINE_OBJECTIVE
            </button>
          </div>
          <div className="grid grid-cols-2 gap-px border-t border-zinc-900 sm:grid-cols-4">
            <ObjMetric label="ACTIVE" value={String(activeGoals.length)} />
            <ObjMetric label="COMPLETED" value={String(completedGoals.length)} />
            <ObjMetric label="AVG_INTEGRITY" value={`${avgProgress}%`} />
            <ObjMetric label="DOMAINS" value={String(domainBreakdown.length)} />
          </div>
        </div>

        {/* -- DOMAIN FILTERS -- */}
        <div className="mb-4 flex flex-wrap gap-px">
          <button
            onClick={() => setFilterDomain(null)}
            className={`border px-3 py-1.5 font-mono text-[10px] tracking-widest transition ${
              !filterDomain ? 'border-orange-800 bg-orange-950/20 text-orange-500' : 'border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-zinc-300'
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
                className={`border px-3 py-1.5 font-mono text-[10px] tracking-widest transition ${
                  filterDomain === domain ? 'border-orange-800 bg-orange-950/20 text-orange-500' : 'border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-zinc-300'
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
            <p className="mt-2 font-mono text-[10px] text-zinc-400">Define a core objective to drive your habits and tasks.</p>
            <button onClick={() => setShowCreate(true)} className="mt-4 inline-flex items-center gap-1 border border-zinc-800 bg-zinc-900 px-4 py-2 font-mono text-[10px] tracking-widest text-zinc-500 transition hover:border-orange-900 hover:text-orange-500">
              <Plus className="h-3 w-3" /> DEFINE_OBJECTIVE
            </button>
          </div>
        )}

        {/* -- ACTIVE OBJECTIVES -- */}
        {activeGoals.length > 0 && (
          <section className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-orange-600" />
              <span className="font-mono text-[10px] tracking-widest text-orange-500">ACTIVE_OBJECTIVES [{activeGoals.length}]</span>
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
              <span className="font-mono text-[10px] tracking-widest text-zinc-400">COMPLETED_OBJECTIVES [{completedGoals.length}]</span>
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
              <div>
                <label className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">OBJECTIVE_TITLE *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Run a marathon, Learn Spanish..." className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" required autoFocus />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">DESCRIPTION</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does success look like?" rows={2} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">LIFE_DOMAIN</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none">
                    {LIFE_DOMAINS.map((d) => <option key={d} value={d}>{d.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">OBJECTIVE_TYPE</label>
                  <select value={goalType} onChange={(e) => setGoalType(e.target.value as typeof GOAL_TYPES[number])} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none">
                    {GOAL_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">TARGET_DATE</label>
                <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">WHY_IMPORTANT</label>
                <textarea value={whyImportant} onChange={(e) => setWhyImportant(e.target.value)} placeholder="Your motivation will anchor execution..." rows={2} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
              </div>
              <div className="flex gap-px pt-1">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 border border-zinc-800 bg-zinc-900 py-2.5 font-mono text-[10px] tracking-widest text-zinc-500 transition hover:text-zinc-300">[CANCEL]</button>
                <button type="submit" disabled={creating || !title.trim()} className="flex-1 border border-orange-800 bg-orange-950/40 py-2.5 font-mono text-[10px] tracking-widest text-orange-500 transition hover:bg-orange-950/70 disabled:opacity-40">
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
  return (
    <div className="bg-zinc-950 px-4 py-3 transition hover:bg-zinc-900">
          <p className="font-mono text-[9px] tracking-widest text-zinc-400">{label}</p>
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
      className="flex flex-col border border-zinc-900 bg-zinc-950 p-4 transition hover:border-zinc-700 hover:bg-zinc-900"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={`truncate font-mono text-sm ${isComplete ? 'text-zinc-400 line-through' : 'text-zinc-200'}`}>
            {goal.title.toUpperCase()}
          </p>
          {goal.description && (
            <p className="mt-1 line-clamp-1 font-mono text-[10px] text-zinc-400">{goal.description}</p>
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
        <span className={`border px-2 py-0.5 font-mono text-[9px] tracking-widest ${chipClass}`}>
          {domainKey.replace('_', '_').toUpperCase()}
        </span>
        {goal.goalType && (
          <span className="border border-zinc-800 px-2 py-0.5 font-mono text-[9px] tracking-widest text-zinc-400">
            {goal.goalType.replace('_', '_').toUpperCase()}
          </span>
        )}
        {goal.targetDate && (
          <span className="ml-auto flex items-center gap-1 font-mono text-[10px] text-zinc-400">
            <Clock className="h-3 w-3" /> {formatDate(goal.targetDate)}
          </span>
        )}
      </div>
    </Link>
  );
}
