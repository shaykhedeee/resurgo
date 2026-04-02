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
  // Niche operator personas
  { slug: 'solopreneurs', persona: 'Solopreneurs' },
  { slug: 'indie-hackers', persona: 'Indie Hackers' },
  { slug: 'freelance-developers', persona: 'Freelance Developers' },
  { slug: 'content-creators', persona: 'Content Creators' },
  { slug: 'digital-nomads', persona: 'Digital Nomads' },
];

// Per-persona rich overrides -- niche operator personas get specific copy
const PERSONA_OVERRIDES: Partial<Record<string, Partial<Omit<UseCasePage, 'slug' | 'persona' | 'related'>>>> = {
  solopreneurs: {
    summary: 'Solopreneurs wear every hat -- CEO, builder, marketer, operator. Resurgo gives you one command center to keep the chaos organized and the momentum alive without needing a team.',
    pains: [
      'Juggling business goals, client work, and personal systems across separate apps',
      'Losing momentum when nothing external is holding you accountable',
      'Spending time planning instead of building',
    ],
    solutions: [
      'Brain dump all your business and personal priorities in seconds -- AI ranks what moves the needle today',
      'Let Nexus (Systems Builder coach) wire your weekly routines so the business runs on autopilot',
      'Use the Armory dashboard to track revenue goals, habit streaks, and shipped work side-by-side',
    ],
    sampleSetup: [
      'Set one primary business outcome this month (e.g., "get 10 paying customers")',
      'Daily shutdown ritual: log done + plan tomorrow\'s top 3',
      'Weekly Sunday review in 15 minutes -- what shipped, what slipped, what changes',
    ],
    testimonial: {
      quote: '"I run my whole solo business from Resurgo. Goals, habits, client tasks, budget -- it\'s all in one terminal. I stopped spinning the moment I had a single system."',
      role: 'Solopreneur, SaaS founder',
    },
  },
  'indie-hackers': {
    summary: 'Indie hackers build products, get users, and find revenue -- usually alone. Resurgo is built for the operator who ships, not just plans.',
    pains: [
      'Switching between 10 tabs and losing the actual work thread',
      'Building features instead of talking to users because it feels safer',
      'Burnout cycles that kill momentum every 6-8 weeks',
    ],
    solutions: [
      'Phoenix (Comeback Specialist coach) detects burnout signals and rebuilds your system before you crash',
      'Brain dump product ideas, user feedback, and tasks -- AI organizes them into today\'s execution plan',
      'Deep work and Pomodoro focus modes to get into shipping flow faster',
    ],
    sampleSetup: [
      'Ship log habit: write one sentence of what you shipped daily',
      'Monday: weekly goal; Friday: weekly review (10 min each)',
      'One "must ship this week" task locked at the top of the Dashboard',
    ],
    testimonial: {
      quote: '"Every indie hacker I know has 20 tools and no system. Resurgo gave me the system. I\'ve shipped more in 60 days than the previous 6 months."',
      role: 'Indie hacker, bootstrapped SaaS',
    },
  },
  'freelance-developers': {
    summary: 'Freelance developers manage client projects, personal builds, and learning roadmaps all simultaneously. Resurgo replaces the spreadsheet chaos with an intelligent execution system.',
    pains: [
      'Client work bleeding into personal project time with no clean separation',
      'Learning goals that never happen because client tasks always win',
      'Undercharging and overdelivering because boundaries are not systems',
    ],
    solutions: [
      'Separate goal tracks for client work vs. personal builds -- AI balances them daily',
      'Daily habit: one deep learning block at the time you\'re sharpest (AI suggests based on check-in energy)',
      'Weekly review surfaces patterns -- which clients drain vs. energize, where hours actually go',
    ],
    sampleSetup: [
      'Three goal categories: client delivery, personal build, learning/upskill',
      'Protected 90-minute deep work block daily (non-negotiable habit)',
      'Friday: ship log -- what did I actually build this week?',
    ],
    testimonial: {
      quote: '"I was always busy but never building what mattered. Resurgo showed me the pattern -- 70% of my time was reactive. One habit change fixed that."',
      role: 'Freelance developer, full-stack',
    },
  },
  'content-creators': {
    summary: 'Content creators juggle ideas, production, publishing, and audience building -- often alone. Resurgo turns creative chaos into a repeatable publishing machine.',
    pains: [
      'Content ideas die in random notes apps and never get made',
      'Inconsistent output because there\'s no production rhythm',
      'Algorithm anxiety replacing creative flow',
    ],
    solutions: [
      'Brain dump ideas anytime -- AI organizes them into a content pipeline',
      'Build a content creation habit stack: ideate, outline, draft, publish as daily anchors',
      'Weekly review tracks what performed, what drained energy, what to change',
    ],
    sampleSetup: [
      'Content goal: "publish 3x/week for 90 days"',
      'Daily habits: 30-min ideation block, 60-min deep writing block',
      'Batch recording day weekly as a protected focus session',
    ],
    testimonial: {
      quote: '"I\'ve tried every content planning tool. Resurgo is the first one that helped me actually stick to a schedule. The coach accountability changed everything."',
      role: 'YouTube creator, 45k subscribers',
    },
  },
  'digital-nomads': {
    summary: 'Digital nomads face a unique productivity challenge: time zones shift, environments change, routines break constantly. Resurgo adapts with you -- keeping the system stable when the location is not.',
    pains: [
      'New timezone means schedule disruption every few weeks',
      'Habits that worked at home fall apart in new environments',
      'Work-life lines blurred with no commute, no structure, no team rhythm',
    ],
    solutions: [
      'Location-independent habits anchored to energy level (from daily check-in), not clock time',
      'Emergency Mode for travel disruption days -- reduces today to exactly one task',
      'Aurora (Wellness Guide coach) tracks sleep and energy across timezone shifts and adjusts your plan',
    ],
    sampleSetup: [
      'Daily non-negotiable: morning check-in (energy + mood) before opening laptop',
      'Core 3 habits that survive any timezone: hydration, 15-min movement, shutdown ritual',
      'Weekly review anchored to day-of-week, not date',
    ],
    testimonial: {
      quote: '"I\'ve been nomadic for 3 years. Resurgo is the first system that stayed consistent across 12 countries. The adaptive coaching is the piece every other app was missing."',
      role: 'Digital nomad, developer + content creator',
    },
  },
};

export const USE_CASE_PAGES: UseCasePage[] = CASES.map((entry) => {
  const override = PERSONA_OVERRIDES[entry.slug] ?? {};
  return {
    ...entry,
    summary:
      override.summary ??
      `${entry.persona} usually don't need more features -- they need less friction, clear priorities, and momentum that survives bad days.`,
    pains: override.pains ?? [
      'Too many inputs and no clear next action',
      'Inconsistent motivation and frequent context switching',
      'Apps feel like more work instead of support',
    ],
    solutions: override.solutions ?? [
      "Brain dump anything, then let AI rank today's top actions",
      'Use habit loops and low-friction defaults to reduce mental load',
      'Get coach nudges that focus on execution, not guilt',
    ],
    sampleSetup: override.sampleSetup ?? [
      'One primary outcome for this month',
      'Top 3 daily anchors (morning, mid-day, shutdown)',
      'Weekly review every Sunday with adjustment prompts',
    ],
    testimonial: override.testimonial ?? {
      quote: `"Resurgo helped me stop spinning and start shipping. I finally know what to do next each day."`,
      role: `${entry.persona} user`,
    },
    related: CASES.filter((candidate) => candidate.slug !== entry.slug)
      .slice(0, 3)
      .map((candidate) => candidate.slug),
  };
});

export async function getAllUseCases(): Promise<UseCasePage[]> {
  return USE_CASE_PAGES;
}

export async function getUseCaseBySlug(slug: string): Promise<UseCasePage | null> {
  return USE_CASE_PAGES.find((page) => page.slug === slug) ?? null;
}