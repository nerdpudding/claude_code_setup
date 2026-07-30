# Example AI_INSTRUCTIONS.md

> **This is a reference EXAMPLE** — it shows the shape a generated `AI_INSTRUCTIONS.md` should
> take after running `/project-setup`. The real content is tailored per project. Nothing uses this
> file directly.
>
> It demonstrates the Opus 4.8-aligned format: a tiered **Hard rules / Preferences** split, a
> single-homed project hierarchy, an agents table, source-of-truth pointers, and workflow depth
> that scales to task size. Keep the whole thing well under 200 lines — the always-loaded surface
> stays lean.
>
> Fictional project: `task-api` — a REST API for task management.

---

# AI Instructions — task-api

Project rules and structure for `task-api`. Two tiers: **Hard rules** are invariants — never
violate them. **Preferences** are defaults — apply by judgment, override when a task is genuinely
better served otherwise. Reserve absolutes for the Hard-rules block.

## Project overview

A REST API for managing tasks and projects, built with Python/FastAPI and PostgreSQL. Provides
CRUD endpoints for tasks, project grouping, and basic user authentication. Local-first; services
run via Docker Compose.

## Hard rules (never violate)

- **English in files.** All code, docs, comments, plans, and commit messages are English — even
  when the conversation is in Dutch.
- **No AI attribution in commits.** No "Co-Authored-By" or "Generated with Claude". (Also enforced
  via `includeCoAuthoredBy: false` in settings — keep both.)
- **Commit and push only when asked.** Don't commit, push, or open PRs unprompted.
- **Never commit secrets** — `.env`, credentials, API keys. Use `.env.example` for templates.
- **Don't delete or overwrite files you didn't create** without surfacing it first. If a file's
  content contradicts how it's described, stop and report rather than proceeding.

## Preferences (use judgment; override when the task is better served)

- **Scale workflow depth to task size.** Match ceremony to the work: a one-line fix or a question
  takes a short path; a multi-file feature warrants planning, structure, and review. Don't run the
  full process on trivial work, and don't under-build substantial work.
- **SOLID, DRY, KISS** — pragmatically. Modularity where it pays off.
- **One source of truth.** Each fact lives in one place; reference it elsewhere, don't duplicate.
- **Build on existing work** — evolve code and docs rather than rewriting from scratch.
- **Keep docs current** — after a change, fix the docs that describe it. Stale docs mislead.
- **Learn from mistakes** — when an approach fails or wastes effort, log it in
  `docs/lessons_learned.md` so it isn't repeated.
- **Use the right agent** for its domain (see the table below; check `.claude/agents/`).
- **Ask when conventions are unclear** rather than guessing.
- **Local-first, Docker where possible** — run services, databases, and reproducible environments
  in containers.

## Workflow (depth scales to task size)

Trivial change or a question → just do it / answer. Non-trivial change → plan first, confirm the
approach, implement, test, then clean up (archive completed plans, update the tracker).

## Project hierarchy

Single source of truth for the file structure. Minimal by default — add directories only as the
project needs them.

```
task-api/
├── AI_INSTRUCTIONS.md          # This file — rules, hierarchy, agents (read first, tool-agnostic)
├── README.md                   # Overview, quick start, doc links
├── roadmap.md                  # Sprint plan and status tracking
├── todo_<date>.md              # Daily task tracker (temp → archive/)
├── concepts/concept.md         # Concept, diagrams, technical decisions
├── docs/                       # Guides, specs; docs/lessons_learned.md = what worked/didn't
├── src/
│   ├── main.py                 # FastAPI app entry point
│   ├── models/                 # SQLAlchemy models
│   ├── routes/                 # API route handlers
│   ├── schemas/                # Pydantic schemas
│   └── services/               # Business logic
├── tests/                      # Test suite
├── claude_plans/               # Plan files (PLAN_<topic>.md), git-committed
├── archive/                    # Outdated content (never delete — archive with date prefix)
├── .claude/
│   ├── settings.json           # Project settings (plansDirectory: ./claude_plans)
│   └── agents/doc-keeper.md    # Documentation audit agent
├── docker-compose.yml          # Local development services
├── Dockerfile                  # Application container
├── requirements.txt            # Python dependencies
└── .env.example                # Environment variable template
```

## Agents

| Agent | File | Model | Use proactively when |
|-------|------|-------|----------------------|
| doc-keeper | `.claude/agents/doc-keeper.md` | sonnet | After changes that touch docs/structure, or when asked to audit, clean up, or organize documentation. Verifies docs still reflect reality. |

Add project-specific agents (e.g. `db-migrator`, `api-tester`) as needs grow; keep one owner per
domain and list each here.

## Source of truth

- **Project rules, hierarchy, agents** → this file (`AI_INSTRUCTIONS.md`).
- **Actual filesystem** → what really exists on disk; docs conform to it, not the reverse.
- **Cross-project preferences and tone** → global `~/.claude/CLAUDE.md` (don't restate here).
- **Volatile cross-session state** → native auto-memory (`MEMORY.md`), not a hand-kept prose log.
- One home per fact: README and other docs reference this hierarchy, they don't duplicate it.

## Plan rules (plan → review → build later → close)

Plans live in `claude_plans/` (set via `plansDirectory`), are git-committed, and are named after
the feature or sprint (`PLAN_<topic>.md`).

1. **Plan:** use `/custom_plan <name>` — it researches read-only, writes
   `claude_plans/PLAN_<name>.md`, and STOPS. Nothing runs. (Avoid native plan mode for
   build-later planning — approving its plan starts implementation immediately.)
2. **Review:** read / edit / commit the plan file at leisure.
3. **Build later, on explicit instruction:** implement only when told to (e.g. "implement
   PLAN_<name>"). A written plan is never a signal to start coding.
4. **Close when delivered:** run `/feature-close` — docs check, leftovers to the backlog, the
   plan archived to `archive/` with a `YYYY-MM-DD_` prefix.

Track progress in one place — `roadmap.md` for this project. Don't duplicate status across files.

## Archive rules

Move to `archive/` with a date prefix (`YYYY-MM-DD_filename.md`), never delete: completed plans,
daily task trackers after the day is done, and outdated documentation.

## Git commits

No AI attribution; commit only when asked; write normal, descriptive messages.

## After compaction

Re-read `AI_INSTRUCTIONS.md` and `docs/lessons_learned.md` (if it exists), then continue. Native
auto-memory holds volatile cross-session state — don't reconstruct it by hand.
