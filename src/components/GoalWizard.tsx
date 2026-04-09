// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Goal Creation Wizard with AI Decomposition
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { useAscendStore } from '@/lib/store';
import { useStoreUser } from '@/hooks/useStoreUser';
import { analytics } from '@/lib/analytics';
import { aiGoalDecomposer } from '@/lib/ai-goal-decomposer';
import { cn, CATEGORY_ICONS, CATEGORY_LABELS } from '@/lib/utils';
import { GoalCategory, UltimateGoal, AIGoalDecompositionRequest } from '@/types';
import { UpsellPrompt } from '@/components/UpsellPrompt';
import { 
  Sparkles, 
  Target, 
  Calendar, 
  Clock, 
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Rocket,
  Brain,
  X
} from 'lucide-react';
import { format, addMonths, addWeeks } from 'date-fns';

interface GoalWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

type WizardStep = 'goal' | 'category' | 'timeline' | 'preferences' | 'processing' | 'review';

const CATEGORIES: GoalCategory[] = [
  'fitness', 'health', 'career', 'education', 'finance', 
  'relationships', 'creativity', 'mindfulness', 'productivity', 'custom'
];

const TIMELINE_OPTIONS = [
  { label: '2 Weeks', value: 2, unit: 'weeks' },
  { label: '1 Month', value: 1, unit: 'months' },
  { label: '3 Months', value: 3, unit: 'months' },
  { label: '6 Months', value: 6, unit: 'months' },
  { label: '1 Year', value: 12, unit: 'months' },
];

const HOURS_OPTIONS = [
  { label: '30 min/day', value: 0.5 },
  { label: '1 hour/day', value: 1 },
  { label: '2 hours/day', value: 2 },
  { label: '3+ hours/day', value: 3 },
];

const DIFFICULTY_OPTIONS = [
  { label: 'Easy Start', value: 'easy' as const, description: 'Gentle progression, build momentum' },
  { label: 'Moderate', value: 'moderate' as const, description: 'Balanced challenge and growth' },
  { label: 'Challenging', value: 'challenging' as const, description: 'Push your limits, faster results' },
];

const SKILL_LEVELS = [
  { label: 'Beginner', value: 'beginner' as const },
  { label: 'Intermediate', value: 'intermediate' as const },
  { label: 'Advanced', value: 'advanced' as const },
];

export function GoalWizard({ isOpen, onClose }: GoalWizardProps) {
  const { addGoal, addHabit, addToast, addCoachMessage, goals: existingGoals } = useAscendStore();
  const { user } = useStoreUser();
  const isPro = user?.plan === 'pro' || user?.plan === 'lifetime';
  const FREE_GOAL_LIMIT = 3;
  const [showGoalLimitUpsell, setShowGoalLimitUpsell] = useState(false);
  
  const [step, setStep] = useState<WizardStep>('goal');
  const [goalText, setGoalText] = useState('');
  const [category, setCategory] = useState<GoalCategory>('custom');
  const [timelineValue, setTimelineValue] = useState(3);
  const [timelineUnit, setTimelineUnit] = useState<'weeks' | 'months'>('months');
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const [difficulty, setDifficulty] = useState<'easy' | 'moderate' | 'challenging'>('moderate');
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [decompositionResult, setDecompositionResult] = useState<any>(null);
  const [, setError] = useState<string | null>(null);

  const targetDate = timelineUnit === 'weeks' 
    ? addWeeks(new Date(), timelineValue)
    : addMonths(new Date(), timelineValue);

  const handleNext = () => {
    const steps: WizardStep[] = ['goal', 'category', 'timeline', 'preferences', 'processing', 'review'];
    const currentIndex = steps.indexOf(step);
    
    // Gate: check goal limit for free users at first step
    if (step === 'goal' && !isPro && existingGoals.length >= FREE_GOAL_LIMIT) {
      setShowGoalLimitUpsell(true);
      return;
    }

    if (step === 'preferences') {
      handleDecompose();
    } else if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: WizardStep[] = ['goal', 'category', 'timeline', 'preferences', 'processing', 'review'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleDecompose = async () => {
    setStep('processing');
    setIsProcessing(true);
    setError(null);

    const request: AIGoalDecompositionRequest = {
      ultimateGoal: goalText,
      targetDate,
      category,
      currentSkillLevel: skillLevel,
      availableHoursPerDay: hoursPerDay,
      preferredDifficulty: difficulty,
    };

    try {
      const result = await aiGoalDecomposer.decomposeGoal(request);
      setDecompositionResult(result);
      setStep('review');
    } catch {
      setError('Failed to generate action plan. Please try again.');
      setStep('preferences');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (!decompositionResult) return;

    // Create the ultimate goal with proper progress fields
    const goal: UltimateGoal = {
      id: decompositionResult.goalId,
      userId: '',
      title: goalText,
      description: decompositionResult.summary,
      category,
      targetDate,
      createdAt: new Date(),
      status: 'in_progress',
      milestones: decompositionResult.milestones.map((m: any) => ({
        ...m,
        progress: m.progressPercentage || 0,
      })),
      aiGenerated: true,
      progressPercentage: 0,
      progress: 0,
      celebrationMessage: decompositionResult.motivationalMessage,
    };

    addGoal(goal);
    analytics.createGoal(Math.ceil((new Date(targetDate).getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000)));
    if (existingGoals.length === 0) {
      analytics.firstGoalCreated(category);
    }
    analytics.useAIDecomposition();

    // Add suggested habits
    decompositionResult.suggestedHabits?.forEach((habit: any) => {
      addHabit({
        name: habit.name,
        description: habit.description,
        icon: habit.icon || '✨',
        color: habit.color || '#14B899',
        category: habit.category || 'custom',
        frequency: habit.frequency || 'daily',
        targetCompletions: 1,
        isActive: true,
        linkedGoalId: goal.id,
      });
    });

    // Add coach message
    addCoachMessage({
      userId: '',
      type: 'motivation',
      title: 'Your Journey Begins',
      message: decompositionResult.motivationalMessage,
      actionItems: [
        'Review your first milestone',
        'Complete today\'s tasks',
        'Build momentum with small wins',
      ],
      priority: 'high',
    });

    addToast({
      type: 'success',
      title: 'Goal Created!',
      message: `Your path to "${goalText}" is ready. Let's begin!`,
      xpGained: 50,
    });

    // Reset and close
    resetWizard();
    onClose();
  };

  const resetWizard = () => {
    setStep('goal');
    setGoalText('');
    setCategory('custom');
    setTimelineValue(3);
    setTimelineUnit('months');
    setHoursPerDay(1);
    setDifficulty('moderate');
    setSkillLevel('beginner');
    setDecompositionResult(null);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-[var(--background-secondary)] border border-white/10 rounded-2xl 
                  shadow-2xl overflow-hidden animate-scale-in flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-wizard-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ascend-400 to-gold-400 
                          flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 id="goal-wizard-title" className="text-lg font-semibold text-white">Create Your Goal</h2>
              <p className="text-sm text-white/60">AI will build your action plan</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors
                     min-w-[44px] min-h-[44px] flex items-center justify-center
                     focus-visible:ring-2 focus-visible:ring-white/50"
            title="Close"
            aria-label="Close goal wizard"
          >
            <X className="w-5 h-5 text-white/60" aria-hidden="true" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-white/[0.02]" role="progressbar" aria-valuenow={['goal', 'category', 'timeline', 'preferences', 'review'].indexOf(step) + 1} aria-valuemin={1} aria-valuemax={5} aria-label={`Step ${['goal', 'category', 'timeline', 'preferences', 'review'].indexOf(step) + 1} of 5`}>
          <div className="flex items-center gap-2">
            {['goal', 'category', 'timeline', 'preferences', 'review'].map((s, i) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  step === s || ['goal', 'category', 'timeline', 'preferences', 'review'].indexOf(step) > i
                    ? "bg-ascend-500"
                    : "bg-white/10"
                )} />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[300px] max-h-[60vh] overflow-y-auto flex-1">
          {/* Step 1: Goal Input */}
          {step === 'goal' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold text-white mb-2">
                What&apos;s your ultimate goal?
              </h3>
              <p className="text-white/60 mb-6">
                Dream big! AI will break this down into achievable daily actions.
              </p>
              
              <label htmlFor="goal-text" className="sr-only">Describe your goal</label>
              <textarea
                id="goal-text"
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                placeholder="e.g., Run a marathon, Learn to play guitar, Build a successful side business, Get in the best shape of my life..."
                className="w-full h-40 px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                         text-white placeholder:text-white/30 resize-none
                         focus:outline-none focus:border-ascend-500 focus:ring-2 focus:ring-ascend-500/20"
                aria-describedby="goal-tip"
              />
              
              <div id="goal-tip" className="mt-4 p-4 rounded-xl bg-ascend-500/10 border border-ascend-500/20">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-ascend-400 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-ascend-400">AI Tip</p>
                    <p className="text-sm text-white/60 mt-1">
                      Be specific about what success looks like. Instead of &quot;get fit&quot;, try 
                      &quot;lose 20 pounds and run a 5K in under 30 minutes&quot;.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Category */}
          {step === 'category' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold text-white mb-2">
                What area of life is this goal?
              </h3>
              <p className="text-white/60 mb-6">
                This helps AI suggest the best strategies and habits.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all",
                      category === cat
                        ? "bg-ascend-500/20 border-ascend-500 text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
                    <span className="font-medium">{CATEGORY_LABELS[cat]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Timeline */}
          {step === 'timeline' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold text-white mb-2">
                When do you want to achieve this?
              </h3>
              <p className="text-white/60 mb-6">
                AI will pace your journey based on your deadline.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {TIMELINE_OPTIONS.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => {
                      setTimelineValue(option.value);
                      setTimelineUnit(option.unit as 'weeks' | 'months');
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 px-4 py-4 rounded-xl border transition-all",
                      timelineValue === option.value && timelineUnit === option.unit
                        ? "bg-ascend-500/20 border-ascend-500"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    )}
                  >
                    <Calendar className="w-5 h-5 text-white/60" />
                    <span className="font-medium text-white">{option.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/60">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">
                    Target Date: <span className="text-white font-medium">
                      {format(targetDate, 'MMMM d, yyyy')}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preferences */}
          {step === 'preferences' && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Customize your journey
                </h3>
                <p className="text-white/60 mb-4">
                  Help AI create the perfect plan for you.
                </p>
              </div>

              {/* Time Available */}
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">
                  Time you can dedicate daily
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {HOURS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setHoursPerDay(option.value)}
                      className={cn(
                        "px-3 py-2 rounded-lg border text-sm transition-all",
                        hoursPerDay === option.value
                          ? "bg-ascend-500/20 border-ascend-500 text-white"
                          : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill Level */}
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">
                  Your current skill level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SKILL_LEVELS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSkillLevel(option.value)}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm transition-all",
                        skillLevel === option.value
                          ? "bg-ascend-500/20 border-ascend-500 text-white"
                          : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">
                  Preferred intensity
                </label>
                <div className="space-y-2">
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDifficulty(option.value)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all",
                        difficulty === option.value
                          ? "bg-ascend-500/20 border-ascend-500"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      )}
                    >
                      <div className="text-left">
                        <p className="font-medium text-white">{option.label}</p>
                        <p className="text-sm text-white/60">{option.description}</p>
                      </div>
                      {difficulty === option.value && (
                        <CheckCircle2 className="w-5 h-5 text-ascend-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Processing */}
          {step === 'processing' && (
            <div className="animate-fade-in flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-ascend-500/30 
                              border-t-ascend-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-ascend-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mt-6 mb-2">
                AI is creating your action plan...
              </h3>
              <p className="text-white/60 text-center max-w-md">
                Analyzing your goal, breaking it into milestones, and generating
                personalized daily tasks.
              </p>
              
              <div className="mt-8 space-y-2 text-sm text-white/60">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Understanding your goal
                </p>
                <p className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-ascend-400 animate-spin" />
                  Creating milestone roadmap
                </p>
                <p className="flex items-center gap-2 text-white/30">
                  <Clock className="w-4 h-4" />
                  Generating daily tasks
                </p>
              </div>
            </div>
          )}

          {/* Review */}
          {step === 'review' && decompositionResult && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Your Action Plan is Ready!</h3>
                  <p className="text-white/60 text-sm">{decompositionResult.estimatedSuccessRate}% estimated success rate</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-ascend-500/10 border border-ascend-500/20 mb-4">
                <p className="text-sm text-white">{decompositionResult.summary}</p>
              </div>

              {/* Milestones Preview */}
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">
                  {decompositionResult.milestones.length} Milestones
                </h4>
                {decompositionResult.milestones.map((milestone: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                    <div className="w-6 h-6 rounded-full bg-ascend-500/20 flex items-center justify-center 
                                  text-xs font-bold text-ascend-400">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white text-sm">{milestone.title}</p>
                      <p className="text-xs text-white/60 mt-0.5">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggested Habits */}
              {decompositionResult.suggestedHabits?.length > 0 && (
                <div className="p-3 rounded-lg bg-white/5 mb-4">
                  <h4 className="text-sm font-medium text-white/80 mb-2">
                    🌱 Suggested Supporting Habits
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {decompositionResult.suggestedHabits.map((habit: any, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-sm text-white/80">
                        {habit.icon || '✨'} {habit.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Motivation */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-gold-400/10 to-ascend-500/10 
                            border border-gold-400/20">
                <p className="text-sm text-white italic">
                  &quot;{decompositionResult.motivationalMessage}&quot;
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Goal Limit Upsell */}
        {showGoalLimitUpsell && (
          <div className="px-6 py-4">
            <UpsellPrompt
              trigger="goal_limit"
              variant="inline"
              onDismiss={() => {
                setShowGoalLimitUpsell(false);
                onClose();
              }}
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02]">
          <button
            onClick={step === 'goal' ? onClose : handleBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/60 
                     hover:text-white hover:bg-white/10 transition-colors"
            disabled={isProcessing}
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 'goal' ? 'Cancel' : 'Back'}
          </button>

          {step !== 'processing' && (
            <button
              onClick={step === 'review' ? handleConfirm : handleNext}
              disabled={
                (step === 'goal' && !goalText.trim()) ||
                isProcessing
              }
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all",
                step === 'review'
                  ? "bg-gradient-to-r from-ascend-500 to-gold-500 text-white hover:shadow-glow-md"
                  : "bg-ascend-500 text-white hover:bg-ascend-600",
                ((step === 'goal' && !goalText.trim()) || isProcessing) && "opacity-50 cursor-not-allowed"
              )}
            >
              {step === 'review' ? (
                <>
                  <Rocket className="w-4 h-4" />
                  Start My Journey
                </>
              ) : step === 'preferences' ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Plan
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
