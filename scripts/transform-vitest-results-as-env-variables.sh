#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# transform-vitest-results-as-env-variables.sh
#
# Reads Vitest output from stdin, extracts test and coverage statistics,
# and prints them as environment variable assignments for CI/CD usage.
#
# Usage:
#   cat vitest-output.txt | ./transform-vitest-results-as-env-variables.sh
# -----------------------------------------------------------------------------

set -euo pipefail

output=$(cat)

if [[ -z "$output" ]]; then
  echo "Error: No input provided. Please pipe Vitest output to this script." >&2
  exit 1
fi

tests_count=$(echo "$output" | grep 'Tests' | awk -F'[()]' '{print $2}')

statements_count=$(echo "$output" | awk '/^Statements[[:space:]]*:/ {print $(NF-1)}')
branches_count=$(echo "$output" | awk '/^Branches[[:space:]]*:/ {print $(NF-1)}')
functions_count=$(echo "$output" | awk '/^Functions[[:space:]]*:/ {print $(NF-1)}')
lines_count=$(echo "$output" | awk '/^Lines[[:space:]]*:/ {print $(NF-1)}')

statements_percent=$(echo "$output" | awk '/^Statements[[:space:]]*:/ {print $3}')
branches_percent=$(echo "$output" | awk '/^Branches[[:space:]]*:/ {print $3}')
functions_percent=$(echo "$output" | awk '/^Functions[[:space:]]*:/ {print $3}')
lines_percent=$(echo "$output" | awk '/^Lines[[:space:]]*:/ {print $3}')

echo "VITEST_TESTS_COUNT=${tests_count:-0}"

echo "VITEST_STATEMENTS_COUNT=${statements_count:-0}"
echo "VITEST_BRANCHES_COUNT=${branches_count:-0}"
echo "VITEST_FUNCTIONS_COUNT=${functions_count:-0}"
echo "VITEST_LINES_COUNT=${lines_count:-0}"

echo "VITEST_STATEMENTS_PERCENT=${statements_percent:-0%}"
echo "VITEST_BRANCHES_PERCENT=${branches_percent:-0%}"
echo "VITEST_FUNCTIONS_PERCENT=${functions_percent:-0%}"
echo "VITEST_LINES_PERCENT=${lines_percent:-0%}"
