import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { UserBonus } from '@/types/database';

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data } = await supabase
    .from('user_bonuses')
    .select('*')
    .eq('user_id', user.id);

  return NextResponse.json({ bonuses: (data || []) as UserBonus[] });
}
