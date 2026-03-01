'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ScrollToTop } from '@/components/ScrollToTop';

const SYSTEM_SPECS = [
  {
    id: 'NODE_INTELLIGENCE',
    description: 'Adaptive AI analyzes habit consistency patterns and issues corrective guidance before degradation compounds.',
    status: 'OPERATIONAL',
  },
  {
    id: 'OBJECTIVE_DECOMP',
    description: 'Long-term targets fractured into precision daily commitments with built-in pacing and milestone integrity.',
    status: 'OPERATIONAL',
  },
  {
    id: 'BEHAVIORAL_TELEMETRY',
    description: 'Trend layers, mood overlays, and friction signals reveal exact drivers of UPTIME degradation.',
    status: 'ONLINE',
  },
  {
    id: 'DATA_PERSISTENCE',
    description: 'Archive/restore engine preserves node momentum through billing state changes. Zero data loss on cycle reboot.',
    status: 'OPERATIONAL',
  },
  {
    id: 'DEEP_WORK_PROTOCOL',
    description: 'Integrated session timers and micro-break rhythms. Reduces context-switching. Maximizes cognitive uptime.',
    status: 'ONLINE',
  },
  {
    id: 'SECURITY_POSTURE',
    description: 'Event logging, hardened auth boundaries, and webhook integrity checks for operational resilience.',
    status: 'SECURED',
  },
];

const METRICS = [
  { value: '50K+', label: 'ACTIVE_OPERATORS' },
  { value: '2M+', label: 'NODE_COMPLETIONS' },
  { value: '81/81', label: 'TESTS_PASSING' },
  { value: '99.9%', label: 'TARGET_UPTIME' },
];

const OPERATOR_LOGS = [
  {
    operator: 'M.CHEN',
    role: 'FOUNDER : ORBIT_STUDIO',
    log: 'Replaced five disconnected tools. Team now runs a single operating rhythm. Velocity increased by 3 launches per quarter.',
    outcome: '+3_LAUNCHES/QTR',
  },
  {
    operator: 'J.PARK',
    role: 'DESIGNER : FREELANCE',
    log: 'Interface delivers exactly what is needed each cycle without cognitive overhead. 127-day streak recovered post-burnout.',
    outcome: 'UPTIME_127_DAYS',
  },
  {
    operator: 'A.THOMPSON',
    role: 'OPERATOR : MED_PROGRAM',
    log: 'Exams, node habits, and recovery tracked in a single system. AI nudges are precise, not generic. Performance top 10%.',
    outcome: 'INTEGRITY+10%',
  },
];

const FAQS = [
  {
    question: 'Is RESURGO suitable for both individuals and teams?',
    answer: 'Yes. Individual operators use it for personal node routines and biometric tracking. Teams use it to sync objectives, track execution discipline, and eliminate planning overhead.',
  },
  {
    question: 'How is this different from standard habit trackers?',
    answer: 'RESURGO is an execution terminal, not a checkbox app. AI coaching, structured decomposition, and production-grade data architecture are core � not add-ons.',
  },
  {
    question: 'Can I start free and upgrade later without losing node data?',
    answer: 'Affirmative. Free operators can access PRO_ACCESS at any time. Downgrade archive/restore logic preserves all nodes and historical UPTIME data.',
  },
  {
    question: 'Does it work on mobile?',
    answer: 'Yes. The terminal is fully responsive, touch-optimized, and installable as a PWA on modern devices.',
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
    cmd: 'DEFINE_OBJECTIVE',
    desc: 'Set strategic targets and constraints. The system resolves what success means in measurable output terms.',
  },
  {
    step: '02',
    cmd: 'GENERATE_EXECUTION_MODEL',
    desc: 'AI decomposes core objectives into milestones, weekly intent, and precision daily node commitments.',
  },
  {
    step: '03',
    cmd: 'RUN_DAILY_CYCLE',
    desc: 'Track node completions, adapt to friction signals, and sustain UPTIME with intelligent coaching loops.',
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
    const id = window.setInterval(() => setActiveLog((p) => (p + 1) % OPERATOR_LOGS.length), 5200);
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
            <img src="/icons/pixel-logo.svg" alt="RESURGO logo" className="h-8 w-8" style={{imageRendering:'pixelated'}} />
            <span className="font-mono text-base font-bold tracking-widest text-orange-500">
              RESURGO.life
            </span>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {[
              ['#system', 'System'],
              ['#specs', 'Features'],
              ['#access', 'Pricing'],
              ['#logs', 'Reviews'],
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
                SYSTEM_INITIALIZATION :: SEQUENCE_01
              </span>
            </div>

            <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h1 className="font-mono text-4xl font-bold leading-tight tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl">
                  INITIALIZE YOUR
                  <span className="block text-orange-600">POTENTIAL.</span>
                </h1>
                <div className="mt-3 flex items-center gap-3">
                  <span className="font-mono text-sm tracking-widest text-zinc-400">[RESURGO_v1.0]</span>
                  <span className="hidden font-mono text-sm text-zinc-400 md:block">
                    EXECUTION OS FOR HIGH-INTEGRITY OPERATORS
                  </span>
                </div>

                <p className="mt-8 max-w-xl font-mono text-sm leading-relaxed text-zinc-500">
                  A pitch-black terminal for habit nodes, mission objectives, and behavioral telemetry.{' '}
                  <span className="text-zinc-400">No clutter. No noise. Only signal.</span>
                </p>

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
                      <p className="font-mono text-2xl font-bold text-zinc-100">{m.value}</p>
                      <p className="mt-1 font-mono text-xs text-zinc-500">{m.label.replace(/_/g, ' ')}</p>
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
                    { label: 'MORNING_RESET_NODE', meta: 'HEALTH / UPTIME: 7D', status: 'OPTIMAL', color: 'green' as const },
                    { label: 'DEEP_WORK_SPRINT', meta: 'PRODUCTIVITY / SESSIONS: 2', status: 'RUNNING', color: 'orange' as const },
                    { label: 'WEEKLY_OBJECTIVE_SYNC', meta: 'STRATEGY / AI_BRIEF: READY', status: 'PENDING', color: 'zinc' as const },
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

        {/* SYSTEM SPECS */}
        <section id="specs" className="border-t border-zinc-900 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] tracking-widest text-orange-600">SYSTEM_CAPABILITIES</p>
                <h2 className="mt-2 font-mono text-3xl font-bold text-zinc-100 sm:text-4xl">CORE_MODULES</h2>
              </div>
              <p className="max-w-md font-mono text-xs leading-relaxed text-zinc-400">
                Each module is independently operational. Failure in one node does not cascade system-wide.
              </p>
            </div>

            <div className="grid gap-px border border-zinc-900 md:grid-cols-2 lg:grid-cols-3">
              {SYSTEM_SPECS.map((spec) => (
                <article key={spec.id} className="bg-zinc-950 p-5 transition hover:bg-zinc-900">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-widest text-orange-600">{spec.id}</span>
                    <span className="border border-green-900 bg-green-950/40 px-2 py-0.5 font-mono text-[9px] tracking-widest text-green-600">
                      {spec.status}
                    </span>
                  </div>
                  <p className="mt-3 font-mono text-xs leading-relaxed text-zinc-500">{spec.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* BOOT SEQUENCE */}
        <section className="border-t border-zinc-900 bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center font-mono text-3xl font-bold text-zinc-100 sm:text-4xl">BOOT_SEQUENCE</h2>
            <p className="mx-auto mt-2 max-w-lg text-center font-mono text-xs tracking-wider text-zinc-400">
              AMBITION_TO_EXECUTION IN 3 CYCLES
            </p>
            <div className="mt-10 grid gap-px border border-zinc-900 md:grid-cols-3">
              {BOOT_STEPS.map((s) => (
                <div key={s.step} className="bg-black p-6">
                  <p className="font-mono text-[10px] tracking-widest text-zinc-400">CYCLE_{s.step}</p>
                  <p className="mt-2 font-mono text-sm font-bold text-orange-500">{s.cmd}</p>
                  <p className="mt-3 font-mono text-xs leading-relaxed text-zinc-500">{s.desc}</p>
                </div>
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
              Start free. Upgrade when you&apos;re ready.
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
                      <li key={spec} className="flex items-center gap-2 font-mono text-sm text-zinc-400">
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
            <h2 className="font-mono text-3xl font-bold text-zinc-100 sm:text-4xl">What users say</h2>
            <p className="mt-1 font-mono text-sm text-zinc-400">
              Real results from real people
            </p>

            <div className="mt-8 border border-zinc-900">
              <div className="flex items-center justify-between border-b border-zinc-900 bg-black px-4 py-2">
                <span className="font-mono text-[9px] tracking-widest text-orange-600">
                  LOG_ENTRY_{activeLog + 1}_OF_{OPERATOR_LOGS.length}
                </span>
                <span className="font-mono text-[9px] tracking-widest text-zinc-400">FIELD_VERIFIED</span>
              </div>
              <div className="bg-zinc-950 p-6">
                <p className="font-mono text-sm leading-relaxed text-zinc-300">
                  &quot;{OPERATOR_LOGS[activeLog].log}&quot;
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs font-bold text-zinc-400">
                      {OPERATOR_LOGS[activeLog].operator}
                    </p>
                    <p className="font-mono text-[10px] tracking-widest text-zinc-400">
                      {OPERATOR_LOGS[activeLog].role}
                    </p>
                  </div>
                  <span className="border border-green-900 bg-green-950/40 px-3 py-1 font-mono text-[10px] tracking-widest text-green-500">
                    RESULT: {OPERATOR_LOGS[activeLog].outcome}
                  </span>
                </div>
              </div>
              <div className="flex gap-px border-t border-zinc-900">
                {OPERATOR_LOGS.map((_, idx) => (
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
            <h2 className="font-mono text-3xl font-bold text-zinc-100 sm:text-4xl">SYSTEM_FAQ</h2>
            <p className="mt-1 font-mono text-[10px] tracking-widest text-zinc-400">
              COMMON_QUERIES :: OPERATOR_SUPPORT
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
                LAUNCH-READY EXECUTION ENGINE
              </p>
              <h2 className="mt-3 font-mono text-3xl font-bold text-zinc-100 sm:text-4xl">
                READY TO RUN YOUR LIFE
                <br />
                WITH A TERMINAL?
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-mono text-xs leading-relaxed text-zinc-400">
                Start free in under two minutes. Keep your existing rhythm, gain execution structure, and track
                consistency with production-grade operational tooling.
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
                <span>&gt; SECURE_BILLING_INFRA</span>
                <span>&gt; ARCHIVE_SAFE_DOWNGRADE</span>
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
              VITALITY_TERMINAL :: BUILD_FOR_CONSISTENT_OPERATORS
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



