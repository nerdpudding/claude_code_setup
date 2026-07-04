---
name: realign-project
description: Use when an existing project's Claude Code setup feels heavy, slow, or bureaucratic after a model upgrade, or to audit CLAUDE.md / AI_INSTRUCTIONS.md / agents / skills / settings / memory for tiering, duplication, dead references, stale shadow memory, and over-ceremony. Counterpart to project-setup (which sets up new projects). Invoke explicitly with /realign.
---

# Realign Project

Audit an existing project's Claude Code setup and realign it to modern Opus 4.8 / Claude Code idioms: two-tier instructions, deterministic settings over prose rituals, single-homed facts, native memory, and scale-to-task-size workflows.

This is the counterpart to `project-setup` (new projects). It runs in the main conversation thread with full context and is explicitly user-invoked — it does not auto-route.

The reference repo `claude_code_setup/global_config/*` is the canonical FORMAT source. Compare the project against it when judging what "aligned" looks like.

---

## How to use this skill

Three phases, in order. Phase 1 is read-only. **No edits happen until the user confirms the proposal in Phase 2.** Scale depth to the setup's size — a single CLAUDE.md needs a quick pass; a repo with agents, skills, multiple instruction files, and committed shadow memory warrants the full audit.

---

## Phase 1 — Audit (read-only)

Discover before reading. Do NOT assume a fixed file list.

- Glob for: `CLAUDE.md`, `**/CLAUDE.md`, `AI_INSTRUCTIONS.md`, `.claude/settings.json`, `.claude/settings.local.json`, `.claude/agents/*.md`, `.claude/skills/**/SKILL.md`, `**/MEMORY.md`, `claude_plans/*.md`, `.claude/projects/**/memory/*.md`.
- Read every discovered instruction/config file IN FULL. These files steer everything; skimming misses drift.

Detect and cite exact files + line numbers for each:

1. **Oversized always-loaded / always-read files.** CLAUDE.md or AI_INSTRUCTIONS.md over ~200 lines (they load in full every turn; longer files reduce adherence). Agents that read large files on every spawn.
2. **Flat emphasis.** ALWAYS / NEVER / MUST / CRITICAL applied to mere preferences alongside genuine invariants, with no tier separation.
3. **Duplicated rules** across CLAUDE.md / AI_INSTRUCTIONS.md / MEMORY.md / agents / skills — and whether the copies have DRIFTED (contradict each other). Flag drift as higher priority than plain duplication.
4. **Prose rituals that should be deterministic.** Commit-attribution reminders, file-read bans, plan-rename steps written as prose the model must remember. These belong in settings: `includeCoAuthoredBy: false`, `permissions.deny`.
5. **Unqualified universal-imperative workflows.** "No shortcuts", "ALWAYS run X", "Do NOT skip", "Not optional" — with no scale-to-task-size escape hatch.
6. **Subagent description hygiene.** Vague or overlapping descriptions; multiple owners for one domain; worked examples bloating the description field; dead agent references (named in docs/CLAUDE.md but no file exists). Fix only real problems — descriptions are often already fine.
7. **Shadow memory vs native memory (first-class check).** Find git-tracked in-repo memory (e.g. `.claude/projects/.../memory/*.md`; confirm with `git ls-files`). DIFF it against the native `MEMORY.md` fact by fact: a copy that *contradicts* native memory is higher-consequence than one that merely duplicates it (subagents act on the in-repo file but don't inherit native memory). Before recommending deletion, check whether the shadow file holds anything UNIQUE (e.g. open research questions) not in native memory — preserve that to a tracked doc first; delete only the stale/duplicated remainder.
8. **Doc self-contradictions.** Two sections describing different file layouts; inconsistent file-naming schemes (e.g. `todo_<date>.md` vs another tracker); mis-located or partially-done plans; settings-check blocks that mis-report the current config as drift.
9. **Model tiering (token economy).** The main thread's model is the expensive tier; agents
   without a `model:` frontmatter key silently inherit it. Check: every project agent pins the
   cheapest model that does the job (`haiku` for mechanical/bulk work, `sonnet` for
   research/docs/standard implementation, `opus` only for genuinely hard implementation or
   design; `fable` never as an agent default — expensive, reserved for the very hardest tasks on
   explicit user request); implementation work is delegated to agents rather than done inline
   when the session runs on a top-tier model; the project's agent table (AI_INSTRUCTIONS) records
   the tiers so the policy survives sessions. Flag any agent pinned to `fable` as a finding.
10. **Response-calibration register.** Over-ceremony is not only in workflow prose — it is also a response habit (padding a small ask with unrequested checks, rollbacks, caveats; or the opposite, half-baked answers the user must drag the rest out of). Check that the tone/register channel — the Personal Voice output style, or the project's own tone instructions — carries a *response calibration* rule: match answer size to request, neither padded nor half-baked. If absent, flag it.

**Corroborate every prose rule against deterministic state.** For each "always/never" prose rule, check whether `settings.json` / `settings.local.json` / `.gitignore` / agent frontmatter already enforces it. If so, the prose is redundant — downgrade it to a one-line pointer rather than a restated rule. This single step surfaces most duplication findings; do it explicitly, not incidentally.

Do not conclude until every discovered file has actually been read — a finding drafted before reads return is provisional and must be superseded by the full-evidence version.

**Known false positives — do NOT flag these as problems:** `Explore` (and similar) are BUILT-IN capabilities, not missing project agents; an untracked `settings.local.json` is intentional, not broken; a partially-done plan correctly STAYS in `claude_plans/` until finished (don't "fix" its location).

Report findings as a structured list with citations. Do not propose fixes yet.

**Hybrid fallback (large repos only):** if the setup is large enough that reading everything would pollute main context, the read-only audit MAY be delegated to a short-lived general-purpose subagent. That subagent returns findings only. All decisions and edits stay in the main thread — never delegate Phase 2 or 3.

---

## Phase 2 — Propose (ask before editing)

Present a TIERED, prioritized change list:

- **P1 — correctness / consequence:** drift between contradicting copies, dead references, deterministic-rule gaps (no `includeCoAuthoredBy`/`deny`), shadow memory contradicting native memory.
- **P2 — high leverage per minute:** tiering a flat file, slimming an oversized always-loaded file to a lean core, single-homing a duplicated rule.
- **P3 — hygiene:** naming consistency, plan relocation, minor description tidy-ups.

Then use AskUserQuestion for the open decisions BEFORE editing, e.g.:

- effortLevel — match to the pinned model per Anthropic's guidance (`xhigh` for Opus 4.8/4.7 coding, `high` for Fable 5 / Sonnet 5); confirm before changing.
- Delete a specific stale shadow-memory file? (name the exact path).
- Which daily-tracker / file-naming scheme to standardize on when the docs conflict.
- Whether to scope-gate a mandatory workflow with a scale-to-task-size escape hatch.

**Flag apply-order dependencies.** Some fixes are sequenced — extract sub-docs BEFORE repointing agents at them; add a `permissions.deny` BEFORE trimming the prose ban it replaces. State the required order in the proposal so applying it top-to-bottom never breaks a pointer.

Get explicit confirmation before any write.

---

## Phase 3 — Apply (only after confirmation)

- **Single-home each fact.** Keep one canonical copy; replace the others with a reference. Resolve drift toward the correct version (confirm with the user if ambiguous).
- **Convert enforceable rules to settings.** Add `includeCoAuthoredBy: false` and `permissions.deny` entries. Add the settings enforcement BEFORE deleting the corresponding prose (belt-and-suspenders), then remove the now-redundant prose.
- **Add scale-to-task-size escape hatches** to mandatory-sounding workflows.
- **Ensure a response-calibration register exists.** If the tone channel lacks it, add a short "match the answer to the request — neither padded ceremony nor half-baked minimalism" rule, single-homed in the output style (not restated across files).
- **Slim oversized files** to a lean two-tier core ("Hard rules" + "Preferences") plus on-demand sub-docs that are referenced, not inlined.
- **Fix drift and self-contradictions**; standardize naming; relocate mis-placed plans.
- **Delete approved stale shadow memory** and add its path to `.gitignore`. Delete only files the user approved.
- Surface anything that contradicts how the user described it rather than silently "fixing" it.

After applying, do a final consistency pass and report what changed.

---

## Corrected mechanics (do not repeat these over-claims)

- Subagents do NOT auto-inherit the parent's CLAUDE.md or memory — give each agent the context it needs.
- `.claude/rules/*.md` with `paths:` frontmatter is a **Cursor** convention, NOT native Claude Code. Do not recommend it. Use a lean core + on-demand sub-docs instead.
- `plansDirectory` LOCATES plans; it does not rename them. Plan mode's save-and-return option writes the plan to that directory WITHOUT executing it; rename the generated `*-ultraplan.md` to `PLAN_<topic>.md` afterward.
- Tune depth with `effortLevel`, not by adding or removing prose "be thorough" mandates.
- Tone/register is single-homed in the **Personal Voice output style** (`~/.claude/output-styles/personal-voice.md`, active via `outputStyle` in settings, with `keep-coding-instructions: true` so default coding behavior is preserved). CLAUDE.md keeps only a short pointer. When auditing a project, restated tone rules in CLAUDE.md/AI_INSTRUCTIONS are duplication — trim to the pointer. (Historical note: tone-in-CLAUDE.md was the old default before the keep-coding mechanism was verified.)
- Descriptions are often already fine — fix only real overlaps and dead references; do not wholesale-rewrite them.

---

## Notes

Reference the shared rules in `claude_code_setup/global_config/CLAUDE.md` and `settings.json` rather than restating them. That repo is the canonical FORMAT source `/realign` compares a project against.
