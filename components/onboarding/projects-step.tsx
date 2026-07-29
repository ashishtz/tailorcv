'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink, Plus, Rocket } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useOnboarding, type ProjectDraft } from '@/lib/contexts/onboarding-context'
import { normalizeLink, saveOnboardingData } from '@/lib/repositories/onboarding.repository'
import { StepShell, StepSkeleton } from '@/components/onboarding/step-shell'
import { AddEntryButton, EntryRow, useEntryForm } from '@/components/forms/entry-form'
import { ProjectFields, type FieldErrors } from '@/components/forms/entry-fields'
import { Card, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'

const EMPTY_FORM: ProjectDraft = {
  project_name: '',
  role_title: '',
  description: '',
  link: '',
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

  const entryForm = useEntryForm<ProjectDraft, number>()
  const [errors, setErrors] = useState<FieldErrors<ProjectDraft>>({})
  const [footerNote, setFooterNote] = useState('')
  const [saving, setSaving] = useState(false)

  const openAdd = () => {
    setErrors({})
    setFooterNote('')
    entryForm.open({ ...EMPTY_FORM })
  }

  const openEdit = (index: number) => {
    setErrors({})
    setFooterNote('')
    entryForm.open({ ...entries[index] }, index)
  }

  const closeForm = () => {
    setErrors({})
    setFooterNote('')
    entryForm.close()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = entryForm.form
    if (!form) return

    const nextErrors: FieldErrors<ProjectDraft> = {}
    if (!form.project_name.trim()) nextErrors.project_name = 'Project name is required.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const entry: ProjectDraft = {
      project_name: form.project_name.trim(),
      role_title: form.role_title.trim(),
      description: form.description.trim(),
      link: normalizeLink(form.link),
    }
    const editIndex = entryForm.editKey
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
    if (entryForm.isOpen) {
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
                    <EntryRow
                      title={entry.project_name}
                      subtitle={entry.role_title || undefined}
                      description={entry.description || undefined}
                      clampDescription
                      editLabel={`Edit project ${entry.project_name}`}
                      deleteLabel={`Remove project ${entry.project_name}`}
                      onEdit={() => openEdit(index)}
                      onDelete={() => removeEntry(index)}
                      disabled={entryForm.isOpen || saving}
                    >
                      {entry.link && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                          <span className="truncate">{entry.link}</span>
                        </p>
                      )}
                    </EntryRow>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        )}

        {entryForm.form ? (
          <Card>
            <CardBody>
              <h2 className="text-sm font-semibold text-stone-900">
                {entryForm.editKey === null ? 'Add project' : 'Edit project'}
              </h2>
              <form onSubmit={handleSubmit} className="mt-4 space-y-5">
                <ProjectFields form={entryForm.form} onChange={entryForm.patch} errors={errors} />
                <div className="flex items-center justify-end gap-3">
                  <Button variant="ghost" onClick={closeForm}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="secondary">
                    {entryForm.editKey === null ? 'Add project' : 'Save changes'}
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
          <AddEntryButton label="Add another project" onClick={openAdd} />
        )}
      </div>
    </StepShell>
  )
}
