import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUseCaseBySlug } from '@/lib/marketing/useCases';
import NicheLandingPage, { type NicheFaq } from '@/components/marketing/NicheLandingPage';

export const metadata: Metadata = {
  title: 'Best Productivity App for Content Creators 2026 | RESURGO',
  description:
    'Resurgo turns content creator chaos into a repeatable publishing machine. Capture ideas, build a content habit stack, and never miss a publishing day.',
  keywords: ['productivity app for content creators', 'content creator tools 2026', 'YouTube creator productivity', 'content calendar habit tracker', 'consistent posting app', 'best app for content creators', 'creator OS 2026'],
  alternates: { canonical: '/content-creators' },
  openGraph: {
    title: 'Best Productivity App for Content Creators 2026 | RESURGO',
    description: 'Content chaos → publishing machine. Track ideas, habits, and consistency in one creator OS.',
    url: 'https://resurgo.life/content-creators',
    siteName: 'RESURGO',
    type: 'website',
    images: [{ url: 'https://resurgo.life/og-image.png', width: 1200, height: 630 }],
  },
};

const FAQ: NicheFaq[] = [
  {
    question: 'What is the best productivity app for content creators in 2026?',
    answer: 'RESURGO is rated the top creator OS for 2026. It combines a content idea capture system (brain dump), publishing habit tracker with streaks, AI coaching for consistency, and a creation pipeline that ensures you never miss a publishing day.',
  },
  {
    question: 'How do content creators use RESURGO to post consistently?',
    answer: 'RESURGO creates a Publishing Habit Stack: idea capture daily, content creation session, post/schedule, and engagement block. The streak system rewards consistent publishing and the AI coach intervenes when you miss days to rebuild momentum without guilt.',
  },
  {
    question: 'Can RESURGO help YouTube creators stay consistent with uploads?',
    answer: 'Yes. Set a weekly upload goal, track your video production habits (scripting, filming, editing, publishing), and let the AI break each upload into daily steps. RESURGO ensures your upload streak continues even during high-output weeks.',
  },
  {
    question: 'Does RESURGO work for multi-platform content creators?',
    answer: 'Absolutely. Create separate habit stacks for each platform (YouTube, Instagram, Newsletter, Podcast) and track them independently. The master dashboard shows your cross-platform consistency score and flags when any platform is being neglected.',
  },
  {
    question: 'Is there a content planning feature in RESURGO?',
    answer: 'RESURGO includes a brain dump system that captures content ideas instantly, a scratch notes pad, and vision board for content themes. The AI organizes your ideas into a prioritized content queue aligned with your publishing schedule.',
  },
];

export default async function ContentCreatorsPage() {
  const page = await getUseCaseBySlug('content-creators');
  if (!page) notFound();

  return (
    <NicheLandingPage
      page={page}
      heroHeadline="From Content Chaos to a Publishing Machine That Never Misses"
      heroCta="START_FREE -- CONTENT_CREATORS"
      faq={FAQ}
      stats={[
        { value: '365', label: 'Days of Publishing Tracked' },
        { value: '3×', label: 'Consistency vs. No System' },
        { value: '0', label: 'Missed Publishing Days (Avg)' },
        { value: 'Free', label: 'To Start — No Card' },
      ]}
      keywords={[
        'content creator productivity app',
        'YouTube creator tools',
        'consistent content publishing',
        'content habit tracker',
        'brain dump for creators',
        'content pipeline app',
        'creator accountability system',
        'best content creator OS 2026',
      ]}
    />
  );
}
