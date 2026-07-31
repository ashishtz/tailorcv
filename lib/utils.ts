import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses a date-only string ("YYYY-MM-DD" or "YYYY-MM") as LOCAL time.
 * `new Date("2023-05")` parses as UTC midnight, which renders as the previous
 * month in negative-offset timezones - always use this for date-only values.
 */
function parseDateOnly(dateString: string): Date | null {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(dateString.trim())
  if (!m) {
    const fallback = new Date(dateString)
    return isNaN(fallback.getTime()) ? null : fallback
  }
  const [, y, mo, d] = m
  const date = new Date(Number(y), Number(mo) - 1, d ? Number(d) : 1)
  return isNaN(date.getTime()) ? null : date
}

/** Formats a date-only string as "Mon YYYY" (e.g., "May 2023") for display. */
export function formatMonthYear(dateString: string | null | undefined): string {
  if (!dateString) return ''
  const date = parseDateOnly(dateString)
  if (!date) return ''
  return date.toLocaleString('en', { month: 'short', year: 'numeric' })
}

/** Converts an <input type="month"> value ("YYYY-MM") to a DATE-column-safe
 * value ("YYYY-MM-01"), and empty strings to null. */
export function monthInputToDate(value: string | null | undefined): string | null {
  if (!value) return null
  const m = /^(\d{4})-(\d{2})$/.exec(value.trim())
  if (m) return `${value}-01`
  return value
}

/** Converts a stored DATE ("YYYY-MM-DD") to an <input type="month"> value. */
export function dateToMonthInput(value: string | null | undefined): string {
  if (!value) return ''
  const m = /^(\d{4})-(\d{2})/.exec(value)
  return m ? `${m[1]}-${m[2]}` : ''
}
