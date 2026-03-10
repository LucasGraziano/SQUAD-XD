export type ProgressSummary = {
  currentDay: number;
  completedDays: number;
  totalDays: 28;
  percentage: number;
  streakDays: number;
};

export type ChartDataPoint = {
  day: number;
  waist_cm?: number | null;
  diastasis_fingers?: number | null;
  weight_kg?: number | null;
};
