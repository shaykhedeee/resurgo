'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Streak Heatmap Widget (Dashboard)
// GitHub-style contribution graph for habit completions over the last 12 weeks
// ═══════════════════════════════════════════════════════════════════════════════

import { useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { CalendarDays } from 'lucide-react';

const WEEKS = 12;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

function dateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

/** Generate array of dates for the heatmap grid: 12 weeks ending today */
function generateDays(): string[] {
  const days: string[] = [];
  const today = new Date();
  // Start from the beginning of the week (Sunday) 12 weeks ago
  const start = new Date(today);
  start.setDate(start.getDate() - start.getDay() - (WEEKS - 1) * 7);

  const end = new Date(today);
  const cursor = new Date(start);
  while (cursor <= end) {
    days.push(dateStr(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function intensityClass(count: number): string {
  if (count === 0) return 'bg-zinc-900';
  if (count === 1) return 'bg-orange-900/60';
  if (count === 2) return 'bg-orange-700/70';
  if (count <= 4) return 'bg-orange-600/80';
  return 'bg-orange-500';
}

export default function StreakHeatmapWidget() {
  const days = useMemo(() => generateDays(), []);
  const startDate = days[0];
  const endDate = days[days.length - 1];

  const logs = useQuery(api.habits.getLogsForDateRange, { startDate, endDate });

  // Build a map of date → completion count
  const heatMap = useMemo(() => {
    const map = new Map<string, number>();
    if (!logs) return map;
    for (const log of logs) {
      if (log.status === 'completed') {
        const d = log.date;
        map.set(d, (map.get(d) ?? 0) + 1);
      }
    }
    return map;
  }, [logs]);

  // Organize into columns (weeks). Each week is an array of 7 days (Sun–Sat).
  const weeks = useMemo(() => {
    const result: string[][] = [];
    let week: string[] = [];
    for (let i = 0; i < days.length; i++) {
      const d = new Date(days[i] + 'T00:00:00');
      const dow = d.getDay(); // 0=Sun
      if (dow === 0 && week.length > 0) {
        result.push(week);
        week = [];
      }
      week.push(days[i]);
    }
    if (week.length > 0) result.push(week);
    return result;
  }, [days]);

  const totalCompletions = useMemo(() => {
    let sum = 0;
    heatMap.forEach((v) => (sum += v));
    return sum;
  }, [heatMap]);

  const activeDays = heatMap.size;
  const today = new Date();
  const monthLabels = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, colIdx) => {
      const d = new Date(week[0] + 'T00:00:00');
      if (d.getMonth() !== lastMonth) {
        lastMonth = d.getMonth();
        labels.push({
          label: d.toLocaleDateString('en-US', { month: 'short' }),
          col: colIdx,
        });
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="border border-zinc-900 bg-zinc-950 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
        <CalendarDays className="h-3.5 w-3.5 text-orange-500" />
        <span className="font-pixel text-[0.6rem] tracking-widest text-orange-500">STREAK_MAP</span>
        <span className="ml-auto font-terminal text-xs text-zinc-400">
          {totalCompletions} completions · {activeDays} active days
        </span>
      </div>

      <div className="p-4">
        {/* Month labels */}
        <div className="flex gap-0 pl-8 mb-1">
          {monthLabels.map((ml, i) => (
            <span
              key={i}
              className="font-terminal text-[0.55rem] text-zinc-500"
              style={{ position: 'relative', left: `${ml.col * 13}px` }}
            >
              {ml.label}
            </span>
          ))}
        </div>

        <div className="flex gap-0.5">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 pr-1">
            {DAY_LABELS.map((label, i) => (
              <div key={i} className="flex h-[11px] w-6 items-center justify-end">
                <span className="font-terminal text-[0.5rem] text-zinc-600">{label}</span>
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-0.5">
            {weeks.map((week, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-0.5">
                {/* Pad with empty cells if the first week is incomplete */}
                {colIdx === 0 &&
                  Array.from({ length: 7 - week.length }).map((_, i) => (
                    <div key={`pad-${i}`} className="h-[11px] w-[11px]" />
                  ))}
                {week.map((day) => {
                  const count = heatMap.get(day) ?? 0;
                  const isToday = day === dateStr(today);
                  return (
                    <div
                      key={day}
                      className={`h-[11px] w-[11px] transition-colors ${intensityClass(count)} ${
                        isToday ? 'ring-1 ring-orange-500' : ''
                      }`}
                      title={`${day}: ${count} habit${count !== 1 ? 's' : ''} completed`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-1 justify-end">
          <span className="font-terminal text-[0.5rem] text-zinc-500">Less</span>
          <div className="h-[9px] w-[9px] bg-zinc-900" />
          <div className="h-[9px] w-[9px] bg-orange-900/60" />
          <div className="h-[9px] w-[9px] bg-orange-700/70" />
          <div className="h-[9px] w-[9px] bg-orange-600/80" />
          <div className="h-[9px] w-[9px] bg-orange-500" />
          <span className="font-terminal text-[0.5rem] text-zinc-500">More</span>
        </div>
      </div>
    </div>
  );
}
