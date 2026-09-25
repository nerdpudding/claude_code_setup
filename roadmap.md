# Roadmap — claude-code-setup

Open work first, then the backlog, then one status line per sprint. Delivered detail lives in
`docs/history/roadmap_history.md`.

## Backlog

- **Watch whether the Opus 5 failures return on Opus 5.5.** The list is in Sprint 13 in
  `docs/history/roadmap_history.md`: starting work unasked, handing back its own decisions,
  session-only vocabulary, too much text. If they return, check the rules in the Personal Voice
  output style against `docs/prompting_guides/prompting-claude-opus-5-5.md`.
- **Check the telemetry issue now and then.** Remote Control stays unavailable while
  `DISABLE_TELEMETRY` is set. Look at [#29580](https://github.com/anthropics/claude-code/issues/29580)
  (the user's question there: 2026-09-25) and the "Telemetry services" section of
  https://code.claude.com/docs/en/data-usage. If flags and telemetry get separated, Remote Control
  works without giving up the opt-out. Details: Sprint 10 in `docs/history/roadmap_history.md`.
- **`global_config/CLAUDE.md` is 251 lines against the 200-line target.** The next candidates for
  a cut are the SOLID sub-bullets and the cross-project pointer rule. Both are `[user-specified]`,
  so this needs the user's word.
- **A realign does not converge to "nothing to change".** Measured in Sprint 12 on one project:
  the first run changed fourteen files, a second run minutes later four, a third one six — small,
  real leftovers each time, because a model does not find everything in one pass, and once a
  repair of an earlier pass's damage. The skill now says "repair, do not polish". Run it when the
  setup changed, not repeatedly; if runs on a settled project keep growing, fix the sentence in
  the skill that makes them look.
- Parked: an optional plan-rename hook; agent templates for common project types (from Sprint 4).
- Parked: a `SessionStart` hook that auto-injects the carryover after an unplanned compaction
  (from Sprint 6).
- Parked: a "Compact Instructions" section in the global `CLAUDE.md` (from Sprint 6). Note from
  Sprint 11: the Claude Code docs document steering the summary only through
  `/compact <instructions>`.
- Parked: Claude Code loads a project's `AGENTS.md` by itself when the project has no `CLAUDE.md`,
  which would replace the prose that tells a session to read `AI_INSTRUCTIONS.md` first. It is
  unavailable while telemetry is disabled, so nothing is done with it (found in the Sprint 12 review).
- Open problem, no rule written: much of what gets written did not need to exist (recorded in
  Sprint 9).

## Status

| Sprint | Status | Notes |
|--------|--------|-------|
| Sprint 1 | Done | Initial project setup |
| Sprint 2 | Done | UX improvements, folder rename, README expansion |
| Sprint 3 | Done | Opus 4.8 realignment (format, skills, output style, live + field-test) |
| Sprint 4 | Done | Own-docs + first commit; install script landed in Sprint 5; hook/templates stay backlog |
| Sprint 5 | Done | Fable 5 / field-test sync: feature-close, skill refinements, settings, install.sh |
| Sprint 6 | Done | Session carryover skills (pre-/post-clear-handover) + sessions/ convention |
| Sprint 7 | Done | Workflow adoption (doc-sweep + milestone-review), fleet-mode notes, token recording, opus[1m] default |
| Sprint 8 | Done | Opus 5 realignment — deletions, length/plain-words rules, effort `high`, home path out of the public repo |
| Sprint 9 | Done | Communication rules — friction doc, five rules into the output style, `opus5-prompt-expert` agent |
| 2026-09-19 | Done | Structure that does not drift (README v2.6): category folders in `docs/`, one tree, deviations into the plan, nothing beside the cycle, `/realign-project` check 16, `haiku` removed, live files pulled |
| Sprint 10 | Done | Telemetry stays off; `/feedback` disabled; only Remote Control is lost; asked Anthropic on #29580 — 2026-09-25 |
| Sprint 11 | Done | One home for every fact (README v2.7): skills point at `CLAUDE.md`, `/realign-project` finds copied facts and rules in auto-memory, config snapshot out of the git history |
| Sprint 12 | Done | A realign finishes the job (README v2.8): fixed repairs and almost no questions, memory as an inbox, the document-path test gone, six living projects realigned with the bare command |
| Sprint 13 | Done | Opus 5.5 as the main model: effort `high` pinned per model, 5.5 guide fetched, instructions unchanged — 2026-09-25 |
