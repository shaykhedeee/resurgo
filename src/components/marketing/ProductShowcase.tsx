'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Product Screenshot Showcase
// Full-bleed triptych section: large centre screen flanked by angled side screens
// Tab-switchable: Dashboard · Focus Timer · AI Coaches
// Interactive thumbnail strip + feature callouts
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// ── Screenshot manifest ──────────────────────────────────────────────────────
// Mapped from /public/screenshots/ — adjust paths if you rename files.
// Sorted large first (highest resolution for the centre panel).
const SCREENS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    tag: 'COMMAND_CENTER',
    route: '/dashboard',
    img: '/screenshots/860_1x_shots_so.png',
    description: 'One unified workspace for everything you care about.',
    features: [
      { icon: '01', label: 'AI Morning Brief', desc: 'Personalised priorities delivered fresh every day.' },
      { icon: '02', label: 'Live Streak Panel',  desc: 'Habits, goals, and XP visible at a glance.' },
      { icon: '03', label: 'Inline Focus Timer', desc: 'Start a deep-work session without leaving the screen.' },
    ],
  },
  {
    id: 'focus',
    label: 'Focus Timer',
    tag: 'DEEP_WORK_ENGINE',
    route: '/focus-timer',
    img: '/screenshots/96_1x_shots_so.png',
    description: 'Distraction-free deep work with Pomodoro, Flowtime & more.',
    features: [
      { icon: '01', label: '5 Timer Modes',     desc: 'Pomodoro, Deep Work, Flowtime, Batch, and Custom.' },
      { icon: '02', label: 'Lifetime Log',       desc: 'Every session recorded — total minutes, streaks, scores.' },
      { icon: '03', label: 'Protocol Presets',  desc: 'Save your go-to session as a reusable protocol.' },
    ],
  },
  {
    id: 'coaches',
    label: 'AI Coaches',
    tag: 'AI_COACHING_ENGINE',
    route: '/coach',
    img: '/screenshots/924_1x_shots_so.png',
    description: '5 specialized AI coaches — one for every domain of life.',
    features: [
      { icon: '01', label: '5 Distinct Personas', desc: 'Marcus, Aurora, Titan, Phoenix, Nexus.' },
      { icon: '02', label: 'Domain Expertise',    desc: 'Strategy · Wellness · Performance · Resilience · Integration.' },
      { icon: '03', label: 'Free to Start',       desc: 'Marcus & Titan are free forever — upgrade for the rest.' },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProductShowcase() {
  const [active, setActive] = useState(0);

  const prev = (active + SCREENS.length - 1) % SCREENS.length;
  const next = (active + 1) % SCREENS.length;

  const toNext = useCallback(() => setActive(next), [next]);
  const toPrev = useCallback(() => setActive(prev), [prev]);

  const tab = SCREENS[active];

  return (
    <section
      id="preview"
      aria-labelledby="preview-heading"
      className="relative overflow-hidden bg-black px-4 py-20 sm:px-6 lg:px-8 lg:py-32"
    >
      {/* ── Ambient background ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Centre radial glow */}
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-orange-600/[0.06] blur-[150px]" />
        {/* Bottom-left counter-glow */}
        <div className="absolute -bottom-20 left-0 h-[350px] w-[500px] rounded-full bg-orange-800/[0.04] blur-[100px]" />
      </div>

      {/* ── Pixel grid texture ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,#ea580c 0,#ea580c 1px,transparent 1px,transparent 48px),' +
            'repeating-linear-gradient(90deg,#ea580c 0,#ea580c 1px,transparent 1px,transparent 48px)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">

        {/* ── Heading ── */}
        <div className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 border border-orange-900/50 bg-orange-950/20 px-3 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse bg-orange-500" />
            <span className="font-pixel text-[0.55rem] tracking-widest text-orange-500">
              SYSTEM_PREVIEW :: LIVE_INTERFACE
            </span>
          </div>
          <h2
            id="preview-heading"
            className="font-pixel text-2xl leading-snug text-zinc-100 sm:text-3xl lg:text-4xl"
          >
            Every tool you need.
            <br />
            <span className="text-orange-500">Zero app-switching.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-terminal text-lg leading-relaxed text-zinc-300">
            Resurgo replaces five separate apps with one command center that understands your goals,
            tracks your habits, and adapts your plan in real time.
          </p>
        </div>

        {/* ── Tab strip ── */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex divide-x-2 divide-zinc-800 border-2 border-zinc-800">
            {SCREENS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                className={cn(
                  'px-5 py-2.5 font-pixel text-[0.45rem] tracking-widest transition-all duration-200',
                  active === i
                    ? 'bg-orange-600 text-black'
                    : 'bg-zinc-950 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200',
                )}
                aria-pressed={active === i}
              >
                {`// ${s.label.toUpperCase()}`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Triptych panels ── */}
        <div className="flex items-stretch justify-center gap-3 [perspective:1400px]">

          {/* Left panel — previous screen, tilted away */}
          <div
            className="hidden w-[220px] shrink-0 cursor-pointer select-none overflow-hidden border border-zinc-800 bg-zinc-950 opacity-55 transition-all duration-500 hover:opacity-80 lg:block"
            style={{ transform: 'rotateY(16deg) translateX(24px) scale(0.87)', transformOrigin: 'right center' }}
            onClick={toPrev}
            aria-label="Previous screen"
          >
            {/* Mini chrome */}
            <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5">
              <div className="flex gap-1">
                {['bg-red-500/40', 'bg-yellow-500/40', 'bg-green-500/40'].map((c) => (
                  <div key={c} className={cn('h-2 w-2 rounded-full', c)} />
                ))}
              </div>
              <span className="flex-1 truncate rounded bg-zinc-800/60 px-1.5 py-0.5 font-terminal text-[0.5rem] text-zinc-600">
                resurgo.life{SCREENS[prev].route}
              </span>
            </div>
            <div className="relative aspect-[16/10]">
              <Image
                src={SCREENS[prev].img}
                alt=""
                fill
                className="object-cover object-top"
                sizes="220px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/40" />
            </div>
            {/* Click hint */}
            <div className="flex items-center justify-center gap-1 bg-zinc-950 py-1.5">
              <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-600">← {SCREENS[prev].label.toUpperCase()}</span>
            </div>
          </div>

          {/* ── Centre panel — MAIN ── */}
          <div className="z-10 flex-1 overflow-hidden border-2 border-zinc-700 bg-zinc-950 shadow-[0_0_60px_rgba(234,88,12,0.18),0_0_140px_rgba(234,88,12,0.07)] transition-shadow duration-500 lg:max-w-[860px]">

            {/* Browser chrome */}
            <div className="flex items-center gap-3 border-b-2 border-zinc-700 bg-zinc-900 px-4 py-2.5">
              <div className="flex gap-2">
                {['bg-red-500/70', 'bg-yellow-500/70', 'bg-green-500/70'].map((c) => (
                  <div key={c} className={cn('h-3 w-3 rounded-full', c)} />
                ))}
              </div>

              {/* URL bar */}
              <div className="flex flex-1 items-center gap-2 rounded border border-zinc-700 bg-zinc-800/60 px-3 py-1">
                <svg
                  width="10" height="10" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  className="shrink-0 text-green-500"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="font-terminal text-xs text-zinc-400">resurgo.life{tab.route}</span>
                <span className="ml-auto font-pixel text-[0.35rem] tracking-widest text-zinc-600">SECURE</span>
              </div>

              {/* Active tag */}
              <div className="hidden items-center gap-1.5 border border-orange-900/50 bg-orange-950/20 px-2 py-1 sm:flex">
                <span className="h-1 w-1 animate-pulse rounded-full bg-orange-500" />
                <span className="font-pixel text-[0.35rem] tracking-widest text-orange-400">{tab.tag}</span>
              </div>
            </div>

            {/* Screenshot */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                key={tab.id}
                src={tab.img}
                alt={`Resurgo ${tab.label} — ${tab.description}`}
                fill
                className="object-cover object-top transition-opacity duration-400"
                sizes="(max-width: 1280px) 100vw, 860px"
                priority
              />
              {/* Bottom gradient blend into card below */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent" />

              {/* Top-left tag badge over image */}
              <div className="absolute left-3 top-3 flex items-center gap-2 border border-orange-900/60 bg-black/70 px-3 py-1.5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse bg-orange-500" />
                <span className="font-pixel text-[0.4rem] tracking-widest text-orange-400">{tab.tag}</span>
              </div>
            </div>

            {/* Description bar */}
            <div className="border-t-2 border-zinc-800 bg-zinc-950 px-5 py-3">
              <p className="font-terminal text-sm text-zinc-400">
                <span className="text-orange-500">{'> '}</span>
                {tab.description}
              </p>
            </div>
          </div>

          {/* Right panel — next screen, tilted away */}
          <div
            className="hidden w-[220px] shrink-0 cursor-pointer select-none overflow-hidden border border-zinc-800 bg-zinc-950 opacity-55 transition-all duration-500 hover:opacity-80 lg:block"
            style={{ transform: 'rotateY(-16deg) translateX(-24px) scale(0.87)', transformOrigin: 'left center' }}
            onClick={toNext}
            aria-label="Next screen"
          >
            <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5">
              <div className="flex gap-1">
                {['bg-red-500/40', 'bg-yellow-500/40', 'bg-green-500/40'].map((c) => (
                  <div key={c} className={cn('h-2 w-2 rounded-full', c)} />
                ))}
              </div>
              <span className="flex-1 truncate rounded bg-zinc-800/60 px-1.5 py-0.5 font-terminal text-[0.5rem] text-zinc-600">
                resurgo.life{SCREENS[next].route}
              </span>
            </div>
            <div className="relative aspect-[16/10]">
              <Image
                src={SCREENS[next].img}
                alt=""
                fill
                className="object-cover object-top"
                sizes="220px"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/10 to-black/40" />
            </div>
            <div className="flex items-center justify-center gap-1 bg-zinc-950 py-1.5">
              <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-600">{SCREENS[next].label.toUpperCase()} →</span>
            </div>
          </div>

        </div>

        {/* ── Feature callouts below centre ── */}
        <div className="mx-auto mt-5 grid max-w-[860px] grid-cols-1 gap-3 sm:grid-cols-3">
          {tab.features.map((f) => (
            <div
              key={f.label}
              className="group border border-zinc-800 bg-zinc-950/80 px-4 py-4 transition-all duration-200 hover:border-orange-900/60 hover:bg-zinc-900/60"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-5 w-5 items-center justify-center border border-orange-900/60 bg-orange-950/30 font-pixel text-[0.35rem] text-orange-500">
                  {f.icon}
                </span>
                <p className="font-pixel text-[0.45rem] tracking-widest text-orange-400">
                  {f.label.toUpperCase()}
                </p>
              </div>
              <p className="font-terminal text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── Thumbnail strip ── */}
        <div className="mx-auto mt-8 max-w-[860px]">
          <div className="flex items-center justify-center gap-3">
            {SCREENS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                className={cn(
                  'group relative h-14 w-24 overflow-hidden border-2 transition-all duration-200',
                  active === i
                    ? 'border-orange-600 shadow-[0_0_18px_rgba(234,88,12,0.45)]'
                    : 'border-zinc-800 opacity-45 hover:border-zinc-600 hover:opacity-70',
                )}
                aria-label={`Switch to ${s.label}`}
              >
                <Image
                  src={s.img}
                  alt={s.label}
                  fill
                  className="object-cover object-top"
                  sizes="96px"
                />
                {/* Label on active/hover */}
                <div
                  className={cn(
                    'absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/90 to-transparent pb-0.5 pt-3 transition-opacity',
                    active === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                  )}
                >
                  <span className="w-full text-center font-pixel text-[0.45rem] tracking-widest text-orange-400">
                    {s.tag}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Progress dots */}
          <div className="mt-3 flex justify-center gap-2">
            {SCREENS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to screen ${i + 1}`}
                className={cn(
                  'h-1 rounded-full transition-all duration-300',
                  active === i ? 'w-8 bg-orange-600' : 'w-2 bg-zinc-700 hover:bg-zinc-500',
                )}
              />
            ))}
          </div>
        </div>

        {/* ── Social proof strip ── */}
        <div className="mx-auto mt-12 max-w-[860px] grid grid-cols-2 gap-px border border-zinc-800 bg-zinc-800 sm:grid-cols-4">
          {[
            { value: '5+', label: 'Apps replaced' },
            { value: '5',  label: 'AI coaches' },
            { value: '0',  label: 'Setup friction' },
            { value: '<2m', label: 'To first plan' },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-950 px-4 py-4 text-center">
              <p className="font-pixel text-sm text-orange-400">{stat.value}</p>
              <p className="mt-1 font-terminal text-xs text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mx-auto mt-12 max-w-lg border-2 border-orange-900/40 bg-orange-950/10 p-8 text-center">
          <p className="mb-2 font-pixel text-[0.6rem] tracking-widest text-orange-500">
            █ READY_TO_EXECUTE
          </p>
          <p className="font-terminal text-xl text-zinc-200 leading-snug">
            Start free. No credit card.
            <br />
            Setup in under 2 minutes.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-orange-600 px-7 py-3 font-pixel text-[0.5rem] tracking-widest text-black shadow-[3px_3px_0px_rgba(0,0,0,0.5)] transition hover:bg-orange-500 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              START FREE →
            </a>
            <a
              href="#features"
              className="font-terminal text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              See all features ↓
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
