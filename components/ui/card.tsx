import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-xl border border-stone-200 bg-white', className)}
      {...props}
    />
  )
}

export function CardHeader({
  className,
  title,
  description,
  actions,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-5 py-4 sm:px-6',
        className
      )}
      {...props}
    >
      <div>
        <h2 className="font-display text-base font-semibold text-stone-900">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-stone-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 py-5 sm:px-6', className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 border-t border-stone-200 px-5 py-4 sm:px-6',
        className
      )}
      {...props}
    />
  )
}
