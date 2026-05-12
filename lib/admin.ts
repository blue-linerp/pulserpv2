import { redirect } from 'next/navigation';
import { getCurrentUser } from './auth';

const adminRoleIds = [process.env.DISCORD_ROLE_ADMIN_ID, process.env.DISCORD_ROLE_DEV_ID].filter(Boolean) as string[];

async function hasDiscordAdminRole(discordUserId?: string) {
  const token = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!discordUserId || !token || !guildId || adminRoleIds.length === 0) return false;

  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`, {
      headers: { Authorization: `Bot ${token}` },
      cache: 'no-store'
    });
    if (!response.ok) return false;
    const member = await response.json() as { roles?: string[] };
    return adminRoleIds.some((roleId) => member.roles?.includes(roleId));
  } catch {
    return false;
  }
}

export async function isAdmin() {
  const user = await getCurrentUser();
  if (!user) return false;
  return hasDiscordAdminRole(user.discord?.id);
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!(await hasDiscordAdminRole(user.discord?.id))) redirect('/');
  return user;
}
