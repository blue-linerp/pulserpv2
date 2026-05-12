'use client';

import { ChevronDown, LogOut, Menu, ShieldCheck, UserRound, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Logo } from './Logo';
import type { SiteSettings } from '@/lib/settings';

type SessionUser = { steamId: string; username: string; avatar: string; isAdmin?: boolean };

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/subscriptions', label: 'Subscriptions' },
  { href: '/applications', label: 'Applications' },
  { href: '/queue', label: 'Queue' },
  { href: '/support', label: 'Support' }
];

export function Navbar({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const [accountMenuStyle, setAccountMenuStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => { if (!cancelled) setUser(data.user); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [pathname]);

  useEffect(() => {
    function handleScroll() { setScrolled(window.scrollY > 24); }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as Node;
      if (!accountRef.current?.contains(target) && !accountMenuRef.current?.contains(target)) setAccountOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!accountOpen) return;
    function updatePosition() {
      const trigger = accountRef.current?.getBoundingClientRect();
      if (!trigger) return;
      setAccountMenuStyle({
        position: 'fixed',
        top: trigger.bottom + 12,
        right: Math.max(window.innerWidth - trigger.right, 16),
        width: 240,
        zIndex: 9999
      });
    }
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [accountOpen]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setAccountOpen(false);
    router.push('/');
    router.refresh();
  }

  const visibleLinks = links.filter((link) => link.href !== '/subscriptions' || settings.subscriptions.enabled);
  const chamfer = { clipPath: 'polygon(14px 0%, 100% 0%, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%, 0% 14px)' };
  const chamferSmall = { clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-4 sm:pt-6">
      <nav
        className={`relative flex w-full max-w-[1480px] items-center justify-between gap-7 overflow-hidden border px-4 py-3 transition-all duration-500 ${
          scrolled
            ? 'border-white/10 bg-[rgba(8,8,8,0.85)] shadow-[0_18px_50px_-15px_rgba(0,0,0,0.8),0_0_40px_-15px_rgba(220,38,38,0.35)] backdrop-blur-2xl'
            : 'border-white/[0.06] bg-[rgba(10,10,10,0.55)] shadow-[0_12px_40px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl'
        }`}
        style={chamfer}
      >
        {/* Glow ring */}
        <div className="pointer-events-none absolute inset-0 opacity-60" style={{
          ...chamfer,
          background: 'radial-gradient(ellipse at top, rgba(220,38,38,0.18), transparent 60%)'
        }} />

        <div className="relative flex items-center gap-3 pl-3">
          <Logo logoUrl={settings.branding.logoUrl} siteName={settings.branding.siteName} tagline={settings.branding.tagline} />
        </div>

        <div className="relative hidden items-center gap-1 lg:flex">
          {visibleLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                className={`group relative px-4 py-2 font-['Oswald',sans-serif] text-[12px] font-medium uppercase tracking-[0.18em] transition-all duration-300 ${
                  active ? 'text-white' : 'text-white/55 hover:text-white'
                }`}
                style={chamferSmall}
              >
                <span className="relative z-10">{link.label}</span>
                {active && (
                  <span className="absolute inset-0 -z-0 bg-gradient-to-b from-[rgba(220,38,38,0.18)] to-[rgba(220,38,38,0.04)] ring-1 ring-[rgba(220,38,38,0.35)]" style={chamferSmall} />
                )}
                {!active && (
                  <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-[rgba(220,38,38,0.6)] to-transparent transition-transform duration-300 group-hover:scale-x-100" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="relative hidden items-center gap-2 pr-2 lg:flex">
          {user ? (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((value) => !value)}
                aria-label="Account menu"
                className="group flex items-center gap-2 border border-white/10 bg-white/[0.04] px-2 py-1.5 transition-all duration-300 hover:border-[rgba(220,38,38,0.45)] hover:bg-white/[0.08] hover:shadow-[0_0_24px_-4px_rgba(220,38,38,0.6)]"
                style={chamferSmall}
              >
                <span className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-[var(--bg-tertiary)] ring-1 ring-white/10">
                  {user.avatar ? <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" /> : <UserRound size={14} className="text-white" />}
                </span>
                <span className="hidden font-['Oswald',sans-serif] text-[11px] font-medium uppercase tracking-[0.18em] text-white/80 xl:inline">{user.username}</span>
                <ChevronDown size={13} className={`text-white/50 transition-transform duration-300 ${accountOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-ghost !py-2 !px-4 !text-[11px]">Login</Link>
          )}
          {settings.branding.storeUrl && (
            <Link href={settings.branding.storeUrl} target={settings.branding.storeUrl.startsWith('http') ? '_blank' : undefined} rel={settings.branding.storeUrl.startsWith('http') ? 'noreferrer' : undefined} className="btn-ghost !py-2.5 !px-5 !text-[11px]">Store</Link>
          )}
          <Link href="/queue" className="btn-primary !py-2.5 !px-5 !text-[11px]">Join Server</Link>
        </div>

        <button className="relative grid h-10 w-10 place-items-center border border-white/10 text-white lg:hidden" style={chamferSmall} onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div className="absolute inset-x-4 top-[calc(100%+8px)] overflow-hidden border border-white/10 bg-[rgba(8,8,8,0.95)] p-3 shadow-[0_24px_60px_-10px_rgba(0,0,0,0.85)] backdrop-blur-2xl animate-fade-up lg:hidden" style={chamfer}>
          <div className="flex flex-col">
            {visibleLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 font-['Oswald',sans-serif] text-sm font-medium uppercase tracking-[0.2em] transition ${
                    active ? 'bg-[rgba(220,38,38,0.12)] text-white ring-1 ring-[rgba(220,38,38,0.3)]' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                  style={chamferSmall}
                >
                  {link.label}
                  <span className="text-white/30">→</span>
                </Link>
              );
            })}
          </div>
          <div className="mt-2 flex flex-col gap-2 border-t border-white/5 pt-3">
            {settings.branding.storeUrl && (
              <Link href={settings.branding.storeUrl} target={settings.branding.storeUrl.startsWith('http') ? '_blank' : undefined} rel={settings.branding.storeUrl.startsWith('http') ? 'noreferrer' : undefined} onClick={() => setOpen(false)} className="btn-ghost w-full">Store</Link>
            )}
            <Link href="/queue" onClick={() => setOpen(false)} className="btn-primary w-full">Join Server</Link>
            {user ? (
              <button onClick={logout} className="btn-ghost w-full">Logout ({user.username})</button>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="btn-ghost w-full">Login with Steam</Link>
            )}
          </div>
        </div>
      )}
      {accountOpen && user && typeof document !== 'undefined' && createPortal(
        <div ref={accountMenuRef} className="origin-top-right overflow-hidden border border-white/10 bg-[rgba(10,10,10,0.96)] p-1.5 shadow-[0_24px_60px_-10px_rgba(0,0,0,0.9),0_0_50px_-10px_rgba(220,38,38,0.45)] backdrop-blur-2xl animate-scale-in" style={{ ...chamfer, ...accountMenuStyle }}>
          <div className="flex items-center gap-3 border-b border-white/5 px-3 py-3">
            {user.avatar && <img src={user.avatar} alt="" className="h-9 w-9 rounded-full ring-1 ring-white/10" />}
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">{user.username}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/40">Member</div>
            </div>
          </div>
          <Link href="/profile" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-white/80 transition hover:bg-white/5 hover:text-white" style={chamferSmall}>
            <UserRound size={14} /> My Profile
          </Link>
          {user.isAdmin && (
            <Link href="/admin" onClick={() => setAccountOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-white/80 transition hover:bg-white/5 hover:text-white" style={chamferSmall}>
              <ShieldCheck size={14} /> Admin Panel
            </Link>
          )}
          <button onClick={logout} className="mt-1 flex w-full items-center gap-2 border-t border-white/5 px-3 py-2 text-sm text-[var(--red-bright)] transition hover:bg-[rgba(220,38,38,0.1)]" style={chamferSmall}>
            <LogOut size={14} /> Logout
          </button>
        </div>,
        document.body
      )}
    </header>
  );
}
