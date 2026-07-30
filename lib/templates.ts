import type { ComponentType } from 'react'
import type { Resume } from '@/lib/types/database'
import { ClassicTemplate } from '@/components/resume-templates/classic-template'
import { ModernTemplate } from '@/components/resume-templates/modern-template'
import { TechnicalTemplate } from '@/components/resume-templates/technical-template'
import { ExecutiveTemplate } from '@/components/resume-templates/executive-template'
import { AcademicTemplate } from '@/components/resume-templates/academic-template'
import { CompactTemplate } from '@/components/resume-templates/compact-template'

export interface TemplateProps {
  data: Resume['generated_data']
  settings?: Resume['generation_settings']
  /**
   * Heading element for the candidate name. Defaults to 'h1' (the sheet is
   * the page, e.g. /preview). Pages that embed the sheet under their own h1
   * pass 'h2' to keep the document outline valid.
   */
  nameTag?: 'h1' | 'h2'
}

export interface ResumeTemplateDef {
  id: string
  name: string
  description: string
  component: ComponentType<TemplateProps>
}

/** Single source of truth for every resume template in the app. */
export const RESUME_TEMPLATES: ResumeTemplateDef[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Reverse-chronological standard. The safest all-purpose choice.',
    component: ClassicTemplate,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Teal accent bar, tinted skill chips, skills above experience.',
    component: ModernTemplate,
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Monospaced metadata and ruled entries. Built for engineers.',
    component: TechnicalTemplate,
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Formal masthead, tinted summary, centred small-caps headings.',
    component: ExecutiveTemplate,
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Maroon scholarly setting with years in a left gutter.',
    component: AcademicTemplate,
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Tight one-page LaTeX-inspired layout that fits a lot.',
    component: CompactTemplate,
  },
]

export function getTemplateDef(id: string | null | undefined): ResumeTemplateDef {
  return RESUME_TEMPLATES.find((t) => t.id === id) ?? RESUME_TEMPLATES[0]
}

/* US Letter at 96dpi - the fixed canvas resumes are designed against. */
export const RESUME_PAGE_WIDTH_PX = 816
export const RESUME_PAGE_HEIGHT_PX = 1056
