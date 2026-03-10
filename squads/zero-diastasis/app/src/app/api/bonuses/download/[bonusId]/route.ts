import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { BONUSES } from '@/lib/gamification';

type Props = {
  params: { bonusId: string };
};

export async function GET(_request: Request, { params }: Props) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bonus = BONUSES.find((b) => b.id === params.bonusId);
  if (!bonus) {
    return NextResponse.json({ error: 'Bonus not found' }, { status: 404 });
  }

  // Mark as downloaded
  const { error } = await supabase.from('user_bonuses').upsert(
    { user_id: user.id, bonus_id: params.bonusId, downloaded: true } as any,
    { onConflict: 'user_id,bonus_id' },
  );

  if (error) {
    console.error('Bonus download tracking error:', error.message);
  }

  return NextResponse.redirect(new URL(bonus.downloadPath, process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000'));
}
