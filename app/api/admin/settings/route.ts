import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { defaultSettings, getSettings, saveSettings, type SiteSettings } from '@/lib/settings';

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  return NextResponse.json({ settings: getSettings() });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const body = (await request.json()) as Partial<SiteSettings>;
  const current = getSettings();
  const next: SiteSettings = {
    branding: { ...current.branding, ...body.branding },
    colors: { ...current.colors, ...body.colors },
    announcement: { ...current.announcement, ...body.announcement },
    socials: Array.isArray(body.socials) ? body.socials : current.socials,
    subscriptions: {
      enabled: body.subscriptions?.enabled ?? current.subscriptions.enabled,
      kofiUsername: body.subscriptions?.kofiUsername ?? current.subscriptions.kofiUsername,
      kofiVerificationToken: body.subscriptions?.kofiVerificationToken ?? current.subscriptions.kofiVerificationToken,
      tiers: Array.isArray(body.subscriptions?.tiers) ? body.subscriptions.tiers : current.subscriptions.tiers
    },
    server: {
      maxPlayers: body.server?.maxPlayers ?? current.server.maxPlayers
    }
  };
  saveSettings(next);
  return NextResponse.json({ settings: next });
}

export async function DELETE() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  saveSettings(defaultSettings);
  return NextResponse.json({ settings: defaultSettings });
}
