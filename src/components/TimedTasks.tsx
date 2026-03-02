// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Timed Tasks Component
// Time-based task system with timers, progress bars, and rewards
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { TimedTask as TimedTaskType, TimedTaskStatus } from '@/types';
import { 
  Clock, 
  Play, 
  Pause, 
  Check, 
  X, 
  Zap, 
  Trophy,
  Timer,
  Plus,
  Flame
} from 'lucide-react';

interface TaskTimerState {
  taskId: string | null;
  isRunning: boolean;
  elapsedSeconds: number;
  timeLimit: number;
}

// Default tasks for new users
const DEFAULT_TASKS: Omit<TimedTaskType, 'id'>[] = [
  { title: 'Morning meditation', description: 'Start your day with mindfulness', scheduledTime: '06:30', estimatedMinutes: 10, timeLimit: 15, status: 'scheduled', priority: 'high', category: 'mindfulness', date: new Date().toISOString().split('T')[0], xpReward: 20, bonusXp: 10, penaltyApplied: false },
  { title: 'Review daily goals', description: 'Set clear intentions for the day', scheduledTime: '07:00', estimatedMinutes: 5, timeLimit: 10, status: 'scheduled', priority: 'critical', category: 'productivity', date: new Date().toISOString().split('T')[0], xpReward: 15, bonusXp: 5, penaltyApplied: false },
  { title: 'Deep work session', description: 'Focus on your most important task', scheduledTime: '09:00', estimatedMinutes: 90, timeLimit: 120, status: 'scheduled', priority: 'critical', category: 'productivity', date: new Date().toISOString().split('T')[0], xpReward: 50, bonusXp: 25, penaltyApplied: false },
  { title: 'Exercise routine', description: 'Move your body, improve your mind', scheduledTime: '12:00', estimatedMinutes: 30, timeLimit: 45, status: 'scheduled', priority: 'high', category: 'health', date: new Date().toISOString().split('T')[0], xpReward: 30, bonusXp: 15, penaltyApplied: false },
  { title: 'Read for 20 minutes', description: 'Expand your knowledge', scheduledTime: '21:00', estimatedMinutes: 20, timeLimit: 30, status: 'scheduled', priority: 'medium', category: 'learning', date: new Date().toISOString().split('T')[0], xpReward: 15, bonusXp: 5, penaltyApplied: false },
];

export function TimedTasks() {
  const { 
    timedTasks, 
    addTimedTask, 
    updateTimedTask, 
    deleteTimedTask: _deleteTimedTask,
    addToast, 
    addXP 
  } = useAscendStore();
  
  const [timer, setTimer] = useState<TaskTimerState>({
    taskId: null,
    isRunning: false,
    elapsedSeconds: 0,
    timeLimit: 0,
  });
  const [_showAddTask, setShowAddTask] = useState(false);

  // Initialize with default tasks if store is empty
  useEffect(() => {
    if (timedTasks.length === 0) {
      DEFAULT_TASKS.forEach(task => {
        addTimedTask({
          ...task,
          id: `timed_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
        });
      });
    }
  }, [timedTasks.length, addTimedTask]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.isRunning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeLimit = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getProgressPercentage = (elapsed: number, limit: number): number => {
    return Math.min((elapsed / (limit * 60)) * 100, 100);
  };

  const getTimeStatus = (elapsed: number, limit: number): 'good' | 'warning' | 'danger' => {
    const percentage = (elapsed / (limit * 60)) * 100;
    if (percentage < 70) return 'good';
    if (percentage < 90) return 'warning';
    return 'danger';
  };

  const startTask = (taskId: string) => {
    const task = timedTasks.find(t => t.id === taskId);
    if (!task) return;

    updateTimedTask(taskId, { 
      status: 'in_progress' as TimedTaskStatus, 
      startedAt: new Date() 
    });

    setTimer({
      taskId,
      isRunning: true,
      elapsedSeconds: 0,
      timeLimit: task.timeLimit,
    });

    addToast({
      type: 'info',
      title: 'Task Started',
      message: `Timer running for "${task.title}"`,
    });
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resumeTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: true }));
  };

  const completeTask = (taskId: string) => {
    const task = timedTasks.find(t => t.id === taskId);
    if (!task) return;

    const actualMinutes = Math.ceil(timer.elapsedSeconds / 60);
    let status: TimedTaskStatus;
    let xpEarned = task.xpReward;
    let message = '';

    if (actualMinutes <= task.estimatedMinutes * 0.8) {
      status = 'completed_fast';
      xpEarned += task.bonusXp;
      message = `Speed bonus: +${task.bonusXp} XP`;
    } else if (actualMinutes <= task.timeLimit) {
      status = 'completed_ontime';
      message = 'Completed on time';
    } else {
      status = 'completed_late';
      xpEarned = Math.floor(task.xpReward * 0.5); // Half XP for late
      message = 'Completed late (half XP)';
    }

    updateTimedTask(taskId, { 
      status, 
      completedAt: new Date(), 
      actualMinutes 
    });

    setTimer({
      taskId: null,
      isRunning: false,
      elapsedSeconds: 0,
      timeLimit: 0,
    });

    addXP(xpEarned, `Completed task: ${task.title}`);
    addToast({
      type: status === 'completed_fast' ? 'success' : 'info',
      title: `+${xpEarned} XP`,
      message,
    });
  };

  const skipTask = (taskId: string) => {
    updateTimedTask(taskId, { status: 'missed' as TimedTaskStatus });

    if (timer.taskId === taskId) {
      setTimer({
        taskId: null,
        isRunning: false,
        elapsedSeconds: 0,
        timeLimit: 0,
      });
    }
  };

  const getPriorityColor = (priority: TimedTaskType['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/10';
      case 'high': return 'text-orange-400 bg-orange-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'low': return 'text-green-400 bg-green-500/10';
    }
  };

  const getStatusIcon = (status: TimedTaskType['status']) => {
    switch (status) {
      case 'completed_fast': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'completed_ontime': return <Check className="w-4 h-4 text-green-400" />;
      case 'completed_late': return <Clock className="w-4 h-4 text-orange-400" />;
      case 'missed': return <X className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const scheduledTasks = timedTasks.filter(t => t.status === 'scheduled');
  const inProgressTask = timedTasks.find(t => t.status === 'in_progress');
  const completedTasks = timedTasks.filter(t => t.status.startsWith('completed'));

  return (
    <div className="space-y-6">
      {/* Active Timer */}
      {inProgressTask && timer.taskId && (
        <div className="glass-card p-6 border-2 border-ascend-500/30 bg-ascend-500/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ascend-500/20 flex items-center justify-center">
                <Timer className="w-5 h-5 text-ascend-400" />
              </div>
              <div>
                <h3 className="font-semibold text-themed">{inProgressTask.title}</h3>
                <p className="text-xs text-themed-muted">
                  Time limit: {formatTimeLimit(inProgressTask.timeLimit)}
                </p>
              </div>
            </div>
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold",
              getPriorityColor(inProgressTask.priority)
            )}>
              {inProgressTask.priority.toUpperCase()}
            </div>
          </div>

          {/* Timer Display */}
          <div className="text-center py-6">
            <div className={cn(
              "text-5xl font-mono font-bold",
              getTimeStatus(timer.elapsedSeconds, timer.timeLimit) === 'good' && "text-green-400",
              getTimeStatus(timer.elapsedSeconds, timer.timeLimit) === 'warning' && "text-yellow-400",
              getTimeStatus(timer.elapsedSeconds, timer.timeLimit) === 'danger' && "text-red-400",
            )}>
              {formatTime(timer.elapsedSeconds)}
            </div>
            <p className="text-themed-muted text-sm mt-2">
              / {formatTimeLimit(timer.timeLimit)} limit
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-3 rounded-full bg-[var(--border)] overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  getTimeStatus(timer.elapsedSeconds, timer.timeLimit) === 'good' && "bg-green-500",
                  getTimeStatus(timer.elapsedSeconds, timer.timeLimit) === 'warning' && "bg-yellow-500",
                  getTimeStatus(timer.elapsedSeconds, timer.timeLimit) === 'danger' && "bg-red-500",
                )}
                style={{ width: `${getProgressPercentage(timer.elapsedSeconds, timer.timeLimit)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-themed-muted mt-2">
              <span>0m</span>
              <span className="text-ascend-400 font-medium">
                {timer.elapsedSeconds <= inProgressTask.estimatedMinutes * 60 * 0.8 
                  ? `On track for bonus` 
                  : timer.elapsedSeconds <= inProgressTask.timeLimit * 60
                    ? `Still within limit`
                    : `Over time limit`
                }
              </span>
              <span>{formatTimeLimit(timer.timeLimit)}</span>
            </div>
          </div>

          {/* Reward Preview */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface)] mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-gold-400" />
              <span className="text-sm text-themed">Reward:</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-ascend-400">
                +{inProgressTask.xpReward} XP
              </span>
              {timer.elapsedSeconds <= inProgressTask.estimatedMinutes * 60 * 0.8 && (
                <span className="text-sm font-semibold text-gold-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  +{inProgressTask.bonusXp} bonus
                </span>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3" role="group" aria-label="Task timer controls">
            <button
              onClick={() => timer.isRunning ? pauseTimer() : resumeTimer()}
              className="flex-1 py-3 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] 
                       transition-colors flex items-center justify-center gap-2 font-medium
                       min-h-[48px] focus-visible:ring-2 focus-visible:ring-ascend-500"
              aria-label={timer.isRunning ? 'Pause task timer' : 'Resume task timer'}
            >
              {timer.isRunning ? (
                <><Pause className="w-5 h-5" aria-hidden="true" /> Pause</>
              ) : (
                <><Play className="w-5 h-5" aria-hidden="true" /> Resume</>
              )}
            </button>
            <button
              onClick={() => completeTask(inProgressTask.id)}
              className="flex-1 py-3 rounded-xl bg-ascend-500 hover:bg-ascend-600 
                       transition-colors flex items-center justify-center gap-2 font-semibold text-white
                       min-h-[48px] focus-visible:ring-2 focus-visible:ring-ascend-400"
              aria-label={`Complete task: ${inProgressTask.title}`}
            >
              <Check className="w-5 h-5" aria-hidden="true" /> Complete
            </button>
            <button
              onClick={() => skipTask(inProgressTask.id)}
              className="px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 
                       transition-colors text-red-400
                       min-w-[48px] min-h-[48px] flex items-center justify-center
                       focus-visible:ring-2 focus-visible:ring-red-500"
              title="Skip task"
              aria-label={`Skip task: ${inProgressTask.title}`}
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Scheduled Tasks */}
      {scheduledTasks.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-themed flex items-center gap-2">
              <Clock className="w-5 h-5 text-ascend-400" />
              Scheduled Tasks
            </h3>
            <span className="text-sm text-themed-muted">{scheduledTasks.length} remaining</span>
          </div>

          <div className="space-y-3">
            {scheduledTasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors"
              >
                <div className="text-center min-w-[60px]">
                  <p className="text-lg font-semibold text-themed">{task.scheduledTime}</p>
                  <p className="text-xs text-themed-muted">{formatTimeLimit(task.estimatedMinutes)}</p>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-themed">{task.title}</h4>
                    <span className={cn("px-2 py-0.5 rounded text-xs", getPriorityColor(task.priority))}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-themed-muted">
                    <span className="flex items-center gap-1">
                      <Timer className="w-3 h-3" /> Limit: {formatTimeLimit(task.timeLimit)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-gold-400" /> +{task.xpReward} XP
                    </span>
                    {task.bonusXp > 0 && (
                      <span className="flex items-center gap-1 text-gold-400">
                        <Flame className="w-3 h-3" /> +{task.bonusXp} bonus
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => startTask(task.id)}
                  disabled={!!inProgressTask}
                  aria-label={inProgressTask ? 'Cannot start: another task is in progress' : `Start task: ${task.title}`}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
                    "min-h-[44px] focus-visible:ring-2 focus-visible:ring-ascend-500",
                    inProgressTask 
                      ? "bg-[var(--border)] text-themed-muted cursor-not-allowed"
                      : "bg-ascend-500 hover:bg-ascend-600 text-white"
                  )}
                >
                  <Play className="w-4 h-4" aria-hidden="true" />
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-themed flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Completed Today
            </h3>
            <span className="text-sm text-green-400 font-medium">
              {completedTasks.length}/{timedTasks.length}
            </span>
          </div>

          <div className="space-y-2">
            {completedTasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10"
              >
                {getStatusIcon(task.status)}
                <span className="flex-1 text-sm text-themed line-through opacity-70">
                  {task.title}
                </span>
                <span className="text-xs text-themed-muted">
                  {task.actualMinutes && `${task.actualMinutes}m`}
                </span>
                <span className={cn(
                  "text-xs font-semibold",
                  task.status === 'completed_fast' && "text-gold-400",
                  task.status === 'completed_ontime' && "text-green-400",
                  task.status === 'completed_late' && "text-orange-400",
                )}>
                  +{task.status === 'completed_late' 
                    ? Math.floor(task.xpReward * 0.5) 
                    : task.status === 'completed_fast'
                      ? task.xpReward + task.bonusXp
                      : task.xpReward
                  } XP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Task Button */}
      <button
        onClick={() => setShowAddTask(true)}
        className="w-full py-4 rounded-xl border-2 border-dashed border-[var(--border)] 
                 hover:border-ascend-500/50 hover:bg-ascend-500/5 transition-colors
                 flex items-center justify-center gap-2 text-themed-muted hover:text-ascend-400"
      >
        <Plus className="w-5 h-5" />
        Add Timed Task
      </button>
    </div>
  );
}

// Progress Bar Component (Reusable)
interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  color?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function ProgressBar({ 
  current, 
  target, 
  label, 
  color = 'ascend',
  showPercentage = true,
  size = 'md',
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorClasses: Record<string, string> = {
    ascend: 'bg-gradient-to-r from-ascend-500 to-ascend-400',
    gold: 'bg-gradient-to-r from-gold-400 to-yellow-400',
    green: 'bg-gradient-to-r from-green-500 to-emerald-400',
    red: 'bg-gradient-to-r from-red-500 to-orange-400',
    purple: 'bg-gradient-to-r from-purple-500 to-pink-400',
    blue: 'bg-gradient-to-r from-blue-500 to-cyan-400',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-themed-muted">{label}</span>}
          {showPercentage && (
            <span className="text-xs font-semibold text-themed">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={cn("w-full rounded-full bg-[var(--border)] overflow-hidden", sizeClasses[size])}>
        <div 
          className={cn(
            "h-full rounded-full",
            colorClasses[color] || colorClasses.ascend,
            animated && "transition-all duration-500 ease-out"
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={target}
        />
      </div>
    </div>
  );
}

// Habit Progress Card with Multiple Layers
interface HabitProgressCardProps {
  habit: {
    name: string;
    icon: string;
    color: string;
    todayCompleted: boolean;
    weekCompleted: number;
    weekTarget: number;
    monthCompleted: number;
    monthTarget: number;
    currentStreak: number;
    bestStreak: number;
    identityProgress?: number;
    identityTarget?: number;
    identityName?: string;
  };
}

export function HabitProgressCard({ habit }: HabitProgressCardProps) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: `${habit.color}20` }}
        >
          {habit.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-themed">{habit.name}</h4>
          <p className="text-xs text-themed-muted">
            Streak: {habit.currentStreak} days (best: {habit.bestStreak})
          </p>
        </div>
        {habit.todayCompleted && (
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-4 h-4 text-green-400" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {/* Today */}
        <ProgressBar 
          current={habit.todayCompleted ? 1 : 0} 
          target={1} 
          label="Today"
          color={habit.todayCompleted ? 'green' : 'ascend'}
          size="sm"
        />

        {/* This Week */}
        <ProgressBar 
          current={habit.weekCompleted} 
          target={habit.weekTarget} 
          label={`This Week (${habit.weekCompleted}/${habit.weekTarget})`}
          color="blue"
          size="sm"
        />

        {/* This Month */}
        <ProgressBar 
          current={habit.monthCompleted} 
          target={habit.monthTarget} 
          label={`This Month (${habit.monthCompleted}/${habit.monthTarget})`}
          color="purple"
          size="sm"
        />

        {/* Identity Progress */}
        {habit.identityProgress !== undefined && habit.identityTarget && (
          <div className="pt-2 border-t border-[var(--border)]">
            <ProgressBar 
              current={habit.identityProgress} 
              target={habit.identityTarget} 
              label={`→ "${habit.identityName}" Identity`}
              color="gold"
              size="md"
            />
          </div>
        )}
      </div>
    </div>
  );
}
