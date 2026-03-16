'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Sleep Widget (Dashboard)
// Shows last sleep entry; inline form to log sleep quickly
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Link from 'next/link';

function qualityLabel(q: number): string {
  const labels = ['', 'POOR', 'FAIR', 'OK', 'GOOD', 'GREAT'];
  return labels[q] ?? '?';
}

function qualityColor(q: number): string {
  if (q >= 4) return 'text-green-400';
  if (q === 3) return 'text-yellow-400';
  return 'text-red-400';
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function yesterdayDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export default function SleepWidget() {
  const [showForm, setShowForm] = useState(false);
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState(3);
  const [logging, setLogging] = useState(false);
  const [saved, setSaved] = useState(false);

  const logSleep = useMutation(api.sleep.logSleep);

  // Show last 1 entry
  const logs = useQuery(api.sleep.listSleepLogs, { days: 1 });
  const last = logs?.[0];

  async function handleLog(e: React.FormEvent) {
    e.preventDefault();
    setLogging(true);
    try {
      // Log for yesterday's date (since you're logging morning after)
      await logSleep({
        date: yesterdayDate(),
        bedtime,
        wakeTime,
        quality,
      });
      setSaved(true);
      setShowForm(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setLogging(false);
    }
  }

  return (
    <div className="border border-zinc-900 bg-black h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-900 px-3 py-1.5 flex items-center justify-between">
        <span className="font-pixel text-[0.5rem] tracking-widest text-zinc-600">SLEEP_LOG</span>
        <Link
          href="/wellness"
          className="font-pixel text-[0.4rem] tracking-widest text-zinc-700 hover:text-orange-500 transition-colors"
        >
          HISTORY →
        </Link>
      </div>

      {/* Last entry */}
      <div className="px-3 py-3 flex-1">
        {logs === undefined ? (
          <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-700">LOADING_</p>
        ) : !last ? (
          <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-600">[ NO_SLEEP_DATA ]</p>
        ) : (
          <div className="space-y-1">
            <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-600">LAST ENTRY · {last.date}</p>
            <div className="flex items-end gap-3">
              <span
                className="font-pixel text-xl text-orange-400"
                style={{ textShadow: '0 0 8px rgba(251,146,60,0.5)' }}
              >
                {last.durationMinutes ? formatDuration(last.durationMinutes) : '--'}
              </span>
              {last.quality && (
                <span className={`font-pixel text-[0.5rem] tracking-widest pb-0.5 ${qualityColor(last.quality)}`}>
                  {qualityLabel(last.quality)}
                </span>
              )}
            </div>
            {last.bedtime && last.wakeTime && (
              <p className="font-terminal text-xs text-zinc-600">
                {last.bedtime} → {last.wakeTime}
              </p>
            )}
          </div>
        )}

        {saved && (
          <p className="mt-2 font-pixel text-[0.38rem] tracking-widest text-green-500">✓ SLEEP_LOGGED</p>
        )}
      </div>

      {/* Log form */}
      {showForm ? (
        <form onSubmit={handleLog} className="px-3 pb-3 border-t border-zinc-900 pt-2 space-y-2">
          <p className="font-pixel text-[0.4rem] tracking-widest text-zinc-600">LOG_LAST_NIGHT:</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-pixel text-[0.35rem] tracking-widest text-zinc-700 block mb-0.5">BED</label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 font-terminal text-sm text-zinc-300 px-2 py-0.5 outline-none focus:border-orange-800"
              />
            </div>
            <div>
              <label className="font-pixel text-[0.35rem] tracking-widest text-zinc-700 block mb-0.5">WAKE</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 font-terminal text-sm text-zinc-300 px-2 py-0.5 outline-none focus:border-orange-800"
              />
            </div>
          </div>
          <div>
            <label className="font-pixel text-[0.35rem] tracking-widest text-zinc-700 block mb-1">QUALITY</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuality(q)}
                  className={`w-7 h-7 border font-pixel text-[0.5rem] transition-colors ${
                    quality === q
                      ? 'border-orange-600 text-orange-400 bg-orange-950'
                      : 'border-zinc-800 text-zinc-600 hover:border-zinc-600'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={logging}
              className="flex-1 font-pixel text-[0.45rem] tracking-widest py-1 border border-orange-900 text-orange-400 hover:bg-orange-950 disabled:opacity-40 transition-colors"
            >
              {logging ? 'LOGGING_' : '[ SAVE ]'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="font-pixel text-[0.45rem] tracking-widest px-2 py-1 border border-zinc-800 text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              ✕
            </button>
          </div>
        </form>
      ) : (
        <div className="px-3 pb-3">
          <button
            onClick={() => setShowForm(true)}
            className="w-full font-pixel text-[0.45rem] tracking-widest py-1.5 border border-zinc-800 text-zinc-500 hover:border-orange-800 hover:text-orange-500 transition-colors"
          >
            + LOG_SLEEP
          </button>
        </div>
      )}
    </div>
  );
}
