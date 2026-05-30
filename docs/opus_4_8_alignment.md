# Opus 4.8 Alignment — why the format changed

This document is the canonical rationale for the format used across this repo (the tiered
`CLAUDE.md`, the lean `AI_INSTRUCTIONS.md`, the `/realign` skill, the deterministic settings). The
`README.md` carries a short summary of the principles; the depth and the *why* live here.

## The problem this solves

The original setup was tuned for Claude Opus 4.5 / 4.6. On Opus 4.7 / 4.8 the same files felt
**heavier and more bureaucratic** — slower, more ceremony on trivial tasks, occasional wrong moves.
Nothing in the files was "wrong"; the model changed underneath them.

## What changed in the model

Opus 4.7 / 4.8 is **more literal** and **more agentic** than 4.5 / 4.6:

- It follows soft prose imperatives close to the letter. "Always run the full review", "never skip
  the planning step", "do NOT skip phases" were *right-sizing hints* on 4.6 (the model used
  judgment about when they applied). On 4.8 they become *hard contracts* it executes every time —
  even for a one-line change.
- It proactively creates structure. Told to scaffold a project, it builds every document and agent,
  even for a throwaway script.
- It treats in-repo files as ground truth and does not hedge across contradictions. A stale,
  confident, dated file in the repo gets trusted over reality.
- It weights every emphasized rule (ALWAYS / NEVER / MUST / CRITICAL) roughly equally. A flat wall
  of capitalized rules gives it no signal about which rules are actually load-bearing, so it spends
  equal effort on "use neutral tone" and "never commit secrets".

The net effect: a setup that relied on the model *softening* instructions by context now gets every
instruction enforced literally. The fix is not "write more rules" — it is to **change the wording,
the channel, and the location** of the rules so a literal model reads them the way they were meant.

## The ten principles

1. **Tier emphasis.** Split every instruction file into a small **Hard rules (never violate)** block
   and a **Preferences (use judgment; override when better served)** block. Reserve absolutes for
   genuine invariants (English-only, no AI attribution, never commit secrets, verify templates).
   Everything else is a preference with an explicit override license.

2. **Intent + conditions, not universal imperatives.** Replace "No shortcuts / ALWAYS / Do NOT
   skip / FIRST action before anything else" with scope-gated guidance plus an explicit short path
   ("full flow for changes touching 3+ files or any risky change; short path for single-file edits,
   docs, and questions"). State "scale depth to task size" wherever ceremony lives — 4.6 inferred
   it, 4.8 needs it written.

3. **Right channel per rule.** Durable tone/persona -> a user-level **output style** (modifies the
   system prompt, strongest adherence). Process and project conventions -> `CLAUDE.md` /
   `AI_INSTRUCTIONS.md`. Volatile cross-session state -> the native auto-memory (`MEMORY.md`), not a
   hand-rolled prose protocol.

4. **Deterministic over prose for enforceable rules.** `includeCoAuthoredBy: false` instead of
   "remember to strip Co-Authored-By"; a `permissions.deny` entry instead of a prose file-read ban.
   Settings and hooks block regardless of what the model decides; prose only nudges.

5. **One home per fact.** Single-source each rule and reference it elsewhere. Duplicated rules both
   raise a rule's apparent weight to a literal model and drift into contradictions it must then
   resolve arbitrarily — ironically breaking the "one source of truth" principle itself.

6. **Lean always-loaded surface.** `CLAUDE.md` and memory files load in full every turn, and longer
   files reduce adherence. Keep them well under ~200 lines; push detail into focused sub-docs that
   are read on demand. (Custom subagents do **not** inherit the parent's CLAUDE.md/memory — give
   each agent a targeted read of the one doc it needs, not a blanket "read the whole 29KB file".)

7. **Minimal by default, scale up only when asked.** New-project scaffolding starts small (a script
   may need only `README.md` + `AI_INSTRUCTIONS.md`) and expands to the full document/agent set only
   for substantial projects or on request.

8. **Trust native systems over shadow copies.** Let native auto-memory own volatile state. Delete
   git-tracked in-repo memory mirrors — a literal model trusts a confident, dated, in-repo file even
   when it contradicts current state.

9. **Tune depth at the settings layer.** Use `effortLevel` (e.g. `high` for everyday work, `xhigh`
   per-session for genuinely hard tasks) instead of prose "always be thorough" mandates. 4.8 already
   supplies more depth per turn; stacking prose depth-mandates on top fights its improved default.

10. **Crisp, non-overlapping subagent descriptions.** The description field drives auto-routing on
    4.8, and it routes literally. Lead with concrete keyword triggers; add "Use proactively when..."
    only where auto-delegation is wanted; give each contested domain exactly one owner; move worked
    examples out of the description into the agent body so the routing signal stays sharp.

## A note on plan mode

Native plan mode in Claude Code starts implementing as soon as you approve the plan — that is
built into the harness and cannot be overridden by prose in `CLAUDE.md`. To plan **without**
auto-building, use the `/custom_plan` skill: it researches read-only, writes the plan to
`claude_plans/PLAN_<topic>.md`, and stops — building happens only later on an explicit "implement
PLAN_<topic>" instruction. (Equivalent without the skill: ask for the plan written to that path
with "don't implement yet".) `plansDirectory: ./claude_plans` keeps those plan files inside the
project, not the hidden global `~/.claude/plans/`.

## How the principles map to this repo

| Principle | Where it shows up |
|-----------|-------------------|
| 1, 2, 6 | `global_config/CLAUDE.md` (tiered, lean) and the `AI_INSTRUCTIONS.md` the skills generate |
| 3 | `global_config/output-styles/personal-voice.md` (tone), `CLAUDE.md` (process), native memory (state) |
| 4 | `global_config/settings.json` (`includeCoAuthoredBy: false`, `permissions.deny`) |
| 5, 8 | the `/realign` audit (drift, duplication, shadow memory) |
| 7 | `project-setup` skill (scale-to-size, no "do not skip phases") |
| 9 | `effortLevel: high` in the settings template |
| 10 | `doc-keeper.md` description style; `/realign` description-hygiene checks |

## How this was derived

The diagnosis came from a multi-agent research pass (parallel readers over the reference project,
the global setup, and a real project, plus web research on current Claude Code best practices and
the 4.6->4.8 behavior shift), followed by an adversarial verification pass that tried to refute each
proposed friction point. Only friction points that survived both a skeptic and a practical-impact
check were kept. The skills (`/project-setup` for new projects, `/realign` for existing ones, and
`/custom_plan` for build-it-later planning) are how the surviving principles get applied in practice.
