import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingProvider } from '@/lib/contexts/onboarding-context'
import { OnboardingStepper } from '@/components/onboarding/stepper'
import { Logo } from '@/components/brand/logo'
import { buttonVariants } from '@/components/ui/button-variants'

export const metadata: Metadata = {
  title: 'Set up your profile',
}

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .maybeSingle()
  const profile = data as { onboarding_completed: boolean | null } | null
  if (profile?.onboarding_completed) redirect('/dashboard')

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo href="/onboarding" />
          <Link
            href="/dashboard"
            title="Your answers are saved as a draft in this browser. Come back anytime to finish."
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            Save & exit
            <span className="sr-only">
              {' '}
              (your answers are saved as a draft in this browser, so you can come back anytime to finish)
            </span>
          </Link>
        </div>
      </header>

      <OnboardingProvider>
        <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
          <OnboardingStepper />
          <div className="mt-8">{children}</div>
        </main>
      </OnboardingProvider>
    </div>
  )
}
