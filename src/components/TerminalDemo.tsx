'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Interactive Terminal Demo
// Live AI-powered mini terminal on landing page. Visitors type a goal,
// see a dramatic "scan" animation, then get a personalized micro-diagnosis.
// No auth required — uses server-side AI route.
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

type Phase = 'idle' | 'scanning' | 'complete';

interface ScanResult {
  archetype: string;
  archetypeEmoji: string;
  diagnosis: string;
  topPillar: string;
  difficulty: string;
  firstStep: string;
  confidence: number;
}

const SCAN_LINES = [
  'Initializing neural analysis engine...',
  'Parsing goal structure...',
  'Detecting behavioral patterns...',
  'Cross-referencing 47 motivation frameworks...',
  'Mapping optimal intervention points...',
  'Evaluating commitment readiness...',
  'Generating personalized protocol...',
  'Scan complete.',
];

const PLACEHOLDER_GOALS = [
  'Lose 30 pounds in 6 months',
  'Learn to code and switch careers',
  'Build a side business to $5K/mo',
  'Run a marathon by December',
  'Get into med school',
  'Fix my sleep schedule permanently',
  'Save $20K emergency fund',
  'Write and publish my first book',
];

export function TerminalDemo() {
  const [goal, setGoal] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [scanLineIdx, setScanLineIdx] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [typedPlaceholder, setTypedPlaceholder] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Typing placeholder animation
  useEffect(() => {
    if (goal || phase !== 'idle') return;
    const target = PLACEHOLDER_GOALS[placeholderIdx];
    let charIdx = 0;
    setTypedPlaceholder('');

    const typeInterval = setInterval(() => {
      if (charIdx <= target.length) {
        setTypedPlaceholder(target.slice(0, charIdx));
        charIdx++;
      } else {
        clearInterval(typeInterval);
        // Pause then move to next
        setTimeout(() => {
          setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_GOALS.length);
        }, 2000);
      }
    }, 60);

    return () => clearInterval(typeInterval);
  }, [placeholderIdx, goal, phase]);

  // Scan line animation
  useEffect(() => {
    if (phase !== 'scanning') return;
    if (scanLineIdx >= SCAN_LINES.length) return;

    const delay = scanLineIdx === SCAN_LINES.length - 1 ? 800 : 300 + Math.random() * 400;
    const timer = setTimeout(() => {
      setScanLineIdx((i) => i + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [phase, scanLineIdx]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [scanLineIdx, result]);

  const runScan = useCallback(async () => {
    if (!goal.trim() || phase === 'scanning') return;

    setPhase('scanning');
    setScanLineIdx(0);
    setResult(null);
    setError('');

    try {
      const res = await fetch('/api/terminal-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goal.trim() }),
      });

      if (!res.ok) throw new Error('Scan failed');

      const data: ScanResult = await res.json();

      // Wait for scan animation to finish
      const waitForScan = () => new Promise<void>((resolve) => {
        const check = setInterval(() => {
          // scanLineIdx is updated asynchronously, so we just wait a fixed time
          clearInterval(check);
          resolve();
        }, 100);
      });
      await waitForScan();

      // Small extra delay for dramatic effect
      await new Promise((r) => setTimeout(r, 1500));
      setResult(data);
      setPhase('complete');
    } catch {
      setError('Neural scan encountered an error. Try again.');
      setPhase('idle');
    }
  }, [goal, phase]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') runScan();
  };

  const reset = () => {
    setGoal('');
    setPhase('idle');
    setScanLineIdx(0);
    setResult(null);
    setError('');
  };

  return (
    <section className="border-t-2 border-zinc-800 bg-black px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <p className="font-pixel text-[0.6rem] tracking-widest text-orange-600">LIVE_DEMO</p>
          <h2 className="mt-3 font-pixel text-lg text-zinc-100 sm:text-xl">
            Try It Now — Enter Your Goal
          </h2>
          <p className="mt-2 font-terminal text-base text-zinc-400">
            Type any goal. Our AI will run a diagnostic scan in real time. No signup required.
          </p>
        </div>

        {/* Terminal Window */}
        <div className="border-2 border-zinc-800 bg-black shadow-[4px_4px_0px_rgba(0,0,0,0.7)]">
          {/* Title bar */}
          <div className="flex items-center justify-between border-b-2 border-zinc-800 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className={cn(
                'h-2 w-2 rounded-full',
                phase === 'scanning' ? 'animate-pulse bg-orange-500' : 'bg-green-500'
              )} />
              <span className="font-pixel text-[0.6rem] tracking-widest text-orange-500">RESURGO://DIAGNOSTIC</span>
            </div>
            <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">
              {phase === 'idle' && 'AWAITING_INPUT'}
              {phase === 'scanning' && 'SCANNING...'}
              {phase === 'complete' && 'SCAN_COMPLETE'}
            </span>
          </div>

          {/* Terminal body */}
          <div ref={terminalRef} className="min-h-[280px] max-h-[400px] overflow-y-auto p-4 font-terminal text-sm">
            {/* Welcome message */}
            <div className="mb-4">
              <p className="text-zinc-500">╔══════════════════════════════════════════╗</p>
              <p className="text-zinc-500">║ <span className="text-orange-500">RESURGO</span> Neural Goal Diagnostic v1.0    ║</p>
              <p className="text-zinc-500">║ Enter your primary goal to begin scan.   ║</p>
              <p className="text-zinc-500">╚══════════════════════════════════════════╝</p>
            </div>

            {/* Input prompt */}
            {phase === 'idle' && (
              <div className="flex items-center gap-2">
                <span className="text-orange-500">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={typedPlaceholder || 'Type your goal...'}
                  className="flex-1 border-none bg-transparent text-zinc-100 outline-none placeholder:text-zinc-600 font-terminal text-sm"
                />
                <button
                  onClick={runScan}
                  disabled={!goal.trim()}
                  className={cn(
                    'border-2 px-3 py-1 font-pixel text-[0.35rem] tracking-widest transition-all duration-100',
                    goal.trim()
                      ? 'border-orange-600 bg-orange-950/40 text-orange-500 hover:bg-orange-600 hover:text-black cursor-pointer'
                      : 'border-zinc-800 text-zinc-600 cursor-not-allowed'
                  )}
                >
                  SCAN
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-red-400 mt-2">&gt; ERROR: {error}</p>
            )}

            {/* Scanning phase */}
            {(phase === 'scanning' || phase === 'complete') && (
              <>
                <p className="text-zinc-300 mb-3">&gt; <span className="text-orange-400">{goal}</span></p>
                <div className="space-y-1">
                  {SCAN_LINES.slice(0, scanLineIdx).map((line, i) => (
                    <p key={i} className={cn(
                      'transition-opacity duration-300',
                      i === SCAN_LINES.length - 1 
                        ? 'text-green-400 font-bold' 
                        : 'text-zinc-500'
                    )}>
                      [{String(i + 1).padStart(2, '0')}/{String(SCAN_LINES.length).padStart(2, '0')}] {line}
                    </p>
                  ))}
                  {phase === 'scanning' && scanLineIdx < SCAN_LINES.length && (
                    <p className="text-orange-400 animate-pulse">
                      [{String(scanLineIdx + 1).padStart(2, '0')}/{String(SCAN_LINES.length).padStart(2, '0')}] {SCAN_LINES[scanLineIdx]}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Results */}
            {phase === 'complete' && result && (
              <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="border border-orange-900/50 bg-orange-950/20 p-4">
                  <p className="text-orange-500 font-pixel text-[0.6rem] tracking-widest mb-2">DIAGNOSTIC_RESULT</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="border border-zinc-800 bg-black p-2">
                      <p className="text-zinc-500 text-xs">Archetype</p>
                      <p className="text-orange-400 text-sm">{result.archetypeEmoji} {result.archetype}</p>
                    </div>
                    <div className="border border-zinc-800 bg-black p-2">
                      <p className="text-zinc-500 text-xs">Focus Area</p>
                      <p className="text-green-400 text-sm">{result.topPillar}</p>
                    </div>
                    <div className="border border-zinc-800 bg-black p-2">
                      <p className="text-zinc-500 text-xs">Recommended Start</p>
                      <p className="text-cyan-400 text-sm">{result.difficulty}</p>
                    </div>
                    <div className="border border-zinc-800 bg-black p-2">
                      <p className="text-zinc-500 text-xs">AI Confidence</p>
                      <p className="text-orange-400 text-sm">{result.confidence}%</p>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 pt-3">
                    <p className="text-zinc-500 text-xs mb-1">Diagnosis</p>
                    <p className="text-zinc-200 text-sm leading-relaxed">{result.diagnosis}</p>
                  </div>

                  <div className="border-t border-zinc-800 pt-3 mt-3">
                    <p className="text-zinc-500 text-xs mb-1">First Step</p>
                    <p className="text-green-300 text-sm">&gt; {result.firstStep}</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center space-y-3">
                  <p className="text-zinc-400 text-sm">
                    Sign up to get the full Deep Scan and personalized AI plan.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <a
                      href="/sign-up"
                      className="border-2 border-orange-600 bg-orange-600 px-6 py-2 font-pixel text-[0.45rem] tracking-widest text-black shadow-[2px_2px_0px_rgba(0,0,0,0.5)] transition hover:bg-orange-500 active:translate-x-[2px] active:translate-y-[2px]"
                    >
                      START FULL SCAN →
                    </a>
                    <button
                      onClick={reset}
                      className="border-2 border-zinc-800 px-4 py-2 font-pixel text-[0.6rem] tracking-widest text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition"
                    >
                      RESET
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
