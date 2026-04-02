'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Billing CTA Buttons (Client Component)
// Handles Dodo checkout sessions for authenticated users on the billing page
// ═══════════════════════════════════════════════════════════════════════════════

import DodoCheckoutButton from '@/components/DodoCheckoutButton';
import DodoCustomerPortal from '@/components/DodoCustomerPortal';

// Product ID map — these are set in Convex env vars and passed server-side
// For the client, we hardcode the known test-mode product IDs
const PRODUCT_IDS: Record<string, string> = {
  pro_monthly: process.env.NEXT_PUBLIC_DODO_PRODUCT_PRO_MONTHLY ?? 'pdt_0Nbgy81unnCdDrU1hc88F',
  pro_yearly: process.env.NEXT_PUBLIC_DODO_PRODUCT_PRO_YEARLY ?? 'pdt_0Nbgy84XzeQzbliSt63Rt',
  lifetime: process.env.NEXT_PUBLIC_DODO_PRODUCT_LIFETIME ?? 'pdt_0Nbgy868Cn6pYjtJCxB4T',
};

interface BillingCTAProps {
  planKey: string;
  ctaLabel: string;
  isHighlighted?: boolean;
  isLifetime?: boolean;
}

export function BillingCheckoutCTA({ planKey, ctaLabel, isHighlighted, isLifetime }: BillingCTAProps) {
  const productId = PRODUCT_IDS[planKey];
  if (!productId) return null;

  const baseClasses = 'block w-full text-center rounded-xl px-4 py-3 font-semibold transition-all mb-6';
  const colorClasses = isHighlighted
    ? 'bg-gradient-to-r from-ascend-500 to-ascend-600 text-white hover:shadow-lg hover:shadow-ascend-500/25'
    : isLifetime
    ? 'bg-gradient-to-r from-gold-400 to-orange-500 text-white hover:shadow-lg hover:shadow-gold-400/25'
    : 'bg-ascend-500/10 text-ascend-400 hover:bg-ascend-500/20 border border-ascend-500/30';

  return (
    <DodoCheckoutButton
      productId={productId}
      label={ctaLabel}
      className={`${baseClasses} ${colorClasses}`}
      returnUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/billing?success=true`}
    />
  );
}

export function BillingPortalCTA() {
  return (
    <DodoCustomerPortal
      className="shrink-0 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors"
      label="Manage subscription"
    />
  );
}
