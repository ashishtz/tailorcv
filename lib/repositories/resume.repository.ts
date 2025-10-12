import type { SupabaseClient } from '@supabase/supabase-js'

export interface SaveResumeData {
  job_title: string
  job_description: string
  mode: 'strict' | 'free'
  generated_data: unknown
  template_id: string
  generation_settings: {
    summary_format: 'paragraph' | 'bullets'
    work_experience_format: 'paragraph' | 'bullets'
    projects_format: 'paragraph' | 'bullets'
    highlight_important_content: boolean
  }
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
    .single()
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
