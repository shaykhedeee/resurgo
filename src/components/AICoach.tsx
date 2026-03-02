// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - AI Coach Component
// Real-time AI coaching messages using secure server-side API routes
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAscendStore } from '@/lib/store';
import { aiClient } from '@/lib/ai-client';
import { cn } from '@/lib/utils';
import { 
  Brain, 
  Sparkles, 
  Lightbulb, 
  AlertTriangle,
  PartyPopper,
  RefreshCw,
  X,
} from 'lucide-react';

interface AICoachProps {
  className?: string;
  variant?: 'inline' | 'card' | 'minimal';
  showRefresh?: boolean;
}

type MessageType = 'motivation' | 'warning' | 'celebration' | 'tip';

interface CoachMessage {
  message: string;
  type: MessageType;
  timestamp: Date;
}

export function AICoach({ className, variant = 'card', showRefresh = true }: AICoachProps) {
  const { user, habits, habitEntries } = useAscendStore();
  const [coachMessage, setCoachMessage] = useState<CoachMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate user context
  const getContext = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const hour = new Date().getHours();
    
    // Time of day
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';

    // Today's habit progress
    const todayEntries = habitEntries.filter(e => e.date === today && e.completed);
    const activeHabits = habits.filter(h => h.isActive);
    const todayCompleted = todayEntries.length;
    const todayTotal = activeHabits.length;

    // Recent trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const recentCompletions = last7Days.map(date => {
      const dayEntries = habitEntries.filter(e => e.date === date && e.completed);
      return dayEntries.length / Math.max(activeHabits.length, 1);
    });

    const recentAvg = recentCompletions.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const olderAvg = recentCompletions.slice(4, 7).reduce((a, b) => a + b, 0) / 3;

    let recentTrend: 'improving' | 'stable' | 'declining';
    if (recentAvg > olderAvg + 0.1) recentTrend = 'improving';
    else if (recentAvg < olderAvg - 0.1) recentTrend = 'declining';
    else recentTrend = 'stable';

    // Find last missed habit
    const lastMissedHabit = activeHabits.find(h => {
      const entry = habitEntries.find(e => e.habitId === h.id && e.date === today);
      return !entry?.completed;
    })?.name;

    return {
      userName: user.name || 'there',
      currentStreak: user.stats.currentStreak,
      todayCompleted,
      todayTotal,
      recentTrend,
      lastMissedHabit,
      timeOfDay,
    };
  }, [user, habits, habitEntries]);

  // Generate coaching message
  const generateMessage = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const context = getContext();
      const result = await aiClient.generateCoachingMessage(context);
      
      setCoachMessage({
        message: result.message,
        type: result.type,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error('AI Coach error:', err);
      // Fallback to local message
      const context = getContext();
      const fallbackMessages = getFallbackMessage(context);
      setCoachMessage({
        message: fallbackMessages.message,
        type: fallbackMessages.type,
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [getContext]);

  // Generate message on mount and periodically
  useEffect(() => {
    generateMessage();
    
    // Refresh every 30 minutes
    const interval = setInterval(generateMessage, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Get icon for message type
  const getIcon = (type: MessageType) => {
    switch (type) {
      case 'motivation': return Sparkles;
      case 'warning': return AlertTriangle;
      case 'celebration': return PartyPopper;
      case 'tip': return Lightbulb;
      default: return Brain;
    }
  };

  // Get colors for message type
  const getColors = (type: MessageType) => {
    switch (type) {
      case 'motivation':
        return {
          bg: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10',
          border: 'border-purple-500/30',
          icon: 'text-purple-400',
          text: 'text-purple-100',
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10',
          border: 'border-amber-500/30',
          icon: 'text-amber-400',
          text: 'text-amber-100',
        };
      case 'celebration':
        return {
          bg: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10',
          border: 'border-emerald-500/30',
          icon: 'text-emerald-400',
          text: 'text-emerald-100',
        };
      case 'tip':
        return {
          bg: 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10',
          border: 'border-blue-500/30',
          icon: 'text-blue-400',
          text: 'text-blue-100',
        };
      default:
        return {
          bg: 'bg-slate-800/50',
          border: 'border-slate-700',
          icon: 'text-slate-400',
          text: 'text-slate-200',
        };
    }
  };

  if (!isVisible) return null;

  const Icon = coachMessage ? getIcon(coachMessage.type) : Brain;
  const colors = coachMessage ? getColors(coachMessage.type) : getColors('motivation');

  // Minimal variant (just text)
  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-2 text-sm', className)}>
        <Brain className="h-4 w-4 text-purple-400" />
        {isLoading ? (
          <span className="text-slate-400 animate-pulse">Thinking...</span>
        ) : (
          <span className="text-slate-300">{coachMessage?.message || 'Loading coach...'}</span>
        )}
      </div>
    );
  }

  // Inline variant
  if (variant === 'inline') {
    return (
      <div className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border',
        colors.bg,
        colors.border,
        className
      )}>
        <Icon className={cn('h-5 w-5 flex-shrink-0', colors.icon)} />
        {isLoading ? (
          <span className="text-slate-400 animate-pulse">AI Coach is thinking...</span>
        ) : (
          <span className={cn('text-sm', colors.text)}>{coachMessage?.message}</span>
        )}
        {showRefresh && !isLoading && (
          <button
            onClick={generateMessage}
            aria-label="Refresh coaching message"
            className="ml-auto p-1 rounded hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-slate-400" />
          </button>
        )}
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className={cn(
      'relative rounded-xl border p-4',
      colors.bg,
      colors.border,
      className
    )}>
      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        aria-label="Dismiss AI Coach"
        className="absolute top-2 right-2 p-1 rounded hover:bg-white/10 transition-colors"
      >
        <X className="h-4 w-4 text-slate-500" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className={cn(
          'p-2 rounded-lg',
          colors.bg.replace('from-', 'bg-').replace('to-', '').split(' ')[0]
        )}>
          <Brain className={cn('h-5 w-5', colors.icon)} />
        </div>
        <div>
          <h3 className="font-semibold text-white">AI Coach</h3>
          <p className="text-xs text-slate-400">Powered by Groq</p>
        </div>
      </div>

      {/* Message */}
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', colors.icon)} />
        <div className="flex-1">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-slate-700/50 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-slate-700/50 rounded animate-pulse w-1/2" />
            </div>
          ) : error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : (
            <p className={cn('text-sm leading-relaxed', colors.text)}>
              {coachMessage?.message}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
        <span className="text-xs text-slate-500">
          {coachMessage?.timestamp && `Updated ${formatTime(coachMessage.timestamp)}`}
        </span>
        {showRefresh && (
          <button
            onClick={generateMessage}
            disabled={isLoading}
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg',
              'bg-white/5 hover:bg-white/10 transition-colors',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
          >
            <RefreshCw className={cn('h-3 w-3', isLoading && 'animate-spin')} />
            New insight
          </button>
        )}
      </div>
    </div>
  );
}

// Fallback messages when AI is unavailable
function getFallbackMessage(context: {
  userName: string;
  currentStreak: number;
  todayCompleted: number;
  todayTotal: number;
  recentTrend: 'improving' | 'stable' | 'declining';
  timeOfDay: string;
}): { message: string; type: MessageType } {
  const { userName, currentStreak, todayCompleted, todayTotal, recentTrend, timeOfDay } = context;
  
  // Celebration for completing all habits
  if (todayCompleted >= todayTotal && todayTotal > 0) {
    return {
      message: `Amazing work, ${userName}! You've completed all your habits today. That's ${currentStreak > 1 ? `${currentStreak} days in a row` : 'a great start'}!`,
      type: 'celebration',
    };
  }

  // Warning for declining trend
  if (recentTrend === 'declining') {
    return {
      message: `Hey ${userName}, I noticed things have been a bit tough lately. Remember, every small step counts. What's one habit you can focus on right now?`,
      type: 'warning',
    };
  }

  // Morning motivation
  if (timeOfDay === 'morning') {
    return {
      message: `Good morning, ${userName}! You have ${todayTotal} habits waiting for you today. Start with the easiest one to build momentum.`,
      type: 'motivation',
    };
  }

  // Evening encouragement
  if (timeOfDay === 'evening' || timeOfDay === 'night') {
    const remaining = todayTotal - todayCompleted;
    if (remaining > 0) {
      return {
        message: `${remaining} habit${remaining > 1 ? 's' : ''} left for today, ${userName}. You've got this! A strong finish keeps your streak alive.`,
        type: 'tip',
      };
    }
  }

  // General motivation
  return {
    message: `Keep going, ${userName}! Each habit you complete is a vote for the person you want to become.`,
    type: 'motivation',
  };
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleDateString();
}

export default AICoach;
