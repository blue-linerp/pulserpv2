import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ joined: false, queue: null });
  response.cookies.delete('pulse_queue_session');
  return response;
}
