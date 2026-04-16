import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUseCaseBySlug } from '@/lib/marketing/useCases';
import NicheLandingPage, { type NicheFaq } from '@/components/marketing/NicheLandingPage';

export const metadata: Metadata = {
  title: 'Best Productivity App for Indie Hackers 2026 | RESURGO',
  description:
    'Resurgo helps indie hackers ship consistently, avoid burnout, and stay accountable -- without a co-founder or team. Brain dump → plan → execute.',
  keywords: ['indie hacker productivity app', 'productivity app for indie hackers', 'build in public tools', 'ship faster app', 'solo founder accountability', 'best tools indie hacker 2026', 'maker productivity system'],
  alternates: { canonical: '/indie-hackers' },
  openGraph: {
    title: 'Best Productivity App for Indie Hackers 2026 | RESURGO',
    description: 'Ship more. Burn out less. Stay accountable as an indie hacker without a co-founder.',
    url: 'https://resurgo.life/indie-hackers',
    siteName: 'RESURGO',
    type: 'website',
    images: [{ url: 'https://resurgo.life/og-image.png', width: 1200, height: 630 }],
  },
};

const FAQ: NicheFaq[] = [
  {
    question: 'What productivity app do indie hackers use in 2026?',
    answer: 'RESURGO is the go-to productivity system for indie hackers. It provides daily shipping accountability, brain dump to plan conversion, streak tracking, and AI coaching that understands the build-in-public lifestyle — without forcing a corporate workflow.',
  },
  {
    question: 'How does RESURGO help indie hackers ship consistently?',
    answer: 'RESURGO breaks big product goals into daily micro-tasks, tracks your shipping habit with streaks and XP rewards, and sends a daily check-in to confirm what you shipped. The AI coach adapts your plan when you hit blockers, keeping momentum without burning out.',
  },
  {
    question: 'Is RESURGO good for build-in-public creators?',
    answer: 'Yes. RESURGO is designed for async, solo creators. It tracks what you shipped each day, generates weekly summaries you can use for your build-in-public updates, and helps you maintain a consistent creation habit without needing external accountability partners.',
  },
  {
    question: 'Can RESURGO handle both product work and marketing habits for indie hackers?',
    answer: 'Absolutely. You can create separate habit stacks: one for product (daily coding, PR merged) and one for marketing (tweet/post, talk to user, revenue update). RESURGO tracks both and helps you balance building vs. growing.',
  },
  {
    question: 'Does RESURGO have a free tier for indie hackers just starting out?',
    answer: 'Yes. The free plan includes 3 goals, 5 tracked habits, full AI coaching access, and the complete dashboard — perfect for indie hackers in early-stage validation. No credit card required. Upgrade when you reach ramen profitability.',
  },
];

export default async function IndieHackersPage() {
  const page = await getUseCaseBySlug('indie-hackers');
  if (!page) notFound();

  return (
    <NicheLandingPage
      page={page}
      heroHeadline="Ship More. Burn Out Less. Stay Accountable."
      heroCta="START_FREE -- INDIE_HACKERS"
      faq={FAQ}
      stats={[
        { value: '21-day', label: 'Average Streak at 30 Days' },
        { value: '2×', label: 'Shipping Velocity Increase' },
        { value: 'Free', label: 'To Start — No Card' },
        { value: '3 min', label: 'Daily Check-in' },
      ]}
      keywords={[
        'indie hacker tools 2026',
        'productivity app for builders',
        'accountability for indie hackers',
        'solo product builder app',
        'ship daily habit tracker',
        'build in public accountability',
        'no-meeting productivity stack',
        'maker productivity system 2026',
      ]}
    />
  );
}
