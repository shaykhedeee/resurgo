'use client';

import { FormEvent, useEffect, useState } from 'react';
import { captureUtmParams, trackMarketingEvent } from '@/lib/marketing/analytics';

type EmailCaptureVariant = 'inline' | 'popup' | 'exit_intent' | 'bottom_bar';

interface EmailCaptureProps {
  variant: EmailCaptureVariant;
  source: string;
  offer?: string;
}

export default function EmailCapture({ variant, source, offer }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    captureUtmParams();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !email) return;

    setLoading(true);
    try {
      await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source,
          offer,
          variant,
          company,
        }),
      });

      trackMarketingEvent('email_captured', {
        source,
        offer,
        variant,
      });

      setSuccess(true);
      setEmail('');
      setCompany('');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded border border-emerald-700/60 bg-emerald-950/30 p-3 text-sm text-emerald-300">
        You&apos;re in 🎉 Check your inbox for next steps.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none"
      />

      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-orange-600 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Submitting…' : 'Get Access'}
      </button>
    </form>
  );
}
