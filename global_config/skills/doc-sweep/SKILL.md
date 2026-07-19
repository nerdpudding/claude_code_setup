---
name: doc-sweep
description: Run the doc-consistency sweep as a capped, saved workflow — parallel cluster readers, one verifier, one merger; only the merged findings list reaches the main thread. Use at sprint close on a project with a substantial doc tree, or as a periodic maintenance sweep. Trigger on "doc-sweep", "run the doc sweep", "docs-consistentie-sweep", "sweep the docs". For a small project (a handful of docs) skip the fleet and delegate a single doc-keeper/sonnet pass instead.
---

# doc-sweep — the doc-consistency sweep as a capped workflow fleet

Replaces the serial single-agent sweep (one sonnet doc-keeper walking the whole tree, its full
report landing in main context) with a fan-out: 4–7 cheap readers with fresh contexts, one
verifier, one merger. The main thread receives ONLY the merged findings list and applies fixes
itself — exactly as doc-keeper findings are applied today. Wall-clock drops several-fold and the
intermediate reading never touches the session; total tokens are similar (this is a context- and
coverage-win, not a total-cost win).

**When NOT to use:** a small project with a handful of docs. Delegate a single doc-keeper (or
sonnet) pass as `/feature-close` step 2 describes, and stop — no fleet for 3 files.

## Operating caps (fixed — from the 2026-07-19 advisory, Q4)

| Knob | Value |
|---|---|
| Fleet size | 6–10 agents: 4–7 readers + 1 sonnet verifier + 1 sonnet merger |
| Reader models | `haiku` for pure staleness checks; `sonnet` for judgment-bearing clusters; the project's own doc-keeper via `agentType` (its pinned model applies) |
| Reader depth | `effort: 'low'` (this installation has no `maxTurns` knob on `agent()`) |
| Token target | The invoking turn states **"+300k"** — enforced as a hard ceiling here; without it the workflow logs a warning and runs uncapped |
| `/config` size guideline | `medium` |
| Ultracode | Never |
| Write access | None — read-only fleet; fixes happen in the main thread afterward |
| Failure policy | Re-run, or resume via `resumeFromRunId`; the run journal lists per-agent results |

> **Version-sensitive:** `agentType` and the `budget` hard ceiling are installation-verified
> (2026-07-19) but absent from the public docs — re-check after harness updates or on another
> machine before relying on them.

## Steps

### 1. Derive the clusters inline (cheap, main thread)
Group the project's doc tree into **4–7 clusters** of related files — e.g. README + workflow
docs / design docs / knowledge cards / roadmap + status blocks / research docs. Use the project
hierarchy (`AI_INSTRUCTIONS.md`) as the map; don't spawn agents for this. Per cluster set:
- `name` and `paths` (real file paths);
- `judgment: true` for clusters needing real judgment (design docs, cross-referenced status) —
  they get sonnet; plain staleness clusters get haiku;
- `agentType: 'doc-keeper'` (or the project's equivalent) for the clusters where the project
  agent's source-of-truth rules matter — the fleet then runs that agent as-is.

### 2. State the guard rails
Collect the project's per-agent rules into one `guardrails` string: privacy limits (e.g.
"structure/aggregates only, never read raw data content"), English-only output, anything the
project's agent definitions restate. This string is appended to every agent prompt.

### 3. Invoke the saved workflow
The token target comes from the user's turn — recommend **"+300k"** when it's absent (bigger
trees may warrant more; the ceiling is hard). Then:

```
Workflow({ name: 'doc-sweep', args: { clusters, guardrails } })
```

Monitor with `/workflows`; per-agent tokens are in the run journal afterward.

### 4. Apply and report
The workflow returns `{ findings, watch_items, clusters_missed }`. Fix the findings in the main
thread (they are verified and deduped; still read the target before editing). Surface
`watch_items` and any `clusters_missed` (a missed cluster means NOT covered — re-run or resume,
don't silently accept the gap). When this runs at sprint close, feed the run's real token totals
into `/feature-close`'s token-recording step.
