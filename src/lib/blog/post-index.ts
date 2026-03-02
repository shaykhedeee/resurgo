export type BlogPostIndex = {
  slug: string;
  title: string;
  desc: string;
  date: string;
  lastModified?: string;
  readTime: string;
  tags: string[];
  heroImage: string;
};

export type TopicCluster = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  keywords: string[];
};

export const BLOG_POST_INDEX: Array<BlogPostIndex> = [
  {
    slug: 'ai-growth-system-2026-ultimate-playbook',
    title: 'The AI Growth System for 2026: The Ultimate Playbook to Turn Attention into Revenue',
    desc: 'A research-backed operating system for founders and creators who want to convert AI-era discovery into pipeline, trust, and sales using one unified weekly execution loop.',
    date: 'March 2, 2026',
    lastModified: '2026-03-02T18:25:00.000Z',
    readTime: '18 min',
    tags: ['marketing strategy', 'AEO', 'AI productivity', 'conversion optimization', 'founder productivity'],
    heroImage: '/blog/ultimate-ai-growth-system-2026.svg',
  },
  {
    slug: 'why-vision-boards-fail-and-how-ai-fixes-it',
    title: 'Why Vision Boards Fail (and How AI Turns Them Into Execution Systems)',
    desc: 'Most vision boards are aesthetic inspiration with no behavior engine. Here is a practical framework to convert visuals into daily execution, measurable milestones, and real momentum.',
    date: 'March 2, 2026',
    lastModified: '2026-03-02T14:20:00.000Z',
    readTime: '12 min',
    tags: ['vision board', 'AI productivity', 'goal execution'],
    heroImage: '/blog/vision-board-ai-execution.svg',
  },
  {
    slug: 'stop-restarting-goals-every-monday',
    title: 'Stop Restarting Your Goals Every Monday: The Anti-Reset System',
    desc: 'If you are excellent at restarting but inconsistent at finishing, this operating system gives you a weekly structure that protects momentum through bad days.',
    date: 'March 1, 2026',
    lastModified: '2026-03-01T16:10:00.000Z',
    readTime: '11 min',
    tags: ['consistency', 'goal setting', 'weekly planning'],
    heroImage: '/blog/anti-reset-system.svg',
  },
  {
    slug: 'founder-weekly-planning-system',
    title: 'The Founder Weekly Planning System: Turn Chaos Into Shipped Work',
    desc: 'A practical planning framework for founders and builders who juggle product, marketing, operations, and personal execution without burning out.',
    date: 'February 28, 2026',
    lastModified: '2026-02-28T13:40:00.000Z',
    readTime: '13 min',
    tags: ['founder productivity', 'planning', 'execution'],
    heroImage: '/blog/founder-weekly-planning.svg',
  },
  {
    slug: 'seven-day-consistency-reset',
    title: 'The 7-Day Consistency Reset: Recover Fast After Falling Off Track',
    desc: 'Missed habits, late starts, and broken streaks do not need a dramatic comeback. This 7-day protocol rebuilds trust, structure, and momentum quickly.',
    date: 'February 27, 2026',
    lastModified: '2026-02-27T11:20:00.000Z',
    readTime: '10 min',
    tags: ['habit reset', 'comeback', 'self discipline'],
    heroImage: '/blog/seven-day-reset.svg',
  },
  {
    slug: 'ai-accountability-system-daily-execution',
    title: 'Build an AI Accountability System for Daily Execution (Not Just Motivation)',
    desc: 'Use AI as a consistency partner: plan decomposition, check-ins, friction alerts, and behavior-based nudges that convert intention into completed work.',
    date: 'February 26, 2026',
    lastModified: '2026-02-26T10:05:00.000Z',
    readTime: '12 min',
    tags: ['AI coaching', 'accountability', 'productivity'],
    heroImage: '/blog/ai-accountability-system.svg',
  },
  {
    slug: 'habit-stacking-examples-that-actually-work',
    title: 'Habit Stacking Examples That Actually Work (By Time, Location, and Trigger)',
    desc: 'Most habit stacks fail because the trigger is weak. These examples show how to design stacks that survive travel, stress, and schedule changes.',
    date: 'February 25, 2026',
    lastModified: '2026-02-25T09:45:00.000Z',
    readTime: '9 min',
    tags: ['habit stacking', 'behavior design', 'atomic habits'],
    heroImage: '/blog/habit-stacking-examples.svg',
  },
  {
    slug: 'goal-decomposition-for-big-projects',
    title: 'Goal Decomposition for Big Projects: From Overwhelm to Actionable Steps',
    desc: 'A tactical method to break intimidating goals into clear milestones and next actions so progress happens daily instead of staying conceptual.',
    date: 'February 24, 2026',
    lastModified: '2026-02-24T08:40:00.000Z',
    readTime: '11 min',
    tags: ['goal decomposition', 'planning', 'project execution'],
    heroImage: '/blog/goal-decomposition.svg',
  },
  {
    slug: 'morning-routine-for-focus-and-energy',
    title: 'A Morning Routine for Focus and Energy (Without Waking at 5AM)',
    desc: 'You do not need an extreme routine. You need a repeatable sequence that protects attention, energy, and strategic action before reactive work begins.',
    date: 'February 23, 2026',
    lastModified: '2026-02-23T08:10:00.000Z',
    readTime: '8 min',
    tags: ['morning routine', 'focus', 'energy management'],
    heroImage: '/blog/morning-focus-routine.svg',
  },
  {
    slug: 'procrastination-triggers-and-fast-interventions',
    title: 'Procrastination Triggers and Fast Interventions: A Field Guide',
    desc: 'Learn your top procrastination triggers and map each one to a rapid intervention so you can recover in minutes instead of losing entire days.',
    date: 'February 22, 2026',
    lastModified: '2026-02-22T12:15:00.000Z',
    readTime: '10 min',
    tags: ['procrastination', 'focus', 'mental performance'],
    heroImage: '/blog/procrastination-interventions.svg',
  },
  {
    slug: 'how-to-build-weekly-review-that-improves-retention',
    title: 'How to Build a Weekly Review That Improves Retention and Results',
    desc: 'A weekly review is the compounding loop behind long-term consistency. Here is a step-by-step format that drives better decisions and higher follow-through.',
    date: 'February 21, 2026',
    lastModified: '2026-02-21T10:50:00.000Z',
    readTime: '9 min',
    tags: ['weekly review', 'retention', 'habit tracking'],
    heroImage: '/blog/weekly-review-system.svg',
  },
  {
    slug: 'habit-science-why-streaks-work',
    title: 'The Neuroscience of Habit Streaks: Why Consecutive Days Actually Matter',
    desc: "Your brain on a habit loop isn't just repetition — it's identity construction. Here's the science behind why streaks work and how to use them without the shame spiral.",
    date: 'February 12, 2026',
    lastModified: '2026-02-12T09:30:00.000Z',
    readTime: '6 min',
    tags: ['habits', 'neuroscience', 'psychology'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'procrastination-is-not-laziness',
    title: 'Procrastination Is Not a Time Management Problem (And How to Actually Fix It)',
    desc: 'Procrastination is an emotional regulation failure, not a discipline one. Understanding this distinction is the first step to eliminating it permanently.',
    date: 'February 8, 2026',
    lastModified: '2026-02-08T11:40:00.000Z',
    readTime: '8 min',
    tags: ['procrastination', 'focus', 'psychology'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'ai-coaching-vs-human-coaching',
    title: 'AI Coaching vs Human Coaching: A Brutally Honest Comparison',
    desc: 'We pitted 6 AI personas against traditional coaching approaches across accountability, cost, availability, and emotional intelligence. The results might surprise you.',
    date: 'February 3, 2026',
    lastModified: '2026-02-03T14:05:00.000Z',
    readTime: '10 min',
    tags: ['AI', 'coaching', 'productivity'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'goal-tracking-systems-compared',
    title: "SMART Goals Are Dead. Here's What Actually Works in 2026.",
    desc: "SMART goals were designed for organizations in the 1980s. Here's why they fail for personal achievement — and the modern frameworks that actually move the needle.",
    date: 'January 28, 2026',
    lastModified: '2026-01-28T12:20:00.000Z',
    readTime: '7 min',
    tags: ['goals', 'systems', 'productivity'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'deep-work-in-the-age-of-notifications',
    title: 'Deep Work Is Becoming a Superpower (And How to Build It in 30 Days)',
    desc: "The ability to focus deeply is increasingly rare and increasingly valuable. Here's a 30-day protocol for rebuilding your attention span in the age of infinite distraction.",
    date: 'January 21, 2026',
    lastModified: '2026-01-21T10:10:00.000Z',
    readTime: '9 min',
    tags: ['focus', 'deep work', 'discipline'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
];

export const BLOG_TOPIC_CLUSTERS: Array<TopicCluster> = [
  {
    slug: 'habit-systems',
    title: 'Habit Systems & Consistency',
    description: 'Build resilient routines, recover quickly after misses, and design habits that survive real-world friction.',
    tags: ['habits', 'habit reset', 'habit stacking', 'behavior design', 'atomic habits', 'consistency', 'weekly review', 'retention', 'self discipline'],
    keywords: ['habit systems', 'consistency system', 'habit stacking', 'weekly habit review'],
  },
  {
    slug: 'focus-procrastination',
    title: 'Focus, Deep Work & Procrastination',
    description: 'Improve attention quality, reduce avoidance loops, and implement practical interventions for sustained cognitive output.',
    tags: ['focus', 'procrastination', 'deep work', 'mental performance', 'energy management', 'morning routine', 'psychology'],
    keywords: ['deep work', 'stop procrastinating', 'focus training', 'attention management'],
  },
  {
    slug: 'ai-coaching-execution',
    title: 'AI Coaching & Execution Systems',
    description: 'Use AI for practical accountability, planning, and daily execution workflows that translate intent into completed actions.',
    tags: ['AI', 'AI coaching', 'AI productivity', 'accountability', 'coaching', 'goal execution'],
    keywords: ['AI coaching', 'AI accountability', 'execution system', 'AI productivity'],
  },
  {
    slug: 'goals-planning-strategy',
    title: 'Goal Planning & Strategy',
    description: 'Decompose large outcomes into milestones and next actions with frameworks that increase completion rates.',
    tags: ['goal setting', 'goal decomposition', 'goals', 'systems', 'planning', 'weekly planning', 'project execution'],
    keywords: ['goal planning', 'goal decomposition', 'planning framework', 'strategy execution'],
  },
  {
    slug: 'founder-performance',
    title: 'Founder Performance & Self-Marketing',
    description: 'Execution frameworks for founders balancing product, growth, and personal consistency while shipping every week.',
    tags: ['founder productivity', 'execution', 'planning', 'vision board', 'marketing strategy', 'AEO', 'conversion optimization'],
    keywords: ['founder productivity', 'founder planning', 'self-marketing system', 'ship weekly'],
  },
];

function isValidDateInput(value: string): boolean {
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}

function validateBlogPostIndex(posts: Array<BlogPostIndex>) {
  const seenSlugs = new Set<string>();

  for (const post of posts) {
    if (seenSlugs.has(post.slug)) {
      throw new Error(`[BlogIndex] Duplicate slug detected: ${post.slug}`);
    }
    seenSlugs.add(post.slug);

    if (!post.lastModified) {
      throw new Error(`[BlogIndex] Missing lastModified for slug: ${post.slug}`);
    }

    if (!isValidDateInput(post.date)) {
      throw new Error(`[BlogIndex] Invalid publish date for slug: ${post.slug}`);
    }

    if (!isValidDateInput(post.lastModified)) {
      throw new Error(`[BlogIndex] Invalid lastModified for slug: ${post.slug}`);
    }
  }
}

validateBlogPostIndex(BLOG_POST_INDEX);

export function getPostsForCluster(clusterSlug: string): Array<BlogPostIndex> {
  const cluster = BLOG_TOPIC_CLUSTERS.find((item) => item.slug === clusterSlug);
  if (!cluster) return [];

  return BLOG_POST_INDEX.filter((post) =>
    post.tags.some((tag) => cluster.tags.includes(tag))
  );
}
