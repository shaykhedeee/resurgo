'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Quick Actions Widget (Dashboard)
// One-tap shortcuts for water, meal, workout, sleep, task
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';



type ActiveForm = 'water' | 'meal' | 'workout' | 'task' | null;

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function QuickActionsWidget() {
  const [active, setActive] = useState<ActiveForm>(null);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState('');

  // Mutations
  const addWater = useMutation(api.nutrition.updateWaterAndSteps);
  const logMeal = useMutation(api.nutrition.logMeal);
  const logWorkout = useMutation(api.fitness.logWorkout);
  const createTask = useMutation(api.tasks.create);

  // Form state
  const [waterMl, setWaterMl] = useState('250');
  const [mealName, setMealName] = useState('');
  const [mealCals, setMealCals] = useState('');
  const [workoutType, setWorkoutType] = useState<'cardio' | 'strength' | 'flexibility' | 'sport' | 'other'>('strength');
  const [workoutMin, setWorkoutMin] = useState('30');
  const [taskTitle, setTaskTitle] = useState('');

  function showFlash(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(''), 2500);
  }

  async function submitWater() {
    setLoading(true);
    try {
      await addWater({ date: todayDate(), waterMl: parseInt(waterMl) || 250 });
      showFlash(`✓ +${waterMl}ml LOGGED`);
      setActive(null);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function submitMeal() {
    if (!mealName.trim()) return;
    setLoading(true);
    try {
      await logMeal({
        date: todayDate(),
        meal: { name: mealName.trim(), calories: parseInt(mealCals) || 0 },
      });
      showFlash('✓ MEAL_LOGGED');
      setMealName(''); setMealCals('');
      setActive(null);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function submitWorkout() {
    setLoading(true);
    try {
      await logWorkout({ date: todayDate(), type: workoutType, durationMinutes: parseInt(workoutMin) || 30 });
      showFlash('✓ WORKOUT_LOGGED');
      setActive(null);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function submitTask() {
    if (!taskTitle.trim()) return;
    setLoading(true);
    try {
      await createTask({ title: taskTitle.trim(), priority: 'medium' });
      showFlash('✓ TASK_ADDED');
      setTaskTitle('');
      setActive(null);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  const ACTIONS = [
    { id: 'water' as const, label: '💧 WATER', color: 'hover:border-blue-700 hover:text-blue-400' },
    { id: 'meal' as const, label: '🥗 MEAL', color: 'hover:border-green-700 hover:text-green-400' },
    { id: 'workout' as const, label: '🏋️ WORKOUT', color: 'hover:border-red-700 hover:text-red-400' },
    { id: 'task' as const, label: '✓ TASK', color: 'hover:border-orange-700 hover:text-orange-400' },
  ];

  return (
    <div className="border border-zinc-900 bg-black h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-900 px-3 py-1.5">
        <span className="font-pixel text-[0.5rem] tracking-widest text-zinc-600">QUICK_ACTIONS</span>
      </div>

      {/* Action buttons */}
      <div className="px-3 pt-3 grid grid-cols-2 gap-1.5">
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => setActive(active === action.id ? null : action.id)}
            className={`font-pixel text-[0.4rem] tracking-widest py-2 border transition-colors ${
              active === action.id
                ? 'border-orange-700 text-orange-400 bg-orange-950'
                : `border-zinc-800 text-zinc-500 ${action.color}`
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Flash message */}
      {flash && (
        <p className="px-3 mt-2 font-pixel text-[0.4rem] tracking-widest text-green-400">{flash}</p>
      )}

      {/* Active form */}
      <div className="flex-1 px-3 pt-2 pb-3">
        {active === 'water' && (
          <div className="space-y-2">
            <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-600">AMOUNT (ml):</p>
            <div className="flex gap-1.5">
              {['150', '250', '350', '500'].map((ml) => (
                <button
                  key={ml}
                  onClick={() => setWaterMl(ml)}
                  className={`font-terminal text-xs px-2 py-1 border transition-colors ${waterMl === ml ? 'border-blue-700 text-blue-400' : 'border-zinc-800 text-zinc-600'}`}
                >
                  {ml}
                </button>
              ))}
            </div>
            <button onClick={submitWater} disabled={loading} className="w-full font-pixel text-[0.4rem] tracking-widest py-1.5 border border-blue-900 text-blue-400 hover:bg-blue-950 disabled:opacity-40 transition-colors">
              {loading ? 'LOGGING_' : '[ LOG_WATER ]'}
            </button>
          </div>
        )}

        {active === 'meal' && (
          <div className="space-y-2">
            <input type="text" value={mealName} onChange={(e) => setMealName(e.target.value)} placeholder="meal name..." className="w-full bg-transparent border-b border-zinc-800 font-terminal text-sm text-zinc-300 placeholder:text-zinc-700 outline-none pb-0.5" />
            <input type="number" value={mealCals} onChange={(e) => setMealCals(e.target.value)} placeholder="calories (optional)" className="w-full bg-transparent border-b border-zinc-800 font-terminal text-sm text-zinc-300 placeholder:text-zinc-700 outline-none pb-0.5" />
            <button onClick={submitMeal} disabled={loading || !mealName.trim()} className="w-full font-pixel text-[0.4rem] tracking-widest py-1.5 border border-green-900 text-green-400 hover:bg-green-950 disabled:opacity-40 transition-colors">
              {loading ? 'LOGGING_' : '[ LOG_MEAL ]'}
            </button>
          </div>
        )}

        {active === 'workout' && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {(['cardio', 'strength', 'flexibility', 'sport', 'other'] as const).map((t) => (
                <button key={t} onClick={() => setWorkoutType(t)} className={`font-pixel text-[0.35rem] tracking-widest px-1.5 py-0.5 border transition-colors uppercase ${workoutType === t ? 'border-red-700 text-red-400' : 'border-zinc-800 text-zinc-600'}`}>{t}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[0.38rem] tracking-widest text-zinc-600">DURATION:</span>
              <input type="number" value={workoutMin} onChange={(e) => setWorkoutMin(e.target.value)} className="w-16 bg-transparent border-b border-zinc-800 font-terminal text-sm text-zinc-300 outline-none pb-0.5" />
              <span className="font-terminal text-xs text-zinc-600">min</span>
            </div>
            <button onClick={submitWorkout} disabled={loading} className="w-full font-pixel text-[0.4rem] tracking-widest py-1.5 border border-red-900 text-red-400 hover:bg-red-950 disabled:opacity-40 transition-colors">
              {loading ? 'LOGGING_' : '[ LOG_WORKOUT ]'}
            </button>
          </div>
        )}

        {active === 'task' && (
          <div className="space-y-2">
            <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitTask()} placeholder="task title..." className="w-full bg-transparent border-b border-zinc-800 font-terminal text-sm text-zinc-300 placeholder:text-zinc-700 outline-none pb-0.5" />
            <button onClick={submitTask} disabled={loading || !taskTitle.trim()} className="w-full font-pixel text-[0.4rem] tracking-widest py-1.5 border border-orange-900 text-orange-400 hover:bg-orange-950 disabled:opacity-40 transition-colors">
              {loading ? 'ADDING_' : '[ ADD_TASK ]'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
