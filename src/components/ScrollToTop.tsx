'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ScrollToTop — terminal-styled "back to top" button.
// Appears after user scrolls 400px. Click scrolls to top with smooth animation.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!visible) return null;

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className="
        fixed bottom-8 right-6 z-50
        flex h-10 w-10 items-center justify-center
        border border-zinc-700 bg-zinc-950/90
        font-mono text-xs text-zinc-400
        backdrop-blur-sm
        transition-all duration-200
        hover:border-orange-600 hover:text-orange-400
        active:scale-95
        md:bottom-10 md:right-8
      "
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Pixel-art up arrow made from a simple SVG */}
      <svg
        viewBox="0 0 10 10"
        width="14"
        height="14"
        fill="currentColor"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        {/* Pixel up-arrow: base row, mid rows, tip */}
        <rect x="4" y="0" width="2" height="2" />
        <rect x="2" y="2" width="6" height="2" />
        <rect x="0" y="4" width="10" height="2" />
        <rect x="3" y="6" width="4" height="4" />
      </svg>
    </button>
  );
}
