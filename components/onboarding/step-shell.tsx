'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface StepShellProps {
  title: string
  description: string
  /** Route of the previous step; omit on the first step. */
  backHref?: string
  onContinue: () => void
  continueLabel?: string
  continueLoading?: boolean
  /** Gentle warning shown above the footer actions (e.g. unsaved entry). */
  footerNote?: string
  children: React.ReactNode
}

/**
 * Shared frame for every onboarding step: heading + helper copy, the
 * step's content, and the Back/Continue footer.
 */
export function StepShell({
  title,
  description,
  backHref,
  onContinue,
  continueLabel = 'Continue',
  continueLoading = false,
  footerNote,
  children,
}: StepShellProps) {
  return (
    <section className="animate-fade-in motion-reduce:animate-none">
      <header>
        <h1 className="font-display text-2xl font-bold tracking-tight text-stone-900">{title}</h1>
        <p className="mt-1 text-sm text-stone-600">{description}</p>
      </header>

      <div className="mt-6">{children}</div>

      <footer className="mt-8">
        {footerNote && (
          <p role="status" className="mb-3 text-sm text-amber-700">
            {footerNote}
          </p>
        )}
        <div className="flex items-center justify-between gap-3">
          {backHref ? (
            <Link href={backHref} className={cn(buttonVariants({ variant: 'ghost' }))}>
              <ArrowLeft aria-hidden />
              Back
            </Link>
          ) : (
            <span aria-hidden />
          )}
          <Button onClick={onContinue} loading={continueLoading}>
            {continueLabel}
            {!continueLoading && <ArrowRight aria-hidden />}
          </Button>
        </div>
      </footer>
    </section>
  )
}

/** Skeleton shown while the locally saved draft hydrates. */
export function StepSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading step">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}
