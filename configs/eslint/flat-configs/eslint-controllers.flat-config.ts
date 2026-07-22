import type { Linter } from "eslint";

const CONTROLLER_MAX_PARAMS = 10;

const ESLINT_CONTROLLERS_FLAT_CONFIG: Linter.Config = {
  name: "controllers",
  files: ["src/**/*.controller.ts"],
  rules: {
    "max-params": ["error", CONTROLLER_MAX_PARAMS],
    "new-cap": [
      "error",
      {
        capIsNewExceptions: [
          "Controller",
          "Get",
          "HealthCheck",
        ],
      },
    ],
  },
} as const;

export { ESLINT_CONTROLLERS_FLAT_CONFIG };