'use client';

import { useAction, useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useState, type ElementType, type FormEvent } from 'react';
import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarDays,
  CheckCircle2,
  Circle,
  Dumbbell,
  Loader2,
  Sparkles,
  Target,
  Utensils,
  Zap,
} from 'lucide-react';

import { api } from '../../../../convex/_generated/api';
import { cn } from '@/lib/utils';

type CoachId = 'NOVA' | 'NEXUS' | 'AURORA' | 'TITAN' | 'PHOENIX';
type ModeId = 'architect' | 'focus' | 'nutrition' | 'fitness' | 'review';

interface Step {
  title: string;
  description: string;
  estimatedDays: number;
  phase: string;
  subTasks: string[];
}

interface SuggestedHabit {
  title: string;
  description?: string;
  category?: string;
  frequency?: 'daily' | 'weekdays' | 'weekends' | '3x_week' | 'weekly' | 'custom';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  estimatedMinutes?: number;
}

interface Plan {
  goal: string;
  overview: string;
  totalDuration: string;
  phases: Step[];
  suggestedHabits?: SuggestedHabit[];
}

interface ModeConfig {
  id: ModeId;
  coachId: CoachId;
  label: string;
  title: string;
  detail: string;
  Icon: ElementType;
  color: string;
}

const MODES: ModeConfig[] = [
  {
    id: 'architect',
    coachId: 'NOVA',
    label: 'ARCHITECT',
    title: 'Goals to milestones to habits',
    detail: 'Builds the full plan and can activate it into real dashboard items.',
    Icon: Brain,
    color: '#38bdf8',
  },
  {
    id: 'focus',
    coachId: 'NEXUS',
    label: 'FOCUS',
    title: 'Pomodoro and deep work guard',
    detail: 'Chooses one target, creates the session protocol, and protects attention.',
    Icon: Zap,
    color: '#e879f9',
  },
  {
    id: 'nutrition',
    coachId: 'AURORA',
    label: 'NUTRITION',
    title: 'Meal plans and macro defaults',
    detail: 'Creates simple meals, hydration targets, and easy logging instructions.',
    Icon: Utensils,
    color: '#22c55e',
  },
  {
    id: 'fitness',
    coachId: 'TITAN',
    label: 'FITNESS',
    title: 'Workout programming and progression',
    detail: 'Designs sessions, progression rules, and recovery guardrails.',
    Icon: Dumbbell,
    color: '#ef4444',
  },
  {
    id: 'review',
    coachId: 'PHOENIX',
    label: 'REVIEW',
    title: 'Weekly review and adaptation',
    detail: 'Finds patterns, repairs missed systems, and sets next-week changes.',
    Icon: BarChart3,
    color: '#f97316',
  },
];

const DEFAULT_PLAN: Plan = {
  goal: 'Focused execution sprint',
  overview: 'A compact plan that turns one outcome into daily motion, protects attention, and keeps the first week light enough to start today.',
  totalDuration: '4 weeks',
  phases: [
    {
      phase: 'Phase 1',
      title: 'Define the scoreboard',
      description: 'Convert the goal into a visible metric, a deadline, and a small daily action.',
      estimatedDays: 3,
      subTasks: ['Write the exact target metric and deadline', 'Pick the first daily action under 25 minutes', 'Create a visible tracking spot'],
    },
    {
      phase: 'Phase 2',
      title: 'First week execution loop',
      description: 'Schedule the first seven days with a maximum of four meaningful tasks per day.',
      estimatedDays: 7,
      subTasks: ['Schedule day one now', 'Run three 25-minute focus blocks this week', 'Review blockers after each missed task'],
    },
    {
      phase: 'Phase 3',
      title: 'Remove friction',
      description: 'Reduce setup cost and automate reminders so the system survives low-motivation days.',
      estimatedDays: 10,
      subTasks: ['Batch setup for the week', 'Move repeat work into templates', 'Cut one low-value commitment'],
    },
    {
      phase: 'Phase 4',
      title: 'Review and raise the bar',
      description: 'Use the weekly review to keep what worked, lower what broke, and progress the plan.',
      estimatedDays: 8,
      subTasks: ['Run the Sunday review', 'Keep one winning habit', 'Increase the main task difficulty by 5 percent'],
    },
  ],
  suggestedHabits: [
    {
      title: '2-minute daily goal check',
      description: 'Review the next action and mark one tiny win.',
      category: 'productivity',
      frequency: 'daily',
      timeOfDay: 'morning',
      estimatedMinutes: 2,
    },
    {
      title: 'Sunday 20-minute review',
      description: 'Score the week and adjust the next plan.',
      category: 'productivity',
      frequency: 'weekly',
      timeOfDay: 'evening',
      estimatedMinutes: 20,
    },
  ],
};

function extractPlan(reply?: string, fallbackGoal?: string): Plan {
  const jsonMatch = reply?.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { ...DEFAULT_PLAN, goal: fallbackGoal || DEFAULT_PLAN.goal };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as Plan;
    if (!parsed.goal || !Array.isArray(parsed.phases)) {
      return { ...DEFAULT_PLAN, goal: fallbackGoal || DEFAULT_PLAN.goal };
    }
    return parsed;
  } catch {
    return { ...DEFAULT_PLAN, goal: fallbackGoal || DEFAULT_PLAN.goal };
  }
}

function todayLabel() {
  const today = new Date();
  return `${today.toLocaleDateString(undefined, { weekday: 'long' })}, ${today.toISOString().split('T')[0]}`;
}

export default function PlanBuilderPage() {
  const router = useRouter();
  const sendWithPersona = useAction(api.coachAI.sendWithPersona);
  const activatePlan = useMutation(api.goals.activatePlan);

  const [activeMode, setActiveMode] = useState<ModeId>('architect');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalContext, setGoalContext] = useState('');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<Set<number>>(new Set());
  const [building, setBuilding] = useState(false);
  const [activating, setActivating] = useState(false);
  const [activationSummary, setActivationSummary] = useState<string | null>(null);

  const [focusTarget, setFocusTarget] = useState('');
  const [focusMinutes, setFocusMinutes] = useState('25');
  const [nutritionGoal, setNutritionGoal] = useState('');
  const [nutritionPrefs, setNutritionPrefs] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [fitnessConstraints, setFitnessConstraints] = useState('');
  const [reviewWins, setReviewWins] = useState('');
  const [reviewBlocks, setReviewBlocks] = useState('');
  const [modeOutputs, setModeOutputs] = useState<Partial<Record<ModeId, string>>>({});
  const [modeLoading, setModeLoading] = useState<ModeId | null>(null);

  const activeConfig = MODES.find((mode) => mode.id === activeMode) ?? MODES[0];
  const ActiveModeIcon = activeConfig.Icon;

  const buildArchitectPlan = async (e: FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim() || building) return;

    setBuilding(true);
    setActivationSummary(null);

    const prompt = `You are RESURGO OS Architect Bot. Today is ${todayLabel()}.

Build a complete, practical life plan for this goal:
GOAL: ${goalTitle}
CONTEXT: ${goalContext || 'Use best-practice defaults. Assume ADHD-friendly execution, low friction, and no more than 4 big daily tasks.'}

Rules:
1. Include a clear measurable outcome and deadline if the user gave enough context. If missing, choose a conservative 4-week deadline.
2. Include 3-6 specific milestones as phases.
3. Include 1-3 inevitability habits with a 2-minute minimum version.
4. First week must be schedulable with max 4 big tasks per day.
5. Mention a vision board image slot in the overview.
6. Include weekly review trigger: Sunday 8 PM, adapt based on misses and wins.
7. Do not delete, overwrite, or bulk-change anything.

Respond with ONLY valid JSON:
{
  "goal": "specific goal title",
  "overview": "1-2 sentence vision including the vision board slot and review rule",
  "totalDuration": "4 weeks",
  "phases": [
    {
      "title": "specific milestone title",
      "description": "what this milestone accomplishes",
      "estimatedDays": 7,
      "phase": "Phase 1",
      "subTasks": ["specific task under 60 minutes", "specific task under 60 minutes"]
    }
  ],
  "suggestedHabits": [
    {
      "title": "habit title",
      "description": "why it makes the goal inevitable",
      "category": "productivity",
      "frequency": "daily",
      "timeOfDay": "morning",
      "estimatedMinutes": 2
    }
  ]
}`;

    try {
      const response = await sendWithPersona({ content: prompt, coachId: 'NOVA' });
      const nextPlan = extractPlan(response.reply, goalTitle);
      setPlan(nextPlan);
      setSelectedHabits(new Set((nextPlan.suggestedHabits ?? []).map((_, index) => index)));
    } finally {
      setBuilding(false);
    }
  };

  const buildModeOutput = async (e: FormEvent) => {
    e.preventDefault();
    if (activeMode === 'architect' || modeLoading) return;

    const config = activeConfig;
    const contentByMode: Record<Exclude<ModeId, 'architect'>, string> = {
      focus: `You are RESURGO OS Focus Bot. Build a focus session plan.
Target: ${focusTarget || 'Choose the highest-leverage task from context.'}
Minutes: ${focusMinutes || '25'}
Defaults: 25/5 Pomodoro, one task only, capture distractions without switching.
Return: What I Did, Coaching Insight, Your Session Now max 5 items, Next Review.`,
      nutrition: `You are RESURGO OS Nutrition Bot. Build a simple meal and hydration plan.
Goal: ${nutritionGoal || 'stable energy and body recomposition'}
Preferences: ${nutritionPrefs || 'Use simple high-protein meals and gradual macro improvements.'}
Defaults: 7-day meal plan, water tracker, quick log food/water.
Return: What I Did, Coaching Insight, Your Day Today max 5 items, Next Review.`,
      fitness: `You are RESURGO OS Fitness Bot. Build a training plan.
Goal: ${fitnessGoal || 'strength, cardio, and visible progress'}
Constraints/equipment: ${fitnessConstraints || 'Use safe progressive overload and recovery defaults.'}
Defaults: progress weights 5-10 percent when all reps are hit, protect recovery.
Return: What I Did, Coaching Insight, Your Day Today max 5 items, Next Review.`,
      review: `You are RESURGO OS Review Bot. Run the weekly review and propose fixes.
Wins: ${reviewWins || 'Unknown - infer that wins need to be captured.'}
Blockers: ${reviewBlocks || 'Unknown - identify likely friction and scope creep.'}
Defaults: reduce habit difficulty after 3 misses, reschedule incomplete tasks within 7 days, next review Sunday 8 PM.
Return: What I Did, Coaching Insight, Your Day Today max 5 items, Next Review.`,
    };

    setModeLoading(activeMode);
    try {
      const response = await sendWithPersona({
        content: contentByMode[activeMode],
        coachId: config.coachId,
      });
      setModeOutputs((prev) => ({ ...prev, [activeMode]: response.reply ?? 'No response generated.' }));
    } finally {
      setModeLoading(null);
    }
  };

  const activateArchitectPlan = async () => {
    if (!plan || activating) return;
    setActivating(true);

    try {
      const habits = (plan.suggestedHabits ?? [])
        .filter((_, index) => selectedHabits.has(index))
        .map((habit) => ({
          title: habit.title,
          description: habit.description,
          category: habit.category,
          frequency: habit.frequency,
          timeOfDay: habit.timeOfDay,
          estimatedMinutes: habit.estimatedMinutes,
        }));

      const result = await activatePlan({
        goalTitle: plan.goal,
        goalDescription: plan.overview,
        totalDuration: plan.totalDuration,
        phases: plan.phases,
        habits,
      });

      setActivationSummary(
        `Created 1 goal, ${result.milestoneIds.length} milestones, ${result.taskIds.length} tasks, and ${result.habitIds.length} habits.`
      );
    } finally {
      setActivating(false);
    }
  };

  const toggleHabit = (index: number) => {
    setSelectedHabits((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">RESURGO :: PLAN_BUILDER_2.0</span>
          </div>
          <div className="grid gap-4 px-5 py-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">AI Coach Plan Builder</h1>
              <p className="mt-1 max-w-2xl font-mono text-xs leading-relaxed tracking-widest text-zinc-500">
                Five modes. One clean execution system. Architect plans can become real goals, milestones, tasks, and habits.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/coach')}
              className="inline-flex items-center justify-center gap-2 border border-zinc-800 px-4 py-2 font-mono text-xs tracking-widest text-zinc-300 transition hover:border-orange-800 hover:text-orange-500"
            >
              CHAT
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        <section className="grid gap-2 md:grid-cols-5">
          {MODES.map(({ id, label, title, Icon, color }) => {
            const active = id === activeMode;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveMode(id)}
                className={cn(
                  'border px-3 py-3 text-left transition',
                  active ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-900 bg-zinc-950 hover:border-zinc-700'
                )}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <Icon className="h-4 w-4" style={{ color }} />
                  {active && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />}
                </div>
                <p className="font-mono text-xs font-bold tracking-widest" style={{ color: active ? color : '#d4d4d8' }}>{label}</p>
                <p className="mt-1 line-clamp-2 font-mono text-[9px] leading-relaxed text-zinc-500">{title}</p>
              </button>
            );
          })}
        </section>

        <section className="grid gap-5 lg:grid-cols-[380px_1fr]">
          <div className="border border-zinc-900 bg-zinc-950">
            <div className="border-b border-zinc-900 px-4 py-3">
              <div className="flex items-center gap-2">
                <ActiveModeIcon className="h-4 w-4" style={{ color: activeConfig.color }} />
                <div>
                  <p className="font-mono text-xs font-bold tracking-widest text-zinc-100">{activeConfig.label}_BOT</p>
                  <p className="font-mono text-[10px] leading-relaxed text-zinc-500">{activeConfig.detail}</p>
                </div>
              </div>
            </div>

            {activeMode === 'architect' ? (
              <form onSubmit={buildArchitectPlan} className="space-y-4 p-4">
                <label className="block">
                  <span className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">GOAL</span>
                  <input
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    placeholder="Launch a profitable micro-tool in 48 hours"
                    className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">CONTEXT</span>
                  <textarea
                    value={goalContext}
                    onChange={(e) => setGoalContext(e.target.value)}
                    placeholder="Skills, deadline, constraints, monetization angle, current blockers..."
                    rows={6}
                    className="w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  disabled={building || !goalTitle.trim()}
                  className="inline-flex w-full items-center justify-center gap-2 border border-sky-800 bg-sky-950/20 px-4 py-2.5 font-mono text-xs font-bold tracking-widest text-sky-300 transition hover:bg-sky-950/40 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {building ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  BUILD_FULL_PLAN
                </button>
              </form>
            ) : (
              <form onSubmit={buildModeOutput} className="space-y-4 p-4">
                {activeMode === 'focus' && (
                  <>
                    <label className="block">
                      <span className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">TASK</span>
                      <input value={focusTarget} onChange={(e) => setFocusTarget(e.target.value)} placeholder="The one task to protect" className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none" />
                    </label>
                    <label className="block">
                      <span className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">MINUTES</span>
                      <input value={focusMinutes} onChange={(e) => setFocusMinutes(e.target.value)} className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-100 focus:border-orange-800 focus:outline-none" />
                    </label>
                  </>
                )}
                {activeMode === 'nutrition' && (
                  <>
                    <label className="block">
                      <span className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">NUTRITION_TARGET</span>
                      <input value={nutritionGoal} onChange={(e) => setNutritionGoal(e.target.value)} placeholder="Fat loss, muscle gain, stable energy..." className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none" />
                    </label>
                    <label className="block">
                      <span className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">PREFERENCES</span>
                      <textarea value={nutritionPrefs} onChange={(e) => setNutritionPrefs(e.target.value)} rows={5} placeholder="Diet, foods, budget, cooking time, allergies..." className="w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none" />
                    </label>
                  </>
                )}
                {activeMode === 'fitness' && (
                  <>
                    <label className="block">
                      <span className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">FITNESS_GOAL</span>
                      <input value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)} placeholder="Visible abs, 5K, strength, posture..." className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none" />
                    </label>
                    <label className="block">
                      <span className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">CONSTRAINTS</span>
                      <textarea value={fitnessConstraints} onChange={(e) => setFitnessConstraints(e.target.value)} rows={5} placeholder="Equipment, injuries, days/week, current level..." className="w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none" />
                    </label>
                  </>
                )}
                {activeMode === 'review' && (
                  <>
                    <label className="block">
                      <span className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">WINS</span>
                      <textarea value={reviewWins} onChange={(e) => setReviewWins(e.target.value)} rows={4} placeholder="What worked this week?" className="w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none" />
                    </label>
                    <label className="block">
                      <span className="mb-1 block font-mono text-[10px] tracking-widest text-zinc-500">BLOCKERS</span>
                      <textarea value={reviewBlocks} onChange={(e) => setReviewBlocks(e.target.value)} rows={4} placeholder="What got skipped, delayed, or avoided?" className="w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-orange-800 focus:outline-none" />
                    </label>
                  </>
                )}
                <button
                  type="submit"
                  disabled={modeLoading === activeMode}
                  className="inline-flex w-full items-center justify-center gap-2 border px-4 py-2.5 font-mono text-xs font-bold tracking-widest transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ borderColor: `${activeConfig.color}66`, color: activeConfig.color, backgroundColor: `${activeConfig.color}12` }}
                >
                  {modeLoading === activeMode ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  GENERATE_{activeConfig.label}_PLAN
                </button>
              </form>
            )}
          </div>

          <div className="min-w-0 space-y-4">
            {activeMode === 'architect' ? (
              <>
                {!plan && (
                  <div className="border border-zinc-900 bg-zinc-950 p-10 text-center">
                    <Target className="mx-auto mb-3 h-8 w-8 text-zinc-700" />
                    <p className="font-mono text-xs tracking-widest text-zinc-500">ARCHITECT_OUTPUT_WAITING</p>
                  </div>
                )}

                {plan && (
                  <div className="space-y-4">
                    <div className="border border-zinc-900 bg-zinc-950 p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-[10px] tracking-widest text-sky-400">GENERATED_PLAN</p>
                          <h2 className="mt-1 font-mono text-xl font-bold text-zinc-100">{plan.goal}</h2>
                        </div>
                        <span className="shrink-0 border border-zinc-800 px-2 py-1 font-mono text-[10px] tracking-widest text-zinc-400">
                          {plan.totalDuration}
                        </span>
                      </div>
                      <p className="font-mono text-xs leading-relaxed text-zinc-400">{plan.overview}</p>
                    </div>

                    <div className="grid gap-3">
                      {plan.phases.map((phase) => (
                        <div key={`${phase.phase}-${phase.title}`} className="border border-zinc-900 bg-zinc-950 p-4">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                              <p className="font-mono text-[10px] tracking-widest text-zinc-500">{phase.phase} / {phase.estimatedDays}D</p>
                              <h3 className="mt-1 font-mono text-sm font-bold tracking-wider text-zinc-100">{phase.title}</h3>
                            </div>
                            <CalendarDays className="h-4 w-4 shrink-0 text-zinc-600" />
                          </div>
                          <p className="mb-3 font-mono text-xs leading-relaxed text-zinc-500">{phase.description}</p>
                          <div className="space-y-2">
                            {phase.subTasks.map((task) => (
                              <div key={task} className="flex items-start gap-2 font-mono text-xs text-zinc-300">
                                <Circle className="mt-0.5 h-3 w-3 shrink-0 text-zinc-600" />
                                <span>{task}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {plan.suggestedHabits && plan.suggestedHabits.length > 0 && (
                      <div className="border border-zinc-900 bg-zinc-950">
                        <div className="border-b border-zinc-900 px-4 py-2.5">
                          <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">INEVITABILITY_HABITS</span>
                        </div>
                        <div className="divide-y divide-zinc-900">
                          {plan.suggestedHabits.map((habit, index) => (
                            <button
                              key={`${habit.title}-${index}`}
                              type="button"
                              onClick={() => toggleHabit(index)}
                              className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-zinc-900/50"
                            >
                              {selectedHabits.has(index) ? (
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                              ) : (
                                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />
                              )}
                              <span className="min-w-0 flex-1">
                                <span className="block font-mono text-xs font-bold tracking-widest text-zinc-200">{habit.title}</span>
                                <span className="mt-1 block font-mono text-[10px] leading-relaxed text-zinc-500">
                                  {habit.description || '2-minute minimum version enabled'} / {habit.frequency || 'daily'} / {habit.timeOfDay || 'anytime'}
                                </span>
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 border border-zinc-900 bg-zinc-950 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-mono text-xs font-bold tracking-widest text-zinc-200">ACTIVATE_PLAN</p>
                        <p className="mt-1 font-mono text-[10px] leading-relaxed text-zinc-500">
                          Creates real goal, milestone, task, and selected habit records.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={activateArchitectPlan}
                        disabled={activating}
                        className="inline-flex items-center justify-center gap-2 border border-orange-800 bg-orange-950/20 px-4 py-2 font-mono text-xs font-bold tracking-widest text-orange-400 transition hover:bg-orange-950/40 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {activating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        CREATE_ITEMS
                      </button>
                    </div>

                    {activationSummary && (
                      <div className="flex items-center justify-between gap-3 border border-emerald-900 bg-emerald-950/20 px-4 py-3">
                        <p className="font-mono text-xs text-emerald-300">{activationSummary}</p>
                        <button type="button" onClick={() => router.push('/goals')} className="font-mono text-xs tracking-widest text-emerald-300 underline underline-offset-4">
                          VIEW_GOALS
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="border border-zinc-900 bg-zinc-950">
                <div className="border-b border-zinc-900 px-4 py-2.5">
                  <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">{activeConfig.label}_OUTPUT</span>
                </div>
                <div className="min-h-[360px] p-4">
                  {modeOutputs[activeMode] ? (
                    <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-zinc-300">{modeOutputs[activeMode]}</pre>
                  ) : (
                    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                      <ActiveModeIcon className="mb-3 h-8 w-8 text-zinc-700" />
                      <p className="font-mono text-xs tracking-widest text-zinc-500">OUTPUT_WAITING</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
