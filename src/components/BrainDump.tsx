'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Brain Dump Component
// Pour out everything on your mind → AI parses into tasks, habits, emotions
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
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
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ provider?: string; attempts?: number; latencyMs?: number }>({});
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [addingTasks, setAddingTasks] = useState(false);
  const [tasksAdded, setTasksAdded] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);

  const createTask = useMutation(api.tasks.create);
  const createHabit = useMutation(api.habits.create);

  // ── Submit brain dump ──
  const handleSubmit = useCallback(async () => {
    if (!rawText.trim() || rawText.trim().length < 10) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedTasks(new Set());
    setTasksAdded(false);

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
      setMeta({ provider: data.provider, attempts: data.attempts, latencyMs: data.latencyMs });
      // Auto-select all tasks
      setSelectedTasks(new Set(data.data.tasks.map((_, i) => i)));
    } catch (err) {
      setError('Network error. Check your connection and try again.');
      console.error('[BrainDump]', err);
    } finally {
      setLoading(false);
    }
  }, [rawText]);

  // ── Add selected tasks to Convex ──
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
    setError(null);
    setSelectedTasks(new Set());
    setTasksAdded(false);
    setMeta({});
  };

  if (!isOpen) return null;

  const visibleTasks = showAllTasks ? result?.tasks : result?.tasks?.slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-zinc-800 bg-zinc-950 shadow-2xl">
        {/* ── Header ── */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-purple-400" />
            <div>
              <h2 className="font-pixel text-[0.7rem] tracking-widest text-purple-400">BRAIN_DUMP</h2>
              <p className="font-terminal text-xs text-zinc-500">Pour everything out. AI will sort it.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 transition hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* ── INPUT PHASE ── */}
          {!result && (
            <>
              <div className="space-y-2">
                <label className="font-pixel text-[0.5rem] tracking-widest text-zinc-400">
                  {'>'} DUMP_EVERYTHING
                </label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={PLACEHOLDER_TEXT}
                  rows={12}
                  className="w-full resize-y border border-zinc-800 bg-zinc-900 px-4 py-3 font-terminal text-sm text-zinc-200 placeholder-zinc-600 transition focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700/30"
                  disabled={loading}
                  autoFocus
                />
                <div className="flex items-center justify-between">
                  <span className="font-terminal text-xs text-zinc-600">
                    {rawText.length} chars {rawText.length > 5000 && '(will be truncated to 5000)'}
                  </span>
                  <span className="font-terminal text-xs text-zinc-600">
                    Tip: Don&apos;t filter yourself. Write stream-of-consciousness.
                  </span>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 border border-red-900 bg-red-950/30 p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <p className="font-terminal text-sm text-red-300">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || rawText.trim().length < 10}
                className="flex w-full items-center justify-center gap-2 border border-purple-700 bg-purple-900/20 px-4 py-3 font-pixel text-[0.6rem] tracking-widest text-purple-300 transition hover:bg-purple-900/40 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    PARSING_BRAIN_DUMP...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    PARSE_MY_MIND
                  </>
                )}
              </button>
            </>
          )}

          {/* ── RESULTS PHASE ── */}
          {result && (
            <>
              {/* ── Emotional Acknowledgment ── */}
              <div className="border border-purple-900/50 bg-purple-950/20 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-purple-400" />
                  <span className="font-pixel text-[0.5rem] tracking-widest text-purple-400">FEELINGS_DETECTED</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {result.emotions_detected.map(emotion => (
                    <span key={emotion} className="inline-flex items-center gap-1 border border-purple-800/50 bg-purple-900/20 px-2 py-0.5 font-terminal text-xs text-purple-300">
                      {EMOTION_ICONS[emotion] || '💭'} {emotion}
                    </span>
                  ))}
                </div>
                <p className="font-terminal text-sm leading-relaxed text-zinc-300 italic">
                  &ldquo;{result.emotional_acknowledgment}&rdquo;
                </p>
              </div>

              {/* ── Quick Win ── */}
              <div className="flex items-start gap-3 border border-emerald-900/50 bg-emerald-950/20 p-4">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <span className="font-pixel text-[0.5rem] tracking-widest text-emerald-400">QUICK_WIN</span>
                  <p className="mt-1 font-terminal text-sm text-emerald-200">{result.quick_win}</p>
                </div>
              </div>

              {/* ── Overcommitment Warning ── */}
              {result.overcommitment_warning && result.overcommitment_message && (
                <div className="flex items-start gap-3 border border-amber-900/50 bg-amber-950/20 p-4">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  <div>
                    <span className="font-pixel text-[0.5rem] tracking-widest text-amber-400">OVERCOMMITMENT_WARNING</span>
                    <p className="mt-1 font-terminal text-sm text-amber-200">{result.overcommitment_message}</p>
                  </div>
                </div>
              )}

              {/* ── Tasks ── */}
              {result.tasks.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-zinc-400" />
                      <span className="font-pixel text-[0.5rem] tracking-widest text-zinc-400">
                        EXTRACTED_TASKS ({result.tasks.length})
                      </span>
                    </div>
                    {result.total_estimated_hours && (
                      <span className="flex items-center gap-1 font-terminal text-xs text-zinc-500">
                        <Clock className="h-3 w-3" />
                        ~{result.total_estimated_hours}h total
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {visibleTasks?.map((task: ParsedTask, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => toggleTask(idx)}
                        className={`flex w-full items-center gap-3 border px-3 py-2.5 text-left transition ${
                          selectedTasks.has(idx)
                            ? PRIORITY_COLORS[task.priority]
                            : 'border-zinc-800 bg-zinc-900/30 text-zinc-400'
                        }`}
                      >
                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center border ${
                          selectedTasks.has(idx) ? 'border-current bg-current/10' : 'border-zinc-700'
                        }`}>
                          {selectedTasks.has(idx) && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </div>
                        <span className="mr-1 text-base">{CATEGORY_ICONS[task.category] || '📌'}</span>
                        <div className="min-w-0 flex-1">
                          <p className={`truncate font-terminal text-sm ${
                            selectedTasks.has(idx) ? '' : 'text-zinc-500'
                          }`}>{task.title}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            <span className={`inline-block px-1.5 py-px font-pixel text-[0.35rem] tracking-widest ${PRIORITY_BADGE[task.priority]}`}>
                              {task.priority}
                            </span>
                            {task.estimated_minutes && (
                              <span className="font-terminal text-xs text-zinc-600">{task.estimated_minutes}m</span>
                            )}
                            {task.suggested_due && (
                              <span className="font-terminal text-xs text-zinc-600">due {task.suggested_due}</span>
                            )}
                            <span className="font-terminal text-xs text-zinc-700">{task.energy_level} energy</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {result.tasks.length > 8 && (
                    <button
                      onClick={() => setShowAllTasks(!showAllTasks)}
                      className="flex items-center gap-1 font-terminal text-xs text-zinc-500 transition hover:text-zinc-300"
                    >
                      {showAllTasks ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      {showAllTasks ? 'Show less' : `Show all ${result.tasks.length} tasks`}
                    </button>
                  )}
                </div>
              )}

              {/* ── Suggested Habits ── */}
              {result.habits_suggested.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-orange-400" />
                    <span className="font-pixel text-[0.5rem] tracking-widest text-orange-400">
                      HABITS_SUGGESTED ({result.habits_suggested.length})
                    </span>
                  </div>
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {result.habits_suggested.map((habit, idx) => (
                      <div key={idx} className="border border-orange-900/40 bg-orange-950/10 px-3 py-2">
                        <p className="font-terminal text-sm text-orange-200">{habit.name}</p>
                        <p className="font-terminal text-xs text-zinc-500 mt-0.5">
                          {habit.frequency} — {habit.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Patterns Observed ── */}
              {result.patterns_observed && (
                <div className="border-l-2 border-zinc-700 pl-4">
                  <span className="font-pixel text-[0.4rem] tracking-widest text-zinc-500">PATTERNS_OBSERVED</span>
                  <p className="mt-1 font-terminal text-sm text-zinc-400">{result.patterns_observed}</p>
                </div>
              )}

              {/* ── Action Buttons ── */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {!tasksAdded ? (
                  <button
                    onClick={handleAddTasks}
                    disabled={addingTasks || selectedTasks.size === 0}
                    className="flex flex-1 items-center justify-center gap-2 border border-emerald-700 bg-emerald-900/20 px-4 py-3 font-pixel text-[0.55rem] tracking-widest text-emerald-300 transition hover:bg-emerald-900/40 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {addingTasks ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        ADDING...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        ADD {selectedTasks.size} TASK{selectedTasks.size !== 1 ? 'S' : ''} + HABITS
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex flex-1 items-center justify-center gap-2 border border-emerald-700 bg-emerald-900/30 px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="font-pixel text-[0.55rem] tracking-widest text-emerald-300">TASKS ADDED!</span>
                  </div>
                )}

                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 border border-zinc-700 px-4 py-3 font-pixel text-[0.55rem] tracking-widest text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200"
                >
                  DUMP_AGAIN
                </button>
              </div>

              {/* ── Meta ── */}
              <div className="flex items-center gap-4 font-terminal text-xs text-zinc-700 pt-2 border-t border-zinc-900">
                {meta.provider && <span>provider: {meta.provider}</span>}
                {meta.attempts && <span>attempts: {meta.attempts}</span>}
                {meta.latencyMs && <span>{meta.latencyMs}ms</span>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
