'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ExternalLink, FolderGit2, Pencil, Plus, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { SkeletonRows } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import EnhanceTextarea from '@/components/ui/EnhanceTextarea'

interface Project {
  id: string
  project_name: string
  role_title: string | null
  description: string | null
  link: string | null
}

interface ProjectFormState {
  project_name: string
  role_title: string
  description: string
  link: string
}

const EMPTY_FORM: ProjectFormState = {
  project_name: '',
  role_title: '',
  description: '',
  link: '',
}

/** Prefixes https:// when the scheme is missing; empty input becomes null. */
function normalizeLink(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProjectFormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()
  const toast = useToast()

  const fetchProjects = useCallback(async (): Promise<Project[]> => {
    const { data: { user } } = await supabase.auth.getUser()
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

  const formVisible = isAdding || editingId !== null

  const startAdd = () => {
    setForm(EMPTY_FORM)
    setIsAdding(true)
    setEditingId(null)
  }

  const startEdit = (project: Project) => {
    setForm({
      project_name: project.project_name,
      role_title: project.role_title ?? '',
      description: project.description ?? '',
      link: project.link ?? '',
    })
    setEditingId(project.id)
    setIsAdding(false)
  }

  const closeForm = () => {
    setForm(EMPTY_FORM)
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSaving(false)
      toast.error('You are signed out', 'Sign in again to save your changes.')
      return
    }

    const payload = {
      project_name: form.project_name.trim(),
      role_title: form.role_title.trim() || null,
      description: form.description.trim() || null,
      link: normalizeLink(form.link),
    }

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
    closeForm()
    await loadProjects()
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
          !formVisible && (
            <Button variant="secondary" size="sm" onClick={startAdd}>
              <Plus aria-hidden />
              Add project
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
              {editingId ? 'Edit project' : 'New project'}
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Project name" required>
                <Input
                  required
                  value={form.project_name}
                  onChange={(e) => setForm((f) => ({ ...f, project_name: e.target.value }))}
                  placeholder="e.g. E-commerce platform"
                />
              </Field>
              <Field label="Your role">
                <Input
                  value={form.role_title}
                  onChange={(e) => setForm((f) => ({ ...f, role_title: e.target.value }))}
                  placeholder="e.g. Lead developer"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Link" hint="The https:// prefix is added for you if missing.">
                  <Input
                    type="url"
                    value={form.link}
                    onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                    onBlur={() => setForm((f) => ({ ...f, link: normalizeLink(f.link) ?? '' }))}
                    placeholder="e.g. github.com/username/project"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Description">
                  <EnhanceTextarea
                    value={form.description}
                    onChange={(value) => setForm((f) => ({ ...f, description: value }))}
                    rows={4}
                    placeholder="Describe the project, the technologies used and your contribution…"
                    enhanceType="project"
                  />
                </Field>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="secondary" onClick={closeForm} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {editingId ? 'Save changes' : 'Add project'}
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
        !formVisible && (
          <EmptyState
            icon={FolderGit2}
            title="No projects yet"
            description="Showcase side projects, open source or client work."
            action={
              <Button size="sm" onClick={startAdd}>
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
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-stone-900">{project.project_name}</p>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open link for ${project.project_name}`}
                      className="rounded text-stone-400 transition-colors hover:text-brand-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  )}
                </div>
                {project.role_title && (
                  <p className="mt-0.5 text-sm text-stone-600">{project.role_title}</p>
                )}
                {project.description && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-stone-600">
                    {project.description}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit project ${project.project_name}`}
                  onClick={() => startEdit(project)}
                >
                  <Pencil aria-hidden />
                </Button>
                <Button
                  variant="danger-ghost"
                  size="icon-sm"
                  aria-label={`Delete project ${project.project_name}`}
                  onClick={() => setDeleteTarget(project)}
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
        title="Delete project"
        message={
          deleteTarget
            ? `"${deleteTarget.project_name}" will be removed from your profile.`
            : ''
        }
        confirmText="Delete"
        type="danger"
        loading={deleting}
      />
    </Card>
  )
}
