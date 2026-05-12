import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('pulse_steam_id');
  response.cookies.delete('pulse_steam_name');
  response.cookies.delete('pulse_steam_avatar');
  response.cookies.delete('pulse_discord_id');
  response.cookies.delete('pulse_discord_name');
  return response;
}
