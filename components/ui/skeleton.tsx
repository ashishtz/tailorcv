import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-shimmer rounded-lg bg-stone-200/80 bg-linear-to-r from-stone-200 via-stone-100 to-stone-200 bg-[length:400px_100%]',
        className
      )}
      {...props}
    />
  )
}

/** Standard list-page skeleton: header row + n rows */
export function SkeletonRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  )
}
