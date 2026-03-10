export type Phase = {
  id: number;
  name: string;
  nameES: string;
  days: string;
  dayStart: number;
  dayEnd: number;
  color: string;
  description: string;
};

export type DayContent = {
  day: number;
  phase: number;
  title: string;
  duration: string;
  type: 'ebook' | 'audio' | 'exercise' | 'rest';
  description: string;
};

export const phases: Phase[] = [
  {
    id: 1,
    name: 'El Desbloqueo',
    nameES: 'El Desbloqueo',
    days: 'Día 0',
    dayStart: 0,
    dayEnd: 0,
    color: '#C9A96E',
    description: 'Entiende qué pasó con tu cuerpo. E-book visual en 20 minutos.',
  },
  {
    id: 2,
    name: 'La Reconexión',
    nameES: 'La Reconexión',
    days: 'Días 1–7',
    dayStart: 1,
    dayEnd: 7,
    color: '#D4A5A5',
    description: 'Reconecta tu respiración con tu abdomen. Audio-guías de 8 min.',
  },
  {
    id: 3,
    name: 'La Compresión',
    nameES: 'La Compresión',
    days: 'Días 8–14',
    dayStart: 8,
    dayEnd: 14,
    color: '#C97B7B',
    description: 'Fortalece de pie con ejercicios suaves. Aquí ves la diferencia.',
  },
  {
    id: 4,
    name: 'El Anclaje',
    nameES: 'El Anclaje',
    days: 'Días 15–28',
    dayStart: 15,
    dayEnd: 28,
    color: '#7CB68E',
    description: 'Consolida como hábito automático. 12 min/día para resultados duraderos.',
  },
];

export const days: DayContent[] = [
  {
    day: 0,
    phase: 1,
    title: 'Lee "El Desbloqueo"',
    duration: '20 min lectura',
    type: 'ebook',
    description:
      'Tu e-book de bienvenida. Entiende qué pasó con tu cuerpo después del embarazo — sin palabras difíciles — y por qué todo lo que intentaste antes no funcionó.',
  },
  ...Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    phase: 2,
    title: `Sesión de Reconexión ${i + 1}`,
    duration: '8 min audio',
    type: 'audio' as const,
    description:
      i === 0
        ? 'Tu primera sesión. Acuéstate en un lugar cómodo, ponte los audífonos y sigue la guía. Vamos a reconectar tu respiración con tu abdomen.'
        : `Sesión ${i + 1} de reconexión. Cada día profundizas la conexión con tu músculo profundo.`,
  })),
  ...Array.from({ length: 7 }, (_, i) => ({
    day: i + 8,
    phase: 3,
    title: `Ejercicio de Compresión ${i + 1}`,
    duration: '10 min audio',
    type: 'exercise' as const,
    description:
      i === 0
        ? 'Hoy empiezas de pie. Los ejercicios son suaves pero vas a sentir cómo tu abdomen trabaja de una forma diferente.'
        : `Sesión ${i + 1} de compresión. Tu cuerpo ya sabe qué hacer — ahora lo fortalecemos.`,
  })),
  ...Array.from({ length: 14 }, (_, i) => ({
    day: i + 15,
    phase: 4,
    title: `Anclaje — Día ${i + 15}`,
    duration: '12 min audio',
    type: 'exercise' as const,
    description:
      i === 0
        ? 'Entramos en la fase final. A partir de hoy, tu cuerpo automatiza el patrón. Solo sigue la guía 12 minutos.'
        : i === 13
          ? '¡Último día! Completaste los 28 días. Tu abdomen nunca volverá a ser el mismo — en el mejor sentido.'
          : `Día ${i + 15} de anclaje. Mantén tu racha y siente cómo los resultados se consolidan.`,
  })),
];

export function getPhaseForDay(day: number): Phase {
  return phases.find((p) => day >= p.dayStart && day <= p.dayEnd) ?? phases[0];
}

export function getDayContent(day: number): DayContent | undefined {
  return days.find((d) => d.day === day);
}

export function getProgress(currentDay: number): number {
  return Math.min(Math.round((currentDay / 28) * 100), 100);
}
