'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface InteractiveToolSandboxProps {
  toolSlug: string;
  promptLabel: string;
  outputLabel: string;
  ctaText: string;
}

const DEFAULT_PLACEHOLDERS: Record<string, string> = {
  'free-ai-task-prioritizer': `- Fix login page layout issues on mobile\n- Write blog post about habit stacking\n- Schedule Twitter posts for next week\n- Answer support email from subscriber\n- Plan new database migrations for payments`,
  'free-brain-dump-to-task-list': `I feel so overwhelmed. I need to finish the marketing copy, but the website design on mobile is broken. I also promised to email the launch subscribers. And I need to buy groceries, clean my desk, and figure out why the payment webhook failed yesterday. Oh, and I want to run a 5k next month but haven't started training.`,
  'free-ai-goal-planner': `Launch my SaaS product (Resurgo) on Product Hunt in 4 weeks and get my first 50 paid users.`,
  'free-habit-streak-calculator': `Habit: Coding 1 hour every morning.\nSchedule: Mon, Tue, Wed, Thu, Fri at 7:30 AM. Weekends off.\nContext: I often stay up late coding or browsing Reddit, which makes waking up early hard.`,
  'free-weekly-review-generator': `Wins: Shipped the Clerk middleware bypass, deployed Convex schema successfully, generated blog draft.\nMisses: Payment webhook testing was delayed because of API key issues. Slept late 2 days.\nLessons: Need to bypass rate-limiting when testing from local IP. Keep habits small.`,
  'free-pomodoro-timer': `Task: Design the mobile responsive layouts for the pricing and tools pages.\nEnergy Level: Medium-low, easily distracted by phone and Slack messages.`,
  'free-ai-marketing-finder': `Product: Resurgo - retro AI life OS for indie founders.\nCategory: Productivity, AI, Health.\nLaunch timeline: 3 weeks.\nTarget Audience: Solo operators, developers, creators, ADHD professionals.`
};

export default function InteractiveToolSandbox({
  toolSlug,
  promptLabel,
  outputLabel,
  ctaText
}: InteractiveToolSandboxProps) {
  const defaultPlaceholder = DEFAULT_PLACEHOLDERS[toolSlug] || 'Type your details here…';
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usageCount, setUsageCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryInput = input.trim() || defaultPlaceholder;

    if (queryInput.length < 5) {
      setError('Please provide a slightly longer input (minimum 5 characters).');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const response = await fetch('/api/tools/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolSlug,
          input: queryInput
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      setOutput(data.result);
      setUsageCount((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      {/* Input panel */}
      <form onSubmit={handleSubmit} className="flex flex-col border border-zinc-900 bg-zinc-950 p-5">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <p className="font-mono text-xs tracking-widest text-zinc-500">INPUT ENGINE</p>
          <span className="font-mono text-[10px] bg-zinc-900 px-2 py-0.5 text-zinc-400">
            SESSION_RUNS: {usageCount}
          </span>
        </div>

        <div className="mt-4 flex-1">
          <label htmlFor="tool-input" className="block font-mono text-sm font-semibold text-zinc-200">
            {promptLabel}
          </label>
          <textarea
            id="tool-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={defaultPlaceholder}
            className="mt-3 min-h-[220px] w-full border border-zinc-800 bg-black p-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-700 focus:border-orange-600 focus:outline-none"
          />
        </div>

        {error && (
          <p className="mt-3 font-mono text-xs text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full border border-zinc-700 bg-zinc-900 py-3 font-mono text-xs tracking-widest text-zinc-200 transition hover:border-orange-500 hover:bg-orange-950/20 hover:text-orange-400 disabled:border-zinc-800 disabled:bg-zinc-950 disabled:text-zinc-600"
        >
          {loading ? 'COMPUTING WITH AI...' : 'RUN AI ENGINE ⚡'}
        </button>
      </form>

      {/* Output panel */}
      <div className="flex flex-col border border-zinc-900 bg-zinc-950 p-5">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <p className="font-mono text-xs tracking-widest text-zinc-500">OUTPUT REPORT</p>
          <span className="font-mono text-[10px] text-orange-500">READY</span>
        </div>

        <div className="mt-4 flex-1 overflow-auto max-h-[400px]">
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center py-20">
              <div className="h-6 w-6 animate-spin border-2 border-orange-500 border-t-transparent" />
              <p className="mt-4 font-mono text-xs tracking-widest text-zinc-500 animate-pulse">COMPUTING DRAFT...</p>
            </div>
          ) : output ? (
            <div className="prose prose-invert max-w-none font-mono text-xs leading-relaxed text-zinc-300">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-sm font-bold text-orange-400 mt-2 mb-1" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xs font-bold text-zinc-200 mt-4 mb-2 uppercase tracking-wide border-b border-zinc-900 pb-1" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-xs font-bold text-zinc-300 mt-3 mb-1" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 my-2" {...props} />,
                  li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                  strong: ({ node, ...props }) => <strong className="text-zinc-100 font-bold" {...props} />,
                  code: ({ node, ...props }) => <code className="bg-black px-1.5 py-0.5 border border-zinc-900 text-zinc-400 rounded" {...props} />,
                  pre: ({ node, ...props }) => <pre className="bg-black p-3 border border-zinc-900 rounded overflow-auto my-3" {...props} />
                }}
              >
                {output}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-20 text-center">
              <p className="font-mono text-xs text-zinc-600">Awaiting execution. Run the engine to see output.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
