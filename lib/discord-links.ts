import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

export type DiscordLinkRecord = {
  steamId: string;
  discordId: string;
  discordName: string;
  linkedAt: number;
};

const dataDir = path.join(process.cwd(), 'data');
const discordLinksFile = path.join(dataDir, 'discord-links.json');

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

export function listDiscordLinks(): DiscordLinkRecord[] {
  ensureDir();
  if (!fs.existsSync(discordLinksFile)) {
    fs.writeFileSync(discordLinksFile, JSON.stringify([], null, 2));
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(discordLinksFile, 'utf8')) as DiscordLinkRecord[];
  } catch {
    return [];
  }
}

export function getDiscordLink(steamId: string) {
  return listDiscordLinks().find((link) => link.steamId === steamId) || null;
}

export function saveDiscordLink(steamId: string, discordId: string, discordName: string) {
  const links = listDiscordLinks();
  const existingIndex = links.findIndex((link) => link.steamId === steamId);
  const record: DiscordLinkRecord = { steamId, discordId, discordName, linkedAt: Date.now() };
  if (existingIndex >= 0) links[existingIndex] = record;
  else links.push(record);
  ensureDir();
  fs.writeFileSync(discordLinksFile, JSON.stringify(links, null, 2));
  return record;
}

export function removeDiscordLink(steamId: string) {
  const links = listDiscordLinks().filter((link) => link.steamId !== steamId);
  ensureDir();
  fs.writeFileSync(discordLinksFile, JSON.stringify(links, null, 2));
}
