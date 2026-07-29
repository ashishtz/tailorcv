import { test, expect } from '@playwright/test'
import { seededResumeId, SEEDED_RESUME_TITLE } from './helpers/seed'

test.describe('preview page', () => {
  test('renders the bare resume with a print button', async ({ page }) => {
    const id = await seededResumeId(SEEDED_RESUME_TITLE)
    await page.goto(`/preview/${id}`)
    await expect(page.locator('.resume-container')).toBeVisible()
    await expect(page.getByRole('button', { name: /print/i })).toBeVisible()
    await expect(page.getByText(`${SEEDED_RESUME_TITLE} — preview`)).toBeVisible()
  })

  test('template query param overrides the saved template', async ({ page }) => {
    const id = await seededResumeId(SEEDED_RESUME_TITLE)
    await page.goto(`/preview/${id}?template=minimal`)
    await expect(page.locator('.resume-container')).toBeVisible()
  })

  test('unknown id shows the not-available card', async ({ page }) => {
    await page.goto('/preview/00000000-0000-0000-0000-000000000000')
    await expect(page.getByText(/not available/i)).toBeVisible()
    await page.getByRole('link', { name: /go to documents/i }).click()
    await expect(page).toHaveURL(/\/dashboard\/documents/)
  })
})
