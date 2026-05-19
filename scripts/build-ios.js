#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — iOS Build Script (Node.js Interface)
// Cross-platform wrapper that invokes the platform-specific bash script
//
// Usage:
//   node scripts/build-ios.js adhoc      # Ad Hoc distribution build
//   node scripts/build-ios.js appstore   # App Store submission build
//   node scripts/build-ios.js enterprise # Enterprise distribution build
//
// Note: Actual iOS builds require macOS with Xcode.
// This script will detect platform and provide helpful error on non-macOS.
// ═══════════════════════════════════════════════════════════════════════════════

const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const distributionMode = process.argv[2] || 'appstore';
const validModes = ['adhoc', 'appstore', 'enterprise'];

if (!validModes.includes(distributionMode)) {
  console.error(`❌ Invalid distribution mode: ${distributionMode}`);
  console.error(`   Valid options: ${validModes.join(', ')}`);
  process.exit(1);
}

const projectRoot = path.resolve(__dirname, '..');
const scriptPath = path.join(__dirname, 'build-ios.sh');

// ─── Platform check ───────────────────────────────────────────────────────────
if (os.platform() !== 'darwin') {
  console.error('');
  console.error('⚠️  iOS builds require macOS with Xcode installed.');
  console.error('');
  console.error('This script is provided for reference and CI/CD on macOS runners.');
  console.error('');
  console.error('To build iOS on your Mac:');
  console.error(`  1. Ensure you have Xcode 15+ and CocoaPods installed`);
  console.error(`  2. Run: chmod +x ${scriptPath}`);
  console.error(`  3. Run: ${scriptPath} ${distributionMode}`);
  console.error('');
  console.error('For Android builds on any platform, use:');
  console.error('  npm run android:build [release]');
  console.error('');
  process.exit(1);
}

// ─── Execute bash script ──────────────────────────────────────────────────────
try {
  console.log('');
  console.log(`🍎 Resurgo iOS Build — ${distributionMode.toUpperCase()}`);
  console.log(`   Script: ${scriptPath}`);
  console.log('');

  execSync(`"${scriptPath}" ${distributionMode}`, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: '/bin/bash',
  });

  console.log('');
  console.log('✅ iOS build script completed successfully');
} catch (error) {
  console.error('');
  console.error('❌ iOS build failed');
  console.error(`   Error: ${error.message}`);
  console.error('');
  process.exit(1);
}
