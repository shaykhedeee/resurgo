import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUseCaseBySlug } from '@/lib/marketing/useCases';
import NicheLandingPage, { type NicheFaq } from '@/components/marketing/NicheLandingPage';

export const metadata: Metadata = {
  title: 'Best Productivity App for Solopreneurs 2026 | RESURGO',
  description:
    'Resurgo is the AI life operating system built for solopreneurs. One command center for goals, habits, client tasks, and budget — no credit card required.',
  keywords: ['solopreneur productivity app', 'productivity app for solopreneurs', 'solo business operating system', 'solopreneur tools 2026', 'AI productivity for founders', 'best app for solopreneurs', 'one person business tools'],
  alternates: { canonical: '/solopreneurs' },
  openGraph: {
    title: 'Best Productivity App for Solopreneurs 2026 | RESURGO',
    description: 'One command center for goals, habits, client tasks, and budget. Built for the one-person business.',
    url: 'https://resurgo.life/solopreneurs',
    siteName: 'RESURGO',
    type: 'website',
    images: [{ url: 'https://resurgo.life/og-image.png', width: 1200, height: 630 }],
  },
};

const FAQ: NicheFaq[] = [
  {
    question: 'What is the best productivity app for solopreneurs in 2026?',
    answer: 'RESURGO is purpose-built for solopreneurs. It combines AI goal tracking, habit formation, client task management, and budget coaching in one system — replacing 4-5 separate apps with a single command center that adapts to how you work.',
  },
  {
    question: 'How does RESURGO help solopreneurs stay accountable without a team?',
    answer: 'RESURGO provides an AI coaching layer that checks in daily, tracks your streaks, sends smart reminders, and escalates when you fall behind. It acts as your accountability partner, helping you maintain momentum without needing co-founders or managers.',
  },
  {
    question: 'Can RESURGO replace my project management app as a solopreneur?',
    answer: 'Yes. RESURGO handles goal setting, task breakdown, daily planning, habit tracking, budget monitoring, and AI coaching — all in one dashboard. Most solopreneurs use it as their single source of truth, replacing Notion, Todoist, and spreadsheets.',
  },
  {
    question: 'Is there a free plan for solopreneurs?',
    answer: 'RESURGO offers a free plan with 3 active goals, up to 5 habits per day, 10 AI messages per day, and 2 AI coaches. No credit card required. Upgrade when your business grows and you need unlimited usage, advanced analytics, and all 5 AI coaches.',
  },
  {
    question: 'How long does it take to set up RESURGO as a solopreneur?',
    answer: 'Most solopreneurs have their first 3 goals and 5 habits configured within 10 minutes. The onboarding AI walks you through a business goal audit and recommends a starting routine based on your work style and priorities.',
  },
];

export default async function SolopreneursPage() {
  const page = await getUseCaseBySlug('solopreneurs');
  if (!page) notFound();

  return (
    <NicheLandingPage
      page={page}
      heroHeadline="Your Entire Solo Business, One Command Center"
      heroCta="START_FREE -- SOLOPRENEURS"
      openingAnswer={{
        title: 'The best productivity app for solopreneurs should connect delivery, planning, and growth in one weekly loop.',
        body:
          'Resurgo is strongest when you need one place for client work, shipping priorities, habits, and the content or sales actions that keep revenue moving. It replaces coordination overhead with a clearer next action.',
      }}
      faq={FAQ}
      relatedReads={[
        {
          href: '/blog/productivity-system-for-founders',
          title: 'Productivity System for Founders',
          description: 'Weekly execution guidance for solo operators balancing delivery, growth, and admin.',
        },
        {
          href: '/blog/organic-traffic-content-system-for-founders',
          title: 'Organic Traffic Content System for Founders',
          description: 'Commercial-intent content workflow for building traffic without losing product time.',
        },
        {
          href: '/blog/launch-week-content-ops-for-solo-operators',
          title: 'Launch-Week Content Ops for Solo Operators',
          description: 'Recent operational guide for publishing consistently during launch or promotion weeks.',
        },
      ]}
      stats={[
        { value: '1 app', label: 'Replaces 4-5 Separate Tools' },
        { value: '10 min', label: 'Setup Time' },
        { value: '94%', label: 'Report More Consistency' },
        { value: 'Free', label: 'To Start — No Card' },
      ]}
      keywords={[
        'solopreneur productivity',
        'one-person business tools',
        'AI goal tracker for founders',
        'solo operator OS',
        'small business habit tracker',
        'accountability app for solopreneurs',
        'bootstrapped founder tools',
        'one person business productivity app 2026',
      ]}
    />
  );
}

