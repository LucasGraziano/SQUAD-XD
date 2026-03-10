import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-secondary text-foreground/80',
  success: 'bg-green-100 text-green-800',
  locked: 'bg-gray-100 text-gray-500',
  accent: 'bg-accent-100 text-accent-500',
  new: 'bg-primary-100 text-primary-600',
} as const;

type BadgeProps = {
  variant?: keyof typeof variants;
  children: React.ReactNode;
  className?: string;
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
