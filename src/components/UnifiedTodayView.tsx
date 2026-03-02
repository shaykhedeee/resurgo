// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Unified Today View
// Single task stream combining habits, goals, and manual tasks
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useMemo } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { UnifiedTask } from '@/types';
import { format } from 'date-fns';
import { playSound } from '@/lib/sounds';

import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Zap, 
  Target,
  Sparkles,
  Trophy,
  Brain,
  Repeat,
  ArrowRight,
  Star,
  ChevronDown,
  ChevronUp,
  Plus,
  Calendar,
} from 'lucide-react';

const PRIORITY_STYLES = {
  urgent: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', label: 'Urgent' },
  high: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', label: 'High' },
  medium: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', label: 'Medium' },
  low: { bg: 'bg-gray-500/20', border: 'border-gray-500/50', text: 'text-gray-400', label: 'Low' },
  none: { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-500', label: '' },
};

const SOURCE_ICONS = {
  habit: { icon: Repeat, color: 'text-purple-400', label: 'Daily Habit' },
  goal: { icon: Target, color: 'text-ascend-400', label: 'Goal Task' },
  manual: { icon: Star, color: 'text-gold-400', label: 'Personal Task' },
  'ai-suggested': { icon: Brain, color: 'text-pink-400', label: 'AI Suggested' },
};

interface UnifiedTodayViewProps {
  onOpenGoalWizard: () => void;
  onAddTask?: () => void;
}

export function UnifiedTodayView({ onOpenGoalWizard, onAddTask }: UnifiedTodayViewProps) {
  const { getUnifiedTodayTasks, completeUnifiedTask, skipUnifiedTask, goals, habits, user: _user } = useAscendStore();
  const [completingTask, setCompletingTask] = useState<string | null>(null);
  const [celebratingTask, setCelebratingTask] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'habit' | 'goal' | 'manual'>('all');
  
  const allTasks = useMemo(() => getUnifiedTodayTasks(), [getUnifiedTodayTasks]);
  
  const filteredTasks = useMemo(() => {
    let tasks = allTasks;
    if (filter !== 'all') {
      tasks = tasks.filter(t => t.source === filter);
    }
    if (!showCompleted) {
      tasks = tasks.filter(t => t.status !== 'completed');
    }
    return tasks;
  }, [allTasks, filter, showCompleted]);
  
  const pendingTasks = allTasks.filter(t => t.status === 'pending');
  const completedTasks = allTasks.filter(t => t.status === 'completed');
  const _totalXP = pendingTasks.reduce((sum, t) => sum + t.xpReward, 0);
  const earnedXP = completedTasks.reduce((sum, t) => sum + t.xpReward, 0);
  const progressPercent = allTasks.length > 0 
    ? Math.round((completedTasks.length / allTasks.length) * 100) 
    : 0;

  const handleCompleteTask = async (taskId: string) => {
    setCompletingTask(taskId);
    
    // Find the task to determine sound type
    const task = allTasks.find(t => t.id === taskId);
    
    setTimeout(() => {
      completeUnifiedTask(taskId);
      setCelebratingTask(taskId);
      setCompletingTask(null);
      
      // Play appropriate sound based on task source
      if (task?.source === 'habit') {
        playSound('habitComplete');
      } else {
        playSound('taskComplete');
      }
      
      setTimeout(() => {
        setCelebratingTask(null);
      }, 1500);
    }, 300);
  };

  // No tasks at all - empty state
  if (goals.length === 0 && habits.filter(h => !h.archived && h.isActive).length === 0) {
    return (
      <div className="glass-card p-6">
        <div className="text-center py-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-ascend-500/20 to-gold-400/20 
                        flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-ascend-500" />
          </div>
          <h3 className="text-xl font-bold text-themed mb-2">Start Your Transformation</h3>
          <p className="text-themed-secondary text-sm mb-6 max-w-xs mx-auto">
            Tell us who you want to become, and AI will create your personalized daily action plan
          </p>
          <button
            onClick={onOpenGoalWizard}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            Create My Journey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-themed flex items-center gap-2">
              <Calendar className="w-5 h-5 text-ascend-500" />
              Today&apos;s Focus
            </h2>
            <p className="text-sm text-themed-muted mt-0.5">
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
          </div>
          
          {/* Progress Ring */}
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="var(--border)"
                strokeWidth="4"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="url(#todayGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${progressPercent * 1.76} 176`}
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="todayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#14B899" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-themed">{progressPercent}%</span>
            </div>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-[var(--surface)]">
            <p className="text-lg font-bold text-themed">{pendingTasks.length}</p>
            <p className="text-xs text-themed-muted">To Do</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-green-500/10">
            <p className="text-lg font-bold text-green-400">{completedTasks.length}</p>
            <p className="text-xs text-themed-muted">Done</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-gold-400/10">
            <p className="text-lg font-bold text-gold-400">+{earnedXP}</p>
            <p className="text-xs text-themed-muted">XP Earned</p>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All', count: allTasks.length },
            { id: 'habit', label: 'Habits', count: allTasks.filter(t => t.source === 'habit').length },
            { id: 'goal', label: 'Goals', count: allTasks.filter(t => t.source === 'goal').length },
            { id: 'manual', label: 'Tasks', count: allTasks.filter(t => t.source === 'manual').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as 'all' | 'habit' | 'goal' | 'manual')}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                filter === tab.id
                  ? "bg-ascend-500 text-white"
                  : "bg-[var(--surface)] text-themed-muted hover:text-themed"
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Quick Add Button */}
      {onAddTask && (
        <button
          onClick={onAddTask}
          className="w-full p-3 rounded-xl border-2 border-dashed border-[var(--border)] 
                   text-themed-muted hover:text-ascend-500 hover:border-ascend-500/50
                   flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add a task
        </button>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="glass-card p-6 text-center">
            {completedTasks.length > 0 ? (
              <>
                <Trophy className="w-12 h-12 text-gold-400 mx-auto mb-3" />
                <p className="text-themed font-medium">All done for today.</p>
                <p className="text-themed-muted text-sm mt-1">
                  You completed {completedTasks.length} tasks and earned {earnedXP} XP
                </p>
                <button
                  onClick={() => setShowCompleted(true)}
                  className="text-sm text-ascend-500 hover:text-ascend-400 mt-3"
                >
                  View completed tasks
                </button>
              </>
            ) : (
              <>
                <Sparkles className="w-12 h-12 text-ascend-500 mx-auto mb-3" />
                <p className="text-themed font-medium">No tasks yet</p>
                <p className="text-themed-muted text-sm mt-1">
                  Create a goal or add habits to get started
                </p>
              </>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isCompleting={completingTask === task.id}
              isCelebrating={celebratingTask === task.id}
              onComplete={() => handleCompleteTask(task.id)}
              onSkip={() => skipUnifiedTask(task.id)}
            />
          ))
        )}
      </div>

      {/* Show/Hide Completed Toggle */}
      {completedTasks.length > 0 && (
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="w-full py-2 text-sm text-themed-muted hover:text-themed 
                   flex items-center justify-center gap-2 transition-colors"
        >
          {showCompleted ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide completed ({completedTasks.length})
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show completed ({completedTasks.length})
            </>
          )}
        </button>
      )}

      {/* Motivation Message */}
      {progressPercent > 0 && progressPercent < 100 && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-ascend-500/10 to-gold-400/10 
                      border border-ascend-500/20 text-center">
          <p className="text-sm">
            {progressPercent >= 75 
              ? <span className="text-gold-400">Almost there. Just {pendingTasks.length} more to go.</span>
              : progressPercent >= 50 
                ? <span className="text-ascend-400">Great progress. Keep the momentum going.</span>
                : <span className="text-ascend-400">Good start. Keep building consistency.</span>}
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Task Card Component
// ─────────────────────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: UnifiedTask;
  isCompleting: boolean;
  isCelebrating: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

function TaskCard({ task, isCompleting, isCelebrating, onComplete, onSkip }: TaskCardProps) {
  const priority = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.none;
  const sourceInfo = SOURCE_ICONS[task.source];
  const SourceIcon = sourceInfo.icon;
  const isCompleted = task.status === 'completed';
  
  return (
    <div
      className={cn(
        "relative glass-card p-4 transition-all duration-300",
        isCompleted 
          ? "opacity-60" 
          : "",
        isCompleting && "scale-[0.98] opacity-70",
        isCelebrating && "ring-2 ring-green-500 ring-offset-2 ring-offset-[var(--background)]"
      )}
    >
      {/* Celebration Effect */}
      {isCelebrating && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="w-8 h-8 rounded-full bg-emerald-400/30 border border-emerald-400/60 animate-pulse" />
        </div>
      )}
      
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={onComplete}
          disabled={isCompleted || isCompleting}
          className={cn(
            "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all",
            "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ascend-500",
            isCompleted 
              ? "bg-green-500 text-white" 
              : "border-2 hover:bg-white/10",
            task.source === 'habit' ? "border-purple-400" :
            task.source === 'goal' ? "border-ascend-400" :
            "border-gold-400"
          )}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : isCompleting ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Circle className="w-4 h-4 opacity-50" />
          )}
        </button>
        
        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={cn(
              "font-medium text-sm",
              isCompleted ? "text-themed-muted line-through" : "text-themed"
            )}>
              {task.title}
            </p>
            
            {/* XP Badge */}
            <span className="flex items-center gap-1 text-xs text-gold-400 font-medium shrink-0">
              <Zap className="w-3 h-3" />
              +{task.xpReward}
            </span>
          </div>
          
          {/* Source & Meta */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={cn("flex items-center gap-1 text-xs", sourceInfo.color)}>
              <SourceIcon className="w-3 h-3" />
              {task.isRecurring && <Repeat className="w-3 h-3" />}
              {sourceInfo.label}
            </span>
            
            {task.estimatedMinutes && (
              <span className="flex items-center gap-1 text-xs text-themed-muted">
                <Clock className="w-3 h-3" />
                {task.estimatedMinutes}m
              </span>
            )}
            
            {task.priority !== 'none' && task.priority !== 'medium' && (
              <span className={cn("text-xs", priority.text)}>
                {priority.label}
              </span>
            )}
          </div>
          
          {/* Source Context */}
          {task.sourceMetadata?.goalTitle && (
            <p className="text-xs text-themed-muted mt-1 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              {task.sourceMetadata.goalTitle}
            </p>
          )}
          
          {/* Identity Statement (if connected) */}
          {task.identityStatement && !isCompleted && (
            <p className="text-xs text-ascend-400/70 mt-2 italic">
              &quot;{task.identityStatement}&quot;
            </p>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      {!isCompleted && task.source !== 'habit' && (
        <div className="flex justify-end mt-2 pt-2 border-t border-[var(--border)]">
          <button
            onClick={onSkip}
            className="text-xs text-themed-muted hover:text-themed transition-colors"
          >
            Skip for today
          </button>
        </div>
      )}
    </div>
  );
}
