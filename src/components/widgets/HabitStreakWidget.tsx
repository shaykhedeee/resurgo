'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Habit Streak Widget (Dashboard)
// Compact streak display with fire icons and mini calendar heatmap
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Flame, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface HabitStreak {
  _id: string;
  title: string;
  streakCurrent: number;
  streakLongest: number;
  category: string;
}

export default function HabitStreakWidget() {
  const habits = useQuery(api.habits.listActive);
  const activeHabits = (habits ?? []) as HabitStreak[];

  // Sort by streak descending, take top 6
  const topStreaks = [...activeHabits]
    .sort((a, b) => (b.streakCurrent ?? 0) - (a.streakCurrent ?? 0))
    .slice(0, 6);

  const totalActiveStreaks = activeHabits.filter((h) => h.streakCurrent > 0).length;
  const longestStreak = activeHabits.reduce((max, h) => Math.max(max, h.streakCurrent ?? 0), 0);

  return (
    <div className="border border-zinc-900 bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
        <Flame className="h-3.5 w-3.5 text-amber-500" />
        <span className="font-pixel text-[0.6rem] tracking-widest text-amber-500">STREAKS</span>
        <span className="ml-auto font-terminal text-xs text-zinc-400">
          {totalActiveStreaks} active
        </span>
      </div>

      <div className="p-3 space-y-1">
        {topStreaks.length === 0 ? (
          <div className="py-4 text-center">
            <p className="font-terminal text-sm text-zinc-400">No active streaks</p>
            <p className="mt-1 font-terminal text-xs text-zinc-600">Complete habits daily to build streaks</p>
          </div>
        ) : (
          topStreaks.map((habit) => (
            <div
              key={habit._id}
              className="flex items-center gap-2 px-2 py-1.5 transition hover:bg-zinc-900"
            >
              <StreakFire streak={habit.streakCurrent} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-terminal text-xs text-zinc-200">{habit.title}</p>
              </div>
              <span className="shrink-0 font-terminal text-sm font-bold tabular-nums text-amber-400">
                {habit.streakCurrent}d
              </span>
            </div>
          ))
        )}

        {longestStreak > 0 && (
          <div className="mt-2 flex items-center justify-between border-t border-zinc-900 pt-2">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-zinc-500" />
              <span className="font-terminal text-xs text-zinc-500">Best streak</span>
            </div>
            <span className="font-terminal text-xs font-bold text-orange-400">
              {activeHabits.reduce((max, h) => Math.max(max, h.streakLongest ?? 0), 0)}d
            </span>
          </div>
        )}

        <Link
          href="/habits"
          className="mt-1 block text-center font-pixel text-[0.35rem] tracking-widest text-zinc-500 transition hover:text-orange-400"
        >
          [VIEW_ALL_HABITS]
        </Link>
      </div>
    </div>
  );
}

function StreakFire({ streak }: { streak: number }) {
  if (streak >= 30) return <span className="text-sm">🏆</span>;
  if (streak >= 14) return <span className="text-sm">🔥</span>;
  if (streak >= 7) return <span className="text-sm">⚡</span>;
  if (streak >= 1) return <span className="text-sm">✨</span>;
  return <span className="text-sm text-zinc-600">○</span>;
}
