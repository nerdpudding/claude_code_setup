#!/usr/bin/env bash
# beep.sh — play a sound when Claude needs the user. Switched by /beep.
#
# Usage:
#   beep.sh              play the sound, if switched on (what Claude and the hook call)
#   beep.sh on | off     switch it
#   beep.sh sound FILE   set the sound file
#   beep.sh times N      set how often it plays in a row
#   beep.sh test         play once now, switched on or not
#   beep.sh status       print the settings
#
# The settings live outside ~/.claude/, so install.sh never touches them. This script is
# their only writer. Playing never fails: without paplay or the sound file it exits 0
# silently, so a hook or a turn is never held up by a missing sound.
set -u

CONF_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/claude-beep"
CONF="$CONF_DIR/beep.conf"

enabled=0
sound=/usr/share/sounds/freedesktop/stereo/bell.oga
times=3

load() {
  [ -f "$CONF" ] || return 0
  while IFS='=' read -r key value; do
    case "$key" in
      enabled) enabled="$value" ;;
      sound)   sound="$value" ;;
      times)   times="$value" ;;
    esac
  done < "$CONF"
}

save() {
  mkdir -p "$CONF_DIR"
  printf 'enabled=%s\nsound=%s\ntimes=%s\n' "$enabled" "$sound" "$times" > "$CONF"
}

play() {
  command -v paplay >/dev/null 2>&1 || return 0
  [ -f "$sound" ] || return 0
  local n="$1"
  # Detached, so the caller returns at once instead of waiting for every ring.
  ( for _ in $(seq "$n"); do paplay --volume=65536 "$sound"; done ) >/dev/null 2>&1 &
  disown 2>/dev/null || true
}

status() {
  local state=off
  [ "$enabled" = 1 ] && state=on
  echo "beep: $state, sound $sound, $times times"
}

load
case "${1:-}" in
  "")    [ "$enabled" = 1 ] && play "$times" ;;
  on)    enabled=1; save; status ;;
  off)   enabled=0; save; status ;;
  sound)
    if [ ! -f "${2:-}" ]; then echo "beep: no such sound file: ${2:-}" >&2; exit 1; fi
    sound="$2"; save; status ;;
  times)
    case "${2:-}" in ''|*[!0-9]*|0) echo "beep: times must be a whole number above 0" >&2; exit 1 ;; esac
    times="$2"; save; status ;;
  test)  play 1; status ;;
  status) status ;;
  *)     echo "usage: beep.sh [on|off|sound FILE|times N|test|status]" >&2; exit 1 ;;
esac
exit 0
