#!/bin/sh
# Checks that every registry image in a Dockerfile keeps its tag and is pinned
# to a sha256 digest, and that every package installed by a single-line RUN
# that invokes apk add in the final stage carries a version.
#
# Usage: sh scripts/check-dockerfile-pins.sh [dockerfile_path]
# The path defaults to Dockerfile. FROM instructions that reference an earlier
# build stage, and FROM scratch, are skipped.
#
# Known limitations: a FROM whose image comes from an ARG variable, a FROM flag
# other than --platform=..., and a multi-line RUN are not understood by the
# parser.
#
# The script exits non-zero and lists every offending line when a registry image
# is not tagged or digest-pinned, or an apk package is not version-pinned, and
# prints a confirmation message otherwise.
set -eu

dockerfile_path="${1:-Dockerfile}"
known_stages=""
line_number=0
violation_count=0

while IFS= read -r line || [ -n "$line" ]; do
  line_number=$((line_number + 1))

  parsed_from=$(printf '%s\n' "$line" | awk '
    tolower($1) != "from" { next }
    {
      image = ""
      stage = ""
      for (field = 2; field <= NF; field++) {
        token = $field
        if (token ~ /^--/) { continue }
        if (tolower(token) == "as") { stage = $(field + 1); break }
        if (image == "") { image = token }
      }
      printf "%s %s\n", image, stage
    }')

  if [ -z "$parsed_from" ]; then
    continue
  fi

  image="${parsed_from%% *}"
  stage="${parsed_from#* }"

  if [ -n "$stage" ]; then
    known_stages="$known_stages $stage"
  fi

  if [ -z "$image" ] || [ "$image" = "scratch" ]; then
    continue
  fi

  case " $known_stages " in
    *" $image "*) continue ;;
  esac

  digest="${image##*@}"
  image_name="${image%%@*}"
  image_last_segment="${image_name##*/}"

  if [ "$digest" = "$image" ] || ! printf '%s' "$digest" | grep -Eq '^sha256:[0-9a-f]{64}$'; then
    echo "$dockerfile_path:$line_number: image '$image' is not pinned to a sha256 digest." >&2
    violation_count=$((violation_count + 1))
  fi

  case "$image_last_segment" in
    *:*) ;;
    *)
      echo "$dockerfile_path:$line_number: image '$image' does not keep a tag before its digest." >&2
      violation_count=$((violation_count + 1))
      ;;
  esac
done < "$dockerfile_path"

final_stage_line=$(grep -n -iE '^[[:space:]]*FROM[[:space:]]' "$dockerfile_path" | tail -n 1 | cut -d: -f1 || true)

if [ -z "$final_stage_line" ]; then
  echo "$dockerfile_path contains no FROM instruction." >&2
  exit 1
fi

apk_violation_count=$(awk -v file="$dockerfile_path" -v final_stage_line="$final_stage_line" '
  NR > final_stage_line && /^[[:space:]]*RUN[[:space:]].*apk[[:space:]]+add([[:space:]]|$)/ {
    line = $0
    sub(/^.*apk[[:space:]]+add[[:space:]]*/, "", line)
    count = split(line, tokens, /[[:space:]]+/)
    skip_next = 0
    for (i = 1; i <= count; i++) {
      token = tokens[i]
      if (skip_next) { skip_next = 0; continue }
      if (token == "--virtual") { skip_next = 1; continue }
      if (token == "\\") { continue }
      if (token == "#") { break }
      if (token ~ /^[;&|<>]+$/) { break }
      if (token ~ /^-/) { continue }
      if (token == "") { continue }
      if (token !~ /=/) {
        printf "%s:%d: apk package %s is not version-pinned.\n", file, NR, token > "/dev/stderr"
        violations++
      }
    }
  }
  END { print violations + 0 }
' "$dockerfile_path")

violation_count=$((violation_count + apk_violation_count))

if [ "$violation_count" -ne 0 ]; then
  echo "$violation_count pin violation(s) found in $dockerfile_path." >&2
  exit 1
fi

echo "Every registry image is tagged and digest-pinned, and every apk package is version-pinned in $dockerfile_path."
