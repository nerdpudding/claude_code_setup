---
name: contained-browser
description: Drive a headless Chromium in a container over MCP, for any purpose — open a page, fill a form, screenshot it, scrape a value, test a local web app. Use when a task needs a real browser and the user's own browser must not be touched. Isolated profile, loopback-only endpoint, nothing of the user's in it. Not for Penpot work; use the wireframe skill for that.
---

# contained-browser — a browser an agent may drive

A headless Chromium with an MCP endpoint, in its own container. One job: **hold a page open and let a
client drive it over MCP.** It is not the user's browser, it holds nothing of the user's, and it can be
started and stopped without consequence.

## The hard rule this exists for

**Never launch, attach to, or kill the user's own browser.** Not Firefox, not Chrome, not a profile he
is logged into. There is an incident behind this rule. This container is the only browser to drive.

## Where it lives

**`BROWSER_ROOT=~/vibe_claude_kilo_cli_exp/Penpot-Self-Host`** — the one line to change if the checkout
moves. The browser is a standalone block inside that repository: `compose.browser.yaml`, deliberately
runnable on its own.

**If that directory does not exist:** say *"the contained browser is not installed on this machine"* and
either ask how the user wants the task done, or use a plain HTTP fetch if the job does not actually need
a browser. Do not fall back to any browser already on the machine.

## Running it

```bash
cd $BROWSER_ROOT && docker compose -f compose.browser.yaml up -d      # needs HOST_UID/HOST_GID in the env
docker compose -f compose.browser.yaml down                            # when done
```

| | |
|---|---|
| Endpoint | `http://127.0.0.1:8931/mcp` — streamable HTTP, **loopback only** |
| Image | `mcr.microsoft.com/playwright/mcp` (~1 GB on disk) |
| Shared files | `./exchange` on the host is `/exchange` in the container — screenshots and logs land there |
| Profile | a named volume, not the user's home |

**The endpoint belongs in configuration, never hard-coded twice.** An MCP client reaches it with
`{ "mcpServers": { "playwright": { "url": "http://127.0.0.1:8931/mcp" } } }` — and MCP configuration is
read at session start, so a session already running cannot pick it up by starting the container now. The
endpoint also lives in that repository's `.env` and its `docs/browser.md`, which names the variable and
provides a small stdlib client (`scripts/lib/mcp.py`) for a script that needs to drive it.

## Four behaviours that will otherwise waste your time

1. **The browser lives exactly as long as one MCP session does.** When the connected-session count
   reaches zero, the context *and the browser* close. So **do not send `DELETE` on a session whose page
   must stay open** — and note that a plain request/response client never opens the SSE stream the
   server pings over, which is why the heartbeat is disabled in this compose file. Without that, every
   such client gets dropped about five seconds after its last call.
2. **An accessibility snapshot is empty for the first second or two** after a navigation, while the DOM
   is already fully there. Snapshot **refs** are therefore a race; **role and accessible name** are not
   — address elements that way.
3. **Everything the server writes lands in `/exchange`, and nothing evicts it.** Screenshots, console
   logs, snapshots. Clean up after yourself. Two containers share that directory, so the rule is
   **create and delete, never modify** — a file the other side wrote cannot be opened for writing from
   here, but unlink-then-create works.
4. **`--allowed-origins` is not a security boundary.** Upstream says so. What contains the page is the
   container.

## Drawing a wireframe is a different job

If the task is to design or mock up a screen, this is the wrong skill — use the `wireframe` skill, which
owns that end to end. This one only opens a page and drives it.

A consumer that wants a logged-in session of its own should point at a **different profile volume**, or
pass `--isolated` for a throwaway one — do not reuse another project's saved login.

## The detail, if something is unclear

`docs/browser.md` in that checkout is the authoritative reference — the measured behaviours above, how
to attach it to another project's network, and what a reusing project should not inherit. Read it rather
than guessing.
