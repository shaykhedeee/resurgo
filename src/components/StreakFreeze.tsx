// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Streak Freeze Component
// Shows and allows users to use streak freezes
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  Snowflake, 
  Flame, 
  AlertTriangle,
  Check,
  Zap
} from 'lucide-react';

interface StreakFreezeProps {
  className?: string;
  variant?: 'card' | 'inline' | 'badge';
  onUse?: () => void;
}

export function StreakFreeze({ className, variant = 'card', onUse }: StreakFreezeProps) {
  const { user, useStreakFreeze, addToast, habits, habitEntries } = useAscendStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [justUsed, setJustUsed] = useState(false);

  const freezesAvailable = user.gamification.streakFreezes || 0;
  const currentStreak = user.stats.currentStreak || 0;

  // Check if user completed any habits today
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = habitEntries.filter(
    e => e.date === today && e.completed
  );
  const activeHabits = habits.filter(h => h.isActive);
  const completedToday = todayEntries.length;
  const totalToday = activeHabits.length;
  const streakAtRisk = completedToday === 0 && totalToday > 0;

  const handleUseFreeze = () => {
    if (freezesAvailable > 0) {
      // useStreakFreeze is a store action, not a React hook
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const success = useStreakFreeze();
      if (success) {
        setJustUsed(true);
        setShowConfirm(false);
        addToast({
          type: 'success',
          title: 'Streak Protected',
          message: `Your ${currentStreak} day streak is safe. You have ${freezesAvailable - 1} freeze${freezesAvailable - 1 !== 1 ? 's' : ''} left.`,
        });
        onUse?.();
        setTimeout(() => setJustUsed(false), 3000);
      }
    }
  };

  // Badge variant - compact display
  if (variant === 'badge') {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full",
        freezesAvailable > 0 
          ? "bg-cyan-500/20 text-cyan-400" 
          : "bg-[var(--surface)] text-themed-muted",
        className
      )}>
        <Snowflake className="w-4 h-4" />
        <span className="text-sm font-medium">{freezesAvailable}</span>
      </div>
    );
  }

  // Inline variant - for streak displays
  if (variant === 'inline') {
    if (freezesAvailable === 0) return null;
    
    return (
      <div className={cn(
        "flex items-center gap-2 text-sm",
        streakAtRisk ? "text-cyan-400" : "text-themed-muted",
        className
      )}>
        <Snowflake className="w-4 h-4" />
        <span>{freezesAvailable} streak freeze{freezesAvailable !== 1 ? 's' : ''} available</span>
        {streakAtRisk && freezesAvailable > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="px-2 py-0.5 bg-cyan-500/20 hover:bg-cyan-500/30 rounded text-cyan-400 
                     text-xs font-medium transition-colors"
          >
            Use Now
          </button>
        )}
      </div>
    );
  }

  // Card variant - full display
  return (
    <div className={cn("glass-card overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Snowflake className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-themed">Streak Freezes</h3>
              <p className="text-xs text-themed-muted">Protect your streak on missed days</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-cyan-400">{freezesAvailable}</p>
            <p className="text-xs text-themed-muted">available</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Current Streak Status */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface)]">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-themed-secondary">Current Streak</span>
          </div>
          <span className="font-bold text-themed">{currentStreak} days</span>
        </div>

        {/* Streak at Risk Warning */}
        {streakAtRisk && currentStreak > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-yellow-400">Streak at Risk!</p>
              <p className="text-xs text-themed-muted">
                Complete a habit or use a freeze to protect your {currentStreak} day streak.
              </p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {justUsed && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
            <Check className="w-5 h-5 text-green-400" />
            <p className="text-green-400">Streak freeze activated! You&apos;re protected for today.</p>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirm && !justUsed && (
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-cyan-500/30 space-y-3">
            <p className="font-medium text-themed">Use a streak freeze?</p>
            <p className="text-sm text-themed-muted">
              This will protect your {currentStreak} day streak. You&apos;ll have {freezesAvailable - 1} freeze{freezesAvailable - 1 !== 1 ? 's' : ''} remaining.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUseFreeze}
                className="flex-1 btn-primary text-sm bg-cyan-500 hover:bg-cyan-600"
              >
                <Shield className="w-4 h-4 mr-2" />
                Use Freeze
              </button>
            </div>
          </div>
        )}

        {/* Use Button */}
        {!showConfirm && !justUsed && freezesAvailable > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!streakAtRisk || currentStreak === 0}
            className={cn(
              "w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
              streakAtRisk && currentStreak > 0
                ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                : "bg-[var(--surface)] text-themed-muted cursor-not-allowed"
            )}
          >
            <Shield className="w-4 h-4" />
            {streakAtRisk && currentStreak > 0 
              ? "Protect My Streak" 
              : currentStreak === 0 
              ? "No streak to protect" 
              : "Streak is safe today"}
          </button>
        )}

        {/* No Freezes Available */}
        {freezesAvailable === 0 && (
          <div className="text-center py-4">
            <p className="text-themed-muted text-sm">No streak freezes available</p>
            <p className="text-xs text-themed-muted mt-1">
              Reach Level 3 to unlock streak freezes
            </p>
          </div>
        )}

        {/* How to earn more */}
        <div className="pt-2 border-t border-[var(--border)]">
          <p className="text-xs text-themed-muted">
            <Zap className="w-3 h-3 inline mr-1 text-gold-400" />
            Earn more freezes by reaching higher levels or maintaining long streaks.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StreakFreeze;
