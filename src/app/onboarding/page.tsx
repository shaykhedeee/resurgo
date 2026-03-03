'use client';

export const dynamic = 'force-dynamic';

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// RESURGO â€” Premium Onboarding Flow
// 6-step wizard: Welcome â†’ Goal â†’ Focus â†’ Habits â†’ Schedule â†’ Launch
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useStoreUser } from '@/hooks/useStoreUser';
import { useUser } from '@clerk/nextjs';
import {
  ArrowLeft,
  Check,
  Target,
  Dumbbell,
  BookOpen,
  Heart,
  Zap,
  Sparkles,
  Flame,
  Brain,
  Star,
  Moon,
} from 'lucide-react';

// Map of habit template IDs to their Convex-compatible data
const HABIT_TEMPLATE_DATA: Record<string, { title: string; description: string; category: string; frequency: 'daily' | 'weekdays'; timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime'; estimatedMinutes: number }> = {
  'morning-routine': { title: 'Morning Routine', description: 'Start your day with intention', category: 'productivity', frequency: 'daily', timeOfDay: 'morning', estimatedMinutes: 30 },
  'exercise-30': { title: 'Exercise 30 min', description: 'Move your body every day', category: 'health', frequency: 'daily', timeOfDay: 'morning', estimatedMinutes: 30 },
  'read-20': { title: 'Read 20 pages', description: 'Build a reading habit', category: 'learning', frequency: 'daily', timeOfDay: 'evening', estimatedMinutes: 20 },
  'meditate': { title: 'Meditate 10 min', description: 'Find your calm center', category: 'wellness', frequency: 'daily', timeOfDay: 'morning', estimatedMinutes: 10 },
  'journal': { title: 'Daily Journal', description: 'Reflect and grow', category: 'wellness', frequency: 'daily', timeOfDay: 'evening', estimatedMinutes: 15 },
  'water-8': { title: 'Drink 8 glasses of water', description: 'Stay hydrated all day', category: 'health', frequency: 'daily', timeOfDay: 'anytime', estimatedMinutes: 1 },
  'no-phone-bed': { title: 'No phone in bed', description: 'Better sleep starts here', category: 'wellness', frequency: 'daily', timeOfDay: 'evening', estimatedMinutes: 1 },
  'learn-new': { title: 'Learn something new', description: '15 min of skill building', category: 'learning', frequency: 'daily', timeOfDay: 'afternoon', estimatedMinutes: 15 },
  'gratitude': { title: 'Gratitude practice', description: 'Write 3 things grateful for', category: 'wellness', frequency: 'daily', timeOfDay: 'morning', estimatedMinutes: 5 },
  'walk-10k': { title: 'Walk 10,000 steps', description: 'Keep moving through the day', category: 'health', frequency: 'daily', timeOfDay: 'anytime', estimatedMinutes: 60 },
  'meal-prep': { title: 'Eat healthy meals', description: 'Nourish your body', category: 'health', frequency: 'daily', timeOfDay: 'anytime', estimatedMinutes: 30 },
  'deep-work': { title: 'Deep work session', description: '90 min focused work block', category: 'productivity', frequency: 'weekdays', timeOfDay: 'morning', estimatedMinutes: 90 },
};

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type Step = 'welcome' | 'goal' | 'focus' | 'habits' | 'schedule' | 'ready';
const STEPS: Step[] = ['welcome', 'goal', 'focus', 'habits', 'schedule', 'ready'];

interface FocusArea {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface HabitTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  frequency: string;
  focusAreas: string[];
}

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const FOCUS_AREAS: FocusArea[] = [
  { id: 'habits', label: 'Build Better Habits', description: 'Create routines that stick', icon: <Flame className="w-5 h-5" />, color: 'from-orange-500 to-amber-500' },
  { id: 'goals', label: 'Achieve Big Goals', description: 'Break down & conquer goals', icon: <Target className="w-5 h-5" />, color: 'from-blue-500 to-indigo-500' },
  { id: 'health', label: 'Health & Fitness', description: 'Move more, feel better', icon: <Dumbbell className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
  { id: 'productivity', label: 'Boost Productivity', description: 'Get more done, stress less', icon: <Zap className="w-5 h-5" />, color: 'from-yellow-500 to-orange-500' },
  { id: 'learning', label: 'Personal Growth', description: 'Learn & grow every day', icon: <BookOpen className="w-5 h-5" />, color: 'from-purple-500 to-violet-500' },
  { id: 'wellness', label: 'Mental Wellness', description: 'Mindfulness & self-care', icon: <Heart className="w-5 h-5" />, color: 'from-pink-500 to-rose-500' },
];

const HABIT_TEMPLATES: HabitTemplate[] = [
  { id: 'morning-routine', name: 'Morning Routine', icon: <Sparkles className="w-5 h-5" />, description: 'Start your day with intention', frequency: 'Daily', focusAreas: ['habits', 'productivity'] },
  { id: 'exercise-30', name: 'Exercise 30 min', icon: <Dumbbell className="w-5 h-5" />, description: 'Move your body every day', frequency: 'Daily', focusAreas: ['health', 'habits'] },
  { id: 'read-20', name: 'Read 20 pages', icon: <BookOpen className="w-5 h-5" />, description: 'Build a reading habit', frequency: 'Daily', focusAreas: ['learning', 'habits'] },
  { id: 'meditate', name: 'Meditate 10 min', icon: <Heart className="w-5 h-5" />, description: 'Find your calm center', frequency: 'Daily', focusAreas: ['wellness', 'habits'] },
  { id: 'journal', name: 'Daily Journal', icon: <Brain className="w-5 h-5" />, description: 'Reflect and grow', frequency: 'Daily', focusAreas: ['wellness', 'learning'] },
  { id: 'water-8', name: 'Drink 8 glasses', icon: <Heart className="w-5 h-5" />, description: 'Stay hydrated all day', frequency: 'Daily', focusAreas: ['health', 'habits'] },
  { id: 'no-phone-bed', name: 'No phone in bed', icon: <Moon className="w-5 h-5" />, description: 'Better sleep starts here', frequency: 'Daily', focusAreas: ['wellness', 'productivity'] },
  { id: 'learn-new', name: 'Learn something new', icon: <Target className="w-5 h-5" />, description: '15 min of skill building', frequency: 'Daily', focusAreas: ['learning', 'goals'] },
  { id: 'gratitude', name: 'Gratitude practice', icon: <Star className="w-5 h-5" />, description: 'Write 3 things grateful for', frequency: 'Daily', focusAreas: ['wellness', 'habits'] },
  { id: 'walk-10k', name: 'Walk 10,000 steps', icon: <Flame className="w-5 h-5" />, description: 'Keep moving through the day', frequency: 'Daily', focusAreas: ['health'] },
  { id: 'meal-prep', name: 'Eat healthy meals', icon: <Heart className="w-5 h-5" />, description: 'Nourish your body', frequency: 'Daily', focusAreas: ['health'] },
  { id: 'deep-work', name: 'Deep work session', icon: <Zap className="w-5 h-5" />, description: '90 min focused work block', frequency: 'Weekdays', focusAreas: ['productivity', 'goals'] },
];

const TIME_OPTIONS = [
  { id: 'early', label: 'Early Bird', description: '5 â€“ 7 AM', icon: <Flame className="w-6 h-6" /> },
  { id: 'morning', label: 'Morning Person', description: '7 â€“ 10 AM', icon: <Sparkles className="w-6 h-6" /> },
  { id: 'afternoon', label: 'Afternoon Riser', description: '12 â€“ 3 PM', icon: <Zap className="w-6 h-6" /> },
  { id: 'evening', label: 'Night Owl', description: '6 â€“ 10 PM', icon: <Moon className="w-6 h-6" /> },
];

const GOAL_EXAMPLES = [
  'Get fit and lose weight',
  'Launch my own business',
  'Learn a new language',
  'Read 24 books this year',
  'Build a morning routine',
  'Land my dream job',
  'Save and invest money',
  'Run a half marathon',
];

const DEADLINE_OPTIONS = [
  { id: '1m', label: '1 month', description: 'Quick win' },
  { id: '3m', label: '3 months', description: 'Short sprint' },
  { id: '6m', label: '6 months', description: 'Mid-term push' },
  { id: '1y', label: '1 year', description: 'Long-game' },
  { id: 'ongoing', label: 'Ongoing', description: 'Lifestyle change' },
];

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function OnboardingPage() {
  const { user, isLoading } = useStoreUser();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const createGoal = useMutation(api.goals.create);
  const createHabit = useMutation(api.habits.create);
  const autoGenerate = useMutation(api.goals.autoGenerateFromOnboarding);

  const [step, setStep] = useState<Step>('welcome');
  const [saving, setSaving] = useState(false);
  const [animating, setAnimating] = useState(false);
  const _goalInputRef = useRef<HTMLTextAreaElement>(null);

  // Onboarding data
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [primaryGoalReason, setPrimaryGoalReason] = useState('');
  const [primaryGoalDeadline, setPrimaryGoalDeadline] = useState('6m');
  const [lifeVision, setLifeVision] = useState('');
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [preferredTime, setPreferredTime] = useState<string>('morning');

  const [atMaxFocus, setAtMaxFocus] = useState(false);

  // Redirect if already onboarded
  useEffect(() => {
    if (!isLoading && user?.onboardingComplete) {
      router.replace('/dashboard');
    }
  }, [isLoading, user, router]);

  const firstName = clerkUser?.firstName || user?.name?.split(' ')[0] || 'there';

  // Step navigation with animation
  const goToStep = useCallback((target: Step) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(target);
      setAnimating(false);
    }, 180);
  }, []);

  const next = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) goToStep(STEPS[idx + 1]);
  };

  const back = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) goToStep(STEPS[idx - 1]);
  };

  // Complete onboarding â€” ALWAYS redirects, even on failure
  const handleComplete = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // 1. Save onboarding preferences
      await completeOnboarding({
        primaryGoal: primaryGoal.trim() || undefined,
        primaryGoalReason: primaryGoalReason.trim() || undefined,
        primaryGoalDeadline: primaryGoalDeadline || undefined,
        lifeVision: lifeVision.trim() || undefined,
        focusAreas: selectedFocus.length > 0 ? selectedFocus : undefined,
        selectedHabitTemplates: selectedHabits.length > 0 ? selectedHabits : undefined,
        preferredTime: preferredTime || undefined,
        timezone: tz,
      });

      // 2. Create the primary goal in Convex
      let goalId: any = undefined;
      if (primaryGoal.trim()) {
        try {
          const deadlineMap: Record<string, string> = {
            '1m': new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
            '3m': new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
            '6m': new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
            '1y': new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
          };
          goalId = await createGoal({
            title: primaryGoal.trim(),
            description: primaryGoalReason.trim() || undefined,
            category: selectedFocus[0] || 'personal_growth',
            targetDate: deadlineMap[primaryGoalDeadline] || undefined,
            whyImportant: primaryGoalReason.trim() || undefined,
            deadlineType: primaryGoalDeadline === 'ongoing' ? 'ongoing' : 'flexible',
          });
        } catch (err) {
          console.warn('Goal creation failed:', err);
        }
      }

      // 3. Create selected habits in Convex
      for (const habitId of selectedHabits) {
        const template = HABIT_TEMPLATE_DATA[habitId];
        if (!template) continue;
        try {
          await createHabit({
            title: template.title,
            description: template.description,
            category: template.category,
            frequency: template.frequency,
            timeOfDay: template.timeOfDay,
            estimatedMinutes: template.estimatedMinutes,
            goalId: goalId || undefined,
          });
        } catch (err) {
          console.warn(`Habit creation failed for ${habitId}:`, err);
        }
      }

      // 4. Auto-generate milestones & starter tasks from onboarding data
      if (primaryGoal.trim()) {
        try {
          await autoGenerate({
            goalTitle: primaryGoal.trim(),
            goalReason: primaryGoalReason.trim() || undefined,
            goalDeadline: primaryGoalDeadline || undefined,
            focusAreas: selectedFocus.length > 0 ? selectedFocus : undefined,
            preferredTime: preferredTime || undefined,
          });
        } catch (err) {
          console.warn('Auto-generate from onboarding failed:', err);
        }
      }
    } catch (err) {
      // Non-fatal: log but always proceed to dashboard
      console.warn('Onboarding save failed, proceeding anyway:', err);
    }
    // Always navigate regardless of mutation success
    router.replace('/dashboard');
  }, [saving, completeOnboarding, createGoal, createHabit, autoGenerate, primaryGoal, primaryGoalReason, primaryGoalDeadline, lifeVision, selectedFocus, selectedHabits, preferredTime, router]);

  // Skip: save whatever we have and go straight to dashboard
  const handleSkip = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  // Filter habits based on selected focus areas
  const relevantHabits = selectedFocus.length > 0
    ? HABIT_TEMPLATES.filter(h => h.focusAreas.some(fa => selectedFocus.includes(fa)))
    : HABIT_TEMPLATES;

  const stepIndex = STEPS.indexOf(step);
  const progress = stepIndex === 0 ? 0 : (stepIndex / (STEPS.length - 1)) * 100;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="animate-pulse font-mono text-xs tracking-widest text-orange-600">Setting up your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100">

      {/* ── PROGRESS BAR (hidden on welcome) ── */}
      {step !== 'welcome' && (
        <div className="fixed left-0 right-0 top-0 z-50 border-b border-zinc-900 bg-black">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
            <button onClick={back} className="shrink-0 border border-zinc-800 p-1.5 text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-300">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex-1">
              <div className="mb-1 flex justify-between font-mono text-xs tracking-widest text-zinc-400">
                <span>Setup</span>
                <span>Step {stepIndex} of {STEPS.length - 1}</span>
              </div>
              <div className="h-px overflow-hidden bg-zinc-900">
                <div className="h-full bg-orange-600 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <button onClick={handleSkip} disabled={saving} className="shrink-0 font-mono text-xs tracking-widest text-zinc-400 transition hover:text-zinc-200 disabled:opacity-40">
              Skip
            </button>
          </div>
        </div>
      )}

      {/* ── CONTENT ── */}
      <div className={cn(
        'mx-auto max-w-2xl px-5 transition-all duration-200',
        animating ? 'translate-y-3 opacity-0' : 'translate-y-0 opacity-100',
        step !== 'welcome' && 'pt-20'
      )}>

        {/* ── STEP 1: WELCOME ── */}
        {step === 'welcome' && (
          <div className="flex min-h-screen flex-col items-center justify-center py-16 text-center">
            <div className="mb-8 w-full max-w-sm border border-zinc-900 bg-zinc-950 p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
                <span className="font-mono text-xs tracking-widest text-orange-600">RESURGO · GETTING STARTED</span>
              </div>
              <div className="space-y-1 text-left">
                {['Loading modules...', 'Initialising habit engine...', 'Calibrating AI coach...', 'Profile ready'].map((msg, i) => (
                  <div key={msg} className={`font-mono text-xs tracking-wider ${i === 3 ? 'text-green-500' : 'text-zinc-400'}`}>
                    {i < 3 ? <span className="mr-2 text-green-700">[OK]</span> : <span className="mr-2 animate-pulse text-green-500">[OK]</span>}
                    {msg}
                  </div>
                ))}
              </div>
            </div>

            <h1 className="mb-2 font-mono text-4xl font-black tracking-tight text-zinc-100 sm:text-5xl">
              WELCOME, <span className="text-orange-500">{firstName.toUpperCase()}</span>
            </h1>
            <p className="mb-8 max-w-md font-mono text-xs tracking-widest text-zinc-400">
  Your personal life OS — quick 2-min setup
            </p>

            <div className="mb-10 flex flex-wrap justify-center gap-2">
              {[
                { text: 'AI Goal Breakdown' },
                { text: 'Habit Streaks' },
                { text: 'Smart Analytics' },
                { text: 'AI Coaching' },
              ].map((f) => (
                <div key={f.text} className="border border-zinc-800 bg-zinc-950 px-3 py-1.5 font-mono text-xs tracking-widest text-zinc-400">
                  {f.text}
                </div>
              ))}
            </div>

            <button
              onClick={next}
              className="mb-3 border border-orange-800 bg-orange-950/30 px-8 py-3.5 font-mono text-sm tracking-widest text-orange-500 transition hover:bg-orange-950/50 min-h-[52px]"
            >
              [Get Started]
            </button>
            <button onClick={handleSkip} className="font-mono text-xs tracking-widest text-zinc-600 hover:text-zinc-400 mt-2 transition min-h-[40px]">
              I'll set this later →
            </button>
          </div>
        )}

        {/* ── STEP 2: PRIMARY GOAL ── */}
        {step === 'goal' && (
          <div className="py-10">
            <div className="mb-6 border border-zinc-900 bg-zinc-950">
              <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                <span className="font-mono text-xs tracking-widest text-orange-600">STEP 1 · YOUR GOAL</span>
              </div>
              <div className="px-4 py-4">
                <h2 className="font-mono text-xl font-bold tracking-tight text-zinc-100">What&apos;s your #1 goal?</h2>
                <p className="mt-1 font-mono text-xs text-zinc-400">Set your #1 goal · you can add more later.</p>
              </div>
            </div>

            {/* Example chips */}
            <div className="mb-4 flex flex-wrap gap-2">
              {GOAL_EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setPrimaryGoal(ex)}
                  className={cn(
                    'border px-2.5 py-1 font-mono text-xs tracking-widest transition',
                    primaryGoal === ex
                      ? 'border-orange-800 bg-orange-950/30 text-orange-500'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-400'
                  )}
                >
                  {ex}
                </button>
              ))}
            </div>

            <textarea
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              placeholder="e.g. Get fit and feel more energetic every day..."
              rows={3}
              className="mb-4 w-full border border-zinc-800 bg-black px-4 py-3 font-mono text-sm text-zinc-300 placeholder-zinc-700 outline-none transition focus:border-orange-800 resize-none"
            />

            {/* Deadline */}
            <div className="mb-4">
              <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">Target deadline</p>
              <div className="grid grid-cols-5 gap-1">
                {DEADLINE_OPTIONS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setPrimaryGoalDeadline(d.id)}
                    className={cn(
                      'flex flex-col items-center gap-0.5 border py-3 font-mono text-center transition',
                      primaryGoalDeadline === d.id
                        ? 'border-orange-800 bg-orange-950/30 text-orange-500'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    )}
                  >
                    <span className="text-xs font-bold">{d.label}</span>
                    <span className="text-xs text-zinc-400">{d.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Why */}
            <div className="mb-6">
              <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">Why this matters <span className="text-zinc-400">(optional)</span></p>
              <textarea
                value={primaryGoalReason}
                onChange={(e) => setPrimaryGoalReason(e.target.value)}
                placeholder="Your 'why' is your most powerful motivator..."
                rows={2}
                className="w-full border border-zinc-800 bg-black px-4 py-3 font-mono text-sm text-zinc-300 placeholder-zinc-700 outline-none transition focus:border-orange-800 resize-none"
              />
            </div>

            <div className="flex flex-col items-center gap-3">
              <button onClick={next} disabled={!primaryGoal.trim()} className="border border-orange-800 bg-orange-950/30 px-8 py-3.5 font-mono text-sm tracking-widest text-orange-500 transition hover:bg-orange-950/50 min-h-[52px] disabled:cursor-not-allowed disabled:opacity-40">
                [Set My Goal]
              </button>
              <button onClick={next} className="font-mono text-xs tracking-widest text-zinc-500 transition hover:text-zinc-300 underline-offset-2 hover:underline">I&apos;ll set this later →</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: FOCUS AREAS ── */}
        {step === 'focus' && (
          <div className="py-10">
            <div className="mb-6 border border-zinc-900 bg-zinc-950">
              <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                <span className="font-mono text-xs tracking-widest text-orange-600">STEP 2 · FOCUS AREAS</span>
              </div>
              <div className="flex items-center justify-between px-4 py-4">
                <div>
                  <h2 className="font-mono text-xl font-bold tracking-tight text-zinc-100">Pick your focus areas</h2>
                  <p className="mt-1 font-mono text-xs text-zinc-400">Pick up to 3 · personalises your AI coaching</p>
                </div>
                <span className={cn(
                  'font-mono text-xs tracking-widest border px-2 py-0.5',
                  selectedFocus.length >= 3
                    ? 'border-orange-800 text-orange-500 bg-orange-950/30'
                    : 'border-zinc-800 text-zinc-400'
                )}>{selectedFocus.length}/3</span>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-1 sm:grid-cols-2">
              {FOCUS_AREAS.map((area) => {
                const isSelected = selectedFocus.includes(area.id);
                return (
                  <button
                    key={area.id}
                    onClick={() => {
                      setSelectedFocus(prev => {
                        if (isSelected) return prev.filter(id => id !== area.id);
                        if (prev.length >= 3) {
                          setAtMaxFocus(true);
                          setTimeout(() => setAtMaxFocus(false), 2500);
                          return prev;
                        }
                        return [...prev, area.id];
                      });
                    }}
                    className={cn(
                      'flex items-center gap-3 border px-4 py-3 text-left transition',
                      isSelected
                        ? 'border-orange-800 bg-orange-950/20 text-orange-500'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                    )}
                  >
                    <div className="flex-1">
                      <div className="font-mono text-xs font-semibold tracking-wider">{area.label}</div>
                      <div className="font-mono text-xs text-zinc-400">{area.description}</div>
                    </div>
                    {isSelected && <Check className="h-3 w-3 shrink-0 text-orange-500" />}
                  </button>
                );
              })}
            </div>

            {atMaxFocus && (
              <p className="mb-3 font-mono text-xs tracking-wider text-amber-500 text-center">
                Max 3 areas selected — deselect one to choose another.
              </p>
            )}
            {/* Life vision */}
            <div className="mb-6 border border-zinc-900 bg-zinc-950 p-4">
              <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">1-year vision <span className="text-zinc-400">(optional)</span></p>
              <textarea
                value={lifeVision}
                onChange={(e) => setLifeVision(e.target.value)}
                placeholder="Paint a vivid picture of where you'll be in 1 year..."
                rows={3}
                className="w-full border border-zinc-800 bg-black px-3 py-2.5 font-mono text-sm text-zinc-300 placeholder-zinc-700 outline-none transition focus:border-orange-800 resize-none"
              />
              <p className="mt-1.5 font-mono text-xs text-zinc-400">Your AI coach uses this for tailored advice</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <button onClick={next} className="border border-orange-800 bg-orange-950/30 px-8 py-3.5 font-mono text-sm tracking-widest text-orange-500 transition hover:bg-orange-950/50 min-h-[52px]">
                {selectedFocus.length > 0 ? `[Confirm ${selectedFocus.length} Area${selectedFocus.length !== 1 ? 's' : ''}]` : '[Continue]'}
              </button>
              <button onClick={next} className="font-mono text-xs tracking-widest text-zinc-500 transition hover:text-zinc-300 underline-offset-2 hover:underline">I&apos;ll decide later →</button>
            </div>
          </div>
        )}

        {/* ── STEP 4: HABITS ── */}
        {step === 'habits' && (
          <div className="py-10">
            <div className="mb-6 border border-zinc-900 bg-zinc-950">
              <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                <span className="font-mono text-xs tracking-widest text-orange-600">STEP 3 · STARTER HABITS</span>
              </div>
              <div className="px-4 py-4">
                <h2 className="font-mono text-xl font-bold tracking-tight text-zinc-100">Pick your starter habits</h2>
                <p className="mt-1 font-mono text-xs text-zinc-400">
                  {selectedFocus.length > 0 ? 'Curated for your focus areas · start small' : 'Choose habits to begin today'}
                </p>
              </div>
            </div>

            <div className="mb-4 divide-y divide-zinc-900 border border-zinc-900">
              {relevantHabits.map((habit) => {
                const isSelected = selectedHabits.includes(habit.id);
                return (
                  <button
                    key={habit.id}
                    onClick={() => {
                      setSelectedHabits(prev =>
                        isSelected ? prev.filter(id => id !== habit.id) : [...prev, habit.id]
                      );
                    }}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-3 text-left transition',
                      isSelected ? 'bg-orange-950/20' : 'bg-zinc-950 hover:bg-zinc-900'
                    )}
                  >
                    <div className={cn('h-3 w-3 shrink-0 border', isSelected ? 'border-orange-600 bg-orange-950/60' : 'border-zinc-700')} />
                    <div className="flex-1">
                      <p className={cn('font-mono text-xs', isSelected ? 'text-orange-400' : 'text-zinc-400')}>{habit.name}</p>
                      <p className="font-mono text-xs text-zinc-400">{habit.description}</p>
                    </div>
                    <span className="shrink-0 border border-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-400">{habit.frequency.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>

            {selectedHabits.length > 0 && (
              <div className="mb-4 border border-orange-900 bg-orange-950/10 px-4 py-2.5">
                <p className="font-mono text-xs tracking-widest text-orange-600">
                  {selectedHabits.length}_NODE{selectedHabits.length !== 1 ? 'S' : ''}_SELECTED :: START_SMALL_FOR_BEST_RESULTS
                </p>
              </div>
            )}

            <div className="flex flex-col items-center gap-3">
              <button onClick={next} className="border border-orange-800 bg-orange-950/30 px-8 py-3.5 font-mono text-sm tracking-widest text-orange-500 transition hover:bg-orange-950/50 min-h-[52px]">
                {selectedHabits.length > 0 ? `[Add ${selectedHabits.length} Habit${selectedHabits.length !== 1 ? 's' : ''}]` : '[Continue]'}
              </button>
              <button onClick={next} className="font-mono text-xs tracking-widest text-zinc-400 transition hover:text-zinc-500">[I&apos;ll add habits later]</button>
            </div>
          </div>
        )}

        {/* ── STEP 5: SCHEDULE ── */}
        {step === 'schedule' && (
          <div className="py-10">
            <div className="mb-6 border border-zinc-900 bg-zinc-950">
              <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                <span className="font-mono text-xs tracking-widest text-orange-600">STEP 4 · DAILY RHYTHM</span>
              </div>
              <div className="px-4 py-4">
                <h2 className="font-mono text-xl font-bold tracking-tight text-zinc-100">When are you most productive?</h2>
                <p className="mt-1 font-mono text-xs text-zinc-400">We&apos;ll schedule your daily check-ins around your peak energy</p>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-2">
              {TIME_OPTIONS.map((time) => {
                const isSelected = preferredTime === time.id;
                return (
                  <button
                    key={time.id}
                    onClick={() => setPreferredTime(time.id)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 border py-6 transition',
                      isSelected
                        ? 'border-orange-800 bg-orange-950/20 text-orange-500'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700'
                    )}
                  >
                    <div className="font-mono text-xs font-bold tracking-widest">{time.label}</div>
                    <div className="font-mono text-xs text-zinc-400">{time.description}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-3">
              <button onClick={next} className="border border-orange-800 bg-orange-950/30 px-8 py-3.5 font-mono text-sm tracking-widest text-orange-500 transition hover:bg-orange-950/50 min-h-[52px]">
                [Confirm Schedule]
              </button>
              <button onClick={next} className="font-mono text-xs tracking-widest text-zinc-400 transition hover:text-zinc-500">[Any time is fine]</button>
            </div>
          </div>
        )}

        {/* ── STEP 6: READY ── */}
        {step === 'ready' && (
          <div className="flex min-h-[80vh] flex-col justify-center py-10">
            <div className="mb-8 text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                <span className="font-mono text-xs tracking-widest text-green-600">ALL SET</span>
              </div>
              <h2 className="font-mono text-3xl font-black tracking-tight text-zinc-100">
                You&apos;re ready, <span className="text-orange-500">{firstName}</span>
              </h2>
              <p className="mt-2 font-mono text-xs text-zinc-400">Resurgo is personalised · AI coach ready</p>
            </div>

            {/* Summary */}
            <div className="mx-auto mb-8 w-full max-w-md space-y-px">
              {primaryGoal && (
                <div className="border border-zinc-900 bg-zinc-950 p-4">
                  <p className="mb-1.5 font-mono text-xs tracking-widest text-zinc-400">YOUR GOAL</p>
                  <p className="font-mono text-xs text-zinc-300">{primaryGoal}</p>
                  {primaryGoalReason && <p className="mt-1 font-mono text-xs text-zinc-400">Why: {primaryGoalReason}</p>}
                  {primaryGoalDeadline && (
                    <span className="mt-1.5 inline-block border border-orange-900 bg-orange-950/20 px-2 py-0.5 font-mono text-xs text-orange-600">
                      {DEADLINE_OPTIONS.find(d => d.id === primaryGoalDeadline)?.label.toUpperCase()}
                    </span>
                  )}
                </div>
              )}

              {selectedFocus.length > 0 && (
                <div className="border border-zinc-900 bg-zinc-950 p-4">
                  <p className="mb-1.5 font-mono text-xs tracking-widest text-zinc-400">FOCUS AREAS</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFocus.map(id => {
                      const area = FOCUS_AREAS.find(a => a.id === id);
                      return area ? (
                        <span key={id} className="border border-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-500">
                          {area.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {selectedHabits.length > 0 && (
                <div className="border border-zinc-900 bg-zinc-950 p-4">
                  <p className="mb-1.5 font-mono text-xs tracking-widest text-zinc-400">HABITS ({selectedHabits.length})</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                    {selectedHabits.slice(0, 5).map(id => {
                      const h = HABIT_TEMPLATES.find(t => t.id === id);
                      return h ? <span key={id} className="font-mono text-xs text-zinc-400">{h.name}</span> : null;
                    })}
                    {selectedHabits.length > 5 && <span className="font-mono text-xs text-zinc-400">+{selectedHabits.length - 5} more</span>}
                  </div>
                </div>
              )}

              <div className="border border-zinc-900 bg-zinc-950 p-4">
                <p className="mb-1 font-mono text-xs tracking-widest text-zinc-400">DAILY RHYTHM</p>
                <p className="font-mono text-xs text-zinc-400">
                  {TIME_OPTIONS.find(t => t.id === preferredTime)?.label} ·{' '}
                  {TIME_OPTIONS.find(t => t.id === preferredTime)?.description}
                </p>
              </div>

              {!primaryGoal && selectedFocus.length === 0 && selectedHabits.length === 0 && (
                <div className="border border-zinc-900 bg-zinc-950 p-4 text-center">
                  <p className="font-mono text-xs text-zinc-400">You can configure goals and habits from your dashboard at any time</p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-3">
              <button
                onClick={handleComplete}
                disabled={saving}
                className="border border-orange-800 bg-orange-950/30 px-10 py-3 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? '[Launching...]' : '[Start My Journey]'}
              </button>
              <p className="font-mono text-xs text-zinc-400">You can update your preferences any time in Settings</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
