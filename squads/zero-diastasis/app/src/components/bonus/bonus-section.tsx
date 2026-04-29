'use client';

import { useState } from 'react';
import { BonusCard } from '@/components/protocol/bonus-card';
import { Celebration } from '@/components/protocol/celebration';
import { ContentModal } from '@/components/bonus/content-modal';
import type { BonusConfig } from '@/types/product';

type BonusWithStatus = BonusConfig & { status: 'locked' | 'unlocked' | 'new' };

type BonusSectionProps = {
  bonuses: BonusWithStatus[];
};

export function BonusSection({ bonuses }: BonusSectionProps) {
  const [celebrate, setCelebrate] = useState(false);
  const [modal, setModal] = useState<{ url: string; title: string } | null>(null);

  function handleDownload(bonus: BonusWithStatus) {
    if (bonus.status === 'new') {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 3500);
    }
    setModal({ url: bonus.downloadPath, title: bonus.titleKey });
  }

  return (
    <>
      <Celebration show={celebrate} />
      <div className="space-y-4">
        {bonuses.map((bonus) => (
          <BonusCard
            key={bonus.id}
            bonus={bonus}
            status={bonus.status}
            onDownload={() => handleDownload(bonus)}
          />
        ))}
      </div>
      {modal && (
        <ContentModal
          url={modal.url}
          title={modal.title}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
