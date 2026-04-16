import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUseCaseBySlug } from '@/lib/marketing/useCases';
import NicheLandingPage, { type NicheFaq } from '@/components/marketing/NicheLandingPage';

export const metadata: Metadata = {
  title: 'Best Productivity App for Digital Nomads 2026 | RESURGO',
  description:
    'Resurgo keeps your habits and goals consistent across time zones, new cities, and changing routines. Your life OS, wherever you are in the world.',
  keywords: ['productivity app for digital nomads', 'remote work habit tracker', 'travel-friendly productivity app', 'digital nomad tools 2026', 'timezone-proof routine app', 'nomad productivity system', 'best app remote workers 2026'],
  alternates: { canonical: '/digital-nomads' },
  openGraph: {
    title: 'Best Productivity App for Digital Nomads 2026 | RESURGO',
    description: 'Your routine survives every time zone. Habits and goals that travel with you, anywhere.',
    url: 'https://resurgo.life/digital-nomads',
    siteName: 'RESURGO',
    type: 'website',
    images: [{ url: 'https://resurgo.life/og-image.png', width: 1200, height: 630 }],
  },
};

const FAQ: NicheFaq[] = [
  {
    question: 'What is the best productivity app for digital nomads in 2026?',
    answer: 'RESURGO is built for location-independent lifestyles. It adapts your habit schedule to timezone shifts, allows flexible check-in windows for travel days, and provides an emergency mode that reduces your daily plan to the single most important task when you\'re on the move.',
  },
  {
    question: 'How does RESURGO handle time zone changes for digital nomads?',
    answer: 'RESURGO uses flexible habit windows instead of rigid clock times. Your morning routine habits can be marked done within a 4-hour window, and the AI coach understands travel disruption patterns. When you check in after a long travel day, it adjusts your streak gracefully rather than penalizing you.',
  },
  {
    question: 'Can digital nomads use RESURGO without a stable internet connection?',
    answer: 'Yes. RESURGO is a progressive web app with offline capability. Your habits and goals are cached locally, and changes sync automatically when internet is restored. Perfect for co-working spaces, cafes, and areas with spotty connectivity.',
  },
  {
    question: 'Does RESURGO help digital nomads maintain health habits while traveling?',
    answer: 'Absolutely. RESURGO has a dedicated wellness tracking layer: sleep quality, hydration, movement, and energy levels. The AI coach, Aurora (Wellness Guide), tracks how your health habits perform across different countries and adjusts recommendations based on your travel history.',
  },
  {
    question: 'How does RESURGO help remote workers stay productive without a fixed office?',
    answer: 'RESURGO creates structure without requiring a fixed location. Your daily plan is generated each morning based on your energy level, current workload, and time available. The Focus Session timer helps you do deep work in noisy co-working spaces, and the shutdown ritual habit ensures proper work-life separation even when home and office blur.',
  },
];

export default async function DigitalNomadsPage() {
  const page = await getUseCaseBySlug('digital-nomads');
  if (!page) notFound();

  return (
    <NicheLandingPage
      page={page}
      heroHeadline="Your Routine Survives Every Time Zone. Your Goals Don\'t Stop When You Move."
      heroCta="START_FREE -- DIGITAL_NOMADS"
      faq={FAQ}
      stats={[
        { value: '12+', label: 'Countries Tested In' },
        { value: 'Offline', label: 'Works Without Internet' },
        { value: '91%', label: 'Maintain Habits While Traveling' },
        { value: 'Free', label: 'To Start \u2014 No Card' },
      ]}
      keywords={[
        'digital nomad productivity app',
        'habit tracker for remote workers',
        'timezone-proof routine',
        'travel productivity system',
        'location-independent work system',
        'nomad life operating system',
        'remote worker goal tracker',
        'best nomad productivity app 2026',
      ]}
    />
  );
}
