'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Food Search Widget
// Searches OpenFoodFacts + USDA, adds meals with real nutritional data
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useRef } from 'react';
import { Search, Plus, X, Loader2, ChevronDown, ChevronUp, Flame, Beef, Wheat, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  serving: string;
  servingG: number;
  image?: string;
  source: 'openfoodfacts' | 'usda';
}

interface FoodSearchProps {
  onAddMeal: (meal: {
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    time?: string;
  }) => void;
  className?: string;
}

export function FoodSearch({ onAddMeal, className }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [servingMultiplier, setServingMultiplier] = useState<Record<string, number>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/food/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setError('Could not load food data. Try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 500);
  };

  const getMultiplier = (id: string) => servingMultiplier[id] ?? 1;

  const setMultiplier = (id: string, val: number) => {
    setServingMultiplier(prev => ({ ...prev, [id]: val }));
  };

  const addFood = (item: FoodItem) => {
    const mult = getMultiplier(item.id);
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    onAddMeal({
      name: `${item.name}${item.brand ? ` (${item.brand})` : ''} × ${mult === 1 ? item.serving : `${Math.round(item.servingG * mult)}g`}`,
      calories: Math.round(item.calories * mult),
      protein: Math.round(item.protein * mult * 10) / 10,
      carbs: Math.round(item.carbs * mult * 10) / 10,
      fat: Math.round(item.fat * mult * 10) / 10,
      time,
    });
    setQuery('');
    setResults([]);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => handleInput(e.target.value)}
          placeholder="Search food (e.g. chicken breast, banana...)"
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 text-sm rounded-none pl-9 pr-9 py-2.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition font-mono"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
          <Loader2 className="h-3 w-3 animate-spin" />
          Searching food databases...
        </div>
      )}

      {error && (
        <div className="text-red-500 text-xs font-mono">{error}</div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="border border-zinc-800 bg-zinc-950/80 max-h-80 overflow-y-auto">
          {results.map(item => {
            const mult = getMultiplier(item.id);
            const isExpanded = expanded === item.id;
            return (
              <div key={item.id} className="border-b border-zinc-900 last:border-0">
                <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-900/50 transition">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.brand ? `${item.name} by ${item.brand}` : item.name}
                      width={32}
                      height={32}
                      unoptimized
                      className="h-8 w-8 object-cover rounded-sm flex-shrink-0 bg-zinc-800"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-zinc-800 flex items-center justify-center flex-shrink-0 text-xs text-zinc-600 font-mono">
                      {item.source === 'usda' ? 'FDA' : 'OFF'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-100 text-xs font-mono truncate leading-tight">{item.name}</p>
                    {item.brand && <p className="text-zinc-500 text-[10px] font-mono truncate">{item.brand}</p>}
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-orange-400 text-[10px] font-mono font-bold">{Math.round(item.calories * mult)} kcal</span>
                      <span className="text-zinc-600 text-[10px] font-mono">P:{item.protein * mult}g C:{item.carbs * mult}g F:{item.fat * mult}g</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                      className="p-1 text-zinc-500 hover:text-zinc-300 transition"
                    >
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => addFood(item)}
                      className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-mono hover:bg-orange-500/20 transition"
                    >
                      <Plus className="h-3 w-3" />
                      ADD
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-3 pb-2.5 bg-zinc-900/30">
                    {/* Serving multiplier */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-zinc-500 text-[10px] font-mono">Servings:</span>
                      {[0.5, 1, 1.5, 2, 3].map(s => (
                        <button
                          key={s}
                          onClick={() => setMultiplier(item.id, s)}
                          className={cn(
                            'px-1.5 py-0.5 text-[10px] font-mono border transition',
                            mult === s
                              ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                              : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                          )}
                        >
                          {s}
                        </button>
                      ))}
                      <span className="text-zinc-500 text-[10px] font-mono">({Math.round(item.servingG * mult)}g)</span>
                    </div>
                    {/* Nutrients */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'Protein', value: Math.round(item.protein * mult * 10) / 10, unit: 'g', icon: Beef, color: 'text-red-400' },
                        { label: 'Carbs', value: Math.round(item.carbs * mult * 10) / 10, unit: 'g', icon: Wheat, color: 'text-yellow-400' },
                        { label: 'Fat', value: Math.round(item.fat * mult * 10) / 10, unit: 'g', icon: Droplets, color: 'text-blue-400' },
                        { label: 'Fiber', value: item.fiber ? Math.round(item.fiber * mult * 10) / 10 : '—', unit: 'g', icon: Flame, color: 'text-green-400' },
                      ].map(n => (
                        <div key={n.label} className="bg-zinc-950/60 px-2 py-1.5 border border-zinc-800">
                          <n.icon className={cn('h-3 w-3 mb-0.5', n.color)} />
                          <div className={cn('text-xs font-mono font-bold', n.color)}>{n.value}{typeof n.value === 'number' ? n.unit : ''}</div>
                          <div className="text-[9px] text-zinc-600 font-mono">{n.label}</div>
                        </div>
                      ))}
                    </div>
                    {item.source === 'openfoodfacts' && (
                      <p className="text-[9px] text-zinc-700 font-mono mt-1.5">Source: OpenFoodFacts — {item.serving} per serving</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
