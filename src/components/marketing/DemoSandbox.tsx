'use client';

import { useMemo, useState } from 'react';
import { brainDumpToPlan } from '@/lib/marketing/demoEngine';

const DEFAULT_TEXT = `- Finish onboarding copy
- Draft launch post
- Follow up with early users
- Plan this week\'s goals
- Clean up old tasks`;

export default function DemoSandbox() {
  const [input, setInput] = useState(DEFAULT_TEXT);

  const result = useMemo(() => brainDumpToPlan(input), [input]);

  return (
    <section className="grid gap-4 rounded border border-zinc-800 bg-zinc-950 p-4 lg:grid-cols-2">
      <div>
        <h3 className="mb-2 text-base font-semibold text-zinc-100">Brain dump</h3>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={12}
          className="w-full rounded border border-zinc-700 bg-black px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none"
          placeholder="Type your messy list here…"
        />
      </div>

      <div className="space-y-3">
        <div className="rounded border border-zinc-800 bg-black p-3">
          <h4 className="mb-2 text-sm font-semibold text-zinc-200">Top 3</h4>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-zinc-300">
            {result.top3.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>

        <div className="rounded border border-zinc-800 bg-black p-3">
          <h4 className="mb-2 text-sm font-semibold text-zinc-200">Today plan buckets</h4>
          <div className="space-y-2 text-sm text-zinc-300">
            {result.structured.map((group) => (
              <div key={group.bucket}>
                <p className="font-semibold text-zinc-200">{group.bucket}</p>
                <ul className="list-disc pl-5">
                  {group.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded border border-zinc-800 bg-black p-3">
          <h4 className="mb-2 text-sm font-semibold text-zinc-200">JSON</h4>
          <pre className="overflow-auto text-xs text-zinc-400">{result.json}</pre>
        </div>
      </div>
    </section>
  );
}
