'use client';

// ════════════════════════════════════════════════════════════════════════════
// RESURGO — SocialProof — terminal-themed live stats dashboard
// btop / system-monitor inspired — shows live Convex metrics with CRT polish
// ════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import Link from 'next/link';

const STAT_CONFIG = [
  {
    id: 'users',
    label: 'Users onboarded',
    cmd: 'users.count()',
    icon: '◈',
    barColor: 'bg-orange-600',
    valueColor: 'text-orange-400',
    borderCol: 'border-orange-900/40',
    barWidth: (v: number) => `${Math.min(100, 10 + (v % 90))}%`,
    getValue: (s: { totalUsers?: number }) => s?.totalUsers ?? 0,
  },
  {
    id: 'tasks',
    label: 'Tasks completed',
    cmd: 'tasks.completed()',
    icon: '◉',
    barColor: 'bg-green-600',
    valueColor: 'text-green-400',
    borderCol: 'border-green-900/40',
    barWidth: (v: number) => `${Math.min(100, 20 + (v % 75))}%`,
    getValue: (s: { tasksCompleted?: number }) => s?.tasksCompleted ?? 0,
  },
  {
    id: 'dumps',
    label: 'Brain dumps processed',
    cmd: 'braindump.processed()',
    icon: '◆',
    barColor: 'bg-cyan-600',
    valueColor: 'text-cyan-400',
    borderCol: 'border-cyan-900/40',
    barWidth: (v: number) => `${Math.min(100, 15 + (v % 80))}%`,
    getValue: (s: { brainDumpsProcessed?: number }) => s?.brainDumpsProcessed ?? 0,
  },
];

export default function SocialProof() {
  const stats = useQuery(api.marketing.getLiveStats, {});
  const loading = stats === undefined;

  return (
    <div className="overflow-hidden border-2 border-zinc-800 bg-black shadow-[4px_4px_0px_rgba(0,0,0,0.7)]">
      {/* ── Terminal chrome ── */}
      <div className="flex items-center justify-between border-b-2 border-zinc-800 bg-zinc-950 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-700" />
        </div>
        <span className="font-pixel text-[0.5rem] tracking-widest text-zinc-500">
          RESURGO :: LIVE_PLATFORM_STATS
        </span>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="font-pixel text-[0.5rem] tracking-widest text-green-500">LIVE</span>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3">
        {STAT_CONFIG.map((cfg, i) => {
          const value = cfg.getValue(stats ?? {});
          return (
            <div
              key={cfg.id}
              className={`p-4 sm:p-5 ${i < 2 ? 'border-b sm:border-b-0 sm:border-r border-zinc-800' : ''}`}
            >
              {/* Command */}
              <div className="mb-2 flex items-center gap-1.5 font-mono text-[11px]">
                <span className="text-orange-600">$</span>
                <span className="text-zinc-600">{cfg.cmd}</span>
              </div>

              {/* Value */}
              <div className={`font-pixel text-2xl sm:text-3xl ${cfg.valueColor}`}>
                {loading ? (
                  <span className="inline-block h-7 w-12 animate-pulse rounded bg-zinc-800" />
                ) : (
                  value.toLocaleString()
                )}
              </div>

              {/* Label */}
              <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                {cfg.label}
              </p>

              {/* Progress bar */}
              <div className="mt-3 h-1 w-full overflow-hidden bg-zinc-800">
                <div
                  className={`h-1 transition-all duration-1000 ease-out ${cfg.barColor}`}
                  style={{ width: loading ? '0%' : cfg.barWidth(value) }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer status line ── */}
      <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-950 px-4 py-1.5">
        <span className="font-mono text-[10px] text-zinc-600">
          src: convex.cloud │ stream: realtime
        </span>
        <Link
          href="/sign-up"
          className="font-mono text-[10px] text-orange-500 transition-colors hover:text-orange-400"
        >
          BE_NEXT →
        </Link>
      </div>
    </div>
  );
}

