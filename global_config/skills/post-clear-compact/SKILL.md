---
name: post-clear-compact
description: Re-orient at the start of a NEW session after freeing up context, so you continue without retyping. Reads the session carryover (if present) plus the project docs, reports where things stand, proposes the next step WITHOUT doing it, and archives the carryover. Trigger on "post-clear-compact", "catch up", "praat me bij", "waar staan we", "verder na de clear/compact". Works with or without a carryover file. Counterpart to /pre-clear-compact.
---

# post-clear-compact — pick up in a fresh session

Personal counterpart to Claude Code's built-in post-compaction behavior. Run this as the first
command in a new session (after `/clear` or `/compact`) to get re-oriented: it reads the project
back in, reports where things stand, and proposes the next step — without starting it.

Works **with or without** a carryover file: if `sessions/SESSION_CARRYOVER.md` exists it is the
primary source; if not (e.g. after an automatic compaction you did not trigger), it just reads
the project docs and still catches you up.

## Hard rules for this skill

- **Propose, don't execute.** End with a suggested next step and STOP — same discipline as
  `/custom_plan`. Do not edit code, plan, or build until the user says so.
- **Read-only** except the single archive move in step 4.
- **English** in anything written.

## Steps

### 1. Read in order (skip what's absent)
1. `AI_INSTRUCTIONS.md` — project rules, hierarchy, agents
2. `README.md` — overview + status
3. `docs/architecture.md` / `roadmap.md` / `docs/lessons_learned.md` — as present
4. `sessions/SESSION_CARRYOVER.md` — the handover, if present
5. `git status --short` + `git log --oneline -5` — the real current state

### 2. Report where things stand
Short summary: what was last delivered, the key decisions, the working conventions to honor,
and the current tree state. Ground it in what you just read (cite files) — do not guess.

### 3. Propose the next step (do NOT execute)
One concrete suggestion for what to do next, with the reasoning and which skill/agent it uses.
If the carryover named a next step, lead with that. Then stop and wait for the user.

### 4. Archive the carryover
If `sessions/SESSION_CARRYOVER.md` existed, move it to `archive/<YYYY-MM-DD>_SESSION_CARRYOVER.md`
(real date; create `archive/` if missing) so it is never mistaken for a still-active handover.
If there was no carryover, skip this.

## Notes
- The archive move is why an old carryover never lingers as "still current" — once you have been
  caught up, it is dated and filed, and the next `/pre-clear-compact` starts a fresh one.
