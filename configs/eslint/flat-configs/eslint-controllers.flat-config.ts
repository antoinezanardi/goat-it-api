import type { Linter } from "eslint";

const ESLINT_CONTROLLERS_FLAT_CONFIG = {
  name: "modules",
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
} satisfies Linter.Config;

export { ESLINT_CONTROLLERS_FLAT_CONFIG };