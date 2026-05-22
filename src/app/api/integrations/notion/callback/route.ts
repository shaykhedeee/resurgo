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

  const clientId = process.env.NOTION_CLIENT_ID;
  const clientSecret = process.env.NOTION_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://resurgo.life'}/api/integrations/notion/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Notion OAuth configuration missing on server' }, { status: 500 });
  }

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Notion token exchange error:', errText);
      return NextResponse.json({ error: 'Failed to exchange token', details: errText }, { status: 500 });
    }

    const data = await response.json() as {
      access_token: string;
      workspace_name?: string;
      workspace_icon?: string;
      workspace_id?: string;
      owner?: any;
    };

    // Save token to Convex database
    await convex.mutation(api.userIntegrations.saveIntegration, {
      userId: userId as any,
      provider: 'notion',
      accessToken: data.access_token,
      scopes: ['notion_integration'],
      settings: {
        workspaceName: data.workspace_name,
        workspaceIcon: data.workspace_icon,
        workspaceId: data.workspace_id,
      },
    });

    // Redirect to settings page with success
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://resurgo.life';
    return NextResponse.redirect(`${appUrl}/settings?integration=notion&status=success`);
  } catch (err) {
    console.error('Notion callback exception:', err);
    return NextResponse.json({ error: 'Internal Server Error', details: String(err) }, { status: 500 });
  }
}
