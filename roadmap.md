# Roadmap — claude-code-setup

## Sprint 1: Initial Setup (MVP)

- [x] Define project goals and use cases
- [x] Create directory structure
- [x] Create concept document
- [x] Create README.md
- [x] Create AI_INSTRUCTIONS.md
- [x] Create roadmap.md (this file)
- [x] Create daily task tracker
- [x] Create project-level .claude/settings.json
- [x] Create doc-keeper agent
- [x] Verify consistency across all documents
- [ ] Initialize git repository

## Sprint 2: UX Improvements & Documentation (Done)

- [x] Rename `Files_Used/PUT_IN_GLOBAL_CLAUDE_FOLDER/` to `global_config/`
- [x] Update all cross-references (AI_INSTRUCTIONS, concept.md, doc-keeper.md)
- [x] SKILL.md: Add context detection (existing folder vs fresh start)
- [x] SKILL.md: Smart project name suggestion from folder name
- [x] SKILL.md: Add Phase 5.5 for project-specific skills
- [x] README: Add Two Setup Approaches section
- [x] README: Add Global vs Project-Level Configuration section
- [x] README: Add Skills and Agents comparison section
- [x] README: Add overwrite warning to Quick Start
- [x] README: Add Customizing Skills section

## Sprint 3: Opus 4.8 Realignment (Done — 2026-05-30)

The setup was tuned for Opus 4.5/4.6 and felt heavier on 4.7/4.8 (a more literal, more agentic
model executes soft prose imperatives close to the letter). Diagnosed via multi-agent research +
adversarial verification; realigned the format. See `claude_plans/PLAN_opus_4_8_realign.md`.

- [x] Rewrite `global_config/CLAUDE.md` to tiered **Hard rules / Preferences** (was a flat ALWAYS/NEVER wall)
- [x] Add `global_config/output-styles/personal-voice.md` (tone style, `keep-coding-instructions: true`, on by default via `outputStyle`)
- [x] Modernize `project-setup` skill (scale-to-task-size; no "do not skip phases"; key-presence settings check)
- [x] Create `realign-project` skill (`/realign`) — existing-project counterpart to project-setup
- [x] Create `plan` skill (`/custom_plan`) — read-only sprint/feature planning into `claude_plans/PLAN_<name>.md`, no native plan mode (sidesteps approve-then-build)
- [x] Light-sync README, concept, AI_INSTRUCTIONS, doc-keeper, example_ai_instructions to the new format
- [x] Apply live to `~/.claude/` and field-test `/realign` on a real existing project

## Sprint 4: Finish & Extend (In progress)

- [x] Finish documenting the realignment in THIS repo's own docs (done 2026-05-30 doc-audit)
- [x] First-class `docs/opus_4_8_alignment.md` (the 10 alignment principles + the why) — file complete
- [x] Sync `global_config/settings.json` template to the new live defaults (effortLevel high, includeCoAuthoredBy:false, deny example) — done
- [x] Decide: wire `personal-voice` output style on by default — DONE, `outputStyle` set in settings (tone is single-homed in the style, removed from CLAUDE.md)
- [x] Initialize git repository / first commit — done (commit `4c20f43`)
- [x] Install script — done in Sprint 5 (`install.sh`)
- [ ] Optional plan-rename hook; agent templates for common project types

## Sprint 5: Fable 5 / field-test sync (Done — 2026-07-03)

Synced `global_config/` back from the live `~/.claude/` after field use (mainly SmartPrepper) and
the move to Claude Fable 5. See the v2.1 entry in `README.md` for the full change list.

- [x] Add `/feature-close` skill (post-delivery hygiene — counterpart to `/custom_plan`)
- [x] Pull field-tested skill refinements (agent model tiering in `project-setup` + `/realign`,
      tone single-homed in the output style, `custom_plan` research delegation)
- [x] Make agent token economy explicit everywhere agents are created: tiered model guidance
      (haiku/sonnet/opus; fable only on explicit user request, never as agent default) as a
      global `CLAUDE.md` preference, leading `project-setup` Phase 5, a Model column in the
      generated agents table, and `/realign` check 9
- [x] Sync `settings.json` (model `claude-fable-5[1m]` + fallback chain, `effortLevel: xhigh`,
      `last30days` plugin/marketplace) and `CLAUDE.md` (feature-close in the planning workflow)
- [x] Add `install.sh` (diff / install / pull) for new-machine setup and drift detection
- [x] Update repo docs (README, AI_INSTRUCTIONS, concept, example_ai_instructions) to match

## Sprint 6: Session carryover across compaction (Done — 2026-07-04)

Two skills to continue in a fresh session without retyping when freeing up context at a
sprint/feature boundary — the personal counterpart to the built-in `/compact`. See the v2.2 entry
in `README.md`.

- [x] Add `/pre-clear-compact` — writes a curated `sessions/SESSION_CARRYOVER.md` (status,
      decisions, conventions, next step; points at persistent docs, doesn't duplicate), then stops
- [x] Add `/post-clear-handover` — reads the carryover + docs, reports, proposes the next step
      without executing, archives the carryover with a date prefix
- [x] Add the `sessions/` convention to the global `CLAUDE.md` structure and `project-setup`
- [x] Document the flow in `CLAUDE.md` (Memory & compaction) and sync repo docs (README,
      AI_INSTRUCTIONS, concept)
- [x] Pin `theme: "auto"` in `global_config/settings.json` so `install.sh` keeps it consistent
      across machines instead of dropping or overriding it
- [x] Harden the skills into a full `/compact` replacement (no degradation): adaptive depth with a
      `Work in progress` capture for unfinished work + a no-loss scan in `/pre-clear-compact`
- [x] Refine the note quality bar (review pass on Fable 5): acceptance test — a fresh session must
      be able to resume from the note + repo alone; the no-loss scan is an explicit verify step;
      template prompts are minimums, not caps; the post skill reads the carryover FIRST, then
      targeted docs only as needed (be reminded, not re-onboarded), trusting carryover + git over
      stale docs
- [x] Rename `post-clear-compact` → `/post-clear-handover` — the post side follows the handover,
      it doesn't compact; its description now states it is not for resuming after a plain built-in
      `/compact` (that leaves no handover doc)
- [x] Field-test follow-ups (2026-07-04): first `/post-clear-handover` field test passed (~33.7k
      tokens after resume); added `pre-clear-compact` + `post-clear-handover` to `project-setup`
      Phase 0.4's global-skill check; corrected the pinned session `model` back to `opus[1m]`
      (Opus 4.8 daily driver, Fable 5 on-demand) and grounded `effortLevel: xhigh` in Anthropic's
      published recommendation for Opus 4.8/4.7 coding (model-dependent — `high` for Fable 5 /
      Sonnet 5)

Deferred (optional — left out to keep the flow simple: two commands, one file):
- A `SessionStart` hook (matcher `clear`/`compact`) that auto-injects the carryover, so
  `/post-clear-handover` is not needed after an unplanned auto-compaction.
- A "Compact Instructions" section in the global `CLAUDE.md` as a fallback for auto-compactions
  that fire before `/pre-clear-compact` runs.

## Status

| Sprint | Status | Notes |
|--------|--------|-------|
| Sprint 1 | Done | Initial project setup |
| Sprint 2 | Done | UX improvements, folder rename, README expansion |
| Sprint 3 | Done | Opus 4.8 realignment (format, skills, output style, live + field-test) |
| Sprint 4 | Done | Own-docs + first commit; install script landed in Sprint 5; hook/templates stay backlog |
| Sprint 5 | Done | Fable 5 / field-test sync: feature-close, skill refinements, settings, install.sh |
| Sprint 6 | Done | Session carryover skills (pre-/post-clear-handover) + sessions/ convention |
