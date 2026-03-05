'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Wellness Radar Chart (Life Wheel Visualization)
// Pure SVG radar chart, no dependencies, terminal aesthetic
// ═══════════════════════════════════════════════════════════════════════════════

import { useMemo } from 'react';

interface RadarChartProps {
  scores: Record<string, number>;
  size?: number;
}

const DIMENSION_LABELS: Record<string, string> = {
  health: 'Health',
  career: 'Career',
  finance: 'Finance',
  learning: 'Learning',
  relationships: 'Relationships',
  creativity: 'Creativity',
  mindfulness: 'Mindfulness',
  personal_growth: 'Growth',
};

const DIMENSION_COLORS: Record<string, string> = {
  health: '#22c55e',
  career: '#f59e0b',
  finance: '#3b82f6',
  learning: '#a855f7',
  relationships: '#ec4899',
  creativity: '#f97316',
  mindfulness: '#06b6d4',
  personal_growth: '#10b981',
};

export default function WellnessRadarChart({ scores, size = 280 }: RadarChartProps) {
  const dimensions = Object.keys(DIMENSION_LABELS);
  const n = dimensions.length;
  const center = size / 2;
  const radius = (size / 2) - 40;

  const getPoint = (index: number, value: number): [number, number] => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const r = (value / 10) * radius;
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
  };

  const gridLevels = [2, 4, 6, 8, 10];

  const dataPath = useMemo(() => {
    const points = dimensions.map((dim, i) => getPoint(i, scores[dim] ?? 0));
    return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ') + ' Z';
  }, [scores, dimensions]);

  const avg = useMemo(() => {
    const vals = dimensions.map((d) => scores[d] ?? 0);
    return vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '0';
  }, [scores, dimensions]);

  return (
    <div className="border border-zinc-900 bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="font-pixel text-[0.6rem] tracking-widest text-emerald-500">LIFE_WHEEL</span>
        <span className="ml-auto font-terminal text-xs text-zinc-400">avg: {avg}/10</span>
      </div>
      <div className="flex justify-center p-4">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Grid */}
          {gridLevels.map((level) => {
            const points = dimensions.map((_, i) => getPoint(i, level));
            const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ') + ' Z';
            return (
              <path key={level} d={path} fill="none" stroke="#27272a" strokeWidth={0.5} />
            );
          })}
          {/* Spokes */}
          {dimensions.map((_, i) => {
            const [x, y] = getPoint(i, 10);
            return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#27272a" strokeWidth={0.5} />;
          })}
          {/* Data polygon */}
          <path d={dataPath} fill="rgba(234,88,12,0.15)" stroke="#ea580c" strokeWidth={1.5} />
          {/* Data points */}
          {dimensions.map((dim, i) => {
            const val = scores[dim] ?? 0;
            const [x, y] = getPoint(i, val);
            return <circle key={dim} cx={x} cy={y} r={3} fill={DIMENSION_COLORS[dim] ?? '#ea580c'} />;
          })}
          {/* Labels */}
          {dimensions.map((dim, i) => {
            const [x, y] = getPoint(i, 11.5);
            const val = scores[dim] ?? 0;
            return (
              <g key={dim}>
                <text
                  x={x} y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-zinc-400"
                  style={{ fontSize: '9px', fontFamily: 'var(--font-vt323), monospace' }}
                >
                  {DIMENSION_LABELS[dim]?.toUpperCase()}
                </text>
                <text
                  x={x} y={y + 12}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-zinc-500"
                  style={{ fontSize: '8px', fontFamily: 'var(--font-vt323), monospace' }}
                >
                  {val}/10
                </text>
              </g>
            );
          })}
          {/* Center label */}
          <text
            x={center} y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-orange-400"
            style={{ fontSize: '14px', fontFamily: 'var(--font-vt323), monospace', fontWeight: 'bold' }}
          >
            {avg}
          </text>
        </svg>
      </div>
      {/* Dimension breakdown */}
      <div className="grid grid-cols-2 gap-1 border-t border-zinc-900 p-3 md:grid-cols-4">
        {dimensions.map((dim) => {
          const val = scores[dim] ?? 0;
          const pct = (val / 10) * 100;
          return (
            <div key={dim} className="px-2 py-1">
              <div className="flex justify-between mb-0.5">
                <span className="font-terminal text-xs text-zinc-400">{DIMENSION_LABELS[dim]}</span>
                <span className="font-terminal text-xs text-zinc-300">{val}</span>
              </div>
              <div className="h-1 w-full bg-zinc-900">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: DIMENSION_COLORS[dim] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
