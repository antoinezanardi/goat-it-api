#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# check-release-changelog.sh
#
# Verifies that the current branch carries the package version, the expected
# CHANGELOG.md heading and the generated changelog content for RELEASE_VERSION.
#
# Usage:
#   RELEASE_VERSION=1.26.0 ./check-release-changelog.sh [--quiet]
#
# --quiet prints plain error lines instead of GitHub ::error:: annotations, for
# the expected "prepare needed" predicate.
# -----------------------------------------------------------------------------

set -euo pipefail

RELEASE_VERSION="${RELEASE_VERSION:?RELEASE_VERSION is required}"
CHANGELOG_PATH="CHANGELOG.md"
CHANGELOG_SECTION_PATH="CHANGELOG_SECTION.md"
MANIFEST_PATH="package.json"
ANNOTATE=true

if [[ "${1:-}" == "--quiet" ]]; then
  ANNOTATE=false
fi

fail() {
  if [[ "$ANNOTATE" == "true" ]]; then
    echo "::error::$1"
  else
    echo "$1"
  fi
  exit 1
}

normalize_section() {
  awk '
    { lines[NR] = $0 }
    END {
      first = 1
      while (first <= NR && lines[first] ~ /^[[:space:]]*$/) first++
      last = NR
      while (last >= first && lines[last] ~ /^[[:space:]]*$/) last--
      for (i = first; i <= last; i++) print lines[i]
    }
  '
}

MANIFEST_VERSION=$(jq -r .version "$MANIFEST_PATH")
if [[ "$MANIFEST_VERSION" != "$RELEASE_VERSION" ]]; then
  fail "package.json is $MANIFEST_VERSION but the release version is $RELEASE_VERSION. Run the Prepare release workflow and merge the chore(release): v$RELEASE_VERSION pull request first."
fi

if [[ ! -f "$CHANGELOG_SECTION_PATH" ]]; then
  fail "the generated changelog section is missing. Run the Prepare release workflow again."
fi

CHANGELOG_HEADING=$(grep -m 1 '^## ' "$CHANGELOG_PATH")
SECTION_HEADING=$(grep -m 1 '^## ' "$CHANGELOG_SECTION_PATH")

if [[ "$CHANGELOG_HEADING" != "## [${RELEASE_VERSION}]"* ]]; then
  fail "the top CHANGELOG.md heading is '$CHANGELOG_HEADING', not the release version $RELEASE_VERSION. Run the Prepare release workflow again."
fi

if [[ "$SECTION_HEADING" != "## [${RELEASE_VERSION}]"* ]]; then
  fail "the generated changelog section heading is '$SECTION_HEADING', not the release version $RELEASE_VERSION. Run the Prepare release workflow again."
fi

TOP_CONTENT=$(mktemp)
GENERATED_CONTENT=$(mktemp)
trap 'rm -f "$TOP_CONTENT" "$GENERATED_CONTENT"' EXIT

awk '/^## /{if (count++) exit} count' "$CHANGELOG_PATH" | tail -n +2 | normalize_section > "$TOP_CONTENT"
tail -n +2 "$CHANGELOG_SECTION_PATH" | normalize_section > "$GENERATED_CONTENT"

if [[ ! -s "$TOP_CONTENT" ]]; then
  fail "the CHANGELOG.md section for $RELEASE_VERSION is empty. Run the Prepare release workflow again."
fi

if ! diff -u "$GENERATED_CONTENT" "$TOP_CONTENT"; then
  fail "the CHANGELOG.md section for $RELEASE_VERSION does not match the generated release notes. Run the Prepare release workflow again and merge the updated release commit."
fi
