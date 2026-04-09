// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Meta Marketing API: Custom Audiences Route
// GET: list audiences  |  POST: create/manage audiences
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import {
  listCustomAudiences,
  createCustomAudience,
  addUsersToAudience,
  createWebsiteAudience,
  getResurgoTargetingPresets,
} from '@/lib/marketing/meta-api';

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
    const presets = searchParams.get('presets') === 'true';

    if (presets) {
      return NextResponse.json({ presets: getResurgoTargetingPresets() });
    }

    const audiences = await listCustomAudiences();
    return NextResponse.json({ audiences: audiences.data, paging: audiences.paging });
  } catch (error) {
    console.error('[Meta Audiences GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch audiences' },
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
        const result = await createCustomAudience(params);
        return NextResponse.json({ id: result.id, success: true });
      }

      case 'add_users': {
        const { audienceId, emails } = params;
        if (!audienceId || !emails?.length) {
          return NextResponse.json(
            { error: 'audienceId and emails[] required' },
            { status: 400 }
          );
        }
        const result = await addUsersToAudience(audienceId, emails);
        return NextResponse.json({
          audience_id: result.audience_id,
          received: result.num_received,
          invalid: result.num_invalid_entries,
          success: true,
        });
      }

      case 'create_website_audience': {
        const result = await createWebsiteAudience(params);
        return NextResponse.json({ id: result.id, success: true });
      }

      case 'create_retargeting': {
        // Pre-built retargeting audiences for Resurgo
        const pixelId = process.env.META_PIXEL_ID || '';
        const audiences = [];

        // All site visitors (30 days)
        const allVisitors = await createWebsiteAudience({
          name: 'Resurgo — All Site Visitors (30d)',
          description: 'All website visitors in the past 30 days',
          retention_days: 30,
          rule: {
            inclusions: {
              operator: 'or',
              rules: [
                {
                  event_sources: [{ id: pixelId, type: 'pixel' }],
                  retention_seconds: 30 * 24 * 60 * 60,
                  filter: { operator: 'or', filters: [{ field: 'url', operator: 'i_contains', value: 'resurgo.life' }] },
                },
              ],
            },
          },
        });
        audiences.push({ name: 'All Site Visitors (30d)', id: allVisitors.id });

        // Pricing page visitors (14 days) — high intent
        const pricingVisitors = await createWebsiteAudience({
          name: 'Resurgo — Pricing Visitors (14d)',
          description: 'Visited pricing page in the past 14 days',
          retention_days: 14,
          rule: {
            inclusions: {
              operator: 'or',
              rules: [
                {
                  event_sources: [{ id: pixelId, type: 'pixel' }],
                  retention_seconds: 14 * 24 * 60 * 60,
                  filter: { operator: 'or', filters: [{ field: 'url', operator: 'i_contains', value: '/pricing' }] },
                },
              ],
            },
          },
        });
        audiences.push({ name: 'Pricing Visitors (14d)', id: pricingVisitors.id });

        // Blog readers (60 days)
        const blogReaders = await createWebsiteAudience({
          name: 'Resurgo — Blog Readers (60d)',
          description: 'Visited blog pages in the past 60 days',
          retention_days: 60,
          rule: {
            inclusions: {
              operator: 'or',
              rules: [
                {
                  event_sources: [{ id: pixelId, type: 'pixel' }],
                  retention_seconds: 60 * 24 * 60 * 60,
                  filter: { operator: 'or', filters: [{ field: 'url', operator: 'i_contains', value: '/blog' }] },
                },
              ],
            },
          },
        });
        audiences.push({ name: 'Blog Readers (60d)', id: blogReaders.id });

        return NextResponse.json({ audiences, success: true });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Use: create, add_users, create_website_audience, create_retargeting` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Meta Audiences POST]', error);
    return NextResponse.json(
      { error: 'Audience operation failed' },
      { status: 500 }
    );
  }
}
