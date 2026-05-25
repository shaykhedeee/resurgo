'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Resurgo — Goal Detail Page
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Edit3,
  Trash2,
  TrendingUp,
  Calendar,
  Sparkles,
  Loader2,
  Circle,
  CalendarDays,
} from 'lucide-react';
import { useState } from 'react';

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = params.id as string;
  const goal = useQuery(api.goals.getById, { goalId: goalId as Id<"goals"> });
  const tasks = useQuery(api.tasks.listByGoal, { goalId: goalId as Id<"goals"> });
  const updateGoal = useMutation(api.goals.update);
  const removeGoal = useMutation(api.goals.remove);

  // Nova AI Decomposer state & actions
  const sendWithPersona = useAction(api.coachAI.sendWithPersona);
  const bulkCreateMilestones = useMutation(api.milestones.bulkCreate);
  const bulkCreateTasks = useMutation(api.tasks.bulkCreate);

  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLogs, setAiLogs] = useState<string[]>([]);
  const [aiStatus, setAiStatus] = useState<'idle' | 'simulating' | 'completed' | 'error'>('idle');
  const [activating, setActivating] = useState(false);
  const [activationSummary, setActivationSummary] = useState<string | null>(null);

  const handleDecomposeGoal = async () => {
    if (!goal || aiGenerating) return;
    setAiGenerating(true);
    setAiStatus('simulating');
    setActivationSummary(null);
    setAiResult(null);

    // Cyberpunk simulated logs
    const logQueue = [
      'resurgo:nova_ai$ initiating_decomposition_blueprint...',
      'resurgo:nova_ai$ mapping_milestones_and_checkpoints...',
      'resurgo:nova_ai$ analyzing_dependencies_and_tasks...',
      'resurgo:nova_ai$ compiling_decomposition_schema...',
    ];

    setAiLogs([]);
    for (let i = 0; i < logQueue.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setAiLogs((prev) => [...prev, logQueue[i]]);
    }

    try {
      const novaPrompt = `You are NOVA, the Strategic Goal Architect. Today is ${new Date().toISOString().split('T')[0]}.
Please decompose this active goal into a structured cohort of milestones and task nodes.
Goal Title: "${goal.title}"
Goal Description: "${goal.description || ''}"
Goal Why Important: "${goal.whyImportant || ''}"

You must output a single valid JSON object containing:
{
  "phases": [
    {
      "title": "Milestone Title",
      "description": "What this milestone achieves",
      "estimatedDays": 7,
      "phase": "Phase 1",
      "subTasks": ["Task 1 title under 60 mins", "Task 2 title under 60 mins"]
    }
  ]
}
Do not include any conversational text before or after the JSON. Return only valid JSON.`;

      const response = await sendWithPersona({
        content: novaPrompt,
        coachId: 'NOVA',
      });

      const jsonMatch = response.reply.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI goal decomposition JSON');
      }
      const parsedPlan = JSON.parse(jsonMatch[0]);
      setAiResult(parsedPlan);
      setAiStatus('completed');
    } catch (err) {
      console.error(err);
      setAiLogs((prev) => [...prev, 'resurgo:nova_ai$ [ERROR] Decomposition path collapsed. Re-routing failed.']);
      setAiStatus('error');
    } finally {
      setAiGenerating(false);
    }
  };

  const activateNovaBlueprint = async () => {
    if (!aiResult || activating) return;
    setActivating(true);
    try {
      const milestonesToCreate = aiResult.phases.map((phase: any, index: number) => ({
        title: `${phase.phase}: ${phase.title}`,
        description: phase.description,
        sequenceOrder: index + 1,
        completionCriteria: phase.subTasks,
        tags: ['nova-ai', 'decomposition'],
      }));

      const milestoneIds = await bulkCreateMilestones({
        goalId: goalId as Id<"goals">,
        milestones: milestonesToCreate,
      });

      const tasksToCreate: any[] = [];
      aiResult.phases.forEach((phase: any, index: number) => {
        const milestoneId = milestoneIds[index];
        phase.subTasks.forEach((subTaskTitle: string) => {
          tasksToCreate.push({
            title: subTaskTitle,
            priority: 'medium' as const,
            dueDate: new Date(Date.now() + (index + 1) * 7 * 86400000).toISOString().split('T')[0],
            goalId: goalId as Id<"goals">,
            milestoneId,
            tags: ['nova-ai', 'decomposition'],
            xpValue: 10,
          });
        });
      });

      await bulkCreateTasks({ tasks: tasksToCreate });
      setActivationSummary(`[BLUEPRINT_ACTIVATED_SUCCESSFULLY] -- Created ${milestoneIds.length} milestones and ${tasksToCreate.length} tasks.`);
    } catch (err) {
      console.error(err);
      setActivationSummary('[ERROR] Backlog creation collapsed.');
    } finally {
      setActivating(false);
    }
  };

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  if (goal === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="animate-pulse font-mono text-xs tracking-widest text-orange-600">LOADING_OBJECTIVE...</p>
      </div>
    );
  }

  if (goal === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black">
        <p className="font-mono text-xs tracking-widest text-zinc-400">OBJECTIVE_NOT_FOUND</p>
        <Link href="/goals" className="border border-zinc-800 px-3 py-1.5 font-mono text-xs tracking-widest text-zinc-500 transition hover:border-zinc-700">[RETURN_TO_OBJECTIVES]</Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm('Delete this goal? This cannot be undone.')) return;
    await removeGoal({ goalId: goalId as Id<"goals"> });
    router.push('/goals');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateGoal({
      goalId: goalId as Id<"goals">,
      title: editTitle || undefined,
      description: editDescription || undefined,
    });
    setEditing(false);
  };

  const handleStatusChange = async (status: string) => {
    await updateGoal({
      goalId: goalId as Id<"goals">,
      status: status as 'draft' | 'in_progress' | 'completed' | 'paused' | 'abandoned',
    });
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-3xl">

        {/* ── BACK NAV ── */}
        <Link href="/goals" className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs tracking-widest text-zinc-400 transition hover:text-zinc-300">
          <ArrowLeft className="h-3 w-3" /> [RETURN_TO_OBJECTIVES]
        </Link>

        {/* ── GOAL HEADER ── */}
        <div className="mb-4 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">CORE_OBJECTIVE :: DETAIL_VIEW</span>
          </div>

          <div className="p-4">
            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-3">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 focus:border-orange-800 focus:outline-none"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-400 focus:border-orange-800 focus:outline-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button type="submit" className="border border-orange-800 bg-orange-950/30 px-3 py-1.5 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/50">[SAVE]</button>
                  <button type="button" onClick={() => setEditing(false)} className="border border-zinc-800 px-3 py-1.5 font-mono text-xs tracking-widest text-zinc-500 transition hover:border-zinc-700">[CANCEL]</button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="font-mono text-xl font-bold tracking-tight text-zinc-100">{goal.title}</h1>
                  {goal.description && (
                    <p className="mt-1.5 font-mono text-xs text-zinc-400">{goal.description}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditTitle(goal.title); setEditDescription(goal.description || ''); setEditing(true); }}
                    className="border border-zinc-800 p-1.5 text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-300"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button onClick={handleDelete} className="border border-red-900/50 p-1.5 text-red-700 transition hover:border-red-800 hover:text-red-500">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="border-t border-zinc-900 px-4 py-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-zinc-400">COMPLETION_RATIO</span>
              <span className="font-mono text-sm font-bold text-orange-500">{goal.progress ?? 0}%</span>
            </div>
            <div className="h-0.5 overflow-hidden bg-zinc-900">
              <div
                className="h-full bg-orange-600 transition-all duration-500"
                style={{ width: `${goal.progress ?? 0}%` }}
              />
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 border-t border-zinc-900 px-4 py-3">
            <span className="flex items-center gap-1 font-mono text-xs tracking-widest text-zinc-400">
              <TrendingUp className="h-3 w-3" />
              <span className="text-zinc-500">{goal.status?.replace('_', ' ').toUpperCase()}</span>
            </span>
            {goal.lifeDomain && (
              <span className="border border-zinc-800 px-2 py-0.5 font-mono text-xs tracking-widest text-zinc-400">
                {goal.lifeDomain.replace('_', ' ').toUpperCase()}
              </span>
            )}
            {goal.targetDate && (
              <span className="flex items-center gap-1 font-mono text-xs text-zinc-400">
                <Calendar className="h-3 w-3" /> {goal.targetDate}
              </span>
            )}
          </div>

          {/* Why Important */}
          {goal.whyImportant && (
            <div className="border-t border-zinc-900 px-4 py-3">
              <p className="mb-1 font-mono text-xs tracking-widest text-orange-600">WHY_THIS_MATTERS</p>
              <p className="font-mono text-xs text-zinc-500">{goal.whyImportant}</p>
            </div>
          )}

          {/* Status Actions */}
          <div className="flex flex-wrap gap-2 border-t border-zinc-900 px-4 py-3">
            {goal.status !== 'completed' && (
              <button
                onClick={() => handleStatusChange('completed')}
                className="flex items-center gap-1.5 border border-green-900 bg-green-950/20 px-3 py-1.5 font-mono text-xs tracking-widest text-green-500 transition hover:bg-green-950/40"
              >
                <CheckCircle2 className="h-3 w-3" /> [MARK_COMPLETE]
              </button>
            )}
            {goal.status === 'in_progress' && (
              <button
                onClick={() => handleStatusChange('paused')}
                className="border border-yellow-900/50 bg-yellow-950/20 px-3 py-1.5 font-mono text-xs tracking-widest text-yellow-600 transition hover:bg-yellow-950/40"
              >
                [PAUSE]
              </button>
            )}
            {goal.status === 'paused' && (
              <button
                onClick={() => handleStatusChange('in_progress')}
                className="border border-blue-900/50 bg-blue-950/20 px-3 py-1.5 font-mono text-xs tracking-widest text-blue-500 transition hover:bg-blue-950/40"
              >
                [RESUME]
              </button>
            )}
          </div>
        </div>

        {/* ── GOAL AI DECOMPOSER ── */}
        <div className="mb-4 border border-orange-950/60 bg-zinc-950 p-5 rounded-[2px] space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-orange-500" />
            <span className="font-mono text-xs tracking-widest text-orange-500 uppercase">// GOAL_AI_DECOMPOSER_::__NOVA_MODULE</span>
          </div>
          <p className="font-mono text-[11px] text-zinc-400 leading-relaxed">
            Deconstruct this active objective into sequential milestones and tactical task cards. Coach NOVA will map out dependencies to make this objective highly actionable.
          </p>

          {aiStatus === 'idle' && (
            <button
              onClick={handleDecomposeGoal}
              disabled={aiGenerating}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-orange-900 bg-orange-950/20 px-4 py-2 font-mono text-xs font-bold tracking-widest text-orange-500 uppercase transition hover:bg-orange-950/40"
            >
              [DECOMPOSE_OBJECTIVE_PLAN]
            </button>
          )}

          {/* Simulated loading state */}
          {aiStatus === 'simulating' && (
            <div className="bg-black border border-orange-950/50 p-4 font-mono text-[10px] text-orange-500 text-left space-y-1 rounded-[2px]">
              {aiLogs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
              <div className="animate-pulse">resurgo:nova_ai$ computing_optimal_pathways...</div>
            </div>
          )}

          {/* Error fallback */}
          {aiStatus === 'error' && (
            <div className="space-y-2">
              <p className="font-mono text-xs text-red-500">resurgo:nova_ai$ [CRITICAL_FAILURE] Failed to parse decomposition plan.</p>
              <button
                onClick={handleDecomposeGoal}
                type="button"
                className="rounded-[2px] border border-red-900 bg-red-950/20 px-3 py-1.5 font-mono text-xs text-red-500 transition hover:bg-red-950/40 uppercase"
              >
                [RETRY_DECOMPOSITION]
              </button>
            </div>
          )}

          {/* AI Decomposition Result */}
          {aiStatus === 'completed' && aiResult && (
            <div className="space-y-4">
              <div className="border border-orange-900 bg-zinc-950 font-mono text-left rounded-[2px]">
                <div className="border-b border-orange-950/40 px-4 py-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-orange-500 tracking-widest uppercase">
                    // DECOMPOSITION_BLUEPRINT_ACTUAL
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {aiResult.phases?.length || 0} MILESTONES DEFINED
                  </span>
                </div>
                <div className="divide-y divide-zinc-900">
                  {aiResult.phases?.map((phase: any, i: number) => (
                    <div key={i} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-zinc-200 uppercase tracking-wide">
                          {phase.phase} :: {phase.title}
                        </p>
                        <span className="text-[10px] border border-orange-900/40 px-2 py-0.5 text-orange-500">
                          {phase.estimatedDays} DAYS
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed">{phase.description}</p>
                      <div className="space-y-1.5 border-t border-zinc-900/30 pt-2">
                        {phase.subTasks?.map((task: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[10px] text-zinc-400">
                            <Circle className="mt-0.5 h-2 w-2 shrink-0 text-orange-500/40" />
                            <span>{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activation action */}
              <div className="flex flex-col sm:flex-row gap-2 items-center justify-between border-t border-zinc-900 pt-3">
                <div className="min-w-0 flex-1 pr-4">
                  <p className="font-mono text-xs font-bold tracking-widest text-zinc-200">ACTIVATE_DECOMPOSITION_BLUEPRINT</p>
                  <p className="font-mono text-[9px] text-zinc-500 leading-relaxed">
                    This will commit these phases as milestones and inject all tasks directly into your primary workspace.
                  </p>
                </div>
                <button
                  onClick={activateNovaBlueprint}
                  disabled={activating}
                  type="button"
                  className="rounded-[2px] border border-orange-800 bg-orange-950/20 px-4 py-2 font-mono text-xs font-bold tracking-widest text-orange-400 transition hover:bg-orange-950/40 uppercase whitespace-nowrap"
                >
                  {activating ? '[CREATING...]' : '[ACTIVATE_ITEMS]'}
                </button>
              </div>

              {activationSummary && (
                <div className="border border-emerald-950 bg-emerald-950/15 p-2.5 text-center font-mono text-[10px] text-emerald-400 border-t border-dashed mt-3">
                  {activationSummary}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── RELATED TASKS ── */}
        <div className="border border-zinc-900 bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2.5">
            <span className="font-mono text-xs font-bold tracking-widest text-zinc-400">Linked Tasks</span>
            <Link href="/tasks" className="font-mono text-xs tracking-widest text-orange-600 transition hover:text-orange-500">[Add Task]</Link>
          </div>

          {!tasks || tasks.length === 0 ? (
            <p className="px-4 py-6 font-mono text-xs tracking-widest text-zinc-400">No tasks linked to this goal yet.</p>
          ) : (
            <div className="divide-y divide-zinc-900">
              {tasks.map((task) => (
                <div key={task._id} className="flex items-center gap-3 px-4 py-3 transition hover:bg-zinc-900">
                  <div className={`h-3 w-3 border ${task.status === 'done' ? 'border-green-600 bg-green-950/40' : 'border-zinc-700'}`} />
                  <p className={`flex-1 font-mono text-xs ${task.status === 'done' ? 'text-zinc-400 line-through' : 'text-zinc-400'}`}>
                    {task.title}
                  </p>
                  {task.dueDate && <span className="font-mono text-xs text-zinc-400">{task.dueDate}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

