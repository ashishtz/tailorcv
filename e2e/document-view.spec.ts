import { test, expect } from '@playwright/test'
import { seededResumeId, SEEDED_RESUME_TITLE } from './helpers/seed'

test.describe('document view', () => {
  let id: string

  test.beforeAll(async () => {
    id = await seededResumeId(SEEDED_RESUME_TITLE)
  })

  test.beforeEach(async ({ page }) => {
    await page.goto(`/dashboard/documents/${id}`)
  })

  test('renders the resume sheet with toolbar actions', async ({ page }) => {
    await expect(page.getByRole('heading', { name: SEEDED_RESUME_TITLE })).toBeVisible()
    await expect(page.locator('.resume-container')).toBeVisible()
    await expect(page.getByRole('link', { name: /edit/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /preview/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /download pdf/i })).toBeVisible()
  })

  test('template select re-renders and persists across reload', async ({ page }) => {
    const select = page.getByLabel('Template')
    await select.selectOption('technical')
    await page.reload()
    await expect(page.getByLabel('Template')).toHaveValue('technical')
    // Restore for other specs.
    await page.getByLabel('Template').selectOption('classic')
  })

  test('preview opens the bare sheet in a new tab', async ({ page }) => {
    const popupPromise = page.waitForEvent('popup')
    await page.getByRole('link', { name: /^preview$/i }).click()
    const popup = await popupPromise
    await expect(popup).toHaveURL(new RegExp(`/preview/${id}`))
    await expect(popup.locator('.resume-container')).toBeVisible()
  })

  test('download PDF opens the preview in print mode', async ({ page }) => {
    const popupPromise = page.waitForEvent('popup')
    await page.getByRole('link', { name: /download pdf/i }).click()
    const popup = await popupPromise
    await expect(popup).toHaveURL(/print=1/)
  })

  test('toolbar stays visible after scrolling the sheet', async ({ page }) => {
    await page.mouse.wheel(0, 2000)
    await expect(page.getByRole('link', { name: /download pdf/i })).toBeVisible()
  })

  test('unknown id shows the not-found state', async ({ page }) => {
    await page.goto('/dashboard/documents/00000000-0000-0000-0000-000000000000')
    await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible()
  })
})
