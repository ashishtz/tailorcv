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
    // "Start from" only renders after the client-side resumes fetch - its
    // presence proves the page is hydrated, so clicks won't be swallowed.
    await expect(page.getByLabel('Start from')).toBeVisible({ timeout: 15_000 })
  })

  test('auto-collapses the sidebar, expandable again', async ({ page }) => {
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeHidden()
    await page.getByRole('button', { name: 'Expand sidebar' }).click()
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible()
    await page.getByRole('button', { name: 'Collapse sidebar' }).click()
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeHidden()
  })

  test('form and preview scroll independently, page itself does not', async ({ page }) => {
    const metrics = await page.evaluate(() => {
      const doc = document.documentElement
      const form = document.querySelector('form')!
      const preview = document.querySelector('section[aria-label="Resume preview"]')!
      return {
        page: doc.scrollHeight - doc.clientHeight,
        formScrollable: form.scrollHeight - form.clientHeight,
        // offsetWidth - clientWidth is the visible scrollbar (the form's own
        // 1px borders account for 2px there).
        formScrollbar: (form as HTMLElement).offsetWidth - form.clientWidth - 2,
        previewScrollbar: (preview as HTMLElement).offsetWidth - preview.clientWidth,
        previewTabIndex: (preview as HTMLElement).tabIndex,
      }
    })
    expect(metrics.page).toBe(0)
    expect(metrics.formScrollable).toBeGreaterThan(0)
    expect(metrics.formScrollbar).toBeLessThanOrEqual(0)
    expect(metrics.previewScrollbar).toBe(0)
    // Hidden scrollbar still has to be reachable by keyboard.
    expect(metrics.previewTabIndex).toBe(0)
  })

  test('page has no horizontal overflow anywhere', async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })

  test('renders form and sample preview side by side', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /generate a resume/i })).toBeVisible()
    await expect(page.getByLabel(/job title/i)).toBeVisible()
    await expect(page.getByLabel(/job description/i)).toBeVisible()
    await expect(page.getByText(/sample preview/i)).toBeVisible()
  })

  test('template dropdown switches the live preview', async ({ page }) => {
    await page.getByLabel('Template').selectOption('technical')
    await expect(page.getByText(/sample preview of the technical template/i)).toBeVisible()
    await page.getByLabel('Template').selectOption('classic')
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

    // filter() dodges Next's empty route-announcer, which is also role=alert.
    await expect(page.getByRole('alert').filter({ hasText: /unusable resume/i })).toBeVisible()
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
    // Only Next's always-present route announcer may remain.
    await expect(page.getByRole('alert').filter({ hasText: /./ })).toHaveCount(0)
  })
})
