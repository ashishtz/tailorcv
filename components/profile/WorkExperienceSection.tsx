'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Briefcase, Pencil, Plus, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Field, Input, Select } from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { SkeletonRows } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import EnhanceTextarea from '@/components/ui/EnhanceTextarea'
import { formatMonthYear, monthInputToDate, dateToMonthInput } from '@/lib/utils'

type JobType = 'Part-Time' | 'Full-Time' | 'Contract'

interface WorkExperience {
  id: string
  company_name: string
  position_title: string
  location: string | null
  job_type: JobType | null
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string | null
}

/** Form state keeps dates as <input type="month"> values ("YYYY-MM"). */
interface WorkFormState {
  company_name: string
  position_title: string
  location: string
  job_type: JobType
  start_date: string
  end_date: string
  is_current: boolean
  description: string
}

const EMPTY_FORM: WorkFormState = {
  company_name: '',
  position_title: '',
  location: '',
  job_type: 'Full-Time',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
}

const JOB_TYPES: JobType[] = ['Full-Time', 'Part-Time', 'Contract']

export default function WorkExperienceSection() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<WorkFormState>(EMPTY_FORM)
  const [dateError, setDateError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<WorkExperience | null>(null)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()
  const toast = useToast()

  const fetchExperiences = useCallback(async (): Promise<WorkExperience[]> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('work_experiences')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })

    if (error) {
      toast.error('Could not load work experience', error.message)
      return []
    }
    return (data as WorkExperience[] | null) ?? []
  }, [supabase, toast])

  const loadExperiences = useCallback(async () => {
    setExperiences(await fetchExperiences())
  }, [fetchExperiences])

  useEffect(() => {
    let active = true
    fetchExperiences().then((list) => {
      if (!active) return
      setExperiences(list)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [fetchExperiences])

  const formVisible = isAdding || editingId !== null

  const startAdd = () => {
    setForm(EMPTY_FORM)
    setDateError(null)
    setIsAdding(true)
    setEditingId(null)
  }

  const startEdit = (exp: WorkExperience) => {
    setForm({
      company_name: exp.company_name,
      position_title: exp.position_title,
      location: exp.location ?? '',
      job_type: exp.job_type ?? 'Full-Time',
      start_date: dateToMonthInput(exp.start_date),
      end_date: dateToMonthInput(exp.end_date),
      is_current: exp.is_current,
      description: exp.description ?? '',
    })
    setDateError(null)
    setEditingId(exp.id)
    setIsAdding(false)
  }

  const closeForm = () => {
    setForm(EMPTY_FORM)
    setDateError(null)
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // "YYYY-MM" strings compare correctly as plain strings.
    if (!form.is_current && form.start_date && form.end_date && form.end_date < form.start_date) {
      setDateError('End date must be on or after the start date.')
      return
    }
    setDateError(null)
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSaving(false)
      toast.error('You are signed out', 'Sign in again to save your changes.')
      return
    }

    // Explicit payload: month values converted to DATE-safe strings, empty
    // strings to null - never spread raw form state into the table.
    const payload = {
      company_name: form.company_name.trim(),
      position_title: form.position_title.trim(),
      location: form.location.trim() || null,
      job_type: form.job_type,
      start_date: monthInputToDate(form.start_date),
      end_date: form.is_current ? null : monthInputToDate(form.end_date),
      is_current: form.is_current,
      description: form.description.trim() || null,
    }

    const { error } = editingId
      ? await supabase
          .from('work_experiences')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', editingId)
          .eq('user_id', user.id)
      : await supabase.from('work_experiences').insert({ ...payload, user_id: user.id })

    setSaving(false)
    if (error) {
      toast.error(
        editingId ? 'Could not update the experience' : 'Could not add the experience',
        error.message
      )
      return
    }

    toast.success(editingId ? 'Experience updated' : 'Experience added')
    closeForm()
    await loadExperiences()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setDeleting(false)
      toast.error('You are signed out', 'Sign in again to delete this entry.')
      return
    }

    const { error } = await supabase
      .from('work_experiences')
      .delete()
      .eq('id', deleteTarget.id)
      .eq('user_id', user.id)

    setDeleting(false)
    if (error) {
      toast.error('Could not delete the experience', error.message)
      return
    }

    toast.success('Experience deleted')
    setDeleteTarget(null)
    await loadExperiences()
  }

  return (
    <Card>
      <CardHeader
        title="Work experience"
        description="Roles you have held, most recent first."
        actions={
          !formVisible && (
            <Button variant="secondary" size="sm" onClick={startAdd}>
              <Plus aria-hidden />
              Add experience
            </Button>
          )
        }
      />

      {formVisible && (
        <CardBody className="border-b border-stone-200">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-stone-200 bg-stone-50 p-4 sm:p-5"
          >
            <h3 className="font-display text-sm font-semibold text-stone-900">
              {editingId ? 'Edit experience' : 'New experience'}
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Company" required>
                <Input
                  required
                  value={form.company_name}
                  onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
                  placeholder="e.g. Acme Corp"
                />
              </Field>
              <Field label="Position" required>
                <Input
                  required
                  value={form.position_title}
                  onChange={(e) => setForm((f) => ({ ...f, position_title: e.target.value }))}
                  placeholder="e.g. Senior Software Engineer"
                />
              </Field>
              <Field label="Location">
                <Input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Toronto, Canada"
                />
              </Field>
              <Field label="Job type">
                <Select
                  value={form.job_type}
                  onChange={(e) => setForm((f) => ({ ...f, job_type: e.target.value as JobType }))}
                >
                  {JOB_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Start date" required>
                <Input
                  type="month"
                  required
                  value={form.start_date}
                  onChange={(e) => {
                    setDateError(null)
                    setForm((f) => ({ ...f, start_date: e.target.value }))
                  }}
                />
              </Field>
              <div className="space-y-2.5">
                <Field label="End date" error={dateError ?? undefined}>
                  <Input
                    type="month"
                    value={form.end_date}
                    disabled={form.is_current}
                    onChange={(e) => {
                      setDateError(null)
                      setForm((f) => ({ ...f, end_date: e.target.value }))
                    }}
                  />
                </Field>
                <label className="flex items-center gap-2 text-sm text-stone-700">
                  <input
                    type="checkbox"
                    checked={form.is_current}
                    onChange={(e) => {
                      setDateError(null)
                      setForm((f) => ({
                        ...f,
                        is_current: e.target.checked,
                        end_date: e.target.checked ? '' : f.end_date,
                      }))
                    }}
                    className="h-4 w-4 accent-brand-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                  />
                  I currently work here
                </label>
              </div>
              <div className="sm:col-span-2">
                <Field label="Description">
                  <EnhanceTextarea
                    value={form.description}
                    onChange={(value) => setForm((f) => ({ ...f, description: value }))}
                    rows={4}
                    placeholder="Describe your responsibilities and achievements…"
                    enhanceType="work_experience"
                  />
                </Field>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="secondary" onClick={closeForm} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {editingId ? 'Save changes' : 'Add experience'}
              </Button>
            </div>
          </form>
        </CardBody>
      )}

      {loading ? (
        <CardBody>
          <SkeletonRows rows={2} />
        </CardBody>
      ) : experiences.length === 0 ? (
        !formVisible && (
          <EmptyState
            icon={Briefcase}
            title="No work experience yet"
            description="Add the roles you have held so the AI can build accurate resumes."
            action={
              <Button size="sm" onClick={startAdd}>
                <Plus aria-hidden />
                Add experience
              </Button>
            }
          />
        )
      ) : (
        <ul className="divide-y divide-stone-100">
          {experiences.map((exp) => (
            <li
              key={exp.id}
              className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-stone-900">{exp.position_title}</p>
                  {exp.job_type && <Badge variant="stone">{exp.job_type}</Badge>}
                  {exp.is_current && <Badge variant="brand">Current</Badge>}
                </div>
                <p className="mt-0.5 text-sm text-stone-600">
                  {exp.company_name}
                  {exp.location ? ` · ${exp.location}` : ''}
                </p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {formatMonthYear(exp.start_date)} –{' '}
                  {exp.is_current || !exp.end_date ? 'Present' : formatMonthYear(exp.end_date)}
                </p>
                {exp.description && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-stone-600">
                    {exp.description}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit ${exp.position_title} at ${exp.company_name}`}
                  onClick={() => startEdit(exp)}
                >
                  <Pencil aria-hidden />
                </Button>
                <Button
                  variant="danger-ghost"
                  size="icon-sm"
                  aria-label={`Delete ${exp.position_title} at ${exp.company_name}`}
                  onClick={() => setDeleteTarget(exp)}
                >
                  <Trash2 aria-hidden />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete work experience"
        message={
          deleteTarget
            ? `"${deleteTarget.position_title}" at ${deleteTarget.company_name} will be removed from your profile.`
            : ''
        }
        confirmText="Delete"
        type="danger"
        loading={deleting}
      />
    </Card>
  )
}
