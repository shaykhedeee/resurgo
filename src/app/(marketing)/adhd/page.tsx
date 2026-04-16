import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUseCaseBySlug } from '@/lib/marketing/useCases';
import NicheLandingPage, { type NicheFaq } from '@/components/marketing/NicheLandingPage';

export const metadata: Metadata = {
  title: 'Best Productivity App for ADHD 2026 | RESURGO',
  description:
    'Resurgo is the AI life OS built for ADHD brains. Low-friction brain dumps, micro-habits, streak recovery, dopamine-driven rewards, and an AI coach that adapts to your energy — not a generic schedule.',
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
    'dopamine habit tracker ADHD',
  ],
  alternates: { canonical: '/adhd' },
  openGraph: {
    title: 'RESURGO — The Productivity OS Built for ADHD Brains',
    description:
      'Finally, a system designed around how ADHD brains actually work. One brain dump clears your head. AI does the sorting so you can start — not plan.',
    url: 'https://resurgo.life/adhd',
    siteName: 'RESURGO',
    type: 'website',
    images: [{ url: 'https://resurgo.life/og-image.png', width: 1200, height: 630 }],
  },
};

const FAQ: NicheFaq[] = [
  {
    question: 'What is the best productivity app for ADHD adults in 2026?',
    answer: 'RESURGO is built specifically for ADHD brains. It uses low-friction brain dumps to externalize racing thoughts, micro-habits (2-5 minutes each) to build momentum, a streak recovery system so one missed day doesn\'t end your streak, and an AI coach that understands executive function challenges rather than demanding rigid schedules.',
  },
  {
    question: 'How does RESURGO help with ADHD executive function?',
    answer: 'RESURGO reduces executive function load by automating daily planning. You do a 2-minute morning brain dump. The AI sorts tasks by urgency and energy required, presents your Top 3 for today, and breaks each into a first micro-action. No empty agenda staring at you, no decision fatigue, just a clear start.',
  },
  {
    question: 'Does RESURGO have streak recovery for ADHD users who miss days?',
    answer: 'Yes. RESURGO has a Streak Freeze system that protects your streak on high-difficulty days. You can also use the Compassionate Reset feature, which acknowledges a bad week, resets without guilt, and rebuilds momentum with a gentler starting point. ADHD setbacks don\'t have to derail your whole system.',
  },
  {
    question: 'Is RESURGO low-friction enough for ADHD use?',
    answer: 'RESURGO was designed friction-first for ADHD users. The daily check-in takes 2-3 minutes. Habit logging is a single tap. Brain dump accepts voice or text. No complex menus, no overwhelming dashboards. You see exactly what matters today and nothing else unless you ask.',
  },
  {
    question: 'Can RESURGO help me hyperfocus on the right things?',
    answer: 'Yes. RESURGO\'s Focus Session mode creates a distraction-free single-task environment with a timer. The AI identifies your current hyperfocus window based on energy level and suggests the single highest-value task to direct that energy. When hyperfocus ends, it logs what you accomplished and sets the next session.',
  },
  {
    question: 'Does RESURGO work for ADHD teens and college students?',
    answer: 'RESURGO works for all ages with ADHD. For students, it provides class schedule habit stacks, assignment deadline tracking, and study streak gamification. The XP and level system provides dopamine rewards for task completion — making productivity feel more like a game than a chore.',
  },
];

export default async function AdhdPage() {
  const page = await getUseCaseBySlug('adhd');
  if (!page) notFound();

  return (
    <NicheLandingPage
      page={page}
      heroHeadline="Built for How Your Brain Actually Works"
      heroCta="START_FREE -- ADHD EDITION"
      faq={FAQ}
      stats={[
        { value: '2 min', label: 'Daily Check-in (Low Friction)' },
        { value: '87%', label: 'Maintain Streaks with Recovery' },
        { value: '0', label: 'Judgment for Missed Days' },
        { value: 'Free', label: 'To Start — No Card' },
      ]}
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
