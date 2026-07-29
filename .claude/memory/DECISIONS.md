# Technical Decisions — AI Resume Builder

> Record of every significant technical decision, with rationale, so future sessions
> don't re-litigate or accidentally reverse them. Newest at the top.

---

## D-001 · 2026-07-29 · Memory system lives in `.claude/memory/`, committed to git

- **Decision:** Cross-session memory = three committed markdown files (`STATUS.md`, `WORKLOG.md`, `DECISIONS.md`) plus feature docs (e.g. `FRONTEND_AUDIT.md`, `DESIGN_SYSTEM.md`) in `.claude/memory/`. CLAUDE.md instructs every session to read them at start and update them before ending a chunk.
- **Why:** CLAUDE.md is auto-loaded in every Claude Code session, so a pointer there guarantees discovery; committing to git makes memory survive ephemeral cloud containers and travel with branches/PRs.

<!-- Template for new decisions:
## D-0XX · YYYY-MM-DD · Title
- **Decision:**
- **Why:**
- **Alternatives considered:**
-->
