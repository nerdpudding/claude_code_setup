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
├── install.sh                      # Sync script: diff / install / pull between repo and ~/.claude/
├── roadmap.md                      # Sprint plan and status tracking
├── concepts/
│   └── concept.md                  # Detailed concept, diagrams, technical decisions
├── docs/                              # Guides, detailed documentation, specs
│   ├── example_ai_instructions.md     # Reference example of a generated AI_INSTRUCTIONS.md
│   └── opus_4_8_alignment.md          # Why the format is tuned for Opus 4.8 (the 10 principles)
├── global_config/                     # Files to copy to ~/.claude/ (mirrors layout)
│   ├── CLAUDE.md                      # Global CLAUDE.md
│   ├── settings.json                  # Global settings
│   ├── skills/
│   │   ├── project-setup/SKILL.md     # /project-setup — scaffold a new project
│   │   ├── realign-project/SKILL.md   # /realign — realign an existing project to 4.8 format
│   │   ├── custom_plan/SKILL.md       # /custom_plan — read-only sprint/feature planning, no auto-execute
│   │   ├── feature-close/SKILL.md     # /feature-close — post-delivery hygiene (docs, backlog, archive)
│   │   ├── doc-sweep/SKILL.md         # /doc-sweep — doc-consistency sweep as a capped workflow fleet
│   │   ├── pre-clear-compact/SKILL.md # /pre-clear-compact — write session carryover before clearing context
│   │   └── post-clear-handover/SKILL.md # /post-clear-handover — re-orient in a fresh session, archive the carryover
│   ├── workflows/
│   │   ├── doc-sweep.js               # Saved workflow: parallel doc sweep (invoked via /doc-sweep)
│   │   └── milestone-review.js        # Saved workflow: whole-codebase review at milestones (by hand)
│   └── output-styles/
│       └── personal-voice.md          # Tone/voice output style (on by default via outputStyle)
├── claude_plans/                   # Active plans from plan mode
├── sessions/                       # SESSION_CARRYOVER.md — rolling handover (created by /pre-clear-compact, archived after handover)
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

## Skills (distributed via `global_config/skills/`)

| Skill | File | What it does |
|-------|------|-------------|
| `/project-setup` | `global_config/skills/project-setup/SKILL.md` | Scaffold a NEW project with the preferred structure, docs, agents, workflow. |
| `/realign` | `global_config/skills/realign-project/SKILL.md` | Realign an EXISTING project's docs to the Opus 4.8 format. Counterpart to `/project-setup`. |
| `/custom_plan` | `global_config/skills/custom_plan/SKILL.md` | Plan a sprint/feature read-only into `claude_plans/PLAN_<name>.md`, then stop. Replaces native plan mode (which auto-executes on approval). Build later on an explicit "implement PLAN_<name>". |
| `/feature-close` | `global_config/skills/feature-close/SKILL.md` | Post-delivery hygiene: verify docs/roadmap, carry leftovers to the backlog, record real token totals, graduate lessons, archive the plan with a date prefix. |
| `/doc-sweep` | `global_config/skills/doc-sweep/SKILL.md` | Run the doc-consistency sweep as a capped saved workflow (4–7 cluster readers + verifier + merger); small projects keep the single doc-keeper pass. |
| `/pre-clear-compact` | `global_config/skills/pre-clear-compact/SKILL.md` | Write a session carryover (`sessions/SESSION_CARRYOVER.md`) before freeing up context, then stop. |
| `/post-clear-handover` | `global_config/skills/post-clear-handover/SKILL.md` | Re-orient in a fresh session: read the carryover + docs, report, propose the next step, archive the carryover. |

## Saved workflows (distributed via `global_config/workflows/`)

| Workflow | File | What it does |
|----------|------|-------------|
| `doc-sweep` | `global_config/workflows/doc-sweep.js` | Read-only doc-consistency sweep: 4–7 cluster readers + 1 verifier + 1 merger. Invoked via `/doc-sweep`; state "+300k" in the invoking turn. |
| `milestone-review` | `global_config/workflows/milestone-review.js` | Whole-codebase review at milestones: 5 opus dimension-finders + 2 refuters per dimension + 1 synthesis (opus default; `synthesisModel: 'fable'` as explicit opt-in) into a plan file. Invoked by hand; state "+500k". |

Caps and invocation details live in each script's header comment (single home); `/doc-sweep`
restates the sweep's caps because it is that workflow's invocation point.

## Plan Rules (plan in-project; build only on explicit request)

- Plans go in `claude_plans/` (configured via `plansDirectory` in `.claude/settings.json`), git-committed,
  named after the feature/sprint (`PLAN_<topic>.md`).
- To plan without auto-building: use the `/custom_plan` skill (researches read-only, writes the plan file,
  stops), or ask for the plan written to `claude_plans/PLAN_<topic>.md` with "don't implement yet".
  Native plan mode starts implementing on approval and can't be overridden by prose — so use `/custom_plan`
  or the file-first flow instead of toggling plan mode. See `docs/opus_4_8_alignment.md`.
- Build later only on an explicit instruction (e.g. "implement PLAN_<name>") — saving ≠ approval.
- Archive completed plans to `archive/` with date prefix.
- Update progress in `roadmap.md` (single tracker for this project).

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
