'use client';

// -------------------------------------------------------------------------------
// RESURGO � AI Coach Interface (Terminal Robot UI)
// Six distinct AI personas with memory, real-time streaming, typing animation
// -------------------------------------------------------------------------------

import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Send, Brain, Zap, Dumbbell, TrendingUp, Flame, Sparkles, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStoreUser } from '@/hooks/useStoreUser';

type CoachId = 'MARCUS' | 'AURORA' | 'TITAN' | 'SAGE' | 'PHOENIX' | 'NOVA';

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
  { id: 'MARCUS', name: 'MARCUS', title: 'Stoic Strategist',       avatar: '?', color: '#ca8a04', domain: 'discipline � goals � execution',          shortBio: 'Brutal clarity. Zero BS. The obstacle IS the way.',        Icon: Brain },
  { id: 'AURORA', name: 'AURORA', title: 'Mindful Catalyst',       avatar: '??', color: '#a855f7', domain: 'wellness � mindfulness � neuroscience',    shortBio: 'Optimize your nervous system. Science-backed, heart-led.', Icon: Sparkles },
  { id: 'TITAN',  name: 'TITAN',  title: 'Physical Performance',   avatar: '??', color: '#ef4444', domain: 'fitness � nutrition � optimization',        shortBio: 'Your body is the engine. Fix physical ? fix mental.',      Icon: Dumbbell },
  { id: 'SAGE',   name: 'SAGE',   title: 'Financial Alchemist',    avatar: '??', color: '#22c55e', domain: 'finance � wealth � career strategy',        shortBio: 'Every dollar is a soldier. Deploy capital with precision.', Icon: TrendingUp },
  { id: 'PHOENIX',name: 'PHOENIX',title: 'Comeback Specialist',    avatar: '??', color: '#f97316', domain: 'resilience � recovery � setbacks',          shortBio: 'Built for rock bottom. The ashes are the fuel.',           Icon: Flame },
  { id: 'NOVA',   name: 'NOVA',   title: 'Creative Systems',       avatar: '?', color: '#06b6d4', domain: 'creativity � learning � systems',           shortBio: 'Connects dots across disciplines to unlock breakthroughs.', Icon: Zap },
];

const QUICK_PROMPTS: Record<CoachId, string[]> = {
  MARCUS:  ['Plan my top 3 priorities for today', 'I feel stuck and overwhelmed', 'How do I build iron discipline?'],
  AURORA:  ['I\'m feeling anxious and burned out', 'Help me build a mindfulness routine', 'How do I sleep better?'],
  TITAN:   ['Design me a weekly workout plan', 'What should I eat for peak energy?', 'My energy crashes at 3pm � fix it'],
  SAGE:    ['How do I build a savings system?', 'Help me create a monthly budget', 'How do I grow my income?'],
  PHOENIX: ['I failed at my goals again', 'I\'m in a deep slump � help me restart', 'How do I build resilience?'],
  NOVA:    ['I\'m stuck on a creative problem', 'How do I learn faster?', 'Help me build a second brain system'],
};

export default function CoachPage() {
  const [selectedCoach, setSelectedCoach] = useState<CoachId>('MARCUS');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const greetedRef = useRef<Set<string>>(new Set());

  const { user } = useStoreUser();
  const isPro = user?.plan === 'pro' || user?.plan === 'lifetime';
  const FREE_COACHES: CoachId[] = ['MARCUS', 'AURORA'];

  const history = useQuery(api.coachMessages.getHistory, { limit: 100 });
  const sendWithPersona = useAction(api.coachAI.sendWithPersona);
  const greetUser = useAction(api.coachAI.greetUser);
  const setCoachMutation = useMutation(api.coachAI.setSelectedCoach);

  const coachMessages = useMemo(() => {
    if (!history) return [];
    return history.filter((m: any) => m.context?.startsWith(`coach:${selectedCoach}`));
  }, [history, selectedCoach]);

  // Auto-greet when switching to a coach with no messages
  useEffect(() => {
    if (!history || isGreeting || isSending) return;
    const msgs = history.filter((m: any) => m.context?.startsWith(`coach:${selectedCoach}`));
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
    setMessage('');
    setIsSending(true);
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
    if (!isPro && !FREE_COACHES.includes(id)) return; // blocked for free users
    setSelectedCoach(id);
    await setCoachMutation({ coachId: id }).catch(() => {});
  };

  const coach = COACHES.find((c) => c.id === selectedCoach)!;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* -- HEADER -- */}
      <div className="border-b border-zinc-900 bg-zinc-950 px-4 py-2 md:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">RESURGO :: AI_COACH</span>
          </div>
          <span className="font-mono text-[9px] tracking-widest text-zinc-400">ACTIVE: {selectedCoach}</span>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 md:flex-row md:p-6">
        {/* -- AGENT SELECTOR -- */}
        <aside className="w-full md:w-64 shrink-0 space-y-3">
          <div className="border border-zinc-900 bg-zinc-950">
            <div className="border-b border-zinc-900 px-3 py-2">
              <p className="font-mono text-[9px] tracking-widest text-zinc-400">SELECT_AGENT</p>
            </div>
            <div className="space-y-px p-1">
              {COACHES.map((c) => {
                const Icon = c.Icon;
                const isActive = c.id === selectedCoach;
                const isLocked = !isPro && !FREE_COACHES.includes(c.id);
                return (
                  <button key={c.id} onClick={() => handleSwitchCoach(c.id)}
                    className={cn('group w-full border px-3 py-2.5 text-left transition',
                      isLocked ? 'cursor-not-allowed opacity-50 border-transparent' :
                      isActive ? 'border-zinc-700 bg-zinc-900' : 'border-transparent hover:border-zinc-800 hover:bg-zinc-900/50'
                    )}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: isActive && !isLocked ? c.color : '#52525b' }} />
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[10px] font-bold tracking-widest" style={{ color: isActive && !isLocked ? c.color : '#71717a' }}>{c.name}</p>
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
                );
              })}
            </div>
          </div>

          <div className="border border-zinc-900 bg-zinc-950">
            <div className="border-b border-zinc-900 px-3 py-2">
              <p className="font-mono text-[9px] tracking-widest text-zinc-400">QUICK_PROMPTS</p>
            </div>
            <div className="space-y-px p-1">
              {QUICK_PROMPTS[selectedCoach].map((q) => (
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
          <div className="border px-4 py-3" style={{ borderColor: `${coach.color}33`, backgroundColor: `${coach.color}08` }}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{coach.avatar}</span>
              <div>
                <p className="font-mono text-xs font-bold tracking-widest" style={{ color: coach.color }}>{coach.name} � {coach.title}</p>
                <p className="font-mono text-[9px] tracking-wider text-zinc-500">{coach.domain}</p>
                <p className="mt-0.5 font-mono text-[10px] text-zinc-400">{coach.shortBio}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto border border-zinc-900 bg-black" style={{ minHeight: '280px', maxHeight: 'calc(100vh - 400px)' }}>
            <div className="space-y-px p-2">
              {coachMessages.length === 0 && !isGreeting && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="mb-3 text-4xl">{coach.avatar}</span>
                  <p className="font-mono text-[9px] tracking-widest text-zinc-400">AGENT_{coach.name}_INITIALIZING</p>
                  <p className="mt-2 font-mono text-[10px] text-zinc-400">{coach.shortBio}</p>
                </div>
              )}
              {isGreeting && coachMessages.length === 0 && (
                <div className="mr-6 border px-4 py-3" style={{ borderColor: `${coach.color}30` }}>
                  <p className="mb-1 font-mono text-[8px] tracking-widest" style={{ color: coach.color }}>AGENT_{coach.name}</p>
                  <p className="font-mono text-[11px] text-zinc-500 animate-pulse">INITIALIZING_GREETING_</p>
                </div>
              )}
              {coachMessages.map((m: any) => {
                const isCoach = m.role === 'coach';
                return (
                  <div key={m._id}
                    className={cn('border px-4 py-3', isCoach ? 'mr-6 bg-black' : 'ml-6 border-zinc-800 bg-zinc-950')}
                    style={isCoach ? { borderColor: `${coach.color}30` } : {}}>
                    <p className="mb-1 font-mono text-[8px] tracking-widest" style={isCoach ? { color: coach.color } : { color: '#52525b' }}>
                      {isCoach ? `AGENT_${coach.name}` : 'OPERATOR'}
                    </p>
                    <p className="font-mono text-[11px] leading-relaxed text-zinc-300 whitespace-pre-wrap">{m.content}</p>
                  </div>
                );
              })}
              {isSending && (
                <div className="mr-6 border px-4 py-3" style={{ borderColor: `${coach.color}30` }}>
                  <p className="mb-1 font-mono text-[8px] tracking-widest" style={{ color: coach.color }}>AGENT_{coach.name}</p>
                  <p className="font-mono text-[11px] text-zinc-500 animate-pulse">PROCESSING_</p>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-3">
            <span className="hidden font-mono text-[9px] tracking-widest text-zinc-400 md:block">TRANSMIT&gt;</span>
            <input value={message} onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${coach.name}...`} disabled={isSending}
              className="h-9 flex-1 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none disabled:opacity-50" />
            <button type="submit" disabled={isSending || !message.trim()}
              className="flex h-9 items-center gap-1.5 border px-4 font-mono text-[10px] tracking-widest transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ borderColor: `${coach.color}60`, color: coach.color, backgroundColor: `${coach.color}15` }}>
              <Send className="h-3 w-3" />
              {isSending ? 'SENDING_' : '[TRANSMIT]'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
