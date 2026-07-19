# claude-code-setup — Concept Document

## Vision

Provide a single, version-controlled repository that contains everything needed to set up a consistent Claude Code environment on any machine. Clone the repo, copy the files, and you're ready to work with the same settings, skills, agents, and workflow conventions everywhere.

## Core Idea

```
+----------------------------+
|   claude-code-setup repo   |
|                            |
|  global_config/            |
|    ├── CLAUDE.md           |
|    ├── settings.json       |
|    ├── skills/             |
|    ├── workflows/          |
|    └── output-styles/      |
+-------------|--------------+
              |
        git clone + copy
              |
              v
+----------------------------+
|   ~/.claude/               |
|    ├── CLAUDE.md           |
|    ├── settings.json       |
|    ├── skills/             |
|    ├── workflows/          |
|    └── output-styles/      |
+----------------------------+
              |
        claude-code reads
              |
              v
+---------------------------+
|   Any new project         |
|    /project-setup         |
|    → consistent structure |
+---------------------------+
```

## System Context Diagram (C4 Level 1)

```
+----------+       clones        +--------------------+
|          | ------------------> |  claude-code-setup  |
|   User   |                     |  (Git repository)   |
|          | ----- copies -----> +--------------------+
+----------+    files to               |
      |         ~/.claude/             |
      |                                |
      v                                v
+----------+       reads         +--------------------+
|  Claude  | <------------------ |    ~/.claude/       |
|   Code   |    global config    | (Global config dir) |
+----------+                     +--------------------+
```

## Container Diagram (C4 Level 2)

```
+------------------------------------------------------+
|  claude-code-setup repository                         |
|                                                       |
|  +---------------------+   +----------------------+  |
|  | global_config/      |   | Project docs         |  |
|  |                     |   |  AI_INSTRUCTIONS.md  |  |
|  |  ├── CLAUDE.md      |   |  README.md           |  |
|  |  ├── settings.json  |   |  roadmap.md          |  |
|  |  ├── skills/        |   |  concepts/           |  |
|  |  ├── workflows/     |   |  docs/               |  |
|  |  └── output-styles/ |   |                      |  |
|  +---------------------+   +----------------------+  |
|         |                                             |
|    (copied to ~/.claude/)                             |
|                                                       |
|  +---------------------+   +----------------------+  |
|  | claude_plans/       |   | archive/             |  |
|  | (active plans)      |   | (completed items)    |  |
|  +---------------------+   +----------------------+  |
+------------------------------------------------------+
```

## Input / Output Design

| Phase | Input | Output |
|-------|-------|--------|
| **MVP (now)** | Git clone of this repo | Configured `~/.claude/` with CLAUDE.md, settings.json, skills/, output-styles/, workflows/ |
| **Later** | Additional skills, agents, settings tweaks | Updated global config files, new skill definitions |

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Storage format | Plain files (markdown, JSON) | Human-readable, easy to diff and version-control |
| Distribution | Git repository | Standard, portable, works offline |
| Installation | Manual copy | Simple, no tooling dependencies, user stays in control |
| Config structure | Mirrors `~/.claude/` layout | Direct copy without transformation |
| Documentation | AI_INSTRUCTIONS.md as single source of truth | Tool-agnostic, works with any AI assistant |

## Hardware / Constraints

None. This project contains only configuration files (markdown, JSON). No compute, GPU, or infrastructure requirements.

## Available Resources

| Resource | Location | Purpose |
|----------|----------|---------|
| Global CLAUDE.md | `global_config/CLAUDE.md` | Global workflow rules and conventions |
| Global settings.json | `global_config/settings.json` | Claude Code global settings |
| project-setup skill | `global_config/skills/project-setup/SKILL.md` | `/project-setup` — scaffold a new project |
| realign-project skill | `global_config/skills/realign-project/SKILL.md` | `/realign` — realign an existing project to the Opus 4.8 format |
| custom_plan skill | `global_config/skills/custom_plan/SKILL.md` | `/custom_plan` — read-only sprint/feature planning into `claude_plans/PLAN_<name>.md`, no auto-execute |
| feature-close skill | `global_config/skills/feature-close/SKILL.md` | `/feature-close` — post-delivery hygiene (docs check, backlog carry-over, token recording, archive the plan) |
| doc-sweep skill | `global_config/skills/doc-sweep/SKILL.md` | `/doc-sweep` — doc-consistency sweep as a capped workflow fleet |
| pre-clear-compact skill | `global_config/skills/pre-clear-compact/SKILL.md` | `/pre-clear-compact` — write a session carryover before freeing up context |
| post-clear-handover skill | `global_config/skills/post-clear-handover/SKILL.md` | `/post-clear-handover` — re-orient in a fresh session, then archive the carryover |
| personal-voice output style | `global_config/output-styles/personal-voice.md` | Tone/voice output style — on by default via `outputStyle` in settings |
| doc-sweep workflow | `global_config/workflows/doc-sweep.js` | Saved workflow behind `/doc-sweep` (readers + verifier + merger) |
| milestone-review workflow | `global_config/workflows/milestone-review.js` | Saved workflow for the whole-codebase review at milestones |
| install script | `install.sh` | `diff` / `install` / `pull` between the repo and `~/.claude/` |

## Use Cases

### Primary
1. **New PC setup** — User clones repo, copies files to `~/.claude/`, has full Claude Code environment ready
2. **Share config** — User shares repo link with collaborators; they clone and apply the same setup
3. **Evolve settings** — User updates settings/skills in repo, commits changes, pulls on other machines

### Secondary
4. **Onboard projects** — After global setup, run `/project-setup` in any new project for consistent structure
5. **Audit setup** — Compare current `~/.claude/` against repo to detect drift

## Development Approach

- **Mostly static** — This repository changes infrequently
- **KISS** — Minimal structure, no build tools, no automation scripts
- **Version-controlled** — All changes tracked in git for history and sync
- **Iterate when needed** — Add new skills, update settings, evolve conventions over time
