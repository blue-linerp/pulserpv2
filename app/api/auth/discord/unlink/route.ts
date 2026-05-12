import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { removeDiscordLink } from '@/lib/discord-links';

export async function POST() {
  const user = await getCurrentUser();
  if (user) removeDiscordLink(user.steamId);
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('pulse_discord_id');
  response.cookies.delete('pulse_discord_name');
  return response;
}
