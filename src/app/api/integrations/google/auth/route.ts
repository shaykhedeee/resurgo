import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://resurgo.life'}/api/integrations/google/callback`;

  if (!clientId) {
    return NextResponse.json({ error: 'Google Client ID not configured' }, { status: 500 });
  }

  // Construct Google OAuth URL requesting offline access to retrieve refresh tokens
  const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events');
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&access_type=offline&prompt=consent&state=${userId}`;

  return NextResponse.redirect(authUrl);
}
