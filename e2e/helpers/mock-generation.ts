import type { Page } from '@playwright/test'
import { landingSampleResume } from '../../lib/data/landing-sample'

/**
 * Intercepts POST /api/resumes/generate and serves the NDJSON protocol the
 * client expects - two partial snapshots, then a final resumeId - without
 * touching OpenRouter or the DB.
 */
export async function mockGenerationStream(page: Page, resumeId: string) {
  await page.route('**/api/resumes/generate', async (route) => {
    const partial1 = {
      partial: { ...landingSampleResume, workExperience: [], projects: [], education: [] },
    }
    const partial2 = { partial: landingSampleResume }
    const done = { resumeId }
    await route.fulfill({
      status: 200,
      contentType: 'application/x-ndjson',
      body: [partial1, partial2, done].map((m) => JSON.stringify(m)).join('\n') + '\n',
    })
  })
}

/** Intercepts generation and never responds - lets specs exercise Cancel. */
export async function mockGenerationHang(page: Page) {
  await page.route('**/api/resumes/generate', () => {
    /* keep the request pending forever */
  })
}

/** Intercepts generation with a mid-stream error line. */
export async function mockGenerationError(page: Page, message: string) {
  await page.route('**/api/resumes/generate', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/x-ndjson',
      body: JSON.stringify({ error: message }) + '\n',
    })
  )
}
