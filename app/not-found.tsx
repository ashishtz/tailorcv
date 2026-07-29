import Link from 'next/link'
import { FileQuestion, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
          <FileQuestion className="h-6 w-6 text-brand-600" aria-hidden />
        </div>
        <h1 className="mt-4 font-display text-xl font-bold text-stone-900">Page not found</h1>
        <p className="mt-2 text-sm text-stone-600">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button>
              <Home aria-hidden />
              Go to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
