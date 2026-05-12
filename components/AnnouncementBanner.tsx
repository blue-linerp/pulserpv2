import { ArrowUpRight, Megaphone } from 'lucide-react';
import type { SiteSettings } from '@/lib/settings';

export function AnnouncementBanner({ settings }: { settings: SiteSettings }) {
  if (!settings.announcement.enabled) return null;
  const { title, body, ctaLabel, ctaUrl } = settings.announcement;
  const chamfer = { clipPath: 'polygon(14px 0%, 100% 0%, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%, 0% 14px)' };
  const chamferSmall = { clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' };
  return (
    <div className="relative z-[80] mx-auto mt-24 max-w-[1280px] px-4 sm:mt-28">
      <div className="group relative overflow-hidden border border-white/10 bg-gradient-to-r from-[rgba(20,8,8,0.85)] via-[rgba(15,15,15,0.85)] to-[rgba(8,8,8,0.85)] backdrop-blur-2xl" style={chamfer}>
        <div className="pointer-events-none absolute inset-0 opacity-60" style={{ ...chamfer, background: 'radial-gradient(ellipse at left, rgba(220,38,38,0.18), transparent 55%)' }} />
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[var(--red-bright)] via-[var(--red-primary)] to-[var(--red-deep)] shadow-[0_0_20px_rgba(220,38,38,0.6)]" style={chamferSmall} />
        <div className="relative flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center bg-[rgba(220,38,38,0.15)] ring-1 ring-[rgba(220,38,38,0.4)] text-[var(--red-bright)]" style={chamferSmall}>
              <Megaphone size={18} />
            </div>
            <div>
              <div className="eyebrow !text-[10px] !text-[var(--red-bright)]">{title}</div>
              <div className="mt-1 text-sm font-medium text-white/85 md:text-[15px]">{body}</div>
            </div>
          </div>
          {ctaLabel && (
            <a href={ctaUrl} target="_blank" rel="noreferrer" className="btn-outline-red group/btn shrink-0">
              {ctaLabel}
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
