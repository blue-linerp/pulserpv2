import { getServerStatuses } from './fivem';
import type { PriorityTier } from './user-priorities-types';
import { tierWeights, tierQueueBonus } from './user-priorities-types';

export type QueueType = 'regular' | 'priority' | 'whitelist';

export type QueueSession = {
  server: string;
  queueType: QueueType;
  joinedAt: number;
};

export const queueTypes: { key: QueueType; label: string; description: string; requiredRole?: string; priorityWeight: number }[] = [
  { key: 'regular', label: 'Regular Queue', description: 'Standard queue for all eligible Pulse RP players.', priorityWeight: 1 },
  { key: 'priority', label: 'Priority Queue', description: 'Faster queue lane for active subscription and priority role holders.', requiredRole: 'Bronze, Gold, or Diamond', priorityWeight: 3 },
  { key: 'whitelist', label: 'Allowlist Queue', description: 'Dedicated lane for allowlisted community members.', requiredRole: 'Allowlist Approved', priorityWeight: 2 }
];

export function createQueueSession(server: string, queueType: QueueType): QueueSession {
  return { server, queueType, joinedAt: Date.now() };
}

export async function getQueueProgress(session: QueueSession, maxPlayers?: number, userTier: PriorityTier = 'none') {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - session.joinedAt) / 1000));
  const servers = await getServerStatuses(maxPlayers);
  const server = servers.find((entry) => entry.key === session.server);
  const max = maxPlayers ?? server?.max ?? 64;
  const players = server?.players ?? 0;
  const online = server?.online ?? false;

  const tierBonus = tierQueueBonus[userTier];
  const userWeight = tierWeights[userTier];

  // Calculate overflow (players above max)
  const overflow = Math.max(0, players - max);

  // Base queue type weight
  const queueTypeWeight = queueTypes.find((type) => type.key === session.queueType)?.priorityWeight ?? 1;

  // Combined weight: user priority + queue type
  const combinedWeight = Math.max(1, userWeight + queueTypeWeight - 1);

  // Calculate position with priority bonus
  // Priority users get a reduced position number (moves up in queue faster)
  const rawPosition = overflow > 0 ? Math.max(1, Math.ceil(overflow / combinedWeight)) : 0;

  // Apply tier bonus to position reduction over time
  const bonusMovement = Math.floor(elapsedSeconds / 15) + Math.floor(tierBonus / 10);
  const position = Math.max(0, rawPosition - bonusMovement);

  // ETA calculation: priority users have shorter wait times
  const baseEtaMultiplier = session.queueType === 'priority' ? 8 : session.queueType === 'whitelist' ? 12 : 18;
  const priorityEtaReduction = tierBonus > 0 ? Math.max(0.3, 1 - (tierBonus / 100)) : 1;
  const estimatedSeconds = Math.floor(position * baseEtaMultiplier * priorityEtaReduction);

  return {
    ...session,
    address: server?.address ?? '',
    elapsedSeconds,
    position,
    maxPosition: Math.max(rawPosition, position, 1),
    players,
    max,
    online,
    userTier,
    tierBonus,
    estimatedSeconds,
    readyToConnect: online && position <= 0
  };
}

export function encodeQueueSession(session: QueueSession) {
  return Buffer.from(JSON.stringify(session), 'utf8').toString('base64url');
}

export function decodeQueueSession(value?: string): QueueSession | null {
  if (!value) return null;
  try {
    const session = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as QueueSession;
    if (!session.server || !session.queueType || !session.joinedAt) return null;
    return session;
  } catch {
    return null;
  }
}
