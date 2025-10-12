import { ChatOpenAI } from "@langchain/openai"

export interface OpenRouterClientOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  streaming?: boolean
}

/**
 * Creates a LangChain ChatOpenAI client configured for OpenRouter API
 * @param options Configuration options for the OpenRouter client
 * @returns Configured ChatOpenAI instance
 */
export function createOpenRouterClient(options?: OpenRouterClientOptions) {
  const {
    model = 'openai/gpt-3.5-turbo',
    temperature = 0.7,
    maxTokens = 2000,
    streaming = false,
  } = options || {}

  return new ChatOpenAI({
    model,
    temperature,
    maxTokens,
    streaming,
    apiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
        'X-Title': 'Resume Builder',
      },
    },
  })
}
