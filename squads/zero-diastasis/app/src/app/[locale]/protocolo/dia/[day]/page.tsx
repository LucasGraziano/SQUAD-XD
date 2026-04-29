import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import { getProtocolDay, getModuleForDay } from '@/hooks/use-protocol-day';
import { AudioPlayer } from '@/components/audio/audio-player';
import { CompleteDayButton } from '@/components/protocol/complete-day-button';
import { ContextualOffer } from '@/components/upsell/contextual-offer';
import { Badge } from '@/components/ui/badge';
import { redirect } from 'next/navigation';
import { getContextualUpsell } from '@/lib/upsell-engine';
import { getVideoForDay } from '@/lib/video-config';
import { YouTubeEmbed } from '@/components/video/youtube-embed';
import { isDemoMode, DEMO_PURCHASES, DEMO_COMPLETED_DAYS } from '@/lib/demo';
import type { DayProgress, Purchase } from '@/types/database';

type Props = {
  params: { day: string; locale: string };
};

export default async function DayPage({ params }: Props) {
  const user = await requireAuth();
  const dayNumber = parseInt(params.day, 10);

  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 28) {
    redirect(`/${params.locale}/protocolo`);
  }

  let purchaseDate: string;
  let completed: boolean;

  if (isDemoMode()) {
    purchaseDate = DEMO_PURCHASES[0]?.purchase_date || new Date().toISOString();
    completed = DEMO_COMPLETED_DAYS.includes(dayNumber);
  } else {
    const supabase = createServerSupabaseClient();
    const [purchaseResult, progressResult] = await Promise.all([
      supabase.from('purchases').select('purchase_date').eq('user_id', user.id).order('purchase_date', { ascending: true }).limit(1),
      supabase.from('day_progress').select('*').eq('user_id', user.id).eq('day_number', dayNumber).limit(1),
    ]);

    const purchases = (purchaseResult.data || []) as Pick<Purchase, 'purchase_date'>[];
    purchaseDate = purchases[0]?.purchase_date || new Date().toISOString();
    completed = ((progressResult.data || []) as DayProgress[]).length > 0;
  }

  const currentDay = getProtocolDay(purchaseDate);

  if (dayNumber > currentDay) {
    redirect(`/${params.locale}/protocolo`);
  }

  const moduleNum = getModuleForDay(dayNumber);
  const upsell = getContextualUpsell(dayNumber);
  const video = getVideoForDay(dayNumber);
  const audioDuration = moduleNum === 2 ? '8 min' : moduleNum === 3 ? '10 min' : '12 min';

  return (
    <main className="px-5 pt-8 pb-24 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Badge variant="accent">Módulo {moduleNum}</Badge>
        <h1 className="text-2xl font-heading font-bold text-foreground">Día {dayNumber}</h1>
        {completed && <Badge variant="success">Completado</Badge>}
      </div>

      <div className="mb-6">
        <p className="text-foreground/60 mb-2">
          Escucha la sesión completa en un lugar tranquilo. Respira profundo y sigue las instrucciones del audio.
        </p>
        <p className="text-sm text-foreground/40">Duración: {audioDuration}</p>
      </div>

      <AudioPlayer
        src={`${process.env.NEXT_PUBLIC_AUDIO_CDN_URL || ''}/audio/dia-${dayNumber}.mp3`}
        title={`Sesión Día ${dayNumber}`}
        dayNumber={dayNumber}
      />

      <CompleteDayButton dayNumber={dayNumber} isCompleted={completed} />

      {video && (
        <div className="mt-6">
          <h2 className="font-heading font-bold text-foreground mb-3 text-sm uppercase tracking-wide text-foreground/50">
            Video complementario
          </h2>
          <YouTubeEmbed videoId={video.videoId} title={video.title} />
        </div>
      )}

      {upsell && (
        <div className="mt-6">
          <ContextualOffer product={upsell.product} message={upsell.message} />
        </div>
      )}
    </main>
  );
}
