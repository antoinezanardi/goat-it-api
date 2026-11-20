import type { Linter } from "eslint";

const ESLINT_SENTRY_OBSERVABILITY_FLAT_CONFIG: Linter.Config = {
  name: "sentry-observability",
  files: ["src/infrastructure/api/observability/sentry/**/*.ts"],
  rules: {
    camelcase: [
      "error",
      {
        allow: [
          "context_line",
          "event_id",
          "in_app",
          "ip_address",
          "post_context",
          "pre_context",
          "server_name",
        ],
      },
    ],
  },
};

export { ESLINT_SENTRY_OBSERVABILITY_FLAT_CONFIG };