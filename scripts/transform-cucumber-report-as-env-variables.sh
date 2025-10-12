#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# transform-cucumber-report-as-env-variables.sh
#
# Reads a Cucumber JUnit XML report, extracts the number of test cases,
# and prints it as an environment variable for CI/CD usage.
#
# Usage:
#   ./transform-cucumber-report-as-env-variables.sh [report_path]
# -----------------------------------------------------------------------------

set -euo pipefail
IFS=$'\n\t'

# Accept report path as first argument or from env, fallback to default
report_file="${1:-${CUCUMBER_REPORT_PATH:-tests/acceptance/reports/junit.xml}}"

if [[ ! -r "$report_file" ]]; then
  echo "Error: Cucumber report file '$report_file' does not exist or is not readable." >&2
  exit 1
fi

num_testcases=$(grep -c -E '<testcase([[:space:]>])' "$report_file")

echo "CUCUMBER_SCENARIOS_COUNT=${num_testcases:-0}"
