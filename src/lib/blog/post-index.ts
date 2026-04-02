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
    desc: 'We pitted 5 AI coaches against traditional coaching approaches across accountability, cost, availability, and emotional intelligence. The results might surprise you.',
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
  {
    slug: 'best-habit-tracker-app-2026',
    title: 'Best Habit Tracker Apps of 2026: Ranked and Reviewed',
    desc: "We tested 12 habit tracking apps in 2026 and ranked them by depth, AI features, gamification, and real-world usability. Spoiler: the best one does much more than track habits.",
    date: 'March 10, 2026',
    lastModified: '2026-03-10T09:00:00.000Z',
    readTime: '14 min',
    tags: ['habits', 'habit stacking', 'AI productivity', 'productivity'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'ticktick-vs-notion-habits',
    title: 'TickTick vs Notion for Habits: Which Is Better in 2026?',
    desc: "TickTick and Notion are both popular productivity tools — but neither was built for habit formation. Here's an honest comparison and a better alternative for people serious about building habits.",
    date: 'March 9, 2026',
    lastModified: '2026-03-09T10:00:00.000Z',
    readTime: '10 min',
    tags: ['habits', 'productivity', 'goal setting', 'AI productivity'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'ai-habit-tracker-guide-2026',
    title: 'How to Track Habits with AI: The Complete 2026 Guide',
    desc: "AI-powered habit tracking is more than streaks and reminders — it breaks your goals into daily actions, coaches you when you drift, and adapts your plan based on real progress. Here's how to use it.",
    date: 'March 8, 2026',
    lastModified: '2026-03-08T11:00:00.000Z',
    readTime: '12 min',
    tags: ['AI productivity', 'AI coaching', 'habits', 'accountability'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'habitica-alternatives-2026',
    title: '7 Best Habitica Alternatives in 2026 (With AI Coaching)',
    desc: "Habitica was great in 2014. In 2026, there are better options that combine gamification with AI coaching, automated goal planning, and wellness tracking. Here are the 7 best alternatives.",
    date: 'March 7, 2026',
    lastModified: '2026-03-07T09:30:00.000Z',
    readTime: '11 min',
    tags: ['habits', 'productivity', 'AI coaching', 'AI productivity'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'best-productivity-app-adhd-focus',
    title: 'Best Productivity Apps for ADHD and Focus Issues in 2026',
    desc: "ADHD productivity isn't about more willpower — it's about better systems. We reviewed the top apps specifically for ADHD brains: low friction, high feedback, and AI assistance built-in.",
    date: 'March 6, 2026',
    lastModified: '2026-03-06T08:00:00.000Z',
    readTime: '13 min',
    tags: ['focus', 'habits', 'AI productivity', 'psychology', 'productivity'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  // ── New SEO-priority commercial posts (March 2026) ──────────────────────
  {
    slug: 'streaks-vs-habitify-vs-resurgo-2026',
    title: 'Streaks vs Habitify vs Resurgo: Which Habit Tracker Wins in 2026?',
    desc: "We compared three popular habit trackers head-to-head on AI coaching, gamification, cross-platform support, and real-world stickiness. One of them has 5 AI coaches. The other two have zero.",
    date: 'March 8, 2026',
    lastModified: '2026-03-08T14:00:00.000Z',
    readTime: '12 min',
    tags: ['habits', 'productivity', 'comparison', 'AI coaching'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'best-goal-tracker-students-founders-2026',
    title: 'Best Goal Tracker Apps for Students and Founders in 2026',
    desc: "Students and founders share the same problem: too many goals, no execution system. We ranked the best goal tracker apps for people who need clarity, not more features.",
    date: 'March 8, 2026',
    lastModified: '2026-03-08T13:00:00.000Z',
    readTime: '11 min',
    tags: ['goals', 'goal setting', 'productivity', 'founder productivity'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'best-ai-productivity-apps-2026',
    title: 'Best AI Productivity Apps in 2026 (Ranked for Real Execution)',
    desc: "AI productivity apps promise to organize your life. Most add noise. We tested 10+ apps and ranked them by how well they convert AI intelligence into completed tasks and sustained habits.",
    date: 'March 8, 2026',
    lastModified: '2026-03-08T12:00:00.000Z',
    readTime: '15 min',
    tags: ['AI productivity', 'productivity', 'AI coaching', 'comparison'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'best-daily-planner-adhd-2026',
    title: 'Best Daily Planner Apps for ADHD in 2026',
    desc: "Standard planners are designed for neurotypical brains. ADHD needs low-friction, high-feedback systems with built-in recovery. Here are the best daily planner apps that actually work for ADHD adults.",
    date: 'March 8, 2026',
    lastModified: '2026-03-08T11:30:00.000Z',
    readTime: '13 min',
    tags: ['focus', 'productivity', 'planning', 'psychology'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'build-7-day-momentum-system-with-ai',
    title: 'How to Build a 7-Day Momentum System With AI',
    desc: "Momentum is not about motivation — it is about feedback loops. Here is a practical 7-day system using AI coaching to build self-reinforcing daily execution that compounds weekly.",
    date: 'March 8, 2026',
    lastModified: '2026-03-08T10:30:00.000Z',
    readTime: '10 min',
    tags: ['AI coaching', 'habits', 'consistency', 'accountability'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'why-productivity-apps-fail-after-week-two',
    title: 'Why Most Productivity Apps Fail After Week Two',
    desc: "It is not your fault. Most productivity apps are designed for the setup high, not the maintenance grind. Here is what actually causes the 2-week dropout and how to beat it.",
    date: 'March 8, 2026',
    lastModified: '2026-03-08T10:00:00.000Z',
    readTime: '9 min',
    tags: ['productivity', 'habits', 'psychology', 'consistency'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'brain-dump-to-weekly-plan',
    title: 'How to Turn a Brain Dump Into a Weekly Plan',
    desc: "Your brain dump is full of unprocessed potential. Here is a step-by-step method to turn chaotic notes into a structured weekly execution plan with AI assistance.",
    date: 'March 8, 2026',
    lastModified: '2026-03-08T09:30:00.000Z',
    readTime: '8 min',
    tags: ['planning', 'weekly planning', 'AI productivity', 'founder productivity'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'what-ai-accountability-system-should-do',
    title: 'What an AI Accountability System Should Actually Do',
    desc: "Most AI assistants just remind you to do things. A real AI accountability system detects patterns, predicts drift, adjusts difficulty, and coaches you through the hard parts.",
    date: 'March 8, 2026',
    lastModified: '2026-03-08T09:00:00.000Z',
    readTime: '10 min',
    tags: ['AI coaching', 'accountability', 'AI productivity', 'habits'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  // ── 10 New SEO-Rich Posts (March 2026) ──────────────────────────────────
  {
    slug: 'best-vision-board-app-2026',
    title: 'Best Vision Board Apps in 2026: Ranked and Reviewed',
    desc: "We tested the top digital vision board apps and ranked them by AI features, ease of use, and whether they actually help you execute on your goals — not just pin pretty pictures.",
    date: 'March 15, 2026',
    lastModified: '2026-03-15T09:00:00.000Z',
    readTime: '12 min',
    tags: ['vision board', 'AI productivity', 'goal setting'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'ai-daily-planner-app-guide-2026',
    title: 'The Best AI Daily Planner Apps of 2026 (That Actually Work)',
    desc: "AI daily planners promise to organize your day automatically. Most fail after Week 1. We ranked the ones that use AI to build lasting daily planning habits — not just morning overwhelm.",
    date: 'March 14, 2026',
    lastModified: '2026-03-14T10:00:00.000Z',
    readTime: '13 min',
    tags: ['planning', 'AI productivity', 'productivity', 'habits'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'how-to-set-goals-and-achieve-them',
    title: 'How to Set Goals and Actually Achieve Them (Science-Backed Guide)',
    desc: "Most goal-setting advice is wrong. SMART goals, vision boarding without execution, and motivation-based starts all predict failure. Here is what the research says actually works.",
    date: 'March 13, 2026',
    lastModified: '2026-03-13T11:00:00.000Z',
    readTime: '14 min',
    tags: ['goal setting', 'goals', 'productivity', 'AI productivity'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'todoist-alternative-with-ai-coaching',
    title: 'Looking for a Todoist Alternative? Try This AI-Powered Option',
    desc: "Todoist is great for task capture, but it has no habit tracking, no AI coaching, no goal system, and no focus timers. Here is a powerful Todoist alternative built for people who want to close the loop between tasks and actual results.",
    date: 'March 12, 2026',
    lastModified: '2026-03-12T12:00:00.000Z',
    readTime: '10 min',
    tags: ['productivity', 'comparison', 'AI coaching', 'habits'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'digital-vision-board-maker-free',
    title: 'How to Make a Digital Vision Board for Free (With AI Suggestions)',
    desc: "Digital vision boards beat paper ones — they sync to your phone, stay searchable, and with the right app, connect to your actual daily goals. Here is how to make one for free, the right way.",
    date: 'March 11, 2026',
    lastModified: '2026-03-11T09:30:00.000Z',
    readTime: '9 min',
    tags: ['vision board', 'goal setting', 'AI productivity'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'best-productivity-app-entrepreneurs-2026',
    title: 'Best Productivity Apps for Entrepreneurs in 2026',
    desc: "Entrepreneurs need more than a task list. They need goal tracking, daily planning, AI coaching, focus sessions, and rapid weekly reviews — all in one place. These are the best options in 2026.",
    date: 'March 11, 2026',
    lastModified: '2026-03-11T08:00:00.000Z',
    readTime: '12 min',
    tags: ['founder productivity', 'productivity', 'AI coaching', 'goal setting'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: '30-day-habit-challenge-tracker',
    title: 'The 30-Day Habit Challenge: A Tracker System That Actually Sticks',
    desc: "30-day challenges fail for one reason: no recovery system. This guide shows you how to run a 30-day habit challenge with AI assistance, built-in fallback plans, and a tracking system that survives real life.",
    date: 'March 10, 2026',
    lastModified: '2026-03-10T13:00:00.000Z',
    readTime: '10 min',
    tags: ['habits', 'habit reset', 'consistency', 'accountability'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'notion-alternative-for-habits-goals',
    title: 'Best Notion Alternative for Habit Tracking and Goal Setting in 2026',
    desc: "Notion requires constant manual setup and has no AI coaching, no streak system, and no focus timers. If you want a Notion alternative that actually builds habits and tracks goals automatically, here it is.",
    date: 'March 10, 2026',
    lastModified: '2026-03-10T12:00:00.000Z',
    readTime: '11 min',
    tags: ['productivity', 'comparison', 'habits', 'goal setting'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'ai-personal-development-app-guide',
    title: 'How AI is Transforming Personal Development in 2026',
    desc: "Personal development used to mean books, journals, and expensive coaching. In 2026, AI apps do the tracking, coaching, planning, and analysis — making transformation more accessible and measurable than ever.",
    date: 'March 9, 2026',
    lastModified: '2026-03-09T11:00:00.000Z',
    readTime: '13 min',
    tags: ['AI coaching', 'AI productivity', 'habits', 'goal setting'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'how-to-track-habits-on-your-phone',
    title: 'How to Track Habits on Your Phone: The Complete Setup Guide',
    desc: "The best habit tracker on your phone is the one you actually use every day. This guide shows you exactly how to set up a mobile habit tracking system that survives missed days, schedule changes, and the inevitable motivation dips.",
    date: 'March 9, 2026',
    lastModified: '2026-03-09T10:00:00.000Z',
    readTime: '8 min',
    tags: ['habits', 'AI productivity', 'planning', 'consistency'],
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
  {
    slug: 'app-comparisons',
    title: 'App Comparisons & Alternatives',
    description: 'Honest head-to-head comparisons of habit trackers, productivity apps, and AI coaching tools for informed decision-making.',
    tags: ['comparison', 'habits', 'productivity', 'AI coaching', 'AI productivity'],
    keywords: ['streaks vs habitify', 'habitica alternatives', 'best habit tracker', 'ticktick vs notion', 'resurgo vs'],
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
