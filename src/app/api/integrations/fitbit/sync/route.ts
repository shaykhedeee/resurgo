import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const SYSTEM_SECRET = "resurgo_fitness_sync_secret_2026";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
  }

  try {
    // 1. Fetch the user's Fitbit integration from Convex
    const integration = await convex.query(api.userIntegrations.getIntegration, {
      userId: userId as any,
      provider: 'fitbit',
    });

    if (!integration) {
      return NextResponse.json({ error: 'No Fitbit integration found for this user' }, { status: 404 });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // 2. Handle Mock/Simulated sync mode
    if (integration.accessToken === 'mock_fitbit_access_token') {
      const mockSteps = Math.floor(Math.random() * 4000) + 6000; // 6,000 to 10,000 steps
      const mockSleepMinutes = Math.floor(Math.random() * 120) + 380; // 380 to 500 minutes (approx. 6.3 to 8.3 hours)
      const mockSleepQuality = Math.floor(Math.random() * 2) + 3.5; // 3.5 to 5 (quality rating)

      // Sync mock steps to daily nutrition logs
      await convex.mutation(api.nutrition.updateWaterAndStepsServer, {
        userId: userId as any,
        date: todayStr,
        steps: mockSteps,
        secret: SYSTEM_SECRET,
      });

      // Sync mock sleep logs to daily sleep logs
      await convex.mutation(api.sleep.logSleepServer, {
        userId: userId as any,
        date: todayStr,
        durationMinutes: mockSleepMinutes,
        quality: Math.round(mockSleepQuality),
        notes: 'Simulated via Fitbit Synthetic Sync Link.',
        secret: SYSTEM_SECRET,
      });

      return NextResponse.json({
        status: 'success',
        mode: 'simulated',
        synced: {
          steps: mockSteps,
          sleepMinutes: mockSleepMinutes,
          sleepQuality: Math.round(mockSleepQuality),
          date: todayStr,
        }
      });
    }

    // 3. Handle Token Refresh if Expired
    let accessToken = integration.accessToken;
    if (integration.expiresAt && Date.now() > integration.expiresAt) {
      console.log('Fitbit access token expired, refreshing...');
      const clientId = process.env.FITBIT_CLIENT_ID || 'MOCK_FITBIT_CLIENT_ID';
      const clientSecret = process.env.FITBIT_CLIENT_SECRET || 'MOCK_FITBIT_CLIENT_SECRET';
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      const refreshRes = await fetch('https://api.fitbit.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basicAuth}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: integration.refreshToken || '',
        }),
      });

      if (!refreshRes.ok) {
        return NextResponse.json({ error: 'Failed to refresh expired Fitbit token' }, { status: 401 });
      }

      const refreshData = await refreshRes.json() as {
        access_token: string;
        refresh_token?: string;
        expires_in?: number;
      };

      accessToken = refreshData.access_token;
      const expiresAt = refreshData.expires_in ? Date.now() + refreshData.expires_in * 1000 : undefined;

      // Commit new tokens back to Convex
      await convex.mutation(api.userIntegrations.saveIntegration, {
        userId: userId as any,
        provider: 'fitbit',
        accessToken,
        refreshToken: refreshData.refresh_token || integration.refreshToken,
        expiresAt,
        scopes: integration.scopes,
      });
    }

    // 4. Fetch Physical Fitbit steps
    let stepsSynced = 0;
    try {
      const stepsUrl = `https://api.fitbit.com/1/user/-/activities/date/${todayStr}.json`;
      const stepsRes = await fetch(stepsUrl, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (stepsRes.ok) {
        const stepsData = await stepsRes.json() as { summary?: { steps?: number } };
        const steps = stepsData.summary?.steps ?? 0;
        
        await convex.mutation(api.nutrition.updateWaterAndStepsServer, {
          userId: userId as any,
          date: todayStr,
          steps,
          secret: SYSTEM_SECRET,
        });
        stepsSynced = steps;
      }
    } catch (e) {
      console.error('Fitbit steps query failed:', e);
    }

    // 5. Fetch Physical Fitbit sleep
    let sleepMinutesSynced = 0;
    let sleepQualitySynced = 0;
    try {
      const sleepUrl = `https://api.fitbit.com/1.2/user/-/sleep/date/${todayStr}.json`;
      const sleepRes = await fetch(sleepUrl, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (sleepRes.ok) {
        const sleepData = await sleepRes.json() as { sleep?: Array<{ duration?: number; efficiency?: number }> };
        const sleepRecords = sleepData.sleep ?? [];
        if (sleepRecords.length > 0) {
          const sleepRecord = sleepRecords[0];
          const durationMinutes = sleepRecord.duration ? Math.round(sleepRecord.duration / 60000) : 0;
          const efficiencyRating = sleepRecord.efficiency ? Math.round(sleepRecord.efficiency / 20) : 3;

          await convex.mutation(api.sleep.logSleepServer, {
            userId: userId as any,
            date: todayStr,
            durationMinutes,
            quality: efficiencyRating,
            notes: 'Synced via Fitbit Device Link.',
            secret: SYSTEM_SECRET,
          });
          sleepMinutesSynced = durationMinutes;
          sleepQualitySynced = efficiencyRating;
        }
      }
    } catch (e) {
      console.error('Fitbit sleep query failed:', e);
    }

    return NextResponse.json({
      status: 'success',
      synced: {
        steps: stepsSynced,
        sleepMinutes: sleepMinutesSynced,
        sleepQuality: sleepQualitySynced,
        date: todayStr,
      }
    });

  } catch (err) {
    console.error('Fitbit sync route exception:', err);
    return NextResponse.json({ error: 'Internal Server Error', details: String(err) }, { status: 500 });
  }
}
