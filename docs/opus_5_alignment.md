# Opus 5 Alignment — what changed, and what to delete

Successor to `opus_4_8_alignment.md`, which stays as the origin story of the tiered format. That
document's ten principles mostly hold; this one records where Opus 5 moved the ground under them.

**The headline is counter-intuitive: Opus 5 needs FEWER instructions, not more.** It verifies its
own work, guards its own scope, and limits its own correction narration. Telling it to do those
things makes it do them twice. Anthropic says so in four separate places in
[Prompting Claude Opus 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5),
and the field evidence agreed before the guide was read: one sprint spent $18.57 across 17 runs to
produce a $1.11 deliverable, almost all of it on self-imposed verification.

## What Claude Code already ships — check before writing anything

Three of Anthropic's recommended prompt snippets are **already in Claude Code's default system
prompt**, in near-identical wording. Adding them to `CLAUDE.md` would be duplication, which on a
literal model raises a rule's apparent weight and is exactly the disease.

| Anthropic recommends | Status |
|---|---|
| Scope constraint — deliver what was asked, don't narrow/widen/transform | Shipped ("Delivering work") |
| Correction narration — only correct what changes the user's decisions | Shipped ("Corrections") |
| Avoid re-check instructions | Partly ("When you have enough information to act, act") |
| Conversational length | **Not shipped** → Personal Voice |
| Written-deliverable length | **Not shipped** → Personal Voice |
| Delegation policy | **Not shipped** → `CLAUDE.md` token-economy bullet |

**Two limits on that claim, and both matter:**

1. It holds for the **main session prompt only**. A subagent runs its own system prompt — "the
   agent's own prompt plus environment details, not the full Claude Code system prompt" — so the
   scope and correction text is absent there, and an agent that needs scope discipline needs it in
   its own definition. Note what a subagent *does* still get: the whole **CLAUDE.md hierarchy**
   (only the built-in `Explore` and `Plan` skip it). It does not get the **output style** or the
   main conversation's **auto memory**. So: never restate CLAUDE.md rules in an agent definition;
   do restate anything that lives in the output style or in memory.
2. **Any Claude Code release can rewrite that default prompt** and silently remove the coverage the
   deletions here depend on. Verified against Claude Code as shipped on **2026-07-30**. Re-check
   before assuming it still holds; `/realign` carries a check for this.

## Effort — the single source for which level to use

**There is no Claude-Code-specific effort recommendation for Opus 5.** Anthropic's own blog for this
question, *Choosing a Claude model and effort level in Claude Code*, predates Opus 5 and never
mentions it. The effort reference page names Claude Code once, for Sonnet 5 only. Two sources do
apply:

- Claude Code's [model configuration docs](https://code.claude.com/docs/en/model-config): *"The
  default effort is `high` on every model that supports effort, except Opus 4.7, which defaults to
  `xhigh`"*, and *"The default suits most coding tasks."* Also: *"Opus 5 has no such hold: a level
  you previously set carries over"* — unlike 4.8/4.7/Fable, Opus 5 does not re-assert its own
  default over a level you chose.
- Anthropic's [effort page](https://platform.claude.com/docs/en/build-with-claude/effort): start at
  `high`, step up to `xhigh` for demanding coding and agentic work, and *"use `low` and `medium`
  liberally as your primary control for token cost and response time."*

| Work | Level | How to set it |
|---|---|---|
| Everyday coding; agentic sessions; documentation and configuration projects | `high` | The default; `effortLevel` in settings |
| Demanding multi-file features, large refactors, long agentic runs | `xhigh` | Per session: `/effort xhigh` or `--effort xhigh` |
| Mechanical or bulk subagent work | `low` / `medium` | `effort:` in the skill or subagent frontmatter |
| Genuinely frontier problems | `max` | Session-only; prone to overthinking, test first |

**Effort does not control response length.** It controls how much the model *thinks*, not how much
it *says*. Lowering it to fix verbosity costs reasoning depth and fixes nothing — prompt for length
instead. This is the single most commonly made mistake on Opus 5, and it was made here.

Frontmatter `effort:` is the per-workload lever this setup underuses. Note the cost: changing effort
mid-conversation does not preserve cached prefixes, so it suits a skill invoked at session start
better than one invoked mid-flow.

## Where the ten 4.8 principles stand

Principles 1–8 and 10 hold unchanged. **Principle 9 flips**: it recommended `xhigh` as the everyday
default for Opus 4.8/4.7 coding. On Opus 5 the everyday default is `high`, and `xhigh` is a
deliberate step-up. The rest of principle 9 — tune depth at the settings layer, not with prose
"be thorough" mandates — is more true than before, not less.

## What Sprint 8 deleted, and why

- **`pre-clear-compact` step 3** — a "re-read the session and check nothing is missing" pass. Opus 5
  does this unprompted; the instruction bought a second full re-read for nothing.
- **`project-setup` Phase 7** — a seven-item consistency self-check run on work just completed. The
  one non-obvious property (the hierarchy is single-sourced and matches the filesystem) moved into
  the document's own definition, where it belongs.

Both are instances of the same rule: *if the instruction tells the model to check work it just did,
delete it.* An instruction that checks something **external** — files on disk, another agent's
findings, a live end-to-end run — is not self-verification and stays.

## The one deliberate deviation

Anthropic says *"do not use subagents to verify or double-check your own work."* The
**Complex builds — guard rails** block in `CLAUDE.md` keeps a mandatory post-build adversarial
review anyway. That is a user ruling (2026-07-30), taken with the cost evidence in hand: an
independent reviewer of a *build* is not the model checking itself, and it was worth its price when
a five-agent round shipped 26 seam defects behind green test suites. What did change is the tier —
the review runs on `opus`, never `fable` by default.

**Do not "fix" this in a later realignment.** It is a decision, not drift.

## The register problem

Distinct from token cost, and the reason this sprint happened at all: Opus 5 talks more, narrates
more, and reaches for internal labels and unexplained jargon. The user reads maybe half of what is
written and does not want to spend time decoding it.

The rules for this live in **one place only**: the Personal Voice output style. Not `CLAUDE.md`, not
a memory — both were tried and neither held. The output style modifies the system prompt, which is
the only channel with enough adherence to bind. It now carries: keep responses brief; match a
document's length to the task; name things in plain words instead of labels; don't assume a term is
known; and when asking for a decision, say what will happen, where, and how.
