#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# create-release-changelog.sh
#
# Generates a release changelog using semantic-release, reformats output,
# and saves it to RELEASE.md for review or publishing.
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

npx semantic-release --dry-run --no-ci --extends ./configs/semantic-release/release.config.mjs

if [ ! -s RELEASE.md ]; then
  echo "No new release notes generated. Removing empty RELEASE.md."
  rm -f RELEASE.md
  exit 0
fi

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
