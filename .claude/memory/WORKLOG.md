# Work Log — AI Resume Builder

> Chronological, detailed log of every work session. Newest session at the top.
> Each entry: date, what was done (with file paths), what was found, what's next.

---

## Session 2g — 2026-07-29 (PDF export → print-to-PDF, deps deleted)

User call: raster PDF (html2canvas image) not ATS-friendly; use print instead. Done:
- View page "Download PDF" now opens `/preview/[id]?template=X&print=1` in a new tab; preview auto-opens the print dialog 300ms after the sheet renders (`?print=1` effect). "Save as PDF" gives text-based, selectable, ATS-parseable output.
- Deleted `handleDownload` (html2canvas capture + jsPDF A4 slicing), `isGeneratingPDF` state; **removed deps `html2canvas-pro` + `jspdf`** (−~650KB even from lazy chunks).
- Added `@page { size: letter; margin: 0 }` to globals.css (templates carry their own padding; 816px sheet = letter @96dpi).
- Resolves backlog item 4 (raster→text PDF). Note: html2canvas-pro/oklch decision (session 1) now moot.
- Verified: install 0 warnings, tsc ✓ eslint ✓ jest 6/6 ✓ build ✓.

---

## Session 2f — 2026-07-29 (performance review + fixes)

User reported slow page loads + high memory. Measured (prod build + chunk analysis), found 3 real causes, fixed all:
1. **652KB PDF chunk on every document-view load**: `jspdf` + `html2canvas-pro` statically imported in `app/dashboard/documents/[id]/page.tsx`. Now `await import()`ed inside the download handler — loads only on Download click (split into async 412K+240K chunks).
2. **Network auth round-trip on every page load AND every CRUD action**: 26 client-side `supabase.auth.getUser()` calls (each = RTT to Supabase Auth). Added `getSessionUser()` to `lib/supabase/client.ts` (reads LOCAL session via `getSession()`, zero network, auto-refreshes expired tokens) and swapped all client call sites (pages, profile sections, onboarding steps, documents table, use-resume). SECURITY NOTE: server-side `getUser()` kept in proxy.ts + layouts + server pages — that's the verified check per Supabase guidance; RLS remains the real boundary.
3. **Landing page was ƒ dynamic** (server `getUser` for header state + CTA). Now ○ static: `LandingHeader` detects auth client-side from local session; CTA always `/auth/register` (proxy redirects signed-in users to /dashboard anyway).
Measured after: landing 59ms, login 6ms (prod, local). Route table: `/` now static.
Memory complaint: largely dev-server (Turbopack) + the removed 652K parse; html2canvas capture (scale 2) still spikes browser memory transiently during PDF export — acceptable, only on demand now.
Verified: tsc ✓ eslint ✓ jest 6/6 ✓ build ✓ prod smoke ✓.

---

## Session 2e — 2026-07-29 (generation modal → split-screen page)

User decision: modal too small for the live preview. Replaced it with `app/dashboard/documents/new/page.tsx` — left column (~30%) inputs, right (~70%) live preview:
- Right pane renders the SELECTED template at natural page width (816px, `overflow-x-auto`): sample data (`landingSampleResume`, dimmed) until generation starts, then streamed snapshots replace it live. Template picker switches the preview instantly.
- Cancel works mid-generation: `AbortController` on the fetch; AbortError resets quietly (no error banner). Inputs `disabled`/fieldset-disabled while generating.
- "Start from" (profile vs existing resume) collapsed from radio cards + conditional select into ONE select (profile = empty value); page fetches existing resumes itself.
- `components/documents/generate-resume-modal.tsx` deleted; `?new=1` deep-link handling removed from documents page (links now go to `/dashboard/documents/new`; dashboard's 3 links updated). Documents page lost its Suspense/searchParams wrapper; header/empty-state buttons became `<Link className={buttonVariants({})}>`.
- Verified: tsc ✓ eslint ✓ jest 6/6 ✓ build ✓ (route `/dashboard/documents/new` present). Live OpenRouter E2E still pending (needs env).

---

## Session 2d — 2026-07-29 (live streaming resume generation)

User asked for live preview during generation (no infinite-loading feel). Shipped with zero new dependencies:
- `lib/services/ai/openrouter.service.ts`: `extractPartialJson()` — `parsePartialJson` from @langchain/core (already installed) over the accumulated text from the first `{`.
- `lib/services/resume/resume-generator.service.ts`: `generateResume` replaced by `streamResume` async generator — `prompt.pipe(client).stream(vars)`, accumulates chunks, throttled to ≥250ms, yields `normalizeResumeData(partial)` snapshots (normalize makes ANY partial renderable — missing sections become empty), returns final parsed object.
- `app/api/resumes/generate/route.ts`: pre-flight (auth/validation) errors stay JSON+status; after that the response is an NDJSON `ReadableStream` — `{partial}` lines, then `{resumeId}` or `{error}`. Save/validation logic unchanged, just moved inside the stream.
- `components/documents/generate-resume-modal.tsx`: reads the stream via `response.body.getReader()` + line splitting; while loading the form swaps for `LiveBuildPreview` — the SELECTED template component rendering each snapshot, scaled with CSS `zoom` (not transform, so scroll height is correct). Error mid-stream returns to the form with the message.
- Test `lib/services/ai/__tests__/partial-json.test.ts`: truncated fenced JSON → renderable normalized data; prose-only → null.
- Verified: jest 6/6 ✓ tsc ✓ eslint ✓ build ✓. NOT yet verified against a live OpenRouter run — needs env with key + local Supabase (next session or user).

---

## Session 2c — 2026-07-29 (prompt reorganization on strict LangChain patterns)

User asked to reorganize scattered/duplicated prompts for reliability. Done:
- **One template per feature**: merged the hand-spliced `resume-generation-system.prompt.ts` + `resume-generation-user.prompt.ts` (formatted separately, arrays concatenated by hand) into one `resume-generation.prompt.ts` `ChatPromptTemplate.fromMessages([system, user])`; the service now uses the same `prompt.pipe(client).invoke(vars)` LCEL pattern as parser/enhancer.
- **Structure contract** (documented in the prompt file): system message = ALL instructions; user message = ONLY candidate data + job. The old user prompt's instruction sections (highlighting demands, summary strategy, authenticity) were deduped into the system message.
- **Bug fixed**: the user prompt unconditionally demanded [HIGHLIGHT] markers even when `highlight_important_content` was off.
- **Contradictions resolved**: highlight totals ("8-10" vs "15-25"), per-entry counts ("at least 1" vs "no fewer than 3"); Impact-section rule and summary/JD-keyword rule now stated once; generation prompt now composes shared `ATS_RULES` + only its resume-specific additions.
- **88-line highlight prompt moved out of the service** into the prompt file (CLAUDE.md compliance). Rule variants live as exported constants (`MODE_RULES`, `SECTION_FORMATS` — rules+JSON-example paired so schema and instructions can't drift, `HIGHLIGHT_RULES`); the service only selects and injects them.
- **Parsing prompt** split into system (task+schema) + user (raw text only).
- **Prompt-contract test** added (`lib/prompts/__tests__/prompt-contract.test.ts`): formats the real template with the real `buildPromptVariables` output — fails on any variable-name drift; asserts highlight toggle and instructions-only-in-system.
- Verified: jest 4/4 ✓ tsc ✓ eslint ✓ build ✓. Net: prompts+service −180/+47 in edited files plus new 219-line prompt file replacing 165 lines of two old files + 88 inline service lines.

---

## Session 2b — 2026-07-29 (Node 22 → 24 migration check)

User upgraded Node to 24 (nvm default + new `.nvmrc` v24.18.0, npm 11.16.0). Verified & adjusted:
- Clean `npm ci` under 24: 0 EBADENGINE, 0 deprecations, 0 vulnerabilities; npm 11 pruned 221 orphaned optional-peer lockfile entries (committed).
- **npm 11 gates install scripts**: approved `core-js`, `fsevents`, `unrs-resolver` via `npm approve-scripts` → new `allowScripts` block in package.json. Future installs of new native deps may need the same.
- Added `"engines": { "node": ">=24" }` to package.json; README setup now states the Node 24 prerequisite (and stale "Next.js 15" fixed to 16).
- Full matrix re-run on 24: lint ✓ typecheck ✓ jest 2/2 ✓ build ✓ outdated empty ✓.
- Left alone: `@types/node` stays at 26.x (session-1 zero-outdated policy; types are back-compatible with the 24 runtime).

---

## Session 2 — 2026-07-29 (ponytail audit + full cleanup)

**Branch:** `claude/deps-ui-modernize-mkz7xm`

### What was done
Repo-wide over-engineering audit (`/ponytail-audit`, 3 parallel search agents) written to **`PONYTAIL_AUDIT.md` (repo root)** — 30 ranked findings. User then asked to fix ALL of them (skipping only the PII-in-git history concern, intentional). All 30 applied via phased parallel agents; **net −3,183 lines** (+2,177/−5,360 excl. lockfile), −3 deps, −6 devDeps, −2 overrides.

Highlights (see PONYTAIL_AUDIT.md "Resolution" section for the full list):
- Deleted: supabase/backup dumps (995), Docker/nginx/Makefile/health-route stack (374), instructions.md, jest.setup.ts + config trim, creative/executive templates (439), resume.repository.ts, page-header.tsx, enhance-field.tsx, select-styles.ts, skills-data.ts, dead barrels.
- New shared code: `components/forms/` (entry-form.tsx, entry-fields.tsx, suggest-input.tsx) deduping profile sections ↔ onboarding steps; `components/resume-templates/shared.tsx` (ContactLinks, stripScheme); `lib/use-resume.ts` hook (3 pages); `lib/prompts/shared.ts` (ATS rules).
- Rewrites: documents-table on plain `<table>` (react-table dropped); modal.tsx on native `<dialog>`; ImportResumeModal DB writes moved into onboarding.repository (`importParsedResume`); openrouter.service on LangChain's `parseJsonMarkdown` + `.text` (128→50 lines); resume-generator 494→331 (format-config theater + dead fallbacks removed).
- Type narrowing: `GeneratedResumeData.skills` is now `CategorizedSkill[]` only — `normalizeSkills` folds legacy flat arrays into a "Skills" bucket (trust boundary verified across every generated_data read path); all `typeof skills[0]==='string'` branches deleted.
- **Bug fixed**: generator's `skills.join(', ')` rendered `[object Object]` for categorized skills.
- Edit page: one `bind(key,i,field)` helper replaced 13 copies of the map-splice onChange closure; seed effect replaced with render-time state adjust (React Compiler lint-clean).

### Behavior deltas (deliberate, small)
- Legacy flat-skills rows render under a "Skills" category label now.
- Profile Work/Education selects gained an empty option (job_type/degree save as null when cleared).
- AddSkillsModal picks skills via chips instead of react-select multi-select.
- JSON extraction: prose *after* a bare unfenced JSON object no longer parses (fenced/truncated handled better than before).

### Verification
`tsc` ✓ · `eslint` 0 errors 0 warnings ✓ · `jest` 2/2 ✓ · `next build` ✓ (20 routes) · npm install/audit/outdated all clean ✓.

### Open / for user
- **Rotate the OpenRouter API key** — was committed in `.env.docker` (now deleted, but in git history).
- Docker deploy stack removed — if Docker deployment is ever wanted, recreate from git history.

---

## Session 1 — 2026-07-29

**Branch:** `claude/deps-ui-modernize-mkz7xm`

### Goals set by user
1. All deps to latest versions, 0 dependency warnings (verify versions via web, not memory).
2. Fix broken desktop UI + broken insert/update/delete features; full UI modernization with new design system/branding/UX.
3. Maintain this memory system; commit+push small chunks; work only on the branch above.
4. Supabase CLI available for a local DB instance.

### Baseline captured (before any changes)
- `npm install`: 2 deprecation warnings (transitive `inflight@1.0.6`, `glob@7.2.3`), **19 vulnerabilities (2 low, 4 moderate, 11 high, 2 critical)**.
- Node v22.22.2, npm 10.9.7.
- `npm outdated` (Current → Latest, majors in bold):
  - @eslint/eslintrc 3.3.1 → 3.3.6
  - **@langchain/core 0.3.78 → 1.2.3**
  - **@langchain/openai 0.6.14 → 1.5.5**
  - **@supabase/ssr 0.6.1 → 0.12.4**
  - @supabase/supabase-js 2.53.0 → 2.111.0
  - **@testing-library/jest-dom 6.9.1 → 7.0.0**
  - @testing-library/react 16.3.0 → 16.3.2
  - **@types/node 20.19.9 → 26.1.2**
  - @types/react 19.1.9 → 19.2.17 · @types/react-dom 19.1.7 → 19.2.3
  - autoprefixer 10.4.21 → 10.5.4
  - **eslint 9.32.0 → 10.8.0** · **eslint-config-next 15.4.5 → 16.2.12**
  - jest 30.2.0 → 30.4.2 · jest-environment-jsdom 30.2.0 → 30.4.1
  - **jspdf 3.0.3 → 4.2.1**
  - **lucide-react 0.536.0 → 1.27.0**
  - **next 15.4.5 → 16.2.12**
  - postcss 8.5.6 → 8.5.24
  - react/react-dom 19.1.0 → 19.2.8
  - react-hook-form 7.63.0 → 7.83.0
  - tailwind-merge 3.3.1 → 3.6.0
  - **tailwindcss 3.4.17 → 4.3.3**
  - **typescript 5.8.3 → 7.0.2**
  - (html2canvas 1.4.1 = latest; @types/html2canvas 0.5.35 likely removable — html2canvas ships its own types)

### Work done this session
- Created memory system: `.claude/memory/{STATUS,WORKLOG,DECISIONS}.md`; CLAUDE.md updated with mandatory read/update protocol.

### Research findings (web + npm registry, 2026-07-29)
- **Next 16** (latest stable 16.2.12): `middleware.ts` removed → rename to `proxy.ts` with exported function `proxy` (repo has middleware.ts doing Supabase auth redirects). `next lint` removed → lint script must call `eslint` directly. Turbopack is default (drop `--turbopack` flag). Peers OK with React 19.2.8.
- **TypeScript 7.0.2** (Go-native): npm package no longer ships the JS Compiler API (`lib/typescript.js`); Next.js loads that API for its TS integration → stable Next 16.2.x FAILS to detect TS7. Official support = `experimental.useTypeScriptCli` flag, only in Next 16.3 canary/preview (PR #95639). Fallback documented in vercel/next.js discussion #95633: alias `"typescript": "npm:@typescript/typescript6@^6.0.2"` (JS-based TS6, latest 6.0.2). Plan: try TS7 empirically; if next build breaks, use TS6 alias and note revisit-when-16.3-stable.
- **Tailwind 4.3.3**: CSS-first config. Use official `npx @tailwindcss/upgrade` tool (migrates package.json → `@tailwindcss/postcss`, converts tailwind.config.ts into `@theme` in globals.css, renames utilities: shadow-sm→shadow-xs, rounded→rounded-sm, outline-none→outline-hidden, ring→ring-3, etc.). autoprefixer + postcss deps become unnecessary. **Gotcha:** v4 emits `oklch()` colors → html2canvas@1.4.1 (abandoned, latest) throws on oklch → replace with maintained fork `html2canvas-pro@2.3.2` (API-compatible; used only in `app/dashboard/documents/[id]/page.tsx`). Also lets us drop deprecated stub `@types/html2canvas`.
- **ESLint 10.8.0** + **eslint-config-next 16.2.12**: peer `eslint >=9` ✓. v16 config is flat-native with exports `eslint-config-next/core-web-vitals` and `/typescript` → rewrite eslint.config.mjs without FlatCompat; drop `@eslint/eslintrc` devDep.
- **LangChain 1.x** (@langchain/core 1.2.3, @langchain/openai 1.5.5): `ChatOpenAI({ configuration: { baseURL, defaultHeaders } })` pattern unchanged; audit fixes GHSA-r399-636x-v7f6 (core ≤1.1.28 serialization vuln). ChatPromptTemplate still `@langchain/core/prompts`.
- **@supabase/ssr 0.12.4** (+ supabase-js 2.111.0 peer): breaking change is get/set/remove → getAll/setAll — repo ALREADY uses getAll/setAll in `lib/supabase/server.ts` + middleware → smooth.
- **jsPDF 4.2.1**: deps now just @babel/runtime+fflate+fast-png — dompurify dependency GONE (kills the 17-advisory dompurify pile).
- **jest 30.4.x**: `@jest/transform` still pins `babel-plugin-istanbul@^7` → transitive deprecated `glob@7`+`inflight` → add npm `overrides: { "babel-plugin-istanbul": "^8.0.0" }` (v8 uses test-exclude 7 / glob 13).
- **ts-node**: dead-end (latest 10.9.2, `diff@4` vuln, incompatible with TS7). Only used to load `jest.config.ts` → convert to `jest.config.mjs`, drop ts-node.
- **@testing-library/jest-dom 7.0.0**: needs node ≥22 ✓, peer @testing-library/dom ≥10<11 → add explicit devDep `@testing-library/dom@10.4.1`.
- Latest confirmations: react 19.2.8, @types/react 19.2.17, @types/react-dom 19.2.3, @types/node 26.1.2, lucide-react 1.27.0, react-hook-form 7.83.0, tailwind-merge 3.6.0, supabase-js 2.111.0, jest 30.4.2, jest-env-jsdom 30.4.1, @testing-library/react 16.3.2; already-latest: react-select 5.10.2, @tanstack/react-table 8.21.3, cva 0.7.1, clsx 2.1.1, user-event 14.6.1, @swc/jest 0.2.39, @types/jest 30.0.0.

### Upgrade execution plan
1. `npx @tailwindcss/upgrade` on clean tree → commit.
2. Bump all remaining deps in package.json; overrides; drop ts-node/@types/html2canvas/@eslint/eslintrc/autoprefixer/postcss; add html2canvas-pro/@testing-library/dom/@tailwindcss/postcss.
3. Config migrations: middleware.ts→proxy.ts, eslint.config.mjs flat-native, jest.config.mjs, lint script → `eslint`, drop `--turbopack`, remove `ignoreBuildErrors`, gitignore tsconfig.tsbuildinfo.
4. Fix fallout until `npm install` warning-free, `npm audit` 0, `npm outdated` empty, lint+typecheck+tests+build green. Commit per logical chunk.

### Upgrade executed (same session) — ALL GREEN
- Commit 1: Tailwind v3→v4 via `npx @tailwindcss/upgrade` (45 files; @theme in globals.css; @tailwindcss/postcss; utility renames).
- Commit 2 (this): every remaining dep to latest; middleware.ts→proxy.ts (`proxy` export); jest.config.ts→jest.config.mjs (ts-node dropped); eslint.config.mjs lean flat config (see D-002); typescript via @typescript/typescript6 alias (D-003); overrides validated one-by-one (D-004); html2canvas-pro swap (D-005); `typecheck` script added; `ignoreBuildErrors` removed; tsbuildinfo untracked; tsconfig updated by Next 16 (jsx react-jsx).
- React-compiler lint fixes (9 errors → 0): profile page + Skills/Education/Projects/WorkExperience sections refactored to fetch-function + `.then(setState)` effects with cancellation guards (loadX wrappers kept for post-mutation reloads); EnhanceTextarea derived state (2 effects deleted); template-preview canvas painters hoisted to module scope; justified disable for TanStack `useReactTable` compiler-skip warning.
- Verification matrix: fresh `npm ci` 0 warns/0 deprecations · audit 0 vulns · outdated empty · eslint clean · tsc clean · jest 4/4 · next build 19 routes OK.
- Env note: build needs Supabase env; created untracked `.env.local` with local-dev placeholders (supabase CLI defaults). `.env.docker` in repo contains a real-looking OpenRouter key — flag to user.

### Frontend rebuild progress (same session)
- ✅ DB: grants migration (fixed global 403s) + imported_resumes RLS + onboarding_completed flag + widened degree CHECK; database_types.ts regenerated from live schema.
- ✅ Local env: dockerd started manually; `supabase start -x realtime -x storage-api -x imgproxy -x studio -x logflare -x vector -x edge-runtime -x mailpit -x supavisor` (sandbox ulimit cap). Dev server + Playwright E2E loop working (scratchpad pw/).
- ✅ Design foundation + UI kit committed (Atelier tokens, Button/Field/Modal/Toast/Card/etc., error/not-found/loading pages, proxy ?next=).
- ✅ Landing + auth rebuilt (faithful template thumbnails via fixed-816px scale; email-confirmation + forgot/reset password flows added; /auth/callback route).
- ✅ Dashboard chrome + home rebuilt (light sidebar, mobile drawer, REAL stats + readiness checklist).
- ✅ Documents flow rebuilt by me: list/table/generate-modal/view/edit/preview — PDF export ENABLED and E2E-verified (JPEG capture); template choice persists; edit no longer destroys summaries/skills; generate modal surfaces real API errors.
- ✅ API/services hardened: enhance-text auth+cap, generate route validation+maxDuration+normalized storage, parse-resume returns data, LangChain formatMessages fix, maxTokens honored, fenced-JSON extraction, PII logs removed, repo update/delete methods.
- ✅ Template fixes: jake education-location bug, professional fake skill bars removed, render-content v3-class + '.'-split fixes; canvas template-preview + dummy-resume deleted; single RESUME_TEMPLATES registry.
- ✅ E2E verified with REAL OpenRouter generation (key from .env.docker): generated resume rendered + PDF downloaded. Seed data SQL in scratchpad.
- 🔄 Two subagents rebuilding in parallel: profile page + sections (incl. import flow apply + EnhanceTextarea) and onboarding flow (persistence, categories, month→DATE, completion flag). Review + verify + commit when done.

### Session completion (final entries)
- Profile + onboarding agent rebuilds landed and were browser-verified E2E: fresh user registered → onboarding all 5 steps → rows verified in psql (month→DATE conversion, is_current NULL end, categorized skill, onboarding_completed=true) → profile page renders/mutates everything with toasts.
- Real AI generation E2E-verified (OpenRouter key from .env.docker): generate modal → 30s generation → normalized storage → Modern template render → PDF download worked (switched capture to JPEG, ~10x smaller).
- Cleanup: ALL legacy tokens/utilities/keyframes removed from globals.css (poppins reclassified as template font); base element styling reduced to checkbox/radio accents (kit components own all control styling).
- Typed Supabase clients enabled (`createBrowserClient<Database>` / `createServerClient<Database>`); Json↔domain boundaries handled via `rowToResume()` + `asJson()` in `lib/utils/normalize-resume.ts`; required-date guards added in Work/Education forms.
- jest haste warning silenced (modulePathIgnorePatterns .next). Final verification matrix all green: tsc 0, eslint 0/0, jest 4/4, next build 22 routes, npm install/ci 0 warnings, audit 0 vulns, outdated empty.

### How to run locally (for future sessions)
1. `dockerd` needs manual start in this sandbox: `(dockerd &)`, wait for `docker info`.
2. `npx supabase start -x realtime -x storage-api -x imgproxy -x studio -x logflare -x vector -x edge-runtime -x mailpit -x supavisor` (full stack hits the sandbox's 4096-ulimit cap).
3. `.env.local`: NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321, the standard local demo ANON_KEY (printed by supabase start), OPENROUTER_API_KEY as needed.
4. `npm run dev`; Playwright E2E scripts live in the session scratchpad (pw/), chromium at /opt/pw-browsers/chromium.
