# Roadmap — claude-code-setup

Open work first, then the backlog, then one status line per sprint. Delivered detail lives in
`docs/history/roadmap_history.md`.

## Backlog

- **Watch the Opus 5 failures on Opus 5.5 after the Sprint 14 rewording.** Too much text came
  back three times on 2026-10-22, and a realign's closing report ran about nine sentences against
  its three to five; the output style was tightened for it (countable limits, one thing per
  message, a closing check that ends on "cut"). Also watch handing back its own decisions,
  session-only vocabulary, and a question being acted on (the reworded question rule). If they
  return, the next lever is fewer rules, not more. List: Sprint 13 in
  `docs/history/roadmap_history.md`.
- **Three Sprint 14 paths never ran; the user notices them in use** (2026-10-22): `/project-setup`
  creating `doc-keeper` and `plan-reviewer`; `/custom_plan` marking each decision's origin; the
  beep on a permission prompt (`Notification` hook, `permission_prompt`). The code branch of
  `/realign-project` check 14 (home path in code: report plus a backlog item) is untested too.
- **`global_config/CLAUDE.md` is 254 lines against the 200-line target.** Sprint 14 cut SOLID, the
  cross-project pointer detail and half of "Complex builds", and added two preferences. Further
  cuts need the user's word.
- **Realigns pending in five sibling projects**: each got a backlog item on 2026-10-22 to run
  `/realign-project` when it is picked up again (missing `plan-reviewer`, home paths, one stray
  `CLAUDE.md`).
- **Telemetry: keep it off, or turn it on after all — a separate research first** (the user,
  2026-10-22). Several features do not work while `DISABLE_TELEMETRY` is set, which irritates him:
  Remote Control, and loading a project's `AGENTS.md` by itself (parked below). He wants to weigh
  turning telemetry on, but only after a research of its own into what that would send and what
  it could mean, now and later. Meanwhile check
  [#29580](https://github.com/anthropics/claude-code/issues/29580) now and then (his question
  there: 2026-09-25) and the "Telemetry services" section of
  https://code.claude.com/docs/en/data-usage: if flags and telemetry get separated, the features
  work without giving up the opt-out. Details: Sprint 10 in `docs/history/roadmap_history.md`.
- **A realign does not converge to "nothing to change".** Measured in Sprint 12 on one project:
  the first run changed fourteen files, a second run minutes later four, a third one six — small,
  real leftovers each time, because a model does not find everything in one pass, and once a
  repair of an earlier pass's damage. The skill now says "repair, do not polish". Run it when the
  setup changed, not repeatedly; if runs on a settled project keep growing, fix the sentence in
  the skill that makes them look.
- Parked: an optional plan-rename hook; agent templates for common project types (from Sprint 4).
- Parked: a `SessionStart` hook that auto-injects the carryover after an unplanned compaction
  (from Sprint 6).
- Parked: Claude Code loads a project's `AGENTS.md` by itself when the project has no `CLAUDE.md`,
  which would replace the prose that tells a session to read `AI_INSTRUCTIONS.md` first. It is
  unavailable while telemetry is disabled, so nothing is done with it (found in the Sprint 12 review).
  The gain: a file that is loaded by itself cannot be skipped the way a read instruction can, and
  other tools (Kilo CLI among them) read `AGENTS.md` too. Depends on the telemetry item above.
- **Two doc-keeper points left from the outside review of 2026-09-26**, for the doc-keeper agent
  that `project-setup` writes and `realign-project` checks:
  - A check that compares file ages (a rendered diagram image against its source, as one larger
    project's doc-keeper does) uses the time of the last commit per file
    (`git log -1 --format=%ct -- <file>`), not the file time: git keeps no file times, so after a
    clone every file has the same time and a stale image passes.
  - Cost: a full audit at every close repeats work on untouched documents. A middle way is to start
    from what changed since the last close (`git diff` against its commit) and follow the
    references, with a full audit now and then. It misses drift in untouched documents whose
    targets moved; the full audit misses less. The user leans to keeping the full audit.

- **Low priority, to judge later: Claude Code plugins that could improve UI/UX during development**
  (2026-10-17, from a larger sibling project's screen redesign; the user is not a frontend
  developer and converges on a screen through Penpot wireframe rounds, `/wireframe`). The user,
  2026-10-22: try it in the project that builds screens, once a screen is done. A research agent's
  shortlist, nothing installed:
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
| Sprint 14 | Done | Account name out of tracked files where possible, questions not acted on, `/beep`, `CLAUDE.md` shorter, decision origin in plans, less text, `doc-keeper` and `plan-reviewer` in every project, agents checked at close, `install.sh` keeps machine-only settings (README v3.0) — 2026-10-22 |
