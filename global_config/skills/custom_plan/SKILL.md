---
name: custom_plan
description: Plan a sprint, feature, or substantial change WITHOUT using Claude Code's native plan mode (which auto-executes the moment you approve the plan). Named custom_plan on purpose to signal it deliberately differs from native plan mode. Use when the user says "custom_plan X", "plan X", "maak een plan voor X", "ontwerp deze feature", or wants a persistent, reviewable plan file before any code is written. Researches read-only, writes claude_plans/PLAN_<name>.md, then STOPS — building happens only later on an explicit "implement PLAN_<name>" instruction.
---

# custom_plan — plan a feature/sprint your way (read-only, file-first, no auto-execute)

This skill is a deliberate replacement for Claude Code's **native plan mode**. It exists because
native plan mode has one behavior the user dislikes and that cannot be turned off: **approving the
plan immediately starts implementation** (the approve-then-build step is hardcoded in the harness;
even the `--plan-mode-instructions` customization keeps that footer). `custom_plan` keeps the *good*
parts of plan mode — disciplined read-only exploration and a structured design pass — but makes
**saving a plan and building it two separate, user-controlled steps**.

The name is `custom_plan` (not `plan`) on purpose, so it's obvious this is the user's custom flow,
not the built-in one.

Use it for **sprints and features** (substantial work). For a tiny change, just make the edit —
don't wrap a one-liner in a plan.

## Hard rules for this skill

- **Read-only until the plan file is written.** While researching, use ONLY read/exploration tools
  (Glob, Grep, Read, and read-only Bash like `ls`/`git log`/`git diff`/`cat`). Do **NOT** edit,
  create, move, or delete any project files, change configs, run state-changing commands, or make
  commits. This mirrors native plan mode's read-only lockdown — hold it strictly. The single file
  you may write in this skill is the plan file itself, and only in the final step.
- **Stop after writing the plan.** Do not start implementing. End by telling the user the plan is
  saved and reviewable, and that you'll build it only when they explicitly say so.
- **Never enter native plan mode** as part of this skill (no ExitPlanMode). This skill replaces it.

## Steps

### 1. Pin down the goal
If the feature/sprint name or scope is unclear, ask 1-3 sharp questions first (AskUserQuestion or
plain). Derive a short kebab/snake plan name from the feature or sprint (e.g. `sprint3-auth`,
`batch-export`). Confirm the name if ambiguous.

### 2. Research the codebase — read-only
Explore enough to write a concrete plan, not a vague one:
- Find the real files involved (Glob/Grep), read the ones that matter, follow existing patterns.
- Note current behavior, the layers a change touches, constraints, and risks.
- **Verify premises against the code, not against older docs/plans.** A plan built on a stale
  claim ("X has no handling for Y") designs the wrong fix; check each load-bearing claim in the
  actual source and record corrected premises in the plan (they change the design).
- If the project has them, consult `AI_INSTRUCTIONS.md`, `docs/lessons_learned.md`, and relevant
  sub-docs (they carry project-specific pitfalls). Scale depth to the size of the work.
- For a large/unfamiliar codebase you MAY delegate read-only exploration to subagents — prefer
  the project's own research agents (e.g. a repo-researcher) or a cheap-model (sonnet) subagent;
  reserve the main thread for the design thinking. The plan file is still written here, in the
  main thread.
- Do not write anything yet.

### 3. Write the plan file
Write to `claude_plans/PLAN_<name>.md` (the project's `plansDirectory`; create the folder if
missing). Use a clear, reviewable structure — adapt to the work, but cover:

```markdown
# PLAN — <feature or sprint title>

## Goal
What we're building and why (1-3 sentences).

## Scope
In scope / explicitly out of scope.

## Affected files & layers
File-by-file: what changes in each (frontend / backend / infra / templates / config — whatever applies).

## Approach
The design and the order of work. Interface contracts, data flow, non-trivial decisions + rationale.

## Shared state & seams        <!-- REQUIRED for multi-package/multi-agent work -->
Every state/file/flag that crosses a package boundary: its ONE owning writer, the ONE shared
read-predicate every consumer uses, and which integration test covers that seam. (Parallel
builds fail in the seams, not the packages — see the global "Complex builds" guard rails.)

## Failure & resume semantics  <!-- REQUIRED when any step is long-running or multi-stage -->
Per long-running step: what happens on mid-run failure, what state is on disk, how a re-run
resumes. Gating state may only be set on verified success — error paths fail loudly.

## Risks & open questions
What could go wrong; anything needing a decision before building.

## Steps
An ordered, checkable task list (the build sequence). For complex/multi-agent work the sequence
ENDS with: (1) a post-build adversarial review at a higher tier than the builders, seam-focused,
findings fixed before proceeding; (2) a live end-to-end of the real flow as the closing gate —
a green suite alone never closes the sprint.

## Test / verification
How we'll confirm it works — including the failure paths (a plan that only tests the happy path
is not done), and the live end-to-end for anything user-facing.
```

Keep it concrete (real file paths, real function/endpoint names from step 2), not generic.
Build agents must be briefed to report deviations + watch items in their final output — those
feed the review phase.

### 4. Stop and hand back
Tell the user:
- The plan is saved at `claude_plans/PLAN_<name>.md` (committable, editable).
- They can review/edit it and ask for changes — you'll revise the file, still without building.
- You will implement **only** when they explicitly say so (e.g. "implement PLAN_<name>").

Do not proceed to implementation on your own.

## Notes
- Why a skill, not native plan mode: native plan mode's approval step transitions straight to coding
  and that can't be overridden by instructions (verified in the Claude Code binary: the ExitPlanMode
  approve-then-build footer is always kept, even with `--plan-mode-instructions`). This skill keeps
  planning and building as two separate, user-controlled steps.
- Read-only here is enforced by discipline (the Hard rules above), not by the harness. If a future
  task needs hard harness-level read-only enforcement, a read-only-tooled plan subagent is the
  stronger mechanism — but it loses interactive back-and-forth, so it's not the default here.
