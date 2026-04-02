import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUseCaseBySlug } from '@/lib/marketing/useCases';
import NicheLandingPage from '@/components/marketing/NicheLandingPage';

export const metadata: Metadata = {
  title: 'Best Productivity App for Freelance Developers 2026 | RESURGO',
  description:
    'Resurgo helps freelance developers balance client work, personal builds, and learning goals -- all in one AI-powered system.',
  keywords: ['productivity app for freelance developers', 'freelancer productivity tools', 'developer habit tracker', 'freelance developer OS', 'time management for freelancers'],
  alternates: { canonical: '/freelance-developers' },
};

export default async function FreelanceDevelopersPage() {
  const page = await getUseCaseBySlug('freelance-developers');
  if (!page) notFound();

  return (
    <NicheLandingPage
      page={page}
      heroHeadline="Client Work, Side Projects, and Learning -- Balanced Daily by AI"
      heroCta="START_FREE -- FREELANCE_DEVS"
      keywords={[
        'freelance developer productivity',
        'developer time management app',
        'AI task manager for developers',
        'client work habit tracker',
        'deep work app for developers',
        'side project accountability',
        'learning goal tracker developer',
      ]}
    />
  );
}
