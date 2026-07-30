'use client'

import { useState } from 'react'
import { createClient, requireSessionUser } from '@/lib/supabase/client'
import {
  Briefcase,
  FileText,
  FolderGit2,
  GraduationCap,
  Tags,
  Upload,
  UserRound,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import {
  importParsedResume,
  type ParsedResumeData,
} from '@/lib/repositories/onboarding.repository'

interface ImportResumeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 // matches the API's 2MB cap

/* ------------------------------------------------------------------ *
 * Review-step summary row
 * ------------------------------------------------------------------ */

function SummaryRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50">
        <Icon className="h-4 w-4 text-brand-600" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-stone-900">{label}</p>
        <p className="truncate text-xs text-stone-500">{value}</p>
      </div>
    </li>
  )
}

/* ------------------------------------------------------------------ *
 * Modal
 * ------------------------------------------------------------------ */

export function ImportResumeModal({ isOpen, onClose, onSuccess }: ImportResumeModalProps) {
  const [step, setStep] = useState<'select' | 'review'>('select')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [parsing, setParsing] = useState(false)
  const [parsed, setParsed] = useState<ParsedResumeData | null>(null)
  const [applying, setApplying] = useState(false)
  const supabase = createClient()
  const toast = useToast()

  const busy = parsing || applying

  const resetAndClose = () => {
    if (busy) return
    setStep('select')
    setSelectedFile(null)
    setFileError(null)
    setParsed(null)
    onClose()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const file = input.files?.[0]
    input.value = '' // allow picking the same file again after an error
    if (!file) return

    const isTxt = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')
    if (!isTxt) {
      setFileError('Only plain-text .txt files are supported right now.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError('That file is larger than 2MB. Trim it down and try again.')
      return
    }
    setSelectedFile(file)
    setFileError(null)
  }

  const handleParse = async () => {
    if (!selectedFile) return
    setParsing(true)
    setFileError(null)

    try {
      const formData = new FormData()
      formData.append('resume', selectedFile)

      const response = await fetch('/api/parse-resume', { method: 'POST', body: formData })
      const result = (await response.json().catch(() => ({}))) as {
        success?: boolean
        data?: ParsedResumeData
        error?: string
      }

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.error || 'We could not parse that resume. Please try again.')
      }

      setParsed(result.data)
      setStep('review')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Please try again.'
      setFileError(message)
      toast.error('Parsing failed', message)
    } finally {
      setParsing(false)
    }
  }

  const handleApply = async () => {
    if (!parsed) return
    setApplying(true)

    const user = await requireSessionUser(supabase)
    if (!user) {
      setApplying(false)
      toast.error('You are signed out', 'Sign in again to apply the import.')
      return
    }

    const result = await importParsedResume(supabase, user.id, parsed)
    setApplying(false)

    const parts: string[] = []
    if (result.contactFieldsFilled > 0) {
      parts.push(`${result.contactFieldsFilled} contact field${result.contactFieldsFilled === 1 ? '' : 's'} filled`)
    }
    if (result.work.added > 0) {
      parts.push(`${result.work.added} work experience${result.work.added === 1 ? '' : 's'}`)
    }
    if (result.education.added > 0) {
      parts.push(`${result.education.added} education entr${result.education.added === 1 ? 'y' : 'ies'}`)
    }
    if (result.projects.added > 0) {
      parts.push(`${result.projects.added} project${result.projects.added === 1 ? '' : 's'}`)
    }
    if (result.skills.added > 0) {
      parts.push(`${result.skills.added} skill${result.skills.added === 1 ? '' : 's'}`)
    }
    const skippedTotal =
      result.work.skipped + result.education.skipped + result.projects.skipped + result.skills.skipped

    if (parts.length > 0) {
      toast.success('Resume imported', `Added ${parts.join(', ')}.`)
    } else if (result.failed.length === 0 && skippedTotal === 0) {
      toast.info('Nothing to import', 'The parsed resume had no new usable entries.')
    }
    if (result.failed.length > 0) {
      toast.error('Some sections failed', `Could not import: ${result.failed.join(', ')}.`)
    } else if (skippedTotal > 0) {
      toast.info(
        `${skippedTotal} entr${skippedTotal === 1 ? 'y' : 'ies'} skipped`,
        'Entries missing required details (like a start date) were left out.'
      )
    }

    onSuccess()
    setStep('select')
    setSelectedFile(null)
    setFileError(null)
    setParsed(null)
    onClose()
  }

  const summary = {
    personal:
      [parsed?.contact?.name, parsed?.contact?.email]
        .map((value) => value?.trim())
        .filter(Boolean)
        .join(' · ') || 'Not found',
    work: parsed?.workExperience?.length ?? 0,
    education: parsed?.education?.length ?? 0,
    projects: parsed?.projects?.length ?? 0,
    skills: parsed?.skills?.length ?? 0,
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title="Import from resume"
      description={
        step === 'select'
          ? 'Upload an existing resume to fill your profile automatically.'
          : 'Review what was found before applying it.'
      }
      size="md"
      locked={busy}
      footer={
        step === 'select' ? (
          <>
            <Button variant="secondary" onClick={resetAndClose} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={handleParse} disabled={!selectedFile} loading={parsing}>
              {parsing ? 'Parsing…' : 'Parse resume'}
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={() => setStep('select')} disabled={busy}>
              Back
            </Button>
            <Button onClick={handleApply} loading={applying}>
              {applying ? 'Applying…' : 'Apply to profile'}
            </Button>
          </>
        )
      }
    >
      {step === 'select' ? (
        <div>
          {!selectedFile ? (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-300 px-6 py-10 text-center transition-colors focus-within:ring-2 focus-within:ring-brand-600 focus-within:ring-offset-2 hover:border-brand-400 hover:bg-brand-50/40">
              <input type="file" accept=".txt" onChange={handleFileSelect} className="sr-only" />
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50">
                <Upload className="h-5 w-5 text-brand-600" aria-hidden />
              </span>
              <span className="mt-3 text-sm font-medium text-stone-900">Choose a .txt file</span>
              <span className="mt-1 text-xs text-stone-500">
                Plain text only for now, up to 2MB. Export or save your resume as .txt first.
              </span>
            </label>
          ) : (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                  <FileText className="h-5 w-5 text-brand-600" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-stone-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-stone-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Remove selected file"
                onClick={() => setSelectedFile(null)}
                disabled={parsing}
              >
                <X aria-hidden />
              </Button>
            </div>
          )}

          {fileError && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {fileError}
            </p>
          )}
        </div>
      ) : (
        <div>
          <ul className="divide-y divide-stone-100 rounded-lg border border-stone-200">
            <SummaryRow icon={UserRound} label="Personal details" value={summary.personal} />
            <SummaryRow
              icon={Briefcase}
              label="Work experience"
              value={`${summary.work} entr${summary.work === 1 ? 'y' : 'ies'} found`}
            />
            <SummaryRow
              icon={GraduationCap}
              label="Education"
              value={`${summary.education} entr${summary.education === 1 ? 'y' : 'ies'} found`}
            />
            <SummaryRow
              icon={FolderGit2}
              label="Projects"
              value={`${summary.projects} entr${summary.projects === 1 ? 'y' : 'ies'} found`}
            />
            <SummaryRow
              icon={Tags}
              label="Skills"
              value={`${summary.skills} skill${summary.skills === 1 ? '' : 's'} found`}
            />
          </ul>
          <p className="mt-3 text-xs text-stone-500">
            Applying merges this into your profile: entries are added, empty contact fields are
            filled, and nothing you already have is changed or deleted.
          </p>
        </div>
      )}
    </Modal>
  )
}
