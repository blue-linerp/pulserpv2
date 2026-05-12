import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { listSupportTickets } from '@/lib/support-tickets';

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  return NextResponse.json({ tickets: listSupportTickets() });
}
