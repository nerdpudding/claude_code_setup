---
name: feature-close
description: Close out a delivered feature or sprint — verify docs/roadmap reflect what was actually built, carry leftovers to the backlog explicitly, graduate durable lessons to lessons_learned, archive the plan with a date prefix + status note, and report. Use when the user says "feature-close", "sluit de feature af", "close the sprint", "end-of-sprint hygiene", or asks for tidy-up after a delivered feature. Generic across projects; skips artifacts a project doesn't have.
---

# feature-close — hygiene pass after a delivered feature or sprint

A delivered feature isn't done until the repo tells the truth about it: docs current, leftovers
visibly parked, the plan archived, lessons captured. This skill is that pass. It is generic —
it works with the standard project conventions (`claude_plans/`, `archive/`, `roadmap.md`,
`docs/lessons_learned.md`, `AI_INSTRUCTIONS.md`) but **skips any artifact the project doesn't
have** rather than creating it. Scale the whole pass to the size of what was delivered: a small
feature needs minutes, not the full ceremony.

## Hard rules

- **Archive, never delete.** Superseded files move to `archive/` with a `YYYY-MM-DD_` prefix.
- **Nothing silently dropped.** Every planned-but-not-delivered item is either carried to the
  backlog/roadmap explicitly or listed in the report as consciously dropped — the user decides.
- **All file content in English**, regardless of conversation language.
- **No commits/pushes** unless the user explicitly asks; offer it at the end.

## Steps

### 1. Establish what was delivered
Identify the feature/sprint being closed and its plan file (usually `claude_plans/PLAN_<name>.md`)
if one exists. From the plan (or `git log` when there is no plan), list: what was built, what was
deferred, what changed along the way.

### 2. Docs accuracy sweep (delegate — cheap model)
Check that the docs describing the changed behavior match reality: README status, roadmap entries,
architecture/usage docs, cross-references to files that moved or were renamed. Delegate this to
the project's **doc-keeper agent** if it has one; otherwise a **sonnet** general agent; only do it
inline for a trivially small project. The agent reports drift; fixes are applied in the main
thread.

### 3. Update status + carry leftovers
- Update the roadmap/status line (roadmap.md, README "status", or wherever this project keeps it)
  to reflect the delivery, with the date.
- Move every open/deferred item from the plan to the project's backlog location, worded so it is
  actionable later without re-reading the archived plan.

### 4. Graduate durable lessons
Anything learned that outlives this feature (a pitfall, a pattern that worked, a hard-won
constraint) goes into `docs/lessons_learned.md` (if the project keeps one) — concise, with the
rule to follow going forward. Session-only details stay out.

### 5. Archive the plan
Prepend a short status note to the plan file (delivered what/when; where the leftovers went), then
move it to `archive/YYYY-MM-DD_PLAN_<name>.md`. Fix any references that pointed at the old path.

### 6. Memory
If auto-memory is active and the project's cross-session state changed (e.g. an ongoing goal is
now done), update it — don't leave memory pointing at closed work.

### 7. Report and hand back
Summarize: what was verified/updated, where the leftovers landed, what was archived, anything
that contradicted expectations (surface it, don't silently "fix" it). Offer — but don't perform —
the commit.
