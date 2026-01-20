'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Resume } from '@/lib/types/database'
import { ClassicTemplate } from '@/components/resume-templates/classic-template'
import { ModernTemplate } from '@/components/resume-templates/modern-template'
import { MinimalTemplate } from '@/components/resume-templates/minimal-template'
import { ProfessionalTemplate } from '@/components/resume-templates/professional-template'
import { CreativeTemplate } from '@/components/resume-templates/creative-template'
import { ExecutiveTemplate } from '@/components/resume-templates/executive-template'
import { JakeTemplate } from '@/components/resume-templates/jake-template'

const templates = [
  { id: 'classic', name: 'Classic', component: ClassicTemplate },
  { id: 'modern', name: 'Modern', component: ModernTemplate },
  { id: 'minimal', name: 'Minimal', component: MinimalTemplate },
  { id: 'professional', name: 'Professional', component: ProfessionalTemplate },
  { id: 'creative', name: 'Creative', component: CreativeTemplate },
  { id: 'executive', name: 'Executive', component: ExecutiveTemplate },
  { id: 'jake', name: 'Jake (LaTeX)', component: JakeTemplate },
]

export default function PreviewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const templateId = searchParams.get('template') || 'classic'
  const SelectedTemplate = templates.find(t => t.id === templateId)?.component || ClassicTemplate

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', params.id)
          .single()

        if (!error && data) {
          setResume(data)
        }
      } catch (error) {
        console.error('Error fetching resume:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResumeData()
  }, [params.id, supabase])

  if (loading) {
    return null
  }

  if (!resume) {
    return null
  }

  return (
    <div className="resume-container">
      <SelectedTemplate
        data={resume.generated_data}
        settings={resume.generation_settings}
      />
    </div>
  )
}