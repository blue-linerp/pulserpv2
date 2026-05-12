import { NextRequest, NextResponse } from 'next/server';
import { getDiscordLink } from '@/lib/discord-links';

const steamOpenIdEndpoint = 'https://steamcommunity.com/openid/login';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const claimedId = url.searchParams.get('openid.claimed_id');
  const steamId = claimedId?.match(/https:\/\/steamcommunity\.com\/openid\/id\/(\d+)/)?.[1];

  if (!steamId) {
    return NextResponse.redirect(new URL('/login?error=steam_invalid', request.url));
  }

  const verificationParams = new URLSearchParams(url.searchParams);
  verificationParams.set('openid.mode', 'check_authentication');

  const verificationResponse = await fetch(steamOpenIdEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: verificationParams.toString()
  });

  const verificationText = await verificationResponse.text();
  const isValid = verificationText.includes('is_valid:true');

  if (!isValid) {
    return NextResponse.redirect(new URL('/login?error=steam_denied', request.url));
  }

  let username = `Player ${steamId.slice(-5)}`;
  let avatar = '';
  const steamApiKey = process.env.STEAM_API_KEY;
  if (!steamApiKey) {
    console.warn('[steam-auth] STEAM_API_KEY is not set; cannot fetch Steam profile.');
  } else {
    try {
      const profileResponse = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${steamApiKey}&steamids=${steamId}`, { cache: 'no-store' });
      if (!profileResponse.ok) {
        console.warn('[steam-auth] Steam profile request failed', profileResponse.status, await profileResponse.text());
      } else {
        const profileJson = await profileResponse.json();
        const player = profileJson?.response?.players?.[0];
        if (player?.personaname) username = player.personaname;
        if (player?.avatarfull) avatar = player.avatarfull;
        if (!player) console.warn('[steam-auth] No player returned for steamId', steamId, profileJson);
      }
    } catch (error) {
      console.warn('[steam-auth] Unable to fetch Steam profile', error);
    }
  }

  const response = NextResponse.redirect(new URL('/dashboard', request.url));
  const cookieOptions = {
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  };
  response.cookies.set('pulse_steam_id', steamId, { ...cookieOptions, httpOnly: true });
  response.cookies.set('pulse_steam_name', username, cookieOptions);
  if (avatar) response.cookies.set('pulse_steam_avatar', avatar, cookieOptions);
  const discordLink = getDiscordLink(steamId);
  if (discordLink) {
    response.cookies.set('pulse_discord_id', discordLink.discordId, cookieOptions);
    response.cookies.set('pulse_discord_name', discordLink.discordName, cookieOptions);
  }

  return response;
}
