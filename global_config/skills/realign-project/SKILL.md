---
name: realign-project
description: Use when an existing project's Claude Code setup feels heavy, slow, or bureaucratic after a model upgrade, or to audit CLAUDE.md / AI_INSTRUCTIONS.md / agents / skills / settings / memory for tiering, duplication, dead references, stale shadow memory, and over-ceremony. Counterpart to project-setup (which sets up new projects). Invoke explicitly with /realign.
---

# Realign Project

Audit an existing project's Claude Code setup and realign it to current Claude Code idioms: two-tier instructions, deterministic settings over prose rituals, single-homed facts, native memory, and scale-to-task-size workflows. Current model guidance — including what to DELETE because the model now does it unprompted — is `claude_code_setup: opus_5_alignment.md` (what to delete, and the effort level per model).

This is the counterpart to `project-setup` (new projects). It runs in the main conversation thread with full context and is explicitly user-invoked — it does not auto-route.

The reference repo is `claude_code_setup`; its `global_config/` is the canonical FORMAT source to compare the project against when judging what "aligned" looks like. Its `AI_INSTRUCTIONS.md` sits at `__HOME__/vibe_claude_kilo_cli_exp/claude_code_setup/AI_INSTRUCTIONS.md` — every file named below is located through the tree there. If that path does not resolve, find the repo by its name.

---

## How to use this skill

Three phases, in order. Phase 1 is read-only. **No edits happen until the user confirms the proposal in Phase 2.** Scale depth to the setup's size — a single CLAUDE.md needs a quick pass; a repo with agents, skills, multiple instruction files, and committed shadow memory warrants the full audit.

---

## Phase 1 — Audit (read-only)

Discover before reading. Do NOT assume a fixed file list.

- Glob for: `CLAUDE.md`, `**/CLAUDE.md`, `AI_INSTRUCTIONS.md`, `.claude/settings.json`, `.claude/settings.local.json`, `.claude/agents/*.md`, `.claude/skills/**/SKILL.md`, `**/MEMORY.md`, `claude_plans/*.md`, `.claude/projects/**/memory/*.md`.
- Also read the project's **native auto-memory folder** — the one this session's own system prompt names, under `~/.claude/projects/`. It is outside the repo, so a Glob relative to the project never reaches it; read the path from the system prompt and list it directly.
- Read every discovered instruction/config file IN FULL. These files steer everything; skimming misses drift.

Detect and cite exact files + line numbers for each:

1. **Oversized always-loaded / always-read files.** CLAUDE.md or AI_INSTRUCTIONS.md over **200 lines** — Anthropic's own target; longer files consume more context and reduce adherence. Also flag agents that read large files on every spawn. The fix is NOT `@path` imports (they still load at launch); it is deleting what isn't needed every session, moving procedure into a skill, or a path-scoped `.claude/rules/` file. See Corrected mechanics below.
2. **Flat emphasis.** ALWAYS / NEVER / MUST / CRITICAL applied to mere preferences alongside genuine invariants, with no tier separation.
3. **Duplicated rules and facts** across CLAUDE.md / AI_INSTRUCTIONS.md / MEMORY.md / agents / skills — and whether the copies have DRIFTED (contradict each other). Facts count as much as rules: a copy of the tree, a list of models, of sources or of files, a procedure another file owns. Flag drift as higher priority than plain duplication. The repair is fixed: check each item in the copy against the file that owns it, move anything that exists nowhere else into that file, then delete the copy and leave a pointer — never bring the copy up to date.
4. **Prose rituals that should be deterministic.** Commit-attribution reminders, file-read bans, plan-rename steps written as prose the model must remember. These belong in settings: `includeCoAuthoredBy: false`, `permissions.deny`.
5. **Unqualified universal-imperative workflows.** "No shortcuts", "ALWAYS run X", "Do NOT skip", "Not optional" — with no scale-to-task-size escape hatch.
6. **Subagent description hygiene.** Vague or overlapping descriptions; multiple owners for one domain; worked examples bloating the description field; dead agent references (named in docs/CLAUDE.md but no file exists). Fix only real problems — descriptions are often already fine.
7. **Shadow memory vs native memory (first-class check).** Find git-tracked in-repo memory (e.g. `.claude/projects/.../memory/*.md`; confirm with `git ls-files`). DIFF it against the native `MEMORY.md` fact by fact: a copy that *contradicts* native memory is higher-consequence than one that merely duplicates it (subagents act on the in-repo file but don't inherit native memory). Before recommending deletion, check whether the shadow file holds anything UNIQUE (e.g. open research questions) not in native memory — preserve that to a tracked doc first; delete only the stale/duplicated remainder.
   Then read the **native** auto-memory folder found in Phase 1 and sort every entry the same fixed way. A memory that states how to work in the project is a rule: move it to `AI_INSTRUCTIONS.md` and delete it. A memory that repeats a rule already in a tracked file: delete it. State — where things stand, what is in flight — stays. A rule whose content is private keeps only the private detail in memory, with the rule itself in the tracked file.
8. **Doc self-contradictions.** Two sections describing different file layouts; inconsistent file-naming schemes (e.g. `todo_<date>.md` vs another tracker); mis-located or partially-done plans; settings-check blocks that mis-report the current config as drift.
9. **Model tiering (token economy).** The main thread's model is the expensive tier; agents
   without a `model:` frontmatter key silently inherit it. The tiers themselves live in "Model
   tiers for subagents" in the global `CLAUDE.md` — read them there. Check: every project agent
   has a `model:` key; its value matches the tier that section names for the agent's job; the
   project's agent table (AI_INSTRUCTIONS) records it so the policy survives sessions;
   implementation work is delegated to agents rather than done inline when the session runs on a
   top-tier model. Flag any agent pinned to `fable` as a finding.
10. **Register: calibration, plain words, and readability.** Over-ceremony is not only in workflow prose — it is also a response habit. Check that the tone channel — the Personal Voice output style, or the project's own tone instructions — carries all of the following, and flag whichever is absent. Every one of them was written after an observed failure; see `claude_code_setup: opus_5_communication_friction.md` (the failure behind each rule).
    - *Response calibration* — match answer size to request, neither padded nor half-baked.
    - *Document length* — files written to disk are not exempt from the brevity that applies in conversation.
    - *Plain words* — name things instead of internal labels like plan IDs or priority codes, and don't assume a tool, file or term is known.
    - *Self-contained messages* — name the thing again rather than pointing back at an earlier turn ("that list", "option b"). The reader is not holding the thread.
    - *Show, don't describe* — when pointing at something wrong, paste the few lines it concerns rather than summarising them.
    - *One decision at a time* — with any others named in a line so they are not silently dropped.
    - *Rewrite on "I don't follow"* — a different shape, shorter or as a table, rather than the same explanation at greater length.
    - *Short sentences in the user's own language* when that is not English — long constructions come out as literal translations rather than as the language itself.
    - *No word-for-word idioms* in that language — "say the word", "touch base", "the ball is in your court" do not survive translation, and the result reads as machine output.
    - *No coined compound for a term the field says in English* — if the local-language word has to be invented, the term was supposed to stay English. Short sentences do not catch this: both failures that produced these two rules were single words.
11. **Fleet-mode return format.** Findings-producing agents (doc auditors, reviewers) should
    carry a short fleet-mode note: when run inside a Workflow fleet with a structured-output
    schema, return ONLY the structured findings list (no prose report sections). Flag
    findings-producing agents that lack it.
12. **Instructions the model already follows.** Flag prose telling the model to verify or re-check
    work it just did ("a final verification step", "re-read before responding", "use a subagent to
    verify") — it does this unprompted, so the instruction buys a second pass for nothing. Checking
    something EXTERNAL (files, another agent's findings, a live run) is not self-verification and
    stays. Also confirm Claude Code still ships the scope/correction text this setup relies on
    instead of restating. Both: `claude_code_setup: opus_5_alignment.md` (what the model now does
    unprompted).
13. **Testing and review proportionality.** Flag project instructions that mandate exhaustive
    edge-case suites, blanket coverage targets, or long test runs with no "scale it to the
    project" escape hatch — hours-long runs on work that never warranted them is a real,
    measured cost. Separately, check the project describes **two distinct reviews**: an
    independent review of the PLAN before building (routine when a plan is complex or runs across
    parallel agents) and a full adversarial review of the BUILD at milestones, several sprints
    apart. A project describing one review, or treating its sprint-close hygiene pass as the
    review, has them conflated.
14. **Machine-specific and private values in tracked files.** `git grep` the tracked tree for the
    user's username, absolute paths under a home directory, hostnames, internal IPs, and the names
    of the user's OTHER projects. Check git HISTORY too (`git log -S`) — removing a string from
    the working tree does not remove it from a repo that has been pushed. Report severity by what
    it is: a credential is critical, a username or hostname high, a bare path low. **Do not
    propose `~` or `$HOME` as the fix blindly** — some permission rules match command text
    literally and need the path spelled out; in that case the value belongs in a placeholder that
    an install/setup step expands locally, not in the file. Ask before touching history: a rewrite
    means a force-push.
15. **Delegation policy.** Check 9 covers WHICH model an agent gets; this covers WHETHER to spawn
    one. Flag instructions that delegate work finishable in a handful of tool calls, that spawn
    several agents where one would do, or that **use a subagent to verify the session's own work**
    — the last is explicitly counter-productive on current models. A doc audit or an independent
    review of someone else's output is not self-verification and stays.

16. **Document structure drift** (`[user-specified]` 2026-09-19). Compare the project with
    "Project organization" and "One tree, and pointers that cannot rot" in the global `CLAUDE.md`:
    - files loose in the root of `docs/` other than `lessons_learned.md`, instead of category folders;
    - the hierarchy described in more than one place — a "Sub-docs" or "Documentation" list that
      repeats the tree in `AI_INSTRUCTIONS.md` or `README.md`. A README may keep a short "start
      here" list of links; a list that tries to be complete is the finding;
    - a tree that carries status, counts, dates or versions, or that lists every file instead of
      the folders, the core files, and the files another document or an agent points at by name;
    - document paths written as bare relative paths (`install.md`, `../roadmap.md`) instead of the
      path from the project root — inside `docs/`, as a Markdown link whose text is that root path
      and whose target is relative;
    - a requirements or concept document still marked "draft" after the roadmap was built on it;
    - documents nobody reads to do the next work any more: dated reports, plan-review documents, agent
      brief and report files (a milestone review's dated document is legitimate). Count them; a large number is the finding.
    - files the cycle never asked for — see "Nothing grows beside this cycle" in the global `CLAUDE.md`.
    - a pointer into ANOTHER project that carries a folder path or a line number instead of project +
      file name — see "Pointers across projects" in the global `CLAUDE.md`. Grep the sibling projects
      — the other projects under the same parent folder — for pointers INTO this one as well: a
      document move here breaks those, and nothing else finds them. Inbound hits go into the move
      proposal and are edited only on the user's word.
    Where the project has a test suite and no test for document paths, propose one.

**Corroborate every prose rule against deterministic state.** For each "always/never" prose rule, check whether `settings.json` / `settings.local.json` / `.gitignore` / agent frontmatter already enforces it. If so, the prose is redundant — downgrade it to a one-line pointer rather than a restated rule. This single step surfaces most duplication findings; do it explicitly, not incidentally.

Do not conclude until every discovered file has actually been read — a finding drafted before reads return is provisional and must be superseded by the full-evidence version.

**Known false positives — do NOT flag these as problems:** `Explore` (and similar) are BUILT-IN capabilities, not missing project agents; an untracked `settings.local.json` is intentional, not broken; a partially-done plan correctly STAYS in `claude_plans/` until finished (don't "fix" its location).

Report findings as a structured list with citations. Do not propose fixes yet.

**Hybrid fallback (large repos only):** if the setup is large enough that reading everything would pollute main context, the read-only audit MAY be delegated to a short-lived general-purpose subagent. That subagent returns findings only. All decisions and edits stay in the main thread — never delegate Phase 2 or 3.

---

## Phase 2 — Propose (ask before editing)

Open with one line per finding, ordered by consequence — what it is and what it costs. No priority
codes. Then take the findings one per turn: paste the lines the finding concerns, say what goes
wrong, give the recommendation, and end on a yes-or-no question. Findings that have one sensible
fix are reported together, without a question. How all of this is worded is the output style's
job, not this skill's.

Document moves from check 16 are one proposal with the target tree shown, never piecemeal: every
move rewrites references, so it is done once, with `git mv`, and the references repaired afterwards.

Keep a question for the choices where the user's preference decides, each on its own turn:

- effortLevel — match to the pinned model; on Opus 5 / Sonnet 5 / Fable 5 that is `high`, with `xhigh` as a per-session step-up rather than a global pin (per-model table in `claude_code_setup: opus_5_alignment.md`). Confirm before changing. Also offer the per-workload lever most setups never use: `effort:` in a skill's or subagent's frontmatter (`low`/`medium` for mechanical work). Note the cost — changing effort mid-conversation drops the prompt cache, so it suits something invoked at session start better than mid-flow.
- Anything found by check 14 that needs a history rewrite — name the exact strings and say plainly that it means one force-push.
- Deleting a specific stale shadow-memory file (name the exact path).
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
- **After every move or rename, repair the pointers** the way "One tree, and pointers that cannot
  rot" in the global `CLAUDE.md` says: `git grep` the file name across the whole project, rewrite
  every hit, and report hits in sibling projects instead of editing them.
- **Add the fleet-mode note** to findings-producing agents flagged in check 11 — one line in
  their report-format section.
- **Delete the self-verification prose** flagged in check 12; add a scale-to-the-project clause to
  the testing mandates from check 13, and split a conflated review into the two named ones.
- **Replace machine-specific values** (check 14) with a placeholder the project's own install or
  setup step expands locally — never break a path that has to be literal. Backup before any
  history rewrite, and verify afterwards on a fresh clone, not on the local copy.
- **Delete approved stale shadow memory** and add its path to `.gitignore`. Delete only files the user approved.
- Surface anything that contradicts how the user described it rather than silently "fixing" it.

After applying, do a final consistency pass and report what changed.

---

## Corrected mechanics (do not repeat these over-claims)

- **Subagents DO receive the full CLAUDE.md hierarchy** — `~/.claude/CLAUDE.md`, project rules,
  `CLAUDE.local.md`, managed policy files. Only the built-in `Explore` and `Plan` agents skip it,
  and that cannot be configured. This entry previously claimed the opposite; corrected 2026-07-30
  against `code.claude.com/docs/en/sub-agents`, "What loads at startup". It matters because it
  makes restating CLAUDE.md rules inside every agent definition pure duplication — flag that as a
  finding rather than recommending it.
  What genuinely does NOT reach a subagent: the **output style** (it runs its own system prompt),
  the main conversation's **auto memory**, and the conversation history. So tone rules and memory
  facts an agent needs must be in its own prompt; CLAUDE.md rules must not be.
  A `fork` is the exception — it inherits the parent's full system prompt, output style included.
- **`.claude/rules/*.md` with `paths:` frontmatter IS native Claude Code** — documented at
  `code.claude.com/docs/en/memory`, "Organize rules with `.claude/rules/`". This entry previously
  said the opposite ("a Cursor convention, do not recommend it"); that was wrong and was corrected
  2026-07-30 against the official page. It matters because path-scoped rules are the *actual*
  mechanism for shrinking an oversized instruction file: a rule with `paths:` loads only when
  Claude touches a matching file. Rules WITHOUT `paths:` load every session like CLAUDE.md itself.
  `~/.claude/rules/` is the user-level equivalent.
- **Splitting an oversized CLAUDE.md into `@path` imports does NOT reduce context.** Official:
  *"Splitting into `@path` imports helps organization but doesn't reduce context, since imported
  files load at launch."* Only three things actually shrink the loaded surface: deleting content
  that isn't needed every session, moving task-specific procedure into a **skill** (loads on
  invocation), or a **path-scoped rule** (loads on matching files). Recommend those, never imports.
- The official size target is **under 200 lines per CLAUDE.md file**; longer files "consume more
  context and reduce adherence". `/doctor` (Claude Code 2.1.206+) proposes trims for a checked-in
  CLAUDE.md — it cuts what Claude can derive from the codebase and keeps pitfalls and rationale.
- CLAUDE.md is delivered as a **user message after the system prompt**, not as part of it — which
  is why an output style (which does modify the system prompt) holds tone rules more reliably than
  CLAUDE.md ever did.
- `plansDirectory` LOCATES plans; it does not rename them. Plan mode's save-and-return option writes the plan to that directory WITHOUT executing it; rename the generated `*-ultraplan.md` to `PLAN_<topic>.md` afterward.
- Tune depth with `effortLevel`, not by adding or removing prose "be thorough" mandates.
- Tone/register is single-homed in the **Personal Voice output style** (`~/.claude/output-styles/personal-voice.md`, active via `outputStyle` in settings, with `keep-coding-instructions: true` so default coding behavior is preserved). CLAUDE.md keeps only a short pointer. When auditing a project, restated tone rules in CLAUDE.md/AI_INSTRUCTIONS are duplication — trim to the pointer. (Historical note: tone-in-CLAUDE.md was the old default before the keep-coding mechanism was verified.)
- Descriptions are often already fine — fix only real overlaps and dead references; do not wholesale-rewrite them.

---

## Notes

Reference the shared rules in the global `CLAUDE.md` and `settings.json` rather than restating them. They live in `claude_code_setup`, the canonical FORMAT source `/realign` compares a project against — located as described at the top of this skill.
