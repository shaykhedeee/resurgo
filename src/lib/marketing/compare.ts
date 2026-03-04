import { ComparisonPage } from './types';

export const COMPARISON_PAGES: ComparisonPage[] = [
  'habitica', 'ticktick', 'todoist', 'notion', 'streaks', 'habitify', 'reclaim', 'things3', 'anydo', 'trello'
].map((competitor) => ({
  slug: `resurgo-vs-${competitor}`,
  competitor: competitor === 'things3' ? 'Things 3' : competitor.charAt(0).toUpperCase() + competitor.slice(1),
  summary: `If you want fewer tools and more execution, RESURGO gives you planning + habit tracking + AI guidance in one workflow compared to ${competitor}.`,
  bestFor: 'People who feel overwhelmed by fragmented productivity apps and want one AI-guided command center.',
  categories: [
    { name: 'Brain Dump → Prioritized Plan', resurgo: 'Built-in AI flow', competitor: 'Mostly manual setup' },
    { name: 'Habit + Goal + Task Unity', resurgo: 'Native and connected', competitor: 'Partial or separate modules' },
    { name: 'ADHD / Overwhelm UX', resurgo: 'Gentle accountability and low-friction defaults', competitor: 'General-purpose workflows' },
    { name: 'Weekly Reflection', resurgo: 'AI-generated review and adjustments', competitor: 'Manual review process' },
    { name: 'Coach Guidance', resurgo: 'Action-capable AI coaches', competitor: 'Limited or not included' },
  ],
  pricing: {
    resurgo: 'Free tier + Pro from $4.99/mo',
    competitor: 'Varies by plan and platform',
  },
  faq: [
    {
      question: `Is RESURGO better than ${competitor} for beginners?`,
      answer: 'If you want fewer setup decisions and faster “first win”, yes—RESURGO is optimized for immediate action after sign-up.',
    },
    {
      question: `Can I migrate from ${competitor}?`,
      answer: 'Yes. Start with a brain dump, then recreate your top goals and active tasks in one guided flow.',
    },
  ],
}));

export async function getAllComparisons(): Promise<ComparisonPage[]> {
  return COMPARISON_PAGES;
}

export async function getComparisonBySlug(slug: string): Promise<ComparisonPage | null> {
  return COMPARISON_PAGES.find((page) => page.slug === slug) ?? null;
}
