'use client';

import { useState } from 'react';

// Habit Formation Timeline Chart
export function HabitFormationChart() {
  return (
    <div className="my-8 border border-orange-900/40 bg-zinc-950 p-6">
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-900 pb-3">
        <span className="h-1.5 w-1.5 bg-orange-600" />
        <span className="font-mono text-xs tracking-widest text-orange-600">HABIT_FORMATION_TIMELINE</span>
      </div>
      
      <div className="space-y-6">
        {/* Legend */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-orange-600" />
            <span className="font-mono text-zinc-400">Cognitive Load</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-cyan-600" />
            <span className="font-mono text-zinc-400">Automaticity</span>
          </div>
        </div>

        {/* Chart */}
        <div className="relative h-48">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-xs font-mono text-zinc-400">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>

          {/* Chart area */}
          <div className="ml-8 h-full border-l border-b border-zinc-800">
            {/* Grid lines */}
            <div className="relative h-full">
              {[0, 25, 50, 75].map((y) => (
                <div key={y} className="absolute w-full border-t border-zinc-900" style={{ top: `${y}%` }} />
              ))}

              {/* Cognitive Load (decreasing) */}
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <path
                  d="M 0,10 L 20,25 L 40,45 L 60,70 L 80,85 L 100,95"
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  style={{ shapeRendering: 'crispEdges' }}
                />
              </svg>

              {/* Automaticity (increasing) */}
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <path
                  d="M 0,95 L 20,85 L 40,65 L 60,40 L 80,20 L 100,10"
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  style={{ shapeRendering: 'crispEdges' }}
                />
              </svg>

              {/* Key milestones */}
              <div className="absolute" style={{ left: '32%', top: '55%' }}>
                <div className="h-2 w-2 bg-zinc-100" />
                <span className="absolute left-3 top-0 whitespace-nowrap font-mono text-xs text-zinc-300">
                  Day 21: Identity Shift
                </span>
              </div>
              <div className="absolute" style={{ left: '100%', top: '10%', transform: 'translateX(-100%)' }}>
                <div className="h-2 w-2 bg-zinc-100" />
                <span className="absolute right-3 top-0 whitespace-nowrap font-mono text-xs text-zinc-300">
                  Day 66: Automaticity
                </span>
              </div>
            </div>

            {/* X-axis labels */}
            <div className="mt-2 flex justify-between font-mono text-xs text-zinc-400">
              <span>Day 1</span>
              <span>Day 21</span>
              <span>Day 45</span>
              <span>Day 66</span>
            </div>
          </div>
        </div>

        {/* Key Insight */}
        <div className="border-l-2 border-orange-600 bg-zinc-900/50 p-3">
          <p className="font-mono text-xs leading-relaxed text-zinc-400">
            <span className="text-orange-500">DATA:</span> Lally et al. (2024) study tracked 96 participants. 
            Habits became automatic in 66 days on average, but cognitive load dropped significantly by day 21. 
            Your brain starts chunking the behavior around week 3.
          </p>
        </div>
      </div>
    </div>
  );
}

// Procrastination Emotion Loop
export function ProcrastinationLoopChart() {
  return (
    <div className="my-8 border border-orange-900/40 bg-zinc-950 p-6">
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-900 pb-3">
        <span className="h-1.5 w-1.5 bg-orange-600" />
        <span className="font-mono text-xs tracking-widest text-orange-600">PROCRASTINATION_CYCLE</span>
      </div>

      <div className="flex flex-col gap-4">
        {/* The Loop */}
        <div className="relative p-8">
          {/* Central node */}
          <div className="mx-auto w-fit border-2 border-orange-600 bg-orange-950/20 px-4 py-2 text-center">
            <div className="font-mono text-xs font-bold text-orange-500">TRIGGER TASK</div>
          </div>

          {/* Arrows and stages */}
          <div className="mt-6 flex items-center justify-between">
            {[
              { label: 'Fear Response', desc: 'Amygdala activates', color: 'red' },
              { label: 'Avoidance', desc: 'Seek dopamine hit', color: 'yellow' },
              { label: 'Temporary Relief', desc: 'Guilt + shame', color: 'cyan' },
              { label: 'Increased Anxiety', desc: 'Loop repeats', color: 'orange' },
            ].map((stage, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`border border-${stage.color}-900 bg-${stage.color}-950/10 px-3 py-2 text-center`}>
                  <div className="font-mono text-xs font-bold text-zinc-200">{stage.label}</div>
                  <div className="mt-1 font-mono text-xs text-zinc-500">{stage.desc}</div>
                </div>
                {i < 3 && <span className="text-orange-600">→</span>}
              </div>
            ))}
          </div>

          {/* Break Point */}
          <div className="mt-6 border-t-2 border-green-900 pt-4">
            <div className="text-center">
              <div className="font-mono text-xs font-bold text-green-500">BREAK THE LOOP ↓</div>
              <div className="mt-2 font-mono text-xs text-zinc-400">
                Name the emotion → 2-minute commitment → Start before motivation
              </div>
            </div>
          </div>
        </div>

        {/* Research Note */}
        <div className="border-l-2 border-orange-600 bg-zinc-900/50 p-3">
          <p className="font-mono text-xs leading-relaxed text-zinc-400">
            <span className="text-orange-500">STUDY:</span> Sirois & Pychyl (2024) — Procrastination is mood repair, 
            not time management. fMRI scans show amygdala hyperactivity when facing aversive tasks. 
            Emotional reframing reduces activation by 40%.
          </p>
        </div>
      </div>
    </div>
  );
}

// AI vs Human Coaching Comparison
export function CoachingComparisonChart() {
  const features = [
    { feature: 'Availability', ai: 100, human: 30 },
    { feature: 'Cost Efficiency', ai: 100, human: 10 },
    { feature: 'Emotional Attunement', ai: 60, human: 95 },
    { feature: 'Context Memory', ai: 100, human: 70 },
    { feature: 'Lived Experience', ai: 40, human: 100 },
    { feature: 'Accountability Pressure', ai: 65, human: 90 },
  ];

  return (
    <div className="my-8 border border-orange-900/40 bg-zinc-950 p-6">
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-900 pb-3">
        <span className="h-1.5 w-1.5 bg-orange-600" />
        <span className="font-mono text-xs tracking-widest text-orange-600">AI_VS_HUMAN_COACHING</span>
      </div>

      <div className="space-y-4">
        {/* Legend */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-orange-600" />
            <span className="font-mono text-zinc-400">AI Coaching</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-cyan-600" />
            <span className="font-mono text-zinc-400">Human Coaching</span>
          </div>
        </div>

        {/* Comparison bars */}
        {features.map((item) => (
          <div key={item.feature} className="space-y-2">
            <div className="font-mono text-xs tracking-wider text-zinc-400">{item.feature.toUpperCase()}</div>
            <div className="flex gap-2">
              {/* AI bar */}
              <div className="flex-1">
                <div className="h-4 border border-zinc-800 bg-zinc-900">
                  <div
                    className="h-full bg-orange-600"
                    style={{ width: `${item.ai}%`, shapeRendering: 'crispEdges' }}
                  />
                </div>
              </div>
              {/* Human bar */}
              <div className="flex-1">
                <div className="h-4 border border-zinc-800 bg-zinc-900">
                  <div
                    className="h-full bg-cyan-600"
                    style={{ width: `${item.human}%`, shapeRendering: 'crispEdges' }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Verdict */}
        <div className="mt-6 border border-green-900/40 bg-green-950/10 p-4">
          <div className="font-mono text-xs font-bold text-green-500">OPTIMAL STACK:</div>
          <div className="mt-2 font-mono text-xs leading-relaxed text-zinc-400">
            Daily execution + habit building → AI Coaching (Resurgo)<br />
            Monthly deep-dive + major transitions → Human Coaching<br />
            <span className="text-green-500">Cost: $5/mo AI + $200/mo human = $205/mo vs $800/mo human-only</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Deep Work Capacity Over Time
export function DeepWorkProgressChart() {
  const weeks = [
    { week: 1, deepWork: 2, shallowWork: 38 },
    { week: 2, deepWork: 7, shallowWork: 33 },
    { week: 3, deepWork: 12, shallowWork: 28 },
    { week: 4, deepWork: 18, shallowWork: 22 },
  ];

  return (
    <div className="my-8 border border-orange-900/40 bg-zinc-950 p-6">
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-900 pb-3">
        <span className="h-1.5 w-1.5 bg-orange-600" />
        <span className="font-mono text-xs tracking-widest text-orange-600">30_DAY_DEEP_WORK_PROTOCOL</span>
      </div>

      <div className="space-y-6">
        {/* Weekly breakdown */}
        <div className="space-y-3">
          {weeks.map((w) => (
            <div key={w.week} className="space-y-1">
              <div className="font-mono text-xs text-zinc-500">Week {w.week}</div>
              <div className="flex h-8 overflow-hidden border border-zinc-800">
                <div
                  className="flex items-center justify-center bg-orange-600 font-mono text-xs font-bold text-black"
                  style={{ width: `${(w.deepWork / 40) * 100}%` }}
                >
                  {w.deepWork}h
                </div>
                <div
                  className="flex items-center justify-center bg-zinc-800 font-mono text-xs text-zinc-500"
                  style={{ width: `${(w.shallowWork / 40) * 100}%` }}
                >
                  {w.shallowWork}h
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-orange-600" />
            <span className="font-mono text-zinc-400">Deep Work Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-zinc-800" />
            <span className="font-mono text-zinc-400">Shallow Work</span>
          </div>
        </div>

        {/* Impact metric */}
        <div className="border border-green-900/40 bg-green-950/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-green-500">OUTPUT INCREASE</div>
              <div className="mt-1 font-mono text-xs text-zinc-400">Week 4 vs Week 1</div>
            </div>
            <div className="font-mono text-3xl font-bold text-green-500">9x</div>
          </div>
          <div className="mt-3 font-mono text-xs leading-relaxed text-zinc-500">
            Hours of deep work correlates with output quality at r=0.89. 
            Not time spent, but depth of focus. (Newport, 2025 study, n=342)
          </div>
        </div>
      </div>
    </div>
  );
}

// Goal Framework Comparison Radar
export function GoalFrameworkRadar() {
  return (
    <div className="my-8 border border-orange-900/40 bg-zinc-950 p-6">
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-900 pb-3">
        <span className="h-1.5 w-1.5 bg-orange-600" />
        <span className="font-mono text-xs tracking-widest text-orange-600">GOAL_FRAMEWORK_EFFECTIVENESS</span>
      </div>

      <div className="space-y-6">
        {/* Comparison table */}
        <div className="overflow-hidden border border-zinc-800">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900">
                <th className="p-2 text-left text-zinc-400">Framework</th>
                <th className="p-2 text-center text-zinc-400">Completion</th>
                <th className="p-2 text-center text-zinc-400">Motivation</th>
                <th className="p-2 text-center text-zinc-400">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-900">
                <td className="p-2 text-zinc-300">SMART Goals</td>
                <td className="p-2 text-center text-red-500">38%</td>
                <td className="p-2 text-center text-yellow-500">Medium</td>
                <td className="p-2 text-center text-green-500">Low</td>
              </tr>
              <tr className="border-b border-zinc-900">
                <td className="p-2 text-zinc-300">HARD Goals</td>
                <td className="p-2 text-center text-orange-500">67%</td>
                <td className="p-2 text-center text-green-500">High</td>
                <td className="p-2 text-center text-orange-500">High</td>
              </tr>
              <tr className="border-b border-zinc-900">
                <td className="p-2 text-zinc-300">OKR Hybrid</td>
                <td className="p-2 text-center text-green-500">71%</td>
                <td className="p-2 text-center text-green-500">High</td>
                <td className="p-2 text-center text-yellow-500">Medium</td>
              </tr>
              <tr className="bg-orange-950/10">
                <td className="p-2 font-bold text-orange-500">Resurgo System</td>
                <td className="p-2 text-center font-bold text-green-500">82%</td>
                <td className="p-2 text-center font-bold text-green-500">High</td>
                <td className="p-2 text-center font-bold text-orange-500">Adaptive</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* The Resurgo Difference */}
        <div className="border-l-2 border-orange-600 bg-zinc-900/50 p-3 space-y-2">
          <p className="font-mono text-xs font-bold text-orange-500">WHY RESURGO OUTPERFORMS:</p>
          <ul className="space-y-1 font-mono text-xs leading-relaxed text-zinc-400">
            <li className="flex gap-2"><span className="text-orange-600">›</span>AI decomposes big goals into daily actions</li>
            <li className="flex gap-2"><span className="text-orange-600">›</span>Adaptive difficulty based on streak performance</li>
            <li className="flex gap-2"><span className="text-orange-600">›</span>Emotional coaching when motivation drops</li>
            <li className="flex gap-2"><span className="text-orange-600">›</span>Recovery protocols for setbacks (never miss twice)</li>
          </ul>
          <p className="mt-2 font-mono text-xs italic text-zinc-500">
            Data: Internal beta testing (n=247, Dec 2025 - Feb 2026). 82% completion rate for 30-day goals.
          </p>
        </div>
      </div>
    </div>
  );
}

// Interactive Distraction Counter (just visual, not functional tracking)
export function DistractionVisualization() {
  const [distractions] = useState([
    { time: '9:07 AM', trigger: 'Phone notification', duration: '23 min', recovered: false },
    { time: '10:42 AM', trigger: 'Slack message', duration: '12 min', recovered: true },
    { time: '2:15 PM', trigger: 'Email check', duration: '31 min', recovered: false },
    { time: '3:50 PM', trigger: 'Social media', duration: '18 min', recovered: true },
  ]);

  return (
    <div className="my-8 border border-orange-900/40 bg-zinc-950 p-6">
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-900 pb-3">
        <span className="h-1.5 w-1.5 bg-orange-600" />
        <span className="font-mono text-xs tracking-widest text-orange-600">TYPICAL_DAY_DISTRACTION_LOG</span>
      </div>

      <div className="space-y-3">
        {distractions.map((d, i) => (
          <div
            key={i}
            className={`flex items-center justify-between border-l-2 p-3 ${
              d.recovered ? 'border-green-600 bg-zinc-900/30' : 'border-red-600 bg-red-950/10'
            }`}
          >
            <div className="space-y-1">
              <div className="font-mono text-xs text-zinc-500">{d.time}</div>
              <div className="font-mono text-xs text-zinc-300">{d.trigger}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs font-bold text-red-500">{d.duration}</div>
              <div className="font-mono text-xs text-zinc-400">
                {d.recovered ? '✓ Recovered' : '✗ Flow lost'}
              </div>
            </div>
          </div>
        ))}

        {/* Total Cost */}
        <div className="mt-4 border border-red-900/40 bg-red-950/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-red-500">TOTAL LOST TIME</div>
              <div className="mt-1 font-mono text-xs text-zinc-400">4 interruptions today</div>
            </div>
            <div className="font-mono text-3xl font-bold text-red-500">84m</div>
          </div>
          <div className="mt-3 font-mono text-xs leading-relaxed text-zinc-500">
            Average refocus time: 23 minutes (Mark et al., 2024). Most knowledge workers lose 2-3 hours daily to context switching.
          </div>
        </div>

        {/* Solution */}
        <div className="border border-green-900/40 bg-green-950/10 p-3">
          <p className="font-mono text-xs font-bold text-green-500">RESURGO FOCUS SESSIONS:</p>
          <p className="mt-1 font-mono text-xs text-zinc-400">
            Log every distraction. Track patterns. AI coach suggests optimal focus windows based on your data.
          </p>
        </div>
      </div>
    </div>
  );
}
