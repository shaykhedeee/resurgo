'use client';

import { useState, useEffect } from 'react';

const CONSENT_KEY = 'resurgo-cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't already consented
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on initial render
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
    // Disable GA if user declines
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)['ga-disable-G-F1VLMSS8FB'] = true;
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] border-t border-zinc-800 bg-black/95 backdrop-blur-sm px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-zinc-400 leading-relaxed">
          We use cookies for authentication and analytics (Google Analytics).
          No data is sold.{' '}
          <a href="/privacy" className="text-orange-500 underline underline-offset-2 hover:text-orange-400">
            Privacy Policy
          </a>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="rounded border border-zinc-700 px-4 py-1.5 font-mono text-[10px] tracking-widest text-zinc-400 hover:bg-zinc-900 transition-colors"
          >
            DECLINE
          </button>
          <button
            onClick={accept}
            className="rounded bg-orange-600 px-4 py-1.5 font-mono text-[10px] tracking-widest text-black font-bold hover:bg-orange-500 transition-colors"
          >
            ACCEPT
          </button>
        </div>
      </div>
    </div>
  );
}
