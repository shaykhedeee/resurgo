// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - User Onboarding Flow with Goal Setup
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAscendStore } from '@/lib/store';
import { aiGoalDecomposer } from '@/lib/ai-goal-decomposer';
import { analytics } from '@/lib/analytics';
import { cn, getRandomQuote, CATEGORY_ICONS, CATEGORY_LABELS } from '@/lib/utils';
import { GoalCategory, UltimateGoal, AIGoalDecompositionRequest } from '@/types';
import { addMonths } from 'date-fns';
import { 
  Target, 
  Brain, 
  Trophy, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Rocket,
  Loader2,
  Mountain,
  Crown,
  Gift,
  Star,
  Clock,
  Check,
} from 'lucide-react';

type OnboardingStep = 'welcome' | 'name' | 'about' | 'goal' | 'category' | 'processing' | 'ready' | 'offer';

const GOAL_EXAMPLES = [
  "Run a marathon in under 4 hours",
  "Learn to play guitar and perform a song",
  "Save $10,000 for an emergency fund",
  "Get promoted to senior developer",
  "Lose 30 pounds and get in the best shape of my life",
  "Read 24 books this year",
  "Launch my own side business",
  "Learn a new language to conversational level",
];

const CATEGORIES: GoalCategory[] = [
  'fitness', 'health', 'career', 'education', 'finance', 
  'relationships', 'creativity', 'mindfulness', 'productivity', 'custom'
];

const BUSYNESS_OPTIONS = [
  { value: 'light', label: 'Light', emoji: '🌿', desc: 'Lots of free time' },
  { value: 'moderate', label: 'Moderate', emoji: '⚖️', desc: 'Balanced schedule' },
  { value: 'busy', label: 'Busy', emoji: '⏰', desc: 'Limited free time' },
  { value: 'very_busy', label: 'Very Busy', emoji: '🔥', desc: 'Always on the go' },
] as const;

const WORK_TIME_OPTIONS = [
  { value: 'morning', label: 'Morning', emoji: '🌅', time: '6am-12pm' },
  { value: 'afternoon', label: 'Afternoon', emoji: '☀️', time: '12pm-5pm' },
  { value: 'evening', label: 'Evening', emoji: '🌆', time: '5pm-9pm' },
  { value: 'night', label: 'Night', emoji: '🌙', time: '9pm-12am' },
] as const;

const MOTIVATION_OPTIONS = [
  { value: 'self_improvement', label: 'Self-Improvement', emoji: '🌱', desc: 'Want to become better' },
  { value: 'external_goal', label: 'Specific Goal', emoji: '🎯', desc: 'Have something to achieve' },
  { value: 'accountability', label: 'Accountability', emoji: '🤝', desc: 'Need structure' },
  { value: 'curiosity', label: 'Curiosity', emoji: '💡', desc: 'Exploring possibilities' },
] as const;

const EXPERIENCE_OPTIONS = [
  { value: 'first_time', label: 'First Time', emoji: '🆕', desc: 'Never tried this before' },
  { value: 'some_attempts', label: 'Some Attempts', emoji: '🔄', desc: 'Tried a few times' },
  { value: 'experienced', label: 'Experienced', emoji: '📚', desc: 'Familiar with the basics' },
] as const;

export function Onboarding() {
  const router = useRouter();
  const { initializeUser, completeOnboarding, addGoal, addHabit, addToast } = useAscendStore();
  
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [busynessLevel, setBusynessLevel] = useState<'light' | 'moderate' | 'busy' | 'very_busy'>('moderate');
  const [preferredWorkTimes, setPreferredWorkTimes] = useState<('morning' | 'afternoon' | 'evening' | 'night')[]>(['morning']);
  const [motivation, setMotivation] = useState<'self_improvement' | 'external_goal' | 'accountability' | 'curiosity'>('self_improvement');
  const [experienceLevel, setExperienceLevel] = useState<'first_time' | 'some_attempts' | 'experienced'>('some_attempts');
  const [goalText, setGoalText] = useState('');
  const [category, setCategory] = useState<GoalCategory>('custom');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offerTimeLeft, setOfferTimeLeft] = useState(600); // 10 minutes in seconds
  
  // Static quote for this session (doesn't change during onboarding)
  const [quote] = useState(() => getRandomQuote());
  const [randomExample] = useState(() => GOAL_EXAMPLES[Math.floor(Math.random() * GOAL_EXAMPLES.length)]);
  
  // Countdown timer for offer
  useEffect(() => {
    if (step === 'offer' && offerTimeLeft > 0) {
      const timer = setInterval(() => {
        setOfferTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, offerTimeLeft]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (step === 'welcome') { analytics.completeOnboarding(1); setStep('name'); }
    else if (step === 'name' && name.trim()) { analytics.completeOnboarding(2); setStep('about'); }
    else if (step === 'about') { analytics.completeOnboarding(3); setStep('goal'); }
    else if (step === 'goal' && goalText.trim()) { analytics.completeOnboarding(4); setStep('category'); }
    else if (step === 'category') handleCreateGoal();
  };

  const handleBack = () => {
    if (step === 'name') setStep('welcome');
    else if (step === 'about') setStep('name');
    else if (step === 'goal') setStep('about');
    else if (step === 'category') setStep('goal');
    else if (step === 'offer') setStep('ready');
  };

  const handleCreateGoal = async () => {
    setStep('processing');
    setIsProcessing(true);
    setError(null);

    // Initialize user first
    initializeUser(name.trim());

    const targetDate = addMonths(new Date(), 3); // 3 month default

    // Map experience level to skill level
    const skillLevelMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
      'first_time': 'beginner',
      'some_attempts': 'intermediate',
      'experienced': 'advanced',
    };

    const request: AIGoalDecompositionRequest = {
      ultimateGoal: goalText,
      targetDate,
      category,
      currentSkillLevel: skillLevelMap[experienceLevel] || 'beginner',
      availableHoursPerDay: busynessLevel === 'very_busy' ? 0.5 : busynessLevel === 'busy' ? 1 : busynessLevel === 'moderate' ? 1.5 : 2,
      preferredDifficulty: experienceLevel === 'first_time' ? 'easy' : experienceLevel === 'experienced' ? 'challenging' : 'moderate',
      userAge: age || undefined,
      busynessLevel,
      preferredWorkTimes,
      motivation,
    };

    // Set a timeout to prevent infinite stuck state
    const timeoutId = setTimeout(() => {
      if (isProcessing) {
        setError('Goal creation is taking longer than expected. Please try again.');
        setStep('category');
        setIsProcessing(false);
      }
    }, 15000); // 15 second timeout

    try {
      const result = await aiGoalDecomposer.decomposeGoal(request);
      
      clearTimeout(timeoutId);
      
      // Create the goal
      const goal: UltimateGoal = {
        id: result.goalId,
        userId: '',
        title: goalText,
        description: result.summary,
        category,
        targetDate,
        createdAt: new Date(),
        status: 'in_progress',
        milestones: result.milestones.map((m) => ({
          ...m,
          progress: m.progressPercentage || 0,
        })),
        aiGenerated: true,
        progressPercentage: 0,
        progress: 0,
        celebrationMessage: result.motivationalMessage,
      };

      addGoal(goal);

      // Add suggested habits
      result.suggestedHabits?.forEach((habit) => {
        addHabit({
          name: habit.name ?? 'New Habit',
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

      setStep('ready');
      analytics.createGoal(12); // 12-week default timeline
      analytics.firstGoalCreated(category);
      analytics.useAIDecomposition();
      analytics.completeOnboarding(6); // Step 6 = goal plan generated
    } catch {
      setError('Something went wrong. Please try again.');
      setStep('category');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    analytics.completeOnboarding(7); // Step 7 = user clicked "Let's go" — fully activated
    analytics.signUp('onboarding');
    addToast({
      type: 'success',
      title: `Welcome to Resurgo, ${name}! 🚀`,
      message: 'Your personalized journey begins now',
      xpGained: 100,
    });
    completeOnboarding();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-[var(--background)]">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-ascend-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gold-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-ascend-500 to-ascend-600 
                        flex items-center justify-center shadow-glow-md">
            <Mountain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-themed">RESURGO</h1>
            <p className="text-xs sm:text-xs text-themed-muted">Rise to your potential</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
          {['welcome', 'name', 'about', 'goal', 'category', 'ready', 'offer'].map((s, i) => (
            <div
              key={s}
              className={cn(
                "flex-1 h-1 rounded-full transition-all duration-300",
                ['welcome', 'name', 'about', 'goal', 'category', 'processing', 'ready', 'offer'].indexOf(step) >= i
                  ? "bg-ascend-500"
                  : "bg-[var(--border)]"
              )}
            />
          ))}
        </div>

        {/* Content Card */}
        <div className="glass-card p-5 sm:p-8 max-h-[70vh] overflow-y-auto">
          
          {/* Welcome Step */}
          {step === 'welcome' && (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-ascend-500 to-ascend-600 
                            flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-glow-md">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-themed mb-2">Welcome to Resurgo</h2>
              <p className="text-ascend-500 font-medium mb-2 sm:mb-3 text-sm sm:text-base">Become Your Ideal Self</p>
              <p className="text-themed-secondary leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
                Tell us who you want to become, and AI creates your personalized
                daily action plan. One task list, infinite potential.
              </p>
              
              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="p-3 rounded-xl bg-[var(--surface)]">
                  <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-xs text-themed-secondary">AI Plans Everything</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface)]">
                  <Target className="w-6 h-6 text-ascend-500 mx-auto mb-2" />
                  <p className="text-xs text-themed-secondary">One Task List</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface)]">
                  <Trophy className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                  <p className="text-xs text-themed-secondary">Become Your Best</p>
                </div>
              </div>
              
              <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Name Step */}
          {step === 'name' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-themed text-center mb-2">What&apos;s your name?</h2>
              <p className="text-themed-secondary text-center mb-8">
                Let&apos;s personalize your experience
              </p>
              
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="input-primary text-center text-lg mb-8"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && name.trim() && handleNext()}
              />
              
              <div className="flex gap-3">
                <button onClick={handleBack} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={!name.trim()}
                  className={cn(
                    "btn-primary flex-1 flex items-center justify-center gap-2",
                    !name.trim() && "opacity-50 cursor-not-allowed"
                  )}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* About You Step */}
          {step === 'about' && (
            <div className="animate-fade-in">
              <h2 className="text-xl sm:text-2xl font-bold text-themed text-center mb-2">
                Tell us about yourself, {name}
              </h2>
              <p className="text-themed-secondary text-center text-sm mb-6">
                This helps AI create a realistic plan for you
              </p>
              
              {/* Age Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-themed-secondary mb-2">
                  Your Age (optional)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                  placeholder="e.g., 25"
                  min={13}
                  max={120}
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl
                           text-themed placeholder:text-themed-muted text-center
                           focus:outline-none focus:border-ascend-500 focus:ring-2 focus:ring-ascend-500/20"
                />
              </div>
              
              {/* Busyness Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-themed-secondary mb-2">
                  How busy is your typical day?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BUSYNESS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setBusynessLevel(option.value)}
                      className={cn(
                        "flex flex-col items-center gap-1 px-3 py-3 rounded-xl border transition-all",
                        busynessLevel === option.value
                          ? "bg-ascend-500/20 border-ascend-500"
                          : "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-hover)]"
                      )}
                    >
                      <span className="text-xl">{option.emoji}</span>
                      <span className="text-sm font-medium text-themed">{option.label}</span>
                      <span className="text-xs text-themed-muted">{option.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Preferred Work Times */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-themed-secondary mb-2">
                  When do you prefer to work on goals?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {WORK_TIME_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (preferredWorkTimes.includes(option.value)) {
                          setPreferredWorkTimes(preferredWorkTimes.filter(t => t !== option.value));
                        } else {
                          setPreferredWorkTimes([...preferredWorkTimes, option.value]);
                        }
                      }}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all",
                        preferredWorkTimes.includes(option.value)
                          ? "bg-ascend-500/20 border-ascend-500"
                          : "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-hover)]"
                      )}
                    >
                      <span className="text-lg">{option.emoji}</span>
                      <div className="text-left">
                        <span className="text-sm font-medium text-themed block">{option.label}</span>
                        <span className="text-xs text-themed-muted">{option.time}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Motivation */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-themed-secondary mb-2">
                  What motivates you to use this app?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MOTIVATION_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMotivation(option.value)}
                      className={cn(
                        "flex flex-col items-center gap-1 px-3 py-3 rounded-xl border transition-all",
                        motivation === option.value
                          ? "bg-ascend-500/20 border-ascend-500"
                          : "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-hover)]"
                      )}
                    >
                      <span className="text-xl">{option.emoji}</span>
                      <span className="text-sm font-medium text-themed">{option.label}</span>
                      <span className="text-xs text-themed-muted">{option.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button onClick={handleBack} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Goal Step */}
          {step === 'goal' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-themed text-center mb-2">
                What&apos;s your ultimate goal, {name}?
              </h2>
              <p className="text-themed-secondary text-center mb-6">
                Dream big! AI will break this into daily actions
              </p>
              
              <textarea
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                placeholder={`e.g., ${randomExample}`}
                className="w-full h-32 px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl
                         text-themed placeholder:text-themed-muted resize-none
                         focus:outline-none focus:border-ascend-500 focus:ring-2 focus:ring-ascend-500/20 mb-4"
                autoFocus
              />

              {/* Experience Level for this goal */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-themed-secondary mb-2">
                  What&apos;s your experience with this goal area?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setExperienceLevel(option.value)}
                      className={cn(
                        "flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border transition-all",
                        experienceLevel === option.value
                          ? "bg-ascend-500/20 border-ascend-500"
                          : "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-hover)]"
                      )}
                    >
                      <span className="text-lg">{option.emoji}</span>
                      <span className="text-xs font-medium text-themed">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-ascend-500/10 border border-ascend-500/20 mb-6">
                <p className="text-xs text-ascend-500">
                  💡 <strong>Tip:</strong> Be specific! Instead of &quot;get fit&quot;, try &quot;run a 5K in under 30 minutes&quot;
                </p>
              </div>
              
              <div className="flex gap-3">
                <button onClick={handleBack} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={!goalText.trim()}
                  className={cn(
                    "btn-primary flex-1 flex items-center justify-center gap-2",
                    !goalText.trim() && "opacity-50 cursor-not-allowed"
                  )}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Category Step */}
          {step === 'category' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-themed text-center mb-2">
                What area is this goal?
              </h2>
              <p className="text-themed-secondary text-center text-sm mb-6">
                This helps AI create better strategies
              </p>
              
              <div className="grid grid-cols-2 gap-2 mb-6">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-left",
                      category === cat
                        ? "bg-ascend-500/20 border-ascend-500 text-themed"
                        : "bg-[var(--surface)] border-[var(--border)] text-themed-secondary hover:bg-[var(--surface-hover)]"
                    )}
                  >
                    <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                    <span className="text-sm font-medium">{CATEGORY_LABELS[cat]}</span>
                  </button>
                ))}
              </div>
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}
              
              <div className="flex gap-3">
                <button onClick={handleBack} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Create My Plan
                </button>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ascend-500/20 to-gold-400/20 
                            flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-ascend-500 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-themed mb-2">Creating Your Plan...</h2>
              <p className="text-themed-secondary text-sm">
                AI is breaking down your goal into<br />achievable daily tasks
              </p>
              
              <div className="mt-8 space-y-2">
                <div className="flex items-center gap-3 justify-center text-sm text-themed-muted">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Analyzing your goal
                </div>
                <div className="flex items-center gap-3 justify-center text-sm text-themed-muted">
                  <Loader2 className="w-4 h-4 animate-spin text-ascend-500" />
                  Creating milestones
                </div>
                <div className="flex items-center gap-3 justify-center text-sm text-themed-muted opacity-50">
                  <div className="w-4 h-4 rounded-full border border-current" />
                  Generating daily tasks
                </div>
              </div>
            </div>
          )}

          {/* Ready Step */}
          {step === 'ready' && (
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-green-400/20 
                            flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-themed mb-2">You&apos;re All Set! 🎉</h2>
              <p className="text-themed-secondary mb-6">
                Your personalized action plan is ready.<br />
                Let&apos;s start your transformation!
              </p>
              
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] mb-6 text-left">
                <p className="text-xs text-themed-muted mb-2">YOUR GOAL</p>
                <p className="text-themed font-medium">{goalText}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-ascend-500/10">
                  <p className="text-2xl font-bold text-ascend-500">3-5</p>
                  <p className="text-xs text-themed-muted">Milestones</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <p className="text-2xl font-bold text-purple-400">12+</p>
                  <p className="text-xs text-themed-muted">Weekly Tasks</p>
                </div>
                <div className="p-3 rounded-xl bg-gold-400/10">
                  <p className="text-2xl font-bold text-gold-400">100</p>
                  <p className="text-xs text-themed-muted">Bonus XP</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button onClick={() => setStep('offer')} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Continue
                </button>
                <button 
                  onClick={handleFinish} 
                  className="text-themed-muted text-sm hover:text-themed transition-colors"
                >
                  Skip to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Premium Offer Step */}
          {step === 'offer' && (
            <div className="animate-fade-in">
              {/* Limited Time Badge */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/30">
                  <Gift className="w-4 h-4 text-gold-400" />
                  <span className="text-sm font-medium text-gold-400">New Member Exclusive</span>
                </div>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-themed text-center mb-2">
                Unlock Your Full Potential
              </h2>
              <p className="text-themed-secondary text-center text-sm mb-4">
                Get <span className="text-gold-400 font-semibold">20% OFF</span> Pro — First-time offer only!
              </p>
              
              {/* Countdown Timer */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400 font-medium">
                  Offer expires in {formatTime(offerTimeLeft)}
                </span>
              </div>
              
              {/* Pro Plan Card */}
              <div className="relative p-4 rounded-xl bg-gradient-to-br from-ascend-500/10 to-gold-400/5 border border-ascend-500/30 mb-4">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-ascend-500 text-white text-xs font-semibold">
                    MOST POPULAR
                  </span>
                </div>
                
                <div className="text-center mb-4 pt-2">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Crown className="w-5 h-5 text-gold-400" />
                    <span className="font-bold text-lg">Resurgo Pro</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold text-themed">$4</span>
                    <span className="text-themed-muted">/month</span>
                    <span className="text-sm line-through text-themed-muted">$5</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {[
                    'Unlimited habits & goals',
                    'AI Goal Decomposition',
                    'Advanced analytics & insights',
                    'Full history access',
                    'Data export (JSON & PDF)',
                    'Identity System & Habit Stacking',
                    'Priority support',
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-themed-secondary">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => {
                    handleFinish();
                    router.push('/billing');
                  }}
                  className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-ascend-500 to-gold-400
                           hover:from-ascend-400 hover:to-gold-300 transition-all flex items-center justify-center gap-2"
                >
                  <Star className="w-5 h-5" />
                  Claim 20% OFF Now
                </button>
              </div>
              
              {/* Lifetime Option */}
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">Lifetime Access</p>
                    <p className="text-xs text-themed-muted">Pay once, yours forever</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-themed">$79 <span className="text-xs line-through text-themed-muted">$99</span></p>
                    <p className="text-xs text-green-400">Save $20</p>
                  </div>
                </div>
              </div>
              
              {/* Free Continue */}
              <div className="text-center">
                <button 
                  onClick={handleFinish}
                  className="text-themed-muted text-sm hover:text-themed transition-colors inline-flex items-center gap-1"
                >
                  Continue with Free Plan
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-xs text-themed-muted mt-2">
                  5 habits • 2 goals • Basic features
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quote with Animation */}
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-themed-muted text-sm italic leading-relaxed">&quot;{quote.quote}&quot;</p>
          <p className="text-xs mt-2 text-ascend-500/70">— {quote.author}</p>
        </div>
      </div>
    </div>
  );
}
