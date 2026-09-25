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

## Sprint 13: Opus 5.5 as the main model — make sure it is the one running, then align to it (OPEN — raised 2026-09-25)

**The finding that frames everything below.** A full SmartPrepper working session on 2026-09-25 ran on
**Opus 5** (`claude-opus-5[1m]`) while the user believed his main model was **Opus 5.5**. The session's
very first command was a `/model` that set "Opus 5 (1M context)" and reported *"saved as your default for
new sessions"*. Only at the end, after he switched, did the session run on Opus 5.5
(`claude-opus-5-5[1m]`). The global `~/.claude/settings.json` pins `"model": "opus[1m]"` — an alias, not a
concrete model. Claude Code was at 2.1.282. His verdict once he saw it: *"dat verklaart een hoop, opus 5
is kut als main agent"*.

So the behaviour recorded below is **Opus 5's**, observed after Sprint 8/9 had aligned the setup to Opus 5
and after Opus 5.5 existed. It is not evidence about 5.5. Whether 5.5 does better is an open question this
sprint answers by testing, not by assuming.

### What went wrong in that session (Opus 5, 2026-09-25)

Roughly twenty corrections in one session, and the same few classes each time:

- **Starting work nobody asked for.** Asked only to read `AI_INSTRUCTIONS.md` and the roadmap and give
  the status, it also inspected the GPU processes. While the user was still setting priorities, it
  announced it was starting two agents. Twice he had to stop it: *"hou op met zomaar dingen zonder
  toestemming en overleg uit te voeren"*.
- **Handing him decisions that were its own.** Whether a code-to-tests map should stay, how strictly to
  trim the test suite, whether it may change app code — each put to him as a question, although his
  standing rules say technical choices are the assistant's. *"als er geen keuze of belangrijke tradeoff is
  om mee te overleggen over hoe je dat doet, snap ik je punt niet"*.
- **Inventing a restriction, then asking permission for it.** It wrote "app source stays untouched" into a
  plan with no basis and presented the resulting slowness as an accepted floor. *"je bent hier om de app te
  verbeteren, natuurlijk mag je dan aan de code zitten … dit is gewoon regelrechte REGRESSION"*.
- **Explaining in vocabulary that only existed inside the session.** "The map", "the unreadable number",
  file paths and line numbers to a user who has said he does not read them. When he said he did not
  follow, the second attempt reused the same words. *"ik snap geen reet van wat je bedoelt"*;
  *"dat is label talk en kan ik werkelijk niets mee"*.
- **Answering the wrong half of the question.** Asked whether the test suite has far too many checks, it
  answered about the clock ("removing them saves little time") and let that stand as the answer about
  whether they are needed — then used "it saves few seconds" as a reason to clean up less. *"MAAR HET GING
  NIET ENKEL OM WACHTEN … opschonen niet enkel voor snelheid maar ook voor orde en organisatie en
  wildgroei"*.
- **Burying the substance under the trivial.** A report led with 13 em-dash checks as its headline proof of
  overgrowth. *"de em-dashes is wel het laatste waar ik me druk om maak … dus totaal nutteloos"*.
- **Doing half the job and handing the rest back.** It removed the one obvious category of excess and put
  the real judgement (51 plus 373 checks) back to him as "say so if you want it". *"waarom ben je zo lui"*.
- **Not reading what the project says to read.** `AI_INSTRUCTIONS.md` says to read
  `docs/architecture/agent_guide.md` second. It did not; that file already documented the real cause of a
  defect, so its first plan recorded a wrong one and an independent review had to correct it.
- **Length.** Three separate "te veel tekst" in one session, the last after an explicit promise to keep it
  short.
- **An assumed pronoun** ("he"/"his") in a memory file, where they/them is the rule.

The earlier record of the same classes on Opus 5 is
[`docs/model_alignment/opus_5_communication_friction.md`](docs/model_alignment/opus_5_communication_friction.md)
(2026-07-30). Sprint 9 improved it; this session shows it came back, on the same model.

### What Sprint 13 has to answer

1. **Why was the session on Opus 5, and how is that made impossible?** What does the alias `opus[1m]`
   resolve to in 2.1.282, what does `/model` write and where (both of its messages this session said
   "saved as your default for new sessions", yet the settings file shows only the alias), and whether the
   main model should be pinned to a concrete id so an older model can never silently be the main agent.
   A one-line check of the running model at session start may belong in the setup.
2. **Anthropic's official prompting guidance for Opus 5.5.** Fetch it into `docs/prompting_guides/` beside
   `prompting-claude-opus-5.md` and `prompting-claude-fable-5-1.md`, and record what differs from Opus 5 —
   especially on proactiveness (acting before asked), on asking versus deciding, and on length.
3. **What Claude Code changed since the last realign** that affects how `CLAUDE.md`, the output style and
   auto-memory reach the model. The user's experience is that each update shifts how instructions land and
   costs him days of re-tuning; the changelog is where that is checked rather than guessed.
4. **Whether others report the same.** A general online search for these behaviours after the Opus 5.5 and
   recent Claude Code updates — starting work unasked, over-asking, verbosity, jargon after being told
   not to — so it is clear which parts are the model, which the harness, and which this setup.
5. **Then the alignment itself:** the global `CLAUDE.md`, the Personal Voice output style and the Opus 5
   friction doc checked against Opus 5.5 — what still applies, what 5.5 no longer needs, what it needs that
   5 did not. The `opus5-prompt-expert` agent from Sprint 9 is the natural reviewer, or a 5.5 successor.
6. **A test before it is called done:** a working session on Opus 5.5 against the failure list above,
   recorded like the Opus 5 one. Improvement is claimed from that, not from the guides.

## Backlog

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
| Sprint 10 | Open | Telemetry, feature-gating and what "off" actually costs — raised 2026-08-05 |
| Sprint 11 | Done | One home for every fact (README v2.7): skills point at `CLAUDE.md`, `/realign-project` finds copied facts and rules in auto-memory, config snapshot out of the git history |
| Sprint 12 | Done | A realign finishes the job (README v2.8): fixed repairs and almost no questions, memory as an inbox, the document-path test gone, six living projects realigned with the bare command |
| Sprint 13 | Open | Opus 5.5 as the main model — a session ran on Opus 5 unnoticed; pin it, then align to 5.5 — raised 2026-09-25 |
