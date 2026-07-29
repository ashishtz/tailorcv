'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileX, Plus, Save, Trash2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Resume, CategorizedSkill } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
import { Field, Input, Textarea } from '@/components/ui/field'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'
import {
  asJson,
  normalizeResumeData,
  normalizeSettings,
  rowToResume,
  type GeneratedResumeData,
  type GenerationSettings,
} from '@/lib/utils/normalize-resume'

/* ------------------------------------------------------------------ *
 * Content helpers: bullets render in textareas as lines and are saved
 * back in the shape the template settings expect - the old editor
 * flattened arrays to comma-joined strings and dropped the summary.
 * ------------------------------------------------------------------ */

const contentToText = (content: string | string[] | undefined): string =>
  Array.isArray(content) ? content.join('\n') : content ?? ''

const textToContent = (text: string, format: 'paragraph' | 'bullets'): string | string[] => {
  if (format === 'bullets') {
    return text
      .split('\n')
      .map((line) => line.replace(/^[-•]\s*/, '').trim())
      .filter(Boolean)
  }
  return text.trim()
}

/* ------------------------------------------------------------------ *
 * Skill editors - generated resumes use categorized skills; legacy
 * rows may have plain string arrays. Both shapes are supported.
 * ------------------------------------------------------------------ */

function SkillChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-800">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="rounded-full p-0.5 text-brand-500 hover:bg-brand-100 hover:text-brand-800"
      >
        <X className="h-3 w-3" aria-hidden />
      </button>
    </span>
  )
}

function ChipInput({ onAdd, placeholder }: { onAdd: (value: string) => void; placeholder: string }) {
  const [value, setValue] = useState('')

  const add = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
  }

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            add()
          }
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="max-w-56"
      />
      <Button variant="secondary" size="sm" onClick={add} className="h-10">
        <Plus aria-hidden />
        Add
      </Button>
    </div>
  )
}

interface SkillsEditorProps {
  skills: GeneratedResumeData['skills']
  onChange: (skills: GeneratedResumeData['skills']) => void
}

function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  const isCategorized = skills.length > 0 && typeof skills[0] === 'object'

  if (isCategorized) {
    const categorized = skills as CategorizedSkill[]
    return (
      <div className="space-y-4">
        {categorized.map((group, groupIndex) => (
          <div
            key={`${group.category}-${groupIndex}`}
            className="rounded-lg border border-stone-200 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <Input
                value={group.category}
                onChange={(e) => {
                  const next = categorized.map((g, i) =>
                    i === groupIndex ? { ...g, category: e.target.value } : g
                  )
                  onChange(next)
                }}
                aria-label="Category name"
                className="max-w-56 font-medium"
              />
              <Button
                variant="danger-ghost"
                size="icon-sm"
                aria-label={`Remove category ${group.category}`}
                onClick={() => onChange(categorized.filter((_, i) => i !== groupIndex))}
              >
                <Trash2 aria-hidden />
              </Button>
            </div>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {group.skills.map((skill, skillIndex) => (
                <SkillChip
                  key={`${skill}-${skillIndex}`}
                  label={skill}
                  onRemove={() => {
                    const next = categorized.map((g, i) =>
                      i === groupIndex
                        ? { ...g, skills: g.skills.filter((_, si) => si !== skillIndex) }
                        : g
                    )
                    onChange(next)
                  }}
                />
              ))}
              {group.skills.length === 0 && (
                <p className="text-xs text-stone-400">No skills in this category yet.</p>
              )}
            </div>
            <ChipInput
              placeholder="Add a skill"
              onAdd={(value) => {
                const next = categorized.map((g, i) =>
                  i === groupIndex && !g.skills.includes(value)
                    ? { ...g, skills: [...g.skills, value] }
                    : g
                )
                onChange(next)
              }}
            />
          </div>
        ))}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onChange([...categorized, { category: 'New category', skills: [] }])}
        >
          <Plus aria-hidden />
          Add category
        </Button>
      </div>
    )
  }

  const plain = skills as string[]
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {plain.map((skill, index) => (
          <SkillChip
            key={`${skill}-${index}`}
            label={skill}
            onRemove={() => onChange(plain.filter((_, i) => i !== index))}
          />
        ))}
        {plain.length === 0 && <p className="text-xs text-stone-400">No skills yet.</p>}
      </div>
      <ChipInput
        placeholder="Add a skill"
        onAdd={(value) => {
          if (!plain.includes(value)) onChange([...plain, value])
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function ResumeEditPage() {
  const params = useParams<{ id: string }>()
  const resumeId = typeof params.id === 'string' ? params.id : ''
  const router = useRouter()
  const toast = useToast()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [jobTitle, setJobTitle] = useState('')
  const [data, setData] = useState<GeneratedResumeData | null>(null)
  const [settings, setSettings] = useState<GenerationSettings | null>(null)

  const fetchResume = useCallback(async (): Promise<Resume | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data: row, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching resume:', error)
        return null
      }
      return row ? rowToResume(row) : null
    } catch (error) {
      console.error('Error fetching resume:', error)
      return null
    }
  }, [supabase, resumeId])

  useEffect(() => {
    let active = true
    fetchResume().then((row) => {
      if (!active) return
      if (!row) {
        setNotFound(true)
      } else {
        setJobTitle(row.job_title)
        setData(normalizeResumeData(row.generated_data))
        setSettings(normalizeSettings(row.generation_settings))
      }
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [fetchResume])

  const update = (patch: Partial<GeneratedResumeData>) =>
    setData((prev) => (prev ? { ...prev, ...patch } : prev))

  const handleSave = async () => {
    if (!data || !settings) return
    if (!jobTitle.trim()) {
      toast.error('Job title required', 'Give this resume a title before saving.')
      return
    }

    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not signed in')

      // The full normalized object is saved - summary, social links and all
      // sections included (the old editor silently dropped the summary).
      const { error } = await supabase
        .from('resumes')
        .update({
          job_title: jobTitle.trim(),
          generated_data: asJson(data),
        })
        .eq('id', resumeId)
        .eq('user_id', user.id)

      if (error) throw error

      toast.success('Resume saved')
      router.push(`/dashboard/documents/${resumeId}`)
      router.refresh()
    } catch (error) {
      console.error('Error saving resume:', error)
      toast.error('Save failed', 'Your changes could not be saved. Please try again.')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8" role="status" aria-label="Loading editor">
        <div className="mx-auto max-w-3xl space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (notFound || !data || !settings) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <Card>
            <EmptyState
              icon={FileX}
              title="Resume not found"
              description="This resume doesn't exist or may have been deleted."
              action={
                <Link href="/dashboard/documents">
                  <Button variant="secondary">
                    <ArrowLeft aria-hidden />
                    Back to documents
                  </Button>
                </Link>
              }
            />
          </Card>
        </div>
      </div>
    )
  }

  const workFormat = settings.work_experience_format
  const projectFormat = settings.projects_format

  return (
    <div className="min-h-full bg-stone-50">
      {/* Sticky action bar */}
      <div className="no-print sticky top-14 z-30 border-b border-stone-200 bg-white lg:top-0">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={`/dashboard/documents/${resumeId}`}
              aria-label="Back to resume"
              className="rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </Link>
            <h1 className="truncate font-display text-base font-semibold text-stone-900">
              Edit resume
            </h1>
          </div>
          <Button onClick={handleSave} loading={saving}>
            {!saving && <Save aria-hidden />}
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        {/* Document */}
        <Card>
          <CardHeader title="Document" description="Internal name for this resume." />
          <CardBody>
            <Field label="Job title" required>
              <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
            </Field>
          </CardBody>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader title="Contact" />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <Input
                value={data.contact.name}
                onChange={(e) => update({ contact: { ...data.contact, name: e.target.value } })}
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={data.contact.email}
                onChange={(e) => update({ contact: { ...data.contact, email: e.target.value } })}
              />
            </Field>
            <Field label="Phone">
              <Input
                value={data.contact.phone}
                onChange={(e) => update({ contact: { ...data.contact, phone: e.target.value } })}
              />
            </Field>
            <Field label="Location">
              <Input
                value={data.contact.location}
                onChange={(e) =>
                  update({ contact: { ...data.contact, location: e.target.value } })
                }
              />
            </Field>
          </CardBody>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader
            title="Professional summary"
            description={
              settings.summary_format === 'bullets'
                ? 'One bullet point per line.'
                : 'A short paragraph.'
            }
          />
          <CardBody>
            <Textarea
              value={contentToText(data.summary)}
              onChange={(e) =>
                update({ summary: textToContent(e.target.value, settings.summary_format) })
              }
              rows={5}
              aria-label="Professional summary"
            />
          </CardBody>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader title="Skills" />
          <CardBody>
            <SkillsEditor skills={data.skills} onChange={(skills) => update({ skills })} />
          </CardBody>
        </Card>

        {/* Work experience */}
        <Card>
          <CardHeader
            title="Work experience"
            actions={
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  update({
                    workExperience: [
                      ...data.workExperience,
                      {
                        company: '',
                        position: '',
                        location: '',
                        type: '',
                        duration: '',
                        description: workFormat === 'bullets' ? [] : '',
                      },
                    ],
                  })
                }
              >
                <Plus aria-hidden />
                Add
              </Button>
            }
          />
          <CardBody className="space-y-5">
            {data.workExperience.length === 0 && (
              <p className="text-sm text-stone-400">No work experience entries.</p>
            )}
            {data.workExperience.map((entry, index) => (
              <div key={index} className="rounded-lg border border-stone-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-stone-500">Entry {index + 1}</p>
                  <Button
                    variant="danger-ghost"
                    size="icon-sm"
                    aria-label={`Remove work entry ${index + 1}`}
                    onClick={() =>
                      update({ workExperience: data.workExperience.filter((_, i) => i !== index) })
                    }
                  >
                    <Trash2 aria-hidden />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Company">
                    <Input
                      value={entry.company}
                      onChange={(e) =>
                        update({
                          workExperience: data.workExperience.map((w, i) =>
                            i === index ? { ...w, company: e.target.value } : w
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field label="Position">
                    <Input
                      value={entry.position}
                      onChange={(e) =>
                        update({
                          workExperience: data.workExperience.map((w, i) =>
                            i === index ? { ...w, position: e.target.value } : w
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field label="Location">
                    <Input
                      value={entry.location}
                      onChange={(e) =>
                        update({
                          workExperience: data.workExperience.map((w, i) =>
                            i === index ? { ...w, location: e.target.value } : w
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field label="Duration" hint='e.g. "Jan 2022 - Present"'>
                    <Input
                      value={entry.duration}
                      onChange={(e) =>
                        update({
                          workExperience: data.workExperience.map((w, i) =>
                            i === index ? { ...w, duration: e.target.value } : w
                          ),
                        })
                      }
                    />
                  </Field>
                </div>
                <div className="mt-3">
                  <Field
                    label="Description"
                    hint={workFormat === 'bullets' ? 'One bullet per line.' : undefined}
                  >
                    <Textarea
                      value={contentToText(entry.description)}
                      onChange={(e) =>
                        update({
                          workExperience: data.workExperience.map((w, i) =>
                            i === index
                              ? { ...w, description: textToContent(e.target.value, workFormat) }
                              : w
                          ),
                        })
                      }
                      rows={4}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Education */}
        <Card>
          <CardHeader
            title="Education"
            actions={
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  update({
                    education: [
                      ...data.education,
                      { institution: '', degree: '', field: '', duration: '' },
                    ],
                  })
                }
              >
                <Plus aria-hidden />
                Add
              </Button>
            }
          />
          <CardBody className="space-y-5">
            {data.education.length === 0 && (
              <p className="text-sm text-stone-400">No education entries.</p>
            )}
            {data.education.map((entry, index) => (
              <div key={index} className="rounded-lg border border-stone-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-stone-500">Entry {index + 1}</p>
                  <Button
                    variant="danger-ghost"
                    size="icon-sm"
                    aria-label={`Remove education entry ${index + 1}`}
                    onClick={() =>
                      update({ education: data.education.filter((_, i) => i !== index) })
                    }
                  >
                    <Trash2 aria-hidden />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Institution">
                    <Input
                      value={entry.institution}
                      onChange={(e) =>
                        update({
                          education: data.education.map((ed, i) =>
                            i === index ? { ...ed, institution: e.target.value } : ed
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field label="Degree" hint="e.g. Bachelor's, Master's, PhD">
                    <Input
                      value={entry.degree}
                      onChange={(e) =>
                        update({
                          education: data.education.map((ed, i) =>
                            i === index ? { ...ed, degree: e.target.value } : ed
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field label="Field of study">
                    <Input
                      value={entry.field}
                      onChange={(e) =>
                        update({
                          education: data.education.map((ed, i) =>
                            i === index ? { ...ed, field: e.target.value } : ed
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field label="Duration" hint='e.g. "2016 - 2020"'>
                    <Input
                      value={entry.duration}
                      onChange={(e) =>
                        update({
                          education: data.education.map((ed, i) =>
                            i === index ? { ...ed, duration: e.target.value } : ed
                          ),
                        })
                      }
                    />
                  </Field>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader
            title="Projects"
            actions={
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  update({
                    projects: [
                      ...data.projects,
                      {
                        name: '',
                        role: '',
                        description: projectFormat === 'bullets' ? [] : '',
                        link: undefined,
                      },
                    ],
                  })
                }
              >
                <Plus aria-hidden />
                Add
              </Button>
            }
          />
          <CardBody className="space-y-5">
            {data.projects.length === 0 && (
              <p className="text-sm text-stone-400">No project entries.</p>
            )}
            {data.projects.map((entry, index) => (
              <div key={index} className="rounded-lg border border-stone-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-stone-500">Entry {index + 1}</p>
                  <Button
                    variant="danger-ghost"
                    size="icon-sm"
                    aria-label={`Remove project ${index + 1}`}
                    onClick={() => update({ projects: data.projects.filter((_, i) => i !== index) })}
                  >
                    <Trash2 aria-hidden />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Name">
                    <Input
                      value={entry.name}
                      onChange={(e) =>
                        update({
                          projects: data.projects.map((p, i) =>
                            i === index ? { ...p, name: e.target.value } : p
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field label="Role">
                    <Input
                      value={entry.role}
                      onChange={(e) =>
                        update({
                          projects: data.projects.map((p, i) =>
                            i === index ? { ...p, role: e.target.value } : p
                          ),
                        })
                      }
                    />
                  </Field>
                </div>
                <div className="mt-3 space-y-3">
                  <Field label="Link">
                    <Input
                      type="url"
                      value={entry.link ?? ''}
                      placeholder="https://…"
                      onChange={(e) =>
                        update({
                          projects: data.projects.map((p, i) =>
                            i === index ? { ...p, link: e.target.value || undefined } : p
                          ),
                        })
                      }
                    />
                  </Field>
                  <Field
                    label="Description"
                    hint={projectFormat === 'bullets' ? 'One bullet per line.' : undefined}
                  >
                    <Textarea
                      value={contentToText(entry.description)}
                      onChange={(e) =>
                        update({
                          projects: data.projects.map((p, i) =>
                            i === index
                              ? { ...p, description: textToContent(e.target.value, projectFormat) }
                              : p
                          ),
                        })
                      }
                      rows={3}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
