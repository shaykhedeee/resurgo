// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Telegram Webhook
// POST /api/telegram/webhook
// Receives updates from Telegram, authenticates via X-Telegram-Bot-Api-Secret-Token
// Resolves user from telegramChatId, routes commands, replies via Bot API
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { Bot } from 'grammy';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
// import type { Id } from '../../../../../convex/_generated/dataModel';

// ─── Environment ──────────────────────────────────────────────────────────────
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '';
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET ?? '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://resurgo.life';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ─── Convex client (server-to-server, no auth needed for public functions) ────
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? 'http://localhost:3210');

// ─── Telegram Bot ─────────────────────────────────────────────────────────────
// The Bot object is created on first request (lazy initialization)
// This prevents initialization errors during build when BOT_TOKEN is not available
let bot: Bot<any> | null = null;

function initializeBot(): Bot<any> | null {
  if (!BOT_TOKEN || !bot) {
    if (BOT_TOKEN) {
      bot = new Bot(BOT_TOKEN);
      // Register commands only once
      registerCommands(bot);
    }
  }
  return bot;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Send a message using the raw Telegram Bot API (simpler than bot.api for replies) */
async function _reply(chatId: string | number, text: string, parseMode: 'HTML' | 'Markdown' = 'HTML') {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode }),
  });
}

/**
 * Parse natural language relative time into a Unix timestamp.
 * Supports: "in X minutes", "in X hours", "in X days", "tomorrow at HH:mm"
 */
function parseRelativeTime(input: string): number | null {
  const lower = input.toLowerCase().trim();
  const now = Date.now();

  // "in X minutes"
  const minsMatch = lower.match(/in\s+(\d+)\s+min(?:utes?)?/);
  if (minsMatch) return now + parseInt(minsMatch[1], 10) * 60 * 1000;

  // "in X hours"
  const hoursMatch = lower.match(/in\s+(\d+)\s+hours?/);
  if (hoursMatch) return now + parseInt(hoursMatch[1], 10) * 60 * 60 * 1000;

  // "in X days"
  const daysMatch = lower.match(/in\s+(\d+)\s+days?/);
  if (daysMatch) return now + parseInt(daysMatch[1], 10) * 24 * 60 * 60 * 1000;

  // "tomorrow" → next day at 09:00
  if (lower.includes('tomorrow')) {
    const d = new Date(now + 24 * 60 * 60 * 1000);
    const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = parseInt(timeMatch[2] ?? '0', 10);
      if (timeMatch[3] === 'pm' && h < 12) h += 12;
      if (timeMatch[3] === 'am' && h === 12) h = 0;
      d.setHours(h, m, 0, 0);
    } else {
      d.setHours(9, 0, 0, 0);
    }
    return d.getTime();
  }

  return null;
}

/** Format a progress bar string, e.g. "████░░░░░░ 40%" */
function progressBar(value: number, length = 10): string {
  const filled = Math.round((value / 100) * length);
  return '█'.repeat(filled) + '░'.repeat(length - filled) + ` ${value}%`;
}

// ─── Command Registration ─────────────────────────────────────────────────────
/** Register all bot commands - called once on first request */
function registerCommands(botInstance: Bot<any>) {
// ── Command: /start ───────────────────────────────────────────────────────────
botInstance.command('start', async (ctx) => {
  const chatId = ctx.chat.id.toString();
  const username = ctx.from?.username;

  // Check if already linked
  const user = await convex.query(api.telegram.getUserByTelegramChatId, { telegramChatId: chatId });
  if (user) {
    await ctx.reply(
      `✅ <b>Already linked!</b>\n\nWelcome back, ${user.name.split(' ')[0]}.\n\nType /help to see all commands.`,
      { parse_mode: 'HTML' }
    );
    return;
  }

  // Create OTP and send auth link
  const token = await convex.mutation(api.telegram.createOtp, {
    telegramChatId: chatId,
    telegramUsername: username,
  });

  const authUrl = `${APP_URL}/link-telegram?token=${token}`;

  await ctx.reply(
    [
      '👋 <b>Welcome to Resurgo!</b>',
      '',
      'To link your Telegram account, click the button below while logged into Resurgo:',
      '',
      `🔗 <a href="${authUrl}">Link my account →</a>`,
      '',
      '<i>This link expires in 15 minutes. Run /start again if it expires.</i>',
    ].join('\n'),
    { parse_mode: 'HTML' }
  );
});

// ── Command: /task <text> ─────────────────────────────────────────────────────
botInstance.command('task', async (ctx) => {
  const chatId = ctx.chat.id.toString();
  const user = await convex.query(api.telegram.getUserByTelegramChatId, { telegramChatId: chatId });

  if (!user) {
    await ctx.reply('❌ Account not linked. Send /start to connect your Resurgo account.');
    return;
  }

  const taskTitle = ctx.match?.trim();
  if (!taskTitle) {
    await ctx.reply('Usage: <code>/task Buy groceries</code>', { parse_mode: 'HTML' });
    return;
  }

  const _taskId = await convex.mutation(api.telegram.createTaskFromTelegram, {
    userId: user._id,
    title: taskTitle,
  });

  await ctx.reply(
    `✅ Task created!\n\n📋 <b>${taskTitle}</b>\n\n<i>View it at ${APP_URL}/tasks</i>`,
    { parse_mode: 'HTML' }
  );
});

// ── Command: /remind <text> in <time> ────────────────────────────────────────
botInstance.command('remind', async (ctx) => {
  const chatId = ctx.chat.id.toString();
  const user = await convex.query(api.telegram.getUserByTelegramChatId, { telegramChatId: chatId });

  if (!user) {
    await ctx.reply('❌ Account not linked. Send /start to connect your Resurgo account.');
    return;
  }

  const input = ctx.match?.trim() ?? '';

  // Split on "in" or "at" or "tomorrow"
  const timeSep = input.search(/\bin\b|\btomorrow\b/i);
  if (timeSep === -1) {
    await ctx.reply(
      'Usage: <code>/remind Call doctor in 2 hours</code> or <code>/remind Meeting tomorrow at 10am</code>',
      { parse_mode: 'HTML' }
    );
    return;
  }

  const text = input.slice(0, timeSep).trim();
  const timeStr = input.slice(timeSep).trim();
  const remindAt = parseRelativeTime(timeStr);

  if (!remindAt) {
    await ctx.reply(
      'I couldn\'t understand that time. Try:\n• <code>in 30 minutes</code>\n• <code>in 2 hours</code>\n• <code>in 3 days</code>\n• <code>tomorrow at 9am</code>',
      { parse_mode: 'HTML' }
    );
    return;
  }

  await convex.mutation(api.reminders.createReminder, {
    userId: user._id,
    text,
    remindAt,
    source: 'telegram',
    telegramChatId: chatId,
  });

  const readableTime = new Date(remindAt).toLocaleString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  await ctx.reply(
    `⏰ <b>Reminder set!</b>\n\n"${text}"\n\n🕐 ${readableTime}`,
    { parse_mode: 'HTML' }
  );
});

// ── Command: /habits ──────────────────────────────────────────────────────────
botInstance.command('habits', async (ctx) => {
  const chatId = ctx.chat.id.toString();
  const user = await convex.query(api.telegram.getUserByTelegramChatId, { telegramChatId: chatId });

  if (!user) {
    await ctx.reply('❌ Account not linked. Send /start to connect your Resurgo account.');
    return;
  }

  const summary = await convex.query(api.telegram.getUserSummary, { userId: user._id });

  if (summary.habitsToday.length === 0) {
    await ctx.reply(
      `No habits set yet.\n\nCreate habits at <a href="${APP_URL}/habits">${APP_URL}/habits</a>`,
      { parse_mode: 'HTML' }
    );
    return;
  }

  const lines = summary.habitsToday.map(
    (h: any) => `${h.completedToday ? '✅' : '⬜'} ${h.title}`
  );

  const done = summary.habitsToday.filter((h: any) => h.completedToday).length;
  const total = summary.habitsToday.length;

  await ctx.reply(
    [
      `🔥 <b>Habits — Today (${done}/${total})</b>`,
      '',
      lines.join('\n'),
      '',
      `<i>Log completions at ${APP_URL}/habits</i>`,
    ].join('\n'),
    { parse_mode: 'HTML' }
  );
});

// ── Command: /goals ───────────────────────────────────────────────────────────
botInstance.command('goals', async (ctx) => {
  const chatId = ctx.chat.id.toString();
  const user = await convex.query(api.telegram.getUserByTelegramChatId, { telegramChatId: chatId });

  if (!user) {
    await ctx.reply('❌ Account not linked. Send /start to connect your Resurgo account.');
    return;
  }

  const summary = await convex.query(api.telegram.getUserSummary, { userId: user._id });

  if (summary.activeGoals.length === 0) {
    await ctx.reply(
      `No active goals.\n\nSet goals at <a href="${APP_URL}/goals">${APP_URL}/goals</a>`,
      { parse_mode: 'HTML' }
    );
    return;
  }

  const lines = summary.activeGoals.map(
    (g: any) => `🎯 <b>${g.title}</b>\n   ${progressBar(g.progress)}`
  );

  await ctx.reply(
    [
      '🎯 <b>Active Goals</b>',
      '',
      lines.join('\n\n'),
      '',
      `<i>Manage goals at ${APP_URL}/goals</i>`,
    ].join('\n'),
    { parse_mode: 'HTML' }
  );
});

// ── Command: /digest ──────────────────────────────────────────────────────────
botInstance.command('digest', async (ctx) => {
  const chatId = ctx.chat.id.toString();
  const user = await convex.query(api.telegram.getUserByTelegramChatId, { telegramChatId: chatId });

  if (!user) {
    await ctx.reply('❌ Account not linked. Send /start to connect your Resurgo account.');
    return;
  }

  const summary = await convex.query(api.telegram.getUserSummary, { userId: user._id });

  const taskLines = summary.topTasks.length > 0
    ? summary.topTasks.map((t: any, i: number) => `${i + 1}. ${t.title}`).join('\n')
    : 'No pending tasks 🎯';

  const habitLines = summary.habitsToday.length > 0
    ? summary.habitsToday.map((h: any) => `${h.completedToday ? '✅' : '⬜'} ${h.title}`).join('\n')
    : 'No habits yet';

  const goalLines = summary.activeGoals.length > 0
    ? summary.activeGoals.map((g: any) => `• ${g.title} — ${g.progress}%`).join('\n')
    : 'No active goals';

  await ctx.reply(
    [
      `📊 <b>Today's Digest</b>`,
      '',
      '📋 <b>Tasks</b>',
      taskLines,
      '',
      '🔥 <b>Habits</b>',
      habitLines,
      '',
      '🎯 <b>Goals</b>',
      goalLines,
    ].join('\n'),
    { parse_mode: 'HTML' }
  );
});

// ── Command: /stats ───────────────────────────────────────────────────────────
botInstance.command('stats', async (ctx) => {
  const chatId = ctx.chat.id.toString();
  const user = await convex.query(api.telegram.getUserByTelegramChatId, { telegramChatId: chatId });

  if (!user) {
    await ctx.reply('❌ Account not linked. Send /start to connect your Resurgo account.');
    return;
  }

  // Simple reply with a link to the full analytics page
  await ctx.reply(
    [
      `📈 <b>Your Stats</b>`,
      '',
      `👤 ${user.name}`,
      `⭐ Plan: ${user.plan.toUpperCase()}`,
      '',
      `View your full analytics dashboard:`,
      `<a href="${APP_URL}/analytics">${APP_URL}/analytics</a>`,
    ].join('\n'),
    { parse_mode: 'HTML' }
  );
});

// ── Command: /coach <message> ─────────────────────────────────────────────────
botInstance.command('coach', async (ctx) => {
  const chatId = ctx.chat.id.toString();
  const user = await convex.query(api.telegram.getUserByTelegramChatId, { telegramChatId: chatId });

  if (!user) {
    await ctx.reply('❌ Account not linked. Send /start to connect your Resurgo account.');
    return;
  }

  const userMessage = ctx.match?.trim();
  if (!userMessage) {
    await ctx.reply('Usage: <code>/coach I\'m struggling to stay motivated</code>', { parse_mode: 'HTML' });
    return;
  }

  // Get conversation context
  const contextMessages = await convex.mutation(api.telegram.getOrCreateContext, {
    userId: user._id,
    telegramChatId: chatId,
  });

  // Build message history for AI (last 10)
  const history = contextMessages.slice(-10).map((m: any) => ({
    role: m.role,
    content: m.content,
  }));

  // Call Groq (fast, free) for AI coaching response
  let aiReply = '';
  if (GROQ_API_KEY) {
    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          max_tokens: 400,
          messages: [
            {
              role: 'system',
              content: `You are a compassionate but direct life coach for Resurgo, a productivity app. 
User: ${user.name}. Plan: ${user.plan}.
Give concise, actionable advice in 2-4 sentences. Be warm but get to the point.
Format for Telegram (plain text, no markdown).`,
            },
            ...history,
            { role: 'user', content: userMessage },
          ],
        }),
      });
      const groqData = await groqRes.json();
      aiReply = groqData.choices?.[0]?.message?.content ?? '';
    } catch {
      // fall through to fallback
    }
  }

  if (!aiReply) {
    aiReply = 'I hear you. Remember: progress over perfection. What\'s one small step you can take right now?';
  }

  // Save context
  await convex.mutation(api.telegram.appendToContext, {
    telegramChatId: chatId,
    role: 'user',
    content: userMessage,
  });
  await convex.mutation(api.telegram.appendToContext, {
    telegramChatId: chatId,
    role: 'assistant',
    content: aiReply,
  });

  await ctx.reply(`🤖 <b>AI Coach</b>\n\n${aiReply}`, { parse_mode: 'HTML' });
});

// ── Command: /unlink ──────────────────────────────────────────────────────────
botInstance.command('unlink', async (ctx) => {
  const chatId = ctx.chat.id.toString();
  const user = await convex.query(api.telegram.getUserByTelegramChatId, { telegramChatId: chatId });

  if (!user) {
    await ctx.reply('No account is linked to this chat.');
    return;
  }

  await convex.mutation(api.telegram.unlinkTelegram, { clerkId: user.clerkId });
  await ctx.reply('✅ Your Telegram account has been unlinked from Resurgo. Send /start to re-link.');
});

// ── Command: /help ────────────────────────────────────────────────────────────
botInstance.command('help', async (ctx) => {
  await ctx.reply(
    [
      '🤖 <b>Resurgo Bot — Commands</b>',
      '',
      '/start — Link your Resurgo account',
      '/task &lt;text&gt; — Create a new task',
      '/remind &lt;text&gt; in &lt;time&gt; — Set a reminder',
      '/habits — View today\'s habits',
      '/goals — View active goals with progress',
      '/digest — Today\'s full plan snapshot',
      '/coach &lt;message&gt; — Chat with your AI coach',
      '/stats — View your stats',
      '/unlink — Unlink your account',
      '/help — Show this message',
      '',
      `🌐 <a href="${APP_URL}">${APP_URL}</a>`,
    ].join('\n'),
    { parse_mode: 'HTML' }
  );
});

// ── Fallback: handle plain text messages ──────────────────────────────────────
botInstance.on('message:text', async (ctx) => {
  const text = ctx.message.text;
  // Ignore messages that start with / (commands handled above)
  if (text.startsWith('/')) return;

  const chatId = ctx.chat.id.toString();
  const user = await convex.query(api.telegram.getUserByTelegramChatId, { telegramChatId: chatId });

  if (!user) {
    await ctx.reply('Send /start to link your Resurgo account, then use /help to see what I can do!');
    return;
  }

  // Treat plain text as a /coach message
  const userMessage = text.trim();

  let aiReply = '';
  if (GROQ_API_KEY) {
    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          max_tokens: 300,
          messages: [
            {
              role: 'system',
              content: `You are a concise, encouraging AI coach for Resurgo. User: ${user.name}.
Give 1-3 sentences of actionable advice. Use /help to show commands if the user seems lost.`,
            },
            { role: 'user', content: userMessage },
          ],
        }),
      });
      const groqData = await groqRes.json();
      aiReply = groqData.choices?.[0]?.message?.content ?? '';
    } catch {
      // fall through
    }
  }

  if (!aiReply) {
    aiReply = 'Use /help to see all available commands, or visit the app to manage your tasks and habits.';
  }

  await ctx.reply(aiReply);
});
}
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// POST handler — Entry point for Telegram webhook
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. Verify the webhook secret if configured
  if (WEBHOOK_SECRET) {
    const incoming = req.headers.get('x-telegram-bot-api-secret-token');
    if (incoming !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (!BOT_TOKEN) {
    return NextResponse.json({ error: 'Bot not configured' }, { status: 500 });
  }

  // Initialize bot on first request (lazy initialization)
  const botInstance = initializeBot();
  if (!botInstance) {
    console.error('[telegram/webhook] Bot not initialized - TELEGRAM_BOT_TOKEN missing');
    return NextResponse.json({ ok: false, error: 'Bot not configured' }, { status: 500 });
  }

  try {
    const update = await req.json();
    await botInstance.handleUpdate(update);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[telegram/webhook] Error processing update:', err);
    // Always return 200 to Telegram so it doesn't retry spam
    return NextResponse.json({ ok: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET handler — Health check + webhook setup helper
// Returns instructions to register the webhook with Telegram
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  const webhookUrl = `${APP_URL}/api/telegram/webhook`;
  return NextResponse.json({
    status: 'Telegram webhook endpoint active',
    webhookUrl,
    setup: `Register with: https://api.telegram.org/bot<TOKEN>/setWebhook?url=${encodeURIComponent(webhookUrl)}&secret_token=<SECRET>`,
  });
}
