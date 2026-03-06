import { PsychologicalProfile } from './profile-schema';

/**
 * Converts a 1–10 Big Five score into a human-readable description.
 */
function _traitLevel(score: number): 'very low' | 'low' | 'moderate' | 'high' | 'very high' {
  if (score <= 2) return 'very low';
  if (score <= 4) return 'low';
  if (score <= 6) return 'moderate';
  if (score <= 8) return 'high';
  return 'very high';
}

const DISTORTION_REFRAMES: Record<string, string> = {
  all_or_nothing: 'Watch for black-and-white language. Gently introduce nuance (e.g., "Is there a middle ground?").',
  overgeneralisation: 'Notice words like "always" and "never". Ask for specific instances.',
  mental_filter: 'Help the user notice wins, not just failures.',
  disqualifying_positive: 'Acknowledge achievements before discussing growth areas.',
  catastrophising: 'Ground the user with evidence-based thinking ("What is the most likely outcome?").',
  should_statements: 'Replace "should" language with preference-based alternatives.',
  emotional_reasoning: 'Separate feelings from facts ("Just because it feels awful doesn\'t mean it is.").',
  labelling: 'Challenge self-labels ("You made a mistake, but that doesn\'t make you a failure").',
  mind_reading: 'Question assumptions about others\' thoughts.',
  fortune_telling: 'Explore uncertainty and possibility rather than predicted doom.',
};

// ─────────────────────────────────────────────────────────────────────────────
// Build adaptive coaching instructions from a PsychologicalProfile.
// Returns "" if confidence is too low (< 20%) or safetyFlag is set.
// ─────────────────────────────────────────────────────────────────────────────
export function buildAdaptiveCoachingInstructions(
  profile: PsychologicalProfile | null
): string {
  if (!profile) return '';

  // Safety gate — never provide personalised coaching when crisis detected
  if (profile.safetyFlag) {
    return `SAFETY NOTE: This user may be in distress. Deprioritise goal-setting. Validate emotions first. 
Remind them that professional support is available. Do not apply any personality-based coaching adaptations.`;
  }

  // Not enough data yet
  if (profile.bigFive.confidence < 20) return '';

  const lines: string[] = ['ADAPTIVE COACHING PROFILE (apply these adjustments):'];

  // ── Big Five coaching adjustments ──────────────────────────────────────────
  const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = profile.bigFive;

  if (openness >= 7) {
    lines.push('- HIGH OPENNESS: Offer creative, unconventional strategies. This user enjoys exploring new ideas.');
  } else if (openness <= 3) {
    lines.push('- LOW OPENNESS: Stick to proven, familiar tactics. Avoid overwhelming with too many options.');
  }

  if (conscientiousness >= 7) {
    lines.push('- HIGH CONSCIENTIOUSNESS: Provide structured plans with clear milestones. This user thrives on systems.');
  } else if (conscientiousness <= 3) {
    lines.push('- LOW CONSCIENTIOUSNESS: Use very small, immediate next steps. Reduce friction. Celebrate micro-wins.');
  }

  if (extraversion >= 7) {
    lines.push('- HIGH EXTRAVERSION: Suggest accountability partners, social challenges, or public commitments.');
  } else if (extraversion <= 3) {
    lines.push('- LOW EXTRAVERSION: Respect solo pursuit. Avoid pushing group activities. Prefer quiet reflection prompts.');
  }

  if (agreeableness >= 7) {
    lines.push('- HIGH AGREEABLENESS: Acknowledge feelings before tasks. Be warm and collaborative in tone.');
  }

  if (neuroticism >= 7) {
    lines.push('- HIGH NEUROTICISM: Be especially calm and reassuring. Normalise setbacks. Avoid amplifying stress.');
  } else if (neuroticism <= 3) {
    lines.push('- LOW NEUROTICISM: Keep tone efficient and matter-of-fact. This user is emotionally stable and action-oriented.');
  }

  // ── CBT cognitive distortion reframes ─────────────────────────────────────
  const { dominantPattern } = profile.cognitive;
  if (dominantPattern && DISTORTION_REFRAMES[dominantPattern]) {
    lines.push(`- COGNITIVE PATTERN (${dominantPattern.replace(/_/g, ' ')}): ${DISTORTION_REFRAMES[dominantPattern]}`);
  }

  // ── SDT needs ─────────────────────────────────────────────────────────────
  const { autonomyNeed, competenceNeed, relatednessNeed, changeStage } = profile.motivational;

  if (autonomyNeed >= 7) {
    lines.push('- HIGH AUTONOMY NEED: Present options rather than directives. Ask "What feels right to you?"');
  }
  if (competenceNeed >= 7) {
    lines.push('- HIGH COMPETENCE NEED: Highlight skill-building aspects of tasks. Frame goals as mastery challenges.');
  }
  if (relatednessNeed >= 7) {
    lines.push('- HIGH RELATEDNESS NEED: Connect goals to meaningful relationships and impact on others.');
  }

  // ── Motivational stage ─────────────────────────────────────────────────────
  const stageGuidance: Record<string, string> = {
    precontemplation: 'User may not be ready to change. Plant seeds, don\'t push. Ask curious questions.',
    contemplation: 'User is weighing pros/cons. Help articulate the cost of staying the same.',
    preparation: 'User is planning. Help with specific, achievable first steps.',
    action: 'User is actively working. Provide encouragement and problem-solving support.',
    maintenance: 'User is sustaining change. Focus on identity consolidation and relapse prevention.',
  };
  if (stageGuidance[changeStage]) {
    lines.push(`- CHANGE STAGE (${changeStage}): ${stageGuidance[changeStage]}`);
  }

  // ── Behavioural adjustments ────────────────────────────────────────────────
  const { preferredTaskSize, preferredFeedbackStyle, procrastinationTendency, avoidanceBehaviours } = profile.behavioral;
  if (preferredTaskSize === 'micro') lines.push('- Suggest micro-tasks (5–15 min) by default.');
  if (preferredTaskSize === 'large') lines.push('- User can handle large, complex tasks without breaking them down.');
  if (procrastinationTendency >= 7) {
    lines.push('- HIGH PROCRASTINATION: Use "just the next 2 minutes" reframe. Focus on starting, not finishing.');
  }
  const feedbackMap: Record<string, string> = {
    direct: 'Be direct and concise.',
    gentle: 'Be warm and encouraging.',
    analytical: 'Back recommendations with logic and data.',
    celebratory: 'Express genuine enthusiasm for progress.',
  };
  if (feedbackMap[preferredFeedbackStyle]) {
    lines.push(`- FEEDBACK STYLE: ${feedbackMap[preferredFeedbackStyle]}`);
  }
  if (avoidanceBehaviours && avoidanceBehaviours.length > 0) {
    lines.push(`- KNOWN AVOIDANCE PATTERNS: ${avoidanceBehaviours.slice(0, 3).join(', ')}. Be aware when these appear and gently redirect.`);
  }

  // ── Resilience score ───────────────────────────────────────────────────────
  if (profile.resilience) {
    const { overall, stressRecovery, growthMindset, adaptability } = profile.resilience;
    if (overall <= 4) {
      lines.push(`- LOW RESILIENCE (${overall}/10): This user is fragile right now. Prioritise stabilisation over ambition. Break everything into tiny wins.`);
    } else if (overall >= 8) {
      lines.push(`- HIGH RESILIENCE (${overall}/10): User can handle challenge. Push growth edges. Use stretch goals.`);
    }
    if (stressRecovery <= 3) {
      lines.push('- LOW STRESS RECOVERY: Buffer before pushing new tasks. Validate the difficulty first.');
    }
    if (growthMindset >= 7) {
      lines.push(`- HIGH GROWTH MINDSET (${growthMindset}/10): Frame setbacks as learning data, not failures.`);
    }
    if (adaptability <= 3) {
      lines.push('- LOW ADAPTABILITY: Avoid sudden plan changes. When necessary, present changes as natural evolution of the plan.');
    }
  }

  // ── Emotional arc ──────────────────────────────────────────────────────────
  if (profile.emotionalArc) {
    const { sessionTrajectory, rollingMoodAvg, consecutiveNegative, emotionalVelocity } = profile.emotionalArc;
    if (sessionTrajectory === 'declining') {
      lines.push(`- DECLINING EMOTIONAL ARC (${consecutiveNegative} consecutive down sessions, avg mood ${rollingMoodAvg}/10): Prioritise emotional grounding before any task planning.`);
    } else if (sessionTrajectory === 'volatile') {
      lines.push(`- VOLATILE EMOTIONAL STATE (velocity: ${emotionalVelocity > 0 ? '+' : ''}${emotionalVelocity}): Provide extra stability. Avoid high-pressure decisions this session.`);
    } else if (sessionTrajectory === 'improving') {
      lines.push(`- IMPROVING ARC (rolling avg ${rollingMoodAvg}/10): Positive momentum. Good time to introduce stretch goals.`);
    }
    if (rollingMoodAvg <= 3) {
      lines.push('- CONSISTENTLY LOW MOOD: Lead with empathy. Do not jump to action planning.');
    }
  }

  // ── Trigger map ────────────────────────────────────────────────────────────
  if (profile.triggerMap) {
    const { stressTriggers, motivationTriggers, avoidanceTopics, peakPerformanceContext } = profile.triggerMap;
    if (stressTriggers.length > 0) {
      lines.push(`- STRESS TRIGGERS: ${stressTriggers.slice(0, 3).join(', ')}. Approach these areas with extra care.`);
    }
    if (motivationTriggers.length > 0) {
      lines.push(`- MOTIVATION TRIGGERS: ${motivationTriggers.slice(0, 3).join(', ')}. Reference these to unlock energy when user seems stuck.`);
    }
    if (avoidanceTopics.length > 0) {
      lines.push(`- AVOIDANCE TOPICS: ${avoidanceTopics.slice(0, 3).join(', ')}. These areas need gentle, indirect approaches.`);
    }
    if (peakPerformanceContext) {
      lines.push(`- PEAK PERFORMANCE CONTEXT: ${peakPerformanceContext}. Use this framing when the user needs a push.`);
    }
  }

  return lines.join('\n');
}
