---
name: project-setup
description: "Interactive workflow to scaffold a NEW project with the preferred structure, docs, agents, and workflow. Trigger on \"set up a new project\", \"scaffold a project\", \"new repo structure\", \"create AI_INSTRUCTIONS\", \"bootstrap a project\", or \"verify my Claude Code setup on a new PC\". For auditing/fixing an EXISTING project against these conventions, use /realign instead."
---

# New Project Setup Workflow

You are guiding the user through setting up a new project with a clean, consistent structure.

**Scale the phases and the document set to project size** — a small script may only need `README.md` + `AI_INSTRUCTIONS.md`; run the full set only for substantial projects. The phases below are an order to follow when they apply, not a checklist to force onto every project.

**Quick / minimal scaffold:** for a script or tiny tool, skip straight to creating `README.md` + `AI_INSTRUCTIONS.md` (Phase 3.2 and 3.3), a `.gitignore`, and `git init` (Phase 6). Skip concept.md, roadmap, daily trackers, agents, and phase folders unless the project clearly warrants them.

**Canonical rules** (English-only, one source of truth, archive-never-delete, no AI attribution) live in the global `CLAUDE.md`. This skill references them rather than restating them, so there is one home per rule.

**Arguments:** The user may provide a project name or description. If not, ask for it in Phase 1.

**Mode:** If the user says "check global setup" or "verify environment", run Phase 0 only.

**Counterpart:** For an EXISTING project that needs auditing/fixing against these conventions, use the **/realign** skill instead of this one.

## Phase 0: Verify Global Environment (optional)

Only run this phase if the user asks to verify their global setup, or if this appears to be a new machine.

### 0.1 Global settings

Read `~/.claude/settings.json`. Do NOT diff against a hardcoded value block — exact values drift over time and the user may legitimately add keys (e.g. `verbose`, `showThinkingSummaries`, `skipWorkflowUsageWarning`). Those extra keys are fine, not drift. Instead verify these KEYS exist and hold sensible values:

- `$schema` — points at the Claude Code settings schema.
- `env` — telemetry disabled (`DISABLE_TELEMETRY` / `DISABLE_ERROR_REPORTING`) and Bash timeouts set (`BASH_DEFAULT_TIMEOUT_MS`, `BASH_MAX_TIMEOUT_MS`).
- `alwaysThinkingEnabled` — present (typically `true`).
- `effortLevel` — present. `"high"` is the everyday default for 2.1.x; `"xhigh"` is available on demand when more depth is wanted.
- `plansDirectory` — set (project setups use `./claude_plans`, so plans go in-project, not the hidden `~/.claude/plans/`).
- `includeCoAuthoredBy` — `false` (this is how no-AI-attribution is enforced; no prose rule needed).
- `permissions.deny` — present with at least an example (e.g. private files, `**/.env`, `**/secrets/**`).

Report only genuinely missing or wrong-valued keys, show the user what differs, and ask before changing anything — do not blindly overwrite.

### 0.2 Global CLAUDE.md

Read `~/.claude/CLAUDE.md` and verify it contains the current tiered sections:

- **Hard rules (never violate)** — English-only, no AI attribution, commit/push only when asked, no secrets, don't delete/overwrite files you didn't create.
- **Preferences (use judgment)** — scale depth to task size, SOLID/DRY/KISS, one source of truth, build on existing work, keep docs current, session-start read order.
- **Project organization** — the structure tree and key terms (single canonical home for the hierarchy).
- **Planning workflow** — in-project plans, save → rename to `PLAN_<topic>.md` → build later on explicit request.
- **Communication style** and **Writing style**.
- **Memory & compaction** — native auto-memory (MEMORY.md); short compaction summary; re-read order.

If the file is missing or a section is absent, offer to create or update it from the reference template. Do not force a rewrite of sections that are present and reasonable.

### 0.3 Orphaned plans

Check `~/.claude/plans/` — it should be empty when `plansDirectory` points plans into projects. If orphaned plans exist, ask the user if they can be archived or deleted.

### 0.4 Global skills

Verify this skill exists at `~/.claude/skills/project-setup/SKILL.md`, and that the `/realign` counterpart exists at `~/.claude/skills/realign-project/SKILL.md`.

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

**Do NOT create any files yet.** Confirm understanding with the user before proceeding.

---

## Phase 2: Create Directory Structure

Scale the structure to the project size from Phase 1.2:

- **Small (script/tool):** just the project root — `README.md`, `AI_INSTRUCTIONS.md`, maybe a `docs/` folder.
- **Medium (app):** add `roadmap.md`, `concepts/`, `docs/`, `claude_plans/`, `archive/`.
- **Large (platform):** full structure with `phase{N}/` folders and `.claude/agents/`.

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

The most important file — it tells any AI tool how to work in the project, and is the single source of truth for the project's hierarchy and agents. Keep it a **lean core well under 200 lines**; push detail into sub-docs (`docs/`, phase plans) and link to them rather than inlining. Use the **tiered Hard-rules / Preferences** format so genuine invariants stand apart from judgment calls. Drop the sections a small project does not need rather than leaving empty headers.

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
- All code, docs, comments, plans, and commit messages MUST be in English — always, no
  exceptions. The user often communicates in Dutch, but everything written to files is English.
- <project-specific invariants — e.g. never touch generated/, never edit migrations by hand>
- (Global rules still apply: one source of truth, archive-never-delete, no AI attribution.)

## Preferences (use judgment; override when the task is better served)
- Neutral, impersonal writing style.
- SOLID / DRY / KISS; modular where it pays off — do not over-engineer.
- Scale workflow depth to task size — a one-line fix needs no plan, roadmap, or phase doc.
- Build on existing work; keep docs current after a change.
- When an approach fails or wastes effort, note it in docs/lessons_learned.md (if present).
- <testing expectation: e.g. tests required for core logic; manual elsewhere>

## Workflow
- Use plan mode for non-trivial features; plans live in claude_plans/ (see Planning below).
- Code review for substantial or risky changes — not mandatory on every trivial edit.
- <branching / CI / release notes as the project needs>

## Planning (in-project plans)
- Draft in plan mode; the plan is saved to a file in claude_plans/. To avoid building right
  away, pick a non-implementing exit ("keep planning" / decline), or ask for the plan written
  to claude_plans/PLAN_<name>.md with an explicit "don't implement yet".
- Rename the saved file to PLAN_<topic>.md; build later only on an explicit instruction.
- After completing a plan, archive it with a date prefix.

## Project hierarchy (single source of truth — nowhere else)
- <full file tree with short descriptions>

## Agents
| Agent | When to use |
|-------|-------------|
| <filled in Phase 5> | |

## Sub-docs (detail lives here, not above)
- docs/<...>.md — <what>
- docs/lessons_learned.md — ongoing log of what worked / didn't
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

Reference this file in AI_INSTRUCTIONS.md (Preferences) and in the after-compaction re-read order.

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

Subagents do not inherit the global `CLAUDE.md` or project memory, so give each a self-contained prompt and a targeted set of files to read (not a blanket "read everything first").

### 5.1 Doc-keeper (offer when the project has 3+ docs)

**Ask the user:** "Would you like a doc-keeper agent for documentation audits and consistency checks?"

If yes, create `.claude/agents/doc-keeper.md` from the template below, adapted to the project's actual files. (The template is inlined here for convenience; if it grows, it could later move to a bundled file for progressive disclosure — do not over-engineer that now.)

```markdown
---
name: doc-keeper
description: "Use this agent when documentation needs to be audited, maintained, or organized to ensure accuracy and consistency across the project. Specifically:\n\n- After making changes to the project — to verify documentation still reflects reality\n- When the user asks to \"clean up docs\", \"check if everything is up to date\", or \"organize documentation\"\n- After a session of iterative changes where multiple files were modified\n- When archiving or renaming files — to find and fix all broken references\n- Periodically as a maintenance sweep"
model: sonnet
---

You are an elite documentation architect and audit specialist. Your sole focus is **documentation accuracy and organization**. You do not write application code, configure infrastructure, or debug runtime issues. You read project state as source of truth and only change the documentation that describes it. (You do not inherit the global CLAUDE.md, so the relevant rules are restated below.)

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
5. **Maintain hierarchy** — the project hierarchy lives in AI_INSTRUCTIONS.md only; README references it but does not duplicate it
6. **Verify completeness after changes** — check all docs are updated after project changes

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

## Constraints
- All docs in English; neutral, impersonal writing style.
- One source of truth — flag duplicates as problems; link, do not duplicate.
- Read before suggesting changes; present findings, don't auto-fix — ask before editing.
- Never delete files — recommend archiving to `archive/` with a date prefix. (Narrow
  exception: a committed in-repo auto-memory shadow tree may be deleted, since native
  auto-memory owns that state.)
- After file moves/renames, check ALL cross-references.
- When uncertain, ask. Respect the structure conventions in AI_INSTRUCTIONS.md.
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

Write the agent definition with:
- **Frontmatter:** keyword-led `description` (when to use it; keep worked examples in the body, not the description), `model: sonnet`
- **Role statement:** what it does and explicitly what it does NOT do (one owner per domain — avoid overlapping responsibilities between agents)
- **Startup procedure:** the targeted files this agent needs to read
- **Source of truth hierarchy:** when documents disagree, what wins
- **Core capabilities:** numbered sections with descriptions
- **Report format:** structured output template
- **Constraints:** hard limits (English-only, read before changing, present findings before fixing, scale effort to task size)
- **Scope boundaries:** what's in/out of scope, with referrals to other agents

Create the agent by writing to `.claude/agents/<name>.md` or using the `/agents` command.

### 5.4 Update AI_INSTRUCTIONS.md

After all agents are created, fill in the agents table in `AI_INSTRUCTIONS.md` with every agent and its "when to use" description.

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

---

## Phase 7: Verify Consistency (medium/large)

Run the **doc-keeper** agent (if created) or manually verify:

- [ ] `AI_INSTRUCTIONS.md` hierarchy matches the actual filesystem
- [ ] Agents table matches `.claude/agents/` contents
- [ ] `README.md` references `AI_INSTRUCTIONS.md` for the hierarchy (not duplicated)
- [ ] All markdown links point to existing files
- [ ] No duplicate information across documents
- [ ] `roadmap.md` (if present) reflects the actual plan
- [ ] Daily task tracker (if present) reflects what was done today

Fix any inconsistencies found. Skip this phase for a minimal scaffold.

---

## Phase 8: Explain the Workflow

After everything is set up, walk the user through how to work in the project:

- **Read `AI_INSTRUCTIONS.md` first**, then README.md, then the relevant active plan.
- **Scale workflow depth to the task** — a small fix needs no plan, roadmap, or ceremony.
- **Use plan mode for non-trivial features.** The plan is saved to a file in `claude_plans/`. To capture a plan without building it, pick a non-implementing exit ("keep planning" / decline), or ask for the plan written to `claude_plans/PLAN_<name>.md` with an explicit "don't implement yet".
- **Rename** the saved plan (it gets a generated name) to `PLAN_<topic>.md`.
- **Build later, only on an explicit instruction** (e.g. "implement PLAN_<name>"). Saving or approving a plan is not approval to start coding.
- **After completing a plan, archive it** with a date prefix (e.g. `2026-01-28_<topic>.md`).
- **Use agents for their domain** — check the agents table before doing specialized work manually.
- **Canonical rules** (one source of truth, archive-never-delete, English-only, no AI attribution) live in the global `CLAUDE.md` — they apply here too.

### Available commands
- `/project-setup` — this skill (run again to verify or extend a new project)
- `/realign` — audit/fix an EXISTING project against these conventions
- `/agents` — manage agents
- `/compact` — compress context (re-reads `AI_INSTRUCTIONS.md` after)

---

## Phase Summary

| Phase | What happens | Scale |
|-------|-------------|-------|
| 0. Environment | (Optional) Verify global Claude Code setup via key-presence checks | any |
| 1. Define | Detect context, gather goal, size, use cases, constraints | any |
| 2. Structure | Create directories scaled to size (new or fill gaps), clone repos | any |
| 3. Documents | README + AI_INSTRUCTIONS always; concept/roadmap/lessons/tracker as warranted | any |
| 4. Settings | Minimal project-level `.claude/settings.json` (plansDirectory + optional permissions) | any |
| 5. Agents & Skills | Offer doc-keeper and others; add project-specific skills | medium/large |
| 6. Git | `git init`, `.gitignore`, initial commit (on request) | any |
| 7. Verify | Doc-keeper or manual consistency pass | medium/large |
| 8. Explain | Teach the user the workflow | any |
