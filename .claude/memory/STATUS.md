# Project Status — AI Resume Builder

> **Single source of truth for cross-session continuity.**
> Every Claude session MUST read this file (plus WORKLOG.md and DECISIONS.md) at start,
> and MUST update all three before finishing a work chunk. Keep entries detailed enough
> that a brand-new session can resume without any other context.

**Last updated:** 2026-07-29 (session 1)
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

## 🔄 In Progress

- **Dependency research + upgrade** — see WORKLOG.md session 1 for the full version matrix gathered from npm registry + web research.

## 📋 Backlog (ordered)

1. Upgrade all deps to latest (Next 16, Tailwind 4, TS 7?, ESLint 10, LangChain 1.x, jsPDF 4, @supabase/ssr 0.12, supabase-js latest, lucide-react 1.x, jest-dom 7, @types/node 26, React 19.2) with all required code migrations. Zero warnings.
2. Verify build + lint + typecheck + tests green; commit/push per logical chunk.
3. Frontend audit: run app (with local Supabase), walk every route, catalog broken UI/CRUD/UX into `FRONTEND_AUDIT.md`.
4. Define new design system (branding, tokens, guidelines) → `DESIGN_SYSTEM.md`.
5. Rebuild/modernize UI per design system; fix all CRUD bugs.
6. Final report to user.

## ⛔ Known Constraints / Gotchas

- `next.config.ts` currently has `typescript.ignoreBuildErrors: true` — a smell; aim to remove once codebase is clean.
- `tsconfig.tsbuildinfo` is committed to the repo (should probably be gitignored).
- Env: `.env.example` is empty; `.env.docker` exists. App needs `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENROUTER_API_KEY`.
- Remote exec environment: no `gh` CLI (use GitHub MCP tools), outbound HTTPS via proxy.

---

## 🗺️ App Map (for orientation)

- **Routes:** `/` (landing) · `/auth/login` · `/auth/register` · `/onboarding` (+ `/skills`, `/work-experience`, `/education`, `/projects`) · `/dashboard` · `/dashboard/documents` (+ `[id]`, `[id]/edit`) · `/dashboard/profile` (+ `import-resume`) · `/preview/[id]`
- **API:** `/api/health`, `/api/parse-resume`, `/api/enhance-text`, `/api/resumes/generate`
- **Data layer:** `lib/repositories/` (user-profile, resume) → Supabase; `lib/services/` (ai/openrouter, resume parser/enhancer/generator); prompts in `lib/prompts/*.prompt.ts`
- **DB:** Supabase; migrations in `supabase/migrations/` (profiles, skills, user_skills, work_experiences, education, projects, resumes, imported_resumes, skill categories, social links)
- **Templates:** `components/resume-templates/` — classic, modern, minimal, creative, executive, professional, jake
