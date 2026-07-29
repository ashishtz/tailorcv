import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { enhanceText, type EnhancementType } from '@/lib/services/resume'

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_TEXT_LENGTH = 4000

export async function POST(request: NextRequest) {
  try {
    // This endpoint proxies a paid model - it must never accept anonymous calls.
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { text, type } = (await request.json()) as { text?: unknown; type?: unknown }

    if (typeof text !== 'string' || !text.trim() || typeof type !== 'string') {
      return NextResponse.json({ error: 'Text and type are required' }, { status: 400 })
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Text is too long (max ${MAX_TEXT_LENGTH} characters).` },
        { status: 400 }
      )
    }

    if (!['work_experience', 'project'].includes(type)) {
      return NextResponse.json({ error: 'Invalid enhancement type' }, { status: 400 })
    }

    const enhancedText = await enhanceText(text, type as EnhancementType)
    return NextResponse.json({ enhancedText })
  } catch (error) {
    console.error('Error enhancing text:', error)
    return NextResponse.json(
      { error: 'The AI service could not enhance this text right now. Please try again.' },
      { status: 500 }
    )
  }
}
