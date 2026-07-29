'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Plus } from 'lucide-react'
import { useOnboarding, type WorkExperienceDraft } from '@/lib/contexts/onboarding-context'
import { StepShell, StepSkeleton } from '@/components/onboarding/step-shell'
import {
  AddEntryButton,
  EntryRow,
  endBeforeStart,
  useEntryForm,
} from '@/components/forms/entry-form'
import { WorkFields, type FieldErrors } from '@/components/forms/entry-fields'
import { Card, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { formatMonthYear } from '@/lib/utils'

const EMPTY_FORM: WorkExperienceDraft = {
  company_name: '',
  position_title: '',
  location: '',
  job_type: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
}

function rangeText(entry: WorkExperienceDraft): string {
  const start = formatMonthYear(entry.start_date)
  const end = entry.is_current ? 'Present' : formatMonthYear(entry.end_date)
  if (start && end) return `${start} — ${end}`
  return start || end
}

export function WorkExperienceStep() {
  const { hydrated } = useOnboarding()
  if (!hydrated) return <StepSkeleton />
  return <WorkExperienceList />
}

/** Rendered only after the draft has hydrated, so initial state is safe. */
function WorkExperienceList() {
  const { data, updateData } = useOnboarding()
  const router = useRouter()
  const entries = data.workExperiences

  const entryForm = useEntryForm<WorkExperienceDraft, number>()
  const [errors, setErrors] = useState<FieldErrors<WorkExperienceDraft>>({})
  const [footerNote, setFooterNote] = useState('')

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

    const nextErrors: FieldErrors<WorkExperienceDraft> = {}
    if (!form.company_name.trim()) nextErrors.company_name = 'Company is required.'
    if (!form.position_title.trim()) nextErrors.position_title = 'Position is required.'
    if (!form.start_date) nextErrors.start_date = 'Start month is required.'
    if (!form.is_current && endBeforeStart(form.start_date, form.end_date)) {
      nextErrors.end_date = 'End month must be the same as or after the start month.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const entry: WorkExperienceDraft = {
      ...form,
      company_name: form.company_name.trim(),
      position_title: form.position_title.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      end_date: form.is_current ? '' : form.end_date,
    }
    const editIndex = entryForm.editKey
    updateData({
      workExperiences:
        editIndex === null
          ? [...entries, entry]
          : entries.map((existing, index) => (index === editIndex ? entry : existing)),
    })
    closeForm()
  }

  const removeEntry = (index: number) => {
    updateData({ workExperiences: entries.filter((_, i) => i !== index) })
  }

  const handleContinue = () => {
    if (entryForm.isOpen) {
      setFooterNote('Add or cancel the entry you are working on before continuing.')
      return
    }
    router.push('/onboarding/education')
  }

  return (
    <StepShell
      title="Your work experience"
      description="Add the roles you want on your resume — the AI tailors them to each job you apply for."
      backHref="/onboarding/skills"
      onContinue={handleContinue}
      footerNote={footerNote || undefined}
    >
      <div className="space-y-4">
        {entries.length > 0 && (
          <ul className="space-y-3">
            {entries.map((entry, index) => (
              <li key={`${entry.company_name}-${entry.position_title}-${index}`}>
                <Card>
                  <CardBody className="flex items-start justify-between gap-4 py-4">
                    <EntryRow
                      title={entry.position_title}
                      subtitle={
                        [entry.company_name, entry.location].filter(Boolean).join(' · ') ||
                        undefined
                      }
                      meta={
                        [entry.job_type, rangeText(entry)].filter(Boolean).join(' · ') || undefined
                      }
                      description={entry.description || undefined}
                      clampDescription
                      editLabel={`Edit ${entry.position_title} at ${entry.company_name}`}
                      deleteLabel={`Remove ${entry.position_title} at ${entry.company_name}`}
                      onEdit={() => openEdit(index)}
                      onDelete={() => removeEntry(index)}
                      disabled={entryForm.isOpen}
                    />
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
                {entryForm.editKey === null ? 'Add work experience' : 'Edit work experience'}
              </h2>
              <form onSubmit={handleSubmit} className="mt-4 space-y-5">
                <WorkFields form={entryForm.form} onChange={entryForm.patch} errors={errors} />
                <div className="flex items-center justify-end gap-3">
                  <Button variant="ghost" onClick={closeForm}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="secondary">
                    {entryForm.editKey === null ? 'Add experience' : 'Save changes'}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        ) : entries.length === 0 ? (
          <Card>
            <EmptyState
              icon={Briefcase}
              title="No work experience yet"
              description="Add the roles you want on your resume — internships and freelance work count too."
              action={
                <Button variant="secondary" onClick={openAdd}>
                  <Plus aria-hidden />
                  Add experience
                </Button>
              }
              className="py-10"
            />
          </Card>
        ) : (
          <AddEntryButton label="Add another experience" onClick={openAdd} />
        )}
      </div>
    </StepShell>
  )
}
