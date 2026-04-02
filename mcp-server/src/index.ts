#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════════
// Resurgo MCP Server
// Exposes your Resurgo life operating system as MCP tools for AI agents,
// editors (Cursor, VS Code), and Claude Desktop.
//
// Setup:
//   1. Generate an API key at resurgo.life/settings/api
//   2. Set RESURGO_API_KEY=rsg_xxx RESURGO_BASE_URL=https://resurgo.life
//   3. Add to your MCP client config (see README.md)
// ═══════════════════════════════════════════════════════════════════════════════

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const API_KEY = process.env.RESURGO_API_KEY ?? '';
const BASE_URL = (process.env.RESURGO_BASE_URL ?? 'https://resurgo.life').replace(/\/$/, '');

if (!API_KEY) {
  console.error('[resurgo-mcp] RESURGO_API_KEY is not set. Generate a key at resurgo.life/settings/api');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// HTTP helper — calls Resurgo REST API v1
// ─────────────────────────────────────────────────────────────────────────────
async function apiCall(
  method: 'GET' | 'POST' | 'PATCH',
  path: string,
  body?: Record<string, unknown>,
): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Resurgo API error ${res.status}: ${text}`);
  }
  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// MCP Server setup
// ─────────────────────────────────────────────────────────────────────────────
const server = new Server(
  { name: 'resurgo', version: '1.0.0' },
  { capabilities: { tools: {} } },
);

// ─────────────────────────────────────────────────────────────────────────────
// Tool definitions
// ─────────────────────────────────────────────────────────────────────────────
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'resurgo_get_today_plan',
      description: "Get the user's complete today plan: open tasks, active habits, and current goals. Call this first to understand the user's current focus.",
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'resurgo_get_tasks',
      description: 'List tasks. Optional status filter: todo (default), done, or all.',
      inputSchema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['todo', 'done', 'all'],
            description: 'Filter tasks by completion status. Defaults to todo.',
          },
        },
      },
    },
    {
      name: 'resurgo_add_task',
      description: "Add a task to the user's Resurgo. Use this when the user asks you to remember something, add a todo, or capture a task.",
      inputSchema: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', description: 'Task title (required)' },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high', 'urgent'],
            description: 'Priority level. Default: medium',
          },
          dueDate: { type: 'string', description: 'ISO date string (YYYY-MM-DD)' },
          energyRequired: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            description: 'Energy required to complete the task',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Optional tags for categorization',
          },
        },
      },
    },
    {
      name: 'resurgo_get_goals',
      description: "Get the user's active goals with progress percentages.",
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'resurgo_get_habits',
      description: "Get the user's active daily habits with streak data.",
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'resurgo_simplify_today',
      description: "Surface only the single most important task, habit, and goal for today. Use when the user is overwhelmed or asks 'what's the one thing I should do?'",
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'resurgo_process_brain_dump',
      description: "Take a stream-of-consciousness brain dump from the user and turn it into structured tasks. Use when the user has a lot on their mind and wants to capture it all.",
      inputSchema: {
        type: 'object',
        required: ['text'],
        properties: {
          text: {
            type: 'string',
            description: "The user's raw brain dump text. Can be any length, any format.",
          },
        },
      },
    },
    {
      name: 'resurgo_plan_day',
      description: "Generate a day plan summary using the user's current tasks, habits, and goals. Use when the user asks to plan their day or review what's ahead.",
      inputSchema: { type: 'object', properties: {} },
    },
  ],
}));

// ─────────────────────────────────────────────────────────────────────────────
// Tool handlers
// ─────────────────────────────────────────────────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'resurgo_get_today_plan': {
        const data = await apiCall('GET', '/today');
        return {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        };
      }

      case 'resurgo_get_tasks': {
        const status = (args as Record<string, string>)?.status ?? 'todo';
        const data = await apiCall('GET', `/tasks?status=${status}`);
        return {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        };
      }

      case 'resurgo_add_task': {
        const { title, priority, dueDate, energyRequired, tags } = args as Record<string, unknown>;
        const data = await apiCall('POST', '/tasks', { title, priority, dueDate, energyRequired, tags });
        return {
          content: [{ type: 'text', text: `Task created: ${JSON.stringify(data)}` }],
        };
      }

      case 'resurgo_get_goals': {
        const data = await apiCall('GET', '/goals');
        return {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        };
      }

      case 'resurgo_get_habits': {
        const data = await apiCall('GET', '/habits');
        return {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        };
      }

      case 'resurgo_simplify_today': {
        const data = (await apiCall('GET', '/today')) as {
          tasks?: Array<{ title: string }>;
          habits?: Array<{ title: string; streakCurrent?: number }>;
          goals?: Array<{ title: string; progress?: number }>;
        };
        const topTask = data.tasks?.[0];
        const topHabit = data.habits?.[0];
        const topGoal = data.goals?.[0];
        const simplified = {
          message: "One thing at a time. Here's what matters most today:",
          task: topTask ? topTask.title : 'No open tasks',
          habit: topHabit ? `${topHabit.title}${topHabit.streakCurrent ? ` (${topHabit.streakCurrent}d streak)` : ''}` : 'No active habits',
          goal: topGoal ? `${topGoal.title}${topGoal.progress !== undefined ? ` — ${topGoal.progress}% complete` : ''}` : 'No active goals',
        };
        return {
          content: [{ type: 'text', text: JSON.stringify(simplified, null, 2) }],
        };
      }

      case 'resurgo_process_brain_dump': {
        const { text } = args as { text: string };
        // Parse brain dump into action items using simple heuristics
        const lines = text
          .split(/[\n.!?]+/)
          .map((l) => l.trim())
          .filter((l) => l.length > 3 && l.length < 200);
        const tasks: string[] = [];
        const maybeHabits: string[] = [];
        const habitKeywords = /every day|daily|each morning|each night|routine|habit|always|every week/i;
        for (const line of lines) {
          if (habitKeywords.test(line)) {
            maybeHabits.push(line);
          } else {
            tasks.push(line);
          }
        }
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              captured: lines.length,
              tasks,
              suggestedHabits: maybeHabits,
              note: 'Review these with your coach at resurgo.life/coach to finalize.',
            }, null, 2),
          }],
        };
      }

      case 'resurgo_plan_day': {
        const data = (await apiCall('GET', '/today')) as {
          date?: string;
          tasks?: Array<{ title: string; priority?: string }>;
          habits?: Array<{ title: string; streakCurrent?: number }>;
          goals?: Array<{ title: string; progress?: number }>;
        };
        const highPriority = (data.tasks ?? []).filter((t) => t.priority === 'urgent' || t.priority === 'high');
        const plan = {
          date: data.date,
          focus: highPriority[0]?.title ?? data.tasks?.[0]?.title ?? 'Free day — set a focus in Resurgo',
          taskCount: data.tasks?.length ?? 0,
          habitCount: data.habits?.length ?? 0,
          topGoal: data.goals?.[0]?.title ?? 'No active goal',
          topGoalProgress: data.goals?.[0]?.progress ?? 0,
          recommendation: highPriority.length > 0
            ? `Start with your high-priority task: "${highPriority[0].title}"`
            : 'All clear — pick your hardest task and do it first.',
        };
        return {
          content: [{ type: 'text', text: JSON.stringify(plan, null, 2) }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (err) {
    return {
      content: [{ type: 'text', text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
      isError: true,
    };
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[resurgo-mcp] Server running on stdio');
}

main().catch((err) => {
  console.error('[resurgo-mcp] Fatal error:', err);
  process.exit(1);
});
