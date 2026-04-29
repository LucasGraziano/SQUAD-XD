import { requireAuth } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getProtocolDay } from '@/hooks/use-protocol-day';
import { PlannerClient } from '@/components/planner/planner-client';
import { isDemoMode, DEMO_PURCHASES, DEMO_COMPLETED_DAYS } from '@/lib/demo';
import type { Purchase, DayProgress } from '@/types/database';

export default async function PlannerPage() {
  const user = await requireAuth();

  let purchaseDate: string;
  let completedDays: number[];

  if (isDemoMode()) {
    purchaseDate = DEMO_PURCHASES[0]?.purchase_date || new Date().toISOString();
    completedDays = DEMO_COMPLETED_DAYS;
  } else {
    const supabase = createServerSupabaseClient();
    const [purchaseResult, progressResult] = await Promise.all([
      supabase.from('purchases').select('purchase_date').eq('user_id', user.id).order('purchase_date', { ascending: true }).limit(1),
      supabase.from('day_progress').select('day_number').eq('user_id', user.id),
    ]);
    const purchases = (purchaseResult.data || []) as Pick<Purchase, 'purchase_date'>[];
    purchaseDate = purchases[0]?.purchase_date || new Date().toISOString();
    completedDays = ((progressResult.data || []) as Pick<DayProgress, 'day_number'>[]).map((d) => d.day_number);
  }

  const currentDay = getProtocolDay(purchaseDate);

  return (
    <main className="px-5 pt-8 pb-24 max-w-lg mx-auto">
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Mi Planner</h1>
        <p className="text-foreground/50 text-sm">Tu camino de 28 días, un día a la vez</p>
      </div>
      <PlannerClient currentDay={currentDay} completedDays={completedDays} userId={user.id} />
    </main>
  );
}
