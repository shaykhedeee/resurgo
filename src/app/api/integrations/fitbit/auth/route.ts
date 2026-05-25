import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
  }

  const clientId = process.env.FITBIT_CLIENT_ID || 'MOCK_FITBIT_CLIENT_ID';
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://resurgo.life'}/api/integrations/fitbit/callback`;

  // Request scopes: activity (steps) and sleep (duration + quality)
  const scope = encodeURIComponent('activity sleep settings profile');
  
  // Construct Fitbit OAuth2 auth URL
  const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&expires_in=31536000&state=${userId}`;

  return NextResponse.redirect(authUrl);
}
