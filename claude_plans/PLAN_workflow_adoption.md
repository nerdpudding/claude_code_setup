# PLAN — Workflow adoption (doc sweep + milestone review, per the 2026-07-19 advisory)

> Source of scope: the dynamic-workflows advisory report of 2026-07-19 (external to this repo;
> sections Q3, Q4, Verdict). This plan implements EXACTLY the recommended points, nothing more.
> Explicitly excluded (per Q2/Verdict): workflows for build waves, live probes, GPU/lease work,
> planning/judgment stages — and ultracode entirely.

## Goal

Adopt the advisory's two workflow-shaped fleets — the doc-consistency sweep (skill-invoked,
saved, capped) and the periodic milestone whole-codebase review (saved, capped) — plus the two
"do regardless" items: the fleet-mode return-format note on findings-producing agents, and
recording real token totals at sprint close.

## Pre-build verification (Honesty box — re-checked 2026-07-19)

| Claim | Status today |
|---|---|
| `~/.claude/workflows/` as a user-level home for saved workflows | **VERIFIED in public docs** (code.claude.com/docs/en/workflows.md). Project-level `.claude/workflows/` also supported. Format: JS ES module; the workflow's name comes from `meta.name` (not the filename); also invocable as `/<name>`. |
| `agentType` option on workflow `agent()` (runs `.claude/agents/*` roster, composes with schema) | **Verified in THIS installation's Workflow tool spec** (2026-07-19). **Absent from public docs.** |
| `budget` global + "+500k"-style turn directive as a HARD ceiling (`agent()` throws past it) | **Verified in THIS installation's Workflow tool spec** (2026-07-19). **Absent from public docs** (only an unrelated alpha `taskBudget` in the Agent SDK). |
| `maxTurns` as a per-call `agent()` option (Q4 recommends it for readers) | **NOT present in this installation.** Correction to Q4: cap readers with `effort: 'low'` + a tight prompt instead. |

Consequence: every distributed artifact that relies on `agentType` or `budget` carries a
one-line version-sensitivity note ("installation-verified, not in public docs — re-check after
harness updates / on other machines").

## Scope

**In scope (claude_code_setup — build, sync via `./install.sh`, commit):**
1. New skill `global_config/skills/doc-sweep/SKILL.md` (`/doc-sweep`).
2. New saved workflow `global_config/workflows/doc-sweep.js`.
3. New saved workflow `global_config/workflows/milestone-review.js`.
4. Edit `global_config/skills/feature-close/SKILL.md` — reference the sweep; add the fixed
   token-recording step.
5. Edit `global_config/skills/project-setup/SKILL.md` — fleet-mode note in the doc-keeper
   template + the per-agent report-format spec; `doc-sweep` + workflows in the Phase 0 checks.
6. Edit `global_config/skills/realign-project/SKILL.md` — fleet-mode note as audit check + apply
   step.
7. Edit `install.sh` — extend the managed scope with `workflows/`.
8. Edit `global_config/settings.json` — default session model back to `opus[1m]` (user decision
   2026-07-19: Fable leaves preview and becomes separately paid; Opus 4.8 is the default top of
   the model hierarchy, Fable an easy explicit override — see the settings section below).
9. Repo doc sync: `AI_INSTRUCTIONS.md`, `README.md` (incl. a v2.3 version-history entry),
   `roadmap.md` (Sprint 7). `concepts/concept.md` only if it enumerates `global_config` contents.
10. OPTIONAL (flagged for review): the same fleet-mode note in this repo's own
    `.claude/agents/doc-keeper.md`, so the template repo matches what its templates prescribe.

**In scope (the advisory's source project — edit only, report separately, do NOT commit):**
11. That project's `.claude/agents/doc-keeper.md` and `.claude/agents/deep-reviewer.md` — the
    short fleet-mode note. Nothing else changes there (models, scope, agents table untouched).

**Out of scope:** everything in Q2 (build waves, probes, GPU, planning, handover); ultracode;
agent re-tiering (Q3.1: "no changes needed"); the global CLAUDE.md guard rails (Q3.3: transfer
untouched); fixing unrelated drift found during research (see Risks).

## Affected files & changes, file by file

### 1. `global_config/skills/doc-sweep/SKILL.md` — NEW

Why a separate skill rather than embedding the recipe in feature-close (the advisory allows
either): (i) the sweep is also a periodic standalone maintenance action, not only a sprint-close
step (doc-keeper's own description already lists "periodically as a maintenance sweep");
(ii) feature-close stays lean and scales down to tiny projects; (iii) one source of truth — the
workflow shape + caps live in exactly one place, and feature-close references it.

Contents:
- **When to use:** end-of-sprint docs sweep on projects with a substantial doc tree, or a
  periodic maintenance sweep. For a small project, keep the current single doc-keeper/sonnet
  delegate (the skill says so and stops — no fleet for 3 files).
- **Hybrid invocation pattern:** derive 4–7 doc clusters inline (cheap, main thread — e.g.
  README+workflow docs / design docs / knowledge cards / roadmap+status / research docs), then
  invoke the saved workflow: `Workflow({name: 'doc-sweep', args: {clusters, guardrails?}})`.
  Mark judgment-bearing clusters so they run via the project's own doc-keeper (`agentType`);
  pure-staleness clusters run on cheap readers.
- **Caps block (Q4, stated verbatim as the operating limits):** fleet 6–10 agents total
  (4–7 readers, haiku for staleness/sonnet for judgment + 1 sonnet verifier + 1 sonnet merger);
  state a token target in the invoking turn (**"+300k"** — hard ceiling in this installation);
  readers on `effort: 'low'` (the `maxTurns` knob from the advisory does not exist here);
  read-only fleet; failure policy: re-run or `resumeFromRunId`; **no ultracode**; `/config`
  size guideline `medium`. Monitoring: `/workflows` during, journal + per-agent tokens after.
- **Output contract:** the main thread receives ONLY the merged findings list and applies fixes
  itself (exactly as doc-keeper findings are applied today).
- **Version-sensitivity note** (the Honesty-box line above).

### 2. `global_config/workflows/doc-sweep.js` — NEW

`meta.name: 'doc-sweep'`. Shape (concrete script written at build time, ~60 lines):
- `args = { clusters: [{name, paths: [...], judgment?: bool, agentType?: string}], guardrails?: string }`.
  `guardrails` is appended to every agent prompt (this is how "privacy rules restated per agent"
  works generically).
- Stage 1 — readers: `pipeline(args.clusters, ...)`, one read-and-diff agent per cluster
  (schema-validated `findings[]`; `model: judgment ? 'sonnet' : 'haiku'`, `effort: 'low'`,
  `agentType` passed through when set so the project's doc-keeper rides along).
- Stage 2 — barrier, then ONE sonnet verifier over the flattened findings (checks each against
  the actual files; barrier is justified: cross-cluster dedup/verify needs the full set). Q4's
  fleet table (1 verifier) is followed over Q5's per-cluster phrasing — it is what keeps the
  fleet at 6–10.
- Stage 3 — ONE sonnet merger: dedupe, rank, return the merged findings list (the workflow's
  return value; nothing else reaches main context).
- `log()` any cluster dropped or truncated (no silent caps); a header comment carries the caps +
  budget directive + version-sensitivity note; script logs a warning when `budget.total` is null.
- Findings schema: `{file, section/line, issue, correct_value, priority}` + a per-reader
  `watch_items[]` field (guard rails: deviations/watch items are mandatory report fields).

### 3. `global_config/workflows/milestone-review.js` — NEW

`meta.name: 'milestone-review'`. The periodic whole-codebase review at milestones (every ~3–4
sprints). Shape:
- `args = { planFile, dimensions?: [...], guardrails?: string }`. Default dimensions (Q5):
  seams/state-claims, correctness, privacy/content-discipline, docs-vs-code, goal-agnosticism.
- Stage 1 — 5 **opus** dimension-finders, each sweeping the whole tree for its one concern
  (schema: findings with `file:line`, severity, failure scenario, fix direction + `watch_items[]`).
- Stage 2 — adversarial verify: per dimension, the findings list goes to **2 opus skeptics**,
  each briefed to refute every finding on it. A finding is killed only when BOTH refute it; a
  1–1 split survives marked `disputed`. (Note: batched per dimension — 2 refuter agents per
  dimension, not 2 per finding — because that is the only reading consistent with Q4's binding
  ~12–18 fleet total: 5 finders + 10 refuters + 1 synthesis = 16. Killed findings are `log()`ed.)
- Stage 3 — ONE synthesis agent at the top default tier: **opus** by default, overridable via
  `args.synthesisModel` (e.g. `{synthesisModel: 'fable'}` for the hardest rounds — the same
  easy-override pattern agents use). The advisory said "fable exactly once", but per the user's
  2026-07-19 decision (Fable leaves preview, separately billed) the default hierarchy tops out
  at Opus 4.8 and Fable is explicit opt-in — consistent with the standing global token-economy
  rule ("fable never as a default"). The synthesis writes the prioritized, categorized findings
  section into `args.planFile` — the fleet's single sanctioned file write ("findings land in
  files, not in chat") — and returns a counts-only summary. The normal fix wave takes over from
  the plan file; nothing about fix/probe/close phases changes.
- Header comment documents the invocation + caps: ~12–18 agents, **"+500k"** budget directive,
  no ultracode, read-only except the one plan-file write, failure = re-run/`resumeFromRunId`,
  the `synthesisModel` override, version-sensitivity note. This header IS the invocation-point
  documentation (there is deliberately no skill for it — milestone reviews are invoked by hand,
  rarely).

### 4. `global_config/skills/feature-close/SKILL.md` — EDIT

- **Step 2 (docs sweep):** keep the current logic as the small-project path; add: for a project
  with a substantial doc tree, run the sweep as the saved `doc-sweep` workflow instead —
  one line referencing `/doc-sweep` for the recipe and caps (reference, don't restate).
- **New step 4 — "Record real token totals"** (current steps 4–7 renumber to 5–8): at sprint
  close, record the round's actual token figures — session total plus per-fleet totals when a
  workflow ran (from `/usage`, `/workflows`, the run journal) — in the roadmap sprint entry (or
  wherever the project keeps sprint status). One-line rationale in the skill: cost decisions
  need real figures; until now none were recorded anywhere.

### 5. `global_config/skills/project-setup/SKILL.md` — EDIT

- **Phase 5.1 doc-keeper template:** add one line to the template's Report Format section:
  *"**Fleet mode:** when run inside a Workflow fleet with a structured-output schema, return
  ONLY the structured findings list (no prose report sections)."*
- **Phase 5.3 ("Report format" bullet):** append the same fleet-mode requirement for every
  generated findings-producing agent, plus: keep deviations/watch-items as explicit fields
  (they map 1:1 onto fleet schemas).
- **Phase 0.4:** add `doc-sweep` to the expected global skills; add a line to verify
  `~/.claude/workflows/` holds the two saved workflows (`doc-sweep`, `milestone-review`).

### 6. `global_config/skills/realign-project/SKILL.md` — EDIT

- **Phase 1: new check 11 — "Fleet-mode return format"** (appended; existing numbering
  untouched because check 9 is referenced elsewhere): findings-producing agents (doc auditors,
  reviewers) should carry the short fleet-mode note; flag its absence. This is how EXISTING
  projects pick the note up.
- **Phase 3:** one apply bullet — add the note where flagged.

### 7. `install.sh` — EDIT

- `tracked_paths()`: add `./workflows` to the CLAUDE_DIR-side find list (the repo side already
  walks all of `global_config/`). Without this, a repo-deleted workflow surviving live would go
  undetected — this is the one real seam in the sync.
- Header comment scope line + the post-install echo: mention workflows ("restart Claude Code to
  pick up skills, workflows and the output style").

### 8. `global_config/settings.json` — EDIT (user decision 2026-07-19)

- `model`: `claude-fable-5[1m]` → `opus[1m]`. Fable leaves preview and becomes separately
  billed; the default top of the smart-model hierarchy is Opus 4.8. `fallbackModel` chain
  unchanged. `effortLevel: xhigh` stays — that is the documented recommendation for Opus 4.8
  coding (it was arguably mismatched under the Fable pin, which wants `high`), so moving back
  makes the pair consistent again.
- **Easy overrides, documented in the README v2.3 entry:** per session via `/model`; per
  milestone-review run via `args.synthesisModel: 'fable'`; per agent via an explicit
  `model: fable` pin on explicit request (existing rule). When Anthropic's terms or model
  line-up change again, this is a one-key edit + `./install.sh install`.
- This also resolves the drift flagged during research: README's v2.2 entry already described
  `opus[1m]` as the intended state; settings.json matches it again.

### 9. Repo docs — EDIT

- `AI_INSTRUCTIONS.md`: hierarchy tree (+ `skills/doc-sweep/SKILL.md`, + `global_config/workflows/`
  with both files); skills table row for `/doc-sweep`.
- `README.md`: `global_config` table + repo→`~/.claude/` tree + skills table + the install.sh
  scope sentence; a short **"Saved workflows"** subsection (what the two fleets do, the Q4 caps
  summary, the "+300k"/"+500k" budget convention, the version-sensitivity note); a **v2.3**
  version-history entry (workflows, fleet-mode note, token-recording step, and the model
  default back to `opus[1m]` with Fable as explicit override).
- `roadmap.md`: Sprint 7 entry + status-table row.

### 10. OPTIONAL — `.claude/agents/doc-keeper.md` (this repo)

Same one-line fleet-mode note. Rationale: the template repo's own agent should match what its
templates now prescribe, and sweeps will run here too. Strictly speaking outside the advisory's
named files — strike this item during review if unwanted.

### 11. The advisory's source project (separate; NOT committed — user commits there)

- `.claude/agents/doc-keeper.md` — after "Report format": *"Fleet mode: when run inside a
  Workflow fleet with a structured-output schema, return ONLY the structured findings list
  (file/section, issue, correct value per finding) — no prose report sections."*
- `.claude/agents/deep-reviewer.md` — in "Output contract": *"Fleet mode: when run as a
  dimension-finder inside a Workflow fleet with a structured-output schema, return ONLY the
  structured findings list (title, category, priority, file:line, failure scenario, fix
  direction, watch items) — do not write the plan file or the prose summary; the fleet's
  synthesis stage owns those."* Watch-items/deviations fields stay (Q3.1b — they map 1:1 onto
  schema fields).

## Shared state & seams

Small for a docs/config change, but named:
- **Skill ↔ saved-workflow name coupling:** `/doc-sweep` invokes `Workflow({name: 'doc-sweep'})`;
  the name lives in `meta.name`. One writer (the workflow file), consumers reference the name —
  keep them identical, verified in the closing consistency pass.
- **install.sh scope:** `tracked_paths()` is the single definition of "managed files"; the
  README scope sentence and header comment describe it — update all three together.
- **Fleet output contract:** the fleet-mode note (agents) ↔ the schemas (workflow scripts) are
  two sides of one contract; the note's wording explicitly keys on "structured-output schema
  supplied" so normal solo runs keep the prose report format.

## Failure & resume semantics

- Both fleets are read-only (milestone review: read-only except the single synthesis write to
  the plan file, which happens last, after verification). A failed run is re-run or resumed via
  `resumeFromRunId` — documented in the skill + both script headers. No gating state anywhere.
- `install.sh install` already backs up overwritten files; unchanged.

## Risks & open questions

- **Version sensitivity (the standing risk):** `agentType` and `budget` are installation-verified
  but undocumented publicly — a harness update could change them. Mitigation: the one-line
  re-verify note in the skill and both script headers; the scripts degrade gracefully
  (`agentType` only passed when set; missing budget → warning log, not failure).
- **Q4's `maxTurns` does not exist here** — replaced by `effort: 'low'` on readers (verified).
- **`/config` size guideline `medium`:** documented in the skill/README as the recommended
  setting; the exact settings key is confirmed at build time via `/config` (not blocking).
- **Pre-existing model-pin drift — now resolved in scope:** README's v2.2 entry says the pinned
  model is `opus[1m]` while settings pinned `claude-fable-5[1m]` after the recent drift pull.
  Per the user's 2026-07-19 decision the settings go back to `opus[1m]` (section 8), which also
  resolves the contradiction. The sibling project's deep-reviewer stays pinned to `fable` —
  that project's explicit, documented choice, outside this plan; flagged in the final report as
  worth revisiting there now that Fable is separately billed (not changed here).
- **Live smoke test spends tokens:** step 12 below proposes a bounded live run ("+50k", 2
  clusters, this repo). Strike it during review to skip the spend; `install.sh diff` + name
  resolution then remain the only verification.

## Steps

1. Write `global_config/workflows/doc-sweep.js`.
2. Write `global_config/workflows/milestone-review.js`.
3. Write `global_config/skills/doc-sweep/SKILL.md`.
4. Edit `global_config/skills/feature-close/SKILL.md` (step-2 branch + token-recording step +
   renumber).
5. Edit `global_config/skills/project-setup/SKILL.md` (template note, 5.3, Phase 0.4).
6. Edit `global_config/skills/realign-project/SKILL.md` (check 11 + Phase 3 bullet).
7. Edit `install.sh` (workflows in tracked_paths, comment, echo).
8. Edit `global_config/settings.json` (model → `opus[1m]`; everything else unchanged).
9. (Optional, per review) fleet-mode note in this repo's `.claude/agents/doc-keeper.md`.
10. Update `AI_INSTRUCTIONS.md`, `README.md` (v2.3 entry), `roadmap.md` (Sprint 7).
11. The advisory's source project: add the two fleet-mode notes; list the exact diffs in the
    final report; do NOT commit there.
12. `./install.sh diff` → review → `./install.sh install`; confirm `~/.claude/workflows/` holds
    both files.
13. Bounded live smoke of the doc sweep on this repo (new session so the workflows are picked
    up): 2 clusters, "+50k" — verify schema-validated findings come back merged and nothing
    intermediate lands in main context. (Optional — see Risks.)
14. Closing consistency pass with this repo's doc-keeper (normal inline agent run); fix findings.
15. Commit claude_code_setup (per the task instruction; normal message, no AI attribution).

## Test / verification

- `./install.sh diff` clean after install; a `pull` round-trip is a no-op (sync seam works both
  ways for `workflows/`).
- Both saved workflows resolvable by name in a fresh session.
- Failure path: doc-sweep invoked with an empty/malformed `clusters` arg exits with a clear
  message (script validates args first) rather than spawning agents.
- The optional live smoke (step 12) is the end-to-end for the doc-sweep path; the milestone
  review gets its live validation at its first real milestone use (too expensive to smoke-test
  meaningfully — stated here as a conscious deferral).
- Manual read-through of feature-close renumbering + all cross-references (backed by step 13).
