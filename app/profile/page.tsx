import Link from 'next/link';
import { ArrowUp, BadgeCheck, Briefcase, Clock, Disc3, IdCard, Phone, ShieldCheck, Star, UserRound, Wallet } from 'lucide-react';
import { CinematicBackground } from '@/components/CinematicBackground';
import { DiscordLink } from '@/components/DiscordLink';
import { requireUser } from '@/lib/auth';
import { getPriorityTier } from '@/lib/user-priorities';
import { getDiscordPriorityTier } from '@/lib/discord-role-sync';
import { getMythicCharacters } from '@/lib/mythic-characters';

const priorityLabels = {
  none: 'No Queue Priority',
  silver: 'Bronze Queue Priority',
  gold: 'Gold Queue Priority',
  crimson: 'Diamond Queue Priority'
} as const;

const priorityStyles = {
  none: 'border-white/10 bg-white/[0.03] text-white/55',
  silver: 'border-[rgba(205,127,50,0.45)] bg-[rgba(205,127,50,0.12)] text-[#cd7f32]',
  gold: 'border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold)]',
  crimson: 'border-[rgba(56,189,248,0.45)] bg-[rgba(56,189,248,0.12)] text-[#7dd3fc]'
} as const;

const priorityAccent = {
  none: {
    border: 'rgba(255,255,255,0.12)',
    glow: 'rgba(255,255,255,0.08)',
    text: 'rgba(255,255,255,0.55)',
    buttonClass: 'btn-primary'
  },
  silver: {
    border: 'rgba(205,127,50,0.5)',
    glow: 'rgba(205,127,50,0.22)',
    text: '#cd7f32',
    buttonClass: 'btn-primary'
  },
  gold: {
    border: 'rgba(245,158,11,0.55)',
    glow: 'rgba(245,158,11,0.24)',
    text: 'var(--gold)',
    buttonClass: 'btn-primary'
  },
  crimson: {
    border: 'rgba(56,189,248,0.55)',
    glow: 'rgba(56,189,248,0.26)',
    text: '#38bdf8',
    buttonClass: 'btn-primary btn-diamond'
  }
} as const;

export default async function ProfilePage() {
  const user = await requireUser();
  const priorityTier = await getDiscordPriorityTier(user.discord?.id) || getPriorityTier(user.steamId);
  const characters = await getMythicCharacters(user.steamId, user.username);
  const tierAccent = priorityAccent[priorityTier];
  const hasPriority = priorityTier !== 'none';
  const fields: { label: string; value: React.ReactNode }[] = [
    { label: 'Last Login', value: user.lastLogin },
    { label: 'Total Hours Played', value: 'Coming soon' },
    { label: 'Steam ID', value: <span className="break-all">{user.steamId} / {user.steamIdentifier}</span> },
    { label: 'Discord', value: <DiscordLink discord={user.discord} /> }
  ];
  return (
    <section className="relative px-5 pb-24 pt-36">
      <CinematicBackground variant="subtle" />
      <div className="relative mx-auto max-w-[1100px]">
        <div className="chamfer-frame-lg relative overflow-hidden p-10 shadow-[0_24px_90px_-35px_rgba(220,38,38,0.55)]" style={{ '--chamfer-border': 'rgba(255,255,255,0.14)', '--chamfer-fill': 'linear-gradient(180deg, rgba(20,20,20,0.72), rgba(8,8,8,0.9))' } as React.CSSProperties}>
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 bg-[radial-gradient(circle,rgba(220,38,38,0.24),transparent_60%)] blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(220,38,38,0.7)] to-transparent" />
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-[var(--red-bright)] to-[var(--red-deep)] opacity-60 blur" />
              <img src={user.avatar} alt="Steam avatar" className="relative h-24 w-24 rounded-full border border-[rgba(220,38,38,0.45)] object-cover shadow-[0_0_30px_-10px_rgba(220,38,38,0.9)]" />
            </div>
            <div className="flex-1">
              <div className="eyebrow flex items-center gap-2"><ShieldCheck size={12} /> Player Profile</div>
              <h1 className="pulse-heading mt-2 text-5xl text-white sm:text-6xl">{user.username}</h1>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/45">Member · {user.lastLogin}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-7 lg:grid-cols-[1.4fr_1fr]">
          <div className="chamfer-frame p-8" style={{ '--chamfer-border': 'rgba(255,255,255,0.12)', '--chamfer-fill': 'linear-gradient(180deg, rgba(20,20,20,0.55), rgba(10,10,10,0.8))' } as React.CSSProperties}>
            <div className="eyebrow mb-6 flex items-center gap-2"><UserRound size={12} /> Account Details</div>
            <dl className="space-y-5">
              {fields.map((field) => (
                <div key={field.label} className="flex flex-col gap-1.5 border-b border-white/5 pb-5 last:border-b-0 last:pb-0">
                  <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">{field.label}</dt>
                  <dd className="text-sm text-white">{field.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="chamfer-frame relative flex flex-col overflow-hidden p-8" style={{ '--chamfer-border': tierAccent.border, '--chamfer-fill': 'linear-gradient(180deg, rgba(20,20,20,0.55), rgba(10,10,10,0.8))', boxShadow: hasPriority ? `0 24px 80px -36px ${tierAccent.glow}, inset 0 0 44px -34px ${tierAccent.glow}` : undefined } as React.CSSProperties}>
            {hasPriority && <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 blur-3xl" style={{ background: `radial-gradient(circle, ${tierAccent.glow}, transparent 62%)` }} />}
            <div className="eyebrow relative mb-6 flex items-center gap-2" style={{ color: hasPriority ? tierAccent.text : undefined }}><Star size={12} /> Queue Priority</div>
            <span className={`inline-flex items-center gap-2 self-start border px-4 py-2 text-sm font-semibold ${priorityStyles[priorityTier]}`} style={{ clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' }}>
              <Star size={14} fill="currentColor" />{priorityLabels[priorityTier]}
            </span>
            <p className="mt-5 flex-1 text-sm leading-6 text-white/55">
              {hasPriority
                ? `Your ${priorityLabels[priorityTier]} is active and syncs with the Priority Queue automatically.`
                : 'You do not currently have priority queue access. Upgrade your tier to skip the line and unlock perks.'}
            </p>
            <Link href="/subscriptions" className={`${tierAccent.buttonClass} mt-7 w-full`}>
              <ArrowUp size={14} /> Upgrade Subscription
            </Link>
          </div>
        </div>

        <div className="chamfer-frame mt-7 p-8" style={{ '--chamfer-border': 'rgba(255,255,255,0.12)', '--chamfer-fill': 'linear-gradient(180deg, rgba(20,20,20,0.55), rgba(10,10,10,0.84))' } as React.CSSProperties}>
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="eyebrow flex items-center gap-2"><IdCard size={12} /> My Characters</div>
              <h2 className="pulse-heading mt-2 text-4xl text-white">Character Roster</h2>
            </div>
            <span className="self-start border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45" style={{ clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)' }}>
              {characters.length} Active
            </span>
          </div>

          {characters.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {characters.map((character, index) => (
                <article key={`${character.id}-${character.firstName}-${character.lastName}-${index}`} className="chamfer-frame-sm p-5" style={{ '--chamfer-border': 'rgba(255,255,255,0.1)', '--chamfer-fill': 'rgba(255,255,255,0.03)' } as React.CSSProperties}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-['TT_Octosquares',sans-serif] text-lg font-black uppercase tracking-[0.08em] text-white">{character.firstName} {character.lastName}</div>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/38">Character #{character.id}</p>
                    </div>
                    <span className="border border-[rgba(220,38,38,0.32)] bg-[rgba(220,38,38,0.1)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--red-bright)]" style={{ clipPath: 'polygon(7px 0%, 100% 0%, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0% 100%, 0% 7px)' }}>
                      {character.gender === 'Unknown' ? `SID #${character.id}` : character.gender}
                    </span>
                  </div>
                  <div className="mt-5 grid gap-3 text-xs text-white/58">
                    <div className="flex items-center gap-2"><Briefcase size={13} className="text-white/35" /> {character.job}</div>
                    <div className="flex items-center gap-2"><Phone size={13} className="text-white/35" /> {character.phone}</div>
                    <div className="flex items-center gap-2"><Clock size={13} className="text-white/35" /> DOB: {character.dateOfBirth}</div>
                    <div className="flex items-center gap-2"><Wallet size={13} className="text-white/35" /> Cash: {character.cash ?? 'Unknown'} · Bank Account: {character.bank ?? 'Unknown'}</div>
                    <div className="flex items-center gap-2"><Clock size={13} className="text-white/35" /> Last Played: {character.lastPlayed}</div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="chamfer-frame-sm p-6 text-sm leading-6 text-white/55" style={{ '--chamfer-border': 'rgba(255,255,255,0.1)', '--chamfer-fill': 'rgba(255,255,255,0.03)' } as React.CSSProperties}>
              No characters were found for your Steam account yet. If this is wrong, make sure `MYTHIC_MONGODB_URI`, `MYTHIC_MONGODB_DB`, `MYTHIC_CHARACTERS_COLLECTION`, `MYTHIC_USERS_DB`, `MYTHIC_USERS_COLLECTION`, and `MYTHIC_IDENTIFIER_FIELD` match your Mythic Framework MongoDB databases.
            </div>
          )}
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <div className="chamfer-frame-sm p-5" style={{ '--chamfer-border': 'rgba(255,255,255,0.1)', '--chamfer-fill': 'rgba(255,255,255,0.03)' } as React.CSSProperties}>
            <Disc3 size={16} className="text-[var(--red-bright)]" />
            <div className="mt-3 font-['TT_Octosquares',sans-serif] text-sm font-bold text-white">Discord Sync</div>
            <p className="mt-2 text-xs leading-5 text-white/50">{user.discord ? `Linked as ${user.discord.username}` : 'Link Discord to sync community roles.'}</p>
          </div>
          <div className="chamfer-frame-sm p-5" style={{ '--chamfer-border': 'rgba(255,255,255,0.1)', '--chamfer-fill': 'rgba(255,255,255,0.03)' } as React.CSSProperties}>
            <BadgeCheck size={16} className="text-[var(--online-green)]" />
            <div className="mt-3 font-['TT_Octosquares',sans-serif] text-sm font-bold text-white">Allowlist</div>
            <p className="mt-2 text-xs leading-5 text-white/50">Website permissions can sync to Discord once configured.</p>
          </div>
          <div className="chamfer-frame-sm p-5" style={{ '--chamfer-border': 'rgba(255,255,255,0.1)', '--chamfer-fill': 'rgba(255,255,255,0.03)' } as React.CSSProperties}>
            <Clock size={16} className="text-[var(--gold)]" />
            <div className="mt-3 font-['TT_Octosquares',sans-serif] text-sm font-bold text-white">Status</div>
            <p className="mt-2 text-xs leading-5 text-white/50">Role sync updates after Discord linking and priority changes.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
