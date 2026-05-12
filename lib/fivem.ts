import { siteConfig } from './data';

export type ServerStatus = {
  key: string;
  name: string;
  address: string;
  players: number;
  max: number;
  online: boolean;
  hostname?: string;
};

export async function getServerStatuses(maxPlayers?: number): Promise<ServerStatus[]> {
  return Promise.all(siteConfig.servers.map(async (server) => {
    const effectiveMax = maxPlayers ?? server.max;
    try {
      const response = await fetch(`http://${server.address}/dynamic.json`, { next: { revalidate: 15 }, signal: AbortSignal.timeout(4000) });
      if (!response.ok) throw new Error('FiveM dynamic request failed');
      const data = await response.json();
      const players = typeof data.clients === 'number' ? data.clients : 0;
      const max = typeof data.sv_maxclients === 'number' ? data.sv_maxclients : effectiveMax;
      return { key: server.key, name: server.name, address: server.address, players, max: maxPlayers ?? max, online: true, hostname: data.hostname };
    } catch {
      return { key: server.key, name: server.name, address: server.address, players: 0, max: effectiveMax, online: false };
    }
  }));
}
