'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Promo Code Banner + Input
// Shows on /billing page. Auto-applies from ?promo= URL param.
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { validatePromoCode, type PromoCode } from '@/lib/billing/promoCodes';
import { Gift, Tag, Check, X, Sparkles } from 'lucide-react';

interface PromoCodeBannerProps {
  onPromoApplied?: (promo: PromoCode | null) => void;
}

export default function PromoCodeBanner({ onPromoApplied }: PromoCodeBannerProps) {
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [error, setError] = useState('');
  const [showInput, setShowInput] = useState(false);

  // Auto-apply from URL parameter
  useEffect(() => {
    const promoParam = searchParams.get('promo') || searchParams.get('coupon');
    if (promoParam) {
      const result = validatePromoCode(promoParam);
      if (result) {
        setAppliedPromo(result);
        setInputValue(promoParam.toUpperCase());
        onPromoApplied?.(result);
      }
    }
  }, [searchParams, onPromoApplied]);

  const handleApply = () => {
    setError('');
    const result = validatePromoCode(inputValue);
    if (result) {
      setAppliedPromo(result);
      onPromoApplied?.(result);
    } else {
      setError('Invalid or expired promo code');
      setAppliedPromo(null);
      onPromoApplied?.(null);
    }
  };

  const handleRemove = () => {
    setAppliedPromo(null);
    setInputValue('');
    setError('');
    onPromoApplied?.(null);
  };

  // If a promo is applied, show the success banner
  if (appliedPromo) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-green-500/5 p-4 sm:p-5 mb-8">
        <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-400">{appliedPromo.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  {appliedPromo.code}
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">{appliedPromo.description}</p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 transition"
          >
            <X className="w-3 h-3" /> Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-ascend-400 transition"
        >
          <Tag className="w-4 h-4" />
          Have a promo code?
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value.toUpperCase());
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              placeholder="Enter promo code"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm font-mono tracking-wider focus:outline-none focus:border-ascend-500 transition"
              autoFocus
            />
          </div>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-xl bg-ascend-500/10 text-ascend-400 text-sm font-semibold hover:bg-ascend-500/20 border border-ascend-500/30 transition"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setShowInput(false);
              setError('');
              setInputValue('');
            }}
            className="px-3 py-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
    </div>
  );
}
