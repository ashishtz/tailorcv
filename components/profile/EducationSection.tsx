'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GraduationCap, Plus } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { SkeletonRows } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { EntryRow, endBeforeStart, useEntryForm } from '@/components/forms/entry-form'
import { EducationFields } from '@/components/forms/entry-fields'
import type { Degree, EducationDraft } from '@/lib/contexts/onboarding-context'
import { formatMonthYear, monthInputToDate, dateToMonthInput } from '@/lib/utils'

interface Education {
  id: string
  institution_name: string
  start_date: string
  end_date: string | null
  degree: Degree | null
  field_of_study: string | null
}

/** Form state keeps dates as <input type="month"> values ("YYYY-MM"). */
const EMPTY_FORM: EducationDraft = {
  institution_name: '',
  degree: "Bachelor's",
  field_of_study: '',
  start_date: '',
  end_date: '',
}

export default function EducationSection() {
  const [educationList, setEducationList] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [dateError, setDateError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null)
  const [deleting, setDeleting] = useState(false)
  const entryForm = useEntryForm<EducationDraft>()
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

  const startAdd = () => {
    setDateError(null)
    entryForm.open({ ...EMPTY_FORM })
  }

  const startEdit = (edu: Education) => {
    setDateError(null)
    entryForm.open(
      {
        institution_name: edu.institution_name,
        degree: edu.degree ?? "Bachelor's",
        field_of_study: edu.field_of_study ?? '',
        start_date: dateToMonthInput(edu.start_date),
        end_date: dateToMonthInput(edu.end_date),
      },
      edu.id
    )
  }

  const closeForm = () => {
    setDateError(null)
    entryForm.close()
  }

  const handleFieldChange = (patch: Partial<EducationDraft>) => {
    if ('start_date' in patch || 'end_date' in patch) setDateError(null)
    entryForm.patch(patch)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = entryForm.form
    if (!form) return

    if (endBeforeStart(form.start_date, form.end_date)) {
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
    const startDate = monthInputToDate(form.start_date)
    if (!startDate) {
      setSaving(false)
      setDateError('A start date is required.')
      return
    }
    const payload = {
      institution_name: form.institution_name.trim(),
      degree: form.degree || null,
      field_of_study: form.field_of_study.trim() || null,
      start_date: startDate,
      end_date: monthInputToDate(form.end_date),
    }

    const editingId = entryForm.editKey
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

  return (
    <Card>
      <CardHeader
        title="Education"
        description="Degrees, diplomas and certificates."
        actions={
          !entryForm.isOpen && (
            <Button variant="secondary" size="sm" onClick={startAdd}>
              <Plus aria-hidden />
              Add education
            </Button>
          )
        }
      />

      {entryForm.form && (
        <CardBody className="border-b border-stone-200">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-stone-200 bg-stone-50 p-4 sm:p-5"
          >
            <h3 className="font-display text-sm font-semibold text-stone-900">
              {entryForm.editKey ? 'Edit education' : 'New education'}
            </h3>
            <div className="mt-4">
              <EducationFields
                form={entryForm.form}
                onChange={handleFieldChange}
                errors={{ end_date: dateError ?? undefined }}
                nativeRequired
              />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="secondary" onClick={closeForm} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {entryForm.editKey ? 'Save changes' : 'Add education'}
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
        !entryForm.isOpen && (
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
              <EntryRow
                title={edu.institution_name}
                subtitle={[edu.degree, edu.field_of_study].filter(Boolean).join(' · ') || undefined}
                meta={`${formatMonthYear(edu.start_date)} – ${
                  edu.end_date ? formatMonthYear(edu.end_date) : 'Present'
                }`}
                editLabel={`Edit education at ${edu.institution_name}`}
                deleteLabel={`Delete education at ${edu.institution_name}`}
                onEdit={() => startEdit(edu)}
                onDelete={() => setDeleteTarget(edu)}
              />
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
        loading={deleting}
      />
    </Card>
  )
}
