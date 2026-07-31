import { test, expect } from '@playwright/test'
import { DEMO_USER, seededResumeId, SEEDED_RESUME_TITLE } from './helpers/seed'

/**
 * When the refresh token is dead the app must route to login carrying the
 * destination, never leave a page loading forever.
 *
 * Scope note: the browser Supabase client keeps the session in memory, so
 * clearing cookies does not kill an already-mounted client. That case is what
 * SessionWatchdog handles, via the SIGNED_OUT event supabase emits when a
 * token refresh fails - which cannot be forced from here without waiting for a
 * real expiry. These tests cover the reachable paths: any navigation or reload
 * without a usable session, and the next= round trip back to the page the user
 * was kicked out of.
 */
test.describe('expired session', () => {
  test('protected pages redirect to login carrying the destination', async ({ page }) => {
    await page.context().clearCookies()

    for (const [path, expected] of [
      ['/dashboard/documents', '%2Fdashboard%2Fdocuments'],
      ['/dashboard/profile', '%2Fdashboard%2Fprofile'],
      ['/onboarding', '%2Fonboarding'],
    ] as const) {
      await page.goto(path)
      await expect(page).toHaveURL(new RegExp(`/auth/login\\?next=${expected}`))
    }
  })

  test('reloading a stuck resume page lands on login, not a spinner', async ({ page }) => {
    const id = await seededResumeId(SEEDED_RESUME_TITLE)
    await page.goto(`/dashboard/documents/${id}`)
    await expect(page.locator('.resume-container')).toBeVisible({ timeout: 15_000 })

    // What a user does when the page stops responding.
    await page.context().clearCookies()
    await page.reload()

    await expect(page).toHaveURL(/\/auth\/login\?next=/, { timeout: 15_000 })
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
    await expect(page.locator('.resume-container')).toHaveCount(0)
  })

  test('signing in returns the user to the page they were kicked out of', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/dashboard/documents')
    await expect(page).toHaveURL(/\/auth\/login\?next=%2Fdashboard%2Fdocuments/)

    await page.getByLabel(/email/i).fill(DEMO_USER.email)
    await page.getByLabel(/password/i).fill(DEMO_USER.password)
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page).toHaveURL(/\/dashboard\/documents$/, { timeout: 20_000 })
  })
})
