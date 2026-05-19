// ═════════════════════════════════════════════════════════════════════════════════
// RESURGO — Product Hunt Hooks
// React hooks for fetching and using Product Hunt data
// ═════════════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState } from 'react';
import { getProductByName, getPostComments, ProductHuntProduct, ProductHuntComment, formatPHDate } from '@/lib/api/producthunt';
import { trackMarketingEvent } from '@/lib/marketing/analytics';

// ─────────────────────────────────────────────────────────────────────────────
// useProductHuntData
// Fetch Product Hunt product data with caching and error handling
// ─────────────────────────────────────────────────────────────────────────────

export function useProductHuntData(productName: string = 'resurgo') {
  const [product, setProduct] = useState<ProductHuntProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!productName) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Track Product Hunt API call
        if (typeof window !== 'undefined') {
          trackMarketingEvent('ph_api_call', {
            endpoint: 'get_post',
            product: productName,
          });
        }
        
        const data = await getProductByName(productName);
        setProduct(data);
        
        if (data) {
          trackMarketingEvent('ph_data_success', {
            product_id: data.id,
            votes_count: data.votes_count,
          });
        } else {
          trackMarketingEvent('ph_data_not_found', {
            product: productName,
          });
        }
      } catch (err) {
        console.error('[useProductHuntData] Failed to fetch Product Hunt data:', err);
        setError('Failed to load Product Hunt data');
        
        if (typeof window !== 'undefined') {
          trackMarketingEvent('ph_api_error', {
            error: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productName]);

  return { product, loading, error };
}

// ─────────────────────────────────────────────────────────────────────────────
// useProductHuntComments
// Fetch Product Hunt comments for a post
// ─────────────────────────────────────────────────────────────────────────────

export function useProductHuntComments(postId: number, limit: number = 10) {
  const [comments, setComments] = useState<ProductHuntComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Track Product Hunt API call
        if (typeof window !== 'undefined') {
          trackMarketingEvent('ph_api_call', {
            endpoint: 'get_comments',
            post_id: postId,
          });
        }
        
        const data = await getPostComments(postId, limit);
        setComments(data);
        
        trackMarketingEvent('ph_comments_fetched', {
          post_id: postId,
          count: data.length,
        });
      } catch (err) {
        console.error('[useProductHuntComments] Failed to fetch Product Hunt comments:', err);
        setError('Failed to load comments');
        
        if (typeof window !== 'undefined') {
          trackMarketingEvent('ph_api_error', {
            endpoint: 'get_comments',
            error: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId, limit]);

  return { comments, loading, error };
}

// ─────────────────────────────────────────────────────────────────────────────
// useProductHuntStats
// Get formatted Product Hunt stats for display
// ─────────────────────────────────────────────────────────────────────────────

export function useProductHuntStats(productName: string = 'resurgo') {
  const { product, loading, error } = useProductHuntData(productName);
  
  const stats = product ? {
    id: product.id,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    url: product.url,
    votesCount: product.votes_count,
    commentsCount: product.comments_count,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    formattedDate: product.created_at ? formatPHDate(product.created_at) : null,
    maker: product.maker,
    topics: product.topics.nodes,
    thumbnail: product.thumbnail,
  } : null;

  return { stats, loading, error };
}