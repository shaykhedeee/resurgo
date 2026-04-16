import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  return NextResponse.json({
    name: 'Resurgo REST API',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      today: {
        'GET /api/v1/today': 'Get tasks, habits, and goals for today',
      },
      tasks: {
        'GET /api/v1/tasks': 'List tasks (optional: ?status=todo|done|in_progress|all)',
        'POST /api/v1/tasks': 'Create a task — body: { title, priority?, dueDate?, energyRequired?, tags? }',
      },
      habits: {
        'GET /api/v1/habits': 'List active habits with streak data',
        'POST /api/v1/habits/log': 'Log habit completion — body: { habitId, date?, completed?, mood?, note? }',
      },
      goals: {
        'GET /api/v1/goals': 'List active goals with progress',
        'POST /api/v1/goals': 'Create a goal — body: { title, category, description?, targetDate?, lifeDomain?, whyImportant? }',
      },
      stats: {
        'GET /api/v1/stats': 'Get dashboard stats (tasks, habits, goals summary)',
      },
    },
    authentication: 'Authorization: Bearer rsg_<your_api_key>',
    keyFormat: 'rsg_<alphanumeric>',
    rateLimit: '100 requests / hour (configurable per key)',
    docs: 'https://resurgo.life/docs/api',
    generated: new Date().toISOString(),
  });
}
