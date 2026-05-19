"""
Generate the complete enhanced onboarding page file.
"""
PATH = r"C:\Users\USER\Documents\GOAKL RTRACKER\src\app\onboarding\page.tsx"
import pathlib

# Use a heredoc-style approach with triple quotes
# Build in chunks to avoid issues

PART = r"""'use client';

export const dynamic = 'force-dynamic';

// ============================================================================
// RESURGO - Premium Onboarding Flow with AI Brain Dump Integration
// 4-step wizard: Welcome -> Brain Dump (+ AI Preview) -> Focus -> Ready
// ============================================================================

import {useMutation} from 'convex/react';
import {api} from '../../../convex/_generated/api';
import {useRouter} from 'next/navigation';
import {useState, useEffect, useCallback, useRef} from 'react';
import {useStoreUser} from '@/hooks/useStoreUser';
import {useUser} from '@clerk/nextjs';
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
  Eye,
  EyeOff,
  Loader2,
  Lightbulb,
  Send,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  X,
} from 'lucide-react';

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey =
  !!clerkPublishableKey &&
  clerkPublishableKey.startsWith('pk_') &&
  !/REPLACE_ME|YOUR_PUBLISHABLE_KEY|YOUR_KEY|PLACEHOLDER/i.test(clerkPublishableKey);

const HABIT_TEMPLATE_DATA = {
  'morning-routine': {title: 'Morning Routine', description: 'Start your day with intention', category: 'productivity', frequency: 'daily', timeOfDay: 'morning', estimatedMinutes: 30},
  'exercise-30': {title: 'Exercise 30 min', description: 'Move your body every day', category: 'health', frequency: 'daily', timeOfDay: 'morning', estimatedMinutes: 30},
  'read-20': {title: 'Read 20 pages', description: 'Build a reading habit', category: 'learning', frequency: 'daily', timeOfDay: 'evening', estimatedMinutes: 20},
  'meditate': {title: 'Meditate 10 min', description: 'Find your calm center', category: 'wellness', frequency: 'daily', timeOfDay: 'morning', estimatedMinutes: 10},
  'journal': {title: 'Daily Journal', description: 'Reflect and grow', category: 'wellness', frequency: 'daily', timeOfDay: 'evening', estimatedMinutes: 15},
  'water-8': {title: 'Drink 8 glasses of water', description: 'Stay hydrated all day', category: 'health', frequency: 'daily', timeOfDay: 'anytime', estimatedMinutes: 1},
  'no-phone-bed': {title: 'No phone in bed', description: 'Better sleep starts here', category: 'wellness', frequency: 'daily', timeOfDay: 'evening', estimatedMinutes: 1},
  'learn-new': {title: 'Learn something new', description: '15 min of skill building', category: 'learning', frequency: 'daily', timeOfDay: 'afternoon', estimatedMinutes: 15},
  'gratitude': {title: 'Gratitude practice', description: 'Write 3 things grateful for', category: 'wellness', frequency: 'daily', timeOfDay: 'morning', estimatedMinutes: 5},
  'walk-10k': {title: 'Walk 10,000 steps', description: 'Keep moving through the day', category: 'health', frequency: 'daily', timeOfDay: 'anytime', estimatedMinutes: 60},
  'meal-prep': {title: 'Eat healthy meals', description: 'Nourish your body', category: 'health', frequency: 'daily', timeOfDay: 'anytime', estimatedMinutes: 30},
  'deep-work': {title: 'Deep work session', description: '90 min focused work block', category: 'productivity', frequency: 'weekdays', timeOfDay: 'morning', estimatedMinutes: 90},
};
"""

PART2 = r"""
// -- Types -------------------------------------------------------------------

type Step = 'welcome' | 'brain-dump' | 'focus' | 'ready';
const STEPS: Step[] = ['welcome', 'brain-dump', 'focus', 'ready'];

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

// -- Data --------------------------------------------------------------------

const FOCUS_AREAS: FocusArea[] = [
  { id: 'habits', label: 'Build Better Habits', description: 'Create routines that stick', icon: <Flame className="w-5 h-5" />, color: 'from-orange-500 to-amber-500' },
  { id: 'goals', label: 'Achieve Big Goals', description: 'Break down & conquer goals', icon: <Target className="w-5 h-5" />, color: 'from-blue-500 to-indigo-500' },
  { id: 'adhd', label: 'Get Organized (ADHD)', description: 'Executive function & focus support', icon: <Brain className="w-5 h-5" />, color: 'from-violet-500 to-purple-500' },
  { id: 'health', label: 'Health & Fitness', description: 'Move more, feel better', icon: <Dumbbell className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
  { id: 'productivity', label: 'Boost Productivity', description: 'Get more done, stress less', icon: <Zap className="w-5 h-5" />, color: 'from-yellow-500 to-orange-500' },
  { id: 'learning', label: 'Personal Growth', description: 'Learn & grow every day', icon: <BookOpen className="w-5 h-5" />, color: 'from-purple-500 to-violet-500' },
  { id: 'wellness', label: 'Mental Wellness', description: 'Mindfulness & self-care', icon: <Heart className="w-5 h-5" />, color: 'from-pink-500 to-rose-500' },
];

const HABIT_TEMPLATES = [
  { id: 'morning-routine', name: 'Morning Routine', icon: <Sparkles className="w-5 h-5" />, description: 'Start your day with intention', frequency: 'Daily', focusAreas: ['habits', 'productivity', 'adhd'] },
  { id: 'exercise-30', name: 'Exercise 30 min', icon: <Dumbbell className="w-5 h-5" />, description: 'Move your body every day', frequency: 'Daily', focusAreas: ['health', 'habits'] },
  { id: 'read-20', name: 'Read 20 pages', icon: <BookOpen className="w-5 h-5" />, description: 'Build a reading habit', frequency: 'Daily', focusAreas: ['learning', 'habits'] },
  { id: 'meditate', name: 'Meditate 10 min', icon: <Heart className="w-5 h-5" />, description: 'Find your calm center', frequency: 'Daily', focusAreas: ['wellness', 'habits', 'adhd'] },
  { id: 'journal', name: 'Daily Journal', icon: <Brain className="w-5 h-5" />, description: 'Reflect and grow', frequency: 'Daily', focusAreas: ['wellness', 'learning', 'adhd'] },
  { id: 'water-8', name: 'Drink 8 glasses', icon: <Heart className="w-5 h-5" />, description: 'Stay hydrated all day', frequency: 'Daily', focusAreas: ['health', 'habits', 'adhd'] },
  { id: 'no-phone-bed', name: 'No phone in bed', icon: <Moon className="w-5 h-5" />, description: 'Better sleep starts here', frequency: 'Daily', focusAreas: ['wellness', 'productivity', 'adhd'] },
  { id: 'learn-new', name: 'Learn something new', icon: <Target className="w-5 h-5" />, description: '15 min of skill building', frequency: 'Daily', focusAreas: ['learning', 'goals'] },
  { id: 'gratitude', name: 'Gratitude practice', icon: <Star className="w-5 h-5" />, description: 'Write 3 things grateful for', frequency: 'Daily', focusAreas: ['wellness', 'habits', 'adhd'] },
  { id: 'walk-10k', name: 'Walk 10,000 steps', icon: <Flame className="w-5 h-5" />, description: 'Keep moving through the day', frequency: 'Daily', focusAreas: ['health'] },
  { id: 'meal-prep', name: 'Eat healthy meals', icon: <Heart className="w-5 h-5" />, description: 'Nourish your body', frequency: 'Daily', focusAreas: ['health'] },
  { id: 'deep-work', name: 'Deep work session', icon: <Zap className="w-5 h-5" />, description: '90 min focused work block', frequency: 'Weekdays', focusAreas: ['productivity', 'goals', 'adhd'] },
];

const TIME_OPTIONS = [
  { id: 'early', label: 'Early Bird', description: '5 - 7 AM', icon: <Flame className="w-6 h-6" /> },
  { id: 'morning', label: 'Morning Person', description: '7 - 10 AM', icon: <Sparkles className="w-6 h-6" /> },
  { id: 'afternoon', label: 'Afternoon Riser', description: '12 - 3 PM', icon: <Zap className="w-6 h-6" /> },
  { id: 'evening', label: 'Night Owl', description: '6 - 10 PM', icon: <Moon className="w-6 h-6" /> },
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

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
"""

print(f"Building complete file from {len(PARTS)} chunks...")

# Now add the component function - this is the bulk
# Use exec to construct the full file string
content = PART + PART2
print(f"Parts 1-2: {len(content)} chars")

pathlib.Path(PATH).write_text(content, encoding='utf-8')
print(f"Base written ({len(content)} chars), now appending component...")