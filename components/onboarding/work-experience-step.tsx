'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Edit2, Plus, Trash2 } from 'lucide-react'
import {
  JOB_TYPES,
  useOnboarding,
  type JobType,
  type WorkExperienceDraft,
} from '@/lib/contexts/onboarding-context'
import { StepShell, StepSkeleton } from '@/components/onboarding/step-shell'
import { EnhanceField } from '@/components/onboarding/enhance-field'
import { Card, CardBody } from '@/components/ui/card'
import { Field, Input, Select } from '@/components/ui/field'
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

type WorkErrors = Partial<
  Record<'company_name' | 'position_title' | 'start_date' | 'end_date', string>
>

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

  const [form, setForm] = useState<WorkExperienceDraft | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [errors, setErrors] = useState<WorkErrors>({})
  const [footerNote, setFooterNote] = useState('')

  const formOpen = form !== null

  const setFormField = <K extends keyof WorkExperienceDraft>(
    key: K,
    value: WorkExperienceDraft[K]
  ) => {
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

    const nextErrors: WorkErrors = {}
    if (!form.company_name.trim()) nextErrors.company_name = 'Company is required.'
    if (!form.position_title.trim()) nextErrors.position_title = 'Position is required.'
    if (!form.start_date) nextErrors.start_date = 'Start month is required.'
    if (!form.is_current && form.end_date && form.start_date && form.end_date < form.start_date) {
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
    if (formOpen) {
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
            {entries.map((entry, index) => {
              const subtitle = [entry.company_name, entry.location].filter(Boolean).join(' · ')
              const meta = [entry.job_type, rangeText(entry)].filter(Boolean).join(' · ')
              return (
                <li key={`${entry.company_name}-${entry.position_title}-${index}`}>
                  <Card>
                    <CardBody className="flex items-start justify-between gap-4 py-4">
                      <div className="min-w-0">
                        <p className="font-medium text-stone-900">{entry.position_title}</p>
                        {subtitle && <p className="text-sm text-stone-600">{subtitle}</p>}
                        {meta && <p className="mt-1 text-xs text-stone-500">{meta}</p>}
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
                          disabled={formOpen}
                          aria-label={`Edit ${entry.position_title} at ${entry.company_name}`}
                        >
                          <Edit2 aria-hidden />
                        </Button>
                        <Button
                          variant="danger-ghost"
                          size="icon-sm"
                          onClick={() => removeEntry(index)}
                          disabled={formOpen}
                          aria-label={`Remove ${entry.position_title} at ${entry.company_name}`}
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
                {editIndex === null ? 'Add work experience' : 'Edit work experience'}
              </h2>
              <form onSubmit={handleSubmit} className="mt-4 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Company" required error={errors.company_name}>
                    <Input
                      value={form.company_name}
                      onChange={(event) => setFormField('company_name', event.target.value)}
                      placeholder="Acme Corp"
                    />
                  </Field>
                  <Field label="Position" required error={errors.position_title}>
                    <Input
                      value={form.position_title}
                      onChange={(event) => setFormField('position_title', event.target.value)}
                      placeholder="Frontend Engineer"
                    />
                  </Field>
                  <Field label="Location">
                    <Input
                      value={form.location}
                      onChange={(event) => setFormField('location', event.target.value)}
                      placeholder="Remote · Berlin"
                    />
                  </Field>
                  <Field label="Job type">
                    <Select
                      value={form.job_type}
                      onChange={(event) =>
                        setFormField('job_type', event.target.value as JobType | '')
                      }
                    >
                      <option value="">Select a type</option>
                      {JOB_TYPES.map((jobType) => (
                        <option key={jobType} value={jobType}>
                          {jobType}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Start month" required error={errors.start_date}>
                    <Input
                      type="month"
                      value={form.start_date}
                      onChange={(event) => setFormField('start_date', event.target.value)}
                    />
                  </Field>
                  <div className="space-y-2.5">
                    <Field label="End month" error={errors.end_date}>
                      <Input
                        type="month"
                        value={form.end_date}
                        onChange={(event) => setFormField('end_date', event.target.value)}
                        disabled={form.is_current}
                      />
                    </Field>
                    <label className="flex items-center gap-2 text-sm text-stone-700">
                      <input
                        type="checkbox"
                        checked={form.is_current}
                        onChange={(event) =>
                          setForm((current) =>
                            current
                              ? {
                                  ...current,
                                  is_current: event.target.checked,
                                  end_date: event.target.checked ? '' : current.end_date,
                                }
                              : current
                          )
                        }
                        className="h-4 w-4 rounded border-stone-300 accent-brand-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                      />
                      I currently work here
                    </label>
                  </div>
                </div>

                <EnhanceField
                  label="Description"
                  value={form.description}
                  onChange={(description) => setFormField('description', description)}
                  rows={4}
                  enhanceType="work_experience"
                  placeholder="What did you build, ship or improve? Focus on impact."
                  hint="Write about 10 words and an AI enhance button appears."
                />

                <div className="flex items-center justify-end gap-3">
                  <Button variant="ghost" onClick={closeForm}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="secondary">
                    {editIndex === null ? 'Add experience' : 'Save changes'}
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
          <button
            type="button"
            onClick={openAdd}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 bg-white px-4 py-3.5 text-sm font-medium text-stone-600 transition-colors duration-150 hover:border-brand-400 hover:text-brand-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add another experience
          </button>
        )}
      </div>
    </StepShell>
  )
}
