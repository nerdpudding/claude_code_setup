# Plan: Improve Project Setup Skill, Folder Naming, and README

**Status: COMPLETED**

## Context

During the first run of `/project-setup` on this repository, several UX issues and missing documentation were identified. The project name prompt didn't let the user type a custom name, the skill doesn't detect whether it's in an existing project folder or a fresh start location, the folder name `Files_Used/PUT_IN_GLOBAL_CLAUDE_FOLDER/` is verbose, and the README lacks key explanations (global vs project config, skills vs agents, overwrite warning).

## Changes Completed

| # | What | Files | Status |
|---|------|-------|--------|
| 1 | Rename `Files_Used/PUT_IN_GLOBAL_CLAUDE_FOLDER/` to `global_config/` | Filesystem + 4 docs | Done |
| 2 | SKILL.md: Smart project name detection (Phase 1) | SKILL.md | Done |
| 3 | SKILL.md: Two-workflow detection — existing folder vs fresh start (Phase 1/2) | SKILL.md | Done |
| 4 | SKILL.md: Add project-specific skills option (Phase 5.5) | SKILL.md | Done |
| 5 | README: Expand with setup approaches, global vs project config, skills vs agents, overwrite warning | README.md | Done |
| 6 | Update all cross-references in project docs | AI_INSTRUCTIONS.md, concept.md, doc-keeper.md | Done |
| 7 | README: Quick Start Overview with file explanations, merged redundant sections | README.md | Done |
| 8 | README: Prerequisites section (Claude Code must be installed first) | README.md | Done |
| 9 | README: Slash commands explanation (`/project-setup` vs `/init`) | README.md | Done |
| 10 | README: "What `/project-setup` Creates" — full output structure, phases table, optional components | README.md | Done |
| 11 | README: "About this workflow" — explains this is a personal workflow example, not universal | README.md | Done |
| 12 | README: "Going Further" — MCP Servers, Hooks, Agent Teams, Server-managed settings with official links | README.md | Done |
| 13 | README: Subagents vs Agent Teams comparison table | README.md | Done |
| 14 | Neutral tone principle — avoid "we/our/us" in docs | AI_INSTRUCTIONS.md, doc-keeper.md | Done |
| 15 | Rename `concept_planning/` to `concepts/` | Filesystem + 6 docs | Done |
| 16 | Add `docs/` folder to standard project structure | Filesystem, AI_INSTRUCTIONS.md, README.md, SKILL.md | Done |

## Files Modified

| File | Type of change |
|------|---------------|
| `global_config/skills/project-setup/SKILL.md` | Phase 1 rewrite, Phase 2 rewrite, Phase 5.5 addition, `docs/` and `concepts/` in dir creation |
| `README.md` | Major rewrite — Quick Start Overview, prerequisites, slash commands, what it creates, workflow explanation, going further, path updates |
| `AI_INSTRUCTIONS.md` | Hierarchy path updates, `docs/` folder, neutral tone principle |
| `concepts/concept.md` | Path updates (folder rename + `concept_planning` → `concepts`) |
| `.claude/agents/doc-keeper.md` | Path reference updates, neutral tone rule |
| `roadmap.md` | Sprint 2 items added and completed |
| `todo_2026-02-17.md` | Sprint 2 tasks added |
