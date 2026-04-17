'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Terminal FAB (Unified Floating Action Button)
// A single terminal-themed bottom-right FAB that expands into a command menu
// Replaces GlobalFAB + DesktopAIFab with one cohesive component
// Actions: Quick Task · Goal · Habit · Brain Dump · AI Coach · Voice Input
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Terminal,
  X,
  CheckCircle2,
  Target,
  Flame,
  Brain,
  MessageSquare,
  Mic,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const VoiceInput = dynamic(() => import('@/components/VoiceInput'), { ssr: false });

interface TerminalFABProps {
  onBrainDump?: () => void;
}

// ── Command items ────────────────────────────────────────────────────────────
const COMMANDS = [
  {
    id: 'task',
    key: 'T',
    label: 'QUICK_TASK',
    sublabel: 'Add a task now',
    icon: CheckCircle2,
    color: 'text-orange-400',
    hoverBg: 'hover:bg-orange-950/40',
    borderAccent: 'border-l-orange-500',
    type: 'link' as const,
    href: '/tasks',
  },
  {
    id: 'goal',
    key: 'G',
    label: 'NEW_GOAL',
    sublabel: 'Set a target',
    icon: Target,
    color: 'text-cyan-400',
    hoverBg: 'hover:bg-cyan-950/40',
    borderAccent: 'border-l-cyan-500',
    type: 'link' as const,
    href: '/goals',
  },
  {
    id: 'habit',
    key: 'H',
    label: 'NEW_HABIT',
    sublabel: 'Start a loop',
    icon: Flame,
    color: 'text-emerald-400',
    hoverBg: 'hover:bg-emerald-950/40',
    borderAccent: 'border-l-emerald-500',
    type: 'link' as const,
    href: '/habits',
  },
  {
    id: 'brain-dump',
    key: 'B',
    label: 'BRAIN_DUMP',
    sublabel: 'Clear your mind',
    icon: Brain,
    color: 'text-purple-400',
    hoverBg: 'hover:bg-purple-950/40',
    borderAccent: 'border-l-purple-500',
    type: 'callback' as const,
  },
  {
    id: 'coach',
    key: 'C',
    label: 'AI_COACH',
    sublabel: 'Talk to your coach',
    icon: MessageSquare,
    color: 'text-amber-400',
    hoverBg: 'hover:bg-amber-950/40',
    borderAccent: 'border-l-amber-500',
    type: 'link' as const,
    href: '/coach',
  },
  {
    id: 'voice',
    key: 'V',
    label: 'VOICE_INPUT',
    sublabel: 'Speak to add',
    icon: Mic,
    color: 'text-pink-400',
    hoverBg: 'hover:bg-pink-950/40',
    borderAccent: 'border-l-pink-500',
    type: 'callback' as const,
  },
] as const;

// ── Scanline decoration ──────────────────────────────────────────────────────
function Scanlines() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)',
      }}
    />
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// TerminalFAB
// ═════════════════════════════════════════════════════════════════════════════
export default function TerminalFAB({ onBrainDump }: TerminalFABProps) {
  const [open, setOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, close]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [open, close]);

  // Keyboard shortcuts when open (press command key)
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const cmd = COMMANDS.find((c) => c.key === key);
      if (!cmd) return;
      if (cmd.type === 'callback') {
        close();
        if (cmd.id === 'brain-dump') onBrainDump?.();
        if (cmd.id === 'voice') setVoiceOpen(true);
      }
      // Links handled by the DOM anchor click
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, close, onBrainDump]);

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 print:hidden">
      {/* ── Expanded terminal menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scaleY: 0.92 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 16, scaleY: 0.92 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 right-0 mb-2 w-56 origin-bottom-right overflow-hidden border border-zinc-800 bg-zinc-950/95 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-lg"
          >
            <Scanlines />

            {/* Terminal header bar */}
            <div className="relative z-20 flex items-center gap-2 border-b border-zinc-800 px-3 py-2">
              <Terminal className="h-3 w-3 text-orange-500" />
              <span className="font-pixel text-[0.35rem] tracking-[0.2em] text-orange-500">
                RESURGO_TERMINAL
              </span>
              <span className="ml-auto font-terminal text-[0.55rem] text-zinc-600">v2.0</span>
            </div>

            {/* Command list */}
            <div className="relative z-20 py-1">
              {COMMANDS.map((cmd, i) => {
                const Icon = cmd.icon;

                const inner = (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.035, duration: 0.15 }}
                    className={cn(
                      'flex items-center gap-3 border-l-2 px-3 py-2.5 transition-colors cursor-pointer',
                      cmd.borderAccent,
                      cmd.hoverBg,
                    )}
                  >
                    <Icon
                      className={cn('h-4 w-4 shrink-0', cmd.color)}
                      strokeWidth={1.8}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'font-pixel text-[0.35rem] tracking-[0.15em]',
                          cmd.color,
                        )}
                      >
                        {cmd.label}
                      </p>
                      <p className="font-terminal text-[0.55rem] text-zinc-500">
                        {cmd.sublabel}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd
                        className="flex h-4 w-4 items-center justify-center border border-zinc-700 text-[0.45rem] font-terminal text-zinc-500"
                      >
                        {cmd.key}
                      </kbd>
                      <ChevronRight className="h-3 w-3 text-zinc-700" />
                    </div>
                  </motion.div>
                );

                if (cmd.type === 'callback') {
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        close();
                        if (cmd.id === 'brain-dump') onBrainDump?.();
                        if (cmd.id === 'voice') setVoiceOpen(true);
                      }}
                      className="w-full text-left"
                      aria-label={cmd.label}
                    >
                      {inner}
                    </button>
                  );
                }

                return (
                  <Link
                    key={cmd.id}
                    href={(cmd as { href: string }).href}
                    onClick={close}
                    aria-label={cmd.label}
                  >
                    {inner}
                  </Link>
                );
              })}
            </div>

            {/* Terminal footer */}
            <div className="relative z-20 border-t border-zinc-800 px-3 py-1.5">
              <p className="font-terminal text-[0.5rem] text-zinc-600">
                <span className="text-orange-600">$</span> press key or click to
                execute
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main FAB button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'group relative flex h-13 w-13 items-center justify-center border transition-all duration-200',
          open
            ? 'border-zinc-600 bg-zinc-900 text-zinc-300'
            : 'border-orange-600 bg-orange-600 text-black shadow-[0_8px_24px_rgba(234,88,12,0.35)] hover:bg-orange-500 hover:shadow-[0_8px_28px_rgba(234,88,12,0.45)]',
        )}
        aria-label={open ? 'Close command terminal' : 'Open command terminal'}
        aria-expanded={open}
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
              key="terminal"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Terminal className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring on idle */}
        {!open && (
          <span className="absolute inset-0 animate-ping border border-orange-500/30 pointer-events-none" />
        )}
      </button>

      {/* Voice Input Overlay */}
      <VoiceInput
        isOpen={voiceOpen}
        onClose={() => setVoiceOpen(false)}
      />
    </div>
  );
}
