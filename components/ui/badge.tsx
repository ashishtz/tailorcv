import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        brand: 'bg-brand-50 text-brand-700',
        accent: 'bg-accent-100 text-accent-800',
        stone: 'bg-stone-100 text-stone-700',
        success: 'bg-emerald-50 text-emerald-700',
      },
    },
    defaultVariants: {
      variant: 'stone',
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
