'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import EmailCapture from './EmailCapture';
import { trackMarketingEvent } from '@/lib/marketing/analytics';

const FAQ_MAP: Array<{ keywords: string[]; answer: string }> = [
  {
    keywords: ['price', 'pricing', 'cost', 'free', 'plan'],
    answer: 'Resurgo has a generous free plan, plus Pro for advanced analytics and premium workflows.',
  },
  {
    keywords: ['ai', 'coach', 'assistant'],
    answer: 'Yes — the AI coach helps turn brain dumps into clear daily priorities and momentum.',
  },
  {
    keywords: ['mobile', 'android', 'ios', 'app'],
    answer: 'You can use Resurgo on desktop and mobile web, and there is Android support too.',
  },
  {
    keywords: ['habit', 'goal', 'focus'],
    answer: 'You can track habits, run focus sessions, and connect them directly to your goals.',
  },
];

function findAnswer(question: string): string | null {
  const q = question.toLowerCase();
  for (const item of FAQ_MAP) {
    if (item.keywords.some((keyword) => q.includes(keyword))) return item.answer;
  }
  return null;
}

export default function LandingChatWidget() {
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState('');

  const answer = useMemo(() => (submitted ? findAnswer(submitted) : null), [submitted]);
  const showCapture = !!submitted && !answer;

  return (
    <section className="rounded border border-zinc-800 bg-zinc-950 p-4">
      <h3 className="mb-1 text-base font-semibold text-zinc-100">Quick FAQ bot</h3>
      <p className="mb-3 text-sm text-zinc-400">Ask a question about Resurgo and get a quick answer.</p>

      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Is there a free plan?"
          className="w-full rounded border border-zinc-700 bg-black px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setSubmitted(question.trim())}
          className="rounded bg-zinc-200 px-3 py-2 text-sm font-semibold text-black hover:bg-white"
        >
          Ask
        </button>
      </div>

      {submitted && (
        <div className="mt-3 rounded border border-zinc-800 bg-black p-3 text-sm text-zinc-300">
          {answer ?? 'I don’t have a perfect answer yet — drop your email and we’ll send the full details.'}
        </div>
      )}

      {showCapture && (
        <div className="mt-3">
          <EmailCapture variant="inline" source="landing_chat_unknown_question" offer="faq_follow_up" />
        </div>
      )}

      <div className="mt-4">
        <Link
          href="/sign-up"
          onClick={() => {
            trackMarketingEvent('cta_clicked', { source: 'landing_chat_widget', cta: 'signup' });
            trackMarketingEvent('signup_clicked', { source: 'landing_chat_widget' });
          }}
          className="inline-flex rounded bg-orange-600 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-500"
        >
          Start free
        </Link>
      </div>
    </section>
  );
}
