import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  GeneratedResumeData,
  GenerationSettings,
} from '@/lib/utils/normalize-resume'

export interface SaveResumeData {
  job_title: string
  job_description: string
  mode: 'strict' | 'free'
  generated_data: GeneratedResumeData
  template_id: string
  generation_settings: GenerationSettings
}

/**
 * Fetches a specific resume by ID
 * @param supabase Supabase client instance
 * @param userId User ID
 * @param resumeId Resume ID to fetch
 * @returns Resume data or null if not found
 */
export async function fetchResumeById(
  supabase: SupabaseClient,
  userId: string,
  resumeId: string
) {
  return await supabase
    .from('resumes')
    .select('*')
    .eq('id', resumeId)
    .eq('user_id', userId)
    .maybeSingle()
}

/**
 * Saves a generated resume to the database
 * @param supabase Supabase client instance
 * @param userId User ID
 * @param data Resume data to save
 * @returns Saved resume with ID
 */
export async function saveResume(
  supabase: SupabaseClient,
  userId: string,
  data: SaveResumeData
) {
  return await supabase
    .from('resumes')
    .insert({
      user_id: userId,
      ...data
    })
    .select()
    .single()
}

/**
 * Updates fields on an existing resume (always scoped to the owner).
 */
export async function updateResume(
  supabase: SupabaseClient,
  userId: string,
  resumeId: string,
  updates: Partial<Pick<SaveResumeData, 'generated_data' | 'template_id' | 'job_title'>>
) {
  return await supabase
    .from('resumes')
    .update(updates)
    .eq('id', resumeId)
    .eq('user_id', userId)
    .select()
    .maybeSingle()
}

/**
 * Deletes a resume (always scoped to the owner).
 */
export async function deleteResume(
  supabase: SupabaseClient,
  userId: string,
  resumeId: string
) {
  return await supabase
    .from('resumes')
    .delete()
    .eq('id', resumeId)
    .eq('user_id', userId)
}
