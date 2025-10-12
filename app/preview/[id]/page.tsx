'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Resume } from '@/lib/types/database'
import { ClassicTemplate } from '@/components/resume-templates/classic-template'

export default function PreviewPage() {
  const params = useParams()
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

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
      <ClassicTemplate
        data={resume.generated_data}
        settings={resume.generation_settings}
      />
    </div>
  )
}