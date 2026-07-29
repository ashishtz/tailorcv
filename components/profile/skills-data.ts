import type { createClient } from '@/lib/supabase/client'

/** The untyped browser client - callers annotate row shapes themselves. */
export type SupabaseBrowserClient = ReturnType<typeof createClient>

export interface NamedRow {
  id: string
  name: string
}

interface IdRow {
  id: string
}

/** Escapes `%`, `_` and `\` so user input is matched literally in ilike patterns. */
export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`)
}

/**
 * Searches a named lookup table (skills / skill_categories) by substring,
 * case-insensitively. Throws with a readable message on query failure.
 */
export async function searchNamedRows(
  supabase: SupabaseBrowserClient,
  table: 'skills' | 'skill_categories',
  term: string,
  limit = 10
): Promise<NamedRow[]> {
  const trimmed = term.trim()
  if (!trimmed) return []

  const { data, error } = await supabase
    .from(table)
    .select('id, name')
    .ilike('name', `%${escapeLikePattern(trimmed)}%`)
    .order('name')
    .limit(limit)

  if (error) throw new Error(error.message)
  return ((data ?? []) as NamedRow[])
}

/**
 * Returns the id of the row with this (unique, case-insensitive) name,
 * creating it when missing. Survives the create/create race: if the insert
 * hits the unique constraint, the winning row is looked up and reused.
 */
async function ensureNamedRowId(
  supabase: SupabaseBrowserClient,
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
    const rows = (data ?? []) as IdRow[]
    return rows[0]?.id ?? null
  }

  const existingId = await findExisting()
  if (existingId) return existingId

  const { data: created, error: insertError } = await supabase
    .from(table)
    .insert({ name: trimmed })
    .select('id')
    .single()
  if (!insertError && created) return (created as IdRow).id

  const racedId = await findExisting()
  if (racedId) return racedId

  throw new Error(
    insertError?.message ??
      `Could not create the ${table === 'skills' ? 'skill' : 'category'} "${trimmed}".`
  )
}

export function ensureSkillId(supabase: SupabaseBrowserClient, name: string): Promise<string> {
  return ensureNamedRowId(supabase, 'skills', name)
}

export function ensureCategoryId(supabase: SupabaseBrowserClient, name: string): Promise<string> {
  return ensureNamedRowId(supabase, 'skill_categories', name)
}
