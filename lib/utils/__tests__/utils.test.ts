import { formatResumeDate } from '@/lib/utils'

describe('formatResumeDate', () => {
  it('should format date string to YYYY-MMM format', () => {
    expect(formatResumeDate('2023-10-15')).toBe('2023-Oct')
    expect(formatResumeDate('2022-01-01')).toBe('2022-Jan')
    expect(formatResumeDate('2021-12-31')).toBe('2021-Dec')
  })

  it('should handle null input', () => {
    expect(formatResumeDate(null)).toBe('')
  })

  it('should handle invalid date strings', () => {
    expect(formatResumeDate('invalid-date')).toBe('')
    expect(formatResumeDate('')).toBe('')
  })

  it('should handle different date string formats', () => {
    expect(formatResumeDate('2023/10/15')).toBe('2023-Oct')
    expect(formatResumeDate('10/15/2023')).toBe('2023-Oct')
    expect(formatResumeDate('2023.10.15')).toBe('2023-Oct')
  })
})