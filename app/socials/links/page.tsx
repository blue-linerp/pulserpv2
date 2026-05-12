import Link from "next/link";
import Image from "next/image";

const links = [
  {
    title: "Pulse RP | Apply Here",
    href: "https://www.pulse-rp.com/applications",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
      </svg>
    ),
  },
  {
    title: "Pulse RP | Official Discord",
    href: "https://discord.pulse-rp.com",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.04.037.052a19.88 19.88 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
      </svg>
    ),
  },
  {
    title: "Pulse RP | Official Store",
    href: "https://pulse-rp.mysellauth.com/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    title: "Pulse RP | Official YouTube",
    href: "https://youtube.com/@ThePulseRP",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    title: "Pulse RP | Official TikTok",
    href: "https://tiktok.com/@ThePulseRP",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
      </svg>
    ),
  },
];

export default function LinksPage() {
  return (
    <main className="min-h-screen bg-pulse-bg flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <div className="flex flex-col items-center mb-10">
        <Image
          src="/uploads/logo-1777594987982.png"
          alt="Pulse RP Logo"
          width={72}
          height={72}
          className="mb-4 rounded-full"
        />
        <h1 className="font-display text-4xl tracking-widest text-white uppercase">
          Pulse <span className="text-pulse-red">RP</span>
        </h1>
        <p className="font-body text-xs tracking-[0.3em] uppercase text-white/40 mt-1">
          Official Links
        </p>
      </div>

      {/* Divider */}
      <div className="w-10 h-0.5 bg-pulse-red mb-10 rounded-full" />

      {/* Link Cards */}
      <div className="w-full max-w-md flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 px-5 py-4 rounded-xl bg-pulse-panel border border-pulse-border hover:border-pulse-red/50 hover:bg-pulse-field transition-all duration-200"
          >
            {/* Icon bubble */}
            <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-pulse-field border border-pulse-border text-pulse-red group-hover:bg-pulse-red/10 transition-colors duration-200 shrink-0">
              {link.icon}
            </span>

            {/* Title */}
            <span className="flex-1 font-body font-semibold text-[15px] tracking-wide text-white/90 group-hover:text-white transition-colors duration-200">
              {link.title}
            </span>

            {/* Arrow */}
            <svg
              className="w-4 h-4 text-white/30 group-hover:text-pulse-red group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12,5 19,12 12,19" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <p className="font-body text-xs tracking-widest uppercase text-white/20 mt-12">
        pulse-rp.com
      </p>
    </main>
  );
}
