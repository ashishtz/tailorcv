'use client'

import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap rounded-lg transition-colors duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
        secondary:
          'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 hover:border-stone-400 active:bg-stone-100',
        ghost: 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-200',
        danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-600',
        'danger-ghost':
          'text-red-600 hover:bg-red-50 hover:text-red-700 active:bg-red-100 focus-visible:ring-red-600',
        accent: 'bg-accent-500 text-accent-950 hover:bg-accent-400 active:bg-accent-600',
      },
      size: {
        sm: 'h-8 px-3 text-xs [&_svg]:size-3.5',
        md: 'h-10 px-4 text-sm [&_svg]:size-4',
        lg: 'h-12 px-6 text-base [&_svg]:size-5',
        'icon-sm': 'h-8 w-8 [&_svg]:size-4',
        icon: 'h-10 w-10 [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, disabled, children, type, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" aria-hidden />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { buttonVariants }
