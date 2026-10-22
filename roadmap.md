# Roadmap — claude-code-setup

Open work first, then the backlog, then one status line per sprint. Delivered detail lives in
`docs/history/roadmap_history.md`.

## Sprint 14 — next (chosen with the user, 2026-10-22)

In priority order. Every rule change below goes past the `prompt-expert` agent before it ships.

1. **Keep the user's account name out of tracked files where it can be avoided, in any project**
   (the user, 2026-10-22).
   Absolute home paths with his account name had spread through tracked files: a larger sibling
   project had 34 (docs, plans, carryovers, archived records, conda recipes' `prefix:` lines, code
   defaults, and a bench that wrote the path into its own `INDEX.md` files); another project
   cleaned the same the same day. The aim, for new projects from the start and for existing ones
   through alignment:
   - in a document, a path under the home folder is written `~/...`, or relative within a parent
     folder;
   - a path that code needs comes from configuration or from `Path.home()` / the file's own
     location, never a literal home path;
   - a generator (a bench, a report writer) renders paths the same way, so a new run cannot bring
     the name back;
   - conda env exports drop their `prefix:` line.

   Decided (the user, 2026-10-22): a preference, not a strict rule — avoid the name in scripts,
   docs and git where it can be avoided; where it is needed it may stay. One line under
   Preferences in `global_config/CLAUDE.md`; `/project-setup` and `/realign-project` apply it. A
   realign never edits code or configuration that runs: a home path there is reported and put on
   that project's backlog as a refactoring candidate. Removing the name from earlier commits is
   optional — offered by `/realign-project`, default no, since most of his repos are private. This repo is cleaned in the same sprint: the account name and the names of
   other projects out of `roadmap.md` and the "Screens" paragraph of `global_config/CLAUDE.md`. Two
   older mentions sit in `docs/history/`, a dated record — the plan decides whether they stay.

2. **A question from the user gets read as an instruction to change something** (the user,
   2026-10-18). He asks why something is so; the session answers and changes it at once, unasked
   — despite the Personal Voice line "A question from him is not a correction". Examples in
   another project's `lessons_learned.md`, entry "Watch: a question from the owner gets read as an
   instruction to change something". A known pattern (research 2026-10-18):
   - Others report it: Hacker News "Prompting Claude Opus 5.5"
     (https://news.ycombinator.com/item?id=49874728, late September 2026: "over-eager and
     agreeable … applies tons of edits instead of clarifying"); anthropics/claude-code #96426
     (2026-09-23, a diagnostic question answered with edits to two source files, open, no
     maintainer reply); related #88318, #24318, #34774, #96398.
   - Anthropic documents the tendency: "Prompting Claude Opus 5" says the model "can also expand
     the scope of a task, adding steps that weren't requested"
     (https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5);
     the prompting best-practices page offers two opposite blocks, `<default_to_action>` and
     `<do_not_act_before_instructions>` ("Do not jump into implementation or change files unless
     clearly instructed … default to providing information, doing research, and providing
     recommendations rather than taking action")
     (https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices).
   - A third-party reading of the Opus 5.5 system card notes a tendency to turn a user preference
     into an invented rule.

   Decided (the user, 2026-10-22): pair the Personal Voice line (how to read a question) with the
   `<do_not_act_before_instructions>` wording (what not to do then), kept small. Watch: wording
   that is too strong brings back permission questions during implementation; instruction text
   lowers the rate but does not guarantee it — only a permission mode that asks for edits is
   deterministic, and auto mode removes that.

3. **A sound when Claude waits for the user** (the user, 2026-10-17). His choice in an earlier
   session: `paplay --volume=65536 /usr/share/sounds/freedesktop/stereo/bell.oga` three times in a
   row (PipeWire/PulseAudio); `alarm-clock-elapsed.oga` worked but is irritating; `complete.oga`
   without `--volume` was not heard.

   Decided (the user, 2026-10-22): a `/beep` skill switches it on and off; the sound and the
   number of repeats are easy to change in one place. No sound in regular chat — only after an
   implementation round or when a decision of the user is needed. A `Stop` hook cannot tell those
   moments from chat, so Claude plays the sound itself then; a `Notification` hook covers
   permission requests (check whether its idle-input notice also fires in regular chat). The
   script exits quietly where `paplay` or the sound file is missing. The auto mode classifier
   refused edits to `settings.json` on 2026-10-22, so the user may have to add the hook himself.

4. **`global_config/CLAUDE.md` is about 250 lines against the 200-line target.** Decided (the
   user, 2026-10-22): SOLID keeps its short rule and "say so when DRY and KISS conflict"; the
   per-letter explanation goes. The cross-project pointer rule moves to `/realign-project` and
   `/project-setup`, which check and write such pointers. Watch: a session outside those skills
   that writes a cross-project pointer no longer sees the detail. Also decided (the user,
   2026-10-22): "Complex builds — guard rails" keeps what holds while building; its two bullets on
   what a plan must contain (seams, failure & resume) move to `/custom_plan`, which already
   requires them.

5. **The origin of a decision in a plan.** An outside review of the documentation approach
   (2026-09-26) found decisions marked by origin — "(owner, <date>)" against "decided in session"
   — in practice, but no rule says so (checked in `global_config/`, 2026-10-22). Decided (the
   user, 2026-10-22): one sentence in `/custom_plan`.

6. **Too much text on Opus 5.5.** One of the Opus 5 failures on watch since Sprint 13 returned:
   in the session of 2026-10-22 the user said "te veel tekst" three times. (Starting work unasked
   is item 2.) The `prompt-expert` agent checks the length rules in the Personal Voice output style
   against `docs/prompting_guides/prompting-claude-opus-5-5.md` and proposes better wording.
   Watch: another rule may not help; then one goes out first.

7. **Two agents in every project: `doc-keeper` and `plan-reviewer`** (the user, 2026-10-22). He
   has almost every plan from `/custom_plan` reviewed by an independent agent; in two projects a
   dedicated `plan-reviewer` agent works better than "let an agent review the plan". Now
   `/project-setup` offers `doc-keeper` only for a medium or large project with 3+ docs, optional;
   `/realign-project` does not add it; no `plan-reviewer` template exists. Decided (the user,
   2026-10-22): both agents always — in every new project, and added by every realign where
   missing. The template follows the two existing `plan-reviewer` agents (a larger sibling project
   and another project): `opus`, read-only, findings returned in the conversation and written
   into the plan by the main thread; it checks premises against the source, the seams between
   parallel lanes, gating state and failure, scope against the record, and verification in
   proportion, in a fixed report (Verdict, Findings, Seams, Premises checked, For the user). Only
   the documents it reads first and its list of project-specific traps differ per project. Watch:
   this overrides "minimal by default" — a one-script project gets both agents too.

8. **`/feature-close` checks the project's agents** (the user, 2026-10-22). Today it only hands the
   doc audit to the `doc-keeper` agent. Decided: a step in `/feature-close` asks of every agent in
   the project's `.claude/agents/` whether it is still up to date, or needs sharpening after the
   sprint or session that just closed — a new document it should read first, a new trap, a new
   seam or decision, a file it points at that moved — and makes that change.

## Backlog

- **Watch the other Opus 5 failures on Opus 5.5:** handing back its own decisions, and
  session-only vocabulary. The list is in Sprint 13 in `docs/history/roadmap_history.md`; too
  much text and starting work unasked are in Sprint 14.
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
| Sprint 14 | Planned | Account name out of tracked files where possible, questions not acted on, `/beep`, `CLAUDE.md` shorter, decision origin in plans, less text, `doc-keeper` and `plan-reviewer` in every project, agents checked at close — chosen 2026-10-22 |
