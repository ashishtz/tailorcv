'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient, getSessionUser } from '@/lib/supabase/client'
import { Briefcase, Plus } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { SkeletonRows } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { EntryRow, endBeforeStart, useEntryForm } from '@/components/forms/entry-form'
import { WorkFields } from '@/components/forms/entry-fields'
import type { JobType, WorkExperienceDraft } from '@/lib/contexts/onboarding-context'
import { formatMonthYear, monthInputToDate, dateToMonthInput } from '@/lib/utils'

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
const EMPTY_FORM: WorkExperienceDraft = {
  company_name: '',
  position_title: '',
  location: '',
  job_type: 'Full-Time',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
}

export default function WorkExperienceSection() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [dateError, setDateError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<WorkExperience | null>(null)
  const [deleting, setDeleting] = useState(false)
  const entryForm = useEntryForm<WorkExperienceDraft>()
  const supabase = createClient()
  const toast = useToast()

  const fetchExperiences = useCallback(async (): Promise<WorkExperience[]> => {
    const user = await getSessionUser(supabase)
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

  const startAdd = () => {
    setDateError(null)
    entryForm.open({ ...EMPTY_FORM })
  }

  const startEdit = (exp: WorkExperience) => {
    setDateError(null)
    entryForm.open(
      {
        company_name: exp.company_name,
        position_title: exp.position_title,
        location: exp.location ?? '',
        job_type: exp.job_type ?? 'Full-Time',
        start_date: dateToMonthInput(exp.start_date),
        end_date: dateToMonthInput(exp.end_date),
        is_current: exp.is_current,
        description: exp.description ?? '',
      },
      exp.id
    )
  }

  const closeForm = () => {
    setDateError(null)
    entryForm.close()
  }

  const handleFieldChange = (patch: Partial<WorkExperienceDraft>) => {
    if ('start_date' in patch || 'end_date' in patch || 'is_current' in patch) setDateError(null)
    entryForm.patch(patch)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = entryForm.form
    if (!form) return

    if (!form.is_current && endBeforeStart(form.start_date, form.end_date)) {
      setDateError('End date must be on or after the start date.')
      return
    }
    setDateError(null)
    setSaving(true)

    const user = await getSessionUser(supabase)
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
      company_name: form.company_name.trim(),
      position_title: form.position_title.trim(),
      location: form.location.trim() || null,
      job_type: form.job_type || null,
      start_date: startDate,
      end_date: form.is_current ? null : monthInputToDate(form.end_date),
      is_current: form.is_current,
      description: form.description.trim() || null,
    }

    const editingId = entryForm.editKey
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

    const user = await getSessionUser(supabase)
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
          !entryForm.isOpen && (
            <Button variant="secondary" size="sm" onClick={startAdd}>
              <Plus aria-hidden />
              Add experience
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
              {entryForm.editKey ? 'Edit experience' : 'New experience'}
            </h3>
            <div className="mt-4">
              <WorkFields
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
                {entryForm.editKey ? 'Save changes' : 'Add experience'}
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
        !entryForm.isOpen && (
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
              <EntryRow
                title={exp.position_title}
                titleExtra={
                  <>
                    {exp.job_type && <Badge variant="stone">{exp.job_type}</Badge>}
                    {exp.is_current && <Badge variant="brand">Current</Badge>}
                  </>
                }
                subtitle={`${exp.company_name}${exp.location ? ` · ${exp.location}` : ''}`}
                meta={`${formatMonthYear(exp.start_date)} – ${
                  exp.is_current || !exp.end_date ? 'Present' : formatMonthYear(exp.end_date)
                }`}
                description={exp.description ?? undefined}
                editLabel={`Edit ${exp.position_title} at ${exp.company_name}`}
                deleteLabel={`Delete ${exp.position_title} at ${exp.company_name}`}
                onEdit={() => startEdit(exp)}
                onDelete={() => setDeleteTarget(exp)}
              />
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
        loading={deleting}
      />
    </Card>
  )
}
