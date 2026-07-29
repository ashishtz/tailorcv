'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'
import { AlertCircle } from 'lucide-react'

const FRIENDLY_ERRORS: Record<string, string> = {
  'Invalid login credentials': 'That email and password combination is incorrect.',
  'Email not confirmed': 'Please confirm your email first - check your inbox for the link.',
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(FRIENDLY_ERRORS[signInError.message] ?? signInError.message)
      setLoading(false)
      return
    }

    // Route unfinished onboarding back into the flow; honor ?next= otherwise.
    const { data: { user } } = await supabase.auth.getUser()
    let destination = searchParams.get('next') || '/dashboard'
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .maybeSingle()
      if (profile && !profile.onboarding_completed) {
        destination = '/onboarding'
      }
    }

    router.push(destination)
    router.refresh()
    // Keep the button in its loading state while navigation commits.
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5" noValidate>
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

      <Field label="Password" required>
        <Input
          type="password"
          name="current-password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Field>

      <div className="flex items-center justify-end">
        <Link
          href="/auth/forgot-password"
          className="text-sm font-medium text-brand-700 hover:text-brand-800 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" size="lg" loading={loading} className="w-full">
        Sign in
      </Button>

      <p className="text-center text-sm text-stone-500">
        New here?{' '}
        <Link
          href="/auth/register"
          className="font-medium text-brand-700 hover:text-brand-800 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  )
}

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue building your resumes.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  )
}
