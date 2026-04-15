// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — AI Orchestrator
// Multi-provider prompt decomposition engine
//
// HOW IT WORKS:
// 1. DECOMPOSE — A fast "coordinator" AI breaks the complex prompt into sub-tasks
// 2. CLASSIFY  — Each sub-task is assigned to the best provider based on type
// 3. EXECUTE   — Sub-tasks run in PARALLEL across different providers
// 4. SYNTHESIZE — A "synthesizer" AI merges all sub-results into one coherent answer
//
// PROVIDER SPECIALIZATIONS:
//   ollama     → local inference, free, private (first choice when available)
//   cerebras   → ultra-fast quick tasks, data extraction
//   groq       → fast general-purpose, coaching responses
//   gemini     → long-context analysis, document understanding
//   together   → balanced fallback
//   openrouter → free-tier overflow
//   aiml       → free tier models
//   openai     → complex synthesis (last resort)
// ═══════════════════════════════════════════════════════════════════════════════

import {
  callAI,
  callAIJson,
  callAIWithProvider,
  getAvailableProviders,
  type AIMessage,
  type AIProvider,
  type AIResponse,
  type TaskType,
} from './provider-router';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type SubTaskType =
  | 'analysis'       // Deep reasoning, pattern recognition
  | 'creative'       // Writing, brainstorming, idea generation
  | 'extraction'     // Data parsing, summarization, key-point extraction
  | 'planning'       // Strategy, action plans, step-by-step instructions
  | 'research'       // Fact-checking, knowledge retrieval
  | 'emotional'      // Empathy, motivational coaching, tone-setting
  | 'technical'      // Code, math, logic, structured problems
  | 'synthesis';     // Combining and unifying multiple pieces

export interface SubTask {
  id: string;
  title: string;
  type: SubTaskType;
  prompt: string;
  dependsOn?: string[];  // IDs of tasks this depends on (sequential execution)
  provider?: AIProvider;  // Assigned provider (auto-selected if omitted)
}

export interface SubTaskResult {
  id: string;
  title: string;
  type: SubTaskType;
  content: string;
  provider: AIProvider;
  model: string;
  tokensUsed?: number;
  durationMs: number;
  error?: string;
}

export interface OrchestrationResult {
  finalResponse: string;
  subTasks: SubTaskResult[];
  totalDurationMs: number;
  providersUsed: AIProvider[];
  totalTokens: number;
  decompositionMethod: 'auto' | 'manual';
}

export interface OrchestrationOptions {
  /** System context prepended to all sub-task prompts */
  systemContext?: string;
  /** Max sub-tasks to decompose into (default: 6) */
  maxSubTasks?: number;
  /** Skip decomposition — provide pre-defined sub-tasks */
  manualSubTasks?: SubTask[];
  /** Temperature for final synthesis (default: 0.6) */
  synthesisTemperature?: number;
  /** Whether to include per-task metadata in final response */
  includeMetadata?: boolean;
  /** Max tokens for sub-task responses */
  subTaskMaxTokens?: number;
  /** Max tokens for final synthesis */
  synthesisMaxTokens?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider specialization mapping
// Maps sub-task types to preferred providers (in priority order)
// ─────────────────────────────────────────────────────────────────────────────

const PROVIDER_SPECIALIZATIONS: Record<SubTaskType, AIProvider[]> = {
  analysis:    ['gemini', 'ollama', 'groq', 'cerebras'],
  creative:    ['ollama', 'groq', 'together', 'openrouter'],
  extraction:  ['cerebras', 'groq', 'ollama', 'aiml'],
  planning:    ['ollama', 'gemini', 'groq', 'together'],
  research:    ['gemini', 'groq', 'openrouter', 'together'],
  emotional:   ['groq', 'ollama', 'together', 'openrouter'],
  technical:   ['cerebras', 'groq', 'ollama', 'gemini'],
  synthesis:   ['ollama', 'gemini', 'groq', 'together'],
};

const SUBTASK_TO_TASKTYPE: Record<SubTaskType, TaskType> = {
  analysis:   'analyze',
  creative:   'creative',
  extraction: 'quick',
  planning:   'analyze',
  research:   'coaching',
  emotional:  'coaching',
  technical:  'analyze',
  synthesis:  'synthesize',
};

// ─────────────────────────────────────────────────────────────────────────────
// Step 1: DECOMPOSE — Break prompt into sub-tasks
// Uses a fast model to analyze the prompt and create a task graph
// ─────────────────────────────────────────────────────────────────────────────

interface DecompositionResult {
  subTasks: Array<{
    id: string;
    title: string;
    type: SubTaskType;
    prompt: string;
    dependsOn?: string[];
  }>;
  reasoning: string;
}

async function decomposePrompt(
  userPrompt: string,
  systemContext: string,
  maxSubTasks: number
): Promise<DecompositionResult> {
  const DECOMPOSITION_SYSTEM = `You are an AI task decomposition engine. Your job is to break a complex user request into smaller, focused sub-tasks that can be processed by specialized AI models in parallel.

RULES:
1. Each sub-task should be self-contained with enough context to be processed independently
2. Maximum ${maxSubTasks} sub-tasks
3. Minimize dependencies between tasks — prefer parallel execution
4. Each sub-task type maps to a specialized AI:
   - "analysis" — deep reasoning, pattern recognition, root cause analysis
   - "creative" — writing, brainstorming, generating ideas, storytelling
   - "extraction" — pulling out key data, summarizing, structuring info
   - "planning" — action plans, roadmaps, step-by-step strategies
   - "research" — knowledge retrieval, fact-checking, context gathering
   - "emotional" — empathetic responses, motivation, psychological coaching
   - "technical" — code, math, logic, algorithms, structured problems
   - "synthesis" — DO NOT use this type (reserved for final merge step)

5. Sub-task prompts should be detailed and include all needed context from the original request
6. Use "dependsOn" only when a task truly needs another's output first (rare)

Return ONLY a JSON object:
{
  "subTasks": [
    {
      "id": "task_1",
      "title": "Brief title",
      "type": "analysis|creative|extraction|planning|research|emotional|technical",
      "prompt": "Detailed prompt for this specific sub-task...",
      "dependsOn": []
    }
  ],
  "reasoning": "Brief explanation of why you decomposed it this way"
}`;

  const messages: AIMessage[] = [
    { role: 'system', content: DECOMPOSITION_SYSTEM },
    { role: 'user', content: `${systemContext ? `Context: ${systemContext}\n\n` : ''}User Request:\n${userPrompt}` },
  ];

  try {
    const { data } = await callAIJson<DecompositionResult>(messages, {
      taskType: 'quick',
      maxTokens: 1024,
      temperature: 0.3, // Low temp for precise decomposition
    });

    // Validate and sanitize
    if (!data.subTasks || !Array.isArray(data.subTasks) || data.subTasks.length === 0) {
      throw new Error('Decomposition returned no sub-tasks');
    }

    // Ensure valid types
    const validTypes: SubTaskType[] = ['analysis', 'creative', 'extraction', 'planning', 'research', 'emotional', 'technical'];
    data.subTasks = data.subTasks
      .slice(0, maxSubTasks)
      .map((t, i) => ({
        ...t,
        id: t.id || `task_${i + 1}`,
        type: validTypes.includes(t.type) ? t.type : 'analysis',
        dependsOn: t.dependsOn?.filter((d) => data.subTasks.some((s) => s.id === d)) ?? [],
      }));

    return data;
  } catch (err) {
    console.warn('[Orchestrator] Decomposition failed, creating single-task fallback:', err);
    return {
      subTasks: [{
        id: 'task_1',
        title: 'Process request',
        type: 'analysis',
        prompt: userPrompt,
      }],
      reasoning: 'Decomposition failed — processing as single task',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2: CLASSIFY — Assign each sub-task to the best available provider
// ─────────────────────────────────────────────────────────────────────────────

async function assignProviders(subTasks: SubTask[]): Promise<SubTask[]> {
  const available = await getAvailableProviders();
  const providerLoad = new Map<AIProvider, number>(); // Track load balancing

  return subTasks.map((task) => {
    if (task.provider && available.includes(task.provider)) {
      providerLoad.set(task.provider, (providerLoad.get(task.provider) ?? 0) + 1);
      return task;
    }

    // Get preferred providers for this task type
    const preferred = PROVIDER_SPECIALIZATIONS[task.type] ?? [];
    const candidates = preferred.filter((p) => available.includes(p));

    // Pick the least-loaded candidate (load balancing across parallel tasks)
    let best: AIProvider | null = null;
    let minLoad = Infinity;

    for (const p of candidates) {
      const load = providerLoad.get(p) ?? 0;
      if (load < minLoad) {
        minLoad = load;
        best = p;
      }
    }

    // Fallback to any available provider
    if (!best) {
      for (const p of available) {
        const load = providerLoad.get(p) ?? 0;
        if (load < minLoad) {
          minLoad = load;
          best = p;
        }
      }
    }

    const assigned = best ?? available[0] ?? 'groq';
    providerLoad.set(assigned, (providerLoad.get(assigned) ?? 0) + 1);
    return { ...task, provider: assigned };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 3: EXECUTE — Run sub-tasks (parallel where possible, sequential for deps)
// ─────────────────────────────────────────────────────────────────────────────

async function executeSubTask(
  task: SubTask,
  systemContext: string,
  completedResults: Map<string, SubTaskResult>,
  maxTokens: number
): Promise<SubTaskResult> {
  const start = Date.now();

  // Build context from dependencies
  let contextFromDeps = '';
  if (task.dependsOn?.length) {
    contextFromDeps = '\n\n--- Context from previous analysis ---\n';
    for (const depId of task.dependsOn) {
      const dep = completedResults.get(depId);
      if (dep) {
        contextFromDeps += `\n[${dep.title}]:\n${dep.content}\n`;
      }
    }
  }

  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `${systemContext ? systemContext + '\n\n' : ''}You are a specialized AI handling a "${task.type}" sub-task. Be thorough, specific, and actionable. Focus ONLY on this specific aspect: "${task.title}".`,
    },
    {
      role: 'user',
      content: `${task.prompt}${contextFromDeps}`,
    },
  ];

  const taskType = SUBTASK_TO_TASKTYPE[task.type];

  try {
    const result = task.provider
      ? await callAIWithProvider(task.provider, messages, { taskType, maxTokens, temperature: 0.7 })
      : await callAI(messages, { taskType, maxTokens, temperature: 0.7 });

    return {
      id: task.id,
      title: task.title,
      type: task.type,
      content: result.content,
      provider: result.provider,
      model: result.model,
      tokensUsed: result.tokensUsed,
      durationMs: Date.now() - start,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[Orchestrator] Sub-task "${task.title}" failed:`, errorMsg);
    return {
      id: task.id,
      title: task.title,
      type: task.type,
      content: `[Error: This sub-task could not be processed. ${errorMsg}]`,
      provider: task.provider ?? 'groq',
      model: 'error',
      durationMs: Date.now() - start,
      error: errorMsg,
    };
  }
}

async function executeAllSubTasks(
  subTasks: SubTask[],
  systemContext: string,
  maxTokens: number
): Promise<SubTaskResult[]> {
  const completedResults = new Map<string, SubTaskResult>();
  const allResults: SubTaskResult[] = [];

  // Separate tasks into dependency layers
  const executed = new Set<string>();
  let remaining = [...subTasks];

  while (remaining.length > 0) {
    // Find tasks whose dependencies are all satisfied
    const ready = remaining.filter(
      (t) => !t.dependsOn?.length || t.dependsOn.every((dep) => executed.has(dep))
    );

    if (ready.length === 0) {
      // Circular dependency protection — just execute everything remaining
      console.warn('[Orchestrator] Circular dependency detected, executing remaining tasks');
      const results = await Promise.all(
        remaining.map((t) => executeSubTask(t, systemContext, completedResults, maxTokens))
      );
      allResults.push(...results);
      break;
    }

    // Execute ready tasks in parallel
    const results = await Promise.all(
      ready.map((t) => executeSubTask(t, systemContext, completedResults, maxTokens))
    );

    // Record results
    for (const r of results) {
      completedResults.set(r.id, r);
      executed.add(r.id);
      allResults.push(r);
    }

    remaining = remaining.filter((t) => !executed.has(t.id));
  }

  return allResults;
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 4: SYNTHESIZE — Merge all sub-task results into one coherent response
// ─────────────────────────────────────────────────────────────────────────────

async function synthesizeResults(
  originalPrompt: string,
  systemContext: string,
  subTaskResults: SubTaskResult[],
  temperature: number,
  maxTokens: number
): Promise<AIResponse> {
  const subTaskSummaries = subTaskResults
    .filter((r) => !r.error)
    .map((r) => `══ ${r.title} (${r.type}) ══\n${r.content}`)
    .join('\n\n');

  const errorSummaries = subTaskResults
    .filter((r) => r.error)
    .map((r) => `[FAILED: ${r.title} — ${r.error}]`);

  const SYNTHESIS_SYSTEM = `You are an expert AI synthesizer. Multiple specialized AI models have each processed a different aspect of a complex request. Your job is to:

1. Merge all sub-task results into ONE coherent, well-structured response
2. Resolve any contradictions between sub-tasks (prefer the more detailed/nuanced answer)
3. Ensure smooth transitions between different sections
4. Remove redundancy — don't repeat the same point from different analyses
5. Maintain a consistent voice and tone throughout
6. Structure with clear headers/sections if the response is long
7. Add a brief executive summary at the top if the response exceeds 500 words

${systemContext ? `Context: ${systemContext}\n` : ''}
${errorSummaries.length ? `Note: ${errorSummaries.length} sub-task(s) failed: ${errorSummaries.join('; ')}. Work with available results.\n` : ''}

Produce a polished, comprehensive final response that feels like it came from a single, brilliant mind — not a committee.`;

  const messages: AIMessage[] = [
    { role: 'system', content: SYNTHESIS_SYSTEM },
    {
      role: 'user',
      content: `ORIGINAL REQUEST:\n${originalPrompt}\n\n━━━ SUB-TASK RESULTS ━━━\n\n${subTaskSummaries}`,
    },
  ];

  // Use the most capable available provider for synthesis
  return callAI(messages, {
    taskType: 'synthesize',
    maxTokens,
    temperature,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ENTRY — orchestrate()
// The full pipeline: decompose → classify → execute → synthesize
// ─────────────────────────────────────────────────────────────────────────────

export async function orchestrate(
  userPrompt: string,
  options: OrchestrationOptions = {}
): Promise<OrchestrationResult> {
  const startTime = Date.now();
  const {
    systemContext = '',
    maxSubTasks = 6,
    manualSubTasks,
    synthesisTemperature = 0.6,
    subTaskMaxTokens = 1024,
    synthesisMaxTokens = 2048,
  } = options;

  console.log(`[Orchestrator] Starting orchestration for prompt (${userPrompt.length} chars)`);

  // ── Step 1: Decompose (or use manual sub-tasks) ──
  let subTasks: SubTask[];
  let decompositionMethod: 'auto' | 'manual';

  if (manualSubTasks && manualSubTasks.length > 0) {
    subTasks = manualSubTasks;
    decompositionMethod = 'manual';
    console.log(`[Orchestrator] Using ${subTasks.length} manual sub-tasks`);
  } else {
    const decomposition = await decomposePrompt(userPrompt, systemContext, maxSubTasks);
    subTasks = decomposition.subTasks;
    decompositionMethod = 'auto';
    console.log(`[Orchestrator] Decomposed into ${subTasks.length} sub-tasks: ${decomposition.reasoning}`);
  }

  // ── Step 2: Assign providers ──
  subTasks = await assignProviders(subTasks);
  console.log(
    `[Orchestrator] Provider assignments:`,
    subTasks.map((t) => `${t.title} → ${t.provider}`).join(', ')
  );

  // ── Step 3: Execute in parallel ──
  const subTaskResults = await executeAllSubTasks(subTasks, systemContext, subTaskMaxTokens);

  const successCount = subTaskResults.filter((r) => !r.error).length;
  console.log(`[Orchestrator] Executed ${successCount}/${subTaskResults.length} sub-tasks successfully`);

  // ── Step 4: Synthesize ──
  let finalResponse: string;

  if (subTaskResults.length === 1 && !subTaskResults[0].error) {
    // Single task — no synthesis needed
    finalResponse = subTaskResults[0].content;
  } else {
    const synthResult = await synthesizeResults(
      userPrompt,
      systemContext,
      subTaskResults,
      synthesisTemperature,
      synthesisMaxTokens
    );
    finalResponse = synthResult.content;
  }

  // ── Build result ──
  const providersUsed = Array.from(new Set(subTaskResults.map((r) => r.provider)));
  const totalTokens = subTaskResults.reduce((sum, r) => sum + (r.tokensUsed ?? 0), 0);

  const result: OrchestrationResult = {
    finalResponse,
    subTasks: subTaskResults,
    totalDurationMs: Date.now() - startTime,
    providersUsed,
    totalTokens,
    decompositionMethod,
  };

  console.log(
    `[Orchestrator] Complete in ${result.totalDurationMs}ms | ` +
    `${providersUsed.length} providers | ${totalTokens} tokens | ` +
    `${subTaskResults.length} sub-tasks`
  );

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// QUICK ORCHESTRATION — For simpler cases with predefined decomposition patterns
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pre-built orchestration patterns for common Resurgo use cases
 */
export const ORCHESTRATION_PATTERNS = {
  /**
   * Life coaching — decompose into analysis + emotional + planning
   */
  lifeCoaching: (userMessage: string, userContext: string): SubTask[] => [
    {
      id: 'analyze',
      title: 'Behavioral Analysis',
      type: 'analysis',
      prompt: `Analyze this person's situation from a behavioral psychology perspective. Identify patterns, root causes, and cognitive biases at play.\n\nUser context: ${userContext}\n\nTheir message: ${userMessage}`,
    },
    {
      id: 'emotional',
      title: 'Emotional Response',
      type: 'emotional',
      prompt: `Craft an empathetic, motivational response to this person. Acknowledge their feelings, validate their experience, and provide emotional support.\n\nUser context: ${userContext}\n\nTheir message: ${userMessage}`,
    },
    {
      id: 'plan',
      title: 'Action Plan',
      type: 'planning',
      prompt: `Create a concrete, actionable plan with specific next steps this person can take TODAY. Include timing, difficulty rating, and expected outcomes.\n\nUser context: ${userContext}\n\nTheir message: ${userMessage}`,
      dependsOn: ['analyze'],
    },
  ],

  /**
   * Goal decomposition — extract + plan + creative
   */
  goalBreakdown: (goalDescription: string, userContext: string): SubTask[] => [
    {
      id: 'extract',
      title: 'Goal Extraction',
      type: 'extraction',
      prompt: `Parse this goal into structured components: primary objective, measurable targets, timeframe, obstacles, required resources.\n\nGoal: ${goalDescription}\nUser context: ${userContext}`,
    },
    {
      id: 'milestones',
      title: 'Milestone Planning',
      type: 'planning',
      prompt: `Create a milestone roadmap with weekly/monthly checkpoints for this goal. Each milestone should be SMART (Specific, Measurable, Achievable, Relevant, Time-bound).\n\nGoal: ${goalDescription}\nUser context: ${userContext}`,
      dependsOn: ['extract'],
    },
    {
      id: 'motivation',
      title: 'Motivation Strategy',
      type: 'creative',
      prompt: `Design creative motivation strategies and habit stacks specifically for this goal. Include gamification ideas, accountability structures, and reward systems.\n\nGoal: ${goalDescription}\nUser context: ${userContext}`,
    },
  ],

  /**
   * Weekly review — analysis + extraction + planning + emotional
   */
  weeklyReview: (weekData: string, userProfile: string): SubTask[] => [
    {
      id: 'data_analysis',
      title: 'Performance Analysis',
      type: 'extraction',
      prompt: `Extract key performance metrics from this week's data: completion rates, streaks, best/worst days, patterns. Present as structured insights.\n\nWeek data: ${weekData}`,
    },
    {
      id: 'pattern_analysis',
      title: 'Pattern Recognition',
      type: 'analysis',
      prompt: `Identify behavioral patterns, trends, and anomalies in this week. Compare against the user's goals and historical tendencies.\n\nWeek data: ${weekData}\nUser profile: ${userProfile}`,
    },
    {
      id: 'celebration',
      title: 'Wins & Recognition',
      type: 'emotional',
      prompt: `Identify and celebrate this week's wins (even small ones). Craft encouraging messages that acknowledge effort, not just results.\n\nWeek data: ${weekData}\nUser profile: ${userProfile}`,
    },
    {
      id: 'next_week',
      title: 'Next Week Strategy',
      type: 'planning',
      prompt: `Based on patterns identified, create an optimized plan for next week. Adjust difficulty, timing, and focus areas. Include 1-3 specific experiments to try.\n\nWeek data: ${weekData}\nUser profile: ${userProfile}`,
      dependsOn: ['data_analysis', 'pattern_analysis'],
    },
  ],

  /**
   * Deep scan diagnosis — analysis + emotional + planning + creative
   */
  deepScanDiagnosis: (scanData: string): SubTask[] => [
    {
      id: 'psych_analysis',
      title: 'Psychological Profile',
      type: 'analysis',
      prompt: `Analyze this Deep Scan data to build a psychological profile. Identify: archetype, core motivations, sabotage patterns, stress response, decision-making style. Be specific — reference their actual data.\n\nScan data: ${scanData}`,
    },
    {
      id: 'strengths',
      title: 'Strength Mapping',
      type: 'extraction',
      prompt: `Identify this person's hidden strengths and advantages from their scan data. What do they have going for them that they might not realize?\n\nScan data: ${scanData}`,
    },
    {
      id: 'plan',
      title: 'Personalized Protocol',
      type: 'planning',
      prompt: `Design a personalized 90-day protocol for this person. Include: daily routine suggestions, habit stack, weekly milestones, difficulty curve (start easy, scale up), check-in schedule.\n\nScan data: ${scanData}`,
      dependsOn: ['psych_analysis'],
    },
    {
      id: 'greeting',
      title: 'First Contact Message',
      type: 'creative',
      prompt: `Write a powerful, personalized "welcome" message for this person. It should: 1) Show you deeply understand their specific situation 2) Include one uncomfortable truth they need to hear 3) End with genuine hope and excitement for what's ahead. Use their name if available. Max 200 words.\n\nScan data: ${scanData}`,
      dependsOn: ['psych_analysis', 'strengths'],
    },
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Convenience: orchestrateWithPattern()
// ─────────────────────────────────────────────────────────────────────────────

export async function orchestrateWithPattern(
  patternName: keyof typeof ORCHESTRATION_PATTERNS,
  args: string[],
  options: Omit<OrchestrationOptions, 'manualSubTasks'> = {}
): Promise<OrchestrationResult> {
  const pattern = ORCHESTRATION_PATTERNS[patternName];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subTasks = (pattern as (...a: string[]) => SubTask[])(...args);

  return orchestrate(args[0], {
    ...options,
    manualSubTasks: subTasks,
  });
}
