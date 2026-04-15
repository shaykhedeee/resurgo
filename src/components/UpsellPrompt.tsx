'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Reusable Upsell Prompt Component
// Displays contextual upgrade prompts based on trigger conditions
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, Crown, Zap, Lock } from 'lucide-react';
import { analytics } from '@/lib/analytics';

export type UpsellTrigger =
  | 'goal_limit'
  | 'ai_message_limit'
  | 'coach_locked'
  | 'streak_milestone'
  | 'feature_locked'
  | 'usage_milestone';

interface UpsellPromptProps {
  trigger: UpsellTrigger;
  variant?: 'modal' | 'banner' | 'inline' | 'toast';
  /** Coach name if trigger is coach_locked */
  coachName?: string;
  /** Custom headline override */
  headline?: string;
  /** Custom description override */
  description?: string;
  /** Whether to show the dismiss button */
  dismissable?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  className?: string;
}

const TRIGGER_CONFIG: Record<UpsellTrigger, { icon: typeof Sparkles; headline: string; description: string; cta: string }> = {
  goal_limit: {
    icon: Zap,
    headline: 'You have outgrown the free goal limit',
    description: 'You already filled all 3 free goals. Pro removes the ceiling and unlocks all 5 AI coaches so your system can keep expanding.',
    cta: 'Upgrade to Pro — $4.99/mo',
  },
  ai_message_limit: {
    icon: Sparkles,
    headline: 'You have used all 10 AI messages today',
    description: 'You hit the free daily cap while you were still in motion. Pro keeps the conversation going with unlimited coaching messages.',
    cta: 'Keep the conversation going',
  },
  coach_locked: {
    icon: Lock,
    headline: 'This coach is part of Pro',
    description: 'Upgrade to access all 5 AI coaches — Marcus, Titan, Aurora, Phoenix, and Nexus — whenever the situation changes.',
    cta: 'Unlock all 5 coaches',
  },
  streak_milestone: {
    icon: Crown,
    headline: 'You\'re serious about this',
    description: 'You built a 7-day streak. Pro helps protect that momentum with deeper coaching, more flexibility, and zero daily message limits.',
    cta: 'Claim Lifetime — $49.99',
  },
  feature_locked: {
    icon: Lock,
    headline: 'This feature requires Pro',
    description: 'Upgrade to unlock advanced analytics, weekly AI reviews, and proactive coaching.',
    cta: 'Upgrade to Pro',
  },
  usage_milestone: {
    icon: Crown,
    headline: 'You are using Resurgo like an operator',
    description: 'A month of consistent use is a strong signal. Pro removes the limits you have already proven you can use.',
    cta: 'Remove the limits',
  },
};

export function UpsellPrompt({
  trigger,
  variant = 'inline',
  coachName,
  headline,
  description,
  dismissable = true,
  onDismiss,
  className = '',
}: UpsellPromptProps) {
  const [dismissed, setDismissed] = useState(false);
  const config = TRIGGER_CONFIG[trigger];
  const Icon = config.icon;

  const displayHeadline = headline ?? (coachName ? `${coachName} is Pro-only` : config.headline);
  const displayDescription = description ?? config.description;

  useEffect(() => {
    analytics.upgradePromptShown(trigger);
  }, [trigger]);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  // ─── BANNER VARIANT ─────────────────────────────────────────────────────
  if (variant === 'banner') {
    return (
      <div className={`relative border-2 border-orange-900/60 bg-gradient-to-r from-orange-950/30 via-black to-orange-950/30 px-4 py-3 ${className}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center border border-orange-800 bg-orange-950/60">
              <Icon className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="font-pixel text-[0.45rem] tracking-widest text-orange-400">{displayHeadline.toUpperCase()}</p>
              <p className="font-terminal text-sm text-zinc-400">{displayDescription}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/billing"
              onClick={() => analytics.upgradePromptClicked(trigger)}
              className="shrink-0 border-2 border-orange-600 bg-orange-600 px-4 py-1.5 font-pixel text-[0.4rem] tracking-widest text-black transition hover:bg-orange-500"
            >
              {config.cta.toUpperCase()}
            </Link>
            {dismissable && (
              <button onClick={handleDismiss} className="p-1 text-zinc-600 hover:text-zinc-400 transition-colors" aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── MODAL VARIANT ──────────────────────────────────────────────────────
  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={dismissable ? handleDismiss : undefined} />
        <div className={`relative w-full max-w-md border-2 border-orange-900/60 bg-zinc-950 p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.7)] ${className}`}>
          {dismissable && (
            <button onClick={handleDismiss} className="absolute right-3 top-3 p-1 text-zinc-600 hover:text-zinc-400" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          )}
          <div className="flex h-12 w-12 items-center justify-center border-2 border-orange-800 bg-orange-950/40 mb-4">
            <Icon className="h-6 w-6 text-orange-500" />
          </div>
          <h3 className="font-pixel text-[0.6rem] tracking-widest text-orange-400 mb-2">{displayHeadline.toUpperCase()}</h3>
          <p className="font-terminal text-base text-zinc-300 mb-6">{displayDescription}</p>
          <div className="flex flex-col gap-2">
            <Link
              href="/billing"
              onClick={() => analytics.upgradePromptClicked(trigger)}
              className="block w-full border-2 border-orange-600 bg-orange-600 px-4 py-2.5 text-center font-pixel text-[0.45rem] tracking-widest text-black transition hover:bg-orange-500"
            >
              {config.cta.toUpperCase()}
            </Link>
            {dismissable && (
              <button
                onClick={handleDismiss}
                className="w-full px-4 py-2 font-terminal text-sm text-zinc-500 transition hover:text-zinc-300"
              >
                Maybe later
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── TOAST VARIANT ──────────────────────────────────────────────────────
  if (variant === 'toast') {
    return (
      <div className={`border border-orange-900/50 bg-zinc-950 px-4 py-3 shadow-lg ${className}`}>
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 shrink-0 text-orange-500 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-terminal text-sm font-medium text-zinc-200">{displayHeadline}</p>
            <p className="font-terminal text-xs text-zinc-400 mt-0.5">{displayDescription}</p>
            <Link href="/billing" onClick={() => analytics.upgradePromptClicked(trigger)} className="inline-block mt-2 font-pixel text-[0.4rem] tracking-widest text-orange-400 hover:text-orange-300 transition-colors">
              {config.cta.toUpperCase()} →
            </Link>
          </div>
          {dismissable && (
            <button onClick={handleDismiss} className="p-0.5 text-zinc-600 hover:text-zinc-400" aria-label="Dismiss">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── INLINE VARIANT (default) ───────────────────────────────────────────
  return (
    <div className={`border-2 border-orange-900/40 bg-orange-950/10 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-orange-800 bg-orange-950/40">
          <Icon className="h-5 w-5 text-orange-500" />
        </div>
        <div className="flex-1">
          <h4 className="font-pixel text-[0.5rem] tracking-widest text-orange-400">{displayHeadline.toUpperCase()}</h4>
          <p className="mt-1 font-terminal text-sm text-zinc-400">{displayDescription}</p>
          <Link
            href="/billing"
            onClick={() => analytics.upgradePromptClicked(trigger)}
            className="mt-3 inline-block border border-orange-600 bg-orange-600 px-4 py-1.5 font-pixel text-[0.4rem] tracking-widest text-black transition hover:bg-orange-500"
          >
            {config.cta.toUpperCase()}
          </Link>
        </div>
        {dismissable && (
          <button onClick={handleDismiss} className="p-0.5 text-zinc-600 hover:text-zinc-400 transition-colors" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default UpsellPrompt;
