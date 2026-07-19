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
# memory, history, plugins, credentials) is never touched.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/global_config"
CLAUDE_DIR="${CLAUDE_DIR:-$HOME/.claude}"
MODE="${1:-diff}"

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
      elif ! cmp -s "$src" "$dst"; then
        echo "differs:         $rel"; drift=1
        diff -u "$src" "$dst" | sed 's/^/  /' || true
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
      if [ -f "$dst" ] && cmp -s "$src" "$dst"; then continue; fi
      if [ -f "$dst" ]; then
        mkdir -p "$backup_dir/$(dirname "$rel")"
        cp -p "$dst" "$backup_dir/$rel"
      fi
      mkdir -p "$(dirname "$dst")"
      cp "$src" "$dst"
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
      if [ -f "$dst" ] && cmp -s "$src" "$dst"; then continue; fi
      mkdir -p "$(dirname "$dst")"
      cp "$src" "$dst"
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
