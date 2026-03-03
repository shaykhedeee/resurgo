'use client';

// -------------------------------------------------------------------------------
// RESURGO — AI Coach Interface v3 (Action-Capable Terminal UI)
// Four elite AI coaches: NOVA · TITAN · SAGE · PHOENIX
// Coaches can create tasks, goals, habits, and full plans from conversation
// -------------------------------------------------------------------------------

import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Send, Zap, Dumbbell, TrendingUp, Flame, Lock, CheckCircle2, XCircle, Target, ListTodo, Repeat, Terminal, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStoreUser } from '@/hooks/useStoreUser';

type CoachId = 'TITAN' | 'SAGE' | 'PHOENIX' | 'NOVA';

interface CoachDef {
  id: CoachId;
  name: string;
  title: string;
  avatar: string;
  color: string;
  bgGlow: string;
  domain: string;
  shortBio: string;
  specialty: string;
  Icon: React.ElementType;
}

const COACHES: CoachDef[] = [
  {
    id: 'NOVA', name: 'NOVA', title: 'Systems Architect',
    avatar: '⚡', color: '#06b6d4', bgGlow: 'rgba(6,182,212,0.06)',
    domain: 'strategy · systems · execution · planning',
    shortBio: 'I think in systems, leverage points, and second-order effects. I engineer lives that don\'t need motivation.',
    specialty: 'Ask me to build plans, decompose goals, design routines, or optimize any system.',
    Icon: Zap,
  },
  {
    id: 'TITAN', name: 'TITAN', title: 'Performance Engine',
    avatar: '🔥', color: '#ef4444', bgGlow: 'rgba(239,68,68,0.06)',
    domain: 'fitness · nutrition · energy · discipline',
    shortBio: 'Your body is the foundation. Fix physical, fix everything. No negotiation with weakness.',
    specialty: 'Ask me to create workout plans, nutrition habits, energy protocols, or training schedules.',
    Icon: Dumbbell,
  },
  {
    id: 'SAGE', name: 'SAGE', title: 'Wealth Architect',
    avatar: '💎', color: '#22c55e', bgGlow: 'rgba(34,197,94,0.06)',
    domain: 'finance · wealth · career · compound growth',
    shortBio: 'Every dollar is a soldier. Every hour is an investment. Capital follows clarity.',
    specialty: 'Ask me to build financial plans, savings goals, income strategies, or career roadmaps.',
    Icon: TrendingUp,
  },
  {
    id: 'PHOENIX', name: 'PHOENIX', title: 'Resilience Forge',
    avatar: '🦅', color: '#f97316', bgGlow: 'rgba(249,115,22,0.06)',
    domain: 'resilience · recovery · mindset · comebacks',
    shortBio: 'Specialized in the space between where you are and where you want to be — especially when it feels impossible.',
    specialty: 'Ask me to build recovery plans, gentle restart routines, or micro-step momentum systems.',
    Icon: Flame,
  },
];

// ── Slash Commands ──
const SLASH_COMMANDS: { cmd: string; label: string; description: string; expand: (coach: CoachId) => string }[] = [
  { cmd: '/plan', label: '/plan', description: 'Generate a full plan for your top goal', expand: () => 'Build me a complete 30-day plan for my most important goal right now. Include phases, tasks, and milestones.' },
  { cmd: '/today', label: '/today', description: 'Create today\'s task list', expand: () => 'Look at my goals, habits, and pending tasks. Create an optimized task list for today with priorities and time blocks.' },
  { cmd: '/review', label: '/review', description: 'Weekly review & analysis', expand: () => 'Run a weekly review of my progress. Analyze my habits, goals, and completed tasks. Identify what\'s working, what\'s not, and suggest adjustments.' },
  { cmd: '/habits', label: '/habits', description: 'Design a habit stack', expand: (coach) => coach === 'TITAN' ? 'Design a complete morning and evening habit stack focused on physical performance, energy, and discipline.' : 'Design a habit stack of 3-5 keystone habits that would create the biggest compound effect for my situation.' },
  { cmd: '/motivate', label: '/motivate', description: 'Get a personalized pep talk', expand: (coach) => coach === 'PHOENIX' ? 'I need real encouragement right now. Not generic platitudes — speak to MY situation and help me find my fire again.' : 'Give me a powerful, personalized motivational message based on my current progress and goals.' },
  { cmd: '/unstuck', label: '/unstuck', description: 'Break through a block', expand: () => 'I\'m stuck and can\'t make progress. Help me identify what\'s blocking me and give me a concrete next action to break through.' },
  { cmd: '/deep-dive', label: '/deep-dive', description: 'Deep analysis of a life area', expand: () => 'Do a deep dive analysis of my overall situation. Look at my goals, habits, tasks, and streaks. What patterns do you see? What\'s the #1 thing I should change?' },
  { cmd: '/reset', label: '/reset', description: 'Fresh start protocol', expand: (coach) => coach === 'PHOENIX' ? 'I need a fresh start. Help me design a gentle restart protocol — wipe the mental slate and rebuild with micro-steps starting today.' : 'Help me reset my system. Archive stale goals, clean up tasks, and design a fresh 7-day kickstart plan.' },
];

const QUICK_PROMPTS: Record<CoachId, string[]> = {
  NOVA: [
    'Build me a complete 30-day plan for my top goal',
    'Create today\'s tasks based on my priorities',
    'Design a habit stack for peak productivity',
    'What\'s the highest leverage thing I should focus on?',
  ],
  TITAN: [
    'Create a weekly workout plan with progressive overload',
    'Build me daily nutrition and hydration habits',
    'Design my morning energy protocol as tasks',
    'I need a 90-day fitness transformation plan',
  ],
  SAGE: [
    'Build a savings goal and weekly money habits',
    'Create a 6-month career growth plan with milestones',
    'Design daily wealth-building habits I can track',
    'Help me build a side income action plan',
  ],
  PHOENIX: [
    'I\'m burnt out — build me a gentle recovery plan',
    'Create 3 micro-habits to rebuild momentum',
    'I failed at my goals — help me restart with a plan',
    'Design a self-care routine I can track daily',
  ],
};

// Parse message content: separate text from action results
function parseMessage(content: string): { text: string; actions: Array<{ success: boolean; message: string }> } {
  const actionSectionMatch = content.match(/\n\n──── ACTIONS[^\n]*────\n([\s\S]*?)$/);
  if (!actionSectionMatch) return { text: content, actions: [] };

  const text = content.substring(0, actionSectionMatch.index).trim();
  const actionLines = actionSectionMatch[1].trim().split('\n').filter(Boolean);
  const actions = actionLines.map(line => ({
    success: line.startsWith('✓'),
    message: line.replace(/^[✓✗]\s*/, ''),
  }));
  return { text, actions };
}

// Get action icon based on message content
function getActionIcon(message: string) {
  if (/goal/i.test(message)) return Target;
  if (/task/i.test(message)) return ListTodo;
  if (/habit/i.test(message)) return Repeat;
  if (/plan/i.test(message)) return Target;
  return CheckCircle2;
}

export default function CoachPage() {
  const [selectedCoach, setSelectedCoach] = useState<CoachId>('NOVA');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState('');
  const [slashSelectedIdx, setSlashSelectedIdx] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const greetedRef = useRef<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const { user } = useStoreUser();
  const isPro = user?.plan === 'pro' || user?.plan === 'lifetime';
  const FREE_COACHES: CoachId[] = ['NOVA', 'PHOENIX'];

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

    // Slash command expansion
    let expandedText = trimmed;
    const slashMatch = trimmed.match(/^\/(\S+)/);
    if (slashMatch) {
      const cmd = SLASH_COMMANDS.find(c => c.cmd === `/${slashMatch[1]}`);
      if (cmd) {
        // If user typed just the command, expand it
        // If user typed /cmd + extra text, append the extra as context
        const extra = trimmed.slice(slashMatch[0].length).trim();
        expandedText = extra ? `${cmd.expand(selectedCoach)} Context: ${extra}` : cmd.expand(selectedCoach);
      }
    }

    setMessage('');
    setShowSlashMenu(false);
    setIsSending(true);
    try {
      await sendWithPersona({ content: expandedText, coachId: selectedCoach, touchpoint: 'on_demand' });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); handleSend(message); };

  // Slash command palette logic
  const filteredSlashCommands = useMemo(() => {
    if (!showSlashMenu) return [];
    if (!slashFilter) return SLASH_COMMANDS;
    return SLASH_COMMANDS.filter(c =>
      c.cmd.includes(slashFilter.toLowerCase()) || c.description.toLowerCase().includes(slashFilter.toLowerCase())
    );
  }, [showSlashMenu, slashFilter]);

  const handleInputChange = (val: string) => {
    setMessage(val);
    if (val.startsWith('/')) {
      setShowSlashMenu(true);
      setSlashFilter(val.slice(1).split(' ')[0]);
      setSlashSelectedIdx(0);
    } else {
      setShowSlashMenu(false);
      setSlashFilter('');
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSlashMenu || filteredSlashCommands.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSlashSelectedIdx(i => Math.min(i + 1, filteredSlashCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSlashSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Tab' || (e.key === 'Enter' && showSlashMenu)) {
      e.preventDefault();
      const cmd = filteredSlashCommands[slashSelectedIdx];
      if (cmd) {
        setMessage(cmd.cmd + ' ');
        setShowSlashMenu(false);
        inputRef.current?.focus();
      }
    } else if (e.key === 'Escape') {
      setShowSlashMenu(false);
    }
  };

  const handleSwitchCoach = async (id: CoachId) => {
    if (!isPro && !FREE_COACHES.includes(id)) return;
    setSelectedCoach(id);
    await setCoachMutation({ coachId: id }).catch(() => {});
  };

  const coach = COACHES.find((c) => c.id === selectedCoach)!;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* -- HEADER -- */}
      <div className="border-b border-zinc-900 bg-zinc-950 px-4 py-2 md:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">RESURGO :: AI_COMMAND_CENTER</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[8px] tracking-widest text-zinc-600">ACTION-CAPABLE</span>
            <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[9px] tracking-widest text-zinc-400">ACTIVE: {selectedCoach}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 md:flex-row md:p-6">
        {/* -- AGENT SELECTOR -- */}
        <aside className="w-full md:w-72 shrink-0 space-y-3">
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
                    className={cn('group w-full border px-3 py-3 text-left transition',
                      isLocked ? 'cursor-not-allowed opacity-50 border-transparent' :
                      isActive ? 'border-zinc-700 bg-zinc-900' : 'border-transparent hover:border-zinc-800 hover:bg-zinc-900/50'
                    )}>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded border"
                        style={{
                          borderColor: isActive && !isLocked ? `${c.color}60` : '#27272a',
                          backgroundColor: isActive && !isLocked ? `${c.color}15` : 'transparent',
                        }}>
                        <Icon className="h-4 w-4 shrink-0" style={{ color: isActive && !isLocked ? c.color : '#52525b' }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="font-mono text-[10px] font-bold tracking-widest" style={{ color: isActive && !isLocked ? c.color : '#71717a' }}>{c.name}</p>
                          {isActive && !isLocked && <span className="h-1 w-1 rounded-full animate-pulse" style={{ backgroundColor: c.color }} />}
                        </div>
                        <p className="truncate font-mono text-[8px] tracking-wider text-zinc-500">{c.title}</p>
                      </div>
                      {isLocked && <Lock className="h-3 w-3 shrink-0 text-zinc-600" />}
                    </div>
                    {isLocked && (
                      <p className="mt-1.5 ml-10 font-mono text-[7px] tracking-widest text-amber-600/70">PRO ONLY</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick prompts */}
          <div className="border border-zinc-900 bg-zinc-950">
            <div className="border-b border-zinc-900 px-3 py-2">
              <p className="font-mono text-[9px] tracking-widest text-zinc-400">QUICK_COMMANDS</p>
            </div>
            <div className="space-y-px p-1">
              {QUICK_PROMPTS[selectedCoach].map((q) => (
                <button key={q} onClick={() => handleSend(q)} disabled={isSending}
                  className="w-full border border-transparent px-3 py-2 text-left font-mono text-[9px] leading-relaxed tracking-wider text-zinc-500 transition hover:border-zinc-800 hover:text-zinc-300 disabled:opacity-40">
                  <span className="text-zinc-600">{'>'}</span> {q}
                </button>
              ))}
            </div>
          </div>

          {/* Slash commands reference */}
          <div className="border border-zinc-900 bg-zinc-950">
            <div className="border-b border-zinc-900 px-3 py-2 flex items-center gap-2">
              <Terminal className="h-3 w-3 text-zinc-500" />
              <p className="font-mono text-[9px] tracking-widest text-zinc-400">SLASH_COMMANDS</p>
            </div>
            <div className="space-y-px p-1">
              {SLASH_COMMANDS.map((cmd) => (
                <button key={cmd.cmd} onClick={() => { setMessage(cmd.cmd + ' '); inputRef.current?.focus(); }} disabled={isSending}
                  className="w-full flex items-center gap-2 border border-transparent px-3 py-1.5 text-left transition hover:border-zinc-800 disabled:opacity-40 group">
                  <span className="font-mono text-[10px] tracking-wider text-orange-600/70 group-hover:text-orange-500">{cmd.label}</span>
                  <span className="flex-1 truncate font-mono text-[8px] tracking-wider text-zinc-600 group-hover:text-zinc-400">{cmd.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Capability badge */}
          <div className="border border-zinc-900 bg-zinc-950 p-3">
            <p className="font-mono text-[8px] tracking-widest text-zinc-600 mb-2">CAPABILITIES</p>
            <div className="space-y-1.5">
              {[
                { icon: Target, label: 'Create goals & plans' },
                { icon: ListTodo, label: 'Add & manage tasks' },
                { icon: Repeat, label: 'Build habit systems' },
                { icon: CheckCircle2, label: 'Complete & update tasks' },
              ].map(({ icon: CIcon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <CIcon className="h-3 w-3 text-zinc-700" />
                  <span className="font-mono text-[8px] tracking-wider text-zinc-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* -- CHAT TERMINAL -- */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* Coach card */}
          <div className="border px-4 py-3" style={{ borderColor: `${coach.color}33`, backgroundColor: coach.bgGlow }}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded border text-2xl"
                style={{ borderColor: `${coach.color}40`, backgroundColor: `${coach.color}10` }}>
                {coach.avatar}
              </div>
              <div className="flex-1">
                <p className="font-mono text-xs font-bold tracking-widest" style={{ color: coach.color }}>{coach.name} — {coach.title}</p>
                <p className="font-mono text-[9px] tracking-wider text-zinc-500">{coach.domain}</p>
                <p className="mt-0.5 font-mono text-[10px] text-zinc-400">{coach.shortBio}</p>
                <p className="mt-0.5 font-mono text-[8px] tracking-wider text-zinc-600 italic">{coach.specialty}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto border border-zinc-900 bg-black" style={{ minHeight: '320px', maxHeight: 'calc(100vh - 420px)' }}>
            <div className="space-y-1 p-2">
              {coachMessages.length === 0 && !isGreeting && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="mb-3 text-5xl">{coach.avatar}</span>
                  <p className="font-mono text-[10px] tracking-widest" style={{ color: coach.color }}>AGENT_{coach.name}_READY</p>
                  <p className="mt-2 max-w-md font-mono text-[10px] text-zinc-500">{coach.shortBio}</p>
                  <p className="mt-1 font-mono text-[8px] text-zinc-600 italic">{coach.specialty}</p>
                </div>
              )}
              {isGreeting && coachMessages.length === 0 && (
                <div className="mr-6 border px-4 py-3" style={{ borderColor: `${coach.color}30` }}>
                  <p className="mb-1 font-mono text-[8px] tracking-widest" style={{ color: coach.color }}>AGENT_{coach.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: coach.color }} />
                    <p className="font-mono text-[11px] text-zinc-500 animate-pulse">INITIALIZING_</p>
                  </div>
                </div>
              )}
              {coachMessages.map((m: any) => {
                const isCoach = m.role === 'coach';
                const { text, actions } = isCoach ? parseMessage(m.content) : { text: m.content, actions: [] };

                return (
                  <div key={m._id} className="space-y-1">
                    {/* Message bubble */}
                    <div
                      className={cn('border px-4 py-3', isCoach ? 'mr-6 bg-black' : 'ml-6 border-zinc-800 bg-zinc-950')}
                      style={isCoach ? { borderColor: `${coach.color}25` } : {}}>
                      <p className="mb-1 font-mono text-[8px] tracking-widest" style={isCoach ? { color: coach.color } : { color: '#52525b' }}>
                        {isCoach ? `AGENT_${coach.name}` : 'YOU'}
                      </p>
                      <p className="font-mono text-[11px] leading-relaxed text-zinc-300 whitespace-pre-wrap">{text}</p>
                    </div>

                    {/* Action results */}
                    {actions.length > 0 && (
                      <div className="mr-6 border px-3 py-2 space-y-1" style={{ borderColor: `${coach.color}15`, backgroundColor: `${coach.color}05` }}>
                        <p className="font-mono text-[7px] tracking-widest text-zinc-500">ACTIONS_EXECUTED</p>
                        {actions.map((a, i) => {
                          const AIcon = a.success ? getActionIcon(a.message) : XCircle;
                          return (
                            <div key={i} className="flex items-center gap-2">
                              <AIcon className={cn('h-3 w-3 shrink-0', a.success ? 'text-emerald-500' : 'text-red-500')} />
                              <span className={cn('font-mono text-[9px] tracking-wider', a.success ? 'text-emerald-400' : 'text-red-400')}>
                                {a.message}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {isSending && (
                <div className="mr-6 border px-4 py-3" style={{ borderColor: `${coach.color}30` }}>
                  <p className="mb-1 font-mono text-[8px] tracking-widest" style={{ color: coach.color }}>AGENT_{coach.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: coach.color }} />
                    <p className="font-mono text-[11px] text-zinc-500 animate-pulse">PROCESSING_</p>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input */}
          <div className="relative">
            {/* Slash command palette */}
            {showSlashMenu && filteredSlashCommands.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-1 border border-zinc-800 bg-zinc-950 shadow-lg shadow-black/50 z-50 max-h-64 overflow-y-auto">
                <div className="border-b border-zinc-900 px-3 py-1.5 flex items-center gap-2">
                  <Command className="h-3 w-3 text-zinc-500" />
                  <span className="font-mono text-[8px] tracking-widest text-zinc-500">SLASH_COMMANDS</span>
                  <span className="ml-auto font-mono text-[7px] text-zinc-700">TAB to select · ESC to close</span>
                </div>
                {filteredSlashCommands.map((cmd, idx) => (
                  <button key={cmd.cmd}
                    onMouseDown={(e) => { e.preventDefault(); setMessage(cmd.cmd + ' '); setShowSlashMenu(false); inputRef.current?.focus(); }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 text-left transition',
                      idx === slashSelectedIdx ? 'bg-zinc-900 border-l-2' : 'border-l-2 border-transparent hover:bg-zinc-900/50',
                    )}
                    style={idx === slashSelectedIdx ? { borderColor: coach.color } : {}}>
                    <Terminal className="h-3.5 w-3.5 shrink-0" style={{ color: idx === slashSelectedIdx ? coach.color : '#52525b' }} />
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[10px] tracking-wider" style={{ color: idx === slashSelectedIdx ? coach.color : '#a1a1aa' }}>{cmd.label}</p>
                      <p className="font-mono text-[8px] tracking-wider text-zinc-600 truncate">{cmd.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-3">
              <span className="hidden font-mono text-[9px] tracking-widest text-zinc-500 md:block">{'>'}</span>
              <input ref={inputRef} value={message} onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={`Type / for commands or ask ${coach.name} anything...`}
                disabled={isSending}
                className="h-9 flex-1 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none disabled:opacity-50" />
              <button type="submit" disabled={isSending || !message.trim()}
                className="flex h-9 items-center gap-1.5 border px-4 font-mono text-[10px] tracking-widest transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ borderColor: `${coach.color}60`, color: coach.color, backgroundColor: `${coach.color}15` }}>
                <Send className="h-3 w-3" />
                {isSending ? 'SENDING_' : 'SEND'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
