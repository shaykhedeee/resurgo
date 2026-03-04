import { ToolPage } from './types';

export const TOOL_PAGES: ToolPage[] = [
  {
    slug: 'free-ai-task-prioritizer',
    title: 'Free AI Task Prioritizer',
    summary: 'Paste a messy task list and get an urgency-impact ordered plan with a top 3 focus list.',
    promptLabel: 'Paste your tasks (one per line)',
    outputLabel: 'Prioritized output',
    freeLimit: 3,
    cta: 'Unlock unlimited prioritization',
  },
  {
    slug: 'free-brain-dump-to-task-list',
    title: 'Free Brain Dump → Task List',
    summary: 'Turn a chaotic brain dump into structured tasks grouped by context and effort.',
    promptLabel: 'Dump everything on your mind',
    outputLabel: 'Structured task list',
    freeLimit: 3,
    cta: 'Turn this into your daily plan',
  },
  {
    slug: 'free-ai-goal-planner',
    title: 'Free AI Goal Planner',
    summary: 'Convert one goal into milestones, weekly targets, and first-week actions.',
    promptLabel: 'Describe your goal and timeline',
    outputLabel: 'Goal roadmap',
    freeLimit: 2,
    cta: 'Save this plan in your dashboard',
  },
  {
    slug: 'free-habit-streak-calculator',
    title: 'Free Habit Streak Calculator',
    summary: 'Estimate streak durability and identify your highest-risk days before they break your chain.',
    promptLabel: 'Habit + weekly schedule',
    outputLabel: 'Streak forecast',
    freeLimit: 5,
    cta: 'Track streaks automatically in Resurgo',
  },
  {
    slug: 'free-weekly-review-generator',
    title: 'Free Weekly Review Generator',
    summary: 'Summarize your wins, misses, and next week’s top improvements in 60 seconds.',
    promptLabel: 'What happened this week?',
    outputLabel: 'Weekly review summary',
    freeLimit: 2,
    cta: 'Automate this every Sunday',
  },
  {
    slug: 'free-pomodoro-timer',
    title: 'Free Pomodoro Timer',
    summary: 'Use a distraction-aware timer that pairs focus sessions with task intent.',
    promptLabel: 'Focus task',
    outputLabel: 'Session log',
    freeLimit: 10,
    cta: 'Sync sessions to your goals',
  },
];

export async function getAllTools(): Promise<ToolPage[]> {
  return TOOL_PAGES;
}

export async function getToolBySlug(slug: string): Promise<ToolPage | null> {
  return TOOL_PAGES.find((tool) => tool.slug === slug) ?? null;
}
