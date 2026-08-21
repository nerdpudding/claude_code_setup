---
name: wireframe
description: Draw a picture in a real design tool instead of describing it in prose, and hand it back. Two jobs. A SCREEN — wireframe or mock-up — when the layout of a screen is unsettled and seeing it decides it, when asked what a screen should look like, or when an ASCII sketch is about to be written for something that will be iterated on. A DIAGRAM — architecture, components, C4, boxes and arrows — when asked how a system fits together, for a component overview, or for a picture of the architecture to put in the docs. Drives a local self-hosted Penpot, starts it when needed and stops it afterwards. Not for a throwaway one-look sketch or a small tweak to something already written — write HTML or ASCII by hand for those.
---

# wireframe — draw it instead of describing it

A picture settles layout, hierarchy and what is on screen at each step, and gives the user something
concrete to react to before tokens go into building. The same is true of a system: a diagram settles
what the pieces are and what talks to what, faster than a page of prose. This skill produces either,
unattended, in a real design tool the user can also open and edit himself.

**Two kinds, one command.** A **screen** is something a person will use. A **diagram** is boxes and
arrows *about* a system — architecture, components, C4. Pick with `--kind`; the difference is real,
not cosmetic, and it changes how the picture is built.

## Where it lives

**`PENPOT_ROOT=__HOME__/vibe_claude_kilo_cli_exp/Penpot-Self-Host`** — the one line to change if
the checkout moves. Everything below is relative to it.

`__HOME__` is a placeholder that only exists in the public repository; `install.sh` expands it to
this machine's real home directory on the way in, so the installed copy of this file carries the
full absolute path. **Use the path as it appears in your installed copy, exactly, fully spelled
out.** Do not substitute `~`, `$HOME` or a relative path: a permission rule matches the command as
literal text, so `~/…/scripts/wireframe` and `/home/…/scripts/wireframe` are two different commands
to it, and a project that allowed one would still be interrupted by the other.

**If that directory does not exist:** say *"Penpot is not installed on this machine — writing the
wireframe as HTML instead"*, write the wireframe by hand as a single HTML file, and stop reading here.
That is a complete outcome, not a failure. **If it exists but `$PENPOT_ROOT/.env` does not**, say the
stack has never been initialised on this machine and name `./scripts/init-env`; then either run it or
fall back to HTML.

## 1. Is this the right tool

**The user's instruction wins, in either direction.** "Do it with Penpot" / "not with Penpot, just
HTML" ends the deliberation. Do not re-argue it, and do not ask again later in the same conversation.

Absent an instruction:

| Reach for this | Write HTML by hand |
|---|---|
| The screen will be iterated on together, and the user may want to move things himself | A throwaway: one look, one decision, done |
| It should look presentable, not merely indicative | A small tweak to something already written and in context |
| The layout is unsettled and seeing it is what decides it | It is needed in seconds rather than a minute |
| Several screens should look like one another | The user declined this earlier in the same conversation |

Medium: **web is the fit. A TUI is worth offering** — panels, focus, colour, and a drawn sketch has
beaten ASCII in practice. **A CLI usually is not**, unless it has a real visual dimension.

**For a diagram the trade is different**, because the alternative is different. Reach for this when
the picture is going into the docs and will be looked at more than once, when there are enough pieces
that prose stops being readable, or when the user asked for a diagram by name. **Write it as text
instead** — an indented list, or an ASCII sketch — when there are only a handful of boxes, when it is
a one-look answer inside the conversation, or when it belongs in a reply rather than in a file.

**Offer it, and state the cost:** *"this starts a local Penpot stack, about 30 seconds — or I can
write it as HTML in a few seconds."* The user has a free alternative and is entitled to decline.
Say which way you leaned and why, in one clause, so a correction is one word rather than a discussion.

**One measured fact to be honest about:** Penpot draws the better-looking wireframe — that is the
user's own judgement on a real comparison. What it costs to *change* a design here is not settled;
do not quote a figure as though it were.

## 2. Write the brief

Penpot's own guidance is to structure the request as a **brief**, not a description: role, context,
goal, constraints, quality criteria. Be specific about what is on the screen and what it is for.
Use **negative constraints** deliberately — "do not invent new navigation patterns", "do not add
colour beyond greys". Keep it dense: schemas rather than sentences, no explanatory padding.

Write it to a file, or pass it on stdin. Everything about *how* to draw — positioning, naming, board
size, the API, the font — is already in the task text the command sends, and it differs per `--kind`.
**Do not restate drawing instructions in the brief**; say what the screen or the system is.

For a diagram, the brief is the same shape: what the nodes are, which zone each sits in, what the
arrows mean and in which direction, and what must be emphasised. Name every arrow. Say plainly what
must *not* be drawn — an arrow that does not exist is the most common thing to get wrong.

## 3. Run it

**Invoke it in exactly this form — the absolute path, no `cd`, nothing chained in front:**

```bash
$PENPOT_ROOT/scripts/wireframe --kind screen --brief /abs/path/to/brief.md \
  --name checkout-screen --out /abs/path/in/this/project/wireframes/checkout-screen.png
```

**Decide `--kind` yourself, from what was asked** — the command does not guess:

| | `--kind screen` | `--kind diagram` |
|---|---|---|
| What it is | Something a person will look at and use | Boxes and arrows *about* a system |
| Asked for as | a screen, a page, a mock-up, a view, a form | an architecture diagram, a component overview, C4, "how does this fit together" |
| Positioning | auto-layout, so it reflows when changed | free, at chosen coordinates, with arrows between nodes |
| Size | 1440 × 900, fixed | `--width` / `--height`, default 1600 × 1000 |

`--width` and `--height` are **diagram only** — passing them with `--kind screen` is refused, on
purpose, so a screen's size stays one thing decided in one place.

The single form matters. A `cd … && …` prefix, a relative `./scripts/wireframe`, and the absolute
path are three different commands to a permission rule, so a project that has allowed this once
would still be interrupted by the other two. **One form, always this one.** Use absolute paths for
`--brief` and `--out` too; the command creates `--out`'s parent directory itself, so do not `mkdir`
anything first.

**Say the command before running it** — in an interactive session it needs one Bash approval, and an
approval for a path outside the project should not arrive as a surprise. If it is denied, say so
plainly and offer to write the wireframe as HTML instead; do not try variations of the command to get
around the refusal.

| Flag | |
|---|---|
| `--brief PATH\|-` | the brief; `-` reads stdin |
| `--name SLUG` | lowercase letters, digits and hyphens. Names the design and the picture |
| `--out PATH` | where the PNG lands — a path inside the project being worked on |
| `--kind screen\|diagram` | which of the two jobs this is — see the table above. Default `screen` |
| `--width N` / `--height N` | **diagram only.** Board size, and therefore picture size. Default 1600 × 1000 |
| `--no-stop` | leave Penpot running (default: stop it if this call started it) |
| `--timeout S` | wall clock, default 450 s |

It handles the rest itself: checks whether Penpot is up, starts it if not, draws, exports, copies the
picture to `--out`, and stops the stack again **if it was the one that started it**. Announce the wait
before it happens — *"starting Penpot, about 30 seconds"*, or *"first run pulls about 5 GB of images,
a few minutes"*.

**Exit 0 means the picture at `--out` is from this run.** A non-zero exit names what went wrong; there
is no partial success and no picture to salvage. Report the failure, do not retry blindly.

## 4. Present it

**Show the picture.** The user should not have to open Penpot to see what was drawn — read the PNG at
`--out` and present it directly, in the project being worked on.

Penpot itself is the fallback, for when he wants to poke at the design rather than look at it: his own
account at **http://127.0.0.1:9001**, team **"AI designs"**, file **`agent-canvas`**, credentials in
`$PENPOT_ROOT/.env`. Name the team and the file; do not make him search a dashboard. That route only
works while the stack is up, so use `--no-stop` when you are pointing him at it.

### Reacting to his reaction

**This command draws; it does not amend.** Re-running it with the same `--name` draws the screen again
from a revised brief — it does not edit the shapes already there. So take his reaction, **fold it into
the brief**, and run it again. Say that is what you are doing, so a small change costing a full redraw
is visible rather than surprising.

Two other routes exist, and both are better for a small tweak:

- **Let him move it himself.** Point him at Penpot with `--no-stop`; dragging a box is faster than
  describing where it should go, and this is the one thing writing HTML by hand cannot offer at all.
- **For a genuinely small correction**, consider whether the picture already answered the question. A
  wireframe is there to settle a layout, not to be polished.

## 5. Stopping

The command stops the stack itself when it started it. **Not a question, not an offer** — a question
halts an autonomous flow while it waits for an answer nobody is there to give. Say it in one clause
(*"Penpot is stopped again"*) and move on. It stays up only when the user said to keep it up, or when
you passed `--no-stop` to point him at the file.

Stopping destroys nothing. `--volumes` does, and it is never part of this.

## Not this skill's job

- **Deciding what to show and when.** Flow-first UX work — describe the flow, walk each step, critique
  before building — is separate. This skill decides how a screen gets *drawn*.
- **Driving the browser for anything else.** That is `contained-browser`.
- **High-fidelity visual design.** These are wireframes and concept sketches.

## The detail, if something is unclear

In the checkout: `docs/ai_operating_procedure.md` is the full sequence, tool-agnostic and authoritative
— this skill is a thin wrapper over it. `docs/goals_and_flows.md` says when to use it and why.
`README.md` covers setup and the manual path. Read those rather than guessing; do not re-derive
behaviour from the scripts.
