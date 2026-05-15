import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#0BD904] text-[#0D0D0D] hover:bg-[#09C003] focus-visible:ring-[#0BD904] font-semibold',
  secondary:
    'bg-transparent text-[#0D0D0D] border border-[#D1D1D1] hover:bg-[#F4F4F4] hover:border-[#9CA3AF] font-medium',
  destructive:
    'bg-transparent text-[#DC2626] border border-[#FECACA] hover:bg-[#FEF2F2] hover:border-[#DC2626] font-medium',
  ghost:
    'bg-transparent text-[#6B7280] hover:bg-[#F4F4F4] hover:text-[#0D0D0D] font-medium',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-10 px-5 text-[14px]',
  lg: 'h-11 px-6 text-[15px]',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      asChild = false,
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-[6px] transition-colors duration-120',
          'outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:bg-[#E5E5E5] disabled:text-[#9CA3AF] disabled:cursor-not-allowed disabled:border-transparent',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {children}
          </>
        ) : children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'
