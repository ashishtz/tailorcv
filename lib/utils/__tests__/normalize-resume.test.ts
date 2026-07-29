import { describe, expect, it } from '@jest/globals'
import { normalizeResumeData } from '@/lib/utils/normalize-resume'

describe('normalizeResumeData (trust boundary)', () => {
  it('folds legacy flat skill arrays into a categorized bucket', () => {
    const data = normalizeResumeData({ skills: ['TypeScript', 'React'] })
    expect(data.skills).toEqual([{ category: 'Skills', skills: ['TypeScript', 'React'] }])
  })

  it('coerces junk model output into a fully-shaped, renderable object', () => {
    const data = normalizeResumeData({
      summary: 42,
      workExperience: [{ company: 'Acme' }, 'garbage'],
      contact: null,
    })
    expect(typeof data.summary === 'string' || Array.isArray(data.summary)).toBe(true)
    expect(data.contact.name).toBe('')
    expect(data.workExperience[0].company).toBe('Acme')
    expect(data.education).toEqual([])
    expect(data.projects).toEqual([])
  })
})
