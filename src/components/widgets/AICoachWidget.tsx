'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Interactive AI Coach Synapse Monitor (Dashboard)
// Real-time tabbed AI coach chat terminal right on the dashboard!
// Synchronizes with Convex action sendWithPersona to persist logs.
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery, useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Brain, ArrowRight, Sparkles, Send, Terminal, Loader2 } from 'lucide-react';
import Link from 'next/link';

type CoachId = 'NOVA' | 'AURORA' | 'TITAN';

interface CoachConfig {
  id: CoachId;
  name: string;
  avatar: string;
  color: string;
  glowColor: string;
  accentBg: string;
  borderColor: string;
  domain: string;
}

const COACH_CONFIGS: Record<CoachId, CoachConfig> = {
  NOVA: {
    id: 'NOVA',
    name: 'MARCUS',
    avatar: '🏛',
    color: '#ca8a04', // Stoic Yellow
    glowColor: 'rgba(202,138,4,0.15)',
    accentBg: 'bg-yellow-950/20',
    borderColor: 'border-yellow-800/40',
    domain: 'Stoic Execution & Goals',
  },
  AURORA: {
    id: 'AURORA',
    name: 'SAGE',
    avatar: '🌿',
    color: '#10b981', // Recovery Emerald Green
    glowColor: 'rgba(16,185,129,0.15)',
    accentBg: 'bg-emerald-950/20',
    borderColor: 'border-emerald-800/40',
    domain: 'Mindfulness & Energy',
  },
  TITAN: {
    id: 'TITAN',
    name: 'TITAN',
    avatar: '⚡',
    color: '#3b82f6', // Performance Blue
    glowColor: 'rgba(59,130,246,0.15)',
    accentBg: 'bg-blue-950/20',
    borderColor: 'border-blue-800/40',
    domain: 'Finance & Metric Velocity',
  },
};

const TIPS: string[] = [
  "Start with the smallest task today to build Stoic momentum. Willpower compounds.",
  "Your energy peaks in the morning. Schedule your highest impact focus blocks early.",
  "Missed a habit? It is just data. Decay the momentum score; do not shame reset.",
  "Protect rest cycles. Energy recovery is the baseline of operational velocity.",
  "Match your discretionary budget to daily small habits. Restraint is power.",
];

export default function AICoachWidget() {
  const [selectedCoach, setSelectedCoach] = useState<CoachId>('NOVA');
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const synergyData = useQuery(api.coachAI.getDailySynergyDetails);
  const getInsights = useAction(api.coachAI.getDailySynergyInsights);
  const history = useQuery(api.coachMessages.getHistory, { limit: 50 });
  const sendWithPersona = useAction(api.coachAI.sendWithPersona);

  // Fetch daily synergy insights
  useEffect(() => {
    if (synergyData && insights.length === 0 && !loadingInsights) {
      setLoadingInsights(true);
      getInsights()
        .then((res) => {
          if (res?.insights) {
            setInsights(res.insights);
          }
        })
        .catch((err) => {
          console.error("Error loading daily synergy insights:", err);
        })
        .finally(() => {
          setLoadingInsights(false);
        });
    }
  }, [synergyData, insights.length, loadingInsights, getInsights]);

  // Extract message history for the selected coach
  const coachMessages = useMemo(() => {
    if (!history) return [];
    return history
      .filter((m) => m.context?.startsWith(`coach:${selectedCoach}`))
      .slice(-3); // limit to last 3 for beautiful dashboard density
  }, [history, selectedCoach]);

  // Get active coach configuration
  const activeCoach = COACH_CONFIGS[selectedCoach];

  // Map selected coach to its corresponding daily advice insight
  const activeDirective = useMemo(() => {
    const coachNameMapped = selectedCoach === 'NOVA' ? 'MARCUS' : selectedCoach === 'AURORA' ? 'SAGE' : 'TITAN';
    const ins = insights.find(i => i.coachId.toUpperCase() === coachNameMapped);
    return ins ? ins.advice : TIPS[selectedCoach === 'NOVA' ? 0 : selectedCoach === 'AURORA' ? 3 : 4];
  }, [insights, selectedCoach]);

  // Auto-scroll messages to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [coachMessages, isSending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed || isSending) return;

    setInputMessage('');
    setIsSending(true);
    try {
      await sendWithPersona({
        content: trimmed,
        coachId: selectedCoach,
        touchpoint: 'on_demand',
      });
    } catch (err) {
      console.error("Failed to execute synapse chat:", err);
    } finally {
      setIsSending(false);
    }
  };

  const deepLinkUrl = `/coach?coach=${selectedCoach}&initQuery=${encodeURIComponent(
    `Regarding today's directive: "${activeDirective}". Let's discuss how to execute it.`
  )}`;

  return (
    <div 
      className="border border-zinc-900 bg-zinc-950 transition-all duration-300 hover:border-zinc-800"
      style={{
        boxShadow: `0 0 15px ${activeCoach.glowColor}`,
        borderColor: activeCoach.color + '22'
      }}
    >
      {/* Title Bar */}
      <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
        <Terminal className="h-3.5 w-3.5 animate-pulse" style={{ color: activeCoach.color }} />
        <span className="font-pixel text-[0.6rem] tracking-widest text-zinc-400">AI_SYNAPSE_MONITOR</span>
        <span 
          className="ml-auto border px-2 py-0.5 font-pixel text-[0.5rem] tracking-widest transition-colors duration-300"
          style={{ 
            borderColor: activeCoach.color + '44', 
            color: activeCoach.color,
            backgroundColor: activeCoach.color + '11'
          }}
        >
          {activeCoach.name} ACTIVE
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Dynamic Brutalist Coach Selector Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(COACH_CONFIGS) as CoachId[]).map((key) => {
            const config = COACH_CONFIGS[key];
            const isActive = selectedCoach === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedCoach(key)}
                className="flex items-center justify-center gap-1 border py-1.5 font-terminal text-[0.65rem] tracking-widest transition-all duration-200"
                style={{
                  borderColor: isActive ? config.color : '#1f1f2e',
                  color: isActive ? config.color : '#71717a',
                  backgroundColor: isActive ? config.color + '15' : 'transparent',
                }}
              >
                <span>{config.avatar}</span>
                <span>{config.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Coach System Directive */}
        <div className={`border p-3 space-y-1.5 transition-all duration-300 ${activeCoach.borderColor} ${activeCoach.accentBg}`}>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: activeCoach.color }} />
            <span className="font-pixel text-[0.45rem] tracking-wider text-zinc-400">SYSTEM DIRECTIVE</span>
          </div>
          <p className="font-terminal text-[0.65rem] leading-relaxed text-zinc-200">
            {loadingInsights ? (
              <span className="flex items-center gap-1.5 text-zinc-500">
                <Loader2 className="h-3 w-3 animate-spin" /> Fetching latest insights...
              </span>
            ) : (
              activeDirective
            )}
          </p>
        </div>

        {/* Real-time Mini Monospace Message Logs */}
        <div className="border border-zinc-900 bg-black/60 p-2.5 space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
            <span className="font-pixel text-[0.45rem] tracking-widest text-zinc-500">SYNAPSE LOGS</span>
            <span className="font-mono text-[8px] text-zinc-600">CONNECTED</span>
          </div>

          <div 
            ref={scrollRef}
            className="h-[100px] overflow-y-auto space-y-2.5 font-terminal text-[0.65rem] leading-normal scrollbar-thin scrollbar-thumb-zinc-800 pr-1.5"
          >
            {coachMessages.length === 0 && !isSending && (
              <div className="h-full flex items-center justify-center text-center text-zinc-600 font-mono text-[9px] uppercase tracking-wider">
                No active session logs. Type below to initiate synapse command.
              </div>
            )}

            {coachMessages.map((msg, index) => {
              const isCoach = msg.role === 'coach';
              return (
                <div key={msg._id ?? index} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[0.55rem] font-bold">
                    <span style={{ color: isCoach ? activeCoach.color : '#a1a1aa' }}>
                      {isCoach ? activeCoach.name : 'YOU'} &gt;
                    </span>
                    <span className="text-zinc-600 text-[0.45rem]">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-zinc-300 bg-zinc-950/40 p-1 border border-zinc-900/40 rounded-sm">
                    {msg.content}
                  </p>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-center gap-1.5 text-zinc-500 font-mono italic animate-pulse">
                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                <span>Decrypting {activeCoach.name} response signals...</span>
              </div>
            )}
          </div>
        </div>

        {/* Monospace Interactive Mini Terminal Prompt Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 flex items-center border border-zinc-900 bg-black px-2.5 focus-within:border-zinc-700 transition">
            <span className="font-terminal text-[0.65rem] tracking-wider shrink-0 mr-1.5" style={{ color: activeCoach.color }}>
              {activeCoach.name} &gt;
            </span>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Inject command..."
              disabled={isSending}
              className="h-8 w-full bg-transparent font-terminal text-[0.65rem] text-zinc-200 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isSending || !inputMessage.trim()}
            className="flex items-center justify-center px-4 border font-pixel text-[0.5rem] tracking-widest transition duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              borderColor: activeCoach.color + '60',
              color: activeCoach.color,
              backgroundColor: activeCoach.color + '11',
            }}
          >
            <Send className="h-3 w-3 shrink-0" />
          </button>
        </form>

        {/* Link to Full Coach Terminal */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
          <span className="font-terminal text-[0.55rem] text-zinc-600">PORT: 8080/UDP</span>
          <Link
            href={deepLinkUrl}
            className="flex items-center gap-1 font-pixel text-[0.45rem] tracking-widest text-zinc-500 transition hover:text-orange-400"
          >
            [DECODE IN FULL TERMINAL]
            <ArrowRight className="h-2.5 w-2.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
