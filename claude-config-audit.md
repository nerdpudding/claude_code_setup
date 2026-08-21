# Claude config audit

Snapshot taken 2026-08-21. Verbatim contents only.

---

## 1. CLAUDE.md files

### 1a. `~/.claude/CLAUDE.md`

Path: `/home/rvanpolen/.claude/CLAUDE.md`

````markdown
# Global Claude Code Preferences

Personal cross-project preferences. Two tiers: **Hard rules** are invariants — never violate
them. **Preferences** are defaults — apply them by judgment and override when a task is genuinely
better served otherwise. Reserve absolutes for the Hard-rules block; everything else is guidance.

## Hard rules (never violate)

- **English in files.** All code, docs, comments, plans, and commit messages are English — even
  when the conversation is in Dutch.
- **No AI attribution in commits.** No "Co-Authored-By", "Generated with Claude", or similar.
  (Also enforced via `includeCoAuthoredBy: false` in settings — keep both.)
- **Commit and push only when asked.** Don't commit, push, or open PRs on your own initiative.
- **Never commit secrets or large artifacts** — `.env`, credentials, API keys, model weights.
- **Don't delete or overwrite files you didn't create** without surfacing it first. If a file's
  content contradicts how it was described, stop and report rather than proceeding.

## Preferences (use judgment; override when the task is better served)

- **Scale depth to task size.** Match ceremony to the work: a one-line fix or a question takes a
  short path; a multi-file feature warrants planning, structure, and review. Don't run the full
  process on trivial work, and don't under-build substantial work. The failure mode to resist is
  reading a casual phrase literally and inflating it into a procedure. Calibrate the *answer* the
  same way — see Response calibration in the Personal Voice output style.
- **SOLID, DRY, KISS — decision aids, not slogans** (`[user-specified]` 2026-07-27). Name the
  principle when it settles a structural choice, so the trade-off is visible instead of implicit.
  These apply to infrastructure and configuration too, translated rather than quoted.
  - *S* — one component, one job; if you cannot state that job in a sentence, it is doing two.
  - *O* — extend by adding, not by editing someone else's file: override, don't fork.
  - *L* — a replacement must honour the same contract, so talk to the standard interface and never
    lean on one implementation's quirks.
  - *I* — no consumer should have to know about what it does not use.
  - *D* — depend on an address held in configuration, never a hard-coded name, port or path.
  - *Separation of concerns* is the broader idea S applies at unit level. *KISS* means no clever
    layer that manages things — prefer something that is simply on or off. *DRY* means build it once,
    and one source of truth for facts.
  - When two conflict — DRY and KISS regularly do, since sharing adds coordination — say so and let
    the user decide rather than silently picking one.
- **Write object-oriented code** where code is actually written: small classes with one job, extended
  rather than edited, depending on interfaces rather than concrete implementations. Prefer that to a
  long procedural script even when it starts small — those are the ones that grow.
- **One source of truth.** Each fact lives in one place; reference it elsewhere, don't duplicate.
- **Build on existing work** — evolve what's there rather than rewriting from scratch.
- **Keep docs current** — after a change, fix the docs that describe it. Stale docs mislead.
- **Use the right agent** for its domain (check `.claude/agents/` if present).
- **Model tiers for subagents** (`[user-specified]` 2026-08-16). Match the model to the task.
  - `sonnet` — simple mechanical tasks, research, documentation. Bulk work goes here too.
  - `opus` — anything that writes or modifies code or configuration.
  - `fable` — the hardest tasks only: deep judgement, adversarial review, design. Separately
    billed, so never an agent default; use it when the user explicitly asks for it.
  - `haiku` — don't pin it and don't propose it. It is weaker than the local models the user runs
    on his own hardware, so an agent on haiku is worse than not delegating. He reaches for it
    himself now and then; that is his call to make, not a default to fall back on.

  An unpinned agent silently inherits the session model, so pin every one. Delegate sizable
  implementation to pinned agents rather than doing it inline on a top-tier session.
- **When to delegate at all.** Delegate for large tracks of work that are genuinely independent
  and parallelizable — a wide multi-file investigation, several unrelated builds. Not for work
  finishable in a handful of tool calls, and **never to verify or double-check your own work**.
  One agent that can do the job beats several; keep spawn counts low.
- **Ask when project conventions are unclear** rather than guessing.
- **Session start:** if they exist, read `AI_INSTRUCTIONS.md`, then `README.md`, then the relevant
  active plan, before diving in.

## Complex builds — guard rails (`[user-specified]` 2026-07-18)

For any multi-step or multi-agent build (several packages, shared state, long-running flows).
Origin: a five-agent build round delivered green per-package suites while the review found 26
defects, nearly all in the seams BETWEEN packages — these rules make that class structural:

- **The seams are the risk, not the packages.** The plan names every shared state/file/flag with
  ONE owning writer and ONE shared read-predicate; every consumer reads that predicate, never its
  own interpretation of the raw state. Cross-package integration tests cover each named seam.
- **Gating state is a claim.** A status another part gates on may only be set after verified
  success; an error/partial path fails the stage loudly. "Ran but produced nothing" must never
  read as done — that is the silent-wrong-result class.
- **Failure & resume are scope.** Every long-running or multi-stage step specifies its mid-run
  failure behavior and resume semantics (state on disk, not in memory) in the plan, BEFORE build.
- **Builders report deviations and watch items** — mandatory in every build agent's final report.
  A green suite is necessary, never sufficient; a live end-to-end of the real flow closes the loop.
- **Two reviews, at different moments, both by an agent that did not write the thing**
  (`[user-specified]` 2026-07-30):
  - *Before building*, when the plan is complex or must run seamlessly across parallel agents:
    an independent review of the **plan**. This is the routine one — do it almost always for
    that kind of plan, and feed the findings back into the plan before any agent starts.
  - *After building*, a full adversarial review at **milestones** — often several sprints apart,
    not every sprint. That is the `milestone-review` workflow, not `/feature-close` (which is
    hygiene: docs, backlog, archive). The builders' deviations and watch items feed it.
  - Both run on `opus`; `fable` is never the default — separately billed, on explicit request only.
- **Test in proportion to the project.** Cover the real paths including the failure ones, then
  stop. Exhaustive edge-case suites and hours-long runs are a cost, not a virtue, and are worth it
  only where the project actually warrants them — say so in the plan rather than assuming it.

## Project organization (adapt to size)

Minimal by default; add structure only as a project needs it. A small script may only need
`README.md` + `AI_INSTRUCTIONS.md`.

```
project/
├── AI_INSTRUCTIONS.md          # Project rules, hierarchy, agents — tool-agnostic, read first
├── README.md                   # Overview + status
├── roadmap.md                  # Sprint plan and status (larger projects)
├── todo_<date>.md              # Daily task tracker (temp → archive/)
├── concepts/concept.md         # Concept, diagrams, technical decisions
├── docs/                       # Guides, specs; docs/lessons_learned.md = what worked/didn't
├── claude_plans/               # Plan files (PLAN_<topic>.md), git-committed
├── sessions/                   # SESSION_CARRYOVER.md — rolling handover to the next session
├── archive/                    # Outdated content (never delete — archive with date prefix)
└── .claude/
    ├── settings.json           # Project settings (plansDirectory: ./claude_plans)
    └── agents/                 # Project-specific subagents
```

- **Schedule/Planning** = WHEN to do WHAT (time-bound). **Plan** = HOW + in what ORDER.
- **Never delete, always archive** — move outdated content to `archive/` with a `YYYY-MM-DD_` prefix.

## The sprint cycle (how all projects run — `[user-specified]` 2026-07-17)

The standing rhythm, made explicit after repeated mid-implementation permission questions
(he finds them irritating and they misread the rules below):

1. **Concept** — the user's idea; sometimes brainstormed together first.
2. **The project exists** — `/project-setup` scaffolds it, scaled to size. Either order: the
   concept often comes first, but setting the project up first and writing the concept into it
   is equally normal.
3. **Sprint 0, when the work warrants it** — research, requirements, user stories, the overall
   goal, architecture. How deep depends entirely on the project; a small tool skips it.
4. **Roadmap & backlog** — priorities and what groups well into a sprint are set together.
5. **Plan** — the AI writes `claude_plans/PLAN_<name>.md` via `/custom_plan` (see Planning
   workflow below). When the plan is complex or has to run across parallel agents, an agent that
   did not write it reviews it first and the findings go back into the file.
6. **Plan approval** — the user approves the plan, or it is adjusted together. THIS is the
   moment the "plan first, don't build yet" rule protects: approval is review-only; building
   starts only on an explicit "implement PLAN_<name>".
7. **Implementation** — from that point the AI implements, tests, and fixes autonomously,
   **in parallel where the work genuinely splits** — separate agents, each with its own task and
   its own pinned model. Do NOT ask permission for work the approved plan already describes;
   during implementation only genuinely NEW scope, taste/product questions, and actions with real
   crash/data-loss/irreversibility risk still go to the user.
8. **Testing** — to the depth the plan set, no further. Sometimes fully autonomous, sometimes
   only by the user, sometimes both; it varies per project and per occasion.
9. **Feature close** — `/feature-close`: docs updated, leftovers to the backlog, plan archived,
   commit.
10. **Roadmap revisited** — outcomes may add or change items; the next sprint is chosen
    together; the cycle repeats.

A full adversarial review of what was built is separate from all of this and happens at
**milestones**, often several sprints apart — see the guard rails above.

**Occasional full-autonomy mode** — only when the user explicitly says so in chat, per
occasion (e.g. "het is nacht, ga geheel zelfstandig aan de gang, alles is ok"): then the AI
also writes, approves, and starts the plan itself. Never assume this mode; he grants it in
so many words when he wants it.

## Planning workflow (in-project plans; build only on explicit request)

Plans are git-committed files in the project's `claude_plans/` (`plansDirectory` is set, so they
never land in the hidden global `~/.claude/plans/`), named `PLAN_<feature>.md`, archived with a
date prefix when done. `/custom_plan` writes them; `/feature-close` closes them out. Producing or
approving a plan is for review — NOT a signal to start coding.

> Avoid native plan mode for build-it-later planning: approving its plan transitions straight to
> implementation and that can't be overridden here. Use `/custom_plan`, or ask for the plan written
> to the file with "don't implement yet". Build only on an explicit "implement PLAN_<name>".

## Wireframes — a local Penpot is available (`[user-specified]` 2026-07-28)

`~/vibe_claude_kilo_cli_exp/Penpot-Self-Host` holds a self-hosted Penpot an assistant can draw in
unattended, from any project. **Offer it when a picture would settle a screen faster than prose**;
write HTML by hand for a throwaway sketch or a small tweak. The user's instruction ends the
discussion either way. The `/wireframe` skill drives it and carries the operating detail.

## Tone & writing style

Single-homed in the **Personal Voice** output style
(`~/.claude/output-styles/personal-voice.md`, active via `outputStyle`). That is the system-prompt
channel, so it sticks where CLAUDE.md does not. Edit tone there, not here.

## Memory & compaction

- **Native auto-memory owns volatile cross-session state** (`MEMORY.md` and the per-project
  memory dir). Don't hand-maintain a parallel state log in prose.
- **Compaction summary** — keep it short: what's done, what's next, key decisions, watch-outs.
- **After compaction**, re-read `AI_INSTRUCTIONS.md` and `docs/lessons_learned.md` (if they
  exist), then continue.
- **Continuing in a fresh session** — to free up tokens at a sprint/feature boundary and carry on
  without retyping: `/pre-clear-compact` writes `sessions/SESSION_CARRYOVER.md` (status, key
  decisions, working conventions, next step); commit it, then `/clear` (cheapest) or `/compact`. In
  the new session, `/post-clear-handover` reads it back, reports status, proposes the next step, and
  archives the carryover. Both skills scale to what was delivered and skip absent artifacts.

## Where a rule belongs

This file = cross-project process and preferences, loaded every session.
`AI_INSTRUCTIONS.md` = one project's rules, hierarchy and agents, tool-agnostic.
Tone = the output style. Volatile state = native auto-memory. One home each, never two.

---

**Reminder, because this file is long and its top gets diluted:** keep replies and written
documents concise, in plain words, at the length the task actually needs.
````

### 1b. Project CLAUDE.md

There is no `CLAUDE.md` in the root of this project
(`/home/rvanpolen/vibe_claude_kilo_cli_exp/claude_code_setup/`).

The repo does contain a copy at `global_config/CLAUDE.md` (13670 bytes, 198 lines,
modified 2026-07-30 21:16:16). Contents:

````markdown
# Global Claude Code Preferences

Personal cross-project preferences. Two tiers: **Hard rules** are invariants — never violate
them. **Preferences** are defaults — apply them by judgment and override when a task is genuinely
better served otherwise. Reserve absolutes for the Hard-rules block; everything else is guidance.

## Hard rules (never violate)

- **English in files.** All code, docs, comments, plans, and commit messages are English — even
  when the conversation is in Dutch.
- **No AI attribution in commits.** No "Co-Authored-By", "Generated with Claude", or similar.
  (Also enforced via `includeCoAuthoredBy: false` in settings — keep both.)
- **Commit and push only when asked.** Don't commit, push, or open PRs on your own initiative.
- **Never commit secrets or large artifacts** — `.env`, credentials, API keys, model weights.
- **Don't delete or overwrite files you didn't create** without surfacing it first. If a file's
  content contradicts how it was described, stop and report rather than proceeding.

## Preferences (use judgment; override when the task is better served)

- **Scale depth to task size.** Match ceremony to the work: a one-line fix or a question takes a
  short path; a multi-file feature warrants planning, structure, and review. Don't run the full
  process on trivial work, and don't under-build substantial work. The failure mode to resist is
  reading a casual phrase literally and inflating it into a procedure. Calibrate the *answer* the
  same way — see Response calibration in the Personal Voice output style.
- **SOLID, DRY, KISS — decision aids, not slogans** (`[user-specified]` 2026-07-27). Name the
  principle when it settles a structural choice, so the trade-off is visible instead of implicit.
  These apply to infrastructure and configuration too, translated rather than quoted.
  - *S* — one component, one job; if you cannot state that job in a sentence, it is doing two.
  - *O* — extend by adding, not by editing someone else's file: override, don't fork.
  - *L* — a replacement must honour the same contract, so talk to the standard interface and never
    lean on one implementation's quirks.
  - *I* — no consumer should have to know about what it does not use.
  - *D* — depend on an address held in configuration, never a hard-coded name, port or path.
  - *Separation of concerns* is the broader idea S applies at unit level. *KISS* means no clever
    layer that manages things — prefer something that is simply on or off. *DRY* means build it once,
    and one source of truth for facts.
  - When two conflict — DRY and KISS regularly do, since sharing adds coordination — say so and let
    the user decide rather than silently picking one.
- **Write object-oriented code** where code is actually written: small classes with one job, extended
  rather than edited, depending on interfaces rather than concrete implementations. Prefer that to a
  long procedural script even when it starts small — those are the ones that grow.
- **One source of truth.** Each fact lives in one place; reference it elsewhere, don't duplicate.
- **Build on existing work** — evolve what's there rather than rewriting from scratch.
- **Keep docs current** — after a change, fix the docs that describe it. Stale docs mislead.
- **Use the right agent** for its domain (check `.claude/agents/` if present).
- **Token economy for subagents.** Match the model to the task — don't default to the top tier.
  Every agent pins the cheapest `model:` that does the job (`haiku` for mechanical/bulk work,
  `sonnet` for research/docs/standard implementation, `opus` only for genuinely hard
  implementation or design); an unpinned agent silently inherits the expensive session model.
  `fable` sits above opus and is expensive — never pin it as an agent default; use it only for
  the very hardest tasks and only when the user explicitly asks for it. Delegate sizable
  implementation to pinned agents rather than doing it inline on a top-tier session.
- **When to delegate at all.** Delegate for large tracks of work that are genuinely independent
  and parallelizable — a wide multi-file investigation, several unrelated builds. Not for work
  finishable in a handful of tool calls, and **never to verify or double-check your own work**.
  One agent that can do the job beats several; keep spawn counts low.
- **Ask when project conventions are unclear** rather than guessing.
- **Session start:** if they exist, read `AI_INSTRUCTIONS.md`, then `README.md`, then the relevant
  active plan, before diving in.

## Complex builds — guard rails (`[user-specified]` 2026-07-18)

For any multi-step or multi-agent build (several packages, shared state, long-running flows).
Origin: a five-agent build round delivered green per-package suites while the review found 26
defects, nearly all in the seams BETWEEN packages — these rules make that class structural:

- **The seams are the risk, not the packages.** The plan names every shared state/file/flag with
  ONE owning writer and ONE shared read-predicate; every consumer reads that predicate, never its
  own interpretation of the raw state. Cross-package integration tests cover each named seam.
- **Gating state is a claim.** A status another part gates on may only be set after verified
  success; an error/partial path fails the stage loudly. "Ran but produced nothing" must never
  read as done — that is the silent-wrong-result class.
- **Failure & resume are scope.** Every long-running or multi-stage step specifies its mid-run
  failure behavior and resume semantics (state on disk, not in memory) in the plan, BEFORE build.
- **Builders report deviations and watch items** — mandatory in every build agent's final report.
  A green suite is necessary, never sufficient; a live end-to-end of the real flow closes the loop.
- **Two reviews, at different moments, both by an agent that did not write the thing**
  (`[user-specified]` 2026-07-30):
  - *Before building*, when the plan is complex or must run seamlessly across parallel agents:
    an independent review of the **plan**. This is the routine one — do it almost always for
    that kind of plan, and feed the findings back into the plan before any agent starts.
  - *After building*, a full adversarial review at **milestones** — often several sprints apart,
    not every sprint. That is the `milestone-review` workflow, not `/feature-close` (which is
    hygiene: docs, backlog, archive). The builders' deviations and watch items feed it.
  - Both run on `opus`; `fable` is never the default — separately billed, on explicit request only.
- **Test in proportion to the project.** Cover the real paths including the failure ones, then
  stop. Exhaustive edge-case suites and hours-long runs are a cost, not a virtue, and are worth it
  only where the project actually warrants them — say so in the plan rather than assuming it.

## Project organization (adapt to size)

Minimal by default; add structure only as a project needs it. A small script may only need
`README.md` + `AI_INSTRUCTIONS.md`.

```
project/
├── AI_INSTRUCTIONS.md          # Project rules, hierarchy, agents — tool-agnostic, read first
├── README.md                   # Overview + status
├── roadmap.md                  # Sprint plan and status (larger projects)
├── todo_<date>.md              # Daily task tracker (temp → archive/)
├── concepts/concept.md         # Concept, diagrams, technical decisions
├── docs/                       # Guides, specs; docs/lessons_learned.md = what worked/didn't
├── claude_plans/               # Plan files (PLAN_<topic>.md), git-committed
├── sessions/                   # SESSION_CARRYOVER.md — rolling handover to the next session
├── archive/                    # Outdated content (never delete — archive with date prefix)
└── .claude/
    ├── settings.json           # Project settings (plansDirectory: ./claude_plans)
    └── agents/                 # Project-specific subagents
```

- **Schedule/Planning** = WHEN to do WHAT (time-bound). **Plan** = HOW + in what ORDER.
- **Never delete, always archive** — move outdated content to `archive/` with a `YYYY-MM-DD_` prefix.

## The sprint cycle (how all projects run — `[user-specified]` 2026-07-17)

The standing rhythm, made explicit after repeated mid-implementation permission questions
(he finds them irritating and they misread the rules below):

1. **Concept** — the user's idea; sometimes brainstormed together first.
2. **The project exists** — `/project-setup` scaffolds it, scaled to size. Either order: the
   concept often comes first, but setting the project up first and writing the concept into it
   is equally normal.
3. **Sprint 0, when the work warrants it** — research, requirements, user stories, the overall
   goal, architecture. How deep depends entirely on the project; a small tool skips it.
4. **Roadmap & backlog** — priorities and what groups well into a sprint are set together.
5. **Plan** — the AI writes `claude_plans/PLAN_<name>.md` via `/custom_plan` (see Planning
   workflow below). When the plan is complex or has to run across parallel agents, an agent that
   did not write it reviews it first and the findings go back into the file.
6. **Plan approval** — the user approves the plan, or it is adjusted together. THIS is the
   moment the "plan first, don't build yet" rule protects: approval is review-only; building
   starts only on an explicit "implement PLAN_<name>".
7. **Implementation** — from that point the AI implements, tests, and fixes autonomously,
   **in parallel where the work genuinely splits** — separate agents, each with its own task and
   its own pinned model. Do NOT ask permission for work the approved plan already describes;
   during implementation only genuinely NEW scope, taste/product questions, and actions with real
   crash/data-loss/irreversibility risk still go to the user.
8. **Testing** — to the depth the plan set, no further. Sometimes fully autonomous, sometimes
   only by the user, sometimes both; it varies per project and per occasion.
9. **Feature close** — `/feature-close`: docs updated, leftovers to the backlog, plan archived,
   commit.
10. **Roadmap revisited** — outcomes may add or change items; the next sprint is chosen
    together; the cycle repeats.

A full adversarial review of what was built is separate from all of this and happens at
**milestones**, often several sprints apart — see the guard rails above.

**Occasional full-autonomy mode** — only when the user explicitly says so in chat, per
occasion (e.g. "het is nacht, ga geheel zelfstandig aan de gang, alles is ok"): then the AI
also writes, approves, and starts the plan itself. Never assume this mode; he grants it in
so many words when he wants it.

## Planning workflow (in-project plans; build only on explicit request)

Plans are git-committed files in the project's `claude_plans/` (`plansDirectory` is set, so they
never land in the hidden global `~/.claude/plans/`), named `PLAN_<feature>.md`, archived with a
date prefix when done. `/custom_plan` writes them; `/feature-close` closes them out. Producing or
approving a plan is for review — NOT a signal to start coding.

> Avoid native plan mode for build-it-later planning: approving its plan transitions straight to
> implementation and that can't be overridden here. Use `/custom_plan`, or ask for the plan written
> to the file with "don't implement yet". Build only on an explicit "implement PLAN_<name>".

## Wireframes — a local Penpot is available (`[user-specified]` 2026-07-28)

`~/vibe_claude_kilo_cli_exp/Penpot-Self-Host` holds a self-hosted Penpot an assistant can draw in
unattended, from any project. **Offer it when a picture would settle a screen faster than prose**;
write HTML by hand for a throwaway sketch or a small tweak. The user's instruction ends the
discussion either way. The `/wireframe` skill drives it and carries the operating detail.

## Tone & writing style

Single-homed in the **Personal Voice** output style
(`~/.claude/output-styles/personal-voice.md`, active via `outputStyle`). That is the system-prompt
channel, so it sticks where CLAUDE.md does not. Edit tone there, not here.

## Memory & compaction

- **Native auto-memory owns volatile cross-session state** (`MEMORY.md` and the per-project
  memory dir). Don't hand-maintain a parallel state log in prose.
- **Compaction summary** — keep it short: what's done, what's next, key decisions, watch-outs.
- **After compaction**, re-read `AI_INSTRUCTIONS.md` and `docs/lessons_learned.md` (if they
  exist), then continue.
- **Continuing in a fresh session** — to free up tokens at a sprint/feature boundary and carry on
  without retyping: `/pre-clear-compact` writes `sessions/SESSION_CARRYOVER.md` (status, key
  decisions, working conventions, next step); commit it, then `/clear` (cheapest) or `/compact`. In
  the new session, `/post-clear-handover` reads it back, reports status, proposes the next step, and
  archives the carryover. Both skills scale to what was delivered and skip absent artifacts.

## Where a rule belongs

This file = cross-project process and preferences, loaded every session.
`AI_INSTRUCTIONS.md` = one project's rules, hierarchy and agents, tool-agnostic.
Tone = the output style. Volatile state = native auto-memory. One home each, never two.

---

**Reminder, because this file is long and its top gets diluted:** keep replies and written
documents concise, in plain words, at the length the task actually needs.
````

The two files differ in one place — the subagent-model bullet (lines 46–55 in
`~/.claude/CLAUDE.md`, lines 46–51 in `global_config/CLAUDE.md`). Diff output:

```diff
46,55c46,51
< - **Model tiers for subagents** (`[user-specified]` 2026-08-16). Match the model to the task.
<   - `sonnet` — simple mechanical tasks, research, documentation. Bulk work goes here too.
<   - `opus` — anything that writes or modifies code or configuration.
<   - `fable` — the hardest tasks only: deep judgement, adversarial review, design. Separately
<     billed, so never an agent default; use it when the user explicitly asks for it.
<   - `haiku` — don't pin it and don't propose it. It is weaker than the local models the user runs
<     on his own hardware, so an agent on haiku is worse than not delegating. He reaches for it
<     himself now and then; that is his call to make, not a default to fall back on.
<
<   An unpinned agent silently inherits the session model, so pin every one. Delegate sizable
---
> - **Token economy for subagents.** Match the model to the task — don't default to the top tier.
>   Every agent pins the cheapest `model:` that does the job (`haiku` for mechanical/bulk work,
>   `sonnet` for research/docs/standard implementation, `opus` only for genuinely hard
>   implementation or design); an unpinned agent silently inherits the expensive session model.
>   `fable` sits above opus and is expensive — never pin it as an agent default; use it only for
>   the very hardest tasks and only when the user explicitly asks for it. Delegate sizable
```

---

## 2. `~/.claude/output-styles/` and `~/.claude/skills/`

### 2a. `~/.claude/output-styles/`

One file.

| File | Size | Modified |
|---|---|---|
| `personal-voice.md` | 4013 bytes | 2026-07-30 23:50 |

Frontmatter of `personal-voice.md`:

```yaml
---
name: Personal Voice
description: Personal communication and writing register — direct, neutral, no hollow validation
keep-coding-instructions: true
---
```

### 2b. `~/.claude/skills/`

Nine directories, each containing exactly one file, `SKILL.md`.

| Directory | Modified |
|---|---|
| `contained-browser/` | 2026-07-30 10:59 |
| `custom_plan/` | 2026-07-18 18:37 |
| `doc-sweep/` | 2026-07-28 23:12 |
| `feature-close/` | 2026-07-23 09:06 |
| `post-clear-handover/` | 2026-07-23 08:46 |
| `pre-clear-compact/` | 2026-07-04 16:00 |
| `project-setup/` | 2026-07-27 17:06 |
| `realign-project/` | 2026-07-03 20:59 |
| `wireframe/` | 2026-07-31 19:45 |

Frontmatter per skill, verbatim:

**`contained-browser/SKILL.md`**
```yaml
name: contained-browser
description: Drive a headless Chromium in a container over MCP, for any purpose — open a page, fill a form, screenshot it, scrape a value, test a local web app. Use when a task needs a real browser and the user's own browser must not be touched. Isolated profile, loopback-only endpoint, nothing of the user's in it. Not for Penpot work; use the wireframe skill for that.
```

**`custom_plan/SKILL.md`**
```yaml
name: custom_plan
description: Plan a sprint, feature, or substantial change WITHOUT using Claude Code's native plan mode (which auto-executes the moment you approve the plan). Named custom_plan on purpose to signal it deliberately differs from native plan mode. Use when the user says "custom_plan X", "plan X", "maak een plan voor X", "ontwerp deze feature", or wants a persistent, reviewable plan file before any code is written. Researches read-only, writes claude_plans/PLAN_<name>.md, then STOPS — building happens only later on an explicit "implement PLAN_<name>" instruction.
```

**`doc-sweep/SKILL.md`**
```yaml
name: doc-sweep
description: Run the doc-consistency sweep as a capped, saved workflow — parallel cluster readers, one verifier, one merger; only the merged findings list reaches the main thread. Use at sprint close on a project with a substantial doc tree, or as a periodic maintenance sweep. Trigger on "doc-sweep", "run the doc sweep", "docs-consistentie-sweep", "sweep the docs". For a small project (a handful of docs) skip the fleet and delegate a single doc-keeper/sonnet pass instead.
```

**`feature-close/SKILL.md`**
```yaml
name: feature-close
description: Close out a delivered feature or sprint — verify docs/roadmap reflect what was actually built, carry leftovers to the backlog explicitly, graduate durable lessons to lessons_learned, archive the plan with a date prefix + status note, and report. Use when the user says "feature-close", "sluit de feature af", "close the sprint", "end-of-sprint hygiene", or asks for tidy-up after a delivered feature. Generic across projects; skips artifacts a project doesn't have.
```

**`post-clear-handover/SKILL.md`**
```yaml
name: post-clear-handover
description: Start a fresh session from the handover written by /pre-clear-compact — reads sessions/SESSION_CARRYOVER.md first, then targeted project docs; reports where things stand, proposes the next step WITHOUT doing it, and archives the handover. Run as the first command after /clear in the pre-clear-compact flow. NOT meant for resuming after a plain built-in /compact (that leaves no handover doc); without a handover it falls back to reading the project docs. Trigger on "post-clear-handover", "praat me bij", "waar staan we", "verder na de clear". Counterpart to /pre-clear-compact.
effort: medium
```

**`pre-clear-compact/SKILL.md`**
```yaml
name: pre-clear-compact
description: Write a durable session-carryover note BEFORE freeing up context, so the next session continues with no loss — a full replacement for the built-in /compact, not a thin summary. Use at any point you want to free tokens: at a clean sprint/feature boundary (thin note + pointers) or mid-way through complex, unfinished work (full in-flight capture). Trigger on "pre-clear-compact", "schrijf carryover", "carryover schrijven", "leg context vast voor de compact", "bewaar context voor nieuwe sessie". Writes sessions/SESSION_CARRYOVER.md and STOPS. Counterpart: /post-clear-handover picks it up.
```

**`project-setup/SKILL.md`**
```yaml
name: project-setup
description: "Interactive workflow to scaffold a NEW project with the preferred structure, docs, agents, and workflow. Trigger on \"set up a new project\", \"scaffold a project\", \"new repo structure\", \"create AI_INSTRUCTIONS\", \"bootstrap a project\", or \"verify my Claude Code setup on a new PC\". For auditing/fixing an EXISTING project against these conventions, use /realign instead."
```

**`realign-project/SKILL.md`**
```yaml
name: realign-project
description: Use when an existing project's Claude Code setup feels heavy, slow, or bureaucratic after a model upgrade, or to audit CLAUDE.md / AI_INSTRUCTIONS.md / agents / skills / settings / memory for tiering, duplication, dead references, stale shadow memory, and over-ceremony. Counterpart to project-setup (which sets up new projects). Invoke explicitly with /realign.
```

**`wireframe/SKILL.md`**
```yaml
name: wireframe
description: Draw a picture in a real design tool instead of describing it in prose, and hand it back. Two jobs. A SCREEN — wireframe or mock-up — when the layout of a screen is unsettled and seeing it decides it, when asked what a screen should look like, or when an ASCII sketch is about to be written for something that will be iterated on. A DIAGRAM — architecture, components, C4, boxes and arrows — when asked how a system fits together, for a component overview, or for a picture of the architecture to put in the docs. Drives a local self-hosted Penpot, starts it when needed and stops it afterwards. Not for a throwaway one-look sketch or a small tweak to something already written — write HTML or ASCII by hand for those.
```

---

## 3. Active output style

**Personal Voice** (`~/.claude/output-styles/personal-voice.md`).

Set in `~/.claude/settings.json`:

```json
"outputStyle": "Personal Voice",
```

The running session confirms it is loaded — the style's text is present in the system prompt.

---

## 4. `~/.claude/settings.json`

Path: `/home/rvanpolen/.claude/settings.json` — 2053 bytes, modified 2026-08-15 11:00.

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "env": {
    "DISABLE_TELEMETRY": "1",
    "DISABLE_ERROR_REPORTING": "1",
    "BASH_DEFAULT_TIMEOUT_MS": "300000",
    "BASH_MAX_TIMEOUT_MS": "600000"
  },
  "attribution": {
    "commit": "",
    "pr": "",
    "sessionUrl": false
  },
  "includeCoAuthoredBy": false,
  "permissions": {
    "allow": [
      "Bash(nvidia-smi:*)",
      "Bash(docker ps:*)",
      "Bash(docker logs:*)",
      "Bash(docker inspect:*)",
      "Bash(docker rm:*)",
      "Bash(docker stop:*)",
      "Bash(docker start:*)",
      "Bash(docker run:*)",
      "Bash(docker compose:*)",
      "Bash(uv run:*)",
      "Bash(.venv/bin/distillery:*)",
      "Bash(distillery:*)",
      "Bash(.venv/bin/python:*)",
      "Bash(tmux:*)",
      "Bash(./start.sh:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)"
    ],
    "deny": [
      "Read(**/sampling_prompts.txt)"
    ],
    "defaultMode": "default"
  },
  "model": "opus[1m]",
  "fallbackModel": [
    "claude-opus-4-8",
    "claude-opus-4-7",
    "claude-sonnet-5"
  ],
  "enabledPlugins": {
    "last30days@last30days-skill": true
  },
  "extraKnownMarketplaces": {
    "last30days-skill": {
      "source": {
        "source": "github",
        "repo": "mvanhorn/last30days-skill"
      }
    }
  },
  "outputStyle": "Personal Voice",
  "alwaysThinkingEnabled": true,
  "effortLevel": "xhigh",
  "plansDirectory": "./claude_plans",
  "showThinkingSummaries": true,
  "skipDangerousModePermissionPrompt": true,
  "skipWorkflowUsageWarning": true,
  "theme": "auto",
  "verbose": true,
  "autoMode": {
    "allow": [
      "$defaults",
      "This is the user's own single-user development machine and he owns all of its GPUs and Docker. Local GPU training runs, Docker container lifecycle (run/stop/rm/logs), and starting/stopping the local llama-server are authorized routine dev-loop actions and should be allowed without a per-action sentence."
    ]
  }
}
```

Two other settings files exist and were not asked for, listed here only as present:
`~/.claude/settings.local.json` (193 bytes, 2026-05-30 11:42) and this project's
`.claude/settings.json` (112 bytes, 2026-02-17).

---

## 5. Other CLAUDE.md files in the project folders

Search: `find /home/rvanpolen/vibe_claude_kilo_cli_exp -name "CLAUDE.md"`, excluding
`node_modules/` and `.git/`. Six hits.

| Path | Size | Lines | Modified |
|---|---|---|---|
| `claude_code_setup/global_config/CLAUDE.md` | 13670 | 198 | 2026-07-30 21:16:16 |
| `firecrawl/firecrawl-upstream/CLAUDE.md` | 1464 | 18 | 2026-05-25 14:54:08 |
| `llama_cpp/claude-local/home/CLAUDE.md` | 5582 | 108 | 2026-02-24 12:41:55 |
| `llama_cpp/llama.cpp/CLAUDE.md` | 106 | 1 | 2026-02-13 15:52:05 |
| `organize/plantuml-ref/CLAUDE.md` | 1596 | 46 | 2026-04-05 14:56:19 |
| `smartprep_main/SmartPrepper/.claude/CLAUDE.md` | 1502 | 27 | 2026-08-02 19:31:52 |

A second search across `/home/rvanpolen` at depth 3 found one further file outside the
projects tree: `/home/rvanpolen/.claude/CLAUDE.md` (the global one, shown in section 1a).
