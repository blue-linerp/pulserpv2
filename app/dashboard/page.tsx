import Link from 'next/link';
import { ArrowUp, BadgeCheck, Crown, Gauge, Headset, Star } from 'lucide-react';
import { CinematicBackground } from '@/components/CinematicBackground';
import { ServerCard } from '@/components/ServerStatus';
import { requireUser } from '@/lib/auth';
import { getDiscordPriorityTier } from '@/lib/discord-role-sync';
import { getServerStatuses } from '@/lib/fivem';
import { getPriorityTier } from '@/lib/user-priorities';
import { getSettings } from '@/lib/settings';

const priorityLabels = {
  none: 'Standard',
  silver: 'Bronze Priority',
  gold: 'Gold Priority',
  crimson: 'Diamond Priority'
} as const;

const priorityAccent = {
  none: 'rgba(255,255,255,0.12)',
  silver: 'rgba(205,127,50,0.45)',
  gold: 'rgba(245,158,11,0.45)',
  crimson: 'rgba(56,189,248,0.45)'
} as const;

export default async function DashboardPage() {
  const user = await requireUser();
  const settings = getSettings();
  const servers = await getServerStatuses(settings.server.maxPlayers);
  const priorityTier = await getDiscordPriorityTier(user.discord?.id) || getPriorityTier(user.steamId);
  const priority = priorityLabels[priorityTier];

  return (
    <section className="relative px-5 pb-24 pt-36">
      <CinematicBackground variant="subtle" />
      <div className="relative mx-auto max-w-[1280px]">
        <div className="chamfer-frame-lg relative mb-12 overflow-hidden p-8 md:p-10" style={{ '--chamfer-border': 'rgba(255,255,255,0.14)', '--chamfer-fill': 'linear-gradient(180deg, rgba(20,20,20,0.72), rgba(8,8,8,0.9))' } as React.CSSProperties}>
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 bg-[radial-gradient(circle,rgba(220,38,38,0.22),transparent_60%)] blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="eyebrow">Welcome Back</div>
            <h1 className="pulse-heading mt-3 text-5xl text-white sm:text-6xl lg:text-7xl">
              <span className="text-stroke">Hello,</span> <span className="text-[var(--red-bright)] text-glow-red">{user.username}</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/55">
              Your command center. Manage your priority, applications, support tickets, and queue status.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/queue" className="btn-primary">Join Queue</Link>
            <Link href="/profile" className="btn-ghost">View Profile</Link>
          </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="chamfer-frame lg:col-span-1 p-7" style={{ '--chamfer-border': priorityAccent[priorityTier], '--chamfer-fill': 'linear-gradient(180deg, rgba(18,18,18,0.68), rgba(8,8,8,0.88))' } as React.CSSProperties}>
            <div className="flex items-center justify-between">
              <div className="eyebrow">Current Priority</div>
              <Star size={16} className="text-[var(--gold)]" />
            </div>
            <div className="mt-6 font-['Oswald',sans-serif] text-3xl font-semibold text-white">{priority}</div>
            <p className="mt-3 text-sm leading-6 text-white/55">
              {priorityTier !== 'none'
                ? `Your ${priority} Discord role is active and syncing with the queue.`
                : 'Upgrade to unlock priority queue, custom badges, and faster review.'}
            </p>
            <Link href="/subscriptions" className="btn-outline-red mt-6 w-full">
              <ArrowUp size={13} /> Upgrade Subscription
            </Link>
          </div>

          {/* Quick links */}
          <div className="grid gap-6 lg:col-span-2 sm:grid-cols-2">
            {[
              { title: 'Applications', description: 'Submit or track your applications.', icon: BadgeCheck, href: '/applications' },
              { title: 'Support', description: 'Open a ticket or check existing.', icon: Headset, href: '/support' },
              { title: 'Subscriptions', description: 'Manage your priority tier.', icon: Crown, href: '/subscriptions' },
              { title: 'Queue', description: 'Join the city in real time.', icon: Gauge, href: '/queue' }
            ].map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.title} href={card.href} className="chamfer-frame group flex flex-col p-6 transition-transform duration-300 hover:-translate-y-1" style={{ '--chamfer-border': 'rgba(255,255,255,0.12)', '--chamfer-fill': 'linear-gradient(180deg, rgba(18,18,18,0.62), rgba(8,8,8,0.82))' } as React.CSSProperties}>
                  <div className="grid h-11 w-11 place-items-center bg-[rgba(220,38,38,0.1)] ring-1 ring-[rgba(220,38,38,0.25)] text-[var(--red-bright)] transition-all duration-500 group-hover:scale-110" style={{ clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' }}>
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-5 font-['Oswald',sans-serif] text-xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">{card.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="eyebrow">Live Servers</div>
              <h2 className="pulse-heading mt-3 text-4xl text-white sm:text-5xl">Server Status</h2>
            </div>
          </div>
          <div className="grid gap-7 lg:grid-cols-2">
            {servers.map((server) => <ServerCard key={server.key} server={server} maxPlayers={settings.server.maxPlayers} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
