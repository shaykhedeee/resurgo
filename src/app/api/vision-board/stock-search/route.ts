// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/vision-board/stock-search?q=fitness+motivation&domain=HEALTH&limit=12
// Search for curated stock images across Getty, Unsplash, and Pexels
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { searchStockImages, searchDomainImages } from '@/lib/ai/vision-board/image-service';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const query = (req.nextUrl.searchParams.get('q') ?? '').slice(0, 200);
  const ALLOWED_DOMAINS = ['HEALTH', 'CAREER', 'WEALTH', 'RELATIONSHIP', 'LEARNING', 'TRAVEL', 'MINDSET', 'CREATIVITY', 'FINANCE', 'PERSONAL'];
  const rawDomain = req.nextUrl.searchParams.get('domain');
  const domain = rawDomain && ALLOWED_DOMAINS.includes(rawDomain.toUpperCase()) ? rawDomain.toUpperCase() : null;
  const limitStr = req.nextUrl.searchParams.get('limit');
  const limit = Math.min(Math.max(parseInt(limitStr ?? '12', 10) || 12, 1), 30);

  try {
    const images = domain && !query
      ? await searchDomainImages(domain, limit)
      : await searchStockImages(query || 'motivation inspiration lifestyle', limit);

    return NextResponse.json({ images, count: images.length });
  } catch (err) {
    console.error('[StockSearch] Route error:', err);
    return NextResponse.json({ images: [], count: 0, error: 'Search failed' });
  }
}
