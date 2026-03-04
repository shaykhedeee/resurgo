'use client';

import { useEffect, useMemo, useState } from 'react';
import EmailCapture from './EmailCapture';

const EXIT_INTENT_LAST_SEEN_KEY = 'resurgo_exit_intent_last_seen';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default function ExitIntent() {
  const [open, setOpen] = useState(false);

  const canShow = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const raw = window.localStorage.getItem(EXIT_INTENT_LAST_SEEN_KEY);
    if (!raw) return true;
    const lastSeen = Number(raw);
    if (!Number.isFinite(lastSeen)) return true;
    return Date.now() - lastSeen >= THIRTY_DAYS_MS;
  }, []);

  useEffect(() => {
    if (!canShow) return;

    const onMouseLeave = (event: MouseEvent) => {
      if (event.clientY > 10) return;
      setOpen(true);
      window.localStorage.setItem(EXIT_INTENT_LAST_SEEN_KEY, String(Date.now()));
    };

    document.addEventListener('mouseleave', onMouseLeave);
    return () => document.removeEventListener('mouseleave', onMouseLeave);
  }, [canShow]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded border border-zinc-700 bg-zinc-950 p-5 shadow-2xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Before you go…</h3>
            <p className="text-sm text-zinc-400">Get the free productivity blueprint + launch updates.</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-zinc-400 transition hover:text-zinc-200"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <EmailCapture variant="exit_intent" source="exit_intent_modal" offer="free_blueprint" />
      </div>
    </div>
  );
}
