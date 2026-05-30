# claude-code-setup

A version-controlled home for a personal Claude Code environment: the global `CLAUDE.md`,
`settings.json`, an output style, and a set of skills. Clone it, copy `global_config/*` into
`~/.claude/`, and any machine works the same way.

## Table of Contents

- [What this is](#what-this-is)
- [Version history](#version-history)
- [Quick start](#quick-start)
- [What's in `global_config/`](#whats-in-global_config)
- [The skills](#the-skills)
- [Opus 4.8 alignment — why the format looks like this](#opus-48-alignment--why-the-format-looks-like-this)
- [Global vs project-level config](#global-vs-project-level-config)
- [Project structure & docs](#project-structure--docs)

## What this is

One repo that holds everything needed to reproduce a consistent Claude Code setup on any machine.
The `global_config/` folder mirrors `~/.claude/` — copy it across and you have the same CLAUDE.md,
settings, output style, and skills everywhere.

It reflects a **personal** workflow (rapid PoC-style development with light structure), not a
universal best practice. The development cycle it encourages: **setup → concept → plan → implement →
test → iterate → update docs → commit**.

Two deliberate choices:
- **`AI_INSTRUCTIONS.md` per project** (next to `CLAUDE.md`): a tool-agnostic, project-scoped
  primary doc that's easy to read and works with any AI assistant, not just Claude Code.
- **Project-local plans & archives** (`claude_plans/`, `archive/` inside each project): each project
  is self-contained — easy to move, share, commit, or revisit. Plans never live in a global folder.

## Version history

### v2 — Opus 4.8 alignment (2026-05-30)

**Why v1 needed changing.** v1 was tuned for Claude Opus 4.5/4.6. On 4.7/4.8 the same files felt
heavier and more bureaucratic: a more **literal** and more **agentic** model executes soft prose
imperatives close to the letter, so right-sizing hints ("always run the full review", "do NOT skip
phases") became mandatory ceremony on trivial tasks, duplicated rules became amplified compliance
pressure, and stale in-repo files got trusted as ground truth.

**What v2 changes to fix it** (full rationale + the ten principles in
[`docs/opus_4_8_alignment.md`](docs/opus_4_8_alignment.md)):
- `CLAUDE.md` rewritten from a flat ALWAYS/NEVER wall into a tiered **Hard rules / Preferences**
  format — the model can now tell load-bearing invariants from soft defaults.
- Tone/voice moved into a dedicated **output style** (system-prompt channel, reliably honored)
  instead of being diluted inside `CLAUDE.md`.
- Enforceable rules made **deterministic** in `settings.json` (`includeCoAuthoredBy: false`,
  `permissions.deny`) instead of prose the model has to remember.
- Everyday `effortLevel` set to `high` (not `xhigh`) — 4.8 already supplies more depth per turn.
- Instruction files kept **lean**; bulk detail moved to on-demand sub-docs.

**New skills in v2 — and when to use each:**
- **`/project-setup`** — when starting a NEW project (or filling in a partial one). Scaffolds the
  structure, docs, agents, and workflow, scaled to project size.
- **`/realign`** — when an EXISTING project's Claude Code setup feels heavy or bureaucratic after a
  model upgrade. Audits and modernizes its docs/agents/settings to the v2 format. The counterpart to
  `/project-setup`.
- **`/custom_plan`** — when planning a sprint or feature. Researches read-only, writes
  `claude_plans/PLAN_<name>.md`, then stops. Named `custom_plan` on purpose because it deliberately
  replaces Claude Code's native plan mode (whose approval step jumps straight to coding — a behavior
  that can't be switched off). Build later on an explicit "implement PLAN_<name>".

### v1 — Initial setup

Global `CLAUDE.md`, `settings.json`, the `/project-setup` skill, a `doc-keeper` agent template, and
the supporting docs.

## Quick start

> **Warning:** if `~/.claude/` already has files, don't blindly overwrite. Back up or merge first.
> If Claude Code is freshly installed and uncustomized, copying directly is safe.

```bash
# 1. Clone
git clone <repo-url> claude-code-setup

# 2. (Optional) back up an existing config
# cp -r ~/.claude/ ~/.claude-backup/

# 3. Copy the global config into ~/.claude/
#    (CLAUDE.md, settings.json, all skills, and the output style)
cp -r claude-code-setup/global_config/* ~/.claude/

# 4. Restart Claude Code so it picks up the skills + output style, then in any project run:
#    /project-setup   (verify global setup, or scaffold a project)
```

The Personal Voice output style and the skills take effect on the **next session** after copying.

## What's in `global_config/`

| File | What it does |
|------|-------------|
| `CLAUDE.md` | Global instructions — tiered Hard rules / Preferences, project conventions, plan rules. Auto-loaded every session. |
| `settings.json` | Global settings — telemetry/timeouts, `effortLevel: high`, `includeCoAuthoredBy: false`, `outputStyle: "Personal Voice"`, `plansDirectory`, a `permissions.deny` example. |
| `output-styles/personal-voice.md` | Tone/voice output style — the single home for tone rules (no "fair", no hollow validation, neutral voice, no emojis). **On by default** via `outputStyle`; `keep-coding-instructions: true` keeps all standard coding behavior, so it's purely additive. |
| `skills/project-setup/SKILL.md` | `/project-setup` — scaffold a NEW project. |
| `skills/realign-project/SKILL.md` | `/realign` — modernize an EXISTING project to the v2 format. |
| `skills/custom_plan/SKILL.md` | `/custom_plan` — read-only sprint/feature planning into `claude_plans/PLAN_<name>.md`, no auto-execute. |

```
claude-code-setup repo              ~/.claude/ (target)
└── global_config/          →       ├── CLAUDE.md
    ├── CLAUDE.md                    ├── settings.json
    ├── settings.json               ├── output-styles/
    ├── output-styles/              │   └── personal-voice.md
    │   └── personal-voice.md       └── skills/
    └── skills/                         ├── project-setup/
        ├── project-setup/             ├── realign-project/
        ├── realign-project/           └── custom_plan/
        └── custom_plan/
```

## The skills

| Skill | Use it when… | What it does |
|-------|--------------|--------------|
| `/project-setup` | Starting a new project, or verifying the global setup on a new PC | Scaffolds structure, docs, agents, workflow — scaled to project size (a small script needs only README + AI_INSTRUCTIONS). |
| `/realign` | An existing project feels heavy/bureaucratic after a model upgrade | Audits CLAUDE.md / AI_INSTRUCTIONS / agents / settings / memory and modernizes them to the v2 format. Asks before editing. |
| `/custom_plan` | Planning a sprint or feature | Explores read-only, writes `claude_plans/PLAN_<name>.md`, stops. Build later on "implement PLAN_<name>". |

**`/project-setup` vs `/realign`:** `/project-setup` builds structure that isn't there yet;
`/realign` leaves the structure and updates the *wording, channel, and location* of an existing
project's instructions. Create with one, modernize with the other.

**`/custom_plan` vs native plan mode:** native plan mode starts implementing the moment you approve
the plan — that's hardcoded and can't be overridden. `/custom_plan` keeps the good part (disciplined
read-only exploration + a structured design) but makes saving a plan and building it two separate,
user-controlled steps. The plan file lands in your project's `claude_plans/`, never in a global
folder.

**`/project-setup` vs `/init`:** the built-in `/init` writes a single `CLAUDE.md` by reading
existing code. `/project-setup` scaffolds a whole environment (structure, docs, agents, workflow).

## Opus 4.8 alignment — why the format looks like this

The short version of [`docs/opus_4_8_alignment.md`](docs/opus_4_8_alignment.md) — ten principles:

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

## Global vs project-level config

| Aspect | Global (`~/.claude/`) | Project (`.claude/` in a repo) |
|--------|----------------------|-------------------------------|
| Scope | Every session on the machine | Only that project |
| Holds | `CLAUDE.md`, `settings.json`, output style, global skills | `settings.json`, agents, project-specific skills |
| Managed by | This repo (`global_config/`) | Created per-project by `/project-setup` |

Skills can be global (`~/.claude/skills/`, available everywhere) or project-specific
(`.claude/skills/`). Agents are always project-specific (`.claude/agents/`).

## Project structure & docs

This repo's own structure and rules live in [`AI_INSTRUCTIONS.md`](AI_INSTRUCTIONS.md).

| Document | Purpose |
|----------|---------|
| [AI_INSTRUCTIONS.md](AI_INSTRUCTIONS.md) | This repo's rules, hierarchy, agents, skills (source of truth) |
| [docs/opus_4_8_alignment.md](docs/opus_4_8_alignment.md) | Why the format is tuned for Opus 4.8 — rationale + the ten principles |
| [docs/example_ai_instructions.md](docs/example_ai_instructions.md) | Reference example of a generated AI_INSTRUCTIONS.md (v2 format) |
| [concepts/concept.md](concepts/concept.md) | Concept and design |
| [roadmap.md](roadmap.md) | Sprint plan and status |
