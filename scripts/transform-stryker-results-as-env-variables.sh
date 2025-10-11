#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# transform-stryker-results-as-env-variables.sh
#
# Reads Stryker output from stdin, extracts the dashboard URL and prints it as environment variable assignment for CI/CD usage.
#
# Usage:
#   cat stryker-output.txt | ./transform-stryker-results-as-env-variables.sh
# -----------------------------------------------------------------------------

set -euo pipefail

output=$(cat)

if [[ -z "$output" ]]; then
  echo "Error: No input provided. Please pipe Stryker output to this script." >&2
  exit 1
fi

report_line=$(echo "$output" | grep 'Report available at:' || true)
dashboard_url=$(echo "$report_line" | awk -F'Report available at: ' '{print $2}')

echo "STRYKER_DASHBOARD_URL=${dashboard_url:-}"
