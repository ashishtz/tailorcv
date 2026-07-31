'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Route error:', error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden />
        </div>
        <h1 className="mt-4 font-display text-xl font-bold text-stone-900">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          An unexpected error occurred while loading this page. Your data is safe. Try again,
          or head back to the dashboard.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-stone-500">Error reference: {error.digest}</p>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="secondary" onClick={reset}>
            <RotateCcw aria-hidden />
            Try again
          </Button>
          <Link href="/dashboard" className={buttonVariants({})}>
            <Home aria-hidden />
            Go to dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
