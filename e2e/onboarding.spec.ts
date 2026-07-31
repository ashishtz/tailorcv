import { test, expect } from '@playwright/test'

/**
 * Registration + onboarding walked as a brand-new user each run (the demo
 * user is seeded past onboarding, so this is the only place the flow runs).
 * Requires local auth with email confirmations disabled (supabase default).
 */
test.describe('registration and onboarding', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('register, complete every onboarding step, land on dashboard', async ({ page }) => {
    test.slow()
    const email = `e2e-${Date.now()}@resume.test`
    const password = 'e2e-password-123!'

    await page.goto('/auth/register')
    await page.getByLabel(/email/i).fill(email)
    await page.getByLabel(/^password/i).first().fill(password)
    // Confirm-password field, if the form has one.
    const confirm = page.getByLabel(/confirm/i)
    if (await confirm.isVisible().catch(() => false)) {
      await confirm.fill(password)
    }
    await page.getByRole('button', { name: /sign up|create|register/i }).click()

    // Fresh accounts route into onboarding.
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 20_000 })

    // Step 1: personal info
    await page.getByLabel(/first name/i).fill('Test')
    await page.getByLabel(/last name/i).fill('Runner')
    await page.getByRole('button', { name: /continue|next/i }).click()

    // Step 2: skills - add one via the suggest input, then continue.
    await expect(page).toHaveURL(/\/onboarding\/skills/, { timeout: 10_000 })
    const skillInput = page.getByRole('textbox').first()
    await skillInput.fill('TypeScript')
    await skillInput.press('Enter')
    await page.getByRole('button', { name: /continue|next/i }).click()

    // Step 3: work experience - skippable; add nothing.
    await expect(page).toHaveURL(/\/onboarding\/work-experience/, { timeout: 10_000 })
    await page.getByRole('button', { name: /continue|next|skip/i }).last().click()

    // Step 4: education
    await expect(page).toHaveURL(/\/onboarding\/education/, { timeout: 10_000 })
    await page.getByRole('button', { name: /continue|next|skip/i }).last().click()

    // Step 5: projects - finishing saves everything.
    await expect(page).toHaveURL(/\/onboarding\/projects/, { timeout: 10_000 })
    await page.getByRole('button', { name: /finish|complete|done/i }).last().click()

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 })
  })
})
