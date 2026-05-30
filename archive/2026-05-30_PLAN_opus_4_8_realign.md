# PLAN — Opus 4.8 Realignment of Claude Code Setup

> **RESUME-AFTER-COMPACTION PLAN.** This task is long and expected to be compacted. If you
> are reading this after a compaction or in a fresh session, follow the **Read-first** block
> below BEFORE doing anything else, then continue at the first unchecked item in the checklist.

---

## HANDOVER (2026-05-30) — what's done, what's left

**DONE & verified:**
- Live global `~/.claude/`: tiered CLAUDE.md; settings effortLevel high + includeCoAuthoredBy:false + deny sampling_prompts; settings.local pruned; `personal-voice` output style created (opt-in via /config).
- `project-setup` skill modernized; new `/realign` skill created (project-agnostic). Both live + in reference `global_config/`.
- Reference repo `global_config/*` rewritten to the new format; README/concept/AI_INSTRUCTIONS/doc-keeper/example light-synced; roadmap updated; todo_2026-05-30.md written.
- Field-test: `/realign` applied all 14 changes to local-media-gen (AI_INSTRUCTIONS 578→179 + 6 sub-docs; scope-gated workflow; agent targeted-reads; workflow_builder single-owner=comfyui-workflow; shadow memory deleted, open-Qs→docs/research_musubi_i2v.md; docs/flux_2.md created; settings deny; tracker→todo_2026-03-14.md). Verified.

**LEFT (not blocking):**
- Reference repo's own docs: write `docs/opus_4_8_alignment.md` (the 10 principles + why); sync `global_config/settings.json` TEMPLATE to new defaults; decide output-style default-on vs opt-in.
- Commit both repos (claude_code_setup + local-media-gen) — nothing committed yet.
- USER: test the plan-mode file-first workflow; optionally activate Personal Voice output style.

---

## Read-first (get context before continuing)

Read these, in order:

1. **This file** (the whole thing) — the task, decisions, and live checklist.
2. `~/.claude/projects/-home-rvanpolen-vibe-claude-kilo-cli-exp-local-media-gen/memory/MEMORY.md`
   — auto-memory; has a pointer back here and the locked decisions.
3. The diagnosis/design output (read-only reference, large):
   `/tmp/claude-1000/-home-rvanpolen-vibe-claude-kilo-cli-exp-local-media-gen/8bfb56f8-9480-46cd-8547-2e5281d9ee61/tasks/wwsxpzkzc.output`
   — full friction diagnosis (FP-01..FP-11) + the recommended spec. If `/tmp` is gone after a
   reboot, the essentials are summarized in this plan; proceed without it.
4. The two canonical artifacts once they exist (the format everything else follows):
   `~/.claude/CLAUDE.md` and `~/.claude/output-styles/personal-voice.md`.

Then continue at the first `[ ]` item in **Execution checklist**.

---

## Goal

Re-align the user's personal Claude Code "way of working" from 4.5/4.6-era ceremony-heavy
prose to **Opus 4.8-native idioms**. 4.8 is more literal and more agentic: it executes soft
prose imperatives close to the letter, so right-sizing heuristics became mandatory ceremony,
duplicated rules became amplified compliance pressure, and stale in-repo files became trusted
ground truth. **Preserve the user's conventions and muscle memory — change wording, channel,
and location, not the intent.**

Three layers, one canonical source:
- **Reference repo** `~/vibe_claude_kilo_cli_exp/claude_code_setup` = canonical clone-and-copy
  format home (`global_config/` mirrors `~/.claude/`).
- **Live global** `~/.claude/` = what actually runs.
- **Skills** = `project-setup` (new projects) + new `/realign` (existing projects).
- **Field test** = run `/realign` on `local-media-gen` (cwd of this chat).

## The 4.8 alignment principles (apply everywhere)

1. **Tier emphasis.** A literal 4.8 weights every ALWAYS/NEVER/MUST/CRITICAL equally. Reserve
   absolutes for a small **Hard rules** set; demote everything else to **Preferences (use
   judgment; override when the task is better served)**.
2. **Intent + conditions, not universal imperatives.** Replace "No shortcuts / ALWAYS / Do NOT
   skip / FIRST action before anything else" with scope-gated guidance + an explicit short path.
   Add "scale depth to task size" wherever ceremony lives.
3. **Right channel per rule.** Durable tone/persona → user-level **output style** (system
   prompt). Reference/process → CLAUDE.md / AI_INSTRUCTIONS.md. Volatile cross-session state →
   native auto-memory (MEMORY.md).
4. **Deterministic, not prose, for enforceable rules.** `includeCoAuthoredBy:false` instead of
   "remember to strip Co-Authored-By"; `permissions.deny` instead of a prose file ban. Hooks/
   settings block regardless of what the model decides; prose only nudges.
5. **One home per fact.** Single-source each rule; agents/skills REFERENCE it, not restate it.
6. **Lean always-loaded surface.** CLAUDE.md + memory load in full; longer files reduce
   adherence. Target well under 200 lines. Slim the 579-line AI_INSTRUCTIONS.md to a <200-line
   core + on-demand sub-docs. Each agent reads only the focused doc it needs (drop blanket
   "read AI_INSTRUCTIONS.md first").
7. **Minimal by default, scale up only when asked** (project scaffolding).
8. **Trust native systems over shadow copies.** Delete the git-tracked in-repo shadow memory.
9. **Tune depth at the settings layer** (effortLevel), not via prose "be thorough" mandates.
10. **Crisp, non-overlapping subagent descriptions** (keyword-led; one owner per domain).

## Locked decisions (from the user)

- **Effort dial:** `effortLevel` `xhigh` → **`high`** as everyday default; xhigh on demand per session.
- **Tone channel (REVISED — output style DEFERRED):** Originally planned to move tone to an output
  style. ABANDONED for now: the binary schema says a custom output style *replaces* the default
  software-engineering system prompt, and the frontmatter key to retain coding behavior could NOT
  be verified (`keepCodingInstructions` = 0 occurrences in the binary; WebFetch unavailable). Wiring
  it risked stripping coding behavior in every session. DECISION: keep FULL tone rules in CLAUDE.md
  (where they worked fine on 4.5/4.6; diagnosis rated this change medium-low). The
  `global_config/output-styles/personal-voice.md` file is kept as a clearly-marked DRAFT, not wired
  into settings. Revisit later: generate one via `/output-style:new`, inspect real frontmatter,
  confirm coding instructions retained, THEN wire `outputStyle` + slim CLAUDE.md tone to a stub.
- **Enforcement/cleanup (all approved):** `includeCoAuthoredBy:false`; `permissions.deny` for
  `sampling_prompts.txt`; **delete** the stale git-tracked shadow memory
  (`local-media-gen/.claude/projects/.../memory/musubi_training.md`) + gitignore the path;
  **prune** dead cruft from `~/.claude/settings.local.json` (wifi/firmware/probe leftovers).
- **Plan workflow (RESOLVED — corrected after deeper binary check):** Verified facts in Claude Code
  2.1.158:
  - `plansDirectory` defaults to the HIDDEN `~/.claude/plans/` only when UNSET. The user has it set
    to `./claude_plans` in BOTH global and project settings → plans go in-project (named, git,
    persistent). Solves 3 of the user's 4 complaints. VERIFIED.
  - Plan content IS written to a file and the UI shows "Plan saved to: {path} · /plan to edit".
    VERIFIED.
  - CORRECTION: the clean "Don't implement — save plan and return" option is in the ULTRAPLAN
    (cloud refine) approved-dialog, NOT the standard local ExitPlanMode menu. The standard local
    exit menu = "Yes, and auto-accept edits" / "Yes, manually approve edits" / "No, refine with
    Ultraplan on the web" / "No, keep planning". So do NOT tell the user a single native button does
    save-without-build in normal plan mode (that would repeat the overclaim that burned them).
  - DOCUMENTED (accurate, version-proof) workflow: (a) file-first — ask for the plan written to
    `claude_plans/PLAN_<name>.md` + "don't implement yet" (nothing executes; build later on
    explicit instruction); (b) plan mode for drafting — on exit the plan is saved to a file; pick a
    non-implementing exit ("keep planning"/decline) to avoid auto-build, rename to PLAN_<topic>.md,
    build later. CLAUDE.md plan section rewritten to this accurate version.
  - **User will test this.** No hook needed; no "pause after approval" gate.
- **/realign is a SKILL**, not an agent (runs in main thread with full context; explicitly
  invoked; edits the always-loaded files directly). May delegate a read-only audit to a
  short-lived subagent on large repos (hybrid fallback).
- **Reference repo `global_config/*` is the canonical source** the live `~/.claude/*` is copied
  from; both skills draw the format from there.
- **Execution mode:** proceed with everything; persist context for compaction (this file +
  MEMORY.md + a memory entry).

## Verified environment facts (this session)

- Claude Code **2.1.158**. Supports `includeCoAuthoredBy`, `outputStyle`+`keepCodingInstructions`,
  `hooks`, `permissions.deny`/`defaultMode` (confirmed present in binary).
- `.claude/rules/*.md` with `paths:` frontmatter is a **Cursor** convention, **NOT** native
  Claude Code — do NOT use it. Use lean-core + on-demand sub-docs instead.
- No `~/.claude/output-styles/` dir yet; no user-level `~/.claude/agents/`; one skill (project-setup).
- Global `~/.claude/CLAUDE.md` (99 lines) was **identical** to reference `global_config/CLAUDE.md`.
- `project-setup` SKILL.md: live (~398 lines) vs reference (~401) had drifted.
- Live `~/.claude/settings.json`: env(telemetry/timeouts), alwaysThinkingEnabled, effortLevel=xhigh,
  plansDirectory ./claude_plans, showThinkingSummaries, verbose, skipWorkflowUsageWarning. NO
  permissions/hooks/model/includeCoAuthoredBy/outputStyle keys.
- `local-media-gen` AI_INSTRUCTIONS.md = 579 lines / 29KB; 7 project agents; settings allow-only.
- No hidden global plans dir; project `claude_plans/` holds the user's named PLAN_*.md files.

## Reference: full diagnosis lives at

`/tmp/claude-1000/.../tasks/wwsxpzkzc.output` (see Read-first #3). Confirmed friction:
FP-01 oversized always-loaded surface (critical); FP-02 flat emphasis (high); FP-03 tone in
wrong channel (high); FP-04 prose rituals that should be settings/hooks (high); FP-05 mandatory
10-step workflow on trivial work (high); FP-06 subagent description overlap + dead Explore ref
(medium); FP-07 setup skill forces full structure (medium); FP-08 hand-rolled compaction
duplicates native memory (medium); FP-09 rule triplication (medium); FP-10 stale shadow memory +
doc drift (medium); FP-11 max-ceremony settings (medium). FP-12 (permissions gap) was DROPPED as
refuted.

---

## Execution checklist

### Phase 0 — Persistence scaffold
- [x] Write this resume plan
- [ ] Update local-media-gen MEMORY.md with pointer + locked decisions
- [ ] Write a memory entry for the realignment decisions

### Phase 1 — Reference repo (canonical format home: `claude_code_setup/`)
- [ ] `global_config/CLAUDE.md` — rewrite: Hard-rules/Preferences tiering; remove tone sections
  (→ output style) leaving banned-words stub; file-based plan workflow (no auto-execute gate);
  collapse compaction protocol; keep structure tree as single canonical home; target <200 lines
- [ ] `global_config/output-styles/personal-voice.md` — NEW (tone rules, keepCodingInstructions: true)
- [ ] `global_config/settings.json` — template: effortLevel high, includeCoAuthoredBy false,
  outputStyle pointer, permissions.deny example for sampling_prompts, keep env/alwaysThinking/
  plansDirectory; commented
- [ ] `global_config/skills/project-setup/SKILL.md` — scale-to-size; drop "Do NOT skip phases";
  fix Phase 0.1 false-drift check (key-presence, not exact-match); tiered generated templates;
  file-based plan workflow; reference shared rules; pointer to /realign
- [ ] `global_config/skills/realign-project/SKILL.md` — NEW bundled copy of /realign
- [ ] `docs/example_ai_instructions.md` — rewrite to <200-line tiered lean format
- [ ] `.claude/agents/doc-keeper.md` — lean targeted-read; scale-to-size; native-memory awareness;
  narrow delete carve-out for committed in-repo auto-memory shadow trees
- [ ] `README.md` — add "Opus 4.8 alignment principles" section + /realign mention + output-style copy step
- [ ] `AI_INSTRUCTIONS.md` (reference repo's own) — light sync (agent table, hierarchy adds)

### Phase 2 — Live global (`~/.claude/`)
- [ ] `~/.claude/CLAUDE.md` — same content as reference global_config/CLAUDE.md
- [ ] `~/.claude/output-styles/personal-voice.md` — NEW (mkdir + copy from reference)
- [ ] `~/.claude/settings.json` — edit: effortLevel high; add includeCoAuthoredBy false; add
  outputStyle; add permissions.deny for sampling_prompts; KEEP env/alwaysThinking/plansDirectory/
  verbose/showThinkingSummaries/skipWorkflowUsageWarning
- [ ] `~/.claude/settings.local.json` — prune dead cruft (wifi/firmware/probe); keep WebSearch, gh api
- [ ] local-media-gen MEMORY.md — dedupe rules now enforced by settings (keep the
  "never agree about past events" + Flux/LTX + status); fix L36 plan pointer (it's in archive/)

### Phase 3 — Live skills
- [ ] `~/.claude/skills/project-setup/SKILL.md` — same as reference
- [ ] `~/.claude/skills/realign-project/SKILL.md` — NEW (copy from reference)

### Phase 4 — Field-test `/realign` on `local-media-gen`  ⏳ APPLYING ALL 14 (user said GO)
- Audit done (workflow waqxwevce) → 14 changes C01–C14. User: apply ALL. C03 → create docs/flux_2.md.
  C07 → keep all-opus, fix doc only. Preserve shadow open-questions before delete.
- Applying via 4 disjoint parallel owners (workflow wr6h58zpi):
  - A: AI_INSTRUCTIONS.md → lean tiered core + new docs/{parameter_flow,coding_standards,configuration,repo_layout}.md; drop Explore row + Model column; scope-gate ref; sampling_prompts→pointer
  - B: 7 agents → targeted reads; workflow_builder single owner (comfyui-workflow); trim descriptions; doc-keeper memory carve-out
  - C: lessons_learned scope-gate (keep verify_workflow_template.py as the one MUST); ARCHITECTURE tree fix; tracker → todo_2026-03-14.md; templates README circular-ref fix
  - D: settings.json deny sampling_prompts; settings.local prune; gitignore .claude/projects/; git rm shadow memory (after preserving open-Qs → docs/research_musubi_i2v.md); create docs/flux_2.md; fix MEMORY.md pointer
- [x] Verify pass (independent): PASS-with-warnings. AI_INSTRUCTIONS 578→234 lines; 6 new sub-docs;
  shadow memory git-removed (open-Qs preserved → docs/research_musubi_i2v.md); .gitignore +.claude/projects/;
  settings deny added + settings.local pruned; tracker → todo_2026-03-14.md; workflow_builder single-owner
  (comfyui-workflow owns, python-backend read-only); docs/flux_2.md created + MEMORY pointer resolves.
- [x] Removed agent-created .backup artifacts (git is the safety net).

### Phase 5 — Finalize  ✅
- [x] Realignment complete across all layers. Plan ready to archive.
- USER TODO: test the plan-mode workflow (plan → save-to-file → rename PLAN_<x>.md → build later);
  optionally activate Personal Voice output style via /config.

### Phase 5 — Finalize
- [x] Update this checklist to all-done; move plan to `archive/` with date prefix when complete (done 2026-05-30 doc-audit)
- [x] Report to user; remind them to TEST the file-based plan workflow

## Risks / watch-outs
- Re-verify inner line numbers on disk before editing local-media-gen files (diagnosis line cites
  may be stale).
- Add settings enforcement (includeCoAuthoredBy, deny) BEFORE deleting the prose rules (belt-and-suspenders).
- Output style activates per-project (settings.local.json), read once at session start; the
  banned-words stub in CLAUDE.md is the backstop for un-wired dirs.
- doc-keeper's "never delete" rule blocks shadow-memory cleanup → do that deletion directly (carve-out added).
- Do NOT add a CLAUDE.md "pause after plan approval" gate — it conflicts with native plan mode.
