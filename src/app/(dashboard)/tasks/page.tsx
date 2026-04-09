'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Tasks Page
// Full task management with filters, Eisenhower matrix view, quick add
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { useMemo, useState } from 'react';
import { enqueueOfflineTask } from '@/lib/offline/queue';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import {
  Plus,
  Circle,
  CheckCircle2,
  Trash2,
  X,
  Grid3X3,
  List,
  Clock,
  Zap,
} from 'lucide-react';

type ViewMode = 'list' | 'eisenhower';
type StatusFilter = 'todo' | 'in_progress' | 'done' | undefined;

const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'urgent'] as const;
const QUADRANT_OPTIONS = ['urgent_important', 'important', 'urgent', 'neither'] as const;
const QUADRANT_LABELS: Record<string, string> = {
  urgent_important: 'Do First',
  important: 'Schedule',
  urgent: 'Delegate',
  neither: 'Eliminate',
};
const QUADRANT_COLORS: Record<string, string> = {
  urgent_important: 'border-red-900 bg-red-950/10',
  important: 'border-zinc-800 bg-zinc-950',
  urgent: 'border-yellow-900 bg-yellow-950/10',
  neither: 'border-zinc-900 bg-zinc-950',
};

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todo');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const tasks = useQuery(api.tasks.list, statusFilter ? { status: statusFilter } : {});
  const allTasks = useQuery(api.tasks.list, {});
  const createTask = useMutation(api.tasks.create);
  const toggleTask = useMutation(api.tasks.toggleComplete);
  const removeTask = useMutation(api.tasks.remove);
  const { isOnline, pendingTaskCount, recentTaskDrafts, syncingCount } = useOfflineQueue();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<typeof PRIORITY_OPTIONS[number]>('medium');
  const [dueDate, setDueDate] = useState('');
  const [eisenhower, setEisenhower] = useState<typeof QUADRANT_OPTIONS[number] | ''>('');
  const [estimatedMinutes, setEstimatedMinutes] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      if (!isOnline) {
        await enqueueOfflineTask({
          title: title.trim(),
          description: description || undefined,
          priority,
          dueDate: dueDate || undefined,
          eisenhowerQuadrant: eisenhower || undefined,
          estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes) : undefined,
          source: 'manual',
        });
        setTitle('');
        setDescription('');
        setDueDate('');
        setEisenhower('');
        setEstimatedMinutes('');
        setShowCreate(false);
        return;
      }

      await createTask({
        title: title.trim(),
        description: description || undefined,
        priority,
        dueDate: dueDate || undefined,
        eisenhowerQuadrant: eisenhower || undefined,
        estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes) : undefined,
        source: 'manual',
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      setEisenhower('');
      setEstimatedMinutes('');
      setShowCreate(false);
    } catch (e) {
      console.error('Failed to create task:', e);
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (taskId: string) => {
    try {
      await toggleTask({ taskId: taskId as Id<"tasks"> });
    } catch (e) {
      console.error('Failed to toggle task:', e);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await removeTask({ taskId: taskId as Id<"tasks"> });
    } catch (e) {
      console.error('Failed to delete task:', e);
    }
  };

  const todoCount = (allTasks ?? []).filter((task) => task.status === 'todo').length;
  const inProgressCount = (allTasks ?? []).filter((task) => task.status === 'in_progress').length;
  const doneCount = (allTasks ?? []).filter((task) => task.status === 'done').length;
  const urgentCount = (allTasks ?? []).filter((task) => task.priority === 'urgent').length;
  const nextTaskSuggestion = useMemo(() => {
    const source = allTasks ?? [];
    return source.find((task) => task.status === 'todo' && task.priority === 'urgent')
      ?? source.find((task) => task.status === 'todo' && task.priority === 'high')
      ?? source.find((task) => task.status === 'in_progress')
      ?? source.find((task) => task.status !== 'done');
  }, [allTasks]);
  const queueHealth = useMemo(() => {
    if (urgentCount > 0) return 'Pressure is building. Clear one urgent task first.';
    if (inProgressCount > 2) return 'Too many active items. Finish before adding more.';
    if (todoCount === 0) return 'Queue is calm. Capture the next meaningful step.';
    return 'Queue looks manageable. Keep the next move obvious.';
  }, [urgentCount, inProgressCount, todoCount]);

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-6xl">

        {/* -- TASK QUEUE HEADER -- */}
        <div className="surface-panel mb-6 overflow-hidden">
          <div className="surface-header">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="surface-kicker-accent">Task queue</span>
          </div>
          <div className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.8fr)]">
            <div>
              <p className="surface-kicker">Execution subsystem</p>
              <h1 className="surface-title mt-2">Tasks</h1>
              <p className="surface-subtitle mt-2 max-w-2xl">Prioritise the next few actions, keep the queue visible, and use the matrix when everything starts yelling at once.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="surface-chip">{todoCount} pending</span>
                <span className="surface-chip">{inProgressCount} active</span>
                <span className="surface-chip">{doneCount} done</span>
                {urgentCount > 0 && <span className="surface-chip-accent">{urgentCount} urgent</span>}
              </div>
              <p className="mt-4 font-terminal text-sm text-zinc-400">{queueHealth}</p>
            </div>
            <div className="surface-panel-muted p-4">
              <p className="surface-kicker-accent">Recommended next move</p>
              <p className="mt-3 font-terminal text-lg font-semibold text-zinc-100">{nextTaskSuggestion?.title ?? 'Capture one task worth doing today'}</p>
              <p className="mt-2 font-terminal text-sm text-zinc-400">
                {nextTaskSuggestion
                  ? `${nextTaskSuggestion.priority.toUpperCase()} priority${nextTaskSuggestion.dueDate ? ` • due ${nextTaskSuggestion.dueDate}` : ''}`
                  : 'A smaller queue is easier to trust.'}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-zinc-900 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-px">
              <button onClick={() => setViewMode('list')} className={`border p-2.5 transition ${viewMode === 'list' ? 'border-orange-800 bg-orange-950/30 text-orange-500' : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-300'}`} aria-label="List view">
                <List className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode('eisenhower')} className={`border p-2.5 transition ${viewMode === 'eisenhower' ? 'border-orange-800 bg-orange-950/30 text-orange-500' : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-300'}`} aria-label="Matrix view">
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button onClick={() => setShowCreate(true)} className="ml-px inline-flex items-center gap-2 border border-orange-800 bg-orange-950/30 px-4 py-2 font-mono text-xs tracking-widest text-orange-500 transition hover:border-orange-600 hover:bg-orange-950/60">
                <Plus className="h-3.5 w-3.5" /> QUEUE_TASK
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px border-t border-zinc-900 sm:grid-cols-4">
            <QMetric label="PENDING" value={String(todoCount)} />
            <QMetric label="IN_PROGRESS" value={String(inProgressCount)} />
            <QMetric label="COMPLETED" value={String(doneCount)} />
            <QMetric label="URGENT" value={String(urgentCount)} highlight={urgentCount > 0} />
          </div>
        </div>

        {(!isOnline || pendingTaskCount > 0 || syncingCount > 0) && (
          <div className="mb-4 border border-amber-900 bg-amber-950/20 px-4 py-3 font-mono text-xs text-amber-200">
            <div className="flex flex-wrap items-center gap-3">
              <span className="tracking-widest text-amber-400">OFFLINE_CAPTURE</span>
              <span>{isOnline ? 'Connection restored — syncing queued items.' : 'You are offline. New tasks will be queued locally.'}</span>
              {pendingTaskCount > 0 && <span className="text-amber-300">Queued tasks: {pendingTaskCount}</span>}
            </div>
          </div>
        )}

        {recentTaskDrafts.some((draft) => !draft.synced) && (
          <div className="mb-6 border border-zinc-900 bg-zinc-950">
            <div className="border-b border-zinc-900 px-4 py-2">
              <span className="font-mono text-xs tracking-widest text-orange-500">OFFLINE_QUEUE</span>
            </div>
            <div className="space-y-px p-0">
              {recentTaskDrafts.filter((draft) => !draft.synced).slice(0, 5).map((draft) => (
                <div key={draft.id} className="flex items-center justify-between border-t border-zinc-900 px-4 py-3 first:border-t-0">
                  <div>
                    <p className="font-mono text-sm text-zinc-100">{draft.title.toUpperCase()}</p>
                    <p className="mt-1 font-mono text-xs text-zinc-500">
                      queued {new Date(draft.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="font-mono text-xs tracking-widest text-amber-400">PENDING_SYNC</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -- STATUS FILTERS (list view) -- */}
        {viewMode === 'list' && (
          <div className="surface-panel-muted mb-4 flex gap-px overflow-hidden p-1">
            {[
              { key: 'todo' as const, label: 'PENDING' },
              { key: 'in_progress' as const, label: 'IN_PROGRESS' },
              { key: 'done' as const, label: 'COMPLETED' },
              { key: undefined, label: 'ALL' },
            ].map(({ key, label }) => (
              <button
                key={label}
                onClick={() => setStatusFilter(key)}
                className={`flex-1 py-2.5 font-mono text-xs tracking-widest transition border-b-2 ${
                  statusFilter === key
                    ? 'border-orange-600 bg-orange-950/20 text-orange-500'
                    : 'border-transparent bg-transparent text-zinc-400 hover:text-zinc-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* -- LIST VIEW -- */}
        {viewMode === 'list' && (
          <div className="space-y-px">
            {(!tasks || tasks.length === 0) ? (
              <div className="border border-dashed border-zinc-800 py-16 text-center">
                <p className="font-mono text-xs tracking-widest text-zinc-400">Queue empty</p>
                <p className="mt-2 font-mono text-xs text-zinc-400">No tasks in queue. Add a task to begin.</p>
                <button onClick={() => setShowCreate(true)} className="mt-4 border border-zinc-800 bg-zinc-900 px-4 py-2 font-mono text-xs tracking-widest text-zinc-500 transition hover:border-orange-900 hover:text-orange-500">
                  <Plus className="mr-1 inline h-3 w-3" /> QUEUE_TASK
                </button>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskItem key={task._id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
              ))
            )}
          </div>
        )}

        {/* -- EISENHOWER MATRIX VIEW -- */}
        {viewMode === 'eisenhower' && (
          <div className="grid gap-px md:grid-cols-2">
            {QUADRANT_OPTIONS.map((quad) => {
              const quadTasks = (allTasks ?? []).filter(t => t.eisenhowerQuadrant === quad);
              return (
                <div key={quad} className={`min-h-[260px] border p-4 ${QUADRANT_COLORS[quad]}`}>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-mono text-xs tracking-widest text-orange-500">{quad.toUpperCase()}</span>
                    <span className="font-mono text-xs text-zinc-400">:: {QUADRANT_LABELS[quad].toUpperCase()}</span>
                  </div>
                  <div className="space-y-px">
                    {quadTasks.map((task) => (
                      <TaskItem key={task._id} task={task} onToggle={handleToggle} onDelete={handleDelete} compact />
                    ))}
                    {quadTasks.length === 0 && (
                      <p className="font-mono text-xs text-zinc-500">No tasks assigned</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-3">
              <span className="font-mono text-xs tracking-widest text-orange-500">QUEUE_TASK :: ADD_TO_EXECUTION_QUEUE</span>
              <button onClick={() => setShowCreate(false)} className="text-zinc-400 transition hover:text-zinc-300">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="max-h-[80vh] space-y-4 overflow-y-auto p-5">
              <div className="surface-panel-muted p-3">
                <p className="surface-kicker-accent">Queue guidance</p>
                <p className="mt-2 font-terminal text-sm text-zinc-300">Write the next visible action, not the whole saga. Future-you says thanks.</p>
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">TASK_TITLE *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" required autoFocus />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">DESCRIPTION</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add details..." rows={2} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">PRIORITY</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value as typeof PRIORITY_OPTIONS[number])} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none">
                    {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">DUE_DATE</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">MATRIX_QUADRANT</label>
                  <select value={eisenhower} onChange={(e) => setEisenhower(e.target.value as typeof QUADRANT_OPTIONS[number])} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none">
                    <option value="">NONE</option>
                    {QUADRANT_OPTIONS.map((q) => <option key={q} value={q}>{QUADRANT_LABELS[q].toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-xs tracking-widest text-zinc-500">EST_MINUTES</label>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {[5, 15, 30, 60, 120].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setEstimatedMinutes(estimatedMinutes === String(m) ? '' : String(m))}
                        className={`border px-2.5 py-1.5 font-mono text-xs tracking-widest transition ${
                          estimatedMinutes === String(m)
                            ? 'border-orange-700 bg-orange-950/60 text-orange-400'
                            : 'border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                        }`}
                      >
                        {m >= 60 ? `${m / 60}hr` : `${m}m`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-px pt-1">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 border border-zinc-800 bg-zinc-900 py-2.5 font-mono text-xs tracking-widest text-zinc-500 transition hover:text-zinc-300">[CANCEL]</button>
                <button type="submit" disabled={creating || !title.trim()} className="flex-1 border border-orange-800 bg-orange-950/40 py-2.5 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/70 disabled:opacity-40">
                  {creating ? 'QUEUING...' : isOnline ? '[QUEUE_TASK]' : '[SAVE_OFFLINE]'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskItem({ task, onToggle, onDelete, compact }: {
  task: {
    _id: string;
    title: string;
    status: string;
    priority: string;
    dueDate?: string;
    xpValue?: number;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}) {
  const isDone = task.status === 'done';
  const priorityMap: Record<string, string> = {
    urgent: 'border-red-900 bg-red-950/30 text-red-500',
    high: 'border-orange-900 bg-orange-950/30 text-orange-500',
    medium: 'border-yellow-900 bg-yellow-950/30 text-yellow-600',
    low: 'border-zinc-800 text-zinc-400',
  };
  return (
    <div className={`group flex items-center gap-3 border border-zinc-900 bg-zinc-950 px-4 py-3 transition hover:border-zinc-700 hover:bg-zinc-900 ${compact ? 'py-2' : ''}`}>
      <button onClick={() => onToggle(task._id)} className="flex h-11 w-11 shrink-0 items-center justify-center -m-1.5 rounded-sm">
        {isDone ? (
          <CheckCircle2 className="h-5 w-5 text-orange-600" />
        ) : (
          <Circle className="h-5 w-5 text-zinc-400 transition hover:text-orange-500" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-mono text-sm ${isDone ? 'text-zinc-400 line-through' : 'text-zinc-200'}`}>
          {task.title.toUpperCase()}
        </p>
        {!compact && (
          <div className="mt-0.5 flex items-center gap-2">
            <span className={`border px-1.5 py-0.5 font-mono text-xs tracking-widest ${priorityMap[task.priority] ?? priorityMap.low}`}>
              {task.priority.toUpperCase()}
            </span>
            {task.dueDate && (
              <span className="flex items-center gap-1 font-mono text-xs text-zinc-400">
                <Clock className="h-2.5 w-2.5" /> DUE_{task.dueDate.replace(/-/g, '')}
              </span>
            )}
            {task.xpValue && (
              <span className="flex items-center gap-1 font-mono text-xs text-orange-700">
                <Zap className="h-2.5 w-2.5" /> {task.xpValue}XP
              </span>
            )}
          </div>
        )}
      </div>
      <button onClick={() => onDelete(task._id)} className="flex h-10 w-10 shrink-0 items-center justify-center text-zinc-800 opacity-0 transition hover:text-red-600 group-hover:opacity-100">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function QMetric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-zinc-950 px-4 py-3 transition hover:bg-zinc-900">
          <p className="font-mono text-xs tracking-widest text-zinc-400">{label}</p>
      <p className={`mt-0.5 font-mono text-lg font-bold ${highlight ? 'text-orange-500' : 'text-zinc-100'}`}>{value}</p>
    </div>
  );
}
