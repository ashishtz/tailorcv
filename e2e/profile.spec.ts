import { test, expect } from '@playwright/test'

test.describe('profile page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/profile')
  })

  test('shows all profile sections with seeded content', async ({ page }) => {
    await expect(page.getByText('Seed Corp')).toBeVisible({ timeout: 15_000 })
    for (const section of [/work experience/i, /education/i, /projects/i, /skills/i]) {
      await expect(page.getByText(section).first()).toBeVisible()
    }
  })

  test('adds then deletes an education entry (reversible)', async ({ page }) => {
    await page.getByRole('button', { name: 'Add education' }).first().click()
    await page.getByLabel(/institution/i).fill('E2E University')
    await page.getByLabel(/degree/i).first().selectOption({ index: 1 })
    await page.getByLabel(/field of study/i).fill('Testing')
    await page.getByLabel(/start/i).fill('2020-01')
    await page.getByLabel(/end/i).fill('2024-01')
    await page.getByRole('button', { name: 'Add education' }).last().click()

    await expect(page.getByText('E2E University')).toBeVisible({ timeout: 10_000 })

    await page.getByRole('button', { name: /delete.*e2e university/i }).click()
    const dialog = page.getByRole('dialog')
    if (await dialog.isVisible().catch(() => false)) {
      await dialog.getByRole('button', { name: /delete|remove|confirm/i }).click()
    }
    await expect(page.getByText('E2E University')).toHaveCount(0, { timeout: 10_000 })
  })

  test('edit flow opens prefilled form for the seeded experience', async ({ page }) => {
    await expect(page.getByText('Seed Corp')).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: /edit.*seed corp|edit.*software engineer/i }).click()
    await expect(page.getByLabel(/company/i)).toHaveValue('Seed Corp')
    await page.getByRole('button', { name: /cancel/i }).click()
  })
})
