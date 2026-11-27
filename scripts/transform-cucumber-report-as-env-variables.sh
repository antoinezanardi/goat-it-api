#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# transform-cucumber-report-as-env-variables.sh
#
# Reads the selected Cucumber JUnit XML reports (both phases by default, or the
# one path passed as an argument or in CUCUMBER_REPORT_PATH), sums their test
# cases, and prints the count as an environment variable for CI/CD usage.
#
# Every selected report must exist and be readable: a successful report step
# never exports an incomplete scenario count.
#
# Usage:
#   ./transform-cucumber-report-as-env-variables.sh [report_path]
# -----------------------------------------------------------------------------

set -euo pipefail
IFS=$'\n\t'

# Explicit report path (argument or env) counts one file; otherwise both phases are aggregated.
default_report_files=(
  "tests/acceptance/reports/junit.xml"
  "tests/acceptance/reports/rate-limit/junit.xml"
)

if [[ $# -gt 0 || -n "${CUCUMBER_REPORT_PATH:-}" ]]; then
  report_files=("${1:-${CUCUMBER_REPORT_PATH}}")
else
  report_files=("${default_report_files[@]}")
fi

num_testcases=0

for report_file in "${report_files[@]}"; do
  if [[ ! -r "$report_file" ]]; then
    echo "Error: the Cucumber report file '${report_file}' does not exist or is not readable." >&2
    exit 1
  fi
  if ! report_testcases=$(grep -o -E '<testcase([[:space:]>])' "$report_file" | wc -l | tr -d '[:space:]'); then
    report_testcases=0
  fi
  num_testcases=$((num_testcases + report_testcases))
done

echo "CUCUMBER_SCENARIOS_COUNT=${num_testcases}"
