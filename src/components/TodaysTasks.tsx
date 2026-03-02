// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Today's Tasks Component
// Shows daily tasks from goals with interactive completion
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { DailyTask } from '@/types';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Zap, 
  Target,
  ChevronRight,
  Sparkles,
  Trophy,
  Brain
} from 'lucide-react';

const PRIORITY_STYLES: Record<DailyTask['priority'], { bg: string; border: string; text: string; label: string }> = {
  critical: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', label: 'Critical' },
  high: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', label: 'High' },
  medium: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', label: 'Medium' },
  low: { bg: 'bg-gray-500/20', border: 'border-gray-500/50', text: 'text-gray-400', label: 'Low' },
};

const DIFFICULTY_XP: Record<DailyTask['difficulty'], number> = {
  easy: 10,
  medium: 15,
  hard: 25,
};

interface TodaysTasksProps {
  onOpenGoalWizard: () => void;
}

export function TodaysTasks({ onOpenGoalWizard }: TodaysTasksProps) {
  const { getTodaysTasks, completeTask, goals } = useAscendStore();
  const [completingTask, setCompletingTask] = useState<string | null>(null);
  const [celebratingTask, setCelebratingTask] = useState<string | null>(null);
  
  const todaysTasks = getTodaysTasks();
  const completedToday = todaysTasks.filter(t => t.task.status === 'completed').length;
  const totalToday = todaysTasks.length;
  const progressPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const handleCompleteTask = async (
    taskId: string, 
    goalId: string, 
    milestoneId: string, 
    objectiveId: string
  ) => {
    setCompletingTask(taskId);
    
    // Animate the completion
    setTimeout(() => {
      completeTask(goalId, milestoneId, objectiveId, taskId);
      setCelebratingTask(taskId);
      setCompletingTask(null);
      
      // Remove celebration after animation
      setTimeout(() => {
        setCelebratingTask(null);
      }, 1500);
    }, 300);
  };

  // No goals yet - show prompt
  if (goals.length === 0) {
    return (
      <div className="glass-card p-6">
        <div className="text-center py-8" role="status">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ascend-500/20 to-gold-400/20 
                        flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-ascend-500" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold text-themed mb-2">Set Your First Goal</h3>
          <p className="text-themed-secondary text-sm mb-6 max-w-xs mx-auto">
            Tell us your ultimate goal and AI will create personalized daily tasks just for you
          </p>
          <button
            onClick={onOpenGoalWizard}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Create My Goal
          </button>
        </div>
      </div>
    );
  }

  // No tasks for today
  if (todaysTasks.length === 0) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-themed flex items-center gap-2">
            <Target className="w-5 h-5 text-ascend-500" aria-hidden="true" />
            Today&apos;s Tasks
          </h3>
        </div>
        <div className="text-center py-6" role="status">
          <Trophy className="w-12 h-12 text-gold-400 mx-auto mb-3" aria-hidden="true" />
          <p className="text-themed font-medium">All caught up.</p>
          <p className="text-themed-muted text-sm mt-1">Check back tomorrow for new tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-themed flex items-center gap-2">
            <Target className="w-5 h-5 text-ascend-500" aria-hidden="true" />
            Today&apos;s Tasks
          </h3>
          <p className="text-xs text-themed-muted mt-0.5">
            {completedToday} of {totalToday} completed
          </p>
        </div>
        
        {/* Progress Ring */}
        <div className="relative w-12 h-12" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label={`${progressPercent}% tasks completed`}>
          <svg className="w-full h-full -rotate-90" aria-hidden="true">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="var(--border)"
              strokeWidth="4"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="url(#taskGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${progressPercent * 1.26} 126`}
            />
            <defs>
              <linearGradient id="taskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14B899" />
                <stop offset="100%" stopColor="#FBBF24" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-themed">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {todaysTasks.slice(0, 5).map(({ task, goalId, milestoneId, objectiveId, goalTitle }) => {
          const priority = PRIORITY_STYLES[task.priority];
          const isCompleting = completingTask === task.id;
          const isCelebrating = celebratingTask === task.id;
          const isCompleted = task.status === 'completed';
          
          return (
            <div
              key={task.id}
              className={cn(
                "relative p-4 rounded-xl border transition-all duration-300",
                isCompleted 
                  ? "bg-green-500/10 border-green-500/30" 
                  : `${priority.bg} ${priority.border}`,
                isCompleting && "scale-95 opacity-70",
                isCelebrating && "animate-pulse ring-2 ring-green-500"
              )}
            >
              {/* Celebration Effect */}
              {isCelebrating && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="absolute inset-0 bg-green-500/20 rounded-xl animate-ping" />
                  <span className="w-7 h-7 rounded-full bg-green-400/30 border border-green-400/60 animate-pulse" />
                </div>
              )}
              
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => !isCompleted && handleCompleteTask(task.id, goalId, milestoneId, objectiveId)}
                  disabled={isCompleted || isCompleting}
                  aria-label={isCompleted ? `${task.title} - Completed` : `Mark ${task.title} as complete`}
                  aria-pressed={isCompleted}
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    "min-w-[44px] min-h-[44px] -m-1",
                    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ascend-500",
                    isCompleted 
                      ? "bg-green-500 text-white" 
                      : "border-2 border-current hover:bg-white/10",
                    priority.text
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  ) : isCompleting ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                  ) : (
                    <Circle className="w-5 h-5 opacity-50" aria-hidden="true" />
                  )}
                </button>
                
                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium text-sm",
                    isCompleted ? "text-themed-muted line-through" : "text-themed"
                  )}>
                    {task.title}
                  </p>
                  
                  {task.description && (
                    <p className="text-xs text-themed-muted mt-0.5 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                  
                  {/* Task Meta */}
                  <div className="flex items-center gap-3 mt-2">
                    <span className={cn("text-xs", priority.text)}>
                      {priority.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-themed-muted">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      <span aria-label={`Estimated time: ${task.estimatedMinutes} minutes`}>{task.estimatedMinutes} min</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gold-400">
                      <Zap className="w-3 h-3" aria-hidden="true" />
                      <span aria-label={`XP reward: ${task.xpReward || DIFFICULTY_XP[task.difficulty]} points`}>+{task.xpReward || DIFFICULTY_XP[task.difficulty]} XP</span>
                    </span>
                  </div>
                  
                  {/* Goal Link */}
                  <p className="text-xs text-themed-muted mt-1 flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" aria-hidden="true" />
                    <span className="sr-only">From goal: </span>{goalTitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        
        {todaysTasks.length > 5 && (
          <button 
            className="w-full py-3 text-sm text-ascend-500 hover:text-ascend-400 transition-colors
                     min-h-[44px] rounded-lg focus-visible:ring-2 focus-visible:ring-ascend-500"
            aria-label={`View all ${todaysTasks.length} tasks`}
          >
            View all {todaysTasks.length} tasks →
          </button>
        )}
      </div>
      
      {/* Motivation */}
      {progressPercent > 0 && progressPercent < 100 && (
        <div className="mt-4 p-3 rounded-lg bg-ascend-500/10 border border-ascend-500/20" role="status" aria-live="polite">
          <p className="text-xs text-ascend-400 text-center">
            {progressPercent >= 75 
              ? 'Almost there. Finish strong.' 
              : progressPercent >= 50 
                ? 'Halfway done. Keep pushing.'
                : "Great start. You've got this."}
          </p>
        </div>
      )}
    </div>
  );
}
