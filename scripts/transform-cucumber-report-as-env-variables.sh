#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# transform-cucumber-report-as-env-variables.sh
#
# Reads one or two Cucumber JUnit XML reports (the standard phase and the
# serial rate-limit phase), sums their test cases, and prints the count as an
# environment variable for CI/CD usage.
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
readable_report_files=0

for report_file in "${report_files[@]}"; do
  if [[ ! -r "$report_file" ]]; then
    continue
  fi
  readable_report_files=$((readable_report_files + 1))
  if ! report_testcases=$(grep -o -E '<testcase([[:space:]>])' "$report_file" | wc -l | tr -d '[:space:]'); then
    report_testcases=0
  fi
  num_testcases=$((num_testcases + report_testcases))
done

if ((readable_report_files == 0)); then
  echo "Error: none of the Cucumber report files '${report_files[*]}' exist or are readable." >&2
  exit 1
fi

echo "CUCUMBER_SCENARIOS_COUNT=${num_testcases}"
