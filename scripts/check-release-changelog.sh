#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# check-release-changelog.sh
#
# Verifies that the current branch carries the package version and the
# generated changelog section for RELEASE_VERSION.
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

TOP_SECTION=$(mktemp)
GENERATED_SECTION=$(mktemp)
trap 'rm -f "$TOP_SECTION" "$GENERATED_SECTION"' EXIT

awk '/^## /{if (count++) exit} count' "$CHANGELOG_PATH" | normalize_section > "$TOP_SECTION"
normalize_section < "$CHANGELOG_SECTION_PATH" > "$GENERATED_SECTION"

if [[ ! -s "$TOP_SECTION" ]]; then
  fail "the CHANGELOG.md section for $RELEASE_VERSION is empty. Run the Prepare release workflow again."
fi

if ! diff -u "$GENERATED_SECTION" "$TOP_SECTION"; then
  fail "the top CHANGELOG.md section does not match the generated release notes for $RELEASE_VERSION. Run the Prepare release workflow again and merge the updated release commit."
fi
