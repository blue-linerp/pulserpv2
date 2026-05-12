import { NextResponse } from 'next/server';
import { getServerStatuses } from '@/lib/fivem';

export async function GET() {
  const servers = await getServerStatuses();
  return NextResponse.json({ servers });
}
