# Contributing

Thanks for considering a contribution. This project is a real application that
people use to apply for jobs, so the bar is "would I ship this to someone
job hunting tomorrow" rather than "does it run on my machine".

New templates, accessibility fixes and ATS improvements are especially welcome.

---

## Getting set up

```bash
nvm use              # Node 24, per .nvmrc
npm install
cp .env.example .env.local     # fill in Supabase + OpenRouter values
npm run dev
```

For anything touching the database or the E2E suite, run the stack locally with
the [Supabase CLI](https://supabase.com/docs/guides/cli) as described in the
[README](README.md#quick-start).

## Before you open a pull request

Run all four. CI runs the same set, so a red pipeline is a wasted round trip:

```bash
npm run lint
npm run typecheck
npm test
npm run e2e          # needs Supabase running and a fresh npm run build
```

If you changed anything visual, take screenshots. If you changed a flow, a short
GIF is worth more than three paragraphs.

## Writing the pull request

The template will prompt you, but the substance we need is:

1. **What changed, in plain language.** One or two sentences. Not a list of
   files, which the diff already shows.
2. **Why.** The problem, the bug, or the itch. Link an issue if there is one.
3. **Screenshots for anything a user can see.** Before and after, side by side.
   A UI change without a screenshot takes several times longer to review.
4. **How you verified it.** Which suites you ran, and anything you tested by
   hand that a test does not cover.
5. **What you deliberately left out.** Known limits are fine, hidden ones are
   not.

Keep pull requests focused. A template, a bug fix and a refactor should be three
pull requests, because one reviewer objection should not block the other two.

<details>
<summary><b>Taking good screenshots</b></summary>

- Full window, not a cropped fragment, so layout context is visible.
- Same viewport for before and after.
- For resume templates, use the preview route so the sheet is unobstructed:
  `/preview/<resume-id>?template=<template-id>`.
- Drag images straight into the pull request body. GitHub hosts them.

</details>

## Standards this codebase holds to

These are not style preferences. They are the rules that keep the product
honest, and a pull request that breaks one will be asked to change.

### TypeScript

- No `any`. Use `unknown` and narrow it, or write the type.
- Lint and typecheck must be clean. Do not silence a rule without a comment
  explaining why the suppression is correct.

### Reuse before addition

Search before you build. Most UI already exists in `components/ui/` and
`components/forms/`, and most database access belongs in an existing repository
in `lib/repositories/`. Extending a component with a prop beats copying it.

### Resume templates

Every template must be parseable by an applicant tracking system:

- **one column**, no sidebars and no parallel text flows
- **standard headings only**: `Professional Summary`, `Skills`,
  `Work Experience`, `Education`, `Projects`
- **real text**, never an image, table, text box, or icon carrying meaning
- **system font stacks and plain bullets**
- accept `nameTag` so an embedded sheet does not duplicate the page `h1`
- `break-inside-avoid` on entries so print does not split them

Design freedom lives in colour, rules, tints, spacing and type scale, which
parsers ignore. If your design depends on a background colour, remember export
runs through browser print, which drops backgrounds unless
`print-color-adjust: exact` applies, so prefer dark text on light tint.

Register the template in `lib/templates.ts`. If you retire or rename an id, add
a migration that remaps stored `template_id` values.

### AI prompts

- All prompt text lives in `lib/prompts/`, one `ChatPromptTemplate` per feature.
  Never inline a prompt string in a service or route.
- System message carries instructions. User message carries only data.
- OpenRouter only. Never call the OpenAI API directly.
- Model output is untrusted. It passes through `normalizeResumeData` before it
  is stored or rendered.

### Accessibility

Guarded by `e2e/a11y.spec.ts`, and worth understanding before you add UI:

- every control has a label, every icon-only button an `aria-label`
- never nest a `<button>` inside a `<Link>`; put `buttonVariants({...})` on the
  link instead (import from `button-variants` in server components)
- meaningful text at `stone-500` or darker
- a scrollable region with a hidden scrollbar needs `tabIndex` so a keyboard can
  still reach it
- state changes that matter get a live region

### Copy

No em dashes or en dashes in anything a user can read, including error
messages. Use a comma, a colon, or two sentences. `e2e/copy.spec.ts` scans
rendered pages and fails the build on any it finds.

### Architecture

```
route handler   validation and response shape only
service         business logic and AI calls
repository      all database access
prompt          all prompt text
```

Do not query the database from a component, and do not put business logic in a
route.

## Commits

Write a subject line that says what changed and why it matters. The body should
explain the reasoning a reviewer cannot get from the diff. Present tense,
no trailing period.

```
Redirect to login when the session is gone instead of loading forever

Client data paths read the session locally, and every caller treated a
missing session as a data error, so an expired refresh token left pages
spinning with no way out.
```

## Reporting bugs

Open an issue with what you expected, what happened, and the smallest set of
steps that reproduces it. Include your browser and whether you were running
against local or hosted Supabase. Screenshots of a broken layout, or the error
text if something failed, save a lot of back and forth.

## Licence

By contributing you agree that your contributions are licensed under the
[Apache License 2.0](LICENSE), the same licence that covers this project.
