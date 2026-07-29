'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Sparkles } from 'lucide-react'
import { Resume } from '@/lib/types/database'
import type { GeneratedResumeData } from '@/lib/utils/normalize-resume'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Field, Input, Textarea, Select } from '@/components/ui/field'
import { TemplateThumbnail } from '@/components/landing/template-thumbnail'
import { RESUME_TEMPLATES, getTemplateDef, RESUME_PAGE_WIDTH_PX } from '@/lib/templates'
import { cn } from '@/lib/utils'

interface GenerateResumeModalProps {
  isOpen: boolean
  onClose: () => void
  existingResumes: Resume[]
}

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

export function GenerateResumeModal({ isOpen, onClose, existingResumes }: GenerateResumeModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contextSource, setContextSource] = useState<'scratch' | 'resume'>('scratch')
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [formData, setFormData] = useState<GenerationFormState>(INITIAL_FORM)
  const [preview, setPreview] = useState<GeneratedResumeData | null>(null)

  const canUseExisting = existingResumes.length > 0

  const handleClose = () => {
    if (loading) return
    setError(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (contextSource === 'resume' && !selectedResumeId) {
      setError('Select which existing resume to use as the starting point.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/resumes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      // Keep the modal in its loading state while navigation commits.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resume generation failed. Please try again.')
      setLoading(false)
      setPreview(null)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Generate a resume"
      description="Paste the job posting and the AI will tailor your resume to it."
      size="xl"
      locked={loading}
    >
      {loading ? (
        <LiveBuildPreview
          templateId={formData.template}
          data={preview}
          settings={formData.generation_settings}
        />
      ) : (
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {error}
          </div>
        )}

        {/* Context source */}
        {canUseExisting && (
          <fieldset>
            <legend className="mb-2 block text-sm font-medium text-stone-700">Start from</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  { value: 'scratch', title: 'My profile', hint: 'Use your saved profile data' },
                  { value: 'resume', title: 'An existing resume', hint: 'Refine one you generated before' },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                    contextSource === option.value
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-stone-200 hover:border-stone-300'
                  )}
                >
                  <input
                    type="radio"
                    name="context_source"
                    value={option.value}
                    checked={contextSource === option.value}
                    onChange={() => setContextSource(option.value)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-medium text-stone-900">{option.title}</span>
                    <span className="block text-xs text-stone-500">{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            {contextSource === 'resume' && (
              <div className="mt-3">
                <Field label="Base resume" required>
                  <Select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    required
                  >
                    <option value="">Select a resume…</option>
                    {existingResumes.map((resume) => (
                      <option key={resume.id} value={resume.id}>
                        {resume.job_title}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            )}
          </fieldset>
        )}

        {/* Job info */}
        <div className="grid gap-4">
          <Field label="Job title" required>
            <Input
              value={formData.job_title}
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              placeholder="e.g. Senior Frontend Engineer"
              required
              maxLength={200}
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
              rows={6}
              placeholder="Paste the job description here…"
              required
            />
          </Field>
        </div>

        {/* Template picker */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-stone-700">Template</legend>
          <div
            role="radiogroup"
            aria-label="Resume template"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
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
                  <TemplateThumbnail templateId={template.id} width={140} />
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

        {/* Mode */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-stone-700">Generation mode</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                {
                  value: 'strict',
                  title: 'Strict',
                  hint: 'Only reword what is actually in your data',
                },
                {
                  value: 'free',
                  title: 'Free',
                  hint: 'Let the AI embellish toward the job requirements',
                },
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

        {/* Format settings */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-stone-700">Content format</legend>
          <div className="grid gap-3 sm:grid-cols-3">
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

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 border-t border-stone-200 pt-4">
          <p className="text-xs text-stone-500" aria-live="polite">
            {loading
              ? 'Generating - this usually takes 30-60 seconds. Keep this window open.'
              : 'Generation takes about a minute.'}
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              <Sparkles aria-hidden />
              {loading ? 'Generating…' : 'Generate resume'}
            </Button>
          </div>
        </div>
      </form>
      )}
    </Modal>
  )
}

/** Renders the selected template live from streamed partial data, scaled to fit. */
function LiveBuildPreview({
  templateId,
  data,
  settings,
}: {
  templateId: string
  data: GeneratedResumeData | null
  settings: GenerationFormState['generation_settings']
}) {
  const Template = getTemplateDef(templateId).component
  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-sm text-stone-600" aria-live="polite">
        <Sparkles className="h-4 w-4 animate-pulse text-brand-600" aria-hidden />
        Building your resume - watch it take shape. This usually takes 30-60 seconds.
      </p>
      <div className="flex max-h-[65vh] justify-center overflow-y-auto rounded-lg border border-stone-200 bg-stone-100 p-4">
        {data ? (
          <div
            className="w-full max-w-[520px] rounded bg-white shadow-sm"
            // zoom (not transform) so the scaled height participates in layout
            // and the container scrollbar matches what you see.
            style={{ zoom: 520 / RESUME_PAGE_WIDTH_PX }}
          >
            <Template data={data} settings={settings} />
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center text-sm text-stone-500">
            <span className="animate-pulse">Contacting the AI and drafting the first section…</span>
          </div>
        )}
      </div>
    </div>
  )
}
