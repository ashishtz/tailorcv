import { describe, expect, it } from '@jest/globals'
import { normalizeResumeData } from '@/lib/utils/normalize-resume'

describe('normalizeResumeData (trust boundary)', () => {
  it('folds legacy flat skill arrays into a categorized bucket', () => {
    const data = normalizeResumeData({ skills: ['TypeScript', 'React'] })
    expect(data.skills).toEqual([{ category: 'Skills', skills: ['TypeScript', 'React'] }])
  })

  it('strips em and en dashes from model output', () => {
    const data = normalizeResumeData({
      summary: 'Engineer \u2014 ten years of experience',
      workExperience: [
        { company: 'Acme', duration: 'Mar 2021 \u2013 Present', description: ['Led a team \u2014 shipped fast'] },
      ],
    })
    expect(data.summary).toBe('Engineer - ten years of experience')
    expect(data.workExperience[0].duration).toBe('Mar 2021 - Present')
    expect(data.workExperience[0].description).toEqual(['Led a team - shipped fast'])
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
