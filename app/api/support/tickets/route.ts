import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { createSupportTicket, listUserSupportTickets } from '@/lib/support-tickets';

export async function GET() {
  const user = await requireUser();
  return NextResponse.json({ tickets: listUserSupportTickets(user.steamId) });
}

export async function POST(request: NextRequest) {
  const user = await requireUser();
  const body = await request.json().catch(() => ({}));
  const messageText = typeof body.body === 'string' ? body.body.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() : '';
  if (!body.title?.trim() || !messageText) return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  try {
    const ticket = createSupportTicket({
      steamId: user.steamId,
      username: user.username,
      title: body.title.trim(),
      server: body.server || 'FiveM Public',
      category: body.category || 'General',
      body: body.body
    });
    return NextResponse.json({ ticket });
  } catch (error) {
    return NextResponse.json({ error: 'ticket_storage_failed' }, { status: 500 });
  }
}
