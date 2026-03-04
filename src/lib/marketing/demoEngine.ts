export interface DemoResult {
  top3: string[];
  structured: Array<{ bucket: string; tasks: string[] }>;
  json: string;
}

const BUCKETS = ['Now', 'Soon', 'Later'];

export function brainDumpToPlan(input: string): DemoResult {
  const lines = input
    .split('\n')
    .map((line) => line.replace(/^[-*\d.)\s]+/, '').trim())
    .filter(Boolean);

  const unique = Array.from(new Set(lines));
  const top3 = unique.slice(0, 3);

  const structured = BUCKETS.map((bucket, idx) => ({
    bucket,
    tasks: unique.filter((_, taskIdx) => taskIdx % 3 === idx).slice(0, 5),
  })).filter((group) => group.tasks.length > 0);

  const json = JSON.stringify(
    {
      inputCount: unique.length,
      top3,
      buckets: structured,
      generatedAt: new Date().toISOString(),
      mode: 'demo_static_no_ai_call',
    },
    null,
    2,
  );

  return { top3, structured, json };
}
