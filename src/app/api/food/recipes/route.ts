// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Recipe Search API (TheMealDB + Spoonacular fallback)
// TheMealDB is completely free. Spoonacular has a generous free tier.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';
const SPOONACULAR_KEY = process.env.SPOONACULAR_API_KEY || '';

export interface Recipe {
  id: string;
  name: string;
  category?: string;
  cuisine?: string;
  instructions?: string;
  thumbnail?: string;
  tags?: string[];
  macros?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: Array<{
    name: string;
    measure: string;
  }>;
  source: 'mealdb' | 'spoonacular';
  youtubeUrl?: string;
}

function parseMealDB(meal: any): Recipe {
  const ingredients: Recipe['ingredients'] = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();
    if (name) {
      ingredients.push({ name, measure: measure || '' });
    }
  }

  return {
    id: `mdb_${meal.idMeal}`,
    name: meal.strMeal,
    category: meal.strCategory,
    cuisine: meal.strArea,
    instructions: meal.strInstructions,
    thumbnail: meal.strMealThumb,
    tags: meal.strTags ? meal.strTags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    ingredients,
    source: 'mealdb',
    youtubeUrl: meal.strYoutube,
  };
}

async function searchMealDB(query: string): Promise<Recipe[]> {
  try {
    const res = await fetch(`${MEALDB_BASE}/search.php?s=${encodeURIComponent(query)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.meals ?? []).map(parseMealDB);
  } catch {
    return [];
  }
}

async function filterMealsByCategory(category: string): Promise<Recipe[]> {
  try {
    const res = await fetch(`${MEALDB_BASE}/filter.php?c=${encodeURIComponent(category)}`, {
      next: { revalidate: 7200 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.meals ?? []).slice(0, 8).map((m: any) => ({
      id: `mdb_${m.idMeal}`,
      name: m.strMeal,
      thumbnail: m.strMealThumb,
      ingredients: [],
      source: 'mealdb' as const,
    }));
  } catch {
    return [];
  }
}

async function searchSpoonacular(query: string, diet?: string, maxCalories?: number): Promise<Recipe[]> {
  if (!SPOONACULAR_KEY) return [];
  try {
    const params = new URLSearchParams({
      query,
      apiKey: SPOONACULAR_KEY,
      number: '6',
      addRecipeInformation: 'true',
      addRecipeNutrition: 'true',
      ...(diet && { diet }),
      ...(maxCalories && { maxCalories: String(maxCalories) }),
    });
    const res = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).map((r: any) => ({
      id: `spoon_${r.id}`,
      name: r.title,
      thumbnail: r.image,
      category: r.dishTypes?.[0],
      cuisine: r.cuisines?.[0],
      ingredients: (r.extendedIngredients ?? []).map((ing: any) => ({
        name: ing.name,
        measure: ing.original,
      })),
      macros: r.nutrition?.nutrients ? {
        calories: Math.round(r.nutrition.nutrients.find((n: any) => n.name === 'Calories')?.amount ?? 0),
        protein: Math.round(r.nutrition.nutrients.find((n: any) => n.name === 'Protein')?.amount ?? 0),
        carbs: Math.round(r.nutrition.nutrients.find((n: any) => n.name === 'Carbohydrates')?.amount ?? 0),
        fat: Math.round(r.nutrition.nutrients.find((n: any) => n.name === 'Fat')?.amount ?? 0),
      } : undefined,
      tags: r.diets ?? [],
      source: 'spoonacular' as const,
    }));
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() || '';
  const category = searchParams.get('category')?.trim();
  const diet = searchParams.get('diet')?.trim();
  const maxCal = searchParams.get('maxCal') ? parseInt(searchParams.get('maxCal')!) : undefined;
  const random = searchParams.get('random') === 'true';

  if (random) {
    const res = await fetch(`${MEALDB_BASE}/random.php`);
    const data = await res.json();
    return NextResponse.json({ results: (data.meals ?? []).map(parseMealDB) });
  }

  if (category && !query) {
    const results = await filterMealsByCategory(category);
    return NextResponse.json({ results, total: results.length });
  }

  if (!query && !category) {
    return NextResponse.json({ error: 'Provide q or category' }, { status: 400 });
  }

  const [mealdbResults, spoonResults] = await Promise.all([
    query ? searchMealDB(query) : Promise.resolve([]),
    query ? searchSpoonacular(query, diet, maxCal) : Promise.resolve([]),
  ]);

  const results = [...mealdbResults, ...spoonResults];
  return NextResponse.json(
    { results, total: results.length },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } }
  );
}
