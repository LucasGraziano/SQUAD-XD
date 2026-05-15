import { cn } from '@/lib/utils/cn'

type BadgeVariant =
  | 'ativa'
  | 'vence-30d'
  | 'vence-60d'
  | 'vencida'
  | 'cancelada'
  | 'novo-lead'
  | 'pendente'
  | 'recebido'
  | 'atrasado'
  | 'default'

const variantStyles: Record<BadgeVariant, string> = {
  'ativa':     'bg-green-50 text-green-700 border-green-200',
  'vence-30d': 'bg-red-50 text-red-700 border-red-200',
  'vence-60d': 'bg-orange-50 text-orange-700 border-orange-200',
  'vencida':   'bg-red-100 text-red-800 border-red-300',
  'cancelada': 'bg-gray-100 text-gray-600 border-gray-200',
  'novo-lead': 'border text-[#034001]',
  'pendente':  'bg-amber-50 text-amber-700 border-amber-200',
  'recebido':  'bg-green-50 text-green-700 border-green-200',
  'atrasado':  'bg-red-50 text-red-700 border-red-200',
  'default':   'bg-gray-100 text-gray-700 border-gray-200',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[12px] font-medium leading-[1.4] tracking-[0.2px] border',
        variant === 'novo-lead'
          ? 'bg-[rgba(11,217,4,0.10)] border-[rgba(11,217,4,0.25)]'
          : variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
