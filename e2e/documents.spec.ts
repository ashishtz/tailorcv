import { test, expect } from '@playwright/test'
import { adminClient, seededResumeId, SEEDED_RESUME_TITLE } from './helpers/seed'

test.describe('documents list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/documents')
  })

  test('lists the seeded resume with view and edit actions', async ({ page }) => {
    const row = page.getByRole('row', { name: new RegExp(SEEDED_RESUME_TITLE) })
    await expect(row).toBeVisible()
    await expect(row.getByRole('link', { name: `View ${SEEDED_RESUME_TITLE}` })).toBeVisible()
    await expect(row.getByRole('link', { name: `Edit ${SEEDED_RESUME_TITLE}` })).toBeVisible()
  })

  test('search filters rows and clears back', async ({ page }) => {
    const search = page.getByLabel('Search resumes')
    await search.fill('zzz-no-such-resume')
    await expect(page.getByRole('row', { name: new RegExp(SEEDED_RESUME_TITLE) })).toHaveCount(0)
    await search.fill(SEEDED_RESUME_TITLE)
    await expect(page.getByRole('row', { name: new RegExp(SEEDED_RESUME_TITLE) })).toBeVisible()
  })

  test('view action opens the resume', async ({ page }) => {
    const id = await seededResumeId(SEEDED_RESUME_TITLE)
    await page.getByRole('link', { name: `View ${SEEDED_RESUME_TITLE}` }).click()
    await expect(page).toHaveURL(new RegExp(`/dashboard/documents/${id}`))
  })

  test('delete flow: confirm dialog removes a throwaway resume', async ({ page }) => {
    // Create a disposable row directly so the seeded ones stay intact.
    const admin = adminClient()
    const stableId = await seededResumeId(SEEDED_RESUME_TITLE)
    const { data: stable } = await admin.from('resumes').select('user_id, generated_data, generation_settings').eq('id', stableId).single()
    const title = `Delete Me ${Date.now()}`
    await admin.from('resumes').insert({
      user_id: stable!.user_id,
      job_title: title,
      job_description: 'throwaway',
      mode: 'strict',
      template_id: 'classic',
      generated_data: stable!.generated_data,
      generation_settings: stable!.generation_settings,
    })

    await page.reload()
    await page.getByRole('button', { name: `Delete ${title}` }).click()
    await page.getByRole('dialog').getByRole('button', { name: /delete/i }).click()
    await expect(page.getByRole('row', { name: new RegExp(title) })).toHaveCount(0, {
      timeout: 10_000,
    })
  })
})
