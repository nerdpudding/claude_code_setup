export const meta = {
  name: 'milestone-review',
  description: 'Whole-codebase review at milestones: per-dimension finders, adversarial refuters, one synthesis into the plan file',
  phases: [
    { title: 'Find', detail: 'one opus finder per review dimension, sweeping the whole tree' },
    { title: 'Refute', detail: 'two opus skeptics per dimension try to kill each finding' },
    { title: 'Synthesize', detail: 'one synthesis writes the prioritized findings into the plan file' },
  ],
}
// Saved workflow for the periodic WHOLE-codebase review at milestones (every ~3-4 sprints).
// This is the sprint-scoped review made horizontal; the fix/probe/close phases that follow
// it do not change — the normal fix wave takes over from the plan file.
//
// Invocation (this header is the invocation-point documentation — there is deliberately
// no skill; milestone reviews are invoked by hand, rarely):
//   1. Create/choose the sprint plan file the findings should land in.
//   2. Invoke in a turn that states a token target ("+500k" — hard ceiling here):
//      Workflow({ name: 'milestone-review', args: { planFile: 'claude_plans/PLAN_<name>.md',
//                 guardrails: '<the project's privacy/content rules>' } })
//
// Caps (advisory 2026-07-19, Q4): ~12-18 agents = 5 opus dimension-finders + 2 opus
// refuters per dimension (batched per dimension — NOT per finding; that is what keeps the
// fleet inside the cap) + 1 synthesis. Keep the /config workflow size guideline at
// "medium". No ultracode.
//
// Synthesis model: **opus by default** (user decision 2026-07-19 — Fable is separately
// billed; the default hierarchy tops out at Opus 4.8). Override per run with
// args.synthesisModel: 'fable' for the hardest rounds — explicit opt-in only.
//
// Read-only fleet EXCEPT the single sanctioned write: the synthesis stage writes the
// findings section into args.planFile ("findings land in files, not in chat"). A failed
// run is re-run or resumed via resumeFromRunId.
//
// Version-sensitive: the `budget` hard ceiling (and `agentType`, if you add roster agents
// to a dimension) are installation-verified (2026-07-19) but absent from the public docs —
// re-check after harness updates or on other machines.
//
// args = {
//   planFile: string,            // required — the plan file the findings section goes into
//   dimensions?: [{key, brief}], // defaults to the five standing review dimensions below
//   guardrails?: string,         // project rules appended to every agent prompt (privacy etc.)
//   synthesisModel?: string,     // default 'opus'; 'fable' as explicit opt-in
// }

const DEFAULT_DIMENSIONS = [
  {
    key: 'seams-state-claims',
    brief:
      'shared state, files, and flags that cross package boundaries: does each have ONE owning writer and ONE shared read-predicate; is gating state set only after verified success; hunt silent-wrong-result seams ("ran but produced nothing" reading as done)',
  },
  {
    key: 'correctness',
    brief:
      'correctness bugs: wrong behavior, broken edge cases, missing persistence, untested failure paths, error handling that swallows or misreports failures',
  },
  {
    key: 'privacy-content-discipline',
    brief:
      'privacy and content-discipline leaks: raw user data read or echoed where only structure/aggregates are allowed, secrets or protected paths touched, content escaping into logs, docs, or reports',
  },
  {
    key: 'docs-vs-code',
    brief:
      'documentation drift: README/knowledge-card/roadmap claims that no longer match the code, capabilities implied but absent, broken references, duplicated facts that contradict each other',
  },
  {
    key: 'goal-agnosticism',
    brief:
      'hard-coded assumptions that break generality: literal paths, model names, or project-specific constants where configuration is intended; behavior that only works for one project or dataset',
  },
]

const FINDER_SCHEMA = {
  type: 'object',
  required: ['findings', 'watch_items'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['title', 'category', 'priority', 'locator', 'failure_scenario', 'fix_direction'],
        properties: {
          title: { type: 'string' },
          category: { type: 'string', enum: ['bug', 'smell', 'missing', 'research-gap'] },
          priority: { type: 'string', enum: ['P0', 'P1', 'P2'] },
          locator: { type: 'string', description: 'file:line (or file:section)' },
          failure_scenario: { type: 'string', description: 'concrete inputs/state -> wrong outcome' },
          fix_direction: { type: 'string', description: 'one-line direction, not the fix itself' },
          confidence: { type: 'string', enum: ['CONFIRMED', 'PLAUSIBLE'] },
        },
      },
    },
    watch_items: { type: 'array', items: { type: 'string' } },
  },
}

const VOTES_SCHEMA = {
  type: 'object',
  required: ['votes'],
  properties: {
    votes: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'refuted', 'reason'],
        properties: {
          id: { type: 'string' },
          refuted: { type: 'boolean' },
          reason: { type: 'string' },
        },
      },
    },
  },
}

const SUMMARY_SCHEMA = {
  type: 'object',
  required: ['written_to', 'counts', 'headline'],
  properties: {
    written_to: { type: 'string' },
    counts: {
      type: 'object',
      required: ['P0', 'P1', 'P2'],
      properties: {
        P0: { type: 'number' },
        P1: { type: 'number' },
        P2: { type: 'number' },
      },
    },
    disputed: { type: 'number' },
    headline: { type: 'string', description: 'one-paragraph reviewer synthesis' },
  },
}

if (!args || typeof args.planFile !== 'string' || !args.planFile) {
  throw new Error(
    "milestone-review: args.planFile is required — the plan file the findings section is written into (e.g. 'claude_plans/PLAN_milestone_review.md')",
  )
}
const dims = Array.isArray(args.dimensions) && args.dimensions.length ? args.dimensions : DEFAULT_DIMENSIONS
if (dims.some((d) => !d.key || !d.brief)) {
  throw new Error('milestone-review: every dimension needs a key and a brief')
}
if (!budget.total) {
  log('milestone-review: no token target set for this turn — recommended invocation states "+500k" (hard ceiling); proceeding uncapped')
}

const guardrails = args.guardrails
  ? `\nProject guard rails (apply strictly): ${args.guardrails}`
  : ''

const results = await pipeline(
  dims,
  (d) =>
    agent(
      `You are the "${d.key}" dimension finder in a milestone whole-codebase review. Sweep the ENTIRE repository for your one concern: ${d.brief}.\n` +
        'VERIFY, do not trust: grep, read the real code and configs, trace the failure before claiming it. Mark each finding CONFIRMED (you traced it) or PLAUSIBLE (needs a live check). ' +
        'For every finding: a short title, category (bug/smell/missing/research-gap), priority (P0 essential now / P1 easy win / P2 later), a file:line locator, the concrete failure scenario, and a one-line fix direction. ' +
        'Also return watch_items: anything outside your dimension that looked wrong. Do NOT edit or fix anything.' +
        guardrails,
      { label: `find:${d.key}`, phase: 'Find', schema: FINDER_SCHEMA, model: 'opus' },
    ),
  async (found, d) => {
    if (!found || !(found.findings || []).length) {
      log(`milestone-review: ${d.key}: no findings`)
      return { dim: d.key, survivors: [], watch: (found && found.watch_items) || [] }
    }
    const withIds = found.findings.map((f, i) => ({ id: `${d.key}-${i + 1}`, ...f }))
    const votes = await parallel(
      [1, 2].map((n) => () =>
        agent(
          `You are skeptic #${n} for the "${d.key}" dimension of a codebase review. Try to REFUTE each finding below: read the actual code at each locator and check whether the failure scenario really happens. ` +
            'For each finding id return refuted (true/false) and a one-line reason. Default to refuted=true when you cannot confirm the failure scenario in the actual code. Do NOT edit anything.\n' +
            `Findings: ${JSON.stringify(withIds)}` +
            guardrails,
          { label: `refute${n}:${d.key}`, phase: 'Refute', schema: VOTES_SCHEMA, model: 'opus' },
        ),
      ),
    )
    const good = votes.filter(Boolean)
    if (good.length < 2) {
      log(`milestone-review: ${d.key}: only ${good.length}/2 refuter votes returned — a missing vote counts as non-refuting`)
    }
    const refutedCount = (id) =>
      good.reduce((n, v) => n + ((v.votes.find((x) => x.id === id) || {}).refuted ? 1 : 0), 0)
    const survivors = withIds
      .filter((f) => refutedCount(f.id) < 2)
      .map((f) => ({ ...f, disputed: refutedCount(f.id) === 1 }))
    const killed = withIds.length - survivors.length
    if (killed > 0) log(`milestone-review: ${d.key}: ${killed} finding(s) killed by both skeptics`)
    return { dim: d.key, survivors, watch: found.watch_items || [] }
  },
)

phase('Synthesize')
const done = results.filter(Boolean)
if (done.length < dims.length) {
  log(`milestone-review: ${dims.length - done.length} dimension(s) returned nothing — NOT covered this run (re-run or resume to close the gap)`)
}
const survivors = done.flatMap((r) => r.survivors.map((f) => ({ dimension: r.dim, ...f })))
const watch = done.flatMap((r) => r.watch.map((w) => `[${r.dim}] ${w}`))

if (survivors.length === 0) {
  log('milestone-review: no findings survived the refuters — nothing written to the plan file')
  return { written_to: null, counts: { P0: 0, P1: 0, P2: 0 }, disputed: 0, headline: 'No findings survived adversarial verification.', watch_items: watch }
}

const summary = await agent(
  `Write the "Findings" section of ${args.planFile} from the verified review findings below. ` +
    'Group by dimension, order P0 first; each finding keeps its title, category, priority, locator, failure scenario, fix direction, and a [disputed] marker where one skeptic refuted it. ' +
    'End the section with a short "Reviewer\'s synthesis" paragraph (the 3-5 things that must be true, and what is code vs research). ' +
    `Edit ONLY that file — create the section if it is missing; this is this fleet's single sanctioned file write. Then return the counts and a one-paragraph headline.\n` +
    `Findings: ${JSON.stringify(survivors)}\nWatch items from the finders: ${JSON.stringify(watch)}` +
    guardrails,
  {
    label: 'synthesize',
    phase: 'Synthesize',
    schema: SUMMARY_SCHEMA,
    model: args.synthesisModel || 'opus',
  },
)

if (!summary) {
  log('milestone-review: synthesis returned nothing — findings were NOT written; re-run or resume before trusting the plan file')
  return { written_to: null, counts: null, survivors: survivors.length, watch_items: watch, synthesis_failed: true }
}

return { ...summary, survivors: survivors.length, watch_items: watch }
