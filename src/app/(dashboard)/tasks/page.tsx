'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Tasks Page
// Full task management with filters, Eisenhower matrix view, quick add
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { useState } from 'react';
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
    }
    setCreating(false);
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

  const todoCount = (allTasks ?? []).filter((task: any) => task.status === 'todo').length;
  const inProgressCount = (allTasks ?? []).filter((task: any) => task.status === 'in_progress').length;
  const doneCount = (allTasks ?? []).filter((task: any) => task.status === 'done').length;
  const urgentCount = (allTasks ?? []).filter((task: any) => task.priority === 'urgent').length;

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-6xl">

        {/* -- TASK QUEUE HEADER -- */}
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">TASK_QUEUE :: EXECUTION_SUBSYSTEM</span>
          </div>
          <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Tasks</h1>
              <p className="mt-1 font-mono text-xs tracking-widest text-zinc-400">Prioritise and execute � Eisenhower matrix available</p>
            </div>
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

        {/* -- STATUS FILTERS (list view) -- */}
        {viewMode === 'list' && (
          <div className="mb-4 flex gap-px border border-zinc-900">
            {[
              { key: 'todo' as const, label: 'PENDING' },
              { key: 'in_progress' as const, label: 'IN_PROGRESS' },
              { key: 'done' as const, label: 'COMPLETED' },
              { key: undefined, label: 'ALL' },
            ].map(({ key, label }) => (
              <button
                key={label}
                onClick={() => setStatusFilter(key)}
                className={`flex-1 py-2.5 font-mono text-[10px] tracking-widest transition border-b-2 ${
                  statusFilter === key
                    ? 'border-orange-600 bg-orange-950/20 text-orange-500'
                    : 'border-transparent bg-zinc-950 text-zinc-400 hover:text-zinc-300'
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
                <p className="mt-2 font-mono text-[10px] text-zinc-400">No tasks in queue. Add a task to begin.</p>
                <button onClick={() => setShowCreate(true)} className="mt-4 border border-zinc-800 bg-zinc-900 px-4 py-2 font-mono text-[10px] tracking-widest text-zinc-500 transition hover:border-orange-900 hover:text-orange-500">
                  <Plus className="mr-1 inline h-3 w-3" /> QUEUE_TASK
                </button>
              </div>
            ) : (
              tasks.map((task: any) => (
                <TaskItem key={task._id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
              ))
            )}
          </div>
        )}

        {/* -- EISENHOWER MATRIX VIEW -- */}
        {viewMode === 'eisenhower' && (
          <div className="grid gap-px md:grid-cols-2">
            {QUADRANT_OPTIONS.map((quad) => {
              const quadTasks = (allTasks ?? []).filter((t: any) => t.eisenhowerQuadrant === quad);
              return (
                <div key={quad} className={`min-h-[200px] border p-4 ${QUADRANT_COLORS[quad]}`}>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-mono text-[10px] tracking-widest text-orange-500">{quad.toUpperCase()}</span>
                    <span className="font-mono text-[10px] text-zinc-400">:: {QUADRANT_LABELS[quad].toUpperCase()}</span>
                  </div>
                  <div className="space-y-px">
                    {quadTasks.map((task: any) => (
                      <TaskItem key={task._id} task={task} onToggle={handleToggle} onDelete={handleDelete} compact />
                    ))}
                    {quadTasks.length === 0 && (
                      <p className="font-mono text-[10px] text-zinc-500">No tasks assigned</p>
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
            <form onSubmit={handleCreate} className="max-h-[80vh] overflow-y-auto p-5 space-y-4">
              <div>
                <label className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">TASK_TITLE *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" required autoFocus />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">DESCRIPTION</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add details..." rows={2} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">PRIORITY</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value as typeof PRIORITY_OPTIONS[number])} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none">
                    {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">DUE_DATE</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">MATRIX_QUADRANT</label>
                  <select value={eisenhower} onChange={(e) => setEisenhower(e.target.value as typeof QUADRANT_OPTIONS[number])} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none">
                    <option value="">NONE</option>
                    {QUADRANT_OPTIONS.map((q) => <option key={q} value={q}>{QUADRANT_LABELS[q].toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">EST_MINUTES</label>
                  <input type="number" value={estimatedMinutes} onChange={(e) => setEstimatedMinutes(e.target.value)} placeholder="30" className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-px pt-1">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 border border-zinc-800 bg-zinc-900 py-2.5 font-mono text-[10px] tracking-widest text-zinc-500 transition hover:text-zinc-300">[CANCEL]</button>
                <button type="submit" disabled={creating || !title.trim()} className="flex-1 border border-orange-800 bg-orange-950/40 py-2.5 font-mono text-[10px] tracking-widest text-orange-500 transition hover:bg-orange-950/70 disabled:opacity-40">
                  {creating ? 'QUEUING...' : '[QUEUE_TASK]'}
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
      <button onClick={() => onToggle(task._id)} className="shrink-0">
        {isDone ? (
          <CheckCircle2 className="h-4 w-4 text-orange-600" />
        ) : (
          <Circle className="h-4 w-4 text-zinc-400 transition hover:text-orange-500" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-mono text-xs ${isDone ? 'text-zinc-400 line-through' : 'text-zinc-200'}`}>
          {task.title.toUpperCase()}
        </p>
        {!compact && (
          <div className="mt-0.5 flex items-center gap-2">
            <span className={`border px-1.5 py-0.5 font-mono text-[9px] tracking-widest ${priorityMap[task.priority] ?? priorityMap.low}`}>
              {task.priority.toUpperCase()}
            </span>
            {task.dueDate && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-400">
                <Clock className="h-2.5 w-2.5" /> DUE_{task.dueDate.replace(/-/g, '')}
              </span>
            )}
            {task.xpValue && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-orange-700">
                <Zap className="h-2.5 w-2.5" /> {task.xpValue}XP
              </span>
            )}
          </div>
        )}
      </div>
      <button onClick={() => onDelete(task._id)} className="shrink-0 text-zinc-800 opacity-0 transition hover:text-red-600 group-hover:opacity-100">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function QMetric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-zinc-950 px-4 py-3 transition hover:bg-zinc-900">
          <p className="font-mono text-[9px] tracking-widest text-zinc-400">{label}</p>
      <p className={`mt-0.5 font-mono text-lg font-bold ${highlight ? 'text-orange-500' : 'text-zinc-100'}`}>{value}</p>
    </div>
  );
}
