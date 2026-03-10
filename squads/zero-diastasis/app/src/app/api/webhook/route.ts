import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';

function verifyWebhookSignature(payload: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) return !WEBHOOK_SECRET; // skip verification if no secret configured
  try {
    const expected = createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const headersList = headers();
  const signature = headersList.get('x-webhook-signature');

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  const body = JSON.parse(rawBody);

  const email = body.email || body.buyer?.email;
  const productId = body.product_id || body.prod?.id || 'zero-diastasis-pro';
  const productName = body.product_name || body.prod?.name || 'Zero Diastasis™ PRO';
  const source = body.source || 'lastlink';
  const externalId = body.transaction_id || body.purchase?.transaction;
  const amountCents = body.amount_cents || body.purchase?.price?.value;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const supabase = createServiceRoleClient();

  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  let userId: string | null = null;

  const existingUser = existingUsers?.users?.find((u) => u.email === email);

  if (existingUser) {
    userId = existingUser.id;
  } else {
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });

    if (createError || !newUser.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    userId = newUser.user.id;
  }

  // Upsert profile
  const { error: profileError } = await supabase.from('profiles').upsert(
    { id: userId, email } as any,
    { onConflict: 'id' },
  );

  if (profileError) {
    console.error('Profile upsert error:', profileError.message);
  }

  // Register purchase
  const { error: purchaseError } = await supabase.from('purchases').insert({
    user_id: userId,
    product_id: productId,
    product_name: productName,
    source,
    external_id: externalId,
    amount_cents: amountCents,
    purchase_date: new Date().toISOString(),
    currency: 'USD',
  } as any);

  if (purchaseError) {
    console.error('Purchase insert error:', purchaseError.message);
    return NextResponse.json({ error: 'Failed to register purchase' }, { status: 500 });
  }

  return NextResponse.json({ success: true, userId });
}
