---
name: beep
description: Switch on or off the sound that tells the user Claude needs him, or change which sound plays and how often. Use when the user types /beep, or says "beep aan", "beep uit", "zet het geluid aan", "ander geluid", "laat het vaker piepen".
---

# beep — a sound when Claude needs the user

When the sound plays is set in the global `CLAUDE.md` ("A sound when he is needed") and by a
`Notification` hook in `settings.json`. This skill only switches it and sets it.

Everything goes through one script, which also keeps the settings. Run it with exactly this
command text, so the allow rule in `settings.json` matches and no permission prompt appears:

```
bash __HOME__/.claude/skills/beep/beep.sh <argument>
```

| The user asks | Argument |
|---|---|
| on (`/beep`, `/beep on`) | `on`, then `test` |
| off | `off` |
| a different sound | `sound <file>` — with no file named, list `/usr/share/sounds/freedesktop/stereo/*.oga` and let him pick |
| more or fewer rings | `times <n>` |
| hear it | `test` |
| how it is set | `status` |

Reply with the status line the script prints, nothing more. If he says he did not hear the test,
say that `paplay` plays on the default sound output, and stop.
