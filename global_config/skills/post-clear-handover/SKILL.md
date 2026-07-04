---
name: post-clear-handover
description: Start a fresh session from the handover written by /pre-clear-compact — reads sessions/SESSION_CARRYOVER.md first, then targeted project docs; reports where things stand, proposes the next step WITHOUT doing it, and archives the handover. Run as the first command after /clear in the pre-clear-compact flow. NOT meant for resuming after a plain built-in /compact (that leaves no handover doc); without a handover it falls back to reading the project docs. Trigger on "post-clear-handover", "praat me bij", "waar staan we", "verder na de clear". Counterpart to /pre-clear-compact.
---

# post-clear-handover — start the fresh session from the handover

Run this as the first command in a new session, right after the `/pre-clear-compact` → commit →
`/clear` sequence. It picks up `sessions/SESSION_CARRYOVER.md` — the handover the previous session
wrote — re-orients from it, reports where things stand, and proposes the next step without
starting it.

This is **not** a post-`/compact` skill: a plain built-in `/compact` leaves no handover doc behind,
so there is nothing to hand over from. If no carryover file exists (e.g. an automatic compaction
fired instead), it still catches you up — it falls back to reading the project docs — but its home
turf is the handover flow.

## Hard rules for this skill

- **Propose, don't execute.** End with a suggested next step and STOP — same discipline as
  `/custom_plan`. Do not edit code, plan, or build until the user says so.
- **Read-only** except the single archive move in step 4.
- **English** in anything written.

## Steps

### 1. Read — targeted, not a full re-onboarding
1. `sessions/SESSION_CARRYOVER.md` — the handover, the primary source. When it has a
   `Work in progress` section, that is the live state to resume from — read it closely.
2. `AI_INSTRUCTIONS.md` — project rules and conventions (follow its "Read first" order if it
   defines one).
3. `git status --short` + `git log --oneline -5` — the real current state.
4. Other docs (README, roadmap, architecture, lessons_learned) — only where the carryover points
   at them or where something is still unclear. The goal is to be *reminded*, not to re-read the
   whole project.

**No carryover file?** (e.g. after an automatic compaction) — then do the fuller read instead:
`AI_INSTRUCTIONS.md` → `README.md` → roadmap/architecture/lessons as present, plus the git state.

**Authority:** the carryover is written fresh, so trust it and git over any doc that contradicts
them. If a doc looks stale, say so in the report and suggest running `doc-keeper` — don't silently
follow the stale doc.

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
