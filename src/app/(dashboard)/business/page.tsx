'use client';

import { useMutation, useQuery, useAction } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { useEffect, useState, FormEvent } from 'react';
import { Briefcase, TrendingUp, Plus, Trash2, CheckCircle, Zap, ChevronDown, ChevronUp, ExternalLink, Globe, Edit2, X, PlusCircle } from 'lucide-react';
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
  // convex bindings
  const businesses = useQuery(api.businessGoals.listBusinesses, {});
  const createBusiness = useMutation(api.businessGoals.createBusiness);
  const updateBusiness = useMutation(api.businessGoals.updateBusiness);
  const deleteBusiness = useMutation(api.businessGoals.deleteBusiness);

  const goals = useQuery(api.businessGoals.listBusinessGoals, {});
  const createGoal = useMutation(api.businessGoals.createBusinessGoal);
  const updateGoal = useMutation(api.businessGoals.updateBusinessGoal);
  const deleteGoal = useMutation(api.businessGoals.deleteBusinessGoal);
  const generateTasks = useAction(api.businessGoals.generateBusinessTasks);

  // local state
  const [selectedBizId, setSelectedBizId] = useState<string | null>(null);
  const [showBizForm, setShowBizForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [savingBiz, setSavingBiz] = useState(false);
  const [savingGoal, setSavingGoal] = useState(false);
  const [editingBizId, setEditingBizId] = useState<string | null>(null);

  const [bizForm, setBizForm] = useState({
    name: '',
    website: '',
    description: '',
  });

  const [goalForm, setGoalForm] = useState({
    title: '',
    type: 'revenue' as GoalType,
    target: '',
    unit: '',
    deadline: '',
    description: '',
  });

  const handleBizSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (savingBiz) return;
    setSavingBiz(true);
    try {
      if (editingBizId) {
        await updateBusiness({
          id: editingBizId as Id<'businesses'>,
          name: bizForm.name,
          website: bizForm.website || undefined,
          description: bizForm.description || undefined,
        });
        setEditingBizId(null);
      } else {
        const id = await createBusiness({
          name: bizForm.name,
          website: bizForm.website || undefined,
          description: bizForm.description || undefined,
        });
        setSelectedBizId(id);
      }
      setBizForm({ name: '', website: '', description: '' });
      setShowBizForm(false);
    } finally {
      setSavingBiz(false);
    }
  };

  const handleGoalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (savingGoal || !selectedBizId) return;
    setSavingGoal(true);
    const selectedBiz = businesses?.find((b) => b._id === selectedBizId);
    try {
      await createGoal({
        title: goalForm.title,
        type: goalForm.type,
        businessId: selectedBizId as Id<'businesses'>,
        businessName: selectedBiz?.name,
        target: goalForm.target ? parseFloat(goalForm.target) : undefined,
        unit: goalForm.unit || undefined,
        deadline: goalForm.deadline || undefined,
        description: goalForm.description || undefined,
      });
      setGoalForm({ title: '', type: 'revenue', target: '', unit: '', deadline: '', description: '' });
      setShowGoalForm(false);
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

  const handleStartEditBiz = (biz: any) => {
    setEditingBizId(biz._id);
    setBizForm({
      name: biz.name,
      website: biz.website ?? '',
      description: biz.description ?? '',
    });
    setShowBizForm(true);
  };

  useEffect(() => {
    if (!businesses || businesses.length === 0) {
      if (selectedBizId !== null) {
        setSelectedBizId(null);
      }
      return;
    }

    const selectedStillExists = selectedBizId
      ? businesses.some((biz) => biz._id === selectedBizId)
      : false;

    if (!selectedStillExists) {
      setSelectedBizId(businesses[0]._id);
    }
  }, [businesses, selectedBizId]);

  // computed data
  const selectedBiz = businesses?.find((b) => b._id === selectedBizId);
  const filteredGoals = goals?.filter((g: any) => g.businessId === selectedBizId) ?? [];
  const activeGoals = filteredGoals.filter((g: any) => g.status === 'active');
  const completedGoals = filteredGoals.filter((g: any) => g.status === 'completed');

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Top Control Banner */}
        <div className="mb-5 border border-zinc-900 bg-zinc-950 rounded-[2px]">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-500 uppercase">// ENTERPRISE_COMMAND_CENTER_::__SYSTEM_HUB</span>
          </div>
          <div className="px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Venture OS</h1>
              <p className="mt-0.5 font-mono text-xs tracking-widest text-zinc-500">Manage multiple businesses, launch products, and track real-time revenue targets</p>
            </div>
            <button
              onClick={() => {
                setEditingBizId(null);
                setBizForm({ name: '', website: '', description: '' });
                setShowBizForm(true);
              }}
              className="flex items-center justify-center gap-1.5 border border-orange-800 bg-orange-950/20 px-4 py-2 font-mono text-xs tracking-widest text-orange-500 rounded-[2px] transition hover:bg-orange-950/40"
            >
              <Plus className="h-3.5 w-3.5" /> [ADD_VENTURE]
            </button>
          </div>
        </div>

        {/* Dual-Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT PANE: Businesses Directory (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="border border-zinc-900 bg-zinc-950 rounded-[2px]">
              <div className="border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-400">BUSINESS_DIRECTORY</span>
                <span className="font-mono text-[10px] text-zinc-600">COUNT: {businesses?.length ?? 0}</span>
              </div>

              {/* Add/Edit Venture Form */}
              {showBizForm && (
                <div className="p-4 border-b border-zinc-900 bg-black/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-wider text-orange-500">
                      {editingBizId ? 'EDITING_VENTURE' : 'REGISTER_NEW_VENTURE'}
                    </span>
                    <button onClick={() => setShowBizForm(false)} className="text-zinc-500 hover:text-zinc-300">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <form onSubmit={handleBizSubmit} className="space-y-3">
                    <input
                      value={bizForm.name}
                      onChange={(e) => setBizForm({ ...bizForm, name: e.target.value })}
                      placeholder="Business Name *"
                      required
                      className="h-8 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none rounded-[2px]"
                    />
                    <input
                      value={bizForm.website}
                      onChange={(e) => setBizForm({ ...bizForm, website: e.target.value })}
                      placeholder="Website Link (e.g. https://mybiz.com)"
                      className="h-8 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none rounded-[2px]"
                    />
                    <textarea
                      value={bizForm.description}
                      onChange={(e) => setBizForm({ ...bizForm, description: e.target.value })}
                      placeholder="Venture vision, core target market or operations details..."
                      rows={2}
                      className="w-full resize-none border border-zinc-800 bg-black px-3 py-1.5 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none rounded-[2px]"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={savingBiz}
                        className="border border-orange-800 bg-orange-950/20 px-4 py-1.5 font-mono text-[10px] tracking-wider text-orange-500 rounded-[2px] transition hover:bg-orange-950/40 disabled:opacity-40"
                      >
                        {savingBiz ? 'SAVING...' : editingBizId ? '[UPDATE]' : '[REGISTER]'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBizForm(false)}
                        className="border border-zinc-800 px-3 py-1.5 font-mono text-[10px] tracking-wider text-zinc-500 rounded-[2px] hover:border-zinc-700"
                      >
                        [CANCEL]
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Businesses list */}
              <div className="divide-y divide-zinc-900 max-h-[500px] overflow-y-auto">
                {!businesses ? (
                  <div className="p-8 text-center font-mono text-xs text-zinc-600">LOADING_VENTURES...</div>
                ) : businesses.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <Briefcase className="h-6 w-6 mx-auto text-zinc-800" />
                    <p className="font-mono text-xs text-zinc-500">NO_VENTURES_FOUND</p>
                    <p className="font-mono text-[10px] text-zinc-700">Add a business by name and link to start managing targets.</p>
                  </div>
                ) : (
                  businesses.map((biz) => {
                    const isSelected = selectedBizId === biz._id;
                    const bizGoals = goals?.filter((g: any) => g.businessId === biz._id) ?? [];
                    const activeCount = bizGoals.filter((g) => g.status === 'active').length;
                    
                    return (
                      <div
                        key={biz._id}
                        onClick={() => setSelectedBizId(biz._id)}
                        className={cn(
                          'p-4 cursor-pointer transition flex items-start justify-between gap-3 group',
                          isSelected ? 'bg-zinc-900/50 border-l-2 border-orange-500' : 'hover:bg-zinc-900/20'
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn('font-mono text-sm font-bold', isSelected ? 'text-orange-500' : 'text-zinc-300 group-hover:text-zinc-150')}>
                              {biz.name}
                            </span>
                          </div>
                          
                          {biz.description && (
                            <p className="mt-1 font-mono text-[11px] text-zinc-500 line-clamp-1">{biz.description}</p>
                          )}

                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            {biz.website && (
                              <a
                                href={biz.website.startsWith('http') ? biz.website : `https://${biz.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 font-mono text-[10px] text-zinc-600 hover:text-orange-600 transition"
                              >
                                <Globe className="h-3 w-3" />
                                <span className="underline max-w-[120px] truncate">{biz.website.replace(/https?:\/\/(www\.)?/, '')}</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            )}
                            <span className="font-mono text-[10px] text-zinc-600">
                              GOALS: {activeCount} ACTIVE / {bizGoals.length} TOTAL
                            </span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEditBiz(biz);
                            }}
                            className="p-1 text-zinc-600 hover:text-orange-500"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteBusiness({ id: biz._id });
                              if (isSelected) setSelectedBizId(null);
                            }}
                            className="p-1 text-zinc-600 hover:text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Selected Venture Workspace (8 cols) */}
          <div className="lg:col-span-8">
            {!selectedBizId ? (
              <div className="border border-dashed border-zinc-800 bg-zinc-950/40 p-16 text-center rounded-[2px]">
                <Briefcase className="mx-auto mb-3 h-8 w-8 text-zinc-800" />
                <p className="font-mono text-xs tracking-widest text-zinc-500">resurgo:business$ please select a venture from the directory_</p>
                <p className="mt-1 font-mono text-[10px] text-zinc-700">Click a business on the left pane to launch the goal engine & AI planner context.</p>
              </div>
            ) : (
              <div className="space-y-5">
                
                {/* Active Business Info Card */}
                <div className="border border-zinc-900 bg-zinc-950 p-5 rounded-[2px]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-orange-500 tracking-widest uppercase font-bold">// VENTURE_WORKSPACE</span>
                        {selectedBiz?.website && (
                          <a
                            href={selectedBiz.website.startsWith('http') ? selectedBiz.website : `https://${selectedBiz.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-zinc-800 bg-black px-2 py-0.5 font-mono text-[9px] text-zinc-400 rounded-[2px] flex items-center gap-1 hover:border-zinc-700"
                          >
                            <Globe className="h-2.5 w-2.5" /> OPEN_SITE
                          </a>
                        )}
                      </div>
                      <h2 className="mt-1 font-mono text-xl font-bold text-zinc-100">{selectedBiz?.name}</h2>
                      {selectedBiz?.description && (
                        <p className="mt-1.5 font-mono text-xs text-zinc-400">{selectedBiz.description}</p>
                      )}
                    </div>

                    <button
                      onClick={() => setShowGoalForm(true)}
                      className="flex items-center gap-1 border border-orange-800 bg-orange-950/20 px-3.5 py-1.5 font-mono text-xs tracking-widest text-orange-500 rounded-[2px] transition hover:bg-orange-950/40"
                    >
                      <PlusCircle className="h-3.5 w-3.5" /> [ADD_GOAL]
                    </button>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="mt-5 grid grid-cols-3 border-t border-zinc-900">
                    {[
                      { label: 'ACTIVE_GOALS', value: activeGoals.length },
                      { label: 'COMPLETED_GOALS', value: completedGoals.length },
                      { label: 'TOTAL_OBJECTIVES', value: filteredGoals.length },
                    ].map(({ label, value }) => (
                      <div key={label} className="border-r border-zinc-900 px-4 py-3 last:border-r-0">
                        <span className="font-mono text-[10px] text-zinc-500 tracking-wider">{label}</span>
                        <p className="mt-0.5 font-mono text-lg font-bold text-orange-500">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Create Goal Form */}
                {showGoalForm && (
                  <div className="border border-zinc-900 bg-zinc-950 rounded-[2px]">
                    <div className="border-b border-zinc-900 px-4 py-2.5 flex items-center justify-between">
                      <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">ADD_BUSINESS_GOAL_FOR_{selectedBiz?.name.toUpperCase()}</span>
                      <button onClick={() => setShowGoalForm(false)} className="text-zinc-500 hover:text-zinc-300">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <form onSubmit={handleGoalSubmit} className="p-4 space-y-4">
                      <input
                        value={goalForm.title}
                        onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                        placeholder="Goal objective (e.g. Launch Beta Product) *"
                        required
                        className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none rounded-[2px]"
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {GOAL_TYPES.map(({ id, label, icon }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setGoalForm({ ...goalForm, type: id })}
                            className={cn(
                              'border px-3 py-1 font-mono text-[10px] tracking-wider transition rounded-[2px]',
                              goalForm.type === id ? 'border-orange-800 bg-orange-950/20 text-orange-500' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                            )}
                          >
                            {icon} {label.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="date"
                          value={goalForm.deadline}
                          onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                          className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 focus:border-orange-800 focus:outline-none rounded-[2px]"
                        />
                        <input
                          type="number"
                          value={goalForm.target}
                          onChange={(e) => setGoalForm({ ...goalForm, target: e.target.value })}
                          placeholder="Target value (e.g. 10000)"
                          className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none rounded-[2px]"
                        />
                        <input
                          value={goalForm.unit}
                          onChange={(e) => setGoalForm({ ...goalForm, unit: e.target.value })}
                          placeholder="Unit (e.g. $, clients, users)"
                          className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none rounded-[2px]"
                        />
                      </div>
                      <textarea
                        value={goalForm.description}
                        onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                        placeholder="Detail the metrics, target audience or specific deliverables expected..."
                        rows={2}
                        className="w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none rounded-[2px]"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={savingGoal}
                          className="border border-orange-800 bg-orange-950/20 px-5 py-2 font-mono text-xs tracking-wider text-orange-500 rounded-[2px] transition hover:bg-orange-950/40 disabled:opacity-40"
                        >
                          {savingGoal ? 'CREATING...' : '[CREATE_GOAL]'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowGoalForm(false)}
                          className="border border-zinc-800 px-4 py-2 font-mono text-xs tracking-wider text-zinc-400 rounded-[2px] transition hover:border-zinc-700"
                        >
                          [CANCEL]
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Goals scoper list */}
                <div className="space-y-3">
                  {filteredGoals.length === 0 ? (
                    <div className="border border-dashed border-zinc-800 bg-zinc-950 py-16 text-center rounded-[2px]">
                      <Briefcase className="mx-auto mb-2 h-6 w-6 text-zinc-700" />
                      <p className="font-mono text-xs text-zinc-500">NO_VENTURE_GOALS_YET</p>
                      <p className="font-mono text-[10px] text-zinc-700">Add a goal to activate AI-driven action plans for {selectedBiz?.name}.</p>
                    </div>
                  ) : (
                    filteredGoals.map((goal: any) => {
                      const isExpanded = expandedGoal === goal._id;
                      const progress = goal.target && goal.current ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
                      const typeInfo = GOAL_TYPES.find((t) => t.id === goal.type);
                      
                      return (
                        <div
                          key={goal._id}
                          className={cn(
                            'border rounded-[2px] bg-zinc-950 transition overflow-hidden',
                            goal.status === 'completed' ? 'border-green-950' : 'border-zinc-900'
                          )}
                        >
                          {/* Goal Main Info */}
                          <div className="flex items-start gap-3 p-4">
                            <span className="text-lg">{typeInfo?.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={cn('font-mono text-xs font-bold tracking-wide', goal.status === 'completed' ? 'text-green-600 line-through' : 'text-zinc-200')}>
                                  {goal.title}
                                </span>
                                <span
                                  className={cn(
                                    'border px-1.5 py-0.5 font-mono text-[9px] tracking-wider rounded-[2px]',
                                    goal.status === 'completed' ? 'border-green-950 text-green-600 bg-green-950/10' : 'border-orange-950 text-orange-500 bg-orange-950/10'
                                  )}
                                >
                                  {goal.status.toUpperCase()}
                                </span>
                              </div>

                              {goal.description && (
                                <p className="mt-1 font-mono text-[11px] text-zinc-500 line-clamp-1">{goal.description}</p>
                              )}

                              {goal.target && (
                                <div className="mt-2.5">
                                  <div className="flex items-center justify-between">
                                    <span className="font-mono text-[10px] text-zinc-500">
                                      PROGRESS: {goal.current ?? 0} / {goal.target} {goal.unit ?? ''}
                                    </span>
                                    <span className="font-mono text-[10px] font-bold text-orange-500">{progress}%</span>
                                  </div>
                                  <div className="mt-1 h-1 w-full bg-zinc-900 rounded-[2px] overflow-hidden">
                                    <div className="h-1 bg-orange-600 transition-all" style={{ width: `${progress}%` }} />
                                  </div>
                                </div>
                              )}
                              {goal.deadline && (
                                <p className="mt-1.5 font-mono text-[10px] text-zinc-500">DEADLINE: {goal.deadline}</p>
                              )}
                            </div>

                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => setExpandedGoal(isExpanded ? null : goal._id)}
                                className="p-1 text-zinc-500 hover:text-zinc-300"
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </button>
                              <button
                                onClick={() => deleteGoal({ id: goal._id })}
                                className="p-1 text-zinc-500 hover:text-red-500"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Expanded Details Pane */}
                          {isExpanded && (
                            <div className="border-t border-zinc-900 bg-black/40 p-4 space-y-4">
                              {/* Progress edit block */}
                              {goal.target && (
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] text-zinc-500 tracking-wider">UPDATE_METRICS:</span>
                                  <input
                                    type="number"
                                    defaultValue={goal.current ?? ''}
                                    placeholder="Current value"
                                    className="h-7 w-24 border border-zinc-800 bg-black px-2 font-mono text-xs text-zinc-300 focus:border-orange-800 focus:outline-none rounded-[2px]"
                                    onBlur={(e) => {
                                      const val = parseFloat(e.target.value);
                                      if (!isNaN(val)) updateGoal({ id: goal._id, current: val });
                                    }}
                                  />
                                  <span className="font-mono text-[10px] text-zinc-500">{goal.unit}</span>
                                </div>
                              )}

                              {/* AI Action Items */}
                              <div className="border border-zinc-900 bg-zinc-950 p-3.5 rounded-[2px] space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-[10px] tracking-wider text-orange-500">// TITAN_STRATEGY_DECOMPOSITION</span>
                                  <button
                                    onClick={() => handleGenerate(goal._id)}
                                    disabled={generatingFor === goal._id}
                                    className="flex items-center gap-1 border border-orange-850 bg-orange-950/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-orange-500 rounded-[2px] transition hover:bg-orange-950/30 disabled:opacity-40"
                                  >
                                    <Zap className="h-2.5 w-2.5" />
                                    {generatingFor === goal._id ? 'DECOMPOSING...' : '[TRIGGER_AI_DECOMPOSE]'}
                                  </button>
                                </div>

                                {goal.aiTasks && goal.aiTasks.length > 0 ? (
                                  <ul className="space-y-1.5">
                                    {goal.aiTasks.map((task: string, i: number) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <TrendingUp className="mt-0.5 h-3 w-3 shrink-0 text-orange-500" />
                                        <span className="font-mono text-xs text-zinc-400">{task}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="font-mono text-[10px] text-zinc-500">No action blueprint loaded. Click trigger to analyze this goal with the Multi-Model cascade.</p>
                                )}
                              </div>

                              {/* Status Controls */}
                              <div className="flex gap-2">
                                {goal.status !== 'completed' && (
                                  <button
                                    onClick={() => updateGoal({ id: goal._id, status: 'completed' })}
                                    className="flex items-center gap-1 border border-green-900 bg-green-950/10 px-3 py-1.5 font-mono text-[10px] tracking-wider text-green-600 rounded-[2px] transition hover:bg-green-950/35"
                                  >
                                    <CheckCircle className="h-3 w-3" /> [MARK_COMPLETE]
                                  </button>
                                )}
                                {goal.status === 'active' && (
                                  <button
                                    onClick={() => updateGoal({ id: goal._id, status: 'paused' })}
                                    className="border border-zinc-800 px-3 py-1.5 font-mono text-[10px] tracking-wider text-zinc-500 rounded-[2px] transition hover:border-zinc-700"
                                  >
                                    [PAUSE]
                                  </button>
                                )}
                                {goal.status === 'paused' && (
                                  <button
                                    onClick={() => updateGoal({ id: goal._id, status: 'active' })}
                                    className="border border-blue-900 bg-blue-950/10 px-3 py-1.5 font-mono text-[10px] tracking-wider text-blue-500 rounded-[2px] transition hover:bg-blue-950/35"
                                  >
                                    [RESUME]
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
