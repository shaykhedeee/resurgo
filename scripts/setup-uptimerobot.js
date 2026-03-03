#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RESURGO — UptimeRobot Monitoring Setup
 * Configures UptimeRobot to monitor the Resurgo health endpoint
 * 
 * API Keys:
 * - Main: u3344698-2d524904b7d148634b0a406a
 * - Read-only: ur3344698-71374e8890c90c189a400830
 * - Monitor: m802469450-022b656ca4ac87708d715c5f
 * 
 * To use this script:
 * 1. npm install node-fetch (or use native fetch in Node 18+)
 * 2. Set UPTIMEROBOT_API_KEY environment variable
 * 3. Run: node scripts/setup-uptimerobot.js
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const UPTIMEROBOT_API_KEY = process.env.UPTIMEROBOT_API_KEY || 'u3344698-2d524904b7d148634b0a406a';
const BASE_URL = 'https://api.uptimerobot.com/v2';
const HEALTH_ENDPOINT = 'https://resurgo.life/api/health';

async function createMonitor() {
  console.log('\n🔧 [UptimeRobot] Creating health check monitor...\n');

  const params = new URLSearchParams();
  params.append('api_key', UPTIMEROBOT_API_KEY);
  params.append('type', '1'); // 1 = HTTP
  params.append('url', HEALTH_ENDPOINT);
  params.append('friendly_name', 'Resurgo Health Check');
  params.append('interval', '300'); // 5 minutes

  try {
    const response = await fetch(`${BASE_URL}/monitorNew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.stat === 'ok') {
      console.log('✅ Monitor created successfully!');
      console.log(`   Monitor ID: ${data.data.monitor.id}`);
      console.log(`   URL: ${HEALTH_ENDPOINT}`);
      console.log(`   Interval: 5 minutes`);
      console.log(`   Status: ${data.data.monitor.status}`);
      return data.data.monitor.id;
    } else {
      console.error('❌ Failed to create monitor:');
      console.error(`   Error: ${data.error.message}`);
      return null;
    }
  } catch (err) {
    console.error('❌ API request failed:', err.message);
    return null;
  }
}

async function listMonitors() {
  console.log('\n📋 [UptimeRobot] Fetching existing monitors...\n');

  const params = new URLSearchParams();
  params.append('api_key', UPTIMEROBOT_API_KEY);
  params.append('format', 'json');

  try {
    const response = await fetch(`${BASE_URL}/getMonitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.stat === 'ok' && data.data.monitors.length > 0) {
      console.log(`Found ${data.data.monitors.length} monitor(s):\n`);
      data.data.monitors.forEach((monitor) => {
        const statusColor = monitor.status === 2 ? '🟢' : '🔴';
        console.log(`  ${statusColor} ${monitor.friendly_name}`);
        console.log(`     URL: ${monitor.url}`);
        console.log(`     Status: ${monitor.status === 2 ? 'UP' : 'DOWN'}`);
        console.log(`     Uptime: ${monitor.all_time_uptime}%\n`);
      });
    } else {
      console.log('No monitors found.');
    }
  } catch (err) {
    console.error('❌ Failed to fetch monitors:', err.message);
  }
}

// Main execution
async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🛡️  RESURGO — UptimeRobot Monitoring Setup');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await listMonitors();
  const monitorId = await createMonitor();

  if (monitorId) {
    console.log('\n✨ Monitoring configured. Health endpoint will be checked every 5 minutes.');
    console.log('   Dashboard: https://uptimerobot.com/dashboard');
  }
}

main().catch(console.error);
