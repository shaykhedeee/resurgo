'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Recipe Browser Component
// Browse and discover recipes from TheMealDB, filtered by goal + diet type
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { Search, ExternalLink, Youtube, ChefHat, Loader2, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Recipe {
  id: string;
  name: string;
  category?: string;
  cuisine?: string;
  thumbnail?: string;
  tags?: string[];
  ingredients: Array<{ name: string; measure: string }>;
  instructions?: string;
  youtubeUrl?: string;
  source: string;
}

const CATEGORIES = ['Beef', 'Chicken', 'Seafood', 'Vegetarian', 'Pasta', 'Lamb', 'Side', 'Dessert'];
const _DIET_FILTERS: Record<string, string> = {
  All: '',
  'High Protein': 'high_protein',
  Keto: 'keto',
  Vegetarian: 'vegetarian',
};

interface RecipeBrowserProps {
  goal?: string;
  className?: string;
}

export function RecipeBrowser({ goal: _goal, className }: RecipeBrowserProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchRecipes = useCallback(async (q: string, cat: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (cat) params.set('category', cat);
      if (!q && !cat) params.set('random', 'true');
      const res = await fetch(`/api/food/recipes?${params}`);
      const data = await res.json();
      setRecipes(data.results ?? []);
    } catch {
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes('', '');
  }, [fetchRecipes]);

  const triggerSearch = () => {
    fetchRecipes(query, selectedCategory);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') triggerSearch();
  };

  const openRecipe = async (recipe: Recipe) => {
    if (recipe.ingredients?.length > 0) {
      setSelected(recipe);
      setShowModal(true);
      return;
    }
    // Fetch full details
    const id = recipe.id.replace('mdb_', '');
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = await res.json();
      const meal = data.meals?.[0];
      if (meal) {
        const ingredients: Array<{ name: string; measure: string }> = [];
        for (let i = 1; i <= 20; i++) {
          const name = meal[`strIngredient${i}`]?.trim();
          const measure = meal[`strMeasure${i}`]?.trim();
          if (name) ingredients.push({ name, measure: measure || '' });
        }
        setSelected({ ...recipe, ingredients, instructions: meal.strInstructions });
      }
    } catch {
      setSelected(recipe);
    }
    setShowModal(true);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search recipes..."
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 text-sm pl-9 pr-3 py-2 focus:outline-none focus:border-orange-500 font-mono"
          />
        </div>
        <button
          onClick={triggerSearch}
          className="px-3 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono hover:bg-orange-500/20 transition"
        >
          SEARCH
        </button>
        <button
          onClick={() => fetchRecipes('', '')}
          title="Random recipes"
          className="px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 transition"
        >
          <Shuffle className="h-4 w-4" />
        </button>
      </div>

      {/* Category pills */}
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => { setSelectedCategory(''); fetchRecipes(query, ''); }}
          className={cn(
            'px-2.5 py-1 text-[10px] font-mono border transition',
            !selectedCategory
              ? 'border-orange-500 bg-orange-500/10 text-orange-400'
              : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
          )}
        >
          ALL
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); fetchRecipes(query, cat); }}
            className={cn(
              'px-2.5 py-1 text-[10px] font-mono border transition',
              selectedCategory === cat
                ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
            )}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Results grid */}
      {loading ? (
        <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono py-4">
          <Loader2 className="h-3 w-3 animate-spin" />
          Loading recipes...
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-zinc-600 text-xs font-mono py-4 text-center">
          No recipes found. Try a different search.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {recipes.map(recipe => (
            <button
              key={recipe.id}
              onClick={() => openRecipe(recipe)}
              className="group text-left border border-zinc-800 bg-zinc-950 hover:border-orange-500/40 transition overflow-hidden"
            >
              {recipe.thumbnail && (
                <div className="aspect-video bg-zinc-900 overflow-hidden">
                  <Image
                    src={`${recipe.thumbnail}/medium`}
                    alt={recipe.name}
                    width={320}
                    height={180}
                    unoptimized
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              )}
              <div className="p-2">
                <p className="text-zinc-100 text-[11px] font-mono leading-tight line-clamp-2">{recipe.name}</p>
                {(recipe.category || recipe.cuisine) && (
                  <p className="text-zinc-600 text-[9px] font-mono mt-0.5">
                    {[recipe.category, recipe.cuisine].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Recipe detail modal */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <div className="flex items-center gap-2 text-orange-400 text-xs font-mono">
                <ChefHat className="h-3.5 w-3.5" />
                RECIPE_DETAIL
              </div>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-zinc-300 text-xs font-mono">[CLOSE]</button>
            </div>

            <div className="p-4 space-y-4">
              {selected.thumbnail && (
                <Image
                  src={`${selected.thumbnail}/medium`}
                  alt={selected.name}
                  width={640}
                  height={160}
                  unoptimized
                  className="w-full h-40 object-cover"
                />
              )}
              <h3 className="text-zinc-100 text-sm font-mono font-bold">{selected.name}</h3>
              {(selected.category || selected.cuisine) && (
                <p className="text-zinc-500 text-xs font-mono">{[selected.category, selected.cuisine].filter(Boolean).join(' · ')}</p>
              )}

              {selected.ingredients.length > 0 && (
                <div>
                  <div className="text-orange-400 text-[10px] font-mono tracking-widest mb-2">INGREDIENTS</div>
                  <div className="grid grid-cols-2 gap-1">
                    {selected.ingredients.map((ing, i) => (
                      <div key={i} className="text-[10px] font-mono text-zinc-300">
                        <span className="text-zinc-500">{ing.measure}</span> {ing.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.instructions && (
                <div>
                  <div className="text-orange-400 text-[10px] font-mono tracking-widest mb-2">INSTRUCTIONS</div>
                  <p className="text-zinc-400 text-[11px] font-mono leading-relaxed whitespace-pre-wrap line-clamp-8">
                    {selected.instructions}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {selected.youtubeUrl && (
                  <a
                    href={selected.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono hover:bg-red-500/20 transition"
                  >
                    <Youtube className="h-3 w-3" />
                    WATCH
                  </a>
                )}
                <a
                  href={`https://www.themealdb.com/meal/${selected.id.replace('mdb_', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-mono hover:border-zinc-700 transition"
                >
                  <ExternalLink className="h-3 w-3" />
                  FULL RECIPE
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
