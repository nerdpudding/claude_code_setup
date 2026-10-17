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
- **To consider, not decided: the doc-keeper checks, after an outside review of the documentation
  approach** (2026-09-26). The user put the way of working to another AI; its conclusion was that
  the approach holds, and that the risk it named first — a later session writing a plausible
  motivation for a decision instead of the real one — is covered: the reason is written into the
  sprint plan in the same session as the discussion, the plan is archived unchanged, the
  architecture document carries only the current state, and decisions are marked by origin
  ("(owner, <date>)" against "decided in the main session", with the measurement it rests on).
  Worth checking whether that origin marking is written down anywhere as a rule, or only practised.
  What remained are points for the doc-keeper agent that `project-setup` writes and `realign-project`
  checks, if they are adopted — here, so that new and realigned projects get them alike:
  - A check that compares file ages (a rendered diagram image against its source, as one larger
    project's doc-keeper does) uses the time of the last commit per file
    (`git log -1 --format=%ct -- <file>`), not the file time: git keeps no file times, so after a
    clone every file has the same time and a stale image passes.
  - A path check reads the file system and does not run tests. Done 2026-09-26: the remnant of the
    abandoned experiment with tests for documents ("If the project has a test for document paths,
    run it") is out of `project-setup`'s doc-keeper template and of `feature-close`; both now say
    "Check paths by reading the files, never by running a test: tests are for code".
  - The relevance check ("is it still read for the next work?") is a judgement, not a fact; it
    stays report-only, the user decides.
  - Cost: a full audit at every close repeats work on untouched documents. A middle way is to start
    from what changed since the last close (`git diff` against its commit) and follow the
    references, with a full audit now and then. It misses drift in untouched documents whose
    targets moved; the full audit misses less. The user leans to keeping the full audit.

- **Low priority, to judge later: Claude Code plugins that could improve UI/UX during development**
  (2026-10-17, from SmartPrepper's Extend redesign; the user is not a frontend developer and converges on a
  screen through Penpot wireframe rounds, `/wireframe`). A research agent's shortlist, nothing installed:
  - **Try first:** Anthropic's `design` plugin, https://github.com/anthropics/knowledge-work-plugins/tree/main/design
    — skills `design-critique`, `accessibility-review`, `ux-writing` (`/critique`, `/accessibility`,
    `/ux-copy`) that review a built screen or a screenshot. Use: as a step in a browser gate, with the
    project's screen rules pasted in as the checklist (it does not know them). Markdown only; it may ship MCP
    connectors (Figma and others) — read `design/.mcp.json` before installing and leave every connector off.
    Install (inferred from the README's pattern): `claude plugin marketplace add anthropics/knowledge-work-plugins`,
    then `claude plugin install design@knowledge-work-plugins`.
  - **Skip, against the user's rules:** Impeccable (https://github.com/pbakaus/impeccable) — calls
    impeccable.style on every new design and sends telemetry by default (opt-out `DO_NOT_TRACK=1`; whether
    the call stays with telemetry off is untested); `frontend-design`
    (`claude-plugins-official`) — steers towards decorative, "distinctive" design, the opposite of a calm
    tool UI (its list of AI-design tells is still useful).
  - **Already in place:** the Penpot MCP (used inside `/wireframe`); a browser for screenshots
    (`playwright-shot`).
  - **An idea, a new kind of file, the user's word needed:** a per-project `DESIGN.md` holding the visual
    tokens (colours, type, spacing, components) beside the screen rules — examples in
    https://github.com/VoltAgent/awesome-design-md (Linear, Raycast).
  - Scope note: the global `CLAUDE.md` got a "Screens: names, not descriptions" paragraph on 2026-10-17
    (+6 lines against the 200-line target above).

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
