'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Brain Dump Component (Cyberpunk Dashboard Upgrade)
// Pour out everything on your mind → AI parses and auto-seeds tasks, habits, and
// psychometric profiles directly into the database.
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { enqueueOfflineBrainDump } from '@/lib/offline/queue';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import {
  Brain,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  Heart,
  Target,
  Plus,
  ChevronDown,
  ChevronUp,
  X,
  Network,
  List,
  ArrowRight,
  Sun,
  Moon,
  Compass,
  Gauge,
  ShieldAlert,
  Smile,
  Check,
  RefreshCw
} from 'lucide-react';
import type { BrainDumpResponse, ParsedTask, TaskPriorityType, TaskCategoryType } from '@/lib/ai/brain-dump/schema';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface BrainDumpProps {
  isOpen: boolean;
  onClose: () => void;
}

interface APIResult {
  success: boolean;
  data?: BrainDumpResponse;
  enhanced?: {
    patterns: string | null;
    emotionalTrajectory: string[];
    cognitiveLoad: number;
    deepInsights: string[];
    recommendedApproach: string;
    warningFlags: string[];
  } | null;
  seeded?: {
    success: boolean;
    brainDumpId: string;
    tasksSeeded: number;
    habitsSeeded: number;
    coachPersona?: {
      name: string;
      style: 'supportive' | 'challenging' | 'analytical' | 'humorous';
      initial_action_note: string;
    };
    userIntelligence?: {
      adhdFlag: boolean;
      executiveFunctioningLoad: number;
      chronotype: 'morning' | 'afternoon' | 'evening' | 'irregular';
    };
  } | null;
  error?: string;
  provider?: string;
  attempts?: number;
  latencyMs?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const PRIORITY_COLORS: Record<TaskPriorityType, string> = {
  CRITICAL: 'text-red-400 border-red-800 bg-red-950/30',
  HIGH: 'text-orange-400 border-orange-800 bg-orange-950/30',
  MEDIUM: 'text-yellow-400 border-yellow-800 bg-yellow-950/30',
  LOW: 'text-zinc-400 border-zinc-700 bg-zinc-900/30',
};

const PRIORITY_BADGE: Record<TaskPriorityType, string> = {
  CRITICAL: 'bg-red-900/60 text-red-300',
  HIGH: 'bg-orange-900/60 text-orange-300',
  MEDIUM: 'bg-yellow-900/60 text-yellow-300',
  LOW: 'bg-zinc-800/60 text-zinc-400',
};

const CATEGORY_ICONS: Record<TaskCategoryType, string> = {
  WORK: '💼', PERSONAL: '👤', HEALTH: '🏥', FINANCE: '💰',
  LEARNING: '📚', SOCIAL: '👥', HOME: '🏠', CREATIVE: '🎨',
  ADMIN: '📋', URGENT_LIFE: '🚨',
};

const EMOTION_ICONS: Record<string, string> = {
  overwhelmed: '😰', anxious: '😟', frustrated: '😤', hopeful: '🌟',
  motivated: '💪', exhausted: '😴', confused: '😵', guilty: '😔',
  neutral: '😐', excited: '🎉',
};

const PLACEHOLDER_TEXT = `Everything on my mind right now...

I need to finish the quarterly report by Friday.
My sleep has been terrible lately, waking up at 3am.
I keep forgetting to call the dentist.
Want to start meal prepping but never have time.
That conversation with Sarah is still bothering me.
Should probably update my resume just in case...
The house is a mess and it's stressing me out.
I really want to read more books this year.`;

// ─────────────────────────────────────────────────────────────────────────────
// Brain Dump Component
// ─────────────────────────────────────────────────────────────────────────────

export default function BrainDump({ isOpen, onClose }: BrainDumpProps) {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BrainDumpResponse | null>(null);
  const [enhanced, setEnhanced] = useState<APIResult['enhanced']>(null);
  const [seeded, setSeeded] = useState<APIResult['seeded']>(null);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ provider?: string; attempts?: number; latencyMs?: number }>({});
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [addingTasks, setAddingTasks] = useState(false);
  const [tasksAdded, setTasksAdded] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [offlineSaved, setOfflineSaved] = useState(false);
  const [viewMode, setViewMode] = useState<'diagnostics' | 'tasks' | 'neural_map'>('diagnostics');
  const { isOnline, pendingBrainDumpCount, recentBrainDumpDrafts, syncingCount } = useOfflineQueue();

  const createTask = useMutation(api.tasks.create);
  const createHabit = useMutation(api.habits.create);

  // ── Submit brain dump ──
  const handleSubmit = useCallback(async () => {
    if (!rawText.trim() || rawText.trim().length < 10) return;

    if (!isOnline) {
      await enqueueOfflineBrainDump(rawText.trim());
      setOfflineSaved(true);
      setError(null);
      setResult(null);
      setRawText('');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setEnhanced(null);
    setSeeded(null);
    setSelectedTasks(new Set());
    setTasksAdded(false);
    setOfflineSaved(false);

    try {
      const res = await fetch('/api/brain-dump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText }),
      });

      const data: APIResult = await res.json();

      if (!data.success || !data.data) {
        setError(data.error || 'Something went wrong. Try again.');
        return;
      }

      setResult(data.data);
      setEnhanced(data.enhanced ?? null);
      setSeeded(data.seeded ?? null);
      setMeta({ provider: data.provider, attempts: data.attempts, latencyMs: data.latencyMs });
      // Auto-select all tasks
      setSelectedTasks(new Set(data.data.tasks.map((_, i) => i)));
      setViewMode('diagnostics');
    } catch (err) {
      await enqueueOfflineBrainDump(rawText.trim());
      setOfflineSaved(true);
      setError('Connection dropped. Your dump was saved offline and will sync automatically.');
      setRawText('');
      console.error('[BrainDump]', err);
    } finally {
      setLoading(false);
    }
  }, [isOnline, rawText]);

  // ── Manual Add Backup (in case auto-seed is bypassed or disabled) ──
  const handleAddTasks = useCallback(async () => {
    if (!result || selectedTasks.size === 0) return;
    setAddingTasks(true);

    try {
      // Add tasks
      const taskIndices: number[] = [];
      selectedTasks.forEach(idx => taskIndices.push(idx));
      for (const idx of taskIndices) {
        const task = result.tasks[idx];
        if (!task) continue;
        await createTask({
          title: task.title,
          priority: task.priority === 'CRITICAL' ? 'urgent' : task.priority.toLowerCase() as 'low' | 'medium' | 'high',
          dueDate: task.suggested_due ?? undefined,
          estimatedMinutes: task.estimated_minutes ?? undefined,
          energyRequired: task.energy_level as 'low' | 'medium' | 'high',
          source: 'ai_generated' as const,
          tags: [task.category.toLowerCase()],
        });
      }

      // Add habits
      for (const habit of result.habits_suggested) {
        await createHabit({
          title: habit.name,
          frequency: habit.frequency as 'daily' | 'weekly' | '3x_week' | 'weekdays',
          category: 'personal',
          timeOfDay: 'anytime',
        });
      }

      setTasksAdded(true);
    } catch (err) {
      console.error('[BrainDump] Failed to add tasks:', err);
      setError('Failed to add some tasks. Please try adding them manually.');
    } finally {
      setAddingTasks(false);
    }
  }, [result, selectedTasks, createTask, createHabit]);

  // ── Toggle task selection ──
  const toggleTask = (idx: number) => {
    setSelectedTasks(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // ── Reset ──
  const handleReset = () => {
    setRawText('');
    setResult(null);
    setEnhanced(null);
    setSeeded(null);
    setError(null);
    setSelectedTasks(new Set());
    setTasksAdded(false);
    setMeta({});
    setOfflineSaved(false);
    setViewMode('diagnostics');
  };

  if (!isOpen) return null;

  const visibleTasks = showAllTasks ? result?.tasks : result?.tasks?.slice(0, 8);

  // SVG parameters for circular neon gauge
  const execLoad = seeded?.userIntelligence?.executiveFunctioningLoad ?? enhanced?.cognitiveLoad ?? result?.psychometric_analysis?.executive_functioning_load ?? 5;
  const pct = execLoad * 10;
  const radius = 40;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-zinc-800 bg-zinc-950 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-lg">
        
        {/* ── Header ── */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-900 bg-zinc-950/95 backdrop-blur-md px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border border-purple-500/30 bg-purple-950/20 rounded shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <Brain className="h-5 w-5 text-purple-400 animate-pulse" />
            </div>
            <div>
              <h2 className="font-pixel text-[0.75rem] tracking-widest text-purple-400">COGNITIVE_TRIAGE_v2.5</h2>
              <p className="font-terminal text-xs text-zinc-500">Zero-Friction Cognitive Processing & Onboarding Cascade</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 transition hover:text-zinc-200 border border-transparent hover:border-zinc-800 hover:bg-zinc-900/50 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* ── INPUT PHASE ── */}
          {!result && (
            <>
              <div className="space-y-3">
                <label className="font-pixel text-[0.55rem] tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <span className="text-purple-500">&gt;</span> COGNITIVE_RAW_DUMP
                </label>
                {(!isOnline || pendingBrainDumpCount > 0 || syncingCount > 0) && (
                  <div className="border border-amber-500/20 bg-amber-950/10 px-3 py-2.5 rounded">
                    <p className="font-terminal text-xs text-amber-400">
                      {isOnline
                        ? `Connection restored — synchronizing ${pendingBrainDumpCount} queued dump${pendingBrainDumpCount === 1 ? '' : 's'}.`
                        : 'Offline mode active. Brain dumps will be cached locally and processed automatically on reconnect.'}
                    </p>
                  </div>
                )}
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={PLACEHOLDER_TEXT}
                  rows={11}
                  className="w-full resize-y border border-zinc-800 bg-zinc-900/40 rounded px-4 py-3.5 font-terminal text-sm text-zinc-200 placeholder-zinc-600 transition focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600/20"
                  disabled={loading}
                  autoFocus
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="font-terminal text-xs text-zinc-600">
                    {rawText.length} characters {rawText.length > 5000 && '(truncated to 5000 max)'}
                  </span>
                  <span className="font-terminal text-xs text-zinc-500 italic">
                    Pour out goals, chaos, tiredness, work stressors, or sleep issues. Let it flow.
                  </span>
                </div>
              </div>

              {offlineSaved && (
                <div className="flex items-start gap-2.5 border border-emerald-500/20 bg-emerald-950/10 p-3.5 rounded">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <p className="font-terminal text-sm text-emerald-300">
                    Saved to local queue. Resurgo will execute the onboarding cascade automatically when connectivity resumes.
                  </p>
                </div>
              )}

              {recentBrainDumpDrafts.length > 0 && (
                <div className="space-y-2 border border-zinc-900 bg-zinc-900/10 p-3 rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-pixel text-[0.45rem] tracking-widest text-zinc-500">RECENT_LOCAL_TRIAGES</span>
                    <span className="font-terminal text-xs text-zinc-600">{recentBrainDumpDrafts.length} buffered</span>
                  </div>
                  <div className="space-y-2">
                    {recentBrainDumpDrafts.slice(0, 3).map((draft) => (
                      <div key={draft.id} className="border border-zinc-900 bg-black/40 px-3 py-2 rounded">
                        <div className="flex items-center justify-between gap-3">
                          <p className="line-clamp-1 font-terminal text-xs text-zinc-400">{draft.preview}</p>
                          <span className={`shrink-0 font-pixel text-[0.35rem] tracking-widest ${draft.synced ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
                            {draft.synced ? 'SYNCHRONISED' : 'QUEUED'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2.5 border border-red-500/20 bg-red-950/10 p-3.5 rounded">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <p className="font-terminal text-sm text-red-300">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || rawText.trim().length < 10}
                className="flex w-full items-center justify-center gap-2 border border-purple-500/30 bg-purple-900/10 px-4 py-3.5 font-pixel text-[0.6rem] tracking-widest text-purple-300 transition hover:bg-purple-900/20 hover:border-purple-500/50 disabled:opacity-40 disabled:cursor-not-allowed rounded"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin text-purple-400" />
                    DECODING_COGNITIVE_SIGNALS...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    {isOnline ? 'CALIBRATE_LIFE_SYSTEM' : 'CACHE_TRIAGE_OFFLINE'}
                  </>
                )}
              </button>
            </>
          )}

          {/* ── RESULTS PHASE ── */}
          {result && (
            <>
              {/* ── Auto-Seeding Calibration Banner ── */}
              <div className="border border-emerald-500/20 bg-emerald-950/15 p-4 rounded flex gap-4 items-start shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-emerald-500/30 bg-emerald-950/30 rounded shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-pixel text-[0.6rem] tracking-wider text-emerald-300">🧬 ZERO_FRICTION_SEEDING_COMPLETE</h3>
                  <p className="font-terminal text-xs text-emerald-200/90 leading-relaxed">
                    Planner seeded successfully. Our cognitive AI pipeline has created and mapped
                    <strong> {result.tasks.length} tasks</strong> to your schedule and initialized
                    <strong> {result.habits_suggested.length} habits</strong>. Time cycles and user intelligence parameters have been permanently synchronized to the server.
                  </p>
                </div>
              </div>

              {/* ── Tabs / View Select ── */}
              <div className="flex items-center gap-1.5 border border-zinc-900 bg-zinc-950 p-1.5 rounded">
                <button
                  onClick={() => setViewMode('diagnostics')}
                  className={`flex flex-1 items-center justify-center gap-2 px-3 py-2 font-pixel text-[0.45rem] tracking-widest transition rounded ${
                    viewMode === 'diagnostics'
                      ? 'bg-zinc-900 text-zinc-100 border border-zinc-800'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Gauge className="h-3.5 w-3.5" />
                  COGNITIVE_DIAGNOSTICS
                </button>
                <button
                  onClick={() => setViewMode('tasks')}
                  className={`flex flex-1 items-center justify-center gap-2 px-3 py-2 font-pixel text-[0.45rem] tracking-widest transition rounded ${
                    viewMode === 'tasks'
                      ? 'bg-zinc-900 text-zinc-100 border border-zinc-800'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                  SEEDED_ITEMS
                </button>
                {result.neural_map && result.neural_map.clusters.length > 0 && (
                  <button
                    onClick={() => setViewMode('neural_map')}
                    className={`flex flex-1 items-center justify-center gap-2 px-3 py-2 font-pixel text-[0.45rem] tracking-widest transition rounded ${
                      viewMode === 'neural_map'
                        ? 'bg-purple-950/40 text-purple-300 border border-purple-500/30'
                        : 'text-zinc-500 hover:text-purple-300'
                    }`}
                  >
                    <Network className="h-3.5 w-3.5" />
                    NEURAL_FLOW
                  </button>
                )}
              </div>

              {/* ── Tab 1: Diagnostics (4-Quadrant Cyberpunk Dashboard) ── */}
              {viewMode === 'diagnostics' && (
                <div className="space-y-6">
                  {/* Emotional acknowledgement */}
                  <div className="border border-purple-500/10 bg-purple-950/10 p-4 rounded space-y-2">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4.5 w-4.5 text-purple-400" />
                      <span className="font-pixel text-[0.5rem] tracking-widest text-purple-400">EMOTIONAL_SPECTRUM</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.emotions_detected.map(emotion => (
                        <span key={emotion} className="inline-flex items-center gap-1 border border-purple-500/25 bg-purple-950/30 px-2 py-0.5 rounded font-terminal text-xs text-purple-300 uppercase tracking-wide">
                          {EMOTION_ICONS[emotion] || '💭'} {emotion}
                        </span>
                      ))}
                    </div>
                    <p className="font-terminal text-sm leading-relaxed text-purple-200/80 italic pl-2 border-l border-purple-500/30">
                      &ldquo;{result.emotional_acknowledgment}&rdquo;
                    </p>
                  </div>

                  {/* 4-Quadrant Grid */}
                  <div className="grid gap-6 md:grid-cols-2">
                    
                    {/* Q1: Cognitive & Executive Load Gauge */}
                    <div className="border border-zinc-800 bg-zinc-950 p-5 rounded space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                          <Gauge className="h-4 w-4 text-purple-400" />
                          <span className="font-pixel text-[0.5rem] tracking-widest text-purple-400">EXECUTIVE_LOAD</span>
                        </div>
                        <p className="font-terminal text-xs text-zinc-500">
                          Real-time calibration of cognitive strain and context-switching risk indexes.
                        </p>
                      </div>

                      <div className="flex items-center gap-5 my-2">
                        <div className="relative shrink-0 flex items-center justify-center">
                          {/* Radial SVG Dial */}
                          <svg className="h-28 w-28 transform -rotate-90">
                            <circle
                              cx="56"
                              cy="56"
                              r={radius}
                              className="stroke-zinc-900"
                              strokeWidth={strokeWidth}
                              fill="transparent"
                            />
                            <circle
                              cx="56"
                              cy="56"
                              r={radius}
                              className={`transition-all duration-1000 ${
                                execLoad <= 3
                                  ? 'stroke-emerald-500 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                                  : execLoad <= 6
                                  ? 'stroke-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                                  : 'stroke-pink-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                              }`}
                              strokeWidth={strokeWidth}
                              fill="transparent"
                              strokeDasharray={circumference}
                              strokeDashoffset={offset}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className={`font-pixel text-xl ${
                              execLoad <= 3 ? 'text-emerald-400' : execLoad <= 6 ? 'text-amber-400' : 'text-pink-500'
                            }`}>{execLoad}</span>
                            <span className="font-terminal text-[8px] text-zinc-600">/ 10 Rating</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 flex-1">
                          <span className={`font-pixel text-[0.45rem] tracking-wider ${
                            execLoad <= 3 ? 'text-emerald-400' : execLoad <= 6 ? 'text-amber-400' : 'text-pink-500'
                          }`}>
                            {execLoad <= 3 ? 'COMPOSURE: OPTIMAL' : execLoad <= 6 ? 'WARNING: MODERATE STRAIN' : 'ALERT: CRITICAL LOAD'}
                          </span>
                          <p className="font-terminal text-xs text-zinc-300 leading-relaxed">
                            {execLoad <= 3
                              ? 'Your executive function capacity is running clean. Excellent window for deep-focus engineering or creative architecture.'
                              : execLoad <= 6
                              ? 'Fractionated focus detected. Keep tasks chunked to prevent switching overhead. Avoid multi-tasking today.'
                              : 'High cognitive overload signature. Extremely high switching latency. Shift planner items to short, high-inertia actions.'}
                          </p>
                        </div>
                      </div>

                      {result.overcommitment_warning && result.overcommitment_message && (
                        <div className="flex items-start gap-2.5 border border-amber-500/10 bg-amber-950/10 p-2.5 rounded">
                          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                          <p className="font-terminal text-[11px] text-amber-300">{result.overcommitment_message}</p>
                        </div>
                      )}
                    </div>

                    {/* Q2: Behavioral Diagnostics */}
                    <div className="border border-zinc-800 bg-zinc-950 p-5 rounded space-y-4">
                      <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                        <ShieldAlert className="h-4 w-4 text-purple-400" />
                        <span className="font-pixel text-[0.5rem] tracking-widest text-purple-400">BEHAVIORAL_DIAGNOSTICS</span>
                      </div>

                      {/* Limiting Beliefs */}
                      {result.psychometric_analysis?.limiting_beliefs && result.psychometric_analysis.limiting_beliefs.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="font-pixel text-[0.4rem] text-zinc-500">LIMITING_BELIEF_WARNINGS</span>
                          <div className="space-y-1">
                            {result.psychometric_analysis.limiting_beliefs.map((belief, idx) => (
                              <div key={idx} className="flex items-center gap-2 border border-zinc-900 bg-zinc-900/10 px-3 py-1.5 rounded text-zinc-300">
                                <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-purple-500" />
                                <span className="font-terminal text-xs">{belief}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cognitive Biases */}
                      {result.psychometric_analysis?.cognitive_biases && result.psychometric_analysis.cognitive_biases.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="font-pixel text-[0.4rem] text-zinc-500">COGNITIVE_BIAS_DETECTION</span>
                          <div className="flex flex-wrap gap-1.5">
                            {result.psychometric_analysis.cognitive_biases.map((bias) => (
                              <span key={bias} className="border border-zinc-800 bg-zinc-900/30 px-2 py-0.5 rounded font-terminal text-[11px] text-zinc-400">
                                🧠 {bias}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ADHD Flag */}
                      {(seeded?.userIntelligence?.adhdFlag || (result.psychometric_analysis?.adhd_markers && result.psychometric_analysis.adhd_markers.length > 0)) && (
                        <div className="border border-purple-500/20 bg-purple-950/20 px-3 py-2.5 rounded space-y-1 shadow-[inset_0_0_10px_rgba(168,85,247,0.05)]">
                          <div className="flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-purple-500 animate-ping" />
                            <span className="font-pixel text-[0.45rem] tracking-wider text-purple-300">ADHD_DRIFT_COMPENSATION</span>
                          </div>
                          <p className="font-terminal text-[11px] text-purple-200 leading-relaxed">
                            Low stimulation trigger matched. High vulnerability to procrastination delay. We mapped high-dopamine habits to kickstart execution.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Q3: Chronobiology Scheduler */}
                    <div className="border border-zinc-800 bg-zinc-950 p-5 rounded space-y-4">
                      <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                        <Compass className="h-4 w-4 text-teal-400" />
                        <span className="font-pixel text-[0.5rem] tracking-widest text-teal-400">CHRONOBIOLOGY_SCHEDULER</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-zinc-900 bg-zinc-900/10 p-3 rounded">
                          <div className="flex items-center gap-1.5 font-terminal text-xs text-zinc-500 mb-1">
                            <Sun className="h-3.5 w-3.5 text-amber-400" /> RECOMMENDED_WAKE
                          </div>
                          <span className="font-terminal text-sm text-zinc-200 font-bold">
                            {result.psychometric_analysis?.chronobiology_markers?.recommended_wake_time || '07:00 AM'}
                          </span>
                        </div>
                        <div className="border border-zinc-900 bg-zinc-900/10 p-3 rounded">
                          <div className="flex items-center gap-1.5 font-terminal text-xs text-zinc-500 mb-1">
                            <Moon className="h-3.5 w-3.5 text-indigo-400" /> RECOMMENDED_SLEEP
                          </div>
                          <span className="font-terminal text-sm text-zinc-200 font-bold">
                            {result.psychometric_analysis?.chronobiology_markers?.recommended_sleep_time || '11:00 PM'}
                          </span>
                        </div>
                      </div>

                      <div className="border border-zinc-900 bg-zinc-900/20 p-3 rounded space-y-1">
                        <span className="font-pixel text-[0.4rem] tracking-widest text-teal-500/80">PEAK_COGNITIVE_WINDOW</span>
                        <p className="font-terminal text-sm text-teal-300 font-bold">
                          {result.psychometric_analysis?.chronobiology_markers?.peak_focus_window || '09:00 AM - 12:00 PM'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 border border-teal-500/10 bg-teal-950/15 px-3 py-2 rounded text-teal-400">
                        <span className="font-terminal text-xs">
                          Chronotype Match: <strong>{(result.psychometric_analysis?.chronobiology_markers?.chronotype || 'bear').toUpperCase()}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Q4: Momentum Action Center */}
                    <div className="border border-zinc-800 bg-zinc-950 p-5 rounded space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                          <Smile className="h-4 w-4 text-orange-400" />
                          <span className="font-pixel text-[0.5rem] tracking-widest text-orange-400">MOMENTUM_ACTION_CENTER</span>
                        </div>

                        <div className="border border-zinc-900 bg-zinc-900/10 p-3 rounded space-y-1">
                          <span className="font-pixel text-[0.4rem] tracking-widest text-orange-500/80">
                            COACH_PERSONA: {result.psychometric_analysis?.coaching_persona?.name || 'Marcus'} ({result.psychometric_analysis?.coaching_persona?.style || 'challenging'})
                          </span>
                          <p className="font-terminal text-[13px] text-zinc-300 leading-relaxed italic">
                            &ldquo;{result.psychometric_analysis?.coaching_persona?.initial_action_note || `Your brain dump analysis is completed and loaded. Let's make things happen today.`}&rdquo;
                          </p>
                        </div>

                        <div className="border border-emerald-500/10 bg-emerald-950/15 p-3 rounded space-y-1 relative overflow-hidden">
                          <div className="absolute right-0 top-0 text-emerald-500/10 -mr-2 -mt-2">
                            <Zap className="h-10 w-10" />
                          </div>
                          <span className="font-pixel text-[0.4rem] tracking-widest text-emerald-400">HIGH_INERTIA_QUICK_WIN</span>
                          <p className="font-terminal text-sm text-emerald-200 font-bold">{result.quick_win}</p>
                        </div>
                      </div>

                      <button
                        onClick={onClose}
                        className="flex w-full items-center justify-center gap-2 border border-emerald-700 bg-emerald-900/25 px-4 py-2.5 font-pixel text-[0.55rem] tracking-widest text-emerald-300 transition hover:bg-emerald-900/40 rounded mt-2"
                      >
                        <Check className="h-3.5 w-3.5" /> ENTER_PLANNER_VIEW
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* ── Tab 2: Seeded Items (List of Seeded Tasks/Habits) ── */}
              {viewMode === 'tasks' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-400" />
                      <span className="font-pixel text-[0.5rem] tracking-widest text-purple-400">AUTO_SEEDED_PLANNER_ITEMS</span>
                    </div>
                    {result.total_estimated_hours && (
                      <span className="flex items-center gap-1 font-terminal text-xs text-zinc-500">
                        <Clock className="h-3 w-3" />
                        ~{result.total_estimated_hours}h total workload allocated
                      </span>
                    )}
                  </div>

                  {/* Seeded Tasks */}
                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    <span className="font-pixel text-[0.4rem] text-zinc-500">TASKS INSTANTIATED</span>
                    {result.tasks.map((task: ParsedTask, idx: number) => (
                      <div
                        key={idx}
                        className="flex w-full items-center gap-3 border border-zinc-900 bg-zinc-950 px-3 py-2.5 rounded text-left transition"
                      >
                        <span className="text-base shrink-0">{CATEGORY_ICONS[task.category] || '📌'}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-terminal text-sm text-zinc-300">{task.title}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5 font-terminal text-xs text-zinc-500">
                            <span className={`inline-block px-1.5 py-px font-pixel text-[0.32rem] tracking-widest rounded ${PRIORITY_BADGE[task.priority]}`}>
                              {task.priority}
                            </span>
                            {task.estimated_minutes && (
                              <span>• {task.estimated_minutes}m</span>
                            )}
                            {task.suggested_due && (
                              <span>• scheduled {task.suggested_due}</span>
                            )}
                            <span className="text-zinc-600">• {task.energy_level} energy</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-terminal text-emerald-400 font-bold border border-emerald-950 bg-emerald-950/20 px-2 py-0.5 rounded shrink-0">
                          <Check className="h-3 w-3" /> SEEDED
                        </div>
                      </div>
                    ))}
                    {result.tasks.length === 0 && (
                      <div className="text-center font-terminal text-zinc-500 text-xs py-4">No specific action tasks extracted.</div>
                    )}
                  </div>

                  {/* Seeded Habits */}
                  {result.habits_suggested.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-pixel text-[0.4rem] text-zinc-500">HABITS INSTANTIATED</span>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {result.habits_suggested.map((habit, idx) => (
                          <div key={idx} className="border border-zinc-900 bg-zinc-950/50 p-3 rounded flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-terminal text-sm text-zinc-200 font-medium truncate">{habit.name}</p>
                              <p className="font-terminal text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-1">{habit.reason}</p>
                              <span className="inline-block mt-1 bg-zinc-900 text-zinc-400 font-terminal text-[10px] px-1.5 py-0.5 rounded capitalize">
                                {habit.frequency}
                              </span>
                            </div>
                            <span className="shrink-0 text-emerald-400 font-terminal text-[10px] uppercase font-bold border border-emerald-950 bg-emerald-950/20 px-1.5 py-0.5 rounded">
                              Active
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reset action in tab */}
                  <div className="pt-2">
                    <button
                      onClick={handleReset}
                      className="flex w-full items-center justify-center gap-2 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/10 px-4 py-2.5 font-pixel text-[0.55rem] tracking-widest text-zinc-400 transition rounded"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-zinc-400" /> DUMP_NEW_COGNITIVE_TRIAGE
                    </button>
                  </div>
                </div>
              )}

              {/* ── Tab 3: Neural Map / Flow ── */}
              {viewMode === 'neural_map' && result.neural_map && result.neural_map.clusters.length > 0 && (
                <div className="space-y-4">
                  {/* Root Priority */}
                  <div className="relative border border-purple-500/20 bg-purple-950/15 p-4 rounded overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-purple-500/5 animate-pulse" />
                    <div className="relative flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center border border-purple-500/30 bg-purple-950/40 rounded shadow-[0_0_8px_rgba(168,85,247,0.2)]">
                        <Target className="h-4.5 w-4.5 text-purple-300" />
                      </div>
                      <div>
                        <span className="font-pixel text-[0.4rem] tracking-widest text-purple-500">COGNITIVE_ROOT_PRIORITY</span>
                        <p className="font-terminal text-sm text-purple-200 font-bold">{result.neural_map.root_priority}</p>
                      </div>
                    </div>
                  </div>

                  {/* Clusters */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {result.neural_map.clusters.map((cluster) => (
                      <div
                        key={cluster.id}
                        className="border bg-zinc-950/80 p-4 rounded space-y-3 shadow-sm"
                        style={{ borderColor: `${cluster.color}33` }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="h-2.5 w-2.5 rounded-full shadow-lg"
                            style={{
                              backgroundColor: cluster.color,
                              boxShadow: `0 0 10px ${cluster.color}80`,
                            }}
                          />
                          <span
                            className="font-pixel text-[0.45rem] tracking-widest font-bold"
                            style={{ color: cluster.color }}
                          >
                            {cluster.label}
                          </span>
                        </div>
                        <div className="space-y-1.5 pl-4 border-l transition"
                          style={{ borderColor: `${cluster.color}25` }}
                        >
                          {cluster.tasks.map((taskTitle, tIdx) => {
                            const taskData = result.tasks.find(t => t.title === taskTitle);
                            const isConnected = result.neural_map!.connections.some(
                              c => c.from === taskTitle || c.to === taskTitle
                            );
                            return (
                              <div
                                key={tIdx}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded font-terminal text-xs transition ${
                                  isConnected
                                    ? 'bg-zinc-900/30 text-zinc-200 border border-zinc-900'
                                    : 'text-zinc-500'
                                }`}
                              >
                                <span className="text-xs">
                                  {taskData ? CATEGORY_ICONS[taskData.category] || '📌' : '•'}
                                </span>
                                <span className="flex-1 truncate">{taskTitle}</span>
                                {taskData && (
                                  <span className={`shrink-0 px-1 py-px font-pixel text-[0.28rem] tracking-wider rounded ${PRIORITY_BADGE[taskData.priority]}`}>
                                    {taskData.priority}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Connections */}
                  {result.neural_map.connections.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-pixel text-[0.4rem] tracking-widest text-zinc-500">FLOW_CONNECTIONS_&amp;_BLOCKERS</span>
                      <div className="space-y-1">
                        {result.neural_map.connections.map((conn, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex items-center gap-2 border border-zinc-900 bg-zinc-950 px-3.5 py-2 rounded font-terminal text-xs"
                          >
                            <span className="truncate text-zinc-300 font-medium max-w-[40%]">{conn.from}</span>
                            <span className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded font-pixel text-[0.32rem] tracking-widest font-bold ${
                              conn.relationship === 'blocks'
                                ? 'text-red-400 bg-red-950/20 border border-red-900/30'
                                : conn.relationship === 'enables'
                                ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-900/30'
                                : 'text-zinc-500 bg-zinc-900/40'
                            }`}>
                              <ArrowRight className="h-2.5 w-2.5 shrink-0" />
                              {conn.relationship.toUpperCase()}
                            </span>
                            <span className="truncate text-zinc-300 font-medium max-w-[40%]">{conn.to}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Metadata Diagnostic Footing ── */}
              <div className="flex flex-wrap items-center justify-between gap-4 font-terminal text-xs text-zinc-600 pt-4 border-t border-zinc-900">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  {meta.provider && <span>core_llm: {meta.provider}</span>}
                  {meta.attempts && <span>retries: {meta.attempts - 1}</span>}
                  {meta.latencyMs && <span>parse_time: {meta.latencyMs}ms</span>}
                </div>
                <button
                  onClick={handleReset}
                  className="font-pixel text-[0.45rem] tracking-wider text-zinc-500 hover:text-zinc-300 border border-zinc-900 px-3 py-1 rounded"
                >
                  DUMP_NEW_TRIAGE
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
