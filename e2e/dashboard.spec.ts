import { test, expect } from '@playwright/test'
import { DEMO_USER } from './helpers/seed'

test.describe('dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
  })

  test('shows the shell with user identity and main navigation', async ({ page }) => {
    await expect(page.getByText(DEMO_USER.email)).toBeVisible()
    const nav = page.getByRole('navigation', { name: 'Main' })
    for (const link of ['Dashboard', 'Documents', 'Profile']) {
      await expect(nav.getByRole('link', { name: new RegExp(link, 'i') })).toBeVisible()
    }
  })

  test('generate CTA leads to the split-screen generator', async ({ page }) => {
    await page.getByRole('link', { name: /generate resume/i }).first().click()
    await expect(page).toHaveURL(/\/dashboard\/documents\/new/)
  })

  test('sidebar navigation reaches documents and profile', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Main' })
    await nav.getByRole('link', { name: /documents/i }).click()
    await expect(page).toHaveURL(/\/dashboard\/documents/)
    await nav.getByRole('link', { name: /profile/i }).click()
    await expect(page).toHaveURL(/\/dashboard\/profile/)
  })

  test('sign out returns to a public page and locks the dashboard', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign out' }).click()
    await expect(page).toHaveURL(/\/(auth\/login)?$/, { timeout: 10_000 })
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/auth\/login/)
  })
})
