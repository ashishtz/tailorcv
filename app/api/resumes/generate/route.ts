import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateResume } from '@/lib/services/resume'
import { fetchUserProfileData, fetchResumeById, saveResume } from '@/lib/repositories'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { job_title, job_description, mode, template, generation_settings, context_source, base_resume_id } =
      await request.json()

    let userData
    let resumeContext

    // Determine context source
    if (context_source === 'resume' && base_resume_id) {
      // Fetch existing resume data
      const { data: existingResume, error: resumeError } = await fetchResumeById(
        supabase,
        user.id,
        base_resume_id
      )

      if (resumeError || !existingResume) {
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
      }

      // Use empty user data since we're using resume context
      userData = {
        profile: null,
        skills: [],
        workExperiences: [],
        education: [],
        projects: []
      }

      resumeContext = {
        generated_data: existingResume.generated_data
      }
    } else {
      // Fetch user profile data (from scratch)
      userData = await fetchUserProfileData(supabase, user.id)
      resumeContext = undefined
    }

    // Generate resume
    const resumeData = await generateResume({
      ...userData,
      jobTitle: job_title,
      jobDescription: job_description,
      mode,
      generationSettings: generation_settings,
      resumeContext
    })

    // Save resume
    const { data: resume, error } = await saveResume(supabase, user.id, {
      job_title,
      job_description,
      mode,
      generated_data: resumeData,
      template_id: template,
      generation_settings
    })

    if (error) throw error

    return NextResponse.json({ resumeId: resume.id })
  } catch (error) {
    console.error('Error generating resume:', error)
    return NextResponse.json({ error: 'Failed to generate resume' }, { status: 500 })
  }
}
