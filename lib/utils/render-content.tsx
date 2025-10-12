import { parseHighlights } from './highlight-parser'

/**
 * Renders formatted content with highlight parsing support
 * Handles both string and array formats, and parses [HIGHLIGHT] markers
 */
export const renderFormattedContent = (
  content: string | string[] | null | undefined,
  format: 'paragraph' | 'bullets' = 'paragraph'
) => {
  // Handle null or undefined content
  if (!content) {
    return null
  }

  // If content is already an array (from AI), render as bullets regardless of format
  if (Array.isArray(content)) {
    return (
      <ul className="list-item list-inside space-y-1 ml-0">
        {content.map((bullet, index) => (
          <li
            key={index}
            className="text-gray-700 leading-relaxed pl-4 relative font-medium"
          >
            {parseHighlights(bullet.trim())}
          </li>
        ))}
      </ul>
    )
  }

  // Handle string content
  if (typeof content !== 'string') {
    return null
  }

  // If format is bullets and content is string, try to parse it
  if (format === 'bullets') {
    let bullets: string[] = []

    if (content.includes('•')) {
      bullets = content.split('•').filter((bullet) => bullet.trim())
    } else if (content.includes('- ')) {
      bullets = content.split(/(?:^|\n)- /).filter((bullet) => bullet.trim())
    } else if (content.includes('* ')) {
      bullets = content.split(/(?:^|\n)\* /).filter((bullet) => bullet.trim())
    } else if (content.includes('\n')) {
      bullets = content.split('\n').filter((bullet) => bullet.trim())
    } else {
      bullets = content.split('.').filter((bullet) => bullet.trim())
    }

    if (bullets.length > 1) {
      return (
        <ul className="list-item list-inside space-y-1 ml-0">
          {bullets.map((bullet, index) => (
            <li
              key={index}
              className="text-gray-700 leading-relaxed pl-4 relative font-medium"
            >
              {parseHighlights(bullet.trim().replace(/^[•\-\*]\s*/, ''))}
            </li>
          ))}
        </ul>
      )
    }
  }

  // Default to paragraph format
  return (
    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
      {parseHighlights(content)}
    </p>
  )
}
