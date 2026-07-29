'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, Plus } from 'lucide-react'
import { useOnboarding, type EducationDraft } from '@/lib/contexts/onboarding-context'
import { StepShell, StepSkeleton } from '@/components/onboarding/step-shell'
import {
  AddEntryButton,
  EntryRow,
  endBeforeStart,
  useEntryForm,
} from '@/components/forms/entry-form'
import { EducationFields, type FieldErrors } from '@/components/forms/entry-fields'
import { Card, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { formatMonthYear } from '@/lib/utils'

const EMPTY_FORM: EducationDraft = {
  institution_name: '',
  degree: '',
  field_of_study: '',
  start_date: '',
  end_date: '',
}

function rangeText(entry: EducationDraft): string {
  const start = formatMonthYear(entry.start_date)
  if (!start) return formatMonthYear(entry.end_date)
  return `${start} — ${entry.end_date ? formatMonthYear(entry.end_date) : 'In progress'}`
}

export function EducationStep() {
  const { hydrated } = useOnboarding()
  if (!hydrated) return <StepSkeleton />
  return <EducationList />
}

/** Rendered only after the draft has hydrated, so initial state is safe. */
function EducationList() {
  const { data, updateData } = useOnboarding()
  const router = useRouter()
  const entries = data.education

  const entryForm = useEntryForm<EducationDraft, number>()
  const [errors, setErrors] = useState<FieldErrors<EducationDraft>>({})
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

    const nextErrors: FieldErrors<EducationDraft> = {}
    if (!form.institution_name.trim()) nextErrors.institution_name = 'Institution is required.'
    if (!form.start_date) nextErrors.start_date = 'Start month is required.'
    if (endBeforeStart(form.start_date, form.end_date)) {
      nextErrors.end_date = 'End month must be the same as or after the start month.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const entry: EducationDraft = {
      ...form,
      institution_name: form.institution_name.trim(),
      field_of_study: form.field_of_study.trim(),
    }
    const editIndex = entryForm.editKey
    updateData({
      education:
        editIndex === null
          ? [...entries, entry]
          : entries.map((existing, index) => (index === editIndex ? entry : existing)),
    })
    closeForm()
  }

  const removeEntry = (index: number) => {
    updateData({ education: entries.filter((_, i) => i !== index) })
  }

  const handleContinue = () => {
    if (entryForm.isOpen) {
      setFooterNote('Add or cancel the entry you are working on before continuing.')
      return
    }
    router.push('/onboarding/projects')
  }

  return (
    <StepShell
      title="Your education"
      description="Schools, degrees and certificates — add whatever supports your story."
      backHref="/onboarding/work-experience"
      onContinue={handleContinue}
      footerNote={footerNote || undefined}
    >
      <div className="space-y-4">
        {entries.length > 0 && (
          <ul className="space-y-3">
            {entries.map((entry, index) => (
              <li key={`${entry.institution_name}-${index}`}>
                <Card>
                  <CardBody className="flex items-start justify-between gap-4 py-4">
                    <EntryRow
                      title={entry.institution_name}
                      subtitle={
                        [entry.degree, entry.field_of_study].filter(Boolean).join(' · ') ||
                        undefined
                      }
                      meta={rangeText(entry) || undefined}
                      editLabel={`Edit education at ${entry.institution_name}`}
                      deleteLabel={`Remove education at ${entry.institution_name}`}
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
                {entryForm.editKey === null ? 'Add education' : 'Edit education'}
              </h2>
              <form onSubmit={handleSubmit} className="mt-4 space-y-5">
                <EducationFields form={entryForm.form} onChange={entryForm.patch} errors={errors} />
                <div className="flex items-center justify-end gap-3">
                  <Button variant="ghost" onClick={closeForm}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="secondary">
                    {entryForm.editKey === null ? 'Add education' : 'Save changes'}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        ) : entries.length === 0 ? (
          <Card>
            <EmptyState
              icon={GraduationCap}
              title="No education yet"
              description="Schools, bootcamps and certificate programs all belong here."
              action={
                <Button variant="secondary" onClick={openAdd}>
                  <Plus aria-hidden />
                  Add education
                </Button>
              }
              className="py-10"
            />
          </Card>
        ) : (
          <AddEntryButton label="Add another education" onClick={openAdd} />
        )}
      </div>
    </StepShell>
  )
}
