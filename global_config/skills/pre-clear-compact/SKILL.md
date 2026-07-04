---
name: pre-clear-compact
description: Write a durable session-carryover note BEFORE freeing up context, so the next session continues with no loss — a full replacement for the built-in /compact, not a thin summary. Use at any point you want to free tokens: at a clean sprint/feature boundary (thin note + pointers) or mid-way through complex, unfinished work (full in-flight capture). Trigger on "pre-clear-compact", "schrijf carryover", "carryover schrijven", "leg context vast voor de compact", "bewaar context voor nieuwe sessie". Writes sessions/SESSION_CARRYOVER.md and STOPS. Counterpart: /post-clear-handover picks it up.
---

# pre-clear-compact — save a durable session carryover before clearing context

A full replacement for Claude Code's built-in `/compact`, meant to leave you never needing it. It
runs while the whole session is still in context, so it can capture everything `/compact` would —
but it writes the result to a durable, curated, git-tracked file instead of a lossy in-context
summary. The next session reads it with `/post-clear-handover`.

The goal is **no degradation vs `/compact`**: nothing that matters is lost when you `/clear`. It
gets there by scaling to the situation instead of always writing the same thin note.

**The acceptance test:** a fresh session with no memory of this conversation must be able to resume
the work using only this note plus the repo. That is the bar in every situation — a quiet boundary
or a messy mid-feature session alike. If the note doesn't pass it, it is not done.

## Adapt the depth to the state of the work

- **At a clean boundary** (work committed, feature closed, docs current): a thin note is enough —
  status, decisions, conventions, next step — because the persistent docs already carry the detail.
  Point at them, don't duplicate.
- **Mid-way through complex or unfinished work** (uncommitted changes, a half-built feature, a live
  debugging trail): write a fuller note that captures the in-flight state that lives nowhere else
  yet. This is the part `/compact` would otherwise preserve — so preserve it here, in full.

"Keep it short" is the default for the easy case, never a cap that drops real state.

## Hard rules for this skill

- **Write exactly one file:** `sessions/SESSION_CARRYOVER.md` (create the `sessions/` folder if
  missing). Overwrite any existing carryover — it is a single rolling file.
- **No loss.** Before finishing, scan the whole session for anything not already in a commit, a
  doc, or this note that would be lost on `/clear` — and put it in the note. This scan is what makes
  the skill a real `/compact` replacement rather than a lossy summary.
- **English**, like every other file in the repo, even when the conversation is in Dutch.
- **Point, don't duplicate** what is already durable (roadmap status, architecture/ADR decisions).
  But only point at docs you'd trust blind: if a doc might be stale, write the fact into the note
  itself so the note stands alone.
- **Stop after writing.** Do not clear, compact, commit, or start new work. Hand back.

## Steps

### 1. Take stock (read-only) — you have the whole session; use all of it
- `git log --oneline -5` and `git status --short` — last delivery, and crucially whether the tree is
  clean or holds uncommitted in-flight work.
- `roadmap.md` / the status file — what's next; `docs/architecture.md`, `docs/lessons_learned.md`,
  and the active plan if present.
- Re-read the session itself for what never reached a doc or commit: decisions made, approaches
  tried and rejected, exact errors / test state, and open questions.

### 2. Write sessions/SESSION_CARRYOVER.md
Concrete — real file paths, real commit hashes. The section prompts below are minimums, not caps:
write what the next session needs, not the shortest thing that fills the heading. Always cover:

```markdown
# Session carryover — <project> — <YYYY-MM-DD>

**Project & status (one line):** what this is, its goal, and where it stands overall — so the next
session is grounded before it even opens the docs. A pointer is fine if `AI_INSTRUCTIONS`/`README`
already say it clearly; spell it out if they don't.

## Done
What was delivered/committed (commit hash; pushed or not).

## Key decisions
Load-bearing choices + pointers (e.g. "see docs/architecture.md ADR-5"). Don't restate.

## Next step
The one concrete next action, and via which skill (e.g. "/custom_plan sprint2").

## Working conventions (important)
The project-specific way of working that automatic compaction would drop — especially anything the
user corrected or instructed during this session that is written down nowhere else.

## Watch-outs
Open tensions / risks not captured elsewhere.
```

**When work is unfinished, add a `## Work in progress` section** — the in-flight state `/compact`
would otherwise hold, and the whole reason this can replace it without loss:
- What is half-done: which files/functions, and the approach being taken.
- Approaches already tried and rejected, and why (so the next session doesn't repeat them).
- Exact current error / failing test / debugging state.
- Open questions and the precise next micro-step to resume on.

Drop sections with nothing to say; expand the ones that carry real state. Scale the whole note to
the complexity of what actually happened this session — thin when trivial, thorough when not.

### 3. Verify — the no-loss pass
With the note written, re-read the session once more and ask: what would a fresh session still not
know? Decisions and their why, user corrections given along the way, rejected approaches, exact
errors, unfinished edits. Add whatever is missing. Then apply the acceptance test: can the work be
resumed from this note + the repo alone? Only hand back when the answer is yes.

### 4. Stop and hand back
Tell the user:
- The carryover is at `sessions/SESSION_CARRYOVER.md` — review/edit it.
- Commit it (so it travels in git), then free up context with `/clear`.
- In the new session, run `/post-clear-handover` to pick up where you left off.

Do not proceed further.

## Notes
- This is built to remove the need for `/compact`: it runs before the wipe with the full session in
  context and writes a durable, curated file, so it matches `/compact`'s coverage and beats it on
  persistence, precision, and reviewability — provided the no-loss scan in step 2 is done honestly.
- `/clear` after this is cheaper than `/compact` and avoids summary drift; the carryover is the
  source of truth the next session rehydrates from.
