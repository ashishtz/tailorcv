import { test, expect } from '@playwright/test'
import { adminClient, seededResumeId, EDITOR_RESUME_TITLE } from './helpers/seed'

// This spec mutates the dedicated "Editor Playground" resume only.
test.describe('resume editor', () => {
  let id: string

  test.beforeAll(async () => {
    // Self-heal: a failed earlier run may have left the title renamed.
    await adminClient()
      .from('resumes')
      .update({ job_title: EDITOR_RESUME_TITLE })
      .like('job_title', `${EDITOR_RESUME_TITLE}%`)
    id = await seededResumeId(EDITOR_RESUME_TITLE)
  })

  test.beforeEach(async ({ page }) => {
    await page.goto(`/dashboard/documents/${id}/edit`)
    await expect(page.getByLabel(/job title/i)).toHaveValue(/./, { timeout: 15_000 })
  })

  test('saving navigates to the view page with the edited title', async ({ page }) => {
    const newTitle = `${EDITOR_RESUME_TITLE} v${Date.now() % 1000}`
    await page.getByLabel(/job title/i).fill(newTitle)
    await page.getByRole('button', { name: /save/i }).click()

    // Save persists then routes to the document view.
    await expect(page).toHaveURL(new RegExp(`/dashboard/documents/${id}$`), { timeout: 15_000 })
    await expect(page.getByRole('heading', { name: newTitle })).toBeVisible()

    // Restore the canonical title so reruns stay stable.
    await page.goto(`/dashboard/documents/${id}/edit`)
    await expect(page.getByLabel(/job title/i)).toHaveValue(/./, { timeout: 15_000 })
    await page.getByLabel(/job title/i).fill(EDITOR_RESUME_TITLE)
    await page.getByRole('button', { name: /save/i }).click()
    await expect(page.getByRole('heading', { name: EDITOR_RESUME_TITLE })).toBeVisible({
      timeout: 15_000,
    })
  })

  test('adds and removes a work experience entry', async ({ page }) => {
    const removeWork = page.getByRole('button', { name: /remove work entry/i })
    const before = await removeWork.count()
    // Scope to the Work experience card header (h2 sits one div deep in it).
    await page
      .getByRole('heading', { name: 'Work experience', exact: true })
      .locator('../..')
      .getByRole('button', { name: 'Add', exact: true })
      .click()
    await expect(removeWork).toHaveCount(before + 1)
    await removeWork.last().click()
    await expect(removeWork).toHaveCount(before)
  })

  test('back link returns to the document view', async ({ page }) => {
    await page.getByRole('link', { name: /back/i }).first().click()
    await expect(page).toHaveURL(new RegExp(`/dashboard/documents/${id}$`))
  })
})
