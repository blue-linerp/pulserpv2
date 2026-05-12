import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { addSupportTicketMessage, getSupportTicket } from '@/lib/support-tickets';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  const { id } = await params;
  const ticket = getSupportTicket(id);
  if (!ticket) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (ticket.status === 'closed') return NextResponse.json({ error: 'closed' }, { status: 400 });
  const body = await request.json().catch(() => ({}));
  if (!body.body?.trim()) return NextResponse.json({ error: 'missing_body' }, { status: 400 });
  const updated = addSupportTicketMessage(id, { authorSteamId: admin.steamId, authorName: admin.username, authorRole: 'admin', body: body.body });
  return NextResponse.json({ ticket: updated });
}
