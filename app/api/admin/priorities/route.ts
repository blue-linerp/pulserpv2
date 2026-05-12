import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { getUserPriorities, setUserPriority } from '@/lib/user-priorities';
import type { PriorityTier } from '@/lib/user-priorities-types';

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  return NextResponse.json({ priorities: getUserPriorities() });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const body = await request.json().catch(() => ({}));
  const steamId = typeof body.steamId === 'string' ? body.steamId.trim() : '';
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const tier: PriorityTier = ['silver', 'gold', 'crimson'].includes(body.tier) ? body.tier : 'silver';

  if (!steamId || !username) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  const priority = setUserPriority(steamId, username, tier, 'manual');
  return NextResponse.json({ priority, priorities: getUserPriorities() });
}
