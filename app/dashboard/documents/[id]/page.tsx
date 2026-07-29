'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Eye, FileX, Pencil } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { getTemplateDef, RESUME_TEMPLATES, RESUME_PAGE_WIDTH_PX } from '@/lib/templates'
import { normalizeSettings } from '@/lib/utils/normalize-resume'
import { useResume } from '@/lib/use-resume'

export default function ResumeViewPage() {
  const params = useParams<{ id: string }>()
  const resumeId = typeof params.id === 'string' ? params.id : ''
  const { resume, loading, failed: loadFailed } = useResume(resumeId)
  // null = follow the saved template; set only when the user picks one here.
  const [templateOverride, setTemplateOverride] = useState<string | null>(null)
  const toast = useToast()
  const supabase = createClient()

  const selectedTemplate = templateOverride ?? resume?.template_id ?? 'classic'

  // Persist template choice - previously the dropdown was local-only state
  // and silently reset on every reload.
  const handleTemplateChange = async (templateId: string) => {
    const previous = selectedTemplate
    setTemplateOverride(templateId)
    const { error } = await supabase
      .from('resumes')
      .update({ template_id: templateId })
      .eq('id', resumeId)

    if (error) {
      setTemplateOverride(previous)
      toast.error('Template not saved', 'Could not save your template choice. Please try again.')
    }
  }


  if (loading) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8" role="status" aria-label="Loading resume">
        <div className="mx-auto max-w-4xl space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    )
  }

  if (loadFailed || !resume) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <Card>
            <EmptyState
              icon={FileX}
              title={loadFailed ? "Couldn't load this resume" : 'Resume not found'}
              description={
                loadFailed
                  ? 'Something went wrong while loading. Please try again.'
                  : "This resume doesn't exist or may have been deleted."
              }
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

  const TemplateComponent = getTemplateDef(selectedTemplate).component
  const data = resume.generated_data
  const settings = normalizeSettings(resume.generation_settings)

  return (
    <div className="min-h-full bg-stone-100">
      {/* Toolbar */}
      <div className="no-print sticky top-14 z-30 border-b border-stone-200 bg-white lg:top-0">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/dashboard/documents"
              aria-label="Back to documents"
              className="rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate font-display text-base font-semibold text-stone-900">
                {resume.job_title}
              </h1>
              <p className="text-xs text-stone-500">
                Created {new Date(resume.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="template-select" className="sr-only">
              Template
            </label>
            <Select
              id="template-select"
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-40"
            >
              {RESUME_TEMPLATES.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </Select>

            <Link href={`/dashboard/documents/${resumeId}/edit`}>
              <Button variant="secondary">
                <Pencil aria-hidden />
                Edit
              </Button>
            </Link>
            <Link href={`/preview/${resumeId}?template=${selectedTemplate}`} target="_blank">
              <Button variant="secondary">
                <Eye aria-hidden />
                Preview
              </Button>
            </Link>
            <Link href={`/preview/${resumeId}?template=${selectedTemplate}&print=1`} target="_blank">
              <Button>
                <Download aria-hidden />
                Download PDF
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Resume sheet - fixed page width so PDF output is deterministic */}
      <div className="overflow-x-auto py-8">
        <div
          className="resume-container mx-auto bg-white shadow-lg"
          style={{ width: RESUME_PAGE_WIDTH_PX }}
        >
          <TemplateComponent data={data} settings={settings} />
        </div>
      </div>
    </div>
  )
}
