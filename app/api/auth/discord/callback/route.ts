import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { saveDiscordLink } from '@/lib/discord-links';
import { syncDiscordRoles } from '@/lib/discord-role-sync';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  if (!code || !clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/profile?error=discord_failed', request.url));
  }

  const redirectUri = process.env.DISCORD_REDIRECT_URI || `${request.nextUrl.origin}/api/auth/discord/callback`;
  let tokenJson: { access_token?: string } = {};
  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      }).toString()
    });
    if (!tokenResponse.ok) {
      console.warn('[discord-auth] Token exchange failed', tokenResponse.status, await tokenResponse.text());
      return NextResponse.redirect(new URL('/profile?error=discord_failed', request.url));
    }
    tokenJson = await tokenResponse.json();
  } catch (error) {
    console.warn('[discord-auth] Token exchange error', error);
    return NextResponse.redirect(new URL('/profile?error=discord_failed', request.url));
  }

  if (!tokenJson.access_token) {
    return NextResponse.redirect(new URL('/profile?error=discord_failed', request.url));
  }

  let userJson: { id?: string; username?: string; global_name?: string; discriminator?: string } = {};
  try {
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` }
    });
    if (!userResponse.ok) {
      console.warn('[discord-auth] User fetch failed', userResponse.status, await userResponse.text());
      return NextResponse.redirect(new URL('/profile?error=discord_failed', request.url));
    }
    userJson = await userResponse.json();
  } catch (error) {
    console.warn('[discord-auth] User fetch error', error);
    return NextResponse.redirect(new URL('/profile?error=discord_failed', request.url));
  }

  if (!userJson.id || !userJson.username) {
    return NextResponse.redirect(new URL('/profile?error=discord_failed', request.url));
  }

  const displayName = userJson.global_name || (userJson.discriminator && userJson.discriminator !== '0' ? `${userJson.username}#${userJson.discriminator}` : userJson.username);
  const currentUser = await getCurrentUser();
  if (currentUser) {
    saveDiscordLink(currentUser.steamId, userJson.id, displayName);
    await syncDiscordRoles({ steamId: currentUser.steamId, discordUserId: userJson.id });
  }
  const response = NextResponse.redirect(new URL('/profile', request.url));
  const cookieOptions = {
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  };
  response.cookies.set('pulse_discord_id', userJson.id, cookieOptions);
  response.cookies.set('pulse_discord_name', displayName, cookieOptions);
  return response;
}
