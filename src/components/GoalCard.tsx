// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Goal Card Component with Edit/Delete Actions
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { UltimateGoal } from '@/types';
import { 
  MoreHorizontal, 
  Trash2, 
  RefreshCw,
  Pause,
  Play,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle
} from 'lucide-react';

interface GoalCardProps {
  goal: UltimateGoal;
  onEditGoal?: () => void;
}

export function GoalCard({ goal, onEditGoal }: GoalCardProps) {
  const { updateGoal, deleteGoal, addToast } = useAscendStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleStatusChange = (newStatus: 'in_progress' | 'paused' | 'completed') => {
    updateGoal(goal.id, { status: newStatus });
    addToast({
      type: 'success',
      title: 'Goal Updated',
      message: `Goal status changed to ${newStatus === 'in_progress' ? 'active' : newStatus}`,
    });
    setShowMenu(false);
  };

  const handleDelete = () => {
    deleteGoal(goal.id);
    addToast({
      type: 'info',
      title: 'Goal Removed',
      message: `"${goal.title}" has been deleted`,
    });
    setShowDeleteConfirm(false);
    setShowMenu(false);
  };

  return (
    <div className="glass-card overflow-hidden transition-all duration-300 hover:border-ascend-500/30">
      {/* Header with Actions */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-themed truncate">{goal.title}</h3>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                goal.status === 'in_progress' && "bg-ascend-500/20 text-ascend-500 border border-ascend-500/30",
                goal.status === 'completed' && "bg-green-500/20 text-green-400 border border-green-500/30",
                goal.status === 'paused' && "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              )}>
                {goal.status === 'in_progress' ? 'Active' : goal.status === 'completed' ? 'Completed' : 'Paused'}
              </span>
            </div>
            {goal.description && (
              <p className="text-themed-secondary text-sm line-clamp-2">{goal.description}</p>
            )}
          </div>

          {/* Action Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors
                       text-themed-muted hover:text-themed focus:outline-none
                       focus-visible:ring-2 focus-visible:ring-ascend-500"
              aria-label="Goal options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[var(--surface)] 
                              border border-[var(--border)] shadow-xl z-50 overflow-hidden animate-scale-in">
                  <div className="p-2">
                    {/* Change Goal Button */}
                    <button
                      onClick={() => {
                        onEditGoal?.();
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
                               text-left text-themed hover:bg-ascend-500/10 hover:text-ascend-500
                               transition-colors group"
                    >
                      <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                      <div>
                        <p className="font-medium">Change Goal</p>
                        <p className="text-xs text-themed-muted">Create a new goal to replace this one</p>
                      </div>
                    </button>

                    <div className="my-2 h-px bg-[var(--border)]" />

                    {/* Status Options */}
                    <p className="px-4 py-2 text-xs font-medium text-themed-muted uppercase tracking-wider">
                      Status
                    </p>
                    
                    {goal.status !== 'in_progress' && (
                      <button
                        onClick={() => handleStatusChange('in_progress')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                                 text-left text-themed hover:bg-ascend-500/10 transition-colors"
                      >
                        <Play className="w-4 h-4 text-ascend-500" />
                        <span>Resume Goal</span>
                      </button>
                    )}
                    
                    {goal.status !== 'paused' && goal.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange('paused')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                                 text-left text-themed hover:bg-amber-500/10 transition-colors"
                      >
                        <Pause className="w-4 h-4 text-amber-400" />
                        <span>Pause Goal</span>
                      </button>
                    )}
                    
                    {goal.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange('completed')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                                 text-left text-themed hover:bg-green-500/10 transition-colors"
                      >
                        <Check className="w-4 h-4 text-green-400" />
                        <span>Mark Complete</span>
                      </button>
                    )}

                    <div className="my-2 h-px bg-[var(--border)]" />

                    {/* Delete Option */}
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                               text-left text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Goal</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-themed-secondary font-medium">Overall Progress</span>
            <span className="text-ascend-500 font-bold">{goal.progress}%</span>
          </div>
          <div className="h-3 rounded-full bg-[var(--border)] overflow-hidden relative">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-ascend-500 via-ascend-400 to-gold-400 
                       transition-all duration-700 ease-out relative overflow-hidden"
              style={{ width: `${goal.progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                            -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        </div>
      </div>

      {/* Expand/Collapse Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-2 flex items-center justify-center gap-2 
                 text-themed-muted hover:text-themed hover:bg-[var(--surface-hover)]
                 transition-colors border-t border-[var(--border)]"
      >
        <span className="text-xs font-medium">
          {expanded ? 'Hide' : 'Show'} Milestones ({goal.milestones.length})
        </span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Milestones */}
      {expanded && (
        <div className="px-6 pb-6">
          <div className="space-y-3 pt-4">
            {goal.milestones.map((milestone, index) => (
              <div 
                key={milestone.id} 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                  milestone.status === 'completed' 
                    ? "bg-green-500/5 border border-green-500/20"
                    : milestone.status === 'in_progress'
                      ? "bg-ascend-500/5 border border-ascend-500/20"
                      : "bg-[var(--surface)] border border-transparent hover:border-[var(--border)]"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                  "transition-all duration-300",
                  milestone.status === 'completed' 
                    ? "bg-green-500/20 text-green-400 ring-2 ring-green-500/30"
                    : milestone.status === 'in_progress'
                      ? "bg-ascend-500/20 text-ascend-500 ring-2 ring-ascend-500/30"
                      : "bg-[var(--border)] text-themed-muted"
                )}>
                  {milestone.status === 'completed' ? '✓' : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium text-sm truncate",
                    milestone.status === 'completed' 
                      ? "text-themed-muted line-through" 
                      : "text-themed"
                  )}>
                    {milestone.title}
                  </p>
                  <p className="text-xs text-themed-muted">
                    {milestone.weeklyObjectives.length} weekly objectives
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn(
                    "text-sm font-semibold",
                    milestone.status === 'completed' ? "text-green-400" : "text-themed-muted"
                  )}>
                    {Math.round(milestone.progress)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative w-full max-w-md bg-[var(--surface)] rounded-2xl 
                        border border-[var(--border)] shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-themed">Delete Goal?</h3>
                  <p className="text-themed-secondary text-sm mt-1">
                    Are you sure you want to delete &quot;<span className="font-medium text-themed">{goal.title}</span>&quot;? 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border-t border-[var(--border)] bg-[var(--background)]">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 btn-danger flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
