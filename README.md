# claude-code-setup

Template repository for setting up and managing global Claude Code configuration, skills, and workflow settings.

## Table of Contents

- [Goal](#goal)
- [Quick Start Overview](#quick-start-overview)
- [Two Setup Approaches](#two-setup-approaches)
- [What `/project-setup` Creates](#what-project-setup-creates)
- [Global vs Project-Level Configuration](#global-vs-project-level-configuration)
- [Skills and Agents](#skills-and-agents)
- [Use Cases](#use-cases)
- [Customizing Skills](#customizing-skills)
- [Going Further](#going-further)
- [Development Approach](#development-approach)
- [Project Structure & Agents](#project-structure--agents)
- [Documentation](#documentation)

## Goal

Provide a single, version-controlled repository that contains everything needed to set up a consistent Claude Code environment on any machine. Clone, copy, and you're ready.

### About this workflow

This setup reflects **my personal workflow** for developing with Claude Code — it's an example, not a universal best practice. It may not match how you prefer to work, but it's a solid starting point you can adapt.

**What it's aimed at:** Rapid PoC-style development with structure. Fast iteration without chaos — you get a clear project skeleton, persistent documentation, and a repeatable flow, without enterprise-level overhead. The development cycle it encourages is: **setup project → define concept → plan → implement → test → iterate → update docs → commit**.

**Why `AI_INSTRUCTIONS.md` instead of just `CLAUDE.md`?** Claude Code already reads `CLAUDE.md` for global preferences. But I find a separate `AI_INSTRUCTIONS.md` in the project root more practical during development — it's easier to read, clearly scoped to the project, tool-agnostic (works with any AI assistant, not just Claude Code), and gives you a dedicated place to steer the AI with project-specific rules without cluttering the global config.

**Why project-local plans and archives?** Plans live in `claude_plans/` inside the project, not in a global Claude folder. Archives stay in the project's `archive/`. This keeps everything self-contained — each project is its own unit of work, easy to move, share, or revisit later.

**IDE and environment:** I use Claude Code in the terminal connected to VS Code, but nothing here depends on that. It works without an IDE, with other editors, or purely terminal-based — Claude Code handles the interaction, the files are just markdown and JSON.

**Not enterprise, but expandable.** This is built for quick personal development — get an idea, scaffold it, build it. But the structure scales: you can add more agents, more skills, more phases, CI/CD steps, or team conventions as your needs grow.

## Quick Start Overview

```
claude-code-setup repo          ~/.claude/ (target)
├── global_config/           →  ├── CLAUDE.md
│   ├── CLAUDE.md               ├── settings.json
│   ├── settings.json            └── skills/
│   └── skills/                      └── project-setup/
│       └── project-setup/
```

The `global_config/` folder contains three files that go into `~/.claude/`:

| File | What it does |
|------|-------------|
| `CLAUDE.md` | Global instructions for Claude Code — your workflow preferences, project structure conventions, plan mode rules. Applied to every session. |
| `settings.json` | Global settings — model selection, telemetry, timeouts, default permissions. |
| `skills/project-setup/SKILL.md` | The `/project-setup` skill — an interactive workflow that scaffolds any new project with consistent structure, docs, and agents. |

Both `CLAUDE.md` and skills can exist globally (`~/.claude/`) and project-specifically (`.claude/` in a project root). See [Global vs Project-Level Configuration](#global-vs-project-level-configuration) for details.

### Slash commands in Claude Code

Claude Code has built-in `/` commands you can type in the chat. No need to memorize them — just type `/` and a list of available commands appears to scroll through. Some common ones:

| Command | What it does |
|---------|-------------|
| `/help` | Show available commands |
| `/compact` | Compress conversation context |
| `/agents` | Manage project agents |
| `/init` | Initialize project settings |

This repository adds **`/project-setup`** as a custom slash command via the skills system. After copying the skill file to `~/.claude/skills/`, typing `/project-setup` in any Claude Code session launches the interactive project scaffolding workflow. You can create your own custom commands the same way.

**`/project-setup` vs `/init`:** The built-in `/init` generates a single `CLAUDE.md` by analyzing existing code — useful for quickly giving Claude context about a codebase. `/project-setup` is a full development environment scaffolding: it creates directory structure, foundational documents, agents, roadmap, and workflow conventions from scratch. Use `/init` for quick context on existing code, `/project-setup` for structured project setup.

### Prerequisites

This repository provides **configuration** for Claude Code — it does not install Claude Code itself. You need Claude Code installed and working first. See the [official Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code/overview) to get started.

### Installation

> **Warning:** If you already have files in `~/.claude/`, don't blindly overwrite them. Check your current settings first and either merge manually or back up before copying. If unsure, ask Claude to help compare and merge. If you just installed Claude Code and haven't customized anything yet, it's safe to copy directly.

```bash
# 1. Clone the repository
git clone <repo-url> claude-code-setup

# 2. (If you have existing ~/.claude/ files, back them up first)
# cp -r ~/.claude/ ~/.claude-backup/

# 3. Copy global config files to ~/.claude/
cp -r claude-code-setup/global_config/* ~/.claude/

# 4. Verify setup (optional)
# Open Claude Code in any project and run: /project-setup
# Select "check global setup" to verify everything is in place
```

## Two Setup Approaches

### A) Fresh start — from a generic directory (e.g. `~/repos`)

1. Clone this repo and copy global config (see [Quick Start Overview](#quick-start-overview))
2. Navigate to where you keep projects (e.g. `cd ~/repos`)
3. Run `/project-setup` — the skill detects you're in a generic directory and will create a new subfolder
4. Answer the prompts: project name, description, goals, etc.
5. The skill creates the full project structure inside a new `~/repos/<project-name>/` folder

### B) Existing project folder — already has files

1. Clone this repo and copy global config (see [Quick Start Overview](#quick-start-overview))
2. Navigate into your existing project (e.g. `cd ~/repos/my-app`)
3. Run `/project-setup` — the skill detects project files and works IN the current directory
4. It suggests the folder name as the project name (you can override)
5. Only missing subdirectories are created; existing files are preserved

## What `/project-setup` Creates

The skill walks through 7 phases interactively. Here's what you end up with:

```
your-project/
├── AI_INSTRUCTIONS.md          # Project rules, file hierarchy, agents table (source of truth)
├── README.md                   # Project overview, goals, architecture, use cases
├── roadmap.md                  # Sprint plan with checkboxes
├── todo_<date>.md              # Daily task tracker
├── concepts/
│   └── concept.md              # Detailed concept, diagrams, technical decisions
├── docs/                       # Guides, detailed documentation, specs
├── claude_plans/               # Active plans from plan mode
├── archive/                    # Completed plans, old trackers (never delete, always archive)
└── .claude/
    ├── settings.json           # Project-level settings (plans directory, etc.)
    └── agents/
        └── doc-keeper.md       # Documentation audit agent (optional)
```

### Phases overview

| Phase | What happens | Required? |
|-------|-------------|-----------|
| 0. Environment check | Verify your global `~/.claude/` setup is correct | Optional — on request |
| 1. Define | Detect context (existing folder vs fresh start), gather project name, goals, use cases | Yes |
| 2. Structure | Create directories, clone repos if needed | Yes |
| 3. Documents | Generate `concept.md`, `README.md`, `AI_INSTRUCTIONS.md`, `roadmap.md`, task tracker | Yes |
| 4. Settings | Create `.claude/settings.json` | Yes |
| 5. Agents & Skills | Offer `doc-keeper` agent, suggest others based on project needs, optionally create project-specific skills | Agents are offered, you choose |
| 6. Verify | Run consistency check across all generated docs | Yes |
| 7. Explain | Teach the daily workflow and key principles | Yes |

### Optional components

- **doc-keeper agent** — Offered in Phase 5. Audits documentation for consistency, detects stale references, and checks that the file hierarchy matches reality. Recommended for any project with multiple docs.
- **Additional agents** — Based on your project, the skill may suggest a `repo-researcher` (for cloned repos), `environment-setup` (for Docker/GPU/infra), or `builder` (for multi-component projects). You choose which to add.
- **Project-specific skills** — Phase 5.5 offers to create custom `/` commands scoped to your project (e.g. a `/deploy` or `/test` workflow).

Everything is generated from your answers — no boilerplate copy-paste. You can re-run `/project-setup` later to extend or verify an existing project.

### After setup: restart Claude Code

After `/project-setup` finishes creating agents and skills, **exit Claude Code and start a new session** for them to be registered. New agents and skills are only picked up on startup. Use `/exit`, then re-launch Claude Code in the project directory. To continue where you left off, use `/resume` after launching to pick up an existing session.

### Tip: agent model selection

Agents can run on different models — this is configured in the agent's frontmatter. For example, `doc-keeper` uses `model: sonnet` instead of Opus because documentation auditing doesn't need the most expensive model, and Sonnet is fast and capable enough for the task. This saves API costs. To view or edit agent settings after setup, use the `/agents` command.

## Global vs Project-Level Configuration

| Aspect | Global (`~/.claude/`) | Project (`.claude/` in project root) |
|--------|----------------------|--------------------------------------|
| Scope | All Claude Code sessions on this machine | Only this specific project |
| Contains | `CLAUDE.md`, `settings.json`, global skills | `settings.json`, agents, project-specific skills |
| Managed by | This repository (`global_config/`) | Created per-project by `/project-setup` |
| Skills | `~/.claude/skills/` — available everywhere | `.claude/skills/` — only in this project |
| Agents | Not applicable (agents are always project-specific) | `.claude/agents/` — project-specific personas |
| Example | Global CLAUDE.md with your workflow preferences | Project settings with `plansDirectory` |

## Skills and Agents

| | Skills | Agents |
|---|--------|--------|
| **What** | Step-by-step workflows | Specialized personas with domain expertise |
| **Trigger** | User invokes with `/skill-name` | Claude delegates automatically, or user invokes with `/agents` |
| **Location** | `~/.claude/skills/` (global) or `.claude/skills/` (project) | `.claude/agents/` (always project-specific) |
| **Example** | `/project-setup` — scaffolds a new project | `doc-keeper` — audits documentation consistency |
| **When to use** | Repeatable multi-step processes you want to standardize | Specialized tasks where deep domain focus helps (auditing, research, building) |

Skills can be global (available in all projects) or project-specific. Agents are always project-specific because they need to understand that project's structure and context.

## Use Cases

- **New PC setup** — Clone repo, copy files to `~/.claude/`, have a fully configured Claude Code environment
- **Share config** — Share this repo with collaborators for consistent setups across teams
- **Evolve settings** — Version-control changes to global settings, skills, and conventions
- **Onboard projects** — After global setup, run `/project-setup` in any new project for consistent structure

## Customizing Skills

The `project-setup` skill included in this repo is a starting point. You can:

- **Edit it** — modify phases, add/remove questions, change the generated file templates in `global_config/skills/project-setup/SKILL.md`
- **Add phases** — e.g. add a "CI/CD setup" phase or "Docker configuration" phase
- **Create new global skills** — add new folders under `global_config/skills/<name>/SKILL.md`, then copy to `~/.claude/skills/`
- **Create project-specific skills** — add `.claude/skills/<name>/SKILL.md` inside any project (the `/project-setup` skill offers this in Phase 5.5)

## Going Further

The current setup covers the essentials: global config, a project scaffolding skill, and documentation agents. Claude Code has additional features you could integrate into your workflow or extend the `/project-setup` skill with — for example, adding phases that set these up during project onboarding.

| Feature | What it does | When to consider |
|---------|-------------|-----------------|
| [MCP Servers](https://docs.anthropic.com/en/docs/claude-code/mcp) | Connect Claude Code to external tools and data sources (databases, APIs, issue trackers) via the Model Context Protocol | When your projects regularly need access to external services |
| [Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) | Shell commands that run automatically at lifecycle events (before/after tool use, on session start, on prompt submit, etc.) | When you want deterministic automation — auto-formatting, validation, notifications |
| [Agent Teams](https://docs.anthropic.com/en/docs/claude-code/agent-teams) | Multiple Claude Code instances working together in parallel, coordinating through a shared task list (experimental) | When tasks benefit from parallel work with inter-agent discussion |
| [Server-managed settings](https://docs.anthropic.com/en/docs/claude-code/server-managed-settings) | Organization-wide Claude Code configuration managed centrally through Claude.ai (Teams/Enterprise) | When you need consistent policy across a team |

### Subagents vs Agent Teams

This setup includes **subagents** (like `doc-keeper` in `.claude/agents/`). Agent Teams are a different concept:

| | Subagents | Agent Teams |
|---|---|---|
| **How it works** | Claude delegates a task to one agent, it works alone, returns results | Multiple Claude Code instances run in parallel, coordinating through a shared task list |
| **Communication** | Agent reports back to the main session only | Teammates message each other directly |
| **Use case** | Focused tasks — "audit the docs", "research this repo" | Complex parallel work — "one teammate on frontend, one on backend, one reviewing" |
| **Setup** | `.claude/agents/<name>.md` in the project | Enabled via `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings |
| **Status** | Stable | Experimental |

For most personal development, subagents are enough. Agent Teams become useful for larger efforts where you want multiple Claude instances collaborating simultaneously.

These all work alongside what's in this repo. For example, you could add an MCP server config phase to `/project-setup`, or use hooks to auto-run the doc-keeper agent after file changes. In practice, most of these are added later as project needs evolve — the current setup is a clean starting point.

## Development Approach

Mostly static. This repository changes infrequently — only when global settings, skills, or conventions need updating.

## Project Structure & Agents

See [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md) for the full project hierarchy and agents table.

## Documentation

| Document | Purpose |
|----------|---------|
| [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md) | Project rules, hierarchy, agents (source of truth) |
| [concepts/concept.md](concepts/concept.md) | Detailed concept and design |
| [roadmap.md](roadmap.md) | Sprint plan and status |
