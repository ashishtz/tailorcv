# Technical Decisions — AI Resume Builder

> Record of every significant technical decision, with rationale, so future sessions
> don't re-litigate or accidentally reverse them. Newest at the top.

---

## D-007 · 2026-07-29 · Accessibility baseline (WCAG 2.1 AA) is enforced, not aspirational

- **Decision:** All 35 findings of the session-3c audit are fixed and guarded by `e2e/a11y.spec.ts` (skip link is first tab stop, zero `a button` nesting, all controls pointer-cursored, every form control named, `aria-required` on required fields, table sort semantics, one h1 + no horizontal overflow on resume pages, generation status live region, drawer focus-trap + Escape).
- **Rules that follow:** never nest `<Button>` inside `<Link>` (use `buttonVariants({...})` on the Link — from `button-variants.ts` in server components); every route gets its own `metadata.title`; icon-only controls need `aria-label` + `aria-hidden` icon; meaningful text stays at `stone-500` or darker (stone-400 fails 4.5:1); fixed-width resume sheets are always zoom-scaled via `lib/use-fit-scale.ts`, never `overflow-x-auto`; templates take `nameTag` so an embedded sheet doesn't duplicate the page h1.
- **Why:** the app is a resume tool whose users include people with disabilities applying for jobs; a11y regressions here are product failures, and the audit found 9 serious ones that had accumulated silently.

## D-006 · 2026-07-29 · Prompt architecture: one ChatPromptTemplate per feature, system=rules / user=data

- **Decision:** Each AI feature has exactly one `ChatPromptTemplate.fromMessages([system, user])` in `lib/prompts/`, consumed via `prompt.pipe(client).invoke(vars)`. The system message carries every instruction; the user message carries only data. Conditional rule text (mode, section formats, highlighting) lives as exported constants in the prompt file; services only select variants and format data — no prompt strings in services. `SECTION_FORMATS` pairs each format's rules with its JSON-schema example so they cannot drift. `lib/prompts/__tests__/prompt-contract.test.ts` formats the real template with the real variable builder — any variable rename breaks the test, not production.
- **Why:** The previous layout hand-spliced two separately-formatted templates, kept an 88-line prompt inline in the service, repeated rules in both messages with contradictory numbers, and demanded [HIGHLIGHT] markers even with highlighting disabled.
- **Do not:** reintroduce instructions into user messages, inline prompt text in services, or format templates separately and concatenate messages by hand.

## D-005 · 2026-07-29 · Ponytail cleanup: settled simplification decisions (session 2)

- **No Docker/nginx/Make deploy stack.** Deleted as unused (no CI, README never referenced it, nginx duplicated Next's own behavior). Deploy = `next start` or a platform. Don't reintroduce without an actual deploy target.
- **5 templates, not 7.** creative/executive deleted — decorative gradients contradicted the "ATS-friendly" product pitch. Template shared pieces live in `components/resume-templates/shared.tsx`.
- **`GeneratedResumeData.skills` is `CategorizedSkill[]` only.** `normalizeSkills` folds legacy flat string arrays into a `{ category: 'Skills' }` bucket; every generated_data read path goes through `rowToResume`/`normalizeResumeData` (verified). Never reintroduce the `string[] |` union or per-consumer branches.
- **Native platform over libraries where equivalent:** `components/ui/modal.tsx` = native `<dialog>`/`showModal()`; skill pickers = `<Input list>` + `<datalist>` (`components/forms/suggest-input.tsx`); documents table = plain `<table>` + filter/sort in `useMemo`. react-select, @tanstack/react-table, react-hook-form removed from package.json — don't re-add for these use cases.
- **DB writes live in repositories, not components.** ImportResumeModal's inserts moved to `onboarding.repository.ts` (`importParsedResume`); name matching standardized on the `ilike` find-or-create (`ensureNamedRowId`).
- **Profile/onboarding forms share `components/forms/`** (entry-form.tsx state machine + EntryRow, entry-fields.tsx field groups). Deliberately NOT a generic `<EntryListEditor>` — callers keep their own persistence/validation.
- **jest runs in `node` env with no setup file**; testing-library/jsdom devDeps removed until a component test actually needs them. Overrides `jsdom`/`@swc/helpers` removed with their trigger packages.
- Full audit + rationale: `PONYTAIL_AUDIT.md` (repo root).

## D-001 · 2026-07-29 · Memory system lives in `.claude/memory/`, committed to git

- **Decision:** Cross-session memory = three committed markdown files (`STATUS.md`, `WORKLOG.md`, `DECISIONS.md`) plus feature docs (e.g. `FRONTEND_AUDIT.md`, `DESIGN_SYSTEM.md`) in `.claude/memory/`. CLAUDE.md instructs every session to read them at start and update them before ending a chunk.
- **Why:** CLAUDE.md is auto-loaded in every Claude Code session, so a pointer there guarantees discovery; committing to git makes memory survive ephemeral cloud containers and travel with branches/PRs.

## D-002 · 2026-07-29 · Replaced eslint-config-next with lean flat config

- **Decision:** eslint.config.mjs composes `typescript-eslint` recommended + `@next/eslint-plugin-next` core-web-vitals + `eslint-plugin-react-hooks` v7 flat recommended-latest directly. `eslint-config-next` and `@eslint/eslintrc` (FlatCompat) removed.
- **Why:** eslint-config-next hard-depends on eslint-plugin-import/jsx-a11y/react, all pinned to minimatch@3 → brace-expansion ≤5.0.7, which npm audit flags HIGH (GHSA-mh99-v99m-4gvg; only 5.0.8 is patched, maintenance backports 1.1.16/2.1.3 are still inside the advisory range). With it installed, "0 vulnerabilities" is impossible today. The lean config keeps all Next-specific + hooks + TS linting; react-hooks v7 additionally brings React Compiler rules (caught 9 real bugs).
- **Alternatives considered:** global brace-expansion@5.0.8 override — REJECTED: empirically breaks minimatch v3/v9 consumers at runtime (`expand is not a function`) because 5.x dropped the callable default CJS export; forking plugins — overkill.

## D-003 · 2026-07-29 · TypeScript = npm:@typescript/typescript6@^6.0.2 alias (not 7.0.2)

- **Decision:** `"typescript": "npm:@typescript/typescript6@^6.0.2"` (Microsoft's official JS-based 6.x line; 6.0.2 is its latest).
- **Why:** typescript@7.0.2 (Go-native) removed the JS Compiler API. (a) Stable Next 16.2.x cannot load it (`experimental.useTypeScriptCli` only exists in 16.3 canary/preview); (b) typescript-eslint@8.65 peers `typescript >=4.8.4 <6.1.0` → npm install hard-fails with TS7. The alias is the pattern recommended in vercel/next.js#95633. npm outdated stays clean (alias target is at its own latest).
- **Revisit when:** Next 16.3 stable + typescript-eslint TS7 support land.

## D-004 · 2026-07-29 · npm overrides in package.json (each empirically validated)

- `babel-plugin-istanbul ^8` + `test-exclude ^8` + `glob ^13`: purge deprecated glob@7/inflight and vulnerable minimatch@9 from the jest tree. Jest's `glob.glob.sync()` call style verified working against glob@13.
- `jsdom ^30`: jest-environment-jsdom pins jsdom ^26 whose whatwg-encoding@3.1.1 is deprecated (latest-and-deprecated, unfixable otherwise); jsdom ≥27 dropped it. Tests pass on jsdom 30.
- `@napi-rs/wasm-runtime 1.1.6`: latest 1.x whose @emnapi peers (^1.7.1) are consistent; 1.2.0 peers @emnapi ^2.0.0-alpha causing ERESOLVE warns inside unrs-resolver's wasm binding (upstream bug).
- `@swc/helpers ^0.5.23`: next pins exact 0.5.15 while @swc/core (via @swc/jest) peers >=0.5.17 — npm produced an unsyncable lockfile (`npm ci` EUSAGE). Unified on latest; helpers are additive-compatible.
- `next: { postcss ^8.5.24, sharp ^0.35.3 }`: next 16.2.12 bundles postcss 8.4.31 + sharp 0.34.x, both under active advisories (fixed only in 16.3 previews); scoped override clears them, minor-version compatible.

## D-005 · 2026-07-29 · html2canvas → html2canvas-pro

- **Decision:** Replace abandoned html2canvas@1.4.1 with maintained API-compatible fork html2canvas-pro@2.3.2 (only usage: PDF download in `app/dashboard/documents/[id]/page.tsx`). Deprecated stub @types/html2canvas removed (pro ships types).
- **Why:** Tailwind v4 emits `oklch()` colors which html2canvas 1.4.1 cannot parse (runtime crash on PDF export); pro supports modern color functions.

<!-- Template for new decisions:
## D-0XX · YYYY-MM-DD · Title
- **Decision:**
- **Why:**
- **Alternatives considered:**
-->
