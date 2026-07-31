import { test, expect } from '@playwright/test'
import { adminClient, DEMO_USER } from './helpers/seed'

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
    // "New resume" is the always-rendered header CTA; the literal
    // "Generate resume" button only exists in the no-resumes empty state.
    await page.getByRole('link', { name: 'New resume' }).click()
    await expect(page).toHaveURL(/\/dashboard\/documents\/new/)
  })

  test('sidebar navigation reaches documents and profile', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Main' })
    await nav.getByRole('link', { name: /documents/i }).click()
    await expect(page).toHaveURL(/\/dashboard\/documents/)
    await nav.getByRole('link', { name: /profile/i }).click()
    await expect(page).toHaveURL(/\/dashboard\/profile/)
  })

})

// Isolated + throwaway user: supabase signOut() revokes ALL of a user's
// sessions server-side, so signing out as the demo user would kill the shared
// storageState for every later spec regardless of browser context.
test.describe('sign out', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('sign out returns to a public page and locks the dashboard', async ({ page }) => {
    const email = `signout-${Date.now()}@resume.test`
    const password = 'signout-password-123!'
    const admin = adminClient()
    const { data: created, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    if (error || !created.user) {
      throw new Error(`Could not create throwaway user: ${error?.message}`)
    }
    // Completed profile so login lands on the dashboard shell (has Sign out).
    await admin.from('profiles').upsert({
      id: created.user.id,
      email,
      first_name: 'Signout',
      last_name: 'Test',
      onboarding_completed: true,
    })

    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill(email)
    await page.getByLabel(/password/i).fill(password)
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 })

    await page.getByRole('button', { name: 'Sign out' }).click()
    await expect(page).toHaveURL(/\/(auth\/login)?$/, { timeout: 10_000 })
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/auth\/login/)
  })
})
