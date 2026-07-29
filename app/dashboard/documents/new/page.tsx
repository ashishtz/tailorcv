'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Sparkles } from 'lucide-react'
import { createClient, getSessionUser } from '@/lib/supabase/client'
import { Resume } from '@/lib/types/database'
import type { GeneratedResumeData } from '@/lib/utils/normalize-resume'
import { rowToResume } from '@/lib/utils/normalize-resume'
import { Button } from '@/components/ui/button'
import { Field, Input, Textarea, Select } from '@/components/ui/field'
import { TemplateThumbnail } from '@/components/landing/template-thumbnail'
import { RESUME_TEMPLATES, getTemplateDef, RESUME_PAGE_WIDTH_PX } from '@/lib/templates'
import { landingSampleResume } from '@/lib/data/landing-sample'
import { cn } from '@/lib/utils'

type ContentFormat = 'paragraph' | 'bullets'

interface GenerationFormState {
  job_title: string
  job_description: string
  mode: 'strict' | 'free'
  template: string
  generation_settings: {
    summary_format: ContentFormat
    work_experience_format: ContentFormat
    projects_format: ContentFormat
    highlight_important_content: boolean
  }
}

const INITIAL_FORM: GenerationFormState = {
  job_title: '',
  job_description: '',
  mode: 'strict',
  template: 'classic',
  generation_settings: {
    summary_format: 'paragraph',
    work_experience_format: 'bullets',
    projects_format: 'bullets',
    highlight_important_content: false,
  },
}

const FORMAT_SECTIONS = [
  { key: 'summary_format', label: 'Summary' },
  { key: 'work_experience_format', label: 'Work experience' },
  { key: 'projects_format', label: 'Projects' },
] as const

export default function NewResumePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contextSource, setContextSource] = useState<'scratch' | 'resume'>('scratch')
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [formData, setFormData] = useState<GenerationFormState>(INITIAL_FORM)
  const [preview, setPreview] = useState<GeneratedResumeData | null>(null)
  const [existingResumes, setExistingResumes] = useState<Resume[]>([])
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      const user = await getSessionUser(supabase)
      if (!user) return
      const { data } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (active && data) setExistingResumes(data.map(rowToResume))
    })()
    return () => {
      active = false
      abortRef.current?.abort()
    }
    // supabase client is a stable singleton per render tree
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (contextSource === 'resume' && !selectedResumeId) {
      setError('Select which existing resume to use as the starting point.')
      return
    }

    setLoading(true)
    setPreview(null)
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await fetch('/api/resumes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          ...formData,
          context_source: contextSource === 'resume' ? 'resume' : 'profile',
          base_resume_id: contextSource === 'resume' ? selectedResumeId : undefined,
        }),
      })

      // Pre-stream failures (auth, validation) are plain JSON with a status.
      if (!response.ok || !response.body) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error || 'Resume generation failed. Please try again.')
      }

      // NDJSON stream: {partial} lines while the model writes, then
      // a final {resumeId} or {error} line.
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let resumeId: string | null = null

      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.trim()) continue
          const msg = JSON.parse(line) as {
            partial?: GeneratedResumeData
            resumeId?: string
            error?: string
          }
          if (msg.error) throw new Error(msg.error)
          if (msg.partial) setPreview(msg.partial)
          if (msg.resumeId) resumeId = msg.resumeId
        }
      }

      if (!resumeId) {
        throw new Error('Resume generation failed. Please try again.')
      }

      router.push(`/dashboard/documents/${resumeId}`)
      router.refresh()
      // Keep the page in its generating state while navigation commits.
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // User cancelled - back to the form, no error banner.
        setLoading(false)
        setPreview(null)
        return
      }
      setError(err instanceof Error ? err.message : 'Resume generation failed. Please try again.')
      setLoading(false)
      setPreview(null)
    }
  }

  const Template = getTemplateDef(formData.template).component

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold tracking-tight text-stone-900">
            Generate a resume
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Paste the job posting and watch the AI tailor your resume to it, live.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(320px,3fr)_7fr]">
          {/* Left: inputs */}
          <form onSubmit={handleSubmit} className="space-y-5 self-start rounded-xl border border-stone-200 bg-white p-5">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {error}
              </div>
            )}

            {existingResumes.length > 0 && (
              <Field label="Start from">
                <Select
                  value={contextSource === 'resume' ? selectedResumeId : ''}
                  onChange={(e) => {
                    const id = e.target.value
                    setContextSource(id ? 'resume' : 'scratch')
                    setSelectedResumeId(id)
                  }}
                  disabled={loading}
                >
                  <option value="">My profile data</option>
                  {existingResumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      Existing resume: {resume.job_title}
                    </option>
                  ))}
                </Select>
              </Field>
            )}

            <Field label="Job title" required>
              <Input
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                placeholder="e.g. Senior Frontend Engineer"
                required
                maxLength={200}
                disabled={loading}
              />
            </Field>
            <Field
              label="Job description"
              required
              hint="Paste the full posting - requirements, responsibilities, everything."
            >
              <Textarea
                value={formData.job_description}
                onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                rows={8}
                placeholder="Paste the job description here…"
                required
                disabled={loading}
              />
            </Field>

            <fieldset disabled={loading}>
              <legend className="mb-2 block text-sm font-medium text-stone-700">Template</legend>
              <div
                role="radiogroup"
                aria-label="Resume template"
                className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2"
              >
                {RESUME_TEMPLATES.map((template) => {
                  const selected = formData.template === template.id
                  return (
                    <button
                      key={template.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setFormData({ ...formData, template: template.id })}
                      className={cn(
                        'group overflow-hidden rounded-lg border text-left transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
                        selected
                          ? 'border-brand-500 ring-2 ring-brand-500/30'
                          : 'border-stone-200 hover:border-stone-300'
                      )}
                    >
                      <TemplateThumbnail templateId={template.id} width={120} />
                      <span
                        className={cn(
                          'block border-t px-2.5 py-1.5 text-xs font-medium',
                          selected
                            ? 'border-brand-200 bg-brand-50 text-brand-800'
                            : 'border-stone-200 bg-white text-stone-700'
                        )}
                      >
                        {template.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <fieldset disabled={loading}>
              <legend className="mb-2 block text-sm font-medium text-stone-700">
                Generation mode
              </legend>
              <div className="grid gap-2">
                {(
                  [
                    { value: 'strict', title: 'Strict', hint: 'Only reword what is actually in your data' },
                    { value: 'free', title: 'Free', hint: 'Let the AI embellish toward the job requirements' },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                      formData.mode === option.value
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-stone-200 hover:border-stone-300'
                    )}
                  >
                    <input
                      type="radio"
                      name="mode"
                      value={option.value}
                      checked={formData.mode === option.value}
                      onChange={() => setFormData({ ...formData, mode: option.value })}
                      className="mt-1"
                    />
                    <span>
                      <span className="block text-sm font-medium text-stone-900">{option.title}</span>
                      <span className="block text-xs text-stone-500">{option.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset disabled={loading}>
              <legend className="mb-2 block text-sm font-medium text-stone-700">Content format</legend>
              <div className="grid gap-3">
                {FORMAT_SECTIONS.map((section) => (
                  <Field key={section.key} label={section.label}>
                    <Select
                      value={formData.generation_settings[section.key]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          generation_settings: {
                            ...formData.generation_settings,
                            [section.key]: e.target.value as ContentFormat,
                          },
                        })
                      }
                    >
                      <option value="paragraph">Paragraph</option>
                      <option value="bullets">Bullet points</option>
                    </Select>
                  </Field>
                ))}
              </div>
              <label className="mt-3 flex items-start gap-2.5 rounded-lg border border-accent-200 bg-accent-50/60 p-3">
                <input
                  type="checkbox"
                  checked={formData.generation_settings.highlight_important_content}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      generation_settings: {
                        ...formData.generation_settings,
                        highlight_important_content: e.target.checked,
                      },
                    })
                  }
                  className="mt-0.5"
                />
                <span>
                  <span className="block text-sm font-medium text-stone-900">
                    Highlight the most relevant content
                  </span>
                  <span className="block text-xs text-stone-600">
                    Bolds the phrases that best match the job requirements.
                  </span>
                </span>
              </label>
            </fieldset>

            <div className="flex items-center gap-3 border-t border-stone-200 pt-4">
              {loading ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => abortRef.current?.abort()}
                  className="w-full"
                >
                  Cancel generation
                </Button>
              ) : (
                <Button type="submit" className="w-full">
                  <Sparkles aria-hidden />
                  Generate resume
                </Button>
              )}
            </div>
          </form>

          {/* Right: live preview */}
          <div className="min-w-0 self-start lg:sticky lg:top-6">
            <p className="mb-3 flex items-center gap-2 text-sm text-stone-600" aria-live="polite">
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse text-brand-600" aria-hidden />
                  {preview
                    ? 'Building your resume - watch it take shape. This usually takes 30-60 seconds.'
                    : 'Contacting the AI and drafting the first section…'}
                </>
              ) : (
                <>Sample preview of the {getTemplateDef(formData.template).name} template - your generated resume will replace it here.</>
              )}
            </p>
            <div className="overflow-x-auto rounded-xl border border-stone-200 bg-stone-100 p-4 sm:p-6">
              <div
                className={cn(
                  'mx-auto bg-white shadow-md transition-opacity',
                  !loading && !preview && 'opacity-60'
                )}
                style={{ width: RESUME_PAGE_WIDTH_PX }}
              >
                <Template
                  data={preview ?? landingSampleResume}
                  settings={formData.generation_settings}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
