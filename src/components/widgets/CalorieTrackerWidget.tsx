'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Calorie & Macro Tracker Widget (Dashboard)
// Shows daily calorie intake, macros breakdown, and quick-log meal button
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Flame, Plus, UtensilsCrossed, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const QUICK_MEALS = [
  { name: 'Light Snack', cal: 150, p: 5, c: 20, f: 5, icon: '🍎' },
  { name: 'Small Meal', cal: 400, p: 25, c: 40, f: 15, icon: '🥗' },
  { name: 'Full Meal', cal: 700, p: 40, c: 60, f: 25, icon: '🍽️' },
  { name: 'Protein Shake', cal: 200, p: 30, c: 10, f: 5, icon: '🥤' },
];

export default function CalorieTrackerWidget() {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayNutrition = useQuery(api.nutrition.getNutritionLog, { date: todayStr });
  const logMeal = useMutation(api.nutrition.logMeal);
  const [logging, setLogging] = useState(false);

  const totalCal = (todayNutrition as any)?.totalCalories ?? 0;
  const totalProtein = (todayNutrition as any)?.totalProtein ?? 0;
  const totalCarbs = (todayNutrition as any)?.totalCarbs ?? 0;
  const totalFat = (todayNutrition as any)?.totalFat ?? 0;
  const calGoal = (todayNutrition as any)?.calorieGoal ?? 2000;
  const calPercent = Math.min(100, Math.round((totalCal / calGoal) * 100));
  const mealsCount = (todayNutrition as any)?.meals?.length ?? 0;

  const handleQuickLog = useCallback(async (meal: typeof QUICK_MEALS[0]) => {
    setLogging(true);
    try {
      await logMeal({
        date: todayStr,
        meal: {
          name: meal.name,
          calories: meal.cal,
          protein: meal.p,
          carbs: meal.c,
          fat: meal.f,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        },
        calorieGoal: calGoal,
      });
    } catch (e) {
      console.error('Failed to log meal:', e);
    }
    setLogging(false);
  }, [logMeal, todayStr, calGoal]);

  // Macro bar widths (relative proportion)
  const macroTotal = totalProtein + totalCarbs + totalFat || 1;
  const proteinPct = Math.round((totalProtein / macroTotal) * 100);
  const carbsPct = Math.round((totalCarbs / macroTotal) * 100);
  const fatPct = 100 - proteinPct - carbsPct;

  return (
    <div className="border border-zinc-900 bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
        <UtensilsCrossed className="h-3.5 w-3.5 text-amber-500" />
        <span className="font-pixel text-[0.6rem] tracking-widest text-amber-500">NUTRITION</span>
        <span className="ml-auto font-terminal text-xs text-zinc-400">
          {mealsCount} meal{mealsCount !== 1 ? 's' : ''} logged
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* Calorie donut */}
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0">
            <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#27272a" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke={calPercent >= 100 ? '#22c55e' : calPercent >= 75 ? '#f59e0b' : '#ef4444'}
                strokeWidth="3"
                strokeDasharray={`${calPercent * 0.942} 100`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-terminal text-xs font-bold text-zinc-100">{totalCal}</span>
              <span className="font-pixel text-[0.3rem] tracking-widest text-zinc-500">KCAL</span>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between">
              <span className="font-terminal text-xs text-zinc-400">Goal</span>
              <span className="font-terminal text-xs text-zinc-300">{calGoal} kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="font-terminal text-xs text-zinc-400">Remaining</span>
              <span className={`font-terminal text-xs ${calGoal - totalCal > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {calGoal - totalCal > 0 ? calGoal - totalCal : 'Over by ' + (totalCal - calGoal)} kcal
              </span>
            </div>
          </div>
        </div>

        {/* Macro breakdown bar */}
        {macroTotal > 1 && (
          <div className="space-y-1.5">
            <div className="flex h-2 w-full overflow-hidden border border-zinc-800">
              <div className="bg-blue-500 transition-all duration-500" style={{ width: `${proteinPct}%` }} />
              <div className="bg-amber-500 transition-all duration-500" style={{ width: `${carbsPct}%` }} />
              <div className="bg-rose-500 transition-all duration-500" style={{ width: `${fatPct}%` }} />
            </div>
            <div className="flex justify-between font-pixel text-[0.35rem] tracking-widest">
              <span className="text-blue-400">P {totalProtein}g</span>
              <span className="text-amber-400">C {totalCarbs}g</span>
              <span className="text-rose-400">F {totalFat}g</span>
            </div>
          </div>
        )}

        {/* Quick-log buttons */}
        <div className="grid grid-cols-4 gap-1.5">
          {QUICK_MEALS.map((m) => (
            <button
              key={m.name}
              onClick={() => handleQuickLog(m)}
              disabled={logging}
              className="flex flex-col items-center gap-0.5 border border-zinc-800 bg-zinc-900 px-1 py-2 font-terminal text-xs transition hover:border-amber-700 hover:bg-amber-950/20 disabled:opacity-50"
            >
              <span className="text-sm">{m.icon}</span>
              <span className="font-pixel text-[0.3rem] tracking-widest text-zinc-400">{m.cal}</span>
            </button>
          ))}
        </div>

        <Link
          href="/food"
          className="flex items-center justify-center gap-1.5 border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-terminal text-xs text-zinc-400 transition hover:border-amber-700 hover:text-amber-400"
        >
          <Plus className="h-3 w-3" /> Log Custom Meal
          <ArrowRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
    </div>
  );
}
