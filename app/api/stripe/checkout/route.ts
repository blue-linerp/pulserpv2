import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'gone', message: 'Stripe checkout has been removed. Subscriptions are now handled via Ko-fi.' }, { status: 410 });
}
