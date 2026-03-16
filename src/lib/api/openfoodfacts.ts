// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — OpenFoodFacts API Client
// Comprehensive nutrition data from the world's largest open food database.
// Completely free, no API key required.
// ═══════════════════════════════════════════════════════════════════════════════

const OFF_BASE = 'https://world.openfoodfacts.org';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface NutrientData {
  energy_kcal: number;
  fat: number;
  saturatedFat: number;
  carbohydrates: number;
  sugars: number;
  fiber: number;
  proteins: number;
  salt: number;
  sodium: number;
}

export interface FoodProduct {
  id: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  barcode: string;
  categories: string[];
  nutriscoreGrade: string | null; // a | b | c | d | e
  novaGroup: number | null; // 1-4 (NOVA food processing classification)
  servingSize: string | null;
  servingQuantity: number | null;
  nutrients: NutrientData;
  ingredients: string;
  allergens: string[];
  labels: string[];
  isVegan: boolean;
  isVegetarian: boolean;
  isPalmOilFree: boolean;
}

export interface FoodSearchResult {
  products: FoodProduct[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MealLogEntry {
  food: FoodProduct;
  servings: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: number;
  calculatedNutrients: NutrientData;
}

export interface DailyNutritionSummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  mealCount: number;
  nutriscoreAvg: number;
  meals: MealLogEntry[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function parseNutrients(nutriments: Record<string, unknown>): NutrientData {
  const n = (key: string): number => {
    const val = nutriments[key];
    return typeof val === 'number' ? Math.round(val * 10) / 10 : 0;
  };
  return {
    energy_kcal: n('energy-kcal_100g'),
    fat: n('fat_100g'),
    saturatedFat: n('saturated-fat_100g'),
    carbohydrates: n('carbohydrates_100g'),
    sugars: n('sugars_100g'),
    fiber: n('fiber_100g'),
    proteins: n('proteins_100g'),
    salt: n('salt_100g'),
    sodium: n('sodium_100g'),
  };
}

function parseProduct(raw: Record<string, unknown>): FoodProduct {
  const nutriments = (raw.nutriments ?? {}) as Record<string, unknown>;
  const ingredientsAnalysis = (raw.ingredients_analysis_tags ?? []) as string[];

  return {
    id: String(raw.code ?? raw._id ?? ''),
    name: String(raw.product_name ?? raw.product_name_en ?? 'Unknown'),
    brand: String(raw.brands ?? ''),
    imageUrl: (raw.image_front_small_url ?? raw.image_url ?? null) as string | null,
    barcode: String(raw.code ?? ''),
    categories: String(raw.categories ?? '').split(',').map((c) => c.trim()).filter(Boolean),
    nutriscoreGrade: (raw.nutriscore_grade ?? null) as string | null,
    novaGroup: typeof raw.nova_group === 'number' ? raw.nova_group : null,
    servingSize: (raw.serving_size ?? null) as string | null,
    servingQuantity: typeof raw.serving_quantity === 'number' ? raw.serving_quantity : null,
    nutrients: parseNutrients(nutriments),
    ingredients: String(raw.ingredients_text ?? raw.ingredients_text_en ?? ''),
    allergens: String(raw.allergens ?? '').split(',').map((a) => a.trim()).filter(Boolean),
    labels: String(raw.labels ?? '').split(',').map((l) => l.trim()).filter(Boolean),
    isVegan: ingredientsAnalysis.includes('en:vegan'),
    isVegetarian: ingredientsAnalysis.includes('en:vegetarian'),
    isPalmOilFree: ingredientsAnalysis.includes('en:palm-oil-free'),
  };
}

const NUTRISCORE_NUMERIC: Record<string, number> = { a: 5, b: 4, c: 3, d: 2, e: 1 };

// ─────────────────────────────────────────────────────────────────────────────
// Search foods by text query
// ─────────────────────────────────────────────────────────────────────────────

export async function searchFoods(params: {
  query: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'popularity' | 'nutriscore' | 'ecoscore';
  nutriscoreMax?: string;
  veganOnly?: boolean;
  vegetarianOnly?: boolean;
}): Promise<FoodSearchResult> {
  const { query, page = 1, pageSize = 20, sortBy, nutriscoreMax, veganOnly, vegetarianOnly } = params;

  const url = new URL(`${OFF_BASE}/cgi/search.pl`);
  url.searchParams.set('search_terms', query);
  url.searchParams.set('page', String(page));
  url.searchParams.set('page_size', String(Math.min(pageSize, 50)));
  url.searchParams.set('json', '1');
  url.searchParams.set('search_simple', '1');
  url.searchParams.set('action', 'process');

  if (sortBy === 'nutriscore') url.searchParams.set('sort_by', 'nutriscore_score');
  if (sortBy === 'ecoscore') url.searchParams.set('sort_by', 'ecoscore_score');
  if (sortBy === 'popularity') url.searchParams.set('sort_by', 'unique_scans_n');

  if (nutriscoreMax) {
    url.searchParams.set('tagtype_0', 'nutrition_grades');
    url.searchParams.set('tag_contains_0', 'contains');
    url.searchParams.set('tag_0', nutriscoreMax);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { 'User-Agent': 'Resurgo/1.0 (contact@resurgo.life)' },
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`OFF HTTP ${res.status}`);

    const data = (await res.json()) as { products?: unknown[]; count?: number; page?: number; page_size?: number };
    let products = ((data.products ?? []) as Record<string, unknown>[]).map(parseProduct);

    if (veganOnly) products = products.filter((p) => p.isVegan);
    if (vegetarianOnly) products = products.filter((p) => p.isVegetarian);

    const count = typeof data.count === 'number' ? data.count : products.length;

    return {
      products,
      count,
      page: typeof data.page === 'number' ? data.page : page,
      pageSize: typeof data.page_size === 'number' ? data.page_size : pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  } catch (err) {
    console.error('[OFF] Search failed:', err);
    return { products: [], count: 0, page, pageSize, totalPages: 0 };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Get product by barcode
// ─────────────────────────────────────────────────────────────────────────────

export async function getProductByBarcode(barcode: string): Promise<FoodProduct | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const res = await fetch(`${OFF_BASE}/api/v2/product/${encodeURIComponent(barcode)}.json`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Resurgo/1.0 (contact@resurgo.life)' },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = (await res.json()) as { status?: number; product?: Record<string, unknown> };
    if (data.status !== 1 || !data.product) return null;

    return parseProduct(data.product);
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Calculate nutrition for a given serving
// ─────────────────────────────────────────────────────────────────────────────

export function calculateServingNutrition(product: FoodProduct, servings: number): NutrientData {
  const multiplier = (product.servingQuantity ?? 100) * servings / 100;
  return {
    energy_kcal: Math.round(product.nutrients.energy_kcal * multiplier),
    fat: Math.round(product.nutrients.fat * multiplier * 10) / 10,
    saturatedFat: Math.round(product.nutrients.saturatedFat * multiplier * 10) / 10,
    carbohydrates: Math.round(product.nutrients.carbohydrates * multiplier * 10) / 10,
    sugars: Math.round(product.nutrients.sugars * multiplier * 10) / 10,
    fiber: Math.round(product.nutrients.fiber * multiplier * 10) / 10,
    proteins: Math.round(product.nutrients.proteins * multiplier * 10) / 10,
    salt: Math.round(product.nutrients.salt * multiplier * 10) / 10,
    sodium: Math.round(product.nutrients.sodium * multiplier * 10) / 10,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Build daily nutrition summary from meal entries
// ─────────────────────────────────────────────────────────────────────────────

export function buildDailySummary(meals: MealLogEntry[], date: string): DailyNutritionSummary {
  let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0, totalFiber = 0, totalSugar = 0;
  let nutriscoreTotal = 0, nutriscoreCount = 0;

  for (const meal of meals) {
    totalCalories += meal.calculatedNutrients.energy_kcal;
    totalProtein += meal.calculatedNutrients.proteins;
    totalCarbs += meal.calculatedNutrients.carbohydrates;
    totalFat += meal.calculatedNutrients.fat;
    totalFiber += meal.calculatedNutrients.fiber;
    totalSugar += meal.calculatedNutrients.sugars;

    if (meal.food.nutriscoreGrade) {
      nutriscoreTotal += NUTRISCORE_NUMERIC[meal.food.nutriscoreGrade] ?? 0;
      nutriscoreCount++;
    }
  }

  return {
    date,
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10,
    totalFat: Math.round(totalFat * 10) / 10,
    totalFiber: Math.round(totalFiber * 10) / 10,
    totalSugar: Math.round(totalSugar * 10) / 10,
    mealCount: meals.length,
    nutriscoreAvg: nutriscoreCount > 0 ? Math.round(nutriscoreTotal / nutriscoreCount * 10) / 10 : 0,
    meals,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Find healthier alternatives (same category, better nutriscore)
// ─────────────────────────────────────────────────────────────────────────────

export async function findHealthierAlternatives(product: FoodProduct, limit = 5): Promise<FoodProduct[]> {
  const category = product.categories[0];
  if (!category) return [];

  const result = await searchFoods({
    query: category,
    sortBy: 'nutriscore',
    pageSize: limit + 5,
  });

  const currentScore = product.nutriscoreGrade ? (NUTRISCORE_NUMERIC[product.nutriscoreGrade] ?? 0) : 0;

  return result.products
    .filter((p) => {
      if (p.barcode === product.barcode) return false;
      const score = p.nutriscoreGrade ? (NUTRISCORE_NUMERIC[p.nutriscoreGrade] ?? 0) : 0;
      return score > currentScore;
    })
    .slice(0, limit);
}

// ─────────────────────────────────────────────────────────────────────────────
// Format food data for AI coach consumption
// ─────────────────────────────────────────────────────────────────────────────

export function formatFoodForAI(product: FoodProduct): string {
  const n = product.nutrients;
  const lines = [
    `🍽️ ${product.name}${product.brand ? ` (${product.brand})` : ''}`,
    `Nutriscore: ${product.nutriscoreGrade?.toUpperCase() ?? 'N/A'} | NOVA: ${product.novaGroup ?? 'N/A'}`,
    `Per 100g: ${n.energy_kcal}kcal | P:${n.proteins}g | C:${n.carbohydrates}g | F:${n.fat}g | Fiber:${n.fiber}g`,
    `Serving: ${product.servingSize ?? 'N/A'}`,
  ];

  if (product.isVegan) lines.push('🌱 Vegan');
  else if (product.isVegetarian) lines.push('🥚 Vegetarian');

  if (product.allergens.length > 0) lines.push(`⚠️ Allergens: ${product.allergens.join(', ')}`);

  return lines.join('\n');
}

export function formatDailySummaryForAI(summary: DailyNutritionSummary): string {
  return [
    `📊 Daily Nutrition (${summary.date})`,
    `Calories: ${summary.totalCalories}kcal | Meals: ${summary.mealCount}`,
    `Protein: ${summary.totalProtein}g | Carbs: ${summary.totalCarbs}g | Fat: ${summary.totalFat}g`,
    `Fiber: ${summary.totalFiber}g | Sugar: ${summary.totalSugar}g`,
    `Avg Nutriscore: ${summary.nutriscoreAvg > 0 ? summary.nutriscoreAvg.toFixed(1) + '/5' : 'N/A'}`,
  ].join('\n');
}
