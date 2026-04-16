'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Food Page
// Meal Planner · Calorie Tracker · Water Tracker · Nutrition Summary
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState, useEffect, useRef, type FormEvent } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Droplets, BarChart3, Utensils, Plus, Leaf, Search, ChefHat, X, Loader2 } from 'lucide-react';

type Tab = 'meals' | 'water' | 'calories' | 'summary' | 'recipes';

interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  source: string;
}

interface Ingredient { name: string; measure: string; }
interface Recipe {
  id: string;
  name: string;
  category?: string;
  cuisine?: string;
  thumbnail?: string;
  ingredients: Ingredient[];
  instructions?: string;
  youtubeUrl?: string;
}

interface MealEntry {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  time?: string;
}

const MEAL_PRESETS = [
  { name: 'Protein Shake',    calories: 180, protein: 30, carbs: 8,  fat: 3,  meal: 'breakfast' },
  { name: 'Chicken + Rice',   calories: 550, protein: 45, carbs: 60, fat: 8,  meal: 'lunch'     },
  { name: 'Salmon + Veg',     calories: 480, protein: 40, carbs: 20, fat: 22, meal: 'dinner'    },
  { name: 'Greek Yogurt',     calories: 150, protein: 17, carbs: 8,  fat: 4,  meal: 'snack'     },
  { name: 'Oats + Berries',   calories: 320, protein: 10, carbs: 55, fat: 6,  meal: 'breakfast' },
  { name: 'Mixed Nuts',       calories: 200, protein: 5,  carbs: 6,  fat: 18, meal: 'snack'     },
  { name: 'Egg Whites + Toast', calories: 220, protein: 22, carbs: 24, fat: 3, meal: 'breakfast' },
  { name: 'Turkey Wrap',      calories: 380, protein: 32, carbs: 35, fat: 10, meal: 'lunch'     },
  { name: 'Tuna Salad',       calories: 300, protein: 35, carbs: 12, fat: 12, meal: 'lunch'     },
  { name: 'Stir-Fry Tofu',    calories: 350, protein: 22, carbs: 30, fat: 14, meal: 'dinner'    },
  { name: 'Cottage Cheese',   calories: 120, protein: 14, carbs: 5,  fat: 5,  meal: 'snack'     },
  { name: 'Banana + PB',      calories: 260, protein: 8,  carbs: 34, fat: 12, meal: 'snack'     },
];

// Dynamic daily goals based on goal type — users can customize in settings
const GOAL_PROFILES = {
  maintain:     { calories: 2200, protein: 160, carbs: 220, fat: 70,  water: 2500 },
  lose_weight:  { calories: 1800, protein: 180, carbs: 150, fat: 60,  water: 3000 },
  build_muscle: { calories: 2800, protein: 200, carbs: 300, fat: 80,  water: 3000 },
  performance:  { calories: 2500, protein: 170, carbs: 280, fat: 75,  water: 3500 },
} as const;
type GoalProfile = keyof typeof GOAL_PROFILES;
const DEFAULT_PROFILE: GoalProfile = 'maintain';
const DAILY_GOALS = GOAL_PROFILES[DEFAULT_PROFILE];
const WATER_AMOUNTS = [250, 330, 500, 750];

export default function FoodPage() {
  const [tab, setTab] = useState<Tab>('meals');

  // Meal form state
  const [mealName, setMealName] = useState('');
  const [mealCals, setMealCals] = useState('');
  const [mealProtein, setMealProtein] = useState('');
  const [mealCarbs, setMealCarbs] = useState('');
  const [mealFat, setMealFat] = useState('');
  const [mealSaving, setMealSaving] = useState(false);

  // Water form state
  const [waterMl, setWaterMl] = useState('');
  const [waterSaving, setWaterSaving] = useState(false);

  // Food search state
  const [foodQuery, setFoodQuery] = useState('');
  const [foodResults, setFoodResults] = useState<FoodItem[]>([]);
  const [foodSearching, setFoodSearching] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Recipe search state
  const [recipeQuery, setRecipeQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeSearching, setRecipeSearching] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  // Debounced food search
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (!foodQuery.trim() || foodQuery.trim().length < 2) { setFoodResults([]); return; }
    searchTimerRef.current = setTimeout(async () => {
      setFoodSearching(true);
      try {
        const res = await fetch(`/api/food/search?q=${encodeURIComponent(foodQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setFoodResults(data.results ?? []);
        }
      } catch { /* ignore */ }
      finally { setFoodSearching(false); }
    }, 500);
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [foodQuery]);

  const handleRecipeSearch = async () => {
    if (!recipeQuery.trim() || recipeSearching) return;
    setRecipeSearching(true);
    try {
      const res = await fetch(`/api/food/recipes?q=${encodeURIComponent(recipeQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setRecipes(data.results ?? []);
      }
    } catch { /* ignore */ }
    finally { setRecipeSearching(false); }
  };

  const today = new Date().toISOString().split('T')[0];

  // Convex queries
  const todayNutrition = useQuery(api.nutrition.getNutritionLog, { date: today });

  // Mutations
  const logMeal = useMutation(api.nutrition.logMeal);
  const updateHydration = useMutation(api.nutrition.updateWaterAndSteps);

  const totalCalories = todayNutrition?.totalCalories ?? 0;
  const totalProtein = todayNutrition?.totalProtein ?? 0;
  const totalCarbs = todayNutrition?.totalCarbs ?? 0;
  const totalFat = todayNutrition?.totalFat ?? 0;
  const waterMlLogged = todayNutrition?.waterMl ?? 0;

  const calPct = Math.min(100, Math.round((totalCalories / DAILY_GOALS.calories) * 100));
  const proteinPct = Math.min(100, Math.round((totalProtein / DAILY_GOALS.protein) * 100));
  const carbsPct = Math.min(100, Math.round((totalCarbs / DAILY_GOALS.carbs) * 100));
  const fatPct = Math.min(100, Math.round((totalFat / DAILY_GOALS.fat) * 100));
  const waterPct = Math.min(100, Math.round((waterMlLogged / DAILY_GOALS.water) * 100));

  const handleMealSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!mealName || !mealCals || mealSaving) return;
    setMealSaving(true);
    try {
      await logMeal({
        date: today,
        meal: {
          name: mealName,
          calories: parseFloat(mealCals),
          protein: mealProtein ? parseFloat(mealProtein) : undefined,
          carbs: mealCarbs ? parseFloat(mealCarbs) : undefined,
          fat: mealFat ? parseFloat(mealFat) : undefined,
          time: new Date().toTimeString().slice(0, 5),
        },
      });
      setMealName(''); setMealCals(''); setMealProtein(''); setMealCarbs(''); setMealFat('');
    } finally {
      setMealSaving(false);
    }
  };

  const handlePresetLog = async (preset: typeof MEAL_PRESETS[number]) => {
    if (mealSaving) return;
    setMealSaving(true);
    try {
      await logMeal({
        date: today,
        meal: {
          name: preset.name,
          calories: preset.calories,
          protein: preset.protein,
          carbs: preset.carbs,
          fat: preset.fat,
          time: new Date().toTimeString().slice(0, 5),
        },
      });
    } finally {
      setMealSaving(false);
    }
  };

  const handleWaterAdd = async (ml: number) => {
    if (waterSaving) return;
    setWaterSaving(true);
    try {
      await updateHydration({ date: today, waterMl: waterMlLogged + ml });
    } finally {
      setWaterSaving(false);
    }
  };

  const handleCustomWater = async () => {
    if (!waterMl || waterSaving) return;
    setWaterSaving(true);
    try {
      await updateHydration({ date: today, waterMl: waterMlLogged + parseInt(waterMl) });
      setWaterMl('');
    } finally {
      setWaterSaving(false);
    }
  };

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'meals',    label: 'MEALS',   icon: Utensils   },
    { id: 'water',    label: 'WATER',   icon: Droplets   },
    { id: 'calories', label: 'MACROS',  icon: BarChart3  },
    { id: 'summary',  label: 'SUMMARY', icon: Leaf       },
    { id: 'recipes',  label: 'RECIPES', icon: ChefHat    },
  ];

  const MacroBar = ({ label, value, goal, pct, color }: { label: string; value: number; goal: number; pct: number; color: string }) => (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-xs tracking-widest text-zinc-400">{label}</span>
        <span className={cn('font-mono text-xs', color)}>{value}g / {goal}g ({pct}%)</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-900">
        <div className={cn('h-full transition-all', pct >= 100 ? 'bg-green-500' : pct >= 70 ? 'bg-orange-500' : 'bg-zinc-700')} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-5 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">BODY :: NUTRITION_SUITE</span>
          </div>
          <div className="px-5 py-4">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Food</h1>
            <p className="mt-0.5 font-mono text-xs tracking-widest text-zinc-500">Meals · Water · Macros · Summary</p>
          </div>
          <div className="flex border-t border-zinc-900">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={cn('flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-2.5 font-mono text-xs tracking-widest transition',
                  tab === id ? 'border-orange-600 bg-orange-950/10 text-orange-500' : 'border-transparent text-zinc-400 hover:text-zinc-300'
                )}>
                <Icon className="h-3 w-3" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Today's stats row */}
        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: 'CALORIES',  value: `${totalCalories}`, unit: 'kcal', pct: calPct,     color: 'text-amber-400' },
            { label: 'PROTEIN',   value: `${totalProtein}`,  unit: 'g',    pct: proteinPct, color: 'text-blue-400'  },
            { label: 'WATER',     value: `${waterMlLogged}`, unit: 'ml',   pct: waterPct,   color: 'text-cyan-400'  },
            { label: 'FAT',       value: `${totalFat}`,      unit: 'g',    pct: fatPct,     color: 'text-yellow-400'},
          ].map(({ label, value, unit, pct, color }) => (
            <div key={label} className="border border-zinc-900 bg-zinc-950 p-4">
              <p className="font-mono text-xs tracking-widest text-zinc-400">{label}</p>
              <p className={cn('mt-1 font-mono text-xl font-bold', color)}>{value}<span className="ml-0.5 text-xs text-zinc-500">{unit}</span></p>
              <div className="mt-2 h-1 w-full bg-zinc-900">
                <div className={cn('h-full bg-current transition-all', color)} style={{ width: `${pct}%`, opacity: 0.7 }} />
              </div>
            </div>
          ))}
        </div>

        {/* MEALS TAB */}
        {tab === 'meals' && (
          <div className="space-y-4">
            {/* Live food search */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5 flex items-center justify-between">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">FOOD_SEARCH</span>
                <span className="font-mono text-xs text-zinc-600">OpenFoodFacts · 2M+ items</span>
              </div>
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                  <input
                    value={foodQuery}
                    onChange={(e) => setFoodQuery(e.target.value)}
                    placeholder="Search foods — e.g. 'chicken breast', 'banana'..."
                    className="h-9 w-full border border-zinc-800 bg-black pl-9 pr-9 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none"
                  />
                  {foodSearching && <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-orange-500" />}
                  {!foodSearching && foodQuery && (
                    <button onClick={() => { setFoodQuery(''); setFoodResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {foodResults.length > 0 && (
                  <div className="mt-2 max-h-60 overflow-y-auto border border-zinc-800 bg-black">
                    {foodResults.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setMealName(item.name + (item.brand ? ` (${item.brand})` : ''));
                          setMealCals(String(item.calories));
                          setMealProtein(String(item.protein));
                          setMealCarbs(String(item.carbs));
                          setMealFat(String(item.fat));
                          setFoodQuery('');
                          setFoodResults([]);
                          setTab('meals');
                        }}
                        className="w-full border-b border-zinc-900 px-3 py-2.5 text-left transition last:border-0 hover:bg-zinc-900"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate font-mono text-xs font-bold text-zinc-200">{item.name}</p>
                            {item.brand && <p className="font-mono text-xs text-zinc-600">{item.brand}</p>}
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="font-mono text-xs text-amber-400">{item.calories} kcal</p>
                            <p className="font-mono text-xs text-zinc-600">P:{item.protein}g C:{item.carbs}g F:{item.fat}g</p>
                          </div>
                        </div>
                        <p className="mt-0.5 font-mono text-xs text-zinc-700">per {item.serving} · click to fill form</p>
                      </button>
                    ))}
                  </div>
                )}
                {foodQuery.trim().length >= 2 && !foodSearching && foodResults.length === 0 && (
                  <p className="mt-2 font-mono text-xs text-zinc-600">No results for &ldquo;{foodQuery}&rdquo; — try a shorter term</p>
                )}
              </div>
            </div>
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">QUICK_ADD</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 p-3 md:grid-cols-3">
                {MEAL_PRESETS.map((preset) => (
                  <button key={preset.name} onClick={() => handlePresetLog(preset)} disabled={mealSaving}
                    className="border border-zinc-800 bg-black px-3 py-2.5 text-left transition hover:border-orange-800 disabled:opacity-40">
                    <p className="font-mono text-xs font-bold text-zinc-200">{preset.name}</p>
                    <p className="font-mono text-xs text-zinc-500">{preset.calories} kcal · P:{preset.protein}g</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom log form */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">CUSTOM_MEAL</span>
              </div>
              <form onSubmit={handleMealSubmit} className="space-y-3 p-4">
                <input value={mealName} onChange={(e) => setMealName(e.target.value)}
                  placeholder="Meal name..." required
                  className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { val: mealCals,    set: setMealCals,    label: 'CALORIES*', placeholder: '450' },
                    { val: mealProtein, set: setMealProtein, label: 'PROTEIN(g)', placeholder: '35' },
                    { val: mealCarbs,   set: setMealCarbs,   label: 'CARBS(g)',   placeholder: '40' },
                    { val: mealFat,     set: setMealFat,     label: 'FAT(g)',     placeholder: '12' },
                  ].map(({ val, set, label, placeholder }) => (
                    <div key={label}>
                      <p className="mb-1 font-mono text-xs tracking-widest text-zinc-500">{label}</p>
                      <input type="number" min="0" value={val} onChange={(e) => set(e.target.value)}
                        placeholder={placeholder}
                        className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-300 focus:border-orange-800 focus:outline-none" />
                    </div>
                  ))}
                </div>
                <button type="submit" disabled={mealSaving || !mealName || !mealCals}
                  className="flex items-center gap-2 border border-orange-800 bg-orange-950/30 px-6 py-2 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/60 disabled:opacity-40">
                  <Plus className="h-3 w-3" />
                  {mealSaving ? 'LOGGING_' : '[LOG_MEAL]'}
                </button>
              </form>
            </div>

            {/* Today's meals list */}
            {todayNutrition?.meals && todayNutrition.meals.length > 0 && (
              <div className="border border-zinc-900 bg-zinc-950">
                <div className="border-b border-zinc-900 px-4 py-2.5">
                  <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">TODAY_LOG</span>
                </div>
                <div className="divide-y divide-zinc-900">
                  {todayNutrition.meals.map((meal: MealEntry, i: number) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-2.5">
                      <Utensils className="mt-0.5 h-3 w-3 shrink-0 text-zinc-600" />
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-xs font-bold text-zinc-200">{meal.name}</p>
                        <div className="mt-0.5 flex flex-wrap gap-2">
                          <span className="font-mono text-xs text-amber-400">{meal.calories} kcal</span>
                          {meal.protein && <span className="font-mono text-xs text-blue-400">P:{meal.protein}g</span>}
                          {meal.carbs && <span className="font-mono text-xs text-green-400">C:{meal.carbs}g</span>}
                          {meal.fat && <span className="font-mono text-xs text-yellow-400">F:{meal.fat}g</span>}
                        </div>
                      </div>
                      {meal.time && <span className="font-mono text-xs text-zinc-500">{meal.time}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* WATER TAB */}
        {tab === 'water' && (
          <div className="space-y-4">
            {/* Water progress ring */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">HYDRATION_TODAY</span>
              </div>
              <div className="p-6 text-center">
                <div className="relative mx-auto mb-4 h-32 w-32">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#18181b" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#0891b2" strokeWidth="8"
                      strokeDasharray={`${waterPct * 2.51} 251`} strokeLinecap="square" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Droplets className="h-6 w-6 text-cyan-400" />
                    <p className="mt-1 font-mono text-lg font-bold text-cyan-400">{waterPct}%</p>
                  </div>
                </div>
                <p className="font-mono text-sm text-zinc-300">{waterMlLogged} ml / {DAILY_GOALS.water} ml</p>
                <p className="font-mono text-xs text-zinc-500">
                  {waterMlLogged >= DAILY_GOALS.water ? 'GOAL_ACHIEVED ✓' : `${DAILY_GOALS.water - waterMlLogged} ml remaining`}
                </p>
              </div>
            </div>

            {/* Quick add water */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">QUICK_ADD</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 p-3">
                {WATER_AMOUNTS.map((ml) => (
                  <button key={ml} onClick={() => handleWaterAdd(ml)} disabled={waterSaving}
                    className="border border-cyan-900 bg-cyan-950/20 py-3 font-mono text-xs tracking-widest text-cyan-400 transition hover:bg-cyan-950/50 disabled:opacity-40">
                    +{ml}ml
                  </button>
                ))}
              </div>
              <div className="flex gap-2 px-3 pb-3">
                <input type="number" min="1" value={waterMl} onChange={(e) => setWaterMl(e.target.value)}
                  placeholder="Custom ml..."
                  className="h-9 flex-1 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-300 focus:border-cyan-800 focus:outline-none" />
                <button onClick={handleCustomWater} disabled={!waterMl || waterSaving}
                  className="border border-cyan-800 bg-cyan-950/30 px-4 py-1.5 font-mono text-xs tracking-widest text-cyan-400 transition hover:bg-cyan-950/60 disabled:opacity-40">
                  [ADD]
                </button>
              </div>
            </div>

            {/* Water glasses visualization */}
            <div className="border border-zinc-900 bg-zinc-950 p-4">
              <p className="mb-3 font-mono text-xs tracking-widest text-zinc-500">VISUALIZATION (250ml glasses)</p>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 10 }, (_, i) => {
                  const threshold = (i + 1) * 250;
                  const filled = waterMlLogged >= threshold;
                  return (
                    <div key={i}
                      className={cn('flex h-10 w-8 items-end justify-center border pb-1',
                        filled ? 'border-cyan-700 bg-cyan-950/40' : 'border-zinc-800 bg-zinc-950'
                      )}>
                      <Droplets className={cn('h-4 w-4', filled ? 'text-cyan-400' : 'text-zinc-700')} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MACROS TAB */}
        {tab === 'calories' && (
          <div className="space-y-4">
            {/* Calorie progress */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">CALORIE_BUDGET</span>
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-end justify-between">
                  <div>
                    <p className="font-mono text-3xl font-bold text-amber-400">{totalCalories}</p>
                    <p className="font-mono text-xs text-zinc-500">kcal consumed</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xl font-bold text-zinc-300">{Math.max(0, DAILY_GOALS.calories - totalCalories)}</p>
                    <p className="font-mono text-xs text-zinc-500">kcal remaining</p>
                  </div>
                </div>
                <div className="h-3 w-full bg-zinc-900">
                  <div className={cn('h-full transition-all', calPct >= 100 ? 'bg-red-500' : calPct >= 80 ? 'bg-orange-500' : 'bg-amber-400')}
                    style={{ width: `${Math.min(100, calPct)}%` }} />
                </div>
                <p className="mt-1 font-mono text-xs text-zinc-500">Goal: {DAILY_GOALS.calories} kcal/day</p>
              </div>
            </div>

            {/* Macro ring visualization */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">MACRO_RINGS</span>
              </div>
              <div className="grid grid-cols-3 gap-4 p-4">
                {[
                  { label: 'PROTEIN', value: totalProtein, goal: DAILY_GOALS.protein, pct: proteinPct, color: '#3b82f6', unit: 'g' },
                  { label: 'CARBS',   value: totalCarbs,   goal: DAILY_GOALS.carbs,   pct: carbsPct,   color: '#22c55e', unit: 'g' },
                  { label: 'FAT',     value: totalFat,     goal: DAILY_GOALS.fat,     pct: fatPct,     color: '#eab308', unit: 'g' },
                ].map(({ label, value, goal, pct, color, unit }) => {
                  const r = 32;
                  const circ = 2 * Math.PI * r;
                  const dash = (Math.min(pct, 100) / 100) * circ;
                  return (
                    <div key={label} className="flex flex-col items-center gap-2">
                      <div className="relative h-20 w-20">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r={r} fill="none" stroke="#27272a" strokeWidth="7" />
                          <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="7"
                            strokeLinecap="round"
                            strokeDasharray={`${dash} ${circ}`}
                            style={{ transition: 'stroke-dasharray 0.6s ease' }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="font-mono text-sm font-bold text-zinc-100">{pct}%</span>
                        </div>
                      </div>
                      <p className="font-mono text-[10px] tracking-widest" style={{ color }}>{label}</p>
                      <p className="font-mono text-xs text-zinc-400">{value}{unit} <span className="text-zinc-600">/ {goal}{unit}</span></p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Macro breakdown bars */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">MACRO_BREAKDOWN</span>
              </div>
              <div className="p-4">
                <MacroBar label="PROTEIN" value={totalProtein} goal={DAILY_GOALS.protein} pct={proteinPct} color="text-blue-400" />
                <MacroBar label="CARBS"   value={totalCarbs}   goal={DAILY_GOALS.carbs}   pct={carbsPct}   color="text-green-400" />
                <MacroBar label="FAT"     value={totalFat}     goal={DAILY_GOALS.fat}      pct={fatPct}     color="text-yellow-400" />
              </div>
            </div>

            {/* Macro ratio visualization */}
            {(totalProtein + totalCarbs + totalFat) > 0 && (
              <div className="border border-zinc-900 bg-zinc-950 p-4">
                <p className="mb-3 font-mono text-xs tracking-widest text-zinc-400">MACRO_RATIO_(CALORIES)</p>
                <div className="flex h-6 w-full overflow-hidden">
                  {(() => {
                    const pCal = totalProtein * 4;
                    const cCal = totalCarbs * 4;
                    const fCal = totalFat * 9;
                    const total = pCal + cCal + fCal || 1;
                    return (
                      <>
                        <div className="bg-blue-600" style={{ width: `${(pCal / total) * 100}%` }} title={`Protein: ${Math.round((pCal/total)*100)}%`} />
                        <div className="bg-green-600" style={{ width: `${(cCal / total) * 100}%` }} title={`Carbs: ${Math.round((cCal/total)*100)}%`} />
                        <div className="bg-yellow-600" style={{ width: `${(fCal / total) * 100}%` }} title={`Fat: ${Math.round((fCal/total)*100)}%`} />
                      </>
                    );
                  })()}
                </div>
                <div className="mt-2 flex gap-4">
                  {[
                    { label: 'PROTEIN', color: 'bg-blue-600',   val: totalProtein * 4 },
                    { label: 'CARBS',   color: 'bg-green-600',  val: totalCarbs * 4 },
                    { label: 'FAT',     color: 'bg-yellow-600', val: totalFat * 9 },
                  ].map(({ label, color, val }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className={cn('h-2 w-2', color)} />
                      <span className="font-mono text-xs text-zinc-400">{label} ({val} kcal)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUMMARY TAB */}
        {tab === 'summary' && (
          <div className="space-y-4">
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">TODAY_SUMMARY</span>
              </div>
              <div className="p-4">
                <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {[
                    { label: 'CALORIES',  value: `${totalCalories} / ${DAILY_GOALS.calories}`, color: 'text-amber-400', note: calPct >= 100 ? '✓ GOAL MET' : `${DAILY_GOALS.calories - totalCalories} remaining` },
                    { label: 'PROTEIN',   value: `${totalProtein}g / ${DAILY_GOALS.protein}g`, color: 'text-blue-400',  note: proteinPct >= 100 ? '✓ GOAL MET' : `${DAILY_GOALS.protein - totalProtein}g remaining` },
                    { label: 'WATER',     value: `${waterMlLogged} / ${DAILY_GOALS.water} ml`, color: 'text-cyan-400', note: waterPct >= 100 ? '✓ GOAL MET' : `${DAILY_GOALS.water - waterMlLogged}ml remaining` },
                    { label: 'CARBS',     value: `${totalCarbs}g / ${DAILY_GOALS.carbs}g`,     color: 'text-green-400', note: carbsPct >= 100 ? '✓ GOAL MET' : `${DAILY_GOALS.carbs - totalCarbs}g remaining` },
                    { label: 'FAT',       value: `${totalFat}g / ${DAILY_GOALS.fat}g`,          color: 'text-yellow-400',note: fatPct >= 100 ? '✓ GOAL MET' : `${DAILY_GOALS.fat - totalFat}g remaining` },
                    { label: 'MEALS',     value: `${todayNutrition?.meals?.length ?? 0} meals`,  color: 'text-zinc-300',  note: '' },
                  ].map(({ label, value, color, note }) => (
                    <div key={label} className="border border-zinc-900 bg-black p-3">
                      <p className="font-mono text-xs tracking-widest text-zinc-500">{label}</p>
                      <p className={cn('mt-1 font-mono text-sm font-bold', color)}>{value}</p>
                      {note && <p className="mt-0.5 font-mono text-xs text-zinc-600">{note}</p>}
                    </div>
                  ))}
                </div>

                {/* Nutrition score */}
                {(() => {
                  const scores = [calPct, proteinPct, waterPct];
                  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
                  const grade = avg >= 90 ? { label: 'EXCELLENT', color: 'text-green-400' } :
                                avg >= 70 ? { label: 'GOOD',      color: 'text-blue-400'  } :
                                avg >= 50 ? { label: 'MODERATE',  color: 'text-amber-400' } :
                                            { label: 'LOW',       color: 'text-red-400'   };
                  return (
                    <div className="border border-zinc-800 bg-zinc-900/50 p-4 text-center">
                      <p className="font-mono text-xs tracking-widest text-zinc-500">NUTRITION_SCORE</p>
                      <p className={cn('mt-2 font-mono text-4xl font-bold', grade.color)}>{avg}%</p>
                      <p className={cn('font-mono text-xs tracking-widest', grade.color)}>{grade.label}</p>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Tips */}
            <div className="border border-zinc-800 bg-zinc-950 p-4">
              <p className="mb-2 font-mono text-xs tracking-widest text-zinc-500">PROTOCOL_TIPS</p>
              <ul className="space-y-1.5">
                {[
                  proteinPct < 70 && '↑ Boost protein intake — aim for 1g per lb of bodyweight',
                  waterPct < 50 && '↑ Drink more water — dehydration cuts performance by 20%',
                  calPct > 110 && '↓ Over calorie goal — adjust portions or burn more',
                  carbsPct > 90 && proteinPct < 80 && '⚖ Shift ratio: less carbs, more protein for body recomp',
                ].filter(Boolean).map((tip, i) => (
                  <li key={i} className="font-mono text-xs text-zinc-400">
                    <span className="text-orange-600">›</span> {tip}
                  </li>
                ))}
                {proteinPct >= 90 && waterPct >= 80 && calPct >= 80 && calPct <= 105 && (
                  <li className="font-mono text-xs text-green-400">✓ On-track — solid nutrition day</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* RECIPES TAB */}
        {tab === 'recipes' && (
          <div className="space-y-4">
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5 flex items-center justify-between">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">RECIPE_DISCOVERY</span>
                <span className="font-mono text-xs text-zinc-600">TheMealDB · free</span>
              </div>
              <div className="p-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
                    <input
                      value={recipeQuery}
                      onChange={(e) => setRecipeQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRecipeSearch()}
                      placeholder="Search recipes — e.g. 'chicken', 'pasta', 'beef stew'..."
                      className="h-9 w-full border border-zinc-800 bg-black pl-9 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleRecipeSearch}
                    disabled={recipeSearching || !recipeQuery.trim()}
                    className="border border-orange-800 bg-orange-950/30 px-4 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/60 disabled:opacity-40"
                  >
                    {recipeSearching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : '[SEARCH]'}
                  </button>
                </div>
              </div>
            </div>

            {recipes.length === 0 && !recipeSearching && (
              <div className="border border-zinc-900 bg-zinc-950 p-8 text-center">
                <ChefHat className="mx-auto mb-3 h-8 w-8 text-zinc-700" />
                <p className="font-mono text-xs text-zinc-500">Search for recipes above to discover meal ideas</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {['chicken', 'beef', 'pasta', 'salmon', 'eggs', 'salad'].map((s) => (
                    <button key={s} onClick={() => { setRecipeQuery(s); }}
                      className="border border-zinc-800 bg-zinc-900 px-3 py-1 font-mono text-xs text-zinc-400 hover:border-orange-800 hover:text-orange-400 transition">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {recipes.length > 0 && (
              <div className="grid gap-3 md:grid-cols-2">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="border border-zinc-900 bg-zinc-950">
                    {recipe.thumbnail && (
                      <Image src={recipe.thumbnail} alt={recipe.name} width={400} height={176}
                        className="h-44 w-full object-cover border-b border-zinc-900" />
                    )}
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-sm font-bold text-zinc-100">{recipe.name}</p>
                          <div className="mt-0.5 flex gap-2">
                            {recipe.category && <span className="font-mono text-xs text-zinc-500">{recipe.category}</span>}
                            {recipe.cuisine && <span className="font-mono text-xs text-zinc-600">· {recipe.cuisine}</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
                          className="shrink-0 border border-zinc-800 px-2 py-1 font-mono text-xs text-zinc-400 hover:border-orange-800 hover:text-orange-400 transition">
                          {expandedRecipe === recipe.id ? '[HIDE]' : '[VIEW]'}
                        </button>
                      </div>

                      {expandedRecipe === recipe.id && (
                        <div className="mt-3 space-y-3">
                          <div>
                            <p className="mb-1.5 font-mono text-xs tracking-widest text-zinc-500">INGREDIENTS</p>
                            <div className="grid grid-cols-2 gap-1">
                              {recipe.ingredients.map((ing, i) => (
                                <div key={i} className="flex gap-1 font-mono text-xs">
                                  <span className="text-orange-600">›</span>
                                  <span className="text-zinc-400">{ing.measure} {ing.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {recipe.instructions && (
                            <div>
                              <p className="mb-1.5 font-mono text-xs tracking-widest text-zinc-500">INSTRUCTIONS</p>
                              <p className="font-mono text-xs leading-relaxed text-zinc-400 line-clamp-6">{recipe.instructions}</p>
                            </div>
                          )}
                          {recipe.youtubeUrl && (
                            <a href={recipe.youtubeUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 border border-red-900 bg-red-950/20 px-3 py-1.5 font-mono text-xs text-red-400 hover:bg-red-950/40 transition">
                              ▶ Watch Tutorial
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
