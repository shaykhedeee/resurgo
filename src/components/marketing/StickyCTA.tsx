'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STICKY_DISMISSED_KEY = 'resurgo_sticky_cta_dismissed';

const MESSAGES = [
  { headline: 'Turn your goals into a daily plan — AI does the work.', sub: 'Free forever. No credit card.' },
  { headline: 'Set one goal. AI builds your entire system.', sub: '8 specialized AI coaches working for you.' },
  { headline: 'Your AI coach is waiting. Start in 30 seconds.', sub: 'Brain Dump → Plan → Execute → Win.' },
];

export default function StickyCTA() {
  const [hidden, setHidden] = useState(true);
  const [msgIdx, setMsgIdx] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = window.sessionStorage.getItem(STICKY_DISMISSED_KEY);
    if (dismissed === '1') { setHidden(true); return; }
    // Only show after user scrolls at least 50% down the page
    let shown = false;
    const handleScroll = () => {
      if (shown) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = window.scrollY / total;
      if (pct >= 0.5) {
        shown = true;
        setHidden(false);
        window.removeEventListener('scroll', handleScroll);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotate messages every 5s
  useEffect(() => {
    if (hidden) return;
    const id = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setMsgIdx((i) => (i + 1) % MESSAGES.length);
        setAnimate(false);
      }, 300);
    }, 5000);
    return () => clearInterval(id);
  }, [hidden]);

  const dismiss = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(STICKY_DISMISSED_KEY, '1');
    }
    setHidden(true);
  };

  if (hidden) return null;

  const msg = MESSAGES[msgIdx];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-orange-900/60 bg-black/98 backdrop-blur">
      {/* Top pixel accent bar */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-600 to-transparent" />

      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Left: terminal prefix + rotating message */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="hidden shrink-0 font-pixel text-[0.5rem] text-orange-500 sm:inline">&gt;_</span>
          <div
            className="min-w-0 transition-opacity duration-300"
            style={{ opacity: animate ? 0 : 1 }}
          >
            <p className="truncate font-terminal text-sm font-semibold text-zinc-100 sm:text-base">
              {msg.headline}
            </p>
            <p className="hidden font-pixel text-[0.45rem] tracking-widest text-zinc-500 sm:block">
              {msg.sub}
            </p>
          </div>
        </div>

        {/* Right: CTA + dismiss */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/sign-up"
            className="border-2 border-orange-600 bg-orange-600 px-4 py-2 font-terminal text-sm font-bold text-black shadow-[2px_2px_0px_rgba(0,0,0,0.7)] transition-all hover:bg-orange-500 active:translate-x-px active:translate-y-px active:shadow-none"
          >
            Start Free →
          </Link>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="border border-zinc-800 px-2 py-2 font-terminal text-xs text-zinc-600 transition hover:border-zinc-600 hover:text-zinc-300"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
