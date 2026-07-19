export const meta = {
  name: 'doc-sweep',
  description: 'Read-only doc-consistency sweep: parallel cluster readers, one verifier, one merger — only merged findings reach the main thread',
  phases: [
    { title: 'Read', detail: 'one reader per doc cluster (haiku/sonnet, effort low)' },
    { title: 'Verify', detail: 'one sonnet verifier checks findings against the actual files' },
    { title: 'Merge', detail: 'one sonnet merger dedupes and ranks' },
  ],
}
// Saved workflow for the end-of-sprint / periodic doc-consistency sweep.
// Normally invoked by the /doc-sweep skill, which derives the clusters inline first.
//
// Caps (advisory 2026-07-19, Q4): fleet 6-10 agents total = 4-7 readers (haiku for pure
// staleness, sonnet for judgment-bearing clusters, or the project's own doc-keeper via
// agentType) + 1 sonnet verifier + 1 sonnet merger. State a token target in the invoking
// turn ("+300k") — enforced as a hard ceiling in this installation. Readers run at
// effort 'low' (this installation has no maxTurns knob on agent()). Keep the /config
// workflow size guideline at "medium". No ultracode.
//
// Read-only fleet: agents audit and report, they do not edit. A failed run is simply
// re-run, or resumed via resumeFromRunId — there is no state to corrupt.
//
// Version-sensitive: `agentType` and the `budget` hard ceiling are installation-verified
// (2026-07-19) but absent from the public docs — re-check after harness updates or on
// other machines before relying on them.
//
// args = {
//   clusters: [{ name, paths: [...], judgment?: bool, agentType?: string }],  // 4-7 clusters
//   guardrails?: string,  // project rules appended to every agent prompt (privacy etc.)
// }
// Returns: { findings: [...], watch_items: [...], clusters_missed: [...] } — merged list only.

const FINDINGS_SCHEMA = {
  type: 'object',
  required: ['findings', 'watch_items'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['file', 'issue', 'correct_value', 'priority'],
        properties: {
          file: { type: 'string' },
          section: { type: 'string', description: 'Section heading or line reference' },
          issue: { type: 'string' },
          correct_value: { type: 'string' },
          priority: { type: 'string', enum: ['P1', 'P2', 'P3'] },
        },
      },
    },
    watch_items: {
      type: 'array',
      items: { type: 'string' },
      description: 'Anything odd noticed but not verifiable within this cluster',
    },
  },
}

const VERIFIED_SCHEMA = {
  type: 'object',
  required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['file', 'issue', 'correct_value', 'priority', 'verdict', 'reason'],
        properties: {
          file: { type: 'string' },
          section: { type: 'string' },
          issue: { type: 'string' },
          correct_value: { type: 'string' },
          priority: { type: 'string', enum: ['P1', 'P2', 'P3'] },
          cluster: { type: 'string' },
          verdict: { type: 'string', enum: ['CONFIRMED', 'REJECTED'] },
          reason: { type: 'string' },
        },
      },
    },
  },
}

const MERGED_SCHEMA = {
  type: 'object',
  required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['file', 'issue', 'correct_value', 'priority'],
        properties: {
          file: { type: 'string' },
          section: { type: 'string' },
          issue: { type: 'string' },
          correct_value: { type: 'string' },
          priority: { type: 'string', enum: ['P1', 'P2', 'P3'] },
          cluster: { type: 'string' },
        },
      },
    },
  },
}

if (!args || !Array.isArray(args.clusters) || args.clusters.length === 0) {
  throw new Error(
    'doc-sweep: args.clusters must be a non-empty array of {name, paths[]} — the /doc-sweep skill derives these inline before invoking',
  )
}
if (args.clusters.some((c) => !c.name || !Array.isArray(c.paths) || c.paths.length === 0)) {
  throw new Error('doc-sweep: every cluster needs a name and a non-empty paths[] list')
}
if (args.clusters.length > 7) {
  throw new Error(
    `doc-sweep: ${args.clusters.length} clusters exceeds the 7-reader cap — consolidate related docs into at most 7 clusters`,
  )
}
if (!budget.total) {
  log('doc-sweep: no token target set for this turn — recommended invocation states "+300k" (hard ceiling); proceeding uncapped')
}

const guardrails = args.guardrails
  ? `\nProject guard rails (apply strictly): ${args.guardrails}`
  : ''

phase('Read')
const perCluster = await parallel(
  args.clusters.map((c) => () =>
    agent(
      `Read-only documentation-consistency audit of the "${c.name}" cluster: ${c.paths.join(', ')}.\n` +
        'Compare these docs against the project\'s actual state (the filesystem, the code, and the files they reference) and report drift: stale claims, broken references, contradictions between documents, facts restated in two places, hierarchy mismatches. Do NOT edit anything.\n' +
        'For every finding give the exact file, the section or line, the issue, and what the correct value should be, with priority P1 (wrong or misleading) to P3 (cosmetic). Also return watch_items: anything odd you noticed but could not verify from this cluster alone.' +
        guardrails,
      {
        label: `read:${c.name}`,
        phase: 'Read',
        schema: FINDINGS_SCHEMA,
        effort: 'low',
        // agentType runs the project's own doc-keeper (its pinned model applies);
        // otherwise: sonnet for judgment-bearing clusters, haiku for staleness greps.
        ...(c.agentType ? { agentType: c.agentType } : { model: c.judgment ? 'sonnet' : 'haiku' }),
      },
    ),
  ),
)

const labeled = perCluster.flatMap((r, i) =>
  r ? (r.findings || []).map((f) => ({ ...f, cluster: args.clusters[i].name })) : [],
)
const watch = perCluster.flatMap((r, i) =>
  r ? (r.watch_items || []).map((w) => `[${args.clusters[i].name}] ${w}`) : [],
)
const missed = args.clusters.filter((c, i) => !perCluster[i]).map((c) => c.name)
if (missed.length) {
  log(`doc-sweep: no result from cluster(s): ${missed.join(', ')} — NOT covered this run (re-run or resume to close the gap)`)
}

if (labeled.length === 0) {
  log('doc-sweep: no findings from any reader — skipping verify and merge')
  return { findings: [], watch_items: watch, clusters_missed: missed }
}

phase('Verify')
const verified = await agent(
  'Verify each of these documentation-drift findings against the ACTUAL files on disk — read them, do not trust the claim. ' +
    'Mark each finding CONFIRMED or REJECTED with a one-line reason; where a finding is right but imprecise, correct its correct_value. Do NOT edit any file.\n' +
    `Findings: ${JSON.stringify(labeled)}` +
    guardrails,
  { label: 'verify:all', phase: 'Verify', schema: VERIFIED_SCHEMA, model: 'sonnet' },
)

if (!verified) {
  log('doc-sweep: verifier returned nothing — returning UNVERIFIED reader findings, marked as such')
  return { findings: labeled, unverified: true, watch_items: watch, clusters_missed: missed }
}

const confirmed = (verified.findings || []).filter((f) => f.verdict === 'CONFIRMED')
const rejected = (verified.findings || []).length - confirmed.length
if (rejected > 0) log(`doc-sweep: verifier rejected ${rejected} finding(s)`)
if (confirmed.length === 0) {
  return { findings: [], watch_items: watch, clusters_missed: missed }
}

phase('Merge')
const merged = await agent(
  'Dedupe and rank these verified documentation-drift findings. Merge duplicates that describe the same underlying drift (keep the most precise locator), order by priority then by file, and return the cleaned list. Do NOT edit any file.\n' +
    `Findings: ${JSON.stringify(confirmed)}`,
  { label: 'merge', phase: 'Merge', schema: MERGED_SCHEMA, model: 'sonnet' },
)

if (!merged) {
  log('doc-sweep: merger returned nothing — returning verified findings unmerged')
  return { findings: confirmed, watch_items: watch, clusters_missed: missed }
}

return { findings: merged.findings, watch_items: watch, clusters_missed: missed }
