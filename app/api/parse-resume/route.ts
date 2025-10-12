import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseResumeText } from '@/lib/services/resume'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('resume') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // File validation
    if (file.type !== 'text/plain') {
      return NextResponse.json(
        { error: 'Currently only TXT files are supported' },
        { status: 400 }
      )
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Parse resume
    const resumeText = await file.text()
    const parsedData = await parseResumeText(resumeText)

    // Generate a random name for the import
    const randomName = `Import_${new Date().toISOString().split('T')[0]}_${Math.random().toString(36).substring(2, 7)}`

    // Store parsed data in imported_resumes table
    const { error: insertError } = await supabase
      .from('imported_resumes')
      .insert({
        user_id: user.id,
        name: randomName,
        content: parsedData
      })

    if (insertError) {
      console.error('Error storing parsed resume:', insertError)
      return NextResponse.json(
        { error: 'Failed to store parsed resume' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Resume parsed and stored successfully'
    })
  } catch (error) {
    console.error('Resume parsing error:', error)
    return NextResponse.json({ error: 'Failed to parse resume' }, { status: 500 })
  }
}
