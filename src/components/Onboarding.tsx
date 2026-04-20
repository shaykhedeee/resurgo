// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Enhanced Deep Life-Profile Onboarding Flow
// AI creates comprehensive user memory for lifelong understanding
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAscendStore } from '@/lib/store';
import { aiGoalDecomposer } from '@/lib/ai-goal-decomposer';
import { analytics } from '@/lib/analytics';
import { cn, getRandomQuote } from '@/lib/utils';
import useVoiceInput from '@/hooks/useVoiceInput';
import { BirthdayEntry, formatDateISO, getNextBirthdayDate, isBirthdayToday, saveBirthdaysToStorage } from '@/lib/birthdays';
import { GoalCategory, UltimateGoal, AIGoalDecompositionRequest, UserProfile, UserSex, AgeGroup, SkillLevel, DifficultyPreference, MotivationStyle, TimeBlock } from '@/types';
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
  Heart,
  Plus,
  X,
  Dumbbell,
  Scale,
  Briefcase,
  DollarSign,
  Users,
  Mic,
  Calendar,
  Lightbulb,
} from 'lucide-react';

type OnboardingStep =
  // Basic Info
  | 'welcome' | 'name' | 'location' | 'about' | 'goal' | 'category'
  // Fitness & Body
  | 'fitness-basics' | 'body-stats' | 'desired-look'
  // Career & Business
  | 'career-business' | 'business-scan'
  // Finance
  | 'budget-expenses' | 'financial-goals'
  // Relationships
  | 'relationships' | 'birthdays'
  // Habits & Values
  | 'habits-good' | 'habits-bad' | 'values-identity'
  // Brain Dump & Goals
  | 'resurgo-story' | 'brain-dump' | 'goals-analysis'
  // Final
  | 'processing' | 'ready' | 'offer';

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

const CATEGORY_ICONS: Record<GoalCategory, string> = {
  fitness: '🏃',
  health: '❤️',
  career: '💼',
  education: '📚',
  finance: '💰',
  relationships: '👥',
  creativity: '🎨',
  mindfulness: '🧘',
  productivity: '⚡',
  custom: '🎯',
};

const CATEGORY_LABELS: Record<GoalCategory, string> = {
  fitness: 'Fitness & Sports',
  health: 'Health & Wellness',
  career: 'Career & Business',
  education: 'Education & Learning',
  finance: 'Finance & Money',
  relationships: 'Relationships',
  creativity: 'Creativity & Arts',
  mindfulness: 'Mindfulness & Spiritual',
  productivity: 'Productivity & Habits',
  custom: 'Custom Goal',
};

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

export function Onboarding() {
  const router = useRouter();
  const { initializeUser, completeOnboarding, addGoal, addHabit, addToast, addTask, updateUserProfile: _updateUserProfile } = useAscendStore();
  
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  
  // Fitness & Body
  const [_height, _setHeight] = useState<number | ''>('');
  const [_weight, _setWeight] = useState<number | ''>('');
  const [_sex, _setSex] = useState<UserSex>('prefer-not-to-say');
  const [_buildType, _setBuildType] = useState<'ectomorph' | 'mesomorph' | 'endomorph' | ''>('');
  const [_desiredLook, _setDesiredLook] = useState('');
  
  // Career & Business
  const [_hasBusiness, _setHasBusiness] = useState<boolean | null>(null);
  const [_businessDescription, _setBusinessDescription] = useState('');
  const [_jobTitle, _setJobTitle] = useState('');
  const [_workSchedule, _setWorkSchedule] = useState<'standard' | 'shift' | 'flexible' | 'student' | 'retired' | 'stay-at-home'>('standard');
  
  // Finance
  const [_monthlyIncome, _setMonthlyIncome] = useState<number | ''>('');
  const [_monthlyExpenses, _setMonthlyExpenses] = useState<number | ''>('');
  const [_financialGoal, _setFinancialGoal] = useState('');
  
  // Relationships
  const [_relationshipStatus, _setRelationshipStatus] = useState<'single' | 'dating' | 'married' | 'divorced' | 'widowed'>('single');
  const [_familySize, _setFamilySize] = useState<number | ''>('');
  
  // Birthdays
  const [_birthdays, _setBirthdays] = useState<BirthdayEntry[]>([]);
  const [_currentBirthday, _setCurrentBirthday] = useState({name: '', relation: '', date: '', notes: ''});
  
  // Habits
  const [_goodHabits, _setGoodHabits] = useState<string[]>([]);
  const [_badHabits, _setBadHabits] = useState<string[]>([]);
  const [_currentGoodHabit, _setCurrentGoodHabit] = useState('');
  const [_currentBadHabit, _setCurrentBadHabit] = useState('');
  
  // Values & Identity
  const [_coreValues, _setCoreValues] = useState<string[]>([]);
  const [_identityStatement, _setIdentityStatement] = useState('');
  const [_currentValue, _setCurrentValue] = useState('');
  
  // Resurgo Story
  const [_resurgoStory, _setResurgoStory] = useState('');
  
  // Brain Dump & Goals
  const [_brainDumpText, _setBrainDumpText] = useState('');
  const [_brainDumpResults, _setBrainDumpResults] = useState<{
    tasks: Array<{ title: string; priority?: string; suggested_due?: string; estimated_minutes?: number; category?: string }>;
    habits_suggested: Array<{ name: string; reason?: string }>;
    emotions_detected: string[];
  } | null>(null);
  const [brainDumpLoading, setBrainDumpLoading] = useState(false);
  const [brainDumpError, setBrainDumpError] = useState<string | null>(null);
  const [goalText, setGoalText] = useState('');
  const [category, setCategory] = useState<GoalCategory>('custom');
  
  // Processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offerTimeLeft, setOfferTimeLeft] = useState(600); // 10 minutes in seconds
  
  // Additional state for missing steps
  const [age, setAge] = useState<number | ''>('');
  const [busynessLevel, setBusynessLevel] = useState<'light' | 'moderate' | 'busy' | 'very_busy'>('moderate');
  const [preferredWorkTimes, setPreferredWorkTimes] = useState<('morning' | 'afternoon' | 'evening' | 'night')[]>([]);
  const [motivation, setMotivation] = useState<'self_improvement' | 'external_goal' | 'accountability' | 'curiosity'>('self_improvement');
  // Static quote for this session
  const [quote] = useState(() => getRandomQuote());
  const [randomExample] = useState(() => GOAL_EXAMPLES[Math.floor(Math.random() * GOAL_EXAMPLES.length)]);

  const {
    isListening,
    isSupported: isVoiceSupported,
    startListening,
    stopListening,
    error: voiceError,
  } = useVoiceInput({
    continuous: true,
    interimResults: true,
    onResult: (text, isFinal) => {
      if (isFinal && text.trim()) {
        _setBrainDumpText((prev) => `${prev}\n${text.trim()}`.trim());
      }
    },
  });

  const addBirthdayAutomation = (birthday: BirthdayEntry) => {
    const nextBirthday = getNextBirthdayDate(birthday.date);
    const giftDate = new Date(nextBirthday);
    giftDate.setDate(giftDate.getDate() - 7);
    const messageDate = new Date(nextBirthday);
    messageDate.setDate(messageDate.getDate() - 1);

    const automationKey = `birthday-automation-${birthday.name}-${nextBirthday.getFullYear()}`;
    if (localStorage.getItem(automationKey)) {
      return;
    }

    addTask({
      title: `Buy a gift for ${birthday.name}`,
      description: `Birthday prep for ${birthday.relation || 'contact'}${birthday.notes ? ` · ${birthday.notes}` : ''}`,
      priority: 'medium',
      status: 'pending',
      dueDate: formatDateISO(giftDate),
      reminderTime: '10:00',
      tags: ['birthday', 'gift', 'relationship'],
      list: 'inbox',
      subtasks: [],
      isStarred: false,
      repeat: 'none',
      xpReward: 20,
      estimatedMinutes: 20,
    });

    addTask({
      title: `Send birthday message to ${birthday.name}`,
      description: `Celebrate ${birthday.name}'s birthday${birthday.notes ? ` · ${birthday.notes}` : ''}`,
      priority: 'high',
      status: 'pending',
      dueDate: formatDateISO(messageDate),
      reminderTime: '09:00',
      tags: ['birthday', 'relationship'],
      list: 'inbox',
      subtasks: [],
      isStarred: true,
      repeat: 'none',
      xpReward: 25,
      estimatedMinutes: 10,
    });

    localStorage.setItem(automationKey, '1');
  };

  const parseBrainDump = async () => {
    if (!_brainDumpText.trim()) {
      return;
    }

    setBrainDumpLoading(true);
    setBrainDumpError(null);

    try {
      const response = await fetch('/api/brain-dump', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: _brainDumpText.trim() }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.success || !payload?.data) {
        throw new Error(payload?.error || 'Failed to parse brain dump');
      }

      const data = payload.data as {
        tasks: Array<{ title: string; priority?: string; suggested_due?: string; estimated_minutes?: number; category?: string }>;
        habits_suggested: Array<{ name: string; reason?: string }>;
        emotions_detected: string[];
      };
      _setBrainDumpResults(data);

      if (data.habits_suggested?.length) {
        const suggestedHabits = data.habits_suggested
          .map((h) => h.name?.trim())
          .filter((h): h is string => !!h);
        if (suggestedHabits.length) {
          _setGoodHabits((prev) => Array.from(new Set([...prev, ...suggestedHabits])));
        }
      }

      if (data.tasks?.length) {
        data.tasks.slice(0, 3).forEach((task) => {
          if (!task.title) return;
          addTask({
            title: task.title,
            priority: task.priority?.toLowerCase() === 'critical' || task.priority?.toLowerCase() === 'high' ? 'high' : 'medium',
            status: 'pending',
            dueDate: task.suggested_due,
            tags: ['brain-dump', task.category?.toLowerCase() || 'general'],
            list: 'inbox',
            subtasks: [],
            isStarred: false,
            repeat: 'none',
            xpReward: 15,
            estimatedMinutes: task.estimated_minutes ?? 20,
            description: 'Auto-captured from your onboarding brain dump',
          });
        });
      }
    } catch (err) {
      setBrainDumpError(err instanceof Error ? err.message : 'Unable to parse brain dump right now');
    } finally {
      setBrainDumpLoading(false);
    }
  };
  
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

  const handleNext = async () => {
    if (step === 'welcome') { setStep('name'); }
    else if (step === 'name' && name.trim()) { setStep('location'); }
    else if (step === 'location') { setStep('about'); }
    else if (step === 'about') { setStep('goal'); }
    else if (step === 'goal' && goalText.trim()) { setStep('category'); }
    else if (step === 'category') { setStep('fitness-basics'); }
    else if (step === 'fitness-basics') { setStep('body-stats'); }
    else if (step === 'body-stats') { setStep('desired-look'); }
    else if (step === 'desired-look') { setStep('career-business'); }
    else if (step === 'career-business') { 
      if (_hasBusiness) setStep('business-scan');
      else setStep('budget-expenses');
    }
    else if (step === 'business-scan') { setStep('budget-expenses'); }
    else if (step === 'budget-expenses') { setStep('financial-goals'); }
    else if (step === 'financial-goals') { setStep('relationships'); }
    else if (step === 'relationships') { setStep('birthdays'); }
    else if (step === 'birthdays') { setStep('habits-good'); }
    else if (step === 'habits-good') { setStep('habits-bad'); }
    else if (step === 'habits-bad') { setStep('values-identity'); }
    else if (step === 'values-identity') { setStep('resurgo-story'); }
    else if (step === 'resurgo-story') { setStep('brain-dump'); }
    else if (step === 'brain-dump') {
      await parseBrainDump();
      setStep('goals-analysis');
    }
    else if (step === 'goals-analysis' && goalText.trim()) { handleCreateProfile(); }
  };

  const handleBack = () => {
    if (step === 'name') setStep('welcome');
    else if (step === 'location') setStep('name');
    else if (step === 'about') setStep('location');
    else if (step === 'goal') setStep('about');
    else if (step === 'category') setStep('goal');
    else if (step === 'fitness-basics') setStep('category');
    else if (step === 'body-stats') setStep('fitness-basics');
    else if (step === 'desired-look') setStep('body-stats');
    else if (step === 'career-business') setStep('desired-look');
    else if (step === 'business-scan') setStep('career-business');
    else if (step === 'budget-expenses') { 
      if (_hasBusiness) setStep('business-scan');
      else setStep('career-business');
    }
    else if (step === 'financial-goals') setStep('budget-expenses');
    else if (step === 'relationships') setStep('financial-goals');
    else if (step === 'birthdays') setStep('relationships');
    else if (step === 'habits-good') setStep('birthdays');
    else if (step === 'habits-bad') setStep('habits-good');
    else if (step === 'values-identity') setStep('habits-bad');
    else if (step === 'resurgo-story') setStep('values-identity');
    else if (step === 'brain-dump') setStep('resurgo-story');
    else if (step === 'goals-analysis') setStep('brain-dump');
    else if (step === 'offer') setStep('ready');
  };

  const handleCreateProfile = async () => {
    setStep('processing');
    setIsProcessing(true);
    setError(null);

    const resolvedAge = typeof age === 'number' && age >= 13 && age <= 100 ? age : 25;
    const resolvedAgeGroup: AgeGroup =
      resolvedAge <= 17 ? '13-17' :
      resolvedAge <= 24 ? '18-24' :
      resolvedAge <= 34 ? '25-34' :
      resolvedAge <= 44 ? '35-44' :
      resolvedAge <= 54 ? '45-54' :
      resolvedAge <= 64 ? '55-64' :
      '65+';

    const resolvedPreferredTimeBlocks: TimeBlock[] = preferredWorkTimes.length
      ? preferredWorkTimes.map((time): TimeBlock => {
          if (time === 'morning') return 'morning';
          if (time === 'afternoon') return 'afternoon';
          if (time === 'evening') return 'evening';
          return 'night';
        })
      : ['morning', 'afternoon'];

    const resolvedMotivationStyle: MotivationStyle =
      motivation === 'self_improvement'
        ? 'self-improvement'
        : motivation === 'accountability'
          ? 'accountability'
          : 'rewards';

    const availableHoursByBusyness: Record<'light' | 'moderate' | 'busy' | 'very_busy', number> = {
      light: 3,
      moderate: 2,
      busy: 1.25,
      very_busy: 0.75,
    };
    const resolvedAvailableHours = availableHoursByBusyness[busynessLevel] ?? 2;

    const resolvedDifficultyPreference: DifficultyPreference =
      busynessLevel === 'very_busy'
        ? 'easy'
        : busynessLevel === 'busy'
          ? 'moderate'
          : 'challenging';

    // Derive wake/sleep times from preferred work windows
    const resolvedWakeUpTime = (() => {
      if (!preferredWorkTimes.length) return '07:00';
      if (preferredWorkTimes.includes('morning'))  return '06:00';
      if (preferredWorkTimes.includes('afternoon')) return '08:00';
      if (preferredWorkTimes.includes('evening'))  return '09:00';
      if (preferredWorkTimes.includes('night'))    return '10:00';
      return '07:00';
    })();

    const resolvedSleepTime = (() => {
      if (!preferredWorkTimes.length) return '23:00';
      if (preferredWorkTimes.includes('night'))    return '02:00';
      if (preferredWorkTimes.includes('evening'))  return '00:00';
      if (preferredWorkTimes.includes('afternoon')) return '23:00';
      if (preferredWorkTimes.includes('morning'))  return '22:00';
      return '23:00';
    })();

    // Initialize user first
    initializeUser(name.trim());

    // Create comprehensive user profile
    const userProfile: UserProfile = {
      // Demographics
      age: resolvedAge,
      ageGroup: resolvedAgeGroup,
      sex: _sex,
      
      // Schedule & Lifestyle
      wakeUpTime: resolvedWakeUpTime,
      sleepTime: resolvedSleepTime,
      workSchedule: _workSchedule,
      preferredTimeBlocks: resolvedPreferredTimeBlocks,
      
      // Goal Configuration
      ultimateGoal: {
        statement: goalText,
        category: category,
        targetDate: addMonths(new Date(), 3).toISOString(),
        whyItMatters: _resurgoStory || 'To rebuild my life and achieve lasting change',
        successLooksLike: `I am ${_identityStatement || 'the best version of myself'}`,
        identityStatement: _identityStatement || `I am someone who ${goalText.toLowerCase()}`,
      },
      supportingGoals: [],
      
      // Habit Transformation
      badHabitsToLeave: _badHabits.map((habit: string, index: number) => ({
        id: `bad-${index}`,
        name: habit,
        category: 'mindset' as const,
        frequency: 'daily' as const,
        triggerSituation: 'Various situations',
        eliminationTarget: 'complete' as const,
        currentStreak: 0,
      })),
      goodHabitsToDevelop: _goodHabits.map((habit: string, index: number) => ({
        id: `good-${index}`,
        name: habit,
        category: 'custom' as const,
        frequency: 'daily' as const,
        preferredTime: 'morning' as const,
        duration: 15, // Default 15 minutes
        whyImportant: `Developing ${habit} to improve my life`,
        startSmall: `Start with 2 minutes of ${habit}`,
      })),
      
      // Capacity & Preferences
      availableHoursPerDay: resolvedAvailableHours,
      skillLevel: 'intermediate' as SkillLevel,
      difficultyPreference: resolvedDifficultyPreference,
      motivationStyle: resolvedMotivationStyle,
      
      // Context & Constraints
      constraints: [],
      resources: [],
      
      // Experience & History
      hasTriedBefore: false,
      previousChallenges: '',
      biggestMotivation: _resurgoStory,
      
      // AI Coach
      coachPersona: 'default',

      // Tracking
      profileCompleteness: 85,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update user profile in store
    _updateUserProfile(userProfile);
    
    // For now, we'll also store it in localStorage as backup
    localStorage.setItem('resurgo-user-profile', JSON.stringify(userProfile));

    const targetDate = addMonths(new Date(), 3);

    const request: AIGoalDecompositionRequest = {
      ultimateGoal: goalText,
      targetDate,
      category,
      currentSkillLevel: 'intermediate',
      availableHoursPerDay: resolvedAvailableHours,
      preferredDifficulty:
        resolvedDifficultyPreference === 'easy'
          ? 'easy'
          : resolvedDifficultyPreference === 'challenging'
            ? 'challenging'
            : 'moderate',
      userAge: resolvedAge,
      busynessLevel,
      preferredWorkTimes: preferredWorkTimes.length ? preferredWorkTimes : ['morning', 'afternoon'],
      motivation,
    };

    // Set a timeout to prevent infinite stuck state
    const timeoutId = setTimeout(() => {
      if (isProcessing) {
        setError('Profile creation is taking longer than expected. Please try again.');
        setStep('goals-analysis');
        setIsProcessing(false);
      }
    }, 15000);

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

      // Store birthdays + automation tasks
      saveBirthdaysToStorage(_birthdays);
      _birthdays.forEach((birthday) => {
        localStorage.setItem(`birthday-${birthday.name}`, JSON.stringify(birthday));
        addBirthdayAutomation(birthday);
      });

      const todaysBirthdays = _birthdays.filter((birthday) => isBirthdayToday(birthday.date));
      if (todaysBirthdays.length > 0) {
        addToast({
          type: 'success',
          title: '🎉 Happy Birthday Day!',
          message: `Today: ${todaysBirthdays.map((b) => b.name).join(', ')}`,
        });
      }

      setStep('ready');
    } catch (_err) {
      setError('Something went wrong creating your profile. Please try again.');
      setStep('goals-analysis');
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
              <p className="text-ascend-500 font-medium mb-2 sm:mb-3 text-sm sm:text-base">Rebuild Your Life</p>
              <p className="text-themed-secondary leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
                AI will deeply understand you through comprehensive profiling. 
                We&apos;ll capture your fitness goals, career aspirations, financial situation, 
                relationships, habits, and what drives you to rebuild your life.
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="p-3 rounded-xl bg-[var(--surface)]">
                  <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-xs text-themed-secondary">Deep AI Understanding</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface)]">
                  <Target className="w-6 h-6 text-ascend-500 mx-auto mb-2" />
                  <p className="text-xs text-themed-secondary">Personalized Action Plans</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface)]">
                  <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <p className="text-xs text-themed-secondary">Birthday Reminders</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface)]">
                  <Trophy className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                  <p className="text-xs text-themed-secondary">Complete Life Transformation</p>
                </div>
              </div>
              
              <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
                Begin Your Transformation
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Name Step */}
          {step === 'name' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-themed text-center mb-2">What&apos;s your name?</h2>
              <p className="text-themed-secondary text-center mb-8">
                Let&apos;s personalize your transformation journey
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

          {/* Location Step */}
          {step === 'location' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-themed text-center mb-2">Where are you located?</h2>
              <p className="text-themed-secondary text-center mb-8">
                This helps AI understand your context and opportunities
              </p>
              
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country (e.g., New York, USA)"
                className="input-primary text-center text-lg mb-8"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
              />
              
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

          {/* About Step */}
          {step === 'about' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-themed text-center mb-2">Tell us about yourself</h2>
              <p className="text-themed-secondary text-center mb-8">
                Help AI understand your lifestyle and create better recommendations
              </p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">
                    How old are you?
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                    placeholder="25"
                    min={13}
                    max={100}
                    className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl
                             text-themed placeholder:text-themed-muted text-center"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">
                    How busy is your schedule?
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
                        <span className="text-lg">{option.emoji}</span>
                        <span className="text-sm font-medium text-themed">{option.label}</span>
                        <span className="text-xs text-themed-muted">{option.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">
                    When do you prefer to work on goals? (select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {WORK_TIME_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          if (preferredWorkTimes.includes(option.value)) {
                            setPreferredWorkTimes(preferredWorkTimes.filter((t) => t !== option.value));
                          } else {
                            setPreferredWorkTimes([...preferredWorkTimes, option.value]);
                          }
                        }}
                        className={cn(
                          "flex flex-col items-center gap-1 px-3 py-3 rounded-xl border transition-all",
                          preferredWorkTimes.includes(option.value)
                            ? "bg-ascend-500/20 border-ascend-500"
                            : "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-hover)]"
                        )}
                      >
                        <span className="text-lg">{option.emoji}</span>
                        <span className="text-sm font-medium text-themed">{option.label}</span>
                        <span className="text-xs text-themed-muted">{option.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">
                    What motivates you most?
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
                        <span className="text-lg">{option.emoji}</span>
                        <span className="text-sm font-medium text-themed">{option.label}</span>
                        <span className="text-xs text-themed-muted">{option.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
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

          {step === 'fitness-basics' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Dumbbell className="w-8 h-8 text-ascend-500" />
                <h2 className="text-2xl font-bold text-themed">Fitness & Body Goals</h2>
              </div>
              <p className="text-themed-secondary text-center mb-8">
                Give Resurgo a baseline so your coaching feels personal, not generic.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">
                    Current body type or frame
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { value: 'ectomorph', label: 'Ectomorph', desc: 'Slim frame, harder to gain size' },
                      { value: 'mesomorph', label: 'Mesomorph', desc: 'Athletic frame, responds fast' },
                      { value: 'endomorph', label: 'Endomorph', desc: 'Softer frame, gains easily' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => _setBuildType(option.value as 'ectomorph' | 'mesomorph' | 'endomorph')}
                        className={cn(
                          'rounded-xl border px-3 py-3 text-left transition-all',
                          _buildType === option.value
                            ? 'bg-ascend-500/20 border-ascend-500'
                            : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-hover)]'
                        )}
                      >
                        <p className="text-sm font-medium text-themed">{option.label}</p>
                        <p className="text-xs text-themed-muted mt-1">{option.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm text-themed mb-1">Fitness context</p>
                  <p className="text-xs text-themed-muted">
                    We use this to shape healthier milestones, realistic body goals, and better habit suggestions.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
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

          {step === 'body-stats' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Scale className="w-8 h-8 text-ascend-500" />
                <h2 className="text-2xl font-bold text-themed">Body Measurements</h2>
              </div>
              <p className="text-themed-secondary text-center mb-8">
                Optional stats help tailor fitness and nutrition guidance.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">Height (cm)</label>
                  <input
                    type="number"
                    value={_height}
                    onChange={(e) => _setHeight(e.target.value ? parseInt(e.target.value, 10) : '')}
                    placeholder="170"
                    min={120}
                    max={250}
                    className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed placeholder:text-themed-muted text-center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={_weight}
                    onChange={(e) => _setWeight(e.target.value ? parseInt(e.target.value, 10) : '')}
                    placeholder="70"
                    min={30}
                    max={300}
                    className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed placeholder:text-themed-muted text-center"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-themed-secondary mb-2">Gender / sex for body-based guidance</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => _setSex(option.value as UserSex)}
                      className={cn(
                        'flex items-center justify-center px-3 py-2 rounded-xl border transition-all',
                        _sex === option.value
                          ? 'bg-ascend-500/20 border-ascend-500'
                          : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-hover)]'
                      )}
                    >
                      <span className="text-sm font-medium text-themed">{option.label}</span>
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

          {step === 'desired-look' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Star className="w-8 h-8 text-gold-400" />
                <h2 className="text-2xl font-bold text-themed">Desired Look & Feel</h2>
              </div>
              <p className="text-themed-secondary text-center mb-8">
                What version of yourself are you moving toward physically?
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">
                    Describe your ideal body, energy, or physical confidence
                  </label>
                  <textarea
                    value={_desiredLook}
                    onChange={(e) => _setDesiredLook(e.target.value)}
                    placeholder="Lean and energetic, stronger shoulders, better posture, healthier skin, more confidence..."
                    className="w-full h-32 px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed placeholder:text-themed-muted resize-none"
                  />
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm text-themed">Examples</p>
                  <p className="text-xs text-themed-muted mt-1">&ldquo;Athletic and lean&rdquo; · &ldquo;less bloated and stronger&rdquo; · &ldquo;look alive again&rdquo;</p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
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

          {step === 'career-business' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Briefcase className="w-8 h-8 text-ascend-500" />
                <h2 className="text-2xl font-bold text-themed">Career & Business</h2>
              </div>
              <p className="text-themed-secondary text-center mb-8">Tell Resurgo about the work side of your life.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">Do you run a business?</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => _setHasBusiness(true)} className={cn('flex items-center justify-center px-4 py-3 rounded-xl border transition-all', _hasBusiness === true ? 'bg-ascend-500/20 border-ascend-500' : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-hover)]')}>
                      <span className="text-sm font-medium text-themed">Yes</span>
                    </button>
                    <button onClick={() => _setHasBusiness(false)} className={cn('flex items-center justify-center px-4 py-3 rounded-xl border transition-all', _hasBusiness === false ? 'bg-ascend-500/20 border-ascend-500' : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-hover)]')}>
                      <span className="text-sm font-medium text-themed">No</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">Job title / current role</label>
                  <input
                    type="text"
                    value={_jobTitle}
                    onChange={(e) => _setJobTitle(e.target.value)}
                    placeholder="Software engineer, founder, student, sales lead..."
                    className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed placeholder:text-themed-muted"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">Work schedule</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'standard', label: 'Standard 9-5' },
                      { value: 'shift', label: 'Shift work' },
                      { value: 'flexible', label: 'Flexible' },
                      { value: 'student', label: 'Student' },
                      { value: 'retired', label: 'Retired' },
                      { value: 'stay-at-home', label: 'Stay at home' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => _setWorkSchedule(option.value as 'standard' | 'shift' | 'flexible' | 'student' | 'retired' | 'stay-at-home')}
                        className={cn('flex items-center justify-center px-3 py-2 rounded-xl border transition-all', _workSchedule === option.value ? 'bg-ascend-500/20 border-ascend-500' : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-hover)]')}
                      >
                        <span className="text-sm font-medium text-themed">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={handleBack} className="btn-secondary flex-1 flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" />Back</button>
                <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">Continue<ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {step === 'business-scan' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Lightbulb className="w-8 h-8 text-gold-400" />
                <h2 className="text-2xl font-bold text-themed">Business Snapshot</h2>
              </div>
              <p className="text-themed-secondary text-center mb-8">
                What are you building, selling, or trying to grow?
              </p>

              <div className="space-y-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">
                    Business description
                  </label>
                  <textarea
                    value={_businessDescription}
                    onChange={(e) => _setBusinessDescription(e.target.value)}
                    placeholder="What do you do, who do you help, where are you stuck, and what would winning look like?"
                    className="w-full h-36 px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed placeholder:text-themed-muted resize-none"
                  />
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

          {step === 'budget-expenses' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <DollarSign className="w-8 h-8 text-ascend-500" />
                <h2 className="text-2xl font-bold text-themed">Budget & Expenses</h2>
              </div>
              <p className="text-themed-secondary text-center mb-8">Give the AI a rough idea of your money reality.</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">Monthly income</label>
                  <input type="number" value={_monthlyIncome} onChange={(e) => _setMonthlyIncome(e.target.value ? parseInt(e.target.value, 10) : '')} placeholder="5000" min={0} className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed placeholder:text-themed-muted text-center" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">Monthly expenses</label>
                  <input type="number" value={_monthlyExpenses} onChange={(e) => _setMonthlyExpenses(e.target.value ? parseInt(e.target.value, 10) : '')} placeholder="3500" min={0} className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed placeholder:text-themed-muted text-center" />
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 mb-6">
                <p className="text-xs text-themed-muted">Rough numbers are fine. This is for guidance, not accounting court.</p>
              </div>

              <div className="flex gap-3">
                <button onClick={handleBack} className="btn-secondary flex-1 flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" />Back</button>
                <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">Continue<ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {step === 'financial-goals' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Target className="w-8 h-8 text-green-400" />
                <h2 className="text-2xl font-bold text-themed">Financial Goal</h2>
              </div>
              <p className="text-themed-secondary text-center mb-8">
                What money win would make life feel lighter?
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">
                    Main financial target
                  </label>
                  <textarea value={_financialGoal} onChange={(e) => _setFinancialGoal(e.target.value)} placeholder="Build emergency savings, clear debt, hit first $10k, stop living paycheck to paycheck..." className="w-full h-28 px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed placeholder:text-themed-muted resize-none" />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
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

          {step === 'relationships' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Users className="w-8 h-8 text-ascend-500" />
                <h2 className="text-2xl font-bold text-themed">Relationships</h2>
              </div>
              <p className="text-themed-secondary text-center mb-8">Human context matters. AI should know who you&apos;re holding life with.</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">Relationship status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'single', label: 'Single' },
                      { value: 'dating', label: 'Dating' },
                      { value: 'married', label: 'Married' },
                      { value: 'divorced', label: 'Divorced' },
                      { value: 'widowed', label: 'Widowed' },
                    ].map((option) => (
                      <button key={option.value} onClick={() => _setRelationshipStatus(option.value as 'single' | 'dating' | 'married' | 'divorced' | 'widowed')} className={cn('flex items-center justify-center px-3 py-2 rounded-xl border transition-all', _relationshipStatus === option.value ? 'bg-ascend-500/20 border-ascend-500' : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-hover)]')}>
                        <span className="text-sm font-medium text-themed">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">Household / family size</label>
                  <input type="number" value={_familySize} onChange={(e) => _setFamilySize(e.target.value ? parseInt(e.target.value, 10) : '')} placeholder="e.g. 3" min={1} max={20} className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed placeholder:text-themed-muted text-center" />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={handleBack} className="btn-secondary flex-1 flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" />Back</button>
                <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">Continue<ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {step === 'birthdays' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Calendar className="w-8 h-8 text-pink-400" />
                <h2 className="text-2xl font-bold text-themed">Birthdays & Important Dates</h2>
              </div>
              <p className="text-themed-secondary text-center mb-8">We’ll auto-create gift/message reminders and show birthday moments on your dashboard.</p>

              <div className="space-y-4 mb-6">
                {_birthdays.map((birthday, index) => (
                  <div key={`${birthday.name}-${birthday.date}-${index}`} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-themed font-medium">{birthday.name}</p>
                      <p className="text-xs text-themed-muted">{birthday.relation} · {birthday.date}{birthday.notes ? ` · ${birthday.notes}` : ''}</p>
                    </div>
                    <button onClick={() => _setBirthdays(_birthdays.filter((_, i) => i !== index))} className="text-red-400 hover:text-red-300 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input value={_currentBirthday.name} onChange={(e) => _setCurrentBirthday({ ..._currentBirthday, name: e.target.value })} placeholder="Name" className="input-primary" />
                <input value={_currentBirthday.relation} onChange={(e) => _setCurrentBirthday({ ..._currentBirthday, relation: e.target.value })} placeholder="Relation" className="input-primary" />
                <input type="date" value={_currentBirthday.date} onChange={(e) => _setCurrentBirthday({ ..._currentBirthday, date: e.target.value })} className="input-primary" />
                <input value={_currentBirthday.notes} onChange={(e) => _setCurrentBirthday({ ..._currentBirthday, notes: e.target.value })} placeholder="Gift ideas / notes" className="input-primary" />
              </div>

              <button
                onClick={() => {
                  if (!_currentBirthday.name.trim() || !_currentBirthday.date) return;
                  const nextBirthdays = [..._birthdays, {
                    name: _currentBirthday.name.trim(),
                    relation: _currentBirthday.relation.trim(),
                    date: _currentBirthday.date,
                    notes: _currentBirthday.notes.trim() || undefined,
                  }];
                  _setBirthdays(nextBirthdays);
                  saveBirthdaysToStorage(nextBirthdays);
                  _setCurrentBirthday({ name: '', relation: '', date: '', notes: '' });
                }}
                className="btn-secondary w-full flex items-center justify-center gap-2 mb-6"
              >
                <Plus className="w-4 h-4" />
                Add Birthday
              </button>

              <div className="rounded-xl border border-pink-500/20 bg-pink-500/10 p-4 mb-6">
                <p className="text-sm text-pink-300 font-medium">Automation included</p>
                <p className="text-xs text-themed-secondary mt-1">Resurgo will create “buy gift” and “send birthday message” tasks automatically.</p>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={handleBack} className="btn-secondary flex-1 flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" />Back</button>
                <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">Continue<ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {step === 'habits-good' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Check className="w-8 h-8 text-ascend-500" />
                <h2 className="text-2xl font-bold text-themed">Good Habits</h2>
              </div>
              <p className="text-themed-secondary text-center mb-8">
                What positive habits do you want to develop?
              </p>
              
              <div className="space-y-4 mb-6">
                {_goodHabits.map((habit, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-[var(--surface)] rounded-xl">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-themed">{habit}</span>
                  </div>
                ))}
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={_currentGoodHabit}
                    onChange={(e) => _setCurrentGoodHabit(e.target.value)}
                    placeholder="e.g., Exercise daily, Read for 30 minutes"
                    className="flex-1 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl
                             text-themed placeholder:text-themed-muted"
                  />
                  <button
                    onClick={() => {
                      if (_currentGoodHabit.trim()) {
                        _setGoodHabits([..._goodHabits, _currentGoodHabit.trim()]);
                        _setCurrentGoodHabit('');
                      }
                    }}
                    className="btn-secondary px-4"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
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

          {step === 'habits-bad' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <X className="w-8 h-8 text-red-500" />
                <h2 className="text-2xl font-bold text-themed">Habits to Break</h2>
              </div>
              <p className="text-themed-secondary text-center mb-8">
                What habits are holding you back?
              </p>
              
              <div className="space-y-4 mb-6">
                {_badHabits.map((habit, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-[var(--surface)] rounded-xl">
                    <X className="w-4 h-4 text-red-500" />
                    <span className="text-themed">{habit}</span>
                  </div>
                ))}
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={_currentBadHabit}
                    onChange={(e) => _setCurrentBadHabit(e.target.value)}
                    placeholder="e.g., Procrastination, Late nights, Junk food"
                    className="flex-1 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl
                             text-themed placeholder:text-themed-muted"
                  />
                  <button
                    onClick={() => {
                      if (_currentBadHabit.trim()) {
                        _setBadHabits([..._badHabits, _currentBadHabit.trim()]);
                        _setCurrentBadHabit('');
                      }
                    }}
                    className="btn-secondary px-4"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
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

          {step === 'values-identity' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Star className="w-8 h-8 text-ascend-500" />
                <h2 className="text-2xl font-bold text-themed">Values & Identity</h2>
              </div>
              <p className="text-themed-secondary text-center mb-8">
                What matters most to you? Who do you want to become?
              </p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">
                    Core Values (add what matters most to you)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={_currentValue}
                      onChange={(e) => _setCurrentValue(e.target.value)}
                      placeholder="e.g., Integrity, Growth, Family"
                      className="flex-1 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl
                               text-themed placeholder:text-themed-muted"
                    />
                    <button
                      onClick={() => {
                        if (_currentValue.trim()) {
                          _setCoreValues([..._coreValues, _currentValue.trim()]);
                          _setCurrentValue('');
                        }
                      }}
                      className="btn-secondary px-4"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {_coreValues.map((value, index) => (
                      <span key={index} className="px-3 py-1 bg-ascend-500/20 text-ascend-600 rounded-full text-sm">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-themed-secondary mb-2">
                    Identity Statement
                  </label>
                  <textarea
                    value={_identityStatement}
                    onChange={(e) => _setIdentityStatement(e.target.value)}
                    placeholder="I am someone who... (e.g., I am a disciplined person who takes care of my health and helps others grow)"
                    className="w-full h-24 px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl
                             text-themed placeholder:text-themed-muted resize-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
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

          {step === 'resurgo-story' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Mountain className="w-8 h-8 text-ascend-500" />
                <h2 className="text-2xl font-bold text-themed">Why Rebuild?</h2>
              </div>
              <p className="text-themed-secondary text-center mb-8">
                What brought you to Resurgo? What life do you want to rebuild?
              </p>
              
              <textarea
                value={_resurgoStory}
                onChange={(e) => _setResurgoStory(e.target.value)}
                placeholder="Share your story... What challenges have you faced? What inspired you to make a change? What does 'rebuilding your life' mean to you?"
                className="w-full h-40 px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl
                         text-themed placeholder:text-themed-muted resize-none"
                autoFocus
              />
              
              <div className="flex gap-3 mt-6">
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

          {step === 'brain-dump' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Brain className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl font-bold text-themed">Brain Dump</h2>
              </div>
              <p className="text-themed-secondary text-center mb-8">
                Pour out everything on your mind. AI will organize it into actionable goals and tasks.
              </p>
              
              <textarea
                value={_brainDumpText}
                onChange={(e) => _setBrainDumpText(e.target.value)}
                placeholder="Everything on your mind right now...

I need to finish the quarterly report by Friday.
My sleep has been terrible lately, waking up at 3am.
I keep forgetting to call the dentist.
Want to start meal prepping but never have time.
That conversation with Sarah is still bothering me.
Should probably update my resume just in case...
The house is a mess and it's stressing me out.
I really want to read more books this year."
                className="w-full h-48 px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl
                         text-themed placeholder:text-themed-muted resize-none"
                autoFocus
              />
              
              <div className="flex flex-wrap items-center gap-2 mt-4 mb-4">
                <button
                  type="button"
                  onClick={() => (isListening ? stopListening() : startListening())}
                  disabled={!isVoiceSupported || brainDumpLoading}
                  className={cn('btn-secondary flex items-center gap-2', (!isVoiceSupported || brainDumpLoading) && 'opacity-50 cursor-not-allowed')}
                >
                  <Mic className="w-4 h-4" />
                  {isListening ? 'Stop voice capture' : 'Start voice capture'}
                </button>
                <span className="text-sm text-themed-secondary">
                  {isVoiceSupported ? 'Speak naturally — transcript appends into the dump.' : 'Voice input unavailable in this browser.'}
                </span>
              </div>

              {voiceError && <p className="text-xs text-red-400 mb-3">{voiceError}</p>}
              {brainDumpError && <p className="text-xs text-red-400 mb-3">{brainDumpError}</p>}

              {_brainDumpResults && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 mb-6">
                  <p className="text-sm font-medium text-themed mb-2">AI picked up:</p>
                  <p className="text-xs text-themed-muted mb-2">{_brainDumpResults.tasks.length} tasks · {_brainDumpResults.habits_suggested.length} habits · {_brainDumpResults.emotions_detected.length} emotions</p>
                  {_brainDumpResults.tasks.slice(0, 3).map((task, index) => (
                    <div key={`${task.title}-${index}`} className="text-xs text-themed-secondary py-1">• {task.title}</div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-3">
                <button onClick={handleBack} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button onClick={handleNext} disabled={brainDumpLoading} className={cn('btn-primary flex-1 flex items-center justify-center gap-2', brainDumpLoading && 'opacity-70 cursor-wait')}>
                  {brainDumpLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze My Thoughts
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
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
              <h2 className="text-2xl font-bold text-themed text-center mb-2">
                What category best fits your goal?
              </h2>
              <p className="text-themed-secondary text-center mb-8">
                This helps AI create more relevant milestones and habits
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

          {/* Goals Analysis Step */}
          {step === 'goals-analysis' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Target className="w-8 h-8 text-ascend-500" />
                <h2 className="text-2xl font-bold text-themed">Review Your Goal</h2>
              </div>
              <p className="text-themed-secondary text-center mb-8">
                Let&apos;s make sure everything looks good before we create your plan
              </p>
              
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] mb-6">
                <p className="text-xs text-themed-muted mb-2">YOUR GOAL</p>
                <p className="text-themed font-medium mb-2">{goalText}</p>
                <p className="text-xs text-themed-muted mb-2">CATEGORY</p>
                <p className="text-themed font-medium">{CATEGORY_LABELS[category]}</p>
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
                    <span className="text-2xl font-bold text-themed">$4.99</span>
                    <span className="text-themed-muted">/month</span>
                    <span className="text-xs text-themed-muted">or $29.99/year</span>
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
                    <p className="font-bold text-themed">$49.99</p>
                    <p className="text-xs text-green-400">Founding lifetime price</p>
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
                  5 habits/day • 3 goals • Basic features
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
