import '@testing-library/jest-dom'

type FormDataValue = string | Blob | File

// Mock FormData
global.FormData = jest.fn().mockImplementation(() => {
  const data = new Map<string, FormDataValue>()
  return {
    append: (key: string, value: FormDataValue) => data.set(key, value),
    get: (key: string) => data.get(key) || null,
    getAll: (key: string) => {
      const value = data.get(key)
      return value ? [value] : []
    },
    has: (key: string) => data.has(key),
    delete: (key: string) => data.delete(key),
    forEach: (callback: (value: FormDataValue, key: string) => void) => 
      data.forEach((value, key) => callback(value, key))
  }
}) as unknown as typeof FormData

// Mock File
global.File = jest.fn().mockImplementation((bits: Array<string | ArrayBuffer>, name: string, options?: { type?: string }) => {
  const content = bits[0]
  return {
    name,
    type: options?.type || '',
    size: typeof content === 'string' ? content.length : content instanceof ArrayBuffer ? content.byteLength : 0,
    lastModified: Date.now(),
    text: () => Promise.resolve(typeof content === 'string' ? content : ''),
    arrayBuffer: () => Promise.resolve(content instanceof ArrayBuffer ? content : new ArrayBuffer(0))
  }
}) as unknown as typeof File

// Mock Response
global.Response = jest.fn().mockImplementation((body?: BodyInit | null, init?: ResponseInit) => ({
  ok: init?.status ? init.status >= 200 && init.status < 300 : true,
  status: init?.status || 200,
  json: async () => typeof body === 'string' ? JSON.parse(body) : body,
  headers: new Headers(init?.headers)
})) as unknown as typeof Response

// Mock Next.js server components
jest.mock('next/server', () => {
  const NextResponse = {
    json: (data: unknown, init?: ResponseInit) => new Response(JSON.stringify(data), init)
  }

  const NextRequest = function(input: string | Request, init?: RequestInit) {
    return {
      ...new Request(input, init),
      nextUrl: new URL(input.toString(), 'http://localhost'),
      formData: () => Promise.resolve(new FormData())
    }
  }

  return {
    NextResponse,
    NextRequest
  }
})

// Mock TextEncoder/TextDecoder
global.TextEncoder = jest.fn(() => ({
  encode: jest.fn(text => new Uint8Array(Buffer.from(text)))
})) as unknown as typeof TextEncoder

global.TextDecoder = jest.fn(() => ({
  decode: jest.fn(buffer => Buffer.from(buffer).toString())
})) as unknown as typeof TextDecoder

// Mock Headers
global.Headers = jest.fn().mockImplementation(() => ({
  append: jest.fn(),
  delete: jest.fn(),
  get: jest.fn(),
  has: jest.fn(),
  set: jest.fn(),
  forEach: jest.fn()
})) as unknown as typeof Headers

// Mock Request
global.Request = jest.fn().mockImplementation((input: string | Request, init?: RequestInit) => ({
  url: input.toString(),
  method: init?.method || 'GET',
  headers: new Headers(init?.headers),
  formData: () => Promise.resolve(new FormData())
})) as unknown as typeof Request