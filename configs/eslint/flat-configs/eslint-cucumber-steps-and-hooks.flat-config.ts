import type { Linter } from "eslint";

const ESLINT_CUCUMBER_STEPS_AND_HOOKS_FLAT_CONFIG: Linter.Config = {
  name: "cucumber-steps-and-hooks",
  files: [
    "tests/acceptance/features/**/*.ts",
    "tests/acceptance/support/hooks.ts",
  ],
  rules: {
    "new-cap": [
      "error",
      {
        capIsNewExceptions: [
          "Before",
          "After",
        ],
      },
    ],
    "func-style": ["error", "declaration", { allowArrowFunctions: false }],
    "prefer-arrow-callback": "off",
    "func-names": ["error", "never"],
  },
} as const;

export { ESLINT_CUCUMBER_STEPS_AND_HOOKS_FLAT_CONFIG };