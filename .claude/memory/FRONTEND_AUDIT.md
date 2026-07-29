# Frontend Audit — 2026-07-29 (session 1)

> Consolidated from two exhaustive code audits + live browser walkthrough (Playwright against
> local Supabase). Severity: 🔴 BROKEN (feature dead/data loss) · 🟠 BUG · 🟡 UX · ⚪ POLISH.
> Status boxes get checked as the rebuild fixes items. Full per-line details live in the two
> audit reports (see WORKLOG session 1); this file is the actionable fix list.

## ✅ Fixed already (this session)

- [x] 🔴 **ALL PostgREST calls returned 403** — `42501 permission denied`: anon/authenticated
  roles lacked table GRANTs (RLS existed but grants missing). This alone made every
  insert/update/delete/read fail — almost certainly the user-reported "CRUD not working".
  → migration `20260729000000_fix_api_grants_and_imported_resumes_rls.sql` (explicit grants +
  default privileges), verified via curl.
- [x] 🔴 **`imported_resumes` had NO RLS** — any authenticated user could read everyone's
  imported resumes. → same migration enables RLS + own-rows policy.

## 🔴 BROKEN (feature dead or destroys data)

- [ ] **PDF download hard-disabled**: `documents/[id]/page.tsx:194` `disabled={true}` +
  tooltip "To be implemented in future". Also capture container is unconstrained width
  (`max-w-none`) → viewport-dependent PDFs; no `scale` → DPI-dependent sharpness.
  (jsPDF 4 + html2canvas-pro API usage itself verified CORRECT.)
- [ ] **Edit page destroys resumes**: rebuilds `generated_data` WITHOUT `summary` (deleted on
  every save); treats categorized skills as `string[]` → `[object Object]` inputs +
  `skill.trim()` TypeError → every save of an AI resume fails; bullet arrays flattened to
  comma-joined strings.
- [ ] **Onboarding work-exp/education inserts always fail**: `<input type="month">` produces
  `"YYYY-MM"`/`""` → Postgres DATE rejects both. Every insert fails…
- [ ] **…and failures are invisible**: projects-step save loops never check `error`; user is
  redirected to /dashboard as if saved. Silent data loss.
- [ ] **Onboarding state is memory-only**: refresh/deep-link wipes all 5 steps; final
  `.update({})` with empty personalInfo → PostgREST error → dead-end.
- [ ] **Registration dead-ends when email confirmation is ON**: no session → proxy bounces to
  login with zero messaging; no `/auth/callback` route exists for confirmation links.
- [ ] **No onboarding re-entry**: register→/onboarding is the ONLY link to onboarding in the
  app; login always→/dashboard; no completion flag exists. Abandoners can never resume;
  re-entrants create duplicates (and user_skills PK violations, swallowed).
- [ ] **Onboarding skills have no category**: `user_skills` inserted without `category_id`,
  but profile SkillsSection only renders categorized rows → skills invisible in profile.
- [ ] **Import-from-resume is a no-op reporting success**: `/api/parse-resume` writes only to
  `imported_resumes`; profile refetch shows nothing; modal `onSuccess()` anyway. The page
  that would apply data (`import-resume/page.tsx`) is unreachable (no links) AND permanently
  broken (`'use client'` page reads `searchParams` sync — Next 16 Promise) AND its save path
  DELETES 4 profile tables before inserting with errors ignored.
- [ ] **Generation failures invisible**: generate modal `catch{console.error}` (no error
  state) + route flattens every failure to generic 500. 60s spinner then… nothing.
- [ ] **Templates crash on missing AI keys**: all 7 templates dereference
  `data.contact.name`/`.skills.length` etc. unguarded; route stores unvalidated model JSON;
  NO error.tsx/global-error.tsx/not-found.tsx/loading.tsx anywhere → white screen.
- [ ] **`/api/enhance-text` unauthenticated** — anonymous POSTs hit paid OpenRouter; no
  length cap. (Security + cost abuse.)
- [ ] **Modal overlays opaque**: `bg-opacity-75` (removed in TW v4) in confirm-dialog,
  AddSkillsModal, ImportResumeModal → solid gray overlay hides the page.
- [ ] **Dashboard stats hardcoded**: "Total Resumes: 0" and "Profile Status: Complete" are
  literals, never queried.

## 🟠 BUG (top items)

- [ ] proxy.ts: no `?next=` return path on auth redirect; stale comment.
- [ ] login: no incomplete-profile branch; `setLoading(false)` before nav commits.
- [ ] register: already-registered email indistinguishable (anti-enumeration success shape).
- [ ] `render-content.tsx`: `flex-shrink-0` (v3 class, migration miss ×2); `.split('.')`
  fallback shreds "Node.js"/decimals and strips periods; array branch ignores format.
- [ ] Generate modal: centered-flex overflow clips tall modal top on desktop (900px);
  close button scrolls away; no Esc/focus trap; `jake` missing from creatable templates
  (viewable but not creatable); `base_resume_id: undefined` silently falls back to profile
  context; stale documents list after generation (no refetch).
- [ ] Documents [id]: template select never persisted; `params.id` unnarrowed
  `string|string[]`; loading/not-found states bare text.
- [ ] Preview page: returns `null` for loading AND not-found (blank tab from target=_blank);
  `useSearchParams` with no Suspense boundary; templates array duplicated ×3 (drifted).
- [ ] Landing template thumbnails: scale math renders resumes ~2000px wide → squat block in
  top 40% of card (confirmed in screenshot); 6 full resume DOMs shipped to landing.
- [ ] Canvas template-preview (documents flow): professional/creative/executive fall back to
  classic renderer — 3 of 6 tiles show identical wrong preview; mouse-only selection.
- [ ] Stepper resets to step 1 on reload (context, not pathname).
- [ ] Month-date display off-by-one month in negative TZ (`new Date('2023-05')` UTC parse) —
  onboarding cards + landing preview.
- [ ] generator service: `console.log` dumps full PII payload + full AI response; `.format()`
  leaves "System:"/"Human:" prefixes inside message content (should be `formatMessages`);
  maxTokens accepted-but-ignored (openrouter.service commented out) across 3 call sites;
  parser (resume-parser.service) has NO markdown-fence stripping → any fenced response 500s;
  parse model hardcoded legacy `claude-opus-4`; contradictory highlight-count instructions.
- [ ] user-profile.repository: 5 parallel queries, all errors discarded; projects unordered.
- [ ] resume.repository: no update/delete methods (pages hand-roll Supabase calls).
- [ ] database_types.ts: STALE (missing social columns) and dead (never imported); clients
  untyped → `any` queries everywhere. Regenerate + adopt `createClient<Database>`.
- [ ] documents-table: delete failure silent; uncontrolled mode-filter select; columns
  rebuilt every render.
- [ ] profile page: save failure silent (no else); PATCHes whole row incl. id/created_at;
  `alert()` for password feedback.
- [ ] AddSkillsModal: `.single()` on existence checks (PGRST116 noise), per-skill serial
  round-trips, orphaned category on failure, no debounce.
- [ ] grid.svg referenced by auth pages → 404 (asset missing in public/).
- [ ] EnhanceTextarea: silent failure; button overlays the textarea's first line.
- [ ] jake template: education rows show the CANDIDATE's location as institution location.
- [ ] professional template: fabricated 80% skill bars for every skill.
- [ ] globals.css: self-referential `--font-inter: var(--font-inter)` theme vars; print CSS
  doesn't hide dashboard sidebar (no no-print class there).

## 🟡 UX (themes to fix in rebuild)

- [ ] Silent failure pattern EVERYWHERE: no toasts, no `role="alert"`, no error/success
  feedback on any mutation. → Toast system + inline errors (design system).
- [ ] No skeletons; "Loading resumes..." bare text; no empty-state guidance.
- [ ] No forgot-password flow at all (permanent lockout).
- [ ] Onboarding: no exit/skip/save-later; birthday REQUIRED (privacy hazard, unused by
  templates); email never prefilled from auth; degree select lacks PhD etc. (DB CHECK
  constraint allows only Bachelor's/Master's — widen).
- [ ] Anchor links scroll under fixed header (no scroll-padding); footer links all `#`;
  fabricated stats ("10K+ resumes").
- [ ] a11y: icon buttons unlabeled, modals lack focus trap/aria, form labels unassociated,
  keyboard-inaccessible template pickers, no reduced-motion guards on infinite animations.
- [ ] Generation UX: minute-long synchronous wait, no progress/cancel; add staged progress
  feedback + `maxDuration` on route.
- [ ] Site metadata still "Create Next App"; no favicon branding.

## ⚪ POLISH / dead code

- [ ] ResumeUploadSection.tsx (230 lines) dead — delete.
- [ ] `parseHighlightsArray` dead export; template-preview sampleData mostly unread;
  landing `Jake (LaTeX)` unreachable branch; dummy-resume third incompatible shape.
- [ ] 5 near-identical onboarding page shells; duplicated auth branding panels; templates
  array ×3; ParsedResumeData interface ×3.
- [ ] `'use client'` on static components (AnimatedShapes, landing TemplatePreview).

## Environment notes

- Local stack: `supabase start -x realtime -x storage-api -x imgproxy -x studio -x logflare
  -x vector -x edge-runtime -x mailpit -x supavisor` (sandbox blocks ulimit>4096 services;
  daemon: start `dockerd` manually). App runs with `.env.local` (local demo keys).
- Playwright walkthrough script: scratchpad `pw/audit.mjs` (chromium at /opt/pw-browsers/chromium).
- Local auth: email confirmations OFF (config.toml default) → register logs straight in.
