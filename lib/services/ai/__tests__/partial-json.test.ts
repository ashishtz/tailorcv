import { describe, expect, it } from '@jest/globals'
import { extractPartialJson } from '@/lib/services/ai/openrouter.service'
import { normalizeResumeData } from '@/lib/utils/normalize-resume'

describe('streaming partial JSON', () => {
  it('turns a truncated model response into renderable resume data', () => {
    const truncated =
      '```json\n{"summary": "Senior dev", "workExperience": [{"company": "Acme", "posi'
    const normalized = normalizeResumeData(extractPartialJson(truncated))
    expect(normalized.summary).toBe('Senior dev')
    expect(normalized.workExperience[0].company).toBe('Acme')
    // Sections not yet streamed are safe empties, not crashes.
    expect(normalized.education).toEqual([])
  })

  it('returns null before any JSON arrives', () => {
    expect(extractPartialJson('Sure, here is the resume')).toBeNull()
  })
})
