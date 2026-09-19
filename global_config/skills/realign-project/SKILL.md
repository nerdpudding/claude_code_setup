---
name: realign-project
description: Put an existing project's Claude Code setup in order in one go — AI_INSTRUCTIONS.md, a stray CLAUDE.md, agents, skills, settings, auto-memory and the document structure are brought in line with the global CLAUDE.md. Finds duplication, drift, dead references, oversized files and over-ceremony, repairs them itself, asks only when it truly must, and reports in a few sentences. Counterpart to project-setup (new projects). Invoke with /realign-project.
---

# Realign Project

## How a run goes — read this part first

The user typed this command and expects the job finished when he looks again: he is not watching
and does not want to be consulted. `/realign-project` with nothing after it is the whole request:
find what is out of line, repair it, and say in a few sentences what changed.

**Almost nothing is a question.** Rules elsewhere that say to ask, offer, surface or let the user
decide are about planning and building. This command is maintenance with fixed repairs; none of
them applies during it. What a rule settles is never asked: other tools, tests, copies of global
rules, the length of a file, memory, pointers in a sibling project, which of two files wins.

**The rare real question.** Ask only when it truly cannot be otherwise: a step `git` cannot undo
that no rule prescribes, or a preference of his that no file records and whose options give a
visibly different project. Before asking, look in three places — what he typed after the command,
the global `CLAUDE.md`, this skill; if one of them settles it, it is not a question. A real
question comes right after the audit and BEFORE the first edit, never after: one item per message,
what it is, the options with what each means for him, the one you recommend and why. Then the run
continues.

**How a doubt is settled.** A doubt a file can settle is looked up. Otherwise: what he typed after
the command decides first; then the global `CLAUDE.md`; where neither speaks, the project's file
stays as it is. A doubt that was settled is not mentioned in the report.

**Nothing is lost and nothing is committed.** Edit in place. A tracked file that goes is moved to
`archive/` with a date prefix — `git mv` where `archive/` is tracked, plain `mv` where git ignores
it. A memory note is deleted only after what it says is confirmed in a tracked document (check 7).
Before the first edit run `git status --porcelain`: if the tree already holds changes, build on
them, do not redo them, and say so in one sentence of the report. A file git does not track is
left as it is. Git history is never rewritten. A sub-doc that a check tells you to create is asked
for by this command.

**Other tools are no factor.** The user works in Claude Code. What another tool loads is not
weighed: a rule the global `CLAUDE.md` carries does not stay in a project file "for other tools".

**What the format is.** The global `CLAUDE.md` this session has loaded, and this skill. Do not open
the `claude_code_setup` repo: it is where these files are maintained, not something to compare with.

**Repair, do not polish.** A realign repairs what breaks a rule of the global `CLAUDE.md` or of this
skill. A sentence that complies is left exactly as it is, even where it could be worded better;
a value, a number or a measured figure in a document is never rewritten.

**What stays per project.** A line goes when it could sit unchanged in any project: it is a copy of
a global rule, current or stale. A line stays when it names something that exists only here — a
path, a component, a command — says why this project differs, or carries `[user-specified]`.

**What a realign edits.** Instruction files, agent and skill files, documents, and a comment that
points at a document. Never code or configuration that runs, and never a file a setup step or a
person copies from — `.env.example`, a compose file, a script — apart from a `permissions` entry
in `.claude/settings.json`.

**Tests.** A realign runs no test and never suggests or builds one. Tests are for code; documents
are guarded by the pointer repair after a move and by the doc audit at a sprint close.

**While working:** one sentence before the first tool call, then no text until the report, unless a
failure stops the run.

### The closing report

ONE paragraph of three to five plain sentences — no headings, no lists, no account per file: what
was cleaned up, in ordinary words; how many files changed; that nothing is committed and `git diff`
shows every edit; any file in a sibling project that was repaired, uncommitted there. A large run
is not a reason for a longer report: name the two or three biggest changes by kind and let the
file count cover the rest. For this command this shape replaces the longer closing-report example
in the output style, and the rule there to name every file. Example:

> Realigned. The copies of global rules came out of `AI_INSTRUCTIONS.md`, two agents now read that
> file first, and three memory notes moved to the files that own them. Seven files changed and
> nothing is committed; `git diff` shows every edit. One pointer in the sibling project <name> was
> repaired and is uncommitted there.

**Report a failure, never a doubt.** A failure is something that happened: a command ended with an
error; a file could not be read or parsed; a repair this skill prescribes was not made; text typed
after the command was not carried out; a credential sits in a tracked file or in git history. Each
gets one sentence — what, where, and the state it leaves — on top of the five. The test: can you
point to an error message, a path, or a prescribed repair with no edit behind it? If not, it stays
out: a choice you made, something you weighed, something that was fine, something that could be
done next.

Before sending the report, count its sentences and cut it back to five plus one per failure. Then
read it for any sentence that puts a question, holds out an extra, gives advice for later, or
leaves something for him. For each: look it up or decide it, do it, delete the sentence.

---

## The audit (read-only)

Discover before reading; do not assume a fixed file list.

- Glob for: `CLAUDE.md`, `**/CLAUDE.md`, `CLAUDE.local.md`, `AI_INSTRUCTIONS.md`,
  `.claude/settings.json`, `.claude/settings.local.json`, `.claude/agents/*.md`,
  `.claude/skills/**/SKILL.md`, `**/MEMORY.md`, `claude_plans/*.md`,
  `.claude/projects/**/memory/*.md`.
- List the project's auto-memory folder — the one this session's system prompt names, under
  `~/.claude/projects/`. It is outside the repo, so a Glob relative to the project never reaches it.
- Read every instruction and configuration file found IN FULL; skimming misses drift.

For a very large setup the read-only audit may go to one subagent, pinned to the tier "Model tiers
for subagents" in the global `CLAUDE.md` names for research. The edits stay in this session.

Not out of line, so leave alone: `Explore` and similar are built-in, not missing project agents; an
untracked `settings.local.json` is intentional; a partially-done plan stays in `claude_plans/`;
`effortLevel: "xhigh"` is this setup's deliberate pin.

---

## The checks — what is out of line, and the repair

1. **An always-read file over 200 lines** — `AI_INSTRUCTIONS.md`, or a large file an agent reads on
   every spawn. Cut the tree to what "One tree, and pointers that cannot rot" in the global
   `CLAUDE.md` asks for, move DETAIL to a sub-doc that `AI_INSTRUCTIONS.md` names, move a procedure
   into a project skill. The rules stay in `AI_INSTRUCTIONS.md`. `@path` imports do not help:
   imported files load at launch.
2. **Flat emphasis** — ALWAYS / NEVER / MUST on preferences and invariants alike. Sort into Hard
   rules and Preferences and take the emphasis off the preferences.
3. **Copies.** A rule or a fact written in more than one file — an agent, a skill, a README, a
   memory. A copy is a version, a path, a list, a tree or a procedure that another file owns. Check
   each item against the owner, move what exists nowhere else into the owner, and put a pointer in
   place of the copy; never bring a copy up to date. Not a copy: a summary for human readers that
   names its source; a status line that states a result. A copy of a GLOBAL rule in a project file
   goes entirely (see "What stays per project").
4. **Prose that a setting enforces** — commit attribution, a ban on reading a file, any
   "always/never" rule that `settings.json`, `.gitignore` or agent frontmatter already holds. Make
   sure the setting exists (`includeCoAuthoredBy: false`, `permissions.deny`), then remove the prose.
5. **A mandatory-sounding workflow with no scale-to-size clause** — "ALWAYS run X", "do NOT skip".
   Add the clause, the way "Scale depth to task size" in the global `CLAUDE.md` puts it.
6. **Agent descriptions** that overlap, are vague, or name an agent that has no file. Repair those;
   a description that works is left as it is.
7. **Memory.** Auto-memory is an inbox, not a home; a realign empties it. For every note, first
   check whether what it says is in the project's documents — `AI_INSTRUCTIONS.md`, `README.md`,
   `roadmap.md`, `docs/lessons_learned.md`, the sub-docs. Where it is missing, write it into the
   document that owns it: a rule or a fact about the project into `AI_INSTRUCTIONS.md`, the state
   of the work into `roadmap.md` or wherever the project keeps its status, something learned into
   `docs/lessons_learned.md`. What the global `CLAUDE.md` or the output style already says needs no
   move. Only then delete the note and its line in `MEMORY.md`. One kind stays: a preference of
   the user that the global files do not carry, because a realign does not edit those files. A
   memory folder committed inside the repo is handled the same way and then moved to `archive/`.
8. **Documents that contradict themselves** — two layouts, two names for the daily tracker, a plan
   in the wrong folder. Resolve toward what the global `CLAUDE.md` says.
9. **Model tiers.** Every project agent has a `model:` key, its value matches the tier "Model tiers
   for subagents" names for the agent's job, and the agents table in `AI_INSTRUCTIONS.md` records
   it. An agent on `fable` is re-pinned to `opus` unless `AI_INSTRUCTIONS.md` records that pin as
   deliberate.
10. **Tone rules restated in a project file** go: the output style owns them. What a subagent needs
    from them stays in that agent's own file, because no output style reaches a subagent.
11. **A findings-producing agent without a fleet-mode note** gets one line: inside a Workflow fleet
    with a structured-output schema it returns only the structured findings list.
12. **Prose that tells the model to re-check work it just did** — "re-read before responding", "use
    a subagent to verify". Remove it. Checking something external — files on disk, another agent's
    findings, a live run — is not that, and stays.
13. **Testing and review.** A mandate for exhaustive suites or long runs gets a scale-to-the-project
    clause. A project that describes one review gets the two the global `CLAUDE.md` describes: the
    plan before building, the build at milestones.
14. **Machine-specific values in a repo with a public remote** (github.com, gitlab.com — look it
    up with `git remote -v`; a private or home server is not this). A username, a home path, a
    hostname or an internal IP in a document or an instruction file becomes a placeholder the
    project's setup step expands; never break a path that has to be literal, since permission
    rules match command text.
15. **Delegation prose** that hands out work finishable in a handful of tool calls, spawns several
    agents where one does, or uses a subagent to verify the session's own work. Bring it in line
    with "When to delegate at all" in the global `CLAUDE.md`.
16. **Document structure**, against "Project organization" and "One tree, and pointers that cannot
    rot" in the global `CLAUDE.md`:
    - files loose in the root of `docs/` other than `lessons_learned.md` go into category folders;
    - a second list of what lives where — in a README, in a "Sub-docs" section — becomes a pointer
      to the tree; a README may keep a short "start here" list;
    - a tree that carries status, counts, dates or versions, or lists every file, is cut to the
      folders, the core files and the files another document or an agent points at by name;
    - a bare relative path (`install.md`, `../roadmap.md`) becomes the path from the project root —
      inside `docs/`, a Markdown link whose text is that root path;
    - a requirements or concept document still marked "draft" after the roadmap was built on it is
      marked approved and frozen;
    - documents nobody reads to do the next work — dated reports, plan-review documents, agent brief
      and report files — move to `archive/`; a milestone review's dated document stays;
    - a pointer into another project that carries a folder path or a line number is rewritten the
      way "Pointers across projects" asks.
    - a test that checks documentation — document paths, pointers — moves out of the test suite to
      `archive/`, its entry leaves the script that runs the tests (the one edit to a script a
      realign makes), and the documents that describe it are corrected.
    A move is `git mv`, followed by the pointer repair that section describes. A pointer in a
    sibling project — another project under the same parent folder — is repaired too when the new
    target is known.
17. **Project rules outside `AI_INSTRUCTIONS.md`** — a project-level `CLAUDE.md` or
    `CLAUDE.local.md`, in the root or in `.claude/`, that holds rules; or an `AI_INSTRUCTIONS.md`
    that says its rules live elsewhere. Line by line: a rule `AI_INSTRUCTIONS.md` already has is
    dropped; a rule it lacks moves into it, Hard rules first; text that is no rule — a description
    of the code, a copy of the tree — is dropped once its owner is checked; where the two
    contradict, `AI_INSTRUCTIONS.md` wins. Make every project agent's startup procedure read
    `AI_INSTRUCTIONS.md` first, then move the file to `archive/`. Not this: a `CLAUDE.md` inside a
    cloned third-party repository, or one shipped as the configuration of another tool instance.

Apply in an order that never breaks a pointer: rules go into `AI_INSTRUCTIONS.md` before the file
they came from is archived; a sub-doc exists before an agent is pointed at it; a setting is in
place before the prose it replaces goes.

---

## Facts a realign relies on

- A subagent loads the global `CLAUDE.md` by itself; only the built-in `Explore` and `Plan` skip it.
  So an agent file never restates it. A subagent does NOT load `AI_INSTRUCTIONS.md`, the output
  style, auto-memory or the conversation: what it needs from those is in its own file, and its
  startup procedure names `AI_INSTRUCTIONS.md` first. A `fork` inherits everything.
- `CLAUDE.md` arrives as a user message after the system prompt; the output style is part of the
  system prompt. That is why tone lives in the output style and nowhere else.
- `plansDirectory` says where plans are saved; it does not rename them.
- Depth is tuned with `effortLevel`, not with "be thorough" prose.
