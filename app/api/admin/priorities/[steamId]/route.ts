import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { getUserPriorities, removeUserPriority, setUserPriority } from '@/lib/user-priorities';
import type { PriorityTier } from '@/lib/user-priorities-types';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ steamId: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { steamId } = await params;
  const body = await request.json().catch(() => ({}));
  const tier: PriorityTier = ['silver', 'gold', 'crimson'].includes(body.tier) ? body.tier : 'silver';
  const existing = getUserPriorities().find((priority) => priority.steamId === steamId);
  if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  const priority = setUserPriority(steamId, existing.username, tier, existing.source, existing.discordUserId, existing.expiresAt);
  return NextResponse.json({ priority, priorities: getUserPriorities() });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ steamId: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { steamId } = await params;
  removeUserPriority(steamId);
  return NextResponse.json({ ok: true, priorities: getUserPriorities() });
}
