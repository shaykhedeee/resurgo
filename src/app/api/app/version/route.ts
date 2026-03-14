// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — /api/app/version
// Returns the latest APK version info for the native Android app to check
// for self-updates. The native app polls this endpoint on launch.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

/** Current release metadata — bump these when publishing a new APK */
const CURRENT_VERSION = {
  version: '1.0.0',
  versionCode: 1,
  minAndroidVersion: '8.0',
  releaseDate: '2026-03-10',
  downloadUrl: 'https://resurgo.life/downloads/resurgo-latest.apk',
  releaseNotes: [
    'Initial Android release',
    'Native FCM push notifications (morning digest, reminders, coaching)',
    'Haptic feedback on habit completion',
    'Full dashboard access via WebView',
    '8 AI coach personas with context memory',
  ],
  size: '4.2 MB',
  sha256: 'pending-upload', // TODO: Run after APK build: Get-FileHash resurgo-latest.apk -Algorithm SHA256 | Select-Object Hash
  // Then copy APK to /public/downloads/resurgo-latest.apk and update this value.
  githubReleasesUrl: 'https://github.com/shaykhedeee/resurgo/releases/latest',
};

export function GET() {
  return NextResponse.json(CURRENT_VERSION, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
