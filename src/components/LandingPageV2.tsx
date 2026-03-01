'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ScrollToTop } from '@/components/ScrollToTop';

const VALUE_PILLARS = [
  {
    id: 'AI Goal Breakdown',
    description: 'Turn a big goal into milestones, weekly actions, and daily tasks in seconds.',
    status: 'Live',
  },
  {
    id: 'Habit System',
    description: 'Track streaks, completion patterns, and consistency with zero busywork.',
    status: 'Live',
  },
  {
    id: 'Focus Engine',
    description: 'Run Pomodoro, Deep Work, or custom sessions with distraction logging.',
    status: 'Live',
  },
  {
    id: 'AI Coaching',
    description: 'Get clear, actionable coaching based on your goals and recent progress.',
    status: 'Live',
  },
  {
    id: 'Unified Dashboard',
    description: 'Goals, habits, tasks, wellness, and planning in one clean interface.',
    status: 'Live',
  },
  {
    id: 'Safe Data',
    description: 'Your data is secure, synced, and preserved across plan changes.',
    status: 'Secure',
  },
];

const METRICS = [
  { value: '50K+', label: 'people started' },
  { value: '2M+', label: 'habits completed' },
  { value: '99.9%', label: 'platform uptime' },
  { value: '<2 min', label: 'to start onboarding' },
];

const TESTIMONIALS = [
  {
    name: 'M. Chen',
    role: 'Founder',
    quote:
      'I stopped juggling five apps. Resurgo gave me one clean workflow for planning, execution, and review.',
    outcome: '3 launches in 1 quarter',
  },
  {
    name: 'J. Park',
    role: 'Freelance Designer',
    quote:
      'The app is simple enough to use daily, but powerful enough to keep me consistent when motivation dips.',
    outcome: '127-day consistency streak',
  },
  {
    name: 'A. Thompson',
    role: 'Medical Student',
    quote:
      'I use it for study plans, habits, and recovery. It helps me prioritize what matters each day.',
    outcome: 'Top 10% class performance',
  },
];

const FAQS = [
  {
    question: 'What is Resurgo in one sentence?',
    answer:
      'Resurgo is an AI-powered habit and goal platform that helps you plan clearly, execute daily, and stay consistent long term.',
  },
  {
    question: 'How long does onboarding take?',
    answer:
      'Most people finish setup in under two minutes. You choose your focus, define your goal, and get a personalized execution plan.',
  },
  {
    question: 'Can I use it free forever?',
    answer:
      'Yes. The free plan is available forever with core tracking features. Upgrade only when you need advanced AI and analytics.',
  },
  {
    question: 'Will I lose data if I change plans?',
    answer:
      'No. Your historical data stays preserved and accessible. Plan changes never wipe your progress.',
  },
  {
    question: 'Is Resurgo mobile-friendly?',
    answer:
      'Yes. Resurgo is responsive and installable as a PWA on modern phones and tablets.',
  },
];

const TICKER_ITEMS = [
  'SYNCING_NODES',
  'CALIBRATING_WILLPOWER',
  'ANALYZING_UPTIME',
  'INTEGRITY_CHECK_PASSED',
  'LOADING_OBJECTIVES',
  'BEHAVIORAL_SCAN_COMPLETE',
  'SYSTEM_READY',
  'DEEP_WORK_PROTOCOL_AVAILABLE',
];

const BOOT_STEPS = [
  {
    step: '01',
    cmd: 'Create your main goal',
    desc: 'Tell Resurgo what you want to achieve. Keep it simple and outcome-focused.',
  },
  {
    step: '02',
    cmd: 'Get your AI roadmap',
    desc: 'The app breaks your goal into milestones, weekly targets, and daily actions.',
  },
  {
    step: '03',
    cmd: 'Run your daily system',
    desc: 'Track habits, complete tasks, and use AI coaching to stay focused and consistent.',
  },
];

const ACCESS_TIERS = [
  {
    tier: 'FREE',
    price: '$0',
    period: 'forever',
    specs: ['5 Brain dumps/day', '3 Goals max', '10 AI messages/day', 'Core habit tracking'],
    cta: 'Start Free',
    highlight: false,
  },
  {
    tier: 'PRO',
    price: '$4.99',
    period: '/month',
    specs: ['Unlimited everything', 'Full AI coaching', 'Advanced analytics', 'Priority support'],
    cta: 'Go Pro',
    highlight: true,
  },
  {
    tier: 'PRO YEARLY',
    price: '$29.99',
    period: '/year',
    specs: ['Same as Pro (~$2.50/mo)', 'Unlock all features', 'Save 50% vs monthly', 'Cancel anytime'],
    cta: 'Best Value',
    highlight: false,
  },
  {
    tier: 'LIFETIME',
    price: '$49.99',
    period: 'one-time',
    specs: ['All Pro features', 'All future updates', 'Founder access', 'Pay once, own forever'],
    cta: 'Get Lifetime',
    highlight: false,
  },
];

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface LandingPageProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
}

export function LandingPageV2(_props: LandingPageProps = {}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeLog, setActiveLog] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [tickerIdx, setTickerIdx] = useState(0);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setActiveLog((p) => (p + 1) % TESTIMONIALS.length), 5200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setTickerIdx((p) => (p + 1) % TICKER_ITEMS.length), 2400);
    return () => window.clearInterval(id);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') setShowInstallButton(false);
    setDeferredPrompt(null);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black font-sans text-zinc-300">
      {/* Scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.025] [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.2)_3px,transparent_3px)] [background-size:100%_4px]" />

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/pixel-logo.svg"
              alt="RESURGO logo"
              width={32}
              height={32}
              className="h-8 w-8"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="font-mono text-base font-bold tracking-widest text-orange-500">
              RESURGO.life
            </span>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {[
              ['#system', 'Home'],
              ['#how-it-works', 'How it works'],
              ['#specs', 'Features'],
              ['#access', 'Pricing'],
              ['#logs', 'Results'],
              ['#faq', 'FAQ'],
            ].map(([href, label]) => (
              <a
                key={label}
                href={href}
                className="px-3 py-2 font-mono text-sm text-zinc-400 transition-colors hover:text-orange-500"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="border border-zinc-800 px-3 py-1.5 font-mono text-[11px] tracking-widest text-zinc-500 transition hover:border-orange-600 hover:text-orange-500"
              >
                [INSTALL]
              </button>
            )}
            <Link
              href="/sign-in"
              className="font-mono text-sm text-zinc-400 transition hover:text-zinc-200"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="border border-orange-600 bg-orange-950/30 px-5 py-2 font-mono text-sm font-bold text-orange-500 transition hover:bg-orange-600 hover:text-black"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Status ticker */}
        <div className="border-t border-zinc-900 bg-zinc-950 px-4 py-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-mono text-[9px] tracking-widest text-orange-600">SYS&gt;</span>
            <span className="font-mono text-[9px] tracking-widest text-zinc-400">
              {TICKER_ITEMS[tickerIdx]}
              <span className="ml-0.5 animate-blink text-orange-600">_</span>
            </span>
            <span className="mx-2 text-zinc-800">|</span>
            <span className="font-mono text-[9px] tracking-widest text-zinc-400">
              STATUS: ALL_SYSTEMS_NOMINAL
            </span>
            <span className="mx-2 text-zinc-800">|</span>
            <span className="font-mono text-[9px] tracking-widest text-zinc-400">NODES: 50K+ ONLINE</span>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="system" className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 inline-flex items-center gap-2 border border-zinc-900 bg-zinc-950 px-3 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
              <span className="font-mono text-[10px] tracking-widest text-zinc-500">
                BUILT FOR CLARITY, CONSISTENCY, AND EXECUTION
              </span>
            </div>

            <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h1 className="font-mono text-4xl font-bold leading-tight tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl">
                  Build better habits.
                  <span className="block text-orange-500">Achieve goals with less friction.</span>
                </h1>
                <div className="mt-3 flex items-center gap-3">
                  <span className="font-mono text-sm tracking-widest text-zinc-300">[RESURGO_v1.0]</span>
                  <span className="hidden font-mono text-sm text-zinc-400 md:block">
                    AI habit tracker + goal planner + focus coach in one app
                  </span>
                </div>

                <p className="mt-8 max-w-2xl font-mono text-base leading-relaxed text-zinc-300">
                  Resurgo helps you go from <span className="text-zinc-100">overwhelmed</span> to{' '}
                  <span className="text-zinc-100">organized</span>. Set one clear goal, get an AI roadmap,
                  and execute daily with habits, tasks, and focus sessions.
                </p>

                <div className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
                  {[
                    'Simple setup in under 2 minutes',
                    'Free plan available forever',
                    'Works on desktop and mobile',
                    'No data loss when changing plans',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 border border-zinc-900 bg-zinc-950 px-3 py-2">
                      <span className="text-orange-500">●</span>
                      <span className="font-mono text-xs text-zinc-300">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/sign-up"
                    className="inline-flex min-h-[52px] items-center justify-center border border-orange-600 bg-orange-950/40 px-8 font-mono text-base font-bold text-orange-500 transition hover:bg-orange-600 hover:text-black"
                  >
                    Start Free →
                  </Link>
                  <a
                    href="#specs"
                    className="inline-flex min-h-[52px] items-center justify-center border border-zinc-800 px-8 font-mono text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-300"
                  >
                    See Features
                  </a>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {METRICS.map((m) => (
                    <div key={m.label} className="border border-zinc-900 bg-zinc-950 px-4 py-4">
                      <p className="font-mono text-2xl font-bold text-orange-400">{m.value}</p>
                      <p className="mt-1 font-mono text-xs text-zinc-300">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal preview panel */}
              <div className="border border-zinc-900 bg-zinc-950">
                <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2">
                  <span className="font-mono text-[10px] tracking-widest text-orange-600">COMMAND_CTR</span>
                  <span className="font-mono text-[9px] tracking-widest text-zinc-400">CYCLE: ACTIVE</span>
                </div>
                <div className="space-y-px p-4">
                  {[
                    { label: 'Morning habit routine', meta: 'Health · streak 7 days', status: 'Done', color: 'green' as const },
                    { label: 'Deep work session', meta: 'Focus · 2 sessions planned', status: 'In progress', color: 'orange' as const },
                    { label: 'Weekly goal review', meta: 'Strategy · AI brief ready', status: 'Pending', color: 'zinc' as const },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between border border-zinc-900 bg-black px-3 py-2.5"
                    >
                      <div>
                        <p className="font-mono text-xs text-zinc-300">{row.label}</p>
                        <p className="font-mono text-[10px] text-zinc-400">{row.meta}</p>
                      </div>
                      <span
                        className={cn(
                          'border px-2 py-0.5 font-mono text-[9px] tracking-widest',
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
                <div className="grid grid-cols-2 gap-px border-t border-zinc-900">
                  <div className="bg-zinc-950 px-4 py-3">
                    <p className="font-mono text-[9px] tracking-widest text-zinc-400">WEEKLY_INTEGRITY</p>
                    <p className="mt-1 font-mono text-2xl font-bold text-orange-500">89%</p>
                  </div>
                  <div className="border-l border-zinc-900 bg-zinc-950 px-4 py-3">
                    <p className="font-mono text-[9px] tracking-widest text-zinc-400">MOMENTUM_DELTA</p>
                    <p className="mt-1 font-mono text-2xl font-bold text-green-500">+14</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="border-t border-zinc-900 bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="font-mono text-xs tracking-widest text-orange-500">HOW_ONBOARDING_WORKS</p>
              <h2 className="mt-2 font-mono text-3xl font-bold text-zinc-100 sm:text-4xl">
                Get started in 3 simple steps
              </h2>
              <p className="mx-auto mt-3 max-w-2xl font-mono text-sm leading-relaxed text-zinc-300">
                No complicated setup. You can go from zero to a personalized execution plan in minutes.
              </p>
            </div>

            <div className="grid gap-px border border-zinc-900 md:grid-cols-3">
              {BOOT_STEPS.map((s) => (
                <article key={s.step} className="bg-black p-6">
                  <p className="font-mono text-[10px] tracking-widest text-orange-500">STEP {s.step}</p>
                  <h3 className="mt-2 font-mono text-base font-bold text-zinc-100">{s.cmd}</h3>
                  <p className="mt-3 font-mono text-sm leading-relaxed text-zinc-300">{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SYSTEM SPECS */}
        <section id="specs" className="border-t border-zinc-900 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] tracking-widest text-orange-600">CORE_CAPABILITIES</p>
                <h2 className="mt-2 font-mono text-3xl font-bold text-zinc-100 sm:text-4xl">Everything in one place</h2>
              </div>
              <p className="max-w-md font-mono text-sm leading-relaxed text-zinc-300">
                You don&apos;t need separate apps for goals, habits, planning, and focus. Resurgo unifies the flow.
              </p>
            </div>

            <div className="grid gap-px border border-zinc-900 md:grid-cols-2 lg:grid-cols-3">
              {VALUE_PILLARS.map((spec) => (
                <article key={spec.id} className="bg-zinc-950 p-5 transition hover:bg-zinc-900">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tracking-widest text-orange-600">{spec.id}</span>
                    <span className="border border-green-900 bg-green-950/40 px-2 py-0.5 font-mono text-[9px] tracking-widest text-green-600">
                      {spec.status}
                    </span>
                  </div>
                  <p className="mt-3 font-mono text-sm leading-relaxed text-zinc-300">{spec.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ACCESS TIER MATRIX */}
        <section id="access" className="border-t border-zinc-900 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center font-mono text-3xl font-bold text-zinc-100 sm:text-4xl">
              Pricing
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center font-mono text-sm text-zinc-400">
              Start free. Upgrade when you&apos;re ready. No lock-in.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {ACCESS_TIERS.map((plan) => (
                <article
                  key={plan.tier}
                  className={cn('p-6', plan.highlight ? 'border border-orange-900 bg-orange-950/20' : 'bg-zinc-950')}
                >
                  {plan.highlight && (
                    <p className="mb-3 font-mono text-xs tracking-widest text-orange-500">
                      ★ MOST POPULAR
                    </p>
                  )}
                  <p className="font-mono text-sm font-bold tracking-widest text-zinc-300">{plan.tier}</p>
                  <p className="mt-3 font-mono text-4xl font-bold text-zinc-100">
                    {plan.price}
                    <span className="font-mono text-sm text-zinc-400"> {plan.period}</span>
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {plan.specs.map((spec) => (
                      <li key={spec} className="flex items-center gap-2 font-mono text-sm text-zinc-300">
                        <span className="text-green-500 text-base">✓</span>
                        {spec}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/sign-up"
                    className={cn(
                      'mt-6 inline-flex min-h-[48px] w-full items-center justify-center font-mono text-sm font-bold tracking-widest transition',
                      plan.highlight
                        ? 'border border-orange-600 bg-orange-600 text-black hover:bg-orange-500'
                        : 'border border-zinc-700 text-zinc-300 hover:border-orange-600 hover:text-orange-500',
                    )}
                  >
                    {plan.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* OPERATOR LOGS */}
        <section id="logs" className="border-t border-zinc-900 bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-mono text-3xl font-bold text-zinc-100 sm:text-4xl">Proof it works</h2>
            <p className="mt-1 font-mono text-sm text-zinc-400">
              Real outcomes from people using Resurgo weekly
            </p>

            <div className="mt-8 border border-zinc-900">
              <div className="flex items-center justify-between border-b border-zinc-900 bg-black px-4 py-2">
                <span className="font-mono text-[9px] tracking-widest text-orange-600">
                  REVIEW_{activeLog + 1}_OF_{TESTIMONIALS.length}
                </span>
                <span className="font-mono text-[9px] tracking-widest text-zinc-400">FIELD_VERIFIED</span>
              </div>
              <div className="bg-zinc-950 p-6">
                <p className="font-mono text-sm leading-relaxed text-zinc-300">
                  &quot;{TESTIMONIALS[activeLog].quote}&quot;
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs font-bold text-zinc-400">
                      {TESTIMONIALS[activeLog].name}
                    </p>
                    <p className="font-mono text-[10px] tracking-widest text-zinc-400">
                      {TESTIMONIALS[activeLog].role}
                    </p>
                  </div>
                  <span className="border border-green-900 bg-green-950/40 px-3 py-1 font-mono text-[10px] tracking-widest text-green-500">
                    RESULT: {TESTIMONIALS[activeLog].outcome}
                  </span>
                </div>
              </div>
              <div className="flex gap-px border-t border-zinc-900">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveLog(idx)}
                    className={cn(
                      'h-0.5 flex-1 transition-colors',
                      activeLog === idx ? 'bg-orange-600' : 'bg-zinc-800 hover:bg-zinc-600',
                    )}
                    aria-label={`Log entry ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-zinc-900 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-mono text-3xl font-bold text-zinc-100 sm:text-4xl">Frequently asked questions</h2>
            <p className="mt-1 font-mono text-[10px] tracking-widest text-zinc-400">
              FAST_ANSWERS_FOR_SETUP_AND_ONBOARDING
            </p>

            <div
              className="mt-8 space-y-px border border-zinc-900"
              itemScope
              itemType="https://schema.org/FAQPage"
            >
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <article
                    key={faq.question}
                    className="bg-zinc-950"
                    itemProp="mainEntity"
                    itemScope
                    itemType="https://schema.org/Question"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <h3 itemProp="name" className="font-mono text-sm text-zinc-300">
                        {faq.question}
                      </h3>
                      <span
                        className={cn(
                          'shrink-0 font-mono text-xs text-zinc-400 transition-transform',
                          isOpen && 'rotate-180',
                        )}
                      >
                        ?
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
                          className="border-t border-zinc-900 px-5 pb-4 pt-3 font-mono text-xs leading-relaxed text-zinc-400"
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

        {/* CTA TERMINAL */}
        <section className="border-t border-zinc-900 px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-6xl border border-zinc-900 bg-zinc-950">
            <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
              <span className="h-2 w-2 rounded-full bg-orange-600" />
              <span className="font-mono text-[10px] tracking-widest text-zinc-400">
                TERMINAL :: READY_FOR_INPUT
              </span>
            </div>
            <div className="px-6 py-12 text-center sm:px-10">
              <p className="font-mono text-[10px] tracking-widest text-orange-600">
                START FREE TODAY
              </p>
              <h2 className="mt-3 font-mono text-3xl font-bold text-zinc-100 sm:text-4xl">
                Ready to become more consistent?
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-mono text-sm leading-relaxed text-zinc-300">
                Set up your account, define one goal, and begin your first execution cycle in under 2 minutes.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="inline-flex min-h-[48px] items-center justify-center border border-orange-600 bg-orange-600 px-8 font-mono text-sm tracking-widest text-black transition hover:bg-orange-500"
                >
                  [ INITIALIZE_SYSTEM ]
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex min-h-[48px] items-center justify-center border border-zinc-800 px-8 font-mono text-sm tracking-widest text-zinc-500 transition hover:border-zinc-600 hover:text-zinc-300"
                >
                  [ VIEW_ACCESS_TIERS ]
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 font-mono text-[9px] tracking-widest text-zinc-400">
                <span>&gt; NO_CREDIT_CARD_REQUIRED</span>
                <span>&gt; CLEAR_ONBOARDING_FLOW</span>
                <span>&gt; MOBILE_READY</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-sm font-bold tracking-widest text-orange-600">RESURGO</p>
            <p className="mt-1 font-mono text-[9px] tracking-widest text-zinc-400">
              BUILD BETTER HABITS. ACHIEVE BIG GOALS.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] tracking-widest text-zinc-400">
            {[
              ['Guides', '/guides'],
              ['Help', '/help'],
              ['Support', '/support'],
              ['Privacy', '/privacy'],
              ['Terms', '/terms'],
            ].map(([label, href]) => (
              <Link key={label} href={href} className="transition hover:text-zinc-400">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
      <ScrollToTop />
    </div>
  );
}

export default LandingPageV2;



