#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# run-acceptance-tests.sh
#
# Runs the acceptance suite in two phases against the built application:
#   1. the standard profile, which excludes the @rate-limit-429 scenario;
#   2. the serial low-limit profile, which selects only @rate-limit-429 with a
#      2-requests-per-minute default tier.
#
# A scoped invocation runs both phases in order and passes the selector to each
# phase unchanged, so each phase adds its own tag constraint and no matching
# scenario is dropped. The only exception is the exact @rate-limit-429 tag,
# which runs the low-limit profile alone. Each phase prints a banner so a
# combined run stays readable.
#
# The script fails closed: a failing phase stops the run with a non-zero exit
# status, so the acceptance gate can never pass on a partial run.
#
# Usage:
#   ./run-acceptance-tests.sh [--skip-build] [cucumber arguments...]
# -----------------------------------------------------------------------------

set -euo pipefail
IFS=$'\n\t'

script_directory="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repository_root="$(cd "${script_directory}/.." && pwd)"
cd "$repository_root"

cucumber_config_path="configs/cucumber/cucumber.config.ts"
low_limit_profile="lowLimit"
tsx_tsconfig_path="configs/typescript/tsconfig.acceptance.json"
rate_limit_tag="@rate-limit-429"

print_phase_banner() {
  local phase_title="$1"
  local phase_details="$2"
  printf '\n%s\n%s\n%s\n%s\n\n' \
    "======================================================================" \
    " ${phase_title}" \
    " ${phase_details}" \
    "======================================================================"
}

append_user_tags_expression() {
  local tags_expression="$1"
  if [[ -z "$user_tags_expression" ]]; then
    user_tags_expression="$tags_expression"
  else
    user_tags_expression="(${user_tags_expression}) and (${tags_expression})"
  fi
}

option_takes_value() {
  case "$1" in
    -c|--config|-f|--format|--format-options|--i18n-keywords|-i|--import|-l|--loader|--language|--order|-p|--profile|--parallel|--plugin|--plugin-options|-r|--require|--require-module|--retry|--retry-tag-filter|--shard|--world-parameters)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

skip_build=false
user_tags_expression=""
passthrough_arguments=()

while (($# > 0)); do
  case "$1" in
    --skip-build)
      skip_build=true
      shift
      ;;
    --tags=*)
      append_user_tags_expression "${1#--tags=}"
      shift
      ;;
    --tags|-t)
      if (($# > 1)); then
        append_user_tags_expression "$2"
        shift 2
      else
        shift
      fi
      ;;
    --name=*)
      passthrough_arguments+=("$1")
      shift
      ;;
    --name)
      passthrough_arguments+=("$1")
      shift
      if (($# > 0)); then
        passthrough_arguments+=("$1")
        shift
      fi
      ;;
    -*)
      passthrough_arguments+=("$1")
      if option_takes_value "$1" && (($# > 1)); then
        passthrough_arguments+=("$2")
        shift 2
      else
        shift
      fi
      ;;
    *)
      passthrough_arguments+=("$1")
      shift
      ;;
  esac
done

run_standard_phase() {
  local tags_expression="not ${rate_limit_tag}"
  if [[ -n "$user_tags_expression" ]]; then
    tags_expression="(${user_tags_expression}) and not ${rate_limit_tag}"
  fi
  print_phase_banner "STANDARD ACCEPTANCE PHASE" "profile: default | tags: ${tags_expression}"
  NODE_ENV=test TSX_TSCONFIG_PATH="$tsx_tsconfig_path" pnpm exec cucumber-js --config "$cucumber_config_path" --tags "$tags_expression" "$@"
}

run_rate_limit_phase() {
  local tags_arguments=()
  if [[ -n "$user_tags_expression" ]]; then
    tags_arguments=(--tags "$user_tags_expression")
  fi
  print_phase_banner "RATE-LIMIT 429 ACCEPTANCE PHASE" "profile: ${low_limit_profile} | tags: ${user_tags_expression:-$rate_limit_tag}"
  NODE_ENV=test TSX_TSCONFIG_PATH="$tsx_tsconfig_path" \
    THROTTLER_DEFAULT_TTL_SECONDS=60 \
    THROTTLER_DEFAULT_LIMIT=2 \
    THROTTLER_SUSTAINED_TTL_SECONDS=60 \
    THROTTLER_SUSTAINED_LIMIT=100000 \
    pnpm exec cucumber-js --config "$cucumber_config_path" --profile "$low_limit_profile" ${tags_arguments[@]+"${tags_arguments[@]}"} "$@"
}

if [[ "$skip_build" == false ]]; then
  pnpm run build
fi

if [[ "$user_tags_expression" == "$rate_limit_tag" ]]; then
  run_rate_limit_phase ${passthrough_arguments[@]+"${passthrough_arguments[@]}"}
  exit 0
fi

if ! run_standard_phase ${passthrough_arguments[@]+"${passthrough_arguments[@]}"}; then
  echo "Error: the standard acceptance phase failed." >&2
  exit 1
fi

if ! run_rate_limit_phase ${passthrough_arguments[@]+"${passthrough_arguments[@]}"}; then
  echo "Error: the rate-limit acceptance phase failed." >&2
  exit 1
fi
