'use client';

import { useAction, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Map, Zap, ChevronRight, CheckCircle, Circle, Rocket, Loader2, ArrowRight, Sparkles, Target, BarChart3, Clock, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
  description: string;
  estimatedDays: number;
  subTasks: string[];
  phase: string;
}

interface SuggestedHabit {
  title: string;
  description: string;
  category: string;
  frequency: 'daily' | 'weekdays' | 'weekends' | '3x_week' | 'weekly' | 'custom';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  estimatedMinutes: number;
}

interface Plan {
  goal: string;
  overview: string;
  totalDuration: string;
  phases: Step[];
  suggestedHabits?: SuggestedHabit[];
}

export default function PlanBuilderPage() {
  const router = useRouter();
  const sendWithPersona = useAction(api.coachAI.sendWithPersona);
  const activatePlan = useMutation(api.goals.activatePlan);

  const [goalTitle, setGoalTitle] = useState('');
  const [goalContext, setGoalContext] = useState('');
  const [coachType, setCoachType] = useState<'TITAN' | 'NOVA' | 'SAGE' | 'PHOENIX'>('NOVA');
  const [building, setBuilding] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);
  const [activationResult, setActivationResult] = useState<{
    goalId: string;
    milestoneCount: number;
    taskCount: number;
    habitCount: number;
  } | null>(null);
  const [selectedHabits, setSelectedHabits] = useState<Set<number>>(new Set());

  const COACHES = [
    { id: 'NOVA' as const, label: 'NOVA', desc: 'Productivity Scientist — systematic, efficient', icon: '⚡' },
    { id: 'TITAN' as const, label: 'TITAN', desc: 'Business Strategist — revenue-focused', icon: '💪' },
    { id: 'SAGE' as const, label: 'SAGE', desc: 'Life Architect — purpose-aligned', icon: '💰' },
    { id: 'PHOENIX' as const, label: 'PHOENIX', desc: 'Comeback Coach — rebuilding focus', icon: '🔥' },
  ];

  const handleBuild = async (e: FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim() || building) return;
    setBuilding(true);
    setPlan(null);
    setActivated(false);
    setActivationResult(null);

    const prompt = `BUILD A DETAILED PLAN for this goal: "${goalTitle}"
${goalContext ? `Additional context: ${goalContext}` : ''}

Create a structured, unique, actionable plan broken into phases. Each phase should have:
- Specific phase name
- Clear description
- Estimated duration in days
- 3-5 specific sub-tasks (concrete actions, not vague)

ALSO suggest 2-4 daily/weekly habits that would support achieving this goal.

RESPOND WITH ONLY A VALID JSON OBJECT in this exact format:
{
  "goal": "${goalTitle}",
  "overview": "Brief overview sentence",
  "totalDuration": "X weeks/months",
  "phases": [
    {
      "title": "Phase 1 name",
      "description": "What this phase accomplishes",
      "estimatedDays": 7,
      "phase": "Phase 1",
      "subTasks": ["Specific task 1", "Specific task 2", "Specific task 3"]
    }
  ],
  "suggestedHabits": [
    {
      "title": "Habit name",
      "description": "What this habit does",
      "category": "health|productivity|learning|wellness",
      "frequency": "daily|weekdays",
      "timeOfDay": "morning|afternoon|evening|anytime",
      "estimatedMinutes": 15
    }
  ]
}

Make it realistic, specific to THIS goal (not generic), and include 4-6 phases.`;

    try {
      const response = await sendWithPersona({
        content: prompt,
        coachId: coachType,
      });

      const jsonMatch = response.reply?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed: Plan = JSON.parse(jsonMatch[0]);
        setPlan(parsed);
        if (parsed.suggestedHabits) {
          setSelectedHabits(new Set(parsed.suggestedHabits.map((_, i) => i)));
        }
      } else {
        setPlan({
          goal: goalTitle,
          overview: (response.reply ?? '').slice(0, 200),
          totalDuration: '6-8 weeks',
          phases: [
            { phase: 'Phase 1', title: 'Foundation & Research', description: 'Establish the groundwork and gather necessary information', estimatedDays: 7, subTasks: ['Define success criteria clearly', 'Research existing solutions/competition', 'List all required resources', 'Set up tracking system'] },
            { phase: 'Phase 2', title: 'Planning & Design', description: 'Create detailed plans and designs before execution', estimatedDays: 7, subTasks: ['Create detailed roadmap', 'Break down into weekly milestones', 'Identify potential blockers', 'Define first action to take'] },
            { phase: 'Phase 3', title: 'Execution — Sprint 1', description: 'Begin active work on the first major deliverable', estimatedDays: 14, subTasks: ['Execute first high-priority task', 'Daily progress check-in', 'Adjust plan based on learnings', 'Complete milestone 1'] },
            { phase: 'Phase 4', title: 'Review & Optimize', description: 'Evaluate progress, fix issues, optimize approach', estimatedDays: 7, subTasks: ['Review what is working', 'Eliminate non-essential tasks', 'Focus on 20% that creates 80% of results', 'Set next phase goals'] },
          ],
          suggestedHabits: [
            { title: 'Daily progress reflection', description: 'Spend 5 minutes reviewing what you accomplished today', category: 'productivity', frequency: 'daily', timeOfDay: 'evening', estimatedMinutes: 5 },
            { title: 'Morning intention setting', description: 'Define your top 3 priorities before starting work', category: 'productivity', frequency: 'daily', timeOfDay: 'morning', estimatedMinutes: 5 },
          ],
        });
        setSelectedHabits(new Set([0, 1]));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBuilding(false);
    }
  };

  const handleActivatePlan = async () => {
    if (!plan || activating || activated) return;
    setActivating(true);

    try {
      const habitsToCreate = plan.suggestedHabits
        ? plan.suggestedHabits
            .filter((_, i) => selectedHabits.has(i))
            .map(h => ({
              title: h.title,
              description: h.description,
              category: h.category,
              frequency: h.frequency,
              timeOfDay: h.timeOfDay,
              estimatedMinutes: h.estimatedMinutes,
            }))
        : [];

      const result = await activatePlan({
        goalTitle: plan.goal,
        goalDescription: plan.overview,
        totalDuration: plan.totalDuration,
        phases: plan.phases,
        habits: habitsToCreate,
      });

      setActivated(true);
      setActivationResult({
        goalId: result.goalId,
        milestoneCount: result.milestoneIds.length,
        taskCount: result.taskIds.length,
        habitCount: result.habitIds.length,
      });
    } catch (err) {
      console.error('Plan activation failed:', err);
      alert('Failed to activate plan. You may have reached your goal limit on the free plan. Upgrade to Pro for unlimited goals!');
    } finally {
      setActivating(false);
    }
  };

  const toggleStep = (i: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const toggleHabit = (i: number) => {
    setSelectedHabits((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const totalPhases = plan?.phases.length ?? 0;
  const completedCount = completedSteps.size;
  const overallProgress = totalPhases > 0 ? Math.round((completedCount / totalPhases) * 100) : 0;
  const totalTasks = plan?.phases.reduce((sum, p) => sum + p.subTasks.length, 0) ?? 0;
  const totalDays = plan?.phases.reduce((sum, p) => sum + p.estimatedDays, 0) ?? 0;

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-5 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">AI_MODULE :: PLAN_BUILDER_v3</span>
          </div>
          <div className="px-5 py-4">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Plan Builder</h1>
            <p className="mt-0.5 font-mono text-xs tracking-widest text-zinc-500">
              AI-powered goal decomposition — generates goals, milestones, tasks & habits automatically
            </p>
          </div>
        </div>

        {/* Input Form */}
        {!activated && (
          <div className="mb-5 border border-zinc-900 bg-zinc-950">
            <div className="border-b border-zinc-900 px-4 py-2.5">
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">GOAL_INPUT</span>
            </div>
            <form onSubmit={handleBuild} className="p-4 space-y-3">
              <input
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="What's your big goal? (e.g., Launch my SaaS, Lose 20lbs, Write a book)"
                required
                className="h-10 w-full border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none"
              />
              <textarea
                value={goalContext}
                onChange={(e) => setGoalContext(e.target.value)}
                placeholder="Extra context (current situation, constraints, resources available)..."
                rows={3}
                className="w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none"
              />
              <div>
                <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">COACH_PERSPECTIVE</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {COACHES.map(({ id, label, desc, icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCoachType(id)}
                      className={cn(
                        'border p-2.5 text-left transition',
                        coachType === id ? 'border-orange-800 bg-orange-950/20' : 'border-zinc-800 hover:border-zinc-700'
                      )}
                    >
                      <p className={cn('font-mono text-xs font-bold tracking-widest', coachType === id ? 'text-orange-500' : 'text-zinc-400')}>
                        {icon} {label}
                      </p>
                      <p className="font-mono text-xs text-zinc-400">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={building || !goalTitle.trim()}
                className="flex items-center gap-2 border border-orange-800 bg-orange-950/30 px-6 py-2.5 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/60 disabled:opacity-40"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {building ? 'GENERATING_PLAN_' : '[GENERATE MY PLAN]'}
              </button>
            </form>
          </div>
        )}

        {/* Loading */}
        {building && (
          <div className="border border-zinc-900 bg-zinc-950 p-8 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-600" />
            <p className="font-mono text-xs tracking-widest text-zinc-500">ANALYZING_GOAL_CONTEXT_</p>
            <p className="mt-1 font-mono text-xs text-zinc-400">Building a unique plan with milestones, tasks & habits...</p>
          </div>
        )}

        {/* Plan Output */}
        {plan && !building && (
          <div className="space-y-4">
            {/* Plan Overview with Stats */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5 flex items-center justify-between">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">PLAN_GENERATED</span>
                {activated && (
                  <span className="flex items-center gap-1.5 font-mono text-xs tracking-widest text-green-500">
                    <CheckCircle className="h-3 w-3" /> ACTIVATED
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-mono text-sm font-bold text-orange-500">{plan.goal}</p>
                <p className="mt-1.5 font-mono text-xs leading-relaxed text-zinc-400">{plan.overview}</p>

                {/* Stats Grid */}
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <div className="border border-zinc-800 bg-black p-2.5 text-center">
                    <Clock className="mx-auto mb-1 h-4 w-4 text-zinc-400" />
                    <p className="font-mono text-xs font-bold text-zinc-200">{plan.totalDuration}</p>
                    <p className="font-mono text-xs text-zinc-400">DURATION</p>
                  </div>
                  <div className="border border-zinc-800 bg-black p-2.5 text-center">
                    <Target className="mx-auto mb-1 h-4 w-4 text-zinc-400" />
                    <p className="font-mono text-xs font-bold text-zinc-200">{totalPhases}</p>
                    <p className="font-mono text-xs text-zinc-400">PHASES</p>
                  </div>
                  <div className="border border-zinc-800 bg-black p-2.5 text-center">
                    <ListChecks className="mx-auto mb-1 h-4 w-4 text-zinc-400" />
                    <p className="font-mono text-xs font-bold text-zinc-200">{totalTasks}</p>
                    <p className="font-mono text-xs text-zinc-400">TASKS</p>
                  </div>
                  <div className="border border-zinc-800 bg-black p-2.5 text-center">
                    <BarChart3 className="mx-auto mb-1 h-4 w-4 text-zinc-400" />
                    <p className="font-mono text-xs font-bold text-zinc-200">{totalDays}d</p>
                    <p className="font-mono text-xs text-zinc-400">EST. DAYS</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-zinc-500">REVIEW PROGRESS</span>
                    <span className="font-mono text-xs text-orange-500">{overallProgress}%</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-900">
                    <div className="h-1 bg-orange-600 transition-all duration-500" style={{ width: `${overallProgress}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Activation Banner */}
            {!activated && (
              <div className="border-2 border-dashed border-orange-800 bg-orange-950/10 p-5">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center border border-orange-800 bg-orange-950/30">
                    <Rocket className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-mono text-sm font-bold text-orange-400">Ready to activate this plan?</h3>
                    <p className="mt-1 font-mono text-xs leading-relaxed text-zinc-400">
                      Clicking activate will create a <span className="text-orange-500">Goal</span>, <span className="text-orange-500">{totalPhases} Milestones</span>, <span className="text-orange-500">{totalTasks} Tasks</span>
                      {selectedHabits.size > 0 && <>, and <span className="text-orange-500">{selectedHabits.size} Habits</span></>} in your dashboard.
                      Tasks will be scheduled with due dates. Your first task starts <span className="text-green-500">today</span>.
                    </p>
                    <button
                      onClick={handleActivatePlan}
                      disabled={activating}
                      className="mt-3 flex items-center gap-2 border border-orange-600 bg-orange-600/20 px-6 py-2.5 font-mono text-xs font-bold tracking-widest text-orange-400 transition hover:bg-orange-600/30 disabled:opacity-50"
                    >
                      {activating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          ACTIVATING_PLAN_
                        </>
                      ) : (
                        <>
                          <Rocket className="h-4 w-4" />
                          [ACTIVATE PLAN]
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Activation Success */}
            {activated && activationResult && (
              <div className="border border-green-900 bg-green-950/20 p-5">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center border border-green-800 bg-green-950/30">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-mono text-sm font-bold text-green-400">Plan Activated Successfully!</h3>
                    <p className="mt-1.5 font-mono text-xs text-zinc-400">
                      Created in your dashboard:
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <div className="border border-green-900/50 bg-black px-3 py-2">
                        <p className="font-mono text-lg font-bold text-green-500">1</p>
                        <p className="font-mono text-xs text-zinc-400">GOAL</p>
                      </div>
                      <div className="border border-green-900/50 bg-black px-3 py-2">
                        <p className="font-mono text-lg font-bold text-green-500">{activationResult.milestoneCount}</p>
                        <p className="font-mono text-xs text-zinc-400">MILESTONES</p>
                      </div>
                      <div className="border border-green-900/50 bg-black px-3 py-2">
                        <p className="font-mono text-lg font-bold text-green-500">{activationResult.taskCount}</p>
                        <p className="font-mono text-xs text-zinc-400">TASKS</p>
                      </div>
                      <div className="border border-green-900/50 bg-black px-3 py-2">
                        <p className="font-mono text-lg font-bold text-green-500">{activationResult.habitCount}</p>
                        <p className="font-mono text-xs text-zinc-400">HABITS</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 border border-green-800 bg-green-950/20 px-4 py-2 font-mono text-xs tracking-widest text-green-400 transition hover:bg-green-950/40"
                      >
                        <ArrowRight className="h-3 w-3" /> GO TO DASHBOARD
                      </button>
                      <button
                        onClick={() => router.push('/goals')}
                        className="flex items-center gap-2 border border-zinc-800 px-4 py-2 font-mono text-xs tracking-widest text-zinc-400 transition hover:border-zinc-700"
                      >
                        <Target className="h-3 w-3" /> VIEW GOALS
                      </button>
                      <button
                        onClick={() => router.push('/tasks')}
                        className="flex items-center gap-2 border border-zinc-800 px-4 py-2 font-mono text-xs tracking-widest text-zinc-400 transition hover:border-zinc-700"
                      >
                        <ListChecks className="h-3 w-3" /> VIEW TASKS
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Habits */}
            {plan.suggestedHabits && plan.suggestedHabits.length > 0 && !activated && (
              <div className="border border-zinc-900 bg-zinc-950">
                <div className="border-b border-zinc-900 px-4 py-2.5 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">SUGGESTED_HABITS</span>
                  <span className="font-mono text-xs text-zinc-400">{selectedHabits.size} selected</span>
                </div>
                <div className="p-3 space-y-1">
                  <p className="mb-2 font-mono text-xs text-zinc-400 px-1">
                    These habits will be auto-created when you activate the plan. Toggle any off if you don&apos;t want them.
                  </p>
                  {plan.suggestedHabits.map((habit, i) => {
                    const isSelected = selectedHabits.has(i);
                    return (
                      <button
                        key={i}
                        onClick={() => toggleHabit(i)}
                        className={cn(
                          'flex w-full items-center gap-3 border px-3 py-2.5 text-left transition',
                          isSelected ? 'border-orange-800 bg-orange-950/15' : 'border-zinc-800 opacity-50'
                        )}
                      >
                        <div className={cn(
                          'h-3 w-3 shrink-0 border transition',
                          isSelected ? 'border-orange-600 bg-orange-600' : 'border-zinc-600'
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className={cn('font-mono text-xs truncate', isSelected ? 'text-orange-400' : 'text-zinc-500')}>
                            {habit.title}
                          </p>
                          <p className="font-mono text-xs text-zinc-500 truncate">{habit.description}</p>
                        </div>
                        <div className="shrink-0 flex gap-1.5">
                          <span className="border border-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-400">
                            {habit.frequency.toUpperCase()}
                          </span>
                          <span className="border border-zinc-800 px-1.5 py-0.5 font-mono text-xs text-zinc-400">
                            {habit.estimatedMinutes}m
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Phases */}
            {plan.phases.map((step, i) => {
              const done = completedSteps.has(i);
              return (
                <div key={i} className={cn('border bg-zinc-950 transition', done ? 'border-green-900/50 opacity-80' : 'border-zinc-900')}>
                  <div className="flex items-start gap-3 p-4">
                    <button onClick={() => toggleStep(i)} className="mt-0.5 shrink-0">
                      {done ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-zinc-400 hover:text-zinc-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs tracking-widest text-zinc-400">{step.phase}</span>
                        <ChevronRight className="h-3 w-3 text-zinc-400" />
                        <span className={cn('font-mono text-sm font-bold', done ? 'text-green-500 line-through' : 'text-zinc-200')}>
                          {step.title}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs text-zinc-500">{step.description}</p>
                      <p className="mt-0.5 font-mono text-xs text-zinc-400">~{step.estimatedDays} days</p>
                      <ul className="mt-2 space-y-1">
                        {step.subTasks.map((task, j) => (
                          <li key={j} className="flex items-start gap-1.5">
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-orange-600" />
                            <span className="font-mono text-xs text-zinc-400">{task}</span>
                          </li>
                        ))}
                      </ul>
                      {activated && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="font-mono text-xs text-green-600">
                            {step.subTasks.length} tasks created · milestone tracked
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Rebuild / New Plan */}
            <div className="flex gap-2">
              <button
                onClick={() => { setPlan(null); setCompletedSteps(new Set()); setActivated(false); setActivationResult(null); setSelectedHabits(new Set()); }}
                className="flex-1 border border-dashed border-zinc-800 py-3 font-mono text-xs tracking-widest text-zinc-400 transition hover:border-orange-800 hover:text-orange-600"
              >
                {activated ? '[BUILD ANOTHER PLAN]' : '[REBUILD PLAN]'}
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!plan && !building && (
          <div className="border border-zinc-900 bg-zinc-950 p-8 text-center">
            <Map className="mx-auto mb-4 h-8 w-8 text-zinc-400" />
            <h3 className="font-mono text-sm font-bold text-zinc-300">Your AI Plan Builder</h3>
            <p className="mt-2 max-w-md mx-auto font-mono text-xs leading-relaxed text-zinc-500">
              Enter any goal above and your AI coach will generate a complete action plan with phases, milestones, tasks, and supporting habits.
              Click <span className="text-orange-500">[ACTIVATE PLAN]</span> to push everything into your dashboard automatically.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {['Launch a SaaS', 'Lose 15lbs in 3 months', 'Learn Python', 'Save $10K', 'Write a novel', 'Run a marathon'].map(ex => (
                <button
                  key={ex}
                  onClick={() => setGoalTitle(ex)}
                  className="border border-zinc-800 px-2.5 py-1.5 font-mono text-xs text-zinc-400 transition hover:border-orange-800 hover:text-orange-500"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
