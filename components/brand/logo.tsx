import Link from 'next/link'
import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  href?: string
  /** dark = for light backgrounds (default), light = for dark backgrounds */
  tone?: 'dark' | 'light'
  className?: string
}

export function Logo({ href = '/', tone = 'dark', className }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
        className
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
        <FileText className="h-4.5 w-4.5 text-white" aria-hidden />
      </span>
      <span
        className={cn(
          'font-display text-lg font-bold tracking-tight',
          tone === 'dark' ? 'text-stone-900' : 'text-white'
        )}
      >
        Resume Builder
      </span>
    </Link>
  )
}
