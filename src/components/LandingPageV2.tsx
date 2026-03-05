'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LogoMark } from '@/components/Logo';
import { ScrollToTop } from '@/components/ScrollToTop';
import { TerminalDemo } from '@/components/TerminalDemo';
import { MarketingFooter } from '@/components/MarketingFooter';
import DemoSandbox from '@/components/marketing/DemoSandbox';
import SocialProof from '@/components/marketing/SocialProof';
import EmailCapture from '@/components/marketing/EmailCapture';
import LandingChatWidget from '@/components/marketing/LandingChatWidget';
import ExitIntent from '@/components/marketing/ExitIntent';
import StickyCTA from '@/components/marketing/StickyCTA';
import { captureUtmParams, trackMarketingEvent } from '@/lib/marketing/analytics';
import { getExperimentVariant, trackExperimentExposure } from '@/lib/marketing/experiments';

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
  },
  {
    id: 'HABIT_SYSTEM',
    title: 'Habit Tracker & Stacks',
    description:
      'Build habits that stick. Track streaks, completion rates, consistency patterns, and chain habits into stacks.',
    status: 'Live',
    category: 'Habits',
  },
  {
    id: 'FOCUS_ENGINE',
    title: 'Focus Sessions',
    description:
      'Run Pomodoro, Deep Work, or Flowtime sessions. Log distractions, play ambient sounds, and track total focus hours.',
    status: 'Live',
    category: 'Focus',
  },
  {
    id: 'AI_COACHING',
    title: '4 Specialized AI Coaches',
    description:
      'Chat with NOVA (Systems), TITAN (Performance), SAGE (Wealth), or PHOENIX (Resilience). Each coach has a distinct strategy. Advice personalized to your goals, 24/7.',
    status: 'Live',
    category: 'AI',
  },
  {
    id: 'DAILY_PLANNER',
    title: 'Daily Planning',
    description:
      'Plan your day with AI-assisted task prioritization. See habits, tasks, and sessions in one clear timeline.',
    status: 'Live',
    category: 'Planning',
  },
  {
    id: 'DASHBOARD',
    title: 'Unified Dashboard',
    description:
      'Goals, habits, tasks, wellness, budget, and planning — one clean interface. No more switching between apps.',
    status: 'Live',
    category: 'Core',
  },
  {
    id: 'WELLNESS_TRACK',
    title: 'Wellness & Sleep',
    description:
      'Track mood, energy, sleep quality, and recovery. See how your lifestyle patterns affect productivity over time.',
    status: 'Live',
    category: 'Wellness',
  },
  {
    id: 'GAMIFICATION',
    title: 'XP & Levels',
    description:
      'Earn XP for completing habits and tasks. Level up, unlock badges, and maintain streaks that keep you motivated.',
    status: 'Live',
    category: 'Motivation',
  },
  {
    id: 'WEEKLY_REVIEW',
    title: 'AI Weekly Reviews',
    description:
      'Get AI-generated weekly summaries. See what worked, what didn\'t, and receive personalized focus recommendations.',
    status: 'Live',
    category: 'Analytics',
  },
  {
    id: 'NUTRITION_LOG',
    title: 'Nutrition Tracking',
    description:
      'Log meals and track macros. Connect nutrition data to energy levels and correlate with performance goals.',
    status: 'Live',
    category: 'Wellness',
  },
  {
    id: 'TELEGRAM_BOT',
    title: 'Telegram Integration',
    description:
      'Check in on habits, receive reminders, and log progress from Telegram. Stay consistent without opening the app.',
    status: 'Live',
    category: 'Integration',
  },
  {
    id: 'DATA_SECURITY',
    title: 'Encrypted & Private',
    description:
      'Your data is encrypted, synced in real-time, and preserved across plan changes. Privacy-first — no data selling.',
    status: 'Secure',
    category: 'Security',
  },
];

// ─── METRICS ────────────────────────────────────────────────────────────────
const METRICS = [
  { value: '50K+', label: 'people started' },
  { value: '2M+', label: 'habits completed' },
  { value: '99.9%', label: 'platform uptime' },
  { value: '<2 min', label: 'to start onboarding' },
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
      'Resurgo is an AI-powered habit tracker and goal planner. You set a goal, the AI breaks it into milestones and daily tasks, and you track progress with habits, focus sessions, and AI coaching. It works on desktop and mobile as a Progressive Web App, and is also available as an Android APK.',
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
      'You choose from 6 specialized AI coaches, each with a unique personality and approach — from Stoic philosophy to creative energy. Coaches respond based on your goals, habits, and recent progress. Two coaches are free; the rest unlock with a Pro plan.',
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
    question: 'What is the best free AI habit tracker in 2025?',
    answer:
      'Resurgo is one of the top free AI habit trackers available in 2025. Unlike basic trackers, Resurgo uses AI to automatically break your goals into milestones and daily habits, offers Pomodoro and Deep Work focus timers, provides AI coaching via four distinct personas, and has a gamification system with XP and levels — all on the free plan with no time limit.',
  },
  {
    question: 'Does Resurgo work offline?',
    answer:
      'Yes. When installed as a Progressive Web App, Resurgo works offline. Your habits, tasks, and recent data are cached locally so you can continue logging progress without an internet connection. Changes sync automatically when you reconnect.',
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
  '6 AI COACHING PERSONAS',
  'DAILY & WEEKLY PLANNING',
  'GAMIFICATION & XP SYSTEM',
  'TELEGRAM BOT INTEGRATION',
  'INSTALL AS PWA — ANY DEVICE, NO APP STORE NEEDED',
  'WELLNESS & SLEEP TRACKING',
  'NUTRITION & RECOVERY LOGS',
];

// ─── ONBOARDING STEPS ───────────────────────────────────────────────────────
const BOOT_STEPS = [
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
    price: '$0',
    period: '/forever',
    specs: [
      'Unlimited habits & goals',
      'Focus timer (all modes)',
      '2 AI coaches (Nova & Phoenix)',
      'Daily planning',
      'Basic analytics',
      'Mobile PWA access',
    ],
    cta: 'START FREE',
    highlight: false,
  },
  {
    tier: 'PRO',
    price: '$4.99',
    period: '/month',
    specs: [
      'Everything in Free',
      'All 4 AI coaches unlocked',
      'Advanced analytics & insights',
      'Weekly AI reviews',
      'Priority support',
      'Telegram bot access',
    ],
    cta: 'UPGRADE TO PRO',
    highlight: true,
  },
  {
    tier: 'PRO YEARLY',
    price: '$29.99',
    period: '/year',
    specs: [
      'Everything in Pro',
      'Save 50% vs monthly',
      'Early access to new features',
      'Annual AI progress report',
    ],
    cta: 'SAVE WITH YEARLY',
    highlight: false,
  },
  {
    tier: 'LIFETIME',
    price: '$49.99',
    period: 'one-time',
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
    name: 'NOVA',
    style: 'Systems Architect',
    desc: 'Thinks in systems, leverage points, and second-order effects. Nova can build complete plans, create tasks, and design habit systems directly from conversation.',
    free: true,
  },
  {
    name: 'TITAN',
    style: 'Performance Engine',
    desc: 'Your body is the foundation. Titan creates workout plans, nutrition protocols, and energy optimization systems — all action-capable.',
    free: false,
  },
  {
    name: 'SAGE',
    style: 'Wealth Architect',
    desc: 'Every dollar is a soldier. Sage builds financial plans, savings goals, career roadmaps, and compound growth strategies for you.',
    free: false,
  },
  {
    name: 'PHOENIX',
    style: 'Resilience Forge',
    desc: 'Built for rock bottom. Phoenix creates recovery plans, micro-step momentum systems, and turns setbacks into structured comebacks.',
    free: true,
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

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

function LandingPageV2() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeLog, setActiveLog] = useState(0);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [heroVariant, setHeroVariant] = useState('control');

  useEffect(() => {
    // Prevent auto-scroll to hash anchors on initial page load (e.g. #demo from ad URLs)
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      window.scrollTo(0, 0);
    }

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
      {/* ────────────────────── HEADER ────────────────────── */}
      <header className="sticky top-0 z-50 border-b-2 border-zinc-800 bg-black/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark className="w-8 h-8" />
            <span className="font-pixel text-[0.7rem] tracking-[0.2em] text-orange-500">RESURGO</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Coaches', href: '#coaches' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Blog', href: '/learn' },
              { label: 'FAQ', href: '#faq' },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-terminal text-sm font-medium tracking-wide text-zinc-400 transition-colors duration-100 hover:text-orange-400"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="font-terminal text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="border-2 border-orange-600 bg-orange-950/40 px-5 py-2 font-terminal text-sm font-semibold text-orange-400 shadow-[2px_2px_0px_rgba(0,0,0,0.7)] transition-all hover:bg-orange-600 hover:text-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,0.7)]"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Ticker bar */}
        <div className="overflow-hidden border-t-2 border-zinc-800 bg-black py-1.5 text-center">
          <p className="truncate px-4 font-terminal text-sm tracking-widest text-zinc-500 transition-all duration-500">
            &gt; {TICKER_ITEMS[tickerIdx]}
          </p>
        </div>
      </header>

      <main>
        {/* ────────────────── PWA INSTALL BANNER ────────────────── */}
        <section className="border-b border-orange-900/40 bg-gradient-to-r from-orange-950/30 via-black to-orange-950/30 px-4 py-4 sm:px-6 lg:px-8">
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
              INSTALL APP
            </a>
          </div>
        </section>

        {/* ────────────────────── HERO ────────────────────── */}
        <section id="system" className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
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
            {/* Badge */}
            <div className="mb-6 inline-flex max-w-full flex-wrap items-center gap-2 border-2 border-zinc-800 bg-black px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.6)]">
              <span className="h-2 w-2 shrink-0 animate-pulse bg-orange-600" />
              <span className="font-pixel text-[0.55rem] leading-relaxed tracking-widest text-zinc-500 sm:text-[0.6rem]">
                FREE AI HABIT TRACKER · GOAL PLANNER · FOCUS TIMER · AI COACHING
              </span>
            </div>

            <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Left — copy */}
              <div>
                {/* Pixel art streak bars */}
                <div aria-hidden="true" className="mb-6 flex items-end gap-px">
                  {[4,5,4,7,6,9,7,11,9,13,11,15,13,17,15,19,17,20,20,20,20,20,20,20].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}px` }}
                      className={i < 18 ? 'w-2 bg-orange-600/70' : 'w-2 bg-zinc-800'}
                    />
                  ))}
                  <span className="ml-3 self-end font-pixel text-[0.4rem] tracking-widest text-zinc-600">
                    CONSISTENCY_RISING
                  </span>
                </div>

                <h1 className="font-pixel text-4xl leading-[1.1] tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl xl:text-7xl">
                  {heroContent.headingMain}
                  <span className="block text-orange-500">
                    {heroContent.headingAccent}
                  </span>
                </h1>
                <p className="mt-6 max-w-xl font-terminal text-lg leading-relaxed text-zinc-400 sm:text-xl">
                  {heroContent.subcopy}
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/sign-up"
                    className="inline-flex min-h-[56px] items-center justify-center border-2 border-orange-600 bg-orange-600 px-8 font-mono text-sm font-bold tracking-wider text-black shadow-[3px_3px_0px_rgba(0,0,0,0.8)] transition-all duration-100 hover:bg-orange-500 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(0,0,0,0.8)]"
                  >
                    Start Free — No Credit Card
                  </Link>
                  <a
                    href="/download"
                    className="inline-flex min-h-[56px] items-center justify-center gap-2 border-2 border-zinc-800 px-8 font-mono text-sm tracking-wider text-zinc-400 shadow-[2px_2px_0px_rgba(0,0,0,0.5)] transition-all duration-100 hover:border-orange-600 hover:text-orange-400 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,0.5)]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Install as PWA
                  </a>
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

              {/* Right — terminal preview */}
              <div className="overflow-hidden border-2 border-zinc-800 bg-black shadow-[4px_4px_0px_rgba(0,0,0,0.7)]">
                <div className="flex items-center justify-between border-b-2 border-zinc-800 px-4 py-2">
                  <span className="font-pixel text-[0.6rem] tracking-widest text-orange-500">COMMAND_CTR</span>
                  <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">CYCLE: ACTIVE</span>
                </div>
                <div className="space-y-px p-3 sm:p-4">
                  {[
                    { label: 'Morning habit routine', meta: 'Health · streak 14 days', status: 'Done', color: 'green' as const },
                    { label: 'Deep work session', meta: 'Focus · 2 h planned', status: 'Active', color: 'orange' as const },
                    { label: 'AI coach check-in', meta: 'NOVA · Systems strategy', status: 'Ready', color: 'zinc' as const },
                    { label: 'Weekly goal review', meta: 'Strategy · AI brief', status: 'Later', color: 'zinc' as const },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-2 border border-zinc-900 bg-black px-2 py-2 sm:px-3 sm:py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-terminal text-sm text-zinc-300 sm:text-base">{row.label}</p>
                        <p className="truncate font-terminal text-xs text-zinc-400 sm:text-sm">{row.meta}</p>
                      </div>
                      <span
                        className={cn(
                          'shrink-0 border-2 px-1.5 py-0.5 font-pixel text-[0.3rem] tracking-widest sm:px-2 sm:text-[0.35rem]',
                          row.color === 'green' && 'border-green-900 bg-green-950/50 text-green-500',
                          row.color === 'orange' && 'border-orange-900 bg-orange-950/50 text-orange-500',
                          row.color === 'zinc' && 'border-zinc-800 bg-zinc-900/50 text-zinc-500',
                        )}
                      >
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-px border-t-2 border-zinc-800">
                  <div className="bg-black px-2 py-3 sm:px-4">
                    <p className="truncate font-pixel text-[0.3rem] tracking-widest text-zinc-400 sm:text-[0.35rem]">INTEGRITY</p>
                    <p className="mt-1 font-pixel text-xs text-orange-500 sm:text-sm">89%</p>
                  </div>
                  <div className="border-l-2 border-zinc-800 bg-black px-2 py-3 sm:px-4">
                    <p className="truncate font-pixel text-[0.3rem] tracking-widest text-zinc-400 sm:text-[0.35rem]">FOCUS</p>
                    <p className="mt-1 font-pixel text-xs text-green-500 sm:text-sm">18.5h</p>
                  </div>
                  <div className="border-l-2 border-zinc-800 bg-black px-2 py-3 sm:px-4">
                    <p className="truncate font-pixel text-[0.3rem] tracking-widest text-zinc-400 sm:text-[0.35rem]">XP WK</p>
                    <p className="mt-1 font-pixel text-xs text-orange-400 sm:text-sm">2,340</p>
                  </div>
                </div>
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
              Why we built the Resurgo AI habit tracker
            </h2>

            <div className="mt-8 space-y-6 text-left">
              <p className="font-terminal text-lg leading-relaxed text-zinc-300">
                We were tired of switching between five different apps just to stay organized. One for goals, one for
                habits, one for focus timers, one for journaling, one for wellness. None of them talked to each other.
                None of them understood the full picture of what you&apos;re trying to achieve.
              </p>
              <p className="font-terminal text-lg leading-relaxed text-zinc-300">
                So we built <span className="font-bold text-orange-400">Resurgo</span> —{' '}
                <span className="italic text-zinc-200">Latin for &ldquo;to rise again&rdquo;</span>. A single platform
                where you set one clear goal, break it down with AI, execute daily with habits and focus sessions, and
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
              <h2 className="mt-2 font-pixel text-lg text-zinc-100 sm:text-xl">
                How to achieve any goal: the Resurgo framework
              </h2>
              <p className="mx-auto mt-3 max-w-2xl font-terminal text-lg leading-relaxed text-zinc-300">
                Goals fail because of vague intentions, inconsistent execution, and no feedback loop. The Resurgo AI habit tracker solves all three.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {ACHIEVEMENT_STEPS.map((step) => (
                <article key={step.num} className="border-2 border-zinc-800 bg-black p-6 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center border-2 border-orange-900 bg-orange-950/40 font-pixel text-[0.55rem] text-orange-500">
                      {step.num}
                    </span>
                    <div>
                      <h3 className="font-pixel text-[0.55rem] text-zinc-100">{step.title}</h3>
                      <p className="font-pixel text-[0.35rem] tracking-widest text-orange-500">{step.subtitle}</p>
                    </div>
                  </div>
                  <p className="mt-4 font-terminal text-base leading-relaxed text-zinc-300">{step.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────── HOW IT WORKS (ONBOARDING) ────────────────── */}
        <section id="how-it-works" className="border-t-2 border-zinc-800 bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="font-pixel text-[0.6rem] tracking-widest text-orange-500">GETTING_STARTED</p>
              <h2 className="mt-2 font-pixel text-lg text-zinc-100 sm:text-xl">
                How to build better habits with Resurgo
              </h2>
              <p className="mx-auto mt-3 max-w-2xl font-terminal text-lg leading-relaxed text-zinc-300">
                No complicated setup. Go from zero to a personalized AI habit plan in under 2 minutes — and start your first habit the same day.
              </p>
            </div>

            <div className="grid gap-px border-2 border-zinc-800 bg-zinc-800 md:grid-cols-3">
              {BOOT_STEPS.map((s) => (
                <article key={s.step} className="bg-black p-5 sm:p-6">
                  <p className="font-pixel text-[0.35rem] tracking-widest text-orange-500">STEP {s.step}</p>
                  <h3 className="mt-2 font-pixel text-[0.55rem] text-zinc-100">{s.cmd}</h3>
                  <p className="mt-3 font-terminal text-base leading-relaxed text-zinc-300">{s.desc}</p>
                </article>
              ))}
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
                  Every habit tracking tool you need — in one app
                </h2>
              </div>
              <p className="max-w-md font-terminal text-lg leading-relaxed text-zinc-300">
                12 integrated tools — goal planner, habit tracker, focus timer, AI coach, wellness log, and more. Stop paying for five separate apps.
              </p>
            </div>

            <div className="grid gap-px border-2 border-zinc-800 bg-zinc-800 sm:grid-cols-2 lg:grid-cols-3">
              {CORE_FEATURES.map((spec) => (
                <article key={spec.id} className="bg-black p-4 transition hover:bg-zinc-900 sm:p-5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="min-w-0 truncate font-pixel text-[0.55rem] tracking-widest text-orange-600 sm:text-[0.6rem]">{spec.id}</span>
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
                  <h3 className="mt-2 font-pixel text-[0.6rem] text-zinc-200 sm:text-[0.65rem]">{spec.title}</h3>
                  <p className="mt-2 font-terminal text-sm leading-relaxed text-zinc-400 sm:text-base">{spec.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────── AI COACHES ────────────────── */}
        <section id="coaches" className="border-t-2 border-zinc-800 bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="font-pixel text-[0.6rem] tracking-widest text-orange-600">AI_COACHING_ENGINE</p>
              <h2 className="mt-2 font-pixel text-lg text-zinc-100 sm:text-xl">
                4 AI coaches. Choose your mentor.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl font-terminal text-lg leading-relaxed text-zinc-300">
                Each coach has a distinct personality, philosophy, and strategy. Nova and Phoenix are free forever. Unlock all four with Pro.
              </p>
            </div>

            <div className="grid gap-px border-2 border-zinc-800 bg-zinc-800 sm:grid-cols-2 lg:grid-cols-3">
              {AI_COACHES.map((coach) => (
                <article key={coach.name} className="relative bg-black p-4 transition hover:bg-zinc-900/60 sm:p-5">
                  {/* Free / Pro badge */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="min-w-0 truncate font-pixel text-[0.6rem] tracking-widest text-zinc-100 sm:text-[0.65rem]">{coach.name}</span>
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
                  <p className="mt-1 font-pixel text-[0.35rem] tracking-widest text-orange-500">{coach.style}</p>
                  <p className="mt-3 font-terminal text-sm leading-relaxed text-zinc-400 sm:text-base">{coach.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────── PRICING ────────────────── */}
        <section id="access" className="border-t-2 border-zinc-800 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-pixel text-lg text-zinc-100 sm:text-xl">Simple, transparent pricing</h2>
            <p className="mx-auto mt-2 max-w-xl text-center font-terminal text-lg text-zinc-400">
              Start free forever. Upgrade to Pro only when you&apos;re ready. No lock-in, no hidden fees, no trial that expires.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {ACCESS_TIERS.map((plan) => (
                <article
                  key={plan.tier}
                  className={cn(
                    'flex flex-col p-5 shadow-[2px_2px_0px_rgba(0,0,0,0.5)] sm:p-6',
                    plan.highlight
                      ? 'border-2 border-orange-900 bg-orange-950/20'
                      : (plan as any).earlyAccess
                        ? 'border-2 border-yellow-800 bg-yellow-950/10'
                        : 'border-2 border-zinc-800 bg-black',
                  )}
                >
                  {plan.highlight && (
                    <p className="mb-3 font-pixel text-[0.55rem] tracking-widest text-orange-500">&#9733; MOST POPULAR</p>
                  )}
                  {(plan as any).earlyAccess && (
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="border border-yellow-700 bg-yellow-950/60 px-2 py-0.5 font-pixel text-[0.5rem] tracking-widest text-yellow-400">
                        ⚡ FOUNDING PRICE
                      </span>
                      <span className="border border-red-900/60 bg-red-950/30 px-2 py-0.5 font-pixel text-[0.5rem] tracking-widest text-red-400">
                        FIRST 1,000 ONLY
                      </span>
                    </div>
                  )}
                  <p className="font-pixel text-[0.6rem] tracking-widest text-zinc-300">{plan.tier}</p>

                  {(plan as any).earlyAccess ? (
                    <div className="mt-3">
                      <p className="font-pixel text-sm text-zinc-100">
                        {plan.price}
                        <span className="font-terminal text-sm text-zinc-400"> {plan.period}</span>
                      </p>
                      <p className="mt-1 font-terminal text-sm text-zinc-500">
                        <span className="line-through">{(plan as any).originalPrice}</span>
                        <span className="ml-2 text-yellow-500">save 44%</span>
                      </p>
                      <p className="mt-1 font-pixel text-[0.5rem] tracking-widest text-zinc-500">
                        Regular price after {(plan as any).spotsLeft} spots
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 font-pixel text-sm text-zinc-100">
                      {plan.price}
                      <span className="font-terminal text-base text-zinc-400"> {plan.period}</span>
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
                  <Link
                    href="/sign-up"
                    className={cn(
                      'mt-5 inline-flex min-h-[44px] w-full items-center justify-center px-3 font-pixel text-[0.45rem] tracking-widest transition active:translate-x-[2px] active:translate-y-[2px]',
                      plan.highlight
                        ? 'border-2 border-orange-600 bg-orange-600 text-black shadow-[3px_3px_0px_rgba(0,0,0,0.7)] hover:bg-orange-500'
                        : (plan as any).earlyAccess
                          ? 'border-2 border-yellow-700 bg-yellow-950/40 text-yellow-400 shadow-[2px_2px_0px_rgba(0,0,0,0.5)] hover:border-yellow-500 hover:bg-yellow-900/30'
                          : 'border-2 border-zinc-700 text-zinc-300 shadow-[2px_2px_0px_rgba(0,0,0,0.5)] hover:border-orange-600 hover:text-orange-500',
                    )}
                  >
                    {plan.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ────────────────── TESTIMONIALS ────────────────── */}
        <section id="logs" className="border-t-2 border-zinc-800 bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-pixel text-lg text-zinc-100 sm:text-xl">
                  What users achieve with Resurgo
                </h2>
                <p className="mt-1 font-terminal text-lg text-zinc-400">
                  Real outcomes from people using Resurgo to track habits and hit goals daily
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
                    <p className="font-pixel text-[0.45rem] text-zinc-400">{TESTIMONIALS[activeLog].name}</p>
                    <p className="font-pixel text-[0.35rem] tracking-widest text-zinc-400">
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
                      <p className="font-pixel text-[0.6rem] text-zinc-400">{t.name}</p>
                      <p className="font-pixel text-[0.55rem] tracking-widest text-zinc-500">{t.role}</p>
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
            <h2 className="font-pixel text-lg text-zinc-100 sm:text-xl">Frequently asked questions about AI habit tracking</h2>
            <p className="mt-2 font-terminal text-lg text-zinc-400">
              Everything you need to know about Resurgo — free plan, AI coaching, PWA install, privacy, and more.
            </p>

            <div
              className="mt-8 space-y-px border-2 border-zinc-800"
              itemScope
              itemType="https://schema.org/FAQPage"
            >
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <article
                    key={faq.question}
                    className="bg-black"
                    itemProp="mainEntity"
                    itemScope
                    itemType="https://schema.org/Question"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <h3 itemProp="name" className="font-terminal text-base text-zinc-300">
                        {faq.question}
                      </h3>
                      <span
                        className={cn(
                          'shrink-0 font-pixel text-[0.45rem] text-zinc-400 transition-transform',
                          isOpen && 'rotate-180',
                        )}
                      >
                        &#9662;
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
                          className="border-t-2 border-zinc-800 px-5 pb-4 pt-3 font-terminal text-base leading-relaxed text-zinc-400"
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

        {/* ────────────────── BRAIN DUMP DEMO ────────────────── */}
        <section id="demo" className="border-t-2 border-zinc-800 bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <p className="font-pixel text-[0.6rem] tracking-widest text-orange-600">INTERACTIVE_DEMO</p>
              <h2 className="mt-2 font-pixel text-lg text-zinc-100 sm:text-xl">
                Try the AI habit planner — live
              </h2>
              <p className="mx-auto mt-2 max-w-xl font-terminal text-lg text-zinc-400">
                Enter any goal and watch the AI break it into milestones, habits, and daily tasks in real time.
              </p>
            </div>

            <DemoSandbox />

            <div className="mt-8">
              <SocialProof />
            </div>

            <div className="mt-8 border-2 border-zinc-800 bg-black p-5 shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              <EmailCapture
                variant="inline"
                source="landing_demo_section"
                offer="7-Day Resurgo Reset"
              />
            </div>

            <div className="mt-8">
              <LandingChatWidget />
            </div>
          </div>
        </section>

        {/* ────────────────── CTA TERMINAL ────────────────── */}
        <section className="border-t-2 border-zinc-800 px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-6xl border-2 border-zinc-800 bg-black shadow-[4px_4px_0px_rgba(0,0,0,0.7)]">
            <div className="flex items-center gap-2 border-b-2 border-zinc-800 px-5 py-2">
              <span className="h-2 w-2 bg-orange-600" />
              <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-400">
                TERMINAL :: READY_FOR_INPUT
              </span>
            </div>
            <div className="px-6 py-12 text-center sm:px-10">
              <p className="font-pixel text-[0.6rem] tracking-widest text-orange-600">YOUR_NEXT_MOVE</p>
              <h2 className="mt-3 font-pixel text-lg text-zinc-100 sm:text-xl">
                Ready to build habits that actually stick?
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-terminal text-lg leading-relaxed text-zinc-300">
                Create your free account, set one goal, and follow your first personalized AI habit plan — all in under 2 minutes. No credit card. No trial that expires. Free forever.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="inline-flex min-h-[48px] items-center justify-center border-2 border-orange-600 bg-orange-600 px-8 font-pixel text-[0.45rem] tracking-widest text-black shadow-[3px_3px_0px_rgba(0,0,0,0.7)] transition hover:bg-orange-500 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  [ START FREE — NO CREDIT CARD ]
                </Link>
                <a
                  href="/download"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 border-2 border-zinc-800 px-8 font-pixel text-[0.6rem] tracking-widest text-zinc-500 shadow-[2px_2px_0px_rgba(0,0,0,0.5)] transition hover:border-zinc-600 hover:text-zinc-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  [ INSTALL_AS_PWA ]
                </a>
                <Link
                  href="/pricing"
                  className="inline-flex min-h-[48px] items-center justify-center border-2 border-zinc-800 px-8 font-pixel text-[0.6rem] tracking-widest text-zinc-500 shadow-[2px_2px_0px_rgba(0,0,0,0.5)] transition hover:border-zinc-600 hover:text-zinc-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  [ VIEW_ACCESS_TIERS ]
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 font-pixel text-[0.55rem] tracking-widest text-zinc-400">
                <span>&gt; FREE_PLAN_FOREVER</span>
                <span>&gt; NO_CREDIT_CARD_REQUIRED</span>
                <span>&gt; WORKS_OFFLINE_AS_PWA</span>
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
      <ScrollToTop />
    </div>
  );
}

export default LandingPageV2;



