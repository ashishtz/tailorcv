'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import { RESUME_PAGE_WIDTH_PX } from '@/lib/templates'

/**
 * Zoom-to-fit for the fixed-width resume sheet: attach `ref` to the wrapper
 * that defines the available width and apply `zoom: scale` to the 816px sheet
 * inside it. Content then reflows instead of horizontally scrolling
 * (WCAG 1.4.10 Reflow).
 */
export function useFitScale(): { ref: RefObject<HTMLDivElement | null>; scale: number } {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      if (el.clientWidth > 0) setScale(el.clientWidth / RESUME_PAGE_WIDTH_PX)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, scale }
}
