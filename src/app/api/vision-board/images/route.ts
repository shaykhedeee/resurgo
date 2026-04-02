// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/vision-board/images?q=...&domain=...&limit=12
// Search stock images for vision board (Getty + Unsplash + Pexels cascade)
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { searchStockImages } from '@/lib/ai/vision-board/image-service';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const query = searchParams.get('q') ?? '';
  const domain = searchParams.get('domain') ?? '';
  const limit = Math.min(30, Math.max(1, Number(searchParams.get('limit')) || 12));

  // domain search uses the domain name itself as the query term
  const searchTerm = domain.trim() || query.trim();

  if (!searchTerm) {
    return NextResponse.json({ error: 'Missing ?q= or ?domain= parameter' }, { status: 400 });
  }

  const images = await searchStockImages(searchTerm, limit);
  return NextResponse.json({ images, query: searchTerm });
}
