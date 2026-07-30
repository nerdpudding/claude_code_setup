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

**This is not the code review.** A full adversarial review of what was built is the
`milestone-review` workflow, run at milestones — often several sprints apart. Don't run it here,
and don't skip it later because this ran.

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

### 2. Bring the docs up to date — yourself, in the main thread
Update every doc the sprint's changes made stale: README, architecture and usage docs,
cross-references to files that moved or were renamed, tables listing files or commands. You built
this; you know what changed. Do not delegate this and do not defer it to the audit in step 9 —
that audit exists to catch what you could NOT have known, not to hand you your own to-do list back.

### 3. Update status + carry leftovers
- Update the roadmap/status line (roadmap.md, README "status", or wherever this project keeps it)
  to reflect the delivery, with the date.
- Move every open/deferred item from the plan to the project's backlog location, worded so it is
  actionable later without re-reading the archived plan.

### 4. History diet — keep living status docs readable
Living status docs — `roadmap.md` first, but any doc that accumulates history — must stay
scannable: backlog and planned work in front, history compact. At every close, check the
roadmap's shape; when delivered-work detail starts to dominate (rule of thumb: the live
content — backlog, next sprints — no longer stands out in a quick scan), move the full
delivered sections **verbatim** to the project's history doc — `docs/roadmap_history.md`
(create on first use; newest at the top) — leaving one status line per delivered item in the
roadmap with a pointer to the history doc. This is a move, never a deletion, and `archive/`
is NOT the place for it: that is for dead/superseded content, while delivered-sprint history
is still-consulted reference. (`[user-specified]` 2026-07-23 — a 1500-line roadmap of mostly
history triggered this step.)

### 5. Record real token totals
Record the round's actual token figures in the roadmap sprint entry (or wherever this project
keeps sprint status): the session total, plus per-fleet totals when a workflow ran (`/usage`,
`/workflows`, the run journal). Cost decisions need real figures — before this step existed,
none were recorded anywhere and every estimate was guesswork.

### 6. Graduate durable lessons
Anything learned that outlives this feature (a pitfall, a pattern that worked, a hard-won
constraint) goes into `docs/lessons_learned.md` (if the project keeps one) — concise, with the
rule to follow going forward. Session-only details stay out.

### 7. Archive the plan
Prepend a short status note to the plan file (delivered what/when; where the leftovers went), then
move it to `archive/YYYY-MM-DD_PLAN_<name>.md`. Fix any references that pointed at the old path.

### 8. Memory
If auto-memory is active and the project's cross-session state changed (e.g. an ongoing goal is
now done), update it — don't leave memory pointing at closed work.

### 9. Alignment audit — LAST, once everything else has moved
Only now delegate the doc audit, to the project's **doc-keeper agent** if it has one, otherwise a
**sonnet** general agent. Run it inline only for a trivially small project; for a substantial doc
tree run the saved **doc-sweep workflow** instead (`/doc-sweep` has the recipe and caps).

Three rules, each learned the hard way (`[user-specified]` 2026-07-30):

- **Last, not early.** Files have moved by now — the plan is archived, the roadmap rewritten. An
  audit run before those moves cannot see the references they broke.
- **Point it at the whole doc tree, not at a list of your changes.** Its value is finding drift
  from EARLIER sprints that nobody looks at any more. Hand it your diff and it just reads your
  to-do list back to you, which is genuine double work.
- **Do not edit while it runs.** It reads a snapshot; concurrent edits make its findings wrong in
  both directions.

Apply the findings in the main thread (read each target before editing). If it reports something
that contradicts how the sprint was described, surface it — don't silently "fix" it.

### 10. Report and hand back
Summarize: what was verified/updated, where the leftovers landed, what was archived, anything
that contradicted expectations (surface it, don't silently "fix" it). Offer — but don't perform —
the commit.
