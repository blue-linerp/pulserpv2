import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { getPriorityTier } from '@/lib/user-priorities';
import { getDiscordPriorityTier } from '@/lib/discord-role-sync';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user });
  const priorityTier = await getDiscordPriorityTier(user.discord?.id) ?? getPriorityTier(user.steamId);
  const admin = await isAdmin();
  return NextResponse.json({ user: { ...user, isAdmin: admin, priorityTier, queueRoles: priorityTier === 'none' ? [] : [priorityTier] } });
}
