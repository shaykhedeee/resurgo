import { trackMarketingEvent } from '@/lib/marketing/analytics';

export type ExperimentId =
  | 'experiment_landing_hero_copy_v1'
  | 'experiment_pricing_layout_v1'
  | 'experiment_onboarding_short_vs_deep_v1';

export interface ExperimentVariant {
  id: string;
  weight: number;
}

function getExperimentStorageKey(experimentId: ExperimentId): string {
  return `resurgo_exp_${experimentId}`;
}

function getStepStorageKey(funnelStep: string): string {
  return `resurgo_exp_step_${funnelStep}`;
}

function pickWeightedVariant(variants: ExperimentVariant[]): string {
  if (variants.length === 0) return 'control';

  const validVariants = variants.filter((variant) => variant.weight > 0);
  if (validVariants.length === 0) return 'control';

  const totalWeight = validVariants.reduce((sum, variant) => sum + variant.weight, 0);
  if (totalWeight <= 0) return 'control';

  let threshold = Math.random() * totalWeight;
  for (const variant of validVariants) {
    threshold -= variant.weight;
    if (threshold <= 0) return variant.id;
  }

  return validVariants[validVariants.length - 1]?.id ?? 'control';
}

export function getExperimentVariant(
  experimentId: ExperimentId,
  variants: ExperimentVariant[],
  funnelStep: string,
): string {
  if (typeof window === 'undefined') return 'control';

  const stepStorageKey = getStepStorageKey(funnelStep);
  const activeExperimentForStep = window.sessionStorage.getItem(stepStorageKey);

  if (activeExperimentForStep && activeExperimentForStep !== experimentId) {
    return 'control';
  }

  const experimentStorageKey = getExperimentStorageKey(experimentId);
  const existingVariant = window.localStorage.getItem(experimentStorageKey);

  if (existingVariant) {
    window.sessionStorage.setItem(stepStorageKey, experimentId);
    return existingVariant;
  }

  const assignedVariant = pickWeightedVariant(variants);
  window.localStorage.setItem(experimentStorageKey, assignedVariant);
  window.sessionStorage.setItem(stepStorageKey, experimentId);

  return assignedVariant;
}

export function trackExperimentExposure(
  experimentId: ExperimentId,
  variant: string,
  funnelStep: string,
): void {
  trackMarketingEvent('experiment_exposed', {
    experimentId,
    variant,
    funnelStep,
  });
}

export function clearExperimentStep(funnelStep: string): void {
  if (typeof window === 'undefined') return;

  window.sessionStorage.removeItem(getStepStorageKey(funnelStep));
}
