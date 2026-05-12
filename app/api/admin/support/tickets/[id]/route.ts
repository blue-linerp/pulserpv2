import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { deleteSupportTicket, updateSupportTicketStatus, type SupportTicketStatus } from '@/lib/support-tickets';

const allowed: SupportTicketStatus[] = ['open', 'pending', 'closed'];

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  if (!allowed.includes(body.status)) return NextResponse.json({ error: 'bad_status' }, { status: 400 });
  const ticket = updateSupportTicketStatus(id, body.status);
  if (!ticket) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ticket });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id } = await params;
  if (!deleteSupportTicket(id)) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
