'use client';

// ═══════════════════════════════════════════════════════════════════════════
// RESURGO — Product Hunt Interactive Demo
// A fully self-contained click-through product tour.
// Route: /demo  →  resurgo.life/demo
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────
type StepId =
  | 'welcome'
  | 'dashboard'
  | 'goal_engine'
  | 'habits'
  | 'focus'
  | 'ai_coaches'
  | 'weekly_review'
  | 'gamification'
  | 'pricing';

interface DemoStep {
  id: StepId;
  label: string;
  title: string;
  tagline: string;
  accent: string;
  bg: string;
  render: (tick: number) => React.ReactNode;
}

// ─── Shared terminal line renderer ───────────────────────────────────────
function TermLine({
  type,
  text,
  visible = true,
}: {
  type: 'cmd' | 'out' | 'ok' | 'warn' | 'dim' | 'divider' | 'label';
  text: string;
  visible?: boolean;
}) {
  if (!visible) return null;
  const styles: Record<string, string> = {
    cmd: 'text-orange-400 font-bold',
    out: 'text-zinc-200',
    ok: 'text-green-400 font-semibold',
    warn: 'text-yellow-400',
    dim: 'text-zinc-500 italic',
    divider: 'border-t border-zinc-800 my-1',
    label: 'text-cyan-400 font-mono font-bold tracking-widest uppercase text-xs',
  };
  if (type === 'divider') return <div className={styles.divider} />;
  return (
    <div className={`font-mono text-sm leading-relaxed ${styles[type]} transition-all duration-300`}>
      {text}
    </div>
  );
}

// ─── Habit row component ─────────────────────────────────────────────────
function HabitRow({
  emoji,
  name,
  streak,
  done,
  color,
}: {
  emoji: string;
  name: string;
  streak: number;
  done: boolean;
  color: string;
}) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded border transition-all duration-500 ${
        done
          ? `border-${color}-500/40 bg-${color}-500/10`
          : 'border-zinc-800 bg-zinc-900/50'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <span className={`font-mono text-sm ${done ? `text-${color}-300` : 'text-zinc-400'}`}>
          {name}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-yellow-400 font-mono text-xs">🔥 {streak}d</span>
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
            done ? `border-${color}-500 bg-${color}-500` : 'border-zinc-600'
          }`}
        >
          {done && <span className="text-black text-xs font-bold">✓</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Metric card ─────────────────────────────────────────────────────────
function MetricCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <div className={`rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 hover:border-${accent}-500/40 transition-colors duration-300`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{icon}</span>
        <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">{label}</span>
      </div>
      <div className={`text-${accent}-400 font-mono font-bold text-xl`}>{value}</div>
      <div className="text-zinc-600 font-mono text-xs mt-0.5">{sub}</div>
    </div>
  );
}

// ─── Coach card ──────────────────────────────────────────────────────────
function CoachCard({
  name,
  style,
  desc,
  color,
  active,
  free,
}: {
  name: string;
  style: string;
  desc: string;
  color: string;
  active: boolean;
  free: boolean;
}) {
  return (
    <div
      className={`relative rounded-lg border p-3 transition-all duration-300 cursor-pointer ${
        active
          ? `border-${color}-500 bg-${color}-500/10 shadow-lg shadow-${color}-500/20`
          : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
      }`}
    >
      {free && (
        <span className="absolute top-2 right-2 text-xs font-mono bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/30">
          FREE
        </span>
      )}
      <div className={`font-mono font-bold text-sm text-${color}-400 mb-0.5`}>{name}</div>
      <div className="text-zinc-400 text-xs font-semibold mb-1">{style}</div>
      <div className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{desc}</div>
    </div>
  );
}

// ─── Focus timer component ────────────────────────────────────────────────
function FocusTimer({ tick }: { tick: number }) {
  const totalSeconds = 25 * 60;
  const elapsed = Math.min(tick * 3, totalSeconds);
  const remaining = totalSeconds - elapsed;
  const mins = Math.floor(remaining / 60)
    .toString()
    .padStart(2, '0');
  const secs = (remaining % 60).toString().padStart(2, '0');
  const pct = (elapsed / totalSeconds) * 100;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SVG ring */}
      <div className="relative">
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r={r} fill="none" stroke="#18181b" strokeWidth="8" />
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke="#f97316"
            strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-orange-400 font-mono font-bold text-3xl">{mins}:{secs}</div>
          <div className="text-zinc-500 font-mono text-xs">DEEP WORK</div>
        </div>
      </div>
      {/* Ambient sounds */}
      <div className="flex gap-2">
        {['🌊 Ocean', '🌧 Rain', '🔥 Fire', '☕ Café'].map((s) => (
          <button
            key={s}
            className="font-mono text-xs px-2 py-1 rounded border border-zinc-700 text-zinc-400 hover:border-orange-500/50 hover:text-orange-400 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
      {/* Session stats */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <div className="text-center">
          <div className="text-green-400 font-mono text-lg font-bold">{Math.floor(elapsed / 60)}m</div>
          <div className="text-zinc-600 text-xs font-mono">ELAPSED</div>
        </div>
        <div className="text-center">
          <div className="text-yellow-400 font-mono text-lg font-bold">{tick > 5 ? '1' : '0'}</div>
          <div className="text-zinc-600 text-xs font-mono">DISTRACTIONS</div>
        </div>
        <div className="text-center">
          <div className="text-cyan-400 font-mono text-lg font-bold">{tick > 8 ? '87%' : '—'}</div>
          <div className="text-zinc-600 text-xs font-mono">FLOW SCORE</div>
        </div>
      </div>
    </div>
  );
}

// ─── XP / Gamification panel ──────────────────────────────────────────────
function GamificationPanel({ tick }: { tick: number }) {
  const xp = Math.min(tick * 47, 2400);
  const level = Math.floor(xp / 400) + 1;
  const xpInLevel = xp % 400;
  const pct = (xpInLevel / 400) * 100;

  const badges = [
    { icon: '🔥', name: 'Streak Master', desc: '30-day streak', unlocked: tick > 2 },
    { icon: '⚡', name: 'Flow State', desc: '5 deep work sessions', unlocked: tick > 3 },
    { icon: '🎯', name: 'Goal Crusher', desc: 'Complete 3 goals', unlocked: tick > 4 },
    { icon: '🧠', name: 'AI User', desc: 'Chat with 3 coaches', unlocked: tick > 5 },
    { icon: '💎', name: 'Founding Member', desc: 'Early adopter', unlocked: tick > 6 },
    { icon: '🚀', name: 'Launcher', desc: 'Built first plan', unlocked: tick > 1 },
  ];

  return (
    <div className="space-y-4">
      {/* Level + XP bar */}
      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <div>
              <div className="text-yellow-400 font-mono font-bold text-lg">Level {level}</div>
              <div className="text-zinc-500 font-mono text-xs">Growth Architect</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-mono font-bold">{xp.toLocaleString()} XP</div>
            <div className="text-zinc-600 font-mono text-xs">{400 - xpInLevel} to next level</div>
          </div>
        </div>
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {/* Badges */}
      <div>
        <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-2">
          Badges Earned
        </div>
        <div className="grid grid-cols-3 gap-2">
          {badges.map((b) => (
            <div
              key={b.name}
              className={`rounded border p-2 text-center transition-all duration-500 ${
                b.unlocked
                  ? 'border-yellow-500/40 bg-yellow-500/10'
                  : 'border-zinc-800 bg-zinc-900/30 opacity-40 grayscale'
              }`}
            >
              <div className="text-xl">{b.icon}</div>
              <div className="text-zinc-300 font-mono text-xs font-semibold mt-0.5">{b.name}</div>
              <div className="text-zinc-600 text-xs">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Weekly review component ──────────────────────────────────────────────
function WeeklyReviewPanel({ tick }: { tick: number }) {
  const show = (n: number) => tick >= n;
  return (
    <div className="space-y-3">
      <TermLine type="dim" text="# AI generating weekly summary..." visible={show(0)} />
      <TermLine type="cmd" text="> resurgo review --week 11 --ai-summary" visible={show(1)} />
      <TermLine type="divider" text="" visible={show(1)} />
      <TermLine type="label" text="HABIT PERFORMANCE" visible={show(2)} />
      <TermLine type="ok" text="✓ Morning workout    7/7 days  ████████ 100%" visible={show(2)} />
      <TermLine type="ok" text="✓ Deep work          6/7 days  ███████░ 85%" visible={show(2)} />
      <TermLine type="warn" text="△ Evening journal   4/7 days  █████░░░ 57%" visible={show(2)} />
      <TermLine type="divider" text="" visible={show(3)} />
      <TermLine type="label" text="AI INSIGHTS" visible={show(3)} />
      <TermLine
        type="out"
        text="Your focus output peaked Tuesday–Thursday. Consider"
        visible={show(3)}
      />
      <TermLine
        type="out"
        text="shifting your hardest work to early week mornings."
        visible={show(3)}
      />
      <TermLine type="divider" text="" visible={show(4)} />
      <TermLine type="label" text="NEXT WEEK PRIORITY" visible={show(4)} />
      <TermLine type="ok" text="✓ Milestone: Ship beta feature by Friday" visible={show(4)} />
      <TermLine type="ok" text="✓ Habit: Rebuild evening journal → 7/7 goal" visible={show(4)} />
      <TermLine type="ok" text="✓ Focus: 4 deep work blocks of 90 min each" visible={show(4)} />
      <TermLine type="divider" text="" visible={show(5)} />
      <TermLine type="dim" text="# Review saved · Plan updated · Coach notified_" visible={show(5)} />
    </div>
  );
}

// ─── Dashboard panel ──────────────────────────────────────────────────────
function DashboardPanel({ tick }: { tick: number }) {
  return (
    <div className="space-y-3">
      {/* Top metrics */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard icon="🔥" label="Streak" value="43d" sub="+3 this week" accent="orange" />
        <MetricCard icon="⚡" label="Focus Hrs" value="18.5h" sub="this week" accent="yellow" />
        <MetricCard icon="✅" label="Habits" value="91%" sub="completion rate" accent="green" />
        <MetricCard icon="⭐" label="XP Today" value="+240" sub="2,840 total" accent="cyan" />
      </div>
      {/* Today's snapshot */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
        <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-2">
          Today&apos;s Plan
        </div>
        {[
          { time: '08:00', task: 'Morning workout', done: true, color: 'green' },
          { time: '09:30', task: 'Deep work block (90 min)', done: tick > 2, color: 'orange' },
          { time: '11:30', task: 'Review PRs + code review', done: false, color: 'blue' },
          { time: '14:00', task: 'Focus session: side project', done: false, color: 'purple' },
        ].map((item) => (
          <div key={item.time} className="flex items-center gap-3 py-1.5 border-b border-zinc-800/50 last:border-0">
            <span className="text-zinc-600 font-mono text-xs w-10">{item.time}</span>
            <div
              className={`w-1.5 h-1.5 rounded-full ${item.done ? `bg-${item.color}-400` : 'bg-zinc-700'}`}
            />
            <span
              className={`font-mono text-xs flex-1 ${
                item.done ? `text-${item.color}-400 line-through opacity-60` : 'text-zinc-300'
              }`}
            >
              {item.task}
            </span>
            {item.done && (
              <span className="text-green-500 text-xs">✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Goal engine panel ────────────────────────────────────────────────────
function GoalEnginePanel({ tick }: { tick: number }) {
  const show = (n: number) => tick >= n;
  return (
    <div className="space-y-2">
      <TermLine type="cmd" text='> plan-builder --goal "Launch my SaaS to $1K MRR"' visible={show(0)} />
      <TermLine type="dim" text="# AI Orchestrator activating 4 models..." visible={show(1)} />
      <TermLine type="dim" text="# Decomposing goal into 4-level hierarchy..." visible={show(1)} />
      <TermLine type="divider" text="" visible={show(2)} />
      <TermLine type="label" text="MILESTONES GENERATED" visible={show(2)} />
      <TermLine type="ok" text="[M1] Week 1–2  → Validate idea. 20 user interviews." visible={show(2)} />
      <TermLine type="ok" text="[M2] Week 3–6  → Build MVP. Core loop working." visible={show(3)} />
      <TermLine type="ok" text="[M3] Week 7–10 → Beta launch. 50 active users." visible={show(3)} />
      <TermLine type="ok" text="[M4] Week 11–12→ Monetize. 10 paid conversions." visible={show(4)} />
      <TermLine type="divider" text="" visible={show(4)} />
      <TermLine type="label" text="AUTO-CREATED" visible={show(4)} />
      <TermLine type="out" text="✓ 16 milestone tasks   → added to Task Board" visible={show(4)} />
      <TermLine type="out" text="✓ 4 daily habits       → added to Habit Tracker" visible={show(5)} />
      <TermLine type="out" text="✓ Weekly review loop   → scheduled Sundays" visible={show(5)} />
      <TermLine type="divider" text="" visible={show(5)} />
      <TermLine type="ok" text="✓ 90-day plan ready. Your first task starts today_" visible={show(6)} />
    </div>
  );
}

// ─── Habits panel ─────────────────────────────────────────────────────────
function HabitsPanel({ tick }: { tick: number }) {
  const habits = [
    { emoji: '🏋️', name: 'Morning workout', streak: 43, done: true, color: 'green' },
    { emoji: '📖', name: 'Read 20 pages', streak: 21, done: tick > 1, color: 'cyan' },
    { emoji: '💧', name: 'Drink 2L water', streak: 67, done: tick > 2, color: 'blue' },
    { emoji: '🧘', name: 'Meditate 10 min', streak: 12, done: tick > 3, color: 'purple' },
    { emoji: '📝', name: 'Evening journal', streak: 8, done: false, color: 'yellow' },
  ];

  // Heatmap row
  const heatRow = Array.from({ length: 28 }, () => {
    const r = Math.random();
    if (r > 0.85) return 'bg-green-500';
    if (r > 0.6) return 'bg-green-400/70';
    if (r > 0.35) return 'bg-green-400/30';
    return 'bg-zinc-800';
  });

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {habits.map((h) => (
          <HabitRow key={h.name} {...h} />
        ))}
      </div>
      {/* Mini heatmap */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
        <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-2">
          28-Day Activity
        </div>
        <div className="flex gap-1 flex-wrap">
          {heatRow.map((cls, i) => (
            <div key={i} className={`w-4 h-4 rounded-sm ${cls} transition-all duration-500`} />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-zinc-600 font-mono text-xs">4 weeks ago</span>
          <span className="text-green-400 font-mono text-xs">today</span>
        </div>
      </div>
      {/* Streak freeze */}
      <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-2 flex items-center gap-2">
        <span className="text-lg">🛡️</span>
        <div>
          <div className="text-cyan-400 font-mono text-xs font-bold">Streak Freeze available</div>
          <div className="text-zinc-500 text-xs">Protects your streak if you miss a day</div>
        </div>
      </div>
    </div>
  );
}

// ─── AI Coaches panel ─────────────────────────────────────────────────────
function AICoachesPanel({ tick }: { tick: number }) {
  const coaches = [
    {
      name: 'MARCUS',
      style: 'Stoic Strategist',
      desc: 'Discipline, goals, and long-term frameworks.',
      color: 'yellow',
      free: true,
    },
    {
      name: 'AURORA',
      style: 'Mindful Catalyst',
      desc: 'Wellness, mindfulness, emotional intelligence.',
      color: 'purple',
      free: true,
    },
    {
      name: 'TITAN',
      style: 'Physical Performance',
      desc: 'Fitness, nutrition, energy optimization.',
      color: 'red',
      free: false,
    },
    {
      name: 'SAGE',
      style: 'Wealth Advisor',
      desc: 'Financial goals, budgeting, money mindset.',
      color: 'green',
      free: false,
    },
    {
      name: 'PHOENIX',
      style: 'Resilience Coach',
      desc: 'Bounce back stronger from setbacks.',
      color: 'orange',
      free: false,
    },
    {
      name: 'NOVA',
      style: 'Systems Architect',
      desc: 'Build automated, scalable personal systems.',
      color: 'cyan',
      free: false,
    },
  ];

  const activeCoach = coaches[Math.floor(tick / 2) % coaches.length];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {coaches.map((c) => (
          <CoachCard key={c.name} {...c} active={c.name === activeCoach.name} />
        ))}
      </div>
      {/* Simulated chat */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 space-y-2">
        <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
          Live Chat — {activeCoach.name}
        </div>
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded bg-zinc-700 flex items-center justify-center text-xs shrink-0">
            You
          </div>
          <div className="bg-zinc-800 rounded px-2 py-1.5 text-zinc-300 text-xs font-mono">
            How do I stay consistent when motivation disappears?
          </div>
        </div>
        {tick > 1 && (
          <div className="flex gap-2">
            <div
              className={`w-6 h-6 rounded bg-${activeCoach.color}-500/20 border border-${activeCoach.color}-500/40 flex items-center justify-center text-xs shrink-0 text-${activeCoach.color}-400 font-bold`}
            >
              AI
            </div>
            <div
              className={`bg-${activeCoach.color}-500/10 border border-${activeCoach.color}-500/20 rounded px-2 py-1.5 text-${activeCoach.color}-200 text-xs font-mono`}
            >
              Motivation is a resource, not a habit. Build systems that run on discipline. Your
              morning ritual is your anchor — protect it at all costs.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pricing panel ────────────────────────────────────────────────────────
function PricingPanel() {
  return (
    <div className="space-y-3">
      {[
        {
          tier: 'FREE',
          price: '$0',
          period: '/forever',
          color: 'zinc',
          highlight: false,
          features: [
            'Unlimited habits & goals',
            'Focus timer (all modes)',
            '2 AI coaches (Marcus & Aurora)',
            'Daily planning',
            'Basic analytics',
            'Mobile PWA',
          ],
          cta: 'Start Free',
          href: 'https://resurgo.life/sign-up',
        },
        {
          tier: 'PRO',
          price: '$4.99',
          period: '/month',
          color: 'orange',
          highlight: true,
          features: [
            'Everything in Free',
            'All 8 AI coaches',
            'Advanced analytics',
            'Weekly AI reviews',
            'Telegram bot access',
            'Priority support',
          ],
          cta: 'Upgrade to Pro',
          href: 'https://resurgo.life/billing',
        },
        {
          tier: 'LIFETIME',
          price: '$49.99',
          period: 'one-time',
          color: 'yellow',
          highlight: false,
          badge: '⚡ Founding Price',
          features: [
            'Everything in Pro',
            'Pay once, use forever',
            'All future updates',
            'Founding member badge',
          ],
          cta: 'Claim Founding Price',
          href: 'https://resurgo.life/billing',
        },
      ].map((plan) => (
        <div
          key={plan.tier}
          className={`rounded-lg border p-3 transition-all duration-300 ${
            plan.highlight
              ? 'border-orange-500/60 bg-orange-500/5 shadow-lg shadow-orange-500/10'
              : 'border-zinc-800 bg-zinc-900/50'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              {plan.badge && (
                <span className={`text-xs font-mono bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-500/30 mb-1 inline-block`}>
                  {plan.badge}
                </span>
              )}
              {plan.highlight && (
                <span className="text-xs font-mono bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/30 mb-1 inline-block">
                  MOST POPULAR
                </span>
              )}
              <div className={`font-mono font-bold text-sm text-${plan.color}-400`}>{plan.tier}</div>
            </div>
            <div className="text-right">
              <div className={`font-mono font-bold text-xl text-${plan.color}-400`}>{plan.price}</div>
              <div className="text-zinc-600 font-mono text-xs">{plan.period}</div>
            </div>
          </div>
          <div className="space-y-0.5 mb-3">
            {plan.features.map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono">
                <span className={`text-${plan.color}-500 text-xs`}>✓</span>
                {f}
              </div>
            ))}
          </div>
          <a
            href={plan.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full text-center font-mono font-bold text-xs py-2 rounded border transition-all duration-200 ${
              plan.highlight
                ? 'bg-orange-500 border-orange-500 text-black hover:bg-orange-400'
                : `border-${plan.color}-500/50 text-${plan.color}-400 hover:bg-${plan.color}-500/10`
            }`}
          >
            {plan.cta} →
          </a>
        </div>
      ))}
    </div>
  );
}

// ─── Welcome screen ───────────────────────────────────────────────────────
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const [typed, setTyped] = useState(0);
  const lines = [
    '> RESURGO :: Life Command Center',
    '> version 2.1.0 // March 2026',
    '> All systems operational.',
    '',
    '> Loading interactive demo...',
  ];
  const fullText = lines.join('\n');

  useEffect(() => {
    const id = setInterval(() => {
      setTyped((t) => (t < fullText.length ? t + 2 : t));
    }, 30);
    return () => clearInterval(id);
  }, [fullText.length]);

  const display = fullText.slice(0, typed);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
      {/* Scan lines overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }}
      />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
              <span className="text-orange-400 font-mono font-bold text-lg">R</span>
            </div>
            <span className="text-white font-mono font-bold text-2xl tracking-tight">RESURGO</span>
          </div>
          <div className="text-zinc-500 font-mono text-sm">AI Productivity Assistant · Life Command Center</div>
        </div>

        {/* Terminal boot */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl shadow-black mb-8">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-zinc-600 font-mono text-xs ml-3">resurgo.life — demo@terminal</span>
          </div>
          <div className="p-6 font-mono text-sm text-green-400 min-h-[160px] whitespace-pre-line leading-relaxed">
            {display}
            <span className="animate-pulse text-orange-400">█</span>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {[
            '🎯 AI Goal Engine',
            '🔥 Habit Tracker',
            '⚡ Focus Timer',
            '🤖 8 AI Coaches',
            '📊 Weekly Reviews',
            '🎮 XP & Levels',
          ].map((f) => (
            <span
              key={f}
              className="font-mono text-xs px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-400 bg-zinc-900/60"
            >
              {f}
            </span>
          ))}
        </div>

        <div className="text-center space-y-3">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black font-mono font-bold text-sm px-8 py-3.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30"
          >
            START INTERACTIVE DEMO
            <span className="text-lg">→</span>
          </button>
          <div className="text-zinc-600 font-mono text-xs">
            No login required · 8 feature demos · 2 min tour
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main demo steps data ──────────────────────────────────────────────────
const STEPS: DemoStep[] = [
  {
    id: 'dashboard',
    label: '01 Dashboard',
    title: 'Your Life Command Center',
    tagline: 'Every metric. Every goal. One view.',
    accent: 'border-orange-500/40',
    bg: 'from-orange-500/10',
    render: (tick) => <DashboardPanel tick={tick} />,
  },
  {
    id: 'goal_engine',
    label: '02 AI Goal Engine',
    title: 'Idea → 90-Day Plan in 2 Minutes',
    tagline: 'Tell AI your goal. Get milestones, tasks, and habits instantly.',
    accent: 'border-green-500/40',
    bg: 'from-green-500/10',
    render: (tick) => <GoalEnginePanel tick={tick} />,
  },
  {
    id: 'habits',
    label: '03 Habit Tracker',
    title: 'Never Miss Twice',
    tagline: 'Build streaks, stack habits, and see consistency compound.',
    accent: 'border-cyan-500/40',
    bg: 'from-cyan-500/10',
    render: (tick) => <HabitsPanel tick={tick} />,
  },
  {
    id: 'focus',
    label: '04 Focus Sessions',
    title: 'Deep Work, On Demand',
    tagline: 'Pomodoro · Deep Work · Flowtime — with ambient sounds & distraction tracking.',
    accent: 'border-yellow-500/40',
    bg: 'from-yellow-500/10',
    render: (tick) => (
      <div className="flex flex-col items-center justify-center py-4">
        <FocusTimer tick={tick} />
      </div>
    ),
  },
  {
    id: 'ai_coaches',
    label: '05 AI Coaches',
    title: '8 Expert Coaches, Always Available',
    tagline: 'Strategy · Wellness · Fitness · Finance · Resilience — pick your coach.',
    accent: 'border-purple-500/40',
    bg: 'from-purple-500/10',
    render: (tick) => <AICoachesPanel tick={tick} />,
  },
  {
    id: 'weekly_review',
    label: '06 Weekly Review',
    title: 'AI Reflects So You Can Improve',
    tagline: 'Every Sunday: automated performance summary + next-week priorities.',
    accent: 'border-blue-500/40',
    bg: 'from-blue-500/10',
    render: (tick) => <WeeklyReviewPanel tick={tick} />,
  },
  {
    id: 'gamification',
    label: '07 XP & Levels',
    title: 'Your Progress is a Game',
    tagline: 'Earn XP, level up, unlock badges — motivation that never burns out.',
    accent: 'border-yellow-500/40',
    bg: 'from-yellow-500/10',
    render: (tick) => <GamificationPanel tick={tick} />,
  },
  {
    id: 'pricing',
    label: '08 Pricing',
    title: 'Free to Start. Pro to Scale.',
    tagline: 'No credit card required. Upgrade only when you need more.',
    accent: 'border-orange-500/40',
    bg: 'from-orange-500/10',
    render: (_tick) => <PricingPanel />,
  },
];

// ─── Main exported component ──────────────────────────────────────────────
export default function ProductHuntDemo() {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = STEPS[stepIndex];

  // Tick animation per step
  useEffect(() => {
    if (!started) return;
    setTick(0);
    tickRef.current = setInterval(() => {
      setTick((t) => t + 1);
    }, 800);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [started, stepIndex]);

  const goTo = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= STEPS.length) return;
      setStepIndex(idx);
    },
    []
  );

  const next = () => goTo(stepIndex + 1);
  const prev = () => goTo(stepIndex - 1);

  if (!started) {
    return <WelcomeScreen onStart={() => setStarted(true)} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
              <span className="text-orange-400 font-mono font-bold text-sm">R</span>
            </div>
            <span className="text-white font-mono font-bold tracking-tight">RESURGO</span>
            <span className="text-zinc-600 font-mono text-xs">demo</span>
          </div>
          <a
            href="https://resurgo.life/sign-up"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs px-3 py-1.5 bg-orange-500 text-black font-bold rounded hover:bg-orange-400 transition-colors"
          >
            TRY FREE →
          </a>
        </div>

        {/* Step nav pills */}
        <div className="flex gap-1.5 flex-wrap mb-6">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={`font-mono text-xs px-2.5 py-1.5 rounded border transition-all duration-200 ${
                i === stepIndex
                  ? 'border-orange-500/60 bg-orange-500/15 text-orange-400'
                  : i < stepIndex
                  ? 'border-green-500/40 bg-green-500/5 text-green-500'
                  : 'border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'
              }`}
            >
              {i < stepIndex ? '✓ ' : ''}{s.label}
            </button>
          ))}
        </div>

        {/* Active step card */}
        <div className={`rounded-xl border ${step.accent} bg-gradient-to-br ${step.bg} to-zinc-950 overflow-hidden shadow-2xl shadow-black/80 mb-6`}>
          {/* Window chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800/80">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-zinc-600 font-mono text-xs ml-3">resurgo.life — {step.id}</span>
            <div className="ml-auto flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-500 font-mono text-xs">LIVE</span>
            </div>
          </div>

          {/* Title bar */}
          <div className="px-5 pt-5 pb-3 border-b border-zinc-800/50">
            <h2 className="font-mono font-bold text-lg text-white mb-0.5">{step.title}</h2>
            <p className="text-zinc-400 text-sm font-mono">{step.tagline}</p>
          </div>

          {/* Content */}
          <div className="p-5 max-h-[480px] overflow-y-auto custom-scrollbar">
            {step.render(tick)}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prev}
            disabled={stepIndex === 0}
            className="font-mono text-sm px-4 py-2 border border-zinc-700 text-zinc-400 rounded hover:border-zinc-600 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← PREV
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === stepIndex
                    ? 'w-6 h-2.5 bg-orange-500'
                    : i < stepIndex
                    ? 'w-2.5 h-2.5 bg-green-500'
                    : 'w-2.5 h-2.5 bg-zinc-700 hover:bg-zinc-600'
                }`}
              />
            ))}
          </div>

          {stepIndex < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="font-mono text-sm px-4 py-2 bg-orange-500 text-black font-bold rounded hover:bg-orange-400 transition-all"
            >
              NEXT →
            </button>
          ) : (
            <a
              href="https://resurgo.life/sign-up"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm px-4 py-2 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition-all"
            >
              START FREE →
            </a>
          )}
        </div>

        {/* Social proof footer */}
        <div className="mt-8 border-t border-zinc-900 pt-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <span className="text-zinc-500 font-mono text-xs">8 AI coaches</span>
            <span className="text-zinc-800">|</span>
            <span className="text-zinc-500 font-mono text-xs">28 goal templates</span>
            <span className="text-zinc-800">|</span>
            <span className="text-zinc-500 font-mono text-xs">100% free to start</span>
            <span className="text-zinc-800">|</span>
            <span className="text-zinc-500 font-mono text-xs">&lt;2 min setup</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://resurgo.life/sign-up"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 font-mono text-xs hover:text-orange-300 transition-colors"
            >
              Sign up free →
            </a>
            <span className="text-zinc-800">·</span>
            <a
              href="https://resurgo.life/billing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 font-mono text-xs hover:text-zinc-400 transition-colors"
            >
              View pricing →
            </a>
            <span className="text-zinc-800">·</span>
            <a
              href="https://resurgo.life"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 font-mono text-xs hover:text-zinc-400 transition-colors"
            >
              resurgo.life →
            </a>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #09090b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}
