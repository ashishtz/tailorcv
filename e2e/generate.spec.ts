import { test, expect } from '@playwright/test'
import { seededResumeId, SEEDED_RESUME_TITLE } from './helpers/seed'
import {
  mockGenerationStream,
  mockGenerationHang,
  mockGenerationError,
} from './helpers/mock-generation'

test.describe('resume generator (split-screen)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/documents/new')
  })

  test('renders form and sample preview side by side', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /generate a resume/i })).toBeVisible()
    await expect(page.getByLabel(/job title/i)).toBeVisible()
    await expect(page.getByLabel(/job description/i)).toBeVisible()
    await expect(page.getByText(/sample preview/i)).toBeVisible()
  })

  test('template picker switches the live preview', async ({ page }) => {
    await page.getByRole('radio', { name: /minimal/i }).click()
    await expect(page.getByText(/sample preview of the minimal template/i)).toBeVisible()
    await page.getByRole('radio', { name: /classic/i }).click()
    await expect(page.getByText(/sample preview of the classic template/i)).toBeVisible()
  })

  test('required fields block submission', async ({ page }) => {
    await page.getByRole('button', { name: /generate resume/i }).click()
    // Native validation keeps us on the page with an invalid field focused.
    await expect(page).toHaveURL(/\/dashboard\/documents\/new/)
    const jobTitle = page.getByLabel(/job title/i)
    await expect(jobTitle).toBeFocused()
  })

  test('streams partial content into the preview then navigates to the saved resume', async ({
    page,
  }) => {
    const id = await seededResumeId(SEEDED_RESUME_TITLE)
    await mockGenerationStream(page, id)

    await page.getByLabel(/job title/i).fill('Staff Engineer')
    await page.getByLabel(/job description/i).fill('Own the platform end to end.')
    await page.getByRole('button', { name: /generate resume/i }).click()

    await expect(page).toHaveURL(new RegExp(`/dashboard/documents/${id}`), { timeout: 15_000 })
  })

  test('mid-stream error returns to the form with a message', async ({ page }) => {
    await mockGenerationError(page, 'The AI returned an unusable resume. Please try again.')
    await page.getByLabel(/job title/i).fill('Staff Engineer')
    await page.getByLabel(/job description/i).fill('Own the platform.')
    await page.getByRole('button', { name: /generate resume/i }).click()

    await expect(page.getByRole('alert')).toContainText(/unusable resume/i)
    await expect(page.getByRole('button', { name: /generate resume/i })).toBeVisible()
  })

  test('cancel aborts an in-flight generation and restores the form', async ({ page }) => {
    await mockGenerationHang(page)
    await page.getByLabel(/job title/i).fill('Staff Engineer')
    await page.getByLabel(/job description/i).fill('Own the platform.')
    await page.getByRole('button', { name: /generate resume/i }).click()

    const cancel = page.getByRole('button', { name: /cancel generation/i })
    await expect(cancel).toBeVisible()
    await cancel.click()
    await expect(page.getByRole('button', { name: /generate resume/i })).toBeVisible()
    await expect(page.getByRole('alert')).toHaveCount(0)
  })
})
