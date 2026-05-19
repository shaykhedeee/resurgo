#!/usr/bin/env python3
"""Generate the complete enhanced onboarding page with AI brain dump."""
import pathlib

PATH = pathlib.Path(r"C:\Users\USER\Documents\GOAKL RTRACKER\src\app\onboarding\page.tsx")

# Build file content
O = []
L = O.append

# == PART 1: HEADER ==
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
L("  ArrowLeft,")
L("  Check,")
L("  Target,")
L("  Dumbbell,")
L("  BookOpen,")
L("  Heart,")
L("  Zap,")
L("  Sparkles,")
L("  Flame,")
L("  Brain,")
L("  Star,")
L("  Moon,")
L("  Eye,")
L("  EyeOff,")
L("  Loader2,")
L("  Lightbulb,")
L("  Send,")
L("  RefreshCw,")
L("  ChevronDown,")
L("  ChevronUp,")
L("  ChevronRight,")
L("  X,")
L("} from 'lucide-react';")

print(f"Part 1 (header): {len(O)} lines")

# == PART 2: CONSTANTS ==
L("")
L("const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;")
L("const hasValidClerkKey =")
L("  !!clerkPublishableKey &&")
L("  clerkPublishableKey.startsWith('pk_') &&")
L("  !/REPLACE_ME|YOUR_PUBLISHABLE_KEY|YOUR_KEY|PLACEHOLDER/i.test(clerkPublishableKey);")
L("")

HABIT_ITEMS = [
    ("morning-routine","Morning Routine","Start your day with intention","productivity","daily","morning",30),
    ("exercise-30","Exercise 30 min","Move your body every day","health","daily","morning",30),
    ("read-20","Read 20 pages","Build a reading habit","learning","daily","evening",20),
    ("meditate","Meditate 10 min","Find your calm center","wellness","daily","morning",10),
    ("journal","Daily Journal","Reflect and grow","wellness","daily","evening",15),
    ("water-8","Drink 8 glasses of water","Stay hydrated all day","health","daily","anytime",1),
    ("no-phone-bed","No phone in bed","Better sleep starts here","wellness","daily","evening",1),
    ("learn-new","Learn something new","15 min of skill building","learning","daily","afternoon",15),
    ("gratitude","Gratitude practice","Write 3 things grateful for","wellness","daily","morning",5),
    ("walk-10k","Walk 10,000 steps","Keep moving through the day","health","daily","anytime",60),
    ("meal-prep","Eat healthy meals","Nourish your body","health","daily","anytime",30),
    ("deep-work","Deep work session","90 min focused work block","productivity","weekdays","morning",90),
]
L("const HABIT_TEMPLATE_DATA = {")
for k,title,desc,cat,freq,tod,mins in HABIT_ITEMS:
    L(f"  '{k}': {{title: '{title}', description: '{desc}', category: '{cat}', frequency: '{freq}', timeOfDay: '{tod}', estimatedMinutes: {mins}}},")
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
FOCUS_ITEMS = [
    ("habits","Build Better Habits","Create routines that stick","from-orange-500 to-amber-500"),
    ("goals","Achieve Big Goals","Break down & conquer goals","from-blue-500 to-indigo-500"),
    ("adhd","Get Organized (ADHD)","Executive function & focus support","from-violet-500 to-purple-500"),
    ("health","Health & Fitness","Move more, feel better","from-green-500 to-emerald-500"),
    ("productivity","Boost Productivity","Get more done, stress less","from-yellow-500 to-orange-500"),
    ("learning","Personal Growth","Learn & grow every day","from-purple-500 to-violet-500"),
    ("wellness","Mental Wellness","Mindfulness & self-care","from-pink-500 to-rose-500"),
]
L("const FOCUS_AREAS: FocusArea[] = [")
for fid,flabel,fdesc,fcolor in FOCUS_ITEMS:
    L(f"  {{ id: '{fid}', label: '{flabel}', description: '{fdesc}', icon: <Flame className=\"w-5 h-5\" />, color: '{fcolor}' }},")
L("];")
L("")

HABIT_TEMPLATES = [
    ("morning-routine","Morning Routine","Sparkles","w-5 h-5","Start your day with intention","Daily",["habits","productivity","adhd"]),
    ("exercise-30","Exercise 30 min","Dumbbell","w-5 h-5","Move your body every day","Daily",["health","habits"]),
    ("read-20","Read 20 pages","BookOpen","w-5 h-5","Build a reading habit","Daily",["learning","habits"]),
    ("meditate","Meditate 10 min","Heart","w-5 h-5","Find your calm center","Daily",["wellness","habits","adhd"]),
    ("journal","Daily Journal","Brain","w-5 h-5","Reflect and grow","Daily",["wellness","learning","adhd"]),
    ("water-8","Drink 8 glasses","Heart","w-5 h-5","Stay hydrated all day","Daily",["health","habits","adhd"]),
    ("no-phone-bed","No phone in bed","Moon","w-5 h-5","Better sleep starts here","Daily",["wellness","productivity","adhd"]),
    ("learn-new","Learn something new","Target","w-5 h-5","15 min of skill building","Daily",["learning","goals"]),
    ("gratitude","Gratitude practice","Star","w-5 h-5","Write 3 things grateful for","Daily",["wellness","habits","adhd"]),
    ("walk-10k","Walk 10,000 steps","Flame","w-5 h-5","Keep moving through the day","Daily",["health"]),
    ("meal-prep","Eat healthy meals","Heart","w-5 h-5","Nourish your body","Daily",["health"]),
    ("deep-work","Deep work session","Zap","w-5 h-5","90 min focused work block","Weekdays",["productivity","goals","adhd"]),
]
L("const HABIT_TEMPLATES = [")
for hid,hname,hicon,hsz,hdesc,hfreq,hareas in HABIT_TEMPLATES:
    L(f"  {{ id: '{hid}', name: '{hname}', icon: <{hicon} className=\"{hsz}\" />, description: '{hdesc}', frequency: '{hfreq}', focusAreas: {hareas} }},")
L("];")
L("")

TIME_OPTS = [
    ("early","Early Bird","5 - 7 AM","Flame","w-6 h-6"),
    ("morning","Morning Person","7 - 10 AM","Sparkles","w-6 h-6"),
    ("afternoon","Afternoon Riser","12 - 3 PM","Zap","w-6 h-6"),
    ("evening","Night Owl","6 - 10 PM","Moon","w-6 h-6"),
]
L("const TIME_OPTIONS = [")
for tid,tlabel,tdesc,ticon,tsz in TIME_OPTS:
    L(f"  {{ id: '{tid}', label: '{tlabel}', description: '{tdesc}', icon: <{ticon} className=\"{tsz}\" /> }},")
L("];")
L("")

L("const GOAL_EXAMPLES = [")
for g in ["Get fit and lose weight","Launch my own business","Learn a new language","Read 24 books this year","Build a morning routine","Land my dream job","Save and invest money","Run a half marathon"]:
    L(f"  '{g}',")
L("];")
L("")

L("const DEADLINE_OPTIONS = [")
for did,dlabel,ddesc in [("1m","1 month","Quick win"),("3m","3 months","Short sprint"),("6m","6 months","Mid-term push"),("1y","1 year","Long-game"),("ongoing","Ongoing","Lifestyle change")]:
    L(f"  {{ id: '{did}', label: '{dlabel}', description: '{ddesc}' }},")
L("];")
L("")
L("function cn(...classes) { return classes.filter(Boolean).join(' '); }")

print(f"Part 2 (types+data): {len(O)} lines total")

PATH.write_text('\n'.join(O), encoding='utf-8')
print(f"Written to {PATH}: {len('\n'.join(O))} chars")