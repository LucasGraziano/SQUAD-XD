import { cn } from '@/lib/utils/cn'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex items-center justify-between',
        'h-14 px-8 bg-[#F8F8F8] border-b border-[#E5E5E5]',
        className
      )}
    >
      <div>
        <h1 className="text-[22px] font-semibold text-[#0D0D0D] leading-tight font-ui">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] text-[#6B7280] mt-0.5">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}
