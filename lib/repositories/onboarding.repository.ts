import type { SupabaseClient } from '@supabase/supabase-js'
import { monthInputToDate } from '@/lib/utils'
import type { Degree, OnboardingData } from '@/lib/contexts/onboarding-context'

/** Human-readable step names, used directly in error toasts. */
type OnboardingSaveStep =
  | 'personal details'
  | 'work experience'
  | 'education'
  | 'projects'
  | 'skills'

type OnboardingSaveResult =
  | { ok: true; kept: OnboardingSaveStep[] }
  | { ok: false; step: OnboardingSaveStep; message: string }

const fail = (step: OnboardingSaveStep, message: string): OnboardingSaveResult => ({
  ok: false,
  step,
  message,
})

/* ------------------------------------------------------------------ *
 * Shared helpers
 * ------------------------------------------------------------------ */

/** Prefixes https:// when the scheme is missing; empty input becomes ''. */
export function normalizeLink(raw: string | undefined): string {
  const trimmed = raw?.trim() ?? ''
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

/** Escapes `%`, `_` and `\` so user input is matched literally in ilike patterns. */
function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`)
}

/**
 * Searches a named lookup table (skills / skill_categories) by substring,
 * case-insensitively. Throws with a readable message on query failure.
 */
export async function searchNames(
  supabase: SupabaseClient,
  table: 'skills' | 'skill_categories',
  term: string,
  limit = 10
): Promise<string[]> {
  const trimmed = term.trim()
  if (!trimmed) return []

  const { data, error } = await supabase
    .from(table)
    .select('name')
    .ilike('name', `%${escapeLikePattern(trimmed)}%`)
    .order('name')
    .limit(limit)

  if (error) throw new Error(error.message)
  return ((data ?? []) as Array<{ name: string | null }>)
    .map((row) => row.name ?? '')
    .filter(Boolean)
}

/**
 * Returns the id of the row with this (unique, case-insensitive) name,
 * creating it when missing. Survives the create/create race: if the insert
 * hits the unique constraint, the winning row is looked up and reused.
 */
async function ensureNamedRowId(
  supabase: SupabaseClient,
  table: 'skills' | 'skill_categories',
  name: string
): Promise<string> {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('A name is required.')

  const findExisting = async (): Promise<string | null> => {
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .ilike('name', escapeLikePattern(trimmed))
      .limit(1)
    if (error) throw new Error(error.message)
    const rows = (data ?? []) as Array<{ id: string }>
    return rows[0]?.id ?? null
  }

  const existingId = await findExisting()
  if (existingId) return existingId

  const { data: created, error: insertError } = await supabase
    .from(table)
    .insert({ name: trimmed })
    .select('id')
    .single()
  if (!insertError && created) return (created as { id: string }).id

  const racedId = await findExisting()
  if (racedId) return racedId

  throw new Error(
    insertError?.message ??
      `Could not create the ${table === 'skills' ? 'skill' : 'category'} "${trimmed}".`
  )
}

export function ensureSkillId(supabase: SupabaseClient, name: string): Promise<string> {
  return ensureNamedRowId(supabase, 'skills', name)
}

export function ensureCategoryId(supabase: SupabaseClient, name: string): Promise<string> {
  return ensureNamedRowId(supabase, 'skill_categories', name)
}

async function countUserRows(
  supabase: SupabaseClient,
  table: 'work_experiences' | 'education' | 'projects',
  userId: string
): Promise<{ count: number; error: string | null }> {
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
  return { count: count ?? 0, error: error ? error.message : null }
}

/* ------------------------------------------------------------------ *
 * Onboarding draft persistence
 * ------------------------------------------------------------------ */

/**
 * Persists the whole onboarding draft in sequence with full error handling.
 * On failure the caller gets the failing step and message back - nothing is
 * silently dropped. Duplicate safety: any content table that already has
 * rows for this user is skipped and reported via `kept`, so re-running
 * onboarding never duplicates data.
 */
export async function saveOnboardingData(
  supabase: SupabaseClient,
  userId: string,
  draft: OnboardingData
): Promise<OnboardingSaveResult> {
  // 1) Profile - send only non-empty fields, but always flip onboarding_completed.
  const info = draft.personalInfo
  const profilePayload: Record<string, string | boolean> = { onboarding_completed: true }
  const profileFields: ReadonlyArray<readonly [string, string]> = [
    ['first_name', info.first_name],
    ['last_name', info.last_name],
    ['email', info.email],
    ['phone', info.phone],
    ['location', info.location],
    ['linkedin_url', info.linkedin_url],
    ['github_url', info.github_url],
    ['stackoverflow_url', info.stackoverflow_url],
  ]
  for (const [column, raw] of profileFields) {
    const value = raw.trim()
    if (value) profilePayload[column] = value
  }

  const updated = await supabase
    .from('profiles')
    .update(profilePayload)
    .eq('id', userId)
    .select('id')
    .maybeSingle()
  if (updated.error) return fail('personal details', updated.error.message)
  if (!updated.data) {
    // No profile row yet (signup trigger missing or failed) - create it instead.
    const inserted = await supabase.from('profiles').insert({ id: userId, ...profilePayload })
    if (inserted.error) return fail('personal details', inserted.error.message)
  }

  const kept: OnboardingSaveStep[] = []

  // 2) Work experience - one bulk insert, skipped when rows already exist.
  if (draft.workExperiences.length > 0) {
    const existing = await countUserRows(supabase, 'work_experiences', userId)
    if (existing.error) return fail('work experience', existing.error)
    if (existing.count > 0) {
      kept.push('work experience')
    } else {
      const rows = draft.workExperiences.map((entry) => ({
        user_id: userId,
        company_name: entry.company_name.trim(),
        position_title: entry.position_title.trim(),
        location: entry.location.trim() || null,
        job_type: entry.job_type || null,
        start_date: monthInputToDate(entry.start_date),
        end_date: entry.is_current ? null : monthInputToDate(entry.end_date),
        is_current: entry.is_current,
        description: entry.description.trim() || null,
      }))
      const { error } = await supabase.from('work_experiences').insert(rows)
      if (error) return fail('work experience', error.message)
    }
  }

  // 3) Education
  if (draft.education.length > 0) {
    const existing = await countUserRows(supabase, 'education', userId)
    if (existing.error) return fail('education', existing.error)
    if (existing.count > 0) {
      kept.push('education')
    } else {
      const rows = draft.education.map((entry) => ({
        user_id: userId,
        institution_name: entry.institution_name.trim(),
        degree: entry.degree || null,
        field_of_study: entry.field_of_study.trim() || null,
        start_date: monthInputToDate(entry.start_date),
        end_date: monthInputToDate(entry.end_date),
      }))
      const { error } = await supabase.from('education').insert(rows)
      if (error) return fail('education', error.message)
    }
  }

  // 4) Projects
  if (draft.projects.length > 0) {
    const existing = await countUserRows(supabase, 'projects', userId)
    if (existing.error) return fail('projects', existing.error)
    if (existing.count > 0) {
      kept.push('projects')
    } else {
      const rows = draft.projects.map((entry) => ({
        user_id: userId,
        project_name: entry.project_name.trim(),
        role_title: entry.role_title.trim() || null,
        description: entry.description.trim() || null,
        link: entry.link.trim() || null,
      }))
      const { error } = await supabase.from('projects').insert(rows)
      if (error) return fail('projects', error.message)
    }
  }

  // 5) Skills - ensure category and skill rows exist, then one upsert into
  // user_skills that always carries category_id (previously skills were
  // saved uncategorized and never showed up in the profile UI).
  if (draft.skills.length > 0) {
    try {
      const categoryIds = new Map<string, string>()
      for (const skill of draft.skills) {
        const categoryName = skill.categoryName.trim()
        if (!categoryName || categoryIds.has(categoryName)) continue
        categoryIds.set(categoryName, await ensureCategoryId(supabase, categoryName))
      }

      const userSkillRows: Array<{
        user_id: string
        skill_id: string
        category_id: string | null
      }> = []
      const seen = new Set<string>()
      for (const skill of draft.skills) {
        const name = skill.skillName.trim()
        const key = name.toLowerCase()
        if (!name || seen.has(key)) continue
        seen.add(key)
        userSkillRows.push({
          user_id: userId,
          skill_id: await ensureSkillId(supabase, name),
          category_id: categoryIds.get(skill.categoryName.trim()) ?? null,
        })
      }

      if (userSkillRows.length > 0) {
        const { error } = await supabase
          .from('user_skills')
          .upsert(userSkillRows, { onConflict: 'user_id,skill_id', ignoreDuplicates: false })
        if (error) return fail('skills', error.message)
      }
    } catch (error) {
      return fail('skills', error instanceof Error ? error.message : 'Could not save skills.')
    }
  }

  return { ok: true, kept }
}

/* ------------------------------------------------------------------ *
 * Resume import - parsed payload returned by POST /api/parse-resume.
 * Every field is treated as optional - the parser output is AI-generated.
 * All writes are inserts/merges, never deletes (RLS scopes writes to the
 * signed-in user).
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

export interface ParsedResumeData {
  contact?: ParsedContact
  workExperience?: ParsedWorkExperience[]
  education?: ParsedEducation[]
  skills?: string[]
  projects?: ParsedProject[]
}

interface InsertOutcome {
  added: number
  skipped: number
}

export interface ImportSummary {
  contactFieldsFilled: number
  work: InsertOutcome
  education: InsertOutcome
  projects: InsertOutcome
  skills: InsertOutcome
  /** Human-readable labels of sections that failed entirely. */
  failed: string[]
}

const IMPORT_SKILL_CATEGORY = 'Imported'

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

/** Same values as the education.degree CHECK constraint; typed against the
 * onboarding Degree union so drift breaks the build. */
const DEGREE_VALUES: readonly Degree[] = [
  'High School',
  'Associate',
  "Bachelor's",
  "Master's",
  'PhD',
  'Diploma',
  'Certificate',
  'Other',
]

/** Maps free-form degree text onto the education.degree CHECK constraint. */
function mapDegree(raw: string | undefined): Degree | null {
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

type ProfileContactField = 'first_name' | 'last_name' | 'email' | 'phone' | 'location'

/** Fills profile contact fields that are currently empty. Returns the
 * number of fields written. */
async function mergeProfileFields(
  supabase: SupabaseClient,
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

async function insertWorkExperiences(
  supabase: SupabaseClient,
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
  supabase: SupabaseClient,
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
  supabase: SupabaseClient,
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
      link: normalizeLink(item.link) || null,
    })
    if (error) skipped += 1
    else added += 1
  }

  return { added, skipped }
}

/** Links parsed skills under an "Imported" category. Existing links keep
 * their category (duplicates are ignored, nothing is moved or deleted). */
async function importSkills(
  supabase: SupabaseClient,
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
      rows.push({ user_id: userId, skill_id: await ensureSkillId(supabase, name), category_id: categoryId })
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

/**
 * Merges a parsed resume into the user's profile: entries are inserted,
 * empty contact fields are filled, nothing existing is changed or deleted.
 * Each section fails independently and is reported via `failed`.
 */
export async function importParsedResume(
  supabase: SupabaseClient,
  userId: string,
  parsed: ParsedResumeData
): Promise<ImportSummary> {
  const none: InsertOutcome = { added: 0, skipped: 0 }
  const summary: ImportSummary = {
    contactFieldsFilled: 0,
    work: none,
    education: none,
    projects: none,
    skills: none,
    failed: [],
  }

  try {
    summary.contactFieldsFilled = await mergeProfileFields(supabase, userId, parsed.contact)
  } catch {
    summary.failed.push('contact details')
  }
  try {
    summary.work = await insertWorkExperiences(supabase, userId, parsed.workExperience ?? [])
  } catch {
    summary.failed.push('work experience')
  }
  try {
    summary.education = await insertEducation(supabase, userId, parsed.education ?? [])
  } catch {
    summary.failed.push('education')
  }
  try {
    summary.projects = await insertProjects(supabase, userId, parsed.projects ?? [])
  } catch {
    summary.failed.push('projects')
  }
  try {
    summary.skills = await importSkills(supabase, userId, parsed.skills ?? [])
  } catch {
    summary.failed.push('skills')
  }

  return summary
}
