import { test as setup, expect } from '@playwright/test'
import { DEMO_USER, ensureDemoUser } from './helpers/seed'

const AUTH_FILE = 'e2e/.auth/user.json'

/**
 * Runs once before every project that depends on it:
 * 1. Seeds the demo user + demo data (idempotent, service-role key).
 * 2. Signs in through the real login UI and saves the session, so specs
 *    start authenticated without repeating the login flow.
 */
setup('seed demo user and sign in', async ({ page }) => {
  await ensureDemoUser()

  await page.goto('/auth/login')
  await page.getByLabel(/email/i).fill(DEMO_USER.email)
  await page.getByLabel(/password/i).fill(DEMO_USER.password)
  await page.getByRole('button', { name: /sign in/i }).click()

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 })
  await page.context().storageState({ path: AUTH_FILE })
})
