'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useOnboarding, type PersonalInfoDraft } from '@/lib/contexts/onboarding-context'
import { StepShell, StepSkeleton } from '@/components/onboarding/step-shell'
import { Card, CardBody } from '@/components/ui/card'
import { Field, Input } from '@/components/ui/field'

type PersonalErrors = Partial<Record<'first_name' | 'last_name' | 'email', string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function fetchAuthEmail(supabase: ReturnType<typeof createClient>): Promise<string> {
  const { data } = await supabase.auth.getUser()
  return data.user?.email ?? ''
}

export function PersonalInfoStep() {
  const { hydrated } = useOnboarding()
  if (!hydrated) return <StepSkeleton />
  return <PersonalInfoForm />
}

/** Rendered only after the draft has hydrated, so initial state is safe. */
function PersonalInfoForm() {
  const { data, updateData } = useOnboarding()
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState<PersonalInfoDraft>(data.personalInfo)
  const [errors, setErrors] = useState<PersonalErrors>({})

  // Prefill the email from the signed-in account when the draft has none.
  useEffect(() => {
    let active = true
    fetchAuthEmail(supabase).then((email) => {
      if (active && email) {
        setForm((current) => (current.email ? current : { ...current, email }))
      }
    })
    return () => {
      active = false
    }
  }, [supabase])

  const setField =
    (key: keyof PersonalInfoDraft) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setForm((current) => ({ ...current, [key]: value }))
    }

  const handleContinue = () => {
    const nextErrors: PersonalErrors = {}
    if (!form.first_name.trim()) nextErrors.first_name = 'First name is required.'
    if (!form.last_name.trim()) nextErrors.last_name = 'Last name is required.'
    const email = form.email.trim()
    if (email && !EMAIL_PATTERN.test(email)) nextErrors.email = 'Enter a valid email address.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    updateData({
      personalInfo: {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email,
        phone: form.phone.trim(),
        location: form.location.trim(),
        linkedin_url: form.linkedin_url.trim(),
        github_url: form.github_url.trim(),
        stackoverflow_url: form.stackoverflow_url.trim(),
      },
    })
    router.push('/onboarding/skills')
  }

  return (
    <StepShell
      title="Tell us about yourself"
      description="The essentials that sit at the top of every resume. Only your name is required."
      onContinue={handleContinue}
    >
      <Card>
        <CardBody className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="First name" required error={errors.first_name}>
              <Input
                value={form.first_name}
                onChange={setField('first_name')}
                autoComplete="given-name"
                placeholder="Ada"
              />
            </Field>
            <Field label="Last name" required error={errors.last_name}>
              <Input
                value={form.last_name}
                onChange={setField('last_name')}
                autoComplete="family-name"
                placeholder="Lovelace"
              />
            </Field>
          </div>

          <Field
            label="Email"
            error={errors.email}
            hint="Prefilled from your account — shown in your resume header."
          >
            <Input
              type="email"
              value={form.email}
              onChange={setField('email')}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone">
              <Input
                type="tel"
                value={form.phone}
                onChange={setField('phone')}
                autoComplete="tel"
                placeholder="+1 555 000 1234"
              />
            </Field>
            <Field label="Location" hint="City and country are plenty.">
              <Input
                value={form.location}
                onChange={setField('location')}
                autoComplete="address-level2"
                placeholder="Berlin, Germany"
              />
            </Field>
          </div>

          <div className="border-t border-stone-200 pt-5">
            <h2 className="text-sm font-semibold text-stone-900">Social profiles</h2>
            <p className="mt-0.5 text-xs text-stone-500">
              Optional — included on templates that show links.
            </p>
            <div className="mt-4 space-y-5">
              <Field label="LinkedIn URL">
                <Input
                  inputMode="url"
                  value={form.linkedin_url}
                  onChange={setField('linkedin_url')}
                  placeholder="https://linkedin.com/in/ada"
                />
              </Field>
              <Field label="GitHub URL">
                <Input
                  inputMode="url"
                  value={form.github_url}
                  onChange={setField('github_url')}
                  placeholder="https://github.com/ada"
                />
              </Field>
              <Field label="Stack Overflow URL">
                <Input
                  inputMode="url"
                  value={form.stackoverflow_url}
                  onChange={setField('stackoverflow_url')}
                  placeholder="https://stackoverflow.com/users/1234"
                />
              </Field>
            </div>
          </div>
        </CardBody>
      </Card>
    </StepShell>
  )
}
