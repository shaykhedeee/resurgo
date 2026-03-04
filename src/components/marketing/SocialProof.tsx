'use client';

import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';

export default function SocialProof() {
  const stats = useQuery(api.marketing.getLiveStats, {});

  const cards = [
    { label: 'Users onboarded', value: stats?.totalUsers ?? 0 },
    { label: 'Tasks completed', value: stats?.tasksCompleted ?? 0 },
    { label: 'Brain dumps processed', value: stats?.brainDumpsProcessed ?? 0 },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">{card.label}</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-100">{card.value.toLocaleString()}</p>
        </div>
      ))}
    </section>
  );
}
