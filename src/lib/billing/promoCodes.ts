// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Promo Code Validation
// ═══════════════════════════════════════════════════════════════════════════════

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
    code: 'LTP50',
    planKey: 'lifetime',
    label: 'Product Hunt Launch Deal',
    description: 'Lifetime access at the exclusive founder price. One payment, forever.',
    discountedPrice: 49.99,
    expiresAt: new Date('2026-06-30T23:59:59Z'),
  },
];

export function validatePromoCode(code: string): PromoCode | null {
  const normalized = code.trim().toUpperCase();
  const promo = PROMO_CODES.find((p) => p.code === normalized);
  if (!promo) return null;
  if (new Date() > promo.expiresAt) return null;
  return promo;
}
