import type { SupabaseClient } from '@supabase/supabase-js'
import type { Profile, WorkExperience, Education, Project } from '@/lib/types/database'

export interface UserProfileData {
  profile: Profile | null
  skills: string[]
  workExperiences: WorkExperience[]
  education: Education[]
  projects: Project[]
}

/**
 * Fetches complete user profile data including profile, skills, work experience, education, and projects
 * @param supabase Supabase client instance
 * @param userId User ID
 * @returns Complete user profile data
 */
export async function fetchUserProfileData(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProfileData> {
  const [profileResult, skillsResult, experiencesResult, educationResult, projectsResult] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('user_skills').select('*, skills(*)').eq('user_id', userId),
      supabase
        .from('work_experiences')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false }),
      supabase
        .from('education')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false }),
      supabase.from('projects').select('*').eq('user_id', userId)
    ])

  return {
    profile: profileResult.data,
    skills: skillsResult.data?.map(us => us.skills?.name).filter(Boolean) || [],
    workExperiences: experiencesResult.data || [],
    education: educationResult.data || [],
    projects: projectsResult.data || []
  }
}
