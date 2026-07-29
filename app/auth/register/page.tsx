'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'
import { AlertCircle, MailCheck } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({})
  const [loading, setLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const nextFieldErrors: typeof fieldErrors = {}
    if (password.length < 8) {
      nextFieldErrors.password = 'Use at least 8 characters.'
    }
    if (confirmPassword !== password) {
      nextFieldErrors.confirm = 'Passwords do not match.'
    }
    setFieldErrors(nextFieldErrors)
    if (Object.keys(nextFieldErrors).length > 0) return

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // With email confirmation enabled, no session is returned - tell the user
    // to check their inbox instead of silently bouncing off the auth guard.
    if (!data.session) {
      setConfirmationSent(true)
      setLoading(false)
      return
    }

    router.push('/onboarding')
    router.refresh()
  }

  if (confirmationSent) {
    return (
      <AuthShell title="Check your inbox" subtitle="One more step to activate your account.">
        <div className="rounded-xl border border-stone-200 bg-white p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
            <MailCheck className="h-6 w-6 text-brand-600" aria-hidden />
          </div>
          <p className="mt-4 text-sm text-stone-600">
            We sent a confirmation link to <span className="font-medium text-stone-900">{email}</span>.
            Click it to finish creating your account.
          </p>
          <p className="mt-3 text-xs text-stone-500">
            Already registered? The email may not arrive - in that case just{' '}
            <Link href="/auth/login" className="font-medium text-brand-700 hover:underline">
              sign in
            </Link>{' '}
            or reset your password.
          </p>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free to start. Build your first resume in minutes."
    >
      <form onSubmit={handleRegister} className="space-y-5" noValidate>
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

        <Field label="Password" required error={fieldErrors.password} hint="At least 8 characters.">
          <Input
            type="password"
            name="new-password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </Field>

        <Field label="Confirm password" required error={fieldErrors.confirm}>
          <Input
            type="password"
            name="confirm-password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Field>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          Create account
        </Button>

        <p className="text-center text-sm text-stone-500">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-brand-700 hover:text-brand-800 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
