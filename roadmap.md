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
- [ ] Optional plan-rename hook; agent templates for common project types; install script

## Status

| Sprint | Status | Notes |
|--------|--------|-------|
| Sprint 1 | Done | Initial project setup |
| Sprint 2 | Done | UX improvements, folder rename, README expansion |
| Sprint 3 | Done | Opus 4.8 realignment (format, skills, output style, live + field-test) |
| Sprint 4 | In progress | Own-docs + first commit done; optional hook/templates/install-script deferred |
