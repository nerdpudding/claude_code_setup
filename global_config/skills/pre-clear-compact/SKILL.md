---
name: pre-clear-compact
description: Write a curated session-carryover note BEFORE freeing up context, so the next session continues without retyping. Use at a sprint/feature boundary when you decide to free tokens with /clear (or /compact) but want to keep status, key decisions, working conventions, and the exact next step. Trigger on "pre-clear-compact", "schrijf carryover", "carryover schrijven", "leg context vast voor de compact", "bewaar context voor nieuwe sessie". Writes sessions/SESSION_CARRYOVER.md and STOPS. Counterpart: /post-clear-compact picks it up in the new session.
---

# pre-clear-compact — save a session carryover before clearing context

Personal counterpart to Claude Code's built-in `/compact`. Instead of leaning on the automatic
summary (lossy and uncurated), this writes a short, deliberate handover note that the NEXT
session reads with `/post-clear-compact`. Use it at a boundary — usually right after
`/feature-close` — when you decide to free up tokens rather than keep working in the same
context.

The point is to capture what automatic compaction tends to drop: the project's specific
working conventions, the watch-outs that live nowhere in a doc, and the exact next step.

## Hard rules for this skill

- **Write exactly one file:** `sessions/SESSION_CARRYOVER.md` (create the `sessions/` folder if
  missing). Overwrite any existing carryover — it is a single rolling file.
- **English**, like every other file in the repo, even when the conversation is in Dutch.
- **Point, don't duplicate.** Status that already lives in `roadmap.md`, decisions in
  `docs/architecture.md`/ADRs, etc. → reference them. The carryover holds what is NOT already
  written down (conventions, watch-outs, precise next step), not a copy of the roadmap.
- **Stop after writing.** Do not clear, compact, commit, or start new work. Hand back with the
  next actions for the user.

## Steps

### 1. Read the current state (read-only)
Gather from what exists — skip what the project doesn't have:
- `git log --oneline -5` and `git status --short` — last delivery, clean/dirty tree.
- `roadmap.md` (or the project's status file) — what's next.
- The just-closed plan (in `archive/` or `claude_plans/`) and `docs/lessons_learned.md`.

### 2. Write sessions/SESSION_CARRYOVER.md
Keep it short and concrete — real file paths, real commit hashes. Structure:

```markdown
# Session carryover — <project> — <YYYY-MM-DD>

## Done
What was delivered/committed this session (commit hash; pushed or not).

## Key decisions
The load-bearing choices + pointers (e.g. "see docs/architecture.md ADR-5"). Don't restate.

## Next step
The one concrete next action, and via which skill (e.g. "/custom_plan sprint2").

## Working conventions (important)
The project-specific way of working that automatic compaction would drop — e.g. delegate
implementation to agent X, plan via /custom_plan then build only on explicit "implement",
commit/push only on request.

## Watch-outs
Open tensions / risks not captured elsewhere (e.g. "feature Y conflicts with ADR-6").
```

Drop any section that has nothing to say. Scale the whole note to what was delivered.

### 3. Stop and hand back
Tell the user:
- The carryover is at `sessions/SESSION_CARRYOVER.md` — review/edit it.
- Commit it (so it travels in git), then free up context with `/clear` (cheapest) or `/compact`.
- In the new session, run `/post-clear-compact` to pick up where you left off.

Do not proceed further.

## Notes
- Why `/clear` over `/compact`: with a complete carryover plus your project docs as source of
  truth, `/clear` is cheaper and avoids summary drift. `/compact` also works — this skill does
  not care which you use afterward; it only writes the note.
