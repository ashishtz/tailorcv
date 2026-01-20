'use client'

import { ClassicTemplate } from '@/components/resume-templates/classic-template'
import { ModernTemplate } from '@/components/resume-templates/modern-template'
import { MinimalTemplate } from '@/components/resume-templates/minimal-template'
import { ProfessionalTemplate } from '@/components/resume-templates/professional-template'
import { CreativeTemplate } from '@/components/resume-templates/creative-template'
import { ExecutiveTemplate } from '@/components/resume-templates/executive-template'
import { JakeTemplate } from '@/components/resume-templates/jake-template'
import { dummyResumeData } from '@/lib/data/dummy-resume'

interface TemplatePreviewProps {
  templateName: string
}

// Helper function to format date range
const formatDuration = (startDate: string, endDate: string | null, current: boolean) => {
  const start = new Date(startDate)
  const startStr = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

  if (current) {
    return `${startStr} - Present`
  }

  if (endDate) {
    const end = new Date(endDate)
    const endStr = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    return `${startStr} - ${endStr}`
  }

  return startStr
}

// Transform dummy data to match Resume generated_data structure
const transformedData = {
  contact: {
    name: dummyResumeData.personal_info.full_name,
    email: dummyResumeData.personal_info.email,
    phone: dummyResumeData.personal_info.phone,
    location: dummyResumeData.personal_info.location,
    address: dummyResumeData.personal_info.location
  },
  summary: dummyResumeData.summary,
  skills: dummyResumeData.skills.technical,
  workExperience: dummyResumeData.work_experience.map(exp => ({
    company: exp.company,
    position: exp.position,
    location: exp.location,
    type: 'Full-time',
    duration: formatDuration(exp.start_date, exp.end_date, exp.current),
    description: exp.description
  })),
  education: dummyResumeData.education.map(edu => ({
    institution: edu.institution,
    degree: edu.degree,
    field: edu.field_of_study,
    duration: edu.graduation_date
  })),
  projects: dummyResumeData.projects.map(proj => ({
    name: proj.name,
    role: proj.technologies.join(', '),
    description: proj.highlights,
    link: proj.link
  }))
}

const defaultSettings = {
  summary_format: 'paragraph' as const,
  work_experience_format: 'bullets' as const,
  education_format: 'bullets' as const,
  projects_format: 'bullets' as const,
  highlight_important_content: false
}

export function TemplatePreview({ templateName }: TemplatePreviewProps) {
  const renderTemplate = () => {
    switch (templateName) {
      case 'Classic':
        return <ClassicTemplate data={transformedData} settings={defaultSettings} />
      case 'Modern':
        return <ModernTemplate data={transformedData} settings={defaultSettings} />
      case 'Minimal':
        return <MinimalTemplate data={transformedData} settings={defaultSettings} />
      case 'Professional':
        return <ProfessionalTemplate data={transformedData} settings={defaultSettings} />
      case 'Creative':
        return <CreativeTemplate data={transformedData} settings={defaultSettings} />
      case 'Executive':
        return <ExecutiveTemplate data={transformedData} settings={defaultSettings} />
      case 'Jake (LaTeX)':
        return <JakeTemplate data={transformedData} settings={defaultSettings} />
      default:
        return <ClassicTemplate data={transformedData} settings={defaultSettings} />
    }
  }

  return (
    <div
      className="w-full h-full overflow-hidden rounded-lg bg-white shadow-inner"
      style={{
        transform: 'scale(0.18)',
        transformOrigin: 'top left',
        width: '556%', // 100% / 0.18 to compensate for scale
        height: '556%' // 100% / 0.18 to compensate for scale
      }}
    >
      {renderTemplate()}
    </div>
  )
}
