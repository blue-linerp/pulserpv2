import { subscriptionTiers } from '@/lib/data';
import type { SiteSettings } from '@/lib/settings';

export function SubscriptionCards({ subscriptions }: { subscriptions: SiteSettings['subscriptions'] }) {
  const fallback = 'https://pulse-rp.mysellauth.com/products';
  return (
    <div className="grid gap-7 lg:grid-cols-3">
      {subscriptionTiers.map((tier) => {
        const tierConfig = subscriptions.tiers.find((entry) => entry.name === tier.name);
        const url = tierConfig?.kofiUrl || (subscriptions.kofiUsername ? `https://ko-fi.com/${subscriptions.kofiUsername}` : fallback);
        const featured = 'featured' in tier && tier.featured;
        const diamond = 'diamond' in tier && tier.diamond;
        const accentColor = tier.accent;
        const borderColor = diamond ? 'rgba(56,189,248,0.25)' : featured ? 'rgba(245,197,24,0.22)' : 'rgba(205,127,50,0.24)';
        const fill = diamond
          ? 'linear-gradient(180deg, rgba(8,31,44,0.9), rgba(8,17,26,0.98))'
          : featured
            ? 'linear-gradient(180deg, rgba(40,28,8,0.9), rgba(20,15,7,0.98))'
            : 'linear-gradient(180deg, rgba(38,24,15,0.9), rgba(19,13,10,0.98))';
        const glow = diamond
          ? 'radial-gradient(circle at 50% 0%, rgba(56,189,248,0.26), transparent 58%)'
          : featured
            ? 'radial-gradient(circle at 50% 0%, rgba(245,158,11,0.24), transparent 58%)'
            : 'radial-gradient(circle at 50% 0%, rgba(205,127,50,0.24), transparent 58%)';
        return (
          <div
            key={tier.name}
            className="chamfer-frame-lg group relative flex min-h-[560px] flex-col overflow-visible p-8 pt-20 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2"
            style={{ '--chamfer-border': borderColor, '--chamfer-fill': fill } as React.CSSProperties}
          >
            <div className="pointer-events-none absolute inset-0" style={{ background: glow }} />
            <div className="absolute -left-3 -top-6 z-20">
              <div className="grid h-24 w-24 place-items-center">
                <img src={tier.iconImage} alt={`${tier.name} subscription icon`} className="h-24 w-24 object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.65)]" />
              </div>
            </div>

            <div className="relative flex flex-1 flex-col">
              <h3 className="font-['TT_Octosquares',sans-serif] text-2xl font-black uppercase tracking-[0.08em] text-white/70">{tier.name}</h3>
              <div className="mt-5">
                <div className="font-['Oswald',sans-serif] text-6xl font-black leading-none tracking-tight text-white">{tier.bonus}</div>
                <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">Queue Priority</div>
              </div>
              <div className="mt-6 flex items-end gap-1">
                <span className="font-['Oswald',sans-serif] text-3xl font-black leading-none tracking-tight text-white">{tier.price}</span>
                <span className="pb-1 text-sm font-semibold text-white/40">/mo</span>
              </div>
              <div className="my-7 h-px bg-white/10" />
              <ul className="relative flex flex-1 flex-col gap-4 text-sm leading-6 text-white/62">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-white/25" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <div className="relative mt-10">
                {url ? (
                  <a href={url} target="_blank" rel="noreferrer" className={diamond ? 'btn-ghost btn-diamond w-full' : 'btn-ghost w-full'} style={{ '--tier-accent': accentColor } as React.CSSProperties}>
                    Subscribe
                  </a>
                ) : (
                  <button disabled className="btn-ghost w-full opacity-50">Configure Ko-fi</button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
