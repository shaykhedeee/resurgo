#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Telegram Webhook Setup Script
// Registers the webhook URL with Telegram Bot API
// Usage: node scripts/setup-telegram-webhook.js
// ═══════════════════════════════════════════════════════════════════════════════

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://resurgo.life';

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN not set');
  process.exit(1);
}

if (!WEBHOOK_SECRET || WEBHOOK_SECRET.includes('REPLACE_ME')) {
  console.error('❌ TELEGRAM_WEBHOOK_SECRET not set or still placeholder');
  process.exit(1);
}

const webhookUrl = `${APP_URL}/api/telegram/webhook`;

async function main() {
  console.log(`\n🔗 Registering webhook: ${webhookUrl}`);
  console.log(`🔑 Secret token: ${WEBHOOK_SECRET.slice(0, 8)}...${WEBHOOK_SECRET.slice(-8)}`);

  try {
    // Set webhook
    const setUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;
    const res = await fetch(setUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: WEBHOOK_SECRET,
        allowed_updates: ['message', 'callback_query'],
        drop_pending_updates: true,
      }),
    });
    const data = await res.json();

    if (data.ok) {
      console.log('✅ Webhook registered successfully!');
    } else {
      console.error('❌ Failed:', data.description);
      process.exit(1);
    }

    // Verify webhook info
    const infoRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
    const info = await infoRes.json();
    console.log('\n📋 Webhook Info:');
    console.log(`   URL: ${info.result.url}`);
    console.log(`   Pending updates: ${info.result.pending_update_count}`);
    console.log(`   Has secret token: ${info.result.has_custom_certificate ? 'Yes' : 'Configured'}`);
    if (info.result.last_error_message) {
      console.log(`   ⚠️  Last error: ${info.result.last_error_message}`);
    }

    // Set bot commands
    const cmds = [
      { command: 'start', description: 'Link your Resurgo account' },
      { command: 'task', description: 'Add a task — /task Buy groceries' },
      { command: 'habits', description: 'View today\'s habits' },
      { command: 'goals', description: 'View your goals' },
      { command: 'done', description: 'Mark a task done — /done 1' },
      { command: 'remind', description: 'Set a reminder — /remind in 30 minutes Stretch' },
      { command: 'digest', description: 'Get your morning digest' },
      { command: 'motivate', description: 'Get a motivation boost' },
      { command: 'help', description: 'Show all commands' },
    ];
    const cmdRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commands: cmds }),
    });
    const cmdData = await cmdRes.json();
    if (cmdData.ok) {
      console.log(`\n✅ ${cmds.length} bot commands registered!`);
    }

  } catch (err) {
    console.error('❌ Network error:', err);
    process.exit(1);
  }
}

main();
