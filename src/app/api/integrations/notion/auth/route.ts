import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
  }

  const clientId = process.env.NOTION_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://resurgo.life'}/api/integrations/notion/callback`;

  if (!clientId) {
    return NextResponse.json({ error: 'Notion Client ID not configured' }, { status: 500 });
  }

  const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}&state=${userId}`;

  return NextResponse.redirect(authUrl);
}
