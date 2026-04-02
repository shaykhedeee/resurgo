// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Vision Board Config Generator (Section 24)
// Uses AI to generate a deeply personalised vision board config based on the
// user's goals, psychology profile, and archetype.
// ═══════════════════════════════════════════════════════════════════════════════

import { callAIJson } from '../provider-router';
import type { PsychologicalProfile } from '../psychology/profile-schema';
import type { UserArchetype } from '../onboarding/archetypes';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

// Wizard data passed from the guided creation flow
export interface WizardPromptData {
  boardType?: 'manifesting' | 'gratitude' | 'yearly' | 'vision' | 'custom';
  overarchingVision: string;
  domains: string[];
  domainDetails: Record<string, string>;
  stylePreset: 'pinterest-bold' | 'clean-minimal' | 'luxury-editorial' | 'cinematic-dream';
  mood: string;
  customPromptBoost: string;
}

export interface VisionBoardTheme {
  colorPalette: string[];   // 5 hex colors
  mood: string;             // e.g. "warm-ambitious" | "calm-focused"
  fontStyle: 'serif-elegant' | 'sans-modern' | 'mono-tech';
  layoutStyle: 'grid' | 'collage' | 'minimal' | 'mosaic';
}

export type BoardType = 'manifesting' | 'gratitude' | 'yearly' | 'vision' | 'custom';

export interface VisionBoardPanel {
  id: string;
  goalTitle: string;
  imagePrompt: string;        // Stable Diffusion prompt
  negativePrompt?: string;    // Things to avoid in generation
  affirmation: string;
  category: string;
  progress: number;           // 0–100, filled in from goal tracking
  position: number;
}

export interface VisionBoardConfig {
  userId: string;
  title: string;
  boardType?: BoardType;
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

// ─────────────────────────────────────────────────────────────────────────────
// Style-to-visual mapping — used to enrich the AI prompt
// ─────────────────────────────────────────────────────────────────────────────

const STYLE_VISUAL_DESCRIPTOR: Record<string, string> = {
  'pinterest-bold': 'Pinterest-style boldly-composed collage aesthetic, high contrast, rich saturation, aspirational lifestyle photography',
  'clean-minimal': 'minimalist editorial aesthetic, soft natural light, airy white space, muted tones, calm premium design',
  'luxury-editorial': 'luxury editorial photography, polished premium textures, magazine-grade composition, sophisticated tones',
  'cinematic-dream': 'cinematic dreamlike imagery, dramatic moody lighting, shallow depth of field, cinematic color grading',
};

const DOMAIN_VISUAL_KEYWORDS: Record<string, string> = {
  HEALTH: 'fitness, athletic body, vibrant health, outdoor exercise, clean nutrition',
  CAREER: 'professional success, modern office, presentation, leadership, technology',
  WEALTH: 'luxury lifestyle, financial freedom, modern home, elegant possessions, abundance',
  RELATIONSHIP: 'connection, warm relationships, family, love, community',
  LEARNING: 'books, education, skill mastery, focus, intellectual growth',
  TRAVEL: 'exotic destination, adventure, world exploration, culture, freedom',
  MINDSET: 'meditation, calm mind, inner peace, clarity, mindfulness',
  CREATIVITY: 'artistic expression, creation, studio, music, art, innovation',
  SPIRITUALITY: 'spiritual awakening, sacred space, meditation, divine connection, inner light',
  LEADERSHIP: 'commanding presence, inspiring team, stage, boardroom, charisma, legacy',
  FAMILY: 'generational love, home, children, parents, warmth, belonging',
  IMPACT: 'changing lives, community, legacy, meaningful work, scale, purpose',
};

// ─────────────────────────────────────────────────────────────────────────────
// SCENE LIBRARY — 8 cinematic scene compositions per domain (~100 total)
// These are injected into the prompt as concrete starting points so AI generates
// SPECIFIC scenes instead of generic "success" imagery.
// ─────────────────────────────────────────────────────────────────────────────
const SCENE_LIBRARY: Record<string, string[]> = {
  HEALTH: [
    'lean athlete crossing marathon finish line at golden sunrise, chest raised in triumph, crowd cheering',
    'fit person completing a pull-up set with perfect form, morning light flooding a sleek home gym',
    'trail runner reaching mountain summit at golden hour, arms outstretched, panoramic landscape',
    'swimmer breaking the water surface at dawn in an Olympic-quality pool, raw excellence',
    'martial artist in a perfect fighting stance at sunrise, dojo, inner mastery radiating',
    'yogi in advanced arm balance on a cliffside at sunrise, ocean horizon, serene stillness',
    'cyclist at the peak of a mountain pass, exhausted yet triumphant, epic alpine backdrop',
    'person celebrating a personal-best weight on a barbell, raw energy, strength realized',
  ],
  CAREER: [
    'entrepreneur presenting to engaged investors in a glass-walled skyscraper boardroom',
    'speaker receiving a standing ovation after a TED-style talk, main-stage spotlight',
    'founder signing a major deal at a premium oak desk, city skyline through floor-to-ceiling windows',
    'creative director reviewing bold design work on a massive curved monitor in a stunning agency',
    'tech CEO walking into company HQ, employees recognizing them, presence of earned success',
    'developer launching a product on a sleek laptop in a beautiful co-working space, success notification',
    'consultant meeting a Fortune 500 client in a luxury conference room, charts showing growth',
    'person featured on a magazine cover with headline announcing their business breakthrough',
  ],
  WEALTH: [
    'modern luxury apartment high-rise overlooking city skyline at night, warm interior, abundance',
    'opening a bank statement showing seven figures at a serene home office with fresh flowers',
    'handing keys to a new luxury sports car at a premium showroom, pride and accomplishment',
    'checking investment portfolio on dual screens in a calm home office, financial clarity',
    'luxury villa with infinity pool overlooking Mediterranean sea, morning coffee on terrace',
    'passive income notification on phone while sitting on a yacht at anchor, blue water all around',
    'real estate portfolio wall map in a sleek penthouse office, properties acquired and marked',
    'walking into a dream home as the owner for the first time, keys in hand, golden light flooding in',
  ],
  RELATIONSHIP: [
    'couple laughing together on a stunning beach at sunset, genuine joy and deep connection',
    'family gathered around a large table full of food, warmth, laughter, multigenerational love',
    'deep meaningful conversation between close friends at a rooftop café at night, real friendship',
    'romantic dinner at a candlelit exterior restaurant in Italy, intimacy and connection',
    'parents playing with children in a sunlit garden, pure presence and joy',
    'group of lifelong friends celebrating a major life milestone, chosen family, belonging',
    'couple in a tender embrace after years of building a life together, enduring love',
    'person being warmly embraced by their whole family after a tremendous achievement, unconditional love',
  ],
  LEARNING: [
    'person absorbed in an advanced textbook in a stunning library, walls of books, deep focus',
    'student receiving a doctoral diploma on stage, academic peak, proud achievement',
    'language learner in flowing natural conversation with locals abroad, total cultural immersion',
    'developer in a deep coding flow state, multi-monitor setup, complex problem being solved',
    'person closing a completed journal next to a stack of finished books, visible growth',
    'mentor teaching a small group in an inspiring open setting, knowledge flowing, impact visible',
    'person completing an online certification, notification on screen, skill unlocked, progress celebrated',
    'studying at a world-class university campus, open book, future limitless',
  ],
  TRAVEL: [
    'solo traveler standing at the edge of a Bali rice terrace at sunrise, backpack, total freedom',
    'traveler on a Santorini cliffside path at golden hour with white houses and blue domes',
    'backpacker at a Japanese night market, total cultural immersion, lanterns and wonder',
    'person watching northern lights from a glass igloo in Lapland, awe and magic',
    'adventurers hiking toward Machu Picchu through misty morning mountain layers',
    'traveler at a Parisian sidewalk café at sunrise, croissant, sophistication and freedom',
    'surfer catching a perfect glassy wave in Hawaii, pure flow state, ocean lifestyle',
    'airport first-class lounge, passport and boarding pass for a dream destination in hand',
  ],
  MINDSET: [
    'person meditating cross-legged on a wooden deck overlooking misty mountains at dawn, pure stillness',
    'beautiful journal open on a clean desk with morning coffee and sunlight, intentional start',
    'breathwork practitioner on a cliffside, facing the ocean horizon, inner peace radiating',
    'morning routine ritual — cold shower steam, mirror notes, sun streaming in, power and peace',
    'person in a profound breakthrough moment, light and clarity in their eyes, transformation',
    'individual writing a gratitude journal at sunrise, soft light, ritual of presence',
    'person meditating in a forest clearing, dappled light, nature and stillness merged',
    'calm person at the center of a storm metaphor, equanimity, unshakeable inner ground',
  ],
  CREATIVITY: [
    'artist in a stunning loft studio surrounded by canvases, working on a large emotional piece',
    'musician in a professional recording studio at night, headphones on, creating their masterpiece',
    'writer at a beautiful old desk in a French country estate, manuscript, deep creative flow',
    'photographer reviewing stunning images in a sunlit studio, mastery visible',
    'filmmaker reviewing award-winning footage in an edit suite, creative vision being realized',
    'fashion designer presenting debut collection to industry audience, creative vision applauded',
    'potter shaping clay at a wheel, hands and craft in perfect harmony, artistry',
    'game developer watching their creation launch, thousands of players appearing online',
  ],
  SPIRITUALITY: [
    'person at a sunrise ceremony in the desert, profound peace, connection to something greater',
    'individual in deep meditation in a temple bathed in golden light, transcendence, stillness',
    'spiritual retreat in the mountains, group of seekers, authentic transformation underway',
    'meditator receiving insight, light emanating outward, awakening moment captured',
    'healer working with energy in a sacred loft space, crystals, plants, profound intentionality',
    'person on a pilgrimage path, ancient mountain monastery ahead, journey almost complete',
    'ceremony at sunrise with a teacher and students, ancient wisdom being transmitted',
    'individual at a full-moon ceremony on a beach, universe connecting through them',
  ],
  LEADERSHIP: [
    'leader walking into a room that changes energy the moment they enter, commanding presence',
    'mentor guiding a young team forward, trust and inspiration visible, servant leadership',
    'CEO at a company all-hands meeting, hundreds of employees listening, vision being articulated',
    'changemaker receiving a community award, impact on display, meaningful work recognized',
    'entrepreneur photographed for a magazine cover, headline announcing their industry breakthrough',
    'executive coach in a breakthrough session with a client, visible transformation moment',
    'person stepping into their leadership role for the first time, confidence and clarity',
    'leader at a press conference, cameras, success at scale, representing something important',
  ],
  FAMILY: [
    'family blowing out birthday candles together, multi-generational joy, home filled with love',
    'morning kitchen warmth — kids, coffee, laughter, perfect imperfect family life',
    'parents watching their child perform on stage, pride and love written on their faces',
    'multigenerational family on a dream vacation, beach, joy across generations',
    'parent and child building something together in a workshop, bonding, love in action',
    'family home exterior at golden hour, warmth emanating, everything they worked for realized',
    'holiday gathering full of food, laughter, tradition, home that love built',
    'parent dropping their child at university on move-in day, proud milestone, lasting impact',
  ],
  IMPACT: [
    'founder on stage at a large conference, audience inspired, vision at scale',
    'teacher receiving a heartfelt letter from a former student whose life they changed',
    'doctor breaking through theater doors triumphant after a difficult successful surgery',
    'environmentalist seeing the forest they helped restore, decades of work visible',
    'nonprofit founder handing out resources to a grateful community, change visible in faces',
    'activist watching their cause become law, years of effort, real change materialized',
    'mentor at graduation of a student they believed in, ripple effect of positive impact',
    'person finishing a book that will change minds, final chapter complete, legacy being built',
  ],
  PERSONAL: [
    'person celebrating solo at a beautiful restaurant, treating themselves to the best, self-love',
    'individual standing confidently at the mirror, radiating self-worth and peace',
    'completing a bucket list experience, tears of joy, full aliveness',
    'person alone at a peaceful mountain lake, perfect solitude, inner contentment',
    'finishing a marathon solo, personal promise kept, deeply proud moment',
    'person in their dream home space — everything curated to their taste, sanctuary',
    'solo traveler at sunrise in a foreign city, confident and free, owning their journey',
    'person meditating under a tree, deeply at home in their own presence',
  ],
  FINANCE: [
    'reviewing a growing investment dashboard, dual screens, financial mastery and calm',
    'meeting with a private wealth advisor in a premium office, estate planning, financial clarity',
    'person celebrating hitting their first net-worth milestone, simple moment, deep satisfaction',
    'writing a check to fund their own dream project, financial independence in action',
    'receiving passive income notifications while traveling, freedom validated',
    'opening a business bank account showing strong cash flow, hard work rewarded',
    'financial freedom morning — coffee, laptop, income coming in, nowhere to be',
    'person burning their last debt statement, full financial liberation, new chapter beginning',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ARCHETYPE VISUAL MAP — how each archetype translates to image composition
// ─────────────────────────────────────────────────────────────────────────────
const ARCHETYPE_VISUAL_MAP: Record<string, string> = {
  the_achiever: 'competitive victory scenes, podium moments, measurable results, recognition, completion',
  the_visionary: 'expansive future horizons, innovation boards, breakthrough moments, bold unconventional scenes',
  the_nurturer: 'warm communal settings, helping others, collective joy, connection, belonging scenes',
  the_warrior: 'resilience under pressure, hard-won victories, grit scenes, overcoming obstacles, endurance',
  the_sage: 'wisdom and mastery scenes, intellectual peaks, teaching, deep knowledge, contemplation',
  the_maverick: 'rule-breaking success, unique lifestyle, unconventional path, doing it differently',
  the_architect: 'structured systems, methodical excellence, detailed plans materializing, precision',
  the_explorer: 'adventure and discovery, uncharted territories, freedom in motion, new horizons',
  the_creator: 'artistic flow states, creative mastery, expression, building something extraordinary',
  the_leader: 'commanding presence, team following, stage moments, impact at scale, legacy',
};

// ─────────────────────────────────────────────────────────────────────────────
// BOARD TYPE CONTEXT — additional guidance per board intent
// ─────────────────────────────────────────────────────────────────────────────
const BOARD_TYPE_CONTEXT: Record<string, string> = {
  manifesting: 'This is a MANIFESTING board. Every image should show the goal as ALREADY ACHIEVED — the destination, not the journey. Present tense. "I AM" not "I will". Show the feeling of having arrived.',
  gratitude: 'This is a GRATITUDE board. Images should feel warm, received, abundant. Focus on what IS, not what will be. Cozy, warm, present, thankful energy.',
  yearly: `This is a YEARLY THEME board for ${new Date().getFullYear()}. Show the defining vision for THIS year — bold, focused, energized. One year from now, this is what life looks like.`,
  vision: 'This is a LONG-TERM VISION board. Think 3–5 years out. Images should be expansive, aspirational, showing a fully transformed life. Big dreams. Fully realized.',
  custom: 'This is a custom personal vision board. Make it deeply authentic to the user — their exact words, their specific vision, their personality.',
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: get current season (for seasonal imagery)
// ─────────────────────────────────────────────────────────────────────────────
function getSeason(): string {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return 'spring (fresh starts, blossoms, bright light, new beginnings)';
  if (m >= 5 && m <= 7) return 'summer (golden light, abundance, vibrant life, peak energy)';
  if (m >= 8 && m <= 10) return 'autumn (rich warm tones, harvest, accomplishment, depth)';
  return 'winter (crisp clarity, stillness, new year energy, bold contrast)';
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: build a universal negative prompt for quality filtering
// ─────────────────────────────────────────────────────────────────────────────
function buildNegativePrompt(): string {
  return 'ugly, blurry, low quality, distorted faces, text overlay, watermark, logo, signature, cartoon, animated, illustration, CGI, stock photo cliché, bad anatomy, deformed limbs, extra fingers, washed out, oversaturated, noisy, grainy, flat lighting, generic office stock photo look';
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: pick the most relevant scene from the library for a domain
// ─────────────────────────────────────────────────────────────────────────────
function getSceneExamplesForDomain(domain: string, count = 3): string {
  const scenes = SCENE_LIBRARY[domain] ?? SCENE_LIBRARY['PERSONAL'] ?? [];
  if (scenes.length === 0) return '';
  // deterministically grab spread-out examples
  const picked: string[] = [];
  const step = Math.max(1, Math.floor(scenes.length / count));
  for (let i = 0; i < count && i * step < scenes.length; i++) {
    picked.push(scenes[i * step]);
  }
  return picked.map((s, i) => `  Scene option ${i + 1}: "${s}"`).join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: science-backed color palette from mood + BigFive
// ─────────────────────────────────────────────────────────────────────────────
function colorPaletteForMoodAndPersonality(
  mood: string,
  bigFiveE?: number,
  bigFiveO?: number
): string[] {
  const palettes: Record<string, string[]> = {
    'Ambitious & Bold': ['#f97316', '#c2410c', '#111111', '#fbbf24', '#78350f'],
    'Calm & Peaceful':  ['#0ea5e9', '#0284c7', '#0f172a', '#7dd3fc', '#164e63'],
    'Luxurious & Premium': ['#d97706', '#92400e', '#080808', '#fde68a', '#422006'],
    'Raw & Authentic': ['#dc2626', '#991b1b', '#1a0a0a', '#fca5a5', '#450a0a'],
    'Spiritual & Mindful': ['#7c3aed', '#5b21b6', '#0c001a', '#c4b5fd', '#2e1065'],
    'Adventurous & Free': ['#10b981', '#047857', '#071a10', '#6ee7b7', '#022c22'],
    'Focused & Disciplined': ['#6366f1', '#4338ca', '#0d0d1a', '#a5b4fc', '#1e1b4b'],
    'Creative & Expressive': ['#ec4899', '#be185d', '#1a0011', '#f9a8d4', '#500724'],
  };

  let selected = palettes[mood] ?? palettes['Ambitious & Bold'];

  // Personality tweaks: high extraversion shifts toward warmer tones
  if (bigFiveE !== undefined && bigFiveE >= 8) {
    selected = [selected[0], '#facc15', selected[2], selected[3], selected[4]];
  }
  // High openness shifts toward more unique, unusual hues
  if (bigFiveO !== undefined && bigFiveO >= 8) {
    selected = ['#a855f7', '#7e22ce', selected[2], '#d946ef', selected[4]];
  }

  return selected;
}

function buildGenerationPrompt(params: {
  userName: string;
  goals: GoalSummary[];
  archetype: UserArchetype | null;
  psychProfile: PsychologicalProfile | null;
  todayDate: string;
  wizardData?: WizardPromptData | null;
  boardType?: BoardType;
  habitCompletionRate?: number;
  streakDays?: number;
  goalCompletionRate?: number;
}): string {
  const { userName, goals, archetype, psychProfile, todayDate, wizardData,
    boardType, habitCompletionRate, streakDays, goalCompletionRate } = params;

  // ── Archetype visual layer ──────────────────────────────────────────────
  const archetypeKey = archetype?.toLowerCase().replace(' ', '_') ?? '';
  const archetypeVisual = archetypeKey in ARCHETYPE_VISUAL_MAP
    ? `User archetype: ${archetype!.replace('the_', '').toUpperCase()}\nArchetype visual style: ${ARCHETYPE_VISUAL_MAP[archetypeKey]}`
    : 'Archetype: unknown (use balanced defaults)';

  // ── Big Five psychological profile → visual aesthetics ─────────────────
  let psychHint = 'Psychology profile: not yet available (use balanced defaults)';
  let personalityVisualEnhancer = '';
  let bigFiveE: number | undefined;
  let bigFiveO: number | undefined;

  if (psychProfile && psychProfile.bigFive.confidence >= 20) {
    const { openness: O, conscientiousness: C, extraversion: E,
            agreeableness: A, neuroticism: N } = psychProfile.bigFive;
    bigFiveE = E;
    bigFiveO = O;

    psychHint = `Big Five (1-10): O=${O} C=${C} E=${E} A=${A} N=${N}
Motivational stage: ${psychProfile.motivational.changeStage}
Feedback style: ${psychProfile.behavioral.preferredFeedbackStyle}
Procrastination tendency: ${psychProfile.behavioral.procrastinationTendency}/10`;

    const traits: string[] = [];
    if (O >= 7) traits.push('surreal creative environments, abstract concepts visualized, unconventional and striking compositions');
    if (O <= 4) traits.push('realistic concrete scenes, familiar environments, tangible specific achievements');
    if (C >= 7) traits.push('orderly structured spaces, clear measurable progress imagery, systems and precision');
    if (E >= 7) traits.push('social settings, energy and vitality, people celebrating together, bright vibrant colors');
    if (E <= 4) traits.push('solitary focused moments, intimate quiet achievement, peaceful personal spaces');
    if (N >= 7) traits.push('serene calming imagery, safe protected spaces, gentle warm soft lighting');
    if (A >= 7) traits.push('collaborative scenes, giving back, warm human connection, collective harmony');
    if (C <= 4 || N >= 7) traits.push('forgiving aspirational framing, warm encouragement, progress over perfection');

    if (traits.length > 0) {
      personalityVisualEnhancer = `\nPERSONALITY-DRIVEN VISUAL STYLE (apply to ALL image prompts):\n${traits.join('; ')}`;
    }
  }

  // ── Season context ──────────────────────────────────────────────────────
  const seasonHint = `Current season: ${getSeason()}. Subtly incorporate seasonal lighting and atmosphere where relevant.`;

  // ── Board type context ──────────────────────────────────────────────────
  const boardTypeContext = boardType ? `\nBOARD TYPE: ${BOARD_TYPE_CONTEXT[boardType] ?? ''}` : '';

  // ── Behavioral momentum context ─────────────────────────────────────────
  let momentumContext = '';
  if (habitCompletionRate !== undefined || streakDays !== undefined || goalCompletionRate !== undefined) {
    const completionRate = habitCompletionRate ?? goalCompletionRate ?? 50;
    const streak = streakDays ?? 0;

    if (completionRate >= 75 || streak >= 14) {
      momentumContext = `\nMOMENTUM: HIGH-PERFORMING (${completionRate}% completion, ${streak}-day streak). Show the DESTINATION as present/arrived. Achiever imagery — celebrating, living the dream, already there.`;
    } else if (completionRate >= 50) {
      momentumContext = `\nMOMENTUM: BUILDING (${completionRate}% completion). Use PROGRESS imagery — confidence growing, journey well underway, small wins stacking up.`;
    } else {
      momentumContext = `\nMOMENTUM: EARLY STAGE (${completionRate}% completion). Use POTENTIAL imagery — open roads, fresh starts, possibility, the call to action just accepted.`;
    }
  }

  // ── Scene library reference for each domain ─────────────────────────────
  const domains = wizardData?.domains ?? [...new Set(goals.map((g) => g.category))];
  const sceneExamplesBlock = domains.length > 0
    ? `\nCINEMATIC SCENE REFERENCE (pick the most fitting scene type per panel, then PERSONALIZE it with the user's exact details):\n${domains.map((d) => {
        const examples = getSceneExamplesForDomain(d, 2);
        return examples ? `[${d}]:\n${examples}` : '';
      }).filter(Boolean).join('\n')}`
    : '';

  // ── Wizard-enhanced context block ───────────────────────────────────────
  let wizardContext = '';
  if (wizardData) {
    const styleVisual = STYLE_VISUAL_DESCRIPTOR[wizardData.stylePreset] ?? '';
    const domainLines = wizardData.domains
      .map((d) => {
        const detail = wizardData.domainDetails[d] ?? '';
        const visual = DOMAIN_VISUAL_KEYWORDS[d] ?? '';
        return `  [${d}]: "${detail}" (domain keywords: ${visual})`;
      })
      .join('\n');

    wizardContext = `
GUIDED WIZARD INPUT (HIGHEST PRIORITY — this IS the user's vision):
Overarching vision: "${wizardData.overarchingVision}"
Board mood: ${wizardData.mood}
Visual style: ${wizardData.stylePreset} — ${styleVisual}
Their specific vision per domain:
${domainLines}
${wizardData.customPromptBoost ? `Extra details user requested: "${wizardData.customPromptBoost}"` : ''}

CRITICAL INSTRUCTION: Use each domain's user-written detail as the PRIMARY source for the image prompt. Embed the user's EXACT WORDS and specific imagery. Every panel must feel like it was made for THIS specific person.`;
  }

  // ── Panel source (wizard domains or goals) ───────────────────────────────
  const panelSource = wizardData && wizardData.domains.length > 0
    ? `PANELS TO GENERATE (${wizardData.domains.length} panels — one per domain, in this order):
${wizardData.domains.map((d, i) => {
  const detail = wizardData.domainDetails[d] ?? d;
  return `${i + 1}. [${d}] User's vision: "${detail}"`;
}).join('\n')}`
    : `GOALS TO VISUALIZE (${goals.length} panels):
${goals.map((g, i) => `${i + 1}. [${g.category}] "${g.title}" — ${g.progress}% complete${g.description ? ` · context: "${g.description.slice(0, 80)}"` : ''}`).join('\n')}`;

  // ── Color palette science ────────────────────────────────────────────────
  const suggestedPalette = colorPaletteForMoodAndPersonality(
    wizardData?.mood ?? 'Ambitious & Bold',
    bigFiveE,
    bigFiveO
  );
  const paletteHint = `Suggested color palette (personality + mood matched): ${suggestedPalette.join(', ')}`;

  return `You are RESURGO's Vision Board Designer — the world's best AI at generating deeply personal, emotionally resonant, cinematically vivid vision board configurations. You write Stable Diffusion image prompts that produce magazine-grade, award-winning results.

USER: ${userName}
DATE: ${todayDate} | SEASON: ${seasonHint}
${archetypeVisual}
${psychHint}${personalityVisualEnhancer}${momentumContext}${boardTypeContext}
${paletteHint}
${wizardContext}
${sceneExamplesBlock}

${panelSource}

═══ RULES FOR IMAGE PROMPTS (follow with precision) ═══
• Write cinematic, sensory, SPECIFIC Stable Diffusion prompts. Every word must paint a picture.
• Use the cinematic scene reference as inspiration, then PERSONALIZE: replace generic details with the user's exact words, location, lifestyle, and specifics.
• Focus on OUTCOMES and ARRIVAL — show the life ALREADY ACHIEVED, not effort in progress (unless board type says otherwise).
• Structure: [Subject + specific action] + [environment + location] + [time of day + lighting] + [emotional tone] + [style suffix]
• Style suffix to add to EVERY prompt: "photorealistic, inspirational lifestyle photography, 4K ultra-high resolution, sharp focus, award-winning composition, natural film grain"
• NEVER include text, words, signs, logos, or watermarks in the scene.
• Culturally neutral. No specific celebrity likenesses.
• ✓ EXCELLENT: "A confident 30-year-old founder raising a glass of champagne in their minimalist glass penthouse office overlooking Singapore at night, warm ambient lighting, midnight navy suit, the city as their empire below, pride and quiet power"
• ✗ BAD: "Business person in office being successful"

NEGATIVE PROMPT (include in every panel): "${buildNegativePrompt()}"

═══ RULES FOR AFFIRMATIONS ═══
• First person, present tense ONLY — "I am", "I have", "I choose" — never "I will"
• Deeply specific to THIS user's domain detail — reference their exact vision
• 8–14 words max. Short, punchy, emotionally resonant.
• No generic quotes. No clichés.
• ✓ GREAT: "I lead my agency from a life of freedom and impact"
• ✗ WEAK: "Success is my destiny"

═══ RULES FOR THEME ═══
${wizardData ? `Style: ${wizardData.stylePreset} → ${STYLE_VISUAL_DESCRIPTOR[wizardData.stylePreset] ?? ''}
Mood: ${wizardData.mood} → apply this mood to color palette AND layout choice
"Ambitious/Bold" → orange/red palette, grid or mosaic layout, sans-modern font
"Calm/Peaceful" → blue/green palette, minimal layout, serif-elegant font
"Luxurious/Premium" → gold/black palette, collage layout, serif-elegant font
"Adventurous/Free" → warm earth tones, mosaic layout, sans-modern font
"Spiritual/Mindful" → purple/indigo palette, minimal layout, serif-elegant font
"Focused/Disciplined" → indigo/navy palette, grid layout, mono-tech font` : `Use the personality-matched palette provided above.
High conscientiousness (>7) → prefer grid or minimal layout
High openness (>7) → prefer collage or mosaic layout
High neuroticism (>7) → calming blues/greens, minimal layout`}

═══ OUTPUT FORMAT (strict JSON only — NO markdown, NO code fences, NO explanation) ═══
{
  "title": "Specific, personal board title using the user's overarching vision keywords",
  "boardType": "manifesting|gratitude|yearly|vision|custom",
  "theme": {
    "colorPalette": ["#hex1","#hex2","#hex3","#hex4","#hex5"],
    "mood": "descriptive mood string",
    "fontStyle": "serif-elegant|sans-modern|mono-tech",
    "layoutStyle": "grid|collage|minimal|mosaic"
  },
  "panels": [
    {
      "goalTitle": "concise domain or goal title (max 6 words)",
      "imagePrompt": "full cinematic SD prompt — specific, sensory, personalized to user's words",
      "negativePrompt": "${buildNegativePrompt()}",
      "affirmation": "first-person present-tense affirmation 8-14 words, user-specific",
      "category": "HEALTH|CAREER|PERSONAL|FINANCE|LEARNING|RELATIONSHIP|TRAVEL|MINDSET|WEALTH|CREATIVITY|SPIRITUALITY|LEADERSHIP|FAMILY|IMPACT",
      "position": 0
    }
  ],
  "centerAffirmation": "The big master I AM statement for this user's entire vision — 10-20 words"
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
  wizardData?: WizardPromptData | null;
  habitCompletionRate?: number;
  streakDays?: number;
  goalCompletionRate?: number;
}): Promise<VisionBoardConfig | null> {
  // Allow generation with wizard data even without goals
  if (params.goals.length === 0 && !params.wizardData) {
    console.warn('[VisionBoard] No goals and no wizard data — cannot generate board');
    return null;
  }

  const todayDate = new Date().toISOString().slice(0, 10);

  // Max 6 panels. If wizard data provided, use domains instead of goals cap.
  const goals = params.wizardData?.domains.length
    ? params.goals.slice(0, 6)
    : params.goals.slice(0, 6);

  const systemPrompt = buildGenerationPrompt({
    userName: params.userName,
    goals,
    archetype: params.archetype,
    psychProfile: params.psychProfile,
    todayDate,
    wizardData: params.wizardData ?? null,
    habitCompletionRate: params.habitCompletionRate,
    streakDays: params.streakDays,
    goalCompletionRate: params.goalCompletionRate,
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
