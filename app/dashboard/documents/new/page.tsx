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
import { RESUME_TEMPLATES, getTemplateDef, RESUME_PAGE_WIDTH_PX } from '@/lib/templates'
import { landingSampleResume } from '@/lib/data/landing-sample'
import { useFitScale } from '@/lib/use-fit-scale'
import { cn } from '@/lib/utils'

type ContentFormat = 'paragraph' | 'bullets'

type GenerationStatus = 'idle' | 'generating' | 'cancelled' | 'failed'

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
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [contextSource, setContextSource] = useState<'scratch' | 'resume'>('scratch')
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [formData, setFormData] = useState<GenerationFormState>(INITIAL_FORM)
  const [preview, setPreview] = useState<GeneratedResumeData | null>(null)
  const [existingResumes, setExistingResumes] = useState<Resume[]>([])
  const abortRef = useRef<AbortController | null>(null)
  // Scale the fixed-width resume sheet to always fill the preview pane.
  const { ref: previewBoxRef, scale: previewScale } = useFitScale()

  const generating = status === 'generating'

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

  // Wired to the form's onReset (Cancel is type="reset"): the native form
  // event path is reliable while a generation is in flight, where a plain
  // delegated onClick on the swapped-in button proved not to be.
  const handleCancel = (e: { preventDefault(): void }) => {
    e.preventDefault() // keep the field values - only cancel the generation
    abortRef.current?.abort()
    setStatus('cancelled')
    setPreview(null)
  }

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError(null)

    if (contextSource === 'resume' && !selectedResumeId) {
      setError('Select which existing resume to use as the starting point.')
      return
    }

    setStatus('generating')
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
      // User cancelled - the rejection flavor varies (AbortError or a generic
      // fetch TypeError), so trust the signal, not the error type.
      if (controller.signal.aborted) {
        setStatus('cancelled')
        setPreview(null)
        return
      }
      setError(err instanceof Error ? err.message : 'Resume generation failed. Please try again.')
      setStatus('failed')
      setPreview(null)
    }
  }

  const templateDef = getTemplateDef(formData.template)
  const Template = templateDef.component
  const templateName = templateDef.name

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(320px,3fr)_7fr]">
          {/* Left: inputs */}
          <form onSubmit={handleSubmit} onReset={handleCancel} className="space-y-5 self-start rounded-xl border border-stone-200 bg-white p-5">
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-stone-900">
                Generate a resume
              </h1>
              <p className="mt-1 text-sm text-stone-500">
                Paste the job posting and watch the AI tailor your resume to it, live.
              </p>
            </div>
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
                  disabled={generating}
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
                disabled={generating}
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
                disabled={generating}
              />
            </Field>

            <Field label="Template" hint="Shown live in the preview on the right.">
              <Select
                value={formData.template}
                onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                disabled={generating}
              >
                {RESUME_TEMPLATES.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Select>
            </Field>

            <fieldset disabled={generating}>
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

            <fieldset disabled={generating}>
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
              {/* One button kept mounted across the generating swap so keyboard
                  focus survives; only its type/label/style toggle. */}
              <Button
                type={generating ? 'reset' : 'submit'}
                variant={generating ? 'secondary' : 'primary'}
                className="w-full"
              >
                {generating ? (
                  'Cancel generation'
                ) : (
                  <>
                    <Sparkles aria-hidden />
                    Generate resume
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Right: live preview */}
          <section aria-label="Resume preview" className="min-w-0 self-start lg:sticky lg:top-6">
            <div className="mx-auto w-full max-w-2xl">
              {/* Announced on every state change; also the visible caption
                  that ties the sheet below to what it currently shows. */}
              <div
                role="status"
                className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm text-stone-600"
              >
                <span>
                  {generating
                    ? 'Generating your resume…'
                    : status === 'cancelled'
                      ? `Generation cancelled. Sample preview of the ${templateName} template.`
                      : status === 'failed'
                        ? `Generation failed. Sample preview of the ${templateName} template.`
                        : `Sample preview of the ${templateName} template.`}
                </span>
                {!preview && (
                  <span className="rounded-full bg-stone-200/80 px-2 py-0.5 text-xs font-medium text-stone-600">
                    Sample data
                  </span>
                )}
              </div>

              {/* Bare sheet, no framing: zoomed to exactly fill this width so
                  there is never horizontal scroll, and never height-capped so
                  the full page is visible and reads portrait. */}
              <div ref={previewBoxRef} className="w-full">
                <div
                  className={cn(
                    'bg-white shadow-lg ring-1 ring-stone-200 transition-opacity',
                    !generating && !preview && 'opacity-60'
                  )}
                  style={{ width: RESUME_PAGE_WIDTH_PX, zoom: previewScale }}
                >
                  <Template
                    data={preview ?? landingSampleResume}
                    settings={formData.generation_settings}
                    nameTag="h2"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
