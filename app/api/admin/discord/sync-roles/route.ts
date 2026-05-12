import { NextRequest, NextResponse } from 'next/server';
import { canUseRoleSyncApi, syncDiscordRoles, type WebsiteRoleKey } from '@/lib/discord-role-sync';

export async function POST(request: NextRequest) {
  if (!(await canUseRoleSyncApi())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const body = await request.json() as { steamId?: string; discordUserId?: string; websiteRoles?: WebsiteRoleKey[] };
  if (!body.steamId || !body.discordUserId) {
    return NextResponse.json({ error: 'steamId and discordUserId are required' }, { status: 400 });
  }
  const result = await syncDiscordRoles({ steamId: body.steamId, discordUserId: body.discordUserId, websiteRoles: body.websiteRoles || [] });
  return NextResponse.json(result, { status: result.ok || result.skipped ? 200 : 502 });
}
