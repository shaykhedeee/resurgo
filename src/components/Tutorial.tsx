// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Tutorial/Walkthrough Component
// First-time user guidance with step-by-step feature introduction
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  X, 
  ArrowRight, 
  ArrowLeft,
  Target,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Sparkles,
  Flame,
  Zap,
  Trophy
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────────
// TUTORIAL STEPS
// ─────────────────────────────────────────────────────────────────────────────────

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Resurgo',
    description: 'Your AI-powered companion for achieving goals and building habits. Let us show you around!',
    icon: Sparkles,
    highlight: null,
    position: 'center' as const,
  },
  {
    id: 'goal',
    title: 'Your Ultimate Goal',
    description: 'This is your main objective. AI breaks it down into achievable milestones and daily tasks.',
    icon: Target,
    highlight: '[data-tutorial="goal-card"]',
    position: 'right' as const,
  },
  {
    id: 'tasks',
    title: 'Daily Tasks',
    description: 'Complete these tasks daily to make progress towards your goal. They\'re intelligently scheduled based on your available time.',
    icon: CheckCircle2,
    highlight: '[data-tutorial="tasks"]',
    position: 'right' as const,
  },
  {
    id: 'habits',
    title: 'Habit Tracker',
    description: 'Build supporting habits that help you reach your goal. Track streaks and stay consistent!',
    icon: Flame,
    highlight: '[data-tutorial="habits"]',
    position: 'left' as const,
  },
  {
    id: 'calendar',
    title: 'Calendar View',
    description: 'See your progress over time. Green days mean you completed your tasks!',
    icon: Calendar,
    highlight: '[data-tutorial="calendar"]',
    position: 'right' as const,
  },
  {
    id: 'progress',
    title: 'Analytics & Progress',
    description: 'Track your stats, see trends, and celebrate your achievements.',
    icon: TrendingUp,
    highlight: '[data-tutorial="progress"]',
    position: 'left' as const,
  },
  {
    id: 'xp',
    title: 'XP & Leveling',
    description: 'Earn XP for completing tasks and habits. Level up to unlock achievements!',
    icon: Zap,
    highlight: '[data-tutorial="xp"]',
    position: 'right' as const,
  },
  {
    id: 'complete',
    title: 'You\'re All Set',
    description: 'Start by completing today\'s tasks. Remember: small consistent steps lead to big achievements!',
    icon: Trophy,
    highlight: null,
    position: 'center' as const,
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

interface TutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function Tutorial({ onComplete, onSkip }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  
  const step = TUTORIAL_STEPS[currentStep];
  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;
  
  // Update highlight position when step changes
  useEffect(() => {
    if (step.highlight) {
      const element = document.querySelector(step.highlight);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightRect(rect);
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setHighlightRect(null);
      }
    } else {
      setHighlightRect(null);
    }
  }, [currentStep, step.highlight]);
  
  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleComplete = () => {
    setIsVisible(false);
    // Store that tutorial was completed
    localStorage.setItem('ascend-tutorial-completed', 'true');
    onComplete();
  };
  
  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem('ascend-tutorial-completed', 'true');
    onSkip();
  };
  
  if (!isVisible) return null;
  
  const Icon = step.icon;
  
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Backdrop with cutout for highlighted element */}
      <div 
        className="absolute inset-0 bg-black/70 pointer-events-auto"
        onClick={handleSkip}
      >
        {highlightRect && (
          <div
            className="absolute bg-transparent rounded-xl"
            style={{
              top: highlightRect.top - 8,
              left: highlightRect.left - 8,
              width: highlightRect.width + 16,
              height: highlightRect.height + 16,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
              border: '2px solid rgba(249, 115, 22, 0.5)',
              animation: 'pulse 2s infinite',
            }}
          />
        )}
      </div>
      
      {/* Tutorial Card */}
      <div 
        className={cn(
          "absolute pointer-events-auto",
          "bg-[var(--surface)] rounded-2xl shadow-2xl border border-[var(--border)]",
          "p-6 max-w-md w-[90%]",
          "transform transition-all duration-300",
          step.position === 'center' && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          step.position === 'right' && highlightRect && "top-1/2 -translate-y-1/2",
          step.position === 'left' && highlightRect && "top-1/2 -translate-y-1/2",
        )}
        style={
          highlightRect && step.position !== 'center'
            ? {
                left: step.position === 'right' 
                  ? Math.min(highlightRect.right + 24, window.innerWidth - 420)
                  : Math.max(highlightRect.left - 420, 20),
              }
            : {}
        }
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--surface-hover)] 
                   text-themed-muted hover:text-themed transition-colors"
          aria-label="Skip tutorial"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-themed-muted mb-2">
            <span>Step {currentStep + 1} of {TUTORIAL_STEPS.length}</span>
            <span className="text-ascend-400">{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1 rounded-full bg-[var(--border)] overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-ascend-500 to-gold-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ascend-500 to-ascend-600 
                        flex items-center justify-center shadow-lg shadow-ascend-500/20">
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-themed mb-2">{step.title}</h3>
          <p className="text-themed-secondary">{step.description}</p>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
              "text-themed-secondary hover:text-themed hover:bg-[var(--surface-hover)]",
              currentStep === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl
                     bg-gradient-to-r from-ascend-500 to-ascend-600
                     text-white font-semibold shadow-lg shadow-ascend-500/25
                     hover:shadow-ascend-500/40 hover:scale-105 transition-all"
          >
            {currentStep === TUTORIAL_STEPS.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {TUTORIAL_STEPS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              aria-label={`Go to step ${index + 1}`}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentStep 
                  ? "w-6 bg-ascend-500" 
                  : index < currentStep
                    ? "bg-ascend-500/50"
                    : "bg-[var(--border)]"
              )}
            />
          ))}
        </div>
      </div>
      
      {/* Pointer arrow to highlighted element */}
      {highlightRect && step.position !== 'center' && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: highlightRect.top + highlightRect.height / 2,
            left: step.position === 'right' ? highlightRect.right + 8 : highlightRect.left - 8,
            transform: `translateY(-50%) ${step.position === 'left' ? 'rotate(180deg)' : ''}`,
          }}
        >
          <ArrowRight className="w-6 h-6 text-ascend-500 animate-pulse" />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// TUTORIAL HOOK
// ─────────────────────────────────────────────────────────────────────────────────

export function useTutorial() {
  const [shouldShowTutorial, setShouldShowTutorial] = useState(false);
  
  useEffect(() => {
    // Check if this is the first time the user sees the app after onboarding
    const tutorialCompleted = localStorage.getItem('ascend-tutorial-completed');
    const hasCompletedOnboarding = localStorage.getItem('ascend-storage');
    
    if (!tutorialCompleted && hasCompletedOnboarding) {
      setShouldShowTutorial(true);
    }
  }, []);
  
  const completeTutorial = () => {
    localStorage.setItem('ascend-tutorial-completed', 'true');
    setShouldShowTutorial(false);
  };
  
  const resetTutorial = () => {
    localStorage.removeItem('ascend-tutorial-completed');
    setShouldShowTutorial(true);
  };
  
  return {
    shouldShowTutorial,
    completeTutorial,
    resetTutorial,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// TOOLTIP COMPONENT FOR INDIVIDUAL HINTS
// ─────────────────────────────────────────────────────────────────────────────────

interface TooltipHintProps {
  children: React.ReactNode;
  hint: string;
  show?: boolean;
}

export function TooltipHint({ children, hint, show = false }: TooltipHintProps) {
  if (!show) return <>{children}</>;
  
  return (
    <div className="relative">
      {children}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full
                    px-3 py-2 rounded-lg bg-ascend-500 text-white text-sm font-medium
                    whitespace-nowrap shadow-lg z-50">
        {hint}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 
                      w-2 h-2 bg-ascend-500 rotate-45" />
      </div>
    </div>
  );
}
