import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getProtocolDay } from '@/hooks/use-protocol-day';
import { isDemoMode, DEMO_MEASUREMENTS } from '@/lib/demo';
import type { Measurement, Purchase } from '@/types/database';

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json({ measurements: DEMO_MEASUREMENTS });
  }

  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data } = await supabase
    .from('measurements')
    .select('*')
    .eq('user_id', user.id)
    .order('day_number', { ascending: true });

  return NextResponse.json({ measurements: (data || []) as Measurement[] });
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Validate numeric inputs
  const waist = body.waist_cm != null ? Number(body.waist_cm) : null;
  const fingers = body.diastasis_fingers != null ? Number(body.diastasis_fingers) : null;
  const weight = body.weight_kg != null ? Number(body.weight_kg) : null;

  if ((waist != null && (isNaN(waist) || waist < 0 || waist > 300)) ||
      (fingers != null && (isNaN(fingers) || fingers < 0 || fingers > 20)) ||
      (weight != null && (isNaN(weight) || weight < 0 || weight > 500))) {
    return NextResponse.json({ error: 'Invalid measurement values' }, { status: 400 });
  }

  const { data: purchases } = await supabase
    .from('purchases')
    .select('purchase_date')
    .eq('user_id', user.id)
    .order('purchase_date', { ascending: true })
    .limit(1);

  const purchaseDate = ((purchases || []) as Pick<Purchase, 'purchase_date'>[])[0]?.purchase_date || new Date().toISOString();
  const dayNumber = getProtocolDay(purchaseDate);

  const { error } = await supabase.from('measurements').insert({
    user_id: user.id,
    day_number: dayNumber,
    waist_cm: waist,
    diastasis_fingers: fingers,
    weight_kg: weight,
  } as any);

  if (error) {
    console.error('Measurement insert error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
