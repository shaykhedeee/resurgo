'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Quick Add Command Palette (⌘K / Ctrl+K)
// Add tasks, habits, or goals from anywhere on the dashboard
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Target,
  Flame,
  X,
  Zap,
  ChevronRight,
  Command,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ItemType = 'task' | 'goal' | 'habit';

interface QuickAddPaletteProps {
  open: boolean;
  onClose: () => void;
}

const TYPE_OPTIONS: {
  id: ItemType;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  placeholder: string;
}[] = [
  {
    id: 'task',
    label: 'TASK',
    icon: CheckCircle2,
    color: 'text-orange-400',
    bg: 'border-orange-800 bg-orange-950/30',
    placeholder: 'e.g. Finish report by Friday',
  },
  {
    id: 'goal',
    label: 'GOAL',
    icon: Target,
    color: 'text-cyan-400',
    bg: 'border-cyan-800 bg-cyan-950/30',
    placeholder: 'e.g. Run a half marathon',
  },
  {
    id: 'habit',
    label: 'HABIT',
    icon: Flame,
    color: 'text-emerald-400',
    bg: 'border-emerald-800 bg-emerald-950/30',
    placeholder: 'e.g. Meditate for 10 minutes',
  },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', cls: 'text-zinc-400 border-zinc-700' },
  { value: 'medium', label: 'Med', cls: 'text-yellow-400 border-yellow-800' },
  { value: 'high', label: 'High', cls: 'text-orange-400 border-orange-800' },
  { value: 'urgent', label: '!!', cls: 'text-red-400 border-red-800' },
] as const;

const HABIT_FREQ_OPTIONS = [
  { value: 'daily' as const, label: 'Daily' },
  { value: 'weekdays' as const, label: 'Weekdays' },
  { value: 'weekly' as const, label: 'Weekly' },
  { value: '3x_week' as const, label: '3×/wk' },
] as const;

const CATEGORY_PRESETS = [
  'health', 'career', 'finance', 'learning',
  'fitness', 'mindfulness', 'creativity', 'personal',
];

export default function QuickAddPalette({ open, onClose }: QuickAddPaletteProps) {
  const [itemType, setItemType] = useState<ItemType>('task');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Task-specific
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  // Goal-specific
  const [category, setCategory] = useState('personal');

  // Habit-specific
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'weekly' | '3x_week'>('daily');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('morning');

  const inputRef = useRef<HTMLInputElement>(null);
  const createTask = useMutation(api.tasks.create);
  const createGoal = useMutation(api.goals.create);
  const createHabit = useMutation(api.habits.create);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTitle('');
      setSuccess(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Keyboard shortcut to open/close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose();
      }
      if (open && e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = title.trim();
      if (!text) return;

      setSaving(true);
      try {
        if (itemType === 'task') {
          await createTask({ title: text, priority });
          setSuccess('Task added');
        } else if (itemType === 'goal') {
          await createGoal({ title: text, category });
          setSuccess('Goal created');
        } else {
          await createHabit({
            title: text,
            category: 'personal',
            frequency,
            timeOfDay,
          });
          setSuccess('Habit started');
        }
        setTitle('');
        // Auto-close after success flash
        setTimeout(() => {
          setSuccess(null);
          onClose();
        }, 800);
      } catch (err) {
        console.error('QuickAdd failed:', err);
      }
      setSaving(false);
    },
    [title, itemType, priority, category, frequency, timeOfDay, createTask, createGoal, createHabit, onClose],
  );

  const current = TYPE_OPTIONS.find((t) => t.id === itemType)!;
  const Icon = current.icon;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="fixed inset-x-4 top-[15vh] z-50 mx-auto max-w-lg border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/40 md:inset-x-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="font-pixel text-[0.5rem] tracking-widest text-orange-400">QUICK_ADD</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="hidden items-center gap-0.5 rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 font-terminal text-[0.65rem] text-zinc-500 md:flex">
                  <Command className="h-2.5 w-2.5" />K
                </kbd>
                <button
                  onClick={onClose}
                  className="rounded p-1 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Type Selector */}
            <div className="flex gap-1.5 border-b border-zinc-800 px-4 py-2.5">
              {TYPE_OPTIONS.map((opt) => {
                const OptIcon = opt.icon;
                const isActive = itemType === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setItemType(opt.id)}
                    className={cn(
                      'flex items-center gap-1.5 border px-3 py-1.5 font-terminal text-xs transition',
                      isActive ? opt.bg + ' ' + opt.color : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300',
                    )}
                  >
                    <OptIcon className="h-3.5 w-3.5" />
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Success Flash */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-b border-emerald-800 bg-emerald-950/30 px-4 py-2 font-terminal text-sm text-emerald-400"
                >
                  ✓ {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Icon className={cn('h-5 w-5 shrink-0', current.color)} />
                <input
                  ref={inputRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={current.placeholder}
                  disabled={saving}
                  className="flex-1 bg-transparent font-terminal text-base text-zinc-100 placeholder-zinc-600 outline-none"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={saving || !title.trim()}
                  className={cn(
                    'flex shrink-0 items-center gap-1 border px-3 py-1.5 font-terminal text-xs transition',
                    title.trim()
                      ? 'border-orange-700 bg-orange-600 text-black hover:bg-orange-500'
                      : 'border-zinc-800 text-zinc-600',
                    'disabled:opacity-40',
                  )}
                >
                  {saving ? '...' : 'ADD'}
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* Type-specific options */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {itemType === 'task' && (
                  <>
                    {PRIORITY_OPTIONS.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPriority(p.value)}
                        className={cn(
                          'border px-2 py-1 font-terminal text-xs transition',
                          priority === p.value ? p.cls + ' bg-zinc-900' : 'border-zinc-800 text-zinc-600 hover:text-zinc-400',
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </>
                )}

                {itemType === 'goal' && (
                  <>
                    {CATEGORY_PRESETS.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={cn(
                          'border px-2 py-1 font-terminal text-xs capitalize transition',
                          category === cat
                            ? 'border-cyan-800 bg-cyan-950/30 text-cyan-400'
                            : 'border-zinc-800 text-zinc-600 hover:text-zinc-400',
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </>
                )}

                {itemType === 'habit' && (
                  <>
                    {HABIT_FREQ_OPTIONS.map((f) => (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => setFrequency(f.value)}
                        className={cn(
                          'border px-2 py-1 font-terminal text-xs transition',
                          frequency === f.value
                            ? 'border-emerald-800 bg-emerald-950/30 text-emerald-400'
                            : 'border-zinc-800 text-zinc-600 hover:text-zinc-400',
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                    <span className="mx-1 border-l border-zinc-800" />
                    {(['morning', 'afternoon', 'evening', 'anytime'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTimeOfDay(t)}
                        className={cn(
                          'border px-2 py-1 font-terminal text-xs capitalize transition',
                          timeOfDay === t
                            ? 'border-emerald-800 bg-emerald-950/30 text-emerald-400'
                            : 'border-zinc-800 text-zinc-600 hover:text-zinc-400',
                        )}
                      >
                        {t === 'anytime' ? 'Any' : t.slice(0, 4)}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </form>

            {/* Footer hint */}
            <div className="border-t border-zinc-800 px-4 py-2">
              <p className="font-terminal text-xs text-zinc-600">
                Type your {itemType} title and press Enter or click ADD.{' '}
                <span className="text-zinc-700">Tab to switch type.</span>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
