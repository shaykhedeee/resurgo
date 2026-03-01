'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Dodo Customer Portal Button
// Opens the Dodo-hosted subscription management portal
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ArrowRight } from 'lucide-react';

interface DodoCustomerPortalProps {
  className?: string;
  label?: string;
}

export default function DodoCustomerPortal({
  className = '',
  label = 'Manage subscription',
}: DodoCustomerPortalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getPortal = useAction(api.payments.getCustomerPortal);

  const handleClick = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPortal({});
      window.location.href = result.portal_url;
    } catch (err) {
      console.error('[DodoPortal] Failed to get portal URL:', err);
      setError('Unable to load billing portal. Please try again.');
      setLoading(false);
    }
  }, [getPortal]);

  return (
    <div>
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
            Loading…
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            {label} <ArrowRight className="w-4 h-4" />
          </span>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
