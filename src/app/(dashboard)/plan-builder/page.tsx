'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Plan Builder 2.0
// 4-Bot AI system: Goal Architect · Week Planner · Habit Stack · Weekly Review
// ═══════════════════════════════════════════════════════════════════════════════

import { useAction, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState, FormEvent, ElementType } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Circle, Rocket, Loader2, ArrowRight, Sparkles, Target, BarChart3, Clock, ListChecks, ChevronRight, Compass, Zap, CalendarDays, Brain, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type BotTab = 'goal' | 'week' | 'habit' | 'review';

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

  // ── Bot tab navigation ──
  const [botTab, setBotTab] = useState<BotTab>('goal');

  // ── Goal Architect state ──
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

  // ── Week Planner state ──
  const [weekGoal, setWeekGoal] = useState('');
  const [weekBuilding, setWeekBuilding] = useState(false);
  interface WeekDay { day: string; focus: string; tasks: string[]; timeBlock: string; }
  const [weekPlan, setWeekPlan] = useState<WeekDay[] | null>(null);

  // ── Habit Stack state ──
  const [habitGoalInput, setHabitGoalInput] = useState('');
  const [habitBuilding, setHabitBuilding] = useState(false);
  interface DesignedHabit { title: string; why: string; when: string; duration: string; cue: string; reward: string; science: string; }
  const [habitStack, setHabitStack] = useState<DesignedHabit[] | null>(null);

  // ── Weekly Review state ──
  const [reviewWins, setReviewWins] = useState('');
  const [reviewBlocks, setReviewBlocks] = useState('');
  const [reviewBuilding, setReviewBuilding] = useState(false);
  interface ReviewResult { summary: string; wins: string[]; blockers: string[]; insights: string[]; nextWeekFocus: string[]; score: number; }
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);

  const COACHES = [
    { id: 'NOVA' as const, label: 'NOVA', desc: 'Productivity Scientist — systematic, efficient', icon: '⚡' },
    { id: 'TITAN' as const, label: 'TITAN', desc: 'Discipline Engine — fitness & performance', icon: '💪' },
    { id: 'SAGE' as const, label: 'SAGE', desc: 'Wealth Architect — finance & strategy', icon: '💰' },
    { id: 'PHOENIX' as const, label: 'PHOENIX', desc: 'Comeback Coach — rebuilding focus', icon: '🔥' },
  ];

  const handleBuild = async (e: FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim() || building) return;
    setBuilding(true);
    setPlan(null);
    setActivated(false);
    setActivationResult(null);

    const today = new Date();
    const dayOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][today.getDay()];
    const dateStr = today.toISOString().split('T')[0];

    const coachStrategy: Record<string, string> = {
      NOVA: 'You think in SYSTEMS and LEVERAGE. Design the plan like an engineer: find the 20% of actions that drive 80% of results. Use automation, batching, and elimination of waste. Every phase should have a clear input→output pipeline. You believe motivation is unreliable — build systems that work even on bad days.',
      TITAN: 'You think in PROGRESSIVE OVERLOAD and DISCIPLINE. Structure the plan like a training program: start with foundational capacity, increase intensity gradually, schedule deload/recovery periods, and build mental toughness through deliberate challenge. Every phase should push slightly beyond comfort zone.',
      SAGE: 'You think in COMPOUND GROWTH and STRATEGIC LEVERAGE. Design the plan like an investment portfolio: identify high-ROI actions early, build compounding assets, minimize waste, and create systems that generate returns over time. Every phase should increase the user\'s leverage.',
      PHOENIX: 'You think in TRANSFORMATION and MOMENTUM. Design the plan for someone who may be starting from zero or rebuilding. Begin with quick wins to build confidence, then gradually raise the bar. Acknowledge the difficulty of change while making each phase feel achievable. Build emotional resilience into the plan.',
    };

    const prompt = `You are building a PERSONALIZED, UNIQUE action plan. Today is ${dayOfWeek}, ${dateStr}.

GOAL: "${goalTitle}"
${goalContext ? `USER CONTEXT: ${goalContext}` : ''}

YOUR STRATEGIC APPROACH:
${coachStrategy[coachType] || coachStrategy.NOVA}

CRITICAL RULES — READ CAREFULLY:
1. NEVER use generic phase names like "Foundation & Research", "Planning & Design", "Execution", "Review & Optimize". Be SPECIFIC to this exact goal.
2. Every sub-task must be so specific someone could do it in one sitting without asking "but how?"
3. Phase names should reflect the ACTUAL work (e.g., for "Lose 15lbs": "Kitchen Reset & Meal Prep System" not "Foundation")
4. Include real tools, apps, resources, or techniques specific to this domain
5. Vary phase durations — not all 7 days. Some might be 3 days, some 14 days
6. Sub-tasks should include specific quantities, durations, or metrics where possible
7. The overview should be a compelling 1-2 sentence vision of what achieving this goal looks and feels like
8. Suggested habits must be ones that DIRECTLY accelerate this specific goal — not generic "journal daily" unless journaling specifically helps this goal

RESPOND WITH ONLY A VALID JSON OBJECT:
{
  "goal": "${goalTitle}",
  "overview": "Compelling vision statement — what life looks like when this is achieved",
  "totalDuration": "X weeks",
  "phases": [
    {
      "title": "Specific phase name tied to THIS goal",
      "description": "What this phase accomplishes and WHY it comes at this point",
      "estimatedDays": 7,
      "phase": "Phase 1",
      "subTasks": ["Very specific task with numbers/tools/details", "Another concrete action", "Third actionable step", "Fourth step if needed"]
    }
  ],
  "suggestedHabits": [
    {
      "title": "Habit directly tied to this goal",
      "description": "Why this habit accelerates THIS specific goal",
      "category": "health|productivity|learning|wellness",
      "frequency": "daily|weekdays|3x_week",
      "timeOfDay": "morning|afternoon|evening|anytime",
      "estimatedMinutes": 15
    }
  ]
}

Include 4-6 phases and 2-4 habits. Make it IMPOSSIBLE to confuse this plan with any other goal's plan.`;

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
          overview: (response.reply ?? '').slice(0, 200) || `A focused plan to achieve: ${goalTitle}`,
          totalDuration: '4-8 weeks',
          phases: [
            { phase: 'Phase 1', title: `${goalTitle} — Quick Assessment & Setup`, description: `Audit your current situation relative to "${goalTitle}" and set up the tools/environment you need`, estimatedDays: 5, subTasks: [`Write down exactly where you stand today regarding "${goalTitle}"`, 'Identify the single biggest obstacle in your way right now', 'Set up a simple tracking method (app, spreadsheet, or notebook)', 'Define what "done" looks like — specific measurable outcome'] },
            { phase: 'Phase 2', title: `First Real Action Sprint`, description: 'Take the first meaningful actions — build momentum through doing, not planning', estimatedDays: 10, subTasks: [`Complete the single most impactful task for "${goalTitle}"`, 'Do a 2-hour deep work block on the hardest part', 'Get feedback from someone who has done this before', 'Document what worked and what surprised you'] },
            { phase: 'Phase 3', title: `Build the System`, description: 'Turn your initial actions into a repeatable system you can sustain', estimatedDays: 14, subTasks: ['Create a daily/weekly routine around this goal', 'Automate or batch repetitive parts of the process', 'Set up accountability — tell someone or schedule check-ins', 'Handle the #1 excuse you keep using to avoid progress'] },
            { phase: 'Phase 4', title: `Push Through the Plateau`, description: 'Expect resistance here — this is where most people quit. Push through.', estimatedDays: 10, subTasks: ['Review your progress honestly — what is actually moving the needle?', 'Cut anything that feels productive but is not creating real results', 'Increase intensity or difficulty by 10-20%', 'Celebrate one specific win from this journey so far'] },
          ],
          suggestedHabits: [
            { title: `5-min ${goalTitle.split(' ').slice(0, 3).join(' ')} check-in`, description: `Review today\'s progress on ${goalTitle} and plan tomorrow\'s single most important action`, category: 'productivity', frequency: 'daily', timeOfDay: 'evening', estimatedMinutes: 5 },
            { title: 'Morning #1 priority lock-in', description: 'Before checking phone/email, write down THE one thing that moves this goal forward today', category: 'productivity', frequency: 'daily', timeOfDay: 'morning', estimatedMinutes: 3 },
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

  // ── Week Planner handler ──
  const handleBuildWeekPlan = async (e: FormEvent) => {
    e.preventDefault();
    if (!weekGoal.trim() || weekBuilding) return;
    setWeekBuilding(true);
    setWeekPlan(null);
    const todayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
    const prompt = `You are an elite Week Execution Planner. Today is ${todayName}.

GOAL FOR THIS WEEK: "${weekGoal}"

DESIGN RULES:
1. Start the 7-day plan from TOMORROW (the day after ${todayName}). Label days correctly.
2. Front-load the hardest/most important tasks on days 1-3 when willpower is highest.
3. Day 4 should be lighter — a "strategic recovery" day with easier admin/reflection tasks.
4. Days 5-6 are execution sprints for remaining high-priority work.
5. Day 7 is review + prep for the next week.
6. Each task must be completable in ONE sitting — no multi-day tasks.
7. Include specific time blocks ("90 min deep work 8-9:30am", not just "morning").
8. At least one task per day should be something the user can START within 2 minutes (tiny action to build momentum).
9. Mix high-energy tasks with low-energy ones within each day.
10. NEVER say "research" or "brainstorm" without specifying WHAT and for HOW LONG.

RESPOND WITH ONLY A VALID JSON ARRAY of 7 day objects:
[
  {
    "day": "Day name",
    "focus": "One compelling sentence — the theme and WHY this day matters",
    "tasks": ["Specific task with duration/detail", "Another concrete task", "Third task"],
    "timeBlock": "e.g. 90 min deep work 8-9:30am + 45 min admin 2pm"
  }
]

Make this plan feel like a personal trainer wrote it — structured, progressive, no fluff.`;
    try {
      const response = await sendWithPersona({ content: prompt, coachId: coachType });
      const jsonMatch = response.reply?.match(/\[[\s\S]*\]/);
      if (jsonMatch) setWeekPlan(JSON.parse(jsonMatch[0]));
    } catch (err) {
      console.error('Week plan failed:', err);
    }
    setWeekBuilding(false);
  };

  // ── Habit Stack handler ──
  const handleBuildHabitStack = async (e: FormEvent) => {
    e.preventDefault();
    if (!habitGoalInput.trim() || habitBuilding) return;
    setHabitBuilding(true);
    setHabitStack(null);
    const prompt = `You are a Habit Architect using proven frameworks from BJ Fogg (Tiny Habits), James Clear (Atomic Habits), and behavioral psychology.

GOAL THE HABITS MUST SUPPORT: "${habitGoalInput}"

DESIGN RULES:
1. Use the CUE → ROUTINE → REWARD chain for every habit. The cue must be an EXISTING behavior ("After I pour my morning coffee" not "At 7am").
2. Start TINY — the initial version should take 2 minutes or less. Include a "scaled up" version for week 3+.
3. Stack habits in a SEQUENCE — habit 2 should be cued by completing habit 1. Create a domino chain.
4. Include at least one "identity habit" — something that makes the user FEEL like the person who achieves this goal.
5. One habit should be a "keystone habit" — one that naturally triggers other positive behaviors.
6. Include the specific FAILURE MODE for each habit (what usually kills it) and a prevention strategy.
7. The reward must be IMMEDIATE (not "you'll feel better in 6 months").
8. Mix effort levels: 1-2 effortless habits, 2-3 moderate, 1 challenging.

RESPOND WITH ONLY A VALID JSON ARRAY of 4-6 habit objects:
[
  {
    "title": "Specific habit name (verb + object)",
    "why": "Direct causal link to the goal — HOW this habit moves the needle",
    "when": "After [existing behavior] — specific anchor moment",
    "duration": "Start: 2 min → Week 3+: 15 min",
    "cue": "Existing behavior or environmental trigger",
    "reward": "Immediate satisfying reward (not delayed gratification)",
    "science": "One-sentence research backing with specific mechanism"
  }
]

Make each habit feel like it was designed specifically for someone pursuing "${habitGoalInput}" — not generic self-improvement.`;
    try {
      const response = await sendWithPersona({ content: prompt, coachId: coachType });
      const jsonMatch = response.reply?.match(/\[[\s\S]*\]/);
      if (jsonMatch) setHabitStack(JSON.parse(jsonMatch[0]));
    } catch (err) {
      console.error('Habit stack failed:', err);
    }
    setHabitBuilding(false);
  };

  // ── Weekly Review handler ──
  const handleBuildReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!reviewWins.trim() || reviewBuilding) return;
    setReviewBuilding(true);
    setReviewResult(null);
    const weekNum = Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 604800000);
    const prompt = `You are a Performance Analyst running a deep-dive weekly review. Week ${weekNum} of ${new Date().getFullYear()}.

WINS THIS WEEK:
${reviewWins}

BLOCKERS / CHALLENGES:
${reviewBlocks || 'None reported — which itself is worth examining. Were there really no obstacles, or is the user not reflecting deeply enough?'}

ANALYSIS FRAMEWORK:
1. WINS: Don't just list them back — identify the BEHAVIOR or SYSTEM that created each win. What can be repeated or scaled?
2. BLOCKERS: Diagnose each one. Is it a skill gap, energy issue, environment problem, or priority conflict? Different root causes need different solutions.
3. PATTERN DETECTION: Look for recurring themes. If someone keeps winning at execution but struggling with planning, that's a pattern worth naming.
4. MOMENTUM SCORE: Rate 1-10 honestly. 7 is "good week". 5 is "survived". 9+ requires exceptional evidence. Don't inflate.
5. NEXT WEEK: Give exactly 3 priorities. The first should be the highest-leverage action. The third should be a "protect" priority (something to NOT let slip).
6. INSIGHTS: Go beyond obvious. Find the non-obvious connection between wins and blockers. What would a world-class coach notice that the user might miss?

RESPOND WITH ONLY A VALID JSON OBJECT:
{
  "summary": "One brutally honest sentence capturing this week's essence",
  "wins": ["Win + the system/behavior that caused it", "Win 2 + why it matters", "Win 3 + what to repeat"],
  "blockers": ["Blocker + root cause diagnosis + specific fix", "Blocker 2 + diagnosis + fix"],
  "insights": ["Non-obvious pattern or connection", "Strategic insight about trajectory", "What a coach would say that the user doesn't want to hear"],
  "nextWeekFocus": ["#1 highest-leverage priority", "#2 execution priority", "#3 protect/don't-let-slip priority"],
  "score": 7
}

Be direct. Be specific. No motivational fluff — just signal.`;
    try {
      const response = await sendWithPersona({ content: prompt, coachId: coachType });
      const jsonMatch = response.reply?.match(/\{[\s\S]*\}/);
      if (jsonMatch) setReviewResult(JSON.parse(jsonMatch[0]));
    } catch (err) {
      console.error('Review failed:', err);
    }
    setReviewBuilding(false);
  };

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
              4-Bot AI system — each bot specialises in a different part of your growth
            </p>
          </div>
        </div>

        {/* ── 4-Bot Tab Navigation ── */}
        <div className="mb-5 grid grid-cols-4 border border-zinc-900">
          {([
            { id: 'goal'   as BotTab, label: 'GOAL\nARCHITECT', icon: Target,      color: 'text-orange-400', activeColor: 'bg-orange-950/30 border-b-2 border-orange-600' },
            { id: 'week'   as BotTab, label: 'WEEK\nPLANNER',   icon: CalendarDays, color: 'text-blue-400',   activeColor: 'bg-blue-950/30   border-b-2 border-blue-600'   },
            { id: 'habit'  as BotTab, label: 'HABIT\nSTACK',    icon: Zap,          color: 'text-emerald-400',activeColor: 'bg-emerald-950/30 border-b-2 border-emerald-600'},
            { id: 'review' as BotTab, label: 'WEEKLY\nREVIEW',  icon: RefreshCw,    color: 'text-purple-400', activeColor: 'bg-purple-950/30  border-b-2 border-purple-600' },
          ] as { id: BotTab; label: string; icon: ElementType; color: string; activeColor: string }[]).map(({ id, label, icon: Icon, color, activeColor }) => (
            <button
              key={id}
              onClick={() => setBotTab(id)}
              className={cn(
                'flex flex-col items-center gap-1 px-2 py-3 transition',
                botTab === id ? activeColor : 'hover:bg-zinc-900/50',
              )}
            >
              <Icon className={cn('h-4 w-4', botTab === id ? color : 'text-zinc-500')} />
              <span className={cn('whitespace-pre-wrap text-center font-mono text-[0.55rem] leading-tight tracking-widest', botTab === id ? color : 'text-zinc-500')}>
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* ── COACH SELECTOR (shared across all bots) ── */}
        <div className="mb-4 border border-zinc-900 bg-zinc-950 p-3">
          <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">AI VOICE</p>
          <div className="flex flex-wrap gap-1.5">
            {COACHES.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setCoachType(id)}
                className={cn(
                  'border px-3 py-1.5 font-mono text-xs transition',
                  coachType === id ? 'border-orange-800 bg-orange-950/20 text-orange-400' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                )}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
        {/* ── BOT 1: GOAL ARCHITECT ── */}
        {botTab === 'goal' && (
          <div className="space-y-4">
            {!activated && (
              <div className="border border-zinc-900 bg-zinc-950">
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
                    className="w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none"
                  />
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
            <Compass className="mx-auto mb-4 h-8 w-8 text-zinc-400" />
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
        )}

        {/* ── BOT 2: WEEK PLANNER ── */}
        {botTab === 'week' && (
          <div className="space-y-4">
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">WEEK_PLANNER</span>
              </div>
              <form onSubmit={handleBuildWeekPlan} className="p-4 space-y-3">
                <p className="font-mono text-xs text-zinc-400">What goal or phase are you executing this week?</p>
                <input
                  value={weekGoal}
                  onChange={(e) => setWeekGoal(e.target.value)}
                  placeholder="e.g. Launch landing page, Complete fitness phase 1, Study for exam"
                  required
                  className="h-10 w-full border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={weekBuilding || !weekGoal.trim()}
                  className="flex items-center gap-2 border border-orange-800 bg-orange-950/30 px-6 py-2.5 font-mono text-xs tracking-widest text-orange-400 transition hover:bg-orange-950/60 disabled:opacity-40"
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  {weekBuilding ? 'PLANNING_WEEK_' : '[PLAN MY WEEK]'}
                </button>
              </form>
            </div>
            {weekBuilding && (
              <div className="border border-zinc-900 bg-zinc-950 p-8 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-orange-600" />
                <p className="font-mono text-xs tracking-widest text-zinc-500">PLANNING_7_DAYS_</p>
              </div>
            )}
            {weekPlan && !weekBuilding && (
              <div className="space-y-2">
                {weekPlan.map((day, i) => (
                  <div key={i} className="border border-zinc-900 bg-zinc-950 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold tracking-widest text-blue-400">{day.day.toUpperCase()}</span>
                      <span className="border border-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-400">{day.timeBlock}</span>
                    </div>
                    <p className="font-mono text-sm text-zinc-100 mb-2">{day.focus}</p>
                    <ul className="space-y-1">
                      {day.tasks.map((task, j) => (
                        <li key={j} className="flex items-start gap-1.5">
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-600" />
                          <span className="font-mono text-xs text-zinc-400">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <button
                  onClick={() => { setWeekPlan(null); setWeekGoal(''); }}
                  className="w-full border border-dashed border-zinc-800 py-3 font-mono text-xs tracking-widest text-zinc-400 transition hover:border-blue-800 hover:text-blue-400"
                >
                  [REPLAN WEEK]
                </button>
              </div>
            )}
            {!weekPlan && !weekBuilding && (
              <div className="border border-zinc-900 bg-zinc-950 p-8 text-center">
                <CalendarDays className="mx-auto mb-4 h-8 w-8 text-zinc-400" />
                <p className="font-mono text-sm font-bold text-zinc-300">Week Planner Bot</p>
                <p className="mt-2 font-mono text-xs text-zinc-500">Enter a goal or phase and get a specific day-by-day execution plan for the next 7 days.</p>
              </div>
            )}
          </div>
        )}

        {/* ── BOT 3: HABIT STACK ── */}
        {botTab === 'habit' && (
          <div className="space-y-4">
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">HABIT_DESIGNER</span>
              </div>
              <form onSubmit={handleBuildHabitStack} className="p-4 space-y-3">
                <p className="font-mono text-xs text-zinc-400">What goal are you building habits to support?</p>
                <input
                  value={habitGoalInput}
                  onChange={(e) => setHabitGoalInput(e.target.value)}
                  placeholder="e.g. Build muscle, Write a novel, Grow a business"
                  required
                  className="h-10 w-full border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-emerald-800 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={habitBuilding || !habitGoalInput.trim()}
                  className="flex items-center gap-2 border border-emerald-800 bg-emerald-950/30 px-6 py-2.5 font-mono text-xs tracking-widest text-emerald-400 transition hover:bg-emerald-950/60 disabled:opacity-40"
                >
                  <Zap className="h-3.5 w-3.5" />
                  {habitBuilding ? 'DESIGNING_HABITS_' : '[DESIGN HABIT STACK]'}
                </button>
              </form>
            </div>
            {habitBuilding && (
              <div className="border border-zinc-900 bg-zinc-950 p-8 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-600" />
                <p className="font-mono text-xs tracking-widest text-zinc-500">DESIGNING_HABIT_STACK_</p>
              </div>
            )}
            {habitStack && !habitBuilding && (
              <div className="space-y-2">
                {habitStack.map((habit, i) => (
                  <div key={i} className="border border-zinc-900 bg-zinc-950 p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-mono text-sm font-bold text-emerald-400">{habit.title}</p>
                      <span className="shrink-0 border border-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-400">{habit.duration}</span>
                    </div>
                    <p className="font-mono text-xs text-zinc-300 mb-2">{habit.why}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="border border-zinc-800 bg-black p-2"><span className="text-zinc-500">WHEN: </span><span className="text-zinc-300">{habit.when}</span></div>
                      <div className="border border-zinc-800 bg-black p-2"><span className="text-zinc-500">CUE: </span><span className="text-zinc-300">{habit.cue}</span></div>
                      <div className="border border-zinc-800 bg-black p-2"><span className="text-zinc-500">REWARD: </span><span className="text-zinc-300">{habit.reward}</span></div>
                      <div className="border border-zinc-800 bg-black p-2 col-span-2"><span className="text-zinc-500">SCIENCE: </span><span className="text-zinc-400 italic">{habit.science}</span></div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => { setHabitStack(null); setHabitGoalInput(''); }}
                  className="w-full border border-dashed border-zinc-800 py-3 font-mono text-xs tracking-widest text-zinc-400 transition hover:border-emerald-800 hover:text-emerald-400"
                >
                  [REDESIGN STACK]
                </button>
              </div>
            )}
            {!habitStack && !habitBuilding && (
              <div className="border border-zinc-900 bg-zinc-950 p-8 text-center">
                <Zap className="mx-auto mb-4 h-8 w-8 text-zinc-400" />
                <p className="font-mono text-sm font-bold text-zinc-300">Habit Stack Designer</p>
                <p className="mt-2 font-mono text-xs text-zinc-500">Enter your goal and get a science-backed habit stack with cues, rewards, and timing.</p>
              </div>
            )}
          </div>
        )}

        {/* ── BOT 4: WEEKLY REVIEW ── */}
        {botTab === 'review' && (
          <div className="space-y-4">
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">WEEKLY_REVIEW</span>
              </div>
              <form onSubmit={handleBuildReview} className="p-4 space-y-3">
                <div>
                  <p className="mb-1.5 font-mono text-xs tracking-widest text-zinc-400">WINS THIS WEEK</p>
                  <textarea
                    value={reviewWins}
                    onChange={(e) => setReviewWins(e.target.value)}
                    placeholder="What did you accomplish? What went well? What are you proud of?"
                    rows={3}
                    required
                    className="w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-purple-800 focus:outline-none"
                  />
                </div>
                <div>
                  <p className="mb-1.5 font-mono text-xs tracking-widest text-zinc-400">BLOCKERS &amp; CHALLENGES</p>
                  <textarea
                    value={reviewBlocks}
                    onChange={(e) => setReviewBlocks(e.target.value)}
                    placeholder="What held you back? What was difficult? What do you want to improve?"
                    rows={2}
                    className="w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-purple-800 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={reviewBuilding || !reviewWins.trim()}
                  className="flex items-center gap-2 border border-purple-800 bg-purple-950/30 px-6 py-2.5 font-mono text-xs tracking-widest text-purple-400 transition hover:bg-purple-950/60 disabled:opacity-40"
                >
                  <Brain className="h-3.5 w-3.5" />
                  {reviewBuilding ? 'ANALYZING_WEEK_' : '[ANALYZE MY WEEK]'}
                </button>
              </form>
            </div>
            {reviewBuilding && (
              <div className="border border-zinc-900 bg-zinc-950 p-8 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-purple-600" />
                <p className="font-mono text-xs tracking-widest text-zinc-500">ANALYZING_WEEKLY_DATA_</p>
              </div>
            )}
            {reviewResult && !reviewBuilding && (
              <div className="space-y-3">
                <div className="border border-zinc-900 bg-zinc-950 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold tracking-widest text-purple-400">WEEK ANALYSIS</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-zinc-500">SCORE:</span>
                      <span className={cn('font-mono text-2xl font-bold', reviewResult.score >= 7 ? 'text-green-400' : reviewResult.score >= 5 ? 'text-yellow-400' : 'text-red-400')}>{reviewResult.score}/10</span>
                    </div>
                  </div>
                  <p className="font-mono text-sm text-zinc-200 mb-4">{reviewResult.summary}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 font-mono text-xs tracking-widest text-green-500">WINS</p>
                      <ul className="space-y-1">
                        {reviewResult.wins.map((w, i) => (<li key={i} className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-green-600" /><span className="font-mono text-xs text-zinc-300">{w}</span></li>))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 font-mono text-xs tracking-widest text-red-500">BLOCKERS</p>
                      <ul className="space-y-1">
                        {reviewResult.blockers.map((b, i) => (<li key={i} className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-600" /><span className="font-mono text-xs text-zinc-300">{b}</span></li>))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="mb-2 font-mono text-xs tracking-widest text-orange-500">INSIGHTS</p>
                    <ul className="space-y-1">
                      {reviewResult.insights.map((ins, i) => (<li key={i} className="flex items-start gap-1.5"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-orange-600" /><span className="font-mono text-xs text-zinc-300">{ins}</span></li>))}
                    </ul>
                  </div>
                  <div className="mt-3">
                    <p className="mb-2 font-mono text-xs tracking-widest text-blue-400">NEXT WEEK FOCUS</p>
                    <ul className="space-y-1">
                      {reviewResult.nextWeekFocus.map((f, i) => (<li key={i} className="flex items-start gap-1.5"><ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-blue-600" /><span className="font-mono text-xs text-zinc-300">{f}</span></li>))}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => { setReviewResult(null); setReviewWins(''); setReviewBlocks(''); }}
                  className="w-full border border-dashed border-zinc-800 py-3 font-mono text-xs tracking-widest text-zinc-400 transition hover:border-purple-800 hover:text-purple-400"
                >
                  [NEW REVIEW]
                </button>
              </div>
            )}
            {!reviewResult && !reviewBuilding && (
              <div className="border border-zinc-900 bg-zinc-950 p-8 text-center">
                <RefreshCw className="mx-auto mb-4 h-8 w-8 text-zinc-400" />
                <p className="font-mono text-sm font-bold text-zinc-300">Weekly Review Bot</p>
                <p className="mt-2 font-mono text-xs text-zinc-500">Reflect on your wins and blockers and get AI-powered analysis, insights, and a focused plan for next week.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
