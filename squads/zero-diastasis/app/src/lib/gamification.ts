import type { BonusConfig } from '@/types/product';

export const BONUSES: BonusConfig[] = [
  {
    id: 'stack-360',
    titleKey: 'Stack 360°',
    descriptionKey: 'Guía complementar con postura, alongamento y hábitos diários',
    unlockDay: 1,
    format: 'pdf' as const,
    downloadPath: '/content/stack-360.html',
    iconName: 'BookOpen',
  },
  {
    id: 'vacuum-master',
    titleKey: 'Vacuum Master',
    descriptionKey: 'Mini-guía de vacuum abdominal para cintura fina',
    unlockDay: 7,
    format: 'pdf' as const,
    downloadPath: '/content/vacuum-master.html',
    iconName: 'Zap',
  },
  {
    id: 'tracker-28',
    titleKey: 'Tracker de 28 Días',
    descriptionKey: 'Calendário visual para marcar progreso diario',
    unlockDay: 1,
    format: 'pdf' as const,
    downloadPath: '/content/tracker-28.html',
    iconName: 'Calendar',
  },
  {
    id: 'el-desbloqueo',
    titleKey: 'El Desbloqueo — Módulo 1',
    descriptionKey: 'Guía completa del primer módulo: fundamentos y reconexión abdominal',
    unlockDay: 1,
    format: 'pdf' as const,
    downloadPath: '/content/el-desbloqueo.html',
    iconName: 'BookOpen',
  },
  {
    id: 'pack-recetas',
    titleKey: 'Pack de Recetas',
    descriptionKey: '15 recetas anti-inflamatorias para potenciar tus resultados',
    unlockDay: 3,
    format: 'pdf' as const,
    downloadPath: '/content/pack-recetas.html',
    iconName: 'Zap',
  },
  {
    id: 'modulo-5',
    titleKey: 'Cierre Total — Módulo 5',
    descriptionKey: 'Bônus extra: el protocolo de cierre definitivo para resultados duraderos',
    unlockDay: 21,
    format: 'pdf' as const,
    downloadPath: '/content/modulo-5.html',
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
