# Work Log — AI Resume Builder

> Chronological, detailed log of every work session. Newest session at the top.
> Each entry: date, what was done (with file paths), what was found, what's next.

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

### Next
- Execute plan above, then frontend audit.
