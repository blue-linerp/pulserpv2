import { Users } from 'lucide-react';
import type { ServerStatus as ServerStatusType } from '@/lib/fivem';

function StatusPill({ server, maxPlayers }: { server: ServerStatusType; maxPlayers?: number }) {
  const displayMax = maxPlayers ?? server.max;
  return (
    <div className="chamfer-frame-sm group relative flex items-center gap-3 overflow-hidden px-5 py-2.5 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_0_30px_-8px_rgba(220,38,38,0.5)]" style={{ '--chamfer-border': 'rgba(255,255,255,0.12)', '--chamfer-fill': 'rgba(15,15,15,0.72)' } as React.CSSProperties}>
      <span className={`relative grid place-items-center`}>
        <span className={`h-2 w-2 rounded-full ${server.online ? 'bg-[var(--online-green)] shadow-[0_0_10px_rgba(34,197,94,0.7)]' : 'bg-white/30'}`} />
        {server.online && <span className="absolute h-2 w-2 rounded-full bg-[var(--online-green)]" style={{ animation: 'ping-soft 1.8s cubic-bezier(0,0,0.2,1) infinite' }} />}
      </span>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">{server.name}</span>
      <span className="text-sm font-bold tabular-nums text-white">{server.players}<span className="text-white/40">/{displayMax}</span></span>
    </div>
  );
}

export function ServerStatusBar({ servers, maxPlayers }: { servers: ServerStatusType[]; maxPlayers?: number }) {
  return <div className="flex flex-wrap justify-center gap-3">{servers.map((server) => <StatusPill key={server.key} server={server} maxPlayers={maxPlayers} />)}</div>;
}

export function ServerCard({ server, joinHref = `/queue?server=${encodeURIComponent(server.key)}`, maxPlayers }: { server: ServerStatusType; joinHref?: string; maxPlayers?: number }) {
  const displayMax = maxPlayers ?? server.max;
  const fillPct = Math.min(100, Math.round((server.players / displayMax) * 100));
  return (
    <div className="chamfer-frame relative overflow-hidden p-7" style={{ '--chamfer-border': server.online ? 'rgba(34,197,94,0.22)' : 'rgba(255,255,255,0.12)', '--chamfer-fill': 'linear-gradient(180deg, rgba(18,18,18,0.7), rgba(8,8,8,0.9))' } as React.CSSProperties}>
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 bg-[radial-gradient(circle,rgba(220,38,38,0.18),transparent_60%)] blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-2 border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] ${server.online ? 'border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.1)] text-[var(--online-green)]' : 'border-white/10 bg-white/[0.04] text-white/45'}`} style={{ clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)' }}>
            <span className={`h-1.5 w-1.5 rounded-full ${server.online ? 'bg-[var(--online-green)] shadow-[0_0_8px_rgba(34,197,94,0.7)]' : 'bg-white/40'}`} />
            {server.online ? 'Online' : 'Offline'}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">FiveM</span>
        </div>
        <h3 className="pulse-heading mt-6 text-4xl text-white">{server.name}</h3>
        <div className="mt-5 flex items-center gap-2 text-sm text-white/60"><Users size={14} /> <span className="tabular-nums text-white">{server.players}</span> / {displayMax} players</div>
        <div className="mt-3 h-1 overflow-hidden bg-white/[0.06]" style={{ clipPath: 'polygon(4px 0%, 100% 0%, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0% 100%, 0% 4px)' }}>
          <div className="h-full bg-gradient-to-r from-[var(--red-deep)] via-[var(--red-primary)] to-[var(--red-bright)] shadow-[0_0_12px_rgba(220,38,38,0.6)]" style={{ width: `${fillPct}%` }} />
        </div>
        <a href={joinHref} className="btn-primary mt-7 w-full">Join Queue</a>
      </div>
    </div>
  );
}
