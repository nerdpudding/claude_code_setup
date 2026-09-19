# Roadmap — claude-code-setup

Open work first, then the backlog, then one status line per sprint. Delivered detail lives in
`docs/history/roadmap_history.md`.

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

## Backlog

- **`global_config/CLAUDE.md` is 244 lines against the 200-line target.** The next candidates for
  a cut are the SOLID sub-bullets and the cross-project pointer rule. Both are `[user-specified]`,
  so this needs the user's word.
- **Field test of `/realign-project` as changed twice on 2026-09-19.** On the next real run, check that a
  finding with one sensible fix is applied and reported in one line, that questions come one per
  turn and only in the cases Phase 2 names, that a project-level `CLAUDE.md` with rules is found
  and its rules moved into `AI_INSTRUCTIONS.md` (check 17), and that the session does not open
  this repo.
- **Three preferences of the user live only in one project's auto-memory**, so no other project
  sees them: never block the chat with a long-running job, no time estimates, announce a
  background helper before it starts. They are cross-project, so their home is the global
  `CLAUDE.md` or the output style. Needs his wording and his word.
- **`/feature-close` step 4 names `docs/roadmap_history.md`**, a file loose in the root of `docs/`,
  while "Project organization" in the global `CLAUDE.md` allows only `lessons_learned.md` there.
  Pick one: a category folder in the skill, or an exception in the rule. This repo used
  `docs/history/`.
- Parked: an optional plan-rename hook; agent templates for common project types (from Sprint 4).
- Parked: a `SessionStart` hook that auto-injects the carryover after an unplanned compaction
  (from Sprint 6).
- Parked: a "Compact Instructions" section in the global `CLAUDE.md` (from Sprint 6). Note from
  Sprint 11: the Claude Code docs document steering the summary only through
  `/compact <instructions>`.
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
| Sprint 10 | Open | Telemetry, feature-gating and what "off" actually costs — raised 2026-08-05 |
| Sprint 11 | Done | One home for every fact (README v2.7): skills point at `CLAUDE.md`, `/realign-project` finds copied facts and rules in auto-memory, config snapshot out of the git history |
