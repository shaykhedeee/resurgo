// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Blog Visual Components (Infographics, Charts, Stats)
// Pixelated terminal aesthetic with data visualization
// ═══════════════════════════════════════════════════════════════════════════════

import { TrendingUp, TrendingDown, Target, Brain, Zap, BarChart2 as ChartBar } from 'lucide-react';

// ─── PIXELATED STAT CARD ─────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  color?: string;
}

export function StatCard({ label, value, change, trend, color = '#f97316' }: StatCardProps) {
  return (
    <div className="border-2 border-zinc-800 bg-zinc-950 p-4 font-mono">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs tracking-widest text-zinc-400">{label}</span>
        {change && (
          <div className="flex items-center gap-1">
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

// ─── PIXELATED BAR CHART ─────────────────────────────────────────────────────

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface PixelChartProps {
  title: string;
  data: DataPoint[];
  maxValue?: number;
  height?: number;
}

export function PixelChart({ title, data, maxValue, height = 120 }: PixelChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value));
  
  return (
    <div className="border-2 border-zinc-800 bg-zinc-950 p-4 font-mono">
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-900 pb-2">
        <ChartBar className="h-4 w-4 text-orange-500" />
        <h3 className="text-xs font-bold tracking-widest text-zinc-200">{title}</h3>
      </div>
      <div className="space-y-3">
        {data.map((point, i) => {
          const percentage = (point.value / max) * 100;
          const bars = Math.round(percentage / 5); // 5% per block
          
          return (
            <div key={i}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-zinc-400">{point.label}</span>
                <span className="font-bold text-zinc-200">{point.value}%</span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 20 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-2 w-full"
                    style={{
                      backgroundColor: idx < bars ? (point.color || '#f97316') : '#27272a',
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ───  TIMELINE INFOGRAPHIC ───────────────────────────────────────────────────

interface TimelinePoint {
  day: number;
  label: string;
  description: string;
  color?: string;
}

interface TimelineProps {
  title: string;
  points: TimelinePoint[];
}

export function Timeline({ title, points }: TimelineProps) {
  return (
    <div className="border-2 border-zinc-800 bg-zinc-950 p-4 font-mono">
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-900 pb-2">
        <Target className="h-4 w-4 text-orange-500" />
        <h3 className="text-xs font-bold tracking-widest text-zinc-200">{title}</h3>
      </div>
      <div className="space-y-4">
        {points.map((point, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="flex h-8 w-8 items-center justify-center border-2 font-bold"
                style={{
                  borderColor: point.color || '#f97316',
                  color: point.color || '#f97316',
                }}
              >
                {point.day}
              </div>
              {i < points.length - 1 && (
                <div
                  className="w-0.5 flex-1 mt-1"
                  style={{ backgroundColor: '#3f3f46', minHeight: '20px' }}
                />
              )}
            </div>
            <div className="flex-1 pb-2">
              <h4 className="mb-1 text-xs font-bold text-zinc-200">{point.label}</h4>
              <p className="text-xs leading-relaxed text-zinc-500">{point.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMPARISON TABLE ────────────────────────────────────────────────────────

interface ComparisonRow {
  label: string;
  before: string;
  after: string;
}

interface ComparisonTableProps {
  title: string;
  rows: ComparisonRow[];
}

export function ComparisonTable({ title, rows }: ComparisonTableProps) {
  return (
    <div className="border-2 border-zinc-800 bg-zinc-950 font-mono">
      <div className="border-b-2 border-zinc-800 p-3">
        <h3 className="text-xs font-bold tracking-widest text-orange-500">{title}</h3>
      </div>
      <div className="divide-y divide-zinc-900">
        <div className="grid grid-cols-3 gap-2 bg-zinc-900 p-2 text-xs font-bold tracking-widest text-zinc-400">
          <div>METRIC</div>
          <div className="text-red-500">BEFORE</div>
          <div className="text-green-500">AFTER</div>
        </div>
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 p-2 text-xs">
            <div className="text-zinc-300">{row.label}</div>
            <div className="text-red-400">{row.before}</div>
            <div className="text-green-400">{row.after}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HIGHLIGHT QUOTE ─────────────────────────────────────────────────────────

interface QuoteProps {
  text: string;
  author?: string;
  icon?: 'brain' | 'target' | 'zap';
}

export function Highlight({ text, author, icon = 'brain' }: QuoteProps) {
  const icons = {
    brain: <Brain className="h-5 w-5 text-orange-500" />,
    target: <Target className="h-5 w-5 text-orange-500" />,
    zap: <Zap className="h-5 w-5 text-orange-500" />,
  };
  
  return (
    <div className="my-6 border-l-4 border-orange-500 bg-orange-500/5 p-4 font-mono">
      <div className="mb-2 flex items-center gap-2">
        {icons[icon]}
        <span className="text-xs tracking-widest text-orange-500">KEY INSIGHT</span>
      </div>
      <p className="mb-2 text-sm leading-relaxed text-zinc-200">{text}</p>
      {author && <p className="text-xs text-zinc-500">— {author}</p>}
    </div>
  );
}

// ─── STEP-BY-STEP GUIDE ──────────────────────────────────────────────────────

interface StepProps {
  number: number;
  title: string;
  description: string;
}

interface StepsProps {
  title: string;
  steps: StepProps[];
}

export function Steps({ title, steps }: StepsProps) {
  return (
    <div className="my-6 border-2 border-zinc-800 bg-zinc-950 p-4 font-mono">
      <h3 className="mb-4 text-sm font-bold tracking-widest text-orange-500">{title}</h3>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.number} className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center border border-orange-500 text-xs font-bold text-orange-500">
              {step.number}
            </div>
            <div className="flex-1">
              <h4 className="mb-1 text-xs font-bold text-zinc-200">{step.title}</h4>
              <p className="text-xs leading-relaxed text-zinc-500">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STAT GRID ───────────────────────────────────────────────────────────────

interface StatGridProps {
  stats: Array<{
    label: string;
    value: string;
    color?: string;
  }>;
}

export function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="my-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat, i) => (
        <div key={i} className="border-2 border-zinc-800 bg-zinc-950 p-3 text-center font-mono">
          <div
            className="mb-1 text-2xl font-bold"
            style={{ color: stat.color || '#f97316' }}
          >
            {stat.value}
          </div>
          <div className="text-xs tracking-wider text-zinc-500">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
