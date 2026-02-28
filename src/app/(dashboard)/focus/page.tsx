'use client';

// ─────────────────────────────────────────────────────────────────────────────
// RESURGO – Focus Timer Page  (DEEP_WORK_PROTOCOL)
// Pomodoro & Deep Work focus sessions with distraction tracking
// Convex data layer: focusSessions.start / complete / cancel / logDistraction
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  AlertTriangle,
  Trophy,
  Clock,
  Zap,
} from 'lucide-react';

const FOCUS_METHODS = [
  { id: 'pomodoro'  as const, label: 'Pomodoro 25/5',  work: 25, breakMin: 5  },
  { id: 'time_box'  as const, label: 'Pomodoro 50/10', work: 50, breakMin: 10 },
  { id: 'deep_work' as const, label: 'Deep Work 90',   work: 90, breakMin: 15 },
  { id: 'flowtime'  as const, label: 'Flowtime',       work:  0, breakMin:  0 },
  { id: 'custom'    as const, label: 'Custom',         work:  0, breakMin:  0 },
];

type FocusState = 'idle' | 'working' | 'break' | 'paused';

export default function FocusPage() {
  // ── Convex mutations & queries ──────────────────────────────────────────
  const startSession    = useMutation(api.focusSessions.start);
  const completeSession = useMutation(api.focusSessions.complete);
  const cancelSession   = useMutation(api.focusSessions.cancel);
  const logDistraction  = useMutation(api.focusSessions.logDistraction);
  const todaySessions   = useQuery(api.focusSessions.today);
  const stats           = useQuery(api.focusSessions.getStats, {});

  // ── Local state ─────────────────────────────────────────────────────────
  const [methodIdx, setMethodIdx]           = useState(0);
  const method                              = FOCUS_METHODS[methodIdx];
  const [customMinutes, setCustomMinutes]   = useState(25);
  const [state, setState]                   = useState<FocusState>('idle');
  const [secondsLeft, setSecondsLeft]       = useState(0);
  const [totalSeconds, setTotalSeconds]     = useState(0);
  const [sessionId, setSessionId]           = useState<string | null>(null);
  const [distractionCount, setDistractionCount] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (s: number) => {
    const m   = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0
    ? ((totalSeconds - secondsLeft) / totalSeconds) * 100
    : 0;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Timer tick
  useEffect(() => {
    if (state === 'working' || state === 'break') {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return clearTimer;
  }, [state, clearTimer]);

  // Handle timer reaching zero
  useEffect(() => {
    if (secondsLeft === 0 && state === 'working') {
      clearTimer();
      handleComplete();
    } else if (secondsLeft === 0 && state === 'break') {
      clearTimer();
      setState('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const handleStart = async () => {
    const workMinutes = method.id === 'custom' ? customMinutes : method.work;
    if (workMinutes <= 0 && method.id !== 'flowtime') return;
    const flowtime = method.id === 'flowtime';
    const duration = flowtime ? 60 : workMinutes;
    try {
      const id = await startSession({ type: method.id, durationMinutes: duration });
      setSessionId(id);
      setSecondsLeft(duration * 60);
      setTotalSeconds(duration * 60);
      setDistractionCount(0);
      setState('working');
    } catch (e) {
      console.error('Failed to start session:', e);
    }
  };

  const handleComplete = async () => {
    clearTimer();
    if (sessionId) {
      try {
        await completeSession({ sessionId: sessionId as Id<'focusSessions'> });
      } catch (e) {
        console.error('Failed to complete session:', e);
      }
    }
    setState('idle');
    setSessionId(null);
    if (method.breakMin > 0) {
      setSecondsLeft(method.breakMin * 60);
      setTotalSeconds(method.breakMin * 60);
      setState('break');
    }
  };

  const handleCancel = async () => {
    clearTimer();
    if (sessionId) {
      try {
        await cancelSession({ sessionId: sessionId as Id<'focusSessions'> });
      } catch (e) {
        console.error('Failed to cancel session:', e);
      }
    }
    setState('idle');
    setSessionId(null);
    setSecondsLeft(0);
  };

  const handlePause   = () => { clearTimer(); setState('paused'); };
  const handleResume  = () => { setState('working'); };

  const handleDistraction = async () => {
    setDistractionCount((prev) => prev + 1);
    if (sessionId) {
      try {
        await logDistraction({
          sessionId: sessionId as Id<'focusSessions'>,
          description: 'Distraction logged',
        });
      } catch (e) {
        console.error('Failed to log distraction:', e);
      }
    }
  };

  const isActive      = state === 'working' || state === 'break' || state === 'paused';
  const todayMinutes  = todaySessions?.reduce((sum: number, s: any) => sum + (s.actualDuration ?? s.duration), 0) ?? 0;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-5xl">

        {/* ── DEEP_WORK_PROTOCOL HEADER ── */}
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">
              DEEP_WORK_PROTOCOL :: FOCUS_ENGINE
            </span>
          </div>
          <div className="px-5 py-4">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">
              DEEP_WORK_PROTOCOL
            </h1>
            <p className="mt-1 font-mono text-xs tracking-widest text-zinc-400">
              {FOCUS_METHODS[methodIdx].label.toUpperCase().replace(/ /g, '_')}{' '}
              &mdash; STAY_IN_FLOW
            </p>
          </div>
          {/* KPI strip */}
          <div className="grid grid-cols-3 gap-px border-t border-zinc-900">
            {([
              ['TODAY_SESSIONS',     todaySessions?.length ?? 0],
              ['TODAY_MINUTES',      todayMinutes],
              ['ALL_TIME_SESSIONS',  stats?.totalSessions ?? 0],
            ] as [string, number][]).map(([label, val]) => (
              <div key={label} className="bg-zinc-950 px-4 py-3 transition hover:bg-zinc-900">
                <p className="font-mono text-[9px] tracking-widest text-zinc-400">{label}</p>
                <p className="mt-0.5 font-mono text-xl font-bold text-zinc-100">{val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* ── TIMER PANEL ── */}
          <div className="flex flex-col items-center border border-zinc-900 bg-zinc-950 p-6 lg:col-span-2">

            {/* Method selectors */}
            {!isActive && (
              <div className="mb-8 flex flex-wrap justify-center gap-2">
                {FOCUS_METHODS.map((m, i) => (
                  <button
                    key={m.label}
                    onClick={() => setMethodIdx(i)}
                    className={`border px-3 py-1.5 font-mono text-[10px] tracking-widest transition-all ${
                      methodIdx === i
                        ? 'border-orange-800 bg-orange-950/30 text-orange-500'
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-400'
                    }`}
                  >
                    {m.label.toUpperCase().replace(/ /g, '_')}
                  </button>
                ))}
              </div>
            )}

            {/* Custom duration */}
            {!isActive && method.id === 'custom' && (
              <div className="mb-6 flex items-center gap-3 border border-zinc-800 bg-black px-4 py-2">
                <input
                  type="number"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 bg-transparent font-mono text-center text-sm text-zinc-100 focus:outline-none"
                />
                <span className="font-mono text-[10px] tracking-widest text-zinc-400">MINUTES</span>
              </div>
            )}

            {/* Timer ring */}
            <div className="relative mb-8 flex h-64 w-64 items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 256 256">
                <circle cx="128" cy="128" r="120" fill="none" stroke="#18181B" strokeWidth="4" />
                <circle
                  cx="128" cy="128" r="120" fill="none"
                  stroke={state === 'break' ? '#22c55e' : '#EA580C'}
                  strokeWidth="4"
                  strokeLinecap="square"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="z-10 text-center">
                <p className="font-mono text-5xl font-bold tabular-nums text-zinc-100">
                  {isActive
                    ? formatTime(secondsLeft)
                    : formatTime((method.id === 'custom' ? customMinutes : method.work) * 60)}
                </p>
                <p className={`mt-1 font-mono text-[10px] tracking-widest ${
                  state === 'working' ? 'text-orange-500'
                  : state === 'break'  ? 'text-green-500'
                  : state === 'paused' ? 'text-yellow-500'
                  : 'text-zinc-400'
                }`}>
                  {state === 'idle'    ? 'STANDBY'
                   : state === 'break'  ? 'BREAK_IN_PROGRESS'
                   : state === 'paused' ? 'SESSION_PAUSED'
                   : 'DEEP_WORK_ACTIVE'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {state === 'idle' && (
                <button
                  onClick={handleStart}
                  className="flex h-14 w-14 items-center justify-center border border-orange-800 bg-orange-950/30 text-orange-500 transition hover:bg-orange-950/60"
                >
                  <Play className="ml-0.5 h-6 w-6" />
                </button>
              )}
              {state === 'working' && (
                <>
                  <button
                    onClick={handlePause}
                    className="flex h-14 w-14 items-center justify-center border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-yellow-800 hover:text-yellow-500"
                  >
                    <Pause className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleComplete}
                    className="flex h-14 w-14 items-center justify-center border border-green-900 bg-green-950/30 text-green-500 transition hover:bg-green-950/60"
                  >
                    <Square className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleDistraction}
                    title="LOG_DISTRACTION"
                    className="flex h-10 w-10 items-center justify-center border border-red-900 bg-red-950/30 text-red-500 transition hover:bg-red-950/60"
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </button>
                </>
              )}
              {state === 'paused' && (
                <>
                  <button
                    onClick={handleResume}
                    className="flex h-14 w-14 items-center justify-center border border-orange-800 bg-orange-950/30 text-orange-500 transition hover:bg-orange-950/60"
                  >
                    <Play className="ml-0.5 h-6 w-6" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex h-10 w-10 items-center justify-center border border-red-900 bg-red-950/30 text-red-500 transition hover:bg-red-950/60"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </>
              )}
              {state === 'break' && (
                <button
                  onClick={() => { clearTimer(); setState('idle'); }}
                  className="flex h-14 w-14 items-center justify-center border border-green-900 bg-green-950/30 text-green-500 transition hover:bg-green-950/60"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Distraction counter */}
            {isActive && distractionCount > 0 && (
              <p className="mt-6 border border-red-900 bg-red-950/30 px-4 py-1.5 font-mono text-[10px] tracking-widest text-red-500">
                {distractionCount}_DISTRACTION{distractionCount !== 1 ? 'S' : ''}_LOGGED
              </p>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-4">

            {/* Today's sessions */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
                <Clock className="h-3 w-3 text-zinc-400" />
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">TODAY_LOG</span>
              </div>
              {!todaySessions || todaySessions.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-mono text-[10px] tracking-widest text-zinc-400">NO_SESSIONS_YET</p>
                </div>
              ) : (
                <div className="space-y-px p-1">
                  {todaySessions.map((s: any) => (
                    <div key={s._id} className="flex items-center justify-between px-3 py-2 hover:bg-zinc-900">
                      <span className="font-mono text-[10px] tracking-widest text-zinc-400">
                        {s.type.toUpperCase()}
                      </span>
                      <span className="font-mono text-xs font-bold text-zinc-300">
                        {s.actualDuration ?? s.duration}_MIN
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lifetime stats */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
                <Zap className="h-3 w-3 text-zinc-400" />
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">LIFETIME_STATS</span>
              </div>
              <div className="space-y-px p-1">
                {([
                  ['TOTAL_SESSIONS',  stats?.totalSessions  ?? 0],
                  ['TOTAL_MINUTES',   stats?.totalMinutes   ?? 0],
                  ['AVG_FOCUS_SCORE', stats?.avgFocusScore  ?? 'N/A'],
                  ['BEST_STREAK',     `${stats?.bestStreak  ?? 0}_DAYS`],
                ] as [string, string | number][]).map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between px-3 py-2">
                    <span className="font-mono text-[10px] tracking-widest text-zinc-400">{label}</span>
                    <span className="font-mono text-xs font-bold text-zinc-200">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement insight */}
            {stats && stats.totalSessions > 0 && (
              <div className="border border-orange-900 bg-orange-950/20 px-4 py-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <Trophy className="h-3 w-3 text-orange-600" />
                  <p className="font-mono text-[9px] tracking-widest text-orange-600">PROTOCOL_INSIGHT</p>
                </div>
                <p className="font-mono text-xs text-zinc-400">
                  {stats.totalSessions >= 100
                    ? 'CENTURY_MARK_REACHED. Elite operator status.'
                    : stats.totalSessions >= 50
                    ? '50+_SESSIONS. Deep work becoming protocol.'
                    : 'Continue building the deep work protocol.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
