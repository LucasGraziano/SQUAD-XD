// Optional YouTube video embeds per protocol day.
// Add videoId when a YouTube video is available for that day.
// Leave entry out or set videoId to undefined to hide the video section.

type DayVideoConfig = {
  videoId: string;
  title: string;
};

// Add entries here as videos become available.
// Example: 1: { videoId: 'dQw4w9WgXcQ', title: 'Introducción al Día 1' }
const DAY_VIDEOS: Partial<Record<number, DayVideoConfig>> = {
  // Day 1-7: Module 1 — Reposicionamiento
  // 1: { videoId: 'YOUR_VIDEO_ID', title: 'Día 1 — Introducción al Protocolo' },
  // Day 8-14: Module 2 — Compresión
  // Day 15-28: Module 3 — Anclaje
};

export function getVideoForDay(day: number): DayVideoConfig | null {
  return DAY_VIDEOS[day] ?? null;
}
