'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit2, GraduationCap, Plus, Trash2 } from 'lucide-react'
import {
  DEGREES,
  useOnboarding,
  type Degree,
  type EducationDraft,
} from '@/lib/contexts/onboarding-context'
import { StepShell, StepSkeleton } from '@/components/onboarding/step-shell'
import { Card, CardBody } from '@/components/ui/card'
import { Field, Input, Select } from '@/components/ui/field'
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

type EducationErrors = Partial<Record<'institution_name' | 'start_date' | 'end_date', string>>

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

  const [form, setForm] = useState<EducationDraft | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<EducationErrors>({})
  const [footerNote, setFooterNote] = useState('')

  const formOpen = form !== null

  const setFormField = <K extends keyof EducationDraft>(key: K, value: EducationDraft[K]) => {
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

    const nextErrors: EducationErrors = {}
    if (!form.institution_name.trim()) nextErrors.institution_name = 'Institution is required.'
    if (!form.start_date) nextErrors.start_date = 'Start month is required.'
    if (form.end_date && form.start_date && form.end_date < form.start_date) {
      nextErrors.end_date = 'End month must be the same as or after the start month.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const entry: EducationDraft = {
      ...form,
      institution_name: form.institution_name.trim(),
      field_of_study: form.field_of_study.trim(),
    }
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
    if (formOpen) {
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
            {entries.map((entry, index) => {
              const subtitle = [entry.degree, entry.field_of_study].filter(Boolean).join(' · ')
              const range = rangeText(entry)
              return (
                <li key={`${entry.institution_name}-${index}`}>
                  <Card>
                    <CardBody className="flex items-start justify-between gap-4 py-4">
                      <div className="min-w-0">
                        <p className="font-medium text-stone-900">{entry.institution_name}</p>
                        {subtitle && <p className="text-sm text-stone-600">{subtitle}</p>}
                        {range && <p className="mt-1 text-xs text-stone-500">{range}</p>}
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEdit(index)}
                          disabled={formOpen}
                          aria-label={`Edit education at ${entry.institution_name}`}
                        >
                          <Edit2 aria-hidden />
                        </Button>
                        <Button
                          variant="danger-ghost"
                          size="icon-sm"
                          onClick={() => removeEntry(index)}
                          disabled={formOpen}
                          aria-label={`Remove education at ${entry.institution_name}`}
                        >
                          <Trash2 aria-hidden />
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </li>
              )
            })}
          </ul>
        )}

        {form ? (
          <Card>
            <CardBody>
              <h2 className="text-sm font-semibold text-stone-900">
                {editIndex === null ? 'Add education' : 'Edit education'}
              </h2>
              <form onSubmit={handleSubmit} className="mt-4 space-y-5">
                <Field label="Institution" required error={errors.institution_name}>
                  <Input
                    value={form.institution_name}
                    onChange={(event) => setFormField('institution_name', event.target.value)}
                    placeholder="Technical University of Munich"
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Degree">
                    <Select
                      value={form.degree}
                      onChange={(event) => setFormField('degree', event.target.value as Degree | '')}
                    >
                      <option value="">Select a degree</option>
                      {DEGREES.map((degree) => (
                        <option key={degree} value={degree}>
                          {degree}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Field of study">
                    <Input
                      value={form.field_of_study}
                      onChange={(event) => setFormField('field_of_study', event.target.value)}
                      placeholder="Computer Science"
                    />
                  </Field>
                  <Field label="Start month" required error={errors.start_date}>
                    <Input
                      type="month"
                      value={form.start_date}
                      onChange={(event) => setFormField('start_date', event.target.value)}
                    />
                  </Field>
                  <Field
                    label="End month"
                    error={errors.end_date}
                    hint="Leave empty if you are still enrolled."
                  >
                    <Input
                      type="month"
                      value={form.end_date}
                      onChange={(event) => setFormField('end_date', event.target.value)}
                    />
                  </Field>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <Button variant="ghost" onClick={closeForm}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="secondary">
                    {editIndex === null ? 'Add education' : 'Save changes'}
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
          <button
            type="button"
            onClick={openAdd}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 bg-white px-4 py-3.5 text-sm font-medium text-stone-600 transition-colors duration-150 hover:border-brand-400 hover:text-brand-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add another education
          </button>
        )}
      </div>
    </StepShell>
  )
}
