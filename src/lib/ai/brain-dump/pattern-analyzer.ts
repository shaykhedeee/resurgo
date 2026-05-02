// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Brain Dump Pattern Analyzer
// Detects meta-patterns, emotional trajectories, and cognitive load across brain dumps
// ═══════════════════════════════════════════════════════════════════════════════

import { BrainDumpResponse } from './schema';

// ─────────────────────────────────────────────────────────────────────────────
// PATTERN DETECTION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface BrainDumpPattern {
  type: 'time-of-day' | 'stress-cycle' | 'recurring-theme' | 'commitment-spiral' | 'energy-crash' | 'decision-paralysis' | 'perfectionism' | 'people-pleasing';
  confidence: number; // 0-1
  description: string;
  evidence: string[];
  suggestions: string[];
}

export interface EmotionalTrajectory {
  emotions: Array<{
    emotion: string;
    intensity: number; // 1-10
    context?: string;
  }>;
  dominantEmotion: string;
  emotionalShift: 'escalating' | 'oscillating' | 'stable' | 'improving' | 'deteriorating';
  urgencySignal: number; // 1-10
  needsSupport: boolean;
}

export interface CognitiveLoad {
  taskComplexity: number; // 1-10
  dependencyDensity: number; // 0-1: how interconnected tasks are
  contextSwitchingRisk: number; // 1-10
  decisionPoints: number; // Count of explicit decisions needed
  estimatedMentalLoad: number; // 1-100
  suggestedReductions: string[];
  prioritizationStrategy: 'sequential' | 'parallel' | 'quick-wins-first' | 'energy-based';
}

export interface EnhancedBrainDumpAnalysis {
  originalResponse: BrainDumpResponse;
  patterns: BrainDumpPattern[];
  emotionalTrajectory: EmotionalTrajectory;
  cognitiveLoad: CognitiveLoad;
  deepInsights: string[];
  recommendedApproach: string;
  warningFlags: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// PATTERN DETECTOR
// ─────────────────────────────────────────────────────────────────────────────

export function detectPatterns(response: BrainDumpResponse, rawText: string): BrainDumpPattern[] {
  const patterns: BrainDumpPattern[] = [];
  const lowerText = rawText.toLowerCase();
  
  // Pattern 1: Time-of-day stress
  const timeIndicators = ['morning', 'night', '3am', 'early', 'late', 'can\'t sleep', 'exhausted', 'tired'];
  const timeMatches = timeIndicators.filter(t => lowerText.includes(t));
  if (timeMatches.length >= 2) {
    patterns.push({
      type: 'time-of-day',
      confidence: Math.min(0.95, 0.5 + (timeMatches.length * 0.15)),
      description: 'Clear time-of-day stress pattern detected',
      evidence: timeMatches.map(t => `Mentioned: "${t}"`),
      suggestions: [
        'Try adjusting sleep schedule by 30 minutes earlier',
        'Build a wind-down routine 1 hour before bed',
        'Consider blocking focus time during your peak stress hours'
      ],
    });
  }

  // Pattern 2: Commitment spiral (too many commitments, can't say no)
  if (response.tasks.length >= 15 && response.overcommitment_warning) {
    const highPriority = response.tasks.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').length;
    patterns.push({
      type: 'commitment-spiral',
      confidence: Math.min(0.9, 0.4 + (highPriority / response.tasks.length) * 0.5),
      description: 'Pattern of overcommitment with difficulty prioritizing',
      evidence: [
        `${response.tasks.length} total tasks extracted`,
        `${highPriority} marked as HIGH/CRITICAL priority`,
        'Overcommitment warning triggered'
      ],
      suggestions: [
        'Practice saying "not now" to new commitments this week',
        'Defer at least 3 tasks from your HIGH priority list',
        'Set a weekly capacity limit: max 25 hours of committed tasks'
      ],
    });
  }

  // Pattern 3: Recurring theme (same topics appearing multiple times)
  const taskTitles = response.tasks.map(t => t.title.toLowerCase());
  const categoryCount = new Map<string, number>();
  response.tasks.forEach(t => {
    categoryCount.set(t.category, (categoryCount.get(t.category) || 0) + 1);
  });
  
  let dominantCategory = '';
  let dominantCount = 0;
  categoryCount.forEach((count, category) => {
    if (count > dominantCount) {
      dominantCount = count;
      dominantCategory = category;
    }
  });
  
  if (dominantCount >= 4) {
    patterns.push({
      type: 'recurring-theme',
      confidence: Math.min(0.95, 0.6 + (dominantCount * 0.08)),
      description: `Strong focus on ${dominantCategory.toLowerCase()} indicates priority area`,
      evidence: [
        `${dominantCount} of ${response.tasks.length} tasks are ${dominantCategory}`,
        `${((dominantCount / response.tasks.length) * 100).toFixed(0)}% of brain dump devoted to this area`
      ],
      suggestions: [
        `Create a dedicated project for ${dominantCategory}-related work`,
        'Schedule a focused "work block" specifically for this area',
        'Consider if this is temporary overwhelm or a sustained priority shift'
      ],
    });
  }

  // Pattern 4: Energy crash risk
  const lowEnergyTasks = response.tasks.filter(t => t.energy_level === 'low').length;
  const totalTasks = response.tasks.length;
  if (lowEnergyTasks / totalTasks > 0.6) {
    patterns.push({
      type: 'energy-crash',
      confidence: 0.75,
      description: 'Task list is heavily weighted toward low-energy activities',
      evidence: [
        `${lowEnergyTasks} of ${totalTasks} tasks require low energy`,
        'Risk of tasks feeling tedious and momentum loss'
      ],
      suggestions: [
        'Mix in 1-2 high-energy tasks between low-energy blocks',
        'Consider energy-based scheduling rather than priority-based',
        'Batch admin/low-energy work into a single block'
      ],
    });
  }

  // Pattern 5: Decision paralysis (too many open-ended tasks)
  const vagueTasks = response.tasks.filter(t => 
    !t.suggested_due && (!t.estimated_minutes || t.estimated_minutes > 120) && t.priority !== 'CRITICAL'
  ).length;
  if (vagueTasks / totalTasks > 0.4) {
    patterns.push({
      type: 'decision-paralysis',
      confidence: 0.7,
      description: 'Many tasks lack clear scope or deadline',
      evidence: [
        `${vagueTasks} vague/open-ended tasks identified`,
        'Risk of decision fatigue and procrastination'
      ],
      suggestions: [
        'Convert 3 vague tasks into time-boxed experiments (90 min max)',
        'Add explicit deadlines to all remaining open tasks',
        'Use the "2-minute rule": if it takes <2 min, do it now'
      ],
    });
  }

  // Pattern 6: Perfectionism (very high standards expressed)
  const perfectionKeywords = ['perfect', 'flawless', 'should', 'must', 'always', 'never', 'absolutely'];
  const perfectionCount = perfectionKeywords.filter(k => lowerText.includes(k)).length;
  if (perfectionCount >= 3) {
    patterns.push({
      type: 'perfectionism',
      confidence: Math.min(0.85, 0.5 + (perfectionCount * 0.1)),
      description: 'Language patterns suggest perfectionist tendencies',
      evidence: [
        `${perfectionCount} perfectionist language triggers detected`,
        'May be setting unrealistic expectations'
      ],
      suggestions: [
        'For each HIGH priority task, define "good enough" version first',
        'Set a 30-minute timer for at least one task this week',
        'Track completion rate vs. perfection rate — aim for 80/20'
      ],
    });
  }

  // Pattern 7: People-pleasing (yes to everything, difficulty saying no)
  const peopleKeywords = ['agree', 'help', 'support', 'for them', 'for others', 'meeting', 'request'];
  const peopleCount = peopleKeywords.filter(k => lowerText.includes(k)).length;
  if (peopleCount >= 3 && response.tasks.length >= 10) {
    patterns.push({
      type: 'people-pleasing',
      confidence: Math.min(0.8, 0.4 + (peopleCount * 0.1)),
      description: 'Multiple commitments for others suggest people-pleasing pattern',
      evidence: [
        `${peopleCount} people-focused language triggers`,
        `${response.tasks.length} total tasks (many for others)`
      ],
      suggestions: [
        'Identify 2 tasks you can defer/decline without guilt',
        'Schedule 2-3 hours this week as "protected focus time"',
        'Practice the "I need to check my calendar" response'
      ],
    });
  }

  return patterns.sort((a, b) => b.confidence - a.confidence);
}

// ─────────────────────────────────────────────────────────────────────────────
// EMOTIONAL TRAJECTORY ANALYZER
// ─────────────────────────────────────────────────────────────────────────────

export function analyzeEmotionalTrajectory(response: BrainDumpResponse): EmotionalTrajectory {
  const emotionIntensityMap: Record<string, number> = {
    'overwhelmed': 9,
    'anxious': 8,
    'stressed': 8,
    'frustrated': 7,
    'tired': 6,
    'confused': 7,
    'motivated': 3,
    'calm': 2,
    'excited': 2,
    'determined': 3,
    'hopeful': 2,
    'depressed': 9,
    'angry': 8,
    'lost': 7,
    'uncertain': 6,
  };

  const emotions = response.emotions_detected.map(emotion => ({
    emotion,
    intensity: emotionIntensityMap[emotion.toLowerCase()] || 5,
    context: response.emotional_acknowledgment,
  }));

  const avgIntensity = emotions.reduce((sum, e) => sum + e.intensity, 0) / Math.max(1, emotions.length);
  const dominantEmotion = emotions.sort((a, b) => b.intensity - a.intensity)[0]?.emotion || 'neutral';

  // Determine emotional shift pattern
  let emotionalShift: 'escalating' | 'oscillating' | 'stable' | 'improving' | 'deteriorating' = 'stable';
  
  if (response.tasks.filter(t => t.priority === 'CRITICAL').length >= 5) {
    emotionalShift = 'escalating'; // Many critical tasks = escalating stress
  } else if (response.quick_win && response.habits_suggested.length > 2) {
    emotionalShift = 'improving'; // Good forward momentum
  } else if (avgIntensity > 7) {
    emotionalShift = 'deteriorating';
  }

  const urgencySignal = Math.min(10, Math.ceil(avgIntensity));
  const needsSupport = avgIntensity >= 7 || dominantEmotion.toLowerCase().includes('overwhelm') || dominantEmotion.toLowerCase().includes('depressed');

  return {
    emotions,
    dominantEmotion,
    emotionalShift,
    urgencySignal,
    needsSupport,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COGNITIVE LOAD CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────

export function calculateCognitiveLoad(response: BrainDumpResponse): CognitiveLoad {
  const tasks = response.tasks;
  
  // Task complexity: based on estimated minutes and dependencies
  const avgMinutes = tasks.reduce((sum, t) => sum + (t.estimated_minutes || 60), 0) / tasks.length;
  const taskComplexity = Math.min(10, Math.ceil((tasks.length + avgMinutes / 60) / 3));

  // Dependency density: how many tasks have dependencies
  const tasksWithDeps = tasks.filter(t => t.depends_on).length;
  const dependencyDensity = tasksWithDeps / Math.max(1, tasks.length);

  // Context switching risk: number of different categories
  const categories = new Set(tasks.map(t => t.category));
  const contextSwitchingRisk = Math.min(10, categories.size + (tasks.length > 15 ? 2 : 0));

  // Decision points: tasks without dependencies/due dates
  const decisionPoints = tasks.filter(t => !t.depends_on && !t.suggested_due).length;

  // Estimated mental load (1-100)
  const estimatedMentalLoad = Math.min(100, Math.ceil(
    (taskComplexity * 8) + 
    (dependencyDensity * 20) + 
    (contextSwitchingRisk * 3) + 
    (decisionPoints * 2)
  ));

  // Suggested reductions
  const suggestedReductions: string[] = [];
  if (tasks.length > 20) suggestedReductions.push('Defer 5+ non-critical tasks to next week');
  if (dependencyDensity > 0.4) suggestedReductions.push('Simplify task dependencies — break large blockers into smaller parallel tasks');
  if (contextSwitchingRisk > 7) suggestedReductions.push(`Consolidate into max 5 projects instead of ${categories.size}`);
  if (decisionPoints > 8) suggestedReductions.push('Convert vague tasks into specific time-boxed experiments');
  if (avgMinutes > 120) suggestedReductions.push('Break tasks > 2 hours into 45-minute focused blocks');

  // Prioritization strategy
  let prioritizationStrategy: 'sequential' | 'parallel' | 'quick-wins-first' | 'energy-based' = 'sequential';
  
  if (dependencyDensity > 0.5) {
    prioritizationStrategy = 'sequential'; // Heavy dependencies require sequential approach
  } else if (categories.size <= 3 && taskComplexity <= 4) {
    prioritizationStrategy = 'parallel'; // Low complexity = can do multiple at once
  } else if (response.quick_win) {
    prioritizationStrategy = 'quick-wins-first'; // Start with momentum
  } else {
    prioritizationStrategy = 'energy-based'; // Mix high/low energy work
  }

  return {
    taskComplexity,
    dependencyDensity,
    contextSwitchingRisk,
    decisionPoints,
    estimatedMentalLoad,
    suggestedReductions,
    prioritizationStrategy,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ENHANCEMENT ANALYZER
// ─────────────────────────────────────────────────────────────────────────────

export function enhanceBrainDumpAnalysis(
  response: BrainDumpResponse,
  rawText: string
): EnhancedBrainDumpAnalysis {
  const patterns = detectPatterns(response, rawText);
  const emotionalTrajectory = analyzeEmotionalTrajectory(response);
  const cognitiveLoad = calculateCognitiveLoad(response);

  // Generate deep insights
  const deepInsights: string[] = [];

  if (patterns.length > 0) {
    deepInsights.push(`Pattern analysis reveals: ${patterns.map(p => p.type).join(', ')}`);
  }

  if (emotionalTrajectory.needsSupport) {
    deepInsights.push(`Current emotional state (${emotionalTrajectory.dominantEmotion}) suggests prioritizing rest and support`);
  }

  if (cognitiveLoad.estimatedMentalLoad > 75) {
    deepInsights.push('Mental load is at critical levels — focus on ruthless prioritization');
  }

  if (response.neural_map?.root_priority) {
    deepInsights.push(`Root priority identified: "${response.neural_map.root_priority}" — everything else depends on this`);
  }

  // Recommended approach
  let recommendedApproach = '';
  switch (cognitiveLoad.prioritizationStrategy) {
    case 'sequential':
      recommendedApproach = `Use sequential approach: Execute tasks in dependency order. Start with "${response.neural_map?.root_priority || 'highest priority'}" first.`;
      break;
    case 'parallel':
      recommendedApproach = `Tasks are mostly independent. Batch by context/energy level and execute 2-3 in parallel.`;
      break;
    case 'quick-wins-first':
      recommendedApproach = `Start with quick wins: "${response.quick_win}". Build momentum before tackling complex tasks.`;
      break;
    case 'energy-based':
      recommendedApproach = `Schedule high-energy tasks during peak energy hours, low-energy tasks during dips.`;
      break;
  }

  // Warning flags
  const warningFlags: string[] = [];
  if (emotionalTrajectory.urgencySignal >= 8) warningFlags.push('⚠️ High emotional urgency detected — pace yourself');
  if (cognitiveLoad.estimatedMentalLoad > 80) warningFlags.push('⚠️ Critical cognitive overload — delegate or defer');
  if (response.overcommitment_warning) warningFlags.push('⚠️ Overcommitment risk — say "no" to new asks this week');
  if (response.tasks.filter(t => t.priority === 'CRITICAL').length > 5) warningFlags.push('⚠️ Too many critical items — reassess priorities');

  return {
    originalResponse: response,
    patterns,
    emotionalTrajectory,
    cognitiveLoad,
    deepInsights,
    recommendedApproach,
    warningFlags,
  };
}
