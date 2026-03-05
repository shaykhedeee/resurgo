// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Vision Board Config Generator (Section 24 — Enhanced)
// Uses a two-stage AI pipeline to generate deeply personalised vision boards.
// Stage 1: Extract key themes and emotional anchors for each goal.
// Stage 2: Generate full board configuration with premium image prompts.
// ═══════════════════════════════════════════════════════════════════════════════

import { callAIJson, runAIPipeline } from '../provider-router';
import type { PsychologicalProfile } from '../psychology/profile-schema';
import type { UserArchetype } from '../onboarding/archetypes';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface VisionBoardTheme {
  colorPalette: string[];   // 5 hex colors
  mood: string;             // e.g. "warm-ambitious" | "calm-focused"
  fontStyle: 'serif-elegant' | 'sans-modern' | 'mono-tech';
  layoutStyle: 'grid' | 'collage' | 'minimal' | 'mosaic';
}

export interface VisionBoardPanel {
  id: string;
  goalTitle: string;
  imagePrompt: string;      // Stable Diffusion / Flux prompt
  imageKeywords: string[];  // Quick search keywords for fallback
  affirmation: string;
  category: string;
  progress: number;         // 0–100, filled in from goal tracking
  position: number;
  emotionalAnchor: string;  // Single evocative word (e.g. "freedom", "strength")
  milestoneHint: string;    // What achieving this goal looks like in 1 sentence
}

export interface VisionBoardConfig {
  userId: string;
  title: string;
  theme: VisionBoardTheme;
  panels: VisionBoardPanel[];
  centerAffirmation: string;
  generatedAt: string;
  version: number;
  archetype?: string;
  generationMethod?: 'pipeline' | 'direct';
}

// Minimal goal shape needed for generation
export interface GoalSummary {
  title: string;
  category: string;
  progress: number;
  description?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 1 PROMPT: Extract themes & emotional anchors
// ─────────────────────────────────────────────────────────────────────────────

function buildThemeExtractionPrompt(params: {
  userName: string;
  goals: GoalSummary[];
  archetype: UserArchetype | null;
  psychProfile: PsychologicalProfile | null;
}): string {
  const { userName, goals, archetype, psychProfile } = params;

  const archetypeHint = archetype
    ? `User archetype: ${archetype.replace('the_', '').toUpperCase()}`
    : 'Archetype: unknown (use balanced defaults)';

  const psychHint = psychProfile && psychProfile.bigFive.confidence >= 20
    ? `Personality: O=${psychProfile.bigFive.openness} C=${psychProfile.bigFive.conscientiousness} E=${psychProfile.bigFive.extraversion} A=${psychProfile.bigFive.agreeableness} N=${psychProfile.bigFive.neuroticism} (scale 1-10)`
    : 'Psychology: not yet profiled';

  return `You are an expert vision board psychologist helping ${userName}.

For each goal below, identify:
1. The CORE EMOTION the user wants to feel when they achieve it (1-2 words)
2. A SENSORY SCENE that represents achieving it (describe what they would see/feel)
3. The VISUAL METAPHOR that best represents this goal (nature, architecture, activity, etc.)

${archetypeHint}
${psychHint}

GOALS:
${goals.map((g, i) => `${i + 1}. [${g.category}] "${g.title}" (${g.progress}% complete)${g.description ? ` - ${g.description.slice(0, 100)}` : ''}`).join('\n')}

Respond with JSON only:
{
  "insights": [
    { "goalTitle": "exact title", "coreEmotion": "word", "sensoryScene": "2-3 sentence scene", "visualMetaphor": "word or phrase" }
  ]
}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 2 PROMPT: Generate full board config using theme insights
// ─────────────────────────────────────────────────────────────────────────────

function buildBoardConfigPrompt(params: {
  userName: string;
  goals: GoalSummary[];
  archetype: UserArchetype | null;
  psychProfile: PsychologicalProfile | null;
  themeInsights: string;
  todayDate: string;
  stylePreset?: string;
}): string {
  const { userName, goals, archetype, psychProfile, themeInsights, todayDate, stylePreset } = params;

  const archetypeHint = archetype
    ? `User archetype: ${archetype.replace('the_', '').toUpperCase()}`
    : 'Archetype: unknown';

  const psychHint = psychProfile && psychProfile.bigFive.confidence >= 20
    ? `Big Five: O=${psychProfile.bigFive.openness} C=${psychProfile.bigFive.conscientiousness} E=${psychProfile.bigFive.extraversion} A=${psychProfile.bigFive.agreeableness} N=${psychProfile.bigFive.neuroticism}`
    : '';

  const layoutRules = `
THEME RULES (apply based on personality):
- High neuroticism (>7) → calming blues/greens, minimal layout, max 4 panels
- High extraversion (>7) → warm oranges/yellows, collage layout
- High conscientiousness (>7) → grid or minimal layout, precise colors
- High openness (>7) → mosaic layout, creative color palette
- the_overwhelmed / the_rebuilder → minimal layout, max 3 panels, soft palette
- the_ambitious / the_optimizer → full 5-6 panel grid, bold rich palette
- the_scattered → clean grid layout, simple high-contrast colors
- Default: balanced grid, 4-5 panels`;

  const imagePromptRules = `
IMAGE PROMPT RULES (critical for high-quality generation):
- Use photorealistic Stable Diffusion / FLUX prompts
- Focus on the ACHIEVED STATE (what life looks like after achieving the goal)
- Include: lighting style, environment, mood, time of day, and subject
- Append to every prompt: "ultra-detailed, 8K, golden ratio composition, award-winning photography"
- NO text or words in images. NO brand logos. Culturally inclusive.
- Each panel must have a UNIQUE scene — never repeat the same environment`;

  const styleNote = stylePreset
    ? `\nApply this visual style to all image prompts: ${stylePreset}`
    : '';

  return `You are RESURGO's elite Vision Board Designer for ${userName}.

DATE: ${todayDate}
${archetypeHint}
${psychHint}
${layoutRules}
${imagePromptRules}
${styleNote}

GOALS (${goals.length} total):
${goals.map((g, i) => `${i + 1}. [${g.category}] "${g.title}" — ${g.progress}% done`).join('\n')}

THEME INSIGHTS (from psychological analysis — USE THESE):
${themeInsights}

AFFIRMATION RULES:
- First person, present tense ("I am" not "I will be")
- Highly specific to the goal and its emotional anchor
- Archetype tone: rebuilder=nurturing/healing, optimizer=analytical/systematic, ambitious=bold/commanding, scattered=short/grounding

Respond with ONLY valid JSON (no markdown, no explanation):
{
  "title": "Personal board title that feels like a declaration (not generic)",
  "theme": {
    "colorPalette": ["#hex1","#hex2","#hex3","#hex4","#hex5"],
    "mood": "string describing the emotional quality",
    "fontStyle": "serif-elegant|sans-modern|mono-tech",
    "layoutStyle": "grid|collage|minimal|mosaic"
  },
  "panels": [
    {
      "goalTitle": "exact goal title",
      "imagePrompt": "highly detailed image generation prompt, minimum 40 words",
      "imageKeywords": ["keyword1","keyword2","keyword3"],
      "affirmation": "specific first-person present-tense affirmation",
      "category": "HEALTH|CAREER|PERSONAL|FINANCE|LEARNING|RELATIONSHIP",
      "emotionalAnchor": "single power word",
      "milestoneHint": "one sentence about what achieving this looks like",
      "position": 0
    }
  ],
  "centerAffirmation": "bold overarching I AM statement that unifies all goals"
}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN: Generate vision board config from user data (two-stage pipeline)
// ─────────────────────────────────────────────────────────────────────────────

export async function generateVisionBoardConfig(params: {
  userId: string;
  userName: string;
  goals: GoalSummary[];
  archetype: UserArchetype | null;
  psychProfile: PsychologicalProfile | null;
  stylePreset?: string;
}): Promise<VisionBoardConfig | null> {
  if (params.goals.length === 0) {
    console.warn('[VisionBoard] No goals provided — cannot generate board');
    return null;
  }

  const todayDate = new Date().toISOString().slice(0, 10);

  // Max 6 panels to keep the board focused
  const goals = params.goals.slice(0, 6);

  // ── Stage 1: Extract psychological themes & emotional anchors ──────────────
  let themeInsights = '';
  try {
    const themePrompt = buildThemeExtractionPrompt({
      userName: params.userName,
      goals,
      archetype: params.archetype,
      psychProfile: params.psychProfile,
    });

    const { data: themeData } = await callAIJson<{
      insights: Array<{ goalTitle: string; coreEmotion: string; sensoryScene: string; visualMetaphor: string }>;
    }>(
      [
        { role: 'system', content: themePrompt },
        { role: 'user', content: 'Extract the psychological themes and emotional anchors for each goal.' },
      ],
      { taskType: 'analyze', temperature: 0.6, maxTokens: 1000 },
    );

    if (themeData?.insights) {
      themeInsights = themeData.insights
        .map(
          (ins) =>
            `• "${ins.goalTitle}": emotion="${ins.coreEmotion}", scene="${ins.sensoryScene}", metaphor="${ins.visualMetaphor}"`,
        )
        .join('\n');
    }
  } catch (err) {
    console.warn('[VisionBoard] Stage 1 theme extraction failed, proceeding without insights:', err);
  }

  // ── Stage 2: Generate full board config ─────────────────────────────────────
  const boardPrompt = buildBoardConfigPrompt({
    userName: params.userName,
    goals,
    archetype: params.archetype,
    psychProfile: params.psychProfile,
    themeInsights,
    todayDate,
    stylePreset: params.stylePreset,
  });

  try {
    const { data: raw } = await callAIJson<{
      title: string;
      theme: VisionBoardTheme;
      panels: Omit<VisionBoardPanel, 'id' | 'progress'>[];
      centerAffirmation: string;
    }>(
      [
        { role: 'system', content: boardPrompt },
        { role: 'user', content: 'Generate my complete personalized vision board configuration.' },
      ],
      { taskType: 'analyze', temperature: 0.8, maxTokens: 4000 },
    );

    if (!raw.panels || raw.panels.length === 0) throw new Error('No panels generated');

    const config: VisionBoardConfig = {
      userId: params.userId,
      title: raw.title || `${params.userName}'s Vision Board`,
      theme: {
        colorPalette: Array.isArray(raw.theme?.colorPalette)
          ? raw.theme.colorPalette
          : ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
        mood: raw.theme?.mood || 'balanced',
        fontStyle: raw.theme?.fontStyle || 'sans-modern',
        layoutStyle: raw.theme?.layoutStyle || 'grid',
      },
      panels: raw.panels.map((p, i) => {
        const matchedGoal = goals.find(
          (g) => g.title.toLowerCase().includes(p.goalTitle.toLowerCase().slice(0, 15)),
        );
        return {
          ...p,
          id: `panel-${i}-${Date.now()}`,
          progress: matchedGoal?.progress ?? 0,
          position: p.position ?? i,
          imageKeywords: Array.isArray(p.imageKeywords) ? p.imageKeywords : [],
          emotionalAnchor: p.emotionalAnchor || 'growth',
          milestoneHint: p.milestoneHint || `Achieving ${p.goalTitle}`,
        };
      }),
      centerAffirmation: raw.centerAffirmation || 'I am building the life I deserve.',
      generatedAt: new Date().toISOString(),
      version: 2,
      archetype: params.archetype ?? undefined,
      generationMethod: themeInsights ? 'pipeline' : 'direct',
    };

    return config;
  } catch (err) {
    console.error('[VisionBoard] Config generation failed:', err);
    return null;
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface VisionBoardTheme {
  colorPalette: string[];   // 5 hex colors
  mood: string;             // e.g. "warm-ambitious" | "calm-focused"
  fontStyle: 'serif-elegant' | 'sans-modern' | 'mono-tech';
  layoutStyle: 'grid' | 'collage' | 'minimal' | 'mosaic';
}

export interface VisionBoardPanel {
  id: string;
  goalTitle: string;
  imagePrompt: string;      // Stable Diffusion prompt
  affirmation: string;
  category: string;
  progress: number;         // 0–100, filled in from goal tracking
  position: number;
}

export interface VisionBoardConfig {
  userId: string;
  title: string;
  theme: VisionBoardTheme;
  panels: VisionBoardPanel[];
  centerAffirmation: string;
  generatedAt: string;
  version: number;
  archetype?: string;
}

// Minimal goal shape needed for generation
export interface GoalSummary {
  title: string;
  category: string;
  progress: number;
  description?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Build the generation prompt
// ─────────────────────────────────────────────────────────────────────────────

function buildGenerationPrompt(params: {
  userName: string;
  goals: GoalSummary[];
  archetype: UserArchetype | null;
  psychProfile: PsychologicalProfile | null;
  todayDate: string;
}): string {
  const { userName, goals, archetype, psychProfile, todayDate } = params;

  const archetypeHint = archetype
    ? `User archetype: ${archetype.replace('the_', '').toUpperCase()}`
    : 'Archetype: unknown (use balanced defaults)';

  const psychHint = psychProfile && psychProfile.bigFive.confidence >= 20
    ? `Big Five (1-10): O=${psychProfile.bigFive.openness} C=${psychProfile.bigFive.conscientiousness} E=${psychProfile.bigFive.extraversion} A=${psychProfile.bigFive.agreeableness} N=${psychProfile.bigFive.neuroticism}
Motivational stage: ${psychProfile.motivational.changeStage}
Feedback style: ${psychProfile.behavioral.preferredFeedbackStyle}
Procrastination tendency: ${psychProfile.behavioral.procrastinationTendency}/10`
    : 'Psychology profile: not yet available (use balanced defaults)';

  return `You are RESURGO's Vision Board Designer. Create a deeply personal vision board configuration.

USER: ${userName}
DATE: ${todayDate}
${archetypeHint}
${psychHint}

GOALS (${goals.length} total):
${goals.map((g, i) => `${i + 1}. [${g.category}] ${g.title} — ${g.progress}% done${g.description ? ` (${g.description.slice(0, 80)})` : ''}`).join('\n')}

RULES FOR THEMES:
- High neuroticism (>7) → calming colors (blues, greens, soft neutrals)
- High extraversion (>7) → vibrant colors (warm oranges, energetic yellows)  
- High conscientiousness (>7) → grid or minimal layout
- High openness (>7) → collage or mosaic layout
- the_overwhelmed / the_rebuilder → minimal layout, max 3 panels, soft palette
- the_ambitious / the_optimizer → full grid, bold palette

RULES FOR IMAGE PROMPTS:
- Vivid, specific Stable Diffusion prompts. Focus on OUTCOMES not processes.
- Always append: "photorealistic, warm lighting, aspirational, high quality, 4K"
- Never include text in images. Culturally neutral and inclusive.
- Each prompt uniquely tied to the specific goal.

RULES FOR AFFIRMATIONS:
- First person, present tense ("I am" not "I will be")
- Specific to the goal, not generic quotes
- Match archetype tone: rebuilder=nurturing, optimizer=analytical, ambitious=bold, scattered=short+clear

OUTPUT (JSON only, no markdown, no explanation):
{
  "title": "string — personal board title",
  "theme": {
    "colorPalette": ["#hex1","#hex2","#hex3","#hex4","#hex5"],
    "mood": "string",
    "fontStyle": "serif-elegant|sans-modern|mono-tech",
    "layoutStyle": "grid|collage|minimal|mosaic"
  },
  "panels": [
    {
      "goalTitle": "exact goal title from the list",
      "imagePrompt": "detailed SD prompt",
      "affirmation": "personal affirmation",
      "category": "HEALTH|CAREER|PERSONAL|FINANCE|LEARNING|RELATIONSHIP",
      "position": 0
    }
  ],
  "centerAffirmation": "the big overarching I AM statement"
}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN: Generate vision board config from user data
// ─────────────────────────────────────────────────────────────────────────────

export async function generateVisionBoardConfig(params: {
  userId: string;
  userName: string;
  goals: GoalSummary[];
  archetype: UserArchetype | null;
  psychProfile: PsychologicalProfile | null;
}): Promise<VisionBoardConfig | null> {
  if (params.goals.length === 0) {
    console.warn('[VisionBoard] No goals provided — cannot generate board');
    return null;
  }

  const todayDate = new Date().toISOString().slice(0, 10);

  // Max 6 panels to keep the board focused
  const goals = params.goals.slice(0, 6);

  const systemPrompt = buildGenerationPrompt({
    userName: params.userName,
    goals,
    archetype: params.archetype,
    psychProfile: params.psychProfile,
    todayDate,
  });

  try {
    const { data: raw } = await callAIJson<{
      title: string;
      theme: VisionBoardTheme;
      panels: Omit<VisionBoardPanel, 'id' | 'progress'>[];
      centerAffirmation: string;
    }>(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate my personalized vision board configuration now.' },
      ],
      { taskType: 'analyze', temperature: 0.8, maxTokens: 3000 }
    );

    if (!raw.panels || raw.panels.length === 0) throw new Error('No panels generated');

    const config: VisionBoardConfig = {
      userId: params.userId,
      title: raw.title || `${params.userName}'s Vision Board`,
      theme: {
        colorPalette: Array.isArray(raw.theme?.colorPalette) ? raw.theme.colorPalette : ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
        mood: raw.theme?.mood || 'balanced',
        fontStyle: raw.theme?.fontStyle || 'sans-modern',
        layoutStyle: raw.theme?.layoutStyle || 'grid',
      },
      panels: raw.panels.map((p, i) => {
        const matchedGoal = goals.find(
          (g) => g.title.toLowerCase().includes(p.goalTitle.toLowerCase().slice(0, 15))
        );
        return {
          ...p,
          id: `panel-${i}-${Date.now()}`,
          progress: matchedGoal?.progress ?? 0,
          position: p.position ?? i,
        };
      }),
      centerAffirmation: raw.centerAffirmation || 'I am building the life I deserve.',
      generatedAt: new Date().toISOString(),
      version: 1,
      archetype: params.archetype ?? undefined,
    };

    return config;
  } catch (err) {
    console.error('[VisionBoard] Config generation failed:', err);
    return null;
  }
}
