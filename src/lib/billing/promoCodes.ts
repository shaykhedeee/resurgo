// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Promo Code Validation
// ═══════════════════════════════════════════════════════════════════════════════

import { FOUNDING_LIFETIME_ENDS_AT_ISO, FOUNDING_LIFETIME_PRICE_USD } from '@/lib/product-config';

export interface PromoCode {
  code: string;
  planKey: 'lifetime' | 'pro_monthly' | 'pro_yearly';
  label: string;
  description: string;
  discountedPrice: number;
  expiresAt: Date;
}

const PROMO_CODES: PromoCode[] = [
  {
    code: 'FOUNDER100',
    planKey: 'lifetime',
    label: 'Relaunch Founder Deal',
    description: 'Lifetime access for the first 100 relaunch signups. One payment, forever.',
    discountedPrice: FOUNDING_LIFETIME_PRICE_USD,
    expiresAt: new Date(FOUNDING_LIFETIME_ENDS_AT_ISO),
  },
];

export function validatePromoCode(code: string): PromoCode | null {
  const normalized = code.trim().toUpperCase();
  const promo = PROMO_CODES.find((p) => p.code === normalized);
  if (!promo) return null;
  if (new Date() > promo.expiresAt) return null;
  return promo;
}
