---
name: kilo-sync
description: Refresh Kilo CLI's own copy of the global rules and of this project's agents, so Kilo works under the same rules as Claude Code. Use when the global rules or a project's agents have changed, or after setting Kilo up on a machine. Trigger on "kilo sync", "doe de kilo sync", "breng kilo in orde", "sync kilo", "/kilo-sync". Does nothing and says so when the kilo-sync command is not installed.
---

# kilo-sync — bring Kilo CLI's copies up to date

Kilo CLI is a second terminal coding agent. It cannot read Claude Code's global rules or a
project's `.claude/agents/`, so it gets its own translated copy of both; Claude Code stays the
source and nothing here edits Claude Code's own files.

Everything this skill needs comes from the `kilo-sync` command, which prints the paths it wants
used. Never assume a path of your own.

## 1. Is Kilo set up on this machine?

```bash
command -v kilo-sync
```

Not found: say in one line that Kilo is not set up on this machine, so there is nothing to sync,
and stop. That is not a failure.

## 2. The global rules

```bash
kilo-sync global check
```

- Exit `0` — the rules are current. Go to step 3.
- Exit `2` — an error. Report what it printed and stop; nothing has changed.
- Exit `1` — a refresh is needed. It prints what changed, a unified diff per changed input (or
  "no snapshot: full translation needed"), and two lines with absolute paths: one after `rules:`
  and one after `target:`.

On exit `1`:

1. Read the file named after `rules:`. It is the translation rules and it is binding — which
   sections are kept, adapted or dropped. It also names the file that lists the phrases the lint
   requires and the tokens it forbids; read that file too before writing, or the first lint round
   fails on something that was knowable.
2. Write the file named after `target:`. With "no snapshot" it may not exist yet: translate the
   whole file once. Otherwise edit it **incrementally**: change only the sections the printed
   diff touches, and leave every other section exactly as it is. A full rewrite loses earlier
   hand fixes. Write no other file, and never touch the snapshot by hand — `accept` is the only
   thing that records a translation.
3. ```bash
   kilo-sync global lint
   ```
   Every finding is one line. Fix each one in the target file and run the lint again, until it
   passes.
4. ```bash
   kilo-sync global accept && kilo-sync global install
   ```
   `accept` records the sources as translated and refuses while the lint fails; `install` puts the
   file live.

**If the lint will not pass**, stop there. No `accept`, no `install`: Kilo keeps running on the
rules that are already installed, which is the safe outcome. Report which findings are left and
that the live rules are unchanged.

## 3. This project's agents

Only when the current directory has a `.claude/agents/` folder:

```bash
kilo-sync agents sync .
```

- Exit `0` — written, or already identical.
- Exit `1` — one or more files could not be translated or a hand-written file was in the way. The
  others were written. Report the files it names and why, in one line each.
- Exit `2` — an error. Report what it printed.

## 4. Report

A few lines: what was refreshed, what was already in order, what failed. Nothing is committed —
say so, and say where the changes are: translated agents are in this project's `.kilo/agent/`;
a refreshed rules file is in the repository that holds the file named after `target:`, which may
be a different one from the project this runs in. If the lint blocked the install, that is the
first thing in the report.
