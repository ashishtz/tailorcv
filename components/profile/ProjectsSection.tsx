'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient, getSessionUser } from '@/lib/supabase/client'
import { ExternalLink, FolderGit2, Plus } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { SkeletonRows } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { EntryRow, useEntryForm } from '@/components/forms/entry-form'
import { ProjectFields } from '@/components/forms/entry-fields'
import type { ProjectDraft } from '@/lib/contexts/onboarding-context'
import { normalizeLink } from '@/lib/repositories/onboarding.repository'

interface Project {
  id: string
  project_name: string
  role_title: string | null
  description: string | null
  link: string | null
}

const EMPTY_FORM: ProjectDraft = {
  project_name: '',
  role_title: '',
  description: '',
  link: '',
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState(false)
  const entryForm = useEntryForm<ProjectDraft>()
  const supabase = createClient()
  const toast = useToast()

  const fetchProjects = useCallback(async (): Promise<Project[]> => {
    const user = await getSessionUser(supabase)
    if (!user) return []

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Could not load projects', error.message)
      return []
    }
    return (data as Project[] | null) ?? []
  }, [supabase, toast])

  const loadProjects = useCallback(async () => {
    setProjects(await fetchProjects())
  }, [fetchProjects])

  useEffect(() => {
    let active = true
    fetchProjects().then((list) => {
      if (!active) return
      setProjects(list)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [fetchProjects])

  const startEdit = (project: Project) => {
    entryForm.open(
      {
        project_name: project.project_name,
        role_title: project.role_title ?? '',
        description: project.description ?? '',
        link: project.link ?? '',
      },
      project.id
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = entryForm.form
    if (!form) return
    setSaving(true)

    const user = await getSessionUser(supabase)
    if (!user) {
      setSaving(false)
      toast.error('You are signed out', 'Sign in again to save your changes.')
      return
    }

    const payload = {
      project_name: form.project_name.trim(),
      role_title: form.role_title.trim() || null,
      description: form.description.trim() || null,
      link: normalizeLink(form.link) || null,
    }

    const editingId = entryForm.editKey
    const { error } = editingId
      ? await supabase
          .from('projects')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', editingId)
          .eq('user_id', user.id)
      : await supabase.from('projects').insert({ ...payload, user_id: user.id })

    setSaving(false)
    if (error) {
      toast.error(
        editingId ? 'Could not update the project' : 'Could not add the project',
        error.message
      )
      return
    }

    toast.success(editingId ? 'Project updated' : 'Project added')
    entryForm.close()
    await loadProjects()
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
      .from('projects')
      .delete()
      .eq('id', deleteTarget.id)
      .eq('user_id', user.id)

    setDeleting(false)
    if (error) {
      toast.error('Could not delete the project', error.message)
      return
    }

    toast.success('Project deleted')
    setDeleteTarget(null)
    await loadProjects()
  }

  return (
    <Card>
      <CardHeader
        title="Projects"
        description="Side projects, open source and notable work."
        actions={
          !entryForm.isOpen && (
            <Button variant="secondary" size="sm" onClick={() => entryForm.open({ ...EMPTY_FORM })}>
              <Plus aria-hidden />
              Add project
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
              {entryForm.editKey ? 'Edit project' : 'New project'}
            </h3>
            <div className="mt-4">
              <ProjectFields form={entryForm.form} onChange={entryForm.patch} nativeRequired />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="secondary" onClick={entryForm.close} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {entryForm.editKey ? 'Save changes' : 'Add project'}
              </Button>
            </div>
          </form>
        </CardBody>
      )}

      {loading ? (
        <CardBody>
          <SkeletonRows rows={2} />
        </CardBody>
      ) : projects.length === 0 ? (
        !entryForm.isOpen && (
          <EmptyState
            icon={FolderGit2}
            title="No projects yet"
            description="Showcase side projects, open source or client work."
            action={
              <Button size="sm" onClick={() => entryForm.open({ ...EMPTY_FORM })}>
                <Plus aria-hidden />
                Add project
              </Button>
            }
          />
        )
      ) : (
        <ul className="divide-y divide-stone-100">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6"
            >
              <EntryRow
                title={project.project_name}
                titleExtra={
                  project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open link for ${project.project_name}`}
                      className="rounded text-stone-400 transition-colors hover:text-brand-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  )
                }
                subtitle={project.role_title ?? undefined}
                description={project.description ?? undefined}
                editLabel={`Edit project ${project.project_name}`}
                deleteLabel={`Delete project ${project.project_name}`}
                onEdit={() => startEdit(project)}
                onDelete={() => setDeleteTarget(project)}
              />
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete project"
        message={
          deleteTarget
            ? `"${deleteTarget.project_name}" will be removed from your profile.`
            : ''
        }
        confirmText="Delete"
        loading={deleting}
      />
    </Card>
  )
}
