import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const requestSchema = z.object({
  toolSlug: z.string().trim().min(3).max(80),
  input: z.string().trim().min(5).max(3000),
});

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => ({}));
    const parsed = requestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }

    const { toolSlug, input } = parsed.data;

    // Resolve AI credentials - prioritize Groq which we verified is active/valid
    const hasOpenAI = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('SET_REAL');
    const hasGroq = process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.startsWith('SET_REAL');

    if (!hasOpenAI && !hasGroq) {
      return NextResponse.json({ error: 'No active AI key found (both OpenAI and Groq are unconfigured)' }, { status: 503 });
    }

    const openai = hasOpenAI
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' });

    const modelName = hasOpenAI ? 'gpt-4o-mini' : 'llama-3.3-70b-versatile';

    // Tailor prompts based on the tool slug
    let systemPrompt = '';
    let userPrompt = '';

    switch (toolSlug) {
      case 'free-ai-task-prioritizer':
        systemPrompt = `You are a world-class productivity coach. The user will provide a messy list of tasks. Prioritize them based on the Urgency-Impact Matrix (Eisenhower Matrix). Show a clean, well-structured markdown layout with:
- A clear "Top 3 Focus List" (highest impact)
- A categorized matrix breakdown (High Impact & Urgent, High Impact but Not Urgent, Low Impact but Urgent, Eliminate)
- Short action-oriented instructions.`;
        userPrompt = `Prioritize these tasks:\n\n${input}`;
        break;

      case 'free-brain-dump-to-task-list':
        systemPrompt = `You are an expert organizer. The user will provide a messy brain dump of thoughts, worries, and todo items. Restructure this into a clean, actionable task list in markdown:
- Group tasks logically by context (e.g. Work, Admin, Home, Health)
- Estimate estimated effort for each task (Quick wins < 15 mins, Medium < 1 hr, Deep Work > 1 hr)
- Add clear definitions of done.`;
        userPrompt = `Organize this brain dump:\n\n${input}`;
        break;

      case 'free-ai-goal-planner':
        systemPrompt = `You are an elite business advisor. The user will describe a goal and timeline. Decompose it into a highly actionable roadmap in markdown:
- 3 key Milestones
- Weekly objectives
- Day-by-day action plan for Week 1 (Monday to Friday)
- 2 daily habits that support this goal.`;
        userPrompt = `Decompose this goal:\n\n${input}`;
        break;

      case 'free-habit-streak-calculator':
        systemPrompt = `You are a behavioral psychologist. The user will provide a habit they want to build and their weekly schedule. Analyze their plan and calculate durability in markdown:
- Durability Score (out of 100)
- High-Risk Break Points (specific days/times where the habit is likely to fail)
- Practical triggers and habit stacking suggestions
- Coping strategy when a day is missed (compasionate recovery).`;
        userPrompt = `Calculate habit resilience for:\n\n${input}`;
        break;

      case 'free-weekly-review-generator':
        systemPrompt = `You are an executive performance coach. The user will provide a log of their week. Generate a structured weekly review in markdown:
- Wins (achievements to celebrate)
- Blocks & Friction (what slowed them down)
- Insights & Patterns (what to adjust)
- Top 3 focus areas for next week.`;
        userPrompt = `Generate a weekly review for:\n\n${input}`;
        break;

      case 'free-pomodoro-timer':
        systemPrompt = `You are a focus coach. The user will provide their task and focus duration. Generate a structured focus strategy in markdown:
- Recommended interval breakdown (e.g. 50-10 or 25-5)
- Clear block objectives
- Low-friction task for short breaks (to rest the mind)
- Friction strategy to prevent distractions.`;
        userPrompt = `Generate a focus session strategy for:\n\n${input}`;
        break;

      case 'free-ai-marketing-finder':
        systemPrompt = `You are a startup growth hacker and Product Hunt launch specialist. The user will provide details about their AI startup/product, target audience, and launch timeline. Generate a custom Product Hunt marketing stack and growth playbook in markdown:
- Structured list of the best free Product Hunt marketing tools (e.g., Carrd for landing, Tally for feedback, Canva for images, Typefully for Twitter, Kit for email, snoop for Reddit, etc.) with explanations on how to use them
- A timeline checklist (4 weeks out, 2 weeks out, Launch Day)
- Contextual advice on how to integrate Resurgo's AI life OS to stay organized, stack marketing habits, and track launch targets without streak fatigue.`;
        userPrompt = `Generate a launch playbook and marketing stack for:\n\n${input}`;
        break;

      default:
        return NextResponse.json({ error: `Unknown tool: ${toolSlug}` }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: modelName,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });

    const result = completion.choices[0]?.message.content || 'Error: Could not generate response.';
    return NextResponse.json({ result });

  } catch (err: any) {
    console.error('[tools-run-api] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'AI service unavailable' },
      { status: 500 }
    );
  }
}
