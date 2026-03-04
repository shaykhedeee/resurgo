import { LearnTerm } from './types';

const TERMS = [
  'habit-stacking',
  'time-blocking',
  'pomodoro-technique',
  'spaced-repetition',
  'executive-dysfunction',
  'decision-fatigue',
  'eisenhower-matrix',
  'implementation-intentions',
  'dopamine-loop',
  'attention-residue',
  'deep-work',
  'cognitive-load',
  'identity-based-habits',
  'burnout-recovery',
  'task-batching',
  'minimum-viable-day',
  'progressive-overload',
  'weekly-review',
  'habit-scorecard',
  'keystone-habits',
] as const;

function toTitle(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export const LEARN_PAGES: LearnTerm[] = TERMS.map((slug) => {
  const term = toTitle(slug);
  return {
    slug: `what-is-${slug}`,
    term,
    definition: `${term} is a practical behavior design concept used to reduce friction and improve consistency over time.`,
    whyItMatters: `When overwhelm is high, ${term.toLowerCase()} gives structure so execution does not rely on motivation spikes.`,
    howResurgoHelps: [
      'Turns theory into daily prompts and repeatable actions',
      'Connects habits to goals so every action has context',
      'Uses weekly review loops to adapt when life changes',
    ],
    relatedTerms: TERMS.filter((candidate) => candidate !== slug).slice(0, 3).map((candidate) => `what-is-${candidate}`),
  };
});

export async function getAllLearnTerms(): Promise<LearnTerm[]> {
  return LEARN_PAGES;
}

export async function getLearnTermBySlug(slug: string): Promise<LearnTerm | null> {
  return LEARN_PAGES.find((page) => page.slug === slug) ?? null;
}
