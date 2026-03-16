'use client';

import BrainDump from '@/components/BrainDump';

export default function BrainDumpPage() {
  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" />
            <span className="font-mono text-xs tracking-widest text-violet-500">AI_MODULE :: BRAIN_DUMP_PARSER_v2</span>
          </div>
          <div className="px-5 py-4">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Brain Dump</h1>
            <p className="mt-1 font-mono text-xs tracking-widest text-zinc-500">
              Pour out everything on your mind — AI parses it into tasks, habits, goals, and emotions.
            </p>
          </div>
        </div>

        {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
        <BrainDump isOpen={true} onClose={() => {}} />
      </div>
    </div>
  );
}
