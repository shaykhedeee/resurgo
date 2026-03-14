'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Mobile AI Arc Menu
// Floating semi-circle launcher from the center AI button in the bottom nav.
// 5 spokes: Add Habit · Add Goal · AI Coach · Brain Dump · Quick Task
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Brain, MessageSquare, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MobileAIArcMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onBrainDump: () => void;
}

// ─── Arc spoke config ────────────────────────────────────────────────────────
// Positions are offsets from the bottom-center AI button (px).
// Radius 100px, spread 160° → 5 spokes at 160° / 120° / 90° / 60° / 20°
const SPOKE_RADIUS = 100;

function toXY(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.round(SPOKE_RADIUS * Math.cos(rad)),
    y: Math.round(-SPOKE_RADIUS * Math.sin(rad)), // negative = up
  };
}

const SPOKES = [
  {
    id: 'add-habit',
    icon: Target,
    label: 'ADD_HABIT',
    sublabel: 'New habit',
    color: 'text-green-400',
    bg: 'bg-green-950/90',
    border: 'border-green-700',
    glow: 'shadow-[0_0_18px_rgba(34,197,94,0.35)]',
    ...toXY(155),
    type: 'link' as const,
    href: '/habits',
  },
  {
    id: 'add-goal',
    icon: Sparkles,
    label: 'ADD_GOAL',
    sublabel: 'New goal',
    color: 'text-blue-400',
    bg: 'bg-blue-950/90',
    border: 'border-blue-700',
    glow: 'shadow-[0_0_18px_rgba(59,130,246,0.35)]',
    ...toXY(115),
    type: 'link' as const,
    href: '/goals',
  },
  {
    id: 'ai-coach',
    icon: MessageSquare,
    label: 'AI_COACH',
    sublabel: 'Chat with coach',
    color: 'text-orange-400',
    bg: 'bg-orange-950/90',
    border: 'border-orange-600',
    glow: 'shadow-[0_0_18px_rgba(234,88,12,0.35)]',
    ...toXY(90),
    type: 'link' as const,
    href: '/coach',
  },
  {
    id: 'brain-dump',
    icon: Brain,
    label: 'BRAIN_DUMP',
    sublabel: 'Clear your mind',
    color: 'text-purple-400',
    bg: 'bg-purple-950/90',
    border: 'border-purple-700',
    glow: 'shadow-[0_0_18px_rgba(168,85,247,0.35)]',
    ...toXY(65),
    type: 'callback' as const,
  },
  {
    id: 'quick-task',
    icon: CheckCircle2,
    label: 'QUICK_TASK',
    sublabel: 'Add task',
    color: 'text-teal-400',
    bg: 'bg-teal-950/90',
    border: 'border-teal-700',
    glow: 'shadow-[0_0_18px_rgba(20,184,166,0.35)]',
    ...toXY(25),
    type: 'link' as const,
    href: '/tasks',
  },
] as const;

// ─── Spoke button ────────────────────────────────────────────────────────────
function SpokeButton({
  spoke,
  index,
  onClose,
  onBrainDump,
}: {
  spoke: (typeof SPOKES)[number];
  index: number;
  onClose: () => void;
  onBrainDump: () => void;
}) {
  const Icon = spoke.icon;

  const inner = (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 450,
        damping: 22,
        delay: index * 0.06,
      }}
      style={{ x: spoke.x, y: spoke.y }}
      className={cn(
        'absolute bottom-0 left-0',
        // Centre the pill on its anchor point
        '-translate-x-1/2 -translate-y-1/2',
      )}
    >
      {/* Connector line */}
      <div
        className={cn(
          'absolute bottom-1/2 left-1/2 h-px w-12 origin-left opacity-30',
          spoke.border.replace('border-', 'bg-'),
        )}
        style={{
          transform: `rotate(${spoke.x < 0 ? 175 : 5}deg)`,
          width: '0',
        }}
      />

      {/* Button card */}
      <div
        className={cn(
          'flex w-[80px] flex-col items-center justify-center gap-[3px] border-2 px-2.5 py-3.5',
          'backdrop-blur-md',
          spoke.bg,
          spoke.border,
          spoke.glow,
          'active:scale-95 transition-transform duration-75',
        )}
      >
        <Icon className={cn('h-5 w-5', spoke.color)} strokeWidth={1.8} />
        <span className={cn('font-pixel text-[0.28rem] tracking-widest leading-tight', spoke.color)}>
          {spoke.label}
        </span>
        <span className="font-terminal text-[0.5rem] leading-tight text-zinc-500 text-center">
          {spoke.sublabel}
        </span>
      </div>
    </motion.div>
  );

  if (spoke.type === 'callback') {
    return (
      <button
        key={spoke.id}
        onClick={() => { onClose(); onBrainDump(); }}
        className="absolute bottom-0 left-0 contents"
        aria-label={spoke.label}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link
      key={spoke.id}
      href={(spoke as { href: string }).href}
      onClick={onClose}
      className="absolute bottom-0 left-0 contents"
      aria-label={spoke.label}
    >
      {inner}
    </Link>
  );
}

// ─── Arc ring decoration ─────────────────────────────────────────────────────
function ArcRing({ isOpen }: { isOpen: boolean }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          // Centred on the AI button. 220px diameter.
          className="absolute bottom-0 left-0 h-[220px] w-[220px] -translate-x-1/2 -translate-y-[105px] rounded-full border border-zinc-800/60 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(234,88,12,0.06) 0%, transparent 70%)' }}
        />
      )}
    </AnimatePresence>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MobileAIArcMenu
// ═════════════════════════════════════════════════════════════════════════════
export default function MobileAIArcMenu({ isOpen, onClose, onBrainDump }: MobileAIArcMenuProps) {
  // Close on hardware back / escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Full-screen backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/65 backdrop-blur-[3px]"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Spoke anchor — fixed relative to bottom nav center AI button */}
      {/* The bottom nav is 64px tall; AI button center is at bottom: 32px */}
      <div
        className="fixed bottom-[32px] left-1/2 z-50 pointer-events-none"
        style={{ transform: 'translateX(-50%)' }}
      >
        {/* Decorative arc ring */}
        <ArcRing isOpen={isOpen} />

        {/* Spokes */}
        <AnimatePresence>
          {isOpen &&
            SPOKES.map((spoke, i) => (
              <div key={spoke.id} className="pointer-events-auto">
                <SpokeButton
                  spoke={spoke}
                  index={i}
                  onClose={onClose}
                  onBrainDump={onBrainDump}
                />
              </div>
            ))}
        </AnimatePresence>
      </div>
    </>
  );
}
