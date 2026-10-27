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
  They apply to infrastructure and configuration too, translated rather than quoted. When two
  conflict — DRY and KISS regularly do — say so and let the user decide rather than silently
  picking one.
- **Write object-oriented code** where code is actually written: small classes with one job, extended
  rather than edited, depending on interfaces rather than concrete implementations. Prefer that to a
  long procedural script even when it starts small — those are the ones that grow.
- **One source of truth.** Each fact lives in one place; reference it elsewhere, don't duplicate.
- **Build on existing work** — evolve what's there rather than rewriting from scratch.
- **Keep docs current** — after a change, fix the docs that describe it. Stale docs mislead.
- **Keep the account name out of tracked files where it can be avoided** (`[user-specified]`
  2026-10-22): it identifies the user and breaks on another machine. A home path is written
  `~/...` in a document and `$HOME` in a script; in code it comes from configuration ("Paths in code come
  from configuration" below). An ssh login or a git remote keeps the name. `/realign-project`
  check 14 holds the procedure.
- **Learn from what failed** — when an approach fails or wastes effort, note it in the project's
  `docs/lessons_learned.md`, where it keeps one.
- **Test in proportion, and only what the change can affect** (`[user-specified]` 2026-07-30 and
  2026-09-19 — needless testing costs time and is unwanted). Cover the real paths including the
  failure ones, then stop; an exhaustive edge-case suite or an hours-long run needs its reason stated in the plan.
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
  - `haiku` — don't pin it and don't propose it. It is weaker than the local models available on
    this machine, so an agent on haiku is worse than not delegating. The user may choose it for a
    run; that is never a default to fall back on.

  An unpinned agent silently inherits the session model, so pin every one. Delegate sizable
  implementation to pinned agents rather than doing it inline on a top-tier session.
- **When to delegate at all.** Delegate for large tracks of work that are genuinely independent
  and parallelizable — a wide multi-file investigation, several unrelated builds. Not for work
  finishable in a handful of tool calls, and **never to verify or double-check your own work**.
  One agent that can do the job beats several; keep spawn counts low.
- **Settle a doubt from the files** — read them before asking anything; a routine call they do
  not settle is made, and named in one clause.
- **Never block the chat.** A long job is detached so the conversation stays answerable, and a
  background helper is announced before it starts: the command, its log, what it does, when it
  ends. What the user may want to open goes into the project, never into a scratchpad they
  cannot see.
- **A sound when the user is needed** (`[user-specified]` 2026-10-22). After an implementation
  round, and right before asking them for a decision, the main session runs
  `bash __HOME__/.claude/skills/beep/beep.sh` — silent unless `/beep` switched it on. Never in
  regular chat, never from a subagent.
- **Delete with a full path, as a command of its own** (`[user-specified]` 2026-10-17). Allow rules
  in `settings.json` approve `rm`, `rm -r` and `rm -rf` on any path under
  `__HOME__/vibe_claude_kilo_cli_exp/` without the auto mode classifier, which otherwise refuses such
  deletes even at the user's explicit word. The rules match the command text, so write the full
  path and put no `cd ... &&` in front. They do not check whether the user asked: delete only what
  they asked for or what you created yourself.
- **Session start:** if they exist, read `AI_INSTRUCTIONS.md`, then `README.md`, then the relevant
  active plan, before diving in. A subagent reads `AI_INSTRUCTIONS.md` first too: it loads this
  file by itself, but not that one.

## Complex builds — guard rails (`[user-specified]` 2026-07-18)

For any multi-step or multi-agent build (several packages, shared state, long-running flows).
What a plan must contain — every seam with one writer and one shared read, failure and resume
semantics — is in `/custom_plan`'s plan template. These hold while building:

- **Gating state is a claim.** A status another part gates on may only be set after verified
  success; an error/partial path fails the stage loudly. "Ran but produced nothing" must never
  read as done — that is the silent-wrong-result class.
- **Builders report deviations and watch items** — mandatory in every build agent's final report,
  and written into the plan file under "Deviations as built" before the close, so they are archived
  with the plan and a later review can read them. A green suite is necessary, never sufficient; a
  live end-to-end of the real flow closes the loop.
- **Two reviews, both by an agent that did not write the thing** (`[user-specified]` 2026-07-30):
  the plan before building, by the project's `plan-reviewer` agent; what was built at
  **milestones**, often several sprints apart, by the `milestone-review` workflow — not
  `/feature-close`, which is hygiene. Both on `opus`; `fable` only on explicit request.

## Project organization (adapt to size)

Minimal by default; add structure only as a project needs it. A small script may only need
`README.md`, `AI_INSTRUCTIONS.md` and the two agents every project has, `doc-keeper` and
`plan-reviewer`.

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
    written with; only a home path in them becomes `~/...`, which keeps its meaning.
- **Pointers across projects rest on the name, never on the folder** (`[user-specified]`
  2026-09-19): the file name and its section, never a folder path or a line number.
  `/realign-project` check 16 holds the detail.

## The sprint cycle (how all projects run — `[user-specified]` 2026-07-17)

The standing rhythm, made explicit after repeated mid-implementation permission questions
(they interrupt the work and misread the rules below):

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
occasion (e.g. "it's night, work fully on your own, everything is fine"): then the AI
also writes, approves, and starts the plan itself. Never assume this mode; the user grants it
in so many words when they want it.

## Planning workflow (in-project plans; build only on explicit request)

Never native plan mode for build-later planning — approving its plan starts the build, and that
cannot be overridden here. Use `/custom_plan`, which writes the plan file and stops.

## Wireframes — a local Penpot is available (`[user-specified]` 2026-07-28)

A self-hosted Penpot is there to draw in unattended, from any project. **It is a help, not a step:
offer it only for a large screen design where words do not settle it, and draw only on the user's
word** (`[user-specified]` 2026-10-18 — a drawing takes minutes per screen, and drawings the user did
not ask for are noise). Never put "draw first" into a project's rules or a sprint's deliverables; the
user's word ends the discussion either way. `/wireframe` drives it and carries the operating detail.

**Screens: names, not descriptions** (`[user-specified]` 2026-10-17). A control's label is its function's
name (Prompt, Effect, Length); every description sits behind a "?" or tooltip, never on the screen — no
explainer lines, hints or text inside buttons; real values ("1 s"), not abstractions ("Normal"); a choice
appears only where it gives the user something, never to expose how a model works. Calm and compact, like
a professional editor. A project may hold the detail in its own docs.

## Architecture diagrams — the `diagram-design` plugin (`[user-specified]` 2026-10-27)

An architecture diagram that goes into a project's docs — the core flow, C4 levels, components and
what talks to what — is drawn with the `diagram-design` plugin, in preference to ASCII or
`/wireframe`. The `.html` file it writes is the source and lives in `docs/architecture/diagrams/`;
beside it goes an SVG exported with `/diagram-design:export-diagram --svg-only`, which a Markdown
document embeds so the picture shows where the docs are read. The plugin cannot edit a drawing: when
the architecture changes, redraw the diagram and export it again. ASCII remains for a sketch in
the conversation, and for a project or machine without the plugin. `/wireframe` draws a diagram in
Penpot only when the user asks for Penpot.

## Browsers — one throwaway container (`[user-specified]` 2026-09-25)

When a task needs a real browser, start a throwaway `playwright-shot:1` container yourself; it exits when
done and nothing has to run beforehand. Its README (`~/vibe_claude_kilo_cli_exp/playwright-shot/README.md`)
says how, and whose every other browser is: Penpot's serves `/wireframe` only, OpenWebUI's serves its own
agents, and the user's own browser is never driven.

## Tone & writing style

Single-homed in the **Personal Voice** output style
(`~/.claude/output-styles/personal-voice.md`, active via `outputStyle`). That is the system-prompt
channel, so it sticks where CLAUDE.md does not. Edit tone there, not here.

## Memory & compaction

- **Auto-memory is an inbox, not a home.** Claude Code notes things there by itself; nothing
  belongs there. `/realign-project` files what landed in it.
- **Compaction summary** — keep what the user asked, decided, ruled out or corrected in their own
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
