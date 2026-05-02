'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Exit Intent Modal (Terminal-styled)
// Interrupt prompt that fires when cursor leaves viewport upward
// ═══════════════════════════════════════════════════════════════════════════════

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { captureUtmParams, trackMarketingEvent } from '@/lib/marketing/analytics';

const EXIT_INTENT_LAST_SEEN_KEY = 'resurgo_exit_intent_last_seen';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const EXIT_INTENT_SHOWN_SESSION = 'resurgo_exit_intent_shown_session';

export default function ExitIntent() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const canShow = useMemo(() => {
    if (typeof window === 'undefined') return false;
    // Don't show if already dismissed in this session
    if (window.sessionStorage.getItem(EXIT_INTENT_SHOWN_SESSION) === 'true') return false;
    const raw = window.localStorage.getItem(EXIT_INTENT_LAST_SEEN_KEY);
    if (!raw) return true;
    const lastSeen = Number(raw);
    if (!Number.isFinite(lastSeen)) return true;
    return Date.now() - lastSeen >= THIRTY_DAYS_MS;
  }, []);

  useEffect(() => {
    if (!canShow || dismissed) return;
    const onMouseLeave = (event: MouseEvent) => {
      if (event.clientY > 10) return;
      setOpen(true);
      window.localStorage.setItem(EXIT_INTENT_LAST_SEEN_KEY, String(Date.now()));
      window.sessionStorage.setItem(EXIT_INTENT_SHOWN_SESSION, 'true');
    };
    document.addEventListener('mouseleave', onMouseLeave);
    return () => document.removeEventListener('mouseleave', onMouseLeave);
  }, [canShow, dismissed]);

  useEffect(() => {
    captureUtmParams();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading || !email.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'exit_intent_modal', offer: 'free_blueprint', variant: 'exit_intent' }),
      });
      trackMarketingEvent('email_captured', { source: 'exit_intent_modal', offer: 'free_blueprint', variant: 'exit_intent' });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div className="w-full max-w-lg border-2 border-orange-900 bg-zinc-950 shadow-[0_0_40px_rgba(234,88,12,0.15)]">
        {/* Terminal title bar */}
        <div className="flex items-center justify-between border-b border-orange-900/50 bg-zinc-900 px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-700" />
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-700" />
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-700" />
          </div>
          <span className="font-pixel text-[0.45rem] tracking-widest text-orange-700">PROCESS_INTERRUPT</span>
          <button
            type="button"
            onClick={() => { setOpen(false); setDismissed(true); }}
            className="font-pixel text-[0.45rem] tracking-widest text-orange-500 hover:text-orange-300 transition-colors font-bold"
            aria-label="Dismiss"
            title="Close this popup"
          >
            [ ✕ CLOSE ]
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="space-y-3">
              <p className="font-pixel text-[0.6rem] tracking-widest text-green-400">
                ✓ COMMAND_ACCEPTED
              </p>
              <p className="font-terminal text-sm text-zinc-400">Blueprint is incoming. Check your inbox.</p>
              <div className="mt-2 border-l-2 border-orange-800 pl-3">
                <p className="font-terminal text-xs text-zinc-600">
                  {'>'} BLUEPRINT_DISPATCHED<br />
                  {'>'} INBOX_TARGET: {email}<br />
                  {'>'} STATUS: 200 OK
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header */}
              <div>
                <p className="font-pixel text-[0.5rem] tracking-widest text-orange-500 mb-2">
                  !! INTERRUPT :: PROCESS_TERMINATING
                </p>
                <p className="font-terminal text-base text-zinc-200">
                  Don&apos;t leave without the free blueprint.
                </p>
                <p className="font-terminal text-sm text-zinc-500 mt-1">
                  90-day productivity system, AI prompts, and launch access — zero spam.
                </p>
              </div>

              {/* Terminal code preview */}
              <div className="border border-zinc-800 bg-black px-3 py-2">
                <p className="font-terminal text-xs text-zinc-600">
                  {'>'} resource: <span className="text-orange-400">FREE_BLUEPRINT.pdf</span><br />
                  {'>'} includes: <span className="text-zinc-400">90-day plan · AI prompts · early access</span><br />
                  {'>'} cost: <span className="text-green-400">$0.00</span>
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center gap-2 border-b border-zinc-700 pb-1">
                  <span className="font-terminal text-sm text-orange-500 shrink-0">$_</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={loading}
                    className="flex-1 bg-transparent font-terminal text-sm text-zinc-200 placeholder:text-zinc-700 outline-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="flex-1 font-pixel text-[0.5rem] tracking-widest py-2.5 bg-orange-600 text-black hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{ boxShadow: '0 0 20px rgba(234,88,12,0.3)' }}
                  >
                    {loading ? 'PROCESSING_...' : '[ SEND_BLUEPRINT ]'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOpen(false); setDismissed(true); }}
                    className="font-pixel text-[0.45rem] tracking-widest text-orange-500 hover:text-orange-300 transition-colors whitespace-nowrap font-bold px-4 py-2 border border-orange-700 hover:border-orange-500 hover:bg-orange-950/30"
                  >
                    [ SKIP OFFER ]
                  </button>
                </div>
              </form>

              <p className="font-terminal text-xs text-zinc-700">
                {'>'} No spam. Unsubscribe anytime. Privacy protected.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
