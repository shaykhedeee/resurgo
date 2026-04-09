'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Quick Task Widget (Dashboard)
// Add an ad-hoc task from the dashboard; shows last 3 pending tasks
// ═══════════════════════════════════════════════════════════════════════════════

import { useCallback, useRef, useState } from 'react';import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Link from 'next/link';
import { Id } from '../../../convex/_generated/dataModel';
import { MicroCelebration, type MicroCelebrationHandle } from '@/components/MicroCelebration';

export default function QuickTaskWidget() {
  const [input, setInput] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | null>(null);
  const celebrationRef = useRef<MicroCelebrationHandle | null>(null);
  const onCelebrationMount = useCallback((h: MicroCelebrationHandle) => { celebrationRef.current = h; }, []);

  const createTask = useMutation(api.tasks.create);
  const toggleTask = useMutation(api.tasks.toggleComplete);
  const tasks = useQuery(api.tasks.list, { status: 'todo' });

  const pendingTasks = (tasks ?? []).slice(0, 3);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setAdding(true);
    setError('');
    try {
      await createTask({ title: text, priority: 'medium', ...(estimatedMinutes ? { estimatedMinutes } : {}) });
      setInput('');
      setEstimatedMinutes(null);
    } catch (err) {
      setError('ERR: Could not add task');
      console.error(err);
    } finally {
      setAdding(false);
    }
  }

  async function handleComplete(id: Id<'tasks'>) {
    try {
      await toggleTask({ taskId: id });
      celebrationRef.current?.trigger();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="border border-zinc-900 bg-black h-full flex flex-col relative">
      <MicroCelebration onMount={onCelebrationMount} />
      {/* Header */}
      <div className="border-b border-zinc-900 px-3 py-1.5 flex items-center justify-between">
        <span className="font-pixel text-[0.5rem] tracking-widest text-zinc-600">QUICK_TASK</span>
        <Link
          href="/tasks"
          className="font-pixel text-[0.4rem] tracking-widest text-zinc-700 hover:text-orange-500 transition-colors"
        >
          VIEW_ALL →
        </Link>
      </div>

      {/* Input */}
      <form onSubmit={handleAdd} className="px-3 py-2 flex gap-2">
        <div className="flex-1 flex items-center gap-1.5 border-b border-zinc-800 pb-1">
          <span className="font-terminal text-sm text-orange-500 shrink-0">$_</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="new task..."
            disabled={adding}
            className="flex-1 bg-transparent font-terminal text-sm text-zinc-300 placeholder:text-zinc-700 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={adding || !input.trim()}
          className="font-pixel text-[0.45rem] tracking-widest px-2 py-1 border border-zinc-800 text-zinc-400 hover:border-orange-700 hover:text-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          {adding ? '...' : '+ ADD'}
        </button>
      </form>

      {/* Time estimate chips */}
      {input.trim() && (
        <div className="px-3 pb-1.5 flex items-center gap-1.5">
          <span className="font-pixel text-[0.38rem] tracking-widest text-zinc-700 shrink-0">EST:</span>
          {[5, 15, 30, 60, 90].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setEstimatedMinutes(estimatedMinutes === m ? null : m)}
              className={`font-terminal text-[0.6rem] px-1.5 py-0.5 border transition-colors ${
                estimatedMinutes === m
                  ? 'border-orange-700 bg-orange-950/40 text-orange-400'
                  : 'border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400'
              }`}
            >
              {m}m
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="px-3 font-pixel text-[0.38rem] tracking-widest text-red-500">{error}</p>
      )}

      {/* Task list */}
      <div className="flex-1 px-3 pb-3 overflow-y-auto space-y-1.5">
        {tasks === undefined ? (
          <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-700 mt-2">LOADING_</p>
        ) : pendingTasks.length === 0 ? (
          <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-700 mt-2">[ NO_PENDING_TASKS ]</p>
        ) : (
          pendingTasks.map((task: { _id: Id<'tasks'>; title: string; priority: string; status: string; estimatedMinutes?: number }) => (
            <div key={task._id} className="flex items-center gap-2 group">
              <button
                onClick={() => handleComplete(task._id)}
                className="w-3.5 h-3.5 border border-zinc-700 group-hover:border-orange-700 transition-colors shrink-0 flex items-center justify-center"
              >
                <span className="font-pixel text-[0.3rem] text-transparent group-hover:text-orange-600">✓</span>
              </button>
              <span className="font-terminal text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors truncate">
                {task.title}
              </span>
              {task.estimatedMinutes && (
                <span className="font-terminal text-[0.6rem] text-zinc-600 shrink-0 border border-zinc-800 px-1 py-0.5">
                  {task.estimatedMinutes}m
                </span>
              )}
              {task.priority === 'high' && (
                <span className="font-pixel text-[0.35rem] tracking-widest text-red-600 shrink-0">!</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
