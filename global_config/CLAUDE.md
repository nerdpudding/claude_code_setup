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
- **Learn from what failed** — when an approach fails or wastes effort, note it in the project's
  `docs/lessons_learned.md`, where it keeps one.
- **Test in proportion, and only what the change can affect** (`[user-specified]` 2026-07-30 and
  2026-09-19 — he hates needless testing). Cover the real paths including the failure ones, then
  stop; an exhaustive edge-case suite or an hours-long run needs its reason stated in the plan.
  Run only the tests a change can reach. A change to documents, agent files, skills or memory
  runs no test: tests are for code, and documents are guarded by the pointer repair after a move
  and the doc audit at the close. The full suite is for a change to code or configuration that
  runs — never a closing ritual.
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
- **Settle a doubt from the files** — read them before asking anything; a routine call they do
  not settle is made, and named in one clause.
- **A how-to question gets an answer and a recommendation, not an action.**
- **Never block the chat.** A long job is detached so the conversation stays answerable, and a
  background helper is announced before it starts: the command, its log, what it does, when it
  ends. What he may want to open goes into the project, never into a scratchpad he cannot see.
- **Session start:** if they exist, read `AI_INSTRUCTIONS.md`, then `README.md`, then the relevant
  active plan, before diving in. A subagent reads `AI_INSTRUCTIONS.md` first too: it loads this
  file by itself, but not that one.

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
- **Builders report deviations and watch items** — mandatory in every build agent's final report,
  and written into the plan file under "Deviations as built" before the close, so they are archived
  with the plan and a later review can read them. A green suite is necessary, never sufficient; a
  live end-to-end of the real flow closes the loop.
- **Two reviews, at different moments, both by an agent that did not write the thing**
  (`[user-specified]` 2026-07-30):
  - *Before building*, when the plan is complex or must run seamlessly across parallel agents:
    an independent review of the **plan**. This is the routine one — do it almost always for
    that kind of plan, and feed the findings back into the plan before any agent starts.
  - *After building*, a full adversarial review at **milestones** — often several sprints apart,
    not every sprint. That is the `milestone-review` workflow, not `/feature-close` (which is
    hygiene: docs, backlog, archive). The builders' deviations and watch items feed it.
  - Both run on `opus`; `fable` is never the default — separately billed, on explicit request only.

## Project organization (adapt to size)

Minimal by default; add structure only as a project needs it. A small script may only need
`README.md` + `AI_INSTRUCTIONS.md`.

```
project/
├── AI_INSTRUCTIONS.md          # Project rules, hierarchy, agents — read first
├── README.md                   # Overview + status
├── roadmap.md                  # Sprint plan and status (larger projects)
├── todo_<date>.md              # Daily task tracker (temp → archive/)
├── concepts/                   # concept.md; requirements.md — frozen once the roadmap is built on it
├── docs/                       # Category folders (install/, architecture/, ...) from the first day;
│                               #   only lessons_learned.md (what worked/didn't) sits in its root
├── claude_plans/               # Plan files (PLAN_<topic>.md), git-committed
├── sessions/                   # SESSION_CARRYOVER.md — rolling handover to the next session
├── archive/                    # Outdated content (never delete — archive with date prefix)
└── .claude/
    ├── settings.json           # Project settings (plansDirectory: ./claude_plans)
    └── agents/                 # Project-specific subagents
```

- **Schedule/Planning** = WHEN to do WHAT (time-bound). **Plan** = HOW + in what ORDER.
- **Never delete, always archive** — move outdated content to `archive/` with a `YYYY-MM-DD_` prefix.
  That is not "never move": a document nobody reads to do the next work any more is archived too.
- **One tree, and pointers that cannot rot** (`[user-specified]` 2026-09-19). The hierarchy in
  `AI_INSTRUCTIONS.md` is the only place that says where things live; every other file points at
  a document and never repeats the tree. Paths in code come from configuration. Origin: a flat
  `docs/` that needed 130 references rewritten before Sprint 2.
  - *The tree holds* every folder with one clause on its purpose, the core files by name
    (`AI_INSTRUCTIONS.md`, `README.md`, `roadmap.md`, `docs/lessons_learned.md`,
    `sessions/SESSION_CARRYOVER.md`, and what `claude_plans/` and `archive/` are for), and the
    project-specific files another document or an agent points at by name. Never status, counts,
    dates or versions, and not the rest of the application.
  - *A pointer is* the path from the project root; between files inside `docs/`, a Markdown link
    whose text is that root path and whose target is relative —
    `[docs/install/install.md](../install/install.md)` — so it stays clickable and one grep on
    the root path still finds it.
  - *After a move or rename*, `git grep` the file name across the whole project and rewrite every
    hit — also in the other projects under the same parent folder, when the new target is known.
  - *Dated records* — `archive/`, `claude_plans/`, a daily tracker — keep the pointers they were
    written with.
- **Pointers across projects rest on the name, never on the folder** (`[user-specified]`
  2026-09-19). No test can check another project's paths, so the pointer has to survive a move by
  itself. One line does it, plus the path of that project's `AI_INSTRUCTIONS.md` — the one fixed
  address a project has, and not always in its top folder — so the reader finds the file through
  the tree there: `<project>: lessons_learned.md (lesson 27, copied lists in agent files)`.
  Name the section, never a line number. Point at the file that owns the fact, not at a copy of
  it, and quote the values the pointer relies on, so a change shows up as a mismatch and not as a
  silent wrong answer. A file that other projects cite is marked so in its own tree and keeps its
  name. The limit: a data file deep inside another project — a model, an adapter — is below what
  that tree lists, so its path lives in ONE configuration entry on the pointing side, with the
  date it was last verified, never in prose.

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

**Nothing grows beside this cycle** (`[user-specified]` 2026-09-19). An agent's brief goes in its
prompt and its report comes back in the conversation — neither becomes a file. A plan review goes
into the plan, never into a document of its own (the milestone review is the one that writes a
dated review document). The docs check is the doc-keeper half of
`/feature-close`, not a step beside it. Project rules live in `AI_INSTRUCTIONS.md`, not in
auto-memory. A new step or a new kind of file needs the user's word: the burden of proof is on
adding, never on leaving out. Origin: a project where building took under a third of the tokens
and the rest went to paper about paper.

**Occasional full-autonomy mode** — only when the user explicitly says so in chat, per
occasion (e.g. "het is nacht, ga geheel zelfstandig aan de gang, alles is ok"): then the AI
also writes, approves, and starts the plan itself. Never assume this mode; he grants it in
so many words when he wants it.

## Planning workflow (in-project plans; build only on explicit request)

Never native plan mode for build-later planning — approving its plan starts the build, and that
cannot be overridden here. Use `/custom_plan`, which writes the plan file and stops.

## Wireframes — a local Penpot is available (`[user-specified]` 2026-07-28)

A self-hosted Penpot is there to draw in unattended, from any project. **Offer it when a picture
would settle a screen faster than prose**; the user's word ends the discussion either way.
`/wireframe` drives it and carries the operating detail.

## Tone & writing style

Single-homed in the **Personal Voice** output style
(`~/.claude/output-styles/personal-voice.md`, active via `outputStyle`). That is the system-prompt
channel, so it sticks where CLAUDE.md does not. Edit tone there, not here.

## Memory & compaction

- **Auto-memory is an inbox, not a home.** Claude Code notes things there by itself; nothing
  belongs there. `/realign-project` files what landed in it.
- **Compaction summary** — keep what the user asked, decided, ruled out or corrected in his own
  words, what was tried and set aside, and names, numbers and paths exactly.
- **After compaction**, re-read `AI_INSTRUCTIONS.md` and `docs/lessons_learned.md` (if they
  exist), then continue.
- **Continuing in a fresh session** — `/pre-clear-compact` writes the carryover, commit it,
  `/clear`, then `/post-clear-handover` picks it up.

## Where a rule belongs

This file = cross-project process and preferences, loaded every session.
`AI_INSTRUCTIONS.md` = one project's rules, hierarchy and agents — THE authoritative source for
that project. A project keeps no rules in a `CLAUDE.md` of its own, neither in its root
nor in `.claude/`: that would be a second home. When `AI_INSTRUCTIONS.md` runs long, DETAIL moves
to a sub-doc it names — working laws for one kind of work, standing product decisions — and the
rules stay; they never move to a `CLAUDE.md` or to memory.
Tone = the output style. The state of the work = `roadmap.md` and the session carryover.
One home each, never two.

---

**Reminder, because this file is long and its top gets diluted:** keep replies and written
documents concise, in plain words, at the length the task actually needs.
