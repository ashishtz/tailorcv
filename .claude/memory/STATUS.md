# Project Status — AI Resume Builder

> **Single source of truth for cross-session continuity.**
> Every Claude session MUST read this file (plus WORKLOG.md and DECISIONS.md) at start,
> and MUST update all three before finishing a work chunk. Keep entries detailed enough
> that a brand-new session can resume without any other context.

**Last updated:** 2026-07-29 (session 3)
**Working branch:** `claude/deps-ui-modernize-mkz7xm` (never push to main)

---

## 🎯 Current Objectives (from user, 2026-07-29)

1. **Dependency modernization** — bring every dependency to its latest version. Target: **0 dependency warnings** (no npm deprecation warnings, `npm audit` clean, `npm outdated` empty). Versions must be verified by web search / npm registry, not assumed.
2. **Frontend overhaul** — fix broken desktop UI, fix broken insert/update/delete features, then modernize the whole app with a brand-new design system, branding guidelines, and better UX.
3. Report back to user when 1+2 are done; more tasks will follow.

**Working agreements (user-mandated):**
- Commit + push small chunks as soon as they're done (branch above, never main).
- Maintain this memory system every session.
- Supabase CLI can run a local instance for DB-dependent testing.
- CLAUDE.md rules apply: no `any` types, lint/typecheck clean, prompts in `lib/prompts/`, OpenRouter only (never OpenAI direct), repository/service/route layering.

---

## ✅ Done

- **Memory system created** (this directory) and wired into CLAUDE.md. (2026-07-29)
- **Dependency modernization COMPLETE** (2026-07-29): every dependency at latest; verified matrix all green —
  `npm install`/`npm ci` fresh: **0 warnings, 0 deprecations** · `npm audit`: **0 vulnerabilities** · `npm outdated`: **empty** · lint ✓ · `tsc --noEmit` ✓ · jest 4/4 ✓ · `next build` ✓ (19 routes, Turbopack).
  Key moves: Tailwind v4 (CSS-first, official tool), Next 16.2.12 (`middleware.ts`→`proxy.ts`, `next lint`→eslint CLI, no `--turbopack` flag), React 19.2.8, LangChain 1.x, @supabase/ssr 0.12.4, jsPDF 4, html2canvas→**html2canvas-pro** (oklch support), lucide 1.27, ESLint 10 with **lean flat config** (@next/eslint-plugin-next + typescript-eslint + react-hooks v7 — replaced eslint-config-next, see D-002), TS = `npm:@typescript/typescript6@6.0.2` alias (see D-003), jest 30.4 + jsdom 30 override, jest.config.ts→.mjs (ts-node dropped), `typecheck` script added, removed `ignoreBuildErrors`, tsbuildinfo untracked. Overrides documented in D-004. React-compiler lint errors fixed properly (fetch/setState split, module-scope canvas painters, derived state).

- **Frontend audit COMPLETE** (2026-07-29): two exhaustive code audits + live browser walkthrough; findings in `FRONTEND_AUDIT.md`. Root cause of broken CRUD found: missing DB grants (42501 on every request) → fixed by migration.
- **UI modernization + bug-fix rebuild COMPLETE** (2026-07-29): entire app rebuilt on the Atelier design system (`DESIGN_SYSTEM.md`); every 🔴 BROKEN and major 🟠 BUG item in FRONTEND_AUDIT.md fixed. E2E-verified in the browser against local Supabase: registration → full onboarding (data verified row-by-row in psql) → profile CRUD → REAL AI generation via OpenRouter → template render → **PDF download**. Typed Supabase clients (`Database` generics) with boundary converters (`rowToResume`/`asJson`); legacy theme tokens fully removed. Final matrix: `tsc` ✓ `eslint` ✓ (0 errors 0 warnings) `jest` 4/4 ✓ `next build` 22 routes ✓ npm install/audit/outdated all clean ✓.

- **Ponytail audit + full cleanup COMPLETE** (2026-07-29, session 2): repo-wide over-engineering audit in `PONYTAIL_AUDIT.md` (root); all 30 findings fixed. **Net −3,183 lines**, deps removed: react-hook-form, react-select, @tanstack/react-table (+6 devDeps, 2 overrides). Docker/nginx/Make stack deleted; profile↔onboarding forms deduped into `components/forms/`; modal on native `<dialog>`; skills type narrowed to `CategorizedSkill[]`; `[object Object]` generator bug fixed. Full matrix green (tsc/eslint/jest/build/audit/outdated). Details in WORKLOG session 2 + PONYTAIL_AUDIT.md Resolution section.

## 🔄 In Progress

- Live-streaming generation shipped (2d) and moved to a split-screen page `/dashboard/documents/new` (2e; modal deleted). NOT yet E2E-verified against a real OpenRouter call — do a live run when env is available.

## 📋 Backlog (ordered)

1. (Deferred) Revisit TypeScript 7 + real `typescript` package when Next 16.3 stable ships `experimental.useTypeScriptCli` AND typescript-eslint supports TS7 peers.
2. (USER ACTION — SECURITY) Rotate the OpenRouter API key: it was committed in `.env.docker` (file now deleted, but the key remains in git history). PII in `supabase/backup` history is intentional per user — no scrub.
3. DONE session 3 — E2E covers all pages/flows (42 Playwright tests) + 9 unit tests.

## ⛔ Known Constraints / Gotchas

- **Client components must use `getSessionUser()` (lib/supabase/client.ts), never `auth.getUser()`** — local read vs network RTT. Server code (proxy, layouts, server pages, API routes) keeps `auth.getUser()` (verified). Landing page is static — don't add server-side auth reads to it.
- **Node 24+** (`.nvmrc` = v24.18.0, `engines` >=24, npm 11). npm 11 gates install scripts — new native deps may need `npm approve-scripts` (allowScripts block in package.json).
- Env: `.env.example` is empty. App needs `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENROUTER_API_KEY` (optional `OPENROUTER_MODEL`).
- No Docker/nginx deploy stack (removed session 2 as unused) — deploy is `next start` or a platform; recreate from git history if ever needed.
- `lib/types/database_types.ts` is regenerated by `supabase gen types` — don't hand-trim its unused helper generics.
- Remote exec environment: no `gh` CLI (use GitHub MCP tools), outbound HTTPS via proxy.

---

## 🗺️ App Map (for orientation)

- **Routes:** `/` (landing) · `/auth/login` · `/auth/register` · `/onboarding` (+ `/skills`, `/work-experience`, `/education`, `/projects`) · `/dashboard` · `/dashboard/documents` (+ `new`, `[id]`, `[id]/edit`) · `/dashboard/profile` (+ `import-resume`) · `/preview/[id]`
- **API:** `/api/parse-resume`, `/api/enhance-text`, `/api/resumes/generate`
- **Data layer:** `lib/repositories/` (user-profile, onboarding — incl. `importParsedResume`) → Supabase; `lib/services/` (ai/openrouter, resume parser/enhancer/generator); prompts in `lib/prompts/*.prompt.ts` (system msg = instructions, user msg = data; rule variants as exported constants; contract test guards variable drift); shared form pieces in `components/forms/`
- **DB:** Supabase; migrations in `supabase/migrations/` (profiles, skills, user_skills, work_experiences, education, projects, resumes, imported_resumes, skill categories, social links)
- **Templates:** `components/resume-templates/` — classic, modern, minimal, professional, jake (creative/executive deleted session 2: not ATS-friendly, contradicted the product pitch)
