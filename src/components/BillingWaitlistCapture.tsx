'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Billing Waitlist Capture
// Shown on the billing page when NEXT_PUBLIC_BILLING_LIVE !== 'true'.
// Captures early-access emails in Convex leads table.
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, FormEvent } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Sparkles, CheckCircle } from 'lucide-react';

export function BillingWaitlistCapture() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const captureLead = useMutation(api.leads.capture);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await captureLead({
        email: trimmed,
        source: 'billing_waitlist',
        offer: 'pro_early_access',
        variant: null,
        referrer: typeof window !== 'undefined' ? document.referrer || null : null,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        utmSource: null,
        utmMedium: null,
        utmCampaign: null,
        utmTerm: null,
        utmContent: null,
        capturedAt: Date.now(),
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
        <CheckCircle className="mx-auto mb-3 h-8 w-8 text-emerald-400" />
        <p className="font-semibold text-[var(--text-primary)]">You&apos;re on the list!</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          We&apos;ll email you the moment Pro plans go live — with early-access pricing.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-ascend-500/30 bg-ascend-500/5 p-8 text-center">
      <Sparkles className="mx-auto mb-4 h-8 w-8 text-ascend-400" />
      <h2 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">
        Pro plans launching soon
      </h2>
      <p className="mb-6 text-[var(--text-secondary)]">
        Drop your email to get early-access pricing and be the first to know when paid plans go live.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-ascend-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-ascend-500 to-ascend-600 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Saving…' : 'Notify me'}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      <p className="mt-4 text-xs text-[var(--text-muted)]">
        No spam. Unsubscribe anytime. Free plan remains available now — no credit card required.
      </p>
    </div>
  );
}
