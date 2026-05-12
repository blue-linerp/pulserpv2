import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { updateApplicationStatus, type ApplicationStatus } from '@/lib/applications-store';

const allowed: ApplicationStatus[] = ['pending', 'approved', 'denied'];

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  if (!allowed.includes(body.status)) return NextResponse.json({ error: 'bad_status' }, { status: 400 });
  const record = updateApplicationStatus(id, body.status, typeof body.reviewerNote === 'string' ? body.reviewerNote : undefined);
  if (!record) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ application: record });
}
