import { test, expect } from '@playwright/test'
import { seededResumeId, SEEDED_RESUME_TITLE } from './helpers/seed'

/**
 * Guards the structural a11y fixes so they can't silently regress.
 * Not a substitute for an axe scan - these are the specific invariants
 * the audit called out.
 */
test.describe('accessibility invariants', () => {
  test('skip link is the first tab stop and reaches main', async ({ page }) => {
    await page.goto('/dashboard')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: /skip to content/i })
    await expect(skip).toBeFocused()
    await expect(skip).toHaveAttribute('href', '#main')
    await expect(page.locator('#main')).toHaveCount(1)
  })

  test('no button is nested inside a link', async ({ page }) => {
    for (const path of ['/dashboard', '/dashboard/documents', '/dashboard/documents/new']) {
      await page.goto(path)
      expect(await page.locator('a button').count(), `nested button on ${path}`).toBe(0)
    }
  })

  test('interactive controls show a pointer cursor', async ({ page }) => {
    await page.goto('/dashboard/documents/new')
    await expect(page.getByLabel('Start from')).toBeVisible({ timeout: 15_000 })
    const cursors = await page.evaluate(() =>
      [...document.querySelectorAll('button:not(:disabled), select:not(:disabled)')].map(
        (el) => getComputedStyle(el).cursor
      )
    )
    expect(cursors.length).toBeGreaterThan(0)
    expect(cursors.every((c) => c === 'pointer')).toBe(true)
  })

  test('every form control has an accessible name', async ({ page }) => {
    await page.goto('/dashboard/documents/new')
    await expect(page.getByLabel('Start from')).toBeVisible({ timeout: 15_000 })
    const unnamed = await page.evaluate(() =>
      [...document.querySelectorAll('input, select, textarea')]
        .filter((el) => {
          const id = el.getAttribute('id')
          return !(
            el.getAttribute('aria-label') ||
            el.getAttribute('aria-labelledby') ||
            el.closest('label') ||
            (id && document.querySelector(`label[for="${id}"]`))
          )
        })
        .map((el) => el.outerHTML.slice(0, 80))
    )
    expect(unnamed).toEqual([])
  })

  test('required fields expose aria-required', async ({ page }) => {
    await page.goto('/dashboard/documents/new')
    await expect(page.getByLabel(/job title/i)).toHaveAttribute('aria-required', 'true')
    await expect(page.getByLabel(/job description/i)).toHaveAttribute('aria-required', 'true')
  })

  test('documents table exposes sort state and column scopes', async ({ page }) => {
    await page.goto('/dashboard/documents')
    const table = page.getByRole('table', { name: /resumes/i })
    await expect(table).toBeVisible()
    const scoped = await table.locator('th[scope="col"]').count()
    expect(scoped).toBeGreaterThan(0)
    const sortable = table.locator('th[aria-sort]')
    expect(await sortable.count()).toBeGreaterThan(0)
  })

  test('resume pages carry exactly one h1 and no horizontal overflow', async ({ page }) => {
    const id = await seededResumeId(SEEDED_RESUME_TITLE)
    for (const path of [`/dashboard/documents/${id}`, `/preview/${id}`]) {
      await page.goto(path)
      await expect(page.locator('.resume-container')).toBeVisible()
      expect(await page.locator('h1').count(), `h1 count on ${path}`).toBe(1)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      )
      expect(overflow, `overflow on ${path}`).toBeLessThanOrEqual(1)
    }
  })

  test('generation status is announced in a live region', async ({ page }) => {
    await page.goto('/dashboard/documents/new')
    await expect(page.getByLabel('Start from')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByRole('status').filter({ hasText: /sample preview/i })).toBeVisible()
    await expect(page.getByRole('region', { name: /resume preview/i })).toBeVisible()
  })

  test('mobile drawer traps focus and closes on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 800 })
    await page.goto('/dashboard')
    await page.getByRole('button', { name: /open navigation/i }).click()
    const drawer = page.getByRole('dialog', { name: /navigation/i })
    await expect(drawer).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(drawer).toBeHidden()
  })
})
