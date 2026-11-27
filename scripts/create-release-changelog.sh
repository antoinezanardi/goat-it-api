#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# create-release-changelog.sh
#
# Generates a release changelog using semantic-release, saves the raw section
# to CHANGELOG_SECTION.md and the reformatted pull-request body to RELEASE.md.
#
# The custom plugin (release-notes-with-deps-table.plugin.mjs) writes the raw
# Markdown notes directly to RELEASE.md, bypassing the terminal renderer that
# would otherwise convert Markdown tables into box-drawing characters.
#
# Usage:
#   ./create-release-changelog.sh
# -----------------------------------------------------------------------------

set -euo pipefail

if ! command -v gawk &>/dev/null; then
  echo "gawk is required but not installed. Please install gawk and try again."
  exit 1
fi

npx semantic-release --dry-run --no-ci

if [ ! -s RELEASE.md ]; then
  echo "No new release notes generated. Removing empty release files."
  rm -f RELEASE.md CHANGELOG_SECTION.md
  exit 0
fi

cp RELEASE.md CHANGELOG_SECTION.md

gawk '
  {
    sub(/^ */, "");
    if (/^\|/) { print; next }
    sub(/ \(.+?\)$/, "");
    if (/^\* [^:]+: /) {
      $0 = gensub(/^\* ([^:]+): /, "* **\\1**: ", "g")
    }
    print
  }' RELEASE.md >temp.md && mv temp.md RELEASE.md

sed -E -i 's/^## ([0-9]+\.[0-9]+\.[0-9]+).*/## Release v\1/' RELEASE.md
