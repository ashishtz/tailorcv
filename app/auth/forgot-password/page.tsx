'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'
import { AlertCircle, MailCheck } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    })

    setLoading(false)
    if (resetError) {
      setError(resetError.message)
      return
    }
    setSent(true)
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a link to choose a new one."
    >
      {sent ? (
        <div className="rounded-xl border border-stone-200 bg-white p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
            <MailCheck className="h-6 w-6 text-brand-600" aria-hidden />
          </div>
          <p className="mt-4 text-sm text-stone-600">
            If an account exists for{' '}
            <span className="font-medium text-stone-900">{email}</span>, a reset link is on its
            way. Check your inbox.
          </p>
          <Link
            href="/auth/login"
            className="mt-4 inline-block text-sm font-medium text-brand-700 hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {error}
            </div>
          )}

          <Field label="Email" required>
            <Input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Button type="submit" size="lg" loading={loading} className="w-full">
            Send reset link
          </Button>

          <p className="text-center text-sm text-stone-500">
            Remembered it?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-brand-700 hover:text-brand-800 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  )
}
