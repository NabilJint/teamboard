#!/bin/bash
# Usage: ./scripts/find-sot.sh <keyword>
# Returns file paths that have the matching SOT comment.
# Paths only, no contents — token-efficient discovery.

if [ -z "$1" ]; then
  echo "Usage: $0 <keyword>"
  echo "Example: $0 tenant"
  exit 1
fi

rg -l "SOT:.*$1" src/ || echo "No matches for SOT: $1"
