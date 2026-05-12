'use client';

import { ArrowLeft, ChevronRight, Clock, Play, Radio, RefreshCw, Users, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { queueTypes, type QueueType } from '@/lib/queue';
import { siteConfig } from '@/lib/data';
import type { ServerStatus } from '@/lib/fivem';

type QueueProgress = {
  server: string;
  queueType: QueueType;
  address: string;
  elapsedSeconds: number;
  position: number;
  estimatedSeconds: number;
  maxPosition: number;
  players: number;
  max: number;
  online: boolean;
  userTier: 'none' | 'silver' | 'gold' | 'crimson';
  tierBonus: number;
  readyToConnect: boolean;
};

type QueueStatusPayload = {
  joined: boolean;
  queue: QueueProgress | null;
  error?: string;
  message?: string;
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  if (minutes <= 0) return `${remaining} seconds`;
  return `${minutes}m ${String(remaining).padStart(2, '0')}s`;
}

export function QueueClient({ servers, maxPlayers }: { servers: ServerStatus[]; maxPlayers?: number }) {
  const router = useRouter();
  const [status, setStatus] = useState<QueueStatusPayload>({ joined: false, queue: null });
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [offerSeconds, setOfferSeconds] = useState(50);
  const [missedOfferMessage, setMissedOfferMessage] = useState('');

  async function refreshStatus() {
    const response = await fetch('/api/queue/status', { cache: 'no-store' });
    const nextStatus = await response.json() as QueueStatusPayload;
    setStatus(nextStatus);
    setLoading(false);
  }

  async function joinQueue(queueType: QueueType) {
    if (!selectedServer) return;
    setLoading(true);
    const response = await fetch('/api/queue/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queueType, server: selectedServer })
    });
    const nextStatus = await response.json() as QueueStatusPayload;
    if (!response.ok) {
      setLoading(false);
      setToast(nextStatus.message || 'Unable to join queue');
      return;
    }
    setStatus(nextStatus);
    setLoading(false);
    setToast('Queue Joined');
  }

  async function leaveQueue() {
    setLoading(true);
    const response = await fetch('/api/queue/leave', { method: 'POST' });
    const nextStatus = await response.json() as QueueStatusPayload;
    setStatus(nextStatus);
    setSelectedServer(null);
    setLoading(false);
    setToast('Queue Left');
  }

  async function confirmQueueOffer(connectUrl: string) {
    window.location.href = connectUrl;
    await fetch('/api/queue/leave', { method: 'POST' }).catch(() => null);
    setStatus({ joined: false, queue: null });
    setSelectedServer(null);
    router.push('/');
  }

  useEffect(() => {
    refreshStatus();
    const timer = window.setInterval(refreshStatus, 5000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const offerReady = Boolean(status.queue?.readyToConnect);

  useEffect(() => {
    if (!offerReady) {
      setOfferSeconds(50);
      return;
    }
    const timer = window.setInterval(() => setOfferSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [offerReady]);

  useEffect(() => {
    if (!offerReady || offerSeconds !== 0) return;
    async function expireOffer() {
      await leaveQueue();
      setMissedOfferMessage("Sorry, you didn't accept the queue offer in time.");
    }
    expireOffer();
  }, [offerSeconds, offerReady]);

  useEffect(() => {
    if (!offerReady || offerSeconds === 0) return;
    let audioContext: AudioContext | null = null;
    function beep() {
      audioContext ||= new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.18);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    }
    beep();
    const timer = window.setInterval(beep, 1000);
    return () => {
      window.clearInterval(timer);
      audioContext?.close();
    };
  }, [offerReady, offerSeconds]);

  const activeServer = servers.find((server) => server.key === (status.queue?.server || selectedServer));
  const activeQueueLabel = queueTypes.find((type) => type.key === status.queue?.queueType)?.label || 'Regular Queue';
  const isQueueTypeSelection = Boolean(selectedServer && !status.joined);
  const isQueueExperience = isQueueTypeSelection || Boolean(status.joined && status.queue);
  const isAcceptOffer = Boolean(status.joined && offerReady);
  const chamfer = { clipPath: 'polygon(18px 0%, 100% 0%, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0% 100%, 0% 18px)' };
  const chamferSmall = { clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' };

  let body: React.ReactNode;
  let heading = 'Select Server';

  if (loading) {
    body = <div className="grid min-h-44 place-items-center text-[var(--text-secondary)]"><RefreshCw className="animate-spin text-[var(--red-primary)]" /></div>;
  } else if (status.joined && status.queue) {
    heading = `${activeServer?.name || 'FiveM'} - ${activeQueueLabel}`;
    const queue = status.queue;
    const connectUrl = queue.address ? `fivem://connect/${queue.address}` : siteConfig.connectUrl;
    body = queue.readyToConnect ? (
      <div className="flex h-[312px] w-full max-w-[570px] flex-col items-center justify-center border border-[var(--red-primary)] bg-[radial-gradient(ellipse_at_bottom,rgba(220,38,38,0.45),rgba(220,38,38,0.12)_38%,rgba(16,16,16,0.96)_78%)] shadow-[0_0_28px_rgba(220,38,38,0.15)]" style={chamfer}>
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2 text-[#b8c4d6]">
            <Clock size={18} />
            <div className="text-lg uppercase leading-none">Time to Accept</div>
          </div>
          <div className="text-lg font-bold text-white">{offerSeconds} <span className="font-normal">seconds</span></div>
        </div>
        <h3 className="mt-8 font-['Oswald',sans-serif] text-[34px] font-normal uppercase leading-none text-white">Accept Join Offer</h3>
        <div className="mt-7 flex gap-2">
          <button onClick={leaveQueue} className="h-10 min-w-[138px] border border-[var(--red-primary)] bg-[rgba(220,38,38,0.18)] px-5 text-sm font-bold text-white hover:bg-[var(--red-primary)]" style={chamferSmall}>Leave Queue</button>
          <button onClick={() => confirmQueueOffer(connectUrl)} className="flex h-10 min-w-[138px] items-center justify-center border border-white/30 bg-white/5 px-5 text-sm font-bold text-white hover:border-[var(--red-primary)] hover:bg-[var(--red-primary)]" style={chamferSmall}>Confirm</button>
        </div>
      </div>
    ) : (
      <div className="border border-white/15 bg-[#181818] p-8" style={chamfer}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <span className="text-xl font-normal uppercase text-[#9fb0c8]">{queue.readyToConnect ? 'Slot Available' : 'Current Position'}</span>
          <button onClick={leaveQueue} className="border border-[var(--red-primary)] bg-[rgba(220,38,38,0.22)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--red-primary)]" style={chamferSmall}><X size={13} className="inline" /> Leave Queue</button>
        </div>
        <div className="border border-white/10 bg-[#101010] p-8 text-center" style={chamferSmall}>
          {queue.readyToConnect ? (
            <span className="font-mono text-4xl font-black text-[var(--red-primary)]">READY</span>
          ) : (
            <>
              <span className="font-mono text-7xl font-black text-[var(--red-primary)] drop-shadow-[0_0_18px_rgba(220,38,38,0.35)]">{queue.position}</span>
              <span className="mx-5 text-6xl font-bold text-white/70">/</span>
              <span className="text-6xl font-bold text-white/70">{queue.maxPosition}</span>
            </>
          )}
        </div>
        <div className="mt-5 flex items-center gap-3 text-lg text-[#9fb0c8]">
          <Clock size={21} />
          <span className="uppercase">Time in queue</span>
          <span className="ml-auto font-bold text-white">{formatTime(queue.elapsedSeconds)}</span>
        </div>
        {queue.userTier !== 'none' && (
          <div className="mt-4 border border-[var(--gold)] bg-[rgba(245,197,24,0.08)] px-3 py-2" style={chamferSmall}>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-[var(--gold)]">{queue.userTier.toUpperCase()}</span>
              <span className="text-[var(--text-secondary)]">Priority Active</span>
              <span className="ml-auto text-[var(--red-primary)]">+{queue.tierBonus} Queue Boost</span>
            </div>
          </div>
        )}
        {!queue.online && <p className="mt-4 bg-[rgba(220,38,38,.12)] px-3 py-2 text-xs text-[var(--red-primary)]" style={chamferSmall}>Server is offline. Holding your spot.</p>}
      </div>
    );
  } else if (selectedServer) {
    heading = 'Select Queue Type';
    body = (
      <div className="space-y-5">
        <button onClick={() => setSelectedServer(null)} className="inline-flex items-center gap-2 font-mono text-xs uppercase text-[var(--text-secondary)] hover:text-white"><ArrowLeft size={14} /> Change Server</button>
        {queueTypes.map((queue) => (
          <button key={queue.key} onClick={() => joinQueue(queue.key)} className="group block w-full border border-white/15 bg-[#181818] p-8 transition hover:border-[var(--red-primary)] hover:bg-[rgba(220,38,38,.04)]" style={chamfer}>
            <div className="mx-auto flex min-h-[112px] max-w-[252px] items-center justify-center border border-white/15 bg-[#181818] px-8 text-center transition group-hover:border-[var(--red-primary)] group-hover:bg-[rgba(220,38,38,0.12)]" style={chamferSmall}>
              <span className="font-['Oswald',sans-serif] text-[24px] font-normal text-white">{queue.label}</span>
            </div>
          </button>
        ))}
      </div>
    );
  } else {
    body = (
      <div className="space-y-8">
        {servers.map((server) => (
          <button key={server.key} disabled={!server.online} onClick={() => setSelectedServer(server.key)} className="flex min-h-[134px] w-full items-center justify-between gap-4 border border-white/15 bg-[#242424] px-10 py-8 text-left transition hover:border-[var(--red-primary)] hover:bg-[rgba(220,38,38,0.08)] disabled:cursor-not-allowed disabled:opacity-50" style={chamfer}>
            <div>
              <span className="font-['Oswald',sans-serif] text-[22px] uppercase text-[var(--red-primary)]">{server.online ? 'Online' : 'Offline'}</span>
              <span className="mt-5 block font-['Oswald',sans-serif] text-[32px] font-normal leading-none text-white"><span className="mr-4 text-[var(--red-primary)]">•</span>{server.name}</span>
            </div>
            <div className="text-right">
              <span className="font-['Oswald',sans-serif] text-[24px] text-[#9fb0c8]">{server.players}/{maxPlayers ?? server.max}</span>
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <main className="relative px-5 pb-24 pt-36">
      {isQueueExperience ? (
        <section className="mx-auto grid max-w-[1066px] gap-16 lg:grid-cols-[336px_570px]">
          <QueueMediaPanels />
          <div>
            <h2 className="mb-5 text-center font-['Oswald',sans-serif] text-[28px] font-normal uppercase tracking-wide text-white">{heading}</h2>
            <div className={isAcceptOffer ? '' : 'border border-[var(--red-primary)] bg-[#181818] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.45)] md:p-8'} style={isAcceptOffer ? undefined : chamfer}>
              {body}
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-[672px]">
          <div className="border border-white/10 bg-gradient-to-b from-[rgba(24,24,24,0.82)] to-[rgba(8,8,8,0.92)] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.45),0_0_50px_-18px_rgba(220,38,38,0.45)] backdrop-blur-xl md:p-12" style={chamfer}>
            <h2 className="mb-12 text-center font-['Oswald',sans-serif] text-[42px] font-normal uppercase tracking-wide text-white">{heading}</h2>
            {body}
          </div>
        </section>
      )}
      {toast && <div className="fixed bottom-8 right-8 z-[120] w-72 border border-[var(--border)] bg-[#101010] px-5 py-4 text-sm font-bold text-white shadow-2xl" style={chamferSmall}>{toast}</div>}
      {missedOfferMessage && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl border border-[var(--red-primary)] bg-[#181818] p-8 text-center shadow-[0_24px_90px_rgba(0,0,0,0.8),0_0_36px_rgba(220,38,38,0.18)]" style={chamfer}>
            <button onClick={() => setMissedOfferMessage('')} aria-label="Close popup" className="absolute right-4 top-4 grid h-9 w-9 place-items-center text-white/60 hover:bg-[rgba(220,38,38,0.2)] hover:text-white" style={chamferSmall}><X size={20} /></button>
            <div className="mx-auto grid h-14 w-14 place-items-center bg-[rgba(220,38,38,0.15)] text-[var(--red-primary)]" style={chamferSmall}><Clock size={26} /></div>
            <h2 className="mt-5 font-['Oswald',sans-serif] text-4xl font-normal uppercase text-white">Queue Offer Expired</h2>
            <p className="mx-auto mt-4 max-w-md text-lg leading-7 text-[var(--text-secondary)]">{missedOfferMessage}</p>
            <button onClick={() => setMissedOfferMessage('')} className="btn-primary mt-7">Close</button>
          </div>
        </div>
      )}
    </main>
  );
}

function QueueMediaPanels() {
  const [musicType, setMusicType] = useState('Rap');
  const [volume, setVolume] = useState(18);
  const [previousVolume, setPreviousVolume] = useState(18);
  const musicTypes = ['Rap', 'Pop', 'Rock', 'Country', 'EDM', 'Mashup'];
  const chamfer = { clipPath: 'polygon(14px 0%, 100% 0%, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%, 0% 14px)' };
  const chamferSmall = { clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)' };
  function toggleMute() {
    if (volume > 0) {
      setPreviousVolume(volume);
      setVolume(0);
    } else {
      setVolume(previousVolume || 18);
    }
  }
  return (
    <aside className="space-y-5">
      <section>
        <h2 className="mb-3 text-center font-['Oswald',sans-serif] text-[28px] font-normal uppercase tracking-wide text-white">Active Streamers</h2>
        <div className="relative h-[188px] overflow-hidden bg-[#151515]" style={chamfer}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.24),transparent_58%),linear-gradient(135deg,#202020,#090909)]" />
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:36px_36px]" />
          <button className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white text-white transition hover:border-[var(--red-primary)] hover:text-[var(--red-primary)]"><Play size={34} fill="currentColor" /></button>
        </div>
      </section>
      <section className="border border-white/15 bg-[#111] p-6" style={chamfer}>
        <h2 className="flex items-center gap-3 text-[26px] font-black text-white"><Radio size={18} /> {musicType} Rotation</h2>
        <div className="mt-6 flex flex-wrap gap-1 bg-[rgba(220,38,38,0.18)] p-1 text-sm font-black text-white" style={chamferSmall}>
          {musicTypes.map((item) => <button key={item} onClick={() => setMusicType(item)} className={`px-3 py-2 transition hover:bg-[var(--red-primary)] ${musicType === item ? 'bg-[var(--red-primary)]' : ''}`} style={chamferSmall}>{item}</button>)}
        </div>
        <div className="mt-7 flex gap-4">
          <div className="grid h-[90px] w-[90px] shrink-0 place-items-center bg-[linear-gradient(135deg,#2b2b2b,#090909)] text-white" style={chamferSmall}><Play size={48} /></div>
          <div>
            <h3 className="text-2xl font-black leading-tight text-white">Say It, Pt. 2 (feat. SNOWOTT)</h3>
            <p className="mt-4 text-xl font-bold text-white">Yellowbear Beats</p>
          </div>
        </div>
        <div className="mt-7 flex items-center gap-3">
          <button type="button" aria-label={volume > 0 ? 'Mute music' : 'Unmute music'} onClick={toggleMute} className="grid h-8 w-8 place-items-center rounded-sm text-white transition hover:bg-[rgba(220,38,38,0.28)] hover:text-white">
            {volume > 0 ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
          <input aria-label="Music volume" type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} className="pulse-volume-slider flex-1" style={{ '--volume': `${volume}%` } as React.CSSProperties} />
        </div>
      </section>
    </aside>
  );
}
