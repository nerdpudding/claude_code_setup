# PLAN — A realign finishes the job and asks nothing

Written 2026-09-19. The user granted full autonomy for this occasion: plan, review by a `fable`
agent, revise, implement, realign the named projects, commit and push each, close.

## Goal

This repo is the template every project comes from. When it is right, it is left alone until a
new model arrives. The way of working is uniform across projects, and each project keeps its own
content.

Concretely: `/realign-project`, typed with no further text in any living project, finds what is
wrong, fixes it, and says in a few sentences what changed — no questions back, no open points, no
offers. `/project-setup` produces a project that a realign would leave untouched.

## Why it does not work today

Every question the user got on 2026-09-19 traces to a sentence that told the session to ask,
propose or hold back. Current models follow such sentences literally. The sentences:

| Where | Sentence | What it produced |
|---|---|---|
| `realign-project` check 16 | "Where the project has a test suite and no test for document paths, propose one." | An offer to build a test in a project whose only tests belong to a parked benchmark |
| `realign-project` check 16, global `CLAUDE.md` "One tree…" | sibling pointers are "edited only on the user's word" | Two broken pointers with a known target left open for the user |
| `realign-project` check 17 | a contradicting rule "is the one thing to ask about" | A question |
| `realign-project` Phase 2 | four kinds of cases to ask about, one per turn | Questions after the work, a decision on a 234-line file that check 17 already settles |
| `realign-project` Phase 3 | "confirm with the user if ambiguous", "Surface anything that contradicts…", "Delete only files the user approved" | Doubts at the end of the report |
| global `CLAUDE.md` "Where a rule belongs" | "tool-agnostic" | Three global hard rules kept in a project file "because another tool might read it" |
| global `CLAUDE.md` Preferences | "Ask when project conventions are unclear rather than guessing." | The general habit of asking what the files could answer |
| `project-setup` template | Hard rules and Preferences that restate global rules | New projects born with the copies a realign removes |
| nowhere | what a closing report holds | Reports of forty to fifty lines, lists of what was fine |
| nowhere | what happens to a memory that is about the user, not about the project | The same project handled differently twice on one day |

## Expected result

1. In `realign-project`, a grep for the wording that invites a question, a proposal or an offer
   finds nothing. There is no exception: a realign never rewrites git history.
2. A run in each of the six named projects ends with a report of at most five sentences — plus
   one per thing that actually failed — and nothing for the user to answer. A second run on a
   project that was just realigned changes nothing. This is tested for real: the six projects are realigned as part
   of this plan.
3. The template in `project-setup` holds no copy of a global rule, so a fresh project passes a
   realign unchanged.
4. The skill is shorter than it is now (241 lines), not longer, and names no model.
5. `./install.sh diff` reports "in sync"; this repo and all six projects are committed and pushed.

## Scope

**In:** `global_config/skills/realign-project/SKILL.md` (rewritten, shorter), three sentences in
`global_config/CLAUDE.md`, two in the output style, the `AI_INSTRUCTIONS.md` template in
`project-setup`, this repo's own `AI_INSTRUCTIONS.md` (it restates global rules too), one clause in
`README.md`. Then a realign of the six living projects the user named, each committed and pushed.

**Out:** `feature-close`, `custom_plan`, `doc-sweep`, the workflows — nobody complained about
them. No new check, no new file kind, no partial-run mode (see "Calls made").

## Approach

### A. One rule replaces the asking — `realign-project`
The skill is restructured around how a run goes: audit, the one possible question, apply, report.

- **A realign asks nothing**, except before rewriting git history, and then before the first edit.
  Nothing is committed, so `git` undoes any edit; that is the safety net, not a question.
- **A doubt a fact can settle is looked up.** A doubt no fact settles is decided: follow the
  global `CLAUDE.md`, then the text of the invocation, apply, move on.
- Settled by the skill itself, never asked: a rule that contradicts `AI_INSTRUCTIONS.md`
  (`AI_INSTRUCTIONS.md` wins); a file over 200 lines (apply the repair check 17 describes);
  document moves (`git mv` plus pointer repair); tracker naming and scope-gating (what the global
  `CLAUDE.md` says); `effortLevel: xhigh` (not a finding).
- **Other tools are no factor.** A rule the global `CLAUDE.md` carries is removed from
  `AI_INSTRUCTIONS.md`. Whether another tool loads the global file is not weighed.
- **Sibling pointers:** fixed on the spot when the new target is known, and mentioned in the
  report as uncommitted there.
- **Tests:** an existing document-path test is run after the edits. A realign never proposes,
  offers or builds a test.
- **Memory (check 7), sorted the same way every time:** a project rule moves to
  `AI_INSTRUCTIONS.md`; a copy of a tracked rule goes; state stays; **a memory about the user — a
  preference that holds in any project — stays**, because a realign does not edit the global
  files. Before anything is removed, the memory folder is copied to `memory_backup_<date>` beside
  it, outside any repo: the folder is not under git, and `archive/` is tracked in most projects.
- **Copies (check 3), with a stop criterion:** a finding is a version, a path, a list or a
  procedure another file owns. Not a finding: a summary for human readers that names its source,
  a status line that states a result.
- **Check 10** shrinks to two lines: tone rules restated in a project file go, the output style
  owns them. The eleven sub-bullets leave the skill.
- **Defaults inside the skill**, so no paragraph has to be typed: build on uncommitted changes, do
  not open the `claude_code_setup` repo, run no test but the document-path test.
- **Closing report:** three to five plain sentences — what was cleaned up in ordinary words, how
  many files changed, that nothing is committed, and sibling files touched. No list of what was
  fine, no doubt, no offer, no recommendation. The detail is in `git diff`.
- "Corrected mechanics" is cut to the facts a realign needs; model names go.

### B. Global `CLAUDE.md` — three sentences, no growth
- "One tree…": the test sentence covers an existing test only; sibling pointers with a known
  target are fixed, not left for the user.
- "Where a rule belongs": tool-agnostic describes how `AI_INSTRUCTIONS.md` is worded; it is no
  reason to repeat a global rule in it.
- "Ask when project conventions are unclear" becomes "Look it up before asking" — a doubt the
  files can settle is settled from the files.

### C. Output style — two sentences
A closing report does not end on a doubt, an open point or an offer. What is truly the user's to
decide is asked before the work starts.

### D. `project-setup` template and this repo's own file
The generated `AI_INSTRUCTIONS.md` keeps its uniform skeleton — read first, overview, hard rules,
preferences, workflow, tree, agents — and each section holds project content only. The restated
English rule, the list of global preferences and the restated plan rules go; one line points at
the global `CLAUDE.md`. This repo's `AI_INSTRUCTIONS.md` gets the same cleanup.

### E. Realign the six projects (after install)
One `opus` agent per project, in parallel: the projects are independent. Each agent follows the
installed skill as if the user had typed `/realign-project` with no text. Two overrides for this
orchestrated run only: the agent is given the path of that project's memory folder (its own
system prompt names another one), and it does not edit sibling projects — it reports those fixes.
Each agent returns the closing report the user would have seen, plus a list for the orchestrator:
files changed, sibling fixes, and anything it wanted to ask.

The main thread then answers anything asked by the rule in A, applies sibling fixes, checks
`git status` and the diff per project, commits and pushes. A question that comes back means the
skill still has a hole: fix the skill, reinstall, re-run that project.

## Shared state & seams

- **The installed skill** — one writer (the main thread, through `install.sh`). It is installed
  before the agents start and not touched while they run.
- **Files in a sibling project** — one writer, the main thread, after all agents have finished.
  Two agents never edit the same project.
- **A project's working tree** — one writer, that project's agent; the main thread commits only
  after the agent is done.

## Failure & resume

All state is in each project's working tree and nothing is committed until the main thread has
looked at the diff. An agent that fails or returns a question is continued or re-run for that
project alone. A push that fails (one remote is a home server) is reported and does not block the
other projects. Memory folders are backed up before anything in them is removed.

## Calls made

- **No partial-run mode.** The user asked for a way to re-run only what changed in the skill. A
  check that finds nothing costs little, and a mode that tracks what ran when is the kind of
  complexity this plan removes. A re-run is `/realign-project`, nothing more.
- **Five sentences, not fifteen lines.** Two complaints named different lengths; the shorter wins.
- **Cross-project preferences stay in memory.** Moving them to the global files is a separate
  decision about those files and stays in the backlog.

## Steps

- [x] Review by a `fable` agent; findings folded into this file
- [ ] A–D: the skill, the global `CLAUDE.md`, the output style, `project-setup`, this repo's files
- [ ] Install, confirm in sync
- [ ] E: six realign agents; answer, fix siblings, verify, commit and push each project
- [ ] Fix the skill and re-run where a run still asked something
- [ ] `/feature-close` for this repo, commit, push

## Verification

- `grep -n -i -E "\bask|propose|offer|confirm" global_config/skills/realign-project/SKILL.md` —
  only the history-rewrite case.
- `wc -l` on the skill — below 241. `wc -l global_config/CLAUDE.md` — reported; it gains a few
  lines for the preferences moved out of project memories (see "Plan review").
- The six closing reports: at most five sentences, no question, no offer.
- `./install.sh diff` — "in sync". `git status -sb` in all seven repos — clean and not ahead.

## Plan review (2026-09-19, `prompt-expert` on `fable`, 191,612 tokens)

The reviewer read the four prompting guides and the live Claude Code docs. What it changed:

- **A ban on questions is not enough.** Offers, hedges and "left for you" survive it. The skill
  now opens with the reason — the user typed the command and walked away, he cannot answer — and a
  check of the report before it is sent. (Fable 5.1 guide, "Finish the whole task".)
- **No exception for a history rewrite.** It would fire on every run in any project with a home
  path in its history, and a "no" is stored nowhere. A realign never rewrites history; a
  credential in a tracked file or in history is reported as a failure.
- **Failures are reported, doubts are not,** with a test a model can apply: a failure has an error
  message, a path, or a prescribed repair with no edit behind it. Failures do not count toward the
  five sentences.
- **The output style works against a short report**: its own closing-report example is fifteen
  lines, and "Offer extras in one line" licenses an offer. The skill says its report shape replaces
  that example for this command and carries its own example; the output-style sentence is reworded.
- **Order of decision:** what was typed after the command, then the global `CLAUDE.md`; where
  neither speaks, the project's file stays as it is.
- **Flexibility per project needs a test**, or a silent realign flattens deliberate deviations: a
  line goes when it could sit unchanged in any project; it stays when it names something that
  exists only here, says why it differs, or carries `[user-specified]`.
- **The hard rule "don't delete or overwrite … without surfacing it"** is met by construction: a
  realign deletes nothing — tracked files go to `archive/`, memory entries to a backup folder —
  and a dirty working tree is noted in one sentence.
- **Memory is sorted on its `type` field**, which every memory file carries.
- **The run rules come first in the skill**, the checks after: after a compaction Claude Code
  re-attaches only the first part of a skill.
- **More sentences to remove** than the table listed: severity words in check 14, "confirm Claude
  Code still ships…" in check 12, the audit verbs ("flag", "recommend") throughout, "ask before
  editing" and "When uncertain, ask" in the doc-keeper template, and the word "tool-agnostic" in
  the global `CLAUDE.md`, which is deleted rather than explained. The command is
  `/realign-project`, not `/realign`, in every file that names it.
- **Step E runs real sessions, not subagents**: `claude -p "/realign-project"` from inside each
  project, on `opus`. A subagent gets no output style, the wrong memory folder and no project
  settings, so it cannot test what the user experiences. One project is run a second time after
  its commit; an empty `git status` is the proof that a realign settles.

Changed after a question from the user, not from the review: **preferences about the user that sit
in one project's memory move to the global files now**, as part of this plan — never say "calm
down", no time estimates, never block the chat, announce a background helper, results he may open
go into the project, a how-to question gets an answer and not an action. With those in the global
`CLAUDE.md` and the output style, a realign treats a memory that repeats them like any other copy:
it goes. Memory keeps state only.

## Decisions taken with the user (2026-09-19, after the review)

The user stopped the build to talk these through. Each overrides what stands above it.

1. **Memory has no function of its own.** Rules and facts about a project belong in
   `AI_INSTRUCTIONS.md`, the state of the work in `roadmap.md`, `README.md` and the carryover, his
   own preferences in the global `CLAUDE.md` and the output style. Why: those files already cover
   everything, and a note that sits only in memory is invisible to other projects and to subagents.
   So a realign empties the memory folder. One kind stays: a preference of his that the global
   files do not carry yet, because a realign may not edit those files and deleting it would make
   him say it again.
2. **No backup of memory; check the documents first.** Why: a backup guards against loss, and the
   better guard is the order of work — first confirm that what a note says is in the project's
   documents, add it where it is missing, only then delete the note. By then the content is in a
   file under git.
3. **The document-path test goes, everywhere.** Why: to the user a test is technical — unit tests,
   the suite. A check on documentation dressed as a test made sessions talk about tests and run
   suites for documentation work. It caught nothing that the `git grep` after a move and the
   doc-keeper audit at the close do not catch, and that audit runs anyway. A realign runs no test.
   The one existing copy, in one project, is archived at that project's realign.
4. **A realign asks only when it truly must** — a step git cannot undo that no rule prescribes, or
   a preference of his that no file records and whose options give a visibly different project.
   Then: before the first edit, one item per message, the options with what each means for him,
   the recommendation and its reason. Why: he wants to decide what is really his, easily and one
   at a time, and nothing else. What a rule already settles — other tools, tests, copies of global
   rules, file length, memory, sibling pointers — is never asked.
5. **Every project is laid out the same way, so a session knows where to look**: global
   `CLAUDE.md` for all projects, the output style for tone, `AI_INSTRUCTIONS.md` for the project's
   rules and its tree, `roadmap.md` for the state of the work, `docs/lessons_learned.md` for what
   was learned, nothing in memory.
