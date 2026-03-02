// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Deep Onboarding Wizard
// Comprehensive user profiling for personalized goal achievement
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { cn } from '@/lib/utils';
import { 
  UserProfile, 
  AgeGroup, 
  UserSex, 
  TimeBlock, 
  GoalCategory,
  SkillLevel,
  DifficultyPreference,
  MotivationStyle,
  BadHabit,
  GoodHabitGoal,
} from '@/types';
import { 
  User, 
  Target, 
  Brain, 
  Clock, 
  Heart, 
  Flame,
  ArrowRight, 
  ArrowLeft,
  Check,
  Sparkles,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Building2,
  GraduationCap,
  Home,
  Trophy,
  X,
  Plus
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 'demographics', title: 'About You', icon: User },
  { id: 'schedule', title: 'Your Schedule', icon: Clock },
  { id: 'ultimate-goal', title: 'Ultimate Goal', icon: Target },
  { id: 'bad-habits', title: 'Habits to Change', icon: X },
  { id: 'good-habits', title: 'Habits to Build', icon: Flame },
  { id: 'preferences', title: 'Your Style', icon: Brain },
  { id: 'coach', title: 'Your Coach', icon: Sparkles },
  { id: 'motivation', title: 'Your Why', icon: Heart },
  { id: 'review', title: 'Review', icon: Check },
] as const;

// Industry-leading coach personas
export const COACH_PERSONAS = [
  {
    id: 'tony-robbins',
    name: 'Tony Robbins',
    tagline: 'Unleash the Power Within',
    style: 'Energetic, Motivational',
    image: '/public/icons/coach-tony.png',
    color: 'from-orange-500 to-yellow-400',
  },
  {
    id: 'brendon-burchard',
    name: 'Brendon Burchard',
    tagline: 'High Performance Habits',
    style: 'Encouraging, High-Energy',
    image: '/public/icons/coach-brendon.png',
    color: 'from-green-500 to-emerald-400',
  },
  {
    id: 'mel-robbins',
    name: 'Mel Robbins',
    tagline: '5 Second Rule',
    style: 'Direct, Action-Oriented',
    image: '/public/icons/coach-mel.png',
    color: 'from-pink-500 to-red-400',
  },
  {
    id: 'robin-sharma',
    name: 'Robin Sharma',
    tagline: 'The 5AM Club',
    style: 'Calm, Reflective',
    image: '/public/icons/coach-robin.png',
    color: 'from-blue-500 to-indigo-400',
  },
  {
    id: 'jay-shetty',
    name: 'Jay Shetty',
    tagline: 'Think Like a Monk',
    style: 'Mindful, Insightful',
    image: '/public/icons/coach-jay.png',
    color: 'from-purple-500 to-violet-400',
  },
  {
    id: 'dr-shefali',
    name: 'Dr. Shefali Tsabary',
    tagline: 'Conscious Coaching',
    style: 'Empathetic, Transformational',
    image: '/public/icons/coach-shefali.png',
    color: 'from-teal-500 to-cyan-400',
  },
];

// Card component for coach selector
function CoachCard({ coach, selected, onSelect }: {
  coach: typeof COACH_PERSONAS[number];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative flex flex-col items-center p-4 rounded-2xl border-2 shadow-md transition-all cursor-pointer group',
        selected
          ? 'border-ascend-500 bg-gradient-to-br ' + coach.color + ' text-white scale-105 shadow-lg'
          : 'border-[var(--border)] bg-[var(--surface)] hover:border-ascend-500/60 text-themed'
      )}
      style={{ minWidth: 160, minHeight: 220 }}
    >
      <img
        src={coach.image}
        alt={coach.name}
        className="w-16 h-16 rounded-full object-cover mb-3 border-4 border-white shadow"
        style={{ background: '#fff' }}
      />
      <div className="font-bold text-lg mb-1">{coach.name}</div>
      <div className="text-xs mb-2 opacity-80">{coach.tagline}</div>
      <div className="text-xs italic opacity-70 mb-2">{coach.style}</div>
      {selected && (
        <div className="absolute top-2 right-2 bg-ascend-500 text-white rounded-full p-1 shadow">
          <Check className="w-4 h-4" />
        </div>
      )}
    </button>
  );
}

type StepId = typeof STEPS[number]['id'];

const AGE_GROUPS: { value: AgeGroup; label: string }[] = [
  { value: '13-17', label: '13-17 years' },
  { value: '18-24', label: '18-24 years' },
  { value: '25-34', label: '25-34 years' },
  { value: '35-44', label: '35-44 years' },
  { value: '45-54', label: '45-54 years' },
  { value: '55-64', label: '55-64 years' },
  { value: '65+', label: '65+ years' },
];

const WORK_SCHEDULES = [
  { value: 'standard', label: '9-5 Job', icon: Building2 },
  { value: 'shift', label: 'Shift Work', icon: Clock },
  { value: 'flexible', label: 'Flexible/Remote', icon: Home },
  { value: 'student', label: 'Student', icon: GraduationCap },
  { value: 'retired', label: 'Retired', icon: Sun },
  { value: 'stay-at-home', label: 'Stay at Home', icon: Home },
];

const TIME_BLOCKS: { value: TimeBlock; label: string; icon: React.ElementType }[] = [
  { value: 'early-morning', label: 'Early Morning (5-7am)', icon: Sunrise },
  { value: 'morning', label: 'Morning (7-12pm)', icon: Sun },
  { value: 'afternoon', label: 'Afternoon (12-5pm)', icon: Sun },
  { value: 'evening', label: 'Evening (5-9pm)', icon: Sunset },
  { value: 'night', label: 'Night (9pm+)', icon: Moon },
];

const CATEGORIES: { value: GoalCategory; label: string; icon: string }[] = [
  { value: 'fitness', label: 'Fitness', icon: 'FT' },
  { value: 'health', label: 'Health', icon: 'HL' },
  { value: 'career', label: 'Career', icon: 'CR' },
  { value: 'education', label: 'Education', icon: 'ED' },
  { value: 'finance', label: 'Finance', icon: 'FN' },
  { value: 'relationships', label: 'Relationships', icon: 'RE' },
  { value: 'creativity', label: 'Creativity', icon: 'CV' },
  { value: 'mindfulness', label: 'Mindfulness', icon: 'MD' },
  { value: 'productivity', label: 'Productivity', icon: 'PD' },
];

const DIFFICULTY_OPTIONS: { value: DifficultyPreference; label: string; description: string }[] = [
  { value: 'easy', label: 'Easy Start', description: 'Build momentum with small wins' },
  { value: 'moderate', label: 'Balanced', description: 'Steady progress with challenges' },
  { value: 'challenging', label: 'Push Me', description: 'I thrive under pressure' },
  { value: 'intense', label: 'Intense', description: 'Maximum challenge, maximum growth' },
];

const MOTIVATION_STYLES: { value: MotivationStyle; label: string; description: string }[] = [
  { value: 'accountability', label: 'Accountability', description: 'Partners and community keep me on track' },
  { value: 'rewards', label: 'Rewards', description: 'I love earning rewards and recognition' },
  { value: 'streaks', label: 'Streaks', description: 'Maintaining streaks keeps me motivated' },
  { value: 'competition', label: 'Competition', description: 'I perform better with leaderboards' },
  { value: 'self-improvement', label: 'Self-Improvement', description: 'Becoming my best self drives me' },
];

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

interface DeepOnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
  onSkip?: () => void;
}

export function DeepOnboarding({ onComplete, onSkip }: DeepOnboardingProps) {
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<StepId>('demographics');
  const DRAFT_KEY = 'ascend-onboarding-draft';
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    age: 25,
    ageGroup: '25-34',
    sex: 'prefer-not-to-say',
    wakeUpTime: '07:00',
    sleepTime: '23:00',
    workSchedule: 'standard',
    preferredTimeBlocks: ['morning'],
    availableHoursPerDay: 1,
    skillLevel: 'beginner',
    difficultyPreference: 'moderate',
    motivationStyle: 'accountability',
    constraints: [],
    resources: [],
    hasTriedBefore: false,
    previousChallenges: '',
    biggestMotivation: '',
    badHabitsToLeave: [],
    goodHabitsToDevelop: [],
    ultimateGoal: {
      statement: '',
      category: 'productivity',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      whyItMatters: '',
      successLooksLike: '',
      identityStatement: '',
    },
    supportingGoals: [],
    profileCompleteness: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Bad habit form state
  const [newBadHabit, setNewBadHabit] = useState('');
  const [newGoodHabit, setNewGoodHabit] = useState('');

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
  };

  // Load draft from localStorage if present
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setProfile(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      // ignore parse errors
      console.warn('Failed to load onboarding draft', e);
    }
  }, []);

  const saveDraft = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save onboarding draft', e);
    }
  };

  const clearDraft = () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
  };

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const addBadHabit = () => {
    if (!newBadHabit.trim()) return;
    const habit: BadHabit = {
      id: `bh_${Date.now()}`,
      name: newBadHabit.trim(),
      category: 'other',
      frequency: 'daily',
      triggerSituation: '',
      eliminationTarget: 'reduce-50',
      currentStreak: 0,
    };
    updateProfile({ 
      badHabitsToLeave: [...(profile.badHabitsToLeave || []), habit] 
    });
    setNewBadHabit('');
  };

  const removeBadHabit = (id: string) => {
    updateProfile({
      badHabitsToLeave: profile.badHabitsToLeave?.filter(h => h.id !== id)
    });
  };

  const addGoodHabit = () => {
    if (!newGoodHabit.trim()) return;
    const habit: GoodHabitGoal = {
      id: `gh_${Date.now()}`,
      name: newGoodHabit.trim(),
      category: 'productivity',
      frequency: 'daily',
      preferredTime: 'morning',
      duration: 15,
      whyImportant: 'To improve my life',
      startSmall: 'Do it for 2 minutes',
    };
    updateProfile({
      goodHabitsToDevelop: [...(profile.goodHabitsToDevelop || []), habit]
    });
    setNewGoodHabit('');
  };

  const removeGoodHabit = (id: string) => {
    updateProfile({
      goodHabitsToDevelop: profile.goodHabitsToDevelop?.filter(h => h.id !== id)
    });
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    // Calculate profile completeness
    let completeness = 0;
    if (profile.age) completeness += 10;
    if (profile.wakeUpTime) completeness += 10;
    if (profile.workSchedule) completeness += 10;
    if (profile.ultimateGoal?.statement) completeness += 20;
    if (profile.badHabitsToLeave?.length) completeness += 15;
    if (profile.goodHabitsToDevelop?.length) completeness += 15;
    if (profile.biggestMotivation) completeness += 10;
    if (profile.difficultyPreference) completeness += 10;

    const finalProfile = {
      ...profile,
      profileCompleteness: Math.min(completeness, 100),
    };

    // Prepare payload for Convex mutation
    const payload: Record<string, any> = {
      selectedHabitTemplates: finalProfile.goodHabitsToDevelop?.map(h => h.name),
      preferredTime: finalProfile.preferredTimeBlocks?.[0],
      primaryGoal: finalProfile.ultimateGoal?.statement,
      primaryGoalReason: finalProfile.ultimateGoal?.whyItMatters,
      primaryGoalDeadline: finalProfile.ultimateGoal?.targetDate,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      wakeTime: finalProfile.wakeUpTime,
      sleepTime: finalProfile.sleepTime,
      coachPersona: finalProfile.coachPersona,
    };

    try {
      await completeOnboarding(payload);
      clearDraft();
      onComplete(finalProfile);
    } catch (err: any) {
      setError(err?.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'coach':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-themed mb-2">Choose Your Coach</h2>
              <p className="text-themed-muted">Select the coach whose style best fits your journey. Their persona will guide your motivational messages and coaching tips.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COACH_PERSONAS.map(coach => (
                <CoachCard
                  key={coach.id}
                  coach={coach}
                  selected={profile.coachPersona === coach.id}
                  onSelect={() => updateProfile({ coachPersona: coach.id })}
                />
              ))}
            </div>
            {profile.coachPersona && (
              <div className="mt-6 text-center">
                <span className="inline-block px-4 py-2 rounded-full bg-ascend-500/10 text-ascend-400 font-medium">
                  Selected: {COACH_PERSONAS.find(c => c.id === profile.coachPersona)?.name}
                </span>
              </div>
            )}
          </div>
        );
      case 'demographics':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-themed mb-2">Tell us about yourself</h2>
              <p className="text-themed-muted">This helps us personalize your experience</p>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-themed-secondary mb-3">Age Group</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AGE_GROUPS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => updateProfile({ ageGroup: value })}
                    className={cn(
                      "py-3 px-4 rounded-xl border-2 transition-all text-sm font-medium",
                      profile.ageGroup === value
                        ? "border-ascend-500 bg-ascend-500/10 text-ascend-400"
                        : "border-[var(--border)] hover:border-ascend-500/50 text-themed"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm font-medium text-themed-secondary mb-3">Sex (optional)</label>
              <div className="grid grid-cols-3 gap-2">
                {(['male', 'female', 'prefer-not-to-say'] as UserSex[]).map(sex => (
                  <button
                    key={sex}
                    onClick={() => updateProfile({ sex })}
                    className={cn(
                      "py-3 px-4 rounded-xl border-2 transition-all text-sm font-medium",
                      profile.sex === sex
                        ? "border-ascend-500 bg-ascend-500/10 text-ascend-400"
                        : "border-[var(--border)] hover:border-ascend-500/50 text-themed"
                    )}
                  >
                    {sex === 'prefer-not-to-say' ? "Skip" : sex.charAt(0).toUpperCase() + sex.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-themed mb-2">Your Daily Schedule</h2>
              <p className="text-themed-muted">Help us find the best times for your habits</p>
            </div>

            {/* Wake/Sleep Times */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-themed-secondary mb-2">Wake up</label>
                <input
                  type="time"
                  value={profile.wakeUpTime}
                  onChange={(e) => updateProfile({ wakeUpTime: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-themed-secondary mb-2">Sleep</label>
                <input
                  type="time"
                  value={profile.sleepTime}
                  onChange={(e) => updateProfile({ sleepTime: e.target.value })}
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed"
                />
              </div>
            </div>

            {/* Work Schedule */}
            <div>
              <label className="block text-sm font-medium text-themed-secondary mb-3">Work Schedule</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {WORK_SCHEDULES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => updateProfile({ workSchedule: value as UserProfile['workSchedule'] })}
                    className={cn(
                      "py-3 px-3 rounded-xl border-2 transition-all flex items-center gap-2 text-sm",
                      profile.workSchedule === value
                        ? "border-ascend-500 bg-ascend-500/10 text-ascend-400"
                        : "border-[var(--border)] hover:border-ascend-500/50 text-themed"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Time Blocks */}
            <div>
              <label className="block text-sm font-medium text-themed-secondary mb-3">
                Best times for habits (select all that apply)
              </label>
              <div className="space-y-2">
                {TIME_BLOCKS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => {
                      const current = profile.preferredTimeBlocks || [];
                      const updated = current.includes(value)
                        ? current.filter(t => t !== value)
                        : [...current, value];
                      updateProfile({ preferredTimeBlocks: updated });
                    }}
                    className={cn(
                      "w-full py-3 px-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left",
                      profile.preferredTimeBlocks?.includes(value)
                        ? "border-ascend-500 bg-ascend-500/10"
                        : "border-[var(--border)] hover:border-ascend-500/50"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5",
                      profile.preferredTimeBlocks?.includes(value) ? "text-ascend-400" : "text-themed-muted"
                    )} />
                    <span className={cn(
                      "text-sm",
                      profile.preferredTimeBlocks?.includes(value) ? "text-ascend-400" : "text-themed"
                    )}>
                      {label}
                    </span>
                    {profile.preferredTimeBlocks?.includes(value) && (
                      <Check className="w-4 h-4 text-ascend-400 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Hours */}
            <div>
              <label className="block text-sm font-medium text-themed-secondary mb-3">
                Hours available per day for self-improvement
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.5"
                  value={profile.availableHoursPerDay}
                  onChange={(e) => updateProfile({ availableHoursPerDay: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-lg font-bold text-ascend-400 min-w-[60px]">
                  {profile.availableHoursPerDay}h
                </span>
              </div>
            </div>
          </div>
        );

      case 'ultimate-goal':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-themed mb-2">Your Ultimate Goal</h2>
              <p className="text-themed-muted">What&apos;s the one thing you most want to achieve?</p>
            </div>

            {/* Goal Statement */}
            <div>
              <label className="block text-sm font-medium text-themed-secondary mb-2">
                I want to...
              </label>
              <textarea
                value={profile.ultimateGoal?.statement || ''}
                onChange={(e) => updateProfile({
                  ultimateGoal: { ...profile.ultimateGoal!, statement: e.target.value }
                })}
                placeholder="e.g., Run a marathon and become a fit, confident person"
                rows={3}
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-themed-secondary mb-3">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => updateProfile({
                      ultimateGoal: { ...profile.ultimateGoal!, category: value }
                    })}
                    className={cn(
                      "py-3 px-2 rounded-xl border-2 transition-all text-sm",
                      profile.ultimateGoal?.category === value
                        ? "border-ascend-500 bg-ascend-500/10 text-ascend-400"
                        : "border-[var(--border)] hover:border-ascend-500/50 text-themed"
                    )}
                  >
                    <span className="text-lg">{icon}</span>
                    <p className="mt-1">{label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Identity Statement */}
            <div>
              <label className="block text-sm font-medium text-themed-secondary mb-2">
                Who do you want to become?
              </label>
              <div className="flex items-center gap-2">
                <span className="text-themed-muted">I am a person who...</span>
              </div>
              <input
                type="text"
                value={profile.ultimateGoal?.identityStatement || ''}
                onChange={(e) => updateProfile({
                  ultimateGoal: { ...profile.ultimateGoal!, identityStatement: e.target.value }
                })}
                placeholder="e.g., takes care of their health and never misses a workout"
                className="w-full mt-2 px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed"
              />
            </div>
          </div>
        );

      case 'bad-habits':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-themed mb-2">Habits to Change</h2>
              <p className="text-themed-muted">What habits are holding you back?</p>
            </div>

            {/* Add Bad Habit */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newBadHabit}
                onChange={(e) => setNewBadHabit(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addBadHabit()}
                placeholder="e.g., Scrolling social media, Eating junk food"
                className="flex-1 px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed"
              />
              <button
                onClick={addBadHabit}
                disabled={!newBadHabit.trim()}
                className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Bad Habits List */}
            <div className="space-y-2">
              {profile.badHabitsToLeave?.map(habit => (
                <div
                  key={habit.id}
                  className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <X className="w-5 h-5 text-red-400" />
                  <span className="flex-1 text-themed">{habit.name}</span>
                  <button
                    onClick={() => removeBadHabit(habit.id)}
                    className="p-1 hover:bg-red-500/20 rounded"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
              {!profile.badHabitsToLeave?.length && (
                <p className="text-center text-themed-muted py-8">
                  No bad habits added yet. That&apos;s okay - you can skip this step!
                </p>
              )}
            </div>

            <div className="p-4 bg-[var(--surface)] rounded-xl">
              <p className="text-sm text-themed-muted">
                <strong>Tip:</strong> Focus on 1-3 habits to change at a time. 
                Trying to change too many at once often leads to failure.
              </p>
            </div>
          </div>
        );

      case 'good-habits':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-themed mb-2">Habits to Build</h2>
              <p className="text-themed-muted">What positive habits do you want to develop?</p>
            </div>

            {/* Add Good Habit */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newGoodHabit}
                onChange={(e) => setNewGoodHabit(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addGoodHabit()}
                placeholder="e.g., Exercise daily, Read 20 min, Meditate"
                className="flex-1 px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed"
              />
              <button
                onClick={addGoodHabit}
                disabled={!newGoodHabit.trim()}
                className="px-4 py-3 bg-ascend-500 hover:bg-ascend-600 text-white rounded-xl disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Good Habits List */}
            <div className="space-y-2">
              {profile.goodHabitsToDevelop?.map(habit => (
                <div
                  key={habit.id}
                  className="flex items-center gap-3 p-3 bg-ascend-500/10 border border-ascend-500/20 rounded-xl"
                >
                  <Flame className="w-5 h-5 text-ascend-400" />
                  <span className="flex-1 text-themed">{habit.name}</span>
                  <button
                    onClick={() => removeGoodHabit(habit.id)}
                    className="p-1 hover:bg-red-500/20 rounded"
                  >
                    <X className="w-4 h-4 text-themed-muted" />
                  </button>
                </div>
              ))}
              {!profile.goodHabitsToDevelop?.length && (
                <p className="text-center text-themed-muted py-8">
                  Add habits you want to build. We&apos;ll help you track them daily!
                </p>
              )}
            </div>

            <div className="p-4 bg-[var(--surface)] rounded-xl">
              <p className="text-sm text-themed-muted">
                <strong>Tip:</strong> Start with 2-minute versions of habits. 
                &quot;Read one page&quot; is better than &quot;Read for an hour&quot; when starting out.
              </p>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-themed mb-2">Your Preferences</h2>
              <p className="text-themed-muted">How do you like to work on your goals?</p>
            </div>

            {/* Difficulty Preference */}
            <div>
              <label className="block text-sm font-medium text-themed-secondary mb-3">
                Difficulty Level
              </label>
              <div className="space-y-2">
                {DIFFICULTY_OPTIONS.map(({ value, label, description }) => (
                  <button
                    key={value}
                    onClick={() => updateProfile({ difficultyPreference: value })}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 transition-all text-left",
                      profile.difficultyPreference === value
                        ? "border-ascend-500 bg-ascend-500/10"
                        : "border-[var(--border)] hover:border-ascend-500/50"
                    )}
                  >
                    <p className={cn(
                      "font-medium",
                      profile.difficultyPreference === value ? "text-ascend-400" : "text-themed"
                    )}>
                      {label}
                    </p>
                    <p className="text-sm text-themed-muted mt-1">{description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-sm font-medium text-themed-secondary mb-3">
                Current Skill Level in your goal area
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['beginner', 'intermediate', 'advanced', 'expert'] as SkillLevel[]).map(level => (
                  <button
                    key={level}
                    onClick={() => updateProfile({ skillLevel: level })}
                    className={cn(
                      "py-3 px-2 rounded-xl border-2 transition-all text-sm capitalize",
                      profile.skillLevel === level
                        ? "border-ascend-500 bg-ascend-500/10 text-ascend-400"
                        : "border-[var(--border)] hover:border-ascend-500/50 text-themed"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'motivation':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-themed mb-2">What Drives You?</h2>
              <p className="text-themed-muted">Understanding your motivation helps us support you better</p>
            </div>

            {/* Motivation Style */}
            <div>
              <label className="block text-sm font-medium text-themed-secondary mb-3">
                What motivates you most?
              </label>
              <div className="space-y-2">
                {MOTIVATION_STYLES.map(({ value, label, description }) => (
                  <button
                    key={value}
                    onClick={() => updateProfile({ motivationStyle: value })}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 transition-all text-left",
                      profile.motivationStyle === value
                        ? "border-ascend-500 bg-ascend-500/10"
                        : "border-[var(--border)] hover:border-ascend-500/50"
                    )}
                  >
                    <p className={cn(
                      "font-medium",
                      profile.motivationStyle === value ? "text-ascend-400" : "text-themed"
                    )}>
                      {label}
                    </p>
                    <p className="text-sm text-themed-muted mt-1">{description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Biggest Motivation */}
            <div>
              <label className="block text-sm font-medium text-themed-secondary mb-2">
                Why is achieving this goal important to you?
              </label>
              <textarea
                value={profile.biggestMotivation || ''}
                onChange={(e) => updateProfile({ biggestMotivation: e.target.value })}
                placeholder="Describe your 'why' - what will achieving this goal mean for your life?"
                rows={4}
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed resize-none"
              />
            </div>

            {/* Have Tried Before */}
            <div>
              <label className="block text-sm font-medium text-themed-secondary mb-3">
                Have you tried to achieve this before?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateProfile({ hasTriedBefore: true })}
                  className={cn(
                    "py-3 rounded-xl border-2 transition-all",
                    profile.hasTriedBefore === true
                      ? "border-ascend-500 bg-ascend-500/10 text-ascend-400"
                      : "border-[var(--border)] hover:border-ascend-500/50 text-themed"
                  )}
                >
                  Yes
                </button>
                <button
                  onClick={() => updateProfile({ hasTriedBefore: false })}
                  className={cn(
                    "py-3 rounded-xl border-2 transition-all",
                    profile.hasTriedBefore === false
                      ? "border-ascend-500 bg-ascend-500/10 text-ascend-400"
                      : "border-[var(--border)] hover:border-ascend-500/50 text-themed"
                  )}
                >
                  No, this is new
                </button>
              </div>
            </div>

            {profile.hasTriedBefore && (
              <div>
                <label className="block text-sm font-medium text-themed-secondary mb-2">
                  What challenges did you face before?
                </label>
                <textarea
                  value={profile.previousChallenges || ''}
                  onChange={(e) => updateProfile({ previousChallenges: e.target.value })}
                  placeholder="What got in the way? What would you do differently this time?"
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed resize-none"
                />
              </div>
            )}
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ascend-500 to-ascend-600 
                            flex items-center justify-center mx-auto mb-4 shadow-glow-md">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-themed mb-2">You&apos;re All Set!</h2>
              <p className="text-themed-muted">Here&apos;s a summary of your profile</p>
            </div>

            <div className="space-y-4">
              {/* Goal Summary */}
              {profile.ultimateGoal?.statement && (
                <div className="p-4 bg-ascend-500/10 border border-ascend-500/20 rounded-xl">
                  <p className="text-xs text-ascend-400 font-medium mb-1">YOUR ULTIMATE GOAL</p>
                  <p className="text-themed font-medium">{profile.ultimateGoal.statement}</p>
                  {profile.ultimateGoal.identityStatement && (
                    <p className="text-sm text-themed-muted mt-2">
                      &quot;I am a person who {profile.ultimateGoal.identityStatement}&quot;
                    </p>
                  )}
                </div>
              )}

              {/* Schedule Summary */}
              <div className="p-4 bg-[var(--surface)] rounded-xl">
                <p className="text-xs text-themed-muted font-medium mb-2">SCHEDULE</p>
                <div className="flex items-center gap-4 text-sm text-themed">
                  <span>Wake: {profile.wakeUpTime}</span>
                  <span>Sleep: {profile.sleepTime}</span>
                  <span>{profile.availableHoursPerDay}h/day</span>
                </div>
              </div>

              {/* Habits Summary */}
              {(profile.badHabitsToLeave?.length || profile.goodHabitsToDevelop?.length) ? (
                <div className="grid grid-cols-2 gap-3">
                  {profile.badHabitsToLeave?.length ? (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <p className="text-xs text-red-400 font-medium mb-2">TO CHANGE</p>
                      <ul className="text-sm text-themed space-y-1">
                        {profile.badHabitsToLeave.slice(0, 3).map(h => (
                          <li key={h.id}>• {h.name}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {profile.goodHabitsToDevelop?.length ? (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <p className="text-xs text-green-400 font-medium mb-2">TO BUILD</p>
                      <ul className="text-sm text-themed space-y-1">
                        {profile.goodHabitsToDevelop.slice(0, 3).map(h => (
                          <li key={h.id}>• {h.name}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* Preferences */}
              <div className="p-4 bg-[var(--surface)] rounded-xl">
                <p className="text-xs text-themed-muted font-medium mb-2">PREFERENCES</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-themed">
                    {profile.difficultyPreference} difficulty
                  </span>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-themed">
                    {profile.skillLevel} level
                  </span>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-themed">
                    {profile.motivationStyle} motivation
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ascend-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-themed-muted mb-2">
            <span>Step {currentStepIndex + 1} of {STEPS.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-ascend-500 to-ascend-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-1 mb-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === currentStepIndex;
            const isComplete = i < currentStepIndex;
            return (
              <div
                key={step.id}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                  isActive && "bg-ascend-500 text-white",
                  isComplete && "bg-ascend-500/20 text-ascend-400",
                  !isActive && !isComplete && "bg-[var(--surface)] text-themed-muted"
                )}
              >
                {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
            );
          })}
        </div>

        {/* Content Card */}
        <div className="glass-card p-6 max-h-[60vh] overflow-y-auto">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {currentStepIndex > 0 && (
            <button
              onClick={goBack}
              className="flex-1 py-3 bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-xl 
                       flex items-center justify-center gap-2 text-themed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          
          {currentStep !== 'review' ? (
            <>
              <button
                onClick={goNext}
                className="flex-1 py-3 bg-ascend-500 hover:bg-ascend-600 text-white rounded-xl 
                         flex items-center justify-center gap-2 font-medium transition-colors"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  saveDraft();
                  if (onSkip) onSkip();
                }}
                className="flex-1 py-3 bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-xl 
                         flex items-center justify-center gap-2 text-themed transition-colors"
              >
                Save & Exit
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleComplete}
                className="flex-1 py-3 bg-gradient-to-r from-ascend-500 to-ascend-600 text-white rounded-xl 
                         flex items-center justify-center gap-2 font-bold transition-all shadow-glow-sm hover:shadow-glow-md disabled:opacity-60"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-spin mr-2">⏳</span>
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {loading ? 'Saving...' : 'Start My Journey'}
              </button>
              {error && (
                <div className="mt-2 text-red-500 text-sm text-center">{error}</div>
              )}
            </>
          )}
        </div>

        {/* Skip Option */}
        {onSkip && currentStep !== 'review' && (
          <button
            onClick={onSkip}
            className="w-full mt-4 py-2 text-themed-muted hover:text-themed text-sm transition-colors"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
