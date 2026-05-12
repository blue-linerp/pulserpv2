import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import type { PriorityTier, UserPriority } from './user-priorities-types';
import { hasSupabaseStorage, readStorageValue, writeStorageValue } from './supabase-storage';

export type { PriorityTier, UserPriority };

// Re-export constants from types file for server-side usage
export { tierWeights, tierQueueBonus } from './user-priorities-types';

const dataDir = path.join(process.cwd(), 'data');
const prioritiesFile = path.join(dataDir, 'user-priorities.json');

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function normalizeSteamId(steamId: string) {
  return steamId.trim().replace(/^steam:/i, '');
}

export function getUserPriorities(): UserPriority[] {
  ensureDir();
  if (!fs.existsSync(prioritiesFile)) {
    fs.writeFileSync(prioritiesFile, JSON.stringify([], null, 2));
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(prioritiesFile, 'utf8')) as UserPriority[];
  } catch {
    return [];
  }
}

export function saveUserPriorities(priorities: UserPriority[]) {
  ensureDir();
  fs.writeFileSync(prioritiesFile, JSON.stringify(priorities, null, 2));
}

export async function saveUserPrioritiesAsync(priorities: UserPriority[]) {
  if (!hasSupabaseStorage()) {
    saveUserPriorities(priorities);
    return;
  }
  await writeStorageValue('user-priorities', priorities);
}

export function getUserPriority(steamId: string): UserPriority | null {
  const priorities = getUserPriorities();
  const normalizedSteamId = normalizeSteamId(steamId);
  const user = priorities.find((p) => normalizeSteamId(p.steamId) === normalizedSteamId);
  if (!user) return null;
  // Check if expired
  if (user.expiresAt && user.expiresAt < Date.now()) {
    return { ...user, tier: 'none' };
  }
  return user;
}

export function setUserPriority(steamId: string, username: string, tier: PriorityTier, source: UserPriority['source'] = 'manual', discordUserId?: string, expiresAt?: number) {
  const normalizedSteamId = normalizeSteamId(steamId);
  const priorities = getUserPriorities();
  const existingIndex = priorities.findIndex((p) => normalizeSteamId(p.steamId) === normalizedSteamId);
  const newPriority: UserPriority = {
    steamId: normalizedSteamId,
    username,
    tier,
    grantedAt: Date.now(),
    expiresAt,
    source,
    discordUserId
  };
  if (existingIndex >= 0) {
    priorities[existingIndex] = newPriority;
  } else {
    priorities.push(newPriority);
  }
  saveUserPriorities(priorities);
  return newPriority;
}

export function removeUserPriority(steamId: string) {
  const normalizedSteamId = normalizeSteamId(steamId);
  const priorities = getUserPriorities();
  const filtered = priorities.filter((p) => normalizeSteamId(p.steamId) !== normalizedSteamId);
  saveUserPriorities(filtered);
}

export function hasActivePriority(steamId: string): boolean {
  const priority = getUserPriority(steamId);
  if (!priority) return false;
  if (priority.expiresAt && priority.expiresAt < Date.now()) return false;
  return priority.tier !== 'none';
}

export function getPriorityTier(steamId: string): PriorityTier {
  const priority = getUserPriority(steamId);
  if (!priority) return 'none';
  if (priority.expiresAt && priority.expiresAt < Date.now()) return 'none';
  return priority.tier;
}

export function clearUserPriorities() {
  saveUserPriorities([]);
}
