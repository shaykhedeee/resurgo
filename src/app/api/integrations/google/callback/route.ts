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

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://resurgo.life'}/api/integrations/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Google OAuth configuration missing on server' }, { status: 500 });
  }

  try {
    // Exchange authorization code for tokens
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Google token exchange error:', errText);
      return NextResponse.json({ error: 'Failed to exchange token', details: errText }, { status: 500 });
    }

    const data = await response.json() as {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
      scope?: string;
    };

    const expiresAt = data.expires_in ? Date.now() + data.expires_in * 1000 : undefined;
    const scopes = data.scope ? data.scope.split(' ') : ['https://www.googleapis.com/auth/calendar'];

    // Save token to Convex database using server-side http client
    await convex.mutation(api.userIntegrations.saveIntegration, {
      userId: userId as any,
      provider: 'google',
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
      scopes,
    });

    // Redirect to dashboard settings page with success status
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resurgo.life';
    return NextResponse.redirect(`${appUrl}/settings?integration=google&status=success`);
  } catch (err) {
    console.error('Google callback exception:', err);
    return NextResponse.json({ error: 'Internal Server Error', details: String(err) }, { status: 500 });
  }
}
