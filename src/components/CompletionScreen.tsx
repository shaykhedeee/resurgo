'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — CompletionScreen
// Staggered checklist animation for onboarding completion
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  Circle,
  Target,
  Flame,
  Brain,
  Zap,
  Heart,
  Star,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface Checkpoint {
  id: string;
  label: string;
  icon: React.ReactNode;
  completed: boolean;
  detail?: string;
}

interface CompletionScreenProps {
  checkpoints: Checkpoint[];
  title?: string;
  subtitle?: string;
  onReset?: () => void;
  animate?: boolean;
}

export function CompletionScreen({
  checkpoints,
  title = 'SETUP COMPLETE',
  subtitle = 'Your system is calibrated and ready.',
  onReset,
  animate = true,
}: CompletionScreenProps) {
  const [visibleItems, setVisibleItems] = useState<number>(0);

  useEffect(() => {
    if (!animate) {
      setVisibleItems(checkpoints.length);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      setVisibleItems((prev) => {
        const next = prev + 1;
        if (next >= checkpoints.length) {
          clearInterval(interval);
          return checkpoints.length;
        }
        return next;
      });
      index++;
    }, 300);

    return () => clearInterval(interval);
  }, [checkpoints.length, animate]);

  const completedCount = checkpoints.filter((c) => c.completed).length;
  const progress = checkpoints.length > 0 ? Math.round((completedCount / checkpoints.length) * 100) : 0;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 border border-orange-900 bg-orange-950/20 px-4 py-2 mb-4">
          <span className="h-2 w-2 bg-green-500 animate-pulse rounded-full" />
          <span className="font-pixel text-[0.55rem] tracking-widest text-green-500">
            SYSTEM STATUS: ONLINE
          </span>
        </div>
        <h2 className="font-pixel text-xl font-bold tracking-tight text-zinc-100">{title}</h2>
        <p className="font-terminal text-sm text-zinc-400 mt-1">{subtitle}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-pixel text-[0.55rem] tracking-widest text-zinc-500">
            PROGRESS
          </span>
          <span className="font-pixel text-[0.55rem] tracking-widest text-orange-500">
            {progress}%
          </span>
        </div>
        <div className="h-2 bg-zinc-900 overflow-hidden">
          <div
            className="h-full bg-orange-600 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checkpoint List */}
      <div className="space-y-2">
        {checkpoints.map((checkpoint, index) => {
          const isVisible = index < visibleItems;
          const Icon = checkpoint.completed ? CheckCircle2 : Circle;

          return (
            <div
              key={checkpoint.id}
              className={cn(
                'flex items-start gap-3 border border-zinc-800 bg-zinc-950 p-3 transition-all duration-300',
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4',
                checkpoint.completed
                  ? 'border-orange-900/50 bg-orange-950/10'
                  : 'border-zinc-800',
                'hover:border-zinc-700'
              )}
              style={{
                transitionDelay: animate ? `${index * 100}ms` : '0ms',
              }}
            >
              <div className="shrink-0 mt-0.5">
                <Icon
                  className={cn(
                    'h-4 w-4',
                    checkpoint.completed ? 'text-orange-500' : 'text-zinc-600'
                  )}
                />
              </div>
              <div className="flex-1">
                <p
                  className={cn(
                    'font-terminal text-sm transition-colors',
                    checkpoint.completed ? 'text-zinc-200' : 'text-zinc-500'
                  )}
                >
                  {checkpoint.label}
                </p>
                {checkpoint.detail && (
                  <p className="font-pixel text-[0.5rem] text-zinc-600 mt-0.5">
                    {checkpoint.detail}
                  </p>
                )}
              </div>
              {checkpoint.icon && (
                <span className="shrink-0 text-zinc-600">{checkpoint.icon}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Reset / Reconfigure */}
      {onReset && (
        <div className="mt-6 text-center">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 border border-zinc-800 px-4 py-2 font-pixel text-[0.6rem] tracking-widest text-zinc-400 hover:border-zinc-600 hover:text-zinc-300 transition"
          >
            <RefreshCw className="h-3 w-3" />
            Reconfigure
          </button>
        </div>
      )}

      {/* Action prompt */}
      <div className="mt-6 text-center">
        <p className="font-terminal text-sm text-zinc-500 flex items-center justify-center gap-2">
          <ArrowRight className="h-4 w-4 text-orange-500" />
          Ready to begin? Head to your dashboard.
        </p>
      </div>
    </div>
  );
}
