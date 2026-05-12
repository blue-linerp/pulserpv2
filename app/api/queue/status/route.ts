import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { decodeQueueSession, getQueueProgress } from '@/lib/queue';
import { getSettings } from '@/lib/settings';
import { getCurrentUser } from '@/lib/auth';
import { getPriorityTier } from '@/lib/user-priorities';

export async function GET() {
  const cookieStore = await cookies();
  const session = decodeQueueSession(cookieStore.get('pulse_queue_session')?.value);
  const settings = getSettings();
  const user = await getCurrentUser();
  const steamId = user?.steamId;
  const tier = steamId ? getPriorityTier(steamId) : 'none';
  const queue = session ? await getQueueProgress(session, settings.server.maxPlayers, tier) : null;
  return NextResponse.json({ joined: Boolean(session), queue });
}
