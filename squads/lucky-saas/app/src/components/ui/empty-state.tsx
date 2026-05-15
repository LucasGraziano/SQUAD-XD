import { type LucideIcon } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils/cn'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-8 text-center',
        className
      )}
    >
      <Icon className="h-10 w-10 text-[#D1D1D1] mb-4" strokeWidth={1.5} />
      <h3 className="font-display text-[22px] font-bold text-[#0D0D0D] mb-2">
        {title}
      </h3>
      <p className="text-[14px] text-[#6B7280] max-w-[360px] leading-relaxed">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  )
}
