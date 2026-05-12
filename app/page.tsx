import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Car,
  ChevronDown,
  Crown,
  FileBadge,
  Gauge,
  Layers,
  MessageCircle,
  Phone,
  Play,
  ShieldCheck,
  Siren,
  Trophy,
  Users
} from 'lucide-react';
import { CinematicBackground } from '@/components/CinematicBackground';
import { SubscriptionCards } from '@/components/SubscriptionCards';
import { getServerStatuses } from '@/lib/fivem';
import { siteConfig } from '@/lib/data';
import { getSettings } from '@/lib/settings';

const heroTags = [
  { icon: ShieldCheck, label: 'Allowlist Only' },
  { icon: Siren, label: 'Active Staff' },
  { icon: Trophy, label: 'Mythic Framework' }
];

const detailCards = [
  {
    title: 'The City is Yours to Break',
    description: 'Sandbox-realistic, gritty city streets. Build a crime empire, cut deals, and shape the city that bends to your story.',
    image: 'linear-gradient(135deg,#1a1410 0%,#0a0a0a 50%,#150505 100%)',
    icon: Car
  },
  {
    title: 'Government Tools, Reinvented',
    description: 'Police forensics, courts, paperwork, and chains of evidence. Real consequences turn every scene into roleplay gold.',
    image: 'linear-gradient(135deg,#0a1015 0%,#0a0a0a 50%,#101015 100%)',
    icon: Building2
  },
  {
    title: 'Every Corner, Reimagined',
    description: 'Custom interiors, restored neighborhoods, real businesses. The map is the same — the city has never been deeper.',
    image: 'linear-gradient(135deg,#150a05 0%,#0a0a0a 50%,#1a1410 100%)',
    icon: Layers
  }
];

const stats = [
  { value: '8', label: 'Servers Online', icon: Gauge },
  { value: '294', label: 'Active Players', icon: Users },
  { value: '12K', label: 'Discord Members', icon: MessageCircle },
  { value: '2YR', label: 'Building Forward', icon: Trophy }
];

const showcaseItems = [
  { label: 'Mythic Phone', tagline: 'Custom in-game smartphone with social, banking & dispatch.', tone: 'red' },
  { label: 'Forensics', tagline: 'Real evidence chain — fingerprints, ballistics, DNA.', tone: 'neutral' },
  { label: 'Living Economy', tagline: 'Player-driven supply, demand, and crafting markets.', tone: 'red' },
  { label: 'Custom Vehicles', tagline: 'Hand-tuned handling, real damage, restorations.', tone: 'neutral' }
];

const faqItems = [
  {
    question: 'How can I join Pulse RP?',
    answer: 'Submit a free allowlist application with your Steam-verified account. Our team reviews submissions in order received. For faster review, purchase a Gold or Crimson subscription.'
  },
  {
    question: 'What are subscriptions for?',
    answer: 'Memberships fund the city and unlock priority queue, custom badges, and faster application review. Pulse RP is never pay-to-win — gameplay parity is sacred.'
  },
  {
    question: 'Do I need prior RP experience?',
    answer: 'No, but we hold a high bar for maturity, immersion, and respect for other players. Submit clips or written examples of your roleplay style for fastest acceptance.'
  },
  {
    question: 'How do whitelist jobs work?',
    answer: 'Police, EMS, and Lawyer roles require a separate department application. You can apply once you have an active allowlist account in good standing.'
  },
  {
    question: 'Can I stream Pulse RP?',
    answer: 'Yes — streamers and content creators are welcome. Tag the official socials when going live. High-tier creators may apply for the partnered streamer program.'
  }
];

export default async function HomePage() {
  const settings = getSettings();
  const servers = await getServerStatuses(settings.server.maxPlayers);
  const totalPlayers = servers.reduce((sum, server) => sum + server.players, 0);

  return (
    <>
      {/* ════════ HERO ════════ */}
      <section className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pb-32 pt-32 sm:pt-40">
        <CinematicBackground variant="hero" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-col items-center text-center">
          {/* Tag row */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2 animate-fade-up">
            {heroTags.map((tag) => {
              const Icon = tag.icon;
              return (
                <span key={tag.label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(15,15,15,0.7)] px-3.5 py-1.5 backdrop-blur-md">
                  <Icon size={11} className="text-[var(--red-bright)]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">{tag.label}</span>
                </span>
              );
            })}
          </div>

          {/* Massive headline */}
          <h1 className="pulse-heading max-w-[1100px] text-[12vw] leading-[0.96] text-white animate-fade-up delay-100 sm:text-[76px]" style={{ textTransform: 'none' }}>
            Join Into a World of<br />
            <span className="text-glow-red text-[var(--red-bright)]">Limitless Possibilities</span>
          </h1>

          <p className="mt-7 max-w-2xl text-[15px] leading-7 text-white/55 animate-fade-up delay-200">
            Pulse RP starts with you. A world rebuilt from the ground up with purpose-built RP hubs woven throughout, custom UI with cinematic depth, and interconnected systems that spark the authentic, unscripted moments that move the best stories and the best content.
          </p>

          {/* Three CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-up delay-300">
            <a href="#trailer" className="btn-ghost group">
              <Play size={12} fill="currentColor" /> Watch Trailer
            </a>
            <Link href="/applications" className="btn-ghost group">
              Apply To Server
            </Link>
            <Link href="/queue" className="btn-primary group">
              Join Pulse RP <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Trailer thumb card */}
          <div id="trailer" className="mt-14 w-full max-w-md animate-fade-up delay-400">
            <div className="text-center mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Live Now</div>
            <a href={siteConfig.discordUrl} target="_blank" rel="noreferrer" className="group relative block aspect-video overflow-hidden border border-white/10" style={{ clipPath: 'polygon(14px 0%, 100% 0%, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%, 0% 14px)' }}>
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#1a0a0a_0%,#0a0a0a_50%,#15080a_100%)] transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.25),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-white/10 ring-1 ring-white/30 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-[var(--red-primary)] group-hover:ring-[var(--red-primary)]">
                  <Play size={20} fill="currentColor" className="ml-1 text-white" />
                </div>
              </div>
              <div className="absolute inset-x-4 bottom-3 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">Pulse RP · Cinematic Trailer</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--red-primary)] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_12px_rgba(220,38,38,0.6)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" /> Live
                </span>
              </div>
            </a>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--bg-primary)]" />
      </section>

      {/* ════════ HIGHLIGHTED INTRO PARAGRAPH ════════ */}
      <section className="relative px-5 py-32">
        <div className="relative mx-auto max-w-[860px] text-center">
          <p className="font-['TT_Octosquares','Inter',sans-serif] text-[28px] font-medium leading-[1.4] text-white/80 sm:text-[32px] md:text-[36px]">
            A city where <span className="text-[var(--red-bright)]">relationships</span> drive everything. Open a{' '}
            <span className="text-[var(--red-bright)]">business</span>, supply another, build an{' '}
            <span className="text-[var(--red-bright)]">empire</span>. Cops with real{' '}
            <span className="text-[var(--red-bright)]">tools</span> hunting criminals who plan every{' '}
            <span className="text-[var(--red-bright)]">move</span>. A modern phone, a living economy, and stories that players and their audiences never forget.
          </p>
        </div>
      </section>

      {/* ════════ EVERY DETAIL. RETHOUGHT. ════════ */}
      <section className="relative px-5 py-24">
        <CinematicBackground variant="subtle" />
        <div className="relative mx-auto max-w-[1280px]">
          <h2 className="pulse-heading mb-14 text-center text-5xl text-white sm:text-6xl" style={{ textTransform: 'none' }}>
            Every Detail. <span className="text-[var(--red-bright)]">Rethought.</span>
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {detailCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className="group relative overflow-hidden border border-white/10 bg-[rgba(8,8,8,0.85)] transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(220,38,38,0.35)]" style={{ clipPath: 'polygon(14px 0%, 100% 0%, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%, 0% 14px)' }}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" style={{ background: card.image }} />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(220,38,38,0.15),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute inset-0 grid-overlay opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute inset-0 grid place-items-center">
                      <Icon size={64} className="text-white/15 transition-all duration-500 group-hover:scale-110 group-hover:text-[rgba(220,38,38,0.45)]" />
                    </div>
                  </div>
                  <div className="p-7">
                    <h3 className="font-['TT_Octosquares',sans-serif] text-xl font-bold text-white">{card.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/55">{card.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>


      {/* ════════ SUBSCRIPTIONS — Skip the Queue. Play Faster. ════════ */}
      {settings.subscriptions.enabled && (
        <section className="relative px-5 py-24">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-14 text-center">
              <h2 className="pulse-heading text-5xl text-white sm:text-6xl">
                Skip the Queue. <span className="text-[var(--red-bright)]">Play Faster.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/55">
                Higher tier = higher priority. Get in the city while others wait.
              </p>
            </div>
            <SubscriptionCards subscriptions={settings.subscriptions} />
          </div>
        </section>
      )}

      {/* ════════ CONTENT SHOWCASE — By Pulse Studios ════════ */}
      <section className="relative px-5 py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-12 text-center">
            <h2 className="pulse-heading text-5xl text-white sm:text-6xl">
              Built In-House. <span className="text-[var(--red-bright)]">By Pulse Studios.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/55">
              Premium FiveM systems crafted by the Pulse Studios team — the same tools that power our servers.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {showcaseItems.map((item) => (
              <article key={item.label} className="group relative overflow-hidden border border-white/10 bg-[rgba(8,8,8,0.85)] transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(220,38,38,0.4)]" style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)' }}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className={`absolute inset-0 transition-transform duration-700 group-hover:scale-105 ${item.tone === 'red' ? 'bg-[linear-gradient(135deg,#150505_0%,#0a0a0a_50%,#1a0a0a_100%)]' : 'bg-[linear-gradient(135deg,#0f0f0f_0%,#0a0a0a_50%,#151515_100%)]'}`} />
                  <div className="absolute inset-0 grid-overlay opacity-25" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.18),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                  <div className="absolute inset-x-4 bottom-3">
                    <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--red-bright)]">Mythic</div>
                    <div className="mt-1 font-['TT_Octosquares',sans-serif] text-xl font-bold text-white">{item.label}</div>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs leading-5 text-white/55">{item.tagline}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href={settings.branding.storeUrl} className="btn-ghost">
              Check Out The Store <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ GOT A STORY? CTA ════════ */}
      <section className="relative overflow-hidden px-5 py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.18),transparent_60%)] blur-3xl" />
          <div className="absolute -right-20 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.15),transparent_65%)] blur-3xl" />
        </div>

        {/* Decorative chevrons left/right */}
        <div className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 lg:block">
          <DecorationStack flip={false} />
        </div>
        <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 lg:block">
          <DecorationStack flip={true} />
        </div>

        <div className="relative mx-auto max-w-[860px] text-center">
          <h2 className="pulse-heading text-5xl text-white sm:text-6xl lg:text-7xl">
            Got A Story?<br />
            <span className="text-glow-red text-[var(--red-bright)]">Let&apos;s Write It Together</span>
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/60">
            One of FiveM&apos;s most respected GTA RP servers. Built for serious developers, content creators, and streamers who want a real work ethnic. Apply for the allowlist or if you&apos;re new to FiveM, get started on our wiki and see you out in the City.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/applications" className="btn-primary">Apply Now <ArrowRight size={13} /></Link>
            <Link href="/rules" className="btn-ghost">Check Our Rules</Link>
          </div>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">Built different. Built mythic.</p>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section className="relative px-5 py-32">
        <div className="mx-auto max-w-[860px]">
          <div className="mb-14 text-center">
            <h2 className="pulse-heading text-5xl text-white sm:text-6xl">
              Frequently Asked<br />
              <span className="text-[var(--red-bright)]">Questions</span>
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqItems.map((item) => (
              <details key={item.question} className="group border border-white/10 bg-[rgba(8,8,8,0.85)] transition-colors duration-300 hover:border-[rgba(220,38,38,0.3)]" style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)' }}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-sm font-semibold uppercase tracking-[0.1em] text-white/85 transition-colors duration-300 hover:text-white sm:text-[15px] [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-3">
                    <FileBadge size={14} className="text-[var(--red-bright)] opacity-70" />
                    {item.question}
                  </span>
                  <ChevronDown size={16} className="shrink-0 text-white/45 transition-transform duration-300 group-open:rotate-180 group-open:text-[var(--red-bright)]" />
                </summary>
                <div className="border-t border-white/5 px-6 py-5 text-sm leading-7 text-white/60">{item.answer}</div>
              </details>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-white/45">Still have questions?</p>
            <Link href="/support" className="btn-ghost mt-4 mx-auto">
              <Phone size={12} /> Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ LIVE SERVERS STRIP ════════ */}
      <section className="relative px-5 pb-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="border-t border-white/5 pt-10">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">Live Infrastructure</div>
                <h3 className="mt-2 pulse-heading text-2xl text-white sm:text-3xl">{totalPlayers} players in the city right now</h3>
              </div>
              <Link href="/queue" className="btn-outline-red">Join Queue <ArrowRight size={12} /></Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {servers.map((server) => (
                <div key={server.key} className="inline-flex items-center gap-3 border border-white/10 bg-[rgba(15,15,15,0.7)] px-5 py-3 backdrop-blur-xl" style={{ clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' }}>
                  <span className="relative grid place-items-center">
                    <span className={`h-2 w-2 rounded-full ${server.online ? 'bg-[var(--online-green)] shadow-[0_0_10px_rgba(34,197,94,0.7)]' : 'bg-white/30'}`} />
                    {server.online && <span className="absolute h-2 w-2 rounded-full bg-[var(--online-green)]" style={{ animation: 'ping-soft 1.8s cubic-bezier(0,0,0.2,1) infinite' }} />}
                  </span>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">{server.name}</span>
                  <span className="text-sm font-bold tabular-nums text-white">{server.players}<span className="text-white/40">/{settings.server.maxPlayers}</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function DecorationStack({ flip }: { flip: boolean }) {
  return (
    <div className={`flex flex-col gap-2 opacity-50 ${flip ? 'rotate-180' : ''}`}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-12 w-32 border border-white/10"
          style={{
            clipPath: 'polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)',
            background: 'linear-gradient(135deg, rgba(220,38,38,0.18), rgba(50,50,50,0.4) 50%, rgba(20,20,20,0.6))',
            transform: `translateX(${index * 20}px)`
          }}
        />
      ))}
    </div>
  );
}
