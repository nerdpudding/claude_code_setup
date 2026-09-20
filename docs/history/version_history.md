# Version history — claude-code-setup

What changed in each version of this setup, newest first. Moved here verbatim from `README.md` on
2026-09-19, so the README keeps to what a reader needs first. This is a dated record: names and
paths are as they were written at the time. New versions are added at the top.

## v2.9 — Kilo CLI follows along (2026-09-20)

Kilo CLI is a second terminal coding agent that can run any model from any provider. It picks up
the skills of this setup by itself, but it cannot read the global `CLAUDE.md` as it stands or a
project's `.claude/agents/`, so it works from translated copies of both. Keeping those copies
current is now part of the routine that already existed, instead of a job of its own.

- **New skill `/kilo-sync`.** Refreshes Kilo's copy of the global rules when the rules changed,
  and the Kilo copies of the current project's agents. It runs in any project, and here too, where
  only the global part applies. A translation that does not pass its check is never installed: the
  rules Kilo already had stay live, and the report says so first.
- **`/realign-project` checks Kilo too** (check 18) and reports one extra line: `Kilo: in order`,
  or what it refreshed.
- **`/project-setup` asks** "Set up Kilo CLI for this project as well?" once the agents exist.
- **All three rest on one thing: a command `kilo-sync` that may or may not be on the machine.**
  Where it is absent, `/kilo-sync` says so in one line and the other two skip their step without a
  word, so nothing changes for a machine without Kilo. The skills name no path and no project; the
  command prints the paths it wants used. What the command does and where its files live is not
  this repository's concern.
- **Tested for real:** `/kilo-sync` was carried out by an agent that had the skill text and nothing
  else; it produced a translation that passed its check in one round, and three sentences of the
  skill were tightened from what it reported. The new check of `/realign-project` was run against
  an agent that had really changed: it saw the stale copy, refreshed it, and came back in order.

## v2.8 — A realign finishes the job (2026-09-19)

Same day as v2.7. The realign skill was run on a handful of living projects and every run ended in
questions the user could not judge, an offer to build a test nobody needed, and a report of forty
lines. Each of those traced back to a sentence in the skill or in the global `CLAUDE.md` that told
the session to ask, propose or hold back; current models follow such sentences to the letter. The
plan was reviewed by the `prompt-expert` agent against the four prompting guides before building.

- **`/realign-project` rewritten, and shorter** (241 to 213 lines). The run rules come first:
  what a rule settles is never asked, a doubt is settled from the files, other tools are no
  factor, nothing is committed, no test is run. A real question exists only for a step git cannot
  undo or a preference no file records — before the first edit, one per message, with options and
  a recommendation. The closing report is one paragraph of three to five plain sentences that
  states what failed but never a doubt, an offer or advice. A realign edits instructions and
  documents, never code or a configuration file.
- **Memory is an inbox, not a home.** A realign empties it: it first checks that what a note says
  is in the project's documents, adds it where it is missing, then deletes the note. A preference
  of the user that the global files do not carry is the one kind that stays.
- **The document-path test is gone everywhere.** To the user a test is technical. A documentation
  check inside a test suite made sessions talk about tests and run suites for documentation work,
  and it caught nothing the `git grep` after a move and the doc-keeper audit at the close do not.
- **Global `CLAUDE.md`:** "ask when conventions are unclear" became "settle a doubt from the
  files"; a change to documents runs no test; a pointer in a sibling project is repaired when its
  new target is known; "tool-agnostic" is dropped; the state of the work lives in `roadmap.md`.
  Seven preferences that sat in single projects' memories now hold in every project: never say
  "calm down", no time estimates, never block the chat, announce a background helper, results go
  into the project, a how-to question gets an answer and not an action, note what failed in
  `docs/lessons_learned.md`. The file is 251 lines.
- **Output style:** a closing report holds no doubt, no offer and nothing left to decide.
- **`/project-setup`:** the generated `AI_INSTRUCTIONS.md` keeps one skeleton for every project and
  holds project content only, so a fresh project passes a realign unchanged; the agent templates
  no longer restate global rules or tell an agent to ask.
- **Tested for real:** six living projects were realigned with `claude -p "/realign-project"`, the
  command and nothing else. No run asked a question; every report was one paragraph. Two findings
  from those runs went back into the skill the same day: a realign had replaced a LAN address in
  an `.env.example`, and a realigned project does not settle at once — a second run still changed
  four files and a third one six, all small and real. The skill now says to repair what breaks a
  rule and to leave alone what complies.

## v2.7 — One home for every fact (2026-09-19)

Same day as v2.6, and its consequence. The setup was audited against one goal — every fact has one
home and everything else points at it — and turned out to break its own rule: the subagent
model-tier policy was restated in five skills, one copy still assigning `haiku`; this repo listed
its skills in seven places; this README stated three `settings.json` values that were no longer
true; and a second template for a generated `AI_INSTRUCTIONS.md` had drifted from the first. Two
realign runs on other projects showed two patterns no check covered. The four current Anthropic
prompting guides were read in full for it and are kept as dated snapshots in
`docs/prompting_guides/`.

- **Global `CLAUDE.md`:** "One tree, and pointers that cannot rot" is now the single home for what
  a project tree holds (folders, core files, files pointed at by name — never status or counts),
  how a pointer is written (inside `docs/`, a link whose text is the root path), how pointers are
  repaired after a move, and that dated records keep theirs. The compaction line says what to keep
  instead of "keep it short". Three passages that repeated a skill's description shrank to one
  statement each. The file is 236 lines, over the 200-line target — recorded, not hidden.
- **Output style:** Anthropic's paragraph against figurative prose, a line asking for progress
  updates during long work (Fable 5.1 writes fewer of them), and "ask only what the user can
  judge" — one sensible fix is stated, not asked.
- **`/realign`:** finds project facts copied into agent and skill files, and project rules that
  exist only in auto-memory, each with one fixed repair; presents findings one per turn, without
  priority codes; cites this repo by file name instead of by folder.
- **`/project-setup`:** the stale `haiku` line is gone; its hand-kept lists of `CLAUDE.md` sections
  and skills gave way to `./install.sh diff`; a new agent names no project facts, it says where to
  read them. **`/feature-close`** also trims settled backlog and status narrative.
  **`/custom_plan`** asks for a live end-to-end only where the plan changes something that runs.
- **This repo:** `docs/` in category folders, one template instead of two, the skills listed in
  two places, and the review agent is now a general `prompt-expert` that reads every current
  model guide instead of the Opus 5 guide alone.
- **Public-repo hygiene:** a snapshot of the live config that carried the home path was removed
  from the repo and from its git history, verified on a fresh clone.
- **Checked and not adopted:** two suggestions from Anthropic support — a claim that lines
  prefixed `IMPORTANT:` are re-sent during a session (not in the docs; the prompting guide advises
  less emphasis, not more) and a Stop hook that greps replies against a word list. `effortLevel:
  xhigh` stays as a deliberate choice, recorded in `docs/model_alignment/opus_5_alignment.md`.
- **Follow-up the same day, from the first realign runs with the new skill.** One project kept
  its hard rules in a project-level `CLAUDE.md` that an earlier realign had created, and the
  session could not settle which of the two files owned a rule. "Where a rule belongs" now says a
  project keeps no rules in a `CLAUDE.md` of its own, and that detail — never rules — moves out
  when `AI_INSTRUCTIONS.md` runs long. `/realign` finds such a file and moves its rules back
  (check 17), no longer tells a session to open this repo, and applies a fix that has one
  sensible answer instead of asking first. `/project-setup` never creates one, and every agent's
  startup procedure names `AI_INSTRUCTIONS.md` first. The testing rule moved from the guard rails
  to the preferences and now also says to run only the tests a change can affect. The output
  style gained "a question is not a correction". This takes the global `CLAUDE.md` to 244 lines.

## v2.6 — Structure that does not drift (2026-09-19)

Found in a new project, one day before its second sprint: a flat `docs/` folder, requirements
still marked "draft" after the roadmap was built on them, and the file tree described in three
places. Sorting it out rewrote about 130 path references in 21 files. A larger sibling project
had already recorded where that road ends — 84 files in `docs/`, and building under a
third of the tokens.

- **Global `CLAUDE.md`:** `docs/` gets category folders from the first day; the hierarchy in
  `AI_INSTRUCTIONS.md` is the only tree and paths are written from the project root, with a test
  failing on a dead one where a project has tests; builders' deviations are written into the plan
  file; and "Nothing grows beside this cycle" — no agent brief files, report files or separate
  review documents, and a new step needs the user's word.
- **`/project-setup`:** asks which earlier project the new one resembles and reads that project's
  lessons before proposing a layout; proposes category folders; puts requirements in `concepts/`;
  the generated `AI_INSTRUCTIONS.md` names the cycle and no longer has a "Sub-docs" list that
  repeated the tree; the doc-keeper template checks structure and relevance.
- **`/feature-close`:** asks of every document whether it is still read to do the next work, and
  writes the builders' deviations into the plan before archiving it.
- **`/realign`:** new check 16, document structure drift.
- **`haiku` removed** from `/project-setup`, `/realign` check 9 and the doc sweep (skill and
  workflow): the global `CLAUDE.md` has ruled it out since 2026-08-16 and these had not followed.
- **Brought under version control** with `./install.sh pull`: four live files edited since
  2026-08-21 (the output style's no-labels rule, `settings.json`, `/wireframe`, `/contained-browser`).

## v2.5 — Communication rules (2026-07-30)

Same evening as v2.4, and caused by it. Over one long session the user had to correct *how* things
were being said to him roughly fifteen times: referring to things by position instead of by name,
summarising where the actual lines were the answer, several questions in one message, and Dutch
that had become hard to read. The failures, the evidence, and an honest split between documented
model behaviour and ordinary sloppiness are in
[docs/model_alignment/opus_5_communication_friction.md](../model_alignment/opus_5_communication_friction.md).

- **Five rules into the Personal Voice output style** (60 → 65 lines): show the lines instead of
  describing them; each message stands on its own rather than pointing back at an earlier turn;
  one decision at a time, with the others named so they are not silently dropped; when the user
  says he does not follow, rewrite in a different shape rather than explaining at greater length;
  and short sentences in Dutch.
- **Reviewed before shipping** by a new project agent (below), which confirmed the rules would
  bind, corrected the reasoning behind them, and found the two the proposal had missed.
- **New project agent `opus5-prompt-expert`** — judges whether an instruction change will actually
  bind before it ships, reading the official docs rather than answering from memory. Pinned to
  `fable`, deliberately not distributed, and meant to be deleted once this repo is settled.
- **`/realign` check 10 widened** to all eight register rules, so another project is measured
  against the current set rather than the old three.

Recorded as unsolved: the user's own sharper diagnosis, that the problem is not only compression
but that much of what gets written did not need to exist. No rule was written for it, because
"write less that is unnecessary" cannot be self-checked the way the other rules can.

## v2.4 — Opus 5 realignment (2026-07-30)

Opus 5 verifies its own work, guards its own scope, and limits its own correction narration — so
instructions telling it to do those things now cost tokens for nothing. Anthropic
[documented this](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5)
and says to delete. Rationale and the effort table: [docs/model_alignment/opus_5_alignment.md](../model_alignment/opus_5_alignment.md).

- **Deleted** two self-verification steps: `pre-clear-compact`'s no-loss re-read and
  `project-setup`'s post-scaffold consistency phase.
- **Kept, by user ruling**, the mandatory post-build adversarial review in the guard rails — an
  independent reviewer of a *build* is not the model checking itself. Only its tier changed to
  `opus` (never `fable` by default). Recorded as a deliberate deviation.
- **Length, plain-words and label rules** into the Personal Voice output style: keep replies brief,
  match a document's length to the task, name things instead of using internal labels, don't assume
  a term is known. The output style is the only channel with enough adherence to hold these.
- **Delegation cap** in `CLAUDE.md` — never delegate verification of your own work — plus a one-line
  length reminder at the end of the file, which is Anthropic's advice for long prompts.
- **`effortLevel: high`** — Claude Code's own default on Opus 5. `xhigh` is a per-session step-up
  for demanding work, not a global pin. Effort controls thinking, not output length; prompt for
  length instead. There is no Claude-Code-specific Opus 5 recommendation from Anthropic.
- **The home directory is out of the public repo.** `install.sh` expands a `__HOME__` placeholder on
  `install` and folds it back on `pull`, so a skill can spell a path out in full — which some
  permission rules require — without committing a username.

## v2.3 — Workflow adoption + Opus 4.8 default (2026-07-19)

Adopted the two fan-out-shaped fleets from the dynamic-workflows advisory of 2026-07-19 — and
nothing else from it (build waves, probes, and planning stay Task-tool/main-thread work; no
ultracode):

- **New skill `/doc-sweep` + saved workflow `workflows/doc-sweep-fleet.js`** — the end-of-sprint /
  periodic doc-consistency sweep as a capped fleet: 4–7 cheap cluster readers (fresh context
  each) + 1 sonnet verifier + 1 sonnet merger; only the merged findings list reaches the main
  thread. `/feature-close` routes substantial doc trees to it (step 9 since the 2026-07-30 reorder).
- **Saved workflow `workflows/milestone-review.js`** — whole-codebase review at milestones
  (every ~3–4 sprints): 5 opus dimension-finders + 2 opus refuters per dimension (a finding
  dies when both refute it) + 1 synthesis writing prioritized findings into a dated review doc.
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

## v2.2 — Session carryover across compaction (2026-07-04)

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

## v2.1 — Fable 5 / field-test sync (2026-07-03)

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

## v2 — Opus 4.8 alignment (2026-05-30)

**Why v1 needed changing.** v1 was tuned for Claude Opus 4.5/4.6. On 4.7/4.8 the same files felt
heavier and more bureaucratic: a more **literal** and more **agentic** model executes soft prose
imperatives close to the letter, so right-sizing hints ("always run the full review", "do NOT skip
phases") became mandatory ceremony on trivial tasks, duplicated rules became amplified compliance
pressure, and stale in-repo files got trusted as ground truth.

**What v2 changes to fix it** (full rationale + the ten principles in
[`docs/model_alignment/opus_4_8_alignment.md`](../model_alignment/opus_4_8_alignment.md)):
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

## v1 — Initial setup

Global `CLAUDE.md`, `settings.json`, the `/project-setup` skill, a `doc-keeper` agent template, and
the supporting docs.
