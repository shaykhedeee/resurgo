// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Coach AI Engine (Convex Actions + Mutations)
// Six distinct AI coach personas with memory and real contextual responses
// ═══════════════════════════════════════════════════════════════════════════════

import { action, internalMutation, internalQuery, mutation, query } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';

// ─── Coach Persona Definitions ───────────────────────────────────────────────

export const COACH_PERSONAS = {
  MARCUS: {
    id: 'MARCUS' as const,
    name: 'Marcus',
    title: 'Stoic Strategist',
    avatar: '⬛',
    color: '#ca8a04',       // amber
    domain: 'discipline, goals, execution',
    tone: 'direct, philosophical, Stoic',
    shortBio: 'Former Navy SEAL turned life philosopher. Brutal clarity, zero BS.',
    systemPrompt: `You are Marcus, a Stoic life strategist and coach on the RESURGO platform. 
You draw inspiration from Marcus Aurelius, Seneca, and modern high-performance philosophy.
Your core belief: the obstacle IS the way. Discomfort is data.

TONE: Direct, philosophical, occasionally Stoic quotes. Never coddling. Short punchy sentences.
DOMAIN: Goal execution, mental discipline, dealing with setbacks, identity-based habits.
STYLE: Terminal operator aesthetic. Use "OPERATOR" to address the user. End with one action command.

Rules:
- Max 3 paragraphs per response.
- Always give a concrete next action, not just advice.
- Reference Stoicism when relevant but never pedantically.
- Acknowledge emotion briefly then redirect to action.
- Never say "I understand how hard this is" — say "Hard is the point."
- If user feels stuck: ask what the NEXT 5-minute action is.`,
  },
  AURORA: {
    id: 'AURORA' as const,
    name: 'Aurora',
    title: 'Mindful Catalyst',
    avatar: '🌅',
    color: '#a855f7',       // purple
    domain: 'wellness, mental health, mindfulness',
    tone: 'warm, insightful, science-backed',
    shortBio: 'Neuroscience + mindfulness. Helps you optimize your nervous system.',
    systemPrompt: `You are Aurora, a mindfulness and wellness coach on RESURGO.
You blend neuroscience, positive psychology, and mindfulness practices.
Your core belief: sustainable performance requires inner harmony.

TONE: Warm but precise. Science-backed. Gentle energy with clear direction.
DOMAIN: Stress management, sleep, energy, emotional regulation, mindfulness.
STYLE: Use breathing cues when relevant. Mention the nervous system, cortisol, dopamine appropriately.

Rules:
- Max 3 paragraphs per response.
- Always validate the emotional experience THEN give a somatic or mindfulness tool.
- Mention one science-backed technique per response.
- Never toxic positivity — acknowledge difficulty with compassion.
- End with a grounding practice or breathing technique when stress is detected.`,
  },
  TITAN: {
    id: 'TITAN' as const,
    name: 'Titan',
    title: 'Physical Performance Engine',
    avatar: '💪',
    color: '#ef4444',       // red
    domain: 'fitness, nutrition, physical optimization',
    tone: 'energetic, blunt, motivating',
    shortBio: 'Former Olympic trainer. Your body is your engine — optimize it.',
    systemPrompt: `You are Titan, a physical performance coach on RESURGO.
You've trained Olympians and elite athletes. You know the body is built in discipline.
Your core belief: the body leads the mind. Fix the physical, the mental follows.

TONE: High energy. Military precision. Occasional bro-speak is OK. Very blunt.
DOMAIN: Training plans, nutrition, sleep optimization, energy management, body composition.
STYLE: Use sets/reps/time analogies. Reference VO2 max, HRV, progressive overload.

Rules:
- Max 3 paragraphs.
- Always give specific, actionable physical advice (not generic "exercise more").
- When user is tired or low energy: address sleep/nutrition FIRST.
- End with a physical challenge or protocol.
- If no fitness question: relate any topic back to physical discipline.`,
  },
  SAGE: {
    id: 'SAGE' as const,
    name: 'Sage',
    title: 'Financial Alchemist',
    avatar: '💰',
    color: '#22c55e',      // green
    domain: 'finance, wealth building, career strategy',
    tone: 'analytical, confident, wealth-focused',
    shortBio: 'CFA turned financial freedom architect. Every rupee is a soldier.',
    systemPrompt: `You are Sage, a financial strategist and wealth coach on RESURGO.
You've helped engineers, founders, and executives achieve financial independence.
Your core belief: financial clarity = decision clarity = life clarity.

TONE: Analytical but accessible. Use financial metaphors. Confident, no-nonsense.
DOMAIN: Budgeting, investing, income growth, career leverage, financial goals.
STYLE: Reference compound interest, opportunity cost, leverage points.

Rules:
- Max 3 paragraphs.
- Always give a specific financial or career action.
- Use numbers and percentages when relevant.
- When discussing money, always think in terms of systems not one-time actions.
- End with a wealth-building insight or a financial question to prompt reflection.`,
  },
  PHOENIX: {
    id: 'PHOENIX' as const,
    name: 'Phoenix',
    title: 'Comeback Specialist',
    avatar: '🔥',
    color: '#f97316',      // orange
    domain: 'resilience, recovery, overcoming setbacks',
    tone: 'empathetic, fierce, transformative',
    shortBio: 'Built for rock bottom. Specializes in impossible comebacks.',
    systemPrompt: `You are Phoenix, a resilience and comeback coach on RESURGO.
You've helped people rebuild after burnout, failure, grief, and rock bottom.
Your core belief: the ashes are the fuel.

TONE: Deeply empathetic first, then fiercely encouraging. Bridge from pain to power.
DOMAIN: Burnout recovery, setback reframing, mental toughness, breaking negative patterns.
STYLE: Use rebirth and transformation metaphors. Honor the struggle before redirecting.

Rules:
- Max 3 paragraphs.
- ALWAYS acknowledge the pain or difficulty FULLY before redirecting.
- Help user reframe the setback as data or a catalyst.
- End with the ONE micro-action that rebuilds momentum.
- Never minimize struggle. Never tell someone to "just think positive."`,
  },
  NOVA: {
    id: 'NOVA' as const,
    name: 'Nova',
    title: 'Creative Systems Thinker',
    avatar: '⚡',
    color: '#06b6d4',      // cyan
    domain: 'creativity, learning, systems & productivity',
    tone: 'curious, systems-oriented, innovative',
    shortBio: 'Polymath coach. Connects dots across disciplines to unlock breakthroughs.',
    systemPrompt: `You are Nova, a creativity and systems coach on RESURGO.
You blend design thinking, second-order thinking, and learning science.
Your core belief: the best systems are the ones you'll actually use.

TONE: Intellectually curious. Uses thought experiments. Asks questions that reframe problems.
DOMAIN: Learning, creativity, habit systems, information management, side projects.
STYLE: Use mental models. Reference concepts from different disciplines unexpectedly.

Rules:
- Max 3 paragraphs.
- Each response should contain one unexpected connection or reframe.
- Ask a Socratic question to deepen the user's thinking.
- Give one systems-level insight, not just surface advice.
- End with a curiosity-sparking question or experiment.`,
  },
};

// ─── Mutations ───────────────────────────────────────────────────────────────

export const setSelectedCoach = mutation({
  args: {
    coachId: v.union(
      v.literal('MARCUS'),
      v.literal('AURORA'),
      v.literal('TITAN'),
      v.literal('SAGE'),
      v.literal('PHOENIX'),
      v.literal('NOVA'),
    ),
  },
  returns: v.null(),
  handler: async (ctx, { coachId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');
    await ctx.db.patch(user._id, { selectedCoach: coachId, updatedAt: Date.now() });
    return null;
  },
});

export const getOrCreateCoachMemory = query({
  args: {
    coachId: v.union(
      v.literal('MARCUS'),
      v.literal('AURORA'),
      v.literal('TITAN'),
      v.literal('SAGE'),
      v.literal('PHOENIX'),
      v.literal('NOVA'),
    ),
  },
  returns: v.union(
    v.object({
      _id: v.id('coachMemory'),
      _creationTime: v.number(),
      userId: v.id('users'),
      coachId: v.union(
        v.literal('MARCUS'),
        v.literal('AURORA'),
        v.literal('TITAN'),
        v.literal('SAGE'),
        v.literal('PHOENIX'),
        v.literal('NOVA'),
      ),
      insights: v.array(v.string()),
      patterns: v.array(v.string()),
      lastAnalysisAt: v.optional(v.number()),
      messageCount: v.number(),
      updatedAt: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, { coachId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) return null;

    const mem = await ctx.db
      .query('coachMemory')
      .withIndex('by_userId_coachId', (q: any) =>
        q.eq('userId', user._id).eq('coachId', coachId)
      )
      .unique();
    return mem ?? null;
  },
});

// ─── Action: Send greeting from AI coach ──────────────────────────────────────

export const greetUser = action({
  args: {
    coachId: v.union(
      v.literal('MARCUS'),
      v.literal('AURORA'),
      v.literal('TITAN'),
      v.literal('SAGE'),
      v.literal('PHOENIX'),
      v.literal('NOVA'),
    ),
    userName: v.optional(v.string()),
  },
  returns: v.object({
    coachMessageId: v.id('coachMessages'),
    greeting: v.string(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const persona = COACH_PERSONAS[args.coachId];
    const name = args.userName || identity.name || 'Operator';

    const greetingPrompt = `The user "${name}" just opened your chat for the first time. Write a short, punchy welcome message (2-3 sentences) that introduces who you are, what you help with, and asks one opening question to get the conversation started. Stay fully in character.`;

    let greeting = '';
    try {
      const groqKey = process.env.GROQ_API_KEY;
      if (groqKey) {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: persona.systemPrompt },
              { role: 'user', content: greetingPrompt },
            ],
            max_tokens: 200,
            temperature: 0.8,
          }),
        });
        if (res.ok) {
          const json: any = await res.json();
          greeting = json?.choices?.[0]?.message?.content ?? '';
        }
      }
    } catch {
      // fall through to static greeting
    }

    if (!greeting) {
      greeting = buildGreeting(args.coachId, name);
    }

    // Persist only the coach greeting (no user message)
    const coachMessageId: string = await ctx.runMutation(
      internal.coachAI.persistGreeting,
      {
        coachContent: greeting,
        coachId: args.coachId,
      },
    );

    return {
      coachMessageId: coachMessageId as any,
      greeting,
    };
  },
});

function buildGreeting(coachId: string, name: string): string {
  const greetings: Record<string, string> = {
    MARCUS: `OPERATOR ${name.toUpperCase()} — welcome to the arena. I'm Marcus, your Stoic strategist. I deal in clarity, discipline, and execution. No fluff, no excuses. What's the single most important thing you need to conquer right now?`,
    AURORA: `Welcome, ${name}. I'm Aurora — your guide to inner clarity and sustainable performance. Neuroscience meets mindfulness here. Before we dive in, take one deep breath with me. Now tell me: how are you really feeling right now?`,
    TITAN: `${name.toUpperCase()}! TITAN online. I'm your physical performance engine — fitness, nutrition, energy optimization. Your body is the vehicle for everything else in your life. First question: did you move your body today?`,
    SAGE: `${name}, welcome. I'm Sage — your financial strategist and wealth architect. Every decision you make has a financial consequence. Let's make them intentional. What's your biggest money question right now?`,
    PHOENIX: `Hey ${name}. I'm Phoenix — I specialize in comebacks, resilience, and rebuilding from the ground up. No judgment here, only forward. What's weighing on you the most right now?`,
    NOVA: `${name} — Nova here. I think in systems, connections, and possibilities. Creativity isn't a gift, it's an algorithm. What's the problem you've been trying to solve that keeps resisting?`,
  };
  return greetings[coachId] ?? greetings['MARCUS'];
}

// ─── Action: Send message with AI persona reply ───────────────────────────────

export const sendWithPersona = action({
  args: {
    content: v.string(),
    coachId: v.union(
      v.literal('MARCUS'),
      v.literal('AURORA'),
      v.literal('TITAN'),
      v.literal('SAGE'),
      v.literal('PHOENIX'),
      v.literal('NOVA'),
    ),
    touchpoint: v.optional(v.union(
      v.literal('morning'),
      v.literal('midday'),
      v.literal('evening'),
      v.literal('on_demand'),
      v.literal('intervention'),
      v.literal('celebration'),
    )),
  },
  returns: v.object({
    userMessageId: v.id('coachMessages'),
    coachMessageId: v.id('coachMessages'),
    reply: v.string(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    // Get recent history for context
    const history = await ctx.runQuery(internal.coachAI.getRecentHistory, {
      coachId: args.coachId,
      limit: 8,
    });

    const persona = COACH_PERSONAS[args.coachId];

    // Build messages array for AI
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: persona.systemPrompt },
    ];

    for (const msg of history) {
      messages.push({
        role: msg.role === 'coach' ? 'assistant' : 'user',
        content: msg.content,
      });
    }
    messages.push({ role: 'user', content: args.content });

    // Try Groq first, fallback to rule-based
    let reply = '';
    try {
      const groqKey = process.env.GROQ_API_KEY;
      if (groqKey) {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages,
            max_tokens: 350,
            temperature: 0.75,
          }),
        });
        if (res.ok) {
          const json: any = await res.json();
          reply = json?.choices?.[0]?.message?.content ?? '';
        }
      }
    } catch {
      // fall through to rule-based
    }

    // Fallback persona-toned rule-based reply
    if (!reply) {
      reply = buildFallbackReply(args.coachId, args.content);
    }

    // Persist both messages
    const ids: { userMessageId: string; coachMessageId: string } = await ctx.runMutation(
      internal.coachAI.persistMessages,
      {
        userContent: args.content,
        coachContent: reply,
        coachId: args.coachId,
        touchpoint: args.touchpoint ?? 'on_demand',
      },
    );

    return {
      userMessageId: ids.userMessageId as any,
      coachMessageId: ids.coachMessageId as any,
      reply,
    };
  },
});

// ─── Internal helpers ─────────────────────────────────────────────────────────

export const getRecentHistory = internalQuery({
  args: {
    coachId: v.union(
      v.literal('MARCUS'),
      v.literal('AURORA'),
      v.literal('TITAN'),
      v.literal('SAGE'),
      v.literal('PHOENIX'),
      v.literal('NOVA'),
    ),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id('coachMessages'),
    _creationTime: v.number(),
    userId: v.id('users'),
    role: v.union(v.literal('coach'), v.literal('user')),
    content: v.string(),
    touchpoint: v.optional(v.union(
      v.literal('morning'),
      v.literal('midday'),
      v.literal('evening'),
      v.literal('on_demand'),
      v.literal('intervention'),
      v.literal('celebration'),
    )),
    context: v.optional(v.string()),
    createdAt: v.number(),
  })),
  handler: async (ctx, { coachId, limit }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) return [];

    const all = await ctx.db
      .query('coachMessages')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    // Filter by coachId stored in context field
    const filtered = all.filter((m: any) => m.context?.startsWith(`coach:${coachId}`));
    const limited = (limit ? filtered.slice(0, limit) : filtered).reverse();
    return limited;
  },
});

export const persistMessages = internalMutation({
  args: {
    userContent: v.string(),
    coachContent: v.string(),
    coachId: v.union(
      v.literal('MARCUS'),
      v.literal('AURORA'),
      v.literal('TITAN'),
      v.literal('SAGE'),
      v.literal('PHOENIX'),
      v.literal('NOVA'),
    ),
    touchpoint: v.union(
      v.literal('morning'),
      v.literal('midday'),
      v.literal('evening'),
      v.literal('on_demand'),
      v.literal('intervention'),
      v.literal('celebration'),
    ),
  },
  returns: v.object({
    userMessageId: v.id('coachMessages'),
    coachMessageId: v.id('coachMessages'),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    const context = `coach:${args.coachId}`;
    const now = Date.now();

    const userMessageId = await ctx.db.insert('coachMessages', {
      userId: user._id,
      role: 'user',
      content: args.userContent,
      touchpoint: args.touchpoint,
      context,
      createdAt: now,
    });

    const coachMessageId = await ctx.db.insert('coachMessages', {
      userId: user._id,
      role: 'coach',
      content: args.coachContent,
      touchpoint: args.touchpoint,
      context,
      createdAt: now + 1,
    });

    // Upsert coach memory message count
    const mem = await ctx.db
      .query('coachMemory')
      .withIndex('by_userId_coachId', (q: any) =>
        q.eq('userId', user._id).eq('coachId', args.coachId)
      )
      .unique();

    if (mem) {
      await ctx.db.patch(mem._id, {
        messageCount: (mem.messageCount ?? 0) + 1,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert('coachMemory', {
        userId: user._id,
        coachId: args.coachId,
        insights: [],
        patterns: [],
        messageCount: 1,
        updatedAt: now,
      });
    }

    return { userMessageId, coachMessageId };
  },
});

export const persistGreeting = internalMutation({
  args: {
    coachContent: v.string(),
    coachId: v.union(
      v.literal('MARCUS'),
      v.literal('AURORA'),
      v.literal('TITAN'),
      v.literal('SAGE'),
      v.literal('PHOENIX'),
      v.literal('NOVA'),
    ),
  },
  returns: v.id('coachMessages'),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    const context = `coach:${args.coachId}`;
    const now = Date.now();

    const coachMessageId = await ctx.db.insert('coachMessages', {
      userId: user._id,
      role: 'coach',
      content: args.coachContent,
      touchpoint: 'on_demand',
      context,
      createdAt: now,
    });

    // Initialize coach memory
    const mem = await ctx.db
      .query('coachMemory')
      .withIndex('by_userId_coachId', (q: any) =>
        q.eq('userId', user._id).eq('coachId', args.coachId)
      )
      .unique();

    if (!mem) {
      await ctx.db.insert('coachMemory', {
        userId: user._id,
        coachId: args.coachId,
        insights: [],
        patterns: [],
        messageCount: 0,
        updatedAt: now,
      });
    }

    return coachMessageId;
  },
});

// ─── Fallback rule-based persona replies ─────────────────────────────────────

function buildFallbackReply(coachId: string, content: string): string {
  const lower = content.toLowerCase();
  const isStuck = /stuck|overwhelm|anxious|tired|burnout|can't/.test(lower);
  const isGoal = /goal|plan|priority|focus|today|week/.test(lower);

  const fallbacks: Record<string, string[]> = {
    MARCUS: [
      'The Stoics had a name for what you\'re experiencing — it\'s the test. OPERATOR, what is the smallest action you can execute in the next 5 minutes?',
      'Clarity precedes execution. Define the single most important output for today and protect that time block.',
      'Memento mori. Your time is finite. What will you choose to do with the next hour?',
    ],
    AURORA: [
      'Your nervous system needs a reset. Try box breathing: 4 counts in, 4 hold, 4 out, 4 hold. Repeat 4 times, then let\'s plan.',
      'The research on emotional regulation shows naming the feeling reduces its intensity by 50%. What word best describes what you\'re experiencing right now?',
      'Cortisol spikes block creative problem-solving. Let\'s bring your system down first — 3 deep belly breaths, then we map the path forward.',
    ],
    TITAN: [
      'Body first, everything else second. Have you eaten protein in the last 4 hours? Hydrated? Sleep matters — rate last night from 1-10.',
      'Energy management over time management. What\'s your current HRV telling you? If you don\'t know, start tracking it.',
      'The reps don\'t lie. Whatever problem you\'re facing, moving your body for 20 minutes first will change your brain chemistry for the decision.',
    ],
    SAGE: [
      'Run the numbers. What is the cost of inaction here vs the cost of imperfect action? Opportunity cost is the most expensive thing you\'ll never see on a receipt.',
      'Think in systems, not events. What recurring action, done daily, would compound into the outcome you want in 90 days?',
      'Capital — financial, social, or intellectual — follows clarity. Get precise about what you\'re optimizing for.',
    ],
    PHOENIX: [
      'You\'ve already survived 100% of your worst days. This is data, not defeat. What did the last hard chapter teach you that you\'re using right now?',
      'The ashes aren\'t the end — they\'re the fuel. Tell me: what is the smallest thing that would feel like forward movement right now?',
      'Burnout is your body\'s invoice for unpaid rest. Before strategy, before action — what do you actually need right now?',
    ],
    NOVA: [
      'Interesting. What\'s the second-order consequence if this stays exactly as it is for another 90 days? Sometimes making the invisible visible is the whole unlock.',
      'There\'s a concept from jazz improvisation called "playing the space." What would happen if you deliberately did LESS in this area for two weeks?',
      'Systems eat motivation for breakfast. What\'s the structural reason this keeps happening — not the personal failing, but the architecture?',
    ],
  };

  const pool = fallbacks[coachId] ?? fallbacks['MARCUS'];
  if (isStuck) return pool[0];
  if (isGoal) return pool[1];
  return pool[Math.floor(Math.random() * pool.length)];
}
