'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Digital AI Brain (Holographic Jarvis Edition)
// Jarvis-themed dashboard: neural pulse visualizer, holographic grid,
// AI cascade, memory ring, coach network, learned patterns.
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useStoreUser } from '@/hooks/useStoreUser';
import { useMemo } from 'react';
import Link from 'next/link';
import { Brain, Activity, Shield, Server, Cpu, Database, GitBranch, MessageSquare, Zap, Eye, Wifi, Radio } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface CoachInfo {
  id: string;
  name: string;
  color: string;
  bgClass: string;
  borderClass: string;
  domain: string;
  avatar: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const COACHES: CoachInfo[] = [
  { id: 'MARCUS',  name: 'MARCUS',  color: '#ca8a04', bgClass: 'bg-yellow-950/30', borderClass: 'border-yellow-900/50', domain: 'Discipline · Goals · Stoic Philosophy', avatar: '🏛' },
  { id: 'TITAN',   name: 'TITAN',   color: '#ef4444', bgClass: 'bg-red-950/30',    borderClass: 'border-red-900/50',    domain: 'Fitness · Nutrition · Performance',   avatar: '💪' },
  { id: 'AURORA',  name: 'AURORA',  color: '#a855f7', bgClass: 'bg-purple-950/30', borderClass: 'border-purple-900/50', domain: 'Wellness · Mindfulness · Neuroscience',avatar: '🔮' },
  { id: 'PHOENIX', name: 'PHOENIX', color: '#f97316', bgClass: 'bg-orange-950/30', borderClass: 'border-orange-900/50', domain: 'Resilience · Recovery · Finance',       avatar: '🔥' },
  { id: 'NEXUS',   name: 'NEXUS',   color: '#e879f9', bgClass: 'bg-pink-950/30',   borderClass: 'border-pink-900/50',   domain: 'Habits · Systems · Automation',        avatar: '∞' },
];

const AI_CASCADE = [
  { order: 1, provider: 'Groq',      model: 'llama-3.3-70b-versatile', label: 'PRIMARY',   color: 'text-green-400',  badge: 'bg-green-950/60 border-green-800/50',  description: 'Highest quality — first call' },
  { order: 2, provider: 'Cerebras',  model: 'llama-3.3-70b',           label: 'FALLBACK 1', color: 'text-cyan-400',   badge: 'bg-cyan-950/60 border-cyan-800/50',    description: 'Ultra-fast inference' },
  { order: 3, provider: 'Gemini',    model: '2.0-flash',                label: 'FALLBACK 2', color: 'text-blue-400',   badge: 'bg-blue-950/60 border-blue-800/50',    description: 'Different architecture — diverse answers' },
  { order: 4, provider: 'Groq 8B',  model: 'llama-3.1-8b-instant',    label: 'EMERGENCY',  color: 'text-zinc-500',   badge: 'bg-zinc-900/60 border-zinc-800/50',    description: 'Emergency fallback — always available' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(ts: number | undefined): string {
  if (!ts) return '—';
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function extractPatterns(messages: Array<{ role: string; content: string; touchpoint?: string }>): string[] {
  const patterns: string[] = [];
  const content = messages.map(m => m.content.toLowerCase()).join(' ');

  if (content.match(/\b(tired|exhausted|low energy|drained|burnout)\b/)) patterns.push('Energy dips detected in recent conversations');
  if (content.match(/\b(goal|milestone|target|objective)\b/)) patterns.push('Goal-driven communication style observed');
  if (content.match(/\b(habit|routine|daily|morning|evening)\b/)) patterns.push('Interested in building consistent routines');
  if (content.match(/\b(focus|distracted|adhd|concentration)\b/)) patterns.push('Focus and attention management is a priority');
  if (content.match(/\b(money|budget|expense|income|financial)\b/)) patterns.push('Financial goals in scope');
  if (content.match(/\b(workout|gym|exercise|fitness|run)\b/)) patterns.push('Physical performance tracking active');
  if (content.match(/\b(sleep|insomnia|rest|tired|wake)\b/)) patterns.push('Sleep quality monitoring in use');
  if (content.match(/\b(anxious|stress|overwhelmed|calm|mindful)\b/)) patterns.push('Stress patterns detected — nervous system focus');
  if (content.match(/\b(startup|business|launch|product|build)\b/)) patterns.push('Entrepreneurial / builder mindset detected');

  return patterns.length ? patterns : ['Not enough conversation history yet — start chatting with a coach'];
}

function extractFavoriteCoach(messages: Array<{ content: string; touchpoint?: string }>): string | null {
  const coachMentions: Record<string, number> = {};
  for (const m of messages) {
    for (const c of COACHES) {
      if (m.content.toUpperCase().includes(c.id)) {
        coachMentions[c.id] = (coachMentions[c.id] ?? 0) + 1;
      }
    }
  }
  const sorted = Object.entries(coachMentions).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? null;
}

// ── Section: AI Cascade ───────────────────────────────────────────────────────
function CascadeSection() {
  return (
    <section>
      <SectionHeader icon={<GitBranch size={13} />} label="AI CASCADE" sub="Active model routing — Groq 70B → Cerebras → Gemini → 8B emergency" />
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {AI_CASCADE.map((provider) => (
          <div key={provider.order} className={`border ${provider.badge} p-3`}>
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[0.3rem] tracking-widest text-zinc-600">{`[${provider.order}]`}</span>
              <span className={`font-pixel text-[0.3rem] tracking-widest ${provider.color}`}>{provider.label}</span>
            </div>
            <p className={`mt-2 font-terminal text-sm font-semibold ${provider.color}`}>{provider.provider}</p>
            <p className="font-terminal text-xs text-zinc-500">{provider.model}</p>
            <p className="mt-1.5 font-terminal text-[0.65rem] leading-snug text-zinc-600">{provider.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Section: Coaches ──────────────────────────────────────────────────────────
function CoachesSection({ favoriteId }: { favoriteId: string | null }) {
  return (
    <section>
      <SectionHeader icon={<Cpu size={13} />} label="COACH NETWORK" sub="5 elite AI coaches — all online, all free" />
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {COACHES.map((coach) => (
          <Link
            key={coach.id}
            href="/coach"
            className={`group block border ${coach.borderClass} ${coach.bgClass} p-3 transition-all hover:brightness-110`}
          >
            <div className="flex items-start justify-between">
              <span className="text-lg leading-none">{coach.avatar}</span>
              <div className="flex flex-col items-end gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" title="Online" />
                {favoriteId === coach.id && (
                  <span className="font-pixel text-[0.25rem] tracking-widest text-orange-500">MOST USED</span>
                )}
              </div>
            </div>
            <p className="mt-2 font-terminal text-xs font-semibold text-zinc-100">{coach.name}</p>
            <p className="font-terminal text-[0.65rem] leading-snug text-zinc-500">{coach.domain}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Section: Memory & Patterns ───────────────────────────────────────────────
function MemorySection({ patterns, messageCount, user }: {
  patterns: string[];
  messageCount: number;
  user: {
    name?: string | null;
    plan?: string;
    summaryMemory?: string | null;
    archetype?: string | null;
    focusAreas?: string[] | null;
    coreValues?: string[] | null;
  } | null;
}) {
  return (
    <section>
      <SectionHeader icon={<Database size={13} />} label="AI MEMORY" sub={`${messageCount} messages stored · Convex persistent memory`} />
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* User profile */}
        <div className="border border-zinc-800/50 bg-zinc-950/50 p-4">
          <p className="mb-3 font-pixel text-[0.3rem] tracking-widest text-zinc-600">USER PROFILE</p>
          <div className="space-y-1.5">
            <MemoryRow label="NAME" value={user?.name ?? '—'} />
            <MemoryRow label="PLAN" value={user?.plan?.toUpperCase() ?? 'FREE'} highlight={user?.plan !== 'free'} />
            <MemoryRow label="ARCHETYPE" value={user?.archetype ?? 'Not set'} />
            <MemoryRow label="FOCUS AREAS" value={user?.focusAreas?.join(', ') ?? 'Not configured'} />
            <MemoryRow label="CORE VALUES" value={user?.coreValues?.slice(0, 3).join(' · ') ?? 'Not configured'} />
          </div>
        </div>
        {/* Learned patterns */}
        <div className="border border-zinc-800/50 bg-zinc-950/50 p-4">
          <p className="mb-3 font-pixel text-[0.3rem] tracking-widest text-zinc-600">LEARNED PATTERNS</p>
          <div className="space-y-2">
            {patterns.map((p, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-1 shrink-0 font-terminal text-[0.65rem] text-orange-600">→</span>
                <p className="font-terminal text-xs leading-snug text-zinc-400">{p}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Summary memory */}
        {user?.summaryMemory && (
          <div className="border border-zinc-800/50 bg-zinc-950/50 p-4 lg:col-span-2">
            <p className="mb-2 font-pixel text-[0.3rem] tracking-widest text-zinc-600">AI SUMMARY MEMORY</p>
            <p className="font-terminal text-xs leading-relaxed text-zinc-400">{user.summaryMemory}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Section: Recent Conversations ────────────────────────────────────────────
function ConversationSection({ messages }: { messages: Array<{ role: string; content: string; touchpoint?: string; _creationTime?: number }> }) {
  const recent = messages.slice(-8).reverse();
  return (
    <section>
      <SectionHeader icon={<MessageSquare size={13} />} label="RECENT ACTIVITY" sub="Last 8 coach interactions — live from Convex" />
      <div className="border border-zinc-800/50">
        {recent.length === 0 ? (
          <div className="p-6 text-center">
            <p className="font-terminal text-sm text-zinc-600">No conversations yet.</p>
            <Link href="/coach" className="mt-2 inline-block font-terminal text-xs text-orange-500 underline">Start talking to a coach →</Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/30">
            {recent.map((msg, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <span className={`mt-0.5 font-pixel text-[0.28rem] tracking-widest shrink-0 w-16 pt-0.5 ${msg.role === 'coach' ? 'text-orange-500' : 'text-cyan-500'}`}>
                  {msg.role === 'coach' ? 'COACH' : 'YOU'}
                </span>
                <p className="line-clamp-2 flex-1 font-terminal text-xs leading-relaxed text-zinc-400">{msg.content}</p>
                <span className="shrink-0 font-terminal text-[0.6rem] text-zinc-700">{timeAgo(msg._creationTime)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {messages.length > 8 && (
        <Link href="/coach" className="mt-2 block text-right font-terminal text-xs text-zinc-600 hover:text-orange-500">
          View all {messages.length} messages →
        </Link>
      )}
    </section>
  );
}

// ── Section: System Status ────────────────────────────────────────────────────
function SystemSection({ messageCount, xp, streak }: { messageCount: number; xp?: number; streak?: number }) {
  return (
    <section>
      <SectionHeader icon={<Server size={13} />} label="SYSTEM STATUS" sub="Infrastructure health — all green" />
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatBox label="AI MESSAGES" value={String(messageCount)} color="text-orange-400" icon={<MessageSquare size={11} />} />
        <StatBox label="XP EARNED" value={xp ? `${xp.toLocaleString()} XP` : '—'} color="text-yellow-400" icon={<Zap size={11} />} />
        <StatBox label="STREAK" value={streak ? `${streak}d` : '—'} color="text-green-400" icon={<Activity size={11} />} />
        <StatBox label="CASCADE" value="4 MODELS" color="text-cyan-400" icon={<Wifi size={11} />} />
      </div>
    </section>
  );
}

// ── Micro-components ──────────────────────────────────────────────────────────
function SectionHeader({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-800/50 pb-2">
      <div className="flex items-center gap-2">
        <span className="text-zinc-600">{icon}</span>
        <span className="font-pixel text-[0.38rem] tracking-widest text-zinc-300">{label}</span>
      </div>
      <p className="font-terminal text-[0.65rem] text-zinc-600 text-right">{sub}</p>
    </div>
  );
}

function MemoryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="w-24 shrink-0 font-pixel text-[0.28rem] tracking-widest text-zinc-600">{label}</span>
      <span className={`font-terminal text-xs ${highlight ? 'text-orange-400' : 'text-zinc-400'}`}>{value}</span>
    </div>
  );
}

function StatBox({ label, value, color, icon }: { label: string; value: string; color: string; icon?: React.ReactNode }) {
  return (
    <div className="group relative overflow-hidden border border-zinc-800/50 bg-zinc-950/50 p-3 transition-colors hover:border-zinc-700/50">
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-transparent opacity-0 transition-opacity group-hover:opacity-5" />
      <div className="relative flex items-center gap-1.5">
        {icon && <span className="text-zinc-700">{icon}</span>}
        <p className="font-pixel text-[0.28rem] tracking-widest text-zinc-600">{label}</p>
      </div>
      <p className={`relative mt-1.5 font-terminal text-sm font-semibold ${color}`}>{value}</p>
    </div>
  );
}

// ── Neural Core Visualizer ───────────────────────────────────────────────────
function NeuralCoreSection({ messageCount, xp }: { messageCount: number; xp?: number }) {
  const activity = Math.min(messageCount / 50, 1);
  const ringCount = 3;

  return (
    <section>
      <SectionHeader icon={<Eye size={13} />} label="NEURAL CORE" sub="Real-time AI brain activity visualization" />
      <div className="mt-3 flex flex-col items-center gap-6 border border-zinc-800/50 bg-zinc-950/30 p-8 sm:flex-row sm:justify-center sm:gap-12">
        {/* Pulsing core */}
        <div className="relative flex h-44 w-44 shrink-0 items-center justify-center">
          {/* Holographic grid lines */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(234,88,12,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234,88,12,0.3) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />

          {/* Concentric rings */}
          {Array.from({ length: ringCount }).map((_, i) => {
            const size = 60 + i * 36;
            const delay = i * 0.8;
            return (
              <div
                key={i}
                className="absolute rounded-full border border-orange-500/20"
                style={{
                  width: size,
                  height: size,
                  animation: `pulse ${2 + i * 0.5}s ease-in-out ${delay}s infinite`,
                }}
              />
            );
          })}

          {/* Core brain icon */}
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-orange-500/40 bg-orange-950/40" style={{
              boxShadow: '0 0 30px rgba(234,88,12,0.2), 0 0 60px rgba(234,88,12,0.1)',
            }}>
              <Brain size={28} className="text-orange-500" style={{ animation: 'pulse 3s ease-in-out infinite' }} />
            </div>
            <span className="font-pixel text-[0.3rem] tracking-widest text-orange-500/80">ACTIVE</span>
          </div>
        </div>

        {/* Core stats */}
        <div className="space-y-3">
          <div>
            <p className="font-pixel text-[0.3rem] tracking-widest text-zinc-600">NEURAL ACTIVITY</p>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1.5 w-32 overflow-hidden bg-zinc-900">
                <div
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-1000"
                  style={{ width: `${Math.max(activity * 100, 10)}%` }}
                />
              </div>
              <span className="font-terminal text-xs text-orange-400">{Math.round(activity * 100)}%</span>
            </div>
          </div>
          <div>
            <p className="font-pixel text-[0.3rem] tracking-widest text-zinc-600">MEMORY NODES</p>
            <p className="font-terminal text-lg font-semibold text-cyan-400">{messageCount}</p>
          </div>
          <div>
            <p className="font-pixel text-[0.3rem] tracking-widest text-zinc-600">POWER LEVEL</p>
            <p className="font-terminal text-lg font-semibold text-yellow-400">{xp ? xp.toLocaleString() : '0'} <span className="text-xs text-zinc-600">XP</span></p>
          </div>
          <div>
            <p className="font-pixel text-[0.3rem] tracking-widest text-zinc-600">AI MODELS ONLINE</p>
            <div className="flex items-center gap-1.5">
              {['Groq 70B', 'Cerebras', 'Gemini', '8B'].map((m) => (
                <span key={m} className="flex items-center gap-1 border border-green-900/40 bg-green-950/20 px-1.5 py-0.5">
                  <span className="h-1 w-1 rounded-full bg-green-500" />
                  <span className="font-terminal text-[0.55rem] text-green-400">{m}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── AI Insights Panel ────────────────────────────────────────────────────────
function InsightsSection({ patterns, streak, messageCount }: { patterns: string[]; streak?: number; messageCount: number }) {
  const insights = useMemo(() => {
    const items: Array<{ icon: React.ReactNode; title: string; detail: string; color: string }> = [];

    if ((streak ?? 0) >= 7) {
      items.push({ icon: <Zap size={14} />, title: 'HOT STREAK', detail: `${streak}d streak — your consistency is building compound results`, color: 'text-yellow-400 border-yellow-800/50 bg-yellow-950/20' });
    }
    if (messageCount >= 50) {
      items.push({ icon: <Radio size={14} />, title: 'DEEP MEMORY', detail: `${messageCount} messages analyzed — your AI deeply understands your patterns`, color: 'text-purple-400 border-purple-800/50 bg-purple-950/20' });
    } else if (messageCount >= 10) {
      items.push({ icon: <Radio size={14} />, title: 'MEMORY GROWING', detail: `${messageCount} messages — keep chatting to unlock deeper insights`, color: 'text-cyan-400 border-cyan-800/50 bg-cyan-950/20' });
    }
    if (patterns.some(p => p.includes('Entrepreneurial'))) {
      items.push({ icon: <Zap size={14} />, title: 'BUILDER DETECTED', detail: 'Your AI sees a founder/builder pattern — leveraging this in all coaching', color: 'text-orange-400 border-orange-800/50 bg-orange-950/20' });
    }
    if (patterns.some(p => p.includes('Stress'))) {
      items.push({ icon: <Shield size={14} />, title: 'STRESS WATCH', detail: 'Elevated stress signals detected — Aurora and Phoenix are prioritizing recovery', color: 'text-red-400 border-red-800/50 bg-red-950/20' });
    }
    if (patterns.some(p => p.includes('routine'))) {
      items.push({ icon: <Activity size={14} />, title: 'SYSTEM BUILDER', detail: 'You gravitate toward systems and routines — Nexus is optimized for you', color: 'text-emerald-400 border-emerald-800/50 bg-emerald-950/20' });
    }
    if (items.length === 0) {
      items.push({ icon: <Eye size={14} />, title: 'CALIBRATING', detail: 'Your AI is still learning — chat with coaches to unlock personalized insights', color: 'text-zinc-400 border-zinc-700/50 bg-zinc-900/20' });
    }
    return items;
  }, [patterns, streak, messageCount]);

  return (
    <section>
      <SectionHeader icon={<Eye size={13} />} label="AI INSIGHTS" sub="Personalized intelligence from your AI brain" />
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((ins, i) => (
          <div key={i} className={`border p-4 ${ins.color}`}>
            <div className="flex items-center gap-2">
              {ins.icon}
              <span className="font-pixel text-[0.32rem] tracking-widest">{ins.title}</span>
            </div>
            <p className="mt-2 font-terminal text-xs leading-relaxed text-zinc-400">{ins.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AIBrainPage() {
  useStoreUser();

  const user = useQuery(api.users.current);
  const { data: gamification } = useQuery(api.gamification.getProfile) as { data?: { xp?: number; streakCurrent?: number } } ?? {};
  const rawMessages = useQuery(api.coachMessages.getHistory, { limit: 200 });
  const messages = useMemo(() => rawMessages ?? [], [rawMessages]);

  const patterns = useMemo(() => extractPatterns(messages as Array<{ role: string; content: string }>), [messages]);
  const favoriteCoach = useMemo(() => extractFavoriteCoach(messages as Array<{ content: string }>), [messages]);

  const xp = (gamification as { xp?: number } | null | undefined)?.xp;
  const streak = (gamification as { streakCurrent?: number } | null | undefined)?.streakCurrent;

  return (
    <div className="relative min-h-screen bg-black px-4 py-8 sm:px-6 lg:px-8">
      {/* Holographic background grid */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(234,88,12,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(234,88,12,0.5) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      {/* Radial glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 z-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-orange-500/5 blur-3xl" />

      {/* ── Header ── */}
      <div className="relative z-10 mx-auto mb-8 flex max-w-7xl items-start justify-between gap-6 border-b border-zinc-800/50 pb-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Brain size={18} className="text-orange-500" />
            <span className="font-pixel text-[0.45rem] tracking-widest text-orange-500">RESURGO — DIGITAL AI BRAIN</span>
            <span className="flex items-center gap-1 border border-green-900/50 bg-green-950/20 px-2 py-0.5">
              <span className="h-1 w-1 animate-pulse rounded-full bg-green-500" />
              <span className="font-pixel text-[0.28rem] tracking-widest text-green-400">LIVE</span>
            </span>
          </div>
          <p className="font-terminal text-sm text-zinc-500 max-w-xl">
            See what your AI knows about you, which models are active, and what patterns it has learned from your conversations.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/coach" className="border border-orange-800/50 bg-orange-950/20 px-3 py-2 font-terminal text-xs text-orange-400 transition-colors hover:bg-orange-950/40">
            → Open Coach
          </Link>
          <Link href="/settings" className="border border-zinc-800/50 px-3 py-2 font-terminal text-xs text-zinc-500 transition-colors hover:text-zinc-300">
            Settings
          </Link>
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="relative z-10 mx-auto max-w-7xl space-y-10">
        <NeuralCoreSection messageCount={messages.length} xp={xp} />
        <SystemSection messageCount={messages.length} xp={xp} streak={streak} />
        <InsightsSection patterns={patterns} streak={streak} messageCount={messages.length} />
        <CascadeSection />
        <CoachesSection favoriteId={favoriteCoach} />
        <MemorySection
          patterns={patterns}
          messageCount={messages.length}
          user={user as {
            name?: string | null;
            plan?: string;
            summaryMemory?: string | null;
            archetype?: string | null;
            focusAreas?: string[] | null;
            coreValues?: string[] | null;
          } | null}
        />
        <ConversationSection messages={messages as Array<{ role: string; content: string; touchpoint?: string; _creationTime?: number }>} />
      </div>

      {/* ── Footer note ── */}
      <div className="mx-auto mt-12 max-w-7xl border-t border-zinc-800/30 pt-4">
        <div className="flex items-center gap-2">
          <Shield size={11} className="text-zinc-700" />
          <p className="font-terminal text-[0.6rem] text-zinc-700">
            All AI data is stored in your Convex database. Nothing is shared with third parties. Models are stateless — only Convex holds your memory.
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Activity size={11} className="text-zinc-700" />
          <p className="font-terminal text-[0.6rem] text-zinc-700">
            Cascade order: Groq llama-3.3-70b → Cerebras llama-3.3-70b → Gemini 2.0 Flash → Groq llama-3.1-8b. Free tier across all providers.
          </p>
        </div>
      </div>
    </div>
  );
}
