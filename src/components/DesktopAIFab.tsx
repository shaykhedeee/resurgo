'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Desktop Expandable AI FAB
// Bottom-right floating action button that expands to show quick actions
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, X, Target, CheckCircle2, MessageSquare, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACTIONS = [
  {
    id: 'coach',
    label: 'AI Coach',
    sublabel: 'Get guidance',
    href: '/coach',
    icon: MessageSquare,
    color: 'text-purple-400',
    bg: 'bg-purple-950/60',
    border: 'border-purple-800',
  },
  {
    id: 'task',
    label: 'Quick Task',
    sublabel: 'Add a task',
    href: '/tasks',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-800',
  },
  {
    id: 'habit',
    label: 'New Habit',
    sublabel: 'Start a loop',
    href: '/habits',
    icon: Flame,
    color: 'text-orange-400',
    bg: 'bg-orange-950/60',
    border: 'border-orange-800',
  },
  {
    id: 'goal',
    label: 'New Goal',
    sublabel: 'Set a target',
    href: '/goals',
    icon: Target,
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/60',
    border: 'border-cyan-800',
  },
] as const;

export default function DesktopAIFab() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-40 hidden md:block">
      {/* Expanded action list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-16 right-0 mb-2 flex flex-col gap-1.5 w-48"
          >
            {ACTIONS.map((action, i) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ delay: i * 0.04, duration: 0.15 }}
              >
                <Link
                  href={action.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 border px-3.5 py-2.5 backdrop-blur-md transition-all hover:scale-[1.02]',
                    action.bg,
                    action.border,
                  )}
                >
                  <action.icon className={cn('h-4 w-4 shrink-0', action.color)} strokeWidth={1.8} />
                  <div className="min-w-0">
                    <p className={cn('font-pixel text-[0.4rem] tracking-widest', action.color)}>
                      {action.label.toUpperCase()}
                    </p>
                    <p className="font-terminal text-[0.6rem] text-zinc-500">
                      {action.sublabel}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex h-12 w-12 items-center justify-center border transition-all duration-200',
          open
            ? 'border-zinc-600 bg-zinc-800 text-zinc-300 rotate-0'
            : 'border-orange-600 bg-orange-600 text-black hover:bg-orange-500',
        )}
        aria-label={open ? 'Close quick actions' : 'Open quick actions'}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="ai"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
