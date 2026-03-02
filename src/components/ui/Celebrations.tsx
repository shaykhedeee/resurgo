// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Celebration Components
// Beautiful animations for achievements, level ups, and milestones
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────────
// Confetti Particle System
// ─────────────────────────────────────────────────────────────────────────────────

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  shape: 'square' | 'circle' | 'rectangle';
}

const CONFETTI_COLORS = [
  '#F97316', // Orange
  '#FBBF24', // Gold
  '#22C55E', // Green
  '#3B82F6', // Blue
  '#A855F7', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#14B8A6', // Teal
];

function generateConfetti(count: number): ConfettiParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100, // percentage
    y: -10 - Math.random() * 20,
    rotation: Math.random() * 360,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 8 + Math.random() * 8,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    shape: ['square', 'circle', 'rectangle'][Math.floor(Math.random() * 3)] as ConfettiParticle['shape'],
  }));
}

interface ConfettiProps {
  active: boolean;
  count?: number;
  duration?: number;
  onComplete?: () => void;
}

export function Confetti({ active, count = 50, duration = 3000, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (active) {
      setParticles(generateConfetti(count));
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [active, count, duration, onComplete]);

  if (!mounted || !active || particles.length === 0) return null;

  return createPortal(
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 'var(--z-celebration)' }}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          <div
            style={{
              width: particle.shape === 'rectangle' ? particle.size * 1.5 : particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: particle.shape === 'circle' ? '50%' : '2px',
              transform: `rotate(${particle.rotation}deg)`,
            }}
          />
        </div>
      ))}
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Sparkle Effect
// ─────────────────────────────────────────────────────────────────────────────────

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface SparklesProps {
  active: boolean;
  count?: number;
  className?: string;
}

export function Sparkles({ active, count = 6, className }: SparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (active) {
      setSparkles(
        Array.from({ length: count }, (_, i) => ({
          id: i,
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80,
          size: 8 + Math.random() * 8,
          delay: Math.random() * 0.5,
        }))
      );
    } else {
      setSparkles([]);
    }
  }, [active, count]);

  if (!active || sparkles.length === 0) return null;

  return (
    <div className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}>
      {sparkles.map((sparkle) => (
        <svg
          key={sparkle.id}
          className="absolute animate-sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: `${sparkle.delay}s`,
          }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
            fill="#FBBF24"
          />
        </svg>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Pulse Ring Effect
// ─────────────────────────────────────────────────────────────────────────────────

interface PulseRingsProps {
  active: boolean;
  color?: string;
  className?: string;
}

export function PulseRings({ active, color = 'var(--ascend-primary)', className }: PulseRingsProps) {
  if (!active) return null;

  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      {[0, 0.5, 1].map((delay) => (
        <div
          key={delay}
          className="absolute inset-0 rounded-full animate-pulse-ring"
          style={{
            border: `2px solid ${color}`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Celebration Burst
// ─────────────────────────────────────────────────────────────────────────────────

interface BurstParticle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
}

interface CelebrationBurstProps {
  active: boolean;
  x?: number;
  y?: number;
  onComplete?: () => void;
}

export function CelebrationBurst({ active, x = 50, y = 50, onComplete }: CelebrationBurstProps) {
  const [particles, setParticles] = useState<BurstParticle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (active) {
      const count = 12;
      setParticles(
        Array.from({ length: count }, (_, i) => ({
          id: i,
          angle: (360 / count) * i,
          distance: 40 + Math.random() * 30,
          size: 6 + Math.random() * 6,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        }))
      );
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!mounted || !active || particles.length === 0) return null;

  return createPortal(
    <div
      className="fixed pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 'var(--z-celebration)',
      }}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-celebration-burst"
          style={{
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            backgroundColor: particle.color,
            transform: `rotate(${particle.angle}deg) translateY(-${particle.distance}px)`,
            transformOrigin: 'center center',
          }}
        />
      ))}
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Floating XP Indicator
// ─────────────────────────────────────────────────────────────────────────────────

interface FloatingXPProps {
  amount: number;
  x: number;
  y: number;
  onComplete: () => void;
}

export function FloatingXP({ amount, x, y, onComplete }: FloatingXPProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed pointer-events-none animate-xp-gain"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        zIndex: 'var(--z-celebration)',
      }}
    >
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold-400/90 text-black font-bold text-sm shadow-lg">
        +{amount} XP
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Celebration Hook for easy usage
// ─────────────────────────────────────────────────────────────────────────────────

interface CelebrationState {
  confetti: boolean;
  burst: { active: boolean; x: number; y: number };
  xp: { amount: number; x: number; y: number } | null;
}

export function useCelebration() {
  const [state, setState] = useState<CelebrationState>({
    confetti: false,
    burst: { active: false, x: 50, y: 50 },
    xp: null,
  });

  const triggerConfetti = useCallback(() => {
    setState((s) => ({ ...s, confetti: true }));
  }, []);

  const triggerBurst = useCallback((x: number = 50, y: number = 50) => {
    setState((s) => ({ ...s, burst: { active: true, x, y } }));
  }, []);

  const triggerXP = useCallback((amount: number, x: number, y: number) => {
    setState((s) => ({ ...s, xp: { amount, x, y } }));
  }, []);

  const clearConfetti = useCallback(() => {
    setState((s) => ({ ...s, confetti: false }));
  }, []);

  const clearBurst = useCallback(() => {
    setState((s) => ({ ...s, burst: { ...s.burst, active: false } }));
  }, []);

  const clearXP = useCallback(() => {
    setState((s) => ({ ...s, xp: null }));
  }, []);

  return {
    state,
    triggerConfetti,
    triggerBurst,
    triggerXP,
    clearConfetti,
    clearBurst,
    clearXP,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// Complete Celebration Overlay (combines all effects)
// ─────────────────────────────────────────────────────────────────────────────────

interface CelebrationOverlayProps {
  show: boolean;
  type?: 'achievement' | 'level_up' | 'streak' | 'goal_complete';
  onComplete?: () => void;
}

export function CelebrationOverlay({ show, type = 'achievement', onComplete }: CelebrationOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!mounted || !show) return null;

  const confettiCount = type === 'level_up' || type === 'goal_complete' ? 100 : 50;

  return createPortal(
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 'var(--z-celebration)' }}
    >
      <Confetti active={show} count={confettiCount} duration={3000} />
      <CelebrationBurst active={show} x={50} y={50} />
    </div>,
    document.body
  );
}
