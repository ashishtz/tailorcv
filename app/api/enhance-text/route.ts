import { NextRequest, NextResponse } from 'next/server'
import { enhanceText, type EnhancementType } from '@/lib/services/resume'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { text, type } = await request.json()

    if (!text || !type) {
      return NextResponse.json({ error: 'Text and type are required' }, { status: 400 })
    }

    if (!['work_experience', 'project'].includes(type)) {
      return NextResponse.json({ error: 'Invalid enhancement type' }, { status: 400 })
    }

    const enhancedText = await enhanceText(text, type as EnhancementType)
    return NextResponse.json({ enhancedText })
  } catch (error) {
    console.error('Error enhancing text:', error)
    return NextResponse.json({ error: 'Failed to enhance text' }, { status: 500 })
  }
}
