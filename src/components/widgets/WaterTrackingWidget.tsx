'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Water / Hydration Tracking Widget (Dashboard)
// Visual glass fill, quick-add buttons, daily goal progress
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Droplets } from 'lucide-react';

const WATER_GOAL_ML = 2500;

const QUICK_OPTIONS = [
  { label: '150ml', ml: 150, icon: '🥛' },
  { label: '250ml', ml: 250, icon: '🥤' },
  { label: '500ml', ml: 500, icon: '🍶' },
  { label: '750ml', ml: 750, icon: '💧' },
];

export default function WaterTrackingWidget() {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayNutrition = useQuery(api.nutrition.getNutritionLog, { date: todayStr });
  const updateWater = useMutation(api.nutrition.updateWaterAndSteps);
  const [loading, setLoading] = useState(false);

  const currentWater = (todayNutrition?.waterMl as number) ?? 0;
  const percent = Math.min(100, Math.round((currentWater / WATER_GOAL_ML) * 100));

  const handleAdd = useCallback(
    async (ml: number) => {
      setLoading(true);
      try {
        await updateWater({ date: todayStr, waterMl: currentWater + ml });
      } catch (e) {
        console.error('Failed to log water:', e);
      }
      setLoading(false);
    },
    [updateWater, todayStr, currentWater],
  );

  return (
    <div className="border border-zinc-900 bg-zinc-950 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
        <Droplets className="h-3.5 w-3.5 text-cyan-500" />
        <span className="font-pixel text-[0.6rem] tracking-widest text-cyan-500">HYDRATION</span>
        <span className="ml-auto font-terminal text-xs text-zinc-400">
          {currentWater}ml / {WATER_GOAL_ML}ml
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* Water visual */}
        <div className="flex items-end justify-between">
          <div className="relative h-24 w-14 border border-cyan-900/50 bg-zinc-900 overflow-hidden rounded-b-md">
            <div
              className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-700 to-cyan-500/60 transition-all duration-700"
              style={{ height: `${percent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-pixel text-[0.55rem] tracking-widest text-white drop-shadow-md">
                {percent}%
              </span>
            </div>
          </div>
          <div className="flex-1 ml-4 space-y-1">
            <p className="font-terminal text-2xl font-bold text-zinc-100">
              {currentWater}
              <span className="text-sm text-zinc-500">ml</span>
            </p>
            <p className="font-terminal text-xs text-zinc-500">
              {percent >= 100 ? '✓ Goal reached!' : `${WATER_GOAL_ML - currentWater}ml remaining`}
            </p>
          </div>
        </div>

        {/* Quick-add buttons */}
        <div className="grid grid-cols-4 gap-1.5">
          {QUICK_OPTIONS.map((opt) => (
            <button
              key={opt.ml}
              onClick={() => handleAdd(opt.ml)}
              disabled={loading}
              className="flex flex-col items-center gap-0.5 border border-zinc-800 bg-zinc-900 px-2 py-2 font-terminal text-xs text-cyan-400 transition hover:border-cyan-700 hover:bg-cyan-950/20 disabled:opacity-50"
            >
              <span className="text-sm">{opt.icon}</span>
              <span className="font-pixel text-[0.35rem] tracking-widest">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
