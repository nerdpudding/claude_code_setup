---
name: project-setup
description: "Interactive workflow to scaffold a NEW project with the preferred structure, docs, agents, and workflow. Trigger on \"set up a new project\", \"scaffold a project\", \"new repo structure\", \"create AI_INSTRUCTIONS\", \"bootstrap a project\", or \"verify my Claude Code setup on a new PC\". For auditing/fixing an EXISTING project against these conventions, use /realign-project instead."
---

# New Project Setup Workflow

You are guiding the user through setting up a new project with a clean, consistent structure.

**Scale the phases and the document set to project size** — a small script may only need `README.md` + `AI_INSTRUCTIONS.md`; run the full set only for substantial projects. The phases below are an order to follow when they apply, not a checklist to force onto every project.

**Quick / minimal scaffold:** for a script or tiny tool, skip straight to creating `README.md` + `AI_INSTRUCTIONS.md` (Phase 3.2 and 3.3), a `.gitignore`, and `git init` (Phase 6). Skip concept.md, roadmap, daily trackers, agents, and phase folders unless the project clearly warrants them.

**Canonical rules** (English-only, one source of truth, archive-never-delete, no AI attribution) live in the global `CLAUDE.md`. This skill references them rather than restating them, so there is one home per rule.

**Arguments:** The user may provide a project name or description. If not, ask for it in Phase 1.

**Mode:** If the user says "check global setup" or "verify environment", run Phase 0 only.

**Counterpart:** For an EXISTING project that needs auditing/fixing against these conventions, use the **/realign-project** skill instead of this one.

## Phase 0: Verify Global Environment (optional)

Only run this phase if the user asks to verify their global setup, or if this appears to be a new machine.

### 0.1 Global settings

Read `~/.claude/settings.json`. Do NOT diff against a hardcoded value block — exact values drift over time and the user may legitimately add keys (e.g. `verbose`, `showThinkingSummaries`, `skipWorkflowUsageWarning`). Those extra keys are fine, not drift. Instead verify these KEYS exist and hold sensible values:

- `$schema` — points at the Claude Code settings schema.
- `env` — telemetry disabled (`DISABLE_TELEMETRY` / `DISABLE_ERROR_REPORTING`) and Bash timeouts set (`BASH_DEFAULT_TIMEOUT_MS`, `BASH_MAX_TIMEOUT_MS`).
- `alwaysThinkingEnabled` — present (typically `true`).
- `effortLevel` — present and `"xhigh"`. This setup pins `"xhigh"` on purpose (`[user-specified]` 2026-09-19), so that value is correct and is not reported. Anthropic's default of `"high"` for Opus 5 and Sonnet 5 is known and was set aside. Reason and per-model table: `claude_code_setup: opus_5_alignment.md` (effort level per model, and this setup's own pin).
- `plansDirectory` — set (project setups use `./claude_plans`, so plans go in-project, not the hidden `~/.claude/plans/`).
- `includeCoAuthoredBy` — `false` (this is how no-AI-attribution is enforced; no prose rule needed).
- `permissions.deny` — present with at least an example (e.g. private files, `**/.env`, `**/secrets/**`).

Report only genuinely missing or wrong-valued keys, show the user what differs, and ask before changing anything — do not blindly overwrite.

### 0.2 The live config against the repo

`~/.claude/CLAUDE.md`, the skills, the workflows and the output style are all distributed from the
`claude_code_setup` repo, so the question this step answers is not "does the file look right" but
"is the live config identical to the repo". That repo's `AI_INSTRUCTIONS.md` sits at
`__HOME__/vibe_claude_kilo_cli_exp/claude_code_setup/AI_INSTRUCTIONS.md`; if the path does not
resolve, find the repo by its name. Then `git pull` in it and run `./install.sh diff`.

If the repo is not on this machine — the new-PC case — say so, and give the quick start from its
`README.md`: clone it, then install from it.

### 0.3 Orphaned plans

Check `~/.claude/plans/` — it should be empty when `plansDirectory` points plans into projects. If orphaned plans exist, ask the user if they can be archived or deleted.

**Report findings and ask before fixing anything. Then continue to Phase 1 (or stop if this was a verify-only run).**

---

## Phase 1: Define the Project

### 1.0 Detect working context

Before asking any questions, determine WHERE the project will live:

1. Get the current directory path and extract the folder name
2. Check if the folder name is **generic** — any of: `home`, `Desktop`, `Documents`, `Downloads`, `repos`, `repositories`, `projects`, `workspace`, `workspaces`, `src`, `code`, `dev`, `tmp`, `temp`, `work`, or is the user's home directory (`~` / `$HOME`)
3. Check if the folder already contains **project files** — any of: `README.md`, `AI_INSTRUCTIONS.md`, `.claude/`, `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `Makefile`, `.git/`
4. Determine the mode:
   - **Existing folder** — name is NOT generic AND/OR contains project files → work IN this directory
   - **Fresh start** — name IS generic AND no project files → will CREATE a subfolder
   - **Ambiguous** — ask the user via AskUserQuestion: "Set up here in `<folder>`?" or "Create a new subfolder?"

### 1.1 Project name

- **If existing folder:** suggest the current folder name as the project name using AskUserQuestion with two options: "Yes, use `<folder_name>`" and "No, different name". If the user chooses a different name, ask conversationally (not AskUserQuestion) for the name.
- **If fresh start:** ask conversationally for the project name (short, lowercase, hyphen-separated, e.g. `video-chat`, `api-monitor`).

### 1.2 Project details

**Ask the user the following** (use AskUserQuestion or conversation). The answers determine how much structure to build:

1. **One-line description** — what is this project?
2. **Goal** — what is being built and why?
3. **Scope/size** — script, small tool, app, or platform? (this drives structure depth)
4. **Use cases** — who uses it, for what? (list 3-5)
5. **Resources** — any repos to clone, APIs to integrate, models to use?
6. **Hardware/constraints** — relevant hardware, deployment target, VRAM limits?
7. **Development approach** — PoC/iterative/production? Sprint-based?

8. **Comparable projects of the user's** — which earlier project is this one most like? Read the
   structure and process entries of its `docs/lessons_learned.md` before proposing a layout, and
   say which of them shape this set-up. (`[user-specified]` 2026-09-19: a project was laid out with
   a flat `docs/` while a larger sibling had already recorded what that turns into.)

**Do NOT create any files yet.** Confirm understanding with the user before proceeding.

---

## Phase 2: Create Directory Structure

Scale the structure to the project size from Phase 1.2:

- **Small (script/tool):** just the project root — `README.md`, `AI_INSTRUCTIONS.md`, maybe a `docs/` folder.
- **Medium (app):** add `roadmap.md`, `concepts/`, `docs/`, `claude_plans/`, `archive/`.
- **Large (platform):** full structure with `phase{N}/` folders and `.claude/agents/`.

**`docs/` gets category folders from the first day** (medium/large) — see "Project organization"
in the global `CLAUDE.md` for why, and for what belongs where. Propose the categories this project
will need, for example `docs/install/`, `docs/architecture/` (with its `diagrams/`),
`docs/evaluation/` or `docs/measurements/`, `docs/research/`, `docs/usage/`, `docs/design/`.

Show the proposed tree and confirm before creating anything. Behavior also depends on the mode detected in Phase 1.0:

### Fresh start (creating a new subfolder)

Create the project skeleton inside a new directory (only the folders the size warrants):

```bash
mkdir -p <project_name>/{claude_plans,archive,concepts,docs,.claude/agents}
```

Then work inside this new directory for all subsequent phases. If the user mentioned repos to clone, clone them now into the project root.

### Existing folder (working in current directory)

Only create subdirectories that don't already exist:

```bash
# Check and create each if missing (drop the ones the project doesn't need):
mkdir -p claude_plans archive concepts docs .claude/agents
```

Note any existing files found (e.g. "Found existing README.md — will update rather than overwrite in Phase 3"). Do NOT overwrite existing files without asking.

---

## Phase 3: Create Foundational Documents

Always create `README.md` and `AI_INSTRUCTIONS.md`. **Scale the document set to project size** — a small script can skip `concepts/concept.md`, `roadmap.md`, `docs/lessons_learned.md`, and the daily tracker unless they are clearly warranted. Add the rest only as the project grows. Create the documents in an order where each builds on the previous.

### 3.1 concepts/concept.md (medium/large)

The `concepts/` folder holds initial concepts and early design thinking. Create the main concept document:
- **Vision** — expanded goal statement
- **Core idea** — simple ASCII diagram showing the main flow
- **System context diagram** (C4 Level 1) — system and external actors (ASCII, keep it simple)
- **Container diagram** (C4 Level 2) — components inside the system (ASCII, keep it simple)
- **Input/output design** — phased table (MVP vs Later)
- **Key technical decisions** — model/framework/tool selection with rationale
- **Hardware/constraints** — what is available, what limits the project
- **Available resources** — cloned repos, libraries, reference material
- **Use cases** — primary and secondary
- **Development approach** — iterative, SOLID/DRY/KISS

Skip this for small projects.

### 3.2 README.md

Create the project overview:
- Title and one-line description
- **Table of Contents** (links to all sections) — for larger READMEs
- Goal and status
- Setup/install and usage
- Architecture overview (simple ASCII diagram, if relevant)
- Use cases (bullet list)
- Key technical choices (model, framework, etc.)
- Resources table (repos, dependencies)
- Hardware table (if relevant)
- Project Structure & Agents — **single line referencing AI_INSTRUCTIONS.md** (do NOT duplicate the hierarchy here)
- Documentation links

### 3.3 AI_INSTRUCTIONS.md

The most important file — it tells a session how to work in the project, and is THE authoritative source for the project's rules, hierarchy and agents. All project rules live here: a project keeps no rules in a `CLAUDE.md` of its own (see "Where a rule belongs" in the global `CLAUDE.md`). **Its hierarchy section must match the actual filesystem**, and nothing else may restate it. Keep it a **lean core well under 200 lines**; push detail into sub-docs (`docs/`, phase plans) and link to them rather than inlining. Use the **tiered Hard-rules / Preferences** format so genuine invariants stand apart from judgment calls. Drop the sections a small project does not need rather than leaving empty headers.

**The skeleton is the same in every project; the content is this project's own.** Write nothing into it that could sit unchanged in any project: that is a copy of a global rule, and `/realign-project` would take it out again. A section with nothing project-specific reads "None beyond the global `CLAUDE.md`."

```markdown
# AI Instructions — <Project Name>

## Read first
1. This file (AI_INSTRUCTIONS.md)
2. README.md
3. The relevant phase plan / sub-doc for the task at hand

## Project overview
<one paragraph: what this is and why>

## Tech stack
<languages, frameworks, infra>

## Hard rules (never violate)
The global CLAUDE.md holds the rules that apply in every project. These hold only here:
- <project-specific invariants — e.g. never touch generated/, never edit migrations by hand>

## Preferences (use judgment; override when the task is better served)
- <what this project prefers and why — a framework idiom, a naming scheme, a deployment habit>
- <testing expectation: e.g. tests required for core logic; manual elsewhere>

## Workflow
The sprint cycle and the planning rules are in the global CLAUDE.md. What is specific here:
- <branching / CI / release notes / who tests, as the project needs>

## Project hierarchy (single source of truth — nowhere else)
What this tree holds and how other files point at it: "One tree, and pointers that cannot rot" in
the global CLAUDE.md.
- <the tree>

## Agents
| Agent | Model | When to use |
|-------|-------|-------------|
| <filled in Phase 5> | | |
```

### 3.4 docs/lessons_learned.md (medium/large)

Create the lessons learned file with a header and format template. Skip for small projects.

```markdown
# Lessons Learned

Ongoing log of what worked and what didn't during development. Primarily intended as context for AI assistants to avoid repeating mistakes, but useful for anyone picking up the project.

---

## [Title of the lesson]

**Lesson:** What was learned.

**Example:** What happened that taught this lesson.

**Rule:** The concrete rule to follow going forward.

---
```

List this file in the tree of AI_INSTRUCTIONS.md; the global `CLAUDE.md` already says when to write in it.

### 3.5 roadmap.md (medium/large)

Sprint-based roadmap:
- Sprint 1 — MVP with concrete checkbox tasks
- Sprint 2+ — planned but less detailed
- Status table

Skip for small projects.

### 3.6 Daily task tracker (optional)

Create `todo_<today's date>.md` only if the user works in daily sprints:
- Group tasks by category, use checkboxes
- Mark completed items from this setup session
- Move to `archive/` with a date prefix when done

---

## Phase 4: Project-Level Settings

Create a minimal `.claude/settings.json`. The project-level file mainly needs to point plans into the repo; add a `permissions` block only if the project has files to guard. Global-level keys like `effortLevel`, `includeCoAuthoredBy`, and `model` belong in `~/.claude/settings.json`, not the per-project file, unless the project deliberately overrides them. Do not add an `outputStyle` (deferred).

Do NOT create a project-level `CLAUDE.md`, neither in the root nor in `.claude/`: project rules live in `AI_INSTRUCTIONS.md`. If the folder already has one, leave it alone and tell the user that `/realign-project` moves its rules into `AI_INSTRUCTIONS.md`.

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "plansDirectory": "./claude_plans"
}
```

With an optional permissions block when the project has sensitive paths:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "plansDirectory": "./claude_plans",
  "permissions": {
    "deny": ["Read(**/.env)", "Read(**/secrets/**)"]
  }
}
```

Explain that `plansDirectory` keeps plans in the project repo (not the hidden `~/.claude/plans/`).

---

## Phase 5: Create Agents (optional, medium/large)

Subagents **do** receive the global `CLAUDE.md` (only the built-in `Explore` and `Plan` agents skip it), so do NOT restate its rules in an agent definition — that is duplication. What they do not get by themselves is `AI_INSTRUCTIONS.md`, the output style, the main conversation's auto memory, or its history. So every agent's startup procedure names `AI_INSTRUCTIONS.md` first: that is how the project's rules reach it. Give each agent a self-contained prompt covering what only it needs, plus a targeted set of files to read (not a blanket "read everything first").

**Token economy first.** Every agent pins a `model:` by the tiers in "Model tiers for subagents"
in the global `CLAUDE.md` — read them there and match the value to the agent's job. Never omit
`model:`: an unpinned agent silently inherits the (expensive) session model. Record each agent's
tier in the AI_INSTRUCTIONS agents table so the policy survives sessions.

### 5.1 Doc-keeper (offer when the project has 3+ docs)

**Ask the user:** "Would you like a doc-keeper agent for documentation audits and consistency checks?"

If yes, create `.claude/agents/doc-keeper.md` from the template below, adapted to the project's actual files. (The template is inlined here for convenience; if it grows, it could later move to a bundled file for progressive disclosure — do not over-engineer that now.)

```markdown
---
name: doc-keeper
description: "Use this agent when documentation needs to be audited, maintained, or organized to ensure accuracy and consistency across the project. Specifically:\n\n- After making changes to the project — to verify documentation still reflects reality\n- When the user asks to \"clean up docs\", \"check if everything is up to date\", or \"organize documentation\"\n- After a session of iterative changes where multiple files were modified\n- When archiving or renaming files — to find and fix all broken references\n- Periodically as a maintenance sweep"
model: sonnet
---

You are an elite documentation architect and audit specialist. Your sole focus is **documentation accuracy and organization**. You do not write application code, configure infrastructure, or debug runtime issues. You read project state as source of truth and only change the documentation that describes it. (You DO receive the global and project CLAUDE.md, so those rules are not restated here; what follows is what only this agent needs.)

## Startup Procedure

Read only the files relevant to the audit, starting with:
1. `AI_INSTRUCTIONS.md` — project rules, hierarchy, principles
2. `README.md` — user-facing overview
3. `roadmap.md` — current status and plans (if present)
[Add other key project files here]

## Source of Truth Hierarchy

When documents disagree, resolve using this priority order:
1. **`AI_INSTRUCTIONS.md`** — project rules, hierarchy, and principles
2. **Actual filesystem** — what files and directories really exist on disk
3. **`README.md`** — must conform to the above
4. **Everything else** — must conform to the above

## Core Capabilities

1. **Audit documentation state** — compare filesystem against documented hierarchies
2. **Detect stale content** — cross-reference data across documents for mismatches
3. **Suggest consolidation or archiving** — find redundant, superseded, or misplaced docs
4. **Update cross-references** — find and fix all references when files move
5. **Maintain hierarchy** — the project's rules and hierarchy live in AI_INSTRUCTIONS.md only; README references it but does not duplicate it. Flag a project-level `CLAUDE.md` that holds rules (they belong in AI_INSTRUCTIONS.md); any other list that says what lives where; a tree that carries status, counts, dates or versions, or that lists every file instead of the folders, the core files and what other documents point at; any file loose in the root of `docs/` other than `lessons_learned.md`; and any document path written bare and relative instead of from the project root (inside `docs/`, as a link whose text is that root path). After any move or rename, `git grep` the file name across the project and rewrite every hit. If the project has a test for document paths, run it first and report its output.
6. **Relevance, not only correctness** — for every document ask whether it is still read to do the next work; a correct document nobody needs is a finding, to be archived. Flag agent brief files, agent report files and plan-review documents (a milestone review's dated document is the exception): the cycle in the global CLAUDE.md produces none.
7. **Verify completeness after changes** — check all docs are updated after project changes

## Report Format

### Up to Date
Brief summary of what's correct.

### Inconsistencies Found
- The specific inconsistency
- File and line/section references
- What the correct value should be

### Recommended Actions
Numbered list: what to do, which file(s), priority.

### Missing Documentation
Gaps where documentation should exist but doesn't.

**Fleet mode:** when run inside a Workflow fleet with a structured-output schema, return ONLY
the structured findings list (no prose report sections).

## Constraints
- Match a document's length to what the task needs — cover the substance, don't pad with filler
  sections, redundant summaries, or boilerplate. (The user's output style carries this rule for the
  main conversation, and an output style does not reach a subagent — so it is restated here.)
- Read before judging; report findings, do not edit — the main session applies them.
- After file moves or renames, check ALL pointers.
- A doubt the files can settle is settled from the files; one they cannot settle is reported as
  it stands, in one line.
```

**Adapt this template** to the specific project: update the startup procedure with actual key files, adjust the source-of-truth hierarchy to include project-specific authoritative files, and add any project-specific capabilities or rules.

### 5.2 Additional agents (offer based on project needs)

Evaluate and **ask the user** about each. Only offer agents that make sense — don't offer all of them for a simple script:

| Agent | Offer when... |
|-------|---------------|
| `repo-researcher` | Project includes cloned or external reference repos. "Your project has cloned repos — want a read-only research agent for exploring them?" |
| `environment-setup` | Project needs infrastructure (Docker, GPU, Python envs, model downloads). "This project has infrastructure needs — want an environment setup agent?" |
| `builder` | Project has multiple components to wire together. "This project has multiple components — want a builder agent for Docker/compose/integration?" |

### 5.3 For each agent to create

An agent definition names no project facts — no tree, no list of files or models, no procedure
another file owns. It says where to read them. Write the definition with:
- **Frontmatter:** keyword-led `description` (when to use it; keep worked examples in the body, not the description), and a `model:` pinned per the token-economy rule at the top of this phase.
- **Role statement:** what it does and explicitly what it does NOT do (one owner per domain — avoid overlapping responsibilities between agents)
- **Startup procedure:** `AI_INSTRUCTIONS.md` first, then the targeted files this agent needs to read
- **Source of truth hierarchy:** when documents disagree, what wins
- **Core capabilities:** numbered sections with descriptions
- **Report format:** structured output template. For findings-producing agents (auditors,
  reviewers) include a fleet-mode note — when the agent runs inside a Workflow fleet with a
  structured-output schema, it returns ONLY the structured findings list — and keep
  deviations/watch-items as explicit fields (they map 1:1 onto fleet schemas)
- **Constraints:** hard limits that are this agent's own (read before changing, what it must never touch). Rules the global `CLAUDE.md` carries are not restated: the agent loads that file by itself
- **Scope boundaries:** what's in/out of scope, with referrals to other agents

Create the agent by writing to `.claude/agents/<name>.md` or using the `/agents` command.

### 5.4 Update AI_INSTRUCTIONS.md

After all agents are created, fill in the agents table in `AI_INSTRUCTIONS.md` with every agent, its pinned model tier, and its "when to use" description.

### 5.5 Project-specific skills (optional)

**Ask the user:** "Would you like to add project-specific skills? Skills are reusable workflows triggered by `/skill-name` — like this setup skill. They live in `.claude/skills/<name>/SKILL.md` inside the project. (You can always add them later.)"

**Skills vs agents:** Skills are step-by-step workflows you invoke on demand (like `/project-setup`). Agents are specialized personas Claude delegates to (like doc-keeper). Skills can be global (`~/.claude/skills/`) or project-specific (`.claude/skills/`). Agents are always project-specific (`.claude/agents/`).

If the user wants project-specific skills:
1. Ask for each skill: name and purpose (one sentence)
2. Create `.claude/skills/<name>/SKILL.md` with frontmatter (name, keyword-led description) and a basic workflow skeleton
3. Repeat for additional skills, or continue when the user is done

If no: continue to Phase 6.

---

## Phase 6: Initialize Git

If not already a repo, run `git init`. Create a `.gitignore` appropriate to the stack (include any sensitive paths covered by `permissions.deny`). Make an initial commit when the user asks. No AI attribution is needed in the message — that is enforced globally via `includeCoAuthoredBy: false`.

**Check the branch name before the first commit.** Git's own default is still `master`; it creates `main` only when `init.defaultBranch` is set. The user's own projects are on `main` — the `master` ones are third-party clones. So verify with `git config --global init.defaultBranch`, and if it is unset or the new repo landed on `master`, fix both: `git branch -m main`, and set the global default so it cannot recur. Renaming is free before the first push and awkward afterwards. (`[user-specified]` 2026-07-27 — a fresh repo silently got `master` because the setting was missing, and the mismatch only surfaced when VS Code showed the branch as unpublished.)

**Ask before adding a remote, and never push — the user pushes himself, always.** Where a remote should point is a per-user convention; do not assume GitHub and do not run `gh repo create`. Worth knowing: VS Code labels the first push of a new branch "Publish Branch", which is simply `git push -u origin <branch>` and not an error state.

---

## Phase 7: Explain the Workflow

After everything is set up, walk the user through how to work in the project:

- **Read `AI_INSTRUCTIONS.md` first**, then README.md, then the relevant active plan.
- **Scale workflow depth to the task** — a small fix needs no plan, roadmap, or ceremony.
- **Use /custom_plan for non-trivial features.** It researches read-only, writes
  `claude_plans/PLAN_<name>.md`, and stops — a persistent, reviewable plan file.
- **Build later, only on an explicit instruction** (e.g. "implement PLAN_<name>"). Saving or approving a plan is not approval to start coding.
- **After delivery, run /feature-close** — docs check, leftovers carried to the backlog, the plan archived with a date prefix (e.g. `2026-01-28_PLAN_<topic>.md`).
- **To continue in a fresh session** after freeing up context: `/pre-clear-compact` writes `sessions/SESSION_CARRYOVER.md` (created on demand), you commit it and `/clear`, and `/post-clear-handover` picks it up on the other side and archives it.
- **Use agents for their domain** — check the agents table before doing specialized work manually. Delegate implementation to pinned-model agents (each pinned to the cheapest tier that does the job — see the agents table) rather than doing it inline on a top-tier session model.
- **Canonical rules** (one source of truth, archive-never-delete, English-only, no AI attribution) live in the global `CLAUDE.md` — they apply here too.

---

## Phase Summary

| Phase | What happens | Scale |
|-------|-------------|-------|
| 0. Environment | (Optional) Check the global settings keys, then diff the live config against the `claude_code_setup` repo | any |
| 1. Define | Detect context, gather goal, size, use cases, constraints | any |
| 2. Structure | Create directories scaled to size (new or fill gaps), clone repos | any |
| 3. Documents | README + AI_INSTRUCTIONS always; concept/roadmap/lessons/tracker as warranted | any |
| 4. Settings | Minimal project-level `.claude/settings.json` (plansDirectory + optional permissions) | any |
| 5. Agents & Skills | Offer doc-keeper and others; add project-specific skills | medium/large |
| 6. Git | `git init`, `.gitignore`, initial commit (on request) | any |
| 7. Explain | Teach the user the workflow | any |
