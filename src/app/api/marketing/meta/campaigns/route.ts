// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Meta Marketing API: Campaigns Route
// GET: list campaigns  |  POST: create campaign
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import {
  listCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  getResurgoCampaignTemplates,
} from '@/lib/marketing/meta-api';

// Only admin users can manage campaigns
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'shaykhede2005@gmail.com').split(',').map(e => e.trim());

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!email || !ADMIN_EMAILS.includes(email)) {
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('id');

    if (campaignId) {
      const campaign = await getCampaign(campaignId);
      return NextResponse.json({ campaign });
    }

    const campaigns = await listCampaigns();
    return NextResponse.json({ campaigns: campaigns.data, paging: campaigns.paging });
  } catch (error) {
    console.error('[Meta Campaigns GET]', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await req.json();
    const { action, ...params } = body;

    switch (action) {
      case 'create': {
        const result = await createCampaign(params);
        return NextResponse.json({ id: result.id, success: true });
      }

      case 'update': {
        const { campaignId, ...updates } = params;
        if (!campaignId) {
          return NextResponse.json({ error: 'campaignId required' }, { status: 400 });
        }
        const result = await updateCampaign(campaignId, updates);
        return NextResponse.json({ success: result.success });
      }

      case 'create_from_template': {
        const templates = getResurgoCampaignTemplates();
        const templateKey = params.template as keyof typeof templates;
        const template = templates[templateKey];
        if (!template) {
          return NextResponse.json(
            { error: `Unknown template: ${templateKey}. Available: ${Object.keys(templates).join(', ')}` },
            { status: 400 }
          );
        }
        const result = await createCampaign({
          ...template,
          status: 'PAUSED', // Always create paused for safety
        });
        return NextResponse.json({ id: result.id, template: templateKey, success: true });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Use: create, update, create_from_template` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Meta Campaigns POST]', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
