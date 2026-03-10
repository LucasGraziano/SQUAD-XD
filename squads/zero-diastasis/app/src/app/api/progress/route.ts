import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isDemoMode, DEMO_PROGRESS } from '@/lib/demo';
import type { DayProgress } from '@/types/database';

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json({
      progress: DEMO_PROGRESS.map((d, i) => ({
        id: `demo-${i}`,
        user_id: 'demo-user-001',
        day_number: d.day_number,
        completed_at: new Date().toISOString(),
        audio_listened: true,
        notes: null,
      })) as DayProgress[],
    });
  }

  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('day_progress')
    .select('*')
    .eq('user_id', user.id)
    .order('day_number', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ progress: data as DayProgress[] });
}
