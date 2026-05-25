import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const userId = searchParams.get('state');

  if (!code || !userId) {
    return NextResponse.json({ error: 'Missing required parameters (code or state)' }, { status: 400 });
  }

  const clientId = process.env.FITBIT_CLIENT_ID || 'MOCK_FITBIT_CLIENT_ID';
  const clientSecret = process.env.FITBIT_CLIENT_SECRET || 'MOCK_FITBIT_CLIENT_SECRET';
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://resurgo.life'}/api/integrations/fitbit/callback`;

  try {
    // Fitbit token exchange requires Authorization: Basic Base64(client_id:client_secret)
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Fitbit token exchange error:', errText);
      // Clean fallback redirect when configuration is absent/mock
      if (clientId === 'MOCK_FITBIT_CLIENT_ID') {
        // Direct sandbox mock simulation trigger for sandbox deployment
        await convex.mutation(api.userIntegrations.saveIntegration, {
          userId: userId as any,
          provider: 'fitbit',
          accessToken: 'mock_fitbit_access_token',
          refreshToken: 'mock_fitbit_refresh_token',
          expiresAt: Date.now() + 3600000,
          scopes: ['activity', 'sleep'],
        });
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resurgo.life';
        return NextResponse.redirect(`${appUrl}/settings?integration=fitbit&status=success&mode=simulated`);
      }
      return NextResponse.json({ error: 'Failed to exchange Fitbit token', details: errText }, { status: 500 });
    }

    const data = await response.json() as {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
      scope?: string;
    };

    const expiresAt = data.expires_in ? Date.now() + data.expires_in * 1000 : undefined;
    const scopes = data.scope ? data.scope.split(' ') : ['activity', 'sleep'];

    // Save token to Convex database using server-side http client
    await convex.mutation(api.userIntegrations.saveIntegration, {
      userId: userId as any,
      provider: 'fitbit',
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
      scopes,
    });

    // Redirect to settings page with success status
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resurgo.life';
    return NextResponse.redirect(`${appUrl}/settings?integration=fitbit&status=success`);
  } catch (err) {
    console.error('Fitbit callback exception:', err);
    return NextResponse.json({ error: 'Internal Server Error', details: String(err) }, { status: 500 });
  }
}
