import { describe, expect, it, jest } from '@jest/globals'
import type { GeneratedResumeData } from '@/lib/utils/normalize-resume'

// Replace only the client factory: the fake model streams a canned JSON
// resume char-by-char, exercising the real prompt -> stream -> partial-parse
// -> normalize pipeline end to end without a network call.
jest.mock('@/lib/services/ai/openrouter.service', () => {
  const actual = jest.requireActual('@/lib/services/ai/openrouter.service') as object
  const { FakeListChatModel } = jest.requireActual(
    '@langchain/core/utils/testing'
  ) as typeof import('@langchain/core/utils/testing')
  const response = JSON.stringify({
    summary: 'Senior engineer',
    contact: { name: 'Ada Lovelace', email: 'ada@example.com' },
    skills: [{ category: 'Languages', skills: ['TypeScript'] }],
    workExperience: [],
    education: [],
    projects: [],
  })
  return {
    ...actual,
    createOpenRouterClient: () => new FakeListChatModel({ responses: [response] }),
  }
})

describe('streamResume', () => {
  it('yields renderable snapshots and returns the final parsed object', async () => {
    // Dynamic import so the mock above is registered before the service
    // (and its openrouter import) is evaluated.
    const { streamResume } = await import('@/lib/services/resume/resume-generator.service')
    const generation = streamResume({
      profile: null,
      skills: [],
      workExperiences: [],
      education: [],
      projects: [],
      jobTitle: 'Engineer',
      jobDescription: 'Build.',
      mode: 'strict',
      generationSettings: {
        summary_format: 'paragraph',
        work_experience_format: 'bullets',
        projects_format: 'bullets',
        highlight_important_content: false,
      },
    })

    const snapshots: GeneratedResumeData[] = []
    let step = await generation.next()
    while (!step.done) {
      snapshots.push(step.value)
      step = await generation.next()
    }

    // Every snapshot is fully shaped (normalize guarantees), so any of them
    // can be handed to a template mid-stream.
    expect(snapshots.length).toBeGreaterThan(0)
    expect(snapshots[0].contact).toBeDefined()
    expect(snapshots[0].education).toEqual([])

    const final = step.value as { summary: string; contact: { name: string } }
    expect(final.summary).toBe('Senior engineer')
    expect(final.contact.name).toBe('Ada Lovelace')
  })
})
