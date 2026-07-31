# Security Policy

## Reporting a vulnerability

Please report security issues privately rather than opening a public issue.

Use GitHub's [private vulnerability reporting](https://github.com/ashishtz/AI-resume-builder/security/advisories/new)
on this repository. Include what you found, how to reproduce it, and what an
attacker could reach with it.

You can expect an initial response within a week. Please give a reasonable
window for a fix before disclosing publicly.

## Scope

This application stores personal data that people put on resumes: names,
contact details, employment history and education. Anything that lets one
account read or modify another's data is the highest severity here.

Particularly relevant areas:

- **Row-level security.** Every table is scoped to its owner. A missing or
  bypassable policy is a serious bug.
- **API routes.** `/api/parse-resume`, `/api/enhance-text` and
  `/api/resumes/generate` all authenticate server side before doing work.
- **Uploaded resumes.** Parsed content is user-controlled input.
- **Model output.** Treated as untrusted and normalized before storage or
  rendering.

## Running this yourself

- Never commit `.env.local`, a service-role key, or an OpenRouter key. Only
  `.env.example` belongs in git.
- The service-role key bypasses row-level security. It belongs in local
  development and CI secrets only, never in client code or a deployed bundle.
- Rotate any key that has been committed, including in an old commit. Deleting
  the file does not remove it from history.
