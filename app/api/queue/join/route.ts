import { NextRequest, NextResponse } from 'next/server';
import { createQueueSession, encodeQueueSession, getQueueProgress, queueTypes, type QueueType } from '@/lib/queue';
import { getSettings } from '@/lib/settings';
import { getCurrentUser } from '@/lib/auth';
import { getPriorityTier } from '@/lib/user-priorities';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const queueType = queueTypes.some((type) => type.key === body.queueType) ? body.queueType as QueueType : 'regular';
  const server = typeof body.server === 'string' ? body.server : 'allowlist';
  const settings = getSettings();
  const user = await getCurrentUser();
  const steamId = user?.steamId;
  const tier = steamId ? getPriorityTier(steamId) : 'none';
  if (queueType === 'priority' && !['silver', 'gold', 'crimson'].includes(tier)) {
    return NextResponse.json({ error: 'priority_required', message: 'You need Silver, Gold, or Crimson to join the Priority Queue.' }, { status: 403 });
  }
  const session = createQueueSession(server, queueType);
  const queue = await getQueueProgress(session, settings.server.maxPlayers, tier);
  const response = NextResponse.json({ joined: true, queue });
  response.cookies.set('pulse_queue_session', encodeQueueSession(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60
  });
  return response;
}
