import { Globe, Radio } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTiktok, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import { getServerStatuses } from '@/lib/fivem';
import { Logo } from './Logo';
import type { SiteSettings } from '@/lib/settings';

const iconMap = { discord: faDiscord, x: faXTwitter, youtube: faYoutube, tiktok: faTiktok } as const;

export async function Footer({ settings }: { settings: SiteSettings }) {
  const servers = await getServerStatuses(settings.server.maxPlayers);
  const links = [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Rules', href: settings.branding.rulesUrl },
    { label: 'Store', href: settings.branding.storeUrl },
    { label: 'Refund Policy', href: '/refund-policy' }
  ];

  return (
    <footer className="relative mt-32 overflow-hidden border-t border-white/5">
      {/* Massive background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.22),transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 grid-overlay opacity-30 [mask-image:linear-gradient(to_bottom,transparent,black_40%)]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 pb-12 pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo large logoUrl={settings.branding.logoUrl} siteName={settings.branding.siteName} tagline={settings.branding.tagline} />
            <p className="mt-6 max-w-md text-sm leading-7 text-white/55">
              A premium FiveM roleplay community engineered for cinematic stories, competitive energy, and serious character development.
            </p>
            <p className="mt-5 text-sm text-white/60">
              Business Inquiries:{' '}
              <a href={`mailto:${settings.branding.businessEmail}`} className="text-[var(--red-bright)] underline-offset-4 transition hover:underline">
                {settings.branding.businessEmail}
              </a>
            </p>
            <div className="mt-7">
              <div className="eyebrow mb-3">Server Status</div>
              <div className="flex flex-wrap gap-2">
                {servers.map((server) => (
                  <div key={server.key} className="chamfer-frame-sm inline-flex items-center gap-2 px-3 py-1.5 backdrop-blur-md" style={{ '--chamfer-border': server.online ? 'rgba(34,197,94,0.28)' : 'rgba(255,255,255,0.1)', '--chamfer-fill': 'rgba(255,255,255,0.035)' } as React.CSSProperties}>
                    <span className={`h-1.5 w-1.5 rounded-full ${server.online ? 'bg-[var(--online-green)] shadow-[0_0_8px_rgba(34,197,94,0.7)]' : 'bg-white/30'}`} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">{server.name}</span>
                    <span className="text-xs font-bold tabular-nums text-white">{server.players}/{settings.server.maxPlayers}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="eyebrow mb-5">Navigation</div>
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-white/60 transition hover:translate-x-1 hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="eyebrow mb-5">Account</div>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard" className="text-sm text-white/60 transition hover:translate-x-1 hover:text-white">Dashboard</Link>
              <Link href="/profile" className="text-sm text-white/60 transition hover:translate-x-1 hover:text-white">Profile</Link>
              <Link href="/applications" className="text-sm text-white/60 transition hover:translate-x-1 hover:text-white">Applications</Link>
              <Link href="/support" className="text-sm text-white/60 transition hover:translate-x-1 hover:text-white">Support</Link>
              <Link href="/queue" className="text-sm text-white/60 transition hover:translate-x-1 hover:text-white">Join Queue</Link>
            </div>
          </div>

          <div>
            <div className="eyebrow mb-5">Connect</div>
            <div className="flex flex-col gap-3">
              {settings.socials.map((social) => {
                const brandIcon = iconMap[social.icon as keyof typeof iconMap];
                const FallbackIcon = social.icon === 'x' ? Radio : Globe;
                return (
                  <a key={social.id} href={social.href} target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-sm text-white/60 transition hover:text-white">
                    <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-300 group-hover:border-[rgba(220,38,38,0.4)] group-hover:bg-[rgba(220,38,38,0.1)] group-hover:text-[var(--red-bright)]">
                      {brandIcon ? <FontAwesomeIcon icon={brandIcon} className="h-4 w-4" /> : <FallbackIcon size={16} />}
                    </span>
                    {social.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="my-12 divider-glow" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-white/40 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {settings.branding.siteName}. All rights reserved.</p>
          <p className="font-mono uppercase tracking-[0.25em]">Crafted with cinematic precision</p>
        </div>
      </div>
    </footer>
  );
}
