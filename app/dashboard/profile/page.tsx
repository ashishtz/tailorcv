'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { KeyRound, Save, Upload } from 'lucide-react'
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { LinkedInIcon, GitHubIcon, StackOverflowIcon } from '@/components/icons/SocialIcons'
import SkillsSection from '@/components/profile/SkillsSection'
import WorkExperienceSection from '@/components/profile/WorkExperienceSection'
import EducationSection from '@/components/profile/EducationSection'
import ProjectsSection from '@/components/profile/ProjectsSection'
import { ImportResumeModal } from '@/components/profile/ImportResumeModal'

const EDITABLE_FIELDS = [
  'first_name',
  'last_name',
  'email',
  'phone',
  'location',
  'birthday',
  'linkedin_url',
  'github_url',
  'stackoverflow_url',
] as const

type EditableField = (typeof EDITABLE_FIELDS)[number]

/** Form state: every editable column as a string ('' for null). */
type ProfileFormState = Record<EditableField, string>

const EMPTY_FORM: ProfileFormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  location: '',
  birthday: '',
  linkedin_url: '',
  github_url: '',
  stackoverflow_url: '',
}

function toFormState(row: Partial<Record<EditableField, string | null>>): ProfileFormState {
  const state = { ...EMPTY_FORM }
  for (const field of EDITABLE_FIELDS) {
    state[field] = row[field] ?? ''
  }
  return state
}

const SOCIAL_FIELDS: Array<{
  key: EditableField
  label: string
  placeholder: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  {
    key: 'linkedin_url',
    label: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/username',
    icon: LinkedInIcon,
  },
  {
    key: 'github_url',
    label: 'GitHub',
    placeholder: 'https://github.com/username',
    icon: GitHubIcon,
  },
  {
    key: 'stackoverflow_url',
    label: 'Stack Overflow',
    placeholder: 'https://stackoverflow.com/users/id',
    icon: StackOverflowIcon,
  },
]

const MIN_PASSWORD_LENGTH = 8

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileFormState>(EMPTY_FORM)
  const [savedProfile, setSavedProfile] = useState<ProfileFormState | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  // Bumped after an import so each section remounts and refetches its list.
  const [refreshKey, setRefreshKey] = useState(0)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [changingPassword, setChangingPassword] = useState(false)

  const supabase = createClient()
  const toast = useToast()

  const fetchProfile = useCallback(async (): Promise<ProfileFormState | null> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select(
        'first_name, last_name, email, phone, location, birthday, linkedin_url, github_url, stackoverflow_url'
      )
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      toast.error('Could not load your profile', error.message)
      return null
    }
    return toFormState((data ?? {}) as Partial<Record<EditableField, string | null>>)
  }, [supabase, toast])

  useEffect(() => {
    let active = true
    fetchProfile().then((state) => {
      if (!active) return
      if (state) {
        setForm(state)
        setSavedProfile(state)
      }
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [fetchProfile])

  const handleImportSuccess = useCallback(() => {
    setRefreshKey((key) => key + 1)
    fetchProfile().then((state) => {
      if (state) {
        setForm(state)
        setSavedProfile(state)
      }
    })
  }, [fetchProfile])

  const setField = (field: EditableField, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // PATCH only the fields that actually changed - never the whole row.
    const updates: Partial<Record<EditableField, string | null>> = {}
    for (const field of EDITABLE_FIELDS) {
      const next = form[field].trim()
      const previous = (savedProfile?.[field] ?? '').trim()
      if (next !== previous) updates[field] = next || null
    }

    if (Object.keys(updates).length === 0) {
      toast.info('Nothing to save', 'You have not changed any fields.')
      return
    }

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSaving(false)
      toast.error('You are signed out', 'Sign in again to save your changes.')
      return
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
    setSaving(false)

    if (error) {
      toast.error('Could not save your profile', error.message)
      return
    }

    const normalized = toFormState(
      Object.fromEntries(
        EDITABLE_FIELDS.map((field) => [field, form[field].trim()])
      ) as Record<EditableField, string>
    )
    setForm(normalized)
    setSavedProfile(normalized)
    toast.success('Profile saved')
  }

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const lengthError =
      newPassword.length < MIN_PASSWORD_LENGTH
        ? `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
        : null
    const matchError =
      confirmPassword !== newPassword ? 'Passwords do not match.' : null
    setPasswordError(lengthError)
    setConfirmError(matchError)
    if (lengthError || matchError) return

    setChangingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setChangingPassword(false)

    if (error) {
      toast.error('Could not update the password', error.message)
      return
    }

    setNewPassword('')
    setConfirmPassword('')
    toast.success('Password updated')
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-stone-900">
              Profile
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Your master career data - the source every resume is generated from.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Button variant="secondary" onClick={() => setIsImportModalOpen(true)}>
              <Upload aria-hidden />
              Import from resume
            </Button>
          </div>
        </div>

        {/* Personal information */}
        {loading ? (
          <Card>
            <CardBody className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardBody>
          </Card>
        ) : (
          <form onSubmit={handleSave}>
            <Card>
              <CardHeader
                title="Personal information"
                description="Contact details shown on your resumes."
              />
              <CardBody className="grid gap-5 sm:grid-cols-2">
                <Field label="First name">
                  <Input
                    value={form.first_name}
                    onChange={(e) => setField('first_name', e.target.value)}
                    autoComplete="given-name"
                  />
                </Field>
                <Field label="Last name">
                  <Input
                    value={form.last_name}
                    onChange={(e) => setField('last_name', e.target.value)}
                    autoComplete="family-name"
                  />
                </Field>
                <Field label="Email" hint="Shown on resumes; does not change your login email.">
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    autoComplete="email"
                  />
                </Field>
                <Field label="Phone">
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    autoComplete="tel"
                  />
                </Field>
                <Field label="Location">
                  <Input
                    value={form.location}
                    onChange={(e) => setField('location', e.target.value)}
                    placeholder="e.g. Toronto, Canada"
                  />
                </Field>
                <Field label="Birthday" hint="Optional - only shown if a template uses it.">
                  <Input
                    type="date"
                    value={form.birthday}
                    onChange={(e) => setField('birthday', e.target.value)}
                  />
                </Field>

                <div className="grid gap-5 border-t border-stone-200 pt-5 sm:col-span-2 sm:grid-cols-3">
                  {SOCIAL_FIELDS.map(({ key, label, placeholder, icon: Icon }) => (
                    <Field key={key} label={label}>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                          <Icon className="h-4 w-4" />
                        </span>
                        <Input
                          type="url"
                          className="pl-9"
                          value={form[key]}
                          onChange={(e) => setField(key, e.target.value)}
                          placeholder={placeholder}
                        />
                      </div>
                    </Field>
                  ))}
                </div>
              </CardBody>
              <CardFooter>
                <Button type="submit" loading={saving}>
                  <Save aria-hidden />
                  Save changes
                </Button>
              </CardFooter>
            </Card>
          </form>
        )}

        {/* Career sections - keyed so an import remounts and refetches them */}
        <WorkExperienceSection key={`work-${refreshKey}`} />
        <EducationSection key={`education-${refreshKey}`} />
        <ProjectsSection key={`projects-${refreshKey}`} />
        <SkillsSection key={`skills-${refreshKey}`} />

        {/* Password */}
        <form onSubmit={handlePasswordSubmit}>
          <Card>
            <CardHeader title="Password" description="Set a new password for your account." />
            <CardBody className="grid gap-5 sm:grid-cols-2">
              <Field
                label="New password"
                required
                error={passwordError ?? undefined}
                hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
              >
                <Input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => {
                    setPasswordError(null)
                    setNewPassword(e.target.value)
                  }}
                  autoComplete="new-password"
                />
              </Field>
              <Field label="Confirm new password" required error={confirmError ?? undefined}>
                <Input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmError(null)
                    setConfirmPassword(e.target.value)
                  }}
                  autoComplete="new-password"
                />
              </Field>
            </CardBody>
            <CardFooter>
              <Button type="submit" loading={changingPassword}>
                <KeyRound aria-hidden />
                Update password
              </Button>
            </CardFooter>
          </Card>
        </form>

        <ImportResumeModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={handleImportSuccess}
        />
      </div>
    </div>
  )
}
