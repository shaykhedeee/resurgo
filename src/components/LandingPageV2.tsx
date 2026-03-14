'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PixelIcon, type PixelIconName } from '@/components/PixelIcon';
import { MarketingHeader } from '@/components/MarketingHeader';
import { ScrollToTop } from '@/components/ScrollToTop';
import { TerminalDemo } from '@/components/TerminalDemo';
import { MarketingFooter } from '@/components/MarketingFooter';
// DemoSandbox available for future interactive demos
import InteractiveDemoCarousel from '@/components/marketing/InteractiveDemoCarousel';
import SocialProof from '@/components/marketing/SocialProof';

import ExitIntent from '@/components/marketing/ExitIntent';
import StickyCTA from '@/components/marketing/StickyCTA';
import { CookieConsent } from '@/components/CookieConsent';
import { TermLinkButton } from '@/components/ui/TermButton';
import { captureUtmParams, trackMarketingEvent } from '@/lib/marketing/analytics';
import { getExperimentVariant, trackExperimentExposure } from '@/lib/marketing/experiments';
import {
  TerminalWindow,
  StatusBar,
  ProgressBar,
  KeyboardHints,
  SparklineBars,
} from '@/components/terminal';
import type { TerminalLine, StatusItem, KeyHint } from '@/components/terminal';

/* ═══════════════════════════════════════════════════════════════════════════
   RESURGO :: LANDING PAGE v2.1 — Enhanced
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── FEATURES (12 core capabilities) ────────────────────────────────────────
const CORE_FEATURES = [
  {
    id: 'AI_GOAL_ENGINE',
    title: 'AI Goal Breakdown',
    description:
      'Enter any goal. The AI generates milestones, weekly targets, and daily tasks in seconds — no planning expertise needed.',
    status: 'Live',
    category: 'Planning',
    icon: 'goals' as PixelIconName,
    terminalCmd: '> plan --goal "launch startup"',
  },
  {
    id: 'HABIT_SYSTEM',
    title: 'Habit Tracker & Stacks',
    description:
      'Build habits that stick. Track streaks, completion rates, consistency patterns, and chain habits into stacks.',
    status: 'Live',
    category: 'Habits',
    icon: 'loop' as PixelIconName,
    terminalCmd: '> track --habits --streak',
  },
  {
    id: 'FOCUS_ENGINE',
    title: 'Focus Sessions',
    description:
      'Run Pomodoro, Deep Work, or Flowtime sessions. Log distractions, play ambient sounds, and track total focus hours.',
    status: 'Live',
    category: 'Focus',
    icon: 'timer' as PixelIconName,
    terminalCmd: '> focus --mode deepwork --90min',
  },
  {
    id: 'AI_COACHING',
    title: '8 Specialized AI Coaches',
    description:
      'Chat with MARCUS (Strategy), AURORA (Wellness), TITAN (Performance), SAGE (Wealth), PHOENIX (Resilience), NOVA (Systems), ORACLE (Life Architect), or NEXUS (Integration). Each coach has a distinct approach. Advice personalized to your goals, 24/7.',
    status: 'Live',
    category: 'AI',
    icon: 'robot' as PixelIconName,
    terminalCmd: '> coach --ask @TITAN "next step"',
  },
  {
    id: 'DAILY_PLANNER',
    title: 'Daily Planning',
    description:
      'Plan your day with AI-assisted task prioritization. See habits, tasks, and sessions in one clear timeline.',
    status: 'Live',
    category: 'Planning',
    icon: 'plan' as PixelIconName,
    terminalCmd: '> plan --today --prioritize',
  },
  {
    id: 'DASHBOARD',
    title: 'Unified Dashboard',
    description:
      'Goals, habits, tasks, wellness, budget, and planning — one clean interface. No more switching between apps.',
    status: 'Live',
    category: 'Core',
    icon: 'dashboard' as PixelIconName,
    terminalCmd: '> dash --overview --all',
  },
  {
    id: 'WELLNESS_TRACK',
    title: 'Wellness & Sleep',
    description:
      'Track mood, energy, sleep quality, and recovery. See how your lifestyle patterns affect productivity over time.',
    status: 'Live',
    category: 'Wellness',
    icon: 'moon' as PixelIconName,
    terminalCmd: '> wellness --log mood energy sleep',
  },
  {
    id: 'GAMIFICATION',
    title: 'XP & Levels',
    description:
      'Earn XP for completing habits and tasks. Level up, unlock badges, and maintain streaks that keep you motivated.',
    status: 'Live',
    category: 'Motivation',
    icon: 'trophy' as PixelIconName,
    terminalCmd: '> xp --leaderboard --badges',
  },
  {
    id: 'WEEKLY_REVIEW',
    title: 'AI Weekly Reviews',
    description:
      'Get AI-generated weekly summaries. See what worked, what didn\'t, and receive personalized focus recommendations.',
    status: 'Live',
    category: 'Analytics',
    icon: 'analytics' as PixelIconName,
    terminalCmd: '> review --weekly --insights',
  },
  {
    id: 'NUTRITION_LOG',
    title: 'Nutrition Tracking',
    description:
      'Log meals and track macros. Connect nutrition data to energy levels and correlate with performance goals.',
    status: 'Live',
    category: 'Wellness',
    icon: 'heart' as PixelIconName,
    terminalCmd: '> nutrition --log --macros',
  },
  {
    id: 'TELEGRAM_BOT',
    title: 'Telegram Integration',
    description:
      'Check in on habits, receive reminders, and log progress from Telegram. Stay consistent without opening the app.',
    status: 'Live',
    category: 'Integration',
    icon: 'message' as PixelIconName,
    terminalCmd: '> telegram --checkin --notify',
  },
  {
    id: 'DATA_SECURITY',
    title: 'Encrypted & Private',
    description:
      'Your data is encrypted, synced in real-time, and preserved across plan changes. Privacy-first — no data selling.',
    status: 'Secure',
    category: 'Security',
    icon: 'check' as PixelIconName,
    terminalCmd: '> security --encrypt --private',
  },
];

// ─── METRICS ────────────────────────────────────────────────────────────────
const METRICS = [
  { value: '8', label: 'AI coaches available' },
  { value: '28', label: 'goal templates' },
  { value: '100%', label: 'free to start' },
  { value: '<2 min', label: 'to first plan' },
];

// ─── TESTIMONIALS (6 reviews) ───────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'M. Chen',
    role: 'Founder & CEO',
    quote:
      'I stopped juggling five apps. Resurgo gave me one clean workflow for planning, execution, and review. My team noticed the difference within weeks.',
    outcome: '3 launches in 1 quarter',
  },
  {
    name: 'J. Park',
    role: 'Freelance Designer',
    quote:
      'Simple enough to use daily, powerful enough to keep me consistent when motivation dips. The AI coaching feels like having an accountability partner.',
    outcome: '127-day consistency streak',
  },
  {
    name: 'A. Thompson',
    role: 'Medical Student',
    quote:
      'I use it for study plans, habits, and recovery tracking. It helps me prioritize what matters each day without overthinking.',
    outcome: 'Top 10% class performance',
  },
  {
    name: 'S. Rodriguez',
    role: 'Marketing Manager',
    quote:
      'The focus timer changed how I work. I went from scattered multitasking to deep work blocks. My output doubled in two months.',
    outcome: '2x output in 60 days',
  },
  {
    name: 'K. Nakamura',
    role: 'Software Engineer',
    quote:
      'I tried every productivity app out there. Resurgo is the first one I stuck with past 30 days. The gamification keeps me coming back.',
    outcome: 'Shipped 2 side projects',
  },
  {
    name: 'L. Okafor',
    role: 'Graduate Researcher',
    quote:
      'The weekly reviews are gold. Having AI summarize my progress and suggest adjustments saved me from burnout during thesis season.',
    outcome: 'Thesis completed 3 wks early',
  },
];

// ─── FAQ (10 questions) ─────────────────────────────────────────────────────
const FAQS = [
  {
    question: 'What is Resurgo and how does it work?',
    answer:
      'Resurgo is an AI productivity assistant and life command center. You capture a goal, task list, or messy brain dump, and Resurgo turns it into milestones, daily tasks, habits, focus blocks, and guided reviews. It works on desktop and mobile as a Progressive Web App — no download required.',
  },
  {
    question: 'How long does it take to get started?',
    answer:
      'Most people finish setup in under two minutes. Pick your focus area, define one goal, and get a personalized plan you can start following today.',
  },
  {
    question: 'Is Resurgo really free?',
    answer:
      'Yes. The free plan includes habit tracking, goal setting, focus timers, and daily AI coaching messages. There is no time limit. Upgrade to Pro only when you want unlimited features and advanced analytics.',
  },
  {
    question: 'Will I lose my data if I change plans?',
    answer:
      'No. Your habit history, streak data, goals, and journal entries are preserved when you upgrade or downgrade. Nothing gets deleted.',
  },
  {
    question: 'Can I use Resurgo on my phone?',
    answer:
      'Yes. Resurgo is a fully responsive Progressive Web App (PWA). On iOS, open Safari, tap the Share button, then "Add to Home Screen." On Android, open Chrome and tap "Add to Home Screen" from the menu. It installs instantly, works offline, and feels like a native app — no app store required. The Telegram bot also lets you check in on habits from any device.',
  },
  {
    question: 'What focus timer modes are available?',
    answer:
      'Resurgo includes Pomodoro (25/5 cycles), Deep Work (configurable blocks), and Flowtime (open-ended with break prompts). All modes track distractions, include ambient soundscapes, and log your total focus hours.',
  },
  {
    question: 'How does AI coaching work?',
    answer:
      'You choose from 8 specialized AI coaches, each with a unique personality and approach — from Stoic philosophy to creative energy. Coaches respond based on your goals, habits, and recent progress. Two coaches are free; the rest unlock with a Pro plan. ORACLE and NEXUS are premium agents for Yearly/Lifetime members.',
  },
  {
    question: 'Is my data private and secure?',
    answer:
      'Absolutely. Your data is encrypted in transit and at rest. We do not sell or share your personal data. Your information stays yours — always.',
  },
  {
    question: 'How do I install Resurgo on my phone?',
    answer:
      'Resurgo is a Progressive Web App — no app store download needed. On iOS (Safari): tap the Share icon → "Add to Home Screen" → Add. On Android (Chrome): tap the three-dot menu → "Add to Home Screen" → Install. It installs in seconds, works offline, receives automatic updates, and uses under 1MB of storage.',
  },
  {
    question: 'What is the best free AI habit tracker in 2026?',
    answer:
      'Resurgo is one of the top free AI productivity assistants available in 2026. Unlike basic trackers, Resurgo combines AI task planning, daily execution support, focus timers, review loops, and habit tracking in one workflow — all on the free plan with no time limit.',
  },
  {
    question: 'Does Resurgo work offline?',
    answer:
      'Yes. When installed as a Progressive Web App, Resurgo works offline. New tasks and brain dumps can be captured locally and sync automatically when you reconnect, alongside your recent app data.',
  },
  {
    question: 'Can AI really help me build habits?',
    answer:
      'Yes. Research shows that specific implementation intentions (if-when-then plans) significantly increase habit follow-through. Resurgo\'s AI turns vague goals into concrete daily habits with context and timing, provides accountability through streaks and check-ins, and adapts your plan when you miss days — addressing the three core reasons habits fail: vagueness, lack of feedback, and all-or-nothing thinking.',
  },
  {
    question: 'How is Resurgo different from Habitica, Streaks, or Notion?',
    answer:
      'Habitica focuses on gamification without AI planning. Streaks is habit-only with no goal decomposition. Notion requires manual setup with no AI automation. Resurgo combines all use cases: AI goal breakdown, habit tracking with streaks, focus timers (Pomodoro/Deep Work/Flowtime), 4 AI coaching personas, wellness tracking, and weekly AI reviews — all connected in one workflow, with a generous free plan.',
  },
  {
    question: 'How long does it take to set up Resurgo?',
    answer:
      'Under 2 minutes. Create a free account, pick your primary focus (health, productivity, finance, etc.), enter one goal, and Resurgo\'s AI generates your first action plan. You can start your first habit check-in on day one without any lengthy configuration.',
  },
  {
    question: 'What makes Resurgo different from other habit trackers?',
    answer:
      'Resurgo combines goal planning, habit tracking, focus sessions, AI coaching, wellness monitoring, gamification, and daily planning in one app. Most tools only handle one or two of these. We built everything into a single workflow so you never need to switch apps.',
  },
];

// ─── TICKER ─────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  'AI-POWERED GOAL PLANNING',
  'HABIT STREAKS & STACKING',
  'FOCUS TIMER (POMODORO / DEEP WORK)',
  '8 AI COACHING PERSONAS',
  'DAILY & WEEKLY PLANNING',
  'GAMIFICATION & XP SYSTEM',
  'TELEGRAM BOT INTEGRATION',
  'ADD TO HOMESCREEN — ANY DEVICE, NO APP STORE NEEDED',
  'WELLNESS & SLEEP TRACKING',
  'NUTRITION & RECOVERY LOGS',
];

// ─── ONBOARDING STEPS ───────────────────────────────────────────────────────
const _BOOT_STEPS = [
  {
    step: '01',
    cmd: 'Set your goal',
    desc: 'Pick one clear goal — lose weight, learn a skill, build a business. Resurgo helps you get specific and focused.',
  },
  {
    step: '02',
    cmd: 'Get your AI plan',
    desc: 'The AI breaks your goal into milestones, suggests habits, and builds a daily roadmap personalized to your schedule.',
  },
  {
    step: '03',
    cmd: 'Execute daily',
    desc: 'Track habits, run focus sessions, chat with your AI coach, and review progress weekly. Consistency compounds into results.',
  },
];

// ─── PRICING ────────────────────────────────────────────────────────────────
const ACCESS_TIERS = [
  {
    tier: 'FREE',
    price: { monthly: '$0', annual: '$0' },
    period: { monthly: '/forever', annual: '/forever' },
    specs: [
      'Unlimited habits & goals',
      'Focus timer (all modes)',
      '2 AI coaches (Marcus & Aurora)',
      'Daily planning',
      'Basic analytics',
      'Mobile PWA access',
    ],
    cta: 'START FREE',
    highlight: false,
    earlyAccess: false,
  },
  {
    tier: 'PRO',
    price: { monthly: '$4.99', annual: '$2.49' },
    period: { monthly: '/month', annual: '/month' },
    annualBilled: '$29.99/yr',
    savings: 'SAVE $29.88/yr',
    specs: [
      'Everything in Free',
      'All 8 AI coaches unlocked',
      'Advanced analytics & insights',
      'Weekly AI reviews',
      'Priority support',
      'Telegram bot access',
      'Proactive coach notifications',
    ],
    cta: 'UPGRADE TO PRO',
    highlight: true,
    earlyAccess: false,
  },
  {
    tier: 'LIFETIME',
    price: { monthly: '$49.99', annual: '$49.99' },
    period: { monthly: 'one-time', annual: 'one-time' },
    earlyAccess: true,
    originalPrice: '$89.99',
    spotsLeft: 1000,
    specs: [
      'Everything in Pro',
      'Pay once, use forever',
      'All future updates included',
      'Founding member badge',
    ],
    cta: 'CLAIM FOUNDING PRICE',
    highlight: false,
  },
];

// ─── AI COACHES ─────────────────────────────────────────────────────────────
const AI_COACHES = [
  {
    name: 'MARCUS',
    style: 'Stoic Strategist',
    desc: 'Discipline, goals, and long-term strategy. Marcus builds frameworks that turn intentions into unbreakable commitments.',
    free: true,
    accent: 'yellow',
  },
  {
    name: 'AURORA',
    style: 'Mindful Catalyst',
    desc: 'Wellness, mindfulness, and emotional intelligence. Aurora helps you build inner peace alongside outer performance.',
    free: true,
    accent: 'purple',
  },
  {
    name: 'TITAN',
    style: 'Physical Performance',
    desc: 'Your body is the foundation. Titan creates workout plans, nutrition protocols, and energy optimization systems — all action-capable.',
    free: false,
    accent: 'red',
  },
  {
    name: 'SAGE',
    style: 'Financial Alchemist',
    desc: 'Every dollar is a soldier. Sage builds financial plans, savings goals, career roadmaps, and compound growth strategies.',
    free: false,
    accent: 'green',
  },
  {
    name: 'PHOENIX',
    style: 'Comeback Specialist',
    desc: 'Built for resilience. Phoenix creates recovery plans, micro-step momentum systems, and turns setbacks into structured comebacks.',
    free: false,
    accent: 'orange',
  },
  {
    name: 'NOVA',
    style: 'Creative Systems',
    desc: 'Thinks in systems, leverage points, and second-order effects. Nova designs complete plans for learning, creativity, and innovation.',
    free: false,
    accent: 'cyan',
  },
  {
    name: 'ORACLE',
    style: 'Life Architect',
    desc: 'Synthesises all coach wisdom. Oracle sees your entire system, audits what isn\'t working, and rewrites your full strategy.',
    free: false,
    accent: 'orange',
  },
  {
    name: 'NEXUS',
    style: 'Integration Engine',
    desc: 'Merges mind, body, finance, and creativity into one adaptive engine. Nexus builds custom neural mastery stacks with no limits.',
    free: false,
    accent: 'pink',
  },
];

// ─── HOW TO ACHIEVE YOUR GOALS ─────────────────────────────────────────────
const ACHIEVEMENT_STEPS = [
  {
    num: '01',
    title: 'Clarity',
    subtitle: 'Define what success looks like',
    desc: 'Stop chasing vague ambitions. Use AI to turn "get fit" into a specific, measurable, time-bound plan with milestones you can track.',
  },
  {
    num: '02',
    title: 'Consistency',
    subtitle: 'Build daily systems that work',
    desc: 'Goals are achieved through daily habits, not motivation spikes. Resurgo helps you build a routine that compounds over weeks and months.',
  },
  {
    num: '03',
    title: 'Accountability',
    subtitle: 'Stay on track with AI coaching',
    desc: 'Your AI coach checks in, tracks your progress, and provides personalized advice when you struggle. Like a coach that never sleeps.',
  },
  {
    num: '04',
    title: 'Reflection',
    subtitle: 'Review, adjust, and grow',
    desc: 'Weekly AI reviews show what worked and what didn\'t. Continuous refinement ensures you\'re always moving toward your goal efficiently.',
  },
];

// ─── HERO TERMINAL LINES (auto-typed in TerminalWindow) ─────────────────────
const HERO_TERMINAL_LINES: TerminalLine[] = [
  { id: 'h1', type: 'command',  text: 'resurgo init --goal "launch startup"' },
  { id: 'h2', type: 'system',   text: '✦ Analyzing goal complexity…',         delay: 300 },
  { id: 'h3', type: 'success',  text: '→ 4 milestones generated',             delay: 200 },
  { id: 'h4', type: 'success',  text: '→ 12 weekly targets created',          delay: 150 },
  { id: 'h5', type: 'success',  text: '→ 37 daily tasks queued',              delay: 150 },
  { id: 'h6', type: 'info',     text: '↳ Coach NOVA assigned (Systems)',      delay: 200 },
  { id: 'h7', type: 'command',  text: 'resurgo status --today',               delay: 600 },
  { id: 'h8', type: 'output',   text: '  Habits: 3/5  │  Focus: 2.1h  │  XP: +340', delay: 200 },
  { id: 'h9', type: 'success',  text: '✓ Day 1 plan ready. Execute with: resurgo start', delay: 300 },
];

const HERO_STATUS_LEFT: StatusItem[] = [
  { id: 'hs1', dot: 'online',  label: 'SYSTEM', value: 'READY' },
  { id: 'hs2', label: 'CYCLE',  value: 'DAY_1' },
  { id: 'hs3', label: 'v2.4.1' },
];

const HERO_STATUS_RIGHT: StatusItem[] = [
  { id: 'hr1', label: 'INTEGRITY', value: '89%', color: 'text-[var(--term-green)]' },
  { id: 'hr2', label: 'XP',        value: '2,340', color: 'text-[var(--term-orange)]' },
];

const HERO_KEY_HINTS: KeyHint[] = [
  { id: 'k1', key: 'Enter', label: 'execute' },
  { id: 'k2', key: '↑↓',   label: 'history' },
  { id: 'k3', key: 'Tab',   label: 'autocomplete' },
  { id: 'k4', key: '?',     label: 'help' },
];

// Sparkline data for hero visualizer (cava-inspired)
const HERO_SPARKLINE = [30, 45, 35, 60, 50, 75, 55, 85, 65, 92, 70, 95, 80, 98, 88, 100, 95, 100, 100, 100];

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

function LandingPageV2() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeLog, setActiveLog] = useState(0);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [heroVariant, setHeroVariant] = useState('control');
  const [annual, setAnnual] = useState(false);

  useEffect(() => {
    captureUtmParams();
    trackMarketingEvent('landing_viewed', { page: '/' });

    const variant = getExperimentVariant(
      'experiment_landing_hero_copy_v1',
      [
        { id: 'control', weight: 34 },
        { id: 'clarity', weight: 33 },
        { id: 'adhd', weight: 33 },
      ],
      'landing_hero',
    );
    setHeroVariant(variant);
    trackExperimentExposure('experiment_landing_hero_copy_v1', variant, 'landing_hero');
  }, []);

  const heroContent =
    heroVariant === 'clarity'
      ? {
          headingMain: 'Stop planning.',
          headingAccent: 'Start executing._',
          subcopy:
            'Go from mental clutter to crystal-clear action in under 5 seconds. Resurgo turns your goals into one focused today plan you can actually follow.',
        }
      : heroVariant === 'adhd'
        ? {
            headingMain: 'Stop planning.',
            headingAccent: 'Start executing._',
            subcopy:
              'When everything feels loud, Resurgo gives you one calm next step. Gentle accountability, flexible structure, and momentum that meets you where you are.',
          }
        : {
            headingMain: 'Stop planning.',
            headingAccent: 'Start executing._',
            subcopy:
              'Resurgo turns any goal into a daily action plan — automatically. Enter one goal, get your AI-generated habit roadmap in seconds, and start executing with focus timers, streaks, and 24/7 AI coaching.',
          };

  // Rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setActiveLog((i) => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);

  // Rotate ticker
  useEffect(() => {
    const t = setInterval(() => setTickerIdx((i) => (i + 1) % TICKER_ITEMS.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-orange-600/40 selection:text-white">
      <MarketingHeader
        navLinks={[
          { label: 'Features', href: '#features', icon: 'grid' },
          { label: 'How It Works', href: '#how-it-works', icon: 'terminal' },
          { label: 'Coaches', href: '#coaches', icon: 'robot' },
          { label: 'Pricing', href: '/pricing', icon: 'star' },
          { label: 'Blog', href: '/blog', icon: 'plan' },
          { label: 'FAQ', href: '#faq', icon: 'sparkles' },
        ]}
        tickerText={`RESURGO.life :: ${TICKER_ITEMS[tickerIdx]}`}
      />

      <main>
        {/* PWA INSTALL BANNER — removed per UX decision; CTAs are sufficient */}
        {false && <section className="border-b border-orange-900/40 bg-gradient-to-r from-orange-950/30 via-black to-orange-950/30 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center border border-orange-800 bg-orange-950/60">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </span>
              <div>
                <p className="font-pixel text-[0.45rem] tracking-widest text-orange-400">
                  PROGRESSIVE WEB APP — INSTALL ON ANY DEVICE
                </p>
                <p className="font-terminal text-base text-zinc-400">
                  Install Resurgo on iOS or Android directly from your browser — no app store needed
                </p>
              </div>
            </div>
            <a
              href="/download"
              className="inline-flex items-center gap-2 border-2 border-orange-600 bg-orange-600 px-5 py-2 font-pixel text-[0.45rem] tracking-widest text-black shadow-[2px_2px_0px_rgba(0,0,0,0.5)] transition hover:bg-orange-500 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              INSTALL ON HOMESCREEN
            </a>
          </div>
        </section>}

        {/* ────────────────────── HERO ────────────────────── */}
        <section id="system" className="relative flex h-screen min-h-[600px] items-center overflow-hidden px-4 sm:px-6 lg:px-8">
          {/* Pixel dot-grid background */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.04]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hero-pixel-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="2" height="2" fill="#ea580c" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-pixel-grid)" />
            </svg>
          </div>
          <div className="mx-auto max-w-7xl">


            <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Left — copy */}
              <div>
                {/* Status badge */}
                <div className="mb-5 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 border border-orange-900/50 bg-orange-950/20 px-3 py-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse bg-orange-500" />
                    <span className="font-pixel text-[0.45rem] tracking-widest text-orange-500/90">RESURGO · LIFE OS · v2.4</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 border border-green-900/40 bg-green-950/20 px-2.5 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500/80" />
                    <span className="font-terminal text-xs text-green-400/80">All systems active</span>
                  </span>
                </div>

                <h1 className="font-pixel text-3xl leading-[1.1] tracking-tight text-zinc-100 sm:text-4xl lg:text-5xl xl:text-6xl">
                  {heroContent.headingMain}
                  <span className="block text-orange-500">
                    {heroContent.headingAccent}
                  </span>
                </h1>
                <p className="mt-6 max-w-xl font-terminal text-lg leading-relaxed text-zinc-200 sm:text-xl">
                  {heroContent.subcopy}
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <TermLinkButton href="/sign-up" variant="primary" size="lg">
                    Start Free — No Credit Card
                  </TermLinkButton>
                  <TermLinkButton href="/download" variant="secondary" size="lg">
                    Install on Device ↓
                  </TermLinkButton>
                </div>

                {/* Metrics bar */}
                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {METRICS.map((m) => (
                    <div key={m.label} className="border-2 border-zinc-800 bg-black px-4 py-4 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                      <p className="font-pixel text-sm text-orange-400">{m.value}</p>
                      <p className="mt-1 font-terminal text-base text-zinc-400">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Enhanced Terminal Preview */}
              <div className="hidden lg:flex flex-col gap-3">
                <TerminalWindow
                  title="resurgo.terminal"
                  variant="bordered"
                  scanlines
                  crtGlow
                  lines={HERO_TERMINAL_LINES}
                  autoType
                  typeSpeed={25}
                  lineDelay={350}
                  maxBodyHeight="240px"
                  prompt="$"
                  headerRight={
                    <SparklineBars
                      data={HERO_SPARKLINE}
                      height={20}
                      barWidth={3}
                      gap={1}
                      color="orange"
                    />
                  }
                  footer={
                    <StatusBar
                      items={HERO_STATUS_LEFT}
                      rightItems={HERO_STATUS_RIGHT}
                      compact
                    />
                  }
                  className="shadow-[4px_4px_0px_rgba(0,0,0,0.7)]"
                />

                {/* Quick progress snapshot below terminal */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="border border-[var(--term-border)] bg-[var(--term-bg)] px-3 py-2 rounded-sm">
                    <p className="font-pixel text-[0.35rem] tracking-widest text-[var(--term-fg-dimmer)] mb-1">HABITS</p>
                    <ProgressBar value={60} variant="blocks" color="green" size="sm" showLabel />
                  </div>
                  <div className="border border-[var(--term-border)] bg-[var(--term-bg)] px-3 py-2 rounded-sm">
                    <p className="font-pixel text-[0.35rem] tracking-widest text-[var(--term-fg-dimmer)] mb-1">FOCUS</p>
                    <ProgressBar value={75} variant="ascii" color="cyan" size="sm" showLabel />
                  </div>
                  <div className="border border-[var(--term-border)] bg-[var(--term-bg)] px-3 py-2 rounded-sm">
                    <p className="font-pixel text-[0.35rem] tracking-widest text-[var(--term-fg-dimmer)] mb-1">XP</p>
                    <ProgressBar value={88} variant="gradient" color="orange" size="sm" showLabel />
                  </div>
                </div>

                {/* Keyboard hints */}
                <KeyboardHints
                  hints={HERO_KEY_HINTS}
                  compact
                  variant="minimal"
                  className="justify-center opacity-60 mt-1"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────── INTERACTIVE TERMINAL DEMO ──────────────── */}
        <TerminalDemo />

        {/* ────────────────── BRAND STORY ────────────────── */}
        <section className="border-t-2 border-zinc-800 bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-pixel text-[0.6rem] tracking-widest text-orange-600">OUR_STORY</p>
            <h2 className="mt-3 font-pixel text-lg text-zinc-100 sm:text-xl">
              Why we built the Resurgo life command center
            </h2>

            <div className="mt-8 space-y-6 text-left">
              <p className="font-terminal text-lg leading-relaxed text-zinc-300">
                We were tired of switching between five different apps just to stay organized. One for tasks, one for
                goals, one for focus timers, one for journaling, one for wellness. None of them talked to each other.
                None of them understood the full picture of what you&apos;re trying to execute.
              </p>
              <p className="font-terminal text-lg leading-relaxed text-zinc-300">
                So we built <span className="font-bold text-orange-400">Resurgo</span> —{' '}
                <span className="italic text-zinc-200">Latin for &ldquo;to rise again&rdquo;</span>. A single platform
                where you capture what matters, break it down with AI, execute daily with habits and focus sessions, and
                review your progress weekly with an AI coach that actually knows your journey.
              </p>
              <p className="font-terminal text-lg leading-relaxed text-zinc-300">
                Resurgo isn&apos;t about doing more. It&apos;s about doing{' '}
                <span className="text-zinc-100">what matters</span>, consistently, with clarity. Whether you&apos;re
                building a business, studying for exams, training for a marathon, or just trying to drink more water —
                the system adapts to you.
              </p>
            </div>

            {/* Mission / Philosophy / Promise */}
            <div className="mt-10 grid grid-cols-1 gap-px border-2 border-zinc-800 bg-zinc-800 sm:grid-cols-3">
              {[
                {
                  label: 'MISSION',
                  value: 'Help people build consistency through AI-powered clarity and daily execution.',
                },
                {
                  label: 'PHILOSOPHY',
                  value: 'One goal. Daily execution. Weekly review. Continuous growth.',
                },
                {
                  label: 'PROMISE',
                  value: 'Your data stays yours. Free forever tier. No dark patterns. No data selling.',
                },
              ].map((item) => (
                <div key={item.label} className="bg-black p-4 sm:p-5">
                  <p className="font-pixel text-[0.6rem] tracking-widest text-orange-500">{item.label}</p>
                  <p className="mt-2 font-terminal text-base leading-relaxed text-zinc-300">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────── HOW TO ACHIEVE YOUR GOALS ────────────── */}
        <section className="border-t-2 border-zinc-800 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="font-pixel text-[0.6rem] tracking-widest text-orange-600">THE_FRAMEWORK</p>
              <h2 className="mt-2 font-pixel text-xl text-zinc-100 sm:text-2xl">
                How to execute with clarity: the Resurgo framework
              </h2>
              <p className="mx-auto mt-4 max-w-2xl font-terminal text-xl leading-relaxed text-zinc-200">
                Plans fail because of vague intentions, inconsistent execution, and no feedback loop. Resurgo solves all three inside one system.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {ACHIEVEMENT_STEPS.map((step) => (
                <article key={step.num} className="border-2 border-zinc-800 bg-black p-6 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center border-2 border-orange-900 bg-orange-950/40 font-pixel text-[0.6rem] text-orange-500 shrink-0">
                      {step.num}
                    </span>
                    <div>
                      <h3 className="font-terminal text-xl font-bold text-zinc-100 sm:text-2xl">{step.title}</h3>
                      <p className="mt-0.5 font-terminal text-sm font-semibold tracking-wider text-orange-400">{step.subtitle}</p>
                    </div>
                  </div>
                  <p className="mt-4 font-terminal text-lg leading-relaxed text-zinc-200">{step.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────── HOW IT WORKS (TERMINAL PIPELINE) ────────────── */}
        <section id="how-it-works" className="border-t-2 border-zinc-800 bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <p className="font-pixel text-[0.55rem] tracking-widest text-orange-500">GETTING_STARTED</p>
              <h2 className="mt-2 font-pixel text-lg text-zinc-100 sm:text-xl">
                How Resurgo works
              </h2>
              <p className="mx-auto mt-3 max-w-2xl font-terminal text-lg leading-relaxed text-zinc-300">
                From intent to achieved goal — the Resurgo pipeline in 4 steps.
              </p>
            </div>

            {/* Terminal pipeline */}
            <div className="space-y-0">
              {[
                {
                  step: '01',
                  cmd: 'SET_GOAL',
                  desc: 'Tell Resurgo what you want to achieve — any goal, any domain',
                  output: 'Milestones · Tasks · Habits',
                },
                {
                  step: '02',
                  cmd: 'EXECUTE_DAILY',
                  desc: 'AI plans your day. You execute with focus sessions and habit check-ins.',
                  output: 'Focus Sessions · Check-ins',
                },
                {
                  step: '03',
                  cmd: 'EARN_XP',
                  desc: 'Track streaks, earn XP for every habit completed, level up your profile.',
                  output: 'XP · Streaks · Achievements',
                },
                {
                  step: '04',
                  cmd: 'AI_ADAPTS',
                  desc: 'Your AI coach analyzes patterns and updates your plan automatically.',
                  output: 'Adaptive Plan · Recommendations',
                },
              ].map((s, i, arr) => (
                <div key={s.cmd} className="flex flex-col items-center">
                  <div className="w-full border-2 border-zinc-800 bg-black p-5 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex h-8 w-8 items-center justify-center border-2 border-orange-900 bg-orange-950/40 shrink-0">
                        <span className="font-pixel text-[0.35rem] text-orange-500">{s.step}</span>
                      </span>
                      <span className="font-pixel text-[0.55rem] tracking-widest text-orange-400">
                        {/* eslint-disable-next-line */}
                        {`// ${s.cmd}`}
                      </span>
                    </div>
                    <p className="font-terminal text-base text-zinc-300 ml-11">&gt; {s.desc}</p>
                    <p className="mt-2 ml-11 font-pixel text-[0.4rem] tracking-widest text-zinc-500">
                      OUTPUT: [{s.output}]
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex flex-col items-center py-1">
                      <div className="w-px h-5 bg-zinc-700" />
                      <span className="font-pixel text-[0.4rem] text-zinc-600">↓</span>
                    </div>
                  )}
                </div>
              ))}
              {/* Final output */}
              <div className="flex flex-col items-center">
                <div className="flex flex-col items-center py-1">
                  <div className="w-px h-5 bg-zinc-700" />
                  <span className="font-pixel text-[0.4rem] text-zinc-600">↓</span>
                </div>
                <div className="border-2 border-green-900 bg-green-950/20 px-8 py-3 text-center shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                  <span className="font-pixel text-[0.55rem] tracking-widest text-green-400">
                    █ GOAL_ACHIEVED ▋
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────── FEATURES (12 CORE) ────────────────── */}
        <section id="features" className="border-t-2 border-zinc-800 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-pixel text-[0.6rem] tracking-widest text-orange-600">CORE_CAPABILITIES</p>
                <h2 className="mt-2 font-pixel text-lg text-zinc-100 sm:text-xl">
                  Every execution tool you need — in one app
                </h2>
              </div>
              <p className="max-w-md font-terminal text-lg leading-relaxed text-zinc-300">
                12 integrated tools — task planning, habits, focus, coaching, wellness, and reviews. Stop paying for five separate apps.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CORE_FEATURES.map((spec) => (
                <article
                  key={spec.id}
                  className="group flex flex-col border-2 border-zinc-800 bg-black shadow-[2px_2px_0px_rgba(0,0,0,0.5)] transition-all duration-200 hover:-translate-y-1 hover:border-orange-600/60 hover:shadow-[0_0_20px_rgba(234,88,12,0.15)]"
                >
                  <div className="flex-1 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex h-12 w-12 items-center justify-center border-2 border-zinc-700 bg-zinc-900/60 text-xl transition-colors group-hover:border-orange-800 group-hover:bg-orange-950/20">
                        <PixelIcon name={spec.icon} size={20} className="text-orange-400" />
                      </div>
                      <span
                        className={cn(
                          'shrink-0 border-2 px-2 py-0.5 font-pixel text-[0.35rem] tracking-widest',
                          spec.status === 'Secure'
                            ? 'border-blue-900 bg-blue-950/40 text-blue-500'
                            : 'border-green-900 bg-green-950/40 text-green-600',
                        )}
                      >
                        {spec.status}
                      </span>
                    </div>
                    <p className="mt-3 font-pixel text-[0.5rem] tracking-widest text-orange-600">{spec.id}</p>
                    <h3 className="mt-1 font-pixel text-[0.6rem] text-zinc-200 sm:text-[0.65rem]">{spec.title}</h3>
                    <p className="mt-2 font-terminal text-sm leading-relaxed text-zinc-300 sm:text-base">{spec.description}</p>
                  </div>
                  <div className="border-t border-zinc-800 px-4 py-2.5 sm:px-5">
                    <code className="font-terminal text-xs text-zinc-500 transition-colors group-hover:text-orange-500/70">
                      {spec.terminalCmd}
                    </code>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────── AI COACHES ────────────────── */}
        <section id="coaches" className="border-t-2 border-zinc-800 bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="font-pixel text-[0.55rem] tracking-widest text-orange-500">AI_COACHING_ENGINE</p>
              <h2 className="mt-2 font-pixel text-lg text-zinc-100 sm:text-xl">
                8 AI coaches. One for every domain.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl font-terminal text-lg leading-relaxed text-zinc-200">
                Each coach has a distinct personality, philosophy, and area of expertise. Marcus &amp; Aurora are free forever. Unlock all eight with Pro.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px bg-zinc-900 md:grid-cols-3">
              {AI_COACHES.map((coach) => (
                <article
                  key={coach.name}
                  className={cn(
                    'relative bg-black p-4 transition sm:p-5',
                    'border-l-2',
                    coach.accent === 'yellow' && 'border-yellow-600 hover:bg-yellow-950/10',
                    coach.accent === 'purple' && 'border-purple-500 hover:bg-purple-950/10',
                    coach.accent === 'red' && 'border-red-500 hover:bg-red-950/10',
                    coach.accent === 'green' && 'border-green-500 hover:bg-green-950/10',
                    coach.accent === 'orange' && 'border-orange-500 hover:bg-orange-950/10',
                    coach.accent === 'cyan' && 'border-cyan-500 hover:bg-cyan-950/10',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={cn(
                      'font-pixel text-[0.6rem] tracking-widest',
                      coach.accent === 'yellow' && 'text-yellow-500',
                      coach.accent === 'purple' && 'text-purple-400',
                      coach.accent === 'red' && 'text-red-400',
                      coach.accent === 'green' && 'text-green-400',
                      coach.accent === 'orange' && 'text-orange-400',
                      coach.accent === 'cyan' && 'text-cyan-400',
                    )}>{coach.name}</span>
                    <span
                      className={cn(
                        'shrink-0 border-2 px-2 py-0.5 font-pixel text-[0.35rem] tracking-widest',
                        coach.free
                          ? 'border-green-900 bg-green-950/40 text-green-500'
                          : 'border-orange-900 bg-orange-950/40 text-orange-500',
                      )}
                    >
                      {coach.free ? 'FREE' : 'PRO'}
                    </span>
                  </div>
                  <p className="mt-1 font-pixel text-[0.35rem] tracking-widest text-zinc-400">{coach.style}</p>
                  <p className="mt-3 font-terminal text-sm leading-relaxed text-zinc-400">{coach.desc}</p>
                </article>
              ))}
            </div>

            <p className="mt-6 text-center font-terminal text-base text-zinc-400">
              Use <span className="text-orange-400">@TITAN</span>, <span className="text-green-400">@SAGE</span>, <span className="text-cyan-400">@NOVA</span> in any message to direct your question to a specific coach
            </p>
          </div>
        </section>

        {/* ────────────────── PRICING ────────────────── */}
        <section id="access" className="border-t-2 border-zinc-800 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-2 text-center">
              <p className="font-pixel text-[0.55rem] tracking-widest text-orange-500">ACCESS_TIERS</p>
            </div>
            <h2 className="text-center font-pixel text-lg text-zinc-100 sm:text-xl">Simple, transparent pricing</h2>
            <p className="mx-auto mt-2 max-w-xl text-center font-terminal text-lg text-zinc-300">
              Start free forever. Upgrade to Pro only when you&apos;re ready. No lock-in, no hidden fees.
            </p>

            {/* Monthly / Annual toggle — terminal-styled */}
            <div className="mt-8 flex items-center justify-center">
              <div className="inline-flex border-2 border-zinc-800 bg-zinc-900/50">
                <button
                  onClick={() => setAnnual(false)}
                  className={cn(
                    'px-6 py-2.5 font-pixel text-[0.45rem] tracking-widest transition-all',
                    !annual
                      ? 'bg-orange-600 text-black'
                      : 'bg-transparent text-zinc-500 hover:text-zinc-300',
                  )}
                >
                  MONTHLY
                </button>
                <button
                  onClick={() => setAnnual(true)}
                  className={cn(
                    'px-6 py-2.5 font-pixel text-[0.45rem] tracking-widest transition-all',
                    annual
                      ? 'bg-orange-600 text-black'
                      : 'bg-transparent text-zinc-500 hover:text-zinc-300',
                  )}
                >
                  ANNUAL — SAVE 50%
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {ACCESS_TIERS.map((plan) => (
                <article
                  key={plan.tier}
                  className={cn(
                    'flex flex-col p-5 shadow-[2px_2px_0px_rgba(0,0,0,0.5)] sm:p-6',
                    plan.highlight
                      ? 'border-2 border-orange-900 bg-orange-950/20'
                      : plan.earlyAccess
                        ? 'border-2 border-yellow-800 bg-yellow-950/10'
                        : 'border-2 border-zinc-800 bg-black',
                  )}
                >
                  {plan.highlight && (
                    <p className="mb-3 font-pixel text-[0.55rem] tracking-widest text-orange-500">&#9733; MOST POPULAR</p>
                  )}
                  {plan.earlyAccess && (
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="border border-yellow-700 bg-yellow-950/60 px-2 py-0.5 font-pixel text-[0.5rem] tracking-widest text-yellow-400">
                        ⚡ FOUNDING PRICE
                      </span>
                      <span className="border border-red-900/60 bg-red-950/30 px-2 py-0.5 font-pixel text-[0.5rem] tracking-widest text-red-400">
                        FIRST {plan.spotsLeft?.toLocaleString()} ONLY
                      </span>
                    </div>
                  )}
                  <p className="font-pixel text-[0.6rem] tracking-widest text-zinc-300">{plan.tier}</p>

                  {plan.earlyAccess ? (
                    <div className="mt-3">
                      <p className="font-pixel text-sm text-zinc-100">
                        {plan.price.monthly}
                        <span className="font-terminal text-sm text-zinc-400"> {plan.period.monthly}</span>
                      </p>
                      <p className="mt-1 font-terminal text-sm text-zinc-400">
                        <span className="line-through">{plan.originalPrice}</span>
                        <span className="ml-2 text-yellow-500">save 44%</span>
                      </p>
                      <p className="mt-1 font-pixel text-[0.5rem] tracking-widest text-zinc-400">
                        Regular price after {plan.spotsLeft?.toLocaleString()} spots
                      </p>
                    </div>
                  ) : plan.highlight ? (
                    <div className="mt-3">
                      <div className="flex items-end gap-2">
                        <p className="font-pixel text-sm text-zinc-100">
                          {annual ? plan.price.annual : plan.price.monthly}
                        </p>
                        {annual && plan.price.monthly !== plan.price.annual && (
                          <p className="mb-0.5 font-terminal text-sm text-zinc-500 line-through">{plan.price.monthly}</p>
                        )}
                      </div>
                      <p className="font-terminal text-sm text-zinc-400">{plan.period.monthly}</p>
                      {annual && plan.annualBilled && (
                        <p className="mt-1 font-pixel text-[0.45rem] tracking-widest text-green-500">
                          ✓ billed as {plan.annualBilled} · {plan.savings}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-3 font-pixel text-sm text-zinc-100">
                      {annual ? plan.price.annual : plan.price.monthly}
                      <span className="font-terminal text-base text-zinc-400"> {plan.period.monthly}</span>
                    </p>
                  )}

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {plan.specs.map((spec) => (
                      <li key={spec} className="flex items-start gap-2 font-terminal text-sm leading-snug text-zinc-300 sm:text-base">
                        <span className="mt-0.5 shrink-0 text-green-500">&#10003;</span>
                        {spec}
                      </li>
                    ))}
                  </ul>
                  <TermLinkButton
                    href="/sign-up"
                    variant={plan.highlight ? 'primary' : plan.earlyAccess ? 'gold' : 'secondary'}
                    size="md"
                    fullWidth
                    className="mt-5"
                  >
                    {plan.cta}
                  </TermLinkButton>
                </article>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-pixel text-[0.5rem] tracking-widest text-zinc-400">
              <span className="flex items-center gap-1.5"><PixelIcon name="check" size={12} className="text-orange-500" />DATA_ENCRYPTED_AT_REST</span>
              <span className="flex items-center gap-1.5"><PixelIcon name="star" size={12} className="text-orange-500" />CANCEL_ANYTIME</span>
              <span className="flex items-center gap-1.5"><PixelIcon name="sparkles" size={12} className="text-orange-500" />14-DAY_MONEY_BACK</span>
              <span className="flex items-center gap-1.5"><PixelIcon name="grid" size={12} className="text-orange-500" />WORKS_ON_ANY_DEVICE</span>
              <span className="flex items-center gap-1.5"><PixelIcon name="loop" size={12} className="text-orange-500" />FREE_TIER_FOREVER</span>
            </div>
          </div>
        </section>

        {/* ────────────────── TESTIMONIALS ────────────────── */}
        <section id="logs" className="border-t-2 border-zinc-800 bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-pixel text-lg text-zinc-100 sm:text-xl">
                  Real outcomes from people using Resurgo
                </h2>
                <p className="mt-1 font-terminal text-lg text-zinc-400">
                  Real outcomes from people using Resurgo to plan clearly and follow through daily
                </p>
              </div>
              <p className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">
                {TESTIMONIALS.length} VERIFIED REVIEWS
              </p>
            </div>

            {/* Featured testimonial (rotating) */}
            <div className="border-2 border-zinc-800 shadow-[3px_3px_0px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between border-b-2 border-zinc-800 bg-black px-4 py-2">
                <span className="font-pixel text-[0.35rem] tracking-widest text-orange-600">
                  REVIEW_{activeLog + 1}_OF_{TESTIMONIALS.length}
                </span>
                <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-400">FIELD_VERIFIED</span>
              </div>
              <div className="bg-black p-6">
                <p className="font-terminal text-lg leading-relaxed text-zinc-300">
                  &quot;{TESTIMONIALS[activeLog].quote}&quot;
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-pixel text-[0.5rem] text-zinc-200">{TESTIMONIALS[activeLog].name}</p>
                    <p className="font-pixel text-[0.4rem] tracking-widest text-zinc-400">
                      {TESTIMONIALS[activeLog].role}
                    </p>
                  </div>
                  <span className="shrink-0 border-2 border-green-900 bg-green-950/40 px-3 py-1 font-pixel text-[0.35rem] tracking-widest text-green-500">
                    RESULT: {TESTIMONIALS[activeLog].outcome}
                  </span>
                </div>
              </div>
              <div className="flex gap-px border-t-2 border-zinc-800">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveLog(idx)}
                    className={cn(
                      'h-2.5 flex-1 transition-colors',
                      activeLog === idx ? 'bg-orange-600' : 'bg-zinc-800 hover:bg-zinc-600',
                    )}
                    aria-label={`Review ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* All testimonials grid */}
            <div className="mt-6 grid grid-cols-1 gap-px border-2 border-zinc-800 sm:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="bg-black p-4 sm:p-5">
                  <p className="font-terminal text-sm leading-relaxed text-zinc-300 sm:text-base">
                    &quot;{t.quote.length > 120 ? t.quote.slice(0, 120) + '...' : t.quote}&quot;
                  </p>
                  <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <p className="font-pixel text-[0.6rem] text-zinc-200">{t.name}</p>
                      <p className="font-pixel text-[0.5rem] tracking-widest text-zinc-400">{t.role}</p>
                    </div>
                    <span className="shrink-0 border-2 border-green-900/60 px-2 py-0.5 font-pixel text-[0.5rem] tracking-widest text-green-600">
                      {t.outcome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────── FAQ ────────────────── */}
        <section id="faq" className="border-t-2 border-zinc-800 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="font-pixel text-[0.55rem] tracking-widest text-orange-600">FAQ_DATABASE</p>
              <h2 className="mt-3 font-pixel text-lg text-zinc-100 sm:text-xl">Frequently asked questions about AI planning and execution</h2>
              <p className="mt-2 font-terminal text-lg text-zinc-400">
                Everything you need to know about Resurgo — free plan, AI coaching, PWA install, privacy, and more.
              </p>
            </div>

            <div
              className="mt-8 space-y-2"
              itemScope
              itemType="https://schema.org/FAQPage"
            >
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <article
                    key={faq.question}
                    className={cn(
                      'border-2 bg-black transition-colors duration-200',
                      isOpen ? 'border-orange-900/60' : 'border-zinc-800 hover:border-zinc-700',
                    )}
                    itemProp="mainEntity"
                    itemScope
                    itemType="https://schema.org/Question"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="shrink-0 font-terminal text-sm text-orange-600">&gt;</span>
                      <h3 itemProp="name" className="flex-1 font-terminal text-base text-zinc-300">
                        {faq.question}
                      </h3>
                      <span
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center border border-zinc-800 font-pixel text-[0.5rem] transition-all duration-200',
                          isOpen
                            ? 'border-orange-800 bg-orange-950/30 text-orange-500 rotate-45'
                            : 'text-zinc-500',
                        )}
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={cn(
                        'grid transition-all duration-200',
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                      )}
                    >
                      <div
                        className="overflow-hidden"
                        itemProp="acceptedAnswer"
                        itemScope
                        itemType="https://schema.org/Answer"
                      >
                        <p
                          itemProp="text"
                          className="border-t border-zinc-800 px-5 pb-4 pt-3 pl-10 font-terminal text-base leading-relaxed text-zinc-300"
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ────────────────── GOAL TEMPLATES ────────────────── */}
        <section id="templates" className="border-t-2 border-zinc-800 bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="font-pixel text-[0.5rem] tracking-widest text-orange-600">GOAL_TEMPLATES</p>
              <h2 className="mt-3 font-pixel text-lg text-zinc-100 sm:text-xl lg:text-2xl">
                From idea to 90-day plan in seconds
              </h2>
              <p className="mx-auto mt-3 max-w-xl font-terminal text-lg text-zinc-400">
                Pick any goal template below. Resurgo instantly generates milestones, daily habits, and an AI-coached execution schedule tailored to you.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {([
                { slug: 'run-a-5k-in-12-weeks',      title: 'Run a 5K in 12 Weeks',        category: 'FITNESS',  weeks: 12, diff: 'BEGINNER' },
                { slug: 'build-a-morning-routine',   title: 'Build a Morning Routine',     category: 'WELLNESS', weeks: 8,  diff: 'BEGINNER' },
                { slug: 'get-promoted-this-year',    title: 'Get Promoted This Year',      category: 'CAREER',   weeks: 40, diff: 'ADVANCED' },
                { slug: 'save-5000-emergency-fund',  title: 'Save a $5,000 Emergency Fund',category: 'FINANCE',  weeks: 24, diff: 'INTERMEDIATE' },
                { slug: 'learn-to-code-in-100-days', title: 'Learn to Code in 100 Days',   category: 'LEARNING', weeks: 15, diff: 'INTERMEDIATE' },
                { slug: 'quit-smoking-90-day-plan',  title: 'Quit Smoking — 90-Day Plan',  category: 'HEALTH',   weeks: 13, diff: 'ADVANCED' },
              ] as const).map((t) => (
                <Link
                  key={t.slug}
                  href={`/templates/${t.slug}`}
                  className="group block border-2 border-zinc-800 bg-black p-5 transition hover:border-orange-900/60 hover:bg-zinc-950"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="border border-orange-900/50 bg-orange-950/20 px-2 py-0.5 font-pixel text-[0.35rem] tracking-widest text-orange-500">
                      {t.category}
                    </span>
                    <span className={`font-pixel text-[0.32rem] tracking-widest ${t.diff === 'BEGINNER' ? 'text-green-500' : t.diff === 'ADVANCED' ? 'text-red-500' : 'text-yellow-500'}`}>
                      {t.diff}
                    </span>
                  </div>
                  <p className="font-terminal text-base font-semibold text-zinc-200 group-hover:text-orange-300 transition-colors">
                    {t.title}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-zinc-600">{t.weeks}w plan</span>
                    <span className="font-pixel text-[0.35rem] tracking-widest text-orange-600 opacity-0 transition-opacity group-hover:opacity-100">
                      LOAD_TEMPLATE →
                    </span>
                  </div>
                  <div className="mt-2 h-0.5 w-0 bg-orange-600 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 border-2 border-zinc-700 px-8 py-3 font-pixel text-[0.45rem] tracking-widest text-zinc-400 transition hover:border-orange-700 hover:text-orange-400"
              >
                [ VIEW_ALL_TEMPLATES ] &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ────────────────── INTERACTIVE DEMO CAROUSEL ────────────────── */}
        <section id="demo" className="border-t-2 border-zinc-800 bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="font-pixel text-[0.5rem] tracking-widest text-orange-600">INTERACTIVE_DEMO</p>
              <h2 className="mt-3 font-pixel text-lg text-zinc-100 sm:text-xl lg:text-2xl">
                See Resurgo in Action
              </h2>
              <p className="mx-auto mt-3 max-w-xl font-terminal text-lg text-zinc-400">
                Click any feature tab below — or watch it auto-demo every 8 seconds.
              </p>
            </div>

            <InteractiveDemoCarousel />

            <div className="mt-8">
              <SocialProof />
            </div>

            <div className="mt-8 border-2 border-orange-900/50 bg-gradient-to-br from-orange-950/20 to-black p-8 text-center shadow-[3px_3px_0px_rgba(0,0,0,0.7)]">
              <p className="mb-2 font-pixel text-[0.5rem] tracking-widest text-orange-500">READY_TO_START?</p>
              <h3 className="font-pixel text-sm text-zinc-100 sm:text-base">Your system is waiting. Set it up free in 2 minutes.</h3>
              <p className="mx-auto mt-2 max-w-md font-terminal text-base text-zinc-300">No credit card. No commitments. Set your first goal, build your habit stack, and get your AI coach — today.</p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <TermLinkButton href="/sign-up" variant="primary" size="lg">
                  Start Free — No Credit Card
                </TermLinkButton>
                <TermLinkButton href="/pricing" variant="secondary" size="md">
                  View Pricing →
                </TermLinkButton>
              </div>
            </div>


          </div>
        </section>

        {/* ────────────────── COMPARISON MATRIX ────────────────── */}
        <section className="border-t-2 border-zinc-800 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="font-pixel text-[0.5rem] tracking-widest text-orange-600">COMPARISON_MATRIX</p>
              <h2 className="mt-3 font-pixel text-xl text-zinc-100 sm:text-2xl lg:text-3xl">
                How Resurgo outperforms every alternative
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-terminal text-xl leading-relaxed text-zinc-200">
                Most apps track one thing. Resurgo unifies your goals, habits, focus, and AI coaching in a single life OS — nothing else comes close.
              </p>
            </div>

            {/* Terminal table */}
            <div className="overflow-x-auto border-2 border-zinc-800">
              {/* Chrome */}
              <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-950 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-red-700" />
                <span className="h-2 w-2 rounded-full bg-yellow-700" />
                <span className="h-2 w-2 rounded-full bg-green-700" />
                <span className="ml-3 font-pixel text-[0.35rem] tracking-widest text-zinc-500">
                  compare.sh --all-apps --feature-diff
                </span>
              </div>

              <table className="w-full min-w-[780px] text-left">
                <thead className="border-b-2 border-zinc-700 bg-zinc-950">
                  <tr>
                    <th className="px-5 py-4 font-pixel text-[0.5rem] tracking-widest text-zinc-300">APP</th>
                    {['AI Goal Planning','AI Coaching','Habits + Focus','Gamification','Health & Nutrition','Free Tier','All-in-One'].map((f) => (
                      <th key={f} className="px-3 py-4 font-terminal text-xs font-semibold text-zinc-300 text-center">{f}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([
                    { app: 'Habitica',       ai: false,      coach: false, habits: true,  gamify: true,  health: false, free: true,  aio: false },
                    { app: 'Streaks',        ai: false,      coach: false, habits: true,  gamify: false, health: false, free: false, aio: false },
                    { app: 'MyFitnessPal',   ai: 'partial',  coach: false, habits: false, gamify: false, health: true,  free: true,  aio: false },
                    { app: 'Notion',         ai: 'partial',  coach: false, habits: false, gamify: false, health: false, free: true,  aio: false },
                    { app: 'Todoist',        ai: 'partial',  coach: false, habits: true,  gamify: false, health: false, free: true,  aio: false },
                    { app: 'Monday.com',     ai: 'partial',  coach: false, habits: false, gamify: false, health: false, free: false, aio: false },
                    { app: 'RESURGO ★',      ai: true,       coach: true,  habits: true,  gamify: true,  health: true,  free: true,  aio: true,  highlight: true },
                  ] as const).map((row) => {
                    const cols = [row.ai, row.coach, row.habits, row.gamify, row.health, row.free, row.aio];
                    const isHighlight = 'highlight' in row && row.highlight;
                    return (
                      <tr
                        key={row.app}
                        className={`border-t transition-colors ${isHighlight ? 'border-t-2 border-t-orange-700 border-b-2 border-b-orange-700 bg-gradient-to-r from-orange-950/30 via-orange-950/15 to-orange-950/30' : 'border-zinc-800 bg-black hover:bg-zinc-950'}`}
                      >
                        <td className={`px-5 py-4 ${isHighlight ? 'font-terminal text-base font-bold text-orange-400' : 'font-pixel text-[0.5rem] tracking-widest text-zinc-300'}`}>
                          {isHighlight ? (
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 animate-pulse bg-orange-500" />
                              {row.app}
                            </span>
                          ) : row.app}
                        </td>
                        {cols.map((val, ci) => (
                          <td key={ci} className="px-3 py-4 text-center">
                            {val === true ? (
                              <span className={`font-bold text-lg ${isHighlight ? 'text-orange-400' : 'text-green-500'}`}>✓</span>
                            ) : val === 'partial' ? (
                              <span className="text-lg text-yellow-500 font-bold">~</span>
                            ) : (
                              <span className="text-lg text-zinc-700">✗</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="border-t border-zinc-800 bg-zinc-950/50 px-4 py-3 text-center">
                <Link href="/compare" className="inline-flex items-center gap-2 border border-zinc-700 bg-zinc-900/40 px-6 py-2.5 font-terminal text-sm font-semibold text-zinc-400 transition hover:border-orange-700 hover:text-orange-400">
                  [ VIEW FULL COMPARISON GUIDE ] →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────────── CTA TERMINAL ────────────────── */}
        <section className="border-t-2 border-zinc-800 px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-6xl border-2 border-zinc-800 bg-black shadow-[4px_4px_0px_rgba(0,0,0,0.7)]">
            <div className="flex items-center gap-2 border-b-2 border-zinc-800 px-5 py-2">
              <span className="h-2 w-2 bg-orange-600" />
              <span className="h-2 w-2 bg-zinc-700" />
              <span className="h-2 w-2 bg-zinc-700" />
              <span className="ml-2 font-pixel text-[0.35rem] tracking-widest text-zinc-400">
                final_decision.sh — TERMINAL
              </span>
            </div>
            <div className="px-6 py-12 text-center sm:px-10">
              <p className="font-pixel text-[0.6rem] tracking-widest text-orange-600">EXECUTE_NOW</p>
              <h2 className="mt-3 font-pixel text-lg text-zinc-100 sm:text-xl lg:text-2xl">
                Stop managing apps. Start living.
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-terminal text-lg leading-relaxed text-zinc-300">
                Create your free account, set one goal, and follow your first personalized AI habit plan — all in under 2 minutes. No credit card. No trial that expires. Free forever.
              </p>

              {/* Stats badges */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <span className="border-2 border-zinc-800 bg-zinc-900/50 px-4 py-2 font-pixel text-[0.45rem] tracking-widest text-zinc-300">
                  8 AI COACHES
                </span>
                <span className="border-2 border-zinc-800 bg-zinc-900/50 px-4 py-2 font-pixel text-[0.45rem] tracking-widest text-zinc-300">
                  28 GOAL TEMPLATES
                </span>
                <span className="border-2 border-green-900 bg-green-950/30 px-4 py-2 font-pixel text-[0.45rem] tracking-widest text-green-500">
                  FREE PLAN FOREVER
                </span>
              </div>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
                <TermLinkButton href="/sign-up" variant="primary" size="lg">
                  [ START FREE — NO CREDIT CARD ]
                </TermLinkButton>
                <TermLinkButton href="/pricing" variant="ghost" size="md">
                  [ VIEW_ACCESS_TIERS ]
                </TermLinkButton>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 font-pixel text-[0.55rem] tracking-widest text-zinc-400">
                <span>&gt; FREE_PLAN_FOREVER</span>
                <span>&gt; NO_CREDIT_CARD_REQUIRED</span>
                <span>&gt; 14_DAY_MONEY_BACK_GUARANTEE</span>
                <span>&gt; PRIVATE_ENCRYPTED_DATA</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ────────────────── FOOTER ────────────────── */}
      <MarketingFooter />

      <StickyCTA />
      <ExitIntent />
      <CookieConsent />
      <ScrollToTop />
    </div>
  );
}

export default LandingPageV2;



