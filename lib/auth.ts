import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { mockUser } from './data';

export type SessionUser = {
  steamId: string;
  username: string;
  avatar: string;
  steamIdentifier: string;
  lastLogin: string;
  discord: { id: string; username: string } | null;
  subscriptionTier: string;
  queueRoles: string[];
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const steamId = cookieStore.get('pulse_steam_id')?.value;
  if (!steamId) return null;
  const username = cookieStore.get('pulse_steam_name')?.value || `Player ${steamId.slice(-5)}`;
  const avatar = cookieStore.get('pulse_steam_avatar')?.value || mockUser.avatar;
  const discordId = cookieStore.get('pulse_discord_id')?.value;
  const discordName = cookieStore.get('pulse_discord_name')?.value;
  return {
    steamId,
    username,
    avatar,
    steamIdentifier: `steam:${steamId}`,
    lastLogin: mockUser.lastLogin,
    discord: discordId && discordName ? { id: discordId, username: discordName } : null,
    subscriptionTier: '',
    queueRoles: []
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}
