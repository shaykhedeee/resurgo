// ═══════════════════════════════════════════════════════════════════════════════
// Resurgo — Contribution Heatmap
// GitHub-style activity grid showing daily habit/task completion history
// "Don't break the chain" visual motivation
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useMemo, useState } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Flame, Calendar, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface ContributionHeatmapProps {
  className?: string;
  compact?: boolean; // Show less weeks for small spaces
}

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface DayData {
  date: string; // YYYY-MM-DD
  completedHabits: number;
  totalHabits: number;
  completionRate: number; // 0-100
  level: 0 | 1 | 2 | 3 | 4; // 0=none, 1=low, 2=med, 3=high, 4=perfect
}

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const LEVEL_COLORS = {
  dark: [
    'bg-white/5',           // 0: No activity
    'bg-orange-900/60',     // 1: Low (1-25%)
    'bg-orange-700/70',     // 2: Medium (26-50%)
    'bg-orange-500/80',     // 3: High (51-99%)
    'bg-orange-400',        // 4: Perfect (100%)
  ],
  light: [
    'bg-gray-100',
    'bg-orange-100',
    'bg-orange-200',
    'bg-orange-400',
    'bg-orange-500',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────────

function getDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getLevel(rate: number): 0 | 1 | 2 | 3 | 4 {
  if (rate === 0) return 0;
  if (rate <= 25) return 1;
  if (rate <= 50) return 2;
  if (rate < 100) return 3;
  return 4;
}

function getDaysInRange(startDate: Date, endDate: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function ContributionHeatmap({ className, compact = false }: ContributionHeatmapProps) {
  const { habits, habitEntries } = useAscendStore();
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [yearOffset, setYearOffset] = useState(0); // 0 = current year-to-now

  const weeksToShow = compact ? 20 : 52;

  // Calculate date range
  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() - (7 * yearOffset * weeksToShow));
    
    const start = new Date(end);
    start.setDate(start.getDate() - (weeksToShow * 7));
    
    // Align to start of week (Sunday)
    start.setDate(start.getDate() - start.getDay());
    
    return { startDate: start, endDate: end };
  }, [yearOffset, weeksToShow]);

  // Build day data from habit entries
  const dayDataMap = useMemo(() => {
    const map = new Map<string, DayData>();
    const days = getDaysInRange(startDate, endDate);
    const activeHabits = habits.filter(h => h.isActive);
    const totalActive = activeHabits.length || 1;

    for (const day of days) {
      const dateKey = getDateKey(day);
      const dayEntries = habitEntries.filter(
        e => e.date === dateKey && e.completed
      );
      const completed = dayEntries.length;
      const rate = Math.min(100, Math.round((completed / totalActive) * 100));
      
      map.set(dateKey, {
        date: dateKey,
        completedHabits: completed,
        totalHabits: totalActive,
        completionRate: rate,
        level: getLevel(rate),
      });
    }

    return map;
  }, [startDate, endDate, habits, habitEntries]);

  // Organize into weeks (columns) of days (rows)
  const weeks = useMemo(() => {
    const result: DayData[][] = [];
    const days = getDaysInRange(startDate, endDate);
    let currentWeek: DayData[] = [];

    for (const day of days) {
      const dateKey = getDateKey(day);
      const data = dayDataMap.get(dateKey) || {
        date: dateKey,
        completedHabits: 0,
        totalHabits: 0,
        completionRate: 0,
        level: 0 as const,
      };

      if (day.getDay() === 0 && currentWeek.length > 0) {
        result.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(data);
    }
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [startDate, endDate, dayDataMap]);

  // Month labels
  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (firstDay) {
        const date = new Date(firstDay.date);
        const month = date.getMonth();
        if (month !== lastMonth) {
          labels.push({ month: MONTHS[month], weekIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [weeks]);

  // Stats
  const stats = useMemo(() => {
    let totalActive = 0;
    let totalPerfect = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = getDateKey(new Date());
    const allDays = Array.from(dayDataMap.values()).sort(
      (a, b) => a.date.localeCompare(b.date)
    );

    for (const day of allDays) {
      if (day.completedHabits > 0) {
        totalActive++;
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
      if (day.level === 4) totalPerfect++;
    }

    // Current streak: count back from today
    currentStreak = 0;
    for (let i = allDays.length - 1; i >= 0; i--) {
      if (allDays[i].date > today) continue;
      if (allDays[i].completedHabits > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    return { totalActive, totalPerfect, currentStreak, longestStreak };
  }, [dayDataMap]);

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const colors = isDark ? LEVEL_COLORS.dark : LEVEL_COLORS.light;

  return (
    <div className={cn('glass-card rounded-2xl p-5', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-ascend-400" />
          <h3 className="text-base font-semibold text-themed">Activity</h3>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setYearOffset(prev => prev + 1)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            aria-label="Previous period"
          >
            <ChevronLeft className="w-4 h-4 text-themed-muted" />
          </button>
          <button
            onClick={() => setYearOffset(0)}
            className="text-xs text-themed-muted hover:text-themed px-2 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setYearOffset(prev => Math.max(0, prev - 1))}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            disabled={yearOffset === 0}
            aria-label="Next period"
          >
            <ChevronRight className="w-4 h-4 text-themed-muted" />
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-themed-muted">Streak:</span>
          <span className="font-bold text-themed">{stats.currentStreak}d</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-green-400" />
          <span className="text-themed-muted">Longest:</span>
          <span className="font-bold text-themed">{stats.longestStreak}d</span>
        </div>
        <div className="text-themed-muted">
          {stats.totalActive} active days
        </div>
        <div className="text-themed-muted">
          {stats.totalPerfect} perfect days
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto scrollbar-thin">
        <div className="inline-block min-w-fit">
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {monthLabels.map((label, i) => (
              <div
                key={i}
                className="text-[10px] text-themed-muted"
                style={{
                  position: 'relative',
                  left: `${label.weekIndex * 14}px`,
                  width: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                {label.month}
              </div>
            ))}
          </div>

          {/* Grid with day labels */}
          <div className="flex gap-0">
            {/* Day of week labels */}
            <div className="flex flex-col gap-[2px] mr-1 pt-0">
              {DAYS_OF_WEEK.map((day, i) => (
                <div
                  key={day}
                  className="h-[12px] flex items-center"
                  style={{ fontSize: '9px' }}
                >
                  <span className="text-themed-muted w-7 text-right pr-1">
                    {i % 2 === 1 ? day : ''}
                  </span>
                </div>
              ))}
            </div>

            {/* Week columns */}
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-[2px]">
                {week.map((day, dayIdx) => (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    className={cn(
                      'w-[12px] h-[12px] rounded-[2px] transition-all duration-150 cursor-pointer',
                      colors[day.level],
                      hoveredDay?.date === day.date && 'ring-1 ring-white/50 scale-125 z-10'
                    )}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    title={`${day.date}: ${day.completedHabits}/${day.totalHabits} habits (${day.completionRate}%)`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredDay && (
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-themed-muted">
            {new Date(hoveredDay.date + 'T12:00:00').toLocaleDateString('en-US', { 
              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
            })}
          </span>
          <span className={cn(
            'font-medium',
            hoveredDay.level === 4 ? 'text-orange-400' :
            hoveredDay.level >= 2 ? 'text-orange-300' :
            'text-themed-muted'
          )}>
            {hoveredDay.completedHabits}/{hoveredDay.totalHabits} habits 
            ({hoveredDay.completionRate}%)
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="text-[10px] text-themed-muted mr-1">Less</span>
        {colors.map((color, i) => (
          <div
            key={i}
            className={cn('w-[10px] h-[10px] rounded-[2px]', color)}
          />
        ))}
        <span className="text-[10px] text-themed-muted ml-1">More</span>
      </div>
    </div>
  );
}
