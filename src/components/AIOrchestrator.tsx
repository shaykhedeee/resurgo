'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — AI Orchestrator Panel
// Multi-provider prompt decomposition UI
// Shows real-time sub-task progress, provider assignments, and merged result
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────

interface SubTaskInfo {
  id: string;
  title: string;
  type: string;
  provider: string;
  model: string;
  durationMs: number;
  tokensUsed?: number;
  error?: string;
  content: string;
}

interface OrchestrateResponse {
  response: string;
  stats: {
    totalDurationMs: number;
    providersUsed: string[];
    totalTokens: number;
    subTaskCount: number;
    decompositionMethod: 'auto' | 'manual';
  };
  subTasks?: SubTaskInfo[];
}

type Phase = 'idle' | 'decomposing' | 'executing' | 'synthesizing' | 'complete' | 'error';

const PROVIDER_COLORS: Record<string, string> = {
  ollama: 'text-violet-400',
  groq: 'text-green-400',
  cerebras: 'text-cyan-400',
  gemini: 'text-blue-400',
  openrouter: 'text-yellow-400',
  together: 'text-amber-400',
  aiml: 'text-pink-400',
  openai: 'text-emerald-400',
};

const TASK_TYPE_ICONS: Record<string, string> = {
  analysis: '🔬',
  creative: '🎨',
  extraction: '📊',
  planning: '📋',
  research: '🔍',
  emotional: '💛',
  technical: '⚙️',
  synthesis: '🧬',
};

const EXAMPLE_PROMPTS = [
  {
    label: 'Life Strategy',
    prompt:
      "I'm a 28-year-old software developer feeling burned out. I want to transition into a more fulfilling career while maintaining financial stability. I also want to improve my physical health and build better relationships. Create a comprehensive 90-day transformation plan.",
  },
  {
    label: 'Goal Breakdown',
    prompt:
      'I want to run a marathon in 6 months. I currently run 2 miles 3x/week. I also want to lose 20 pounds and improve my mental clarity. Break this down into a complete, actionable system.',
  },
  {
    label: 'Habit Analysis',
    prompt:
      'Analyze why I keep failing at building morning routines. I\'ve tried waking up at 5am, meditation, journaling — nothing sticks past 2 weeks. I\'m a night owl, work from home, and tend to doomscroll before bed. What\'s really going on and how do I fix it?',
  },
  {
    label: 'Business Plan',
    prompt:
      'I want to build a SaaS product for freelancers that helps them manage clients, invoices, and time tracking. I have $5k savings, can code in React/Node, and have 20 hours/week. Create a complete launch strategy including MVP scope, marketing, pricing, and growth plan.',
  },
];

// ─── Simulated Phase Lines ──────────────────────────────────────────────────

const DECOMPOSE_LINES = [
  '> Analyzing prompt complexity...',
  '> Identifying knowledge domains...',
  '> Mapping dependency graph...',
  '> Assigning sub-task types...',
  '> Selecting optimal providers...',
];

const EXECUTE_LINES = [
  '> Dispatching to providers in parallel...',
  '> Awaiting provider responses...',
];

const SYNTH_LINES = [
  '> Merging sub-task outputs...',
  '> Resolving contradictions...',
  '> Structuring final response...',
  '> Polishing output...',
];

// ═══════════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════════

export function AIOrchestrator() {
  const [prompt, setPrompt] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [result, setResult] = useState<OrchestrateResponse | null>(null);
  const [showSubTasks, setShowSubTasks] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const addLine = useCallback((line: string) => {
    setTerminalLines((prev) => [...prev, line]);
  }, []);

  const simulateLines = useCallback(
    async (lines: string[], delay = 400) => {
      for (const line of lines) {
        addLine(line);
        await new Promise((r) => setTimeout(r, delay + Math.random() * 200));
      }
    },
    [addLine]
  );

  const handleSubmit = async () => {
    if (!prompt.trim() || phase === 'decomposing' || phase === 'executing' || phase === 'synthesizing') return;

    setResult(null);
    setErrorMsg('');
    setShowSubTasks(false);
    setTerminalLines([]);

    // Phase 1: Decomposing
    setPhase('decomposing');
    addLine(`═══ RESURGO AI ORCHESTRATOR ═══`);
    addLine(`> Input: "${prompt.slice(0, 80)}${prompt.length > 80 ? '...' : ''}"`);
    addLine('');
    addLine('── PHASE 1: DECOMPOSITION ──');
    await simulateLines(DECOMPOSE_LINES, 300);

    // Phase 2: Executing
    setPhase('executing');
    addLine('');
    addLine('── PHASE 2: PARALLEL EXECUTION ──');
    await simulateLines(EXECUTE_LINES, 500);

    // Phase 3: Synthesizing
    setPhase('synthesizing');
    addLine('');
    addLine('── PHASE 3: SYNTHESIS ──');
    await simulateLines(SYNTH_LINES, 400);

    // Make the actual API call
    try {
      addLine('');
      addLine('> Calling orchestration engine...');

      const res = await fetch('/api/ai/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          systemContext: 'You are Resurgo, an intelligent life co-pilot. Respond with actionable, personalized advice.',
          includeMetadata: true,
          maxSubTasks: 5,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data: OrchestrateResponse = await res.json();

      addLine(`> Complete! ${data.stats.subTaskCount} sub-tasks | ${data.stats.providersUsed.length} providers | ${data.stats.totalDurationMs}ms`);
      addLine(`> Providers: ${data.stats.providersUsed.join(', ')}`);
      addLine(`> Tokens: ${data.stats.totalTokens}`);
      addLine(`> Method: ${data.stats.decompositionMethod}`);
      addLine('');
      addLine('═══ ORCHESTRATION COMPLETE ═══');

      setResult(data);
      setPhase('complete');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      addLine(`> ERROR: ${msg}`);
      addLine('> Orchestration failed. Please try again.');
      setErrorMsg(msg);
      setPhase('error');
    }
  };

  const handleReset = () => {
    setPhase('idle');
    setPrompt('');
    setResult(null);
    setTerminalLines([]);
    setErrorMsg('');
    setShowSubTasks(false);
    textareaRef.current?.focus();
  };

  const isProcessing = phase === 'decomposing' || phase === 'executing' || phase === 'synthesizing';

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* ── Header ── */}
      <div className="border-2 border-zinc-800 bg-black p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-3 w-3 bg-orange-600 animate-pulse" />
          <h1 className="font-pixel text-sm tracking-widest text-orange-600">AI ORCHESTRATOR</h1>
          <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-600">MULTI-PROVIDER ENGINE</span>
        </div>
        <p className="font-terminal text-sm text-zinc-400 leading-relaxed">
          Submit a complex prompt → it gets decomposed into specialized sub-tasks → each sub-task is routed to the
          best AI provider → results are synthesized into one coherent response. Think of it as a team of specialized
          AIs working together on your request.
        </p>
      </div>

      {/* ── Input ── */}
      <div className="border-2 border-zinc-800 bg-black">
        <div className="border-b border-zinc-800 px-4 py-2 flex items-center gap-2">
          <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">PROMPT INPUT</span>
          <span className="ml-auto font-terminal text-xs text-zinc-600">{prompt.length}/2000</span>
        </div>
        <div className="p-4">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 2000))}
            placeholder="Enter a complex request that benefits from multi-AI processing..."
            rows={4}
            disabled={isProcessing}
            className="w-full resize-none border-2 border-zinc-800 bg-zinc-950 px-4 py-3 font-terminal text-base text-zinc-100 outline-none transition focus:border-orange-600 placeholder:text-zinc-600 disabled:opacity-50"
          />

          {/* Quick prompts */}
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((ex) => (
              <button
                key={ex.label}
                onClick={() => setPrompt(ex.prompt)}
                disabled={isProcessing}
                className="border border-zinc-800 bg-zinc-950 px-3 py-1.5 font-pixel text-[0.35rem] tracking-widest text-zinc-400 transition hover:border-orange-600 hover:text-orange-500 disabled:opacity-30"
              >
                {ex.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isProcessing}
              className="flex-1 border-2 border-orange-600 bg-orange-600 py-3 font-pixel text-[0.6rem] tracking-widest text-black transition hover:bg-orange-500 active:translate-y-[1px] disabled:opacity-30 disabled:cursor-not-allowed shadow-[3px_3px_0px_rgba(0,0,0,0.8)]"
            >
              {isProcessing ? `${phase.toUpperCase()}...` : 'ORCHESTRATE →'}
            </button>
            {(result || phase === 'error') && (
              <button
                onClick={handleReset}
                className="border-2 border-zinc-700 bg-zinc-900 px-6 py-3 font-pixel text-[0.6rem] tracking-widest text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200"
              >
                RESET
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Terminal Output ── */}
      {terminalLines.length > 0 && (
        <div className="border-2 border-zinc-800 bg-black">
          <div className="border-b border-zinc-800 px-4 py-2 flex items-center gap-2">
            <div className={cn(
              'h-2 w-2 rounded-full',
              isProcessing ? 'bg-orange-500 animate-pulse' : phase === 'complete' ? 'bg-green-500' : phase === 'error' ? 'bg-red-500' : 'bg-zinc-600'
            )} />
            <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">ORCHESTRATION LOG</span>
            <span className="ml-auto font-terminal text-xs text-zinc-600">
              {phase === 'decomposing' ? 'PHASE 1/3'
                : phase === 'executing' ? 'PHASE 2/3'
                : phase === 'synthesizing' ? 'PHASE 3/3'
                : phase === 'complete' ? 'DONE'
                : phase === 'error' ? 'FAILED'
                : ''}
            </span>
          </div>
          <div
            ref={terminalRef}
            className="max-h-64 overflow-y-auto p-4 scrollbar-thin scrollbar-track-black scrollbar-thumb-zinc-700"
          >
            {terminalLines.map((line, i) => (
              <p
                key={i}
                className={cn(
                  'font-terminal text-sm leading-relaxed',
                  line.startsWith('═') ? 'text-orange-500 font-bold' :
                  line.startsWith('──') ? 'text-zinc-500 font-bold' :
                  line.includes('ERROR') ? 'text-red-400' :
                  line.includes('✓') ? 'text-green-400' :
                  line.includes('Complete') ? 'text-green-400' :
                  'text-zinc-400'
                )}
              >
                {line || '\u00A0'}
              </p>
            ))}
            {isProcessing && (
              <span className="inline-block w-2 h-4 bg-orange-500 animate-pulse ml-1" />
            )}
          </div>
        </div>
      )}

      {/* ── Result ── */}
      {result && (
        <div className="space-y-4">
          {/* Stats bar */}
          <div className="flex flex-wrap gap-3">
            <StatBadge label="Duration" value={`${(result.stats.totalDurationMs / 1000).toFixed(1)}s`} />
            <StatBadge label="Providers" value={String(result.stats.providersUsed.length)} />
            <StatBadge label="Sub-tasks" value={String(result.stats.subTaskCount)} />
            <StatBadge label="Tokens" value={String(result.stats.totalTokens)} />
            <StatBadge label="Method" value={result.stats.decompositionMethod} />
            {result.stats.providersUsed.map((p) => (
              <span
                key={p}
                className={cn('font-pixel text-[0.35rem] tracking-widest px-2 py-1 border border-zinc-800', PROVIDER_COLORS[p] ?? 'text-zinc-400')}
              >
                {p.toUpperCase()}
              </span>
            ))}
          </div>

          {/* Main response */}
          <div className="border-2 border-zinc-800 bg-black">
            <div className="border-b border-zinc-800 px-4 py-2 flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full" />
              <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">SYNTHESIZED RESPONSE</span>
            </div>
            <div className="p-6">
              <div className="font-terminal text-base text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {result.response}
              </div>
            </div>
          </div>

          {/* Sub-task details toggle */}
          {result.subTasks && result.subTasks.length > 0 && (
            <div className="border-2 border-zinc-800 bg-black">
              <button
                onClick={() => setShowSubTasks(!showSubTasks)}
                className="w-full border-b border-zinc-800 px-4 py-3 flex items-center gap-2 hover:bg-zinc-950 transition"
              >
                <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">
                  {showSubTasks ? '▼' : '▶'} SUB-TASK DETAILS ({result.subTasks.length})
                </span>
                <span className="ml-auto font-terminal text-xs text-zinc-600">
                  Click to {showSubTasks ? 'collapse' : 'expand'}
                </span>
              </button>
              {showSubTasks && (
                <div className="divide-y divide-zinc-900">
                  {result.subTasks.map((st) => (
                    <div key={st.id} className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base">{TASK_TYPE_ICONS[st.type] ?? '📎'}</span>
                        <span className="font-pixel text-[0.6rem] tracking-widest text-zinc-200">
                          {st.title}
                        </span>
                        <span className="font-terminal text-xs text-zinc-600">({st.type})</span>
                        <span className={cn('font-pixel text-[0.55rem] tracking-widest ml-auto', PROVIDER_COLORS[st.provider] ?? 'text-zinc-400')}>
                          {st.provider.toUpperCase()} / {st.model}
                        </span>
                        <span className="font-terminal text-xs text-zinc-600">{st.durationMs}ms</span>
                        {st.tokensUsed && (
                          <span className="font-terminal text-xs text-zinc-600">{st.tokensUsed} tok</span>
                        )}
                      </div>
                      {st.error ? (
                        <p className="font-terminal text-sm text-red-400">{st.error}</p>
                      ) : (
                        <div className="border border-zinc-900 bg-zinc-950 p-3 max-h-48 overflow-y-auto">
                          <p className="font-terminal text-sm text-zinc-400 whitespace-pre-wrap leading-relaxed">
                            {st.content}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Error State ── */}
      {phase === 'error' && !result && (
        <div className="border-2 border-red-900 bg-red-950/20 p-6">
          <p className="font-pixel text-[0.6rem] tracking-widest text-red-500 mb-2">ORCHESTRATION FAILED</p>
          <p className="font-terminal text-sm text-red-400">{errorMsg}</p>
          <button
            onClick={handleReset}
            className="mt-4 border-2 border-red-800 px-4 py-2 font-pixel text-[0.35rem] tracking-widest text-red-400 hover:bg-red-950/50 transition"
          >
            TRY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-zinc-800 bg-zinc-950 px-3 py-1.5 flex items-center gap-2">
      <span className="font-pixel text-[0.55rem] tracking-widest text-zinc-600">{label}</span>
      <span className="font-terminal text-sm text-orange-400">{value}</span>
    </div>
  );
}
