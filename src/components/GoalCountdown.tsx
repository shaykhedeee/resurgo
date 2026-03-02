// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Goal Countdown Widget
// Visual countdown to goal deadline with calendar view
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { UltimateGoal } from '@/types';
import { 
  Calendar,
  Target,
  Flame,
  Clock,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { 
  format, 
  differenceInDays, 
  differenceInWeeks,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isPast,
  isFuture,
  getDay
} from 'date-fns';

// ─────────────────────────────────────────────────────────────────────────────────
// COUNTDOWN TIMER
// ─────────────────────────────────────────────────────────────────────────────────

interface GoalCountdownProps {
  goal: UltimateGoal;
  completedDays?: string[]; // ISO date strings of completed days
  className?: string;
}

export function GoalCountdown({ goal, className }: GoalCountdownProps) {
  const targetDate = new Date(goal.targetDate);
  const now = new Date();
  
  const daysLeft = differenceInDays(targetDate, now);
  const weeksLeft = differenceInWeeks(targetDate, now);
  
  const progressPercent = goal.milestones?.length 
    ? (goal.milestones.filter(m => m.status === 'completed').length / goal.milestones.length) * 100
    : goal.progress || 0;
    
  const isOverdue = daysLeft < 0;
  const isUrgent = daysLeft <= 7 && daysLeft >= 0;
  
  return (
    <div className={cn(
      "glass-card p-5 rounded-2xl",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            isOverdue ? "bg-red-500/20" : isUrgent ? "bg-amber-500/20" : "bg-ascend-500/20"
          )}>
            <Target className={cn(
              "w-5 h-5",
              isOverdue ? "text-red-400" : isUrgent ? "text-amber-400" : "text-ascend-400"
            )} />
          </div>
          <div>
            <h3 className="font-semibold text-themed text-sm">Goal Deadline</h3>
            <p className="text-xs text-themed-muted">{format(targetDate, 'MMMM d, yyyy')}</p>
          </div>
        </div>
      </div>
      
      {/* Countdown Display */}
      <div className="flex items-center justify-center gap-3 mb-4">
        {/* Days */}
        <div className="text-center">
          <div className={cn(
            "text-4xl font-bold",
            isOverdue ? "text-red-400" : isUrgent ? "text-amber-400" : "text-ascend-400"
          )}>
            {Math.abs(daysLeft)}
          </div>
          <div className="text-xs text-themed-muted uppercase tracking-wide">
            {isOverdue ? 'Days Over' : 'Days Left'}
          </div>
        </div>
        
        {/* Separator */}
        <div className="w-px h-12 bg-[var(--border)]" />
        
        {/* Weeks */}
        <div className="text-center">
          <div className="text-2xl font-bold text-themed-secondary">
            {Math.abs(weeksLeft)}
          </div>
          <div className="text-xs text-themed-muted uppercase tracking-wide">
            Weeks
          </div>
        </div>
        
        {/* Progress */}
        <div className="w-px h-12 bg-[var(--border)]" />
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {Math.round(progressPercent)}%
          </div>
          <div className="text-xs text-themed-muted uppercase tracking-wide">
            Complete
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-3 rounded-full bg-[var(--border)] overflow-hidden mb-3">
        <div 
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-ascend-500 to-gold-400 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
        {/* Time Progress Indicator */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white/50"
          style={{ 
            left: `${Math.max(0, Math.min(100, (1 - daysLeft / 90) * 100))}%` 
          }}
        />
      </div>
      
      {/* Status Message */}
      <div className={cn(
        "flex items-center justify-center gap-2 text-sm py-2 px-3 rounded-lg",
        isOverdue 
          ? "bg-red-500/10 text-red-400"
          : isUrgent
            ? "bg-amber-500/10 text-amber-400"
            : progressPercent >= 50
              ? "bg-green-500/10 text-green-400"
              : "bg-[var(--surface-hover)] text-themed-secondary"
      )}>
        {isOverdue ? (
          <>
            <Clock className="w-4 h-4" />
            <span>Deadline passed - Update your goal or push through!</span>
          </>
        ) : isUrgent ? (
          <>
            <Flame className="w-4 h-4" />
            <span>Final sprint! {daysLeft} days to go</span>
          </>
        ) : progressPercent >= 75 ? (
          <>
            <TrendingUp className="w-4 h-4" />
            <span>Almost there! Keep pushing</span>
          </>
        ) : progressPercent >= 50 ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Halfway there! Great progress</span>
          </>
        ) : (
          <>
            <Target className="w-4 h-4" />
            <span>On track - Stay consistent!</span>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// MINI CALENDAR
// ─────────────────────────────────────────────────────────────────────────────────

interface MiniCalendarProps {
  completedDays?: string[]; // ISO date strings
  targetDate?: Date;
  className?: string;
}

export function MiniCalendar({ completedDays = [], targetDate, className }: MiniCalendarProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get the day of week the month starts on (0 = Sunday)
  const startDay = getDay(monthStart);
  
  // Create array with empty slots for days before month starts
  const calendarDays = [
    ...Array(startDay).fill(null),
    ...days
  ];
  
  const completedSet = useMemo(() => new Set(
    completedDays.map(d => format(new Date(d), 'yyyy-MM-dd'))
  ), [completedDays]);
  
  const completedThisMonth = days.filter(day => 
    completedSet.has(format(day, 'yyyy-MM-dd'))
  ).length;
  
  return (
    <div className={cn("glass-card p-4 rounded-2xl", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-ascend-400" />
          <h3 className="font-semibold text-themed text-sm">
            {format(today, 'MMMM yyyy')}
          </h3>
        </div>
        <div className="text-xs text-themed-muted">
          {completedThisMonth}/{days.length} days
        </div>
      </div>
      
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs text-themed-muted font-medium py-1">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} className="aspect-square" />;
          }
          
          const dateStr = format(day, 'yyyy-MM-dd');
          const isCompleted = completedSet.has(dateStr);
          const isTargetDay = targetDate && format(day, 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd');
          const isTodayDate = isToday(day);
          const isPastDate = isPast(day) && !isTodayDate;
          const isFutureDate = isFuture(day);
          
          return (
            <div
              key={dateStr}
              className={cn(
                "aspect-square rounded-md flex items-center justify-center text-xs font-medium",
                "transition-all duration-200",
                isCompleted && "bg-green-500 text-white",
                !isCompleted && isPastDate && "bg-red-500/20 text-red-400",
                !isCompleted && isFutureDate && "bg-[var(--surface-hover)] text-themed-muted",
                isTodayDate && !isCompleted && "ring-2 ring-ascend-500 ring-offset-1 ring-offset-[var(--background)]",
                isTargetDay && "ring-2 ring-gold-400"
              )}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-themed-muted">Completed</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-3 h-3 rounded bg-red-500/20" />
          <span className="text-themed-muted">Missed</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-3 h-3 rounded ring-2 ring-ascend-500" />
          <span className="text-themed-muted">Today</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// STREAK CALENDAR (Compact)
// ─────────────────────────────────────────────────────────────────────────────────

interface StreakCalendarProps {
  completedDays?: string[];
  currentStreak?: number;
  longestStreak?: number;
  className?: string;
}

export function StreakCalendar({ 
  completedDays = [], 
  currentStreak = 0,
  longestStreak = 0,
  className 
}: StreakCalendarProps) {
  // Show last 30 days
  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (29 - i));
    return date;
  });
  
  const completedSet = useMemo(() => new Set(
    completedDays.map(d => format(new Date(d), 'yyyy-MM-dd'))
  ), [completedDays]);
  
  return (
    <div className={cn("glass-card p-4 rounded-2xl", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <h3 className="font-semibold text-themed text-sm">Streak</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-themed-muted">
            Current: <span className="text-orange-400 font-bold">{currentStreak}</span>
          </span>
          <span className="text-themed-muted">
            Best: <span className="text-gold-400 font-bold">{longestStreak}</span>
          </span>
        </div>
      </div>
      
      {/* 30-day grid */}
      <div className="grid grid-cols-10 gap-1">
        {last30Days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isCompleted = completedSet.has(dateStr);
          const isTodayDate = isToday(day);
          
          return (
            <div
              key={dateStr}
              title={format(day, 'MMM d')}
              className={cn(
                "aspect-square rounded-sm transition-all",
                isCompleted 
                  ? "bg-gradient-to-br from-orange-400 to-orange-500" 
                  : "bg-[var(--surface-hover)]",
                isTodayDate && "ring-1 ring-white/50"
              )}
            />
          );
        })}
      </div>
      
      {/* Labels */}
      <div className="flex items-center justify-between text-xs text-themed-muted mt-2">
        <span>30 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMBINED WIDGET
// ─────────────────────────────────────────────────────────────────────────────────

interface GoalProgressWidgetProps {
  goal: UltimateGoal;
  completedDays?: string[];
  currentStreak?: number;
  longestStreak?: number;
  variant?: 'full' | 'compact';
  className?: string;
}

export function GoalProgressWidget({
  goal,
  completedDays = [],
  currentStreak = 0,
  longestStreak = 0,
  variant = 'compact',
  className
}: GoalProgressWidgetProps) {
  if (variant === 'full') {
    return (
      <div className={cn("space-y-4", className)}>
        <GoalCountdown goal={goal} completedDays={completedDays} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MiniCalendar completedDays={completedDays} targetDate={new Date(goal.targetDate)} />
          <StreakCalendar 
            completedDays={completedDays} 
            currentStreak={currentStreak}
            longestStreak={longestStreak}
          />
        </div>
      </div>
    );
  }
  
  // Compact version
  return (
    <div className={cn("glass-card p-4 rounded-2xl", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-ascend-400" />
          <span className="font-semibold text-themed text-sm truncate max-w-[150px]">
            {goal.title}
          </span>
        </div>
        <div className="flex items-center gap-1 text-orange-400">
          <Flame className="w-4 h-4" />
          <span className="font-bold text-sm">{currentStreak}</span>
        </div>
      </div>
      
      {/* Quick countdown */}
      <div className="flex items-center gap-3 mb-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-ascend-400">
            {Math.max(0, differenceInDays(new Date(goal.targetDate), new Date()))}
          </div>
          <div className="text-[10px] text-themed-muted uppercase">Days Left</div>
        </div>
        <div className="flex-1">
          <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-ascend-500 to-gold-400"
              style={{ 
                width: `${goal.milestones 
                  ? (goal.milestones.filter(m => m.status === 'completed').length / goal.milestones.length) * 100 
                  : (goal.progress || 0)}%` 
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Mini streak visualization */}
      <div className="flex gap-0.5">
        {Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dateStr = format(date, 'yyyy-MM-dd');
          const isCompleted = completedDays.includes(dateStr);
          const isTodayDate = i === 6;
          
          return (
            <div
              key={i}
              className={cn(
                "flex-1 h-1.5 rounded-full",
                isCompleted ? "bg-green-500" : "bg-[var(--surface-hover)]",
                isTodayDate && !isCompleted && "bg-ascend-500/30"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
