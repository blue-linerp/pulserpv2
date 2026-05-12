import 'server-only';
import { isAdmin } from './admin';
import { getUserPriority } from './user-priorities';
import type { PriorityTier } from './user-priorities-types';

export type WebsiteRoleKey = 'admin' | 'dev' | 'staff' | 'member' | 'allowlisted' | 'bronze' | 'gold' | 'diamond';

const roleEnvMap: Record<WebsiteRoleKey, string> = {
  admin: 'DISCORD_ROLE_ADMIN_ID',
  dev: 'DISCORD_ROLE_DEV_ID',
  staff: 'DISCORD_ROLE_STAFF_ID',
  member: 'DISCORD_ROLE_MEMBER_ID',
  allowlisted: 'DISCORD_ROLE_ALLOWLISTED_ID',
  bronze: 'DISCORD_ROLE_QUEUE_BRONZE_ID',
  gold: 'DISCORD_ROLE_QUEUE_GOLD_ID',
  diamond: 'DISCORD_ROLE_QUEUE_DIAMOND_ID'
};

export type DiscordRoleSyncInput = {
  steamId: string;
  discordUserId: string;
  websiteRoles?: WebsiteRoleKey[];
};

function configuredRoleIds() {
  return Object.values(roleEnvMap).map((envKey) => process.env[envKey]).filter(Boolean) as string[];
}

function roleId(role: WebsiteRoleKey) {
  return process.env[roleEnvMap[role]];
}

export function getWebsiteRolesForSteamUser(steamId: string, extraRoles: WebsiteRoleKey[] = []): WebsiteRoleKey[] {
  const roles = new Set<WebsiteRoleKey>(['member', ...extraRoles]);
  const priority = getUserPriority(steamId);
  if (priority?.tier === 'silver') roles.add('bronze');
  if (priority?.tier === 'gold') roles.add('gold');
  if (priority?.tier === 'crimson') roles.add('diamond');
  return Array.from(roles);
}

export async function syncDiscordRoles({ steamId, discordUserId, websiteRoles = [] }: DiscordRoleSyncInput) {
  const token = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!token || !guildId) {
    return { ok: false, skipped: true, reason: 'Discord bot token or guild id is not configured.' };
  }

  const desiredRoles = getWebsiteRolesForSteamUser(steamId, websiteRoles);
  const desiredRoleIds = desiredRoles.map(roleId).filter(Boolean) as string[];
  const managedRoleIds = configuredRoleIds();

  const memberResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`, {
    headers: { Authorization: `Bot ${token}` }
  });

  if (!memberResponse.ok) {
    return { ok: false, skipped: false, reason: `Discord member lookup failed with status ${memberResponse.status}.` };
  }

  const member = await memberResponse.json() as { roles?: string[] };
  const existingRoles = new Set(member.roles || []);
  for (const managedRoleId of managedRoleIds) existingRoles.delete(managedRoleId);
  for (const desiredRoleId of desiredRoleIds) existingRoles.add(desiredRoleId);

  const updateResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ roles: Array.from(existingRoles) })
  });

  if (!updateResponse.ok) {
    return { ok: false, skipped: false, reason: `Discord role update failed with status ${updateResponse.status}.` };
  }

  return { ok: true, skipped: false, roles: desiredRoles };
}

export async function getDiscordPriorityTier(discordUserId?: string): Promise<PriorityTier | null> {
  const token = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!discordUserId || !token || !guildId) return null;

  try {
    const memberResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`, {
      headers: { Authorization: `Bot ${token}` },
      cache: 'no-store'
    });
    if (!memberResponse.ok) return null;
    const member = await memberResponse.json() as { roles?: string[] };
    const roles = member.roles || [];
    if (process.env.DISCORD_ROLE_QUEUE_DIAMOND_ID && roles.includes(process.env.DISCORD_ROLE_QUEUE_DIAMOND_ID)) return 'crimson';
    if (process.env.DISCORD_ROLE_QUEUE_GOLD_ID && roles.includes(process.env.DISCORD_ROLE_QUEUE_GOLD_ID)) return 'gold';
    if (process.env.DISCORD_ROLE_QUEUE_BRONZE_ID && roles.includes(process.env.DISCORD_ROLE_QUEUE_BRONZE_ID)) return 'silver';
    return 'none';
  } catch {
    return null;
  }
}

export async function canUseRoleSyncApi() {
  return isAdmin();
}
