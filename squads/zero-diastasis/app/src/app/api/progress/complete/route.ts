import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isDemoMode } from '@/lib/demo';

export async function POST(request: Request) {
  if (isDemoMode()) {
    const body = await request.json();
    return NextResponse.json({ success: true, dayNumber: body.dayNumber });
  }

  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const dayNumber = Number(body.dayNumber);

  if (!dayNumber || dayNumber < 1 || dayNumber > 28 || !Number.isInteger(dayNumber)) {
    return NextResponse.json({ error: 'Invalid day number' }, { status: 400 });
  }

  const { error } = await supabase.from('day_progress').upsert(
    {
      user_id: user.id,
      day_number: dayNumber,
      audio_listened: true,
    } as any,
    { onConflict: 'user_id,day_number' },
  );

  if (error) {
    console.error('Day progress error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, dayNumber });
}
