import * as React from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, id, className, ...props }, ref) => {
    const inputId = id ?? (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium text-[#0D0D0D]"
          >
            {label}
            {props.required && <span className="text-[#DC2626] ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-[42px] w-full rounded-[6px] border bg-white px-3',
            'text-[14px] font-normal text-[#0D0D0D] placeholder:text-[#9CA3AF]',
            'transition-colors duration-120 outline-none',
            'border-[#D1D1D1]',
            'focus:border-[#0BD904] focus:shadow-[0_0_0_3px_rgba(11,217,4,0.12)]',
            error
              ? 'border-[#DC2626] focus:border-[#DC2626] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.10)]'
              : '',
            'disabled:bg-[#F4F4F4] disabled:text-[#9CA3AF] disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-[12px] text-[#DC2626]">{error}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
