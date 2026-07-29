import { ChatOpenAI } from "@langchain/openai"

export interface OpenRouterClientOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  streaming?: boolean
}

const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4'

/**
 * Creates a LangChain ChatOpenAI client configured for OpenRouter API
 * @param options Configuration options for the OpenRouter client
 * @returns Configured ChatOpenAI instance
 */
export function createOpenRouterClient(options?: OpenRouterClientOptions) {
  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 4000,
    streaming = false,
  } = options || {}

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

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

/**
 * Coerces a LangChain message content value (string or content-part array)
 * into plain text.
 */
export function messageContentToText(content: unknown): string {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part
        if (part && typeof part === 'object' && 'text' in part) {
          const text = (part as { text?: unknown }).text
          return typeof text === 'string' ? text : ''
        }
        return ''
      })
      .join('')
  }
  return ''
}

/**
 * Extracts and parses a JSON object from model output, tolerating markdown
 * code fences and surrounding prose.
 */
export function extractJsonObject<T = unknown>(raw: string): T {
  const trimmed = raw.trim()

  // 1. Direct parse
  try {
    return JSON.parse(trimmed) as T
  } catch {
    // fall through
  }

  // 2. Fenced block (```json ... ``` or ``` ... ```)
  const fenceMatch = /```(?:json)?\s*([\s\S]*?)```/i.exec(trimmed)
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim()) as T
    } catch {
      // fall through
    }
  }

  // 3. First balanced top-level object
  const start = trimmed.indexOf('{')
  if (start !== -1) {
    let depth = 0
    let inString = false
    let escaped = false
    for (let i = start; i < trimmed.length; i++) {
      const ch = trimmed[i]
      if (escaped) {
        escaped = false
        continue
      }
      if (ch === '\\') {
        if (inString) escaped = true
        continue
      }
      if (ch === '"') {
        inString = !inString
        continue
      }
      if (inString) continue
      if (ch === '{') depth++
      else if (ch === '}') {
        depth--
        if (depth === 0) {
          const candidate = trimmed.slice(start, i + 1)
          try {
            return JSON.parse(candidate) as T
          } catch {
            break
          }
        }
      }
    }
  }

  throw new Error('Model response did not contain valid JSON')
}
