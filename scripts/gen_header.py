#!/usr/bin/env python3
"""Write the complete enhanced onboarding page with correct indentation."""
path = r"C:\Users\USER\Documents\GOAKL RTRACKER\src\app\onboarding\page.tsx"

# Build the file as a list of lines with correct indentation
o = []
def L(s=""):
    o.append(s)

# HEADER
L("'use client';")
L("")
L("export const dynamic = 'force-dynamic';")
L("")
L("// ============================================================================")
L("// RESURGO - Premium Onboarding Flow with AI Brain Dump Integration")
L("// 4-step wizard: Welcome -> Brain Dump (+ AI Preview) -> Focus -> Ready")
L("// ============================================================================")
L("")
L("import {useMutation} from 'convex/react';")
L("import {api} from '../../../convex/_generated/api';")
L("import {useRouter} from 'next/navigation';")
L("import {useState, useEffect, useCallback, useRef} from 'react';")
L("import {useStoreUser} from '@/hooks/useStoreUser';")
L("import {useUser} from '@clerk/nextjs';")
L("import {")
for imp in ["  ArrowLeft,","  Check,","  Target,","  Dumbbell,","  BookOpen,","  Heart,","  Zap,","  Sparkles,","  Flame,","  Brain,","  Star,","  Moon,","  Eye,","  EyeOff,","  Loader2,","  Lightbulb,","  Send,","  RefreshCw,","  ChevronDown,","  ChevronUp,","  ChevronRight,","  X,"]:
    L(imp)
L("} from 'lucide-react';")
L("")
L("const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;")
L("const hasValidClerkKey =")
L("  !!clerkPublishableKey &&")
L("  clerkPublishableKey.startsWith('pk_') &&")
L("  !/REPLACE_ME|YOUR_PUBLISHABLE_KEY|YOUR_KEY|PLACEHOLDER/i.test(clerkPublishableKey);")
L("")
L("const HABIT_TEMPLATE_DATA = {")
for item in [
    "'morning-routine': {title: 'Morning Routine', description: 'Start your day with intention', category: 'productivity', frequency: 'daily', timeOfDay: 'morning', estimatedMinutes: 30}",
    "'exercise-30': {title: 'Exercise 30 min', description: 'Move your body every day', category: 'health', frequency: 'daily', timeOfDay: 'morning', estimatedMinutes: 30}",
    "'read-20': {title: 'Read 20 pages', description: 'Build a reading habit', category: 'learning', frequency: 'daily', timeOfDay: 'evening', estimatedMinutes: 20}",
    "'meditate': {title: 'Meditate 10 min', description: 'Find your calm center', category: 'wellness', frequency: 'daily', timeOfDay: 'morning', estimatedMinutes: 10}",
    "'journal': {title: 'Daily Journal', description: 'Reflect and grow', category: 'wellness', frequency: 'daily', timeOfDay: 'evening', estimatedMinutes: 15}",
    "'water-8': {title: 'Drink 8 glasses of water', description: 'Stay hydrated all day', category: 'health', frequency: 'daily', timeOfDay: 'anytime', estimatedMinutes: 1}",
    "'no-phone-bed': {title: 'No phone in bed', description: 'Better sleep starts here', category: 'wellness', frequency: 'daily', timeOfDay: 'evening', estimatedMinutes: 1}",
    "'learn-new': {title: 'Learn something new', description: '15 min of skill building', category: 'learning', frequency: 'daily', timeOfDay: 'afternoon', estimatedMinutes: 15}",
    "'gratitude': {title: 'Gratitude practice', description: 'Write 3 things grateful for', category: 'wellness', frequency: 'daily', timeOfDay: 'morning', estimatedMinutes: 5}",
    "'walk-10k': {title: 'Walk 10,000 steps', description: 'Keep moving through the day', category: 'health', frequency: 'daily', timeOfDay: 'anytime', estimatedMinutes: 60}",
    "'meal-prep': {title: 'Eat healthy meals', description: 'Nourish your body', category: 'health', frequency: 'daily', timeOfDay: 'anytime', estimatedMinutes: 30}",
    "'deep-work': {title: 'Deep work session', description: '90 min focused work block', category: 'productivity', frequency: 'weekdays', timeOfDay: 'morning', estimatedMinutes: 90}",
]:
    L(f"  {item},")
L("};")
L("")
L("// -- Types -------------------------------------------------------------------")
L("")
L("type Step = 'welcome' | 'brain-dump' | 'focus' | 'ready';")
L("const STEPS: Step[] = ['welcome', 'brain-dump', 'focus', 'ready'];")
L("")
L("interface FocusArea {")
L("  id: string;")
L("  label: string;")
L("  description: string;")
L("  icon: React.ReactNode;")
L("  color: string;")
L("}")
L("")
L("interface HabitTemplate {")
L("  id: string;")
L("  name: string;")
L("  icon: React.ReactNode;")
L("  description: string;")
L("  frequency: string;")
L("  focusAreas: string[];")
L("}")
L("")
L("// -- Data --------------------------------------------------------------------")
L("")
L("const FOCUS_AREAS: FocusArea[] = [")
for a in [
    "  { id: 'habits', label: 'Build Better Habits', description: 'Create routines that stick', icon: <Flame className=\"w-5 h-5\" />, color: 'from-orange-500 to-amber-500' },",
    "  { id: 'goals', label: 'Achieve Big Goals', description: 'Break down & conquer goals', icon: <Target className=\"w-5 h-5\" />, color: 'from-blue-500 to-indigo-500' },",
    "  { id: 'adhd', label: 'Get Organized (ADHD)', description: 'Executive function & focus support', icon: <Brain className=\"w-5 h-5\" />, color: 'from-violet-500 to-purple-500' },",
    "  { id: 'health', label: 'Health & Fitness', description: 'Move more, feel better', icon: <Dumbbell className=\"w-5 h-5\" />, color: 'from-green-500 to-emerald-500' },",
    "  { id: 'productivity', label: 'Boost Productivity', description: 'Get more done, stress less', icon: <Zap className=\"w-5 h-5\" />, color: 'from-yellow-500 to-orange-500' },",
    "  { id: 'learning', label: 'Personal Growth', description: 'Learn & grow every day', icon: <BookOpen className=\"w-5 h-5\" />, color: 'from-purple-500 to-violet-500' },",
    "  { id: 'wellness', label: 'Mental Wellness', description: 'Mindfulness & self-care', icon: <Heart className=\"w-5 h-5\" />, color: 'from-pink-500 to-rose-500' },",
]:
    L(a)
L("];")
L("")
L("const HABIT_TEMPLATES = [")
for h in [
    "  { id: 'morning-routine', name: 'Morning Routine', icon: <Sparkles className=\"w-5 h-5\" />, description: 'Start your day with intention', frequency: 'Daily', focusAreas: ['habits', 'productivity', 'adhd'] },",
    "  { id: 'exercise-30', name: 'Exercise 30 min', icon: <Dumbbell className=\"w-5 h-5\" />, description: 'Move your body every day', frequency: 'Daily', focusAreas: ['health', 'habits'] },",
    "  { id: 'read-20', name: 'Read 20 pages', icon: <BookOpen className=\"w-5 h-5\" />, description: 'Build a reading habit', frequency: 'Daily', focusAreas: ['learning', 'habits'] },",
    "  { id: 'meditate', name: 'Meditate 10 min', icon: <Heart className=\"w-5 h-5\" />, description: 'Find your calm center', frequency: 'Daily', focusAreas: ['wellness', 'habits', 'adhd'] },",
    "  { id: 'journal', name: 'Daily Journal', icon: <Brain className=\"w-5 h-5\" />, description: 'Reflect and grow', frequency: 'Daily', focusAreas: ['wellness', 'learning', 'adhd'] },",
    "  { id: 'water-8', name: 'Drink 8 glasses', icon: <Heart className=\"w-5 h-5\" />, description: 'Stay hydrated all day', frequency: 'Daily', focusAreas: ['health', 'habits', 'adhd'] },",
    "  { id: 'no-phone-bed', name: 'No phone in bed', icon: <Moon className=\"w-5 h-5\" />, description: 'Better sleep starts here', frequency: 'Daily', focusAreas: ['wellness', 'productivity', 'adhd'] },",
    "  { id: 'learn-new', name: 'Learn something new', icon: <Target className=\"w-5 h-5\" />, description: '15 min of skill building', frequency: 'Daily', focusAreas: ['learning', 'goals'] },",
    "  { id: 'gratitude', name: 'Gratitude practice', icon: <Star className=\"w-5 h-5\" />, description: 'Write 3 things grateful for', frequency: 'Daily', focusAreas: ['wellness', 'habits', 'adhd'] },",
    "  { id: 'walk-10k', name: 'Walk 10,000 steps', icon: <Flame className=\"w-5 h-5\" />, description: 'Keep moving through the day', frequency: 'Daily', focusAreas: ['health'] },",
    "  { id: 'meal-prep', name: 'Eat healthy meals', icon: <Heart className=\"w-5 h-5\" />, description: 'Nourish your body', frequency: 'Daily', focusAreas: ['health'] },",
    "  { id: 'deep-work', name: 'Deep work session', icon: <Zap className=\"w-5 h-5\" />, description: '90 min focused work block', frequency: 'Weekdays', focusAreas: ['productivity', 'goals', 'adhd'] },",
]:
    L(h)
L("];")
L("")
L("const TIME_OPTIONS = [")
for t in [
    "  { id: 'early', label: 'Early Bird', description: '5 - 7 AM', icon: <Flame className=\"w-6 h-6\" /> },",
    "  { id: 'morning', label: 'Morning Person', description: '7 - 10 AM', icon: <Sparkles className=\"w-6 h-6\" /> },",
    "  { id: 'afternoon', label: 'Afternoon Riser', description: '12 - 3 PM', icon: <Zap className=\"w-6 h-6\" /> },",
    "  { id: 'evening', label: 'Night Owl', description: '6 - 10 PM', icon: <Moon className=\"w-6 h-6\" /> },",
]:
    L(t)
L("];")
L("")
L("const GOAL_EXAMPLES = [")
for g in ["  'Get fit and lose weight',","  'Launch my own business',","  'Learn a new language',","  'Read 24 books this year',","  'Build a morning routine',","  'Land my dream job',","  'Save and invest money',","  'Run a half marathon',"]:
    L(g)
L("];")
L("")
L("const DEADLINE_OPTIONS = [")
for d in ["  { id: '1m', label: '1 month', description: 'Quick win' },","  { id: '3m', label: '3 months', description: 'Short sprint' },","  { id: '6m', label: '6 months', description: 'Mid-term push' },","  { id: '1y', label: '1 year', description: 'Long-game' },","  { id: 'ongoing', label: 'Ongoing', description: 'Lifestyle change' },"]:
    L(d)
L("];")
L("")
L("function cn(...classes) {")
L("  return classes.filter(Boolean).join(' ');")
L("}")
L("")

print(f"Header written: {len(o)} lines")
header_end = len(o)

# Save the header to a temp file
with open(path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(o))
print("Header saved to file, now appending component via Python script...")
print(f"Need to write ~700 more lines for the component")