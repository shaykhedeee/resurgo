STEP0 = """'use client';

export const dynamic = 'force-dynamic';

// ============================================================================
// RESURGO - Premium Onboarding Flow with AI Brain Dump
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
  CornerDownLeft,
  CornerDownRight,
} from 'lucide-react';

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey =
  !!clerkPublishableKey &&
  clerkPublishableKey.startsWith('pk_') &&
  !/REPLACE_ME|YOUR_PUBLISHABLE_KEY|YOUR_KEY|PLACEHOLDER/i.test(clerkPublishableKey);

// Map of habit template IDs to their Convex-compatible data
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

with open(r"C:\Users\USER\Documents\GOAKL RTRACKER\scripts\p0.txt", 'w') as f:
    f.write(STEP0)
print("Part 0 saved")