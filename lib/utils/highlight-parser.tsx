import React from 'react'

/**
 * Parses text containing [HIGHLIGHT]...[/HIGHLIGHT] markers and renders them with bold styling
 * @param text Text containing highlight markers
 * @returns React elements with highlights rendered as bold
 */
export function parseHighlights(text: string): React.ReactNode {
  if (!text || typeof text !== 'string') {
    return text
  }

  const parts: React.ReactNode[] = []
  let lastIndex = 0
  const regex = /\[HIGHLIGHT\](.*?)\[\/HIGHLIGHT\]/g
  let match

  while ((match = regex.exec(text)) !== null) {
    // Add text before the highlight
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    // Add the highlighted text with bold styling
    parts.push(
      <strong key={match.index} className="font-bold text-gray-900">
        {match[1]}
      </strong>
    )

    lastIndex = regex.lastIndex
  }

  // Add remaining text after the last highlight
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  // If no highlights found, return original text
  if (parts.length === 0) {
    return text
  }

  return <>{parts}</>
}

/**
 * Parses an array of strings containing highlight markers
 * @param items Array of strings
 * @returns Array of React nodes with parsed highlights
 */
export function parseHighlightsArray(items: string[]): React.ReactNode[] {
  return items.map((item, index) => (
    <React.Fragment key={index}>
      {parseHighlights(item)}
    </React.Fragment>
  ))
}
