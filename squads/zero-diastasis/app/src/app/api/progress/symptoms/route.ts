import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getProtocolDay } from '@/hooks/use-protocol-day';
import type { Purchase } from '@/types/database';

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Validate levels (1-5 range)
  const energy = Number(body.energy_level);
  const pain = Number(body.pain_level);
  const bloating = Number(body.bloating);

  if ([energy, pain, bloating].some(v => isNaN(v) || v < 0 || v > 5)) {
    return NextResponse.json({ error: 'Invalid symptom values' }, { status: 400 });
  }

  const notes = typeof body.notes === 'string' ? body.notes.slice(0, 500) : null;

  const { data: purchases } = await supabase
    .from('purchases')
    .select('purchase_date')
    .eq('user_id', user.id)
    .order('purchase_date', { ascending: true })
    .limit(1);

  const purchaseDate = ((purchases || []) as Pick<Purchase, 'purchase_date'>[])[0]?.purchase_date || new Date().toISOString();
  const dayNumber = getProtocolDay(purchaseDate);

  const { error } = await supabase.from('symptom_entries').insert({
    user_id: user.id,
    day_number: dayNumber,
    energy_level: energy,
    pain_level: pain,
    bloating,
    notes,
  } as any);

  if (error) {
    console.error('Symptom insert error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
