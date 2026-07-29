'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GraduationCap, Pencil, Plus, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Field, Input, Select } from '@/components/ui/field'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { SkeletonRows } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { formatMonthYear, monthInputToDate, dateToMonthInput } from '@/lib/utils'

const DEGREES = [
  'High School',
  'Associate',
  "Bachelor's",
  "Master's",
  'PhD',
  'Diploma',
  'Certificate',
  'Other',
] as const

type Degree = (typeof DEGREES)[number]

interface Education {
  id: string
  institution_name: string
  start_date: string
  end_date: string | null
  degree: Degree | null
  field_of_study: string | null
}

/** Form state keeps dates as <input type="month"> values ("YYYY-MM"). */
interface EducationFormState {
  institution_name: string
  degree: Degree
  field_of_study: string
  start_date: string
  end_date: string
}

const EMPTY_FORM: EducationFormState = {
  institution_name: '',
  degree: "Bachelor's",
  field_of_study: '',
  start_date: '',
  end_date: '',
}

export default function EducationSection() {
  const [educationList, setEducationList] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<EducationFormState>(EMPTY_FORM)
  const [dateError, setDateError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()
  const toast = useToast()

  const fetchEducation = useCallback(async (): Promise<Education[]> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })

    if (error) {
      toast.error('Could not load education', error.message)
      return []
    }
    return (data as Education[] | null) ?? []
  }, [supabase, toast])

  const loadEducation = useCallback(async () => {
    setEducationList(await fetchEducation())
  }, [fetchEducation])

  useEffect(() => {
    let active = true
    fetchEducation().then((list) => {
      if (!active) return
      setEducationList(list)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [fetchEducation])

  const formVisible = isAdding || editingId !== null

  const startAdd = () => {
    setForm(EMPTY_FORM)
    setDateError(null)
    setIsAdding(true)
    setEditingId(null)
  }

  const startEdit = (edu: Education) => {
    setForm({
      institution_name: edu.institution_name,
      degree: edu.degree ?? "Bachelor's",
      field_of_study: edu.field_of_study ?? '',
      start_date: dateToMonthInput(edu.start_date),
      end_date: dateToMonthInput(edu.end_date),
    })
    setDateError(null)
    setEditingId(edu.id)
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
    if (form.start_date && form.end_date && form.end_date < form.start_date) {
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
      institution_name: form.institution_name.trim(),
      degree: form.degree,
      field_of_study: form.field_of_study.trim() || null,
      start_date: monthInputToDate(form.start_date),
      end_date: monthInputToDate(form.end_date),
    }

    const { error } = editingId
      ? await supabase
          .from('education')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', editingId)
          .eq('user_id', user.id)
      : await supabase.from('education').insert({ ...payload, user_id: user.id })

    setSaving(false)
    if (error) {
      toast.error(
        editingId ? 'Could not update the education entry' : 'Could not add the education entry',
        error.message
      )
      return
    }

    toast.success(editingId ? 'Education updated' : 'Education added')
    closeForm()
    await loadEducation()
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
      .from('education')
      .delete()
      .eq('id', deleteTarget.id)
      .eq('user_id', user.id)

    setDeleting(false)
    if (error) {
      toast.error('Could not delete the education entry', error.message)
      return
    }

    toast.success('Education deleted')
    setDeleteTarget(null)
    await loadEducation()
  }

  const subtitle = (edu: Education) =>
    [edu.degree, edu.field_of_study].filter(Boolean).join(' · ')

  return (
    <Card>
      <CardHeader
        title="Education"
        description="Degrees, diplomas and certificates."
        actions={
          !formVisible && (
            <Button variant="secondary" size="sm" onClick={startAdd}>
              <Plus aria-hidden />
              Add education
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
              {editingId ? 'Edit education' : 'New education'}
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Institution" required>
                  <Input
                    required
                    value={form.institution_name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, institution_name: e.target.value }))
                    }
                    placeholder="e.g. University of Toronto"
                  />
                </Field>
              </div>
              <Field label="Degree">
                <Select
                  value={form.degree}
                  onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value as Degree }))}
                >
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
                  onChange={(e) => setForm((f) => ({ ...f, field_of_study: e.target.value }))}
                  placeholder="e.g. Computer Science"
                />
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
              <Field
                label="End date"
                error={dateError ?? undefined}
                hint="Leave empty if you are currently studying."
              >
                <Input
                  type="month"
                  value={form.end_date}
                  onChange={(e) => {
                    setDateError(null)
                    setForm((f) => ({ ...f, end_date: e.target.value }))
                  }}
                />
              </Field>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="secondary" onClick={closeForm} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {editingId ? 'Save changes' : 'Add education'}
              </Button>
            </div>
          </form>
        </CardBody>
      )}

      {loading ? (
        <CardBody>
          <SkeletonRows rows={2} />
        </CardBody>
      ) : educationList.length === 0 ? (
        !formVisible && (
          <EmptyState
            icon={GraduationCap}
            title="No education yet"
            description="Add your studies - degrees, diplomas or certificates."
            action={
              <Button size="sm" onClick={startAdd}>
                <Plus aria-hidden />
                Add education
              </Button>
            }
          />
        )
      ) : (
        <ul className="divide-y divide-stone-100">
          {educationList.map((edu) => (
            <li
              key={edu.id}
              className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-900">{edu.institution_name}</p>
                {subtitle(edu) && (
                  <p className="mt-0.5 text-sm text-stone-600">{subtitle(edu)}</p>
                )}
                <p className="mt-0.5 text-xs text-stone-500">
                  {formatMonthYear(edu.start_date)} –{' '}
                  {edu.end_date ? formatMonthYear(edu.end_date) : 'Present'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit education at ${edu.institution_name}`}
                  onClick={() => startEdit(edu)}
                >
                  <Pencil aria-hidden />
                </Button>
                <Button
                  variant="danger-ghost"
                  size="icon-sm"
                  aria-label={`Delete education at ${edu.institution_name}`}
                  onClick={() => setDeleteTarget(edu)}
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
        title="Delete education"
        message={
          deleteTarget
            ? `Your entry for ${deleteTarget.institution_name} will be removed from your profile.`
            : ''
        }
        confirmText="Delete"
        type="danger"
        loading={deleting}
      />
    </Card>
  )
}
