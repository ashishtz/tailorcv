# E2E suite (Playwright)

## One-time setup

1. Install the browser binary (~150 MB, disk only):
   ```bash
   npm run e2e:install
   ```
2. Start the local Supabase stack and copy the service-role key:
   ```bash
   supabase start
   supabase status   # shows service_role key
   ```
3. Add to `.env.local` (never a production key):
   ```
   SUPABASE_SERVICE_ROLE_KEY=<service_role key from supabase status>
   ```

## Running

```bash
npm run e2e        # headless
npm run e2e:ui     # interactive UI mode
```

The Playwright `webServer` starts `npm run dev` automatically (or reuses one
already running on :3000).

## How it works

- `global.setup.ts` runs first: idempotently seeds the demo user
  (`demo@resume.test` / `demo-password-123!`), a completed profile, one work
  experience, and two resumes ("Demo Seed Resume" - read-only for specs,
  "Editor Playground" - the editor spec may mutate it). Then it signs in
  through the real login UI once and saves the session to `e2e/.auth/`.
- Every spec in the `chromium` project starts already authenticated via that
  storage state. Specs that need a signed-out browser opt out with
  `test.use({ storageState: { cookies: [], origins: [] } })`.
- AI generation is never called for real: `helpers/mock-generation.ts`
  intercepts `/api/resumes/generate` and replays the NDJSON streaming
  protocol (partials, error line, or a hang for the cancel test).
- Registration + onboarding run as a brand-new throwaway user per run
  (`onboarding.spec.ts`) since the demo user is seeded past onboarding.

## Adding a spec

Create `e2e/<area>.spec.ts`. Prefer role/label selectors
(`getByRole`, `getByLabel`) over CSS. Keep mutations reversible or target
the "Editor Playground" resume / throwaway rows so reruns stay green.
