import { describe, expect, it } from '@jest/globals'
import { formatMonthYear } from '@/lib/utils'

describe('formatMonthYear', () => {
  it('formats date-only strings as "Mon YYYY"', () => {
    expect(formatMonthYear('2023-10-15')).toBe('Oct 2023')
    expect(formatMonthYear('2022-01-01')).toBe('Jan 2022')
    // "YYYY-MM" must parse as local time, not UTC midnight
    expect(formatMonthYear('2023-05')).toBe('May 2023')
  })

  it('returns empty string for missing or invalid input', () => {
    expect(formatMonthYear(null)).toBe('')
    expect(formatMonthYear(undefined)).toBe('')
    expect(formatMonthYear('')).toBe('')
    expect(formatMonthYear('invalid-date')).toBe('')
  })
})
