import Link from 'next/link';

type Props = { large?: boolean; logoUrl?: string; siteName?: string; tagline?: string };

export function Logo({ large = false, logoUrl, siteName = 'Pulse', tagline = 'ROLEPLAY' }: Props) {
  const size = large ? 'h-12 w-12' : 'h-9 w-9';
  return (
    <Link href="/" className="group flex items-center gap-3">
      <div className={`${size} relative grid place-items-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.4),transparent_60%),linear-gradient(180deg,#1a1a1a,#0a0a0a)] ring-1 ring-white/10 transition-all duration-500 group-hover:ring-[rgba(220,38,38,0.5)] group-hover:shadow-[0_0_24px_-4px_rgba(220,38,38,0.7)]`}>
        {logoUrl ? (
          <img src={logoUrl} alt={`${siteName} logo`} className="h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 64 64" className="h-3/5 w-3/5 text-[var(--red-bright)] drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 32h10l4-12 8 24 6-18 6 12h14" />
          </svg>
        )}
      </div>
      <div className="leading-none">
        <div className={`${large ? 'text-3xl' : 'text-xl'} pulse-heading tracking-tight text-white transition-colors group-hover:text-white`}>{siteName}</div>
        <div className="mt-1 font-mono text-[9px] font-semibold tracking-[0.4em] text-[var(--red-bright)]/80">{tagline}</div>
      </div>
    </Link>
  );
}
