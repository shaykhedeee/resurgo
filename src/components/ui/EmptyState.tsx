// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Empty State Components
// Beautiful empty state illustrations and messaging
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { 
  Target, 
  Sparkles, 
  Calendar, 
  Trophy, 
  ListTodo, 
  Mountain,
  Plus,
  Heart,
  BarChart3,
} from 'lucide-react';
import { Button } from './Button';

// ─────────────────────────────────────────────────────────────────────────────────
// Empty State Types
// ─────────────────────────────────────────────────────────────────────────────────

type EmptyStateType = 
  | 'habits' 
  | 'goals' 
  | 'tasks' 
  | 'calendar' 
  | 'achievements' 
  | 'analytics'
  | 'search'
  | 'generic';

interface EmptyStateConfig {
  icon: typeof Target;
  iconColor: string;
  bgGradient: string;
  title: string;
  description: string;
  actionLabel?: string;
}

const emptyStateConfigs: Record<EmptyStateType, EmptyStateConfig> = {
  habits: {
    icon: Target,
    iconColor: 'text-ascend-400',
    bgGradient: 'from-ascend-500/20 to-gold-400/10',
    title: 'No habits yet',
    description: 'Start building better routines. Add your first habit and watch your progress grow.',
    actionLabel: 'Add Your First Habit',
  },
  goals: {
    icon: Mountain,
    iconColor: 'text-gold-400',
    bgGradient: 'from-gold-400/20 to-ascend-500/10',
    title: 'No goals set',
    description: 'Set an ultimate goal and let AI break it down into achievable milestones.',
    actionLabel: 'Set Your First Goal',
  },
  tasks: {
    icon: ListTodo,
    iconColor: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-purple-500/10',
    title: "All caught up!",
    description: "You've completed all your tasks. Great job! Add more to keep the momentum.",
    actionLabel: 'Add New Task',
  },
  calendar: {
    icon: Calendar,
    iconColor: 'text-purple-400',
    bgGradient: 'from-purple-500/20 to-pink-500/10',
    title: 'No activity this month',
    description: 'Start tracking your habits to see your progress on the calendar.',
    actionLabel: 'Track Today',
  },
  achievements: {
    icon: Trophy,
    iconColor: 'text-gold-400',
    bgGradient: 'from-gold-400/20 to-orange-500/10',
    title: 'No achievements yet',
    description: 'Complete habits and reach milestones to unlock achievements and earn XP.',
    actionLabel: 'View Available Achievements',
  },
  analytics: {
    icon: BarChart3,
    iconColor: 'text-green-400',
    bgGradient: 'from-green-500/20 to-teal-500/10',
    title: 'Not enough data',
    description: 'Track habits for a few days to see your analytics and patterns.',
    actionLabel: 'Start Tracking',
  },
  search: {
    icon: Sparkles,
    iconColor: 'text-ascend-400',
    bgGradient: 'from-ascend-500/10 to-transparent',
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for.',
  },
  generic: {
    icon: Sparkles,
    iconColor: 'text-white/60',
    bgGradient: 'from-white/10 to-transparent',
    title: 'Nothing here yet',
    description: 'This area is waiting for content. Start adding items to see them here.',
  },
};

// ─────────────────────────────────────────────────────────────────────────────────
// Empty State Component
// ─────────────────────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  icon?: typeof Target;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
  className?: string;
  children?: ReactNode;
}

export function EmptyState({
  type = 'generic',
  title,
  description,
  icon: CustomIcon,
  actionLabel,
  onAction,
  compact = false,
  className,
  children,
}: EmptyStateProps) {
  const config = emptyStateConfigs[type];
  const Icon = CustomIcon || config.icon;
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const displayActionLabel = actionLabel || config.actionLabel;

  if (compact) {
    return (
      <div className={cn('text-center py-8 px-4', className)}>
        <div className={cn(
          'w-12 h-12 rounded-xl mx-auto mb-3',
          'bg-gradient-to-br',
          config.bgGradient,
          'flex items-center justify-center'
        )}>
          <Icon className={cn('w-6 h-6', config.iconColor)} />
        </div>
        <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
          {displayTitle}
        </p>
        <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
          {displayDescription}
        </p>
        {displayActionLabel && onAction && (
          <button
            onClick={onAction}
            className="mt-3 text-xs text-ascend-400 hover:text-ascend-300 font-medium"
          >
            {displayActionLabel}
          </button>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      'py-16 px-6',
      className
    )}>
      {/* Decorative Background */}
      <div className="relative mb-6">
        <div className={cn(
          'absolute inset-0 blur-3xl opacity-50',
          'bg-gradient-to-br',
          config.bgGradient,
          'rounded-full scale-150'
        )} />
        <div className={cn(
          'relative w-20 h-20 rounded-2xl',
          'bg-gradient-to-br',
          config.bgGradient,
          'flex items-center justify-center',
          'border border-white/10'
        )}>
          <Icon className={cn('w-10 h-10', config.iconColor)} />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
        {displayTitle}
      </h3>
      <p className="text-[var(--text-muted)] max-w-sm mb-6 leading-relaxed">
        {displayDescription}
      </p>

      {/* Action */}
      {displayActionLabel && onAction && (
        <Button
          variant="primary"
          size="md"
          onClick={onAction}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {displayActionLabel}
        </Button>
      )}

      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Specialized Empty States
// ─────────────────────────────────────────────────────────────────────────────────

interface SpecializedEmptyStateProps {
  onAction?: () => void;
  className?: string;
}

export function EmptyHabits({ onAction, className }: SpecializedEmptyStateProps) {
  return (
    <EmptyState
      type="habits"
      onAction={onAction}
      className={className}
    >
      {/* Quick suggestion pills */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {['Morning Routine', 'Exercise', 'Reading', 'Meditation'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={onAction}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium',
              'bg-[var(--surface)] border border-[var(--border)]',
              'hover:border-ascend-500/50 hover:bg-ascend-500/10',
              'transition-colors'
            )}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </EmptyState>
  );
}

export function EmptyGoals({ onAction, className }: SpecializedEmptyStateProps) {
  return (
    <EmptyState
      type="goals"
      onAction={onAction}
      className={className}
    >
      {/* AI Highlight */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-ascend-500/10 border border-purple-500/20 max-w-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-400">AI-Powered</span>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Our AI will automatically break down your goal into milestones and daily tasks.
        </p>
      </div>
    </EmptyState>
  );
}

export function EmptyTasks({ onAction, className }: SpecializedEmptyStateProps) {
  return (
    <EmptyState
      type="tasks"
      onAction={onAction}
      className={className}
    >
      {/* Celebration element */}
      <div className="mt-6 flex items-center gap-2 text-green-400">
        <Heart className="w-5 h-5 fill-current" />
        <span className="text-sm font-medium">You&apos;re doing great!</span>
      </div>
    </EmptyState>
  );
}

export function EmptySearch({ query, className }: { query?: string; className?: string }) {
  return (
    <EmptyState
      type="search"
      title={query ? `No results for "${query}"` : 'No results found'}
      description="Try different keywords or check your spelling."
      className={className}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Empty State with Illustration
// ─────────────────────────────────────────────────────────────────────────────────

interface IllustratedEmptyStateProps {
  illustration: 'rocket' | 'target' | 'mountain' | 'trophy';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const illustrations: Record<string, ReactNode> = {
  rocket: (
    <svg viewBox="0 0 120 120" fill="none" className="w-32 h-32">
      <circle cx="60" cy="60" r="50" fill="url(#rocketGradient)" opacity="0.2" />
      <path d="M60 25L70 50L60 45L50 50L60 25Z" fill="#F97316" />
      <rect x="50" y="45" width="20" height="35" rx="4" fill="#FB923C" />
      <rect x="55" y="52" width="10" height="8" rx="2" fill="white" opacity="0.8" />
      <path d="M45 80L50 75V80L45 85V80Z" fill="#EA580C" />
      <path d="M75 80L70 75V80L75 85V80Z" fill="#EA580C" />
      <path d="M55 80H65V95L60 100L55 95V80Z" fill="#FBBF24" />
      <defs>
        <radialGradient id="rocketGradient">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  ),
  target: (
    <svg viewBox="0 0 120 120" fill="none" className="w-32 h-32">
      <circle cx="60" cy="60" r="50" fill="url(#targetGradient)" opacity="0.2" />
      <circle cx="60" cy="60" r="35" stroke="#F97316" strokeWidth="3" />
      <circle cx="60" cy="60" r="25" stroke="#FB923C" strokeWidth="3" />
      <circle cx="60" cy="60" r="15" stroke="#FDBA74" strokeWidth="3" />
      <circle cx="60" cy="60" r="5" fill="#FBBF24" />
      <path d="M95 25L65 55" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
      <path d="M85 25H95V35" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <radialGradient id="targetGradient">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  ),
  mountain: (
    <svg viewBox="0 0 120 120" fill="none" className="w-32 h-32">
      <circle cx="60" cy="60" r="50" fill="url(#mountainGradient)" opacity="0.2" />
      <path d="M20 90L50 40L65 60L80 45L100 90H20Z" fill="#44403C" />
      <path d="M50 40L42 55L50 50L58 55L50 40Z" fill="white" />
      <path d="M80 45L72 60L80 55L88 60L80 45Z" fill="white" />
      <circle cx="85" cy="30" r="8" fill="#FBBF24" />
      <path d="M60 70L65 60L75 75H55L60 70Z" fill="#F97316" />
      <defs>
        <radialGradient id="mountainGradient">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 120 120" fill="none" className="w-32 h-32">
      <circle cx="60" cy="60" r="50" fill="url(#trophyGradient)" opacity="0.2" />
      <path d="M40 35H80V55C80 66 71 75 60 75C49 75 40 66 40 55V35Z" fill="#FBBF24" />
      <path d="M35 35H40V50C35 50 30 45 30 40C30 37 32 35 35 35Z" fill="#F59E0B" />
      <path d="M85 35H80V50C85 50 90 45 90 40C90 37 88 35 85 35Z" fill="#F59E0B" />
      <rect x="55" y="75" width="10" height="10" fill="#D97706" />
      <rect x="45" y="85" width="30" height="8" rx="2" fill="#92400E" />
      <path d="M55 45L58 52H65L59 57L62 65L55 60L48 65L51 57L45 52H52L55 45Z" fill="white" />
      <defs>
        <radialGradient id="trophyGradient">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  ),
};

export function IllustratedEmptyState({
  illustration,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: IllustratedEmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      'py-12 px-6',
      className
    )}>
      <div className="mb-6 animate-float">
        {illustrations[illustration]}
      </div>
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--text-muted)] max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
