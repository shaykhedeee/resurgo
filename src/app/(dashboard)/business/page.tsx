'use client';

import { useMutation, useQuery, useAction } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { useState, FormEvent } from 'react';
import { Briefcase, TrendingUp, Plus, Trash2, CheckCircle, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const GOAL_TYPES = [
  { id: 'revenue', label: 'Revenue', icon: '💰' },
  { id: 'clients', label: 'Clients', icon: '🤝' },
  { id: 'launch', label: 'Launch', icon: '🚀' },
  { id: 'growth', label: 'Growth', icon: '📈' },
  { id: 'product', label: 'Product', icon: '📦' },
  { id: 'marketing', label: 'Marketing', icon: '📣' },
  { id: 'operations', label: 'Operations', icon: '⚙️' },
] as const;

type GoalType = typeof GOAL_TYPES[number]['id'];

export default function BusinessPage() {
  const goals = useQuery(api.businessGoals.listBusinessGoals, {});
  const createGoal = useMutation(api.businessGoals.createBusinessGoal);
  const updateGoal = useMutation(api.businessGoals.updateBusinessGoal);
  const deleteGoal = useMutation(api.businessGoals.deleteBusinessGoal);
  const _toggleMilestone = useMutation(api.businessGoals.toggleMilestone);
  const generateTasks = useAction(api.businessGoals.generateBusinessTasks);

  const [showForm, setShowForm] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [savingGoal, setSavingGoal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    type: 'revenue' as GoalType,
    businessName: '',
    target: '',
    unit: '',
    deadline: '',
    description: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (savingGoal) return;
    setSavingGoal(true);
    try {
      await createGoal({
        title: form.title,
        type: form.type,
        businessName: form.businessName || undefined,
        target: form.target ? parseFloat(form.target) : undefined,
        unit: form.unit || undefined,
        deadline: form.deadline || undefined,
        description: form.description || undefined,
      });
      setForm({ title: '', type: 'revenue', businessName: '', target: '', unit: '', deadline: '', description: '' });
      setShowForm(false);
    } finally {
      setSavingGoal(false);
    }
  };

  const handleGenerate = async (goalId: string) => {
    setGeneratingFor(goalId);
    try {
      await generateTasks({ goalId: goalId as Id<'businessGoals'> });
    } finally {
      setGeneratingFor(null);
    }
  };

  const activeGoals = goals?.filter((g: { status: string }) => g.status === 'active') ?? [];
  const completedGoals = goals?.filter((g: { status: string }) => g.status === 'completed') ?? [];

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-5 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">ENTERPRISE :: BUSINESS_COMMAND_CENTER</span>
          </div>
          <div className="flex items-start justify-between px-5 py-4">
            <div>
              <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Business Engine</h1>
              <p className="mt-0.5 font-mono text-xs tracking-widest text-zinc-500">Revenue · Clients · Launch · Growth</p>
            </div>
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 border border-orange-800 bg-orange-950/30 px-4 py-2 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/60">
              <Plus className="h-3 w-3" /> [NEW_GOAL]
            </button>
          </div>
          {/* Stats */}
          {goals && (
            <div className="grid grid-cols-3 border-t border-zinc-900">
              {[
                { label: 'ACTIVE', value: activeGoals.length },
                { label: 'COMPLETED', value: completedGoals.length },
                { label: 'TOTAL', value: goals.length },
              ].map(({ label, value }) => (
                <div key={label} className="border-r border-zinc-900 px-5 py-3 last:border-r-0">
                  <p className="font-mono text-xs tracking-widest text-zinc-400">{label}</p>
                  <p className="mt-1 font-mono text-xl font-bold text-orange-500">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="mb-5 border border-zinc-900 bg-zinc-950">
            <div className="border-b border-zinc-900 px-4 py-2.5">
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">CREATE_BUSINESS_GOAL</span>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Goal title *" required
                className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
              <div className="flex flex-wrap gap-1.5">
                {GOAL_TYPES.map(({ id, label, icon }) => (
                  <button key={id} type="button" onClick={() => setForm({ ...form, type: id })}
                    className={cn('border px-3 py-1 font-mono text-xs tracking-widest transition',
                      form.type === id ? 'border-orange-800 bg-orange-950/30 text-orange-500' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    )}>
                    {icon} {label.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} placeholder="Business name (optional)"
                  className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
                <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 focus:border-orange-800 focus:outline-none" />
                <input type="number" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} placeholder="Target value (e.g. 10000)"
                  className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
                <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="Unit (e.g. $, clients, users)"
                  className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
              </div>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)..." rows={2}
                className="w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
              <div className="flex gap-2">
                <button type="submit" disabled={savingGoal}
                  className="border border-orange-800 bg-orange-950/30 px-6 py-2 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/60 disabled:opacity-40">
                  {savingGoal ? 'CREATING_' : '[CREATE_GOAL]'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="border border-zinc-800 px-4 py-2 font-mono text-xs tracking-widest text-zinc-400 transition hover:border-zinc-700">
                  [CANCEL]
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Goals List */}
        {(!goals || goals.length === 0) ? (
          <div className="border border-dashed border-zinc-800 bg-zinc-950 py-16 text-center">
            <Briefcase className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
            <p className="font-mono text-xs tracking-widest text-zinc-400">NO_BUSINESS_GOALS_YET</p>
            <p className="mt-1 font-mono text-xs text-zinc-800">Create your first goal to get AI-generated action tasks</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...activeGoals, ...completedGoals].map((goal: any) => {
              const isExpanded = expandedGoal === goal._id;
              const progress = goal.target && goal.current ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
              const typeInfo = GOAL_TYPES.find((t) => t.id === goal.type);
              return (
                <div key={goal._id} className={cn('border bg-zinc-950 transition', goal.status === 'completed' ? 'border-green-900/50' : 'border-zinc-900')}>
                  <div className="flex items-start gap-3 p-4">
                    <span className="mt-0.5 text-lg">{typeInfo?.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn('font-mono text-sm font-bold', goal.status === 'completed' ? 'text-green-500 line-through' : 'text-zinc-200')}>
                          {goal.title}
                        </span>
                        {goal.businessName && (
                          <span className="border border-zinc-800 px-1.5 py-0.5 font-mono text-xs tracking-widest text-zinc-400">{goal.businessName.toUpperCase()}</span>
                        )}
                        <span className={cn('ml-auto border px-2 py-0.5 font-mono text-xs tracking-widest',
                          goal.status === 'completed' ? 'border-green-900 text-green-600' : 'border-orange-900 text-orange-600'
                        )}>{goal.status.toUpperCase()}</span>
                      </div>
                      {goal.target && (
                        <div className="mt-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-zinc-400">
                              {goal.current ?? 0} / {goal.target} {goal.unit ?? ''}
                            </span>
                            <span className="font-mono text-xs font-bold text-orange-500">{progress}%</span>
                          </div>
                          <div className="mt-1 h-1 w-full bg-zinc-900">
                            <div className="h-1 bg-orange-600 transition-all" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      )}
                      {goal.deadline && (
                        <p className="mt-1 font-mono text-xs text-zinc-400">DEADLINE: {goal.deadline}</p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setExpandedGoal(isExpanded ? null : goal._id)}
                        className="p-1 text-zinc-400 hover:text-zinc-400">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      <button onClick={() => deleteGoal({ id: goal._id })}
                        className="p-1 text-zinc-400 hover:text-red-500 transition">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-zinc-900 p-4 space-y-4">
                      {/* Update current value */}
                      {goal.target && (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs tracking-widest text-zinc-400">UPDATE_PROGRESS:</span>
                          <input type="number" defaultValue={goal.current ?? ''} placeholder="Current value"
                            className="h-7 w-28 border border-zinc-800 bg-black px-2 font-mono text-xs text-zinc-300 focus:border-orange-800 focus:outline-none"
                            onBlur={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val)) updateGoal({ id: goal._id, current: val });
                            }} />
                          <span className="font-mono text-xs text-zinc-400">{goal.unit}</span>
                        </div>
                      )}

                      {/* AI Tasks */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-mono text-xs tracking-widest text-zinc-500">AI_ACTION_TASKS</span>
                          <button onClick={() => handleGenerate(goal._id)} disabled={generatingFor === goal._id}
                            className="flex items-center gap-1 border border-orange-900 px-2.5 py-1 font-mono text-xs tracking-widest text-orange-600 transition hover:bg-orange-950/20 disabled:opacity-40">
                            <Zap className="h-3 w-3" />
                            {generatingFor === goal._id ? 'GENERATING_' : '[GENERATE]'}
                          </button>
                        </div>
                        {goal.aiTasks && goal.aiTasks.length > 0 ? (
                          <ul className="space-y-1">
                            {goal.aiTasks.map((task: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <TrendingUp className="mt-0.5 h-3 w-3 shrink-0 text-orange-600" />
                                <span className="font-mono text-xs text-zinc-400">{task}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="font-mono text-xs text-zinc-400">Click [GENERATE] to get AI-powered action tasks for this goal</p>
                        )}
                      </div>

                      {/* Status controls */}
                      <div className="flex gap-2">
                        {goal.status !== 'completed' && (
                          <button onClick={() => updateGoal({ id: goal._id, status: 'completed' })}
                            className="flex items-center gap-1 border border-green-900 px-3 py-1.5 font-mono text-xs tracking-widest text-green-600 transition hover:bg-green-950/20">
                            <CheckCircle className="h-3 w-3" /> [MARK_COMPLETE]
                          </button>
                        )}
                        {goal.status === 'active' && (
                          <button onClick={() => updateGoal({ id: goal._id, status: 'paused' })}
                            className="flex items-center gap-1 border border-zinc-800 px-3 py-1.5 font-mono text-xs tracking-widest text-zinc-400 transition hover:border-zinc-700">
                            [PAUSE]
                          </button>
                        )}
                        {goal.status === 'paused' && (
                          <button onClick={() => updateGoal({ id: goal._id, status: 'active' })}
                            className="flex items-center gap-1 border border-blue-900 px-3 py-1.5 font-mono text-xs tracking-widest text-blue-600 transition hover:bg-blue-950/20">
                            [RESUME]
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
