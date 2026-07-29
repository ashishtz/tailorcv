import { createOpenRouterClient, messageContentToText } from '../ai/openrouter.service'
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

  return messageContentToText(response.content).trim()
}
