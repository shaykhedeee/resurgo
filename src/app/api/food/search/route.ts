// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Food Search API (OpenFoodFacts + USDA FoodData Central)
// Free food database with nutrition data. No API keys required for OpenFoodFacts.
// USDA: free key from https://fdc.nal.usda.gov/api-key-signup.html
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const USDA_KEY = process.env.USDA_FOODDATA_API_KEY || '';
const OFF_BASE = 'https://world.openfoodfacts.org';
const USDA_BASE = 'https://api.nal.usda.gov/fdc/v1';

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  serving: string;
  servingG: number;
  image?: string;
  source: 'openfoodfacts' | 'usda';
  barcode?: string;
}

function parseOFFProduct(p: any): FoodItem | null {
  if (!p?.product_name) return null;
  const n = p.nutriments ?? {};
  const rawKcal = n['energy-kcal_100g'] ?? n['energy-kcal'] ?? (n['energy_100g'] != null ? n['energy_100g'] / 4.184 : 0);
  const calories = rawKcal ?? 0;
  if (!calories && calories !== 0) return null;

  return {
    id: `off_${p.id || p.code || Math.random()}`,
    name: p.product_name.trim(),
    brand: p.brands?.split(',')[0]?.trim(),
    calories: Math.round(calories),
    protein: Math.round((n['proteins_100g'] ?? 0) * 10) / 10,
    carbs: Math.round((n['carbohydrates_100g'] ?? 0) * 10) / 10,
    fat: Math.round((n['fat_100g'] ?? 0) * 10) / 10,
    fiber: n['fiber_100g'] ? Math.round(n['fiber_100g'] * 10) / 10 : undefined,
    sugar: n['sugars_100g'] ? Math.round(n['sugars_100g'] * 10) / 10 : undefined,
    sodium: n['sodium_100g'] ? Math.round(n['sodium_100g'] * 1000) : undefined, // mg
    serving: p.serving_size || '100g',
    servingG: parseFloat(p.serving_size) || 100,
    image: p.image_thumb_url || p.image_url,
    source: 'openfoodfacts',
    barcode: p.code,
  };
}

function parseUSDAFood(f: any): FoodItem {
  const getNutrient = (id: number): number => {
    const nut = f.foodNutrients?.find((n: any) => n.nutrientId === id || n.nutrient?.id === id);
    return Math.round((nut?.value ?? nut?.amount ?? 0) * 10) / 10;
  };

  return {
    id: `usda_${f.fdcId}`,
    name: f.description || f.lowercaseDescription || 'Unknown Food',
    brand: f.brandOwner || f.brandName,
    calories: getNutrient(1008),
    protein: getNutrient(1003),
    carbs: getNutrient(1005),
    fat: getNutrient(1004),
    fiber: getNutrient(1079) || undefined,
    sugar: getNutrient(2000) || undefined,
    sodium: getNutrient(1093) || undefined,
    serving: f.servingSizeUnit ? `${f.servingSize}${f.servingSizeUnit}` : '100g',
    servingG: f.servingSize || 100,
    source: 'usda',
  };
}

// ── Search both databases in parallel ────────────────────────────────────────

async function searchOpenFoodFacts(query: string, pageSize = 10): Promise<FoodItem[]> {
  try {
    const url = `${OFF_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=${pageSize}&fields=product_name,brands,nutriments,serving_size,image_thumb_url,code,id`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Resurgo/1.0 (nutrition tracker; support@resurgo.life)' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.products ?? [])
      .map(parseOFFProduct)
      .filter(Boolean) as FoodItem[];
  } catch {
    return [];
  }
}

async function searchUSDA(query: string, pageSize = 8): Promise<FoodItem[]> {
  if (!USDA_KEY) return [];
  try {
    const url = `${USDA_BASE}/foods/search?query=${encodeURIComponent(query)}&pageSize=${pageSize}&api_key=${USDA_KEY}&dataType=Branded,Foundation,SR Legacy`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.foods ?? []).map(parseUSDAFood);
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
  const query = searchParams.get('q')?.trim();
  const barcode = searchParams.get('barcode');
  const source = searchParams.get('source') || 'all';

  if (barcode) {
    // Barcode lookup via OpenFoodFacts
    try {
      const res = await fetch(`${OFF_BASE}/api/v0/product/${barcode}.json`, {
        headers: { 'User-Agent': 'Resurgo/1.0 (nutrition tracker; support@resurgo.life)' },
      });
      const data = await res.json();
      if (data.status === 1 && data.product) {
        const item = parseOFFProduct({ ...data.product, code: barcode });
        return NextResponse.json({ results: item ? [item] : [], total: item ? 1 : 0 });
      }
    } catch {}
    return NextResponse.json({ results: [], total: 0 });
  }

  if (!query || query.length < 2) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 });
  }

  let results: FoodItem[] = [];

  if (source === 'off') {
    results = await searchOpenFoodFacts(query, 12);
  } else if (source === 'usda') {
    results = await searchUSDA(query, 12);
  } else {
    // Search both in parallel, deduplicate by name
    const [offResults, usdaResults] = await Promise.all([
      searchOpenFoodFacts(query, 8),
      searchUSDA(query, 6),
    ]);
    const seen = new Set<string>();
    for (const item of [...offResults, ...usdaResults]) {
      const key = item.name.toLowerCase().substring(0, 20);
      if (!seen.has(key)) {
        seen.add(key);
        results.push(item);
      }
    }
  }

  return NextResponse.json(
    { results, total: results.length },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } }
  );
}
