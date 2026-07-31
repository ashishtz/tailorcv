# What changed

<!-- One or two sentences in plain language. The diff already lists the files. -->

# Why

<!-- The problem, bug or itch this addresses. Link an issue if there is one:
     Fixes #123 -->

# Screenshots

<!-- Required for anything a user can see. Delete this section only if the
     change is invisible (build config, docs, tests).

     For resume templates, capture the unobstructed sheet at
     /preview/<resume-id>?template=<template-id> -->

| Before | After |
| --- | --- |
| <!-- paste --> | <!-- paste --> |

# How I verified it

<!-- Which suites you ran, plus anything you checked by hand. -->

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run e2e`
- [ ] Checked by hand in the browser

Tested by hand:
<!-- e.g. generated a resume in strict mode, exported the PDF, confirmed the
     text is selectable -->

# Anything left out

<!-- Known limits, follow-ups, things you decided were out of scope. Say so
     here rather than leaving a reviewer to find them. -->

---

### Checklist

- [ ] No `any` types, and no new lint suppressions without a comment saying why
- [ ] Reused existing components, repositories and utilities where they fit
- [ ] No em or en dashes in user-visible copy
- [ ] New UI is keyboard reachable and labelled
- [ ] If this touches a resume template: one column, standard headings, real
      text only, registered in `lib/templates.ts`
- [ ] If this changes prompts: text lives in `lib/prompts/`, instructions in the
      system message, data in the user message
- [ ] If this retires or renames a stored value: a migration handles existing rows
