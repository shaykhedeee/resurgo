import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUseCaseBySlug } from '@/lib/marketing/useCases';
import NicheLandingPage from '@/components/marketing/NicheLandingPage';

export const metadata: Metadata = {
  title: 'Best Productivity App for ADHD 2026 | RESURGO',
  description:
    'Resurgo is the AI life OS built for ADHD brains. Low-friction brain dumps, micro-habits, streak recovery, and coaching that adapts to your energy — not a generic schedule.',
  keywords: [
    'best productivity app for ADHD',
    'ADHD goal tracker app',
    'productivity system for ADHD adults',
    'ADHD habit tracker 2026',
    'ADHD focus app',
    'ADHD task management',
    'productivity for neurodivergent',
    'ADHD time management app',
    'executive function app ADHD',
  ],
  alternates: { canonical: '/adhd' },
  openGraph: {
    title: 'RESURGO — The Productivity OS Built for ADHD Brains',
    description:
      'Finally, a system designed around how ADHD brains actually work. One brain dump clears your head. AI does the sorting so you can start — not plan.',
    url: '/adhd',
  },
};

export default async function AdhdPage() {
  const page = await getUseCaseBySlug('adhd');
  if (!page) notFound();

  return (
    <NicheLandingPage
      page={page}
      heroHeadline="Built for How Your Brain Actually Works"
      heroCta="START_FREE -- ADHD EDITION"
      keywords={[
        'ADHD productivity system',
        'brain dump for ADHD',
        'low-friction habit tracker',
        'ADHD task manager no overwhelm',
        'streak freeze for ADHD',
        'AI coach for ADHD adults',
        'executive function support app',
        'dopamine-driven goal tracker',
        'hyperfocus scheduling tool',
        'ADHD accountability partner',
      ]}
    />
  );
}
