import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  href?: string
  /** dark = for light backgrounds (default), light = for dark backgrounds */
  tone?: 'dark' | 'light'
  /** Hide the wordmark and show the mark alone (tight spaces, avatars). */
  markOnly?: boolean
  className?: string
}

/**
 * Mark: a sheet with its top-right corner cut away, three lines of text
 * inside, the middle one trimmed short and picked out in amber - the line
 * being tailored. Stays legible at favicon size because the cut silhouette
 * and the bars are chunky.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-hidden focusable="false">
      <path
        d="M7 0h15l10 10v15a7 7 0 0 1-7 7H7a7 7 0 0 1-7-7V7a7 7 0 0 1 7-7Z"
        fill="var(--color-brand-600, #0b7a6e)"
      />
      <rect x="7.5" y="12" width="17" height="2.75" rx="1.25" fill="#ffffff" />
      <rect
        x="7.5"
        y="18"
        width="10.5"
        height="2.75"
        rx="1.25"
        fill="var(--color-accent-400, #fbbf24)"
      />
      <rect x="7.5" y="24" width="14" height="2.75" rx="1.25" fill="#ffffff" />
    </svg>
  )
}

export function Logo({ href = '/', tone = 'dark', markOnly, className }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="tailorcv"
      className={cn(
        'inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
        className
      )}
    >
      <LogoMark className="h-8 w-8 shrink-0" />
      {!markOnly && (
        <span
          className={cn(
            'font-display text-lg font-bold tracking-tight',
            tone === 'dark' ? 'text-stone-900' : 'text-white'
          )}
        >
          tailor
          <span className={tone === 'dark' ? 'text-brand-600' : 'text-brand-300'}>cv</span>
        </span>
      )}
    </Link>
  )
}
