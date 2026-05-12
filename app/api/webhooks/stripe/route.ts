import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'gone', message: 'Stripe webhook has been removed. Use /api/webhooks/kofi for membership events.' }, { status: 410 });
}
