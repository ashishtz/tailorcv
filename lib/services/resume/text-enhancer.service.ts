import { createOpenRouterClient } from '../ai/openrouter.service'
import {
  workExperienceEnhancementPrompt,
  projectDescriptionEnhancementPrompt
} from '@/lib/prompts'

export type EnhancementType = 'work_experience' | 'project'

/**
 * Enhances text using AI based on the specified type
 * @param text The text to enhance
 * @param type The type of enhancement (work_experience or project)
 * @returns Enhanced text
 */
export async function enhanceText(text: string, type: EnhancementType): Promise<string> {
  const prompt = type === 'work_experience'
    ? workExperienceEnhancementPrompt
    : projectDescriptionEnhancementPrompt

  const client = createOpenRouterClient({
    temperature: 0.7,
    maxTokens: 600
  })

  const response = await prompt.pipe(client).invoke({ text })

  // Same de-dashing guarantee as normalizeResumeData: this text lands in a
  // user-facing textarea and then on the resume.
  return response.text.trim().replace(/\s*[\u2013\u2014\u2015]\s*/g, ' - ')
}
