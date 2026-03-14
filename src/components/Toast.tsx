// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Toast Notification System
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Info, 
  Zap,
  Trophy,
  Flame,
  Star,
  X
} from 'lucide-react';

const TOAST_ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const TOAST_COLORS = {
  success: 'bg-green-500/20 border-green-500/30 text-green-400',
  error: 'bg-red-500/20 border-red-500/30 text-red-400',
  warning: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
  info: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
};

export function Toast() {
  const { toasts, dismissToast } = useAscendStore();
  
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info' | 'achievement' | 'level_up';
    title: string;
    message?: string;
    xpGained?: number;
    duration?: number;
  };
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const toastType = (toast.type === 'achievement' || toast.type === 'level_up') ? 'success' : toast.type;
  const Icon = TOAST_ICONS[toastType];
  const duration = toast.duration || 4000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onDismiss, 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(onDismiss, 200);
  };

  return (
    <div
      className={cn(
        "relative px-4 py-3 rounded-xl border backdrop-blur-xl",
        "animate-slide-up transition-all duration-200",
        TOAST_COLORS[toastType],
        isExiting && "opacity-0 translate-x-4"
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{toast.title}</p>
          {toast.message && (
            <p className="text-xs opacity-80 mt-0.5">{toast.message}</p>
          )}
          {toast.xpGained && toast.xpGained > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <Zap className="w-3 h-3 text-gold-400" />
              <span className="text-xs font-bold text-gold-400">+{toast.xpGained} XP</span>
            </div>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 opacity-50 hover:opacity-100" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 rounded-b-xl overflow-hidden">
        <div
          className="h-full bg-current opacity-50"
          style={{ 
            animation: `shrink ${duration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// XP Gain Popup (Floating)
// ═══════════════════════════════════════════════════════════════════════════════

interface XPPopupProps {
  amount: number;
  x: number;
  y: number;
  onComplete: () => void;
}

export function XPPopup({ amount, x, y, onComplete }: XPPopupProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed z-50 pointer-events-none animate-float-up"
      style={{ left: x, top: y }}
    >
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full 
                    bg-gold-400/20 border border-gold-400/30 backdrop-blur-sm">
        <Zap className="w-4 h-4 text-gold-400" />
        <span className="text-sm font-bold text-gold-400">+{amount} XP</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Level Up Celebration Modal
// ═══════════════════════════════════════════════════════════════════════════════

interface LevelUpModalProps {
  level: number;
  levelName: string;
  onClose: () => void;
}

export function LevelUpModal({ level, levelName, onClose }: LevelUpModalProps) {
  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative animate-bounce-in">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 blur-xl opacity-30" />
        
        <div className="relative border-2 border-yellow-700 bg-zinc-950 p-8 text-center max-w-sm">
          {/* Stars decoration */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2">
            <Star className="w-6 h-6 text-yellow-400 animate-pulse" fill="currentColor" />
            <Star className="w-8 h-8 text-yellow-400 animate-pulse" fill="currentColor" />
            <Star className="w-6 h-6 text-yellow-400 animate-pulse" fill="currentColor" />
          </div>

          {/* Level badge */}
          <div className="w-24 h-24 mx-auto mb-4 border-2 border-yellow-600
                        bg-gradient-to-br from-yellow-700 to-orange-600
                        flex items-center justify-center">
            <span className="font-pixel text-3xl text-white">{level}</span>
          </div>

          <h2 className="font-pixel text-lg tracking-widest text-yellow-400 mb-2">LEVEL UP!</h2>
          <p className="font-terminal text-xl font-semibold text-zinc-100 mb-1">{levelName}</p>
          <p className="font-terminal text-sm text-zinc-400 mb-6">
            Keep pushing forward. You&apos;re making incredible progress!
          </p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 border border-zinc-800 bg-zinc-900">
              <Trophy className="w-5 h-5 text-orange-400" />
              <span className="font-terminal text-sm text-zinc-300">New rewards unlocked</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full border border-orange-600 bg-orange-900/30 px-4 py-2.5 font-pixel text-[0.6rem] tracking-widest text-orange-300 transition hover:bg-orange-900/50"
          >
            CONTINUE_RISING
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Streak Celebration
// ═══════════════════════════════════════════════════════════════════════════════

interface StreakCelebrationProps {
  streak: number;
  onClose: () => void;
}

export function StreakCelebration({ streak, onClose }: StreakCelebrationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isMilestone = [7, 14, 21, 30, 60, 90, 100, 180, 365].includes(streak);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
      <div className={cn(
        "px-6 py-4 rounded-2xl flex items-center gap-4",
        isMilestone 
          ? "bg-gradient-to-r from-orange-500 to-red-500 shadow-glow-md" 
          : "glass-card"
      )}>
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          isMilestone ? "bg-white/20" : "bg-orange-500/20"
        )}>
          <Flame className={cn(
            "w-6 h-6",
            isMilestone ? "text-white" : "text-orange-400"
          )} />
        </div>
        <div>
          <p className={cn(
            "text-lg font-bold",
            isMilestone ? "text-white" : "text-white"
          )}>
            {streak} Day Streak
          </p>
          <p className={cn(
            "text-sm",
            isMilestone ? "text-white/80" : "text-white/60"
          )}>
            {isMilestone ? "Incredible milestone!" : "Keep the momentum going!"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Achievement Unlocked Popup
// ═══════════════════════════════════════════════════════════════════════════════

interface AchievementPopupProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    xpReward: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
  onClose: () => void;
}

const RARITY_STYLES = {
  common: 'from-slate-400 to-slate-500',
  rare: 'from-blue-400 to-blue-500',
  epic: 'from-purple-400 to-purple-500',
  legendary: 'from-gold-400 to-orange-500',
};

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className="glass-card px-6 py-4 flex items-center gap-4 max-w-md">
        <div className={cn(
          "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl",
          RARITY_STYLES[achievement.rarity]
        )}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-semibold text-gold-400 uppercase">
              Achievement Unlocked
            </span>
          </div>
          <p className="text-white font-bold">{achievement.name}</p>
          <p className="text-white/60 text-sm">{achievement.description}</p>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gold-400/20">
          <Zap className="w-4 h-4 text-gold-400" />
          <span className="text-sm font-bold text-gold-400">+{achievement.xpReward}</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Confetti Burst - Lightweight CSS-only confetti
// ═══════════════════════════════════════════════════════════════════════════════

interface ConfettiBurstProps {
  duration?: number;
  onComplete?: () => void;
}

export function ConfettiBurst({ duration = 2500, onComplete }: ConfettiBurstProps) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const colors = ['#F97316', '#FBBF24', '#22C55E', '#3B82F6', '#A855F7', '#EF4444'];
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1.5,
  }));

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${p.x}%`,
            top: '-5%',
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Goal Completion Celebration - Full-screen celebration for completing a goal
// ═══════════════════════════════════════════════════════════════════════════════

interface GoalCelebrationProps {
  goalTitle: string;
  onClose: () => void;
}

export function GoalCelebration({ goalTitle, onClose }: GoalCelebrationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <>
      <ConfettiBurst duration={4000} />
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="alert">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative animate-bounce-in text-center max-w-sm">
          <div className="glass-card p-8 rounded-3xl border border-gold-400/30">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-orange-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Goal Achieved!</h2>
            <p className="text-lg text-gold-400 font-semibold mb-1">{goalTitle}</p>
            <p className="text-sm text-white/60">
              You did it! This is a moment to celebrate.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Continue Rising
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
