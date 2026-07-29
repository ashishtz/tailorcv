import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseResumeText } from '@/lib/services/resume'

export const runtime = 'nodejs'
export const maxDuration = 120

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB of plain text is a very long resume

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('resume')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Accept text files even when the browser reports a generic MIME type.
    const isTxt =
      file.type === 'text/plain' ||
      (file.name.toLowerCase().endsWith('.txt') &&
        (file.type === '' || file.type === 'application/octet-stream'))
    if (!isTxt) {
      return NextResponse.json(
        { error: 'Currently only .txt files are supported.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 2MB.' },
        { status: 400 }
      )
    }

    const resumeText = await file.text()
    if (!resumeText.trim()) {
      return NextResponse.json({ error: 'The file appears to be empty.' }, { status: 400 })
    }

    const parsedData = await parseResumeText(resumeText)

    // Keep a copy of the raw import for reference/debugging.
    const importName = `Import ${new Date().toISOString().slice(0, 10)} - ${file.name}`
    const { error: insertError } = await supabase.from('imported_resumes').insert({
      user_id: user.id,
      name: importName,
      content: parsedData,
    })

    if (insertError) {
      console.error('Error storing parsed resume:', insertError)
      // The parse itself succeeded - return the data anyway so the client
      // can still apply it to the profile.
    }

    return NextResponse.json({ success: true, data: parsedData })
  } catch (error) {
    console.error('Resume parsing error:', error)
    return NextResponse.json(
      { error: 'We could not parse that resume. Check the file and try again.' },
      { status: 500 }
    )
  }
}
