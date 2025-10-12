import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Formats a date string into YYYY-MMM format (e.g., "2023-Oct")
 * @param dateString ISO date string or any valid date string
 * @returns Formatted date string in YYYY-MMM format, or empty string if invalid date
 */
export function formatResumeDate(dateString: string | null): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    
    const year = date.getFullYear()
    const month = date.toLocaleString('en', { month: 'short' })
    return `${year}-${month}`
  } catch {
    return ''
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}