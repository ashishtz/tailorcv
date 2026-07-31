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
  // ATS-friendly: Include actual bullet character (•) in text for parsing
  if (Array.isArray(content)) {
    return (
      <ul className="space-y-1 ml-0 list-none">
        {content.map((bullet, index) => (
          <li
            key={index}
            className="text-gray-700 leading-relaxed font-medium flex"
          >
            <span className="mr-2 shrink-0">•</span>
            <span>{parseHighlights(bullet.trim())}</span>
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
    // Split on any bullet marker (•, line-start - or *) or newline. A single
    // sentence with no markers yields one piece and falls through to the
    // paragraph branch - splitting on '.' would shred "Node.js" and decimals.
    const bullets = content
      .split(/•|(?:^|\n)\s*[-*]\s|\n/)
      .filter((bullet) => bullet.trim())

    if (bullets.length > 1) {
      return (
        // ATS-friendly: Include actual bullet character (•) in text for parsing
        <ul className="list-none space-y-1 ml-0">
          {bullets.map((bullet, index) => (
            <li
              key={index}
              className="text-gray-700 leading-relaxed font-medium flex"
            >
              <span className="mr-2 shrink-0">•</span>
              <span>{parseHighlights(bullet.trim().replace(/^[•\-\*]\s*/, ''))}</span>
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
