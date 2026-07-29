'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
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
import { monthInputToDate } from '@/lib/utils'
import { ensureCategoryId, ensureSkillId, type SupabaseBrowserClient } from './skills-data'

interface ImportResumeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

/* ------------------------------------------------------------------ *
 * Parsed payload returned by POST /api/parse-resume ({ success, data }).
 * Every field is treated as optional - the parser output is AI-generated.
 * ------------------------------------------------------------------ */

interface ParsedContact {
  name?: string
  email?: string
  phone?: string
  location?: string
}

interface ParsedWorkExperience {
  company?: string
  position?: string
  location?: string
  startDate?: string
  endDate?: string
  description?: string
}

interface ParsedEducation {
  institution?: string
  degree?: string
  field?: string
  startDate?: string
  endDate?: string
}

interface ParsedProject {
  name?: string
  role?: string
  description?: string
  link?: string
}

interface ParsedResumeData {
  contact?: ParsedContact
  workExperience?: ParsedWorkExperience[]
  education?: ParsedEducation[]
  skills?: string[]
  projects?: ParsedProject[]
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 // matches the API's 2MB cap

const IMPORT_SKILL_CATEGORY = 'Imported'

/* ------------------------------------------------------------------ *
 * Conversion helpers
 * ------------------------------------------------------------------ */

/** Parsed dates arrive as "YYYY-MM", sometimes "YYYY", "YYYY-MM-DD" or
 * "Present". Returns a DATE-column-safe string, or null when unusable. */
function importDateToDate(value: string | undefined): string | null {
  const trimmed = value?.trim()
  if (!trimmed || /^present$/i.test(trimmed)) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
  if (/^\d{4}-\d{2}$/.test(trimmed)) return monthInputToDate(trimmed)
  if (/^\d{4}$/.test(trimmed)) return `${trimmed}-01-01`
  return null
}

/** Prefixes https:// when the scheme is missing; empty input becomes null. */
function normalizeLink(raw: string | undefined): string | null {
  const trimmed = raw?.trim()
  if (!trimmed) return null
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

const DEGREE_VALUES = [
  'High School',
  'Associate',
  "Bachelor's",
  "Master's",
  'PhD',
  'Diploma',
  'Certificate',
  'Other',
] as const

type DegreeValue = (typeof DEGREE_VALUES)[number]

/** Maps free-form degree text onto the education.degree CHECK constraint. */
function mapDegree(raw: string | undefined): DegreeValue | null {
  const trimmed = raw?.trim()
  if (!trimmed) return null

  const exact = DEGREE_VALUES.find((d) => d.toLowerCase() === trimmed.toLowerCase())
  if (exact) return exact

  const lower = trimmed.toLowerCase()
  if (lower.includes('bachelor') || /^b\.?\s?(a|s|sc|e|eng|tech|com)\b/i.test(trimmed)) {
    return "Bachelor's"
  }
  if (lower.includes('master') || /^m\.?\s?(a|s|sc|e|eng|ba|tech|com)\b/i.test(trimmed)) {
    return "Master's"
  }
  if (lower.includes('phd') || lower.includes('ph.d') || lower.includes('doctor')) return 'PhD'
  if (lower.includes('high school') || lower.includes('secondary')) return 'High School'
  if (lower.includes('associate')) return 'Associate'
  if (lower.includes('diploma')) return 'Diploma'
  if (lower.includes('certificat')) return 'Certificate'
  return 'Other'
}

/* ------------------------------------------------------------------ *
 * Merge/apply helpers - all inserts, never deletes (RLS scopes writes
 * to the signed-in user).
 * ------------------------------------------------------------------ */

type ProfileContactField = 'first_name' | 'last_name' | 'email' | 'phone' | 'location'

/** Fills profile contact fields that are currently empty. Returns the
 * number of fields written. */
async function mergeProfileFields(
  supabase: SupabaseBrowserClient,
  userId: string,
  info: ParsedContact | undefined
): Promise<number> {
  if (!info) return 0

  const { data, error } = await supabase
    .from('profiles')
    .select('first_name, last_name, email, phone, location')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw new Error(error.message)
  const current = (data ?? {}) as Partial<Record<ProfileContactField, string | null>>

  const [firstName, ...restName] = (info.name ?? '').trim().split(/\s+/).filter(Boolean)
  const lastName = restName.join(' ')

  const candidates: Record<ProfileContactField, string> = {
    first_name: firstName ?? '',
    last_name: lastName,
    email: info.email?.trim() ?? '',
    phone: info.phone?.trim() ?? '',
    location: info.location?.trim() ?? '',
  }

  const updates: Partial<Record<ProfileContactField, string>> = {}
  for (const field of Object.keys(candidates) as ProfileContactField[]) {
    if (candidates[field] && !current[field]) updates[field] = candidates[field]
  }

  const count = Object.keys(updates).length
  if (count === 0) return 0

  const { error: updateError } = await supabase.from('profiles').update(updates).eq('id', userId)
  if (updateError) throw new Error(updateError.message)
  return count
}

interface InsertOutcome {
  added: number
  skipped: number
}

async function insertWorkExperiences(
  supabase: SupabaseBrowserClient,
  userId: string,
  items: ParsedWorkExperience[]
): Promise<InsertOutcome> {
  let added = 0
  let skipped = 0

  for (const item of items) {
    const company = item.company?.trim()
    const position = item.position?.trim()
    const startDate = importDateToDate(item.startDate)
    if (!company || !position || !startDate) {
      skipped += 1
      continue
    }

    const isCurrent = /^present$/i.test(item.endDate?.trim() ?? '')
    const { error } = await supabase.from('work_experiences').insert({
      user_id: userId,
      company_name: company,
      position_title: position,
      location: item.location?.trim() || null,
      job_type: null,
      start_date: startDate,
      end_date: isCurrent ? null : importDateToDate(item.endDate),
      is_current: isCurrent,
      description: item.description?.trim() || null,
    })
    if (error) skipped += 1
    else added += 1
  }

  return { added, skipped }
}

async function insertEducation(
  supabase: SupabaseBrowserClient,
  userId: string,
  items: ParsedEducation[]
): Promise<InsertOutcome> {
  let added = 0
  let skipped = 0

  for (const item of items) {
    const institution = item.institution?.trim()
    const startDate = importDateToDate(item.startDate)
    if (!institution || !startDate) {
      skipped += 1
      continue
    }

    const { error } = await supabase.from('education').insert({
      user_id: userId,
      institution_name: institution,
      degree: mapDegree(item.degree),
      field_of_study: item.field?.trim() || null,
      start_date: startDate,
      end_date: importDateToDate(item.endDate),
    })
    if (error) skipped += 1
    else added += 1
  }

  return { added, skipped }
}

async function insertProjects(
  supabase: SupabaseBrowserClient,
  userId: string,
  items: ParsedProject[]
): Promise<InsertOutcome> {
  let added = 0
  let skipped = 0

  for (const item of items) {
    const name = item.name?.trim()
    if (!name) {
      skipped += 1
      continue
    }

    const { error } = await supabase.from('projects').insert({
      user_id: userId,
      project_name: name,
      role_title: item.role?.trim() || null,
      description: item.description?.trim() || null,
      link: normalizeLink(item.link),
    })
    if (error) skipped += 1
    else added += 1
  }

  return { added, skipped }
}

/** Links parsed skills under an "Imported" category. Existing links keep
 * their category (duplicates are ignored, nothing is moved or deleted). */
async function importSkills(
  supabase: SupabaseBrowserClient,
  userId: string,
  names: string[]
): Promise<InsertOutcome> {
  const cleaned = Array.from(new Set(names.map((name) => name.trim()).filter(Boolean)))
  if (cleaned.length === 0) return { added: 0, skipped: 0 }

  const categoryId = await ensureCategoryId(supabase, IMPORT_SKILL_CATEGORY)

  let skipped = 0
  const rows: Array<{ user_id: string; skill_id: string; category_id: string }> = []
  for (const name of cleaned) {
    try {
      const skillId = await ensureSkillId(supabase, name)
      rows.push({ user_id: userId, skill_id: skillId, category_id: categoryId })
    } catch {
      skipped += 1
    }
  }

  if (rows.length > 0) {
    const { error } = await supabase
      .from('user_skills')
      .upsert(rows, { onConflict: 'user_id,skill_id', ignoreDuplicates: true })
    if (error) throw new Error(error.message)
  }

  return { added: rows.length, skipped }
}

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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setApplying(false)
      toast.error('You are signed out', 'Sign in again to apply the import.')
      return
    }

    const parts: string[] = []
    const problems: string[] = []
    let skippedTotal = 0

    try {
      const filled = await mergeProfileFields(supabase, user.id, parsed.contact)
      if (filled > 0) parts.push(`${filled} contact field${filled === 1 ? '' : 's'} filled`)
    } catch {
      problems.push('contact details')
    }

    try {
      const work = await insertWorkExperiences(supabase, user.id, parsed.workExperience ?? [])
      if (work.added > 0) parts.push(`${work.added} work experience${work.added === 1 ? '' : 's'}`)
      skippedTotal += work.skipped
    } catch {
      problems.push('work experience')
    }

    try {
      const education = await insertEducation(supabase, user.id, parsed.education ?? [])
      if (education.added > 0) {
        parts.push(`${education.added} education entr${education.added === 1 ? 'y' : 'ies'}`)
      }
      skippedTotal += education.skipped
    } catch {
      problems.push('education')
    }

    try {
      const projects = await insertProjects(supabase, user.id, parsed.projects ?? [])
      if (projects.added > 0) parts.push(`${projects.added} project${projects.added === 1 ? '' : 's'}`)
      skippedTotal += projects.skipped
    } catch {
      problems.push('projects')
    }

    try {
      const skills = await importSkills(supabase, user.id, parsed.skills ?? [])
      if (skills.added > 0) parts.push(`${skills.added} skill${skills.added === 1 ? '' : 's'}`)
      skippedTotal += skills.skipped
    } catch {
      problems.push('skills')
    }

    setApplying(false)

    if (parts.length > 0) {
      toast.success('Resume imported', `Added ${parts.join(', ')}.`)
    } else if (problems.length === 0 && skippedTotal === 0) {
      toast.info('Nothing to import', 'The parsed resume had no new usable entries.')
    }
    if (problems.length > 0) {
      toast.error('Some sections failed', `Could not import: ${problems.join(', ')}.`)
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
