// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Calendar View Component
// Monthly calendar showing habit completions, tasks, and progress
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useMemo } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Target,
  Flame,
  Star,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay, addMonths, subMonths } from 'date-fns';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface DayInfo {
  date: Date;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  habitsCompleted: number;
  habitsTotal: number;
  tasksCompleted: number;
  tasksTotal: number;
  hasStreak: boolean;
}

export function CalendarView() {
  const { habits, habitEntries, goals, calendar, setCalendar } = useAscendStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const currentDate = new Date(calendar.year, calendar.month - 1, 1);
  
  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDay = getDay(monthStart);
    
    // Get days for the calendar grid
    const days: DayInfo[] = [];
    
    // Previous month padding
    const prevMonth = subMonths(monthStart, 1);
    const prevMonthEnd = endOfMonth(prevMonth);
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(prevMonthEnd);
      date.setDate(prevMonthEnd.getDate() - i);
      days.push(createDayInfo(date, false));
    }
    
    // Current month
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    monthDays.forEach(date => {
      days.push(createDayInfo(date, true));
    });
    
    // Next month padding
    const remaining = 42 - days.length; // 6 rows x 7 days
    const nextMonth = addMonths(monthStart, 1);
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(nextMonth);
      date.setDate(i);
      days.push(createDayInfo(date, false));
    }
    
    return days;
  }, [calendar.year, calendar.month, habits, habitEntries, goals]);
  
  function createDayInfo(date: Date, isCurrentMonth: boolean): DayInfo {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Count habit completions for this day
    const activeHabits = habits.filter(h => h.isActive);
    const completedHabits = habitEntries.filter(
      e => e.date === dateStr && e.completed
    ).length;
    
    // Count task completions for this day
    let tasksTotal = 0;
    let tasksCompleted = 0;
    
    goals.forEach(goal => {
      if (goal.status !== 'in_progress') return;
      goal.milestones.forEach(milestone => {
        milestone.weeklyObjectives.forEach(objective => {
          objective.dailyTasks.forEach(task => {
            const taskDate = new Date(task.scheduledDate);
            if (isSameDay(taskDate, date)) {
              tasksTotal++;
              if (task.status === 'completed') {
                tasksCompleted++;
              }
            }
          });
        });
      });
    });
    
    // Check if user maintained streak (completed all habits)
    const hasStreak = activeHabits.length > 0 && completedHabits === activeHabits.length;
    
    return {
      date,
      dateStr,
      isCurrentMonth,
      isToday: isToday(date),
      habitsCompleted: completedHabits,
      habitsTotal: activeHabits.length,
      tasksCompleted,
      tasksTotal,
      hasStreak,
    };
  }
  
  const goToPreviousMonth = () => {
    const prev = subMonths(currentDate, 1);
    setCalendar(prev.getFullYear(), prev.getMonth() + 1);
  };
  
  const goToNextMonth = () => {
    const next = addMonths(currentDate, 1);
    setCalendar(next.getFullYear(), next.getMonth() + 1);
  };
  
  const goToToday = () => {
    const today = new Date();
    setCalendar(today.getFullYear(), today.getMonth() + 1);
    setSelectedDate(today);
  };
  
  // Get selected day details
  const selectedDayInfo = selectedDate 
    ? calendarDays.find(d => isSameDay(d.date, selectedDate)) 
    : null;
  
  // Calculate monthly stats
  const monthlyStats = useMemo(() => {
    const currentMonthDays = calendarDays.filter(d => d.isCurrentMonth);
    const pastDays = currentMonthDays.filter(d => d.date <= new Date());
    
    const totalHabitsCompleted = pastDays.reduce((sum, d) => sum + d.habitsCompleted, 0);
    const totalHabitsPossible = pastDays.reduce((sum, d) => sum + d.habitsTotal, 0);
    const totalTasksCompleted = pastDays.reduce((sum, d) => sum + d.tasksCompleted, 0);
    const totalTasks = currentMonthDays.reduce((sum, d) => sum + d.tasksTotal, 0);
    const streakDays = pastDays.filter(d => d.hasStreak).length;
    
    return {
      habitCompletion: totalHabitsPossible > 0 ? Math.round((totalHabitsCompleted / totalHabitsPossible) * 100) : 0,
      tasksCompleted: totalTasksCompleted,
      totalTasks,
      streakDays,
      perfectDays: streakDays,
    };
  }, [calendarDays]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-themed">Calendar View</h1>
          <p className="text-themed-secondary mt-1">Track your progress over time</p>
        </div>
        
        <button onClick={goToToday} className="btn-secondary text-sm">
          Go to Today
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-ascend-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-ascend-500" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold text-themed">{monthlyStats.habitCompletion}%</p>
              <p className="text-[10px] sm:text-xs text-themed-muted truncate">Habit Completion</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gold-400/20 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold text-themed">{monthlyStats.tasksCompleted}/{monthlyStats.totalTasks}</p>
              <p className="text-[10px] sm:text-xs text-themed-muted truncate">Tasks Done</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold text-themed">{monthlyStats.streakDays}</p>
              <p className="text-[10px] sm:text-xs text-themed-muted truncate">Streak Days</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold text-themed">{monthlyStats.perfectDays}</p>
              <p className="text-[10px] sm:text-xs text-themed-muted truncate">Perfect Days</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="glass-card p-3 sm:p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button 
            onClick={goToPreviousMonth}
            aria-label="Previous month"
            title="Previous month"
            className="p-2.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-themed-secondary" />
          </button>
          
          <h2 className="text-lg sm:text-xl font-bold text-themed">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <button 
            onClick={goToNextMonth}
            aria-label="Next month"
            title="Next month"
            className="p-2.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-themed-secondary" />
          </button>
        </div>
        
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="text-center text-[10px] sm:text-xs font-medium text-themed-muted py-1 sm:py-2">
              <span className="sm:hidden">{day.charAt(0)}</span>
              <span className="hidden sm:inline">{day}</span>
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {calendarDays.map((day, index) => {
            const completionRate = day.habitsTotal > 0 
              ? (day.habitsCompleted / day.habitsTotal) 
              : 0;
            
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(day.date)}
                className={cn(
                  "relative p-1 sm:p-2 min-h-[52px] sm:min-h-[80px] rounded-lg border transition-all text-left",
                  day.isCurrentMonth 
                    ? "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-hover)]" 
                    : "bg-transparent border-transparent opacity-40",
                  day.isToday && "ring-2 ring-ascend-500",
                  selectedDate && isSameDay(day.date, selectedDate) && "bg-ascend-500/20 border-ascend-500"
                )}
              >
                {/* Date Number */}
                <span className={cn(
                  "text-xs sm:text-sm font-medium",
                  day.isToday ? "text-ascend-500" : day.isCurrentMonth ? "text-themed" : "text-themed-muted"
                )}>
                  {day.date.getDate()}
                </span>
                
                {/* Completion Indicator */}
                {day.isCurrentMonth && day.habitsTotal > 0 && (
                  <div className="absolute bottom-1 sm:bottom-2 left-1 right-1 sm:left-2 sm:right-2">
                    <div className="h-0.5 sm:h-1 rounded-full bg-[var(--border)] overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all",
                          completionRate === 1 ? "bg-green-500" : completionRate > 0.5 ? "bg-ascend-500" : "bg-orange-500"
                        )}
                        style={{ width: `${completionRate * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Task Indicator - Hidden on mobile for space */}
                {day.tasksTotal > 0 && (
                  <div className="hidden sm:flex absolute top-2 right-2 items-center gap-0.5">
                    <Target className={cn(
                      "w-3 h-3",
                      day.tasksCompleted === day.tasksTotal ? "text-green-500" : "text-gold-400"
                    )} />
                    <span className="text-[10px] text-themed-muted">{day.tasksCompleted}</span>
                  </div>
                )}
                
                {/* Perfect Day Star */}
                {day.hasStreak && (
                  <Star className="absolute top-1 sm:top-2 right-1 sm:left-2 w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold-400 fill-gold-400" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 text-xs text-themed-muted">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>100% Complete</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-themed-muted">
            <div className="w-3 h-3 rounded-full bg-ascend-500" />
            <span>50%+ Complete</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-themed-muted">
            <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
            <span>Perfect Day</span>
          </div>
        </div>
      </div>
      
      {/* Selected Day Details */}
      {selectedDayInfo && selectedDayInfo.isCurrentMonth && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-themed mb-4">
            {format(selectedDayInfo.date, 'EEEE, MMMM d, yyyy')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Habits Summary */}
            <div>
              <h4 className="text-sm font-medium text-themed-secondary mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Habits
              </h4>
              {selectedDayInfo.habitsTotal > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-themed">{selectedDayInfo.habitsCompleted} of {selectedDayInfo.habitsTotal} completed</span>
                    <span className={cn(
                      "text-sm font-medium",
                      selectedDayInfo.habitsCompleted === selectedDayInfo.habitsTotal ? "text-green-500" : "text-themed-muted"
                    )}>
                      {Math.round((selectedDayInfo.habitsCompleted / selectedDayInfo.habitsTotal) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-ascend-500 transition-all"
                      style={{ width: `${(selectedDayInfo.habitsCompleted / selectedDayInfo.habitsTotal) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-themed-muted text-sm">No habits tracked this day</p>
              )}
            </div>
            
            {/* Tasks Summary */}
            <div>
              <h4 className="text-sm font-medium text-themed-secondary mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Tasks
              </h4>
              {selectedDayInfo.tasksTotal > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-themed">{selectedDayInfo.tasksCompleted} of {selectedDayInfo.tasksTotal} completed</span>
                    <span className={cn(
                      "text-sm font-medium",
                      selectedDayInfo.tasksCompleted === selectedDayInfo.tasksTotal ? "text-green-500" : "text-themed-muted"
                    )}>
                      {Math.round((selectedDayInfo.tasksCompleted / selectedDayInfo.tasksTotal) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gold-400 transition-all"
                      style={{ width: `${(selectedDayInfo.tasksCompleted / selectedDayInfo.tasksTotal) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-themed-muted text-sm">No tasks scheduled for this day</p>
              )}
            </div>
          </div>
          
          {selectedDayInfo.hasStreak && (
            <div className="mt-4 p-3 rounded-lg bg-gold-400/10 border border-gold-400/20">
              <p className="text-gold-400 text-sm flex items-center gap-2">
                <Star className="w-4 h-4 fill-gold-400" />
                Perfect day! All habits completed.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
