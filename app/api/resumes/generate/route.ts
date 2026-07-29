import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateResume } from '@/lib/services/resume'
import { fetchUserProfileData } from '@/lib/repositories'
import { asJson, normalizeResumeData, normalizeSettings } from '@/lib/utils/normalize-resume'

export const runtime = 'nodejs'
// AI generation legitimately takes tens of seconds - don't let the default
// serverless timeout kill it mid-flight.
export const maxDuration = 300

interface GenerateRequestBody {
  job_title?: unknown
  job_description?: unknown
  mode?: unknown
  template?: unknown
  generation_settings?: unknown
  context_source?: unknown
  base_resume_id?: unknown
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as GenerateRequestBody

    // Validate inputs up front so failures are specific, not a generic 500.
    const job_title = typeof body.job_title === 'string' ? body.job_title.trim() : ''
    const job_description =
      typeof body.job_description === 'string' ? body.job_description.trim() : ''
    const mode = body.mode === 'free' ? 'free' : body.mode === 'strict' ? 'strict' : null
    const template = typeof body.template === 'string' && body.template ? body.template : 'classic'
    const context_source = body.context_source === 'resume' ? 'resume' : 'profile'
    const base_resume_id = typeof body.base_resume_id === 'string' ? body.base_resume_id : null

    if (!job_title) {
      return NextResponse.json({ error: 'Job title is required.' }, { status: 400 })
    }
    if (!job_description) {
      return NextResponse.json({ error: 'Job description is required.' }, { status: 400 })
    }
    if (!mode) {
      return NextResponse.json({ error: 'Generation mode must be strict or free.' }, { status: 400 })
    }
    if (context_source === 'resume' && !base_resume_id) {
      return NextResponse.json(
        { error: 'Select which existing resume to use as the starting point.' },
        { status: 400 }
      )
    }

    const generation_settings = normalizeSettings(body.generation_settings)

    let userData
    let resumeContext

    if (context_source === 'resume' && base_resume_id) {
      const { data: existingResume, error: resumeError } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', base_resume_id)
        .eq('user_id', user.id)
        .maybeSingle()

      if (resumeError || !existingResume) {
        return NextResponse.json({ error: 'The selected base resume was not found.' }, { status: 404 })
      }

      userData = {
        profile: null,
        skills: [],
        workExperiences: [],
        education: [],
        projects: []
      }

      resumeContext = {
        generated_data: normalizeResumeData(existingResume.generated_data)
      }
    } else {
      userData = await fetchUserProfileData(supabase, user.id)
      resumeContext = undefined
    }

    const rawResumeData = await generateResume({
      ...userData,
      jobTitle: job_title,
      jobDescription: job_description,
      mode,
      generationSettings: generation_settings,
      resumeContext
    })

    // Never store unvalidated model output - normalize to the exact shape
    // the templates render, so a missing key can't crash the viewer.
    const resumeData = normalizeResumeData(rawResumeData)
    if (!resumeData.contact.name && !resumeData.summary && resumeData.workExperience.length === 0) {
      return NextResponse.json(
        { error: 'The AI returned an unusable resume. Please try again.' },
        { status: 502 }
      )
    }

    const { data: resume, error } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        job_title,
        job_description,
        mode,
        generated_data: asJson(resumeData),
        template_id: template,
        generation_settings: asJson(generation_settings)
      })
      .select()
      .single()

    if (error || !resume) {
      console.error('Error saving resume:', error)
      return NextResponse.json(
        { error: 'The resume was generated but could not be saved. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ resumeId: resume.id })
  } catch (error) {
    console.error('Error generating resume:', error)
    const message =
      error instanceof Error && error.message === 'OPENROUTER_API_KEY is not configured'
        ? 'The AI service is not configured (missing API key).'
        : 'Resume generation failed. This is usually temporary - please try again.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
