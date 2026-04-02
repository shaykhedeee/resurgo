import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUseCaseBySlug } from '@/lib/marketing/useCases';
import NicheLandingPage from '@/components/marketing/NicheLandingPage';

export const metadata: Metadata = {
  title: 'Best Productivity App for Solopreneurs 2026 | RESURGO',
  description:
    'Resurgo is the AI life operating system built for solopreneurs. One command center for goals, habits, client tasks, and budget -- no team required.',
  keywords: ['solopreneur productivity app', 'productivity app for solopreneurs', 'solo business operating system', 'solopreneur tools 2026', 'AI productivity for founders'],
  alternates: { canonical: '/solopreneurs' },
};

export default async function SolopreneursPage() {
  const page = await getUseCaseBySlug('solopreneurs');
  if (!page) notFound();

  return (
    <NicheLandingPage
      page={page}
      heroHeadline="Your Entire Solo Business, One Command Center"
      heroCta="START_FREE -- SOLOPRENEURS"
      keywords={[
        'solopreneur productivity',
        'one-person business tools',
        'AI goal tracker for founders',
        'solo operator OS',
        'small business habit tracker',
        'accountability app for solopreneurs',
        'bootstrapped founder tools',
      ]}
    />
  );
}
