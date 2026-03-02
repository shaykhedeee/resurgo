// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Habit Tracking Grid Component
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useMemo, useState } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn, isTodayDate } from '@/lib/utils';
import { Check, Plus, Target, TrendingUp, TrendingDown, Minus, RefreshCw, Zap } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { playSound } from '@/lib/sounds';

export function HabitGrid() {
  const { 
    habits, 
    habitEntries, 
    calendar, 
    toggleHabitEntry, 
    getHabitEntry,
    getHabitStats,
    setModal
  } = useAscendStore();

  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // Generate days for the current month
  const days = useMemo(() => {
    const result: { date: string; day: number; isToday: boolean; isWeekend: boolean }[] = [];
    for (let day = 1; day <= calendar.daysInMonth; day++) {
      const date = `${calendar.year}-${String(calendar.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayOfWeek = new Date(date).getDay();
      result.push({
        date,
        day,
        isToday: isTodayDate(date),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      });
    }
    return result;
  }, [calendar]);

  // Active (non-archived) habits
  const activeHabits = habits.filter(h => !h.archived);

  // Never Miss Twice - Check for habits missed yesterday but not yet done today
  const neverMissTwiceHabits = useMemo(() => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const todayStr = format(today, 'yyyy-MM-dd');
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
    
    return activeHabits.filter(habit => {
      const yesterdayEntry = habitEntries.find(e => e.habitId === habit.id && e.date === yesterdayStr);
      const todayEntry = habitEntries.find(e => e.habitId === habit.id && e.date === todayStr);
      
      // Missed yesterday AND haven't done today yet
      const missedYesterday = !yesterdayEntry?.completed;
      const notDoneToday = !todayEntry?.completed;
      
      return missedYesterday && notDoneToday;
    });
  }, [activeHabits, habitEntries]);

  // Month/Year display
  const monthYear = format(new Date(calendar.year, calendar.month - 1), 'MMMM yyyy');

  const handleCellClick = (habitId: string, date: string) => {
    // Check if we're completing (not uncompleting)
    const currentEntry = habitEntries.find(e => e.habitId === habitId && e.date === date);
    const isCompleting = !currentEntry?.completed;
    
    toggleHabitEntry(habitId, date);
    
    // Play sound if completing
    if (isCompleting) {
      playSound('habitComplete');
    }
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 80) return <TrendingUp className="w-3 h-3" />;
    if (percentage >= 40) return <Minus className="w-3 h-3" />;
    return <TrendingDown className="w-3 h-3" />;
  };

  return (
    <div className="glass-card p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{monthYear}</h2>
          <p className="text-white/60 text-sm mt-1">
            Track your daily habits • {activeHabits.length} habits
          </p>
        </div>
        <button 
          onClick={() => setModal({ isOpen: true, type: 'habit' })}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Habit</span>
        </button>
      </div>

      {/* Never Miss Twice - Encouragement Banner */}
      {neverMissTwiceHabits.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-orange-400 mb-1 flex items-center gap-2">
                <span>Never Miss Twice</span>
              </h4>
              <p className="text-xs text-white/60 leading-relaxed mb-2">
                You missed {neverMissTwiceHabits.length === 1 ? 'a habit' : `${neverMissTwiceHabits.length} habits`} yesterday, 
                but that&apos;s okay! The key is to get back on track TODAY.
              </p>
              <div className="flex flex-wrap gap-2">
                {neverMissTwiceHabits.slice(0, 3).map(habit => (
                  <button
                    key={habit.id}
                    onClick={() => {
                      const today = format(new Date(), 'yyyy-MM-dd');
                      toggleHabitEntry(habit.id, today);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
                             bg-white/5 hover:bg-orange-500/20 border border-white/10 
                             hover:border-orange-500/30 transition-all text-xs group"
                  >
                    <span>{habit.icon}</span>
                    <span className="text-white/80 group-hover:text-orange-400">{habit.name}</span>
                    <Zap className="w-3 h-3 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
                {neverMissTwiceHabits.length > 3 && (
                  <span className="text-xs text-white/40 self-center">
                    +{neverMissTwiceHabits.length - 3} more
                  </span>
                )}
              </div>
              <p className="mt-2 text-[10px] text-white/40 italic">
                &quot;Missing once is an accident. Missing twice is the start of a new habit.&quot; – James Clear
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid Container */}
      <div className="overflow-x-auto -mx-6 px-6">
        <div className="min-w-[900px]">
          {/* Days Header Row */}
          <div className="flex items-center mb-2">
            {/* Habit Name Column */}
            <div className="w-48 shrink-0 pr-3">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                Habit
              </span>
            </div>
            
            {/* Goal Column */}
            <div className="w-16 shrink-0 text-center">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                Goal
              </span>
            </div>

            {/* Day Numbers */}
            <div className="flex-1 flex">
              {days.map(({ day, isToday, isWeekend }) => (
                <div 
                  key={day}
                  className={cn(
                    "flex-1 min-w-[28px] text-center",
                    isToday && "relative"
                  )}
                >
                  <span className={cn(
                    "text-xs font-medium",
                    isToday ? "text-ascend-400" : isWeekend ? "text-white/30" : "text-white/50"
                  )}>
                    {day}
                  </span>
                  {isToday && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 
                                  bg-ascend-400 rounded-full" />
                  )}
                </div>
              ))}
            </div>

            {/* Stats Column */}
            <div className="w-28 shrink-0 text-center ml-2">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                Progress
              </span>
            </div>
          </div>

          {/* Habit Rows */}
          <div className="space-y-1">
            {activeHabits.map((habit, index) => {
              const stats = getHabitStats(habit.id);
              
              return (
                <div 
                  key={habit.id}
                  className={cn(
                    "flex items-center py-2 rounded-lg transition-colors",
                    index % 2 === 0 ? "bg-white/[0.02]" : ""
                  )}
                >
                  {/* Habit Info */}
                  <div className="w-48 shrink-0 pr-3 flex items-center gap-2">
                    <span className="text-lg">{habit.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {habit.name}
                      </p>
                    </div>
                  </div>

                  {/* Goal */}
                  <div className="w-16 shrink-0 text-center">
                    <span className="text-sm text-white/60">{habit.monthlyGoal}</span>
                  </div>

                  {/* Checkbox Grid */}
                  <div className="flex-1 flex" role="group" aria-label={`Daily completions for ${habit.name}`}>
                    {days.map(({ date, isToday }) => {
                      const entry = getHabitEntry(habit.id, date);
                      const isCompleted = entry?.completed || false;
                      const cellId = `${habit.id}-${date}`;
                      const isHovered = hoveredCell === cellId;
                      const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                      return (
                        <div 
                          key={date}
                          className="flex-1 min-w-[28px] flex items-center justify-center"
                        >
                          <button
                            onClick={() => handleCellClick(habit.id, date)}
                            onMouseEnter={() => setHoveredCell(cellId)}
                            onMouseLeave={() => setHoveredCell(null)}
                            aria-label={`${habit.name} on ${formattedDate}: ${isCompleted ? 'Completed' : 'Not completed'}. Click to toggle.`}
                            aria-pressed={isCompleted}
                            className={cn(
                              "w-7 h-7 rounded-md border transition-all duration-150",
                              "flex items-center justify-center",
                              "focus-visible:ring-2 focus-visible:ring-ascend-500 focus-visible:ring-offset-1",
                              isCompleted 
                                ? "border-transparent" 
                                : "border-white/10 hover:border-white/30",
                              isToday && !isCompleted && "border-ascend-500/50 ring-1 ring-ascend-500/30",
                              isHovered && !isCompleted && "scale-110"
                            )}
                            style={{
                              backgroundColor: isCompleted ? habit.color : 'transparent',
                              boxShadow: isCompleted ? `0 0 8px ${habit.color}40` : 'none'
                            }}
                          >
                            {isCompleted && (
                              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Progress Stats with Progress Bar */}
                  <div className="w-28 shrink-0 ml-2 space-y-1">
                    {/* Progress Bar */}
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          stats.percentage >= 80 && "bg-gradient-to-r from-green-500 to-emerald-400",
                          stats.percentage >= 60 && stats.percentage < 80 && "bg-gradient-to-r from-yellow-500 to-amber-400",
                          stats.percentage >= 40 && stats.percentage < 60 && "bg-gradient-to-r from-orange-500 to-amber-500",
                          stats.percentage < 40 && "bg-gradient-to-r from-red-500 to-rose-400"
                        )}
                        style={{ width: `${Math.min(stats.percentage, 100)}%` }}
                      />
                    </div>
                    {/* Stats Text */}
                    <div className="flex items-center justify-center gap-1.5">
                      <div 
                        className={cn(
                          "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold",
                          stats.percentage >= 80 && "bg-green-500/20 text-green-400",
                          stats.percentage >= 60 && stats.percentage < 80 && "bg-yellow-500/20 text-yellow-400",
                          stats.percentage >= 40 && stats.percentage < 60 && "bg-orange-500/20 text-orange-400",
                          stats.percentage < 40 && "bg-red-500/20 text-red-400"
                        )}
                      >
                        {getStatusIcon(stats.percentage)}
                        <span>{stats.completed}/{stats.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {activeHabits.length === 0 && (
            <div className="py-12 text-center" role="status" aria-label="No habits">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 
                            flex items-center justify-center">
                <Target className="w-8 h-8 text-white/40" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No habits yet</h3>
              <p className="text-white/60 mb-4">
                Start building better habits by adding your first one.
              </p>
              <button 
                onClick={() => setModal({ isOpen: true, type: 'habit' })}
                className="btn-primary inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                Add Your First Habit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <div className="w-4 h-4 rounded bg-green-500/20 flex items-center justify-center">
            <TrendingUp className="w-2.5 h-2.5 text-green-400" />
          </div>
          <span>80%+ On Track</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <div className="w-4 h-4 rounded bg-yellow-500/20 flex items-center justify-center">
            <Minus className="w-2.5 h-2.5 text-yellow-400" />
          </div>
          <span>60-79% Moderate</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <div className="w-4 h-4 rounded bg-red-500/20 flex items-center justify-center">
            <TrendingDown className="w-2.5 h-2.5 text-red-400" />
          </div>
          <span>&lt;60% Needs Focus</span>
        </div>
      </div>
    </div>
  );
}
