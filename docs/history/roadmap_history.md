# Roadmap history — claude-code-setup

Delivered sprints, newest first: why each sprint happened and what it settled. The list of changes
per release lives in [docs/history/version_history.md](version_history.md); this file does not
repeat it. Condensed on 2026-10-27 for readers of this public repository; the commit history
before that date was folded into a single commit the same day.

## Sprint 14: Agents in every project, quieter sessions (Done — 2026-10-22)

Changes: v3.0. The sprint grouped eight smaller items that came out of daily use:

- Home paths with the account name had spread through tracked files in several projects. Keeping
  them out became a preference, applied by `/project-setup` and `/realign-project`; a realign
  reports a home path in running code instead of editing it.
- A question was read as an instruction to change something. Anthropic documents the tendency
  ("can also expand the scope of a task" — *Prompting Claude Opus 5*); the output style now pairs
  "a question is not a correction" with wording from Anthropic's `<do_not_act_before_instructions>`
  block.
- An optional sound when Claude needs the user (`/beep`), plus a `Notification` hook for
  permission prompts.
- `doc-keeper` and `plan-reviewer` in every project, whatever its size — a deliberate exception to
  "minimal by default", because an independent plan review proved its worth on almost every plan.
- `/feature-close` checks whether the project's agents are still up to date.
- `global_config/CLAUDE.md` trimmed by moving detail into the skills that use it; it is still over
  its 200-line target (see the backlog).

Three new paths were not run during the sprint and are on the backlog.

## Sprint 13: Opus 5.5 as the main model (Done — 2026-09-25)

A session that was believed to run on Opus 5.5 turned out to run on Opus 5, and showed the
failure classes recorded on Opus 5 earlier
([docs/model_alignment/opus_5_communication_friction.md](../model_alignment/opus_5_communication_friction.md)):

- starting work nobody asked for;
- handing back decisions that were the assistant's own to make;
- inventing a restriction, then asking permission for it;
- explaining in vocabulary that existed only inside the session;
- answering the wrong half of a question;
- burying the substance under trivia;
- doing half the job and handing the rest back;
- not reading the documents the project says to read first;
- too much text;
- an assumed pronoun in a memory file.

Outcome:

1. Claude Code 2.1.280 made Opus 5.5 the default Opus model; the alias `opus[1m]` resolves to it,
   so the pin stays an alias.
2. A top-level `effortLevel` no longer reaches Opus 5.5, so the main session had silently run at
   `medium`. It is now pinned per model: `modelSettings."claude-opus-5-5".effortLevel: "high"`.
3. Anthropic's Opus 5.5 guide was saved in `docs/prompting_guides/`. Opus 5 prompts carry over
   unchanged. Its "never stop to check in" advice is for unattended agents and was not adopted: it
   conflicts with plan approval.
4. The global `CLAUDE.md` and the output style stayed unchanged; whether the failures return on
   5.5 is watched in ordinary use (backlog).

## Sprint 10: Telemetry and what "off" costs (Done — 2026-09-25)

`DISABLE_TELEMETRY=1` does more than silence metrics: it also switches off feature-flag
evaluation, so a privacy setting costs features. The sprint established what keeping it off costs.

- The coupling is documented by Anthropic. `DISABLE_ERROR_REPORTING` does not have this effect.
- In Claude Code 2.1.282 the only feature that states it needs flags is **Remote Control**. No flag
  gate on the 1M-context model was found.
- Per Anthropic, telemetry holds latency, reliability and usage patterns, never code, prompts or
  file paths. The longer attribute lists that circulate belong to the opt-in OpenTelemetry export,
  which goes to the user's own collector.
- `/feedback`, `/bug` and `/share` send the conversation including code, retained for five years —
  the one route that carries code. It is now closed with `DISABLE_FEEDBACK_COMMAND=1`.
- On a consumer plan, the data-privacy toggle on claude.ai decides training and retention; it is
  not visible from a session.

Outcome: telemetry stays off. Whether flags will be separated from telemetry was asked on
[anthropics/claude-code#29580](https://github.com/anthropics/claude-code/issues/29580); the
backlog keeps an eye on it.

## Sprint 12: A realign finishes the job (Done — 2026-09-19)

Changes: v2.8. Realign runs on existing projects ended in questions the user could not judge,
offers to build things, and long reports. Each traced back to a sentence that told the session to
ask, propose or hold back. `/realign-project` now applies fixed repairs, asks almost nothing, and
reports in a short paragraph. It was then run on six existing projects; two findings from those
runs went back into the skill.

## Sprint 11: One home for every fact (Done — 2026-09-19)

Changes: v2.7. An audit of the setup against one goal: every fact has one home, everything else
points at it. A config snapshot that carried a home path was removed from the repository and its
history. A follow-up the same day ruled out a project-level `CLAUDE.md` as a home for project
rules, which `/realign-project` (check 17) and `/project-setup` now enforce.

## Sprint 9: Communication rules (Done — 2026-07-30)

Changes: v2.5. During one long session on Opus 5, the way things were said had to be corrected
about fifteen times; the record is
[docs/model_alignment/opus_5_communication_friction.md](../model_alignment/opus_5_communication_friction.md).
Five rules went into the output style: show the lines instead of describing them; every message
stands on its own; one decision at a time; rewrite in a different shape when the reader does not
follow; short sentences in Dutch. A project agent (now `prompt-expert`) reviewed them before they
shipped.

Left unsolved: much of what gets written did not need to exist. No rule was written for that,
because it cannot be self-checked the way the five can.

## Sprint 8: Opus 5 realignment (Done — 2026-07-30)

Changes: v2.4. Anthropic's *Prompting Claude Opus 5* showed that Opus 5 needs fewer instructions,
not more: explicit verification steps cause over-verification. The sprint deleted the
self-verification scaffolding, lowered `effortLevel` from `xhigh` to `high`, and moved the length
and plain-words rules into the output style, the only channel that held them. Kept on purpose,
against Anthropic's guidance: the adversarial review of what was built, now at milestones only and
separate from the review of a plan before building.

Public-repo hygiene in the same sprint: `install.sh` gained the `__HOME__` placeholder, and the
git history was rewritten to remove a username and another project's name.

## Sprint 7: Workflow adoption (Done — 2026-07-19)

Changes: v2.3. Two saved workflows: `doc-sweep` (a capped fleet of cheap readers for a large doc
tree) and `milestone-review` (an adversarial review at milestones). `/feature-close` routes large
doc trees to the sweep and records real token totals. The default model went back to
`opus[1m]` when Fable became separately billed.

## Sprint 6: Session carryover across compaction (Done — 2026-07-04)

Changes: v2.2. `/pre-clear-compact` and `/post-clear-handover`: continue in a fresh session from a
written handover instead of an automatic compaction. Deferred: a `SessionStart` hook that injects
the handover after an unplanned compaction (backlog).

## Sprint 5: Field-test sync (Done — 2026-07-03)

Changes: v2.1. Skill refinements from daily use pulled back into the repo, `/feature-close` added,
model tiers for subagents made explicit, and `install.sh` (`diff` / `install` / `pull`) added.

## Sprint 4: Own docs and first commit (Done)

This repo's own docs brought in line with the Opus 4.8 format, the output style switched on by
default, and the first commit. Optional items (a plan-rename hook, agent templates per project
type) are parked on the backlog.

## Sprint 3: Opus 4.8 realignment (Done — 2026-05-30)

Changes: v2. The setup was tuned for Opus 4.5/4.6 and felt heavy on 4.7/4.8, which follow soft
prose imperatives close to the letter. `global_config/CLAUDE.md` was split into Hard rules and
Preferences, tone moved into an output style, and `/realign-project` and `/custom_plan` were
added. The reasoning is in
[docs/model_alignment/opus_4_8_alignment.md](../model_alignment/opus_4_8_alignment.md).

## Sprint 2: UX improvements and documentation (Done)

`global_config/` got its name, `/project-setup` learned to detect an existing folder, and the
README was expanded.

## Sprint 1: Initial setup (Done)

Goals, structure, concept, README, `AI_INSTRUCTIONS.md`, roadmap and the first `doc-keeper` agent.
