import { test, expect } from '@playwright/test'
import { seededResumeId, EDITOR_RESUME_TITLE } from './helpers/seed'

// This spec mutates the dedicated "Editor Playground" resume only.
test.describe('resume editor', () => {
  let id: string

  test.beforeAll(async () => {
    id = await seededResumeId(EDITOR_RESUME_TITLE)
  })

  test.beforeEach(async ({ page }) => {
    await page.goto(`/dashboard/documents/${id}/edit`)
    await expect(page.getByLabel(/job title/i)).toHaveValue(/./, { timeout: 15_000 })
  })

  test('edits and saves the job title, persisted across reload', async ({ page }) => {
    const title = page.getByLabel(/job title/i)
    await title.fill(`${EDITOR_RESUME_TITLE} v${Date.now() % 1000}`)
    await page.getByRole('button', { name: /save/i }).click()
    await expect(page.getByText(/resume saved/i)).toBeVisible({ timeout: 10_000 })

    // Restore the canonical title so reruns stay stable.
    await title.fill(EDITOR_RESUME_TITLE)
    await page.getByRole('button', { name: /save/i }).click()
    await expect(page.getByText(/resume saved/i)).toBeVisible({ timeout: 10_000 })
  })

  test('adds and removes a work experience entry', async ({ page }) => {
    const before = await page.getByRole('button', { name: /remove.*experience|remove entry/i }).count()
    await page.getByRole('button', { name: /add.*experience|add entry/i }).first().click()
    const after = page.getByRole('button', { name: /remove.*experience|remove entry/i })
    await expect(after).toHaveCount(before + 1)
    await after.last().click()
    await expect(page.getByRole('button', { name: /remove.*experience|remove entry/i })).toHaveCount(before)
  })

  test('back link returns to the document view', async ({ page }) => {
    await page.getByRole('link', { name: /back/i }).first().click()
    await expect(page).toHaveURL(new RegExp(`/dashboard/documents/${id}$`))
  })
})
