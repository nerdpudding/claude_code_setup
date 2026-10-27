#!/usr/bin/env bash
# install.sh — keep global_config/ and ~/.claude/ in sync.
#
# Usage:
#   ./install.sh diff      # show drift between the repo and ~/.claude (default)
#   ./install.sh install   # repo -> ~/.claude (backs up files it overwrites)
#   ./install.sh pull      # ~/.claude -> repo (bring live edits under version control)
#
# Scope: only the files this repo manages — CLAUDE.md, settings.json,
# output-styles/, skills/, and workflows/. Machine-local state (settings.local.json,
# memory, history, plugins, credentials) is never touched, and neither are the
# machine-only keys inside settings.json listed in LOCAL_SETTINGS below.
#
# Home-path placeholder: this repo is PUBLIC, so no home directory is ever committed.
# Files store the token __HOME__ where an absolute home path is required; `install`
# expands it to this machine's $HOME and `pull` folds it back. `diff` applies the same
# expansion before comparing, so a placeholder never shows up as permanent drift.
# This is why a skill may safely spell a path out in full (some permission rules match
# command text literally and cannot use ~ or $HOME) without leaking a username.
#
# BOTH substitutions require a trailing slash, which is what makes them safe:
#   - "__HOME__" written in prose ABOUT the placeholder is left alone; only
#     "__HOME__/something" is a path and gets expanded.
#   - a longer path that merely starts with the home directory (/home/alice2/... when
#     home is /home/alice) is not folded on the way back.
# $HOME is escaped for both the pattern and the replacement side, so a home directory
# containing a regex metacharacter (a dot, as in /Users/john.doe) cannot misfire.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/global_config"
CLAUDE_DIR="${CLAUDE_DIR:-$HOME/.claude}"
MODE="${1:-diff}"
HOME_TOKEN="__HOME__"

HOME_PAT="$(printf '%s' "$HOME" | sed 's/[][\.*^$|]/\\&/g')"   # $HOME as a sed regex
HOME_REP="$(printf '%s' "$HOME" | sed 's/[\|&]/\\&/g')"        # $HOME as a replacement

# repo form -> live form: placeholder becomes this machine's real home path.
to_live() { sed "s|${HOME_TOKEN}/|$HOME_REP/|g" "$1"; }

# live form -> repo form: this machine's home path becomes the placeholder.
to_repo() { sed "s|$HOME_PAT/|$HOME_TOKEN/|g" "$1"; }

# Settings that belong to this machine only: install keeps them, diff ignores them, and pull
# leaves them out of the repo (it is public, and they name local folders). Dotted paths into
# settings.json; add one here when a new machine-only setting appears.
LOCAL_SETTINGS="statusLine permissions.additionalDirectories"

# settings_json strip FILE        -> FILE without the local settings, formatted the repo's way
# settings_json merge FILE LIVE   -> FILE with the local settings copied over from LIVE
settings_json() {
  python3 - "$LOCAL_SETTINGS" "$@" <<'PY'
import json, sys
keys = [k.split(".") for k in sys.argv[1].split()]
mode, path = sys.argv[2], sys.argv[3]
data = json.load(open(path))

def find(d, ks):
    for k in ks:
        if not isinstance(d, dict) or k not in d:
            return False, None
        d = d[k]
    return True, d

for ks in keys:
    if mode == "strip":
        found, parent = find(data, ks[:-1])
        if found and isinstance(parent, dict):
            parent.pop(ks[-1], None)
    else:
        found, value = find(json.load(open(sys.argv[4])), ks)
        if found:
            d = data
            for k in ks[:-1]:
                d = d.setdefault(k, {})
            d[ks[-1]] = value
print(json.dumps(data, indent=2, ensure_ascii=False))
PY
}

# want REL SRC: the repo file as the live file should read, local settings left out.
want() { if [ "$1" = settings.json ]; then settings_json strip <(to_live "$2"); else to_live "$2"; fi; }
# have REL DST: the live file as it reads, local settings left out.
have() { if [ "$1" = settings.json ]; then settings_json strip "$2"; else cat "$2"; fi; }

# Union of managed files on both sides, as paths relative to global_config/.
tracked_paths() {
  {
    (cd "$REPO_DIR" && find . -type f)
    if [ -d "$CLAUDE_DIR" ]; then
      (cd "$CLAUDE_DIR" && find ./CLAUDE.md ./settings.json ./output-styles ./skills ./workflows -type f 2>/dev/null || true)
    fi
  } | sed 's|^\./||' | sort -u
}

case "$MODE" in
  diff)
    drift=0
    while IFS= read -r rel; do
      src="$REPO_DIR/$rel" dst="$CLAUDE_DIR/$rel"
      if [ ! -f "$dst" ]; then
        echo "only in repo:    $rel"; drift=1
      elif [ ! -f "$src" ]; then
        echo "only in ~/.claude: $rel"; drift=1
      elif ! cmp -s <(want "$rel" "$src") <(have "$rel" "$dst"); then
        echo "differs:         $rel"; drift=1
        diff -u <(want "$rel" "$src") <(have "$rel" "$dst") | sed 's/^/  /' || true
      fi
    done < <(tracked_paths)
    [ "$drift" -eq 0 ] && echo "in sync: repo matches $CLAUDE_DIR"
    ;;

  install)
    backup_dir="$CLAUDE_DIR/backups/claude-code-setup_$(date +%Y%m%d_%H%M%S)"
    changed=0
    while IFS= read -r rel; do
      src="$REPO_DIR/$rel" dst="$CLAUDE_DIR/$rel"
      [ -f "$src" ] || continue
      if [ -f "$dst" ] && cmp -s <(want "$rel" "$src") <(have "$rel" "$dst"); then continue; fi
      if [ -f "$dst" ]; then
        mkdir -p "$backup_dir/$(dirname "$rel")"
        cp -p "$dst" "$backup_dir/$rel"
      fi
      mkdir -p "$(dirname "$dst")"
      if [ "$rel" = settings.json ] && [ -f "$dst" ]; then
        settings_json merge <(to_live "$src") "$backup_dir/$rel" > "$dst"
      else
        to_live "$src" > "$dst"
      fi
      echo "installed: $rel"
      changed=1
    done < <(tracked_paths)
    if [ "$changed" -eq 0 ]; then
      echo "nothing to do: $CLAUDE_DIR already matches the repo"
    else
      [ -d "$backup_dir" ] && echo "overwritten files backed up to: $backup_dir"
      echo "restart Claude Code to pick up skills, workflows and the output style"
    fi
    ;;

  pull)
    changed=0
    while IFS= read -r rel; do
      src="$CLAUDE_DIR/$rel" dst="$REPO_DIR/$rel"
      [ -f "$src" ] || continue
      if [ -f "$dst" ] && cmp -s <(to_repo <(have "$rel" "$src")) <(have "$rel" "$dst"); then continue; fi
      mkdir -p "$(dirname "$dst")"
      to_repo <(have "$rel" "$src") > "$dst"
      echo "pulled: $rel"
      changed=1
    done < <(tracked_paths)
    if [ "$changed" -eq 0 ]; then
      echo "nothing to do: repo already matches $CLAUDE_DIR"
    else
      echo "review with: git diff"
    fi
    ;;

  *)
    echo "usage: $0 [diff|install|pull]" >&2
    exit 1
    ;;
esac
