import { test, expect } from '@playwright/test'
import { seededResumeId, SEEDED_RESUME_TITLE } from './helpers/seed'

const DASHES = /[–—―]/

/** House copy rule: no em/en dashes in anything a user can read. */
test.describe('user-visible copy', () => {
  test('no em dashes on any authenticated page', async ({ page }) => {
    const id = await seededResumeId(SEEDED_RESUME_TITLE)
    for (const path of [
      '/dashboard',
      '/dashboard/documents',
      '/dashboard/documents/new',
      '/dashboard/profile',
      `/dashboard/documents/${id}`,
      `/dashboard/documents/${id}/edit`,
      `/preview/${id}`,
      '/onboarding',
      '/onboarding/skills',
      '/onboarding/work-experience',
      '/onboarding/education',
      '/onboarding/projects',
    ]) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const text = (await page.locator('body').innerText()) ?? ''
      const offenders = text
        .split('\n')
        .filter((line) => DASHES.test(line))
        .slice(0, 5)
      expect(offenders, `dashes on ${path}`).toEqual([])
    }
  })

  test('no em dashes on public pages', async ({ page }) => {
    await page.context().clearCookies()
    for (const path of [
      '/',
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password',
    ]) {
      await page.goto(path)
      const text = (await page.locator('body').innerText()) ?? ''
      const offenders = text
        .split('\n')
        .filter((line) => DASHES.test(line))
        .slice(0, 5)
      expect(offenders, `dashes on ${path}`).toEqual([])
    }
  })
})
