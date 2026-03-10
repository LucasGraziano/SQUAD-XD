export function getProtocolDay(purchaseDate: string | Date): number {
  const start = new Date(purchaseDate);
  start.setHours(0, 0, 0, 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return Math.min(Math.max(diffDays + 1, 1), 28);
}

// Per briefing: Days 1-7 = Module 2 (Reposicionamento),
// Days 8-14 = Module 3 (Compressão), Days 15-28 = Module 4 (Ancoragem)
export function getModuleForDay(day: number): number {
  if (day <= 7) return 2;
  if (day <= 14) return 3;
  return 4;
}
