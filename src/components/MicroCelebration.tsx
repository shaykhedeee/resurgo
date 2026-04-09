'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — MicroCelebration
// Lightweight burst animation shown after completing a task or habit.
// No external dependencies — CSS keyframes only.
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';

const MESSAGES = [
  '✓ Done!',
  '⚡ Crushed it!',
  '🔥 On fire!',
  '💪 Keep going!',
  '⭐ Nice one!',
];

const PARTICLES = ['▸', '✦', '◆', '★', '●'] as const;

export interface MicroCelebrationHandle {
  trigger: () => void;
}

interface MicroCelebrationProps {
  /** Called with an imperative handle so parent can trigger celebrations */
  onMount?: (handle: MicroCelebrationHandle) => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  char: string;
  color: string;
  angle: number;
}

const COLORS = ['#f97316', '#fb923c', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'];

let nextId = 0;

export function MicroCelebration({ onMount }: MicroCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const handle: MicroCelebrationHandle = {
      trigger() {
        const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
          id: ++nextId,
          x: 50 + (Math.random() - 0.5) * 60,
          y: 50 + (Math.random() - 0.5) * 60,
          char: PARTICLES[i % PARTICLES.length],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          angle: (360 / 8) * i,
        }));
        setToast(msg);
        setParticles(newParticles);
        setTimeout(() => {
          setToast(null);
          setParticles([]);
        }, 1200);
      },
    };
    onMount?.(handle);
  }, [onMount]);

  if (!toast && particles.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-50" aria-hidden="true">
      {/* Toast message */}
      {toast && (
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded"
          style={{
            background: 'rgba(0,0,0,0.85)',
            border: '1px solid #f97316',
            animation: 'resurgo-pop 0.2s ease-out',
          }}
        >
          <span className="font-pixel text-[0.45rem] tracking-widest text-orange-400 whitespace-nowrap">
            {toast}
          </span>
        </div>
      )}

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-[0.6rem] font-bold"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            color: p.color,
            animation: `resurgo-burst-${p.angle > 180 ? 'l' : 'r'} 1s ease-out forwards`,
            transform: `rotate(${p.angle}deg)`,
          }}
        >
          {p.char}
        </div>
      ))}

      <style jsx>{`
        @keyframes resurgo-pop {
          from { opacity: 0; transform: translateX(-50%) scale(0.7); }
          to   { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        @keyframes resurgo-burst-r {
          0%   { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(1); }
          100% { opacity: 0; transform: translate(30px, -30px) rotate(180deg) scale(0); }
        }
        @keyframes resurgo-burst-l {
          0%   { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(1); }
          100% { opacity: 0; transform: translate(-30px, -30px) rotate(-180deg) scale(0); }
        }
      `}</style>
    </div>
  );
}
