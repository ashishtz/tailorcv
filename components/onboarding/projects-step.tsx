'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit2, ExternalLink, Plus, Rocket, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useOnboarding, type ProjectDraft } from '@/lib/contexts/onboarding-context'
import { saveOnboardingData } from '@/lib/repositories/onboarding.repository'
import { StepShell, StepSkeleton } from '@/components/onboarding/step-shell'
import { EnhanceField } from '@/components/onboarding/enhance-field'
import { Card, CardBody } from '@/components/ui/card'
import { Field, Input } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'

const EMPTY_FORM: ProjectDraft = {
  project_name: '',
  role_title: '',
  description: '',
  link: '',
}

type ProjectErrors = Partial<Record<'project_name', string>>

/** Prepends https:// when the link has no scheme, so stored links always open. */
function normalizeLink(raw: string): string {
  const value = raw.trim()
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  return `https://${value}`
}

function formatList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

export function ProjectsStep() {
  const { hydrated } = useOnboarding()
  if (!hydrated) return <StepSkeleton />
  return <ProjectsList />
}

/** Rendered only after the draft has hydrated, so initial state is safe. */
function ProjectsList() {
  const { data, updateData, reset } = useOnboarding()
  const router = useRouter()
  const toast = useToast()
  const supabase = createClient()
  const entries = data.projects

  const [form, setForm] = useState<ProjectDraft | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<ProjectErrors>({})
  const [footerNote, setFooterNote] = useState('')
  const [saving, setSaving] = useState(false)

  const formOpen = form !== null

  const setFormField = <K extends keyof ProjectDraft>(key: K, value: ProjectDraft[K]) => {
    setForm((current) => (current ? { ...current, [key]: value } : current))
  }

  const openAdd = () => {
    setForm({ ...EMPTY_FORM })
    setEditIndex(null)
    setErrors({})
    setFooterNote('')
  }

  const openEdit = (index: number) => {
    setForm({ ...entries[index] })
    setEditIndex(index)
    setErrors({})
    setFooterNote('')
  }

  const closeForm = () => {
    setForm(null)
    setEditIndex(null)
    setErrors({})
    setFooterNote('')
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form) return

    const nextErrors: ProjectErrors = {}
    if (!form.project_name.trim()) nextErrors.project_name = 'Project name is required.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const entry: ProjectDraft = {
      project_name: form.project_name.trim(),
      role_title: form.role_title.trim(),
      description: form.description.trim(),
      link: normalizeLink(form.link),
    }
    updateData({
      projects:
        editIndex === null
          ? [...entries, entry]
          : entries.map((existing, index) => (index === editIndex ? entry : existing)),
    })
    closeForm()
  }

  const removeEntry = (index: number) => {
    updateData({ projects: entries.filter((_, i) => i !== index) })
  }

  const handleFinish = async () => {
    if (formOpen) {
      setFooterNote('Add or cancel the project you are working on before finishing.')
      return
    }
    setSaving(true)
    try {
      const { data: auth, error: authError } = await supabase.auth.getUser()
      const user = auth.user
      if (authError || !user) {
        toast.error('You are signed out', 'Sign in again to finish setting up your profile.')
        return
      }

      const result = await saveOnboardingData(supabase, user.id, data)
      if (!result.ok) {
        toast.error(
          `Couldn't save your ${result.step}`,
          `${result.message} Your draft is still here — please try again.`
        )
        return
      }

      reset()
      toast.success(
        'Your profile is ready',
        result.kept.length > 0
          ? `We kept your existing ${formatList(result.kept)} instead of adding duplicates.`
          : 'Time to generate your first resume.'
      )
      router.push('/dashboard')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <StepShell
      title="Projects"
      description="Side projects and open source show initiative. This is the last step — Finish saves everything to your profile."
      backHref="/onboarding/education"
      onContinue={handleFinish}
      continueLabel="Finish setup"
      continueLoading={saving}
      footerNote={footerNote || undefined}
    >
      <div className="space-y-4">
        {entries.length > 0 && (
          <ul className="space-y-3">
            {entries.map((entry, index) => (
              <li key={`${entry.project_name}-${index}`}>
                <Card>
                  <CardBody className="flex items-start justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="font-medium text-stone-900">{entry.project_name}</p>
                      {entry.role_title && (
                        <p className="text-sm text-stone-600">{entry.role_title}</p>
                      )}
                      {entry.link && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                          <span className="truncate">{entry.link}</span>
                        </p>
                      )}
                      {entry.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-stone-600">
                          {entry.description}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(index)}
                        disabled={formOpen || saving}
                        aria-label={`Edit project ${entry.project_name}`}
                      >
                        <Edit2 aria-hidden />
                      </Button>
                      <Button
                        variant="danger-ghost"
                        size="icon-sm"
                        onClick={() => removeEntry(index)}
                        disabled={formOpen || saving}
                        aria-label={`Remove project ${entry.project_name}`}
                      >
                        <Trash2 aria-hidden />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        )}

        {form ? (
          <Card>
            <CardBody>
              <h2 className="text-sm font-semibold text-stone-900">
                {editIndex === null ? 'Add project' : 'Edit project'}
              </h2>
              <form onSubmit={handleSubmit} className="mt-4 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Project name" required error={errors.project_name}>
                    <Input
                      value={form.project_name}
                      onChange={(event) => setFormField('project_name', event.target.value)}
                      placeholder="Open source dashboard"
                    />
                  </Field>
                  <Field label="Your role">
                    <Input
                      value={form.role_title}
                      onChange={(event) => setFormField('role_title', event.target.value)}
                      placeholder="Maintainer"
                    />
                  </Field>
                </div>
                <Field label="Link" hint="We add https:// for you if it is missing.">
                  <Input
                    inputMode="url"
                    value={form.link}
                    onChange={(event) => setFormField('link', event.target.value)}
                    placeholder="github.com/you/project"
                  />
                </Field>
                <EnhanceField
                  label="Description"
                  value={form.description}
                  onChange={(description) => setFormField('description', description)}
                  rows={4}
                  enhanceType="project"
                  placeholder="What does it do, and what did you build it with?"
                  hint="Write about 10 words and an AI enhance button appears."
                />
                <div className="flex items-center justify-end gap-3">
                  <Button variant="ghost" onClick={closeForm}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="secondary">
                    {editIndex === null ? 'Add project' : 'Save changes'}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        ) : entries.length === 0 ? (
          <Card>
            <EmptyState
              icon={Rocket}
              title="No projects yet"
              description="Optional — but a strong side project often carries a resume. You can finish without one."
              action={
                <Button variant="secondary" onClick={openAdd}>
                  <Plus aria-hidden />
                  Add project
                </Button>
              }
              className="py-10"
            />
          </Card>
        ) : (
          <button
            type="button"
            onClick={openAdd}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 bg-white px-4 py-3.5 text-sm font-medium text-stone-600 transition-colors duration-150 hover:border-brand-400 hover:text-brand-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add another project
          </button>
        )}
      </div>
    </StepShell>
  )
}
