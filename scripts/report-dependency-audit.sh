#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# report-dependency-audit.sh
#
# Appends a non-blocking Markdown report of the full dependency tree advisory
# counts to the GitHub Actions job summary. Advisories make `pnpm audit` exit
# non-zero, so the audit status is ignored and the report content is decided by
# the JSON payload instead.
#
# When GITHUB_STEP_SUMMARY is unset or empty, the same Markdown is printed to
# standard output so the script stays runnable locally.
#
# Usage:
#   ./report-dependency-audit.sh
#
# Environment variables:
#   GITHUB_STEP_SUMMARY: Job summary file written by the GitHub Actions runner.
#                        When empty, the report goes to standard output.
# -----------------------------------------------------------------------------

set -euo pipefail
IFS=$'\n\t'

audit_file=$(mktemp)
trap 'rm -f "$audit_file"' EXIT

print_report() {
  local audit_file_path="$1"
  echo "### Full dependency tree audit"
  echo ""
  if jq -e '.metadata.vulnerabilities' "$audit_file_path" >/dev/null 2>&1; then
    echo "| Severity | Count |"
    echo "|---|---|"
    jq -r '.metadata.vulnerabilities | to_entries[] | "| \(.key) | \(.value) |"' "$audit_file_path"
  else
    echo "The full-tree audit report could not be generated."
  fi
}

pnpm audit --json > "$audit_file" || true

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  print_report "$audit_file" >> "$GITHUB_STEP_SUMMARY"
else
  print_report "$audit_file"
fi
