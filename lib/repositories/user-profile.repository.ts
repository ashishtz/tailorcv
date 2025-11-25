import type { SupabaseClient } from '@supabase/supabase-js'
import type { Profile, WorkExperience, Education, Project, CategorizedSkill } from '@/lib/types/database'

export interface UserProfileData {
  profile: Profile | null
  skills: CategorizedSkill[]
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
      supabase
        .from('user_skills')
        .select('*, skills(*), skill_categories(*)')
        .eq('user_id', userId),
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

  // Group skills by category
  const categorizedSkills: CategorizedSkill[] = []
  const categoryMap = new Map<string, string[]>()

  skillsResult.data?.forEach(userSkill => {
    const skillName = (userSkill.skills as { name: string })?.name
    const categoryName = (userSkill.skill_categories as { name: string } | null)?.name || 'Uncategorized'

    if (skillName) {
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, [])
      }
      categoryMap.get(categoryName)?.push(skillName)
    }
  })

  categoryMap.forEach((skills, category) => {
    categorizedSkills.push({ category, skills })
  })

  return {
    profile: profileResult.data,
    skills: categorizedSkills,
    workExperiences: experiencesResult.data || [],
    education: educationResult.data || [],
    projects: projectsResult.data || []
  }
}
