import { createOpenRouterClient, extractJsonObject } from '../ai/openrouter.service'
import { resumeParsingPrompt } from '@/lib/prompts'

interface ParsedResumeData {
  contact: {
    name: string
    email: string
    phone: string
    location: string
    address?: string
  }
  summary: string
  skills: string[]
  workExperience: Array<{
    company: string
    position: string
    location: string
    type: string
    startDate: string
    endDate: string
    description: string
  }>
  education: Array<{
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
  }>
  projects: Array<{
    name: string
    role: string
    description: string
    link?: string
  }>
}

/**
 * Parses resume text and extracts structured data using AI
 * @param resumeText The raw resume text to parse
 * @returns Parsed resume data in structured format
 */
export async function parseResumeText(resumeText: string): Promise<ParsedResumeData> {
  const client = createOpenRouterClient({
    temperature: 0.1,
    // A long resume produces a large JSON payload - don't let the provider
    // default truncate it mid-object.
    maxTokens: 8000,
  })

  const response = await resumeParsingPrompt.pipe(client).invoke({
    resume_text: resumeText,
  })

  return extractJsonObject<ParsedResumeData>(response.text)
}
