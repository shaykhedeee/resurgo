// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/nutrition/search?q=...&page=1&pageSize=20&barcode=...
// Search OpenFoodFacts or lookup by barcode
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { searchFoods, getProductByBarcode } from '@/lib/api/openfoodfacts';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = req.nextUrl;
  const barcode = searchParams.get('barcode');
  const query = (searchParams.get('q') ?? searchParams.get('query') ?? '').slice(0, 200);
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize')) || 20));
  const VALID_SORT = ['popularity', 'nutriscore', 'ecoscore'] as const;
  const rawSort = searchParams.get('sortBy');
  const sortBy = rawSort && (VALID_SORT as readonly string[]).includes(rawSort) ? rawSort as typeof VALID_SORT[number] : undefined;
  const nutriscoreMax = searchParams.get('nutriscoreMax') ?? undefined;
  const veganOnly = searchParams.get('vegan') === 'true';
  const vegetarianOnly = searchParams.get('vegetarian') === 'true';

  // Barcode lookup — only digits allowed
  if (barcode) {
    if (!/^\d{1,20}$/.test(barcode)) return NextResponse.json({ error: 'Invalid barcode format' }, { status: 400 });
    const product = await getProductByBarcode(barcode);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ product });
  }

  // Text search
  if (!query.trim()) {
    return NextResponse.json({ error: 'Missing ?q= search query or ?barcode=' }, { status: 400 });
  }

  const result = await searchFoods({
    query,
    page,
    pageSize,
    sortBy: sortBy || undefined,
    nutriscoreMax,
    veganOnly,
    vegetarianOnly,
  });

  return NextResponse.json(result);
}
