import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { hasSupabaseStorage, readStorageValue, writeStorageValue } from './supabase-storage';

export type SiteSettings = {
  branding: {
    siteName: string;
    tagline: string;
    logoUrl: string;
    faviconUrl: string;
    businessEmail: string;
    storeUrl: string;
    discordUrl: string;
    rulesUrl: string;
  };
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    border: string;
    redPrimary: string;
    redHover: string;
    onlineGreen: string;
    gold: string;
    textPrimary: string;
    textSecondary: string;
  };
  announcement: {
    enabled: boolean;
    title: string;
    body: string;
    ctaLabel: string;
    ctaUrl: string;
  };
  socials: { id: string; label: string; href: string; icon: string }[];
  subscriptions: {
    enabled: boolean;
    kofiUsername: string;
    kofiVerificationToken: string;
    tiers: { name: string; kofiUrl: string }[];
  };
  server: {
    maxPlayers: number;
  };
};

export const defaultSettings: SiteSettings = {
  branding: {
    siteName: 'Pulse RP',
    tagline: 'ROLEPLAY',
    logoUrl: '/pulse-logo.svg',
    faviconUrl: '/favicon.ico',
    businessEmail: 'business@pulserp.gg',
    storeUrl: 'https://store.pulserp.gg',
    discordUrl: 'https://discord.gg/pulserp',
    rulesUrl: '/rules'
  },
  colors: {
    bgPrimary: '#060606',
    bgSecondary: '#0b0b0b',
    bgTertiary: '#101010',
    border: 'rgba(255,255,255,0.06)',
    redPrimary: '#dc2626',
    redHover: '#ef4444',
    onlineGreen: '#22c55e',
    gold: '#f5c518',
    textPrimary: '#ffffff',
    textSecondary: '#a0a0b0'
  },
  announcement: {
    enabled: true,
    title: 'PULSE STUDIOS',
    body: 'Need FiveM assets? Check out our new store',
    ctaLabel: 'Visit Store',
    ctaUrl: 'https://store.pulserp.gg'
  },
  socials: [
    { id: 'discord', label: 'Discord', href: 'https://discord.gg/pulserp', icon: 'discord' },
    { id: 'x', label: 'X', href: 'https://x.com/pulserp', icon: 'x' },
    { id: 'youtube', label: 'Youtube', href: 'https://youtube.com', icon: 'youtube' },
    { id: 'tiktok', label: 'TikTok', href: 'https://tiktok.com', icon: 'tiktok' }
  ],
  subscriptions: {
    enabled: true,
    kofiUsername: '',
    kofiVerificationToken: '',
    tiers: [
      { name: 'Bronze', kofiUrl: '' },
      { name: 'Gold', kofiUrl: '' },
      { name: 'Diamond', kofiUrl: '' }
    ]
  },
  server: {
    maxPlayers: 10
  }
};

const dataDir = path.join(process.cwd(), 'data');
const settingsFile = path.join(dataDir, 'settings.json');

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

export function getSettings(): SiteSettings {
  ensureDir();
  try {
    if (!fs.existsSync(settingsFile)) {
      fs.writeFileSync(settingsFile, JSON.stringify(defaultSettings, null, 2));
      return defaultSettings;
    }
    const raw = fs.readFileSync(settingsFile, 'utf8');
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return {
      branding: { ...defaultSettings.branding, ...parsed.branding },
      colors: { ...defaultSettings.colors, ...parsed.colors },
      announcement: { ...defaultSettings.announcement, ...parsed.announcement },
      socials: parsed.socials?.length ? parsed.socials : defaultSettings.socials,
      subscriptions: {
        enabled: parsed.subscriptions?.enabled ?? defaultSettings.subscriptions.enabled,
        kofiUsername: parsed.subscriptions?.kofiUsername ?? defaultSettings.subscriptions.kofiUsername,
        kofiVerificationToken: parsed.subscriptions?.kofiVerificationToken ?? defaultSettings.subscriptions.kofiVerificationToken,
        tiers: parsed.subscriptions?.tiers?.length ? parsed.subscriptions.tiers : defaultSettings.subscriptions.tiers
      },
      server: {
        maxPlayers: parsed.server?.maxPlayers ?? defaultSettings.server.maxPlayers
      }
    };
  } catch {
    return defaultSettings;
  }
}

export async function getSettingsAsync(): Promise<SiteSettings> {
  if (!hasSupabaseStorage()) return getSettings();
  return readStorageValue('settings', getSettings());
}

export function saveSettings(next: SiteSettings) {
  ensureDir();
  fs.writeFileSync(settingsFile, JSON.stringify(next, null, 2));
}

export async function saveSettingsAsync(next: SiteSettings) {
  if (!hasSupabaseStorage()) {
    saveSettings(next);
    return;
  }
  await writeStorageValue('settings', next);
}

export function settingsToCssVariables(settings: SiteSettings) {
  const c = settings.colors;
  return `:root{--bg-primary:${c.bgPrimary};--bg-secondary:${c.bgSecondary};--bg-tertiary:${c.bgTertiary};--border:${c.border};--border-accent:${c.redPrimary};--red-primary:${c.redPrimary};--red-hover:${c.redHover};--online-green:${c.onlineGreen};--gold:${c.gold};--text-primary:${c.textPrimary};--text-secondary:${c.textSecondary};--red-glow:${c.redPrimary}26;}`;
}
