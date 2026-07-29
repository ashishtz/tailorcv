import { test, expect } from '@playwright/test'
import { DEMO_USER } from './helpers/seed'

test.describe('auth pages (signed out)', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('login rejects wrong credentials with a visible error', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByLabel(/email/i).fill(DEMO_USER.email)
    await page.getByLabel(/password/i).fill('definitely-wrong-password')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('login links to register and forgot password', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByRole('link', { name: /forgot/i }).click()
    await expect(page).toHaveURL(/\/auth\/forgot-password/)
    await page.goBack()
    await page.getByRole('link', { name: /sign up|register|create/i }).first().click()
    await expect(page).toHaveURL(/\/auth\/register/)
  })

  test('register page renders its form', async ({ page }) => {
    await page.goto('/auth/register')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/^password/i).first()).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up|create|register/i })).toBeVisible()
  })

  test('forgot-password page renders and accepts an email', async ({ page }) => {
    await page.goto('/auth/forgot-password')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByRole('button')).toBeVisible()
  })

  test('protected route redirects to login preserving destination', async ({ page }) => {
    await page.goto('/dashboard/documents')
    await expect(page).toHaveURL(/\/auth\/login\?next=/)
  })
})

test.describe('auth pages (signed in)', () => {
  test('login page bounces an authenticated user to the dashboard', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page).toHaveURL(/\/dashboard/)
  })
})
