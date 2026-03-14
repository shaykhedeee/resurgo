'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Quick Journal Widget (Dashboard)
// Fast mood + note capture without navigating away
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { PenLine, Check, Loader2 } from 'lucide-react';

const MOODS = [
  { value: 1, emoji: '😔', label: 'Low' },
  { value: 2, emoji: '😕', label: 'Meh' },
  { value: 3, emoji: '😐', label: 'OK' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '🔥', label: 'Great' },
];

const ENERGY_LEVELS = [
  { value: 1, bar: '▁', label: 'Empty' },
  { value: 2, bar: '▂', label: 'Low' },
  { value: 3, bar: '▄', label: 'Mid' },
  { value: 4, bar: '▆', label: 'High' },
  { value: 5, bar: '█', label: 'Peak' },
];

export default function QuickJournalWidget() {
  const [mood, setMood] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const todayCheckIn = useQuery(api.dailyCheckIns.getToday);
  const saveMorning = useMutation(api.dailyCheckIns.saveMorning);

  const alreadyDone = !!todayCheckIn?.morningCompletedAt;

  const handleSave = useCallback(async () => {
    if (mood === 0 || saving) return;
    setSaving(true);
    try {
      await saveMorning({
        mood,
        energy: energy || 3,
        sleepQuality: 3,
        intention: note || undefined,
        topThreePriorities: [],
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setMood(0);
      setEnergy(0);
      setNote('');
    } catch (e) {
      console.error('Quick journal save failed:', e);
    }
    setSaving(false);
  }, [mood, energy, note, saving, saveMorning]);

  return (
    <div className="border border-zinc-900 bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
        <PenLine className="h-3.5 w-3.5 text-violet-500" />
        <span className="font-pixel text-[0.6rem] tracking-widest text-violet-500">QUICK_JOURNAL</span>
        {alreadyDone && (
          <span className="ml-auto flex items-center gap-1 font-terminal text-xs text-emerald-500">
            <Check className="h-3 w-3" /> Done today
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        {alreadyDone ? (
          <div className="space-y-2">
            <p className="font-terminal text-sm text-zinc-300">
              Mood: {MOODS.find((m) => m.value === (todayCheckIn?.morningMood ?? 0))?.emoji ?? '—'}{' '}
              Energy: {ENERGY_LEVELS.find((e) => e.value === (todayCheckIn?.morningEnergy ?? 0))?.bar ?? '—'}
            </p>
            {todayCheckIn?.morningIntention && (
              <p className="font-terminal text-xs text-zinc-400 italic">
                &quot;{todayCheckIn.morningIntention}&quot;
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Mood selector */}
            <div>
              <span className="font-pixel text-[0.45rem] tracking-widest text-zinc-500">MOOD</span>
              <div className="mt-1 flex gap-1">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`flex-1 border py-1.5 text-center text-lg transition ${
                      mood === m.value
                        ? 'border-violet-600 bg-violet-950/30'
                        : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                    }`}
                    title={m.label}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy selector */}
            <div>
              <span className="font-pixel text-[0.45rem] tracking-widest text-zinc-500">ENERGY</span>
              <div className="mt-1 flex gap-1">
                {ENERGY_LEVELS.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => setEnergy(e.value)}
                    className={`flex-1 border py-1.5 text-center font-mono text-lg transition ${
                      energy === e.value
                        ? 'border-orange-600 bg-orange-950/30 text-orange-400'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-700'
                    }`}
                    title={e.label}
                  >
                    {e.bar}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick note */}
            <textarea
              placeholder="How are you feeling? (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full resize-none border border-zinc-800 bg-zinc-900 px-3 py-2 font-terminal text-xs text-zinc-300 placeholder-zinc-600 outline-none focus:border-violet-700"
            />

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={mood === 0 || saving}
              className="flex w-full items-center justify-center gap-1.5 border border-violet-700 bg-violet-950/30 px-4 py-2 font-terminal text-xs text-violet-400 transition hover:bg-violet-950/50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : saved ? (
                <>
                  <Check className="h-3 w-3" /> Saved!
                </>
              ) : (
                <>
                  <PenLine className="h-3 w-3" /> Log Entry
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
