#!/bin/bash
# The sensei's read-only window into the calendar.
# Usage: ./scripts/cal.sh [today|tomorrow|week]   (default: today)
#
# Reads events via a compiled EventKit binary (scripts/cal.swift). The binary is
# built once and cached next to this script; it only rebuilds when the source
# changes. EventKit is used because icalBuddy reports "No calendars" here and
# Calendar.app's AppleScript event filter takes ~16s per calendar.
# Never modifies events.

set -euo pipefail

RANGE="${1:-today}"
case "$RANGE" in
  today|tomorrow|week) ;;
  *) echo "usage: cal.sh [today|tomorrow|week]"; exit 2 ;;
esac

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$DIR/cal.swift"
BIN="$DIR/.calbin"

# (Re)build the cached binary when missing or older than the source.
if [ ! -x "$BIN" ] || [ "$SRC" -nt "$BIN" ]; then
  if ! command -v swiftc >/dev/null 2>&1; then
    echo "Need the Swift toolchain (swiftc) to read the calendar. Install Xcode command line tools: xcode-select --install"
    exit 1
  fi
  if ! swiftc -O "$SRC" -o "$BIN" 2>/tmp/cal-build.err; then
    echo "Failed to build the calendar reader:"; cat /tmp/cal-build.err
    exit 1
  fi
fi

OUT="$("$BIN" "$RANGE" 2>/tmp/cal-run.err)" && { printf '%s\n' "$OUT"; exit 0; }

# Non-zero exit: surface the reason. EventKit prints DENIED when access is off.
if grep -qi 'denied' /tmp/cal-run.err; then
  echo "Calendar access not granted to this app."
  echo "Fix: System Settings → Privacy & Security → Calendars → enable your terminal / Claude."
else
  echo "Calendar lookup failed:"; cat /tmp/cal-run.err
fi
exit 1
