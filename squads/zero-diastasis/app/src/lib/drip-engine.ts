import type { DayStatus } from '@/types/protocol';

export function getDayStatus(dayNumber: number, currentDay: number, completedDays: Set<number>): DayStatus {
  if (completedDays.has(dayNumber)) return 'completed';
  if (dayNumber <= currentDay) return 'available';
  return 'locked';
}

export function getAvailableDays(currentDay: number): number[] {
  return Array.from({ length: Math.min(currentDay, 28) }, (_, i) => i + 1);
}

export function getUnlockDate(purchaseDate: string | Date, dayNumber: number): Date {
  const start = new Date(purchaseDate);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + dayNumber - 1);
  return start;
}

export function getDaysUntilUnlock(purchaseDate: string | Date, dayNumber: number): number {
  const unlockDate = getUnlockDate(purchaseDate, dayNumber);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = unlockDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
