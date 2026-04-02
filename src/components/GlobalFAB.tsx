'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Global Floating Action Button (Quick Add Speed Dial)
// Bottom-right FAB that expands into 5 quick-add options:
// Task · Habit · Food · Workout · Mood
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import Link from 'next/link';
import { Plus, CheckSquare, Zap, Utensils, Dumbbell, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

const QUICK_ADD_ITEMS = [
  {
    label: 'MOOD',
    icon: Smile,
    href: '/wellness',
    ring: 'border-purple-800',
    bg: 'bg-purple-950/80 hover:bg-purple-900/80',
    text: 'text-purple-300',
  },
  {
    label: 'WORKOUT',
    icon: Dumbbell,
    href: '/fitness',
    ring: 'border-blue-800',
    bg: 'bg-blue-950/80 hover:bg-blue-900/80',
    text: 'text-blue-300',
  },
  {
    label: 'FOOD',
    icon: Utensils,
    href: '/food',
    ring: 'border-yellow-800',
    bg: 'bg-yellow-950/80 hover:bg-yellow-900/80',
    text: 'text-yellow-300',
  },
  {
    label: 'HABIT',
    icon: Zap,
    href: '/habits',
    ring: 'border-emerald-800',
    bg: 'bg-emerald-950/80 hover:bg-emerald-900/80',
    text: 'text-emerald-300',
  },
  {
    label: 'TASK',
    icon: CheckSquare,
    href: '/tasks',
    ring: 'border-orange-800',
    bg: 'bg-orange-950/80 hover:bg-orange-900/80',
    text: 'text-orange-300',
  },
] as const;

export default function GlobalFAB() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Backdrop — clicking anywhere outside closes the dial */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* FAB container */}
      <div className="fixed bottom-40 right-4 z-50 flex flex-col items-end gap-2 md:bottom-24 md:right-6">
        {/* Speed-dial items — animate up when open */}
        {QUICK_ADD_ITEMS.map((item, i) => (
          <div
            key={item.label}
            className={cn(
              'flex items-center gap-2 transition-all duration-200',
              open
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0 pointer-events-none',
            )}
            style={{ transitionDelay: open ? `${i * 35}ms` : '0ms' }}
          >
            <span className="font-terminal text-[0.55rem] tracking-widest text-zinc-500">
              {item.label}
            </span>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex h-10 w-10 items-center justify-center border shadow-lg transition-colors',
                item.ring,
                item.bg,
                item.text,
              )}
              title={`Quick add — ${item.label.toLowerCase()}`}
            >
              <item.icon className="h-4 w-4" />
            </Link>
          </div>
        ))}

        {/* Main + / × button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'flex h-12 w-12 items-center justify-center border shadow-[0_8px_24px_rgba(234,88,12,0.3)] transition-all duration-200',
            open
              ? 'rotate-45 border-orange-600 bg-orange-600 text-white hover:bg-orange-500'
              : 'border-orange-700 bg-orange-600 text-white hover:bg-orange-500',
          )}
          title="Quick Add"
          aria-label={open ? 'Close quick add' : 'Open quick add'}
          aria-expanded={open}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
