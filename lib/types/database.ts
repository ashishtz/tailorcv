export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  birthday: string | null
  location: string | null
  address_1: string | null
  address_2: string | null
  address_3: string | null
  postal_code: string | null
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  created_at: string
}

export interface SkillCategory {
  id: string
  name: string
  created_at: string
}

export interface UserSkill {
  user_id: string
  skill_id: string
  category_id: string | null
  skill?: Skill
  skill_category?: SkillCategory
}

export interface CategorizedSkill {
  category: string
  skills: string[]
}

export interface WorkExperience {
  id: string
  user_id: string
  company_name: string
  position_title: string
  location: string | null
  job_type: 'Part-Time' | 'Full-Time' | 'Contract' | null
  /** Date in ISO format, displayed as YYYY-MMM in resume */
  start_date: string
  /** Date in ISO format, displayed as YYYY-MMM in resume */
  end_date: string | null
  is_current: boolean
  description: string | null
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  user_id: string
  institution_name: string
  /** Date in ISO format, displayed as YYYY-MMM in resume */
  start_date: string
  /** Date in ISO format, displayed as YYYY-MMM in resume */
  end_date: string | null
  degree: "Bachelor's" | "Master's" | null
  field_of_study: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  project_name: string
  role_title: string | null
  description: string | null
  link: string | null
  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  user_id: string
  job_title: string
  job_description: string
  mode: 'strict' | 'free'
  template_id: string
  generation_settings?: {
    summary_format: 'paragraph' | 'bullets'
    work_experience_format: 'paragraph' | 'bullets'
    projects_format: 'paragraph' | 'bullets'
    highlight_important_content: boolean
  }
  generated_data: {
    contact: {
      name: string
      email: string
      phone: string
      location: string
      address?: string
    }
    summary?: string | string[]
    skills: string[] | CategorizedSkill[]
    workExperience: Array<{
      company: string
      position: string
      location: string
      type: string
      duration: string
      description: string | string[]
    }>
    education: Array<{
      institution: string
      degree: string
      field: string
      duration: string
    }>
    projects: Array<{
      name: string
      role: string
      description: string | string[]
      link?: string
    }>
  }
  created_at: string
}