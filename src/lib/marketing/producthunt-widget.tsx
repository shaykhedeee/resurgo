// ═════════════════════════════════════════════════════════════════════════════════
// RESURGO — Product Hunt Widget
// Displays Product Hunt metrics and social proof on dashboard
// ═════════════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, useState } from 'react';
import { formatPHDate, ProductHuntProduct } from '@/lib/api/producthunt';
import { trackMarketingEvent } from '@/lib/marketing/analytics';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ProductHuntWidgetProps {
  showOnDashboard?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function ProductHuntWidget({ showOnDashboard = true }: ProductHuntWidgetProps) {
  const [product, setProduct] = useState<ProductHuntProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!showOnDashboard) {
      setLoading(false);
      return;
    }

    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Track Product Hunt widget view
        if (typeof window !== 'undefined') {
          trackMarketingEvent('ph_widget_view', {
            widget_location: 'dashboard',
          });
        }

        const response = await fetch('/api/producthunt?slug=resurgo', {
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`Product Hunt API error: ${response.status}`);
        }

        const payload = await response.json() as { product: ProductHuntProduct | null };
        const productData = payload.product ?? null;
        setProduct(productData);
      } catch (err) {
        console.error('[ProductHuntWidget] Failed to fetch product data:', err);
        setError('Failed to load Product Hunt data');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [showOnDashboard]);

  if (!showOnDashboard) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4 text-zinc-500">
        Loading Product Hunt data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-4 text-red-400">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center py-4 text-zinc-500">
        Product Hunt data not available
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
            <span className="text-orange-400 font-mono font-bold text-sm">PH</span>
          </div>
          <div className="space-y-0.5">
            <div className="font-mono font-bold text-sm text-white">Resurgo</div>
            <div className="text-zinc-400 text-xs font-mono">{product.tagline}</div>
          </div>
        </div>
        <div className="text-right space-y-0.5">
          <div className="font-mono font-bold text-sm text-orange-400">
            {product.votes_count.toLocaleString()} upvotes
          </div>
          <div className="text-zinc-500 text-xs font-mono">
            {product.comments_count} comments
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {/* Description */}
        <p className="text-zinc-400 text-xs font-mono leading-relaxed line-clamp-3">
          {product.description}
        </p>
        
        {/* Maker info */}
        <div className="flex items-center gap-2 px-3 py-1 rounded border border-zinc-800/30 bg-zinc-800/20 text-xs">
          <span className="text-zinc-500 font-mono">Maker:</span>
          <span className="font-mono">{product.maker.name}</span>
        </div>
        
        {/* Topics */}
        {product.topics.nodes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {product.topics.nodes.map((topic) => (
              <span
                key={topic.slug}
                className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                  topic.kind === 'TOPIC'
                    ? 'border-blue-500/30 text-blue-400 bg-blue-500/10'
                    : 'border-purple-500/30 text-purple-400 bg-purple-500/10'
                }`}
              >
                {topic.display_name}
              </span>
            ))}
          </div>
        )}
        
        {/* Stats */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/20">
          <div className="text-zinc-500 font-mono text-xs">Launched</div>
          <div className="text-zinc-400 font-mono text-xs">
            {formatPHDate(product.created_at)}
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="mt-3 pt-2 border-t border-zinc-800/20">
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center font-mono font-bold text-xs py-1.5 rounded border transition-all duration-200 hover:bg-zinc-800/20"
        >
          View on Product Hunt →
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Alternative compact version for sidebars or footers
// ─────────────────────────────────────────────────────────────────────────────

export function ProductHuntBadge() {
  const [product, setProduct] = useState<ProductHuntProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/producthunt?slug=resurgo', {
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`Product Hunt API error: ${response.status}`);
        }

        const payload = await response.json() as { product: ProductHuntProduct | null };
        const productData = payload.product ?? null;
        setProduct(productData);
      } catch (err) {
        console.error('[ProductHuntBadge] Failed to fetch product data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  if (loading) {
    return (
      <span className="flex items-center gap-1 text-xs font-mono">
        <span className="animate-pulse rounded bg-orange-500/20 px-1 py-0.5 text-orange-400">
          PH
        </span>
        <span className="animate-pulse">Loading...</span>
      </span>
    );
  }

  if (!product) {
    return (
      <span className="flex items-center gap-1 text-xs font-mono text-zinc-500">
        <span className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
          <span className="text-orange-400 font-mono font-bold text-xs">PH</span>
        </span>
        <span>Product Hunt</span>
      </span>
    );
  }

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-xs font-mono text-orange-400 hover:text-orange-300 transition-colors"
    >
      <span className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
        <span className="text-orange-400 font-mono font-bold text-xs">PH</span>
      </span>
      <span>Featured on Product Hunt</span>
    </a>
  );
}
