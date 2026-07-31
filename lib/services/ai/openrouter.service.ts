import { ChatOpenAI } from "@langchain/openai"
import { parseJsonMarkdown, parsePartialJson } from "@langchain/core/output_parsers"

interface OpenRouterClientOptions {
  temperature?: number
  maxTokens?: number
}

/**
 * Creates a LangChain ChatOpenAI client configured for OpenRouter API
 * @param options Configuration options for the OpenRouter client
 * @returns Configured ChatOpenAI instance
 */
export function createOpenRouterClient(options?: OpenRouterClientOptions) {
  const { temperature = 0.7, maxTokens = 4000 } = options || {}

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  return new ChatOpenAI({
    model: process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4',
    temperature,
    maxTokens,
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

/**
 * Extracts and parses a JSON object from model output, tolerating markdown
 * code fences, truncated JSON, and prose before a bare object.
 */
/**
 * Best-effort parse of an in-flight (truncated) model response. Returns null
 * until the accumulated text contains at least a parseable JSON prefix.
 */
export function extractPartialJson(raw: string): unknown {
  const start = raw.indexOf('{')
  return start === -1 ? null : parsePartialJson(raw.slice(start))
}

export function extractJsonObject<T = unknown>(raw: string): T {
  // parseJsonMarkdown handles fenced/truncated JSON but not prose before a
  // bare "{" - the slice retry covers that case.
  const parsed: unknown =
    parseJsonMarkdown(raw) ?? parseJsonMarkdown(raw.slice(raw.indexOf('{')))
  if (parsed === null || parsed === undefined) {
    throw new Error('Model response did not contain valid JSON')
  }
  return parsed as T
}
