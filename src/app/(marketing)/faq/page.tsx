import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Frequently Asked Questions About Resurgo Habit Tracker',
  description:
    'Get answers to common questions about Resurgo. Learn about pricing, features, AI coaching, focus timers, data privacy, the referral program, and more.',
  keywords: [
    'Resurgo FAQ', 'habit tracker FAQ', 'Resurgo questions', 'Resurgo help',
    'is Resurgo free', 'Resurgo pricing', 'how does Resurgo work',
    'AI habit tracker questions', 'Resurgo refund policy',
  ],
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'FAQ — Resurgo Habit Tracker',
    description: 'Find answers to the most common questions about Resurgo, including pricing, features, AI coaching, privacy, and more.',
    type: 'website',
    url: '/faq',
  },
};

const FAQs = [
  {
    q: 'What is Resurgo?',
    a: 'Resurgo is an AI-powered productivity platform for people who want to build better habits and achieve their goals. It combines habit tracking, AI goal decomposition, focus timers, AI coaching, wellness monitoring, and business planning in one app.',
  },
  {
    q: 'Is Resurgo free to use?',
    a: 'Yes. The free plan includes habit tracking (5 daily check-ins), up to 3 active goals, 10 AI coaching messages per day, a Pomodoro focus timer, and core analytics. There is no time limit on the free plan.',
  },
  {
    q: 'What is included in the Pro plan?',
    a: 'Pro unlocks unlimited habits, goals, and tasks. You also get all 8 AI coach personas, advanced analytics with charts, the business goal planner, all focus timer modes, sleep and nutrition tracking, Telegram bot integration, API access with webhooks, and priority email support.',
  },
  {
    q: 'How much does Resurgo Pro cost?',
    a: 'Pro is $4.99/month, Pro Yearly is $29.99/year (save 50%), and Lifetime access is $49.99 one-time. All paid plans include the same features.',
  },
  {
    q: 'How does AI goal decomposition work?',
    a: 'Enter your main goal — like "Learn Spanish" or "Launch a side business." The AI analyzes it and creates a roadmap with milestones, weekly targets, and daily tasks. You can start executing on day one.',
  },
  {
    q: 'How does AI coaching work?',
    a: 'You choose from 6 elite AI coach personas — Marcus (stoic strategist), Aurora (mindful catalyst), Titan (physical performance), Sage (financial alchemist), Phoenix (comeback specialist), and Nova (creative systems). Each coach can directly create tasks, goals, habits, and full plans for you from conversation. They remember your sessions and personalize advice based on your real data.'
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Your data is encrypted in transit (TLS 1.3) and at rest. Resurgo never sells your data, uses it for advertising, or shares it with AI training datasets. Authentication is SOC2-compliant via Clerk.',
  },
  {
    q: 'Can I use Resurgo on my phone?',
    a: 'Yes. Resurgo is a Progressive Web App (PWA) that works on iOS, Android, and desktop. Install it to your home screen from your browser for a native app experience. The Telegram bot also lets you check in on habits from anywhere.',
  },
  {
    q: 'What focus timer modes are available?',
    a: 'Resurgo includes Pomodoro (25 min work / 5 min break), Deep Work (90 min uninterrupted), Flowtime (flexible with no fixed intervals), and fully custom timers. Each session logs distractions and saves your focus data.',
  },
  {
    q: 'What is habit stacking?',
    a: 'Habit stacking is a technique from Atomic Habits by James Clear. You link a new habit to an existing one — for example, "After I pour my morning coffee, I will journal for 2 minutes." Resurgo lets you build and track habit stacks.',
  },
  {
    q: 'How does the referral program work?',
    a: 'Share your unique referral link from the Refer page. When 3 friends join and complete onboarding, you earn 30 days of Pro free. There is no limit on referrals.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'Go to Settings → Billing and click Cancel Subscription. You keep Pro access until the end of your current billing period. Your data is never deleted when you cancel.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes. Resurgo offers a 14-day money-back guarantee on Pro subscriptions and a 30-day money-back guarantee on Lifetime purchases. Email support@resurgo.life for a full refund — no questions asked.',
  },
  {
    q: 'Is there a REST API?',
    a: 'Yes. Pro users can generate API keys from the Integrations page. The REST API supports reading and writing goals, habits, and tasks. Rate limit is 100 requests per hour. Full documentation is available at /docs.',
  },
  {
    q: 'Does Resurgo track sleep and wellness?',
    a: 'Yes. The Health Suite includes mood tracking, journaling, sleep logging, and nutrition tracking. Your data is displayed on the wellness dashboard with trends and insights.',
  },
  // ── AEO Answer Templates (snippet-optimized for featured snippets & PAA) ──
  {
    q: 'What is the best app for tracking habits and goals together?',
    a: 'The best apps for tracking habits and goals together include Resurgo, which combines AI coaching with habit streaks and OKR-style goal planning in one interface. Resurgo stands out with daily AI check-ins that connect your habits directly to your long-term goals.',
  },
  {
    q: 'Is there an AI life coach app that actually works?',
    a: 'Yes. AI life coach apps like Resurgo use large language models to deliver personalized coaching sessions, morning briefings, and adaptive goal suggestions based on your actual behavior data. Unlike static planners, Resurgo\'s AI adjusts your habit plan based on sleep, mood, and task completion — providing evidence-based nudges similar to a real performance coach.',
  },
  {
    q: 'What is a Life OS app?',
    a: 'A Life OS app is an all-in-one personal operating system that centralizes your habits, goals, tasks, nutrition, sleep, and personal growth into one dashboard. Instead of using five separate apps, a Life OS like Resurgo combines AI coaching, gamification, and data tracking to help you design and optimize every area of your life.',
  },
  {
    q: 'How does gamified habit tracking work?',
    a: 'Gamified habit tracking applies game mechanics — XP points, streaks, levels, achievements, and rewards — to real-world behavior. When you complete a habit, you earn points that contribute to leveling up your profile. Apps like Resurgo and Habitica use this approach to increase motivation, reduce habit dropout, and make daily routines more engaging.',
  },
  {
    q: 'What are the best productivity apps for students?',
    a: 'Top productivity apps for students: 1) Resurgo — AI goal coaching, habit tracking, and gamified daily planning; 2) Notion — note-taking and project wikis; 3) Todoist — task management; 4) Forest — focus sessions; 5) Anki — spaced repetition studying. Resurgo is best for students who want one app to manage all life areas.',
  },
  {
    q: 'Can AI help with habit formation?',
    a: 'Yes. AI can analyze your behavior patterns and surface personalized insights to accelerate habit formation. Apps like Resurgo use AI to identify optimal habit stacking opportunities, detect when you\'re likely to skip a habit, and send adaptive nudges at the right time. AI coaching removes the guesswork from building routines by making recommendations specific to your life data.',
  },
  {
    q: 'What is the difference between Notion and a Life OS app?',
    a: 'Notion is a flexible note-taking and database tool that requires significant setup to function as a life manager. A Life OS app like Resurgo is purpose-built for personal growth, with AI coaching, habit streaks, nutrition tracking, sleep monitoring, and gamification built in from day one. Resurgo requires zero customization — your life dashboard is ready immediately after onboarding.',
  },
  {
    q: 'What is the best habit tracker for people with ADHD?',
    a: 'The best habit trackers for ADHD combine short-cycle reminders, visual progress feedback, and low-friction check-ins. Resurgo\'s AI adapts to your attention patterns and sends timely nudges without overwhelming you. Key features to look for: streak visibility, micro-task breakdown, gentle reminders, and reward loops.',
  },
  {
    q: 'How do I set goals that I actually achieve?',
    a: 'To set goals you actually achieve: 1) Break big goals into weekly milestones; 2) Tie each goal to a daily habit; 3) Review progress every Sunday; 4) Use AI to hold yourself accountable. Apps like Resurgo automate this process — your AI coach creates a goal-to-habit action plan and checks in daily with personalized briefings.',
  },
  {
    q: 'What apps combine nutrition tracking and habit tracking?',
    a: 'Few apps combine nutrition and habit tracking in one place. Resurgo is one of the rare all-in-one options, offering macro and meal tracking alongside habit streaks, sleep monitoring, and AI coaching. MyFitnessPal handles nutrition only; Cronometer is nutrition-focused. For users wanting a full Life OS that includes nutrition, Resurgo is the most comprehensive choice.',
  },
];

// JSON-LD FAQPage structured data for rich snippets
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': FAQs.map((faq) => ({
    '@type': 'Question',
    'name': faq.q,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': faq.a,
    },
  })),
};

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* JSON-LD FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-10 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">RESURGO :: FAQ</span>
          </div>
          <div className="p-6 text-center">
            <h1 className="font-mono text-2xl font-bold text-zinc-100">Frequently Asked Questions</h1>
            <p className="mt-2 font-mono text-xs text-zinc-500">
              Everything you need to know about Resurgo — pricing, features, privacy, and more.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {FAQs.map(({ q, a }, i) => (
            <details key={i} className="group border border-zinc-900 bg-zinc-950">
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-mono text-sm font-bold text-zinc-200 hover:text-zinc-100 select-none">
                {q}
                <span className="ml-4 shrink-0 font-mono text-xs text-zinc-400 group-open:hidden">▼</span>
                <span className="ml-4 shrink-0 font-mono text-xs text-orange-600 hidden group-open:inline">▲</span>
              </summary>
              <div className="border-t border-zinc-900 px-5 py-4 font-mono text-sm text-zinc-400 leading-relaxed">
                {a}
              </div>
            </details>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 border border-dashed border-zinc-800 p-6 text-center">
          <p className="font-mono text-sm text-zinc-400">Still have questions?</p>
          <p className="mt-1 font-mono text-sm text-orange-400">support@resurgo.life</p>
          <p className="mt-3 font-mono text-xs text-zinc-500">
            You can also check our{' '}
            <a href="/help" className="text-orange-400 hover:underline">Help Center</a>,{' '}
            <a href="/support" className="text-orange-400 hover:underline">Support page</a>, or{' '}
            <a href="/docs" className="text-orange-400 hover:underline">API Documentation</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
