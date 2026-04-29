// Calculates streak (consecutive days completed) from a list of completed day numbers
export function calculateStreak(completedDays: number[], currentDay: number): number {
  if (completedDays.length === 0) return 0;

  const sorted = [...new Set(completedDays)].sort((a, b) => b - a);
  let streak = 0;
  let expected = currentDay;

  // If today is done, start counting from today; if not, from yesterday
  const startFrom = sorted.includes(currentDay) ? currentDay : currentDay - 1;
  expected = startFrom;

  for (const day of sorted) {
    if (day === expected) {
      streak++;
      expected--;
    } else if (day < expected) {
      break;
    }
  }

  return streak;
}

export function getStreakLabel(streak: number): string {
  if (streak === 0) return '';
  if (streak === 1) return '1 día seguido';
  return `${streak} días seguidos`;
}

export function getMilestone(completedCount: number): { day: number; emoji: string; message: string } | null {
  const milestones = [
    { day: 7, emoji: '🌟', message: '¡Primera semana completada!' },
    { day: 14, emoji: '💪', message: '¡Dos semanas! Increíble constancia.' },
    { day: 21, emoji: '🔥', message: '¡21 días! El hábito ya es tuyo.' },
    { day: 28, emoji: '🏆', message: '¡28 días! Protocolo completado.' },
  ];
  return milestones.find((m) => m.day === completedCount) ?? null;
}
