'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  discord: { id: string; username: string } | null;
};

export function DiscordLink({ discord }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function unlink() {
    setBusy(true);
    await fetch('/api/auth/discord/unlink', { method: 'POST' });
    setBusy(false);
    router.refresh();
  }

  if (!discord) {
    return (
      <a href="/api/auth/discord" className="inline-flex items-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#4752c4]">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="fill-white"><path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3a14.52 14.52 0 0 0-.65 1.327 18.27 18.27 0 0 0-5.487 0A14.52 14.52 0 0 0 9.769 3a19.79 19.79 0 0 0-3.76 1.369C2.4 9.84 1.42 15.165 1.91 20.41a19.86 19.86 0 0 0 6.062 3.05c.49-.66.93-1.36 1.31-2.09a13 13 0 0 1-2.06-.99c.17-.13.34-.27.5-.4a14.18 14.18 0 0 0 12.34 0c.17.13.34.27.51.4a13 13 0 0 1-2.06 1c.38.73.82 1.42 1.31 2.08a19.85 19.85 0 0 0 6.07-3.05c.58-6.07-1-11.36-3.78-16.04zM8.02 16.18c-1.18 0-2.16-1.08-2.16-2.4s.96-2.41 2.16-2.41c1.21 0 2.18 1.09 2.16 2.41 0 1.32-.96 2.4-2.16 2.4zm7.97 0c-1.18 0-2.16-1.08-2.16-2.4s.96-2.41 2.16-2.41c1.21 0 2.18 1.09 2.16 2.41 0 1.32-.95 2.4-2.16 2.4z"/></svg>
        Link Discord
      </a>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--bg-tertiary)] px-3 py-2 font-mono text-sm text-white">
        <span className="h-2 w-2 rounded-full bg-[#43b581]" />
        {discord.username}
      </span>
      <button onClick={unlink} disabled={busy} className="rounded-lg border border-[var(--red-primary)] px-3 py-2 text-xs font-bold text-[var(--red-primary)] transition hover:bg-[var(--red-primary)] hover:text-white disabled:opacity-50">
        {busy ? 'Unlinking...' : 'Unlink Discord'}
      </button>
    </div>
  );
}
