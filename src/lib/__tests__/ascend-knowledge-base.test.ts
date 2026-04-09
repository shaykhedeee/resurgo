import {
  detectIntent,
  getFollowUpSuggestions,
  getIntentCta,
  PRICING,
} from '@/lib/ascend-knowledge-base';

describe('ascend knowledge base', () => {
  it('detects key chatbot intents correctly', () => {
    expect(detectIntent('Hi Kai')).toBe('greeting');
    expect(detectIntent('How much is pro?')).toBe('pricing_question');
    expect(detectIntent('I want to upgrade')).toBe('upgrade_interest');
    expect(detectIntent('My AI is not working')).toBe('troubleshooting');
    expect(detectIntent('I keep missing habits')).toBe('motivation_needed');
  });

  it('returns intent-aware follow-up suggestions', () => {
    const pricingSuggestions = getFollowUpSuggestions('pricing_question', 'free');
    const labels = pricingSuggestions.map((s) => s.label);

    expect(labels).toContain('Compare plans');
    expect(labels).toContain('Best plan for me');
    expect(labels).toContain('Unlock Pro value');
  });

  it('returns CTA for free users on pricing intents', () => {
    expect(getIntentCta('pricing_question', 'free')).toEqual({
      label: 'View plans',
      href: '/pricing',
    });

    expect(getIntentCta('pricing_question', 'pro')).toBeNull();
  });

  it('keeps chatbot pricing metadata aligned to billing claims', () => {
    expect(PRICING.free.limits.habits).toBe(5);
    expect(PRICING.free.limits.goals).toBe(3);
    expect(PRICING.pro.price).toBe(4.99);
    expect(PRICING.pro.priceYearly).toBe(29.99);
  });
});
