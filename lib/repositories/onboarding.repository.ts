import type { SupabaseClient } from '@supabase/supabase-js'
import { monthInputToDate } from '@/lib/utils'
import type { OnboardingData } from '@/lib/contexts/onboarding-context'

/** Human-readable step names, used directly in error toasts. */
export type OnboardingSaveStep =
  | 'personal details'
  | 'work experience'
  | 'education'
  | 'projects'
  | 'skills'

export type OnboardingSaveResult =
  | { ok: true; kept: OnboardingSaveStep[] }
  | { ok: false; step: OnboardingSaveStep; message: string }

const fail = (step: OnboardingSaveStep, message: string): OnboardingSaveResult => ({
  ok: false,
  step,
  message,
})

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

/**
 * Returns the id of the row in `table` with the given unique name,
 * creating it when missing. Handles the insert race where another
 * session creates the same name first.
 */
async function ensureNamedRow(
  supabase: SupabaseClient,
  table: 'skills' | 'skill_categories',
  name: string
): Promise<{ id: string } | { error: string }> {
  const found = await supabase.from(table).select('id').eq('name', name).maybeSingle()
  if (found.error) return { error: found.error.message }
  const foundRow = found.data as { id: string } | null
  if (foundRow) return { id: foundRow.id }

  const created = await supabase.from(table).insert({ name }).select('id').single()
  const createdRow = created.data as { id: string } | null
  if (!created.error && createdRow) return { id: createdRow.id }

  // Unique-violation race: the name appeared between our select and insert.
  const retry = await supabase.from(table).select('id').eq('name', name).maybeSingle()
  const retryRow = retry.data as { id: string } | null
  if (retryRow) return { id: retryRow.id }

  return { error: created.error?.message ?? `Could not save "${name}"` }
}

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
    const categoryIds = new Map<string, string>()
    for (const skill of draft.skills) {
      const categoryName = skill.categoryName.trim()
      if (!categoryName || categoryIds.has(categoryName)) continue
      const ensured = await ensureNamedRow(supabase, 'skill_categories', categoryName)
      if ('error' in ensured) return fail('skills', ensured.error)
      categoryIds.set(categoryName, ensured.id)
    }

    const userSkillRows: Array<{ user_id: string; skill_id: string; category_id: string | null }> =
      []
    const seen = new Set<string>()
    for (const skill of draft.skills) {
      const name = skill.skillName.trim()
      const key = name.toLowerCase()
      if (!name || seen.has(key)) continue
      seen.add(key)
      const ensured = await ensureNamedRow(supabase, 'skills', name)
      if ('error' in ensured) return fail('skills', ensured.error)
      userSkillRows.push({
        user_id: userId,
        skill_id: ensured.id,
        category_id: categoryIds.get(skill.categoryName.trim()) ?? null,
      })
    }

    if (userSkillRows.length > 0) {
      const { error } = await supabase
        .from('user_skills')
        .upsert(userSkillRows, { onConflict: 'user_id,skill_id', ignoreDuplicates: false })
      if (error) return fail('skills', error.message)
    }
  }

  return { ok: true, kept }
}
