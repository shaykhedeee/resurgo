'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Dodo Checkout Button
// Triggers a Dodo Payments checkout session via Convex action
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { analytics } from '@/lib/analytics';

interface DodoCheckoutButtonProps {
  productId: string;
  label: string;
  className?: string;
  returnUrl?: string;
}

export default function DodoCheckoutButton({
  productId,
  label,
  className = '',
  returnUrl,
}: DodoCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const createCheckout = useAction(api.payments.createCheckout);

  const handleClick = useCallback(async () => {
    setLoading(true);
    // Fire checkout_start analytics event before redirecting
    analytics.startTrial(label);
    try {
      const result = await createCheckout({
        productId,
        returnUrl,
      });
      // Redirect to Dodo-hosted checkout page
      window.location.href = result.checkout_url;
    } catch (err) {
      console.error('[DodoCheckout] Failed to create session:', err);
      setLoading(false);
    }
  }, [createCheckout, productId, returnUrl, label]);

  return (
    <button onClick={handleClick} disabled={loading} className={className}>
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing…
        </span>
      ) : (
        label
      )}
    </button>
  );
}
