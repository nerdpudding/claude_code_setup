# Example AI_INSTRUCTIONS.md

> **This is a reference example** — showing what a generated `AI_INSTRUCTIONS.md` should look like after running `/project-setup`. The actual content is tailored to each project based on user input. This file is NOT used by any project directly.
>
> Fictional project: `task-api` — a REST API for task management.

---

# AI Instructions — task-api

## Project Overview

Task-api is a REST API for managing tasks and projects, built with Python/FastAPI and PostgreSQL. It provides CRUD endpoints for tasks, project grouping, and basic user authentication.

## Principles

- **SOLID, DRY, KISS** — Default yes, adapt to project needs
- **One source of truth** — No duplicate information across documents
- **Never delete, always archive** — Move outdated content to `archive/` with date prefix
- **Modularity & flexibility** — Important for most projects
- **English only** — ALL code, docs, comments, plans, and commit messages MUST be in English — always, no exceptions. The user often communicates in Dutch, but everything written to files must be English.
- **Keep everything up to date** — After any change, verify that docs, agent instructions, and config files still reflect reality. Stale docs are worse than no docs.
- **Learn from mistakes** — When an approach fails or wastes effort, document it in `docs/lessons_learned.md`. This file is persistent context for AI assistants to avoid repeating the same mistakes.
- **Build on existing work** — Evolve code and docs, don't rewrite from scratch
- **Use agents** — Check `.claude/agents/` for specialized help before starting tasks. After making changes, update agent instructions if they reference affected files or behavior.
- **Local-first** — Run everything locally where possible
- **Docker where possible** — Use Docker for services, databases, reproducible environments

## Workflow

1. **Plan** — Use plan mode for any non-trivial changes
2. **Ask approval** — Confirm approach before making changes
3. **Implement** — Make the changes
4. **Test** — Run tests, verify behavior
5. **Iterate** — Refine based on results
6. **Clean up** — Archive completed plans, update trackers

## Project Hierarchy

This is the single source of truth for the project file structure:

```
task-api/
├── AI_INSTRUCTIONS.md              # This file — project rules, hierarchy, agents
├── README.md                       # Overview, quick start, documentation links
├── roadmap.md                      # Sprint plan and status tracking
├── todo_<date>.md                  # Daily task tracker (temp, archive when done)
├── concepts/
│   └── concept.md                  # Detailed concept, diagrams, technical decisions
├── docs/                           # Guides, detailed documentation, specs
│   └── lessons_learned.md          # Ongoing log of what worked and what didn't
├── src/
│   ├── main.py                     # FastAPI app entry point
│   ├── models/                     # SQLAlchemy models
│   ├── routes/                     # API route handlers
│   ├── schemas/                    # Pydantic schemas
│   └── services/                   # Business logic
├── tests/                          # Test suite
├── claude_plans/                   # Active plans from plan mode
├── archive/                        # Archived plans, schedules, outdated docs
├── .claude/
│   ├── settings.json               # Project-level Claude settings
│   └── agents/
│       └── doc-keeper.md           # Documentation audit agent
├── docker-compose.yml              # Local development services
├── Dockerfile                      # Application container
├── requirements.txt                # Python dependencies
└── .env.example                    # Environment variable template
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
2. `docs/lessons_learned.md`
3. Active task tracker (`todo_<date>.md`)
4. Active plans in `claude_plans/`
5. `concepts/concept.md`
6. List contents of `claude_plans/`, `docs/`, `archive/`
7. Continue with the task
