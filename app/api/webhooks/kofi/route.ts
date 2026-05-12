import { NextRequest, NextResponse } from 'next/server';
import { getSettings } from '@/lib/settings';
import { setUserPriority } from '@/lib/user-priorities';
import type { PriorityTier } from '@/lib/user-priorities-types';

type KofiPayload = {
  verification_token?: string;
  type?: string;
  is_subscription_payment?: boolean;
  is_first_subscription_payment?: boolean;
  from_name?: string;
  message?: string;
  amount?: string;
  tier_name?: string;
  email?: string;
  kofi_transaction_id?: string;
};

export async function POST(request: NextRequest) {
  const settings = getSettings();
  const expectedToken = settings.subscriptions.kofiVerificationToken;

  let payload: KofiPayload | null = null;
  try {
    const formData = await request.formData();
    const raw = formData.get('data');
    if (typeof raw === 'string') {
      payload = JSON.parse(raw) as KofiPayload;
    }
  } catch {
    payload = null;
  }

  if (!payload) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  if (expectedToken && payload.verification_token !== expectedToken) {
    console.warn('[kofi-webhook] verification_token mismatch');
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  console.log('[kofi-webhook] received', {
    type: payload.type,
    from: payload.from_name,
    tier: payload.tier_name,
    amount: payload.amount,
    txn: payload.kofi_transaction_id,
    subscription: payload.is_subscription_payment,
    first: payload.is_first_subscription_payment
  });

  // Auto-grant priority tier based on Ko-fi membership tier
  if (payload.is_subscription_payment && payload.tier_name && payload.from_name) {
    const tierName = payload.tier_name.toLowerCase();
    let priorityTier: PriorityTier | null = null;

    if (tierName.includes('silver')) priorityTier = 'silver';
    else if (tierName.includes('gold')) priorityTier = 'gold';
    else if (tierName.includes('crimson')) priorityTier = 'crimson';

    if (priorityTier) {
      // Use email as identifier if available, otherwise from_name
      const userId = payload.email || payload.from_name;
      setUserPriority(userId, payload.from_name, priorityTier, 'kofi');
      console.log(`[kofi-webhook] Granted ${priorityTier} priority to ${payload.from_name}`);
    }
  }

  // TODO: Grant Discord role here once you wire that up.
  return NextResponse.json({ ok: true });
}
