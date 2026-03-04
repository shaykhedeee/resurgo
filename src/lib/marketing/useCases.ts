import { UseCasePage } from './types';

const CASES: Array<Pick<UseCasePage, 'slug' | 'persona'>> = [
  { slug: 'developers', persona: 'Developers' },
  { slug: 'adhd', persona: 'ADHD Brains' },
  { slug: 'students', persona: 'Students' },
  { slug: 'entrepreneurs', persona: 'Entrepreneurs' },
  { slug: 'remote-workers', persona: 'Remote Workers' },
  { slug: 'fitness', persona: 'Fitness Goals' },
  { slug: 'writers', persona: 'Writers' },
  { slug: 'parents', persona: 'Busy Parents' },
  { slug: 'recovering-from-burnout', persona: 'People Recovering from Burnout' },
  { slug: 'people-who-hate-todo-apps', persona: 'People Who Hate Todo Apps' },
];

export const USE_CASE_PAGES: UseCasePage[] = CASES.map((entry) => ({
  ...entry,
  summary: `${entry.persona} usually don’t need more features—they need less friction, clear priorities, and momentum that survives bad days.`,
  pains: [
    'Too many inputs and no clear next action',
    'Inconsistent motivation and frequent context switching',
    'Apps feel like more work instead of support',
  ],
  solutions: [
    'Brain dump anything, then let AI rank today’s top actions',
    'Use habit loops and low-friction defaults to reduce mental load',
    'Get coach nudges that focus on execution, not guilt',
  ],
  sampleSetup: [
    'One primary outcome for this month',
    'Top 3 daily anchors (morning, mid-day, shutdown)',
    'Weekly review every Sunday with adjustment prompts',
  ],
  testimonial: {
    quote: `“Resurgo helped me stop spinning and start shipping. I finally know what to do next each day.”`,
    role: `${entry.persona} user`,
  },
  related: CASES.filter((candidate) => candidate.slug !== entry.slug).slice(0, 3).map((candidate) => candidate.slug),
}));

export async function getAllUseCases(): Promise<UseCasePage[]> {
  return USE_CASE_PAGES;
}

export async function getUseCaseBySlug(slug: string): Promise<UseCasePage | null> {
  return USE_CASE_PAGES.find((page) => page.slug === slug) ?? null;
}
