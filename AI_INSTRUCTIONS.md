# AI Instructions — claude-code-setup

## Project Overview

This is a template repository for setting up and managing global Claude Code configuration. It contains the files (CLAUDE.md, settings.json, skills) that should be copied to `~/.claude/` on any machine. The repository itself is mostly static and serves as version-controlled source of truth for global Claude Code setup.

## Principles

- **KISS** — Minimal structure, no build tools, no automation
- **One source of truth** — No duplicate information across documents
- **Never delete, always archive** — Move outdated content to `archive/` with date prefix
- **English only** — All files, comments, and commit messages
- **Neutral tone in docs** — Avoid "we", "our", "us" in documentation. Keep it general and impersonal unless the user explicitly asks for personal or team-oriented language
- **Build on existing work** — Evolve settings and skills, don't rewrite from scratch
- **Use agents** — Check `.claude/agents/` for specialized help before starting tasks

## Workflow

1. **Plan** — Use plan mode for any non-trivial changes
2. **Ask approval** — Confirm approach before making changes
3. **Implement** — Make the changes
4. **Verify** — Run doc-keeper or manually check consistency
5. **Clean up** — Archive completed plans, update trackers

## Project Hierarchy

This is the single source of truth for the project file structure:

```
claude-code-setup/
├── AI_INSTRUCTIONS.md              # This file — project rules, hierarchy, agents
├── README.md                       # Overview, quick start, documentation links
├── roadmap.md                      # Sprint plan and status tracking
├── concepts/
│   └── concept.md                  # Detailed concept, diagrams, technical decisions
├── docs/                              # Guides, detailed documentation, specs
├── global_config/                     # Files to copy to ~/.claude/
│   ├── CLAUDE.md                      # Global CLAUDE.md
│   ├── settings.json                  # Global settings
│   └── skills/
│       └── project-setup/
│           └── SKILL.md               # Project setup skill definition
├── claude_plans/                   # Active plans from plan mode
├── archive/                        # Archived plans, schedules, outdated docs
├── .claude/
│   ├── settings.json               # Project-level Claude settings
│   └── agents/
│       └── doc-keeper.md           # Documentation audit agent
└── todo_<date>.md                  # Daily task tracker (temp, archive when done)
```

## Agents

| Agent | File | When to use |
|-------|------|-------------|
| doc-keeper | `.claude/agents/doc-keeper.md` | After making changes — to verify docs still reflect reality. When asked to clean up, audit, or organize documentation. |

## Plan Rules

- Plans go in `claude_plans/` (configured in `.claude/settings.json`)
- Rename plan files immediately after exiting plan mode: `PLAN_<topic>.md`
- Archive completed plans to `archive/` with date prefix
- Update progress in `roadmap.md` (single tracker for this project)

## Archive Rules

Move to `archive/` with date prefix (`YYYY-MM-DD_filename.md`):
- Completed plans
- Daily task trackers after the day is done
- Outdated documentation

## Git Commits

- No AI attribution in commit messages
- Only commit when explicitly asked
- Write normal, descriptive commit messages

## After Compaction

Read order:
1. This file (`AI_INSTRUCTIONS.md`)
2. Active task tracker (`todo_<date>.md`)
3. Active plans in `claude_plans/`
4. `concepts/concept.md`
5. Continue with the task
