'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

/* ------------------------------------------------------------------ *
 * Draft types - plain form values only. No fake ids, user_id or
 * timestamps; rows get their real identity when the final save inserts
 * them. Months stay as <input type="month"> strings ("YYYY-MM") and are
 * converted to DATE-column values (monthInputToDate) only at save time.
 * ------------------------------------------------------------------ */

export const JOB_TYPES = ['Full-Time', 'Part-Time', 'Contract'] as const
export type JobType = (typeof JOB_TYPES)[number]

export const DEGREES = [
  'High School',
  'Associate',
  "Bachelor's",
  "Master's",
  'PhD',
  'Diploma',
  'Certificate',
  'Other',
] as const
export type Degree = (typeof DEGREES)[number]

export interface PersonalInfoDraft {
  first_name: string
  last_name: string
  email: string
  phone: string
  location: string
  linkedin_url: string
  github_url: string
  stackoverflow_url: string
}

export interface WorkExperienceDraft {
  company_name: string
  position_title: string
  location: string
  job_type: JobType | ''
  /** "YYYY-MM" month-input value */
  start_date: string
  /** "YYYY-MM" month-input value, '' when current or unknown */
  end_date: string
  is_current: boolean
  description: string
}

export interface EducationDraft {
  institution_name: string
  degree: Degree | ''
  field_of_study: string
  /** "YYYY-MM" month-input value */
  start_date: string
  /** "YYYY-MM" month-input value, '' while still enrolled */
  end_date: string
}

export interface ProjectDraft {
  project_name: string
  role_title: string
  description: string
  link: string
}

export interface SkillDraft {
  skillName: string
  categoryName: string
}

export interface OnboardingData {
  personalInfo: PersonalInfoDraft
  workExperiences: WorkExperienceDraft[]
  education: EducationDraft[]
  projects: ProjectDraft[]
  skills: SkillDraft[]
}

interface OnboardingContextValue {
  /** The current draft. Persisted to localStorage on every update. */
  data: OnboardingData
  /** False until the locally stored draft has been read once on mount. */
  hydrated: boolean
  updateData: (patch: Partial<OnboardingData>) => void
  /** Clears the draft from state and localStorage (used after the final save). */
  reset: () => void
}

const STORAGE_KEY = 'onboarding-draft-v1'

export function createEmptyOnboardingData(): OnboardingData {
  return {
    personalInfo: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      location: '',
      linkedin_url: '',
      github_url: '',
      stackoverflow_url: '',
    },
    workExperiences: [],
    education: [],
    projects: [],
    skills: [],
  }
}

/* ------------------------------------------------------------------ *
 * Draft sanitizing - localStorage content is untrusted; every field is
 * narrowed from unknown so a stale or hand-edited draft can never crash
 * the flow or smuggle wrong shapes into the save.
 * ------------------------------------------------------------------ */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const asString = (value: unknown): string => (typeof value === 'string' ? value : '')
const asBool = (value: unknown): boolean => value === true
const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])

function sanitizePersonalInfo(value: unknown): PersonalInfoDraft {
  const record = isRecord(value) ? value : {}
  return {
    first_name: asString(record.first_name),
    last_name: asString(record.last_name),
    email: asString(record.email),
    phone: asString(record.phone),
    location: asString(record.location),
    linkedin_url: asString(record.linkedin_url),
    github_url: asString(record.github_url),
    stackoverflow_url: asString(record.stackoverflow_url),
  }
}

function sanitizeWorkExperience(value: unknown): WorkExperienceDraft | null {
  if (!isRecord(value)) return null
  const jobType = asString(value.job_type)
  return {
    company_name: asString(value.company_name),
    position_title: asString(value.position_title),
    location: asString(value.location),
    job_type: (JOB_TYPES as readonly string[]).includes(jobType) ? (jobType as JobType) : '',
    start_date: asString(value.start_date),
    end_date: asString(value.end_date),
    is_current: asBool(value.is_current),
    description: asString(value.description),
  }
}

function sanitizeEducation(value: unknown): EducationDraft | null {
  if (!isRecord(value)) return null
  const degree = asString(value.degree)
  return {
    institution_name: asString(value.institution_name),
    degree: (DEGREES as readonly string[]).includes(degree) ? (degree as Degree) : '',
    field_of_study: asString(value.field_of_study),
    start_date: asString(value.start_date),
    end_date: asString(value.end_date),
  }
}

function sanitizeProject(value: unknown): ProjectDraft | null {
  if (!isRecord(value)) return null
  return {
    project_name: asString(value.project_name),
    role_title: asString(value.role_title),
    description: asString(value.description),
    link: asString(value.link),
  }
}

function sanitizeSkill(value: unknown): SkillDraft | null {
  if (!isRecord(value)) return null
  const skillName = asString(value.skillName)
  if (!skillName) return null
  return { skillName, categoryName: asString(value.categoryName) }
}

function sanitizeDraft(value: unknown): OnboardingData {
  const record = isRecord(value) ? value : {}
  return {
    personalInfo: sanitizePersonalInfo(record.personalInfo),
    workExperiences: asArray(record.workExperiences)
      .map(sanitizeWorkExperience)
      .filter((entry): entry is WorkExperienceDraft => entry !== null),
    education: asArray(record.education)
      .map(sanitizeEducation)
      .filter((entry): entry is EducationDraft => entry !== null),
    projects: asArray(record.projects)
      .map(sanitizeProject)
      .filter((entry): entry is ProjectDraft => entry !== null),
    skills: asArray(record.skills)
      .map(sanitizeSkill)
      .filter((entry): entry is SkillDraft => entry !== null),
  }
}

/** Async so hydration can use the effect-safe `.then(setState)` pattern. */
async function loadDraft(): Promise<OnboardingData | null> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return sanitizeDraft(JSON.parse(raw) as unknown)
  } catch {
    // Corrupt or unreadable draft - start fresh rather than crash the flow.
    return null
  }
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(createEmptyOnboardingData)
  const [hydrated, setHydrated] = useState(false)
  // reset() clears storage; this stops the persist effect from immediately
  // re-writing the cleared draft when the emptied state lands.
  const skipNextPersist = useRef(false)

  // Hydrate once on mount from the locally stored draft.
  useEffect(() => {
    let active = true
    loadDraft().then((draft) => {
      if (!active) return
      if (draft) setData(draft)
      setHydrated(true)
    })
    return () => {
      active = false
    }
  }, [])

  // Persist every update. Steps only render after hydration, so this can
  // never overwrite a stored draft with the initial empty state.
  useEffect(() => {
    if (!hydrated) return
    if (skipNextPersist.current) {
      skipNextPersist.current = false
      return
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // Storage may be full or blocked - the draft just won't survive a refresh.
    }
  }, [data, hydrated])

  const updateData = useCallback((patch: Partial<OnboardingData>) => {
    setData((previous) => ({ ...previous, ...patch }))
  }, [])

  const reset = useCallback(() => {
    skipNextPersist.current = true
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Nothing to clean up when storage is unavailable.
    }
    setData(createEmptyOnboardingData())
  }, [])

  const value = useMemo<OnboardingContextValue>(
    () => ({ data, hydrated, updateData, reset }),
    [data, hydrated, updateData, reset]
  )

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
