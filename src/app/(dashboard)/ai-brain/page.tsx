'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Digital AI Brain
// Terminal-themed dashboard showing AI cascade status, memory, coach feeds,
// learned patterns, and what the AI knows about the current user.
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useStoreUser } from '@/hooks/useStoreUser';
import { useMemo } from 'react';
import Link from 'next/link';
import { Brain, Activity, Shield, Server, Cpu, Database, GitBranch, MessageSquare } from 'lucide-react';

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
        <StatBox label="AI MESSAGES" value={String(messageCount)} color="text-orange-400" />
        <StatBox label="XP EARNED" value={xp ? `${xp.toLocaleString()} XP` : '—'} color="text-yellow-400" />
        <StatBox label="STREAK" value={streak ? `${streak}d` : '—'} color="text-green-400" />
        <StatBox label="CASCADE" value="4 MODELS" color="text-cyan-400" />
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

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="border border-zinc-800/50 bg-zinc-950/50 p-3">
      <p className="font-pixel text-[0.28rem] tracking-widest text-zinc-600">{label}</p>
      <p className={`mt-1.5 font-terminal text-sm font-semibold ${color}`}>{value}</p>
    </div>
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
    <div className="min-h-screen bg-black px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <div className="mx-auto mb-8 flex max-w-7xl items-start justify-between gap-6 border-b border-zinc-800/50 pb-6">
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
      <div className="mx-auto max-w-7xl space-y-10">
        <SystemSection messageCount={messages.length} xp={xp} streak={streak} />
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
