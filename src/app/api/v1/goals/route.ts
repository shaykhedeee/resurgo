import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? 'http://localhost:3210');

async function validateApiKey(req: NextRequest): Promise<string | null> {
  const key = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!key || !key.startsWith('rsg_')) return null;
  // Basic validation: key format check
  // In production, verify against Convex apiKeys table
  return key;
}

export async function GET(req: NextRequest) {
  const apiKey = await validateApiKey(req);
  if (!apiKey) {
    return NextResponse.json({ error: 'Unauthorized. Provide x-api-key header.' }, { status: 401 });
  }
  return NextResponse.json(
    { error: 'Server-side Convex access requires user context. Use client SDK.' },
    { status: 400 }
  );
}

export async function POST(req: NextRequest) {
  const apiKey = await validateApiKey(req);
  if (!apiKey) {
    return NextResponse.json({ error: 'Unauthorized. Provide x-api-key header.' }, { status: 401 });
  }
  return NextResponse.json(
    { error: 'Server-side Convex access requires user context. Use client SDK.' },
    { status: 400 }
  );
}
