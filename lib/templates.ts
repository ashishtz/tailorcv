import type { ComponentType } from 'react'
import type { Resume } from '@/lib/types/database'
import { ClassicTemplate } from '@/components/resume-templates/classic-template'
import { ModernTemplate } from '@/components/resume-templates/modern-template'
import { MinimalTemplate } from '@/components/resume-templates/minimal-template'
import { ProfessionalTemplate } from '@/components/resume-templates/professional-template'
import { JakeTemplate } from '@/components/resume-templates/jake-template'

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
    description: 'Traditional single-column layout with clear section rules.',
    component: ClassicTemplate,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Colored header with a two-column skills sidebar.',
    component: ModernTemplate,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Centered heading, generous whitespace, quiet rules.',
    component: MinimalTemplate,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Two-column layout with an experience timeline.',
    component: ProfessionalTemplate,
  },
  {
    id: 'jake',
    name: 'Jake (LaTeX)',
    description: 'Compact academic style inspired by LaTeX resumes.',
    component: JakeTemplate,
  },
]

export function getTemplateDef(id: string | null | undefined): ResumeTemplateDef {
  return RESUME_TEMPLATES.find((t) => t.id === id) ?? RESUME_TEMPLATES[0]
}

/* US Letter at 96dpi - the fixed canvas resumes are designed against. */
export const RESUME_PAGE_WIDTH_PX = 816
export const RESUME_PAGE_HEIGHT_PX = 1056
