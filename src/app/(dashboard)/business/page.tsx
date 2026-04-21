'use client';

import { useMutation, useQuery, useAction } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { useState, FormEvent } from 'react';
import { Briefcase, TrendingUp, Plus, Trash2, CheckCircle, Zap, ChevronDown, ChevronUp, Target, DollarSign, CreditCard } from 'lucide-react';
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
type MainTab = 'business' | 'wealth';
type WealthTab = 'net-worth' | 'debt-tracker' | 'savings-goals';

const ASSET_TYPES = ['savings', 'property', 'investment', 'crypto', 'vehicle', 'other'] as const;
const LIABILITY_TYPES = ['loan', 'credit_card', 'overdraft', 'mortgage', 'other'] as const;

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function BusinessPage() {
  const [mainTab, setMainTab] = useState<MainTab>('business');
  const [wealthTab, setWealthTab] = useState<WealthTab>('net-worth');

  // Business goals state
  const goals = useQuery(api.businessGoals.listBusinessGoals, {});
  const createGoal = useMutation(api.businessGoals.createBusinessGoal);
  const updateGoal = useMutation(api.businessGoals.updateBusinessGoal);
  const deleteGoal = useMutation(api.businessGoals.deleteBusinessGoal);
  const generateTasks = useAction(api.businessGoals.generateBusinessTasks);
  const [showForm, setShowForm] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [savingGoal, setSavingGoal] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'revenue' as GoalType, businessName: '', target: '', unit: '', deadline: '', description: '' });

  // Wealth state
  const assets = useQuery(api.wealth.listAssets);
  const liabilities = useQuery(api.wealth.listLiabilities);
  const financialGoals = useQuery(api.budget.listFinancialGoals);
  const addAsset = useMutation(api.wealth.addAsset);
  const deleteAsset = useMutation(api.wealth.deleteAsset);
  const addLiability = useMutation(api.wealth.addLiability);
  const deleteLiability = useMutation(api.wealth.deleteLiability);
  const recordSnapshot = useMutation(api.wealth.recordNetWorthSnapshot);

  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showAddLiability, setShowAddLiability] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState<typeof ASSET_TYPES[number]>('savings');
  const [assetValue, setAssetValue] = useState('');
  const [liabilityName, setLiabilityName] = useState('');
  const [liabilityType, setLiabilityType] = useState<typeof LIABILITY_TYPES[number]>('loan');
  const [liabilityBalance, setLiabilityBalance] = useState('');
  const [liabilityRate, setLiabilityRate] = useState('');
  const [liabilityMinPayment, setLiabilityMinPayment] = useState('');
  const [savingAsset, setSavingAsset] = useState(false);
  const [savingLiability, setSavingLiability] = useState(false);

  const totalAssets = (assets ?? []).reduce((s: number, a: any) => s + (a.value || 0), 0);
  const totalLiabilities = (liabilities ?? []).reduce((s: number, l: any) => s + (l.balance || 0), 0);
  const netWorth = totalAssets - totalLiabilities;

  const handleSubmitGoal = async (e: FormEvent) => {
    e.preventDefault();
    if (savingGoal) return;
    setSavingGoal(true);
    try {
      await createGoal({ title: form.title, type: form.type, businessName: form.businessName || undefined, target: form.target ? parseFloat(form.target) : undefined, unit: form.unit || undefined, deadline: form.deadline || undefined, description: form.description || undefined });
      setForm({ title: '', type: 'revenue', businessName: '', target: '', unit: '', deadline: '', description: '' });
      setShowForm(false);
    } finally { setSavingGoal(false); }
  };

  const handleGenerate = async (goalId: string) => {
    setGeneratingFor(goalId);
    try { await generateTasks({ goalId: goalId as Id<'businessGoals'> }); }
    finally { setGeneratingFor(null); }
  };

  const handleAddAsset = async (e: FormEvent) => {
    e.preventDefault();
    if (!assetName || !assetValue) return;
    setSavingAsset(true);
    try {
      const val = parseFloat(assetValue);
      await addAsset({ name: assetName, type: assetType, value: val });
      const newTotal = totalAssets + val;
      await recordSnapshot({ netWorth: newTotal - totalLiabilities, totalAssets: newTotal, totalLiabilities, month: new Date().toISOString().slice(0, 7) });
      setAssetName(''); setAssetValue(''); setShowAddAsset(false);
    } finally { setSavingAsset(false); }
  };

  const handleAddLiability = async (e: FormEvent) => {
    e.preventDefault();
    if (!liabilityName || !liabilityBalance) return;
    setSavingLiability(true);
    try {
      const bal = parseFloat(liabilityBalance);
      await addLiability({ name: liabilityName, type: liabilityType, balance: bal, interestRate: liabilityRate ? parseFloat(liabilityRate) : undefined, minimumPayment: liabilityMinPayment ? parseFloat(liabilityMinPayment) : undefined });
      const newTotal = totalLiabilities + bal;
      await recordSnapshot({ netWorth: totalAssets - newTotal, totalAssets, totalLiabilities: newTotal, month: new Date().toISOString().slice(0, 7) });
      setLiabilityName(''); setLiabilityBalance(''); setLiabilityRate(''); setLiabilityMinPayment(''); setShowAddLiability(false);
    } finally { setSavingLiability(false); }
  };

  const activeGoals = goals?.filter((g: { status: string }) => g.status === 'active') ?? [];
  const completedGoals = goals?.filter((g: { status: string }) => g.status === 'completed') ?? [];

  const avalancheOrder = [...(liabilities ?? [])].sort((a: any, b: any) => (b.interestRate ?? 0) - (a.interestRate ?? 0));
  const snowballOrder = [...(liabilities ?? [])].sort((a: any, b: any) => a.balance - b.balance);

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-5 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">ENTERPRISE :: COMMAND_CENTER</span>
          </div>
          <div className="flex items-start justify-between px-5 py-4">
            <div>
              <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Business & Wealth</h1>
              <p className="mt-0.5 font-mono text-xs tracking-widest text-zinc-500">Goals · Net Worth · Debt · Savings</p>
            </div>
          </div>

          {/* Main tabs */}
          <div className="flex border-t border-zinc-900">
            {(['business', 'wealth'] as MainTab[]).map((t) => (
              <button key={t} onClick={() => setMainTab(t)}
                className={cn('border-r border-zinc-900 px-6 py-2.5 font-mono text-xs tracking-widest transition',
                  mainTab === t ? 'bg-zinc-900 text-orange-500' : 'text-zinc-400 hover:text-zinc-300')}>
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* BUSINESS TAB */}
        {mainTab === 'business' && (
          <>
            {/* Stats */}
            {goals && (
              <div className="mb-5 grid grid-cols-3 border border-zinc-900 bg-zinc-950">
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

            <div className="mb-4 flex justify-end">
              <button onClick={() => setShowForm(true)}
                className="flex items-center gap-1.5 border border-orange-800 bg-orange-950/30 px-4 py-2 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/60">
                <Plus className="h-3 w-3" /> [NEW_GOAL]
              </button>
            </div>

            {showForm && (
              <div className="mb-5 border border-zinc-900 bg-zinc-950">
                <div className="border-b border-zinc-900 px-4 py-2.5">
                  <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">CREATE_BUSINESS_GOAL</span>
                </div>
                <form onSubmit={handleSubmitGoal} className="p-4 space-y-3">
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Goal title *" required
                    className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
                  <div className="flex flex-wrap gap-1.5">
                    {GOAL_TYPES.map(({ id, label, icon }) => (
                      <button key={id} type="button" onClick={() => setForm({ ...form, type: id })}
                        className={cn('border px-3 py-1 font-mono text-xs tracking-widest transition',
                          form.type === id ? 'border-orange-800 bg-orange-950/30 text-orange-500' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700')}>
                        {icon} {label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} placeholder="Business name (optional)"
                      className="h-9 border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
                    <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 focus:border-orange-800 focus:outline-none" />
                    <input type="number" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} placeholder="Target value"
                      className="h-9 border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
                    <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="Unit (e.g. $, clients)"
                      className="h-9 border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
                  </div>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)..." rows={2}
                    className="w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
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

            {(!goals || goals.length === 0) ? (
              <div className="border border-dashed border-zinc-800 bg-zinc-950 py-16 text-center">
                <Briefcase className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
                <p className="font-mono text-xs tracking-widest text-zinc-400">NO_BUSINESS_GOALS_YET</p>
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
                            <span className={cn('font-mono text-sm font-bold', goal.status === 'completed' ? 'text-green-500 line-through' : 'text-zinc-200')}>{goal.title}</span>
                            {goal.businessName && (
                              <span className="border border-zinc-800 px-1.5 py-0.5 font-mono text-xs tracking-widest text-zinc-400">{goal.businessName.toUpperCase()}</span>
                            )}
                            <span className={cn('ml-auto border px-2 py-0.5 font-mono text-xs tracking-widest', goal.status === 'completed' ? 'border-green-900 text-green-600' : 'border-orange-900 text-orange-600')}>{goal.status.toUpperCase()}</span>
                          </div>
                          {goal.target && (
                            <div className="mt-1">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs text-zinc-400">{goal.current ?? 0} / {goal.target} {goal.unit ?? ''}</span>
                                <span className="font-mono text-xs font-bold text-orange-500">{progress}%</span>
                              </div>
                              <div className="mt-1 h-1 w-full bg-zinc-900">
                                <div className="h-1 bg-orange-600 transition-all" style={{ width: `${progress}%` }} />
                              </div>
                            </div>
                          )}
                          {goal.deadline && <p className="mt-1 font-mono text-xs text-zinc-400">DEADLINE: {goal.deadline}</p>}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => setExpandedGoal(isExpanded ? null : goal._id)} className="p-1 text-zinc-400">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                          <button onClick={() => deleteGoal({ id: goal._id })} className="p-1 text-zinc-400 hover:text-red-500 transition">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="border-t border-zinc-900 p-4 space-y-4">
                          {goal.target && (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs tracking-widest text-zinc-400">UPDATE_PROGRESS:</span>
                              <input type="number" defaultValue={goal.current ?? ''} placeholder="Current value"
                                className="h-7 w-28 border border-zinc-800 bg-black px-2 font-mono text-xs text-zinc-300 focus:border-orange-800 focus:outline-none"
                                onBlur={(e) => { const val = parseFloat(e.target.value); if (!isNaN(val)) updateGoal({ id: goal._id, current: val }); }} />
                              <span className="font-mono text-xs text-zinc-400">{goal.unit}</span>
                            </div>
                          )}
                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="font-mono text-xs tracking-widest text-zinc-500">AI_ACTION_TASKS</span>
                              <button onClick={() => handleGenerate(goal._id)} disabled={generatingFor === goal._id}
                                className="flex items-center gap-1 border border-orange-900 px-2.5 py-1 font-mono text-xs tracking-widest text-orange-600 transition hover:bg-orange-950/20 disabled:opacity-40">
                                <Zap className="h-3 w-3" /> {generatingFor === goal._id ? 'GENERATING_' : '[GENERATE]'}
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
                              <p className="font-mono text-xs text-zinc-400">Click [GENERATE] to get AI-powered action tasks</p>
                            )}
                          </div>
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
          </>
        )}

        {/* WEALTH TAB */}
        {mainTab === 'wealth' && (
          <>
            {/* Net worth summary */}
            <div className="mb-5 grid grid-cols-3 border border-zinc-900 bg-zinc-950">
              <div className="border-r border-zinc-900 px-5 py-3">
                <p className="font-mono text-xs tracking-widest text-zinc-400">ASSETS</p>
                <p className="mt-1 font-mono text-xl font-bold text-green-500">{fmt(totalAssets)}</p>
              </div>
              <div className="border-r border-zinc-900 px-5 py-3">
                <p className="font-mono text-xs tracking-widest text-zinc-400">LIABILITIES</p>
                <p className="mt-1 font-mono text-xl font-bold text-red-500">{fmt(totalLiabilities)}</p>
              </div>
              <div className="px-5 py-3">
                <p className="font-mono text-xs tracking-widest text-zinc-400">NET_WORTH</p>
                <p className={cn('mt-1 font-mono text-xl font-bold', netWorth >= 0 ? 'text-orange-500' : 'text-red-500')}>{fmt(netWorth)}</p>
              </div>
            </div>

            {/* Net worth bar */}
            {(totalAssets + totalLiabilities) > 0 && (
              <div className="mb-5 border border-zinc-900 bg-zinc-950 p-4">
                <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">WEALTH_COMPOSITION</p>
                <div className="h-3 w-full overflow-hidden bg-zinc-900">
                  <div className="h-full bg-green-600 transition-all" style={{ width: `${Math.min(100, Math.round((totalAssets / (totalAssets + totalLiabilities)) * 100))}%` }} />
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="font-mono text-[10px] text-green-500">Assets {Math.round((totalAssets / (totalAssets + totalLiabilities)) * 100)}%</span>
                  <span className="font-mono text-[10px] text-red-500">Liabilities {Math.round((totalLiabilities / (totalAssets + totalLiabilities)) * 100)}%</span>
                </div>
              </div>
            )}

            {/* Wealth sub-tabs */}
            <div className="mb-4 flex border border-zinc-900">
              {(['net-worth', 'debt-tracker', 'savings-goals'] as WealthTab[]).map((t) => (
                <button key={t} onClick={() => setWealthTab(t)}
                  className={cn('flex-1 border-r border-zinc-900 py-2.5 font-mono text-xs tracking-widest transition last:border-r-0',
                    wealthTab === t ? 'bg-zinc-900 text-orange-500' : 'text-zinc-400 hover:text-zinc-300')}>
                  {t === 'net-worth' ? 'NET_WORTH' : t === 'debt-tracker' ? 'DEBT_TRACKER' : 'SAVINGS_GOALS'}
                </button>
              ))}
            </div>

            {/* NET WORTH sub-tab */}
            {wealthTab === 'net-worth' && (
              <div className="space-y-4">
                {/* Assets */}
                <div className="border border-zinc-900 bg-zinc-950">
                  <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2.5">
                    <span className="font-mono text-xs tracking-widest text-green-600">ASSETS ({(assets ?? []).length})</span>
                    <button onClick={() => setShowAddAsset(v => !v)}
                      className="flex items-center gap-1 border border-green-900 bg-green-950/20 px-3 py-1 font-mono text-xs text-green-500 hover:bg-green-950/40 transition">
                      <Plus className="h-3 w-3" /> ADD
                    </button>
                  </div>
                  {showAddAsset && (
                    <form onSubmit={handleAddAsset} className="border-b border-zinc-900 p-4">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input value={assetName} onChange={(e) => setAssetName(e.target.value)} placeholder="Asset name" required
                          className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-green-800 focus:outline-none" />
                        <input type="number" step="0.01" value={assetValue} onChange={(e) => setAssetValue(e.target.value)} placeholder="Value (USD)" required
                          className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-green-800 focus:outline-none" />
                      </div>
                      <div className="flex gap-2">
                        <select value={assetType} onChange={(e) => setAssetType(e.target.value as typeof ASSET_TYPES[number])}
                          className="h-9 flex-1 border border-zinc-800 bg-black px-2 font-mono text-xs text-zinc-300">
                          {ASSET_TYPES.map((t) => <option key={t}>{t}</option>)}
                        </select>
                        <button type="submit" disabled={savingAsset}
                          className="border border-green-800 bg-green-950/30 px-4 py-1.5 font-mono text-xs text-green-500 disabled:opacity-50">
                          {savingAsset ? 'SAVING_' : '[SAVE]'}
                        </button>
                      </div>
                    </form>
                  )}
                  {(assets ?? []).length === 0 ? (
                    <div className="py-8 text-center"><p className="font-mono text-xs text-zinc-500">NO_ASSETS_ADDED</p></div>
                  ) : (
                    <div className="divide-y divide-zinc-900">
                      {(assets ?? []).map((a: any) => (
                        <div key={a._id} className="flex items-center gap-3 px-4 py-3">
                          <DollarSign className="h-3.5 w-3.5 shrink-0 text-green-600" />
                          <div className="flex-1">
                            <p className="font-mono text-xs text-zinc-200">{a.name}</p>
                            <p className="font-mono text-[10px] text-zinc-500">{a.type}</p>
                          </div>
                          <p className="font-mono text-sm font-bold text-green-400">{fmt(a.value)}</p>
                          <button onClick={() => deleteAsset({ assetId: a._id })} className="text-zinc-500 hover:text-red-500 transition">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Liabilities */}
                <div className="border border-zinc-900 bg-zinc-950">
                  <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2.5">
                    <span className="font-mono text-xs tracking-widest text-red-600">LIABILITIES ({(liabilities ?? []).length})</span>
                    <button onClick={() => setShowAddLiability(v => !v)}
                      className="flex items-center gap-1 border border-red-900 bg-red-950/20 px-3 py-1 font-mono text-xs text-red-500 hover:bg-red-950/40 transition">
                      <Plus className="h-3 w-3" /> ADD
                    </button>
                  </div>
                  {showAddLiability && (
                    <form onSubmit={handleAddLiability} className="border-b border-zinc-900 p-4 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input value={liabilityName} onChange={(e) => setLiabilityName(e.target.value)} placeholder="Name (e.g. Student loan)" required
                          className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-red-800 focus:outline-none" />
                        <input type="number" step="0.01" value={liabilityBalance} onChange={(e) => setLiabilityBalance(e.target.value)} placeholder="Balance owed" required
                          className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-red-800 focus:outline-none" />
                        <input type="number" step="0.01" value={liabilityRate} onChange={(e) => setLiabilityRate(e.target.value)} placeholder="Interest rate %" 
                          className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-red-800 focus:outline-none" />
                        <input type="number" step="0.01" value={liabilityMinPayment} onChange={(e) => setLiabilityMinPayment(e.target.value)} placeholder="Min. payment/mo"
                          className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-red-800 focus:outline-none" />
                      </div>
                      <div className="flex gap-2">
                        <select value={liabilityType} onChange={(e) => setLiabilityType(e.target.value as typeof LIABILITY_TYPES[number])}
                          className="h-9 flex-1 border border-zinc-800 bg-black px-2 font-mono text-xs text-zinc-300">
                          {LIABILITY_TYPES.map((t) => <option key={t}>{t}</option>)}
                        </select>
                        <button type="submit" disabled={savingLiability}
                          className="border border-red-800 bg-red-950/30 px-4 py-1.5 font-mono text-xs text-red-500 disabled:opacity-50">
                          {savingLiability ? 'SAVING_' : '[SAVE]'}
                        </button>
                      </div>
                    </form>
                  )}
                  {(liabilities ?? []).length === 0 ? (
                    <div className="py-8 text-center"><p className="font-mono text-xs text-zinc-500">NO_LIABILITIES_ADDED</p></div>
                  ) : (
                    <div className="divide-y divide-zinc-900">
                      {(liabilities ?? []).map((l: any) => (
                        <div key={l._id} className="flex items-center gap-3 px-4 py-3">
                          <CreditCard className="h-3.5 w-3.5 shrink-0 text-red-600" />
                          <div className="flex-1">
                            <p className="font-mono text-xs text-zinc-200">{l.name}</p>
                            <p className="font-mono text-[10px] text-zinc-500">{l.type}{l.interestRate ? ` · ${l.interestRate}% APR` : ''}{l.minimumPayment ? ` · min ${fmt(l.minimumPayment)}/mo` : ''}</p>
                          </div>
                          <p className="font-mono text-sm font-bold text-red-400">{fmt(l.balance)}</p>
                          <button onClick={() => deleteLiability({ liabilityId: l._id })} className="text-zinc-500 hover:text-red-500 transition">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DEBT TRACKER sub-tab */}
            {wealthTab === 'debt-tracker' && (
              <div className="space-y-4">
                {(liabilities ?? []).length === 0 ? (
                  <div className="border border-zinc-800 bg-zinc-950 py-12 text-center">
                    <p className="font-mono text-xs tracking-widest text-zinc-400">NO_LIABILITIES — debt free! 🎉</p>
                  </div>
                ) : (
                  <>
                    <div className="border border-zinc-900 bg-zinc-950">
                      <div className="border-b border-zinc-900 px-4 py-2.5">
                        <p className="font-mono text-xs tracking-widest text-orange-500">🔥 AVALANCHE METHOD (highest interest first)</p>
                        <p className="font-mono text-[10px] text-zinc-500 mt-0.5">Pay minimums on all, put extra money here. Saves most interest.</p>
                      </div>
                      <div className="divide-y divide-zinc-900">
                        {avalancheOrder.map((l: any, i: number) => (
                          <div key={l._id} className="flex items-center gap-3 px-4 py-3">
                            <span className={cn('font-mono text-xs font-bold w-5', i === 0 ? 'text-orange-500' : 'text-zinc-500')}>#{i + 1}</span>
                            <div className="flex-1">
                              <p className="font-mono text-xs text-zinc-200">{l.name}</p>
                              <p className="font-mono text-[10px] text-zinc-500">{l.interestRate ? `${l.interestRate}% APR` : 'Rate unknown'}</p>
                            </div>
                            <p className="font-mono text-sm text-red-400">{fmt(l.balance)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-zinc-900 bg-zinc-950">
                      <div className="border-b border-zinc-900 px-4 py-2.5">
                        <p className="font-mono text-xs tracking-widest text-cyan-500">❄️ SNOWBALL METHOD (smallest balance first)</p>
                        <p className="font-mono text-[10px] text-zinc-500 mt-0.5">Quick wins build momentum. Great for motivation.</p>
                      </div>
                      <div className="divide-y divide-zinc-900">
                        {snowballOrder.map((l: any, i: number) => (
                          <div key={l._id} className="flex items-center gap-3 px-4 py-3">
                            <span className={cn('font-mono text-xs font-bold w-5', i === 0 ? 'text-cyan-500' : 'text-zinc-500')}>#{i + 1}</span>
                            <div className="flex-1">
                              <p className="font-mono text-xs text-zinc-200">{l.name}</p>
                              <p className="font-mono text-[10px] text-zinc-500">{l.interestRate ? `${l.interestRate}% APR` : 'Rate unknown'}</p>
                            </div>
                            <p className="font-mono text-sm text-red-400">{fmt(l.balance)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* SAVINGS GOALS sub-tab */}
            {wealthTab === 'savings-goals' && (
              <div className="space-y-3">
                {(!financialGoals || financialGoals.length === 0) ? (
                  <div className="border border-zinc-900 bg-zinc-950 py-12 text-center">
                    <Target className="mx-auto mb-3 h-8 w-8 text-zinc-400" />
                    <p className="font-mono text-xs tracking-widest text-zinc-400">NO_SAVINGS_GOALS</p>
                    <p className="mt-1 font-mono text-[10px] text-zinc-500">Create goals in Budget → Goals tab</p>
                  </div>
                ) : (
                  (financialGoals as any[]).map((g) => {
                    const pct = g.targetAmount > 0 ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0;
                    return (
                      <div key={g._id} className="border border-zinc-900 bg-zinc-950 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-mono text-sm font-bold text-zinc-200">{g.title}</p>
                            <p className="mt-0.5 font-mono text-xs text-zinc-400">{fmt(g.currentAmount)} / {fmt(g.targetAmount)} · {pct}%{g.deadline && ` · Due ${g.deadline}`}</p>
                          </div>
                          <span className={cn('font-mono text-xs px-2 py-0.5 border',
                            g.status === 'completed' ? 'border-green-800 text-green-500' : 'border-amber-800 text-amber-500')}>
                            {g.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-3 h-1.5 bg-zinc-900">
                          <div className="h-full bg-green-600 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
