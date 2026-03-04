'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STICKY_DISMISSED_KEY = 'resurgo_sticky_cta_dismissed';

export default function StickyCTA() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = window.sessionStorage.getItem(STICKY_DISMISSED_KEY);
    setHidden(dismissed === '1');
  }, []);

  const dismiss = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(STICKY_DISMISSED_KEY, '1');
    }
    setHidden(true);
  };

  if (hidden) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-black/95 p-3 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <p className="text-sm text-zinc-300">Turn your goals into a daily plan with AI.</p>
        <div className="flex items-center gap-2">
          <Link
            href="/sign-up"
            className="rounded bg-orange-600 px-3 py-1.5 text-sm font-semibold text-black hover:bg-orange-500"
          >
            Start free
          </Link>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
