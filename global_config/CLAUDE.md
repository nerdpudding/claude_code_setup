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
  process on trivial work, and don't under-build substantial work. Calibrate the *answer* the same
  way — see Response calibration in the Personal Voice output style. (The user prefers Opus 4.6's
  register: it read intent from a short prompt and returned one right-sized answer. 4.7/4.8 are more
  literal and tend to inflate a casual phrase into a procedure — actively resist that.)
- **SOLID, DRY, KISS** — pragmatically. Modularity and flexibility where they pay off.
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
- **Ask when project conventions are unclear** rather than guessing.
- **Session start:** if they exist, read `AI_INSTRUCTIONS.md`, then `README.md`, then the relevant
  active plan, before diving in.

## Complex builds — guard rails (`[user-specified]` 2026-07-18, after the Distillery Sprint-12 review)

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
- **Builders report deviations and watch items** — mandatory in every build agent's final report;
  the orchestrator feeds them into a **post-build adversarial review at a HIGHER tier than the
  builders**, focused on the seams, whose findings are fixed before any live gate. A green suite
  is necessary, never sufficient; a live end-to-end of the real flow closes the loop.

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

1. **Concept** — the user's idea; sometimes brainstormed together first. Often a sprint 0
   turns it into a technical/functional design.
2. **Roadmap & backlog** — priorities and what groups well into a sprint are set together.
3. **Plan** — the AI writes `claude_plans/PLAN_<name>.md` (see Planning workflow below).
4. **Plan approval** — the user approves the plan, or it is adjusted together. THIS is the
   moment the "plan first, don't build yet" rule protects: approval is review-only; building
   starts only on an explicit "implement PLAN_<name>".
5. **Implementation** — from that point the AI implements, tests, and fixes autonomously.
   Do NOT ask permission for work the approved plan already describes; during implementation
   only genuinely NEW scope, taste/product questions, and actions with real
   crash/data-loss/irreversibility risk still go to the user.
6. **Feature close** — docs updated, leftovers to the backlog, plan archived, commit.
7. **Roadmap revisited** — outcomes may add or change items; the next sprint is chosen
   together; the cycle repeats.

**Occasional full-autonomy mode** — only when the user explicitly says so in chat, per
occasion (e.g. "het is nacht, ga geheel zelfstandig aan de gang, alles is ok"): then the AI
also writes, approves, and starts the plan itself. Never assume this mode; he grants it in
so many words when he wants it.

## Planning workflow (in-project plans; build only on explicit request)

Plans live **in the project** in `claude_plans/` (via `plansDirectory`, which is set — so plans
are NOT written to the hidden global `~/.claude/plans/`). They are git-committed, named after the
feature or sprint (`PLAN_<feature>.md`, e.g. `PLAN_sprint3_auth.md`), and persist for review and
manual editing. Archive with a date prefix when done.

**Preferred: the `/custom_plan` skill.** For a sprint or feature, use `/custom_plan <name>` — it researches
read-only, writes `claude_plans/PLAN_<name>.md`, and stops. It deliberately avoids native plan mode
(whose approval step jumps straight to coding). Building happens only on a later explicit
"implement PLAN_<name>". After delivery, `/feature-close` runs the hygiene pass (docs check,
leftovers to the backlog, archive the plan with a date prefix).

Equivalent without the skill: ask for the plan written to `claude_plans/PLAN_<name>.md` with "don't
implement yet". Either way, producing/approving a plan is for review — NOT a signal to start coding.

> Avoid native plan mode for build-it-later planning: approving its plan transitions straight to
> implementation and that can't be overridden here. Use `/custom_plan` (or the file-first request) instead.
> Implement only when explicitly told (e.g. "implement PLAN_<name>").

## Tone & writing style

Governed by the **Personal Voice** output style (`~/.claude/output-styles/personal-voice.md`),
active via `outputStyle` in settings — the system-prompt channel, so it actually sticks. That file
is the single home for the tone/register rules (no "fair", no hollow validation, never suggest
stopping, neutral/impersonal voice, no emojis). Edit tone there, not here.

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

## CLAUDE.md vs AI_INSTRUCTIONS.md

| File | Scope | Purpose |
|------|-------|---------|
| `CLAUDE.md` (this file) | Global | Cross-project preferences, auto-loaded by Claude Code |
| `AI_INSTRUCTIONS.md` | Per-project | Project rules/hierarchy/agents; tool-agnostic primary doc |

Keep cross-project process/preferences here and project specifics in `AI_INSTRUCTIONS.md`. Tone
lives in the **Personal Voice** output style (see "Tone & writing style" above) — one home, the
strong channel.
