import { NextRequest, NextResponse } from 'next/server';
import {
  getPostComments,
  getProductByName,
} from '@/lib/api/producthunt';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') ?? 'post';

  try {
    if (mode === 'comments') {
      const postIdParam = searchParams.get('postId');
      const limitParam = searchParams.get('limit');
      const postId = Number(postIdParam);
      const limit = limitParam ? Number(limitParam) : 10;

      if (!Number.isFinite(postId) || postId <= 0) {
        return NextResponse.json({ error: 'Valid postId is required' }, { status: 400 });
      }

      const comments = await getPostComments(postId, Number.isFinite(limit) && limit > 0 ? limit : 10);
      return NextResponse.json({ comments }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    const slug = searchParams.get('slug') ?? 'resurgo';
    if (!slug.trim()) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const product = await getProductByName(slug.trim());
    return NextResponse.json({ product }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    console.error('[producthunt-api] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Product Hunt service unavailable' },
      { status: 500 }
    );
  }
}
