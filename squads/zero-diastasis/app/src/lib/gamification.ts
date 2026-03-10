import type { BonusConfig } from '@/types/product';

export const BONUSES: BonusConfig[] = [
  {
    id: 'stack-360',
    titleKey: 'Stack 360°',
    descriptionKey: 'Guía complementar con postura, alongamento y hábitos diários',
    unlockDay: 1,
    format: 'pdf',
    downloadPath: '/content/bonuses/placeholder.pdf',
    iconName: 'BookOpen',
  },
  {
    id: 'vacuum-master',
    titleKey: 'Vacuum Master',
    descriptionKey: 'Mini-guía de vacuum abdominal para cintura fina',
    unlockDay: 7,
    format: 'pdf',
    downloadPath: '/content/bonuses/placeholder.pdf',
    iconName: 'Zap',
  },
  {
    id: 'tracker-28',
    titleKey: 'Tracker de 28 Días',
    descriptionKey: 'Calendário visual para marcar progreso diario',
    unlockDay: 1,
    format: 'pdf',
    downloadPath: '/content/bonuses/placeholder.pdf',
    iconName: 'Calendar',
  },
];

export function checkBonusUnlocks(currentDay: number, unlockedBonusIds: Set<string>): BonusConfig[] {
  return BONUSES.filter(
    (bonus) => currentDay >= bonus.unlockDay && !unlockedBonusIds.has(bonus.id),
  );
}

export function getBonusStatus(bonus: BonusConfig, currentDay: number, unlockedIds: Set<string>): 'locked' | 'unlocked' | 'new' {
  if (unlockedIds.has(bonus.id)) return 'unlocked';
  if (currentDay >= bonus.unlockDay) return 'new';
  return 'locked';
}
