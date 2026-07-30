import { test, expect } from '@playwright/test'
import { seededResumeId, SEEDED_RESUME_TITLE } from './helpers/seed'

/**
 * A dead refresh token leaves the browser with no usable session, which is
 * what clearing the auth cookies reproduces. The app must send the user to
 * login with a next= path, never sit on a loading state.
 */
test.describe('expired session', () => {
  test('a client data fetch with no session redirects to login with next=', async ({ page }) => {
    await page.goto('/dashboard/profile')
    await expect(page.getByLabel(/first name/i)).toBeVisible({ timeout: 15_000 })

    await page.context().clearCookies()
    await page.getByRole('button', { name: /^save/i }).first().click()

    await expect(page).toHaveURL(/\/auth\/login\?next=%2Fdashboard%2Fprofile/, { timeout: 15_000 })
  })

  test('a resume page with no session redirects instead of loading forever', async ({ page }) => {
    const id = await seededResumeId(SEEDED_RESUME_TITLE)
    await page.goto(`/dashboard/documents/${id}`)
    await expect(page.locator('.resume-container')).toBeVisible({ timeout: 15_000 })

    await page.context().clearCookies()
    await page.reload()

    await expect(page).toHaveURL(/\/auth\/login\?next=/, { timeout: 15_000 })
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
  })

  test('login returns the user to where they were kicked out from', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/dashboard/documents')
    await expect(page).toHaveURL(/\/auth\/login\?next=%2Fdashboard%2Fdocuments/)
  })
})
