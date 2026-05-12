import { Check, Minus } from 'lucide-react';
import { CinematicBackground } from '@/components/CinematicBackground';
import { SubscriptionCards } from '@/components/SubscriptionCards';
import { getSettings } from '@/lib/settings';

const comparison = [
  { feature: 'Queue Priority', bronze: '+25', gold: '+50', diamond: '+75' },
  { feature: 'Priority Application Review', bronze: false, gold: true, diamond: true },
  { feature: 'Discord Role Sync', bronze: true, gold: true, diamond: true },
  { feature: 'Unique Username Badge', bronze: true, gold: true, diamond: true },
  { feature: 'Public + Allowlist Servers', bronze: true, gold: true, diamond: true },
  { feature: 'Highest Available Priority Tier', bronze: false, gold: false, diamond: true }
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check size={16} className="mx-auto text-[var(--online-green)]" />;
  if (value === false) return <Minus size={16} className="mx-auto text-white/25" />;
  return <span className="font-mono text-sm font-semibold text-white">{value}</span>;
}

export default function SubscriptionsPage() {
  const settings = getSettings();
  return (
    <section className="relative px-5 pb-24 pt-36">
      <CinematicBackground variant="subtle" />
      <div className="relative mx-auto max-w-[1280px]">
        <div className="mb-16 max-w-3xl">
          <div className="eyebrow">Memberships</div>
          <h1 className="pulse-heading mt-4 text-6xl text-white sm:text-7xl lg:text-8xl">
            Choose your<br />
            <span className="text-glow-red text-[var(--red-bright)]">priority tier</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/55">
            Memberships fund the city and unlock priority queue, custom badges, and faster application review. Manage perks anytime — never pay-to-win.
          </p>
        </div>

        <SubscriptionCards subscriptions={settings.subscriptions} />

        <div className="mt-24">
          <div className="mb-8 max-w-2xl">
            <div className="eyebrow">Compare</div>
            <h2 className="pulse-heading mt-3 text-4xl text-white sm:text-5xl">Feature breakdown</h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[rgba(15,15,15,0.6)] to-[rgba(8,8,8,0.85)] backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="border-b border-white/10">
                  <tr className="text-left">
                    <th className="px-7 py-5 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45">Feature</th>
                    <th className="px-7 py-5 text-center font-['Oswald',sans-serif] text-base font-semibold uppercase tracking-wider text-[#cd7f32]">Bronze</th>
                    <th className="px-7 py-5 text-center font-['Oswald',sans-serif] text-base font-semibold uppercase tracking-wider text-[var(--gold)]">Gold</th>
                    <th className="px-7 py-5 text-center font-['Oswald',sans-serif] text-base font-semibold uppercase tracking-wider text-[#7dd3fc]">Diamond</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.feature} className="border-t border-white/5 transition hover:bg-white/[0.02]">
                      <td className="px-7 py-5 text-white/80">{row.feature}</td>
                      <td className="px-7 py-5 text-center"><Cell value={row.bronze} /></td>
                      <td className="px-7 py-5 text-center"><Cell value={row.gold} /></td>
                      <td className="px-7 py-5 text-center"><Cell value={row.diamond} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
