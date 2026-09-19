# claude-code-setup

A version-controlled home for a personal Claude Code environment: the global `CLAUDE.md`,
`settings.json`, an output style, a set of skills, and saved workflows. Clone it, copy
`global_config/*` into `~/.claude/`, and any machine works the same way.

## Table of Contents

- [What this is](#what-this-is)
- [Which file does what](#which-file-does-what)
- [Version history](#version-history)
- [Quick start](#quick-start)
- [The skills](#the-skills)
- [Saved workflows](#saved-workflows)
- [Model alignment — why the format looks like this](#model-alignment--why-the-format-looks-like-this)
- [Project structure & docs](#project-structure--docs)

## What this is

One repo that holds everything needed to reproduce a consistent Claude Code setup on any machine.
The `global_config/` folder mirrors `~/.claude/` — copy it across and you have the same CLAUDE.md,
settings, output style, skills, and saved workflows everywhere.

It reflects a **personal** workflow (rapid PoC-style development with light structure), not a
universal best practice. The cycle it encourages, and which the skills are shaped around:

**concept → project scaffolded (`/project-setup`) → sprint 0 where the work warrants it (research,
requirements, user stories, goal, architecture) → plan (`/custom_plan`, reviewed by an agent that
did not write it when it is complex) → approval → implement, in parallel where the work splits →
test to the depth the plan set → close (`/feature-close`) → roadmap and backlog revisited → next
sprint**

Concept and project scaffolding come in either order. How deep sprint 0 goes, how much runs in
parallel, and how much is tested autonomously versus by hand all depend on the project. A full
adversarial review of what was built is separate and happens at **milestones**, often several
sprints apart (`milestone-review`). The canonical version of this cycle lives in
`global_config/CLAUDE.md`.

Two deliberate choices:
- **`AI_INSTRUCTIONS.md` per project**, and no project-level `CLAUDE.md` beside it: one
  tool-agnostic file that holds all of a project's rules, easy to read, and usable by any AI
  assistant, not just Claude Code.
- **Project-local plans & archives** (`claude_plans/`, `archive/` inside each project): each project
  is self-contained — easy to move, share, commit, or revisit. Plans never live in a global folder.

## Which file does what

The idea behind the whole setup fits in three sentences. What is true for **every** project is
written down once, globally, in `~/.claude/`. What is true for **one** project is written down
once, in that project's `AI_INSTRUCTIONS.md`. Nothing is written in both places, because two copies
drift apart and an assistant then follows the stale one.

### The same in every project — global, in `~/.claude/`

These files are kept in this repo under `global_config/`, and `install.sh` copies them to
`~/.claude/`. They are identical for every project on the machine.

| File | What it is for | Good to know |
|------|----------------|--------------|
| `CLAUDE.md` | How the work is done, in any project: the hard rules, the sprint cycle, how a project is organised, which model a subagent gets, how much to test. | Claude Code loads it by itself, in every session and in every subagent. There is exactly one. |
| `output-styles/personal-voice.md` | How Claude talks to the user: short, plain words, no invented labels, one decision at a time, Dutch that keeps its English terms. | It is part of the system prompt, which is why tone rules hold here and never held in `CLAUDE.md`. It does not reach a subagent. Switched on through `outputStyle` in `settings.json`. |
| `settings.json` | Switches instead of prose: model and fallback chain, effort level, permissions, where plans are saved, no AI attribution in commits. | The values live in the file; read them there. A project can override a key in its own `.claude/settings.json`. |
| `skills/` | Step-by-step procedures called with a slash command: set a project up, realign one, plan, close a sprint, hand over to a new session. See [The skills](#the-skills). | A skill costs nothing until it is called. A project may add skills of its own in `.claude/skills/`. |
| `workflows/` | Saved runs with several agents: the doc sweep and the milestone review. See [Saved workflows](#saved-workflows). | Available in every project. |

### Different in every project — in the project's own folder

| File | What it is for | Good to know |
|------|----------------|--------------|
| `AI_INSTRUCTIONS.md` | **The authoritative source for one project**: its rules, where everything lives, its agents. | Every project has one — created by `/project-setup`, or brought in line by `/realign`. Its purpose and shape are the same everywhere; its content is about that one project. It is written for any AI assistant, not only Claude Code. Claude Code does not load it by itself: the global `CLAUDE.md` tells every session and every subagent to read it first. |
| `README.md`, `roadmap.md`, `docs/`, `claude_plans/`, `archive/` | What the project is, what is planned and what is done, the detail, the plans, and what is outdated. | When `AI_INSTRUCTIONS.md` grows too long, detail moves into a document under `docs/` that it points at. The rules stay. |
| `.claude/settings.json` | The project's own switches — mainly that plans are saved inside the project. | Small. Created by `/project-setup`. |
| `.claude/agents/` | Helpers for this project, each with one job and a pinned model. | Always per project. Each agent reads `AI_INSTRUCTIONS.md` first. |

### What a project does not have: a `CLAUDE.md` of its own

Claude Code would load one, and its `/init` command creates one. In this setup it would be a
second place for a project's rules, next to `AI_INSTRUCTIONS.md`, and the two would drift apart.
So `/project-setup` never creates one. Where an existing project still has one, `/realign` moves
what is in it into `AI_INSTRUCTIONS.md` and archives the file; it asks only when the two files
contradict each other.

### Claude's own notes: auto-memory

Claude Code keeps notes per project in `~/.claude/projects/<project>/memory/`, outside any repo.
They are for **state** — where things stand, what is in flight — and for what is about the user.
They are never for a project's rules: a rule that sits only in memory is invisible to subagents
and to every other tool.

The rule behind all of this is three lines in the global `CLAUDE.md`, under "Where a rule
belongs".

## Version history

Current version: **v2.7 — One home for every fact** (2026-09-19). What changed in each version,
newest first: [docs/history/version_history.md](docs/history/version_history.md).

## Quick start

> **Warning:** if `~/.claude/` already has files, don't blindly overwrite. Back up or merge first.
> If Claude Code is freshly installed and uncustomized, copying directly is safe.

```bash
# 1. Clone
git clone <repo-url> claude-code-setup
cd claude-code-setup

# 2. See what would change (safe, read-only)
./install.sh diff

# 3. Apply the repo to ~/.claude/ — files it overwrites are backed up
#    to ~/.claude/backups/ first
./install.sh install

# 4. Restart Claude Code so it picks up the skills + output style, then in any project run:
#    /project-setup   (verify global setup, or scaffold a project)
```

`install.sh` only touches the files this repo manages (`CLAUDE.md`, `settings.json`,
`output-styles/`, `skills/`, `workflows/`) — machine-local state like `settings.local.json`, memory, history,
and plugins is left alone. The reverse direction works too: after editing the live config, run
`./install.sh pull` to bring the changes back into the repo and commit them. (Manual equivalent:
`cp -r global_config/* ~/.claude/`.)

The Personal Voice output style and the skills take effect on the **next session** after copying.

## The skills

| Skill | Use it when… | What it does |
|-------|--------------|--------------|
| `/project-setup` | Starting a new project, or verifying the global setup on a new PC | Scaffolds structure, docs, agents, workflow — scaled to project size (a small script needs only README + AI_INSTRUCTIONS). |
| `/realign` | An existing project feels heavy/bureaucratic after a model upgrade | Audits CLAUDE.md / AI_INSTRUCTIONS / agents / skills / settings / memory and modernizes them to the v2 format. Asks before editing. |
| `/custom_plan` | Planning a sprint or feature | Explores read-only, writes `claude_plans/PLAN_<name>.md`, stops. Build later on "implement PLAN_<name>". |
| `/feature-close` | A feature/sprint has been delivered | Verifies docs/roadmap match what was built, carries leftovers to the backlog, records the round's real token totals, graduates lessons, archives the plan with a date prefix. |
| `/doc-sweep` | Sprint close or periodic maintenance on a project with a substantial doc tree | Runs the doc-consistency sweep as a capped workflow fleet (4–7 cluster readers + verifier + merger); only the merged findings return to the session. Small projects: single doc-keeper pass instead. |
| `/pre-clear-compact` | You want to free up context and continue in a fresh session | Writes a curated `sessions/SESSION_CARRYOVER.md` (status, decisions, conventions, next step), then stops so you can commit and `/clear`. |
| `/post-clear-handover` | First command in a new session after clearing | Reads the carryover + project docs, reports where things stand, proposes the next step without doing it, and archives the carryover. |
| `/wireframe` | The layout of a screen is unsettled and seeing it is what decides it | Draws the screen in a local self-hosted Penpot and hands back a picture. Starts the stack when needed, stops it afterwards. Not for a throwaway sketch — write HTML by hand for those. |
| `/contained-browser` | A task needs a real browser and the user's own must not be touched | Drives a headless Chromium in a container over MCP: open a page, fill a form, screenshot, scrape, test a local app. Isolated profile, loopback only. |

**`/project-setup` vs `/realign`:** `/project-setup` builds structure that isn't there yet;
`/realign` leaves the structure and updates the *wording, channel, and location* of an existing
project's instructions. Create with one, modernize with the other.

**`/custom_plan` vs native plan mode:** native plan mode starts implementing the moment you approve
the plan — that's hardcoded and can't be overridden. `/custom_plan` keeps the good part (disciplined
read-only exploration + a structured design) but makes saving a plan and building it two separate,
user-controlled steps. The plan file lands in your project's `claude_plans/`, never in a global
folder.

**The plan lifecycle:** `/custom_plan <name>` opens it (research → plan file), an explicit
"implement PLAN_<name>" builds it, and `/feature-close` closes it (docs check, backlog carry-over,
archive with date prefix).

**Across sessions:** after closing, if you want to free up context and keep going in a fresh
session, `/pre-clear-compact` writes a carryover, you commit it and `/clear`, and
`/post-clear-handover` picks it up on the other side.

**`/project-setup` vs `/init`:** the built-in `/init` writes a single `CLAUDE.md` by reading
existing code. `/project-setup` scaffolds a whole environment (structure, docs, agents, workflow).

## Saved workflows

Two workflow recipes ship in `global_config/workflows/` and land in `~/.claude/workflows/` —
the documented user-level home for saved workflows, available in every project:

| Workflow | Invoked | Fleet & caps |
|----------|---------|--------------|
| `doc-sweep` | via `/doc-sweep` (sprint close, or periodic) | 4–7 cheap cluster readers + 1 sonnet verifier + 1 sonnet merger (6–10 agents); state **"+300k"** in the invoking turn (hard ceiling). |
| `milestone-review` | by hand, at milestones (every ~3–4 sprints) | 5 opus dimension-finders + 2 opus refuters per dimension + 1 synthesis (~16 agents; opus default, `synthesisModel: 'fable'` as explicit opt-in); state **"+500k"**. Writes the findings into a dated review doc (`docs/Review_<date>.md`), not a plan file. |

Both fleets are read-only (the milestone review's single sanctioned write is the findings
section of that review doc), so a failed run is simply re-run or resumed via `resumeFromRunId`.
Keep the `/config` workflow size guideline at `medium`; ultracode stays off — deliberate
scoping and approval gates replace default-maximal thoroughness. The workflow `agentType`
option and the `budget` hard ceiling are installation-verified (2026-07-19) but not yet in the
public docs — re-check after harness updates before relying on them elsewhere.

## Model alignment — why the format looks like this

The short version of [`docs/model_alignment/opus_4_8_alignment.md`](docs/model_alignment/opus_4_8_alignment.md) — ten principles,
still the backbone of the format:

1. **Tier emphasis** — a small Hard-rules block + a Preferences block; absolutes only for real invariants.
2. **Intent + conditions, not universal imperatives** — scope-gate ceremony; "scale depth to task size".
3. **Right channel per rule** — tone → output style; process → CLAUDE.md/AI_INSTRUCTIONS; volatile state → native memory.
4. **Deterministic over prose** — `includeCoAuthoredBy: false`, `permissions.deny` instead of remembered rules.
5. **One home per fact** — single-source each rule; reference, don't restate.
6. **Lean always-loaded surface** — keep CLAUDE.md/AI_INSTRUCTIONS small; push detail to on-demand sub-docs.
7. **Minimal by default, scale up only when asked** — scaffolding starts small.
8. **Trust native systems over shadow copies** — no git-tracked duplicate of native memory.
9. **Tune depth at the settings layer** (`effortLevel`), not via prose "be thorough".
10. **Crisp, non-overlapping subagent descriptions** — keyword-led, one owner per domain.

**For current models, read [`docs/model_alignment/opus_5_alignment.md`](docs/model_alignment/opus_5_alignment.md) instead.** It
carries what changed on Opus 5 — principle 9's `xhigh` recommendation flips to `high` (this setup
pins `xhigh` anyway, as a recorded choice), the effort table per kind of work, which instructions to DELETE because the model now does them unprompted,
and which parts Claude Code's own system prompt already ships so the setup must not duplicate them.

## Project structure & docs

This repo's own structure and rules live in [`AI_INSTRUCTIONS.md`](AI_INSTRUCTIONS.md); the tree
there says where every other file is. Start here:

- [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md) — this repo's rules, hierarchy, agents and skills.
- [docs/model_alignment/opus_5_alignment.md](docs/model_alignment/opus_5_alignment.md) — current
  model guidance: effort levels, what to delete, what the harness already ships.
- [concepts/concept.md](concepts/concept.md) — concept and design.
- [roadmap.md](roadmap.md) — sprint plan and status.
