import { defineConfig, devices } from '@playwright/test'

// Local env (supabase keys) - optional so CI can inject env directly.
try {
  process.loadEnvFile('.env.local')
} catch {
  /* no .env.local - rely on process env */
}

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000'

export default defineConfig({
  testDir: './e2e',
  // Specs mutate per-user data; one worker keeps them deterministic.
  // ponytail: single worker, shard by user if the suite outgrows it
  workers: 1,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    // Seeds the demo user + demo data, then signs in once and saves the
    // session for every authenticated spec.
    { name: 'setup', testMatch: /global\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
