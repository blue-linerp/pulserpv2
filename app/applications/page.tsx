import Link from 'next/link';
import { ArrowLeft, ArrowRight, Crown } from 'lucide-react';
import { ApplicationForm } from '@/components/ApplicationForm';
import { CinematicBackground } from '@/components/CinematicBackground';
import { applicationTypes } from '@/lib/data';
import { requireUser } from '@/lib/auth';
import { getApplicationDefinition, listApplicationDefinitions } from '@/lib/application-definitions';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ dept?: string }> }) {
  await requireUser();
  const params = await searchParams;
  const dept = params.dept;
  const definitions = listApplicationDefinitions().filter((definition) => definition.enabled);
  const app = dept ? getApplicationDefinition(dept) : null;
  const chamfer = { clipPath: 'polygon(18px 0%, 100% 0%, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0% 100%, 0% 18px)' };
  const chamferSmall = { clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' };

  if (app) {
    return (
      <section className="relative px-5 pb-24 pt-36">
        <CinematicBackground variant="subtle" />
        <div className="relative mx-auto max-w-[1100px]">
          <Link href="/applications" className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-white/55 transition hover:text-white">
            <ArrowLeft size={14} /> Back to Applications
          </Link>
          <ApplicationForm definition={app} />
        </div>
      </section>
    );
  }

  return (
    <section className="relative px-5 pb-24 pt-36">
      <CinematicBackground variant="subtle" />
      <div className="relative mx-auto max-w-[1280px]">
        <div className="mb-14 max-w-3xl">
          <div className="eyebrow">Allowlist Roster</div>
          <h1 className="pulse-heading mt-4 text-6xl text-white sm:text-7xl lg:text-8xl">
            Apply for<br />
            <span className="text-glow-red text-[var(--red-bright)]">your role</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/55">
            Pulse RP is allowlist-only by design. Choose your application below and tell us why you belong in our city.
          </p>
        </div>

        {dept && !app && (
          <div className="mb-8 border border-[rgba(220,38,38,0.4)] bg-[rgba(220,38,38,0.08)] px-5 py-4 text-sm text-[var(--red-bright)]" style={chamferSmall}>
            Unknown department &quot;{dept}&quot;. Pick an application below.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {definitions.map((item, index) => {
            const fallback = applicationTypes.find((type) => type.slug === item.slug) || applicationTypes[0];
            const Icon = fallback.icon;
            return (
              <Link key={item.slug} href={`/applications?dept=${item.slug}`} className="glass-card group relative flex flex-col overflow-hidden border border-white/10 p-7 animate-fade-up transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(220,38,38,0.45)] hover:shadow-[0_30px_90px_-35px_rgba(220,38,38,0.7)]" style={{ ...chamfer, animationDelay: `${index * 70}ms` }}>
                <Icon className="pointer-events-none absolute -bottom-10 -right-6 h-44 w-44 text-white opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.08]" />
                <div className="relative flex-1">
                  <div className="flex items-start justify-between">
                    <div className="grid h-12 w-12 place-items-center bg-[rgba(220,38,38,0.1)] ring-1 ring-[rgba(220,38,38,0.25)] text-[var(--red-bright)] transition-all duration-500 group-hover:scale-110" style={chamferSmall}>
                      <Icon size={20} />
                    </div>
                    {item.paid && (
                      <span className="inline-flex items-center gap-1.5 border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--gold)]" style={chamferSmall}>
                        <Crown size={10} /> Premium
                      </span>
                    )}
                  </div>
                  <h2 className="mt-6 font-['Oswald',sans-serif] text-2xl font-semibold text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-white/55">{item.description}</p>
                </div>
                <div className="relative mt-6 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--red-bright)] transition-transform duration-300 group-hover:translate-x-1">
                  Begin Application <ArrowRight size={12} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
