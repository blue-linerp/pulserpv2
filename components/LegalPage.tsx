import { AlertTriangle, CheckCircle2, FileText, type LucideIcon } from 'lucide-react';
import { CinematicBackground } from './CinematicBackground';

type LegalSection = {
  id: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

type Props = {
  title: string;
  accent: string;
  eyebrow: string;
  subtitle: string;
  noticeTitle: string;
  noticeBody: string;
  quickItems: string[];
  sections: LegalSection[];
};

export function LegalPage({ title, accent, eyebrow, subtitle, noticeTitle, noticeBody, quickItems, sections }: Props) {
  return (
    <section className="relative px-5 pb-24 pt-36">
      <CinematicBackground variant="subtle" />
      <div className="relative mx-auto max-w-[1280px]">
        {/* Hero */}
        <div className="chamfer-frame-lg relative overflow-hidden p-10 shadow-[0_24px_90px_-35px_rgba(220,38,38,0.55)] md:p-14" style={{ '--chamfer-border': 'rgba(255,255,255,0.14)', '--chamfer-fill': 'linear-gradient(180deg, rgba(20,20,20,0.72), rgba(8,8,8,0.9))' } as React.CSSProperties}>
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 bg-[radial-gradient(circle,rgba(220,38,38,0.24),transparent_60%)] blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(220,38,38,0.7)] to-transparent" />
          <div className="relative">
            <div className="chamfer-frame-sm inline-flex items-center gap-2 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--red-bright)]" style={{ '--chamfer-border': 'rgba(220,38,38,0.4)', '--chamfer-fill': 'rgba(220,38,38,0.08)' } as React.CSSProperties}>
              <FileText size={13} /> {eyebrow}
            </div>
            <h1 className="pulse-heading mt-6 max-w-4xl text-6xl text-white sm:text-7xl lg:text-8xl">
              {title} <span className="text-glow-red text-[var(--red-bright)]">{accent}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/65">{subtitle}</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">Last updated: April 30, 2026</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {quickItems.map((item) => (
                <div key={item} className="chamfer-frame-sm flex items-center gap-3 p-4 font-mono text-xs text-white/65 backdrop-blur-md" style={{ '--chamfer-border': 'rgba(255,255,255,0.1)', '--chamfer-fill': 'rgba(255,255,255,0.03)' } as React.CSSProperties}>
                  <CheckCircle2 size={14} className="shrink-0 text-[var(--online-green)]" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="chamfer-frame h-fit p-6 lg:sticky lg:top-28" style={{ '--chamfer-border': 'rgba(255,255,255,0.12)', '--chamfer-fill': 'linear-gradient(180deg, rgba(20,20,20,0.55), rgba(10,10,10,0.8))' } as React.CSSProperties}>
            <div className="eyebrow mb-5">Contents</div>
            <nav className="flex flex-col gap-1">
              {sections.map((section, index) => (
                <a key={section.id} href={`#${section.id}`} className="group flex items-center justify-between px-3 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white">
                  <span>{section.title}</span>
                  <span className="font-mono text-[10px] text-white/30 transition group-hover:text-[var(--red-bright)]">{String(index + 1).padStart(2, '0')}</span>
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-6">
            <div className="chamfer-frame p-6 backdrop-blur-md" style={{ '--chamfer-border': 'rgba(220,38,38,0.35)', '--chamfer-fill': 'linear-gradient(135deg, rgba(220,38,38,0.1), rgba(220,38,38,0.02))' } as React.CSSProperties}>
              <div className="flex items-start gap-4">
                <div className="chamfer-frame-sm grid h-10 w-10 shrink-0 place-items-center text-[var(--red-bright)]" style={{ '--chamfer-border': 'rgba(220,38,38,0.4)', '--chamfer-fill': 'rgba(220,38,38,0.18)' } as React.CSSProperties}>
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="font-['Oswald',sans-serif] text-lg font-semibold uppercase tracking-wide text-white">{noticeTitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{noticeBody}</p>
                </div>
              </div>
            </div>

            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <section key={section.id} id={section.id} className="chamfer-frame scroll-mt-32 p-7 md:p-9" style={{ '--chamfer-border': 'rgba(255,255,255,0.12)', '--chamfer-fill': 'linear-gradient(180deg, rgba(20,20,20,0.55), rgba(10,10,10,0.8))' } as React.CSSProperties}>
                  <header className="mb-7 flex items-center gap-4 border-b border-white/5 pb-6">
                    <div className="chamfer-frame-sm grid h-12 w-12 place-items-center text-[var(--red-bright)]" style={{ '--chamfer-border': 'rgba(220,38,38,0.25)', '--chamfer-fill': 'rgba(220,38,38,0.1)' } as React.CSSProperties}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Section {index + 1}</div>
                      <h2 className="pulse-heading mt-1 text-3xl text-white md:text-4xl">{section.title}</h2>
                    </div>
                  </header>
                  <p className="text-sm leading-7 text-white/65">{section.body}</p>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
