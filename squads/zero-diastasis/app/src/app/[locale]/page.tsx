import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { getProtocolDay } from '@/hooks/use-protocol-day';
import { Greeting } from '@/components/dashboard/greeting';
import { DailyCard } from '@/components/dashboard/daily-card';
import { ProgressRing } from '@/components/dashboard/progress-ring';
import { Motivation } from '@/components/dashboard/motivation';
import { Disclaimer } from '@/components/ui/disclaimer';
import { redirect } from 'next/navigation';
import { isDemoMode, DEMO_PROFILE, DEMO_PURCHASES, DEMO_PROGRESS } from '@/lib/demo';
import type { Profile, Purchase, DayProgress } from '@/types/database';

export default async function HomePage() {
  const user = await getUser();

  if (!user) {
    redirect('/auth/login');
  }

  let profile: Profile | null;
  let purchases: Pick<Purchase, 'purchase_date'>[];
  let progress: Pick<DayProgress, 'day_number'>[];

  if (isDemoMode()) {
    profile = DEMO_PROFILE;
    purchases = DEMO_PURCHASES;
    progress = DEMO_PROGRESS;
  } else {
    const supabase = createServerSupabaseClient();
    const [profileResult, purchaseResult, progressResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('purchases').select('purchase_date').eq('user_id', user.id).order('purchase_date', { ascending: true }).limit(1),
      supabase.from('day_progress').select('day_number').eq('user_id', user.id),
    ]);

    profile = profileResult.data as Profile | null;
    purchases = (purchaseResult.data || []) as Pick<Purchase, 'purchase_date'>[];
    progress = (progressResult.data || []) as Pick<DayProgress, 'day_number'>[];
  }

  const purchaseDate = purchases[0]?.purchase_date || new Date().toISOString();
  const completedDays = progress.map((d) => d.day_number);

  const currentDay = getProtocolDay(purchaseDate);
  const isTodayCompleted = completedDays.includes(currentDay);

  return (
    <main className="px-5 pt-8 pb-24 max-w-lg mx-auto">
      <Greeting name={profile?.full_name} />
      <DailyCard currentDay={currentDay} isCompleted={isTodayCompleted} />
      <ProgressRing completedDays={completedDays.length} />
      <Motivation currentDay={currentDay} />
      <Disclaimer />
    </main>
  );
}
