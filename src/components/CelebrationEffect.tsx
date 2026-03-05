'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Completion Celebration Effect
// Shows floating XP + confetti when user completes a task/habit
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useState, useCallback } from 'react';

type Particle = {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
};

let particleId = 0;

export function useCompletionCelebration() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [xpFloats, setXpFloats] = useState<{ id: number; x: number; y: number; amount: number }[]>([]);

  const celebrate = useCallback((x: number, y: number, xpAmount?: number) => {
    const colors = ['#f97316', '#eab308', '#22c55e', '#06b6d4', '#a855f7'];
    const newParticles: Particle[] = Array.from({ length: 8 }, () => ({
      id: ++particleId,
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 3 + Math.random() * 4,
      vx: (Math.random() - 0.5) * 6,
      vy: -(2 + Math.random() * 4),
    }));
    setParticles((p) => [...p, ...newParticles]);

    if (xpAmount) {
      setXpFloats((f) => [...f, { id: ++particleId, x, y: y - 10, amount: xpAmount }]);
    }

    // Clean up after animation
    setTimeout(() => {
      setParticles((p) => p.filter((pp) => !newParticles.includes(pp)));
    }, 1000);
    setTimeout(() => {
      setXpFloats((f) => f.slice(1));
    }, 1500);
  }, []);

  return { particles, xpFloats, celebrate };
}

export function CelebrationLayer({
  particles,
  xpFloats,
}: {
  particles: Particle[];
  xpFloats: { id: number; x: number; y: number; amount: number }[];
}) {
  if (particles.length === 0 && xpFloats.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      {/* Confetti particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-burst"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            '--vx': `${p.vx * 20}px`,
            '--vy': `${p.vy * 20}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* XP float text */}
      {xpFloats.map((f) => (
        <div
          key={f.id}
          className="absolute animate-xp-float font-pixel text-sm tracking-widest text-orange-400 drop-shadow-[0_0_6px_rgba(249,115,22,0.6)]"
          style={{ left: f.x - 20, top: f.y }}
        >
          +{f.amount} XP
        </div>
      ))}
    </div>
  );
}
