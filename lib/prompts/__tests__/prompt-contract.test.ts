import { describe, expect, it } from '@jest/globals'
import { resumeGenerationPrompt } from '@/lib/prompts'
import { buildPromptVariables } from '@/lib/services/resume/resume-generator.service'

const params = {
  profile: null,
  skills: [{ category: 'Languages', skills: ['TypeScript'] }],
  workExperiences: [],
  education: [],
  projects: [],
  jobTitle: 'Senior Engineer',
  jobDescription: 'Build things well.',
  mode: 'strict' as const,
  generationSettings: {
    summary_format: 'bullets' as const,
    work_experience_format: 'bullets' as const,
    projects_format: 'paragraph' as const,
    highlight_important_content: true,
  },
}

describe('resume generation prompt contract', () => {
  // formatMessages throws if the service's variables and the template's
  // input variables ever drift apart - that's the actual contract under test.
  it('formats with the variables the service builds', async () => {
    const messages = await resumeGenerationPrompt.formatMessages(
      buildPromptVariables(params)
    )

    expect(messages).toHaveLength(2)
    const [system, user] = messages.map((m) => String(m.content))
    expect(system).toContain('Mode: STRICT')
    expect(system).toContain('HIGHLIGHTING RULES')
    expect(system).toContain('"summary": ["qualification 1"')
    expect(user).toContain('Languages: TypeScript')
    expect(user).toContain('Job Title: Senior Engineer')
    // Instructions live in the system message only.
    expect(user).not.toContain('HIGHLIGHT')
  })

  it('omits highlight rules when highlighting is off', async () => {
    const vars = buildPromptVariables({
      ...params,
      generationSettings: {
        ...params.generationSettings,
        highlight_important_content: false,
      },
    })
    const messages = await resumeGenerationPrompt.formatMessages(vars)
    expect(String(messages[0].content)).not.toContain('[HIGHLIGHT]')
  })
})
