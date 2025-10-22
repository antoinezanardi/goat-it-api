import type { Linter } from "eslint";

const ESLINT_CONTROLLERS_FLAT_CONFIG: Linter.Config = {
  name: "controllers",
  files: ["src/**/*.controller.ts"],
  rules: {
    "new-cap": [
      "error", {
        capIsNewExceptions: [
          "Controller",
          "Get",
        ],
      },
    ],
  },
} as const;

export { ESLINT_CONTROLLERS_FLAT_CONFIG };