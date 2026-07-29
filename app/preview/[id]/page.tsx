'use client'

import { Suspense, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FileX, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTemplateDef, RESUME_PAGE_WIDTH_PX } from '@/lib/templates'
import { normalizeSettings } from '@/lib/utils/normalize-resume'
import { useResume } from '@/lib/use-resume'

function PreviewContent() {
  const params = useParams<{ id: string }>()
  const resumeId = typeof params.id === 'string' ? params.id : ''
  const searchParams = useSearchParams()
  const { resume, loading } = useResume(resumeId)

  const templateId = searchParams.get('template')
  // ?print=1 (the Download PDF button): open the print dialog once the sheet
  // has painted - "Save as PDF" there produces a text-based, ATS-parseable file.
  const shouldPrint = searchParams.get('print') === '1'
  useEffect(() => {
    if (!resume || !shouldPrint) return
    const timer = setTimeout(() => window.print(), 300)
    return () => clearTimeout(timer)
  }, [resume, shouldPrint])

  if (loading) {
    // This page opens in a new tab - never leave it blank.
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100" role="status">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-brand-600" />
        <span className="sr-only">Loading resume preview…</span>
      </div>
    )
  }

  if (!resume) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
        <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
            <FileX className="h-6 w-6 text-stone-500" aria-hidden />
          </div>
          <h1 className="mt-4 font-display text-lg font-bold text-stone-900">
            Resume not available
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            This resume doesn&apos;t exist, was deleted, or you need to sign in to view it.
          </p>
          <Link href="/dashboard/documents" className="mt-5 inline-block">
            <Button variant="secondary">Go to documents</Button>
          </Link>
        </div>
      </div>
    )
  }

  const TemplateComponent = getTemplateDef(templateId ?? resume.template_id).component
  const data = resume.generated_data
  const settings = normalizeSettings(resume.generation_settings)

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="no-print sticky top-0 z-10 border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <p className="truncate text-sm font-medium text-stone-700">{resume.job_title} — preview</p>
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            <Printer aria-hidden />
            Print
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto py-8 print:p-0">
        <div
          className="resume-container mx-auto bg-white shadow-lg print:shadow-none"
          style={{ width: RESUME_PAGE_WIDTH_PX }}
        >
          <TemplateComponent data={data} settings={settings} />
        </div>
      </div>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense>
      <PreviewContent />
    </Suspense>
  )
}
