import { test, expect } from '@playwright/test'

// Landing is public - run signed out so auth buttons are deterministic.
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders hero and primary CTA', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Craft resumes')
    const cta = page.getByRole('link', { name: /start building/i })
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', '/auth/register')
  })

  test('header nav anchors scroll to their sections', async ({ page }) => {
    for (const [label, id] of [
      ['Features', 'features'],
      ['How it works', 'how-it-works'],
      ['Templates', 'templates'],
    ] as const) {
      // banner scopes to the header - the footer repeats the same links.
      await page.getByRole('banner').getByRole('link', { name: label, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`#${id}$`))
      await expect(page.locator(`#${id}`)).toBeInViewport()
    }
  })

  test('shows all five template thumbnails', async ({ page }) => {
    await page.locator('#templates').scrollIntoViewIfNeeded()
    for (const name of ['Classic', 'Modern', 'Minimal', 'Professional', 'Jake (LaTeX)']) {
      await expect(page.locator('#templates').getByText(name, { exact: true })).toBeVisible()
    }
  })

  test('signed-out header links to sign in and register', async ({ page }) => {
    await expect(page.getByRole('link', { name: /sign in/i }).first()).toBeVisible()
    await page.getByRole('link', { name: /get started/i }).first().click()
    await expect(page).toHaveURL(/\/auth\/register/)
  })

  test('bottom CTA navigates to register', async ({ page }) => {
    const cta = page.getByRole('link', { name: /create your account/i })
    await cta.scrollIntoViewIfNeeded()
    await cta.click()
    await expect(page).toHaveURL(/\/auth\/register/)
  })
})
