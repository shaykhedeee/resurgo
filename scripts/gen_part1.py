#!/usr/bin/env python3
"""Write the complete enhanced onboarding page with correct indentation."""
import pathlib

path = pathlib.Path(r"C:\Users\USER\Documents\GOAKL RTRACKER\src\app\onboarding\page.tsx")

O = []  # output lines
L = O.append  # shorthand

# === HEADER ===
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
for imp in ["ArrowLeft","Check","Target","Dumbbell","BookOpen","Heart","Zap",
            "Sparkles","Flame","Brain","Star","Moon","Eye","EyeOff","Loader2",
            "Lightbulb","Send","RefreshCw","ChevronDown","ChevronUp","ChevronRight","X"]:
    L(f"  {imp},")
L("} from 'lucide-react';")
L("")
L("const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;")
L("const hasValidClerkKey =")
L("  !!clerkPublishableKey &&")
L("  clerkPublishableKey.startsWith('pk_') &&")
L("  !/REPLACE_ME|YOUR_PUBLISHABLE_KEY|YOUR_KEY|PLACEHOLDER/i.test(clerkPublishableKey);")
L("")
L("const HABIT_TEMPLATE_DATA = {")
for k,v in [
    ('morning-routine','Morning Routine','Start your day with intention','productivity','daily','morning',30),
    ('exercise-30','Exercise 30 min','Move your body every day','health','daily','morning',30),
    ('read-20','Read 20 pages','Build a reading habit','learning','daily','evening',20),
    ('meditate','Meditate 10 min','Find your calm center','wellness','daily','morning',10),
    ('journal','Daily Journal','Reflect and grow','wellness','daily','evening',15),
    ('water-8','Drink 8 glasses of water','Stay hydrated all day','health','daily','anytime',1),
    ('no-phone-bed','No phone in bed','Better sleep starts here','wellness','daily','evening',1),
    ('learn-new','Learn something new','15 min of skill building','learning','daily','afternoon',15),
    ('gratitude','Gratitude practice','Write 3 things grateful for','wellness','daily','morning',5),
    ('walk-10k','Walk 10,000 steps','Keep moving through the day','health','daily','anytime',60),
    ('meal-prep','Eat healthy meals','Nourish your body','health','daily','anytime',30),
    ('deep-work','Deep work session','90 min focused work block','productivity','weekdays','morning',90),
]:
    L(f"  '{k}': {{title: '{v[0]}', description: '{v[1]}', category: '{v[2]}', frequency: '{v[3]}', timeOfDay: '{v[4]}', estimatedMinutes: {v[5]}}},")
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
L("const FOCUS_AREAS = [")
for a in [
    ('habits','Build Better Habits','Create routines that stick','from-orange-500 to-amber-500'),
    ('goals','Achieve Big Goals','Break down & conquer goals','from-blue-500 to-indigo-500'),
    ('adhd','Get Organized (ADHD)','Executive function & focus support','from-violet-500 to-purple-500'),
    ('health','Health & Fitness','Move more, feel better','from-green-500 to-emerald-500'),
    ('productivity','Boost Productivity','Get more done, stress less','from-yellow-500 to-orange-500'),
    ('learning','Personal Growth','Learn & grow every day','from-purple-500 to-violet-500'),
    ('wellness','Mental Wellness','Mindfulness & self-care','from-pink-500 to-rose-500'),
]:
    L(f"  {{ id: '{a[0]}', label: '{a[1]}', description: '{a[2]}', icon: <Flame className=\"w-5 h-5\" />, color: '{a[3]}' }},")
L("];")
L("")

print(f"Built {len(O)} lines of header/data")
print("Writing to file...")
path.write_text('\n'.join(O), encoding='utf-8')
print(f"Header written: {len('\n'.join(O))} chars")