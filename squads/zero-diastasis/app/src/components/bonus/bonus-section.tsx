'use client';

import { useState } from 'react';
import { BonusCard } from '@/components/protocol/bonus-card';
import { Celebration } from '@/components/protocol/celebration';
import type { BonusConfig } from '@/types/product';

type BonusWithStatus = BonusConfig & { status: 'locked' | 'unlocked' | 'new' };

type BonusSectionProps = {
  bonuses: BonusWithStatus[];
};

export function BonusSection({ bonuses }: BonusSectionProps) {
  const [celebrate, setCelebrate] = useState(false);

  function handleDownload(bonus: BonusWithStatus) {
    if (bonus.status === 'new') {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 3500);
    }
    window.open(bonus.downloadPath, '_blank');
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
    </>
  );
}
