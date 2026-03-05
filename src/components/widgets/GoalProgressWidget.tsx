'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Goal Progress Widget (Dashboard)
// Ring-style progress indicators with deadline warnings
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Target, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface GoalItem {
  _id: string;
  title: string;
  progress?: number;
  category: string;
  targetDate?: string;
}

export default function GoalProgressWidget() {
  const goals = useQuery(api.goals.listActive);
  const activeGoals = (goals ?? []) as GoalItem[];
  const topGoals = activeGoals.slice(0, 4);

  const avgProgress =
    activeGoals.length > 0
      ? Math.round(activeGoals.reduce((sum, g) => sum + (g.progress ?? 0), 0) / activeGoals.length)
      : 0;

  return (
    <div className="border border-zinc-900 bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
        <Target className="h-3.5 w-3.5 text-cyan-500" />
        <span className="font-pixel text-[0.6rem] tracking-widest text-cyan-500">GOALS</span>
        <span className="ml-auto font-terminal text-xs text-zinc-400">
          {avgProgress}% avg
        </span>
      </div>

      <div className="p-3 space-y-2">
        {topGoals.length === 0 ? (
          <div className="py-4 text-center">
            <p className="font-terminal text-sm text-zinc-400">No active goals</p>
            <Link
              href="/goals"
              className="mt-2 inline-block font-terminal text-xs text-orange-400 underline hover:text-orange-300"
            >
              Create your first goal
            </Link>
          </div>
        ) : (
          topGoals.map((goal) => {
            const progress = goal.progress ?? 0;
            const daysLeft = goal.targetDate
              ? Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / 86400000)
              : null;
            const isUrgent = daysLeft !== null && daysLeft <= 14 && daysLeft > 0;
            const isOverdue = daysLeft !== null && daysLeft <= 0;

            return (
              <Link
                key={goal._id}
                href={`/goals/${goal._id}`}
                className="flex items-center gap-3 rounded px-2 py-2 transition hover:bg-zinc-900"
              >
                {/* Mini progress ring */}
                <ProgressRing progress={progress} size={36} />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-terminal text-xs text-zinc-200">{goal.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-terminal text-xs text-zinc-500">{goal.category}</span>
                    {isOverdue && (
                      <span className="flex items-center gap-0.5 font-terminal text-xs text-red-400">
                        <AlertTriangle className="h-2.5 w-2.5" /> overdue
                      </span>
                    )}
                    {isUrgent && !isOverdue && (
                      <span className="font-terminal text-xs text-amber-400">
                        {daysLeft}d left
                      </span>
                    )}
                    {!isUrgent && !isOverdue && daysLeft !== null && (
                      <span className="font-terminal text-xs text-zinc-600">{daysLeft}d</span>
                    )}
                  </div>
                </div>

                <span className="shrink-0 font-terminal text-sm font-bold tabular-nums text-cyan-400">
                  {progress}%
                </span>
              </Link>
            );
          })
        )}

        {activeGoals.length > 4 && (
          <Link
            href="/goals"
            className="block text-center font-pixel text-[0.35rem] tracking-widest text-zinc-500 transition hover:text-orange-400"
          >
            [+{activeGoals.length - 4} MORE]
          </Link>
        )}
      </div>
    </div>
  );
}

function ProgressRing({ progress, size = 36 }: { progress: number; size?: number }) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  const color =
    progress >= 80 ? '#22c55e' : progress >= 50 ? '#f59e0b' : progress >= 25 ? '#f97316' : '#71717a';

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#27272a"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
    </svg>
  );
}
