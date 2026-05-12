import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { listApplications } from '@/lib/applications-store';

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  return NextResponse.json({ applications: listApplications() });
}
