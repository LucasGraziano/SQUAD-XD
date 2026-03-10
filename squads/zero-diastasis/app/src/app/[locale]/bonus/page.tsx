import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import { getProtocolDay } from '@/hooks/use-protocol-day';
import { BONUSES, getBonusStatus } from '@/lib/gamification';
import { BonusSection } from '@/components/bonus/bonus-section';
import { isDemoMode, DEMO_PURCHASES, DEMO_BONUSES } from '@/lib/demo';
import type { Purchase, UserBonus } from '@/types/database';

export default async function BonusPage() {
  const user = await requireAuth();

  let purchases: Pick<Purchase, 'purchase_date'>[];
  let userBonuses: Pick<UserBonus, 'bonus_id'>[];

  if (isDemoMode()) {
    purchases = DEMO_PURCHASES;
    userBonuses = DEMO_BONUSES;
  } else {
    const supabase = createServerSupabaseClient();
    const [purchaseResult, bonusResult] = await Promise.all([
      supabase.from('purchases').select('purchase_date').eq('user_id', user.id).order('purchase_date', { ascending: true }).limit(1),
      supabase.from('user_bonuses').select('bonus_id').eq('user_id', user.id),
    ]);
    purchases = (purchaseResult.data || []) as Pick<Purchase, 'purchase_date'>[];
    userBonuses = (bonusResult.data || []) as Pick<UserBonus, 'bonus_id'>[];
  }

  const purchaseDate = purchases[0]?.purchase_date || new Date().toISOString();
  const currentDay = getProtocolDay(purchaseDate);
  const unlockedIds = new Set(userBonuses.map((b) => b.bonus_id));

  const bonusesWithStatus = BONUSES.map((bonus) => ({
    ...bonus,
    status: getBonusStatus(bonus, currentDay, unlockedIds),
  }));

  return (
    <main className="px-5 pt-8 pb-24 max-w-lg mx-auto">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Bonus</h1>
      <p className="text-foreground/60 mb-6">Materiales complementarios para tu protocolo</p>
      <BonusSection bonuses={bonusesWithStatus} />
    </main>
  );
}
