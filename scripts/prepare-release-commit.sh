#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# prepare-release-commit.sh
#
# Writes the release changelog section and the version bump on the current
# branch, then commits them. Runs on develop before the release PR is merged.
#
# Usage:
#   RELEASE_VERSION=1.26.0 ./prepare-release-commit.sh
# -----------------------------------------------------------------------------

set -euo pipefail

RELEASE_VERSION="${RELEASE_VERSION:?RELEASE_VERSION is required}"
CHANGELOG_SECTION_PATH="CHANGELOG_SECTION.md"
CHANGELOG_PATH="CHANGELOG.md"
MANIFEST_PATH="package.json"

if [[ ! -s "$CHANGELOG_SECTION_PATH" ]]; then
  echo "No changelog section found at $CHANGELOG_SECTION_PATH."
  exit 1
fi

LAST_TAG="$(git tag --list 'v*' --sort=-version:refname | head -n 1)"
if [[ -n "$LAST_TAG" ]] && git cat-file -e "${LAST_TAG}:${CHANGELOG_PATH}" 2>/dev/null; then
  git show "${LAST_TAG}:${CHANGELOG_PATH}" > "$CHANGELOG_PATH"
fi

if [[ ! -s "$CHANGELOG_PATH" ]]; then
  printf '# 🐐 Goat It API Versioning Changelog\n' > "$CHANGELOG_PATH"
fi

awk 'NF { found = 1 } found' "$CHANGELOG_SECTION_PATH" > "${CHANGELOG_SECTION_PATH}.tmp"
mv "${CHANGELOG_SECTION_PATH}.tmp" "$CHANGELOG_SECTION_PATH"

{
  head -n 1 "$CHANGELOG_PATH"
  printf '\n'
  cat "$CHANGELOG_SECTION_PATH"
  printf '\n'
  tail -n +3 "$CHANGELOG_PATH"
} > "${CHANGELOG_PATH}.tmp"
mv "${CHANGELOG_PATH}.tmp" "$CHANGELOG_PATH"

pnpm pkg set "version=${RELEASE_VERSION}"

git add "$CHANGELOG_PATH" "$MANIFEST_PATH"

if git diff --cached --quiet; then
  echo "Release commit already prepared."
  exit 0
fi

git commit -m "chore(release): v${RELEASE_VERSION}"
