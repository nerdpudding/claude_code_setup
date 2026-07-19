# claude-code-setup

A version-controlled home for a personal Claude Code environment: the global `CLAUDE.md`,
`settings.json`, an output style, a set of skills, and saved workflows. Clone it, copy
`global_config/*` into `~/.claude/`, and any machine works the same way.

## Table of Contents

- [What this is](#what-this-is)
- [Version history](#version-history)
- [Quick start](#quick-start)
- [What's in `global_config/`](#whats-in-global_config)
- [The skills](#the-skills)
- [Saved workflows](#saved-workflows)
- [Opus 4.8 alignment — why the format looks like this](#opus-48-alignment--why-the-format-looks-like-this)
- [Global vs project-level config](#global-vs-project-level-config)
- [Project structure & docs](#project-structure--docs)

## What this is

One repo that holds everything needed to reproduce a consistent Claude Code setup on any machine.
The `global_config/` folder mirrors `~/.claude/` — copy it across and you have the same CLAUDE.md,
settings, output style, skills, and saved workflows everywhere.

It reflects a **personal** workflow (rapid PoC-style development with light structure), not a
universal best practice. The development cycle it encourages: **setup → concept → plan → implement →
test → iterate → update docs → commit**.

Two deliberate choices:
- **`AI_INSTRUCTIONS.md` per project** (next to `CLAUDE.md`): a tool-agnostic, project-scoped
  primary doc that's easy to read and works with any AI assistant, not just Claude Code.
- **Project-local plans & archives** (`claude_plans/`, `archive/` inside each project): each project
  is self-contained — easy to move, share, commit, or revisit. Plans never live in a global folder.

## Version history

### v2.3 — Workflow adoption + Opus 4.8 default (2026-07-19)

Adopted the two fan-out-shaped fleets from the dynamic-workflows advisory of 2026-07-19 — and
nothing else from it (build waves, probes, and planning stay Task-tool/main-thread work; no
ultracode):

- **New skill `/doc-sweep` + saved workflow `workflows/doc-sweep.js`** — the end-of-sprint /
  periodic doc-consistency sweep as a capped fleet: 4–7 cheap cluster readers (fresh context
  each) + 1 sonnet verifier + 1 sonnet merger; only the merged findings list reaches the main
  thread. `/feature-close` step 2 now routes substantial doc trees to it.
- **Saved workflow `workflows/milestone-review.js`** — whole-codebase review at milestones
  (every ~3–4 sprints): 5 opus dimension-finders + 2 opus refuters per dimension (a finding
  dies when both refute it) + 1 synthesis writing prioritized findings into a plan file.
  Invoked by hand; caps live in the script header.
- **Fleet-mode note on findings-producing agents** — when run inside a workflow fleet with a
  structured-output schema, return ONLY the structured findings list. Added to the
  `project-setup` doc-keeper template and agent spec, as `/realign` audit check 11 (so existing
  projects pick it up), and to this repo's own doc-keeper.
- **Token recording at sprint close** — `/feature-close` gained a fixed step: record the
  round's real token totals (session + fleet totals) in the roadmap entry. Until now no real
  figures were recorded anywhere.
- **`install.sh` now also syncs `workflows/`** — `~/.claude/workflows/` is the documented
  user-level home for saved workflows (available in every project).
- **Model default back to `opus[1m]`** — Fable 5 left preview and is separately billed since
  2026-07-19. The default hierarchy tops out at Opus 4.8; Fable stays an easy explicit
  override (per session `/model`, per review run `synthesisModel: 'fable'`, per agent an
  explicit pin on request). `effortLevel: xhigh` stays — the documented recommendation for
  Opus 4.8 coding.
- **Version-sensitivity note:** the workflow `agentType` option and the `budget` hard ceiling
  ("+300k"/"+500k" turn directives) are installation-verified (2026-07-19) but not in the
  public docs — the skill and both script headers carry a re-check note.

### v2.2 — Session carryover across compaction (2026-07-04)

Two skills to continue in a fresh session without retyping when you free up context at a
sprint/feature boundary — the personal counterpart to Claude Code's built-in `/compact`:

- **`/pre-clear-compact`** — writes a curated `sessions/SESSION_CARRYOVER.md` that scales to the
  work: thin (status, decisions, conventions, next step + pointers) at a clean boundary, or a full
  `Work in progress` capture (half-done files, approaches tried and rejected, exact error/test
  state, next micro-step) when work is mid-flight — then stops so it can be committed and cleared.
- **`/post-clear-handover`** — first command in the new session: reads the carryover plus the
  project docs, reports where things stand, proposes the next step without executing it, and
  archives the carryover with a date prefix so an old one never lingers as "still current".

Why this replaces automatic compaction rather than supplementing it: `/pre-clear-compact` runs
before the wipe with the whole session still in context, so it can capture everything `/compact`
would — but into a durable, curated, git-tracked file instead of a lossy in-context summary. A
no-loss scan before it finishes is what keeps it degradation-free, and the note's depth scales to
the work so unfinished, complex sessions are carried in full. `/clear` afterward is cheaper and
avoids summary drift. Both skills are generic and skip any artifact a project doesn't have; the
rolling carryover lives in a new `sessions/` folder.

Also in v2.2: `global_config/settings.json` pins `theme: "auto"` so `install.sh` keeps the theme
consistent across machines instead of dropping or overriding it.

Also corrected in v2.2: the pinned session `model` moved from `claude-fable-5[1m]` back to
`opus[1m]` — Opus 4.8 is the daily driver and Fable 5 an on-demand exception for the heaviest
reasoning (matching how it's actually used), not the always-on default. `effortLevel: xhigh` stays,
because that is Anthropic's published recommendation for coding on Opus 4.8/4.7; the level is
model-dependent (Fable 5 and Sonnet 5 default to `high`).

### v2.1 — Fable 5 / field-test sync (2026-07-03)

Synced `global_config/` back from the live `~/.claude/` after a month of field use (mainly on the
SmartPrepper project) and the move to Claude Fable 5:

- **New skill `/feature-close`** — post-delivery hygiene: verify docs/roadmap match what was built,
  carry leftovers to the backlog, graduate lessons to `lessons_learned.md`, archive the plan with a
  date prefix. The closing counterpart to `/custom_plan`.
- **Agent token economy made explicit:** every agent pins the cheapest `model:` that does the job
  (`haiku` mechanical/bulk, `sonnet` research/docs/standard implementation, `opus` only for
  genuinely hard implementation; `fable` never as an agent default — expensive, reserved for the
  very hardest tasks on explicit user request. An unpinned agent silently inherits the expensive
  session model). The rule now lives as a preference in the global `CLAUDE.md`, leads `project-setup`'s
  agent-creation phase (with a Model column in the generated agents table), and is audit check 9
  in `/realign` — so it applies the moment agents are created, in new and existing projects alike.
- **Skill refinements from field use:** `project-setup` references `/custom_plan` +
  `/feature-close` instead of the old plan-mode save/rename flow; `realign-project` now treats
  tone as single-homed in the output style; `custom_plan` prefers delegating read-only
  exploration to cheap-model subagents.
- **`settings.json` updated for Fable 5:** `model` pinned to `claude-fable-5[1m]` with an
  Opus/Sonnet `fallbackModel` chain, `effortLevel` raised to `xhigh` (the v2 "high" default was an
  Opus 4.8 calibration), and the `last30days` plugin + marketplace registered so it auto-installs
  on a new machine.
- **`install.sh` added** — `diff` / `install` / `pull` modes to detect drift, apply the repo to
  `~/.claude/` (with backups), or pull live edits back under version control.

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

**Effect on token usage.** v2 is primarily a *clarity* change, not a shrink — the repo itself grew
(added principles doc, two skills, an output style). The efficiency gain is structural and shows up
in the projects the setup produces, not in absolute document count:
- **Global `CLAUDE.md`** stayed about the same length (~98 lines) — the per-turn always-loaded cost
  is roughly flat, just tiered and clearer. The output style adds a small always-loaded chunk.
- **`AI_INSTRUCTIONS.md`** is now a lean tiered core (target under 200 lines) with bulk detail in
  on-demand sub-docs that load only when relevant — so the always-read file stays small.
- **Agents** read a targeted set of files instead of a blanket "read everything first" (they don't
  inherit `CLAUDE.md`/memory), making each spawn cheaper.
- **Scale-to-size scaffolding** is the biggest win: a small new project generates only
  `README.md` + `AI_INSTRUCTIONS.md`, not the full document/agent set, so fewer files are written
  and read. The cost scales with what the project needs rather than a fixed ceremony.

The net: more efficient *per turn* — especially for small/medium new projects and realigned ones —
because the always-loaded surface stays lean while detail moves on-demand; not a reduction in total
documentation.

### v1 — Initial setup

Global `CLAUDE.md`, `settings.json`, the `/project-setup` skill, a `doc-keeper` agent template, and
the supporting docs.

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

## What's in `global_config/`

| File | What it does |
|------|-------------|
| `CLAUDE.md` | Global instructions — tiered Hard rules / Preferences, project conventions, plan rules. Auto-loaded every session. |
| `settings.json` | Global settings — telemetry/timeouts, `model: opus[1m]` (Opus 4.8 daily driver; Fable 5 on demand) + `fallbackModel` chain, `effortLevel: xhigh` (Anthropic's recommendation for Opus 4.8 coding), `includeCoAuthoredBy: false`, `outputStyle: "Personal Voice"`, `plansDirectory`, the `last30days` plugin, a `permissions.deny` example. |
| `output-styles/personal-voice.md` | Tone/voice output style — the single home for tone rules (no "fair", no hollow validation, neutral voice, no emojis). **On by default** via `outputStyle`; `keep-coding-instructions: true` keeps all standard coding behavior, so it's purely additive. |
| `skills/project-setup/SKILL.md` | `/project-setup` — scaffold a NEW project. |
| `skills/realign-project/SKILL.md` | `/realign` — modernize an EXISTING project to the v2 format. |
| `skills/custom_plan/SKILL.md` | `/custom_plan` — read-only sprint/feature planning into `claude_plans/PLAN_<name>.md`, no auto-execute. |
| `skills/feature-close/SKILL.md` | `/feature-close` — post-delivery hygiene: docs check, backlog carry-over, token recording, archive the plan. |
| `skills/doc-sweep/SKILL.md` | `/doc-sweep` — the doc-consistency sweep as a capped workflow fleet. |
| `skills/pre-clear-compact/SKILL.md` | `/pre-clear-compact` — write a session carryover before freeing up context. |
| `skills/post-clear-handover/SKILL.md` | `/post-clear-handover` — re-orient in a fresh session, then archive the carryover. |
| `workflows/doc-sweep.js` | Saved workflow behind `/doc-sweep` — parallel doc-consistency sweep (readers + verifier + merger). |
| `workflows/milestone-review.js` | Saved workflow for the milestone whole-codebase review (finders + refuters + synthesis into a plan file). |

```
claude-code-setup repo              ~/.claude/ (target)
└── global_config/          →       ├── CLAUDE.md
    ├── CLAUDE.md                    ├── settings.json
    ├── settings.json               ├── output-styles/
    ├── output-styles/              │   └── personal-voice.md
    │   └── personal-voice.md       ├── skills/
    ├── skills/                     │   ├── project-setup/
    │   ├── project-setup/          │   ├── realign-project/
    │   ├── realign-project/        │   ├── custom_plan/
    │   ├── custom_plan/            │   ├── feature-close/
    │   ├── feature-close/          │   ├── doc-sweep/
    │   ├── doc-sweep/              │   ├── pre-clear-compact/
    │   ├── pre-clear-compact/      │   └── post-clear-handover/
    │   └── post-clear-handover/    └── workflows/
    └── workflows/                      ├── doc-sweep.js
        ├── doc-sweep.js                └── milestone-review.js
        └── milestone-review.js
```

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
| `milestone-review` | by hand, at milestones (every ~3–4 sprints) | 5 opus dimension-finders + 2 opus refuters per dimension + 1 synthesis (~16 agents; opus default, `synthesisModel: 'fable'` as explicit opt-in); state **"+500k"**. Writes the findings section into a plan file. |

Both fleets are read-only (the milestone review's single sanctioned write is the findings
section of the plan file), so a failed run is simply re-run or resumed via `resumeFromRunId`.
Keep the `/config` workflow size guideline at `medium`; ultracode stays off — deliberate
scoping and approval gates replace default-maximal thoroughness. The workflow `agentType`
option and the `budget` hard ceiling are installation-verified (2026-07-19) but not yet in the
public docs — re-check after harness updates before relying on them elsewhere.

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
