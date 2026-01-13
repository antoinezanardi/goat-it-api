import type { Linter } from "eslint";

const ESLINT_FIXTURES_FLAT_CONFIG: Linter.Config = {
  name: "fixtures",
  files: ["tests/acceptance/support/fixtures/**/*.fixture-set.ts"],
  rules: {
    "@stylistic/max-len": "off",
  },
} as const;

export { ESLINT_FIXTURES_FLAT_CONFIG };