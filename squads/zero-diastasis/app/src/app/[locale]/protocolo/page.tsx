import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import { getProtocolDay } from '@/hooks/use-protocol-day';
import { PROTOCOL_MODULES } from '@/types/protocol';
import { ModuleCard } from '@/components/protocol/module-card';
import { DayItem } from '@/components/protocol/day-item';
import { isDemoMode, DEMO_PURCHASES, DEMO_PROGRESS } from '@/lib/demo';
import type { DayProgress, Purchase } from '@/types/database';
import type { DayStatus } from '@/types/protocol';

export default async function ProtocolPage() {
  const user = await requireAuth();

  let purchases: Pick<Purchase, 'purchase_date'>[];
  let progress: Pick<DayProgress, 'day_number'>[];

  if (isDemoMode()) {
    purchases = DEMO_PURCHASES;
    progress = DEMO_PROGRESS;
  } else {
    const supabase = createServerSupabaseClient();
    const [purchaseResult, progressResult] = await Promise.all([
      supabase.from('purchases').select('purchase_date').eq('user_id', user.id).order('purchase_date', { ascending: true }).limit(1),
      supabase.from('day_progress').select('day_number').eq('user_id', user.id),
    ]);
    purchases = (purchaseResult.data || []) as Pick<Purchase, 'purchase_date'>[];
    progress = (progressResult.data || []) as Pick<DayProgress, 'day_number'>[];
  }

  const purchaseDate = purchases[0]?.purchase_date || new Date().toISOString();
  const currentDay = getProtocolDay(purchaseDate);
  const completedDays = new Set(progress.map((d) => d.day_number));

  function getDayStatus(day: number): DayStatus {
    if (completedDays.has(day)) return 'completed';
    if (day <= currentDay) return 'available';
    return 'locked';
  }

  return (
    <main className="px-5 pt-8 pb-24 max-w-lg mx-auto">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Protocolo</h1>

      <div className="space-y-4 mb-8">
        {PROTOCOL_MODULES.filter(m => m.id >= 2).map((mod) => {
          const [start, end] = mod.days;
          const totalDays = end - start + 1;
          const completedCount = Array.from({ length: totalDays }, (_, i) => start + i)
            .filter((d) => completedDays.has(d)).length;

          return (
            <ModuleCard
              key={mod.id}
              module={mod}
              isUnlocked={start <= currentDay}
              completedCount={completedCount}
              totalDays={totalDays}
            />
          );
        })}
      </div>

      <h2 className="text-lg font-heading font-bold text-foreground mb-4">Días</h2>
      <div className="space-y-1">
        {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
          <DayItem key={day} dayNumber={day} status={getDayStatus(day)} />
        ))}
      </div>
    </main>
  );
}
