# Project Organization

### Structure (adapt to project size)
```
project/
├── AI_INSTRUCTIONS.md                     # AI instructions — read first (always, tool-agnostic)
├── README.md                              # Overview + status (always)
├── ARCHITECTURE.md                        # Design (larger projects)
├── DECISIONS.md                           # Choices + rationale (larger projects)
├── DAILY_SCHEDULE_{date}.md               # Today's tasks (temp → archive/)
├── docs/                                  # Feature proposals, hardware, specs
├── phase{N}/ (or fase/sprint)             # Work by milestone
│   └── Phase{N}_Implementation_Plan.md    # HOW + order of tasks
├── claude_plans/                          # Active plans from plan mode
├── archive/                               # Never delete, always archive
└── .claude/agents/                        # Custom agents (if used)
```

### Key Terms
- **Schedule/Planning** = WHEN do we do WHAT (time-bound)
- **Plan** = HOW do we do WHAT, in what ORDER (implementation)

### Plan Mode Rules
1. Plans go in project repo in `claude_plans/` folder (configured in settings.json)
2. Plan mode generates random filenames (e.g. `humble-mixing-fern.md`) — this cannot be configured. **Immediately after exiting plan mode**, the FIRST action must be to rename the plan file to a clear name: `PLAN_<topic>.md` (e.g. `PLAN_upstream_sync.md`). Do this with `mv` before any other work.
3. After completing a plan: move to `archive/` with date prefix (e.g. `2026-01-28_upstream_sync.md`)
4. Implementation plans: `phase{N}/Phase{N}_Implementation_Plan.md`
5. Daily schedules: root temporarily → `archive/daily-schedules/`
6. Update progress in the appropriate tracker (phase plan, roadmap, or task file — one place, not duplicated)
7. Archive outdated content, never delete

### Quality Principles
- **SOLID, DRY, KISS** - Default yes, adapt to project needs
- **Modularity & flexibility** - Important for most projects
- **Testing** - Manual or automated based on requirements (ask if unclear)
- **Security** - Consider but not always enterprise-level (project dependent)

### Always
- Read `AI_INSTRUCTIONS.md` first (if it exists), then `README.md`, then relevant phase plan
- All code, docs, comments, plans, and commit messages in English
- One source of truth (no duplicate info)
- Use agents when their role fits (check `.claude/agents/` if present)
- Ask when project conventions are unclear

### Git commits
- NEVER add "Co-Authored-By: Claude" or similar AI attribution to commit messages
- Just write normal commit messages without AI mentions

### Compaction
When compacting (automatic or via /compact), include in summary:
- What was completed
- What to continue with next
- Important findings and discoveries
- Issues encountered and how they were resolved
- What to avoid / watch out for
- User preferences observed (how they like to work)
- Key decisions made and why
- Areas that need focus or attention
- Any other context that shouldn't be lost

Always end with: "Read AI_INSTRUCTIONS.md first, then continue."

After compaction:
- Read `AI_INSTRUCTIONS.md` first
- Then continue with the task

---

### Relationship with AI_INSTRUCTIONS.md

| File | Scope | Purpose |
|------|-------|---------|
| `CLAUDE.md` (this file) | Global | Your personal preferences for Claude Code across all projects |
| `AI_INSTRUCTIONS.md` | Per-project | Project-specific instructions, works with any AI tool |

**When to use which:**
- Use `CLAUDE.md` in `~/.claude/` for settings you want everywhere
- Use `AI_INSTRUCTIONS.md` in project root for project-specific rules, or when collaborating with people using different AI tools

For projects with multiple AI tools or collaborators, prefer `AI_INSTRUCTIONS.md` in the project root.
