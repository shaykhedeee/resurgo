import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUseCaseBySlug } from '@/lib/marketing/useCases';
import NicheLandingPage from '@/components/marketing/NicheLandingPage';

export const metadata: Metadata = {
  title: 'Best Productivity App for Digital Nomads 2026 | RESURGO',
  description:
    'Resurgo keeps your habits and goals consistent across time zones, new cities, and changing routines. Your operating system, wherever you are.',
  keywords: ['productivity app for digital nomads', 'remote work habit tracker', 'travel-friendly productivity app', 'digital nomad tools 2026', 'timezone-proof routine app'],
  alternates: { canonical: '/digital-nomads' },
};

export default async function DigitalNomadsPage() {
  const page = await getUseCaseBySlug('digital-nomads');
  if (!page) notFound();

  return (
    <NicheLandingPage
      page={page}
      heroHeadline="Your Routine Survives Every Time Zone. Your Goals Don't Stop When You Move."
      heroCta="START_FREE -- DIGITAL_NOMADS"
      keywords={[
        'digital nomad productivity app',
        'habit tracker for remote workers',
        'timezone-proof routine',
        'travel productivity system',
        'location-independent work system',
        'nomad life operating system',
        'remote worker goal tracker',
      ]}
    />
  );
}
