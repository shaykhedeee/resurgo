import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Roadmap — RESURGO',
  description: 'Public product roadmap for RESURGO — what is shipping now, what is planned next, and what is coming later across our marketing engine and core product.',
};

const ROADMAP = {
  now: [
    'Lifecycle email flows for onboarding, activation, and retention',
    'SEO landing pages for features, templates, and use-cases',
    'Referral tracking with in-app rewards and invite links',
    'Changelog publishing cadence with release notes each version',
    'A/B tests on hero messaging and signup conversion paths',
  ],
  next: [
    '[PLANNED] UTM-level attribution dashboard for campaign ROI',
    '[PLANNED] AI-generated ad creative briefs and angle testing',
    '[PLANNED] Lead scoring model for newsletter and waitlist users',
    '[PLANNED] In-app upgrade nudges based on usage milestones',
    '[PLANNED] Partner program pages with co-marketing kits',
  ],
  later: [
    '[PLANNED] Multi-language marketing pages for top regions',
    '[PLANNED] Brand ambassador portal with affiliate payouts',
    '[PLANNED] Predictive churn alerts connected to CRM automation',
    '[PLANNED] Interactive demo sandbox for self-serve evaluation',
    '[PLANNED] Marketplace integrations for no-code workflow tools',
  ],
};

function RoadmapColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="border border-zinc-900 bg-zinc-950">
      <div className="border-b border-zinc-900 px-4 py-3">
        <h2 className="font-mono text-xs font-bold tracking-widest text-zinc-200">{title}</h2>
      </div>
      <ul className="space-y-2 p-4">
        {items.map((item) => {
          const isPlanned = item.includes('[PLANNED]');
          return (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 font-mono text-[11px] text-orange-600">&gt;</span>
              <span className="font-mono text-xs leading-relaxed text-zinc-400">
                {isPlanned ? (
                  <>
                    <span className="mr-2 border border-zinc-800 px-1 py-0.5 text-[10px] tracking-widest text-zinc-500">
                      PLANNED
                    </span>
                    {item.replace('[PLANNED] ', '')}
                  </>
                ) : (
                  item
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">RESURGO :: ROADMAP</span>
          </div>
          <div className="p-6">
            <h1 className="font-mono text-2xl font-bold text-zinc-100">Public Product Roadmap</h1>
            <p className="mt-1 font-mono text-xs text-zinc-500">
              Transparent priorities across growth, marketing engine, and core product delivery.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <RoadmapColumn title="NOW" items={ROADMAP.now} />
          <RoadmapColumn title="NEXT" items={ROADMAP.next} />
          <RoadmapColumn title="LATER" items={ROADMAP.later} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/changelog"
            className="border border-zinc-800 bg-zinc-950 px-4 py-2 font-mono text-xs tracking-widest text-zinc-300 transition hover:bg-zinc-900"
          >
            [VIEW_CHANGELOG]
          </Link>
          <Link
            href="/sign-up"
            className="border border-orange-900 bg-orange-950/20 px-4 py-2 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/40"
          >
            [JOIN_RESURGO]
          </Link>
        </div>
      </div>
    </main>
  );
}
