'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Billing Waitlist Capture & Pre-Order Checkout
// Shown on the billing page when NEXT_PUBLIC_BILLING_LIVE !== 'true'.
// Captures early-access emails in Convex leads table & allows pre-orders.
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, FormEvent } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Sparkles, CheckCircle, Flame } from 'lucide-react';
import DodoCheckoutButton from '@/components/DodoCheckoutButton';

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
      <div className="mx-auto max-w-xl rounded-[2px] border border-emerald-800 bg-emerald-950/10 p-6 text-center font-mono">
        <CheckCircle className="mx-auto mb-3 h-8 w-8 text-emerald-500" />
        <p className="font-semibold text-emerald-400">// COHORT_REGISTRATION_SUCCESSFUL</p>
        <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
          You have been allocated an early-access token. We will notify you the instant active seats open up.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-[2px] border border-zinc-800 bg-zinc-950 p-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-orange-500" />
        <span className="font-mono text-xs tracking-widest text-orange-500 uppercase">
          // PRO_COHORT_LAUNCHING_SOON
        </span>
      </div>
      <h2 className="mb-2 font-mono text-lg font-bold text-zinc-100 uppercase tracking-wider">
        Join the waitlist
      </h2>
      <p className="mb-6 font-mono text-xs text-zinc-400 leading-relaxed">
        Drop your credentials below to request early-access routing and locked pricing tokens before the system goes fully live.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="OPERATOR_EMAIL@DOMAIN.COM"
          required
          className="flex-1 rounded-[2px] border border-zinc-800 bg-black px-4 py-3 font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:border-orange-800 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-[2px] border border-orange-800 bg-orange-950/20 px-6 py-3 font-mono text-xs font-bold tracking-widest text-orange-500 uppercase transition hover:bg-orange-950/40 disabled:opacity-40"
        >
          {loading ? 'SAVING...' : '[NOTIFY_ME]'}
        </button>
      </form>
      {error && <p className="mt-3 font-mono text-xs text-red-500">{error}</p>}
      <p className="mt-3 font-mono text-[10px] text-zinc-600">
        Free plan access is operational. No credit card required to log in.
      </p>

      {/* Exclusive Founding Pre-Order Block */}
      <div className="mt-6 border-t border-zinc-900 pt-6 text-left">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Flame className="h-3.5 w-3.5 text-amber-500" />
          <p className="font-mono text-[10px] font-bold tracking-widest text-amber-500 uppercase">
            // EXCLUSIVE_PRE_ORDER_::__FOUNDING_LIFETIME
          </p>
        </div>
        <p className="font-mono text-xs text-zinc-400 mb-4 leading-relaxed">
          Skip the queue. Lock in permanent founding lifetime access to all Pro features for a single payment of $89 before the price increases to $199. Limited to the first 100 relaunch signups.
        </p>
        <DodoCheckoutButton
          productId={process.env.NEXT_PUBLIC_DODO_PRODUCT_LIFETIME ?? ''}
          label="LOCK IN FOUNDING LIFETIME ACCESS — $89"
          className="w-full text-center rounded-[2px] border border-orange-600 bg-orange-600 hover:bg-orange-500 text-black font-mono font-bold text-xs tracking-widest uppercase py-3 transition shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] active:translate-y-[2px]"
          returnUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/billing?success=true`}
        />
      </div>
    </div>
  );
}
