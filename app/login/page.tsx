import { CinematicBackground } from '@/components/CinematicBackground';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect('/dashboard');
  return (
    <section className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pb-24 pt-32">
      <CinematicBackground variant="hero" />
      <div className="relative z-10 w-full max-w-md text-center">
        <div className="eyebrow justify-center">Allowlist Access</div>
        <h1 className="pulse-heading mt-5 text-6xl text-white sm:text-7xl">
          Sign in to<br />
          <span className="text-glow-red text-[var(--red-bright)]">step inside</span>
        </h1>
        <p className="mt-6 text-base leading-7 text-white/55">
          Authenticate with Steam to access your dashboard, applications, and queue priority.
        </p>
        <a
          href="/api/auth/steam"
          className="btn-primary mx-auto mt-10 !px-8 !py-4 !text-sm"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className="fill-white">
            <path d="M12 0a12 12 0 0 0-11.9 10.6l6.4 2.7a3.4 3.4 0 0 1 1.9-.6l2.9-4.2v-.1a4.6 4.6 0 1 1 4.6 4.6h-.1l-4.2 3a3.4 3.4 0 0 1-5.7 3.4 3.4 3.4 0 0 1-1-2.4l-4.6-1.9A12 12 0 1 0 12 0zM7.5 18.2l-1.5-.6a2.6 2.6 0 0 0 1.4 1.3 2.6 2.6 0 0 0 3.4-1.4 2.6 2.6 0 0 0 0-2 2.6 2.6 0 0 0-1.4-1.4 2.6 2.6 0 0 0-2 0l1.5.6a1.9 1.9 0 1 1-1.4 3.5zm12.5-7.6a3.1 3.1 0 1 1-3.1-3 3.1 3.1 0 0 1 3.1 3zm-5.5 0a2.3 2.3 0 1 0 2.3-2.3 2.3 2.3 0 0 0-2.3 2.3z" />
          </svg>
          Continue with Steam
        </a>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
          We never store passwords · Steam OpenID
        </p>
      </div>
    </section>
  );
}
