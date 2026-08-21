# Roadmap — claude-code-setup

## Sprint 1: Initial Setup (MVP)

- [x] Define project goals and use cases
- [x] Create directory structure
- [x] Create concept document
- [x] Create README.md
- [x] Create AI_INSTRUCTIONS.md
- [x] Create roadmap.md (this file)
- [x] Create daily task tracker
- [x] Create project-level .claude/settings.json
- [x] Create doc-keeper agent
- [x] Verify consistency across all documents
- [ ] Initialize git repository

## Sprint 2: UX Improvements & Documentation (Done)

- [x] Rename `Files_Used/PUT_IN_GLOBAL_CLAUDE_FOLDER/` to `global_config/`
- [x] Update all cross-references (AI_INSTRUCTIONS, concept.md, doc-keeper.md)
- [x] SKILL.md: Add context detection (existing folder vs fresh start)
- [x] SKILL.md: Smart project name suggestion from folder name
- [x] SKILL.md: Add Phase 5.5 for project-specific skills
- [x] README: Add Two Setup Approaches section
- [x] README: Add Global vs Project-Level Configuration section
- [x] README: Add Skills and Agents comparison section
- [x] README: Add overwrite warning to Quick Start
- [x] README: Add Customizing Skills section

## Sprint 3: Opus 4.8 Realignment (Done — 2026-05-30)

The setup was tuned for Opus 4.5/4.6 and felt heavier on 4.7/4.8 (a more literal, more agentic
model executes soft prose imperatives close to the letter). Diagnosed via multi-agent research +
adversarial verification; realigned the format. See `claude_plans/PLAN_opus_4_8_realign.md`.

- [x] Rewrite `global_config/CLAUDE.md` to tiered **Hard rules / Preferences** (was a flat ALWAYS/NEVER wall)
- [x] Add `global_config/output-styles/personal-voice.md` (tone style, `keep-coding-instructions: true`, on by default via `outputStyle`)
- [x] Modernize `project-setup` skill (scale-to-task-size; no "do not skip phases"; key-presence settings check)
- [x] Create `realign-project` skill (`/realign`) — existing-project counterpart to project-setup
- [x] Create `plan` skill (`/custom_plan`) — read-only sprint/feature planning into `claude_plans/PLAN_<name>.md`, no native plan mode (sidesteps approve-then-build)
- [x] Light-sync README, concept, AI_INSTRUCTIONS, doc-keeper, example_ai_instructions to the new format
- [x] Apply live to `~/.claude/` and field-test `/realign` on a real existing project

## Sprint 4: Finish & Extend (In progress)

- [x] Finish documenting the realignment in THIS repo's own docs (done 2026-05-30 doc-audit)
- [x] First-class `docs/opus_4_8_alignment.md` (the 10 alignment principles + the why) — file complete
- [x] Sync `global_config/settings.json` template to the new live defaults (effortLevel high, includeCoAuthoredBy:false, deny example) — done
- [x] Decide: wire `personal-voice` output style on by default — DONE, `outputStyle` set in settings (tone is single-homed in the style, removed from CLAUDE.md)
- [x] Initialize git repository / first commit — done (commit `4c20f43`)
- [x] Install script — done in Sprint 5 (`install.sh`)
- [ ] Optional plan-rename hook; agent templates for common project types

## Sprint 5: Fable 5 / field-test sync (Done — 2026-07-03)

Synced `global_config/` back from the live `~/.claude/` after field use (mainly SmartPrepper) and
the move to Claude Fable 5. See the v2.1 entry in `README.md` for the full change list.

- [x] Add `/feature-close` skill (post-delivery hygiene — counterpart to `/custom_plan`)
- [x] Pull field-tested skill refinements (agent model tiering in `project-setup` + `/realign`,
      tone single-homed in the output style, `custom_plan` research delegation)
- [x] Make agent token economy explicit everywhere agents are created: tiered model guidance
      (haiku/sonnet/opus; fable only on explicit user request, never as agent default) as a
      global `CLAUDE.md` preference, leading `project-setup` Phase 5, a Model column in the
      generated agents table, and `/realign` check 9
- [x] Sync `settings.json` (model `claude-fable-5[1m]` + fallback chain, `effortLevel: xhigh`,
      `last30days` plugin/marketplace) and `CLAUDE.md` (feature-close in the planning workflow)
- [x] Add `install.sh` (diff / install / pull) for new-machine setup and drift detection
- [x] Update repo docs (README, AI_INSTRUCTIONS, concept, example_ai_instructions) to match

## Sprint 6: Session carryover across compaction (Done — 2026-07-04)

Two skills to continue in a fresh session without retyping when freeing up context at a
sprint/feature boundary — the personal counterpart to the built-in `/compact`. See the v2.2 entry
in `README.md`.

- [x] Add `/pre-clear-compact` — writes a curated `sessions/SESSION_CARRYOVER.md` (status,
      decisions, conventions, next step; points at persistent docs, doesn't duplicate), then stops
- [x] Add `/post-clear-handover` — reads the carryover + docs, reports, proposes the next step
      without executing, archives the carryover with a date prefix
- [x] Add the `sessions/` convention to the global `CLAUDE.md` structure and `project-setup`
- [x] Document the flow in `CLAUDE.md` (Memory & compaction) and sync repo docs (README,
      AI_INSTRUCTIONS, concept)
- [x] Pin `theme: "auto"` in `global_config/settings.json` so `install.sh` keeps it consistent
      across machines instead of dropping or overriding it
- [x] Harden the skills into a full `/compact` replacement (no degradation): adaptive depth with a
      `Work in progress` capture for unfinished work + a no-loss scan in `/pre-clear-compact`
- [x] Refine the note quality bar (review pass on Fable 5): acceptance test — a fresh session must
      be able to resume from the note + repo alone; the no-loss scan is an explicit verify step;
      template prompts are minimums, not caps; the post skill reads the carryover FIRST, then
      targeted docs only as needed (be reminded, not re-onboarded), trusting carryover + git over
      stale docs
- [x] Rename `post-clear-compact` → `/post-clear-handover` — the post side follows the handover,
      it doesn't compact; its description now states it is not for resuming after a plain built-in
      `/compact` (that leaves no handover doc)
- [x] Field-test follow-ups (2026-07-04): first `/post-clear-handover` field test passed (~33.7k
      tokens after resume); added `pre-clear-compact` + `post-clear-handover` to `project-setup`
      Phase 0.4's global-skill check; corrected the pinned session `model` back to `opus[1m]`
      (Opus 4.8 daily driver, Fable 5 on-demand) and grounded `effortLevel: xhigh` in Anthropic's
      published recommendation for Opus 4.8/4.7 coding (model-dependent — `high` for Fable 5 /
      Sonnet 5)

Deferred (optional — left out to keep the flow simple: two commands, one file):
- A `SessionStart` hook (matcher `clear`/`compact`) that auto-injects the carryover, so
  `/post-clear-handover` is not needed after an unplanned auto-compaction.
- A "Compact Instructions" section in the global `CLAUDE.md` as a fallback for auto-compactions
  that fire before `/pre-clear-compact` runs.

## Sprint 7: Workflow adoption + Opus 4.8 default (Done — 2026-07-19)

Implemented exactly the recommended points from the 2026-07-19 dynamic-workflows advisory
(external report, kept outside this repo; sections Q3/Q4/Verdict) — nothing more. See the v2.3
entry in `README.md` for the full list.
Plan: `archive/2026-07-19_PLAN_workflow_adoption.md`.

- [x] `/doc-sweep` skill + saved workflow `global_config/workflows/doc-sweep-fleet.js` (capped fleet:
      4–7 cluster readers + 1 verifier + 1 merger; "+300k" hard ceiling; only merged findings
      reach the main thread)
- [x] Saved workflow `global_config/workflows/milestone-review.js` (5 opus dimension-finders +
      2 opus refuters per dimension + 1 synthesis into a dated review doc (`docs/Review_<date>.md`), not a plan file; opus default with
      `synthesisModel: 'fable'` as explicit opt-in; "+500k"; invoked by hand at milestones)
- [x] `/feature-close`: substantial doc trees routed to the doc-sweep workflow; new fixed step
      "Record real token totals" at sprint close
- [x] Fleet-mode return-format note: `project-setup` doc-keeper template + agent spec,
      `/realign` audit check 11 + apply step, and this repo's own doc-keeper
- [x] `install.sh` syncs `workflows/`; `project-setup` Phase 0.4 verifies skills + workflows on
      a new machine
- [x] `settings.json` model default back to `opus[1m]` (Fable 5 separately billed since
      2026-07-19; overrides stay easy: `/model` per session, `synthesisModel` per review run,
      explicit `model:` pin per agent)
- [x] Docs synced (README v2.3, AI_INSTRUCTIONS hierarchy + skills/workflows tables, roadmap)

Token totals (this round, per the new recording step): doc-sweep live smoke fleet **173,953**
subagent tokens (4 agents: 2 readers — one via `agentType: doc-keeper` — + 1 verifier +
1 merger; ~6 min wall-clock; 4 verified findings returned); docs-verification subagent
**47,703**; closing doc-keeper pass **91,615**. Main-session total: check `/usage` at close.

## Sprint 8: Opus 5 realignment (Done — 2026-07-30)

Delivered. Full rationale: `docs/opus_5_alignment.md`.

- [x] Live `~/.claude/` improvements pulled back into the repo first — four `[user-specified]`
      additions existed only on the machine and the next install would have destroyed them
- [x] **Public-repo hygiene:** the home directory is gone from the repo. `install.sh` now expands a
      `__HOME__` placeholder on `install` and folds it back on `pull`, so a skill can spell a path
      out in full (needed: permission rules match command text literally) without leaking a username
- [x] `effortLevel` `xhigh` → `high` — Claude Code's own default on Opus 5; `xhigh` is a
      per-session step-up, not a global pin. No Claude-Code-specific Opus 5 recommendation exists
      from Anthropic; the per-model table is single-sourced in `docs/opus_5_alignment.md`
- [x] **Deleted** the self-verification scaffolding Opus 5 makes redundant: `pre-clear-compact`
      step 3 (the no-loss re-read) and `project-setup` Phase 7 (the post-scaffold consistency check)
- [x] **Not deleted, per user ruling:** the post-build adversarial review in the guard-rails block
      stays mandatory; only its tier changed (`opus`, never `fable` by default). Recorded as a
      deliberate deviation from Anthropic's guidance so a later realignment does not "fix" it
- [x] Length, plain-words and label rules added to the Personal Voice output style — the only
      channel that binds; a memory failed to hold the label rule twice
- [x] Delegation cap in `CLAUDE.md` (never delegate verification of your own work) + a one-line
      length reminder at the end of the file, per Anthropic's long-prompt advice
- [x] `effort: medium` frontmatter piloted on `post-clear-handover` only
- [x] `/realign` gained a check for instructions the model already follows
- [x] Docs: `docs/opus_5_alignment.md` created, 4.8 doc marked superseded, `doc-sweep-fleet.js`
      rename and the two new skills fixed across AI_INSTRUCTIONS / README / concept

Added mid-sprint, after the user corrected how the setup described his own process:

- [x] **Two reviews, separated.** An independent review of the **plan** before building (routine
      whenever a plan is complex or must run across parallel agents — it was written down nowhere)
      and a full adversarial review of the **build** at **milestones** only, several sprints apart
      (it was written down as if it were every sprint). `/feature-close` now states plainly that it
      is hygiene, not the review. Both run on `opus`.
- [x] **Test in proportion to the project** — recent projects wrote exhaustive edge-case suites and
      ran for hours where nothing warranted it. `CLAUDE.md` and the plan template now ask for the
      real paths including failures, then stop; exhaustive testing needs a stated reason.
- [x] **Git history rewritten and force-pushed.** The username and the other project's name are
      gone from all 28 commits, verified on a fresh clone from GitHub. `git filter-branch` was used
      rather than `git filter-repo` — the latter needs a Python install and the user does not want
      Python outside a uv/conda environment. A `--mirror` backup was taken first.

Line budget: `global_config/` went from 1514 to 1529 lines — **+15, not the reduction the plan
aimed for.** Deletions came to 20 lines; the additions are the tone rules that are the sprint's
actual deliverable. Shaving those to hit the number would have defeated the point, so the growth
is recorded rather than hidden.

Token totals: independent Fable plan review **101,410** subagent tokens (29 tool calls, ~7 min);
closing doc-keeper pass on sonnet. Main-session total: check `/usage` at close.

## Sprint 8 — original brief (2026-07-30)

Same shape as Sprint 3's Opus 4.8 realignment: the setup is tuned for a previous model and Opus 5
behaves differently enough that the tuning now works against it. **Anthropic documented the changes
themselves** in [Prompting Claude Opus 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5),
and several of their recommendations contradict what this repository currently instructs.

The counter-intuitive headline: **Opus 5 needs fewer instructions, not more.** Explicit verification
instructions now cause over-verification; a mature prompt library is part of the problem.

Full brief, with the field evidence and the traps:
`archive/2026-07-30_1919_SESSION_CARRYOVER.md` (archived once the handover was picked up).

## Sprint 9: communication rules (Done — 2026-07-30)

Same evening as Sprint 8, and caused by it: over one long session the user had to correct *how*
things were said to him roughly fifteen times. The failures and the evidence are in
`docs/opus_5_communication_friction.md`; this sprint is the small set of rules that followed.

- [x] `docs/opus_5_communication_friction.md` — what went wrong, with the user's own words; the
      single pattern underneath; what worked once he insisted on it; an honest split between
      documented model behaviour, ordinary sloppiness, and a change in how he now works. Includes
      a section on Dutch: quality has fallen with every release since 4.6, nothing about a Dutch
      regression is documented anywhere, but the complex-sentence habit that causes it is.
- [x] **Five rules into the Personal Voice output style** (60 → 65 lines): show the lines instead
      of describing them; each message stands on its own rather than pointing back at an earlier
      turn; one decision at a time with the others named so they are not dropped; when he says he
      does not follow, rewrite in a different shape instead of explaining at greater length; and
      short sentences in Dutch.
- [x] **Independent review before shipping**, by a new project agent (below). It confirmed the
      rules would bind, corrected the reasoning behind them — mid-conversation corrections and
      system-prompt rules are different channels with different persistence, so five failed
      complaints do not predict a failed rule — and found the two the proposal had missed.
- [x] New project agent `opus5-prompt-expert`, pinned to `fable`, deliberately **not** distributed.
      Judges whether an instruction change will bind before it ships, reading the official docs
      rather than answering from memory. Temporary: delete it when this repository is settled.

**Recorded as unsolved.** Late in the session the user rejected the document's own framing: the
problem is not only compression, it is that much of what gets written did not need to exist. No
rule was written for it, because "write less that is unnecessary" cannot be self-checked the way
the other five can. It stands as an open problem rather than a closed one.

Nothing structural was added. The `Stop`-hook idea was considered and rejected: it fires after the
fact and cannot judge whether the length was warranted. The test is a week of use — if the same
corrections recur, that is the evidence that rules are not the mechanism.

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
## Sprint 10: Telemetry, feature-gating and what "off" actually costs (OPEN — raised 2026-08-05)

**THE USER'S VERDICT, 2026-08-05 — the sprint starts here and does not re-open it:** *"het is
gewoon krankzinnig dat telemetry aan of uit zetten gekoppeld is aan features, dat is pure
manipulatie."* Whether Anthropic intended coercion or merely shipped sloppy coupling is beside the
point and is not to be re-litigated: the EFFECT is identical — a privacy choice costs him
functionality. Sprint 10's job is to establish what that costs him concretely and what his options
are, NOT to weigh Anthropic's motives.

**The principle behind it, not a preference:** a company does not need to know
his usage patterns. He is explicit that this is a SEPARATE question from whether source code goes
over the API (it does, that is the product) and from whether data is used for training (a different
setting). He dislikes being watched where it is not necessary, and right now he feels **forced** —
which is why this is on the roadmap: if telemetry is effectively mandatory to use the tool
properly, he wants to know that plainly, because he would then look at alternatives to Claude Code.

**Established 2026-08-05 (verified against Anthropic's docs, the GitHub issue tracker and the
installed binary — see the SmartPrepper session that raised it):**

- `DISABLE_TELEMETRY=1` does NOT only silence metrics. It also switches off **GrowthBook
  feature-flag evaluation**, so every feature still behind a flag falls back to its built-in
  default, which is usually OFF. Anthropic documents this now, and ships a `claude doctor` check.
- Known casualties: **Remote Control**, `--channels`, **Agent View** (that one was fixed on request
  in v2.1.140), and — the one that already affects him — **the Opus 1M-context model**. He is
  currently dodging that by pinning `"model": "opus[1m]"` explicitly; remove the pin and the 1M
  variants vanish from `/model` and it looks like a billing problem.
- Anthropic's own framing: the flag client both *sends* exposure events and *fetches* flag values,
  so disabling the client disables both. `DISABLE_ERROR_REPORTING` — also telemetry — does NOT have
  this effect. That asymmetry is the strongest evidence it is sloppy coupling rather than coercion.
- Issue trail: #58383 closed/fixed for Agent View, #29580 still OPEN since 2026-02-28 for
  remote-control, #34178 closed "not planned" by a stale bot while the bug was live.
- What the telemetry actually contains, per Anthropic: latency, reliability and usage patterns —
  documented to **never include code, prompts or file paths**. The alarming attribute lists in
  circulation (emails, workspace paths, tool details) belong to the **opt-in OpenTelemetry
  integration**, which exports to YOUR OWN collector, not to Anthropic.

### What Sprint 10 has to answer

1. **Feature by feature, what does telemetry-off actually cost today?** Not a list of names — for
   each one: what it does, whether he would use it, and whether there is a workaround (the
   `opus[1m]` pin is proof that workarounds exist).
2. **The Monitor tool specifically: does he need it?** It watches a background job and reacts to
   its output without blocking the conversation. The practical substitute already in use is a
   background command that notifies on completion. Establish what the real difference is in daily
   work before treating its absence as a loss.
3. **Is there a supported middle position?** Dropping `DISABLE_TELEMETRY` while KEEPING
   `DISABLE_ERROR_REPORTING=1` restores flags and still blocks the channel that ships stack traces.
   Worth testing whether that is enough.
4. **The alternatives question, asked seriously rather than as a threat.** llama.cpp now exposes an
   Anthropic-compatible `/v1/messages` endpoint, so `ANTHROPIC_BASE_URL` can point at a local
   model. Establish what that actually costs: it is the Claude Code CLI driving a local model, not
   Claude. Also check Codex/Cursor/Aider on the one axis he cares about — do they phone home about
   usage patterns, and can that be turned off without losing function.
5. **Close the door that actually carries code**, regardless of the above:
   `DISABLE_FEEDBACK_COMMAND=1` and `CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY=1`. `/feedback`, `/bug`
   and `/share` send the conversation INCLUDING code and it is retained **5 years**. This is the
   only route that does that, and it is entirely under his control. (Surveys record only a rating —
   the "surveys keep 5 years" claim in circulation is false.)
6. **Check `claude.ai/settings/data-privacy-controls`** — on a consumer plan, "allow data for model
   improvement" ON means 5-year retention AND training on his code; OFF means 30 days, no training.
   One toggle, higher impact than every environment variable combined. Not visible from a session;
   only he can read it.

**Context that changes the weighting, and it should be recorded honestly:** between 2026-04 and
2026-07 Claude Code shipped undisclosed, deliberately obfuscated code that fingerprinted users by
timezone and proxy and encoded the result steganographically in the system prompt (versions
2.1.91-2.1.196; removed 2026-07-01 after a stranger decompiled it; China's NVDB issued a formal
alert). **Telemetry being off would not have stopped it** — it rode on the normal API path. That
cuts both ways: it justifies his distrust, and it shows the telemetry switch is not where his
control actually lies.

| Sprint 9 | Done | Communication rules — friction doc, five rules into the output style, `opus5-prompt-expert` agent |
