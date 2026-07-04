# Session carryover — claude-code-setup — 2026-07-04

**Project & status:** claude-code-setup = a version-controlled home for a personal Claude Code
environment (global `CLAUDE.md`, settings, output style, skills in `global_config/`, mirrored to
`~/.claude/` via `./install.sh`). Status: v2.2 delivered and closed — the session-carryover pair
(`/pre-clear-compact` → `/clear` → `/post-clear-handover`) is built, hardened, renamed, and
committed; THIS run is its first real field test.

## Done
- All of v2.2 committed on `main`: `2202e02` (skills + docs), `075b2d8` (first close pass),
  `f74e1f9` (hardening + rename to `post-clear-handover` + doc-sync). Tree is clean.
- **Four commits are unpushed** (the three above plus this carryover's own commit) — the user
  pushes himself.
- Live `~/.claude` is in sync with the repo (verified via `./install.sh diff`); the stale old
  `post-clear-compact` skill folder was removed from `~/.claude/skills/`.

## Key decisions
- The carryover flow *replaces* the built-in `/compact` (durable git-tracked note + `/clear` beats
  a lossy in-context summary; a skill cannot invoke `/compact` anyway). Rationale: README v2.2
  entry. Deferred extras (SessionStart hook, Compact Instructions): roadmap "Deferred".
- Naming logic (user's, settled after debate): `pre-clear-compact` = before the clear, compact the
  session into the handover; `post-clear-handover` = after the clear, start from the handover.
  "resume" is off-limits (taken by the built-in); the post skill is NOT for after a plain built-in
  `/compact` (no handover doc — it then falls back to reading docs).

## Next step
This session ends the first half of the field test. In the new session, `/post-clear-handover`
should re-orient from this note. **Evaluate together with the user how well that worked**, then
update or close the `carryover-flow-in-test` project memory accordingly. After that, remaining
backlog: the Watch-outs fix below, then roadmap "Deferred" items only if the user asks.

## Working conventions (important — several were explicit user corrections this session)
- Commits go **straight to `main`** (solo config repo, no branches/PRs); commit/push **only on
  request**; the user pushes himself. English in files, Dutch in conversation.
- Roll out with `./install.sh install`, check with `./install.sh diff`; restart Claude Code after
  installing skills. The script never touches machine-local state.
- **No hooks** — the user explicitly rejected both a SessionStart read-hook and an auto-commit
  hook. The flow stays two commands + one rolling file. Do not re-propose hooks.
- Keep explanations simple and non-technical; don't present option-walls or reopen settled
  decisions; one crisp question when a decision is genuinely the user's.
- Lifecycle: `/custom_plan` → build only on explicit "implement PLAN_x" → `/feature-close` →
  `/pre-clear-compact` → commit → `/clear` → `/post-clear-handover`.

## Watch-outs
- **Small doc gap found at the very end (not yet fixed, written down only here):**
  `global_config/skills/project-setup/SKILL.md` Phase 0.4 lists the global skills to verify but
  omits the two new ones — add `pre-clear-compact` and `post-clear-handover` to that list.
- Minor drift, not tracked: `settings.json` has `effortLevel: xhigh`; `docs/opus_4_8_alignment.md`
  principle 9 still calls `high` the everyday default.
- The flow is **unproven** — see the `carryover-flow-in-test` project memory; this run is the test.
