import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUseCaseBySlug } from '@/lib/marketing/useCases';
import NicheLandingPage from '@/components/marketing/NicheLandingPage';

export const metadata: Metadata = {
  title: 'Best Productivity App for Indie Hackers 2026 | RESURGO',
  description:
    'Resurgo helps indie hackers ship consistently, avoid burnout, and stay accountable -- without a co-founder or team. Brain dump, plan, execute.',
  keywords: ['indie hacker productivity app', 'productivity app for indie hackers', 'build in public tools', 'ship faster app', 'solo founder accountability'],
  alternates: { canonical: '/indie-hackers' },
};

export default async function IndieHackersPage() {
  const page = await getUseCaseBySlug('indie-hackers');
  if (!page) notFound();

  return (
    <NicheLandingPage
      page={page}
      heroHeadline="Ship More. Burn Out Less. Stay Accountable."
      heroCta="START_FREE -- INDIE_HACKERS"
      keywords={[
        'indie hacker tools 2026',
        'productivity app for builders',
        'accountability for indie hackers',
        'solo product builder app',
        'ship daily habit tracker',
        'build in public accountability',
        'no-meeting productivity stack',
      ]}
    />
  );
}
