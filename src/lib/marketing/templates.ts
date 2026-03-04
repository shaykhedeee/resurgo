import { GoalTemplate } from './types';

const BASE_FAQ = [
  {
    question: 'Can I start this template for free?',
    answer: 'Yes. You can start on the free plan and upgrade only if you need advanced coaching or unlimited usage.',
  },
  {
    question: 'Do I need to follow every task exactly?',
    answer: 'No. Treat this as a starting framework. Adjust pacing and intensity based on your real schedule.',
  },
  {
    question: 'Will Resurgo adapt this plan as I progress?',
    answer: 'Yes. Your habits, completed tasks, and weekly reviews are used to refine what comes next.',
  },
];

function makeTemplate(seed: {
  slug: string;
  title: string;
  category: string;
  durationWeeks: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focus: string;
}) : GoalTemplate {
  const { slug, title, category, durationWeeks, difficulty, focus } = seed;
  return {
    slug,
    title,
    category,
    durationWeeks,
    difficulty,
    metaDescription: `Track your ${title.toLowerCase()} with AI-powered coaching, daily tasks, and habit tracking in Resurgo.`,
    description: `${title} becomes achievable when your week has structure and your day has clear priorities. This template gives you milestone sequencing, behavior triggers, and first-week execution tasks so you can start without overthinking. Instead of vague motivation, you get concrete actions tied to ${focus}. Use it as your launch pad, then let Resurgo adapt your plan using your real progress data.`,
    milestones: [
      {
        weekNumber: 1,
        title: 'Stabilize the baseline',
        description: `Set your baseline, remove friction, and lock in a daily rhythm around ${focus}.`,
      },
      {
        weekNumber: Math.max(2, Math.floor(durationWeeks / 2)),
        title: 'Build consistency under pressure',
        description: 'Keep execution steady on busy days with lighter fallback actions and pre-committed slots.',
      },
      {
        weekNumber: durationWeeks,
        title: 'Consolidate and sustain',
        description: 'Review wins, refine weak points, and convert this sprint into a repeatable long-term system.',
      },
    ],
    suggestedHabits: [
      { name: `10-minute ${focus} prep`, frequency: 'daily', why: 'Makes starting frictionless and lowers activation energy.' },
      { name: 'End-of-day review', frequency: 'daily', why: 'Captures lessons and creates tomorrow’s first step.' },
      { name: 'Weekly scorecard', frequency: 'weekly', why: 'Prevents drift and reveals what to adjust early.' },
    ],
    firstWeekTasks: [
      { day: 1, title: `Define success criteria for ${title}`, priority: 'high' },
      { day: 2, title: 'Block focused execution windows in calendar', priority: 'high' },
      { day: 3, title: 'Create anti-overwhelm fallback version', priority: 'medium' },
      { day: 4, title: 'Run first progress check-in', priority: 'medium' },
      { day: 5, title: 'Remove one recurring friction point', priority: 'medium' },
      { day: 6, title: 'Complete one high-leverage action', priority: 'high' },
      { day: 7, title: 'Weekly reflection + next-week setup', priority: 'high' },
    ],
    faq: BASE_FAQ,
    relatedTemplates: [],
  };
}

const TEMPLATE_SEEDS = [
  { slug: 'read-24-books-this-year', title: 'Read 24 Books This Year', category: 'learning', durationWeeks: 52, difficulty: 'intermediate', focus: 'reading consistency' },
  { slug: 'run-a-5k-in-12-weeks', title: 'Run a 5K in 12 Weeks', category: 'fitness', durationWeeks: 12, difficulty: 'beginner', focus: 'progressive training' },
  { slug: 'learn-spanish-in-6-months', title: 'Learn Spanish in 6 Months', category: 'learning', durationWeeks: 24, difficulty: 'intermediate', focus: 'language immersion' },
  { slug: 'save-5000-emergency-fund', title: 'Save a $5,000 Emergency Fund', category: 'finance', durationWeeks: 24, difficulty: 'intermediate', focus: 'cash-flow control' },
  { slug: 'build-a-morning-routine', title: 'Build a Morning Routine', category: 'wellness', durationWeeks: 8, difficulty: 'beginner', focus: 'identity-based habits' },
  { slug: 'quit-smoking-90-day-plan', title: 'Quit Smoking (90-Day Plan)', category: 'health', durationWeeks: 13, difficulty: 'advanced', focus: 'trigger replacement' },
  { slug: 'get-promoted-this-year', title: 'Get Promoted This Year', category: 'career', durationWeeks: 40, difficulty: 'advanced', focus: 'visibility and output' },
  { slug: 'learn-to-code-in-100-days', title: 'Learn to Code in 100 Days', category: 'learning', durationWeeks: 15, difficulty: 'intermediate', focus: 'daily practice loops' },
  { slug: 'lose-20-pounds-sustainably', title: 'Lose 20 Pounds Sustainably', category: 'fitness', durationWeeks: 20, difficulty: 'intermediate', focus: 'nutrition consistency' },
  { slug: 'launch-a-side-project', title: 'Launch a Side Project', category: 'career', durationWeeks: 12, difficulty: 'advanced', focus: 'shipping cadence' },
  { slug: 'write-your-first-book', title: 'Write Your First Book', category: 'creativity', durationWeeks: 24, difficulty: 'advanced', focus: 'draft momentum' },
  { slug: 'improve-sleep-quality', title: 'Improve Sleep Quality', category: 'wellness', durationWeeks: 6, difficulty: 'beginner', focus: 'night routine' },
  { slug: 'build-a-consistent-gym-habit', title: 'Build a Consistent Gym Habit', category: 'fitness', durationWeeks: 10, difficulty: 'beginner', focus: 'attendance streaks' },
  { slug: 'reduce-screen-time-by-50-percent', title: 'Reduce Screen Time by 50%', category: 'wellness', durationWeeks: 8, difficulty: 'intermediate', focus: 'attention protection' },
  { slug: 'master-public-speaking', title: 'Master Public Speaking', category: 'career', durationWeeks: 16, difficulty: 'intermediate', focus: 'deliberate practice' },
  { slug: 'build-a-budget-that-sticks', title: 'Build a Budget That Sticks', category: 'finance', durationWeeks: 8, difficulty: 'beginner', focus: 'category discipline' },
  { slug: 'start-a-daily-journaling-practice', title: 'Start a Daily Journaling Practice', category: 'mindset', durationWeeks: 6, difficulty: 'beginner', focus: 'reflection rhythm' },
  { slug: 'grow-your-linkedin-network', title: 'Grow Your LinkedIn Network', category: 'career', durationWeeks: 12, difficulty: 'intermediate', focus: 'outreach consistency' },
  { slug: 'recover-from-burnout', title: 'Recover from Burnout', category: 'wellness', durationWeeks: 12, difficulty: 'advanced', focus: 'energy restoration' },
  { slug: 'build-a-deep-work-routine', title: 'Build a Deep Work Routine', category: 'productivity', durationWeeks: 10, difficulty: 'intermediate', focus: 'focus blocks' },
] as const;

export const GOAL_TEMPLATES: GoalTemplate[] = TEMPLATE_SEEDS.map(makeTemplate).map((template, index, arr) => ({
  ...template,
  relatedTemplates: arr
    .filter((candidate) => candidate.slug !== template.slug)
    .slice(index % 4, (index % 4) + 3)
    .map((candidate) => candidate.slug),
}));

export async function getAllTemplates(): Promise<GoalTemplate[]> {
  return GOAL_TEMPLATES;
}

export async function getTemplateBySlug(slug: string): Promise<GoalTemplate | null> {
  return GOAL_TEMPLATES.find((template) => template.slug === slug) ?? null;
}
