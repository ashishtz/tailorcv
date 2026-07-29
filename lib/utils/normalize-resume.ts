import type { Resume, CategorizedSkill } from '@/lib/types/database'
import type { Database, Json } from '@/lib/types/database_types'

export type GeneratedResumeData = Resume['generated_data']
export type GenerationSettings = NonNullable<Resume['generation_settings']>

type ResumeRow = Database['public']['Tables']['resumes']['Row']

/**
 * Marks a JSON-serializable domain value for a Json column write. Our domain
 * interfaces have no index signatures, so they aren't assignable to Json even
 * though their runtime values are plain JSON - this cast is the single,
 * documented bridge.
 */
export function asJson(value: GeneratedResumeData | GenerationSettings | object): Json {
  return value as unknown as Json
}

/** Converts a raw resumes row into the app's Resume domain type, narrowing
 * every Json column through the normalizers. */
export function rowToResume(row: ResumeRow): Resume {
  return {
    id: row.id,
    user_id: row.user_id,
    job_title: row.job_title,
    job_description: row.job_description,
    mode: row.mode === 'free' ? 'free' : 'strict',
    template_id: row.template_id,
    generation_settings: normalizeSettings(row.generation_settings),
    generated_data: normalizeResumeData(row.generated_data),
    created_at: row.created_at,
  }
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

const asString = (v: unknown, fallback = ''): string =>
  typeof v === 'string' ? v : typeof v === 'number' ? String(v) : fallback

const asContent = (v: unknown): string | string[] => {
  if (typeof v === 'string') return v
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string')
  return ''
}

function normalizeSkills(raw: unknown): GeneratedResumeData['skills'] {
  if (!Array.isArray(raw)) return []
  if (raw.every((s) => typeof s === 'string')) return raw as string[]

  const categorized: CategorizedSkill[] = []
  for (const item of raw) {
    if (typeof item === 'string') {
      // Mixed array: fold stray strings into an "Other" bucket
      const other = categorized.find((c) => c.category === 'Other')
      if (other) other.skills.push(item)
      else categorized.push({ category: 'Other', skills: [item] })
    } else if (isRecord(item)) {
      const category = asString(item.category, 'Other')
      const skills = Array.isArray(item.skills)
        ? item.skills.filter((s): s is string => typeof s === 'string')
        : []
      if (skills.length > 0) categorized.push({ category, skills })
    }
  }
  return categorized
}

/**
 * Coerces arbitrary JSON (AI output, hand-edited rows, legacy rows) into the
 * exact shape templates render. Every section is guaranteed present; every
 * field is guaranteed the right primitive type. Templates must ONLY receive
 * data that went through this function.
 */
export function normalizeResumeData(raw: unknown): GeneratedResumeData {
  const root = isRecord(raw) ? raw : {}
  const contact = isRecord(root.contact) ? root.contact : {}
  const socialLinksRaw = isRecord(contact.socialLinks) ? contact.socialLinks : {}

  const socialLinks = {
    linkedin: asString(socialLinksRaw.linkedin) || undefined,
    github: asString(socialLinksRaw.github) || undefined,
    stackoverflow: asString(socialLinksRaw.stackoverflow) || undefined,
  }
  const hasSocial = socialLinks.linkedin || socialLinks.github || socialLinks.stackoverflow

  return {
    contact: {
      name: asString(contact.name),
      email: asString(contact.email),
      phone: asString(contact.phone),
      location: asString(contact.location),
      address: asString(contact.address) || undefined,
      socialLinks: hasSocial ? socialLinks : undefined,
    },
    summary: root.summary !== undefined ? asContent(root.summary) : undefined,
    skills: normalizeSkills(root.skills),
    workExperience: (Array.isArray(root.workExperience) ? root.workExperience : [])
      .filter(isRecord)
      .map((w) => ({
        company: asString(w.company),
        position: asString(w.position),
        location: asString(w.location),
        type: asString(w.type),
        duration: asString(w.duration),
        description: asContent(w.description),
      })),
    education: (Array.isArray(root.education) ? root.education : [])
      .filter(isRecord)
      .map((e) => ({
        institution: asString(e.institution),
        degree: asString(e.degree),
        field: asString(e.field),
        duration: asString(e.duration),
      })),
    projects: (Array.isArray(root.projects) ? root.projects : [])
      .filter(isRecord)
      .map((p) => ({
        name: asString(p.name),
        role: asString(p.role),
        description: asContent(p.description),
        link: asString(p.link) || undefined,
      })),
  }
}

const FORMAT_VALUES = new Set(['paragraph', 'bullets'])

/** Normalizes generation settings with sensible defaults for legacy rows. */
export function normalizeSettings(raw: unknown): GenerationSettings {
  const root = isRecord(raw) ? raw : {}
  const fmt = (v: unknown): 'paragraph' | 'bullets' =>
    typeof v === 'string' && FORMAT_VALUES.has(v) ? (v as 'paragraph' | 'bullets') : 'paragraph'
  return {
    summary_format: fmt(root.summary_format),
    work_experience_format: fmt(root.work_experience_format ?? 'bullets'),
    projects_format: fmt(root.projects_format ?? 'bullets'),
    highlight_important_content: Boolean(root.highlight_important_content),
  }
}
