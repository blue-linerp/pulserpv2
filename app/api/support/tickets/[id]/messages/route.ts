import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { addSupportTicketMessage, getSupportTicket } from '@/lib/support-tickets';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const ticket = getSupportTicket(id);
  if (!ticket || ticket.steamId !== user.steamId) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (ticket.status === 'closed') return NextResponse.json({ error: 'closed' }, { status: 400 });
  const body = await request.json().catch(() => ({}));
  if (!body.body?.trim()) return NextResponse.json({ error: 'missing_body' }, { status: 400 });
  const updated = addSupportTicketMessage(id, { authorSteamId: user.steamId, authorName: user.username, authorRole: 'user', body: body.body });
  return NextResponse.json({ ticket: updated });
}
