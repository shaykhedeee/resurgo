'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Ascendify — Goal Detail Page
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Edit3,
  Trash2,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { useState } from 'react';

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = params.id as string;
  const goal = useQuery(api.goals.getById, { goalId: goalId as Id<"goals"> });
  const tasks = useQuery(api.tasks.listByGoal, { goalId: goalId as Id<"goals"> });
  const updateGoal = useMutation(api.goals.update);
  const removeGoal = useMutation(api.goals.remove);

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  if (goal === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="animate-pulse font-mono text-xs tracking-widest text-orange-600">LOADING_OBJECTIVE...</p>
      </div>
    );
  }

  if (goal === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black">
        <p className="font-mono text-xs tracking-widest text-zinc-400">OBJECTIVE_NOT_FOUND</p>
        <Link href="/goals" className="border border-zinc-800 px-3 py-1.5 font-mono text-[10px] tracking-widest text-zinc-500 transition hover:border-zinc-700">[RETURN_TO_OBJECTIVES]</Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm('Delete this goal? This cannot be undone.')) return;
    await removeGoal({ goalId: goalId as Id<"goals"> });
    router.push('/goals');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateGoal({
      goalId: goalId as Id<"goals">,
      title: editTitle || undefined,
      description: editDescription || undefined,
    });
    setEditing(false);
  };

  const handleStatusChange = async (status: string) => {
    await updateGoal({
      goalId: goalId as Id<"goals">,
      status: status as 'draft' | 'in_progress' | 'completed' | 'paused' | 'abandoned',
    });
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-3xl">

        {/* ── BACK NAV ── */}
        <Link href="/goals" className="mb-6 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-zinc-400 transition hover:text-zinc-300">
          <ArrowLeft className="h-3 w-3" /> [RETURN_TO_OBJECTIVES]
        </Link>

        {/* ── GOAL HEADER ── */}
        <div className="mb-4 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">CORE_OBJECTIVE :: DETAIL_VIEW</span>
          </div>

          <div className="p-4">
            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-3">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-400 focus:border-orange-800 focus:outline-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button type="submit" className="border border-orange-800 bg-orange-950/30 px-3 py-1.5 font-mono text-[10px] tracking-widest text-orange-500 transition hover:bg-orange-950/50">[SAVE]</button>
                  <button type="button" onClick={() => setEditing(false)} className="border border-zinc-800 px-3 py-1.5 font-mono text-[10px] tracking-widest text-zinc-500 transition hover:border-zinc-700">[CANCEL]</button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="font-mono text-xl font-bold tracking-tight text-zinc-100">{goal.title}</h1>
                  {goal.description && (
                    <p className="mt-1.5 font-mono text-xs text-zinc-400">{goal.description}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditTitle(goal.title); setEditDescription(goal.description || ''); setEditing(true); }}
                    className="border border-zinc-800 p-1.5 text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-300"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button onClick={handleDelete} className="border border-red-900/50 p-1.5 text-red-700 transition hover:border-red-800 hover:text-red-500">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="border-t border-zinc-900 px-4 py-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono text-[9px] tracking-widest text-zinc-400">COMPLETION_RATIO</span>
              <span className="font-mono text-sm font-bold text-orange-500">{goal.progress ?? 0}%</span>
            </div>
            <div className="h-0.5 overflow-hidden bg-zinc-900">
              <div
                className="h-full bg-orange-600 transition-all duration-500"
                style={{ width: `${goal.progress ?? 0}%` }}
              />
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 border-t border-zinc-900 px-4 py-3">
            <span className="flex items-center gap-1 font-mono text-[10px] tracking-widest text-zinc-400">
              <TrendingUp className="h-3 w-3" />
              <span className="text-zinc-500">{goal.status?.replace('_', ' ').toUpperCase()}</span>
            </span>
            {goal.lifeDomain && (
              <span className="border border-zinc-800 px-2 py-0.5 font-mono text-[9px] tracking-widest text-zinc-400">
                {goal.lifeDomain.replace('_', ' ').toUpperCase()}
              </span>
            )}
            {goal.targetDate && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-400">
                <Calendar className="h-3 w-3" /> {goal.targetDate}
              </span>
            )}
          </div>

          {/* Why Important */}
          {goal.whyImportant && (
            <div className="border-t border-zinc-900 px-4 py-3">
              <p className="mb-1 font-mono text-[9px] tracking-widest text-orange-600">WHY_THIS_MATTERS</p>
              <p className="font-mono text-xs text-zinc-500">{goal.whyImportant}</p>
            </div>
          )}

          {/* Status Actions */}
          <div className="flex flex-wrap gap-2 border-t border-zinc-900 px-4 py-3">
            {goal.status !== 'completed' && (
              <button
                onClick={() => handleStatusChange('completed')}
                className="flex items-center gap-1.5 border border-green-900 bg-green-950/20 px-3 py-1.5 font-mono text-[10px] tracking-widest text-green-500 transition hover:bg-green-950/40"
              >
                <CheckCircle2 className="h-3 w-3" /> [MARK_COMPLETE]
              </button>
            )}
            {goal.status === 'in_progress' && (
              <button
                onClick={() => handleStatusChange('paused')}
                className="border border-yellow-900/50 bg-yellow-950/20 px-3 py-1.5 font-mono text-[10px] tracking-widest text-yellow-600 transition hover:bg-yellow-950/40"
              >
                [PAUSE]
              </button>
            )}
            {goal.status === 'paused' && (
              <button
                onClick={() => handleStatusChange('in_progress')}
                className="border border-blue-900/50 bg-blue-950/20 px-3 py-1.5 font-mono text-[10px] tracking-widest text-blue-500 transition hover:bg-blue-950/40"
              >
                [RESUME]
              </button>
            )}
          </div>
        </div>

        {/* ── RELATED TASKS ── */}
        <div className="border border-zinc-900 bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2.5">
            <span className="font-mono text-[10px] font-bold tracking-widest text-zinc-400">Linked Tasks</span>
            <Link href="/tasks" className="font-mono text-[10px] tracking-widest text-orange-600 transition hover:text-orange-500">[Add Task]</Link>
          </div>

          {!tasks || tasks.length === 0 ? (
            <p className="px-4 py-6 font-mono text-xs tracking-widest text-zinc-400">No tasks linked to this goal yet.</p>
          ) : (
            <div className="divide-y divide-zinc-900">
              {tasks.map((task: any) => (
                <div key={task._id} className="flex items-center gap-3 px-4 py-3 transition hover:bg-zinc-900">
                  <div className={`h-3 w-3 border ${task.status === 'done' ? 'border-green-600 bg-green-950/40' : 'border-zinc-700'}`} />
                  <p className={`flex-1 font-mono text-xs ${task.status === 'done' ? 'text-zinc-400 line-through' : 'text-zinc-400'}`}>
                    {task.title}
                  </p>
                  {task.dueDate && <span className="font-mono text-[9px] text-zinc-400">{task.dueDate}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

