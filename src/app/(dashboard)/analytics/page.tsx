'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Analytics Page
// Gamification profile, habit stats, focus stats, progress charts
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

const RARITY_STYLES: Record<string, string> = {
  legendary: 'border-yellow-900 bg-yellow-950/30 text-yellow-500',
  epic: 'border-purple-900 bg-purple-950/30 text-purple-500',
  rare: 'border-blue-900 bg-blue-950/30 text-blue-500',
  common: 'border-zinc-800 text-zinc-400',
};

export default function AnalyticsPage() {
  const profile = useQuery(api.gamification.getProfile);
  const focusStats = useQuery(api.focusSessions.getStats, {});

  if (!profile || !focusStats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="border border-zinc-900 bg-zinc-950 px-8 py-6 text-center">
          <p className="font-mono text-xs tracking-widest text-orange-600">LOADING_TELEMETRY_</p>
          <span className="inline-block h-2 w-2 animate-blink bg-orange-600" />
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'LEVEL',           value: `${profile.level}`,                    sub: profile.levelName?.toUpperCase()           },
    { label: 'TOTAL_XP',        value: profile.totalXP.toLocaleString(),      sub: `${profile.xpToNextLevel}_TO_NEXT`         },
    { label: 'CURRENT_UPTIME',  value: `${profile.currentStreak}d`,           sub: `PEAK_${profile.longestStreak}d`            },
    { label: 'ACHIEVEMENTS',    value: `${profile.achievements.length}`,      sub: 'UNLOCKED'                                 },
    { label: 'OBJECTIVES_DONE', value: `${profile.totalGoalsCompleted}`,      sub: ''                                         },
    { label: 'TASKS_DONE',      value: `${profile.totalTasksCompleted}`,      sub: ''                                         },
    { label: 'FOCUS_HOURS',     value: `${focusStats.totalHours}h`,           sub: `${focusStats.totalSessions}_SESSIONS`     },
    { label: 'NODES_DONE',      value: `${profile.totalHabitsCompleted}`,     sub: ''                                         },
  ];

  const xpPercent = Math.min(Math.round(profile.xpProgress * 100), 100);

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-6xl">

        {/* ── TELEMETRY HEADER ── */}
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">TELEMETRY :: GROWTH_PROFILE_READOUT</span>
          </div>
          <div className="px-5 py-4">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Analytics</h1>
            <p className="mt-1 font-mono text-xs tracking-widest text-zinc-400">
              XP &amp; level · Behavioral patterns · Focus performance
            </p>
          </div>
        </div>

        {/* ── XP LEVEL PANEL ── */}
        <div className="mb-6 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-2">
            <span className="font-mono text-[10px] tracking-widest text-zinc-500">OPERATOR_LEVEL</span>
            <span className="font-mono text-[10px] tracking-widest text-orange-600">{profile.tier?.toUpperCase()} ACCESS</span>
          </div>
          <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-orange-800 bg-orange-950/30 font-mono text-xl font-black text-orange-500">
                {profile.level}
              </div>
              <div>
                <p className="font-mono text-base font-bold tracking-wider text-zinc-100">{profile.levelName?.toUpperCase()}</p>
                <p className="font-mono text-xs text-zinc-400">{profile.tier?.toUpperCase()} TIER</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-xl font-bold text-orange-500">{profile.totalXP.toLocaleString()} XP</p>
              <p className="font-mono text-xs text-zinc-400">{profile.xpToNextLevel} TO_LEVEL_{profile.level + 1}</p>
            </div>
          </div>
          <div className="px-5 pb-4">
            <div className="mb-1 flex justify-between font-mono text-[10px] text-zinc-400">
              <span>LVL_{profile.level}</span>
              <span>{xpPercent}%</span>
              <span>LVL_{profile.level + 1}</span>
            </div>
            <div className="h-0.5 w-full bg-zinc-900">
              <div className="h-0.5 bg-orange-600 transition-all duration-700" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>

        {/* ── STAT GRID ── */}
        <div className="mb-6 grid grid-cols-2 gap-px border border-zinc-900 sm:grid-cols-4">
          {statCards.map(({ label, value, sub }) => (
            <div key={label} className="bg-zinc-950 px-4 py-3 transition hover:bg-zinc-900">
              <p className="font-mono text-[9px] tracking-widest text-zinc-400">{label.replace(/ /g, '_').toUpperCase()}</p>
              <p className="mt-0.5 font-mono text-xl font-bold text-zinc-100">{value}</p>
              {sub && <p className="mt-0.5 font-mono text-[10px] text-zinc-400">{sub}</p>}
            </div>
          ))}
        </div>

        {/* ── DETAIL PANELS ── */}
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <div className="border border-zinc-900 bg-zinc-950">
            <div className="border-b border-zinc-900 px-4 py-2.5">
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">FOCUS_TELEMETRY</span>
            </div>
            <div className="space-y-px p-1">
              {(([['TOTAL_SESSIONS', focusStats.totalSessions], ['TOTAL_MINUTES', focusStats.totalMinutes], ['AVG_SESSION', `${focusStats.avgMinutes}_MIN`], ['AVG_FOCUS_SCORE', focusStats.avgFocusScore || 'N/A'], ['TOTAL_DISTRACTIONS', focusStats.totalDistractions], ['BEST_DAY_STREAK', `${focusStats.bestStreak}_DAYS`]]) as [string, string | number][]).map(([label, val]) => (
                <div key={label} className="flex items-center justify-between px-3 py-2">
                  <span className="font-mono text-[10px] tracking-widest text-zinc-400">{label}</span>
                  <span className="font-mono text-xs text-zinc-200">{val}</span>
                </div>
              ))}
              <div className="border-t border-zinc-900 px-3 pt-2 pb-1">
                <p className="mb-1.5 font-mono text-[10px] tracking-widest text-zinc-400">BY_METHOD</p>
                {Object.entries(focusStats.byType).map(([key, count]) =>
                  (count as number) > 0 ? (
                    <div key={key} className="flex justify-between py-0.5 font-mono text-[10px]">
                      <span className="text-zinc-400">{key.replace('_', '_').toUpperCase()}</span>
                      <span className="text-zinc-400">{count as number}</span>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>

          <div className="border border-zinc-900 bg-zinc-950">
            <div className="border-b border-zinc-900 px-4 py-2.5">
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">NODE_AND_OBJECTIVE_METRICS</span>
            </div>
            <div className="space-y-px p-1">
              {(([['NODES_COMPLETED', profile.totalHabitsCompleted], ['CURRENT_UPTIME', `${profile.currentStreak}_DAYS`], ['PEAK_UPTIME', `${profile.longestStreak}_DAYS`], ['OBJECTIVES_COMPLETED', profile.totalGoalsCompleted], ['FOCUS_MINUTES', profile.totalFocusMinutes], ['COINS_EARNED', profile.coins]]) as [string, string | number][]).map(([label, val]) => (
                <div key={label} className="flex items-center justify-between px-3 py-2">
                  <span className="font-mono text-[10px] tracking-widest text-zinc-400">{label}</span>
                  <span className="font-mono text-xs text-zinc-200">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ACHIEVEMENTS ── */}
        <div className="border border-zinc-900 bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2.5">
            <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">ACHIEVEMENT_LOG</span>
            <span className="border border-orange-900 bg-orange-950/30 px-2 py-0.5 font-mono text-[9px] tracking-widest text-orange-600">
              {profile.achievements.length}_UNLOCKED
            </span>
          </div>
          {profile.achievements.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-mono text-xs tracking-widest text-zinc-400">NO_ACHIEVEMENTS_YET</p>
              <p className="mt-2 font-mono text-[10px] text-zinc-400">Continue building nodes and objectives to unlock rewards.</p>
            </div>
          ) : (
            <div className="grid gap-px p-1 sm:grid-cols-2 lg:grid-cols-3">
              {profile.achievements.map((a: any) => {
                const rarityClass = RARITY_STYLES[a.rarity ?? 'common'] ?? RARITY_STYLES.common;
                return (
                  <div key={a.id} className="flex items-start gap-3 border border-transparent p-3 transition hover:border-zinc-800 hover:bg-zinc-900">
                    <span className="text-xl leading-none">{a.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs text-zinc-200">{a.name.toUpperCase()}</p>
                      <p className="mt-0.5 line-clamp-2 font-mono text-[10px] text-zinc-400">{a.description}</p>
                      {a.rarity && (
                        <span className={`mt-1 inline-block border px-1.5 py-0.5 font-mono text-[9px] tracking-widest ${rarityClass}`}>
                          {a.rarity.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
