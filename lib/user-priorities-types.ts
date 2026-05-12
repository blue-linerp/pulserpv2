// This file contains NO server-only code and can be imported by client components

export type PriorityTier = 'none' | 'silver' | 'gold' | 'crimson';

export type UserPriority = {
  steamId: string;
  username: string;
  tier: PriorityTier;
  grantedAt: number;
  expiresAt?: number;
  source: 'manual' | 'discord' | 'kofi';
  discordUserId?: string;
};

export const tierWeights: Record<PriorityTier, number> = {
  none: 1,
  silver: 2,    // +25 priority
  gold: 3,      // +40 priority
  crimson: 4    // +60 priority
};

export const tierQueueBonus: Record<PriorityTier, number> = {
  none: 0,
  silver: 25,
  gold: 40,
  crimson: 60
};
