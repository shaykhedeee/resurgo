import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUseCaseBySlug } from '@/lib/marketing/useCases';
import NicheLandingPage from '@/components/marketing/NicheLandingPage';

export const metadata: Metadata = {
  title: 'Best Productivity App for Content Creators 2026 | RESURGO',
  description:
    'Resurgo turns content creator chaos into a repeatable publishing machine. Capture ideas, build a content habit stack, and publish consistently.',
  keywords: ['productivity app for content creators', 'content creator tools 2026', 'YouTube creator productivity', 'content calendar habit tracker', 'consistent posting app'],
  alternates: { canonical: '/content-creators' },
};

export default async function ContentCreatorsPage() {
  const page = await getUseCaseBySlug('content-creators');
  if (!page) notFound();

  return (
    <NicheLandingPage
      page={page}
      heroHeadline="From Content Chaos to a Publishing Machine That Never Misses"
      heroCta="START_FREE -- CONTENT_CREATORS"
      keywords={[
        'content creator productivity app',
        'YouTube creator tools',
        'consistent content publishing',
        'content habit tracker',
        'brain dump for creators',
        'content pipeline app',
        'creator accountability system',
      ]}
    />
  );
}
