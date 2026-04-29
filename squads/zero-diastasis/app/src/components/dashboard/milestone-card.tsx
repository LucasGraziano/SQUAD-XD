type MilestoneCardProps = {
  emoji: string;
  message: string;
  completedDays: number;
};

export function MilestoneCard({ emoji, message, completedDays }: MilestoneCardProps) {
  return (
    <div className="bg-gradient-to-r from-primary-50 via-secondary-50 to-accent-50 rounded-2xl border border-primary-100 p-5 mb-6 animate-scale-in">
      <div className="flex items-center gap-4">
        <div className="text-4xl animate-bounce-gentle">{emoji}</div>
        <div>
          <p className="font-heading font-bold text-foreground text-lg">{message}</p>
          <p className="text-sm text-foreground/50">{completedDays} días completados · ¡Sigue así!</p>
        </div>
      </div>
    </div>
  );
}
