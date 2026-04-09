'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Focus Timer Dashboard Widget (Compact Pomodoro)
// Inline pomodoro with tomato counter, terminal aesthetic
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Users } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

type Mode = 'work' | 'break';

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

export default function FocusTimerWidget() {
  const [mode, setMode] = useState<Mode>('work');
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [sessions, setSessions] = useState(0);
  const [taskLabel, setTaskLabel] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Body doubling: how many users are actively focusing right now
  const activeFocusCount = useQuery(api.focusSessions.getActiveFocusCount) ?? 0;

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      // Session complete
      if (mode === 'work') {
        setSessions((s) => s + 1);
        analytics.focusSessionCompleted(Math.round(WORK_DURATION / 60));
        setMode('break');
        setTimeLeft(BREAK_DURATION);
        setRunning(false);
      } else {
        setMode('work');
        setTimeLeft(WORK_DURATION);
        setRunning(false);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, timeLeft, mode]);

  const toggle = useCallback(() => setRunning((r) => !r), []);
  const reset = useCallback(() => {
    setRunning(false);
    setMode('work');
    setTimeLeft(WORK_DURATION);
  }, []);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const total = mode === 'work' ? WORK_DURATION : BREAK_DURATION;
  const pct = ((total - timeLeft) / total) * 100;

  return (
    <div className="border border-zinc-900 bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
        <span className={`h-2 w-2 rounded-full ${running ? 'animate-pulse bg-red-500' : 'bg-zinc-600'}`} />
        <span className="font-pixel text-[0.6rem] tracking-widest text-red-400">
          {mode === 'work' ? 'DEEP_WORK' : 'BREAK'}
        </span>
        <span className="ml-auto flex items-center gap-1 font-terminal text-xs text-zinc-500">
          {Array.from({ length: sessions }, (_, i) => (
            <span key={i} className="text-red-400">🍅</span>
          ))}
          {sessions === 0 && '0 sessions'}
        </span>
      </div>

      {/* Body doubling indicator */}
      {activeFocusCount > 0 && (
        <div className="flex items-center gap-1.5 border-b border-zinc-900 bg-zinc-900/40 px-4 py-1.5">
          <Users className="h-3 w-3 text-emerald-500" />
          <span className="font-terminal text-[0.65rem] text-emerald-400">
            {activeFocusCount} {activeFocusCount === 1 ? 'person' : 'people'} focusing right now
          </span>
          <span className="ml-1 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Timer display */}
        <div className="flex items-center justify-center">
          <span className="font-terminal text-5xl font-bold tabular-nums tracking-tight text-zinc-100">
            {mins}
            <span className="animate-pulse text-orange-500">:</span>
            {secs}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-zinc-900 border border-zinc-800">
          <div
            className={`h-full transition-all duration-1000 ${mode === 'work' ? 'bg-gradient-to-r from-red-700 to-orange-500' : 'bg-gradient-to-r from-cyan-700 to-cyan-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Task label */}
        <input
          type="text"
          placeholder="Working on..."
          value={taskLabel}
          onChange={(e) => setTaskLabel(e.target.value)}
          className="w-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-terminal text-xs text-zinc-300 placeholder-zinc-600 outline-none focus:border-orange-700"
        />

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={toggle}
            className={`flex items-center gap-1.5 border px-4 py-2 font-terminal text-xs transition ${
              running
                ? 'border-orange-700 bg-orange-950/30 text-orange-400 hover:bg-orange-950/50'
                : 'border-emerald-700 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-950/50'
            }`}
          >
            {running ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {running ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 border border-zinc-800 bg-zinc-900 px-3 py-2 font-terminal text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
          {mode === 'work' && (
            <button
              onClick={() => {
                setRunning(false);
                setMode('break');
                setTimeLeft(BREAK_DURATION);
              }}
              className="flex items-center gap-1.5 border border-zinc-800 bg-zinc-900 px-3 py-2 font-terminal text-xs text-cyan-400 transition hover:border-cyan-700"
            >
              <Coffee className="h-3 w-3" /> Break
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
