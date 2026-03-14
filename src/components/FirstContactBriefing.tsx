'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — First Contact Briefing
// The personalized welcome screen after Deep Scan Protocol completion
// Uses the AI Orchestrator to generate a multi-faceted greeting
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────

interface BriefingSections {
  psychProfile: string;
  strengths: string;
  protocol: string;
  greeting: string;
}

interface FirstContactData {
  greeting: string;
  fullBriefing: string;
  sections: BriefingSections;
  stats: {
    providersUsed: string[];
    totalDurationMs: number;
    totalTokens: number;
  };
}

type Phase = 'loading' | 'scanning' | 'generating' | 'reveal' | 'complete';

const SCAN_LINES = [
  '> Establishing neural link...',
  '> Loading Deep Scan results...',
  '> Synchronizing behavioral profile...',
  '> Calibrating AI personality match...',
  '> Preparing First Contact briefing...',
];

const GEN_LINES = [
  '[1/4] Analyzing psychological profile...',
  '[2/4] Mapping strength signatures...',
  '[3/4] Generating personalized protocol...',
  '[4/4] Composing welcome briefing...',
];

// ═══════════════════════════════════════════════════════════════════════════════

export function FirstContactBriefing() {
  const router = useRouter();
  const scan = useQuery(api.deepScan.getCurrent);
  const existingGreeting = useQuery(api.aiGreetings.getGreeting);
  const saveGreeting = useMutation(api.aiGreetings.saveGreeting);
  const markViewed = useMutation(api.aiGreetings.markViewed);

  const [phase, setPhase] = useState<Phase>('loading');
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [briefing, setBriefing] = useState<FirstContactData | null>(null);
  const [activeSection, setActiveSection] = useState<keyof BriefingSections | 'full'>('greeting');
  const [revealProgress, setRevealProgress] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const addLine = useCallback((line: string) => {
    setTerminalLines((prev) => [...prev, line]);
  }, []);

  const typeLines = useCallback(
    async (lines: string[], delay = 500) => {
      for (const line of lines) {
        addLine(line);
        await new Promise((r) => setTimeout(r, delay + Math.random() * 300));
      }
    },
    [addLine]
  );

  // Check for existing greeting or generate new one
  useEffect(() => {
    if (scan === undefined || existingGreeting === undefined) return; // Still loading

    // If no deep scan at all (e.g. came from simple onboarding), fall through to greeting check
    if (!scan) {
      // Show greeting if one exists
      if (existingGreeting && !existingGreeting.viewed) {
        setBriefing({
          greeting: existingGreeting.greeting,
          fullBriefing: existingGreeting.systemPlan ?? existingGreeting.greeting,
          sections: { psychProfile: '', strengths: '', protocol: existingGreeting.systemPlan ?? '', greeting: existingGreeting.greeting },
          stats: { providersUsed: [], totalDurationMs: 0, totalTokens: 0 },
        });
        setPhase('reveal');
        return;
      }
      // No scan, no greeting — skip to dashboard
      router.push('/dashboard');
      return;
    }

    // If scan started but not completed, redirect back to finish it
    if (!scan.completedAt) {
      router.push('/deep-scan');
      return;
    }

    // If greeting already exists, show it
    if (existingGreeting && !existingGreeting.viewed) {
      setBriefing({
        greeting: existingGreeting.greeting,
        fullBriefing: existingGreeting.systemPlan ?? existingGreeting.greeting,
        sections: {
          psychProfile: '',
          strengths: '',
          protocol: existingGreeting.systemPlan ?? '',
          greeting: existingGreeting.greeting,
        },
        stats: { providersUsed: [], totalDurationMs: 0, totalTokens: 0 },
      });
      setPhase('reveal');
      return;
    }

    if (existingGreeting && existingGreeting.viewed) {
      // Already seen — go to dashboard
      router.push('/dashboard');
      return;
    }

    // No greeting yet — generate one
    if (!hasGenerated) {
      setHasGenerated(true);
      generateBriefing(scan);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scan, existingGreeting, hasGenerated]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generateBriefing = async (scanData: any) => {
    setPhase('scanning');
    addLine('═══ RESURGO FIRST CONTACT ═══');
    addLine('');
    await typeLines(SCAN_LINES, 400);

    setPhase('generating');
    addLine('');
    addLine('── MULTI-AI ORCHESTRATION ──');
    await typeLines(GEN_LINES, 800);

    try {
      addLine('');
      addLine('> Dispatching to orchestration engine...');

      const res = await fetch('/api/first-contact/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanData }),
      });

      const data: FirstContactData = await res.json();

      addLine(`> ${data.stats.providersUsed.length} AI providers collaborated`);
      addLine(`> ${data.stats.totalTokens} tokens processed in ${(data.stats.totalDurationMs / 1000).toFixed(1)}s`);
      addLine('');
      addLine('> BRIEFING READY.');
      addLine('═══════════════════════════');

      setBriefing(data);

      // Save to Convex
      try {
        const recommendations = data.sections?.protocol
          ? [{
            title: 'Your Protocol',
            description: data.sections.protocol.slice(0, 300),
            action: '/dashboard',
            priority: 1,
          }]
          : [];

        await saveGreeting({
          greeting: data.greeting,
          systemPlan: data.fullBriefing,
          recommendations,
        });
      } catch {
        console.warn('[FirstContact] Failed to save greeting to Convex');
      }

      // Reveal animation
      await new Promise((r) => setTimeout(r, 1000));
      setPhase('reveal');
    } catch (err) {
      console.error('[FirstContact] Generation failed:', err);
      addLine('> Generation failed. Using fallback briefing.');

      const fallback: FirstContactData = {
        greeting: `Welcome to Resurgo${scanData.nickname ? `, ${scanData.nickname}` : ''}. Your system is calibrated and ready.`,
        fullBriefing: 'Your personalized protocol is active. Head to your dashboard to begin.',
        sections: {
          psychProfile: '',
          strengths: 'Your commitment to starting is already a strength.',
          protocol: 'Start with one small action today.',
          greeting: 'Welcome to Resurgo. Your journey begins now.',
        },
        stats: { providersUsed: [], totalDurationMs: 0, totalTokens: 0 },
      };
      setBriefing(fallback);
      await new Promise((r) => setTimeout(r, 1000));
      setPhase('reveal');
    }
  };

  // Reveal animation — progressive text reveal
  useEffect(() => {
    if (phase !== 'reveal' || !briefing) return;
    const totalChars = briefing.greeting.length;
    if (revealProgress >= totalChars) {
      setPhase('complete');
      return;
    }
    const speed = revealProgress < 20 ? 60 : 20; // Slower start, then fast
    const timer = setTimeout(() => setRevealProgress((p) => Math.min(p + 1, totalChars)), speed);
    return () => clearTimeout(timer);
  }, [phase, revealProgress, briefing]);

  const handleContinue = async () => {
    if (existingGreeting) {
      try {
        await markViewed({ greetingId: existingGreeting._id });
      } catch {
        // ok
      }
    }
    router.push('/dashboard');
  };

  // ─── Render ───

  if (phase === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 bg-orange-600 animate-pulse" />
          <span className="font-pixel text-[0.6rem] tracking-widest text-zinc-500">LOADING DEEP SCAN DATA...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Terminal phase */}
      {(phase === 'scanning' || phase === 'generating') && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            <div className="border-2 border-zinc-800 bg-black">
              <div className="border-b border-zinc-800 px-4 py-2 flex items-center gap-2">
                <div className="h-2 w-2 bg-orange-500 animate-pulse rounded-full" />
                <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">FIRST CONTACT PROTOCOL</span>
              </div>
              <div ref={terminalRef} className="p-4 max-h-80 overflow-y-auto">
                {terminalLines.map((line, i) => (
                  <p
                    key={i}
                    className={cn(
                      'font-terminal text-sm leading-relaxed',
                      line.startsWith('═') ? 'text-orange-500 font-bold' :
                      line.startsWith('──') ? 'text-zinc-500' :
                      line.includes('READY') ? 'text-green-400 font-bold' :
                      line.startsWith('[') ? 'text-cyan-400' :
                      'text-zinc-400'
                    )}
                  >
                    {line || '\u00A0'}
                  </p>
                ))}
                <span className="inline-block w-2 h-4 bg-orange-500 animate-pulse" />
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-4 h-1 w-full bg-zinc-900">
              <div
                className="h-full bg-orange-600 transition-all duration-1000"
                style={{
                  width: phase === 'scanning' ? '30%' : phase === 'generating' ? '80%' : '100%',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Reveal phase */}
      {(phase === 'reveal' || phase === 'complete') && briefing && (
        <div className="flex-1 flex flex-col items-center px-4 py-8 md:py-12">
          <div className="w-full max-w-3xl space-y-8">
            {/* Main greeting */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 border border-orange-900 bg-orange-950/20 px-4 py-2">
                <div className="h-2 w-2 bg-orange-600" />
                <span className="font-pixel text-[0.35rem] tracking-widest text-orange-600">FIRST CONTACT</span>
              </div>

              <div className="border-2 border-zinc-800 bg-black p-8 md:p-12">
                <p className="font-terminal text-lg md:text-xl text-zinc-100 leading-relaxed">
                  {phase === 'reveal'
                    ? briefing.greeting.slice(0, revealProgress)
                    : briefing.greeting}
                  {phase === 'reveal' && (
                    <span className="inline-block w-2 h-5 bg-orange-500 animate-pulse ml-0.5" />
                  )}
                </p>
              </div>
            </div>

            {/* Section tabs — only after reveal is complete */}
            {phase === 'complete' && (
              <>
                <div className="flex flex-wrap gap-2 justify-center">
                  {([
                    ['greeting', 'Welcome', '🎯'],
                    ['psychProfile', 'Profile', '🧠'],
                    ['strengths', 'Strengths', '💪'],
                    ['protocol', 'Protocol', '📋'],
                    ['full', 'Full Briefing', '📄'],
                  ] as const).map(([key, label, icon]) => {
                    const hasContent = key === 'full' ? !!briefing.fullBriefing : !!briefing.sections[key as keyof BriefingSections];
                    if (!hasContent && key !== 'greeting') return null;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveSection(key)}
                        className={cn(
                          'border px-3 py-2 font-pixel text-[0.35rem] tracking-widest transition',
                          activeSection === key
                            ? 'border-orange-600 bg-orange-600/10 text-orange-500'
                            : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                        )}
                      >
                        {icon} {label}
                      </button>
                    );
                  })}
                </div>

                {/* Section content */}
                <div className="border-2 border-zinc-800 bg-black">
                  <div className="border-b border-zinc-800 px-4 py-2">
                    <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">
                      {activeSection === 'full' ? 'FULL BRIEFING' : activeSection.toUpperCase()}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="font-terminal text-base text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {activeSection === 'full'
                        ? briefing.fullBriefing
                        : activeSection === 'greeting'
                          ? briefing.greeting
                          : briefing.sections[activeSection as keyof BriefingSections]
                            || 'This section is being generated...'}
                    </div>
                  </div>
                </div>

                {/* Stats bar */}
                {briefing.stats.providersUsed.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="font-pixel text-[0.55rem] tracking-widest text-zinc-600 px-2 py-1">
                      POWERED BY {briefing.stats.providersUsed.length} AI{briefing.stats.providersUsed.length > 1 ? 's' : ''}
                    </span>
                    {briefing.stats.providersUsed.map((p) => (
                      <span key={p} className="font-pixel text-[0.55rem] tracking-widest text-zinc-600 border border-zinc-900 px-2 py-1">
                        {p.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Continue button */}
                <div className="text-center">
                  <button
                    onClick={handleContinue}
                    className="border-2 border-orange-600 bg-orange-600 px-8 py-4 font-pixel text-[0.65rem] tracking-widest text-black shadow-[4px_4px_0px_rgba(0,0,0,0.8)] transition-all hover:bg-orange-500 active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    ENTER COMMAND CENTER →
                  </button>
                  <p className="mt-3 font-terminal text-sm text-zinc-600">
                    Your personalized dashboard awaits
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
