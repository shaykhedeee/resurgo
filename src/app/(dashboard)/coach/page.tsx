'use client';

// -------------------------------------------------------------------------------
// RESURGO - AI Coach Interface (Terminal Robot UI)
// Eight elite AI coaches with memory, real-time streaming, typing animation
// -------------------------------------------------------------------------------

import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Send, Brain, Zap, Dumbbell, Flame, Sparkles, Lock, CheckCircle2, XCircle, BarChart3, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStoreUser } from '@/hooks/useStoreUser';
import { analytics } from '@/lib/analytics';
import { PixelArt } from '@/components/PixelArt';
import { PixelIcon } from '@/components/PixelIcon';
import dynamic from 'next/dynamic';
import { UpsellPrompt } from '@/components/UpsellPrompt';

const VisionBoard = dynamic(() => import('@/components/VisionBoard'), { ssr: false });

type CoachId = 'MARCUS' | 'AURORA' | 'TITAN' | 'PHOENIX' | 'NEXUS';
type CoachTab = 'chat' | 'vision' | 'analytics';

interface CoachDef {
  id: CoachId;
  name: string;
  title: string;
  avatar: string;
  color: string;
  domain: string;
  shortBio: string;
  Icon: React.ElementType;
}

const COACHES: CoachDef[] = [
  { id: 'MARCUS',  name: 'MARCUS',  title: 'Stoic Strategist',     avatar: '🏛', color: '#ca8a04', domain: 'discipline · goals · execution',              shortBio: 'Brutal clarity. Zero BS. The obstacle IS the way.',              Icon: Brain },
  { id: 'TITAN',   name: 'TITAN',   title: 'Physical Performance', avatar: '💪', color: '#ef4444', domain: 'fitness · nutrition · optimization',              shortBio: 'Your body is the engine. Fix physical → fix mental.',            Icon: Dumbbell },
  { id: 'AURORA',  name: 'AURORA',  title: 'Mindful Catalyst',     avatar: '🔮', color: '#a855f7', domain: 'wellness · mindfulness · creativity · neuroscience', shortBio: 'Optimize your nervous system. Science-backed, heart-led.',       Icon: Sparkles },
  { id: 'PHOENIX', name: 'PHOENIX', title: 'Comeback Specialist',  avatar: '🔥', color: '#f97316', domain: 'resilience · recovery · setbacks · finance',       shortBio: 'Built for rock bottom. The ashes are the fuel.',                Icon: Flame },
  { id: 'NEXUS',   name: 'NEXUS',   title: 'Systems Builder',      avatar: '∞',  color: '#e879f9', domain: 'habits · routines · automation · efficiency',       shortBio: 'Merges mind, body & systems into one adaptive engine. No limits.', Icon: Zap },
];

// Static fallback prompts (used only while smart prompts load)
const FALLBACK_PROMPTS: Record<CoachId, string[]> = {
  MARCUS:  ['Plan my top 3 priorities for today', 'I feel stuck and overwhelmed', 'How do I build iron discipline?'],
  TITAN:   ['Design me a weekly workout plan', 'What should I eat for peak energy?', 'My energy crashes at 3pm — fix it'],
  AURORA:  ['I\'m feeling anxious and burned out', 'Help me build a mindfulness routine', 'How do I sleep better?'],
  PHOENIX: ['I failed at my goals again', 'I\'m in a deep slump — help me restart', 'How do I build resilience?'],
  NEXUS:   ['Build me a custom systems stack', 'Integrate my fitness, work, and mental health into one system', 'How do I automate my routines?'],
};

// ── Render action badges from action summary blocks ──
function MessageContent({ content, coachColor: _coachColor }: { content: string; coachColor: string }) {
  const ACTION_REGEX = /\n*──── ACTIONS(?: EXECUTED)? ────\n([\s\S]*)$/;
  const match = content.match(ACTION_REGEX);
  const textPart = match ? content.slice(0, match.index).trim() : content;
  const actionLines = match
    ? match[1].split('\n').map(l => l.trim()).filter(Boolean)
    : [];

  return (
    <>
      <p className="font-mono text-[11px] leading-relaxed text-zinc-300 whitespace-pre-wrap">{textPart}</p>
      {actionLines.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {actionLines.map((line, i) => {
            const isSuccess = line.startsWith('✓');
            const text = line.replace(/^[✓✗]\s*/, '');
            return (
              <span
                key={i}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono tracking-wider border',
                  isSuccess
                    ? 'border-emerald-800/60 bg-emerald-950/40 text-emerald-400'
                    : 'border-red-800/60 bg-red-950/40 text-red-400'
                )}
              >
                {isSuccess
                  ? <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                  : <XCircle className="h-2.5 w-2.5 shrink-0" />
                }
                {text}
              </span>
            );
          })}
        </div>
      )}
    </>
  );
}

export default function CoachPage() {
  const [selectedCoach, setSelectedCoach] = useState<CoachId>('MARCUS');
  const [activeTab, setActiveTab] = useState<CoachTab>('chat');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  const [showCoachUpsell, setShowCoachUpsell] = useState<string | null>(null);
  const [showMessageLimitUpsell, setShowMessageLimitUpsell] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const greetedRef = useRef<Set<string>>(new Set());

  const { user } = useStoreUser();
  const isPro = user?.plan === 'pro' || user?.plan === 'lifetime';
  const FREE_COACHES: CoachId[] = ['MARCUS', 'TITAN'];

  const history = useQuery(api.coachMessages.getHistory, { limit: 100 });
  const smartPrompts = useQuery(api.coachAI.getSmartPrompts, { coachId: selectedCoach });
  const sendWithPersona = useAction(api.coachAI.sendWithPersona);
  const greetUser = useAction(api.coachAI.greetUser);
  const setCoachMutation = useMutation(api.coachAI.setSelectedCoach);

  const FREE_DAILY_MESSAGE_LIMIT = 10;
  
  // Count today's user messages for free plan limit
  const todayUserMessages = useMemo(() => {
    if (!history || isPro) return 0;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return history.filter(m => m.role === 'user' && m.createdAt >= todayStart.getTime()).length;
  }, [history, isPro]);

  const coachMessages = useMemo(() => {
    if (!history) return [];
    return history.filter((m) => m.context?.startsWith(`coach:${selectedCoach}`));
  }, [history, selectedCoach]);

  // Auto-greet when switching to a coach with no messages
  useEffect(() => {
    if (!history || isGreeting || isSending) return;
    const msgs = history.filter((m) => m.context?.startsWith(`coach:${selectedCoach}`));
    if (msgs.length === 0 && !greetedRef.current.has(selectedCoach)) {
      greetedRef.current.add(selectedCoach);
      setIsGreeting(true);
      greetUser({ coachId: selectedCoach, userName: user?.name })
        .catch(() => {})
        .finally(() => setIsGreeting(false));
    }
  }, [history, selectedCoach, isGreeting, isSending, greetUser, user?.name]);

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [coachMessages]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    
    // Gate: check daily message limit for free users
    if (!isPro && todayUserMessages >= FREE_DAILY_MESSAGE_LIMIT) {
      setShowMessageLimitUpsell(true);
      return;
    }
    
    setMessage('');
    setIsSending(true);
    // Track first AI message (activation event)
    if (coachMessages.length === 0) analytics.firstAIMessage(selectedCoach);
    analytics.getAICoaching();
    try {
      await sendWithPersona({ content: trimmed, coachId: selectedCoach, touchpoint: 'on_demand' });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); handleSend(message); };

  const handleSwitchCoach = async (id: CoachId) => {
    if (!isPro && !FREE_COACHES.includes(id)) {
      const coachDef = COACHES.find(c => c.id === id);
      setShowCoachUpsell(coachDef?.name ?? id);
      analytics.upgradePromptShown('coach_selection');
      return; // blocked for free users
    }
    setShowCoachUpsell(null);
    setSelectedCoach(id);
    analytics.coachSelected(id);
    await setCoachMutation({ coachId: id }).catch(() => {});
  };

  const coach = COACHES.find((c) => c.id === selectedCoach)!;

  const MAIN_TABS: { id: CoachTab; label: string; icon: React.ElementType }[] = [
    { id: 'chat',      label: 'CHAT',         icon: MessageSquare },
    { id: 'vision',    label: 'VISION_BOARD', icon: Sparkles      },
    { id: 'analytics', label: 'ANALYTICS',    icon: BarChart3     },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* -- HEADER -- */}
      <div className="border-b border-zinc-900 bg-zinc-950 px-4 py-3 md:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">RESURGO :: AI_COACH</span>
          </div>
          <span className="surface-chip-accent">ACTIVE: {selectedCoach}</span>
        </div>
      </div>

      {/* -- TAB BAR -- */}
      <div className="border-b border-zinc-900 bg-zinc-950/80">
        <div className="mx-auto flex max-w-5xl">
          {MAIN_TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={cn(
                'flex items-center gap-2 border-b-2 px-6 py-3 font-mono text-[10px] tracking-widest transition',
                activeTab === id
                  ? 'border-orange-600 bg-orange-950/10 text-orange-500'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              )}>
              <Icon className="h-3 w-3" />{label}
            </button>
          ))}
        </div>
      </div>

      {/* -- VISION BOARD TAB -- */}
      {activeTab === 'vision' && (
        <div className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-6">
          <VisionBoard />
        </div>
      )}

      {/* -- ANALYTICS TAB -- */}
      {activeTab === 'analytics' && (
        <div className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-6 space-y-6">
          <div className="border border-zinc-900 bg-zinc-950">
            <div className="border-b border-zinc-900 px-4 py-2.5">
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">COACH_USAGE_BREAKDOWN</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {COACHES.slice(0, 6).map((c) => {
                const count = history?.filter((m) => m.context?.startsWith(`coach:${c.id}`) && m.role === 'user').length ?? 0;
                const total = history?.filter((m) => m.role === 'user').length ?? 1;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={c.id} className="border border-zinc-800 bg-black p-3">
                    <div className="mb-2 flex items-center gap-1.5">
                      <span className="text-base">{c.avatar}</span>
                      <p className="font-mono text-[10px] font-bold tracking-widest" style={{ color: c.color }}>{c.name}</p>
                    </div>
                    <p className="font-mono text-xl font-bold text-zinc-100">{count}</p>
                    <p className="font-mono text-xs text-zinc-500">messages ({pct}%)</p>
                    <div className="mt-2 h-1 w-full bg-zinc-900">
                      <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: c.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border border-zinc-900 bg-zinc-950">
            <div className="border-b border-zinc-900 px-4 py-2.5">
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">RECENT_INSIGHTS</span>
            </div>
            <div className="p-4 space-y-2">
              {history && history.filter((m) => m.role === 'coach').slice(0, 5).map((m) => {
                const cId = m.context?.replace('coach:', '') as CoachId | undefined;
                const cDef = COACHES.find(c => c.id === cId);
                return (
                  <div key={m._id} className="border border-zinc-800 bg-black px-3 py-2.5">
                    {cDef && <p className="mb-1 font-mono text-[8px] tracking-widest" style={{ color: cDef.color }}>{cDef.name}</p>}
                    <p className="font-mono text-[10px] leading-relaxed text-zinc-400 line-clamp-2">{m.content.slice(0, 180)}…</p>
                  </div>
                );
              })}
              {(!history || history.filter(m=>m.role==='coach').length === 0) && (
                <p className="py-8 text-center font-mono text-xs tracking-widest text-zinc-500">NO_COACH_HISTORY_YET</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -- CHAT TAB (default) -- */}
      {activeTab === 'chat' && (
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 md:flex-row md:p-6">
        {/* -- AGENT SELECTOR -- */}
        <aside className="w-full md:w-64 shrink-0 space-y-3">
          <div className="surface-panel overflow-hidden">
            <div className="border-b border-zinc-900 px-3 py-2">
              <p className="font-mono text-[9px] tracking-widest text-zinc-400">CHOOSE COACH</p>
            </div>
            <div className="space-y-px p-1">
              {COACHES.map((c) => {
                const Icon = c.Icon;
                const isActive = c.id === selectedCoach;
                const isProLocked = !isPro && !FREE_COACHES.includes(c.id);
                const isLocked = isProLocked;
                return (
                  <div key={c.id}>
                    <button onClick={() => handleSwitchCoach(c.id)}
                      className={cn('group w-full border px-3 py-2.5 text-left transition',
                        isLocked ? 'cursor-not-allowed opacity-50 border-transparent' :
                        isActive ? 'border-zinc-700 bg-zinc-900' : 'border-transparent hover:border-zinc-800 hover:bg-zinc-900/50'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: isActive && !isLocked ? c.color : '#52525b' }} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="font-mono text-[10px] font-bold tracking-widest" style={{ color: isActive && !isLocked ? c.color : '#71717a' }}>{c.name}</p>
                          </div>
                          <p className="truncate font-mono text-[8px] tracking-wider text-zinc-400">{c.title}</p>
                        </div>
                        {isLocked ? (
                          <Lock className="h-3 w-3 shrink-0 text-zinc-400" />
                        ) : isActive ? (
                          <span className="h-1 w-1 rounded-full" style={{ backgroundColor: c.color }} />
                        ) : null}
                      </div>
                      {isLocked && (
                        <p className="mt-1 font-mono text-[7px] tracking-widest text-amber-600/70">PRO ONLY</p>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            {showCoachUpsell && (
              <div className="p-2">
                <UpsellPrompt
                  trigger="coach_locked"
                  variant="inline"
                  coachName={showCoachUpsell}
                  onDismiss={() => setShowCoachUpsell(null)}
                />
              </div>
            )}
          </div>

          <div className="surface-panel overflow-hidden">
            <div className="border-b border-zinc-900 px-3 py-2">
              <p className="font-mono text-[9px] tracking-widest text-zinc-400">QUICK PROMPTS</p>
            </div>
            <div className="space-y-px p-1">
              {(smartPrompts ?? FALLBACK_PROMPTS[selectedCoach]).map((q) => (
                <button key={q} onClick={() => handleSend(q)} disabled={isSending}
                  className="w-full border border-transparent px-3 py-2 text-left font-mono text-[9px] leading-relaxed tracking-wider text-zinc-500 transition hover:border-zinc-800 hover:text-zinc-300 disabled:opacity-40">
                  &gt; {q}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* -- CHAT TERMINAL -- */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* Coach card */}
          <div className="surface-panel-muted border px-4 py-4" style={{ borderColor: `${coach.color}33`, backgroundColor: `${coach.color}08` }}>
            <div className="flex items-start gap-3">
              <PixelArt variant="coach" className="h-16 w-16 shrink-0" title="Coach pixel art" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <PixelIcon name="robot" size={14} className="text-violet-300" />
                  <p className="font-mono text-xs font-bold tracking-widest" style={{ color: coach.color }}>{coach.name} - {coach.title}</p>
                </div>
                <p className="mt-1 font-mono text-[9px] tracking-wider text-zinc-500">{coach.domain}</p>
                <p className="mt-1 font-mono text-[10px] text-zinc-400">{coach.shortBio}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="surface-panel flex-1 overflow-y-auto bg-black" style={{ minHeight: '280px', maxHeight: 'calc(100vh - 400px)' }}>
            <div className="space-y-px p-2">
              {coachMessages.length === 0 && !isGreeting && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="mb-3 text-4xl">{coach.avatar}</span>
                <p className="font-mono text-[9px] tracking-widest text-zinc-400">{coach.name} — {coach.title}</p>
                  <p className="mt-2 font-mono text-[10px] text-zinc-400">{coach.shortBio}</p>
                </div>
              )}
              {isGreeting && coachMessages.length === 0 && (
                <div className="mr-6 border px-4 py-3" style={{ borderColor: `${coach.color}30` }}>
                  <p className="mb-1 font-mono text-[8px] tracking-widest" style={{ color: coach.color }}>{coach.name}</p>
                  <p className="font-mono text-[11px] text-zinc-500 animate-pulse">Starting chat...</p>
                </div>
              )}
              {coachMessages.map((m) => {
                const isCoach = m.role === 'coach';
                return (
                  <div key={m._id}
                    className={cn('border px-4 py-3', isCoach ? 'mr-6 bg-black' : 'ml-6 border-zinc-800 bg-zinc-950')}
                    style={isCoach ? { borderColor: `${coach.color}30` } : {}}>
                    <p className="mb-1 font-mono text-[8px] tracking-widest" style={isCoach ? { color: coach.color } : { color: '#52525b' }}>
                      {isCoach ? coach.name : 'You'}
                    </p>
                    {isCoach ? (
                      <MessageContent content={m.content} coachColor={coach.color} />
                    ) : (
                      <p className="font-mono text-[11px] leading-relaxed text-zinc-300 whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                );
              })}
              {isSending && (
                <div className="mr-6 border px-4 py-3" style={{ borderColor: `${coach.color}30` }}>
                  <p className="mb-1 font-mono text-[8px] tracking-widest" style={{ color: coach.color }}>{coach.name}</p>
                  <p className="font-mono text-[11px] text-zinc-500 animate-pulse">Thinking...</p>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Message Limit Upsell */}
          {showMessageLimitUpsell && (
            <div className="px-3 py-2">
              <UpsellPrompt
                trigger="ai_message_limit"
                variant="banner"
                onDismiss={() => setShowMessageLimitUpsell(false)}
              />
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="surface-panel flex items-center gap-2 p-3">
            <input ref={inputRef} value={message} onChange={(e) => setMessage(e.target.value)}
              placeholder={`Ask ${coach.name} anything...`} disabled={isSending}
              className="h-9 flex-1 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none disabled:opacity-50" />
            <button type="submit" disabled={isSending || !message.trim()}
              className="flex h-9 items-center gap-1.5 border px-4 font-mono text-[10px] tracking-widest transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ borderColor: `${coach.color}60`, color: coach.color, backgroundColor: `${coach.color}15` }}>
              <Send className="h-3 w-3" />
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
      )}
    </div>
  );
}
