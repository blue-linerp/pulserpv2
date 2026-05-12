'use client';

export function CinematicBackground({ variant = 'hero' }: { variant?: 'hero' | 'section' | 'subtle' }) {
  if (variant === 'subtle') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 grid-overlay opacity-40" />
      </div>
    );
  }
  if (variant === 'section') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.18),transparent_60%)] blur-3xl animate-drift" />
        <div className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.10),transparent_65%)] blur-3xl animate-drift" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 grid-overlay opacity-30" />
      </div>
    );
  }
  // hero
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Vignette base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)]" />
      {/* Animated red orbs */}
      <div className="absolute -top-32 left-1/4 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.32),transparent_60%)] blur-3xl animate-drift" />
      <div className="absolute -bottom-32 right-1/4 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.22),transparent_65%)] blur-3xl animate-drift" style={{ animationDelay: '5s' }} />
      <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.10),transparent_70%)] blur-3xl" />
      {/* Light streaks */}
      <div className="absolute left-0 top-1/3 h-px w-full bg-gradient-to-r from-transparent via-[rgba(220,38,38,0.5)] to-transparent" style={{ animation: 'streak 9s ease-in-out infinite' }} />
      <div className="absolute left-0 top-2/3 h-px w-full bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.18)] to-transparent" style={{ animation: 'streak 12s ease-in-out infinite', animationDelay: '3s' }} />
      {/* Grid */}
      <div className="absolute inset-0 grid-overlay opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      {/* Particles */}
      <Particles />
    </div>
  );
}

function Particles() {
  const dots = Array.from({ length: 24 }, (_, index) => index);
  return (
    <div className="absolute inset-0">
      {dots.map((index) => {
        const left = (index * 37) % 100;
        const top = (index * 53) % 100;
        const size = 1 + (index % 3);
        const delay = (index * 0.7) % 8;
        const duration = 8 + (index % 6);
        return (
          <span
            key={index}
            className="absolute rounded-full bg-white/40"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}px`,
              height: `${size}px`,
              animation: `float-y ${duration}s ease-in-out ${delay}s infinite, fade-in 2s ease ${delay}s both`,
              boxShadow: index % 4 === 0 ? '0 0 8px rgba(220,38,38,0.8)' : '0 0 4px rgba(255,255,255,0.5)'
            }}
          />
        );
      })}
    </div>
  );
}
