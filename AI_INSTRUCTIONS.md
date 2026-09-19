# AI Instructions — claude-code-setup

## Project Overview

This is a template repository for setting up and managing global Claude Code configuration. It contains the files (CLAUDE.md, settings.json, skills) that should be copied to `~/.claude/` on any machine. The repository itself is mostly static and serves as version-controlled source of truth for global Claude Code setup.

## Rules of this project

The global `CLAUDE.md` holds the rules that apply in every project. These hold only here:

- **No build tools, no automation.** The repo is files plus one sync script.
- **Other projects stay unnamed** — this repository is public. Another project of the user is referred to by what it is ("a larger sibling project", "another project"), never by its name — not in docs, not in plans, not in commit messages. The one exception is a functional path a skill needs to work, which keeps its real value behind the `__HOME__` placeholder `install.sh` expands
- **`global_config/` is the source; `~/.claude/` is the copy.** Edit here, then `./install.sh install`.
  A change made directly in `~/.claude/` comes back with `./install.sh pull` before anything else.
- **An instruction change is tested where it is used**: a change to a skill is run in a real project
  before the sprint closes.

## Workflow

The sprint cycle and the planning rules are in the global `CLAUDE.md`. Specific to this repo: at the
close, the doc-keeper audit runs last, and `./install.sh diff` must report "in sync" before the commit.
Progress is tracked in `roadmap.md`; delivered sprints and versions move to `docs/history/`.

## Project Hierarchy

This is the single source of truth for the project file structure. It lists every folder with its
purpose, the core files, and the files another document or an agent points at by name — never
status, counts or dates. Every other file points at a document by its path from the project root
and never repeats this tree.

```
claude-code-setup/
├── AI_INSTRUCTIONS.md              # This file — project rules, hierarchy, agents, skills
├── README.md                       # Overview, which file does what, quick start, the skills
├── roadmap.md                      # Sprint plan and status
├── install.sh                      # Sync script: diff / install / pull between repo and ~/.claude/
├── .gitignore                      # Ignores archive/, so archived files stay out of the public repo
├── concepts/                       # Concept and early design thinking
│   └── concept.md                  # Concept, diagrams, technical decisions
├── docs/                           # Category folders only — nothing loose in its root
│   ├── history/                    # Delivered work moved out of living status docs, verbatim
│   │   ├── roadmap_history.md      # Delivered sprints, newest first — a dated record; roadmap.md points here
│   │   └── version_history.md      # What changed per version, newest first — a dated record; README.md points here
│   ├── model_alignment/            # Why the format looks the way it does, per model generation
│   │   ├── opus_4_8_alignment.md   # Origin story of the format — the ten principles
│   │   ├── opus_5_alignment.md     # Current model guidance: what to delete, effort levels — cited from outside this repo by /project-setup and /realign
│   │   └── opus_5_communication_friction.md  # Why conversation goes wrong, and the rules written for it — cited from outside this repo by /realign
│   └── prompting_guides/           # Dated snapshots of Anthropic's prompting guides; `url:` and `fetched:` in each header
├── global_config/                  # The files install.sh copies to ~/.claude/ (mirrors its layout)
│   ├── CLAUDE.md                   # Global CLAUDE.md, loaded every session
│   ├── settings.json               # Global settings
│   ├── output-styles/
│   │   └── personal-voice.md       # Tone/voice output style (on by default via outputStyle)
│   ├── skills/                     # One folder per skill — the Skills table below is the list
│   └── workflows/                  # Saved workflows — the Saved-workflows table below is the list
├── claude_plans/                   # Plan files (PLAN_<topic>.md), git-committed
├── sessions/                       # SESSION_CARRYOVER.md — rolling handover, created on demand
├── archive/                        # Outdated content with a date prefix; git-ignored, so local only
└── .claude/
    ├── settings.json               # Project-level Claude settings (plansDirectory: ./claude_plans)
    └── agents/
        ├── doc-keeper.md           # Documentation audit agent
        └── prompt-expert.md        # Judges instruction changes before they ship (temporary)
```

## Agents

| Agent | Model | File | When to use |
|-------|-------|------|-------------|
| doc-keeper | `sonnet` | `.claude/agents/doc-keeper.md` | After making changes — to verify docs still reflect reality. When asked to clean up, audit, or organize documentation. |
| prompt-expert | `fable` | `.claude/agents/prompt-expert.md` | Before adding, rewording or deleting a rule in CLAUDE.md, an output style, a skill or an agent — judges whether it will bind, whether the wording is right, and whether the channel is right. Reads the official docs first; reports only. |

**Two deliberate exceptions on `prompt-expert`, so a later audit does not "fix" them:**
it is pinned to `fable` rather than `opus`, because getting the register of this setup right has
proved hard and reasoning quality is the whole point of the agent; and it is deliberately **not**
distributed — it lives only here, is not in `global_config/`, and `/project-setup` does not
generate it. It is useful while this repository is being tuned and is meant to be deleted when
that work is done, not carried into other projects as a template.

## Skills (distributed via `global_config/skills/`)

| Skill | File | What it does |
|-------|------|-------------|
| `/project-setup` | `global_config/skills/project-setup/SKILL.md` | Scaffold a NEW project with the preferred structure, docs, agents, workflow. |
| `/realign-project` | `global_config/skills/realign-project/SKILL.md` | Realign an EXISTING project's docs to the current format (see `docs/model_alignment/opus_5_alignment.md`). Counterpart to `/project-setup`. |
| `/custom_plan` | `global_config/skills/custom_plan/SKILL.md` | Plan a sprint/feature read-only into `claude_plans/PLAN_<name>.md`, then stop. Replaces native plan mode (which auto-executes on approval). Build later on an explicit "implement PLAN_<name>". |
| `/feature-close` | `global_config/skills/feature-close/SKILL.md` | Post-delivery hygiene: verify docs/roadmap, carry leftovers to the backlog, record real token totals, graduate lessons, archive the plan with a date prefix. |
| `/doc-sweep` | `global_config/skills/doc-sweep/SKILL.md` | Run the doc-consistency sweep as a capped saved workflow (4–7 cluster readers + verifier + merger); small projects keep the single doc-keeper pass. |
| `/pre-clear-compact` | `global_config/skills/pre-clear-compact/SKILL.md` | Write a session carryover (`sessions/SESSION_CARRYOVER.md`) before freeing up context, then stop. |
| `/post-clear-handover` | `global_config/skills/post-clear-handover/SKILL.md` | Re-orient in a fresh session: read the carryover + docs, report, propose the next step, archive the carryover. |
| `/wireframe` | `global_config/skills/wireframe/SKILL.md` | Draw a screen in the local self-hosted Penpot and hand back a picture, instead of describing it in prose. |
| `/contained-browser` | `global_config/skills/contained-browser/SKILL.md` | Drive a headless Chromium in a container over MCP — never the user's own browser. |

## Saved workflows (distributed via `global_config/workflows/`)

| Workflow | File | What it does |
|----------|------|-------------|
| `doc-sweep` | `global_config/workflows/doc-sweep-fleet.js` | Read-only doc-consistency sweep: 4–7 cluster readers + 1 verifier + 1 merger. Invoked via `/doc-sweep`; state "+300k" in the invoking turn. |
| `milestone-review` | `global_config/workflows/milestone-review.js` | Whole-codebase review at milestones: 5 opus dimension-finders + 2 refuters per dimension + 1 synthesis (opus default; `synthesisModel: 'fable'` as explicit opt-in) into a dated review doc (`docs/Review_<date>.md`). Invoked by hand; state "+500k". |

Caps and invocation details live in each script's header comment (single home); `/doc-sweep`
restates the sweep's caps because it is that workflow's invocation point.
