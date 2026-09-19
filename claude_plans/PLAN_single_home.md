# PLAN — One home for every fact

Written 2026-09-19 from a read-only audit of this repo, two realign runs on other projects the
same day, and the four Anthropic prompting guides now stored in `docs/prompting_guides/`.
Reviewed the same day by an independent `opus` agent; its findings are folded in (see
"Plan review" at the end). Line numbers refer to the working tree of 2026-09-19 (last commit
`6434a01`).

## Goal

Every fact in the global Claude Code setup has one authoritative home, and every other place
points at that home instead of repeating it. The problem being solved is drift: the same fact
written in several files, one copy updated, the others quietly stale — and an assistant acting on
a stale copy. This applies to the setup itself and to every project the skills scaffold, realign
and close. Fewer tokens is a side effect, not the aim.

## Expected result

After the build, each of these can be checked by hand or with one command:

1. The subagent model-tier policy is written out only in `global_config/CLAUDE.md`. No file under
   `global_config/` assigns work to `haiku`. Skills carry a one-sentence pointer; the two workflow
   scripts keep their literal `model:` values, because code needs a value.
2. There is one template for a generated `AI_INSTRUCTIONS.md` — the one inside `project-setup`.
3. `/realign` finds two patterns it misses today — project facts copied into agent and skill
   files, and project rules that exist only in Claude's auto-memory — and prescribes one fixed
   repair for each, specific enough that two sessions do the same thing.
4. `/realign` presents findings the way the output style asks: one line per finding, then one
   finding per turn in plain words, no priority codes, and no question where only one fix is
   sensible.
5. One rule says what the project tree contains, how a pointer is written, and how pointers are
   repaired after a move. Its home is the global `CLAUDE.md`; skills point at it.
6. `claude-config-audit.md` is gone from the published repo and from its git history. No commit
   reachable from `main` contains the absolute home-directory path (the form with the username).
7. This repo lists its skills in two places instead of seven: the Skills table in
   `AI_INSTRUCTIONS.md` and one reader-facing table in `README.md`. `README.md` no longer states
   values of `settings.json`.
8. The project agent that reviews instruction changes judges against all current model guides,
   not only the Opus 5 guide, and no longer claims that `CLAUDE.md` does not reach a subagent.
9. The output style carries Anthropic's paragraph against figurative prose and a line asking for
   progress updates during long work.
10. This repo follows its own rules: `docs/` in category folders, no project rule in auto-memory.
11. `./install.sh diff` reports "in sync" after `./install.sh install`, which is part of the build.

Results 3 and 4 cannot be checked by a command; the next real `/realign` run is their test.

## Scope

**In scope:** `global_config/CLAUDE.md`, the output style, the skills `project-setup`,
`realign-project`, `feature-close`, `custom_plan`, `doc-sweep`, one prompt string in
`milestone-review.js`, this repo's `README.md`, `AI_INSTRUCTIONS.md`, `docs/`, the "Available
Resources" table in `concepts/concept.md`, both project agents, this project's two auto-memory
files, and the git history rewrite.

**Out of scope:** the skills `wireframe`, `contained-browser`, `pre-clear-compact`,
`post-clear-handover`; `install.sh` (used, not changed); the rest of `concepts/concept.md`;
Sprint 10 (telemetry) in `roadmap.md`; any file in another project.

**Deliberately left alone, and why:**
- `effortLevel: "xhigh"` with `model: "claude-fable-5-1[1m]"` in `global_config/settings.json`.
  Both guides and `docs/opus_5_alignment.md` recommend `high` as the default. The user keeps
  `xhigh` (decision 2026-09-19): Fable does only the hard thinking in the main session, the bulk
  goes to `opus` and `sonnet` agents. It gets recorded as deliberate so a later realign leaves it.
- A Stop hook that greps replies for forbidden Dutch words (suggested by Anthropic support).
  Rejected: it only catches words already on a list, the wrong reply is shown first, and the
  list needs hand upkeep. The support claim that lines prefixed `IMPORTANT:` are re-sent during a
  session is not in the Claude Code docs; the prompting guide advises the opposite (dial emphasis
  words back). Nothing is built for either.
- `AI_INSTRUCTIONS.md` files repeat a few global rules (English in files, plan flow, a short form
  of the tree rule). That file is tool-agnostic by design — another assistant never sees the
  global `CLAUDE.md` — so this is the one accepted duplication. Same for the `project-setup`
  template that generates it.
- The priority fields in the two workflow schemas stay (they order findings in code). What the
  main thread says to the user is already governed by the output style's rule on labels.
- `roadmap.md` and everything under `archive/` are dated records and keep the names and paths
  they were written with.
- Functional paths a skill needs — the self-hosted Penpot, the screenshot tool — and permission
  entries that were in git before today.
- `docs/prompting_guides/` holds dated snapshots. Anthropic's pages stay the authority; nothing
  cites a snapshot as the source of a rule.

## Where each fact lives after this plan

| Fact | Home | Everywhere else |
|---|---|---|
| Which model a subagent gets | `global_config/CLAUDE.md`, "Model tiers for subagents" | one pointer sentence; literal values only in workflow code |
| Generic project layout | `global_config/CLAUDE.md`, "Project organization" | `project-setup` points |
| One project's layout | that project's `AI_INSTRUCTIONS.md` | path pointers, never a second list |
| Tree content, pointer form, repair after a move, archive keeps old pointers | `global_config/CLAUDE.md`, "One tree, and pointers that cannot rot" | skills and the doc-keeper template point; the generated `AI_INSTRUCTIONS.md` carries a short form |
| Shape of a generated `AI_INSTRUCTIONS.md` | `project-setup` Phase 3.3 | the example file leaves the repo |
| How to talk to the user, including how findings are presented | `global_config/output-styles/personal-voice.md` | `realign-project` Phase 2 stops contradicting it |
| What a subagent inherits (the `CLAUDE.md` hierarchy, not the output style or auto-memory) | `realign-project`, "Corrected mechanics" | one sentence in `project-setup` Phase 5, where an agent is written; the agent definitions that need it |
| This repo's skills | `AI_INSTRUCTIONS.md`, Skills table | `README.md` keeps one "use it when" table; `concepts/concept.md` points |
| Values in `settings.json` | the file | `README.md` says what the file is for; `docs/model_alignment/opus_5_alignment.md` records the `xhigh` decision |
| Which prompting guides exist | the table on Anthropic's best-practices page | the agent reads it; `docs/prompting_guides/` holds dated snapshots |
| A project's rules | its `AI_INSTRUCTIONS.md` | auto-memory holds state, never rules |

## Approach and order

One `opus` build agent does the file edits in sections B to G; the main thread does section A
(it needs the user), the auto-memory change, and the install. One agent rather than several:
about fifteen files with small edits, and every split would add a seam.

Implementing this plan includes two commits — the pending work before the rewrite, and the build
— because the rewrite needs a clean tree. The user's "implement" covers them. The one push that
rewrites the published history is run by the user himself.

Order matters in two places. Section A runs **first**, on a clean tree, so every later commit
lands on the rewritten history. Pointers to this repo's docs are rewritten to the name-based form
(sections D and E) **before** the docs move (section G).

### A. Remove the config snapshot from the published repo and its history (main thread)
`claude-config-audit.md` is a 665-line verbatim snapshot of the live config. It is tracked and on
disk, was pushed with commit `06aa27d`, and nothing in the repo cites it. It is the only blob in
any commit that contains the absolute home path, and it names other projects. The repo is public.
There are no tags. `git-filter-repo` is not installed, so stock git is used and its leftovers are
cleaned up explicitly.
1. Commit the pending work (the four guides, the tree line, this plan).
2. Copy the snapshot to `archive/2026-08-21_claude-config-audit.md`. `archive/` is in
   `.gitignore`, so the copy stays local and is never published. Make a backup next to the repo:
   `git clone --mirror . ../claude_code_setup_backup.git`.
3. Rewrite: `FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --force --index-filter
   'git rm --cached --ignore-unmatch claude-config-audit.md' -- --all`.
4. Verify on the branch before anything is pushed: `git log main --oneline -S"$HOME"` prints
   nothing, and `git log main --name-only --format= | grep -c claude-config-audit` prints 0.
5. The user pushes: `git push --force-with-lease origin main`.
6. Clean the local copy: delete the `refs/original/` refs, `git fetch --prune`,
   `git reflog expire --expire=now --all`, `git gc --prune=now`. Then `git log --all --oneline
   -S"$HOME"` prints nothing, and a fresh clone has no such file in any commit.
Known limit, stated honestly: GitHub can keep the old commits reachable by direct URL until it
garbage-collects, and any existing clone or fork keeps them.

### B. `global_config/CLAUDE.md`
- "One tree, and pointers that cannot rot" (lines 121–125) becomes the single home for four things:
  - **What the tree contains:** every folder with one clause on its purpose; the core files by
    name (`AI_INSTRUCTIONS.md`, `README.md`, `roadmap.md`, `docs/lessons_learned.md`,
    `sessions/SESSION_CARRYOVER.md`, and what `claude_plans/` and `archive/` are for); and
    project-specific files that another document or an agent points at by name. Never status,
    counts, dates or versions, and not the rest of the application.
  - **Pointer form:** the path from the project root. Between files inside `docs/`, a Markdown
    link whose text is the root path and whose target is relative —
    `[docs/install/install.md](../install/install.md)` — so it stays clickable in GitHub and
    VS Code and one grep on the root path still finds it.
  - **After any move:** `git grep` the file name across the whole project and rewrite every hit;
    hits in other projects under the same parent folder are reported, and edited only on the
    user's word.
  - **Dated records, `archive/` and `claude_plans/` keep the pointers they were written with**
    (sentence moved here from the cross-project bullet, where it covered only half the cases).
- "Pointers across projects" (lines 126–136): one example line replaces two sentences of
  description, e.g. `<project>: lessons_learned.md (lesson 27, copied lists in agent files)`.
- "Compaction summary" (line 213): drop "keep it short", which can only push the summary the
  wrong way. Replace it, at the same length, with what to keep: what the user asked, decided,
  ruled out or corrected, in his own words; what was tried and set aside; names, numbers and
  paths exactly. Claude Code's own summary already keeps errors and fixes, pending tasks and
  current work. Whether a `CLAUDE.md` line steers that summary is not documented — the docs only
  document `/compact <instructions>` — so this is a cheap bet, not a guarantee.
- Three passages repeat what a skill's always-loaded description already says, in a file that is
  231 lines against Anthropic's 200-line target. Each shrinks to one line (about fifteen lines
  saved, approved by the user on condition that the behaviour stays). What each line must keep,
  because no skill description carries it:
  - *Wireframes* (lines 196–201): a local Penpot exists, offer it when a picture settles a screen
    faster than prose, the user's word ends the discussion, `/wireframe` has the detail.
  - *Continuing in a fresh session* (lines 216–220): `/pre-clear-compact`, commit the carryover,
    `/clear`, then `/post-clear-handover`.
  - *Planning workflow* (lines 185–194): never native plan mode for build-later planning, because
    approving there starts the build; `/custom_plan` instead. The rest — where plans live, that
    approval is review-only, "implement PLAN_<name>" — is already in the sprint cycle, steps 5–6.

### C. `global_config/output-styles/personal-voice.md`
- "Plain words": add the paragraph on mannered prose, verbatim from the Fable 5.1 guide
  ("Writing density"). The guide prefers a user message and allows the system prompt; this setup's
  own record is that tone rules hold only in the output style. If length becomes a problem, the
  guide's short form — "Please remove all mannered prose." — is the fallback.
- "Response calibration": add one line from the Fable 5.1 guide ("Ask for user-facing progress
  updates"): "Before you start, say in a line what you're about to do; brief updates while you
  work help the user follow along." The guide's closing-recap clause is left out, because "The
  reader has seen none of it" already owns that. The Opus 5 guide's counterpart is not used: it is
  written to tune narration down, and the Fable 5.1 guide says to remove such lines.
- Next to "one decision at a time": ask only what the user can judge. Where a finding has one
  sensible fix, state the fix and move on; keep questions for choices where his preference
  decides, phrased by what he will notice, not by the implementation. Evidence: three
  unanswerable questions in the session of 2026-09-19.

### D. `global_config/skills/realign-project/SKILL.md`
- Lines 8, 12, 47, 67, 131, 204 cite this repo by folder path. Rewrite to
  `claude_code_setup: <file name> (<what for>)`. The reference-repo paragraph (line 12) carries
  the path of this repo's `AI_INSTRUCTIONS.md` once, with the `__HOME__` placeholder that
  `install.sh` expands (mechanism verified: `install.sh:32-41`, already used by two skills), plus
  one clause: if the path does not resolve, find the repo by its name.
- Check 3: covers facts as well as rules — a copy of the tree, a list of models, sources or files,
  a procedure another file owns. Fixed repair: delete the copy and leave a pointer, never bring it
  up to date; first check each item against the owning file, and move anything that exists
  nowhere else.
- Check 7: also read the project's native auto-memory folder — the one the session's own system
  prompt names; it sits outside the repo under `~/.claude/projects/`. A memory that states how to
  work in the project moves to `AI_INSTRUCTIONS.md` and is deleted; a memory that repeats a
  tracked rule is deleted; state stays. A rule whose content is private keeps only the private
  detail in memory, with the rule itself in the tracked file. Add the folder to the Phase 1
  discovery list (line 26 globs only the in-repo shadow path).
- Check 9: replace the restated tiers with a pointer, keeping what to check (every agent has
  `model:`, the value matches the tier named for its job, the agents table records it, `fable` is
  flagged).
- Check 16: add a tree that carries status, counts or dates; a tree that lists every file; bare
  relative paths instead of the link form. A README may keep a short "start here" list of links;
  a list that tries to be complete is the finding. Define "sibling projects" as the other projects
  under the same parent folder; inbound hits go into the move proposal and are edited only on the
  user's word.
- Phase 2: drop the P1/P2/P3 list and the batch of `AskUserQuestion` items. New shape: one line
  per finding ordered by consequence, then one finding per turn — the lines pasted, what goes
  wrong, the recommendation, a yes-or-no question. Findings with one sensible fix are reported
  together without a question. The rule's home stays the output style.
- Phase 3: after a move, repair pointers as the global `CLAUDE.md` says.

### E. `global_config/skills/project-setup/SKILL.md`
- Line 33: name-based pointer. Line 424: remove the stale `haiku` assignment. Lines 327–333:
  pointer to "Model tiers for subagents".
- Phase 0.2 lists the sections of the global `CLAUDE.md` and is four sections behind; Phase 0.4
  lists the skills and is correct today but is one of seven hand-kept copies. Both are replaced by
  one step: locate the `claude_code_setup` repo (same pointer and fallback as section D), `git
  pull`, run `./install.sh diff`. If the repo is not on the machine — the new-PC case — say so and
  give the quick start from its `README.md`: clone, then install. The question this phase answers
  changes, and the skill says so: not "does the file look right" but "is the live config identical
  to the repo". Phase 0.1 key checks stay — values legitimately differ per machine.
- Phase 2 (lines 124–131): keep the category examples (proposing them is this skill's job), drop
  the restated rule sentences, point at "Project organization".
- Phase 3.3 template: the tree placeholder and the pointer sentence follow section B, in short form.
- Phase 5.3: an agent names no project facts; it says where to read them.
- Doc-keeper template, capability 5: checks follow section B.
- Phase 7: remove the "Available commands" list (three skills behind; Claude Code lists skills
  itself).

### F. `feature-close`, `custom_plan`, `doc-sweep`, `milestone-review.js`
- `feature-close` step 4: the trigger covers everything not needed to choose or do the next work —
  delivered detail, settled or dropped backlog items, status narrative. Parked items stay, one
  line each. Step 7: repair pointers per section B. Step 9 (line 88): tier pointer.
- `custom_plan` lines 86–88: the closing live end-to-end applies when the plan changes something
  that runs. A documents-only plan has none; its check is the doc audit in `/feature-close`.
  Lines 49 and 102: tier pointers.
- `doc-sweep` line 23: tier pointer, drop the `haiku` sentence.
- `milestone-review.js`, synthesis prompt only: headings and the returned headline are written in
  words ("essential now", "easy win", "later") instead of codes.

### G. This repo's own files
Moves and renames are driven by `git grep` on each file name across the whole repo — the repair
rule from section B — not by the lists below, which are what is known today.
- `README.md`: keep "The skills" table; remove the skill and workflow rows of the
  "What's in `global_config/`" table and the mapping diagram (lines 311–331). The `settings.json`
  row says what the file is for, not its values (wrong today: `model`, `effortLevel`, the
  `last30days` plugin, and `permissions.deny` called "an example"). Fix the contradiction on where
  the milestone review writes (line 376 is right, lines 378–379 are wrong). The closing documents
  table shrinks to a short "start here" list. Links to the three moved docs are repointed
  everywhere in this file, version history included (lines 80, 104, 220, 387, 401): a link is
  navigation, and a dead link on the public page helps nobody.
- `docs/example_ai_instructions.md` → `archive/<date>_example_ai_instructions.md`. Because
  `archive/` is ignored, this takes the file out of the published repo and keeps a local copy:
  move it with `mv` and stage the deletion; `git mv` into an ignored folder does not work.
- `docs/opus_4_8_alignment.md`, `docs/opus_5_alignment.md`, `docs/opus_5_communication_friction.md`
  → `docs/model_alignment/` with `git mv`, after sections D and E. File names do not change. Known
  references: `README.md` (above), `AI_INSTRUCTIONS.md` lines 41–43, 93, 119,
  `.claude/agents/opus5-prompt-expert.md` lines 27–28, `concepts/concept.md` line 113. The two
  files the installed skills cite are marked in the tree as cited from outside.
- `docs/model_alignment/opus_5_alignment.md`: record the `xhigh` decision and its reason in the
  effort section, plus one line kept from the deleted memory: the top model tier stays a one-key
  edit in `settings.json`, never hard-coded in several places.
- `concepts/concept.md`, "Available Resources" (lines 107–123): the per-skill and per-workflow rows
  become one row pointing at the Skills table in `AI_INSTRUCTIONS.md`.
- `.claude/agents/opus5-prompt-expert.md` → `prompt-expert.md`: general, no model in the name;
  reads the best-practices page and every guide in its "Model-specific guidance" table; judges a
  rule for all models that will read it and names conflicts between guides; points at "Model
  tiers for subagents" for who reads what; cites the live page, and treats a difference between a
  live guide and its snapshot in `docs/prompting_guides/` as a finding. Lines 45–47 corrected:
  a subagent does receive the `CLAUDE.md` hierarchy; it does not receive the output style or
  auto-memory. Stays on `fable`, stays undistributed.
- `.claude/agents/doc-keeper.md`: this repo's own copy lacks the structure checks the template
  has. Bring its check list in line with section B.
- `AI_INSTRUCTIONS.md`: tree rebuilt per section B (the `skills/` folder is one line; the Skills
  table below it is the list), agent renamed in the tree, the table and the exceptions paragraph,
  the Skills-table row and Plan-rules bullet that cite a moved doc, new `docs/` folders, and one
  new project rule: other projects of the user are referred to neutrally in this repo, never by
  name — not in docs, plans or commit messages. Functional paths a skill needs are excepted.
- Auto-memory of this project (main thread — the folder is outside the repo and outside
  `install.sh`; approving this plan approves these two changes): `no-cross-project-mentions` is
  reduced to the private detail only — which project the rule is mostly about — and points at the
  new rule in `AI_INSTRUCTIONS.md`. `fable-paid-opus-default` is deleted: it contradicts
  `settings.json`, which is the home of that fact. `MEMORY.md` follows.

### H. Install (part of the build)
`./install.sh diff`, check that the differences are the intended ones, `./install.sh install`
(it backs up what it overwrites), `./install.sh diff` again — "in sync". Skills, the output style
and the renamed agent load in the next session, so the user starts a new one afterwards.

## Shared state & seams

- **Names of this repo's docs** — written by section G, read by sections D and E and the agent.
  The seam is removed by design: the pointers are name-based and the names do not change.
- **The tree and pointer rule** — one writer (section B). Sections D, E and F point at it. Two
  places legitimately keep a short form: the generated `AI_INSTRUCTIONS.md` template and the
  checks that must name what they check. The builder lists every place the rule's wording
  survives in its report, so the review is by eye, not by a grep that cannot tell the two apart.
- **Repo and live config** — `install.sh` is the only writer of `~/.claude/`. Verified in sync on
  2026-09-19; re-run `./install.sh diff` before the build starts, and pull first if the live side
  changed.

## Failure & resume

Only section A is risky. Before the push, the old history is still in the repo: if step A.4
fails, `git reset --hard refs/original/refs/heads/main` restores it, and the mirror from A.2 is
the second line. After the push, restoring means pushing the mirror's `main` back with
`--force-with-lease`. The cleanup in A.6 runs only after A.4 passed and the push succeeded.
Every other step is a plain edit under git — resume from `git status` and the unchecked boxes.

## Decisions

No decision is open. The user approved the three cuts in section B on 2026-09-19, on the
condition that the behaviour stays.

**Calls made while planning — veto any of them:**
- The repair-after-a-move sentence lives in `CLAUDE.md`, because any session can move a file.
- `README.md` keeps a short "start here" link list, and its history links are repointed.
- One build agent instead of several.
- No `prompt-expert` pass on `fable` before install: the output-style additions are Anthropic's
  own text, and the `CLAUDE.md` changes were reviewed with the plan.
- The "refer to other projects neutrally" rule covers all other projects, with functional tool
  paths excepted; the private detail stays in auto-memory.
- `project-setup` keeps one sentence on what a subagent inherits, because it has to be in front
  of the model at the moment an agent is written.

## Steps

- [ ] A. Snapshot out of the published repo and its history (main thread; the user runs the push)
- [ ] B. `global_config/CLAUDE.md` — tree and pointer rule, cross-project example, compaction
      line, three passages cut to one line each
- [ ] C. Output style — three additions
- [ ] D. `realign-project` — pointers, checks 3, 7, 9, 16, Phase 2, Phase 3
- [ ] E. `project-setup` — pointers, Phase 0, Phase 2, template, Phase 5, Phase 7
- [ ] F. `feature-close`, `custom_plan`, `doc-sweep`, `milestone-review.js`
- [ ] G. This repo — `README.md`, the example out, the three docs moved, `concepts/concept.md`,
      both agents, `AI_INSTRUCTIONS.md`; auto-memory in the main thread
- [ ] H. Install, and "in sync" confirmed
- [ ] Builder reports deviations and watch items; they go into this file under "Deviations as built"

This plan changes instructions and documents, not code that runs, so by its own section F it has
no live end-to-end step. The doc audit belongs to `/feature-close`.

## Verification

- `git grep -n -i haiku global_config/` — only the policy in `CLAUDE.md` and the comment in
  `doc-sweep-fleet.js`.
- `git grep -n -E "P1|P2|P3" global_config/skills/` — nothing (this proves Phase 2 of
  `realign-project` only; the workflow schemas keep their codes on purpose).
- `git grep -n -E "docs/opus_(4_8|5)_" -- . ':!roadmap.md' ':!claude_plans'` — nothing.
- `git grep -n -E "opus5-prompt-expert|example_ai_instructions" -- . ':!roadmap.md' ':!README.md'
  ':!claude_plans'` — nothing; in `README.md` only inside the version history.
- Section A: the two checks in A.4 and A.6, and the fresh clone.
- `wc -l global_config/CLAUDE.md` — reported against the 200-line target.
- Every path in the rebuilt tree of `AI_INSTRUCTIONS.md` exists; every Markdown link in
  `README.md` resolves.
- `./install.sh diff` — "in sync" after install.
- Watch item, not part of the build: the next `/realign` run on a real project shows whether
  Phase 2 behaves the way the output style asks.

## Plan review (2026-09-19, independent `opus` agent)

The reviewer checked every line number and claim against the files; nearly all held. What it
changed in this plan:
- The progress-update text was the wrong one: the Opus 5 wording tunes narration down, and the
  Fable 5.1 guide says to remove such lines. Section C now uses the Fable 5.1 wording.
- Section A could not run as written: `git-filter-repo` is not installed, the rewrite tool's
  leftovers were not cleaned, and restore was one vague sentence. Rewritten with stock git.
- `archive/` is ignored by git, so "archiving" here takes a file out of the published repo.
  Stated where it matters, and used as the local home for the snapshot.
- References the move would have broken: `concepts/concept.md` line 113, `AI_INSTRUCTIONS.md`
  lines 93 and 119, the agent's lines 27–28, `README.md` lines 387 and 401, and the history links.
- A third full list of the skills in `concepts/concept.md`, and this repo's own `doc-keeper.md`
  lagging the template — both now in scope.
- The compaction rewrite grew a file that is already too long, and its effect is undocumented.
  Cut back to a same-length replacement.
- Replacing `project-setup` Phase 0 with `./install.sh diff` failed on a new PC without the repo.
  The step now locates the repo and has a fallback.
- The seam check by grep could not pass; replaced by a builder report item.
- The auto-memory change moved to the main thread, and the one reason worth keeping from the
  deleted memory is rehoused.
