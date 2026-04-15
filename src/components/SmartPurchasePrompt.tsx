// ═══════════════════════════════════════════════════════════════════════════════
// RESURGOIFY - Smart Purchase Prompt Component
// Non-intrusive upgrade prompts that appear at strategic moments
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { 
  Crown, 
  X, 
  Sparkles, 
  Zap, 
  Brain, 
  Download,
  TrendingUp,
  Star,
  Gift,
  ArrowRight
} from 'lucide-react';

type PromptTrigger = 
  | 'streak_milestone'    // 7, 14, 21, 30 day streaks
  | 'level_up'           // After leveling up
  | 'habit_limit'        // When hitting free tier limit
  | 'goal_limit'         // When trying to create second goal on free
  | 'ai_feature'         // When trying to use AI feature
  | 'export_feature'     // When trying to export
  | 'usage_milestone'    // After N completions
  | 'gentle_reminder';   // Periodic soft reminder

interface SmartPurchasePromptProps {
  trigger: PromptTrigger;
  onClose: () => void;
  onUpgrade: () => void;
  customMessage?: string;
}

const PROMPT_CONTENT: Record<PromptTrigger, {
  icon: typeof Crown;
  title: string;
  message: string;
  highlight: string;
  cta: string;
  gradient: string;
}> = {
  streak_milestone: {
    icon: Zap,
    title: "You are building momentum",
    message: "Amazing streak! With Pro, you get Streak Freeze to protect your hard-earned progress.",
    highlight: "Never lose a streak again",
    cta: "Protect My Streaks",
    gradient: "from-orange-500 to-red-500"
  },
  level_up: {
    icon: Star,
    title: 'Congratulations',
    message: "You just leveled up! Pro members unlock exclusive achievements and badges.",
    highlight: "50+ exclusive achievements",
    cta: "Unlock All Rewards",
    gradient: "from-purple-500 to-pink-500"
  },
  habit_limit: {
    icon: TrendingUp,
    title: 'Ready to Grow',
    message: "You've reached the free limit of 5 habits per day. Upgrade to remove limits and scale faster.",
    highlight: "Unlimited habits, goals, and AI messages",
    cta: "Remove Limits",
    gradient: "from-ascend-500 to-emerald-500"
  },
  goal_limit: {
    icon: Brain,
    title: 'Dream Bigger',
    message: "Free users can have 3 active goals. Upgrade to pursue all your ambitions simultaneously.",
    highlight: "Unlimited AI-powered goals",
    cta: "Unlock All Goals",
    gradient: "from-blue-500 to-purple-500"
  },
  ai_feature: {
    icon: Brain,
    title: 'AI Power Awaits',
    message: "AI goal decomposition breaks down your dreams into daily actions. Upgrade to unlock this game-changer.",
    highlight: "Personal AI life coach",
    cta: "Activate AI Coach",
    gradient: "from-violet-500 to-purple-500"
  },
  export_feature: {
    icon: Download,
    title: 'Keep Your Data',
    message: "Pro members can export their data as JSON or PDF. Your progress, your data, your backup.",
    highlight: "Full data ownership",
    cta: "Enable Export",
    gradient: "from-teal-500 to-cyan-500"
  },
  usage_milestone: {
    icon: Gift,
    title: 'You are making strong progress',
    message: "You've completed over 100 tasks! Pro users get detailed analytics to understand their patterns.",
    highlight: "Deep insights & analytics",
    cta: "Unlock Insights",
    gradient: "from-amber-500 to-orange-500"
  },
  gentle_reminder: {
    icon: Sparkles,
    title: "Enjoying RESURGO?",
    message: "Upgrade to Pro for the full transformation experience. Support the app and unlock everything.",
    highlight: 'Pro starts at $4.99/month',
    cta: "See Pro Features",
    gradient: "from-ascend-500 to-gold-400"
  }
};

export function SmartPurchasePrompt({ 
  trigger, 
  onClose, 
  onUpgrade,
  customMessage 
}: SmartPurchasePromptProps) {
  const { user } = useAscendStore();
  const [dismissed, setDismissed] = useState(false);
  
  // Don't show if user is already Pro
  if (user.plan !== 'free' || dismissed) return null;

  const content = PROMPT_CONTENT[trigger];
  const Icon = content.icon;

  const handleDismiss = () => {
    setDismissed(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleDismiss}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-[var(--surface)] rounded-2xl 
                    border border-[var(--border)] shadow-2xl overflow-hidden animate-scale-in">
        {/* Gradient Header */}
        <div className={cn(
          "relative px-6 pt-8 pb-6 bg-gradient-to-br",
          content.gradient
        )}>
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 
                     transition-colors text-white"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm 
                        flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-2">
            {content.title}
          </h2>
          <p className="text-white/80 text-center text-sm">
            {customMessage || content.message}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Highlight Feature */}
          <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
                        bg-gradient-to-r from-gold-400/10 to-ascend-500/10 
                        border border-gold-400/20 mb-6">
            <Crown className="w-5 h-5 text-gold-400" />
            <span className="font-semibold text-themed">{content.highlight}</span>
          </div>

          {/* Quick Benefits */}
          <div className="space-y-3 mb-6">
            {[
              'Unlimited habits, goals, and AI messages',
              'All 5 AI coaches',
              'Advanced analytics and weekly reviews',
              'Priority support'
            ].slice(0, 3).map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-ascend-500/20 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-ascend-500" />
                </div>
                <span className="text-themed-secondary">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                onUpgrade();
                handleDismiss();
              }}
              className="w-full py-4 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-ascend-500 to-gold-400
                       hover:from-ascend-400 hover:to-gold-300
                       shadow-lg shadow-ascend-500/25 transition-all
                       flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              {content.cta}
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDismiss}
              className="w-full py-3 rounded-xl font-medium text-themed-secondary
                       hover:text-themed hover:bg-[var(--surface-hover)] transition-colors"
            >
              Maybe Later
            </button>
          </div>

          {/* Trust Badge */}
          <p className="text-center text-xs text-themed-muted mt-4">
            Cancel anytime • No questions asked • 14-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Inline Upgrade Nudge (Non-blocking)
// ─────────────────────────────────────────────────────────────────────────────────

interface UpgradeNudgeProps {
  variant?: 'default' | 'minimal' | 'banner';
  feature?: string;
  onUpgrade: () => void;
}

export function UpgradeNudge({ variant = 'default', feature, onUpgrade }: UpgradeNudgeProps) {
  const { user } = useAscendStore();
  const [dismissed, setDismissed] = useState(false);
  
  if (user.plan !== 'free' || dismissed) return null;

  if (variant === 'minimal') {
    return (
      <button
        onClick={onUpgrade}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                 bg-gradient-to-r from-gold-400/10 to-gold-400/5 border border-gold-400/20
                 text-gold-400 hover:bg-gold-400/20 transition-all"
      >
        <Crown className="w-3.5 h-3.5" />
        <span>Upgrade</span>
      </button>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="relative bg-gradient-to-r from-ascend-500/10 via-gold-400/10 to-ascend-500/10 
                    border border-ascend-500/20 rounded-xl p-4 mb-4">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4 text-themed-muted" />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ascend-500 to-gold-400 
                        flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-themed text-sm">
              {feature ? `Unlock ${feature}` : 'Upgrade to Pro'}
            </p>
            <p className="text-xs text-themed-secondary truncate">
              Get unlimited features and transform faster
            </p>
          </div>
          <button
            onClick={onUpgrade}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white
                     bg-gradient-to-r from-ascend-500 to-gold-400 
                     hover:from-ascend-400 hover:to-gold-300 transition-all shrink-0"
          >
            Upgrade
          </button>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="glass-card p-4 border-gold-400/20">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400/20 to-ascend-500/20 
                      flex items-center justify-center shrink-0">
          <Crown className="w-5 h-5 text-gold-400" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-themed text-sm mb-1">
            Unlock the Full Experience
          </p>
          <p className="text-xs text-themed-muted mb-3">
            Upgrade to Pro for unlimited habits, AI coaching, and more.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onUpgrade}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white
                       bg-gradient-to-r from-ascend-500 to-gold-400 
                       hover:from-ascend-400 hover:to-gold-300 transition-all"
            >
              See Pro Features
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-themed-muted
                       hover:text-themed hover:bg-[var(--surface-hover)] transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
